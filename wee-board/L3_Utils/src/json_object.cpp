/*
 * JSONObject.cpp
 *
 *  Created on: May 11, 2017
 *      Author: alex
 */

#include "json_object.hpp"

JSONObject::JSONObject()
{
  values = new int[5];
  retString = NULL;
  keyarraysize = 0;
  valuearraysize = 0;
}

void JSONObject::set(char* key, int value)
{
  if(keyarraysize == 0)
  {
    delete retString;
    retString = new char[10];
  }
  
  keyarray.push_back(key);
  values[valuearraysize] = value;
  keyarraysize++;
  valuearraysize++;
}

char * JSONObject::stringify()
{
  retString = NULL;
  if(!keyarray.empty() && values)
  {
    asprintf(&retString,"{\"%s\":%i",keyarray[0],values[0]);
    for(int i = 1; i<keyarraysize; i++)
    {
      asprintf(&retString, "%s,\"%s\":%i",retString,keyarray.at(i),values[i]);
    }
    asprintf(&retString,"%s}",retString);
    keyarray.clear();
    delete[] values;
    values = new int[5];
    keyarraysize = 0;
    valuearraysize = 0;
    return retString;
  }
  else
  {
    printf("Nothing to stringify!\n");
    return NULL;
  }
}

JSONObject::~JSONObject()
{
  std::vector<char*> keyarray;
  delete[] values;
  delete retString;
}
