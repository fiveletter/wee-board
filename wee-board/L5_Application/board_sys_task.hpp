/*
 * Main task of the board
 */

#ifndef L5_APPLICATION_BOARD_SYS_TASK_HPP_
#define L5_APPLICATION_BOARD_SYS_TASK_HPP_

#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include "data_store.hpp"
#include "json_object.hpp"
#include "uart2.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"
#include "prox_sensor.hpp"

class BoardSysTask : public scheduler_task
{
  public:
    BoardSysTask(uint8_t priority) : 
      scheduler_task("BoardSysTask", 3000, priority),
      uart2(Uart2::getInstance()),
      dataStore(DataStore::getInstance())
    {
      /* DO NOTHING */
    }

    bool taskEntry(void)
    {
      prox_reset();
      prox_set_continuous();
      uart2.init(9600);
      return true;
    }

    bool init(void)
    {
      SemaphoreHandle_t periodicSem = xSemaphoreCreateBinary();
      addSharedObject(shared_boardSysSemaphore, periodicSem);

      return true;
    }

    bool run(void *p)
    {
      SemaphoreHandle_t sys_board_sem = getSharedObject(shared_boardSysSemaphore);
      
      while (xSemaphoreTake(sys_board_sem, portMAX_DELAY))
      {
        state_machine();
        send_tx_data();
      }

      return true;
    }

    void state_machine()
    {
      /* DO NOTHING */
    }

    void send_tx_data ()
    {
      Board_Status_t status = dataStore.get_board_status();
      JSONObject json_object; ///< ONLY INSTANTIATE ONE OF THESE OBJECTS
      /* Keys for these properties are dictated by the mobile application */
      json_object.set("dutyCycle", status.duty_cycle);

      char* json_string = json_object.stringify();
      printf("%s\n", json_string);
      uart2.put(json_string);
    }

  private:
    Uart2& uart2;
    DataStore& dataStore;
};





#endif /* L5_APPLICATION_BOARD_SYS_TASK_HPP_ */
