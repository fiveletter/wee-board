/*
 * Main task of the board
 */

#ifndef L5_APPLICATION_BOARD_SYS_TASK_HPP_
#define L5_APPLICATION_BOARD_SYS_TASK_HPP_

#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include "uart2.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"
#include "json_object.hpp"

class BoardSysTask : public scheduler_task
{
  public:
    BoardSysTask(uint8_t priority) : 
      scheduler_task("BoardSysTask", 2000, priority),
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
      JSONObject json_object;
      json_object.set("speed", 1234);

      uart2.put(json_object.stringify());
      vTaskDelay(1000);
      return true;
    }

  private:
    Uart2& uart2;
};





#endif /* L5_APPLICATION_BOARD_SYS_TASK_HPP_ */
