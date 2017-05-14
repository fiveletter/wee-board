/*
 * JsonString.hpp
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

class JsonString
{
private:
	char *keyarray[50];
	int values[50];
	char retString[1000];
	char holder[50][25];
	int keyarraysize;
	int valuearraysize;
public:
	JsonString();
	void set(char* key,int value);
	char* stringify();
	~JsonString();
};




#endif /* JSON_OBJECT_HPP_ */
