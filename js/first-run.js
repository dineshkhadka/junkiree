/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

function setOptions() {
    var idGroup = document.getElementById("group");
    var idMain = document.getElementById("main");
    var getGroupValue = parseInt(idGroup.value, 10) - 1;

    localStorage.setItem("AutoUpdate", "true");
    localStorage.setItem("Notify", "true");
    localStorage.setItem("NotifyID", "t1");
    localStorage.setItem("Military", "true");

    try {
        //ParseRemoteSchedule(ScheduleURL)
        // Local schedules are read quicker. 
        ParseRemoteSchedule('schedule.json');
        localStorage.setItem("OptionCurrentGroupIndex", getGroupValue);
        //  My dog rest his face on the keyboard and typed this: 
        //        AQ1W
        idMain.innerHTML = "<h1 class=\"allset\">All set!</h1>";
        chrome.runtime.getBackgroundPage(function (backgroundPage) {
            backgroundPage.alertify();
        });
    } catch (ex) {
        idMain.innerHTML = "<h1 class=\"allset\">Error installing: <br>" + ex + "<br> Please retry</h1>";
    }
    // This message will self-destruct in 3 seconds
    setTimeout(function () {
        window.close();
    }, 3000);
}

window.addEventListener("change", setOptions, false);
