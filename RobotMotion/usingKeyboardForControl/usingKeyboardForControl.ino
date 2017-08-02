/**
 * Using MegaPi to control the robotic arm through Bluetooth communication between Mega and RPi3 to get input
 * w - forward
 * a - left
 * s - Backward
 * d - Right
 * u - raise arm
 * j - lower arm
 * k - close hand
 * o - open hand
 * 
 * space or x - stop
 * 
 * Serial2 for gpio
 * Serial3 for bluetooth
 * 
 * https://github.com/Makeblock-official/Robotic-Arm-Add-On-Pack-For-Starter-Robot-Kit/blob/master/Demo/Demo.ino
 * 
 */

#include "MeMegaPi.h"

MeMegaPiDCMotor rightMotor(PORT1B);
MeMegaPiDCMotor leftMotor(PORT2B);
MeMegaPiDCMotor arm(PORT3B);
MeMegaPiDCMotor hand(PORT4);

long count = 0;
int16_t armSpeed = 50;
int16_t handSpeed = 50;
int16_t motorSpeed = 60;

void setup() {
//  Serial.begin(115200);
  Serial2.begin(115200);
}

void loop() {
  // listen for the data
  if (Serial2.available() > 0) {
    // read data from serial port
    char command = Serial2.read();  // read the received character from rpi
    Serial2.print("You have input: ");
    Serial2.println(command);
    switch (command){
      case 'd':
        TurnRight();
        break;
      case 'w':
        Forward();
        break;
      case 'a':
        TurnLeft();
        break;
      case 's':
        Backwards();
        break;
      case ' ':
        Stop();
        break;
      case 'x':
        Stop();
        break;
      case 'u':
        RaiseArm();
        break;
      case 'j':
        LowerArm();
        break;
      case 'k':
        HandClose();
        break;
      case 'o':
        HandOpen();
        break;
    }
  }
}

void HandOpen(void){
  hand.run(-handSpeed);
  delay(1000);
  hand.run(0);
}

void HandClose(void){
  hand.run(handSpeed);
  delay(1000);
  hand.run(0);
}

void RaiseArm(void){
  arm.run(armSpeed);
  delay(1000);
  arm.run(0);
}

void LowerArm(void){
  arm.run(-armSpeed);
  delay(1000);
  arm.run(0);
}

void Forward(void){
  leftMotor.run(motorSpeed);
  rightMotor.run(-motorSpeed);
}

void Backwards(void){
  leftMotor.run(-motorSpeed);
  rightMotor.run(motorSpeed);
}

void TurnLeft(void){
  leftMotor.run(-motorSpeed/3);  // /3
  rightMotor.run(-motorSpeed*1.5);
}

void TurnRight(void){
  leftMotor.run(motorSpeed*1.5);
  rightMotor.run(motorSpeed/3);  // /3
}

void Stop(void){
  leftMotor.run(0);
  rightMotor.run(0);
}


