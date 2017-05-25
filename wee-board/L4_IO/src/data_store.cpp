#include <stdio.h>

#include "data_store.hpp"
#include "printf_lib.h"

void DataStore::store_duty_cycle(uint32_t data)
{
    status.duty_cycle = data;
}

void DataStore::store_deadman(bool data)
{
    status.dead_man_active = data;
}


void DataStore::store_controller_MIA(bool data)
{
    status.duty_cycle = data;
}

Board_Status_t DataStore::get_board_status(void)
{
    return status;
}

DataStore::DataStore() : status({0})
{
    status.duty_cycle = 0;
    status.dead_man_active = false;
    status.controller_MIA = true;
    /* DO NOTHING */
}
