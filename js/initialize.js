
/*

Junkiree v3.5.1
Copyright (C) 2015 by Dinesh Khadka [http://junkiree.github.io]


*/

//require('recursive.js')
var nepMonth = ['Baisakh','Jestha', 'Ashar', 'Shrawan', 'Bhadra', 'Ashoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
function init()
{
	/* 
		Search for the group Index. If not found, assume this is the first install
		and other options are not stored as well
	 	since the group index and the schedule itself is the important part
	*/

	// TODO: Specifying initialize.js as a background script throws a TypeError
	//       since the script is supposed to be imported by popup.html. Fix it.

	if  (localStorage.getItem('jkScheduleJSON') != undefined)
	{
				
				
				
				
				
				// Initialize the current Day
				
				var jkSetToday = document.getElementById('style-today');
				jkSetToday.innerHTML += jkFullDayArray[dataList().jkDayIndex];
				// end
				
				
				// Initialize Current Time
				var ctime, whatsItsName;
				thisHour = DateObject.getHours();
				thisMinute = DateObject.getMinutes();
				whatsItsName = '';
				var addZero = (thisMinute<10) ? '0': '';
				if (isMilitary == 'false'){
					whatsItsName = ' AM';
					if (thisHour > 12){
						thisHour -= 12;
						whatsItsName = ' PM';
				}
					
					
					
				}
				// end
				
				
				// Initialize schedule times for today and tommorow
				var jkSetCurTime = document.getElementById('style-current');
				jkSetCurTime.innerHTML += thisHour+':'+addZero+thisMinute+whatsItsName;
					
				var jkSetGroup = document.getElementById('style-group');
				jkSetGroup.innerHTML += jkGetSchedule(dataList().jkDefGroup(), 'title');
				
	
				jkAppendTimes('style-tommorow', dataList().jkDefGroup(), dataList().jkNextDayPrefix());
				jkAppendTimes('style-times', dataList().jkDefGroup(), dataList().jkDayPrefix);
				
				if (isMilitary=='false'){
					document.getElementById('style-times').classList.add('meridian-today');
					document.getElementById('style-tommorow').classList.add('meridian-tommorow');
				}
				else{
					document.getElementById('style-times').classList.add('military-today');
					document.getElementById('style-tommorow').classList.add('military-tommorow');
				}
				// end
				
				//Initialize Nepali Date
				// Thanks to @prashishh for the date converter library
				var main = new Object();
				main = engtonep.DateConversion(DateObject.getDate(),DateObject.getMonth()+1,DateObject.getFullYear());
				
				d = main.getDate();
				m = main.getMonth();
				y = main.getYear();
				
				
				var jkSetDate = document.getElementById('style-date');
				var output;
				
				if  (d>=11 && d<=13){
					output = 'th'

				}
				else{
					var endsWith = d % 10,
					output = ((d % 100 / 10) === 1) ? 'th' :
					(endsWith === 1) ? 'st' :
					(endsWith === 2) ? 'nd' :
					(endsWith === 3) ? 'rd' : 'th';

				}

				jkSetDate.innerHTML += d +'<sup>'+output+'</sup> of '+nepMonth[m-1];  //+', '+y+' B.S';
				//end
				
				
				 
				// Initialize Remaining time in HH:MM format
				var jkSetRemaining = document.getElementById('style-remaining');
				jkSetRemaining.innerHTML += remaining();
				
				
				
				// Initialize a circular progressbar using jQuery knob plugin
				$('.knob').knob();
				
				progress(powerStatus[1], powerStatus[2], curMS);
				var bulbType  = document.getElementById('bulb');
				if (powerStatus[0] == true){
					bulbType.src = 'img/bulb-off.png';
					 $('.knob').trigger(
					 'configure',
					 {
						'fgColor':'#FF7676',
						'bgColor':'#c0c0c0'
					 }
						);
				}
				else{
					
					bulbType.src = 'img/bulb-on.png';
					 $('.knob').trigger(
					 'configure',
					 {
						'fgColor':'#2d9',
						'bgColor':'#c0c0c0'
					 }
						);
				}
	
       
		
		
	   // Check update Once a day
	   
	if (localStorage.getItem('jkAutoUpdate') == 'true' && localStorage.getItem('lastUpdate') != DateObject.getDay()){
		   
		jkParseRemoteSchedule(jkScheduleURL);
		
	   }
	localStorage.setItem('lastUpdate', DateObject.getDay())
    console.log('Today is: ' + DateObject.getDay())
    
	}
	else{
				chrome.tabs.create({'url':'first-run.html','selected':true});
		
		
	}
}

window.onload = init