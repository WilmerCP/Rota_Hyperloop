const { contextBridge, ipcRenderer } = require('electron');

let ipc_object = {

    'onData' : function(callback){

        ipcRenderer.on('sensor-data',callback);

    },

    'sendCommand' : function(command){

        ipcRenderer.send('command', command);

    }

}

contextBridge.exposeInMainWorld('ipc',ipc_object);