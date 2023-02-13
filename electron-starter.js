// Modules to control application life and create native browser window
const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const notifier = require("node-notifier");
// const { toPNG } = require("electron-util");
const fs = require('fs');

// const Notification = require('electron-native-notification');
// const ioHook = require('iohook');
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let win = BrowserWindow.getFocusedWindow();

  let count = 0;
  win.webContents.on("keydown", () => {
    count++;
    console.log(count, "inside");
  });
  console.log(count);
  // load react build
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "./build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  // and load the react app.
  // mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  let interval = null;
  ipcMain.on("TIMER", async (event, data) => {
    if (data === "Start") {
      console.log("Is Start", data);
      interval = setInterval(function () {
        let imagePath;
        desktopCapturer
          .getSources({ types: ["screen"] })
          .then(async (sources) => {
            for (const source of sources) {
              if (source.name === "Entire screen") {
                mainWindow.webContents.send("TIMER_SOURCE", source);
                // imagePath = Buffer.from(source.thumbnail.toPNG());
                imagePath =source.thumbnail.toDataURL();
                const pngImagePath = 'image.png';

                const base64Data = imagePath.split(',')[1];
                const binaryData = Buffer.from(base64Data, 'base64');
                
                // Write the binary data to a PNG file
                fs.writeFileSync(pngImagePath, binaryData);

                // imagePath = `${Math.random().toString(36).substring(2, 15)}.png`;
                // fs.writeFileSync(imagePath, imagePath);
                notifier.notify(
                  {
                    title: "Log Your Work",
                    message: "Screenshot Captured !!",
                    icon: pngImagePath,
                    sound: true,
                    wait: false,
                  },
                  function (err, response) {
                    console.log(response);
                  }
                );

                // console.log(
                //   imagePath,
                //   "=====================imagePath==================================="
                // );
                // console.log(
                //   binaryData,
                //   "=====================binaryData==================================="
                // );
                return;
              }
            }
          });
      }, 10000);
    } else {
      console.log("Is stop", data);
      clearInterval(interval);
    }
  });
}

// ipcMain.on('show-notification', (event, message) => {
//   const notification = new Notification({
//     title: 'My App',
//     body: message,
//   });
//   notification.show();
// });
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
