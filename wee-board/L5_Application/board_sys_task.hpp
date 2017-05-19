/*
 * Main task of the board
 */

#ifndef L5_APPLICATION_BOARD_SYS_TASK_HPP_
#define L5_APPLICATION_BOARD_SYS_TASK_HPP_

#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include "json_object.hpp"
#include "uart2.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"

class BoardSysTask : public scheduler_task
{
  public:
    BoardSysTask(uint8_t priority) : 
      scheduler_task("BoardSysTask", 3000, priority),
      uart2(Uart2::getInstance())
    {
      /* DO NOTHING */
    }

    bool taskEntry(void)
    {
      uart2.init(9600);
      return true;
    }

    bool init(void)
    {
      return true;
    }

    bool run(void *p)
    {
      JSONObject json_object; ///< ONLY INSTANTIATE ONE OF THESE OBJECTS

      /* Keys for these properties are dictated by the mobile application */
      json_object.set("speed", 1600);
      json_object.set("batteryVoltage", 90);
      json_object.set("light", 12);

      char* json_string = json_object.stringify();
      printf("sending value %s\n", json_string);
      uart2.put(json_string);
      vTaskDelay(1000);
      return true;
    }

  private:
    Uart2& uart2;
};





#endif /* L5_APPLICATION_BOARD_SYS_TASK_HPP_ */
