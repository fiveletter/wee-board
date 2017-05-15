/*
 * JSONObject.hpp
 *
 *  Created on: May 11, 2017
 *      Author: alex
 */

#ifndef JSON_OBJECT_HPP_
#define JSON_OBJECT_HPP_

#include <iostream>
#include <string.h>
#include <stdio.h>
#include <vector>

#define MAX_RET_STR_LEN 500
#define MAX_ENTRIES 15
#define MAX_KEY_VALUE_PAIR_LEN 25

class JSONObject
{
private:
	char *keyarray[MAX_ENTRIES];
	int values[MAX_ENTRIES];
	char retString[MAX_RET_STR_LEN];
	char holder[MAX_ENTRIES][MAX_KEY_VALUE_PAIR_LEN];
	int keyarraysize;
	int valuearraysize;
public:
	JSONObject();
	void set(char* key,int value);
	char* stringify();
	~JSONObject();
};

#endif /* JSON_OBJECT_HPP_ */