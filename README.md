# NetworkManagementSystem
Summary

A network management system for a wireless robotic network, which can provide a user-friendly web-based interface to remotely control and manage the robots.

Files and Descriptions

  1.	formnjs.html: main web page file
  2.	index.html: potential sign up web page file
  3.	node.js: this program is used to perform all the server side operations which include: fetching data from the database, and sending         it to the client side (website)
  4.	nodeold.js: old version of node.js that still uses pathnames as URLs to specify what tasks the server should perform. Jeff’s programs are mainly based off of this version and they need to be updated.
  5.	move.py: This program is used together with the node.js program It reads in the user's selection on the website and sends it to the socket server on the Raspberry Pi
  6.	robotNetwork.mysql: This is the program used to create all the tables in the database
  7.	robotScripts.js: This program contains all the scripts used to make the website interactive

Operation

  1.	ssh into the kili dwarf using your Colby email and credentials on your terminal and you will do everything from there. Remember to use the –Y flag in order to allow you to open Firefox
  2.	open Firefox using: firefox &
  3.	change into the working directory in which all your files are and run the node.js file to open the server like this: node node.js
  4.	you can then run the website inputting this URL in firefox: http://localhost:8000/formnjs.html
  5.	you can access the database by running: 
    a.	mysql -u {username} –p
    b.	input the password
    c.	use yingli
    d.	use yingliAdmin
