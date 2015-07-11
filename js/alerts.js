/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

// Experimental and buggy as FUUCK!!

var startNotif = true;
var count = true;
var hideForNow = true;
notifDict = {
    't1': 900000,
    't2': 1800000,
    't3': 3600000
};


/*
    - Gets the time remaining in milliseconds
    - Sets that as the timeout
    - Once time runs out, it fires a callback and the recursion kickstarts. Which then refreshes everything

        console.log(status)
        console.log(jkFartSparkles(timetick))
        console.log("This Instant: "+curTime)
        console.log('This: '+jkFartSparkles(timetick))
        console.log('TimeTick: '+ timetick)
        console.log("Delorean: "+ deLorean)
        console.log(notifDict[before])

*/

// TODO: If the Schedules are changed mid program. The notifications are shown at the previous groups time





var alertify = function(noMessage) {
    
var timer = null;

    var before = localStorage.jkNotifyID;

    var Ghadi = new Date();
    
    

    var ghadiTemplate = Ghadi.getHours() + ':' + Ghadi.getMinutes() + ':' + Ghadi.getSeconds();
    var curTime = jkToMilliseconds(ghadiTemplate);


    var status = jkTimeStatus(curTime, jkMillify());
    var timetick = status[2] - curTime;
    var deLorean = status[2] - parseInt(notifDict[before], 10);
    


    window.clearTimeout(timer);


    var msgTemplate = jkFartSparkles(notifDict[before])[1] + ' Minutes left till';
    msgTemplate += (status[0] == true) ? ' power on' : ' power off';
    console.log(msgTemplate);

    if (curTime > deLorean) {
        timer = setTimeout(alertify, timetick);
        hideForNow = true;
        console.log("Fartsparkles timeticked:" + jkFartSparkles(timetick));

    } else {

        if (hideForNow == false) {
            if (noMessage != true){
                 jkNotifyUser('Junkiree', 'img/bulb-on.png', msgTemplate);
        }
        }

        // initiate recursion after the timeout has been achieved
        // this will then refresh everything and dtermine the next timeout 
        timer = setTimeout(alertify, (deLorean - curTime));
        console.log("Fartsparkles Delorean:" + jkFartSparkles(deLorean - curTime));
        hideForNow = false;
    }
    console.log('This is a timer: '+timer)
}





if (localStorage.jkScheduleJSON != null) {
    alertify()
    if (localStorage.jkAutoUpdate == 'true' && localStorage.lastUpdate != DateObject.getDay()) {

            jkParseRemoteSchedule(jkScheduleURL);
            localStorage.setItem('lastUpdate', DateObject.getDay());

        }
} else {
    chrome.tabs.create({
        'url': 'first-run.html',
        'selected': true
    });

}
