# Arthur Makumbi
# Summer Research 2017
# Run this program on the client side in order to read dynamic input from the keyboard and send to the raspberry Pi
import socket
import curses  # for keypress readings
import os

serverName = '137.146.188.249'  # ip address of raspberry pi
serverPort = 12000

standardScreen = curses.initscr()  # for dynamic keyboard input

try:
    while True:
        clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        clientSocket.connect((serverName, serverPort))

        command = chr(standardScreen.getch())

        clientSocket.send(command.encode())
        info = clientSocket.recv(1024)
        print('Info from server: ', info.decode())
        clientSocket.close()

        if command == 'q':
            curses.endwin()
            os.system('stty sane')  # reset the screen correctly
            exit()
            print('Socket is closing')

except (KeyboardInterrupt, SystemExit):
    print('The server is closing')
    curses.endwin()
    os.system('stty sane')  # reset the screen correctly
    exit()
