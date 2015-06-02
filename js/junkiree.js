/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/


var jkDayArray = ['sun','mon','tue','wed','thu','fri','sat'];
var jkFullDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var jkGroupArray = ['group1', 'group2', 'group3', 'group4', 'group5', 'group6', 'group7'];






// lastUpdate is set to be 351 since it acts as a unique number.
// These values are crucial for the app. Check them beforehand to avoid any errors
var storageKeys = ['jkAutoupdate','jkMilitary', 'jkNotify', 'jkNotifyID', 'jkOptionCurrentGroupIndex', 'lastUpdate'];
var storageValues = ['true', 'true', 'true', 't1', '0', '351']; 
for (var itemIndex = 0; itemIndex < 6; itemIndex++){
        if (localStorage.getItem(storageKeys[itemIndex]) == undefined){
            localStorage.setItem(storageKeys[itemIndex], storageValues[itemIndex])
        }
        
}



var DateObject = new Date();
var GroupIndex = localStorage.getItem('jkOptionCurrentGroupIndex');

var jkDayIndex = DateObject.getDay();
var jkDefGroup = jkGroupArray[GroupIndex];
var jkDayPrefix = jkDayArray[jkDayIndex];

var NextDayIndex = (jkDayIndex == 6) ? 0: jkDayIndex + 1;
var jkNextDayPrefix = jkDayArray[NextDayIndex];



var start;
var even = 0;
var dash = 0;   


var jkScheduleURL = 'schedule.json';
var passMessage;
function jkParseRemoteSchedule(jkJSONUrl, jkShowNotif){
    
try{
   $(document).ready(function() { //start
        $.getJSON(jkJSONUrl).done( function(jkData) {
        var jkArrayToString = JSON.stringify(jkData);

        //
        var issueId = jkData['issued']['issueId'];
        if (localStorage.getItem('jkScheduleJSON')!= undefined){
            

            /* 
                We make Use of issueId vs comparing the current date with the schedule release date.
                If there is any mistake in the schedules hosted in the server. Comparing it with
                the relese date will be problematic.

                If any mistakes are made in the server's schedules setting a new issueId and keeping the release dates intact is
                is easier. Then junkiree will consider it a new schedule it and update the database.
                IssueId can be a random number as well.

            */
            if (jkGetSchedule('issued','issueId') != issueId){
                  localStorage.setItem('jkScheduleJSON', jkArrayToString);
                  passMessage = 'A new schedule has been found and updated';
            }

            else{
               if (jkShowNotif != undefined ){

                passMessage = 'Your schedules are up to date';

               }

               
            }
        }
        else{
            localStorage.setItem('jkScheduleJSON', jkArrayToString);
            passMessage = 'A schedule has been downloaded';
        }

        jkNotifyUser('Schedule Updater', 'img/bulb-on.png', passMessage)
          });

      }); //end
       
    }
    catch(ex){
        
        passMessage = 'failed';
    }
  
   
   }

//jkParseRemoteSchedule(jkScheduleURL)
function jkGetSchedule(jkGroup, jkDay)
{   
    /*
        Returns all the schedules of a group if jkDay(day of the week) is not specified
    */
   var jkScheduleItem =  localStorage.getItem('jkScheduleJSON')
   var jkSchedule = JSON.parse(jkScheduleItem);
   if (jkGroup != undefined){
        if (jkDay != undefined){    
            return jkSchedule[jkGroup][jkDay];
                          }
        else{
            return jkSchedule[jkGroup];
            }
                      }
   else{
        return jkSchedule;
      
    }
    

}


//jkParseRemoteSchedule(jkScheduleURL);

var isMilitary  = localStorage.getItem('jkMilitary')
function jkDashify(_grp, _dte){
    
    
    /*
      - Seperates time with a dash('-') and breaks the line after every two schedule times.
      - The function takes in ['11:00','13:00','16:00','21:00'] and spits out
        "11:00 - 13:00 <br> 16:00 - 21:00"
    */

    var start;
    var even = 0;
    var dash = 0;   

    var jkScheduleContainer='';
    var jkCurSch = jkGetSchedule(_grp)[_dte];
        
    for (start=0; start < jkCurSch.length; start++){
        if (even == 2){
            jkScheduleContainer += '<br>';
            even = 1;
            }

        else{
            if (dash == 1){
                jkScheduleContainer += ' &mdash; ';
                dash = 0;
            }

            even++;
            dash++;
            }
        var _jkCurSch = jkCurSch[start];

        // isMilitary was supposed to and can be used as an argument instead of fetching lstorage

        if (isMilitary == 'false'){
                var toSplit = _jkCurSch.split(':');
                    
                if (toSplit[0]>12){
  
                        toSplit[0] -= 12;
                        toSplit[1] += ' PM'
                        var addZero = (toSplit[0]<10) ? '0': ''; 
                        toSplit[0] = addZero+toSplit[0];
                        // Hours greater than 12 are substracted and result in a single digit integer ie '7'. Add 0 before them.
                    }
                else{
                        toSplit[1] += ' AM';
                    }
                    
                    jkScheduleContainer += toSplit[0]+':'+toSplit[1];
                }
                else{
                jkScheduleContainer += jkCurSch[start];
                }
        }

        
    return jkScheduleContainer;

}





