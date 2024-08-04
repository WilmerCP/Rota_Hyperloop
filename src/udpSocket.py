#!/usr/bin/env python3
import serial
import time
import socket
import json

shared_array = None
event_signal = None

def startup(message_array,event):

    ser = None
    sock = None

    global shared_array
    shared_array = message_array

    global event_signal
    event_signal = event

    try:

        ser = serial.Serial('/dev/ttyUSB0',9600,timeout=1.0)
        time.sleep(3)
        ser.reset_input_buffer()
        print('serial ok')

        # Define the server address and port
        server_address = ('localhost', 1234)

        # Create a UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    
        while True:

            time.sleep(0.01)
            if ser.in_waiting > 0:

                line = ser.readline().decode('utf-8')

                # Send the message
                sent = sock.sendto(line.encode(), server_address)
                dictionary = json.loads(line)
                validate(dictionary)


    except KeyboardInterrupt:
        
        print('udp process manually interrupted')

    except Exception as e:

        print(e)
    
    finally:

        print('Closing socket and serial communication')
        if ser is not None:
            ser.close()

        if sock is not None:
            sock.close()


def sendMessage(line):
    global shared_array
    global event_signal

    # Encode the line to bytes
    encoded_line = line.encode('utf-8')

    # Ensure the message fits in the shared array
    if len(encoded_line) > len(shared_array):
        raise ValueError("Encoded line is too long for the shared array")

    # Copy the encoded message to the shared array
    shared_array[:len(encoded_line)] = encoded_line

    # Null-terminate the rest of the shared array
    shared_array[len(encoded_line):] = b'\x00' * (len(shared_array) - len(encoded_line))

    event_signal.set()



def validate(dictionary):

    if dictionary['data_name'] == 'temp_1':

        if float(dictionary['value']) > 60:

            sendMessage('temperature 1 is too high, stopping train')

            

    elif dictionary['data_name'] == 'temp_2':

        if float(dictionary['value']) > 45:

            print('temperature 2 is too high, stopping train')

    elif dictionary['data_name'] == 'yaw':

        if float(dictionary['value']) > 20:

            print('The Yaw value is too much, stopping train')