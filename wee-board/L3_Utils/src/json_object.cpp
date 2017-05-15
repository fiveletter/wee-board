/*
 * JSONObject.cpp
 *
 *  Created on: May 11, 2017
 *      Author: alex
 */

#include "json_object.hpp"

JSONObject::JSONObject()
{
  keyarraysize = 0;
  valuearraysize = 0;
}

void JSONObject::set(char* key, int value)
{
  if(keyarraysize == 0)
  {
    memset(&retString[0], 0, sizeof(retString));
  }
  
  keyarray[keyarraysize] = key;
  values[valuearraysize] = value;
  keyarraysize++;
  valuearraysize++;
}

char * JSONObject::stringify()
{
  if(keyarraysize != 0 && valuearraysize != 0)
  {
    sprintf(holder[0],"{\"%s\":%d", keyarray[0],values[0]);
    strcat(retString,holder[0]);
    for(int i = 1; i<keyarraysize; i++)
    {
      sprintf(holder[i], ",\"%s\":%d",keyarray[i],values[i]);
      strcat(retString,holder[i]);
    }
    strcat(retString,"}");
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

}
