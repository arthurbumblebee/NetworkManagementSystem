# Arthur Makumbi and Jiaheng Hu
# Summer Research 2017
# This program is used together with the node js program
# It reads in the user's selection on the website and sends it to the 
# socket server on the Raspberry Pi

import socket
import sys
import json


serverName = '137.146.188.249'  # ip address of the raspberry pi you are using
serverPort = 12345

# create client socket and connect it to the Raspberry Pi server
clientSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clientSocket.connect((serverName, serverPort))

command = sys.stdin.readlines()
command = json.loads(command[0])
command = command['c']

# send to server and close the client side socket
clientSocket.send(command.encode())
clientSocket.close()
