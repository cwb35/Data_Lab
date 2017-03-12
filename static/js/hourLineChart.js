function scatterPlotBasics(){
		var margin = {top: 25, right: 30, bottom: 30, left: 50},
			width = 400,
		   	height = 300,
			circleRadius = 5
			;
		
		return {
			margin : margin, 
			width : width, 
			height : height,
			circleRadius : circleRadius 
		};			
		
	}

	function hourScatterPlot(data){

		data.forEach(function(d){
			lineData.push(d);
		});
		var hourLookup = d3.map();
		data.forEach(function(d, i){
    		hourLookup = hourLookup.set(d.Hour, i);
			d.Count = +d.Count;
		});

		var basics = scatterPlotBasics();
		var margin = basics.margin,
			w = basics.width,
		   	h = basics.height,
		   	circleRadius = basics.circleRadius
			;

      	//Inner SVG dimensions
      	var innerWidth  = w - margin.left - margin.right;
      	var innerHeight = h - margin.top  - margin.bottom;

      	var svg = d3.select("#plot1").append("svg")
        	.attr("width", w)
        	.attr("height", h);

      	var xScale = d3.scaleLinear().rangeRound([0, innerWidth]);
      	var yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);

      	var bisectHour = d3.bisector(function(d) { return d['Hour']; }).left;

      	//Appending group to svg
      	var g = svg.append("g")
      		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      	//Adding x-axis to new group and translating axis
      	var xAxisG = g.append("g")
      				.attr("id", "lineChartXAxis")
                    .attr("transform", "translate(0," + innerHeight + ")");

      	//Adding y-axis to new group but setting no attributes
      	var yAxisG = g.append("g")
      					.attr("id", "lineChartYAxis");

      	//x and y axis
      	var xAxis = d3.axisBottom(xScale);
      	var yAxis = d3.axisLeft(yScale);

      	console.log("HOW ARE YOU GETTING HERE!?");
      	// text label for the y axis
	    g.append("text")
	            .attr("transform", "rotate(-90)")
	            .attr("y", 0 - margin.left)
	            .attr("x",0 - (innerHeight / 2))
	            .attr("dy", "1em")
	            .style("text-anchor", "middle")
	            .text("Count");

	    // text label for the x axis
	    svg.append("text")             
	          .attr("transform",
	                "translate(" + (w/2) + " ," + 
	                               (innerHeight + margin.top + 30) + ")")
	          .style("text-anchor", "middle")
	          .text("Hour");
	    // Title
	    svg.append("text")             
	          .attr("transform",
	                "translate(" + (w/2) + " ," + 
	                               (margin.top - 10) + ")")
	          .style("text-anchor", "middle")
	          .style("font-size", "20")
	          .style("font-weight", "thick")
	          .style("text-decoration", "underline")
	          .text("# Connections per Hour ");

        //xScale.domain(data.map( function (d){ return d['Hour']; }));
        xScale.domain(d3.extent(data, function(d) { return d['Hour']; }));
        yScale.domain([0, d3.max(data, function (d){ return d['Count']; })]);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        //line
      	var line = d3.line()
		    .x(function(d) { return xScale(d['Hour']); })
		    .y(function(d) { return yScale(d['Count']); });

		var timeLine = g.append("path")
					      .datum(data)
					      .attr("id", "linePath")
					      .attr("fill", "none")
					      .attr("stroke", "steelblue")
					      .attr("stroke-linejoin", "round")
					      .attr("stroke-linecap", "round")
					      .attr("stroke-width", 1.5)
					      .attr("d", line);

		var focus = svg.append("g")
		      .attr("class", "focus")
		      .style("display", "none");

		focus.append("circle")
		      .attr("r", 4.5);

		focus.append("text")
		      .attr("x", 9)
		      .attr("dy", ".35em");

		svg.append("rect")
		      .attr("class", "overlay")
		      .attr("width", w)
		      .attr("height", h)
		      .on("mouseover", function() { focus.style("display", null); })
		      .on("mouseout", function() { focus.style("display", "none"); })
		      .on("mousemove", mousemove);

		function mousemove() {
		    var x0 = xScale.invert(d3.mouse(this)[0] - margin.left);
		    if (x0 < d3.min(data, function (d){ return d['Hour']; })) {
		    	x0 = d3.min(data, function (d){ return d['Hour']; });
		    }
		    if (x0 > d3.max(data, function (d){ return d['Hour']; })) {
		    	x0 = d3.max(data, function (d){ return d['Hour']; });
		    }
		    var i = hourLookup.get(Math.round(x0));
		    if (i<=0){
		    	d = data[0];
		    } else {
			    var d0 = data[i - 1];
			    console.log(d0)
			    var d1 = data[i],
			        d = x0 - d0['Hour'] > d1['Hour'] - x0 ? d1 : d0;
			}
		    focus.attr("transform", "translate(" + (margin.left + xScale(d['Hour'])) + "," + (margin.top + yScale(d['Count'])) + ")");
		    focus.select("text").text(d['Count']);
			
		}
		// function mousemove() {
		//     var x0 = xScale.invert(d3.mouse(this)[0] - margin.left);
		//     var i = bisectHour(data, x0, d3.min(data, function (d){ return d['Hour']; }));
		//     console.log("I: ", i);

		//     if (i <= d3.max(data, function (d){ return d['Hour']; }) && i>d3.min(data, function (d){ return d['Hour']; })){
		// 	    var d0 = data[i - 1];
		// 	    console.log(d0)
		// 	    var d1 = data[i],
		// 	        d = x0 - d0['Hour'] > d1['Hour'] - x0 ? d1 : d0;
		// 	    focus.attr("transform", "translate(" + (margin.left + xScale(d['Hour'])) + "," + (margin.top + yScale(d['Count'])) + ")");
		// 	    focus.select("text").text(d['Count']);
		// 	} else {
		// 		//console.log("CAUGHT EXCEPTION!");
		// 	}
		// }
	}
    function updateLineChart(data){

    	console.log("BEFORE SORTING!", data);

    	function compareHours(a, b){
    		if (a.Hour < b.Hour){ return -1; }
    		if (a.Hour > b.Hour){ return 1; }
    		return 0;
    	}

    	var data2 = data.sort(compareHours);
    	console.log("AFTER SORTING!", data2);

    	var hourLookup = d3.map();
    	if (data.length == lineData.length){
    		console.log("THIS IS WORKING!");
    	}
    	else {
    		console.log("THEY ARE DIFFERNET LENGTHS!");
    		console.log(data.length);
    	}
    	data.forEach(function(d, i){
    		hourLookup = hourLookup.set(d.Hour, i);
			d.Count = +d.Count;
		});
    	console.log(hourLookup);
    	var basics = scatterPlotBasics();
		var margin = basics.margin,
			w = basics.width,
		   	h = basics.height,
		   	circleRadius = basics.circleRadius
			;

      	//Inner SVG dimensions
      	var innerWidth  = w - margin.left - margin.right;
      	var innerHeight = h - margin.top  - margin.bottom;

      	var xScale = d3.scaleLinear().rangeRound([0, innerWidth]);
      	var yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);

      	// //x and y axis
      	var xAxis = d3.axisBottom(xScale)
      					.tickFormat(d3.format("d"))
      					.ticks(data.length - 1);
      	var yAxis = d3.axisLeft(yScale);

        xScale.domain(d3.extent(data, function(d) { return d['Hour']; }));
        yScale.domain([0, d3.max(data, function (d){ return d['Count']; })]);
        console.log(data);
        //line
      	var line = d3.line()
		    .x(function(d) { return xScale(d['Hour']); })
		    .y(function(d) { return yScale(d['Count']); });
       
        var svg = d3.select("#plot1 svg").transition();

        svg.select("#linePath")
				.duration(750)
			    .attr("d", line(data));

        svg.select("#lineChartXAxis")
        		.duration(750)
        		.call(xAxis);

        svg.select("#lineChartYAxis")
        		.duration(750)
        		.call(yAxis);

		

		var focus = d3.select(".focus");
		d3.select(".overlay")
	      .on("mouseover", function() { focus.style("display", null); })
	      .on("mouseout", function() { focus.style("display", "none"); })
	      .on("mousemove", mousemove);
	    console.log(data);
		function mousemove() {
		    var x0 = xScale.invert(d3.mouse(this)[0] - margin.left);
		    if (x0 < d3.min(data, function (d){ return d['Hour']; })) {
		    	x0 = d3.min(data, function (d){ return d['Hour']; });
		    }
		    if (x0 > d3.max(data, function (d){ return d['Hour']; })) {
		    	x0 = d3.max(data, function (d){ return d['Hour']; });
		    }
		    var i = hourLookup.get(Math.round(x0));
		    if (i<=0){
		    	d = data[0];
		    } else {
			    var d0 = data[i - 1];
			    console.log(d0)
			    var d1 = data[i],
			        d = x0 - d0['Hour'] > d1['Hour'] - x0 ? d1 : d0;
			}
		    focus.attr("transform", "translate(" + (margin.left + xScale(d['Hour'])) + "," + (margin.top + yScale(d['Count'])) + ")");
		    focus.select("text").text(d['Count']);
			
		}


    }