#Code for the host of the TCP connection (Raspberry pi side)
#This path will be used to command the train (Startup,Emergency stop,etc)
import socket
from controller import controller_obj;

s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.bind(('localhost',4000))
s.listen(1)

#This function waits until a client connects
clientSocket, address = s.accept()
print(f"Connection from {address} has been established!")
clientSocket.sendall("Welcome to the server".encode("utf-8"))

try:

    while True:
        
        try:
        
            data = clientSocket.recv(1024)

            if data:

                controller_obj.handler(data.decode('utf-8'))
                print(data.decode('utf-8'))
        
            else:
                print('Connection closed')
                break


        except KeyboardInterrupt:


            break

except socket.error as e:

    print(e)

finally:

    controller_obj.cleanup()
    clientSocket.close()
    s.close()


'''
    {
        message_type: sensor_data
        data_name: velocity_x,
        value: 30

    }

    {
        message_type: error_message
        value: "Arduino ile baglanti hatasi"

    }

[start_levitation,
stop_levitation,
start_motor,
stop_motor,
emergency_stop,
connect_sensors]

    {
        komut: start_levitation

    }

'''