#ifndef UART2_HPP__
#define UART2_HPP__

#include "FreeRTOS.h"
#include "LPC17xx.h"
#include "semphr.h"
#include "singleton_template.hpp"  // Singleton Template
#include "task.h"
#include "queue.h"

class Uart2 : public SingletonTemplate<Uart2>
{
    public:

        void setBaudRate(unsigned int baudRate);
        
        bool put  (const char* pString, unsigned int timeout=0xffffffff);
        void putline(const char* pBuff, unsigned int timeout=0xffffffff);

        /**
         * Initializes UART2 at the given @param baudRate
         * @param rxQSize   The size of the receive queue  (optional, defaults to 32)
         * @param txQSize   The size of the transmit queue (optional, defaults to 64)
         */
        bool init(unsigned int baudRate, int txQSize=64);

        /**
        * Callback function for Uart2 interrupt
        */
        void handleInterrupt();
    
    private:
        bool putChar(char out, unsigned int timeout);
        Uart2();  ///< Private constructor of this Singleton class
        friend class SingletonTemplate<Uart2>;  ///< Friend class used for Singleton Template

        LPC_UART_TypeDef* mpUARTRegBase;///< Pointer to UART's memory map
        QueueHandle_t mTxQueue;         ///< Queue for UARTs transmit buffer
        uint32_t mPeripheralClock;      ///< Peripheral clock as given by constructor
        uint16_t mTxQWatermark;         ///< Watermark of Tx Queue
        TickType_t mLastActivityTime;   ///< updated each time last rx interrupt occurs
};


#endif /* UART2_HPP__ */