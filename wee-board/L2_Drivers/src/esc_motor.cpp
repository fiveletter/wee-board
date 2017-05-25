#include <stdint.h>
#include <stdio.h>

#include "esc_motor.hpp"

#define MAX_DUTY_CYCLE 2200
#define MIN_DUTY_CYCLE 1000

EscMotor::EscMotor(pwmType pwm, unsigned int frequencyHz):PWM(pwm, frequencyHz)
{
    frequency = frequencyHz;
    percentPerMicroSec = (1.0/((1.0/frequencyHz)*MICROSECONDS));
}


bool EscMotor::setDuty(uint32_t microSec)
{
    /* Clamp input value to between 1000 - 2000 */
    uint32_t clampedMicroSec = microSec > MAX_DUTY_CYCLE ? MAX_DUTY_CYCLE : microSec;
    clampedMicroSec = clampedMicroSec < MIN_DUTY_CYCLE ? MIN_DUTY_CYCLE : clampedMicroSec;

    float dutyCycle = (clampedMicroSec * percentPerMicroSec)*100;
    printf("Setting motor1 to %d Duty Cycle to %f\n", clampedMicroSec, dutyCycle);
    PWM::set(dutyCycle);
}