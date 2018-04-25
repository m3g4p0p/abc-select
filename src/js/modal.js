import abcjs from 'abcjs'
import '../scss/modal.scss'

const CLASS = {
  BASE: 'abc-select-modal',
  ELEMENT: {
    OVERLAY: '__overlay',
    CONTENT: '__content'
  },
  MODIFIER: {
    ACTIVE: '--active',
    VISIBLE: '--visible'
  }
}

export default class Modal {
  constructor () {
    const overlay = document.createElement('div')
    const content = document.createElement('div')
    const notes = document.createElement('div')

    overlay.classList.add(CLASS.BASE + CLASS.ELEMENT.OVERLAY)
    content.classList.add(CLASS.BASE + CLASS.ELEMENT.CONTENT)
    overlay.appendChild(content)
    content.appendChild(notes)

    this.overlay = overlay
    this.notes = notes
    this.isActive = false
    this.visualTranspose = 0
    this.selection = ''

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleKeyDown (event) {
    event.preventDefault()

    switch (event.key) {
      case 'ArrowUp':
        this.render(this.visualTranspose + 1)
        break

      case 'ArrowDown':
        this.render(this.visualTranspose - 1)
        break

      case 'Escape':
        this.toggleActive()
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
      window.addEventListener('keydown', this.handleKeyDown)
    } else {
      toggleVisible()

      overlay.addEventListener(
        'transitionend',
        toggleActive,
        { once: true }
      )

      window.removeEventListener('keydown', this.handleKeyDown)
    }

    this.isActive = isActive
  }

  init () {
    document.body.appendChild(this.overlay)

    this.overlay.addEventListener('click', ({
      target,
      currentTarget
    }) => {
      if (target === currentTarget) {
        this.toggleActive()
      }
    })
  }

  render (visualTranspose = 0) {
    abcjs.renderAbc(
      this.notes,
      this.selection,
      { visualTranspose }
    )

    this.visualTranspose = visualTranspose
  }

  toggle () {
    this.toggleActive()

    if (this.isActive) {
      this.selection = window.getSelection().toString()
      this.render()
    }
  }
}