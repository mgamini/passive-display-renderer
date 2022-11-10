// Next 3 lines are a precaution
#ifndef ARDUINO_INKPLATE10
#error "Wrong board selection for this example, please select Inkplate 10 in the boards menu."
#endif

int timeZone = -5;

#include "Inkplate.h" //Include Inkplate library to the sketch

// Our networking functions, declared in Network.cpp
#include "Network.h"

// create object with all networking functions
Network network;

Inkplate display(INKPLATE_3BIT);

char date[64];

void setup()
{
  Serial.begin(115200);
  display.begin();
  network.begin();

  display.clearDisplay();
  display.display();
  display.setCursor(250, 420);
  display.setTextColor(0, 7);
  display.setTextSize(3);
  display.setTextWrap(false);

  display.print("The current time is");

  display.setCursor(250, 500);
  display.setTextColor(7, 0);
  display.setTextSize(4);

  network.getTime(date);
  
  display.print(date);
  display.display();   
  
  // esp_sleep_enable_timer_wakeup(15ll * 60 * 1000 * 1000);
  esp_sleep_enable_timer_wakeup(60l * 1000 * 1000);
  esp_deep_sleep_start();
}

void loop()
{

}