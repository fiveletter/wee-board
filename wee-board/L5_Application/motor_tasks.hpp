#ifndef MOTOR_TASKS_HPP_
#define MOTOR_TASKS_HPP_

#include <stdio.h>
#include <stdint.h>

#include "esc_motor.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"

class SpeedControllerTask: public scheduler_task
{
  public:
    SpeedControllerTask(uint8_t priority): 
        scheduler_task("SpeedControllerTask", 1000, priority), 
        motor1(EscMotor::pwm1, 500)
    {
      /* DO NOTHING */
    }

    bool init(void)
    {
      // Init pwm duty cycle queue
      QueueHandle_t motor1PWM_q = xQueueCreate(1, sizeof(uint32_t));
      addSharedObject(shared_diagnosticMotor1PWM, motor1PWM_q);
      
      // Set duty cycle to 0 
      motor1.setDuty((uint32_t)1500);
      return true;
    }

    bool run(void *p)
    {
      uint32_t duty_cycle_value = 0;
      QueueHandle_t diagnostic_q = getSharedObject(shared_diagnosticMotor1PWM);


      if (xQueueReceive(diagnostic_q, &duty_cycle_value, portMAX_DELAY))
      {
        motor1.setDuty(duty_cycle_value);
      }

      return true;
    }
    
  private:
    EscMotor motor1;
};

#endif /* MOTOR_TASKS_HPP_ */
