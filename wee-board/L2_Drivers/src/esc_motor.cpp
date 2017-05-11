#include <stdint.h>
#include <stdio.h>

#include "esc_motor.hpp"

EscMotor::EscMotor(pwmType pwm, unsigned int frequencyHz):PWM(pwm, frequencyHz)
{
    frequency = frequencyHz;
    percentPerMicroSec = (1.0/((1.0/frequencyHz)*MICROSECONDS));
}


bool EscMotor::setDuty(uint32_t microSec)
{
    /* Clamp input value to between 1000 - 2000 */
    uint32_t clampedMicroSec = microSec > 2000 ? 2000 : microSec;
    clampedMicroSec = clampedMicroSec < 1000 ? 1000 : clampedMicroSec;

    float dutyCycle = (clampedMicroSec * percentPerMicroSec)*100;
    printf("Setting motor1 to %d Duty Cycle to %f\n", clampedMicroSec, dutyCycle);
    PWM::set(dutyCycle);
}