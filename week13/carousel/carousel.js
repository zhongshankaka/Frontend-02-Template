import {
  Component
} from './framework'

export class Carousel extends Component {
  constructor () {
    super()
    this.attributes = Object.create(null)
  }

  setAttribute (name, value) {
    this.attributes[name] = value
  }

  render () {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (const record of this.attributes.src) {
      const child = document.createElement('div')
      child.style.backgroundImage = `url(${record})`
      this.root.appendChild(child)
    }

    // 自动滚动
    /* let currentIndex = 0;
    setInterval(() => {
    	let children = this.root.children;
    	let nextIndex = (currentIndex + 1) % children.length;
    	let current = children[currentIndex];
    	let next = children[nextIndex];
    	next.style.transition = "none";
    	next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
    	setTimeout(() => {
    		next.style.transition = "";
    		current.style.transform = `translateX(${ -100 - nextIndex * 100 }%)`
    		next.style.transform = `translateX(${ - nextIndex * 100}%)`;
    		currentIndex = nextIndex
    	}, 16)
    }, 3000) */

    // 鼠标事件
    let position = 0
    this.root.addEventListener('mousedown', event => {
      const children = this.root.children
      const startX = event.clientX

      const move = e => {
        const x = e.clientX - startX

        const current = position - ((x - x % 500) / 500)

        for (const offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + children.length) % children.length

          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
        }
      }

      const up = e => {
        const x = e.clientX - startX
        position = position - Math.round(x / 500)

        for (const offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset
          pos = (pos + children.length) % children.length

          children[pos].style.transition = ''
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
        }

        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    return this.root
  }

  mountTo (parent) {
    parent.appendChild(this.render())
  }
}