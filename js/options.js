/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/
classDict = {
    'group1': 'g1',
    'group2': 'g2',
    'group3': 'g3',
    'group4': 'g4',
    'group5': 'g5',
    'group6': 'g6',
    'group7': 'g7'
};
groupDict = {
    'group1': 'Group 1',
    'group2': 'Group 2',
    'group3': 'Group 3',
    'group4': 'Group 4',
    'group5': 'Group 5',
    'group6': 'Group 6',
    'group7': 'Group 7'
};


notifTranslateDict = {
    't1': '15 Minutes',
    't2': '30 Minutes',
    't3': '1 Hour'
};


function jkPanelToggle(toggleID) {

    var pageSelector = document.getElementById('page-selector').getElementsByTagName('li');

    var panelSchedule = document.getElementById('tab-schedule');
    var panelOptions = document.getElementById('option-panel');
    var panelHelp = document.getElementById('help-panel');
    var groupSelector = document.getElementById('group-selector');

    $("#page-selector li").each(function(i, el) {
        if (i != toggleID) {
            $(this).removeClass('currentPanel');
        } else {
            $(this).addClass('currentPanel');
        }
    });


    if (toggleID == 0) {
        panelSchedule.classList.remove('hide');

        panelOptions.classList.add('hide');
        groupSelector.classList.remove('hide');
        panelHelp.classList.add('hide');
    } else if (toggleID == 1) {
        panelSchedule.classList.add('hide');
        panelOptions.classList.remove('hide');
        panelHelp.classList.add('hide');
        groupSelector.classList.add('hide');
    } else if (toggleID == 2) {
        panelHelp.classList.remove('hide');
        panelSchedule.classList.add('hide');
        panelOptions.classList.add('hide');
        groupSelector.classList.add('hide');
    }


}


function jkSeekHash() {

    var getHash = window.location.hash;

    // confirms that the hash is an accepted format and ignores the extra '#'
    var hashSchedules = /(\group)\d/i;

    if (getHash == '#help') {
        jkPanelToggle(2);

    } else if (getHash == '#options') {
        jkPanelToggle(1);
        initSetting();

    } else {
        var matchGroup = getHash.match(hashSchedules)[0];
        jkPanelToggle(0);
        jkListSchedules(matchGroup);

    // seek and destroy class='current' from all the li tags
    $("#group-selector li").each(function(i, el) {
            if ($(this) != null) {
                $(this).removeClass('current');
            }
    });

    $('#' + classDict[matchGroup]).addClass('current')

    }

}

function jkListSchedules(group) {
    for (var suru = 0; suru < jkDayArray.length; suru++) {
        $('#' + jkDayArray[suru]).html(jkDashify(group, jkDayArray[suru]));

    }
}

var optionGroup = document.getElementById('option-group');
var optionUpdate = document.getElementById('option-autoupdate');
var optionNotif = document.getElementById('option-notification');
var optionNotifTime = document.getElementById('option-notification-time');
var optionMilitaryTime = document.getElementById('option-military-time');
var msg = document.getElementById('messagebox');

var updateClick = document.getElementById('update-button');
var updateStatus = document.getElementById('update-status');


function initSetting() {
    // Storage Getters

    // Current Group
    var storageGroup = localStorage.getItem('jkOptionCurrentGroupIndex');
    var locateGroup = optionGroup.value;
    var thisGroup = optionGroup.getElementsByTagName('option');


    // Automatic update
    var storageUpdate = localStorage.getItem('jkAutoUpdate');
    var thisUpdate = optionUpdate.getElementsByTagName('input');

    // Notification switch
    var storageNotif = localStorage.getItem('jkNotify');
    var thisNotif = optionNotif.getElementsByTagName('input');


    //  Notification time
    var storageNotifTime = localStorage.getItem('jkNotifyID');
    var locateNotifTime = optionNotifTime.value;
    var thisNotifTime = optionNotifTime.getElementsByTagName('option');


    //  Meridian or Military
    var storageMilitaryTime = localStorage.getItem('jkMilitary');
    var thisMilitaryTime = optionMilitaryTime.getElementsByTagName('input');


    // Notification toggle
    if (storageNotif == 'true') {
        thisNotif[0].setAttribute('checked', 'chequed');
    } else {
        thisNotif[1].setAttribute('checked', 'chequed');
    }


    // Auto Update Toggle
    if (storageUpdate == 'true') {
        thisUpdate[0].setAttribute('checked', 'chequed');
    } else {
        thisUpdate[1].setAttribute('checked', 'chequed');
    }

    // Notif time selector
    var notifEndsWith = /\d/;
    var thisNotifID = parseInt(storageNotifTime.match(notifEndsWith), 10) - 1;

    thisNotifTime[thisNotifID].setAttribute('selected', 'selected');


    //
    thisGroup[storageGroup].setAttribute('selected', 'selected');

    //
    //

    if (storageMilitaryTime == 'true') {
        thisMilitaryTime[0].setAttribute('checked', 'chequed');
    } else {
        thisMilitaryTime[1].setAttribute('checked', 'chequed');
    }

    //

}



