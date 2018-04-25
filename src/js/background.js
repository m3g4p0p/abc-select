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