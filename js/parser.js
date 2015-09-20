'use strict';


//returns an ics object
var parseCourseworkString = function(){


	var cs = document.getElementById("classes").value;
	var quarterLength = document.getElementById("weeks").value; //TODO FIXME

	var calObj = ics();
	//removes descrepancy between Firefox and Chrome copy pasting.
	var prelimFilter = _.chain(cs.split("\n")).filter(function(row){
		return row.trim().length > 0
	}).value().join('\n').split('Academic Calendar Deadlines');

	_.chain(prelimFilter).map(function(row){
		return row.split("\n");
	}).filter(function(items){
		items.length > 3;
	}).map(function(items){
		var name = items[0];
		var desc = items[1] + " Unit: " + items[2] + " Grading:" + items[3];
		var location = items[5]
		var timeObj = items[4].split(" ");
		var timeStart = timeObj[1];
		var timeEnd = timeObj[3];
		var repeat = timeObj[0].match(/.{1,2}/g).join(',');
		calObj.addEvent(name, desc, location, timeStart, timeEnd, repeat, quarterLength)
	});

	calObj.download("schedule", ".ics")

}

