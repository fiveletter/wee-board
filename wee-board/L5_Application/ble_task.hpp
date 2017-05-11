/*
 * ble_task.hpp
 *
 *  Created on: Apr 30, 2017
 *      Author: alex
 */

#ifndef L5_APPLICATION_BLE_TASK_HPP_
#define L5_APPLICATION_BLE_TASK_HPP_

#include <stdio.h>
#include "printf_lib.h"
#include "lpc_sys.h"
#include "uart2.hpp"
#include "scheduler_task.hpp"
#include "BLEModule.hpp"


class BLEputTask : public scheduler_task
{
private:
	int filler = 0;
	Uart2& u2 = Uart2::getInstance();
	BLEModule bleput;
public:
	BLEputTask(uint8_t priority) : scheduler_task("BLEputTask", 2000, priority)
	{
		//later
	}
	bool run(void *p)
	{
		//u2.putline("AT+BAUD?");
		bleput.putData();
		vTaskDelay(1000);
		return true;
	}
};

class BLEgetTask : public scheduler_task
{
private:
	char * info;
	Uart2& u2 = Uart2::getInstance();
	BLEModule bleget;
public:
	BLEgetTask(uint8_t priority) : scheduler_task("BLEgetTask", 2000, priority)
	{
		info = new char[20];
	}
	bool run(void *p)
	{
		//u2.gets(info, 0);
		info = bleget.getData();
		printf("%s \n", info);
		return true;
	}
};





#endif /* L5_APPLICATION_BLE_TASK_HPP_ */
