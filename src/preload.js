const { contextBridge, ipcRenderer } = require('electron');

let ipc_object = {

    'onData' : function(callback){

        ipcRenderer.on('sensor-data',callback);

    }

}

contextBridge.exposeInMainWorld('ipc',ipc_object);