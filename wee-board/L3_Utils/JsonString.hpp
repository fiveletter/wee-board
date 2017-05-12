/*
 * JsonString.hpp
 *
 *  Created on: May 11, 2017
 *      Author: alex
 */

#ifndef JSONSTRING_HPP_
#define JSONSTRING_HPP_

#include <iostream>
#include <string.h>
#include <stdio.h>
#include <vector>

class JsonString
{
private:
    std::vector<char*> keyarray;
	int* values;
	char* retString;
	int keyarraysize;
	int valuearraysize;
public:
	JsonString();
	void set(char* key,int value);
	char* stringify();
	~JsonString();
};




#endif /* JSONSTRING_HPP_ */
