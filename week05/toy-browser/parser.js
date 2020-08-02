const css = require('css')
const layout = require('./layout.js')
let currentToken = null;
let currentAttribute = null;

let stack = [{
  type: "document",
  children: []
}];
let currentTextNode = null;

// CSS 规则
let rules = []
function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if(!selector || !element.attributes)
    return false;
  // 这里只简单地匹配 class, id, tag 选择器
  if (selector.charAt(0) === '#') {
    var attr = element.attributes.filter(item => item.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', ''))
      return true;
  } else if (selector.charAt(0) === '.') {
    var attr = element.attributes.filter(item => item.name === 'class')[0];
    if (attr && attr.value === selector.replace('.', ''))
      return true
  } else {
    if (element.tagName === selector)
      return true;
  }
  return false;
}

// 优先级匹配
// 优先级高的先比较，匹配较高优先级的规则
// 如下当有id = #id 的元素同时被下面两条规则匹配，则优先匹配到第二条，因为class优先级比tag高
// 1.div div #id
// [0,    1, 0,    2]
// 2.div .cls #id
// [0,    1, 1,    1]
// inline id class tag
function specificity(selector) {
  var p = [0, 0, 0, 0];
  var selectorParts = selector.split(" ");
  for (var part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function computeCSS(element) {
  console.log(rules);
  console.log("element CSS for Element", element);
  // 由内向外匹配，将stack中的内层元素排在数组前面
  let elements = stack.slice().reverse();
  console.log({elements})
  if (!element.computedStyle)
    element.computedStyle = {}
  
  for (let rule of rules) {
    // css 也由内向外匹配，如 div #id 规则，首先匹配内层选择器 #id
    var selectorParts = rule.selectors[0].split(" ").reverse();
    // 如果当前元素匹配不到当前css规则最内层选择器，则跳过下面继续与父级匹配的步骤
    if (!match(element, selectorParts[0]))
      continue;
    
    // 检查父级元素是否匹配当前css规则
    let matched = false;
    var j = 1;
    for(var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    // 若匹配，则为当前元素添加css规则
    if (matched) {
      console.log('Element', element, 'matched rule', rule)
      var sp = specificity(rule.selectors[0]);
      var computedStyle = element.computedStyle
      for(var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        // 新进入的规则更大，则覆盖当前规则
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      console.log(element.computedStyle)
    }
  }
}

function emit(token) {
  //console.log(token);
  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
      let element = {
          type: 'element',
          tagName: token.tagName,
          children: [],
          attributes: [],
      };

      for (let p in token) {
          if (p != 'type' && p != 'tagName') {
              element.attributes.push({
                  name: p,
                  value: token[p],
              });
          }
      }
      computeCSS(element);
      top.children.push(element);
      element.parent = top;

      if (!token.isSelfClosing) {
          stack.push(element);
      }
      currentTextNode = null;
  } else if (token.type === 'endTag') {
    if ((top.tagName !== token.tagName)) {
      throw new Error("Tag start end doesn't match");
    } else {
      if(top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
      currentTextNode = null;
  } else if (token.type === 'text') {
      if (currentTextNode === null) {
          currentTextNode = {
              type: 'text',
              content: '',
          };
          top.children.push(currentTextNode);
      }
      currentTextNode.content += token.content;
  }
}

const EOF = Symbol("EOF")

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    })
    return data;
  }
}

function tagOpen(c) {
  // tagOpen 状态下遇到 '/' 为结束标签
  if (c === "/") {
    return endTagOpen;
  // 遇到英文字符为标签名
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    }
    return tagName(c);
  } else {
    return
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    }
    return tagName(c)
    // endTagOpen 状态下遇到非英文字符报错
  } else if (c === ">") {

  } else {

  }
}

function tagName(c) {
  // 属性名
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  // 自封闭标签
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {

  } else {
    currentAttribute = {
      name: "",
      value: "",
    }
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === '"' || c === "'" || c === "<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === "\"") {
    return doubleQuotedAttributeValue;
  } else if (c === "\'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {

  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {

  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    }
    return attributeName(c);
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data
  } else if (c === EOF) {} else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === "EOF") {

  } else {

  }
}

module.exports.parseHTML = function (html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}