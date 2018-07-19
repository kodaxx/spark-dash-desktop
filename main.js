// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
var path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 360,
    height: 680,
    resizable: false,
    maximizable: false,
    webPreferences: {
      devTools: false
    },
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
