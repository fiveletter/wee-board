/*
 * ble_task.cpp
 *
 *  Created on: May 3, 2017
 *      Author: alex
 */

#include "BLEModule.hpp"

BLEModule::BLEModule()
{
	data = new char[20];
	command = new char[20];
}

void BLEModule::u2_init()
{
	u2.init(9600);
}

void BLEModule::putData()
{
	printf("Input a command:\n");
	scanf("%s", command);
	u2.putline(command);
}

char* BLEModule::getData()
{
	u2.gets(data,0);
	return data;
}
