export class Dispatcher {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }
  dispatch(type, properties) {
    let event = new Event(type)
    for (const name in properties) {
      event[name] = properties[name]
    }
    this.dispatcher.dispatchEvent(event)
  }
}



export class Listener {
  constructor(el, recognizer) {
    let isListeningMouse = false
    let contexts = new Map()

    el.addEventListener('mousedown', e => {
      let context = Object.create(null)
      contexts.set(`mouse${1 << e.button}`, context)

      recognizer.start(e, context)
      let mousemove = e => {
        let button = 1
        while (button <= e.buttons) {
          if (button & e.buttons) {
            // order of buttons & button property is not same
            let key
            if (button === 2)
              key = 4
            else if (button === 4)
              key = 2
            else
              key = button
            let context = contexts.get(`mouse${key}`)
            recognizer.move(e, context)
          }
          button = button << 1
        }
      }

      let mouseup = e => {
        let context = contexts.get(`mouse${1 << e.button}`)
        recognizer.end(e, context)
        contexts.delete(`mouse${1 << e.button}`)
        if (e.buttons === 0) {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          isListeningMouse = false
        }
      }
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
        isListeningMouse = true
      }
    })

    el.addEventListener('touchstart', e => {
      for (const touch of e.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context)
      }
    })
    el.addEventListener('touchmove', e => {
      for (const touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.recognizer.move(touch, context)
      }
    })
    el.addEventListener('touchend', e => {
      for (const touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.end(touch, context)
        contexts.delete(touch.identifier)
      }
    })
    el.addEventListener('touchcancel', e => {
      for (const touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        recognizer.cancel(touch, context)
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }
  start(point, context) {
    context.startX = point.clientX
    context.startY = point.clientY
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    }]

    context.isPan = false
    context.isTap = true
    context.isPress = false

    context.handler = setTimeout(() => {
      context.isPan = false
      context.isTap = false
      context.isPress = true
      context.handler = null
      console.log('press')
      this.dispatcher.dispatch('press', {})
    }, 500)
  }
  move(point, context) {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true
      context.isTap = false
      context.isPress = false
      console.log('panstart')
      context.isVertical = Math.abs(dx) < Math.abs(dy)
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
      clearTimeout(context.handler)
    }

    if (context.isPan) {
      console.log(dx, dy)
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
    }

    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
  }
  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {})
      clearTimeout(context.handler)
    }

    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {})
      console.log('press end')
    }

    context.points = context.points.filter(point => (Date.now() - point.t) < 500)

    let d, v
    if (!context.points.length) {
      v = 0
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
      v = d / (Date.now() - context.points[0].t)
    }

    if (v > 1.5) {
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      })
      context.isFlick = true
    } else {
      context.isFlick = false
    }

    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
      })
      console.log('pan end')
    }
  }
  cancel(point, context) {
    clearTimeout(context.handler)
    this.dispatcher.dispatch('cancel', {})
  }
}

export function enableGesture(el) {
  new Listener(el, new Recognizer(new Dispatcher(el)))
}