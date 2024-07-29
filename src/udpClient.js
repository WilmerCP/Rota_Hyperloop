const dgram = require('dgram');

let client = dgram.createSocket('udp4');

let counter = 0;

let msg = "I am a message";

let buffer;

function sendSensorData(data_name,value){

    let json_data = {

        message_type: 'sensor_data',
        data_name: data_name,
        value: value

    }

    buffer = Buffer.from(JSON.stringify(json_data));

    client.send(buffer,1234,'localhost',(err)=>{
    
        if(err){

            console.log(err);
            client.close();

        }else{

            client.close();

        }

    });

}

sendSensorData('position_x',140);

/*

function sendMessage(counter){

    if(counter>=5){

        client.close();

    }else{

        buffer = Buffer.from(msg+String(counter));

        client.send(buffer,1234,'localhost',(err)=>{
    
            if(err){
    
                console.log(err);
    
            }else{
    
                sendMessage(++counter);
    
            }
    
        });

    }

}

sendMessage(counter);*/