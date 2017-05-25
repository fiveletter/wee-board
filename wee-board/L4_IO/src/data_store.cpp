#include <stdio.h>

#include "data_store.hpp"
#include "printf_lib.h"

void DataStore::store_duty_cycle(uint32_t data)
{
    status.duty_cycle = data;
}

void DataStore::store_deadman_active(bool data)
{
    status.deadman_active = data;
}


void DataStore::store_controller_MIA(bool data)
{
    status.controller_MIA = data;
}

void DataStore::store_board_state(BoardStates_E state)
{
    board_state = state;
}

Board_Status_t DataStore::get_board_status(void)
{
    return status;
}

bool DataStore::board_can_receive_command(void)
{
    return board_state == BOARD_RUNNING || 
            board_state == BOARD_IDLE || 
            board_state == BOARD_ATTEMPT_TO_RUN;
}

DataStore::DataStore() : status({0}), board_state(BOARD_IDLE)
{
    status.duty_cycle = 0;
    status.deadman_active = true;
    status.controller_MIA = false;
    /* DO NOTHING */
}
