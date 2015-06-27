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

        console.log(filterTime)
        console.log(jkFartSparkles(timetick))
        console.log("This Instant: "+thisInstant)
        console.log('This: '+jkFartSparkles(timetick))
        console.log('TimeTick: '+ timetick)
        console.log("Delorean: "+ deLorean)
        console.log(notifDict[before])

*/

// TODO: If the Schedules are changed mid program. The notifications are shown at the previous groups time





var alertify = function(noMessage) {
    var Ghadi = new Date();
    var thisInstant = jkToMilliseconds(Ghadi.getHours() + ':' + Ghadi.getMinutes() + ':' + Ghadi.getSeconds());
    var filterTime = jkTimeStatus(thisInstant, jkMillify());
    var timetick = filterTime[2] - thisInstant;
    var before = localStorage.jkNotifyID;

    var timer;
    var timerStarted = false;

    var deLorean = filterTime[2] - parseInt(notifDict[before], 10);
    console.log(filterTime);
    if (timerStarted !== false) {
        clearTimeOut(timer);
    }


    var msgTemplate = jkFartSparkles(notifDict[before])[1] + ' Minutes left till';
    msgTemplate += (filterTime[0] == true) ? ' power on' : ' power off';
    console.log(msgTemplate);

    if (thisInstant > deLorean) {
        var timer = setTimeout(alertify, timetick);
        timerStarted = true;
        hideForNow = true;
        console.log("Fartsparkles timeticked:" + jkFartSparkles(timetick));

    } else {

        if (hideForNow == false) {
            if (noMessage != true){
                 jkNotifyUser('Junkiree', 'img/bulb-on.png', msgTemplate);
        }
        }

        timer = setTimeout(alertify, (deLorean - thisInstant));
        timerStarted = true;
        console.log("Fartsparkles Delorean:" + jkFartSparkles(deLorean - thisInstant));
        hideForNow = false;
    }

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
