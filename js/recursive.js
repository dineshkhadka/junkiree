/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

// Experimental and buggy as FUUCK!!

var startNotif = true;
var count = true;
var hideForNow = true;
notifDict = {'t1': 900000, 't2':1800000, 't3':3600000}


/*
	- Gets the time remaining in milliseconds
	- Sets that as the timeout
	- Once time runs out, it fires a callback and the recursion kickstarts. Which then refreshes everything
    
        console.log(filterTime)
        console.log(jkFartSparkles(timetick))
        console.log("This Instant: "+thisInstant)
        console.log('This: '+jkFartSparkles(timetick))
        console.log('TimeTick: '+ timetick)
        console.log("Delorean: "+ deLorean)
        console.log(notifDict[before])

*/



console.log('It\'s alive')



function recursive(){
   console.log('Stormborn')
    
        
        var Ghadi = new Date();
        var thisInstant = jkToMilliseconds(Ghadi.getHours()+':'+Ghadi.getMinutes()+':'+Ghadi.getSeconds());
        var filterTime = jkTimeStatus(thisInstant, jkMillify());
        var timetick = filterTime[2]-thisInstant;
        var before = localStorage.jkNotifyID

        var timer;
        var timerStarted = false

        var deLorean = filterTime[2]-parseInt(notifDict[before])
        console.log(filterTime)
        if (timerStarted != false){
            clearTimeOut(timer)
        }
        

        var msgTemplate = jkFartSparkles(notifDict[before])[1] + ' Minutes left till'
        msgTemplate += (filterTime[0] == true) ? ' power on': ' power off';
        console.log(msgTemplate)

        if (thisInstant > deLorean){
            // Sleep until power on/off and restart the function
            var timer = setTimeout(recursive, timetick);
            timerStarted = true;
            //setTimeout(recursive, 4000);
            hideForNow = true;
            console.log("Fartsparkles timeticked:"+ jkFartSparkles(timetick))

        }

        else{

            if (hideForNow == false){
                
                //jkNotifyUser('Junkiree', 'img/bulb-on.png', jkFartSparkles(timetick)+' and'+ timetick);
                
                jkNotifyUser('Junkiree', 'img/bulb-on.png', msgTemplate);

              }
            timer = setTimeout(recursive, (deLorean - thisInstant))
            timerStarted = true
            //setTimeout(recursive, 3000);
            console.log("Fartsparkles Delorean:"+ jkFartSparkles(deLorean - thisInstant))
            hideForNow = false;
            }
   
}





if (localStorage.jkScheduleJSON != null){
    recursive()
}
else{
    chrome.tabs.create({'url':'first-run.html','selected':true});
}
