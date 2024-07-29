const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { Worker } = require('worker_threads');

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
        icon: iconPath,
        webPreferences:{

          contextIsolation: true,
          nodeIntegration: false,
          preload: path.join(__dirname,'preload.js')

        }
    });
    
    mainWindow.loadURL(indexUrl);

    const mainMenu = Menu.buildFromTemplate([]);

    Menu.setApplicationMenu(mainMenu);

    //mainWindow.webContents.openDevTools();

    let udp_thread = new Worker(path.join(__dirname,'/udpServer.js'));

    udp_thread.on('message', (data)=>{

      mainWindow.webContents.send('sensor-data',data);

    });

});

  ipcMain.on('command',(e,data)=>{

    console.log(data);  

  });


// Handle SIGINT to clean up workers
process.on('SIGINT', () => {
  console.log('Caught interrupt signal (SIGINT)');

  if (udp_thread) {
    udp_thread.terminate(() => {
      console.log('UDP Worker terminated');
    });
  }

  // Close the main app
  app.quit();
});