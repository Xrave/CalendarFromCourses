'use strict';

var weekAbbrev = {
    Mo: "monday",
    Tu: "tuesday",
    We: "wednesday",
    Th: "thursday",
    Fr: "friday",
    Sa: "saturday",
    Su: "sunday"
};

//returns an ics object
var parseCourseworkString = function(){

    var cs = document.getElementById("classes").value.trim(),
        quarterLength = document.getElementById("weeks").value.trim(),
        calObj = ics(),
        startDate = document.getElementById("startDate").value.trim() + " ";
    
	//removes descrepancy between Firefox and Chrome copy pasting.
	var prelimFilter = _.chain(cs.split("\n")).filter(function(row){
		return row.trim().length > 0
	}).value().join('\n').split('Academic Calendar Deadlines');

	_.chain(prelimFilter).map(function(row){
		return _.compact(row.split("\n"));
	}).filter(function(items){
		return items.length > 3;
	}).map(function(items){
		var name = items[0],
            desc = items[1] + " Unit: " + items[2] + " Grading:" + items[3],
            location = items[5],
            timeObj = items[4].split(" "),
            timeStart = new Date(startDate + timeObj[1].substr(0, timeObj[1].length - 2) + " " + timeObj[1].substr(-2)),
            timeEnd = new Date(startDate + timeObj[3].substr(0, timeObj[3].length - 2) + " " + timeObj[3].substr(-2)),
            wkNumber = timeStart.getWeek(),
            repeat = timeObj[0].match(/.{1,2}/g).join(','),
            shiftedStart = Date.today().setWeek(wkNumber).sunday().last()[weekAbbrev[repeat.split(',')[0]]]().at(timeObj[1]), //Alterations to the dates because the library acts strangely
            shiftedEnd =   Date.today().setWeek(wkNumber).sunday().last()[weekAbbrev[repeat.split(',')[0]]]().at(timeObj[3]);

		calObj.addEvent(name, desc, location, shiftedStart, shiftedEnd, repeat, quarterLength * repeat.split(',').length);
	});

	calObj.download("schedule", ".ics");

}

