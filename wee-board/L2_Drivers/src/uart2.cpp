/*
 *     SocialLedge.com - Copyright (C) 2013
 *
 *     This file is part of free software framework for embedded processors.
 *     You can use it and/or distribute it as long as this copyright header
 *     remains unmodified.  The code is free for personal use and requires
 *     permission to use in a commercial product.
 *
 *      THIS SOFTWARE IS PROVIDED "AS IS".  NO WARRANTIES, WHETHER EXPRESS, IMPLIED
 *      OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
 *      MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE APPLY TO THIS SOFTWARE.
 *      I SHALL NOT, IN ANY CIRCUMSTANCES, BE LIABLE FOR SPECIAL, INCIDENTAL, OR
 *      CONSEQUENTIAL DAMAGES, FOR ANY REASON WHATSOEVER.
 *
 *     You can reach the author of this software at :
 *          p r e e t . w i k i @ g m a i l . c o m
 */

#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>

#include "uart2.hpp"

#include "printf_lib.h"
#include "LPC17xx.h"
#include "lpc_sys.h"
#include "scheduler_task.hpp"
#include "shared_handles.h"
#include "utilities.h"      // system_get_timer_ms();


/**
 * IRQ Handler needs to be enclosed in extern "C" because this is C++ file, and
 * we don't want C++ to "mangle" our function name.
 * This ISR Function need needs to be named precisely to override "WEAK" ISR
 * handler defined at startup.cpp
 */
extern "C"
{
    void UART2_IRQHandler()
    {
        Uart2::getInstance().handleInterrupt();
    }
}

void Uart2::setBaudRate(unsigned int baudRate)
{
    /* Adding 0.5 to perform rounding correctly since we do not want
     * 1.9 to round down to 1, but we want it to round-up to 2.
     */

    mpUARTRegBase->LCR = (1 << 7); // Enable DLAB to access DLM, DLL, and IER
    {
        uint16_t bd = (mPeripheralClock / (16 * baudRate)) + 0.5;
        mpUARTRegBase->DLM = (bd >> 8);
        mpUARTRegBase->DLL = (bd >> 0);
    }
    mpUARTRegBase->LCR = 3; // Disable DLAB and set 8bit per char
}

bool Uart2::put(const char* pString, unsigned int timeout)
{
    if (!pString) {
        return false;
    }

    while(*pString) {
        if(!putChar(*pString++, timeout)) {
            return false;
        }
    }

    return true;
}

void Uart2::putline(const char* pBuff, unsigned int timeout)
{
    this->put(pBuff, timeout);
    this->put("\n", timeout);
}


void Uart2::handleInterrupt()
{
     /**
     * Bit Masks of IIR register Bits 3:1 that contain interrupt reason.
     * Bits are shifted left because reasonForInterrupt contains Bits 3:0
     */
    const uint16_t transmitterEmpty = (1 << 1);
    const uint16_t dataAvailable    = (2 << 1);
    const uint16_t dataTimeout      = (6 << 1);

    long higherPriorityTaskWoken = 0;
    long switchRequired = 0;
    char c = 0;
    unsigned charsSent = 0;

    uint16_t reasonForInterrupt = (mpUARTRegBase->IIR & 0xE);
    {
        /**
         * If multiple sources of interrupt arise, let this interrupt exit, and re-enter
         * for the new source of interrupt.
         */
        switch (reasonForInterrupt)
        {
            case transmitterEmpty:
            {
                if(uxQueueMessagesWaitingFromISR(mTxQueue) > mTxQWatermark) {
                    mTxQWatermark = uxQueueMessagesWaitingFromISR(mTxQueue);
                }

                /**
                 * When THRE (Transmit Holding Register Empty) interrupt occurs,
                 * we can send as many bytes as the hardware FIFO supports (16)
                 */
                const unsigned char hwTxFifoSize = 16;
                for(charsSent=0;
                        charsSent < hwTxFifoSize && xQueueReceiveFromISR(mTxQueue, &c, &higherPriorityTaskWoken);
                        charsSent++)
                {
                    mpUARTRegBase->THR = c;
                    if(higherPriorityTaskWoken) {
                        switchRequired = 1;
                    }
                }
            }
            break;

            case dataAvailable:
            case dataTimeout:
            {
                QueueHandle_t uart2rx_q = scheduler_task::getSharedObject(shared_UART2rxQueue);
                mLastActivityTime = xTaskGetTickCountFromISR();
                /**
                 * While receive Hardware FIFO not empty, keep queuing the data.
                 * Even if xQueueSendFromISR() Fails (Queue is full), we still need to
                 * read RBR register otherwise interrupt will not clear
                 */
                while (0 != (mpUARTRegBase->LSR & (1 << 0)))
                {
                    c = mpUARTRegBase->RBR;
                    xQueueSendFromISR(uart2rx_q, &c, &higherPriorityTaskWoken);
                    if(higherPriorityTaskWoken) {
                        switchRequired = 1;
                    }
                }

            }
            break;

            default:
                /* Read LSR register to clear Line Status Interrupt */
                reasonForInterrupt = mpUARTRegBase->LSR;
                break;
        }
    }

    portEND_SWITCHING_ISR(switchRequired);
}

bool Uart2::putChar(char out, unsigned int timeout)
{
    if(!xQueueSend(mTxQueue, &out, timeout))
    {
        return false;
    }

    const int uart_tx_is_idle = (1 << 6);
    if (mpUARTRegBase->LSR & uart_tx_is_idle)
    {
        if (xQueueReceive(mTxQueue, &out, 0)) {
            mpUARTRegBase->THR = out;
        }
    }

    return true;
}

bool Uart2::init(unsigned int baudRate, int txQSize)
{
    // Configure PINSEL for UART2.
    // UART2 RX/TX is at P0.10 and P0.11 or P2.8 and P2.9
    // SJ One Board uses P2.8 and P2.9
    LPC_PINCON->PINSEL4 &= ~(0xF << 16); // Clear values
    LPC_PINCON->PINSEL4 |=  (0xA << 16); // Set values for UART2 Rx/Tx

    // Set UART2 Peripheral Clock divider to 1
    lpc_pclk(pclk_uart2, clkdiv_1);
    const unsigned int pclk = sys_get_cpu_clock();

    mPeripheralClock = pclk;
    lpc_pconp(pconp_uart2, true);
    NVIC_EnableIRQ(UART2_IRQn);

    // Enable & Reset FIFOs and set 4 char timeout for Rx
    mpUARTRegBase->FCR = (1 << 0) | (1 << 6);
    mpUARTRegBase->FCR |= (1 << 1) | (1 << 2);

    setBaudRate(baudRate);

    // Set minimum queue size?
    if (txQSize < 9) txQSize = 8;

    // Create the receive and transmit queues
    if (!mTxQueue) mTxQueue = xQueueCreate(txQSize, sizeof(char));

    // Enable Tx and line status Interrupts:
    mpUARTRegBase->IER = (1 << 0) | (1 << 1) | (1 << 2); // B0:Rx, B1: Tx

    return (0 != mTxQueue);
}

Uart2::Uart2() : mpUARTRegBase((LPC_UART_TypeDef*) LPC_UART2_BASE),
        mTxQueue(0),
        mPeripheralClock(0),
        mTxQWatermark(0),
        mLastActivityTime(0)
{
    /* DO NOTHING */
}
