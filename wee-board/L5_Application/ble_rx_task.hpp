/*
 * ble_task.hpp
 *
 *  Created on: Apr 30, 2017
 *      Author: alex
 */

#ifndef L5_APPLICATION_BLE_TASK_HPP_
#define L5_APPLICATION_BLE_TASK_HPP_

#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include "uart2.hpp"
#include "scheduler_task.hpp"
#include "shared_handles.h"

/* Max bytes a rx value can be */
#define MAX_BUFFER_SIZE     20

/* DECODING SYMBOLS
*  
*  Note: Different values will always have different start symbols and the same 
*  terimatino symbols
*/
#define TERMINATION_SYMBOL  '~'
#define DUTY_CYCLE_SYMBOL   '$'
#define DUTY_CYCLE_BYTES    2


typedef enum {
  IDLE = 0,
  DUTY_CYCLE_RX,
  ERROR
} BLErxState_t;

typedef struct {
  uint8_t byte_buffer[MAX_BUFFER_SIZE];   ///< 20 byte max BLE frame
  uint8_t index;                          ///< index of receive buffer
  uint8_t expected_bytes;                 ///< max bytes for this decode
  BLErxState_t state;                     ///< current state
  BLErxState_t previous_state;            ///< previous state
} rxDecode_t;

class BLErxTask : public scheduler_task
{
  public:
    BLErxTask(uint8_t priority) : scheduler_task("BLErxTask", 2000, priority)
    {
      /* DO NOTHING */
      rx_decode = {
        .byte_buffer = {0},
        .index = 0,
        .expected_bytes = 0,
        .state = IDLE,
        .previous_state = IDLE
      };
    }

    bool init(void)
    {
      QueueHandle_t uart2rx_q = xQueueCreate(64, sizeof(uint8_t));
      addSharedObject(shared_UART2rxQueue, uart2rx_q);

      return true;
    }

    bool run(void *p)
    {
      uint8_t receive_byte = 0xFF;
      QueueHandle_t uart2rx_q = getSharedObject(shared_UART2rxQueue);


      if (xQueueReceive(uart2rx_q, &receive_byte, portMAX_DELAY))
      {
        BLErxState_t next_state = state_machine(receive_byte);
        handle_transition(next_state);
      }
      return true;
    }

  private:
    BLErxState_t state_machine(uint8_t rx_data)
    {

      BLErxState_t next_state = rx_decode.state;
      switch(rx_decode.state)
      {
        case IDLE:
          // Decide what data will be received; else error
          if ((char) rx_data == DUTY_CYCLE_SYMBOL)
          {
            next_state = DUTY_CYCLE_RX;
          }
          else
          {
            next_state = ERROR;
          }
          break;
        case DUTY_CYCLE_RX:
          // check for byte decode overflow
          if (rx_decode.index > rx_decode.expected_bytes)
          {
            next_state = ERROR;
          } 
          // Check for termination  
          else if ((char) rx_data == TERMINATION_SYMBOL)
          {
            // Check for mailformed data
            if (rx_decode.index != rx_decode.expected_bytes)
            {
              next_state = ERROR;
            } 
            // Received valid data, send to queue
            else
            {
              // Send data
              send_duty_cycle();
              next_state = IDLE;
            }
          }
          // Receive byte data
          else
          {
            rx_decode.byte_buffer[rx_decode.index++] = rx_data;
          }
          break;
        case ERROR:
          handle_error();
          
          /* 
          *  When we first get an error wait until a termination is received 
          *  before rying to recover from the error 
          */
          if ((char)rx_data == TERMINATION_SYMBOL)
          {
            next_state = IDLE;
          }
          break;
        default:
          /* SHOULD NEVER GET HERE */
          break;
      }

      return next_state;
    }

    bool is_first_entry_into_rx_state(BLErxState_t next_state)
    {
      return rx_decode.state == IDLE && 
            (next_state == DUTY_CYCLE_RX);
    }

    void handle_error()
    {
      printf("Error in BLErxTask state machine (prevSt: %d currSt: %d)\n", 
            rx_decode.previous_state, rx_decode.state);
    }

    void handle_transition(BLErxState_t next_state)
    {
      if (is_first_entry_into_rx_state(next_state))
      {
        // Prepare for new decoded data
        memset(rx_decode.byte_buffer, 0, MAX_BUFFER_SIZE);
        rx_decode.index = 0;

        if (next_state == DUTY_CYCLE_RX)
        {
          rx_decode.expected_bytes = DUTY_CYCLE_BYTES;
        }
      }

      // assign next states
      rx_decode.previous_state = rx_decode.state;
      rx_decode.state = next_state;
    }

    void send_duty_cycle()
    {
      uint16_t duty_cycle = rx_decode.byte_buffer[0] << 8 | rx_decode.byte_buffer[1];
      QueueHandle_t duty_cycle_q = scheduler_task::getSharedObject(shared_dutyCycleQueue);

      if (!xQueueSend(duty_cycle_q, &duty_cycle, 0))
      {
        printf("duty_cycle_q is full!!\n");
      }
    }

    rxDecode_t rx_decode;
};





#endif /* L5_APPLICATION_BLE_TASK_HPP_ */
