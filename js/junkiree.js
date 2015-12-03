/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]

*/



var DayArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var FullDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var GroupArray = ['group1', 'group2', 'group3', 'group4', 'group5', 'group6', 'group7'];




var DateObject = new Date();
var remind = DateObject.getDay()

var dataList = function () {
    return {
        GroupIndex: localStorage.OptionCurrentGroupIndex,
        DayIndex: remind,
        DayPrefix: DayArray[remind],
        DefGroup: function () {
            return GroupArray[this.GroupIndex];
        },
        NextDayIndex: function () {
            return (this.DayIndex == 6) ? 0 : this.DayIndex + 1;
        },
        NextDayPrefix: function () {
            return DayArray[this.NextDayIndex()];
        }
    };

};




/* NOTES TO MY FUTURE SELF
 * local schedules: Testing purposes
 * cdn.rawgit [MaxCDN]: Provides higher bandwith but delay in updates to get noticed.
 * rawgit: Serves Schedules straight through Github but provides extremly lower bandwidths.
 
 * I highly doubt that the apps going to get more than half a dozen users.
 * Default to straight from git retrieval (rawgit).


 */

//var ScheduleURL = 'schedule.json';
//var ScheduleURL = 'https://cdn.rawgit.com/dineshkhadka/junkiree/master/schedule.json';
var ScheduleURL = 'https://rawgit.com/dineshkhadka/junkiree/master/schedule.json';
var passMessage;

function ParseRemoteSchedule(JSONUrl, ShowNotif) {
        $(document).ready(function () {
            $.getJSON(JSONUrl)

                // When the JSON gets succesfully downloaded
                .done(function (Data) {
                    var ArrayToString = JSON.stringify(Data); // Dictionaries?
                    var issueId = Data['issued']['issueId'];
                    if (localStorage.getItem('ScheduleJSON') != undefined) {
                        if (GetSchedule('issued', 'issueId') != issueId) {
                            localStorage.setItem('ScheduleJSON', ArrayToString);
                            passMessage = 'A new schedule was found and schedules were updated';
                        } else {
                            if (ShowNotif != undefined) {

                                passMessage = 'Your schedules are up to date';
                            }
                        }
                    } else {
                        localStorage.setItem('ScheduleJSON', ArrayToString);
                        passMessage = 'A schedule has been downloaded';
                    }

                    NotifyUser('Schedule Updater', 'img/notification.png', passMessage);
                })

                // When the JSON retrieval returns an error
                .error(function () {
                    NotifyUser('Schedule Updater', 'icons/junkiree-48.png', "Failed to Update schedules. Please check your internet connection");
                });

            ;

        }); //end


}

//ParseRemoteSchedule(ScheduleURL)
function GetSchedule(Group, Day) {
    /*
     * Returns all the schedules of a group if Day(day of the week) is not specified
     */
    var ScheduleItem = localStorage.getItem('ScheduleJSON');
    var Schedule = JSON.parse(ScheduleItem);
    if (Group != undefined) {
        if (Day != undefined) {
            return Schedule[Group][Day];
        } else {
            return Schedule[Group];
        }
    } else {
        return Schedule;

    }


}


//ParseRemoteSchedule(ScheduleURL);

var isMilitary = localStorage.getItem('Military');

function Dashify(curGroup, curDate) {
    var start;
    var even = 0;
    var dash = 0;

    var ScheduleContainer = '';
    var CurSch = GetSchedule(curGroup)[curDate];

    for (start = 0; start < CurSch.length; start++) {
        if (even == 2) {
            ScheduleContainer += '<br>';
            even = 1;
        } else {
            if (dash == 1) {
                ScheduleContainer += ' &mdash; ';
                dash = 0;
            }
            even++;
            dash++;
        }
        
        // Convert to military time to layman time
        // Note to self: This causes some performance issues since it runs inside a loop
        /* TODO: Rewrite this function (Dashify) so it caches the schedule array 
                 containing layman(?) times.
         * However it doesn't put a lot of strain on a dual core cpu
         */
        if (isMilitary == 'false') {
            var toSplit = CurSch[start].split(':');
            if (toSplit[0] > 12) {
                toSplit[0] -= 12;
                toSplit[1] += ' PM';
                var addZero = (toSplit[0] < 10) ? '0' : '';
                toSplit[0] = addZero + toSplit[0];
                // Hours greater than 12 are substracted and result in a single digit integer ie '7'. Add 0 before them.
            } else {
                toSplit[1] += ' AM';
            }

            ScheduleContainer += toSplit[0] + ':' + toSplit[1];
        } else {
            ScheduleContainer += CurSch[start];
        }
    }

    if (CurSch.length == 2) {
        ScheduleContainer += ' <br> -' // A workaround to fix a glitch
    }

    return ScheduleContainer;

}




