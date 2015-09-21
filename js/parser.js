'use strict';

if (/^((?!chrome).)*safari/i.test(navigator.userAgent)){
    alert("We have detected you are using Safari. Please switch to Chrome or Firefox to properly use this app.");
}

var weekAbbrev = {
    Mo: "monday",
    Tu: "tuesday",
    We: "wednesday",
    Th: "thursday",
    Fr: "friday",
    Sa: "saturday",
    Su: "sunday"
};

var badString = function(str){
	return str == null || str.trim().length === 0;
}
//returns an ics object
var parseCourseworkString = function(){

    var cs = document.getElementById("classes").value.trim(),
        quarterLength = document.getElementById("weeks").value.trim(),
        calObj = ics(),
        startDate = document.getElementById("startDate").value.trim() + " ";

    if(badString(cs)){ alert("Please copy paste in the Axess course table"); return; }
    if(badString(startDate)){ alert("Please input start date in the MM/DD/YYYY format"); return; }
    if(badString(quarterLength) || !_.isNumber(parseInt(quarterLength)) || parseInt(quarterLength) < 1){ 
    	alert("Please insert a valid number of weeks in the quarter.");
    	return;
    }

    var counter = 0;
	//removes descrepancy between Firefox and Chrome copy pasting.
	var prelimFilter = _.chain(cs.split("\n")).filter(function(row){
		return row.trim().length > 0
	}).value().join('\n').split('Academic Calendar Deadlines');

	_.chain(prelimFilter).map(function(row){
		return _.compact(row.split("\n"));
	}).filter(function(items){
		if(items.length != 6 && items.length > 3){
			counter ++;
		}
		return items.length === 6;
	}).map(function(items){
		var name = items[0],
            desc = items[1] + " Unit: " + items[2] + " Grading:" + items[3],
            location = items[5],
            timeObj = items[4].split(" "),
            timeStart = new Date(startDate + timeObj[1].substr(0, timeObj[1].length - 2) + " " + timeObj[1].substr(-2)),
            timeEnd = new Date(startDate + timeObj[3].substr(0, timeObj[3].length - 2) + " " + timeObj[3].substr(-2));

        if(timeStart===null || timeEnd === null || timeStart.toString()==="Invalid Date" || timeEnd.toString()==="Invalid Date"){
        	alert("Please input a correct start date format of MM/DD/YYYY");
        	throw "Badly formatted Start Date  (╯°□°）╯︵ ┻━┻";
        }

        var wkNumber = timeStart.getWeek(),
            repeat = timeObj[0].match(/.{1,2}/g).join(','),
            shiftedStart = Date.today().setWeek(wkNumber).sunday().last()[weekAbbrev[repeat.split(',')[0]]]().at(timeObj[1]), //Alterations to the dates because the library acts strangely
            shiftedEnd =   Date.today().setWeek(wkNumber).sunday().last()[weekAbbrev[repeat.split(',')[0]]]().at(timeObj[3]);

		calObj.addEvent(name, desc, location, shiftedStart, shiftedEnd, repeat, quarterLength * repeat.split(',').length);
	});

	calObj.download("schedule", ".ics");

	if(counter > 0){
		alert(counter + (counter > 1 ? " classes ": " class ") + "failed to be exported. The formatting was weird.")
	}

}