// Arguments and variables below these are not prefixed with jk because these were merged into junkiree.js from scheduler.js
function jkAppendTimes(identification, grp, dte){
$(document).ready(function() {
        var jkSetTime = document.getElementById(identification);
        jkSetTime.innerHTML += jkDashify(grp, dte);

                            });
}





function jkToMilliseconds(palkia) {
  // Input Format: either HH:MM or HH:MM:SS
  var dialga = palkia.split(':');
  if (typeof dialga[2] == 'undefined'){
    dialga[2] = 0;
  }
  // Arceus,I choose you!
  var arceus;

  //use the Roar of Time!
  arceus = (dialga[0] * 3600 + dialga[1] * 60)*1000 + dialga[2]*1000;
  // It was super effective. Foe Dialga fainted. 
  return arceus; 
}




function jkFartSparkles(theSlime) {
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
  theSlime %= sec
  toTimeNap = [
    Math.floor(hour),
    Math.floor(minute),
    Math.floor(seconds)
  ];
  
  // Perhaps they're not dorks after all
  return toTimeNap;
}

function jkTimeStatus(c,b){
    
    
    var content = [];
    for (var t = 0; t < b.length; t+=2){
        // If the current time is less than the first power cut of the day
        if (c <  b[0]){
            content = [false, 0, b[0]];
        }
  
        //If the current time is more than the final power cut of the day
        else if (c >= b[b.length-1]){
            
            // This below outputs the tme left till the first powercut of the next day
            // 86400000 equals 24:00
            content = [false,   b[b.length-1], jkMillify(jkGetSchedule(jkDefGroup, jkNextDayPrefix))[0]+86400000];
        }
        
        
        // If the current time falls under a power cut
        else if (c >= b[t] && c < b[t+1]){
            console.log('this one right here')
    
            content = [true, b[t], b[t+1]];
    
        }
        
        // If the current time falls outside a powercut
        else if (c>= b[t+1] && c < b[t+2]){
            content = [false, b[t+1], b[t+2]];
        }
    /*
    
        * if content[0] is true the power is currently off, if false the power is on. 
        * content[1] is the starting point and content[2] is the ending point.
    
    */
   
    }
    return content; 
    
}

                
var curMS = jkToMilliseconds(DateObject.getHours()+':'+DateObject.getMinutes()+':'+DateObject.getSeconds())
        
function jkMillify(){
    var _scheduleToMs = [];      
    range = jkGetSchedule(jkDefGroup, jkDayPrefix);
    for (list in range){
        _scheduleToMs[list] = jkToMilliseconds(range[list]);
        }
return _scheduleToMs;   
}



        
var powerStatus = jkTimeStatus(curMS, jkMillify());
function remaining(){
    var chewOnThis; 
    var sdate = document.getElementById('style-remaining');
    timeLeft = jkFartSparkles(powerStatus[2]-curMS);
    
    if (powerStatus[0] == true){
        sdate.classList.remove('powerOn');
        sdate.classList.add('powerOff');
        chewOnThis = 'Time till power on: ';
    }
    else if (powerStatus[0] == false){
        sdate.classList.add('powerOn')
        sdate.classList.remove('powerOff')
        chewOnThis = 'Time till power off: '
    }
    
    // Don't let the user see a big zero
    if (timeLeft[0]!= 0)
    {
        chewOnThis += timeLeft[0]+' Hours ';
    } 
    
    chewOnThis +=  timeLeft[1]+' Minutes';
 
 
 return chewOnThis;
                
}


function progress(startTime, endTime, currentTime){
    var $s = $('.knob');
    var p = Math.round(100*(currentTime-startTime)/(endTime-startTime));
    $s.val(p).trigger('change');
    return p;
    
}



function jkNotifyUser(junkireeTitle, junkireeIcon, junkireeMessage){

    // Note to self: This is probably chrome specific
    chrome.notifications.create('a04efjunkiree3490D',  {
    title: junkireeTitle,
    iconUrl: junkireeIcon,
    type: 'basic',
    message: junkireeMessage
}, function(){})
}




