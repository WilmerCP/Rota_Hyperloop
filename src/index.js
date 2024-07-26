const { app, BrowserWindow, Menu } = require("electron");

const url = require("url");
const path = require("path");


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

    mainWindow = new BrowserWindow({ title: "Rota Hyperloop"});
    
    mainWindow.loadURL(indexUrl);

    const mainMenu = Menu.buildFromTemplate([]);

    Menu.setApplicationMenu(mainMenu);

});