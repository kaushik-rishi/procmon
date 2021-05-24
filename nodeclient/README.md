
        /*
        - We are getting the details of the 100ms
        In that 100ms how much time was my computer idle for and how much total time has my computer spent in that 100 seconds
        */

        // totalDifference - idleDifference => the working time per a 100 ms

        /*
        NOTE: 
            * total is theroetically 100ms 
            * but due to the difference in sys times 
            * when the program is run it will vary +-6 ms from 100ms
        */

        /*
        calculate the percentage of used cpu
            * console.log((totalDifference - idleDifference) / totalDifference * 100);
            * 100 - idle% [idle% = idle/total*100]
        */
        

// we will get the current time and wait a 100ms and grab the cpu load times for the second time and calculate the cpu load in that 100 milliseconds

    // get ms in each mode, BUT this is since the reboot
    // so get it now and get it in every 100ms and then compare
    
/*
Object.keys(os).forEach((key) => {
    console.log(key);
    console.log(os[key]);
    console.log("----------------------------------\n");
});
*/

