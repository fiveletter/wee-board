/*
 * prox_sensor.cpp
 *
 *  Created on: May 25, 2017
 *      Author: alex
 */

#include "prox_sensor.hpp"

void prox_int_init(int pin)
{
	LPC_PINCON->PINSEL0 &= ~(3 << (pin * 2));
	LPC_GPIO0->FIODIR &= ~(1 << 1);

	//Enable rising edge int
	LPC_GPIOINT->IO0IntEnR |= (1 << pin);
	//Enable falling edge int
	LPC_GPIOINT->IO0IntEnF |= (1 << pin);
}

void prox_reset()
{
	I2C2::getInstance().writeReg(38, 128, 0);
	//printf("\nProximity Sensor Reset");
}

void prox_set_single()
{
	int addr = 38;
	int reg = 128;
	int data = 8;
	I2C2::getInstance().writeReg(addr, reg, data);
	//printf("\nProximity sensor single on");
}

void prox_set_continuous()
{
	int addr = 38;
	int reg = 128;
	int data = 3;
	I2C2::getInstance().writeReg(addr, reg, data);
	//printf("\nProximity sensor continuous on");
}

uint8_t prox_read()
{
	int addr;
	int reg;
	unsigned int count;
	uint8_t buffer[256] = {0};
	addr = 39;
	reg = 135;
	count = 1;
	bool ok = I2C2::getInstance().readRegisters(addr, reg, &buffer[0], count);
	if(ok)
	{
		//printf("\nValue: %#2X", (buffer[0] & 0xFF));
		return buffer[0];
	}
	else{
		return 0;
	}
}

bool deadman_check(uint8_t prox)
{
	if(prox > 8)
	{
		return true;
	}
	else
	{
		return false;
	}

}
