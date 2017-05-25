#ifndef DATA_STORE_HPP__
#define DATA_STORE_HPP__

#include <stdint.h>

#include "FreeRTOS.h"
#include "LPC17xx.h"
#include "semphr.h"
#include "singleton_template.hpp"  // Singleton Template
#include "task.h"
#include "queue.h"

typedef struct {
  uint32_t duty_cycle;
  bool dead_man_active;
} Board_Status_t;

class DataStore : public SingletonTemplate<DataStore>
{
  public:
    void store_duty_cycle(uint32_t data);
    void store_deadman(bool data);
    
    Board_Status_t get_board_status(void);

  private:
    DataStore();  ///< Private constructor of this Singleton class
    friend class SingletonTemplate<DataStore>;  ///< Friend class used for Singleton Template

    Board_Status_t status;
};


#endif /* DATA_STORE_HPP__ */
