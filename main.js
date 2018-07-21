// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const Menu = require('electron').Menu
const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode.
const {appUpdater} = require('./autoupdater');
var path = require('path')

// Function to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}

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

function createMenu() {
  //Create application menu
  const application = {
    label: "Spark Payments",
    submenu: [
      {
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: "Edit",
    submenu: [
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.on('ready', () => {
  createWindow()
  createMenu()
  const page = mainWindow.webContents;

    page.once('did-frame-finish-load', () => {
      const checkOS = isWindowsOrmacOS();
      if (checkOS && !isDev) {
        // Initate auto-updates on macOs and windows
        appUpdater();
      }});
})

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
