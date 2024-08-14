const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { Worker } = require('worker_threads');

const url = require("url");
const path = require("path");

let connected = false;
let tcp_thread
let udp_thread

let iconPath;

if (process.platform === 'win32') {
  iconPath = path.join(__dirname, '../assets', 'favicon.ico');
} else if (process.platform === 'linux') {
  iconPath = path.join(__dirname, '../assets', 'favicon-32x32.png');
}


try {
  require('electron-reloader')(module)
} catch (_) { }

let mainWindow;
const indexUrl = url.format({

  protocol: 'file',
  pathname: path.join(__dirname, '../views/mainWindow.html'),
  slashes: true

})

app.on("ready", () => {

  mainWindow = new BrowserWindow({

    title: "Rota Hyperloop",
    icon: iconPath,
    webPreferences: {

      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')

    },
    width: 800,
    height: 600
  });

  mainWindow.loadURL(indexUrl);

  const mainMenu = Menu.buildFromTemplate([]);

  Menu.setApplicationMenu(mainMenu);

  //mainWindow.webContents.openDevTools();


});

ipcMain.on('command', (e, data, param) => {

  switch (data) {

    case 'connect_sensors':

      if (connected == false) {

        tcp_thread = new Worker(path.join(__dirname, '/tcpClient.js'));

        tcp_thread.on('message', (msg) => {

          console.log(msg.description);

          if(msg.type == 'close'){

            if(connected == true){

              udp_thread.terminate();

            }

            connected = false;

          }else if(msg.description == 'connected'){

            connected = true;

            udp_thread = new Worker(path.join(__dirname, '/udpServer.js'));

            udp_thread.on('message', (data) => {
    
              mainWindow.webContents.send('sensor-data', data);
    
            });

          }

        });

      }

      break;

    default:

      if (connected) {
      
        let formatted_data = {

        'command': data,
        'parameter': null

        }

        if(typeof param !== 'undefined'){

          formatted_data.parameter = param;

        }

        tcp_thread.postMessage(JSON.stringify(formatted_data));

      }

      break;
  }

});


// Handle SIGINT to clean up workers
process.on('SIGINT', () => {
  console.log('Caught interrupt signal (SIGINT)');

  if (udp_thread) {
    udp_thread.terminate(() => {
      console.log('UDP Worker terminated');
    });
  }

  if (tcp_thread) {

    tcp_thread.terminate(() => {

      console.log('TCP Worker terminated');

    });

  }

  // Close the main app
  app.quit();
});