#!/usr/bin/env python3
import serial
import time
import socket
import json

def startup(message_array):

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
                validate(dictionary,message_array)


    except KeyboardInterrupt:
        
        print('udp process manually interrupted')

    except Exception as e:

        print(e)
    
    finally:

        ser.close()
        sock.close()
        print('Closing socket and serial communication')

def validate(dictionary,message_array):

    if dictionary['data_name'] == 'temp_1':

        if float(dictionary['value']) > 60:

            print('temperature 1 is too high, stopping train')
            

    elif dictionary['data_name'] == 'temp_2':

        if float(dictionary['value']) > 45:

            print('temperature 2 is too high, stopping train')