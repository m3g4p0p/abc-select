import Modal from './modal'

const modal = new Modal()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request) {
    case 'init':
      modal.mount()
      break

    case 'toggle':
      modal.toggle()
      break

    default:
      // Do nothing
  }

  sendResponse('ok')
})