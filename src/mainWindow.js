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
    if (event.key === 'Enter') {
        handleFadeOut();
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('click', handleFadeOut);
    document.addEventListener('keydown', handleKeydown);
});


let printData = function (id, data) {

    document.getElementById(id).innerHTML = data;


}

let dataHandler = function (json_data) {

    try {

        switch (json_data.data_name) {
            case 'velocity_x':

                printData('vx', json_data.value + ' m/s');

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

                document.getElementById('progress_fill').style.width = String(json_data.value*100/186)+'%';

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

                document.getElementById('motor_battery').style.width = String(json_data.value*100/680)+'%';

                break;

                case 'accesory_battery':

                document.getElementById('accesory_battery').style.width = String(json_data.value*100/16.8)+'%';

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