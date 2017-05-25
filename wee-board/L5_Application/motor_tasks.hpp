#ifndef MOTOR_TASKS_HPP_
#define MOTOR_TASKS_HPP_

#include <stdio.h>
#include <stdint.h>

#include "data_store.hpp"
#include "esc_motor.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"
#include "event_groups.h"

#define IDLE_DUTY_CYCLE 1500

class SpeedControllerTask: public scheduler_task
{
  public:
    SpeedControllerTask(uint8_t priority): 
        scheduler_task("SpeedControllerTask", 1000, priority), 
        motor1(EscMotor::pwm1, 100),
        xQueueSet(0),
        dataStore(DataStore::getInstance())
    {
      /* DO NOTHING */
    }

    bool init(void)
    {
      // Init data Queues
      const int DIAGNOSTIC_QUEUE = 2;
      const int DUTY_CYCLE_QUEUE = 2;
      QueueHandle_t diagnostic_q = xQueueCreate(DIAGNOSTIC_QUEUE, 
                                                          sizeof(uint32_t));
      QueueHandle_t duty_cycle_q = xQueueCreate(DUTY_CYCLE_QUEUE, 
                                                          sizeof(uint16_t));
      
      // Add Queues as shared object
      addSharedObject(shared_diagCmdQueue, diagnostic_q);
      addSharedObject(shared_dutyCycleQueue, duty_cycle_q);
      
      // Create Queue Set to run task on multiple RTOS objects
      xQueueSet = xQueueCreateSet(DIAGNOSTIC_QUEUE + DUTY_CYCLE_QUEUE);
      xQueueAddToSet(diagnostic_q, xQueueSet);
      xQueueAddToSet(duty_cycle_q, xQueueSet);

      // Set duty cycle to 0 
      motor1.setDuty((uint32_t)IDLE_DUTY_CYCLE);
      return true;
    }

    bool run(void *p)
    {
      QueueHandle_t diagnostic_q = getSharedObject(shared_diagCmdQueue);
      QueueHandle_t duty_cycle_q = getSharedObject(shared_dutyCycleQueue);
      
      // BLOCK UNTIL EVENT
      QueueSetMemberHandle_t event = xQueueSelectFromSet(xQueueSet, portMAX_DELAY);

      if (event == diagnostic_q)
      {
        /* DO NOTHING */
      }
      else if (event == duty_cycle_q)
      {
        EventGroupHandle_t watchdogEvent = scheduler_task::getSharedObject(shared_watchdogEventGroup);
        xEventGroupSetBits(watchdogEvent, COMMAND_RX_EVENT_BIT);
        
        uint16_t duty_cycle = 0;
        xQueueReceive(duty_cycle_q, &duty_cycle, 0);

        if (dataStore.board_can_receive_command())
        {
          motor1.setDuty(duty_cycle);
        }
        else
        {
          motor1.setDuty(IDLE_DUTY_CYCLE);
        }
      }

      return true;
    }
    
  private:
    EscMotor motor1;
    QueueSetHandle_t xQueueSet;
    DataStore& dataStore;
};

#endif /* MOTOR_TASKS_HPP_ */
