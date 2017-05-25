/*
 * Main task of the board
 */

#ifndef L5_APPLICATION_WATCHDOG_TASK_HPP__
#define L5_APPLICATION_WATCHDOG_TASK_HPP__

#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include "data_store.hpp"
#include "event_groups.h"
#include "FreeRTOS.h"
#include "json_object.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"
#include "soft_timer.hpp"
#include "uart2.hpp"

#define COMMAND_MIA_TIMEOUT   2 * 1000
#define DEADMAN_TIMEOUT       1 * 1000

class WatchDogTask : public scheduler_task
{
  public:
    WatchDogTask(uint8_t priority) : 
      scheduler_task("WatchDogTask", 3000, priority),
      dataStore(DataStore::getInstance()),
      watchdog_events(xEventGroupCreate()),
      period_100Hz(xSemaphoreCreateBinary()),
      command_MIA_timer(),
      deadman_timer()
    {
      /* DO NOTHING */
    }

    bool taskEntry(void)
    {
      return true;
    }

    bool init(void)
    {
      addSharedObject(shared_watchDogSemaphore, period_100Hz);
      addSharedObject(shared_watchdogEventGroup, watchdog_events);

      return true;
    }

    bool run(void *p)
    { 
      command_MIA_timer.reset(COMMAND_MIA_TIMEOUT);
      deadman_timer.reset(DEADMAN_TIMEOUT);

      while (xSemaphoreTake(period_100Hz, portMAX_DELAY))
      {
        /* Run watchdog tasks*/
        EventBits_t watchdog_bits = xEventGroupGetBits(watchdog_events);

        if (watchdog_bits & COMMAND_RX_EVENT_BIT)
        {
          // RESET COMMAND_MIA_TIMER
          printf("Rest Command MIA timer\n");
          command_MIA_timer.reset(COMMAND_MIA_TIMEOUT);
        }

        if (!(watchdog_bits & DEADMAN_EVENT_BIT))
        {
          // RESET WATCHDOG_TIMER
          deadman_timer.reset(DEADMAN_TIMEOUT);
        }
        else
        {
          printf("Deadman timer did not reset\n");
        }

        //Clear watchdog event bits
        EventGroupHandle_t watchdogEvents = scheduler_task::getSharedObject(shared_watchdogEventGroup);
        xEventGroupClearBits(watchdogEvents, DEADMAN_EVENT_BIT | COMMAND_RX_EVENT_BIT);

        dataStore.store_controller_MIA(command_MIA_timer.expired());
        dataStore.store_deadman_active(deadman_timer.expired());
      }

      return true;
    }

  private:
    DataStore& dataStore;
    SemaphoreHandle_t period_100Hz;
    EventGroupHandle_t watchdog_events;
    SoftTimer command_MIA_timer;
    SoftTimer deadman_timer;
};





#endif /* L5_APPLICATION_WATCHDOG_TASK_HPP__ */
