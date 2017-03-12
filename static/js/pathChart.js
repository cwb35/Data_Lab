function pathBarChartBasics() {

		var margin = {top: 20, right: 10, bottom: 10, left: 30},
		width = 400,
	   	height = 320,
		barPadding = 1
		;
		
		return {
			margin : margin, 
			width : width, 
			height : height,  
			barPadding : barPadding
		}			
		;
	}

	function pathBarChart(data){

		var basics = pathBarChartBasics();
	
		var margin = basics.margin,
			w = basics.width,
		   	h = basics.height,
			barPadding = basics.barPadding
			;
		//Width and height
		//var w = 500;
		//var h = 300;
		//var margin = { left: 30, top: 30, right: 30, bottom: 30 };
		//var barPadding = .05;
		//var yColumn = "count";
		//var xColumn = "end";

		//Inner SVG dimensions
		var innerWidth  = w  - margin.left - margin.right;
		var innerHeight = h - margin.top  - margin.bottom;

		//var initialized = 0;

		// var xScale = d3.scaleBand()
		// 				//.domain(d3.range(dataset.length))
		// 				.range([0, innerWidth], barPadding)
		// 				.padding(barPadding);

		var xScale = d3.scaleLinear()
						//.domain([0, d3.max(dataset)])
						.range([0, innerWidth]);

		var cScale = d3.scaleLinear()
						.range([50, 250]);

		var lineScale = d3.scaleLinear().range([2, 10]);
		
		//Create SVG element
		var svg = d3.select("#plot2")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		//Linear Gradient
		// var svg = d3.select("body").append("svg")
  //                          .attr("width", 500)
  //                          .attr("height", 300);

		var defs = svg.append("defs");

		var gradient = defs.append("linearGradient")
		   .attr("id", "svgGradient")
		   .attr("x1", "0%")
		   .attr("x2", "100%")
		   .attr("y1", "50%")
		   .attr("y2", "50%");

		gradient.append("stop")
		   .attr('class', 'start')
		   .attr("offset", "0%")
		   .attr("stop-color", "red")
		   .attr("stop-opacity", 1);

		gradient.append("stop")
		   .attr('class', 'end')
		   .attr("offset", "100%")
		   .attr("stop-color", "blue")
		   .attr("stop-opacity", 1);

		//Adding text
		svg.append("text")             
	          .attr("transform",
	                "translate(" + (w/2) + " ," + 
	                               (innerHeight + margin.top - 10) + ")")
	          .style("text-anchor", "middle")
	          .text("Count");

	    svg.append("text")             
	          .attr("transform",
	                "translate(" + (w/2) + " ," + 
	                               (margin.top - 5) + ")")
	          .style("text-anchor", "middle")
	          .style("font-size", "20")
	          .style("font-weight", "thick")
	          .style("text-decoration", "underline")
	          .text("Top 10 Paths");

		//Appending group to svg
		var g = svg.append("g")
			.attr("id", "pathGroup1")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var g2 = svg.append("g")
			.attr("id", "pathGroup2")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//Adding x-axis to new group and translating axis
		var xAxisG = g.append("g")
			.attr("id", "pathChartXAxis")
			.attr("transform", "translate(0," + (innerHeight - margin.bottom - 30) + ")");

		//Adding y-axis to new group but setting no attributes
		//var yAxisG = g.append("g");

		//x and y axis
		var xAxis = d3.axisBottom(xScale);
		// var yAxis = d3.axisLeft(yScale);

		//function renderBarChart(data){

		console.log("RENDERING BAR CHART!");
		//initialized = 1;

		console.log(data);
		xScale.domain([0, d3.max(data, function (d){ return d['count']; })]);
		//xScale.domain(data.map( function (d){ return d[xColumn]; }));
		cScale.domain([d3.min(data, function (d){ return d['count']; }), d3.max(data, function (d){ return d['count']; })]);
		lineScale.domain([d3.min(data, function (d){ return d['count']; }), d3.max(data, function (d){ return d['count']; })]);
		//xAxisG.call(xAxis);
		// yAxisG.call(yAxis);

		var bars = g.selectAll("rect")
		   .data(data)
		   .enter()
		   .append("rect")
		   .attr("class", "pathRect")
		   .attr("x", function(d) {
		   		return 0;//xScale(d[xColumn]);
		   })
		   .attr("y", function(d, i) {
		   		return i * 25;//yScale(d[yColumn]);
		   })
		   .attr("height", "24px")
		   .attr("width", function(d) {
		   		return xScale(d['count']);
		   })
		   .attr("fill", function(d) { //"url(#svgGradient)")
		   		//console.log(cScale(d[yColumn]));
				return "rgb(0, 0, " + (Math.round(cScale(d['count']))) + ")";
		   })
		   .on("mouseover", function(d) {

		   		//console.log(latitudeScale(43.01));
				//Get this bar's x/y values, then augment for the tooltip
				//var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
				//var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;

				d3.select("#campussvg").transition().duration(2000);

				//Update the tooltip position and value
				d3.select("#pathLine")
					.attr("x1", longitudeScale(building_table.get(d['start'])[0]) - 4)
					.attr("x2", longitudeScale(building_table.get(d['end'])[0]) - 4)
					.attr("y1", latitudeScale(building_table.get(d['start'])[1]) + 4)
					.attr("y2", latitudeScale(building_table.get(d['end'])[1]) + 4)
					//.attr("stroke-width", lineScale(d['count']))
					.attr("class", "show");

					//.style("top", yPosition + "px");						
					//.select("#value")
					//.text("There are "+d.count+" people going to "+d.end);
		   		if (selectedBuilding == "None"){
			   		d3.selectAll(".circle")
			   			.attr("class", "uncolor");
			   	}
		   		console.log("#"+d['start'].replace(/\s/g, ""));
		   		d3.select("#"+d['start'].replace(/\s/g, ""))
		   			.attr("class", "selected");
		   		d3.select("#"+d['end'].replace(/\s/g, ""))
		   			.attr("class", "selected");
		   		// d3.selectAll(".circle")
		   		// 	.attr("class", "uncolor");

		   		// console.log("#"+d['start'].replace(/\s/g, ""));
		   		// d3.select("#"+d['start'].replace(/\s/g, ""))
		   		// 	.attr("class", "selected");
		   		// d3.select("#"+d['end'].replace(/\s/g, ""))
		   		// 	.attr("class", "selected");
				//Show the tooltip
				//d3.select("#pathLine").class("hidden", false);

		   })
		   .on("mouseout", function(d) {
		   
				//Hide the tooltip
				d3.select("#pathLine").classed("hidden", true);
				if (selectedBuilding == "None"){
					d3.selectAll(".uncolor")
			   			.attr("class", "circle");
			   		d3.selectAll(".selected")
			   			.attr("class", "circle");
		   		} else {
		   			d3.select("#"+d['end'].replace(/\s/g, ""))
		   				.attr("class", "circle");
		   		}
				// d3.selectAll(".uncolor")
		  //  			.attr("class", "circle");
		  //  		d3.selectAll(".selected")
		  //  			.attr("class", "circle");
				
		   });;

		g.selectAll("text")
		    .data(data)
   			.enter().append("svg:text")
     		.attr("x", 2)
     		.attr("y", function(d, i) { return (i * 25) + 12; })
     		.attr("class", "startLabel")
     		//.attr("fill", "#7FFF00")
     		//.attr("font-size", "10px")
		    .text(function(d){ return d['start']; });

		var endLabels = g2.selectAll("text")
		    .data(data)
   			.enter().append("svg:text")
     		//.attr("x", function(d) {
		   	//	return xScale(d['count']) - 2; })
		   	.attr("class", "endLabel")
		   	.attr("x", innerWidth)
     		.attr("y", function(d, i) { return (i * 25) + 12; })
     		//.attr("fill", "red")
     		//.attr("font-size", "10px")
		    //.attr("dx", -3) // padding-right
		    //.attr("dy", ".35em") // vertical-align: middle
		    .attr("text-anchor", "end") // text-align: right
		    //.attr("stroke", "white")
		    .text(function(d){ return d['end']; });

		xAxisG.call(xAxis);

	}
	
	function updatePathChart(data) {

		console.log(data);
		var basics = pathBarChartBasics();
	
		var margin = basics.margin,
			w = basics.width,
		   	h = basics.height,
			barPadding = basics.barPadding
			;

		//Inner SVG dimensions
		var innerWidth  = w  - margin.left - margin.right;
		var innerHeight = h - margin.top  - margin.bottom;

		var xScale = d3.scaleLinear()
						//.domain([0, d3.max(dataset)])
						.range([0, innerWidth]);

		var cScale = d3.scaleLinear()
						.range([50, 250]);

		var lineScale = d3.scaleLinear().range([2, 10]);

		var g = d3.select("#pathGroup1");

		var g2 = d3.select("#pathGroup2");
		
		var xAxisG = d3.select('#pathChartXAxis');
		
		var xAxis = d3.axisBottom(xScale);
		// var yAxis = d3.axisLeft(yScale);

		//function renderBarChart(data){

		console.log("g2:");
		console.log(g2);
		//initialized = 1;

		console.log(data);
		xScale.domain([0, d3.max(data, function (d){ return d['count']; })]);
		//xScale.domain(data.map( function (d){ return d[xColumn]; }));
		cScale.domain([d3.min(data, function (d){ return d['count']; }), d3.max(data, function (d){ return d['count']; })]);
		lineScale.domain([d3.min(data, function (d){ return d['count']; }), d3.max(data, function (d){ return d['count']; })]);
		
		var svg = d3.select("#plot2 svg").transition();

		var bars = g.selectAll("rect")
		   .data(data)
		   .on("mouseover", function(d) {

		   		console.log("HERE!");
				//Update the tooltip position and value
				d3.select("#pathLine")
					.attr("x1", longitudeScale(building_table.get(d['start'])[0]) - 4)
					.attr("x2", longitudeScale(building_table.get(d['end'])[0]) - 4)
					.attr("y1", latitudeScale(building_table.get(d['start'])[1]) + 4)
					.attr("y2", latitudeScale(building_table.get(d['end'])[1]) + 4)
					//.attr("stroke-width", lineScale(d['count']))
					.attr("class", "show");
		   		
		   		if (selectedBuilding == "None"){
			   		d3.selectAll(".circle")
			   			.attr("class", "uncolor");
			   		d3.select("#"+d['start'].replace(/\s/g, ""))
			   			.attr("class", "selected");
			   		d3.select("#"+d['end'].replace(/\s/g, ""))
			   			.attr("class", "selected");
			   	}
			   	else if(selectedBuilding == d['start']){
			   		console.log("#"+d['start'].replace(/\s/g, ""));
			   		d3.select("#"+d['start'].replace(/\s/g, ""))
			   			.attr("class", "selected");
			   		d3.select("#"+d['end'].replace(/\s/g, ""))
			   			.attr("class", "selected");
		   		}
		   		else if(d3.select("#"+d['end'].replace(/\s/g, "")).attr('class') != "selected"){
		   			d3.select("#"+d['end'].replace(/\s/g, ""))
			   			.attr("class", "selected");
		   		}

				//Show the tooltip
				//d3.select("#pathLine").class("hidden", false);

		   })
		   .on("mouseout", function(d) {
		   
				//Hide the tooltip
				d3.select("#pathLine").classed("hidden", true);
				if (selectedBuilding == "None"){
					d3.selectAll(".uncolor")
			   			.attr("class", "circle");
			   		d3.selectAll(".selected")
			   			.attr("class", "circle");
		   		} 
		   		else if(selectedBuilding == d['start']) {
		   			d3.select("#"+d['end'].replace(/\s/g, ""))
		   				.attr("class", "circle");
		   		}
		   		else if((d3.select("#"+d['end'].replace(/\s/g, "")).attr('class') == "selected") & (building_table.get(d['end'])[2] != selectedBuilding)){
		   			d3.select("#"+d['end'].replace(/\s/g, ""))
		   				.attr("class", "circle");
		   		}
				
		   });

	    //bars.select(".bar").transition()
		svg.selectAll('rect').duration(300)
		  	.attr("width", function(d) { return xScale(d['count']);})
		  	.attr("opacity",1);
		console.log("TEXT DATA!");
		console.log(data);
		g.selectAll(".startLabel")
		    .data(data)
		    .text(function(d){ 
		    	console.log("STARTING TEXT:");
		    	console.log(d['start']);
		    	return d['start']; }
		    );
		g.transition().duration(400);

		var endLabels = g2.selectAll("text")
		    .data(data)
   			// //.enter().append("svg:text")
   			// .attr("x", innerWidth)
     	// 	//.attr("x", function(d) {
		   	// //	return xScale(d['count']) - 2; })
		    .text(function(d){ return d['end']; });

		xAxisG.call(xAxis);

	}