function jkSuccessMessage(content) {
    msg.innerHTML = content;
}

function readForm(ev) {
    msg.classList.remove('hide');
    var agroup = document.getElementById('option-group').value;
    if (ev == 'groupChanged') {
        var ogval = optionGroup.value;
        var gpat = /\d/; // Dirty: Seeks out the number from the values
        var setGroup = parseInt(ogval.match(gpat), 10) - 1;
        try {
            localStorage.setItem('jkOptionCurrentGroupIndex', setGroup);
            jkSuccessMessage('The Default group has been changed to: ' + groupDict[ogval]);
        } catch (ex) {
            alert('Error: There was an error storing your data. Please make sure You\'re browser is up to date');
        }
    } else if (ev == 'updateChanged') {

        /*  Note to Self: Radio buttons will not work like this in all cases
                - This is just a workaround
                - The form below has two radio buttons.
                - It checks if the first radio is checked.
                - If not checked, assumes the second radio must be checked.
                - If the first one is checked, gets its status without bothering to move to the second. Duh!

            The second radio buttons below work exactly the same like this.
        */
        var ucval = optionUpdate.getElementsByTagName('input')[0];
        var ucvalStatus = ucval.checked;
        try {
            localStorage.setItem('jkAutoUpdate', ucvalStatus);
            if (localStorage.getItem('jkAutoUpdate') == 'false') {

                jkSuccessMessage('Automatic update Disabled ');
            } else {
                jkSuccessMessage('Automatic Update enabled');
            }
        } catch (ex) {
            alert('There has been an error setting the option. \n' + ex);
        }

    } else if (ev == 'notifChanged') {
        var ncval = optionNotif.getElementsByTagName('input')[0];
        var ncvalStatus = ncval.checked;
        try {
            localStorage.setItem('jkNotify', ncvalStatus);
            if (localStorage.getItem('jkNotify') == 'false') {

                jkSuccessMessage('Notification has been switched off ');
            } else {
                jkSuccessMessage('Notification has been switched on ');
            }
        } catch (ex) {
            alert('There has been an error setting the option.');
        }

    } else if (ev == 'notifTimeChanged') {
        var ntcval = optionNotifTime.value;
        try {
            localStorage.setItem('jkNotifyID', ntcval);
            jkSuccessMessage('You will be notified before ' + notifTranslateDict[ntcval]);
        } catch (ex) {
            alert('There has been an error setting the option.\n' + ex);
        }
    } else if (ev == 'militaryChanged') {
        var mtval = optionMilitaryTime.getElementsByTagName('input')[0];
        var mtvalStatus = mtval.checked;

        try {
            localStorage.setItem('jkMilitary', mtvalStatus);
            if (localStorage.getItem('jkMilitary') == 'false') {

                jkSuccessMessage('The Time Format is now set to 12 hr');
            } else {
                jkSuccessMessage('The Time Format is now set to 24 hr');
            }
        } catch (ex) {
            alert('There has been an error setting the option.\n' + ex);
        }
        window.location.reload(); //The window requires a refresh in order apply the changes

    }

    chrome.runtime.getBackgroundPage(function(backgroundPage) {
        backgroundPage.alertify(true);
    });
}



// Listen if the user changes any of the settings
optionGroup.addEventListener('change', function() {
    readForm('groupChanged');
});
optionUpdate.addEventListener('change', function() {
    readForm('updateChanged');
});
optionNotif.addEventListener('change', function() {
    readForm('notifChanged');
});
optionNotifTime.addEventListener('change', function() {
    readForm('notifTimeChanged');
});
optionMilitaryTime.addEventListener('change', function() {
    readForm('militaryChanged');
});

updateClick.addEventListener('click', function() {
    jkParseRemoteSchedule(jkScheduleURL, true);
});


// Read the hash after the window loads assuming the page loads with a hash attached to it
window.onload = jkSeekHash;
window.addEventListener('hashchange', jkSeekHash, false);
