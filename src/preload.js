const { contextBridge, ipcRenderer } = require('electron');

let ipc_object = {

    'onData' : function(callback){

        ipcRenderer.on('sensor-data',callback);

    },

    'sendCommand' : function(command,param){

        console.log(param)
        ipcRenderer.send('command', command, param);

    }

}

contextBridge.exposeInMainWorld('ipc',ipc_object);