function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (let prop in element.computedStyle) {
    const p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style
}

function layout(element) {
  if (!element.computedStyle) {
    return
  }

  const elementStyle = getStyle(element);
  // 只处理flex布局
  if (elementStyle.display !== "flex") {
    return
  }

  const items = element.children.filter(e => e.type === "element");

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  })

  let style = elementStyle;

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  })

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }

  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'strech';
  }

  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }

  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }

  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'center'
  }

  let mainSize, // 主轴size width / height
    mainStart, // 主轴起点 left / right / top / bottom
    mainEnd, // 主轴终点 left / right / top / bottom
    mainSign, // 主轴reverse +1 / -1
    mainBase, // 主轴开始位置 0 / style.width
    crossSize, // 交叉轴size
    crossStart, // 交叉轴起点
    crossEnd, // 交叉轴终点
    crossSign, // 交叉轴reverse
    crossBase; // 交叉轴开始位置

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {
    let temp = crossStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = +1;
  }

  // 分行
  // 根据主轴尺寸，把元素分进行
  // 若设置了no-wrap,则强行分配进第一行

  let isAutoMainSize = false;
  // 父元素若没有设置mainsize，则由子元素宽度撑开
  if (!style[mainSize]) { // auto sizing
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  const flexLine = [];
  const flexLines = [flexLine]; // 默认一行
  // 剩余空间
  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    // 单个元素miansize
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    // 有flex属性 可伸缩
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 取最大交叉轴尺寸
      }
      flexLine.push(item);
    } else {
      // 当前flex子元素，大于父元素 mainSize，自适应
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      // 当前flex子元素，大于flex容器剩余空间mainSpace，另起新行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;

        // 创建新行
        flexLine = [item];
        flexLines.push(flexLine);

        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        // 未超过父元素剩余mainSpace，进行
        flexLine.push(item);
      }

      // 交叉轴取 flex 子元素最大 crossSize
      if (itemStyle[crossSize] != null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }

      // flex 剩余 mainSpace
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  if (mainSpace < 0) {
    // mainSpace小于0, 该行flex子元素等比例缩放
    const scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);

      // 带flex属性元素不进行等比例缩放
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      // flex 容器这一行，flex子元素根据前一子元素的位置依次排版
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else { // 可以容纳
    flexLines.forEach(function (items) {
      const mainSpace = items.mainSpace;
      let flexTotal = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);
        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex;
          continue
        }
      }

      if (flexTotal > 0) { // 填充 flexLine 剩余 mianSpace 空间
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const itemStyle = getStyle(item)

          // 有flex属性则等比划分 mainSize
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }

      } else {
        let currentMain, gap;
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          gap = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          gap = 0
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          gap = 0
        }
        if (style.justifyContent === 'space-between') {
          gap = mainSpace / (items.length - 1) * mainSign
          currentMain = mainBase
        }
        if (style.justifyContent === 'space-around') {
          gap = mainSpace / items.length * mainSign
          currentMain = gap / 2 + mainBase
        }
        if (style.justifyContent === 'space-evenly') {
          gap = mainSpace / (items.length + 1) * mainSign
          currentMain = gap + mainBase
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + gap
        }
      }
    })
  }
  console.log(items);
  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length; // 行高
  let gap;

  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    gap = 0
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    gap = 0
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    gap = 0
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0
    gap = crossSpace / (flexLines.length - 1)
  }
  if (style.alignContent === 'space-around') {
    gap = crossSpace / (flexLines.length)
    crossBase += crossSign * step / 2
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0
    gap = 0
  }

  flexLines.forEach(function (items) {
    let lineCrossSize = style.alignContent === 'stretch' ? // 拉伸flex子项，填满交叉轴
      items.crossSpace + crossSpace / flexLines.length : items.crossSpace

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStyle = getStyle(item);
      // align-self 指控制单独某一个flex子元素位置
      const align = itemStyle.alignSelf || style.alignItems;
      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
      }

      if (align === 'flex-start') {
        itemStyle[crossSize] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }

      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
          itemStyle[crossSize] : lineCrossSize)

        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }

    }
    crossBase += crossSign * (lineCrossSize + gap);
  })
}

module.exports = layout;