// The content script does not need to be present on every
// page, so only inject it when it is actually getting sent
// a message to toggle the modal
chrome.browserAction.onClicked.addListener(({ id }) => {
  chrome.tabs.sendMessage(id, 'toggle', response => {
    if (!response) {
      chrome.tabs.executeScript(id, {
        file: 'content.js'
      }, () => {
        chrome.tabs.sendMessage(id, 'init', () => {
          chrome.tabs.sendMessage(id, 'toggle')
        })
      })
    }
  })
})