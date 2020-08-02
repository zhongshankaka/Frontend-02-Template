const images = require('images')

function render(viewport, element) {
    let style;
    if ((style = element.style)) {
        let img = images(style.width, style.height);

        if (style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0,0,0)';
            const reg = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(reg[1]), Number(reg[2]), Number(reg[3]));
            viewport.draw(img, style.left || 0, style.top || 0);
        }
    }

    if (element.children) {
        for (let child of element.children) {
            render(viewport, child);
        }
    }
}

module.exports = render;