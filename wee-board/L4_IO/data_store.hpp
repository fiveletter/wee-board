#ifndef DATA_STORE_HPP__
#define DATA_STORE_HPP__

#include <stdint.h>

#include "shared_handles.h"
#include "FreeRTOS.h"
#include "LPC17xx.h"
#include "semphr.h"
#include "singleton_template.hpp"  // Singleton Template
#include "task.h"
#include "queue.h"

typedef struct {
  uint32_t duty_cycle;
  bool deadman_active;
  bool controller_MIA;
} Board_Status_t;

class DataStore : public SingletonTemplate<DataStore>
{
  public:
    void store_duty_cycle(uint32_t data);
    void store_deadman_active(bool data);
    void store_controller_MIA(bool data);
    void store_board_state(BoardStates_E state);
    
    Board_Status_t get_board_status(void);
    bool board_can_receive_command(void);

  private:
    DataStore();  
    friend class SingletonTemplate<DataStore>;

    Board_Status_t status;
    BoardStates_E board_state;
};


#endif /* DATA_STORE_HPP__ */
