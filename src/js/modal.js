import abcjs from 'abcjs'
import fromHTML from 'from-html'

import {
  getTitle,
  printNode,
  trimBlankLines
} from './util'

import '../scss/modal.scss'

export const CLASS = {
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
    Object.assign(this, fromHTML(`
      <div ref="overlay" class="${CLASS.BASE + CLASS.ELEMENT.OVERLAY}">
        <div class="${CLASS.BASE + CLASS.ELEMENT.CONTENT}">
          <div class="${CLASS.BASE + CLASS.ELEMENT.CONTROLS}">
            <span>transpose:</span>
            <button ref="transposeUp" title="transpose up">up</button>
            <button ref="transposeDown" title="transpose down">down</button>
            <span>|</span>
            <button ref="print" title="print notes">print</button>
            <a ref="save" title="save selection">save</a>
            <button ref="close" title="close">&#128473;</button>
          </div>
          <div ref="notes" class="${CLASS.BASE + CLASS.ELEMENT.NOTES}"></div>
        </div>
      </div>
    `))

    this.isActive = false
    this.visualTranspose = 0
    this.selection = ''
  }

  get title () {
    return getTitle(this.selection) || window.document.title
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

      case this.print:
        printNode(this.notes, this.title)
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

    return this
  }

  transpose (value) {
    this.visualTranspose += value
    return this.render()
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

    return this
  }

  updateDownloadURL () {
    const blob = new Blob([this.selection], {
      type: 'text/plain;charset=utf-8'
    })

    window.URL.revokeObjectURL(this.save.href)
    this.save.href = window.URL.createObjectURL(blob)
    this.save.download = this.title

    return this
  }

  setSelection () {
    const selection = window.getSelection().toString()

    this.selection = trimBlankLines(selection) || this.selection
    this.visualTranspose = 0

    if (this.selection) {
      this.render().updateDownloadURL()
    }

    return this
  }

  toggle () {
    this.toggleActive()

    if (this.isActive) {
      this.setSelection()
    }

    return this
  }
}