from udpSocket import startup
import multiprocessing
import time

class Controller:
    def __init__(self):
        self.message_array = multiprocessing.Array('c', 20)
        self.udp_process = None

    def handler(self, command):
        if command == "connect_sensors":
            self.udp_process = multiprocessing.Process(target=startup, args=(self.message_array,))
            self.udp_process.start()

    def cleanup(self):
        if self.udp_process is not None:
            self.udp_process.terminate()
            self.udp_process.join()
            self.udp_process = None
            print('Child process terminated and joined')

controller_obj = Controller()