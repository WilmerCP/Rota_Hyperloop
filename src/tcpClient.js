const net = require('net');
const { parentPort } = require('worker_threads');

let options = {

    host: 'localhost',
    port: 4001

}

const client = net.createConnection(options);


client.on('connect',()=>{

    let formatted_data = {

        'command': 'connect_sensors'

        }

    client.write(JSON.stringify(formatted_data));
    let obj = {'type': 'notification', 'description': 'connected'};
    parentPort.postMessage(obj);


});

client.on('data',(data)=>{

    let obj = {'type': 'notification', 'description': data.toString()};
    parentPort.postMessage(obj);

});

client.on('error',(err)=>{

    let obj = {'type': 'error', 'description': err.message}
    parentPort.postMessage(obj);

});

client.on('close',()=>{

    let obj = {'type': 'close', 'description': 'The server connection has been closed'}
    parentPort.postMessage(obj);

});

parentPort.on('message',(command)=>{

    client.write(command);

});

parentPort.on('exit', () => {
    console.log('TCP Worker exiting, cleaning up...');
    client.end();
  });