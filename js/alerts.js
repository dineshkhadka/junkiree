/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

// Experimental and buggy as FUUCK!!

var startNotif = true;
var count = true;
var hideForNow = true;
var tdelays = {
    't1': 900000,
    't2': 1800000,
    't3': 3600000
};


/*
    - Gets the time remaining in milliseconds
    - Sets that as the timeout
    - Once time runs out, it fires a callback and the recursion kickstarts. Which then refreshes everything
*/

// TODO: If the Schedules are changed mid program. The notifications are shown at the previous groups time
function alertify(noMessage) {
    
    var timer = null;
    var delay = localStorage.NotifyID;
    var ti = new Date(); // It exists since it must be refreshed at each run.
    var tiTemplate = `${ti.getHours()} : ${ti.getMinutes()} : ${ti.getSeconds()}`
    var curTime = ToMilliseconds(tiTemplate);
    var status = TimeStatus(curTime, Millify());
    var timetick = status[2] - curTime;
    var deLorean = status[2] - parseInt(tdelays[delay], 10);
    

    // Attempt to clear a running timer
    window.clearTimeout(timer);
    
    // Template for the alert message
    var msgTemplate = `${normalizeTime(tdelays[delay])[1]}  Minutes left until ${(status[0] == true) ? 'power on' : 'power off'}`

    // TODO: Refactor the code as soon as possible. 
    if (curTime > deLorean) {
        timer = setTimeout(alertify, timetick);
        hideForNow = true;
        console.log("normalizeTime timeticked:" + normalizeTime(timetick));

    } else {

        if (hideForNow == false && noMessage == false && localStorage.notify == true) {
            NotifyUser('Junkiree', 'img/notification.png', msgTemplate);
        }
        
        timer = setTimeout(alertify, (deLorean - curTime));
        console.log("normalizeTime Delorean:" + normalizeTime(deLorean - curTime));
        hideForNow = false;
    }
}




// The code below checks for new scedules and figures out if this is the first run
if (localStorage.ScheduleJSON != null) {
    alertify()
    if (localStorage.AutoUpdate == 'true' && localStorage.lastUpdate != DateObject.getDay()) {
            console.log("Checked For a Update!")
            ParseRemoteSchedule(ScheduleURL);
            localStorage.setItem('lastUpdate', DateObject.getDay());

        }
} else {
    chrome.tabs.create({
        'url': 'first-run.html',
        'selected': true
    });

}
