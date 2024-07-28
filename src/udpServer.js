const dgram = require('dgram');
const { parentPort } = require('worker_threads');

let server = dgram.createSocket('udp4');

server.on('message',(buffer,sender)=>{

    let msg = buffer.toString();
    parentPort.postMessage(msg);

})

server.bind(1234);

parentPort.on('exit', () => {
    console.log('UDP Worker exiting, cleaning up...');
    server.close();
  });