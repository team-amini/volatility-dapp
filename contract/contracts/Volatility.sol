pragma solidity ^0.4.0;
contract Volatility {
    
    int private maxNumRates = 30;
    int private lastItemIndex = -1;
    // array declaration do not take variables/constants. Super annoying.
    // so unit[maxNumberRates] not possible.
    mapping (string => uint[30]) private rates;
    uint public constant scalingfactor = 100;
    uint public constant precision = 10000;
    
    
        
    function deleteElement(uint index,uint[30] array) returns (uint[30]) {
        if (index > array.length) return;
        for (uint i = index; i < array.length-1;i++) {
            array[i] = array[i+1];
        }
        delete array[array.length - 1];
        lastItemIndex = int(array.length) - 2;
        return array;
    }

    /**
     * Pushes rate onto a fixed-length array. FIFO for overflow.
    **/
    function sendRate(string instrument, uint rate) {
        // TODO should include a check for valid instrument
        //rates[instrument].push(rate);
        if (lastItemIndex  == maxNumRates-1) {
            rates[instrument] = deleteElement(0,rates[instrument]);
        }
        lastItemIndex++;
        rates[instrument][uint(lastItemIndex)]= rate;
    }

    
    /**
    Input: instrument for rates are stored
    Return: A fixed length array of rates. Note that it is currently
    not possible in ethereum to return dynamic arrays.
    **/
    function getRates(string instrument) returns (uint[30]) {
        return rates[instrument];
    }
    
    /**
    Inefficient in that it loops through the entire array to compute max volatility.
    could be made better by just computing volatility on last 2 items.
    **/
    function calcVolatility (string instrument) returns (uint) {
        // TODO bounds checking
        uint maxchange = 0;
        uint endat = uint(lastItemIndex);
        for (uint i=0;i <= endat; i++) {
            if (i == 0) {
                continue;
            }
            uint change = ((rates[instrument][i]*precision)/rates[instrument][i-1]);
            // no abs function thus need to do this
            if (change > precision) {
                change = change - precision;
            }
            else {
                change = precision - change;
            }
            
            if (change > maxchange) {
                maxchange = change;
            }
        }
        return maxchange;
    }

    function clearRates(string instrument) {
        delete rates[instrument];
    }

    // function getPrecision() returns (uint) {
    //     return precision;
    // }

    // function getScalingFactor() returns (uint) {
    //     return scalingfactor;
    // }

}