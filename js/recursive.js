/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

// Experimental and buggy as FUUCK!!

var startNotif = true;
var count = true;
var hideForNow = true;
notifDict = {'t1': 900000, 't2':1800000, 't3':3600000}
// Note to self: Despite being a recursive function. The function doesn't hog resources
/*
	- Gets the time remaining in milliseconds
	- Sets that as the timeout
	- Once time runs out, it fires a callback and the recursion kickstarts. Which then refreshes everything
*/




function recursive(){
   console.log('Stormborn')
    if (localStorage.jkScheduleJSON != null){
        clea
        var Ghadi = new Date();
        var thisInstant = jkToMilliseconds(Ghadi.getHours()+':'+Ghadi.getMinutes()+':'+Ghadi.getSeconds());
        var filterTime = jkTimeStatus(thisInstant, jkMillify());
        var timetick = filterTime[2]-thisInstant;
        var before = localStorage.jkNotifyID
      

        var deLorean = filterTime[2]-parseInt(notifDict[before])


        console.log(filterTime)
        console.log(jkFartSparkles(timetick))
        console.log("This Instant: "+thisInstant)
        console.log('This: '+jkFartSparkles(timetick))
        console.log('TimeTick: '+ timetick)
        console.log("Delorean: "+ deLorean)
        console.log(notifDict[before])
        //

        if (thisInstant > deLorean){
            // Sleep until power on/off and restart the function
            //setTimeout(recursive, timetick);
            setTimeout(recursive, 4000);
            hideForNow = true;
            console.log("Fartsparkles timeticked:"+ jkFartSparkles(timetick))

        }

        else{
            if (hideForNow == false){
                jkNotifyUser('Title', 'img/bulb-on.png', jkFartSparkles(timetick)+' and'+ timetick);
              }
            //setTimeout(recursive, deLorean)
            setTimeout(recursive, 3000);
            console.log("Fartsparkles Delorean:"+ jkFartSparkles(deLorean))
            hideForNow = false;
            }
    }
    else{
        // The code below restarts `recursive()` after 30 seconds to recheck if the settings have been set
        // This basically assumes the user is going to download the settings.
        // TODO: Find a cleaner way to check for the settings
        console.log('It ain\'t nothin\'')
        setTimeout(recursive, 30000);

    }
}





//recursive()
