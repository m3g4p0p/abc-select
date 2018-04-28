import abcjs from 'abcjs'
import { fromHTML } from './util'
import '../scss/modal.scss'

const CLASS = {
  BASE: 'abc-select-modal',
  ELEMENT: {
    OVERLAY: '__overlay',
    CONTENT: '__content',
    NOTES: '__notes',
    CONTROLS: '__controls'
  },
  MODIFIER: {
    ACTIVE: '--active',
    VISIBLE: '--visible'
  }
}

export default class Modal {
  constructor () {
    const refs = fromHTML(`
      <div data-ref="overlay" class="${CLASS.BASE + CLASS.ELEMENT.OVERLAY}">
        <div class="${CLASS.BASE + CLASS.ELEMENT.CONTENT}">
          <div class="${CLASS.BASE + CLASS.ELEMENT.CONTROLS}">
            <button data-ref="transposeDown">-</button>
            <button data-ref="transposeUp">+</button>
            <button data-ref="close">x</button>
          </div>
          <div data-ref="notes" class="${CLASS.ELEMENT.NOTES}"></div>
        </div>
      </div>
    `)

    Object.assign(this, refs)

    this.isActive = false
    this.visualTranspose = 0
    this.selection = ''
  }

  mount () {
    document.body.appendChild(this.overlay)
    window.addEventListener('click', this)
    window.addEventListener('keydown', this)
  }

  unmount () {
    document.body.removeChild(this.overlay)
    window.removeEventListener('click', this)
    window.removeEventListener('keydown', this)
  }

  handleClick ({ target }) {
    if (!this.isActive) {
      return
    }

    switch (target) {
      case this.overlay:
        this.toggleActive()
        break

      case this.transposeDown:
        this.transpose(-1)
        break

      case this.transposeUp:
        this.transpose(1)
        break

      case this.close:
        this.toggleActive()
        break

      default:
        // Do nothing
    }
  }

  handleKeydown (event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        this.transpose(1)
        break

      case 'ArrowDown':
        event.preventDefault()
        this.transpose(-1)
        break

      case 'Escape':
        this.toggleActive()
        break

      default:
        // Do nothing
    }
  }

  handleEvent (event) {
    switch (event.type) {
      case 'click':
        this.handleClick(event)
        break

      case 'keydown':
        this.handleKeydown(event)
        break

      default:
        // Do nothing
    }
  }

  toggleActive () {
    const isActive = !this.isActive
    const { overlay } = this

    const toggleActive = () => overlay.classList.toggle(
      CLASS.BASE
      + CLASS.ELEMENT.OVERLAY
      + CLASS.MODIFIER.ACTIVE,
      isActive
    )

    const toggleVisible = () => overlay.classList.toggle(
      CLASS.BASE
      + CLASS.ELEMENT.OVERLAY
      + CLASS.MODIFIER.VISIBLE,
      isActive
    )

    if (isActive) {
      toggleActive()
      window.setTimeout(toggleVisible)
    } else {
      toggleVisible()

      overlay.addEventListener(
        'transitionend',
        toggleActive,
        { once: true }
      )
    }

    this.isActive = isActive
  }

  transpose (value) {
    this.visualTranspose += value
    this.render()
  }

  render () {
    const {
      notes,
      selection,
      visualTranspose
    } = this

    abcjs.renderAbc(
      notes,
      selection,
      { visualTranspose }
    )
  }

  toggle () {
    this.toggleActive()

    if (this.isActive) {
      this.selection = window.getSelection().toString()
      this.visualTranspose = 0
      this.render()
    }
  }
}