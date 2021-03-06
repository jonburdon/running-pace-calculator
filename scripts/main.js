  // Make DOM elements available for JavaScript use
  let numInputHrs = document.getElementById('num-input-hrs'),
      numInputMins = document.getElementById('num-input-mins'),
      numInputSecs = document.getElementById('num-input-secs'),
      distanceInputKm = document.getElementById('distance-input'),
      unitsInput = document.getElementById('units-input'),
// Output to this element
  numSecsInputHrs = document.getElementById('num-secs-hrs'),
  targetPaceSecs = document.getElementById('target-pace-secs'),
  targetPaceMins = document.getElementById('target-pace-mins'),
  unitsSelected = document.getElementById('units-display'),
  unitsSelectedForPace = document.getElementById('units-display-pace'),
  distanceSelected = document.getElementById('distance-display'),
  title1 = document.getElementById('title-1');
  
  // Add event listeners for each number input 
  // Assign appropriate reference function
  
  numInputHrs.addEventListener("change", findAllSplits);
  numInputMins.addEventListener("change", findAllSplits);
  numInputSecs.addEventListener("change", findAllSplits);
  distanceInputKm.addEventListener("change", findAllSplits);
  unitsInput = addEventListener("change", findAllSplits);

//  let distanceInMiles = distanceToRun/1.609344;
function findAllSplits() {

  if (document.getElementById('units-input').checked) {
    updateHrsSecs((0-(distanceInputKm.value)*10)/1.609344, "split-times-wrapper-slower");
    updateHrsSecs(((distanceInputKm.value)*10)/1.609344, "split-times-wrapper-faster");

  }
  else{
    updateHrsSecs(0-(distanceInputKm.value)*10, "split-times-wrapper-slower");
    updateHrsSecs((distanceInputKm.value)*10, "split-times-wrapper-faster");
  }

  updateHrsSecs(0, "split-times-wrapper");
}

  // Convert inputs to Seconds
  function updateHrsSecs(adjustment, whichColumn) {
    
    var hrsMins = getMins(parseInt(numInputHrs.value)),
        hrsMinsToAdd = getMins(parseInt(numInputMins.value)),
        hrsSecs = getSecs(hrsMins);
    var hrsSecsToAdd = parseInt(numInputSecs.value);
    var distanceToRun = distanceInputKm.value;

    hrsSecs = hrsSecs + hrsMinsToAdd + hrsSecsToAdd;

    hrsSecs = hrsSecs + adjustment;

    var timeForPace = hrsSecs;
    // Check Units
    let unitsChosen = "km", paceUnitsChosen = "km";

    if (document.getElementById('units-input').checked) {
      unitsChosen = "Miles";
      paceUnitsChosen = "Mile";
      timeForPace = timeForPace*1.609344;
      title1.innerHTML=paceUnitsChosen;

      
  } else {
      unitsChosen = "Km";
      paceUnitsChosen = "Km";
      title1.innerHTML=paceUnitsChosen;
  
  }

    // Clear Split Times
    let splitsparent = document.getElementById(whichColumn)
      while (splitsparent.firstChild) {
          splitsparent.firstChild.remove()
      }

    //Add New Split Times to wrapper
    
    // Decide if using km laps or mile maps
    let distanceInMiles = distanceToRun/1.609344;
    let numberOfLaps = distanceToRun; 
    if (document.getElementById('units-input').checked) {
      numberOfLaps = distanceInMiles;
      console.log('miles are activated', 'number of laps =', numberOfLaps);
  }  

    for (let i = 0; i < numberOfLaps; i++) {
      // let splitTimes = hrsSecs;
      let splitTimes = timeForPace;
      let splittime = document.createElement("p");
      let th = roundDownNum(((splitTimes/3600)/distanceToRun)*(i+1));
      let tm = (roundDownNum((splitTimes/distanceToRun)/60))*(i+1);
      let ts = (justSeconds((splitTimes/distanceToRun)/60))*(i+1);
      let extra = 0;
      // Check for fraction of distance in final lap
      console.log('i is', i, 'number of laps is', numberOfLaps);
      if (i === roundDownNum(numberOfLaps)) {
        let amountLeftToRun = numberOfLaps-roundDownNum(numberOfLaps);
        console.log('Extra little bit detected! number of laps =', numberOfLaps);
        extra = 1;
        let remainingSecs = hrsSecs/(roundDownNum(numberOfLaps));
        remainingSecs = remainingSecs*amountLeftToRun;
        console.log('Remaining Secs =', remainingSecs);
      th = roundDownNum(((splitTimes/3600)/distanceToRun)*(i));
      tm = (roundDownNum((splitTimes/distanceToRun)/60))*(i);
      // Use different units if Units are Miles

        if (document.getElementById('units-input').checked) {

          ts = (justSeconds((splitTimes/distanceToRun)/60))*(i)+remainingSecs;
        }
        else {
          ts = (justSeconds((splitTimes/distanceToRun)/60))*(i)+remainingSecs;
        } 
      
      tm = roundDownNum(tm);
      ts = roundDownNum(ts);
      }
      
      // Adjust seconds if they are over 60
      if (ts > 59) {
        tm = tm+roundDownNum((ts/60));
        let secAdjust = ts-(roundDownNum(ts/60)*60);
        ts = secAdjust;
      }

      // Adjust minutes if they are over 60
      if (tm > 59) {
        th = roundDownNum((tm/60));
        let minAdjust = th*60;

        tm = tm-minAdjust;

      }

      // Display lap info
      let lap = i+1;
      console.log('extra ' , extra);
      if (extra === 0) {
      splittime.innerText = paceUnitsChosen + " " + lap + ": " + th + " h " + tm + " m " + ts + "s";
      }
      else {
        splittime.innerText = "Finish Time: " + th + " h " + tm + " m " + ts + "s";

      }

      document.getElementById(whichColumn).appendChild(splittime);

    }
    // Change Text of last child in Splits
    //var lastSplit = document.getElementById("split-times-wrapper").lastChild.innerHTML;
    //var finalSplitMessage;
    //var selectFinalSplit = document.getElementById('split-times-wrapper');
    //lastSplit = "Final "+lastSplit; 
    //selectFinalSplit.lastChild.innerText = lastSplit;
    

    console.log('hrsMins', hrsMins, 'hrsSecs', hrsSecs, 'Extra Mins', hrsMinsToAdd, 'Extra Secs', hrsSecsToAdd, 'Distance: ', distanceToRun);
    numSecsInputHrs.value = roundDownNum(hrsSecs);
    targetPaceMins.innerHTML = roundDownNum((timeForPace/distanceToRun)/60);
    targetPaceSecs.innerHTML = justSeconds((timeForPace/distanceToRun)/60);
    distanceSelected.innerHTML = distanceToRun;
    unitsSelected.innerHTML = unitsChosen;
    unitsSelectedForPace.innerHTML = paceUnitsChosen;
  }
//})();

//Rounds up every time
function flattenNum(num) {
  return Math.ceil(num);
}
// Round down
function roundDownNum(num) {
  return Math.floor(num);
//      return(num);
}

function justSeconds(num) {
  let minutespart = Math.floor(num);
  let secondspart = Math.floor((num - minutespart)*60);
  return secondspart;
}

function getMos(num) {
  return num * 12;
}
function getDys(num) {
  return num * (365/12); // 30.41666666666667;
}
function getHrs(num) {
  return num * 24;
}
function getMins(num) {
  return num * 60;
}
function getSecs(num) {
  return num * 60;
}