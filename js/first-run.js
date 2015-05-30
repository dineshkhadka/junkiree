

function setOptions(){
      var idGroup = document.getElementById("group")
      var idMain = document.getElementById("main")
      var getGroupValue = parseInt(idGroup.value)-1
 
      localStorage.setItem("jkAutoUpdate", "true" )
      localStorage.setItem("jkNotify", "true" )
      localStorage.setItem("jkNotifyID", "t1" )
      localStorage.setItem("jkMilitary", "true" )
  
      try{
	         jkParseRemoteSchedule(jkScheduleURL)
           localStorage.setItem("jkOptionCurrentGroupIndex", getGroupValue )
           //  My dog rest his face on the keyboard and typed this: 
           //				AQ1W
           idMain.innerHTML = "<h1 class=\"allset\">All set!</h1>"
          }
       catch(ex){
           idMain.innerHTML = "<h1 class=\"allset\">Error installing:<br>"+ex+"<br> Please retry</h1>"
          }
       // This message will self-destruct in 3 seconds
        recursive()
       setTimeout(function(){ window.close()}, 3000)
}

window.addEventListener("change", setOptions, false)