/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

//require('recursive.js')
var nepMonth = ['Baisakh', 'Jestha', 'Ashar', 'Shrawan', 'Bhadra', 'Ashoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];

$('document').ready(function(){
    if (localStorage.jkScheduleJSON != undefined) {

        var ctime;
        var whatsItsName = '';
        thisHour = DateObject.getHours();
        thisMinute = DateObject.getMinutes();
        var addZero = (thisMinute < 10) ? '0' : '';
        if (isMilitary == 'false') {
            whatsItsName = ' AM';
            if (thisHour > 12) {
                thisHour -= 12;
                whatsItsName = ' PM';
            }
        }

        $('#style-today').html(jkFullDayArray[dataList().jkDayIndex])
        $('#style-current').html(thisHour + ':' + addZero + thisMinute + whatsItsName);
        $('#style-group').html(jkGetSchedule(dataList().jkDefGroup(), 'title'));


        jkAppendTimes('style-tommorow', dataList().jkDefGroup(), dataList().jkNextDayPrefix());
        jkAppendTimes('style-times', dataList().jkDefGroup(), dataList().jkDayPrefix);

        if (isMilitary == 'false') {
            $('#style-times').addClass('meridian-today')
            $('#style-tommorow').addClass('meridian-tommorow')
        } else {
            $('#style-times').addClass('military-today');
            $('#style-tommorow').addClass('military-tommorow');
        }


        var main = new Object();
        var output;

        main = engtonep.DateConversion(DateObject.getDate(), DateObject.getMonth() + 1, DateObject.getFullYear());

        d = main.getDate();
        m = main.getMonth();
        y = main.getYear();

        if (d >= 11 && d <= 13) {
            output = 'th';

        } else {
            var endsWith = d % 10,
                output = ((d % 100 / 10) === 1) ? 'th' : (endsWith === 1) ? 'st' : (endsWith === 2) ? 'nd' : (endsWith === 3) ? 'rd' : 'th';

        }

        $('#style-date').html(d + '<sup>' + output + '</sup> of ' + nepMonth[m - 1]); //+', '+y+' B.S';
        $('#style-remaining').html(remaining())
        $('.knob').knob();

        progress(powerStatus[1], powerStatus[2], curMS);
        var bulbType = document.getElementById('bulb');
        if (powerStatus[0] == true) {
            bulbType.src = 'img/bulb-off.png';
            $('.knob').trigger(
                'configure', {
                'fgColor': '#FF7676',
                    'bgColor': '#c0c0c0'
            });
        } else {

            bulbType.src = 'img/bulb-on.png';
            $('.knob').trigger(
                'configure', {
                'fgColor': '#2d9',
                    'bgColor': '#c0c0c0'
            });
        }

    } else {
        chrome.tabs.create({
            'url': 'first-run.html',
            'selected': true
        });


    }


});



