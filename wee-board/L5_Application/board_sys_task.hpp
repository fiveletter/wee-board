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

typedef struct {
  BoardStates_E state;                     ///< current state
  BoardStates_E previous_state;            ///< previous state
} BoardState_t;

class BoardSysTask : public scheduler_task
{
  public:
    BoardSysTask(uint8_t priority) : 
      scheduler_task("BoardSysTask", 3000, priority),
      uart2(Uart2::getInstance()),
      dataStore(DataStore::getInstance())
    {
      /* DO NOTHING */
      state = {
        .state = BOARD_IDLE,
        .previous_state = BOARD_IDLE
      };
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
        Board_Status_t status = dataStore.get_board_status();
        state_machine(status);
        send_tx_data(status);
      }

      return true;
    }

    void state_machine(Board_Status_t status)
    {
      BoardStates_E next_state = state.state;

      switch (state.state)
      {
        case BOARD_IDLE:
          // Check for our first entry into state
          if (first_entry_into_state())
          {
            ///< DO NOTHING
          }

          // Handle transitions
          if (should_transition_to_RUNNING(status))
          {
            next_state = BOARD_RUNNING;
          }
          break;
        case BOARD_RUNNING:
          // Check for our first entry into state
          if (first_entry_into_state())
          {
            ///< DO NOTHING
          }

          if(should_transition_to_ERROR(status))
          {
            next_state = BOARD_ERROR;
          } 
          else if (should_transition_to_IDLE(status))
          {
            next_state = BOARD_IDLE;
          }
          // Handle transitions

          break;
        case BOARD_ERROR:
          // Check for our first entry into state
          if (first_entry_into_state())
          {
            ///< DO NOTHING
          }

          /// SET MOTORS TO IDLE MODE
          QueueHandle_t qid = scheduler_task::getSharedObject(shared_diagCmdQueue);
          uint32_t duty_cycle = 1600;
          xQueueSend(qid, &duty_cycle, 0);

          // Handle transitions
          if (can_exit_ERROR(status))
          {
            next_state = BOARD_IDLE;
          }

          break;
      }

      transition_to_next_state(next_state);
    }

    void transition_to_next_state(BoardStates_E next_state)
    {
      state.previous_state = state.state;
      state.state = next_state;

      // Save board state to dataStore
      dataStore.store_board_state(state.state);
    }

    bool first_entry_into_state()
    {
      return state.state != state.previous_state;
    }

    bool should_transition_to_RUNNING(Board_Status_t status)
    {
      return !status.controller_MIA && 
              status.deadman_active && 
              status.duty_cycle > 1600;
    }

    bool should_transition_to_ERROR(Board_Status_t status)
    {
      return status.controller_MIA || !status.deadman_active;
    }

    bool should_transition_to_IDLE(Board_Status_t status)
    {
      return status.duty_cycle == 1600;
    }

    bool can_exit_ERROR(Board_Status_t status)
    {
      return !status.controller_MIA && status.deadman_active;
    }

    void send_tx_data (Board_Status_t status)
    {
      JSONObject json_object; ///< ONLY INSTANTIATE ONE OF THESE OBJECTS
      /* Keys for these properties are dictated by the mobile application */
      json_object.set("dutyCycle", status.duty_cycle);
      json_object.set("commandMIA", status.controller_MIA);
      json_object.set("deadmanActive", status.deadman_active);
      json_object.set("boardState", state.state);

      char* json_string = json_object.stringify();
      printf("%s\n", json_string);
      uart2.put(json_string);
    }

  private:
    Uart2& uart2;
    DataStore& dataStore;
    BoardState_t state;
};





#endif /* L5_APPLICATION_BOARD_SYS_TASK_HPP_ */