function AppendTimes(identification, grp, dte) {
    $(document).ready(function () {

        $('#' + identification).append(Dashify(grp, dte));

    });
}




function ToMilliseconds(palkia) {
    var dialga = palkia.split(':');
    if (typeof dialga[2] == 'undefined') {
        dialga[2] = 0;
    }
    var arceus;
    arceus = (dialga[0] * 3600 + dialga[1] * 60) * 1000 + dialga[2] * 1000;
    return arceus;
}




function normalizeTime(theSlime) {
    var toTimeNap = [];
    //theSlime /= 1000;
    var hr = 1000 * 60 * 60;
    var min = 1000 * 60;
    var sec = 1000;

    // These variables kind of... look, like, dorks
    var hour = theSlime / hr;
    theSlime %= hr;
    var minute = theSlime / min;
    theSlime %= min;
    var seconds = theSlime / sec;
    theSlime %= sec;
    toTimeNap = [
        Math.floor(hour),
        Math.floor(minute),
        Math.floor(seconds)
    ];

    // Perhaps they're not dorks after all
    return toTimeNap;
}

function TimeStatus(c, b) {


    var content = [];
    for (var t = 0; t < b.length; t += 2) {
        // If the current time is less than the first power cut of the day
        if (c < b[0]) {
            content = [false, 0, b[0]];
        }

        //If the current time is more than the final power cut of the day
        else if (c >= b[b.length - 1]) {

            // This below outputs the tme left till the first powercut of the next day
            // 86400000 equals 24:00
            content = [false, b[b.length - 1], Millify()[0] + 86400000];
        }


        // If the current time falls under a power cut
        else if (c >= b[t] && c < b[t + 1]) {
            content = [true, b[t], b[t + 1]];

        }

        // If the current time falls outside a powercut
        else if (c >= b[t + 1] && c < b[t + 2]) {
            content = [false, b[t + 1], b[t + 2]];
        }

        /*
         * if content[0] is true the power is currently off, if false the power is on.
         * content[1] is the starting point and content[2] is the ending point.
         */

    }
    return content;

}


var curMS = ToMilliseconds(DateObject.getHours() + ':' + DateObject.getMinutes() + ':' + DateObject.getSeconds());

function Millify() {
    var _scheduleToMs = [];
    range = GetSchedule(dataList().DefGroup(), dataList().DayPrefix);
    for (var list in range) {
        _scheduleToMs[list] = ToMilliseconds(range[list]);
    }
    return _scheduleToMs;
}




var powerStatus = TimeStatus(curMS, Millify());

function remaining() {
    var chewOnThis;

    timeLeft = normalizeTime(powerStatus[2] - curMS);
    if (powerStatus[0] == true) {
        $('#style-remaining').removeClass('powerOn');
        $('#style-remaining').addClass('powerOff');
        chewOnThis = 'Time till power on: ';
    } else if (powerStatus[0] == false) {
        $('#style-remaining').addClass('powerOn');
        $('#style-remaining').removeClass('powerOff');
        chewOnThis = 'Time till power off: '
    }

    // Don't let the user see a big zero
    if (timeLeft[0] != 0) {
        chewOnThis += timeLeft[0] + ' Hours ';
    }

    chewOnThis += timeLeft[1] + ' Minutes';
    return chewOnThis;

}


function progress(startTime, endTime, currentTime) {
    var $s = $('.knob');
    var p = Math.round(100 * (currentTime - startTime) / (endTime - startTime));
    $s.val(p).trigger('change');

}

function nullFunc(){
    // This area is intentionally left blank
}

function NotifyUser(junkireeTitle, junkireeIcon, junkireeMessage) {
    // Note to self: This is probably chrome specific
    chrome.notifications.create('jidae4f351adddf', {
        title: junkireeTitle,
        iconUrl: junkireeIcon,
        type: 'basic',
        message: junkireeMessage
    }, nullFunc);

    // Self destruct in 4 seconds [Note to self: 5 seconds seemed longer and 3 seemed short]
    setTimeout(function () {
        chrome.notifications.clear('jidae4f351adddf', nullFunc)
    }, 4000);
}