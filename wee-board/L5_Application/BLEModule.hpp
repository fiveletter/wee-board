/*
 * BLEModule.hpp
 *
 *  Created on: May 10, 2017
 *      Author: alex
 */

#ifndef L5_APPLICATION_BLEMODULE_HPP_
#define L5_APPLICATION_BLEMODULE_HPP_

#include "uart2.hpp"
#include <stdio.h>
#include "printf_lib.h"
#include "lpc_sys.h"

class BLEModule
{
private:
	Uart2& u2 = Uart2::getInstance();
	char * command;
	char * data;
public:
	BLEModule();
	void u2_init();
	char* getData();
	void putData();

};


#endif /* L5_APPLICATION_BLEMODULE_HPP_ */
