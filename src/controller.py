from udpSocket import startup
import multiprocessing
import threading

class Controller:
    def __init__(self):
        self.message_array = multiprocessing.Array('c', 20)
        self.udp_process = None
        self.event_thread = None
        self.event_listener_flag = threading.Event()
        self.child_process_flag = multiprocessing.Event()

    def handler(self, command):
        if command == "connect_sensors":

            self.event_thread = threading.Thread(target=self.event_listener,args=(self.message_array,))
            self.event_thread.start()

            self.udp_process = multiprocessing.Process(target=startup, args=(self.message_array,self.child_process_flag))
            self.udp_process.start()


    def cleanup(self):
        if self.udp_process is not None:
            self.udp_process.terminate()
            self.udp_process.join()
            self.udp_process = None
            print('Child process terminated and joined')

        if self.event_thread is not None:

            self.event_listener_flag.set()
            self.child_process_flag.set()
            try:
                self.event_thread.join(timeout=2)  # Optional timeout to prevent hanging
            except KeyboardInterrupt:
                print("Interrupted during thread join")
            finally:
                self.event_thread = None
                print('Thread terminated and joined')
            

    def message_handler(self, message_array):

        shared_string = bytes(message_array[:]).rstrip(b'\x00').decode('utf-8')
        if shared_string:
            print(shared_string)

    def event_listener(self,message_array):

        while not self.event_listener_flag.is_set():

            self.child_process_flag.wait()

            if not self.event_listener_flag.is_set():
                self.message_handler(message_array)
                self.child_process_flag.clear()

controller_obj = Controller()

'''
shared_string = bytes(shared_array[:]).rstrip(b'\x00').decode('utf-8')
                if shared_string:
                    print(f"Shared string: {shared_string}")

'''