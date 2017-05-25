/*
 * prox_sensor.hpp
 *
 *  Created on: May 24, 2017
 *      Author: alex
 */

#ifndef L5_APPLICATION_PROX_SENSOR_HPP_
#define L5_APPLICATION_PROX_SENSOR_HPP_

#include "I2C2.hpp"

void prox_int_init(int pin);

void prox_reset();

void prox_set_single();

void prox_set_continuous();

uint8_t prox_read();

bool deadman_check(uint8_t prox);


#endif /* L5_APPLICATION_PROX_SENSOR_HPP_ */
