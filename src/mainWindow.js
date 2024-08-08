let train = {

    up: false,
    levitating: false,
    moving: false,
    breaks: false

}

const splashScreen = document.getElementById('splash-screen');

// Event handler functions
function handleFadeOut() {
    splashScreen.style.opacity = '0';

    splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none';

        // Remove event listeners after the splash screen disappears
        document.removeEventListener('click', handleFadeOut);
        document.removeEventListener('keydown', handleKeydown);
    }, { once: true });
}

function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        handleFadeOut();
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('click', handleFadeOut);
    document.addEventListener('keydown', handleKeydown);

    connectButton.addEventListener('click', () => {
        const ip = document.getElementById('ip').value;
        if (ip) {
            sendCommand('connect_sensors');
        }
    });

    liftButton.addEventListener('click', () => {

        if (train.up == false && train.moving == false) {

            sendCommand('lift_train');
            liftButton.classList.add('active');
            liftButton.innerHTML = 'İndir';
            train.up = true;

        } else if (train.up == true) {

            sendCommand('lower_train');
            liftButton.classList.remove('active');
            liftButton.innerHTML = 'Kaldır';
            train.up = false;

        }

    });

    levitationButton.addEventListener('click', () => {

        if (train.levitating == false && train.up == true) {

            sendCommand('start_levitation');
            levitationButton.classList.add('active');
            train.levitating = true;

        } else if (train.levitating == true && train.moving == false) {

            sendCommand('stop_levitation');
            levitationButton.classList.remove('active');
            train.levitating = false;

        }

    });

    impulseButton.addEventListener('click', () => {

        if (train.moving == false && train.breaks == false) {

            sendCommand('start_motor');
            impulseButton.classList.add('active');
            train.moving = true;

        } else {

            sendCommand('stop_motor');
            impulseButton.classList.remove('active');
            train.moving = false;

        }

    });

    breakButton.addEventListener('click', () => {

        if(train.breaks == false){

            sendCommand('brake_start');
            breakButton.classList.add('active');
            levitationButton.classList.remove('active');
            impulseButton.classList.remove('active');
            train.levitating = false;
            train.moving = false;
            train.breaks = true;

        }else{

            sendCommand('brake_stop');
            breakButton.classList.remove('active');
            train.breaks = false;

        }


    });

    stopButton.addEventListener('click', () => {

        sendCommand('emergency_stop');
        train.moving = false;
        train.levitating = false;
        train.up = false;

        levitationButton.classList.remove('active');
        impulseButton.classList.remove('active');
        liftButton.classList.remove('active');

    });


});


let printData = function (id, data) {

    document.getElementById(id).innerHTML = data;


}

let dataHandler = function (json_data) {

    try {

        switch (json_data.data_name) {
            case 'velocity_x':

                printData('vx', json_data.value + ' m/s');

                let needle = document.getElementById('needle');

                needle.style.transform = 'translate(-50%, -100%) rotate('+String(-90 + json_data.value*180/200)+'deg)';


                break;

            case 'velocity_y':

                printData('vy', json_data.value + ' m/s');

                break;

            case 'velocity_z':

                printData('vz', json_data.value + ' m/s');

                break;

            case 'position_x':

                printData('px', json_data.value + ' m');
                printData('progress_text', json_data.value + ' / 186m');

                document.getElementById('progress_fill').style.width = String(json_data.value * 100 / 186) + '%';

                break;

            case 'position_y':

                printData('py', json_data.value + ' m');

                break;

            case 'position_z':

                printData('pz', json_data.value + ' m');

                break;

            case 'acceleration_x':

                printData('ax', json_data.value + ' m/s²');

                break;

            case 'acceleration_y':

                printData('ay', json_data.value + ' m/s²');

                break;

            case 'acceleration_z':

                printData('az', json_data.value + ' m/s²');

                break;

            case 'roll':

                printData('roll', json_data.value + '°');

                break;

            case 'pitch':

                printData('pitch', json_data.value + '°');

                break;

            case 'yaw':

                printData('yaw', json_data.value + '°');

                break;

            case 'pressure':

                printData('pressure', json_data.value + 'kPa');

                break;

            case 'motor_battery':

                document.getElementById('motor_battery').style.width = String(json_data.value * 100 / 680) + '%';

                break;

            case 'accesory_battery':

                document.getElementById('accesory_battery').style.width = String(json_data.value * 100 / 16.8) + '%';

                break;

            default:

                console.log('Invalid data name');

                break;
        }


    } catch (error) {

        console.log(error);

    }

}

window.ipc.onData((e, data) => {

    try {

        let json_data = JSON.parse(data);

        dataHandler(json_data);


    } catch (error) {
        console.log(error);
    }

});

const connectButton = document.getElementById('connect');
const breakButton = document.getElementById('break');
const liftButton = document.getElementById('lift');
const levitationButton = document.getElementById('levitation');
const impulseButton = document.getElementById('impulse');
const stopButton = document.getElementById('stop');


let sendCommand = function (command) {

    window.ipc.sendCommand(command);

};
