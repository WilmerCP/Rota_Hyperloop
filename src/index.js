const { app, BrowserWindow, Menu } = require("electron");

const url = require("url");
const path = require("path");

let iconPath;

  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, '../assets', 'favicon.ico');
  } else if (process.platform === 'linux') {
    iconPath = path.join(__dirname, '../assets', 'favicon-32x32.png');
  }


try {
    require('electron-reloader')(module)
  } catch (_) {}

let mainWindow;
const indexUrl = url.format({

    protocol: 'file',
    pathname: path.join(__dirname,'../views/mainWindow.html'),
    slashes:true

})

app.on("ready",()=>{

    mainWindow = new BrowserWindow({ 
        
        title: "Rota Hyperloop",
        icon: iconPath
    });
    
    mainWindow.loadURL(indexUrl);

    const mainMenu = Menu.buildFromTemplate([]);

    Menu.setApplicationMenu(mainMenu);

});