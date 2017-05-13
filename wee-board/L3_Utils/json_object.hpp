/*
 * JSONObject.hpp
 *
 *  Created on: May 11, 2017
 *      Author: alex
 */

#ifndef JSONObject_HPP_
#define JSONObject_HPP_

#include <iostream>
#include <string.h>
#include <stdio.h>
#include <vector>

class JSONObject
{
private:
  std::vector<char*> keyarray;
  int* values;
  char* retString;
  int keyarraysize;
  int valuearraysize;
  
public:
  JSONObject();
  void set(char* key,int value);
  char* stringify();
  ~JSONObject();
};




#endif /* JSONObject_HPP_ */
