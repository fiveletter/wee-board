#ifndef ESC_MOTOR_HPP__
#define ESC_MOTOR_HPP__

#include <stdint.h>

#include "lpc_pwm.hpp"

/*
  function generator 2ms or 5 Hz
  Starting duty cycle == 1.50ms or 75% @ 5Hz
      
  Motor controller -> Motor
  Yellow -> yellow
  Blue -> oranage
  black -blue
*/
#define MICROSECONDS 1000000.0

class EscMotor: public PWM
{
  public:
    EscMotor(pwmType pwm, unsigned int frequencyHz = 50);
    bool setDuty(uint32_t microSec);

  private:
    uint32_t frequency;
    float percentPerMicroSec;
};

#endif /* ESC_MOTOR_HPP__ */