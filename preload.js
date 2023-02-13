// /**
//  * The preload script runs before. It has access to web APIs
//  * as well as Electron's renderer process modules and some
//  * polyfilled Node.js functions.
//  * 
//  * https://www.electronjs.org/docs/latest/tutorial/sandbox
//  */

// const { ipcRenderer } = require('electron')

// ipcRenderer.on('SET_SOURCE', async (event, source) => {
//   try {
//     handleScreenShot(source)
//   } catch (e) {
//     handleError(e)
//   }
// })

// function handleScreenShot(source) {
//   const screenshot = document.getElementById('screenshot-image')
//   screenshot.src = source.thumbnail.toDataURL() // The image to display the screenshot
// }
// function handleError (e) {
//   console.log(e)
// }

// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//       const element = document.getElementById(selector)
//       if (element) element.innerText = text
//     }
  
//     for (const type of ['chrome', 'node', 'electron']) {
//       replaceText(`${type}-version`, process.versions[type])
//     }
// })