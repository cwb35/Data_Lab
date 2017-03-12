/* HEAT MAP */
	function heatMapBasics(){
		var coords = {lat1: 43.1451636, lat2: 43.1297806, long1: -70.940935, long2: -70.9262369},
			width = 600,
		   	height = 620,
			circleRadius = 5
			;
		
		return {
			coords : coords,
			width : width, 
			height : height,
			circleRadius : circleRadius,

		};	
	}

	function heatMap(data){

		function compareHours(a, b){
    		if (a.Building < b.Building){ return -1; }
    		if (a.Building > b.Building){ return 1; }
    		return 0;
    	}

    	var data = data.sort(compareHours);

		var basics = heatMapBasics();

		var coords = basics.coords,
			w = basics.width,
		   	h = basics.height,
		   	circleRadius = basics.circleRadius
			;

  		var circleScale = d3.scaleSqrt().range([3,12]);

  		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);//.domain([]);

  		latitudeScale.domain([coords.lat1, coords.lat2]);
  		longitudeScale.domain([coords.long1, coords.long2]);

  		var svg = d3.select("#campussvg");

  		// //Add path line
  		// //<line id= "pathLine" class="hidden" x1="0" x2="100" y1="0" y2="0" stroke-width="3" stroke="black"/>
  		// svg.append("line")
  		// 	.attr("id", "pathLine")
  		// 	.attr("class", "hidden")
  		// 	.attr("x1", "0")
  		// 	.attr("x2", "100")
  		// 	.attr("y1", "0")
  		// 	.attr("y2", "0")
  		// 	.attr("stroke-width", "3")
  		// 	.attr("stroke", "black");

		var div = d3.select("body").append("div")
					.attr("id", "buildingTooltip")
				    .attr("class", "tooltip")
				    .style("opacity", 0);//d3.select('#tooltip');

        circleScale.domain([d3.min(data, function (d){ return d['Count']; }), d3.max(data, function (d){ return d['Count']; })]);

        
        var buildingCircles = svg.append("g")
        						.attr("id", "buildingCircles");

		var circles = buildingCircles.selectAll("circle")
			.data(data)
			.enter()
			.append('circle')
				.attr("class", function(d) {
					if (d.Count == 0){
						return "hiddenCircle";
					}
					else {
						return "circle";
					}
				})
				.attr("id", function(d){ return d['Building'].replace(/\s/g, ""); })
		  		.attr("r", function(d){
		  			return circleScale(d['Count']);
		  		})
		  		.attr("cx", function(d) {
		  			console.log("NOT SUPPOSED TO BE HERE!" + d['Building']);
		  			return longitudeScale(building_table.get(d['Building'])[0]) - 4;
		  		})
		  		.attr("cy", function(d){
		  			return latitudeScale(building_table.get(d['Building'])[1]) + 4;
		  		})
		  		.attr("fill", function(d){ return colorScale(building_table.get(d['Building'])[2]); })
		  		//.attr("data-legend",function(d) { return building_table.get(d['Building'])[2]})
		  		.on("mouseover", function(d){
		  			console.log(d['Building'], d['Count']);
		  			d3.select("#buildingTooltip").transition()
				         .duration(200)
				         .style("opacity", .9);
				    d3.select("#buildingTooltip").html(d['Building'] + "<br/>" + d['Count'])
				         .style("left", (d3.event.pageX - 50) + "px")
				         .style("top", (d3.event.pageY - 40) + "px");
		  		})
		  		.on("mouseout", function(d) {
			       d3.select("#buildingTooltip").transition()
			         .duration(500)
			         .style("opacity", 0); 
			     })
		  		.on("mousedown", function(d){
		  			console.log("PRESSED ME!");
		  			console.log(d);

		  			if(d3.select("#"+d['Building'].replace(/\s/g, "")).attr("class") == "selected"){
		  				d3.selectAll(".uncolor")
				   			.attr("class", "circle");
				   		d3.selectAll(".selected")
				   			.attr("class", "circle");
				   		selectedBuilding = "None";
				   		updateCharts(origData);
				   		//LOAD ORIGINAL DATA

			   		} else if(selectedBuilding != "None"){

			   			d3.selectAll(".uncolor")
				   			.attr("class", "circle");
				   		d3.selectAll(".selected")
				   			.attr("class", "circle");

				   		d3.json("/api/cache?Building="+d['Building'], inspectBuilding);
			  			selectedBuilding = d['Building'];
			  			d3.selectAll(".circle")
			   			.attr("class", "uncolor");

				   		console.log("#"+d['Building'].replace(/\s/g, ""));
				   		d3.select("#"+d['Building'].replace(/\s/g, ""))
				   			.attr("class", "selected");
			   			//DO STUFF
			   		}
			   		else {
				   		d3.json("/api/cache?Building="+d['Building'], inspectBuilding);
			  			selectedBuilding = d['Building'];
			  			d3.selectAll(".circle")
			   				.attr("class", "uncolor");

				   		console.log("#"+d['Building'].replace(/\s/g, ""));
				   		d3.select("#"+d['Building'].replace(/\s/g, ""))
				   			.attr("class", "selected");
			   		}
		  		});

		var legendCircleRadius = 5;
		var legendSpacing = 12;

		
		var legend = svg.append('rect')
						.attr('class', 'legend')
						.attr('x', w-130)
						.attr('y', '15');

		console.log("COLORSCALE!");
		console.log(colorScale.domain());

		var legendCircles = svg.selectAll('.legend')
		  .data(colorScale.domain(), function(d, i) { 
		  	console.log("ADJUSTED DATA:");
		  	console.log(d);
		  	console.log(i);
		  	return d + i; })
		  .enter()
		  .append('g')
		  .attr('class', 'legendCircle')
		  .attr('transform', function(d, i) {

		  	console.log("INSIDE TRANSFORM:");
		  	console.log(d);
		  	console.log(i);
		    var height = legendCircleRadius + legendSpacing;
		    var offset =  height * colorScale.domain().length / 2;
		    var vert = i * height - offset + 75;
		    return 'translate(' + (w-120) + ',' + vert + ')';
		  });

		legendCircles.append('circle')
		  .attr('r', legendCircleRadius)
		  .attr('class', 'legCircle')
		  .style('fill', colorScale)
		  .style('stroke', colorScale)
		  .on('mousedown', function(d){
		  	    console.log(d);
		  	    if(selectedBuilding == d){
		  	    	d3.selectAll(".selected")
		  	    		.attr("class", "circle");
		  	    	d3.selectAll(".uncolor")
				   		.attr("class", "circle");
			   		d3.selectAll(".selectedL")
			   			.attr("class", "legCircle");
			   		d3.selectAll(".uncolorL")
			   			.attr("class", "legCircle");
			   		// d3.selectAll(".legCircle")
			   		//  	.attr("opacity",.5);

			   	// 	d3.selectAll('.leg')
			   	// 		.attr("class", function(c){
			   	// 			console.log("in legCircle!");
			   	// 			console.log(c);
			   	// 			console.log(d);
			   	// 			if (c == d) {
			   	// 				console.log("HERE?");
							// 	return "legCircSelected";//'selected';
							// } else {
							// 	return "legCircUnselected";//'uncolor';
							// };
			   	// 		});

			   		selectedBuilding = "None";
			   		updateCharts(origData);
		  	    } else if(selectedBuilding != "None"){

		   			d3.selectAll(".uncolor")
			   			.attr("class", "circle");
			   		d3.selectAll(".selected")
			   			.attr("class", "circle");
			   		// d3.selectAll(".uncolorL")
			   		// 	.attr("class", "legCircle");
			   		// d3.selectAll(".selectedL")
			   		// 	.attr("class", "legCircle");

		   			// d3.selectAll(".uncolor")
			   		// 	.attr("class", "circle");
			   		// d3.selectAll(".selected")
			   		// 	.attr("class", "uncolor");
			   		// d3.selectAll(".selectedL")
			   		// 	.attr("class", "legCircle");
			   	// 	d3.selectAll('.legCircle')
			   	// 		.attr("opacity", function(c){
			   	// 			if (building_table.get(c['Building'])[2] == d) {
							// 	return 1.0;
							// } else {
							// 	return .3;
							// };
			   	// 		});

			   		d3.json("/api/cache?Type="+d, inspectBuilding);
		  			selectedBuilding = d;

		  			d3.selectAll('.selectedL')
			   			.attr("class", function(c){
			   				if (c == d) {
			   					console.log("HERE?");
								return 'selectedL';
							} else {
								return 'uncolorL';
							};
			   			});
			   		d3.selectAll('.uncolorL')
			   			.attr("class", function(c){
			   				if (c == d) {
			   					console.log("HERE?");
								return 'selectedL';
							} else {
								return 'uncolorL';
							};
			   			});
			   		d3.select("#campussvg")
						.selectAll(".circle")
						.attr("class", function(c){
					
							if (building_table.get(c['Building'])[2] == d) {
								return 'selected';
							} else {
								return 'uncolor';
							};
					});

		   		}
		   		else {
		   			d3.json("/api/cache?Type="+d, inspectBuilding);
		  			selectedBuilding = d;

		  			d3.select("#campussvg")
						.selectAll(".circle")
						.attr("class", function(c){
					
							if (building_table.get(c['Building'])[2] == d) {
								return 'selected';
							} else {
								return 'uncolor';
							};
					});

					d3.selectAll('.legCircle')
			   			.attr("class", function(c){
			   				if (c == d) {
			   					console.log("HERE?");
								return 'selectedL';
							} else {
								return 'uncolorL';
							};
			   			});
			   	// 	d3.json("/api/cache?Building="+d['Building'], inspectBuilding);
		  			// selectedBuilding = d['Building'];
		  			// d3.selectAll(".circle")
		   		// 		.attr("class", "uncolor");

			   	// 	console.log("#"+d['Building'].replace(/\s/g, ""));
			   	// 	d3.select("#"+d['Building'].replace(/\s/g, ""))
			   	// 		.attr("class", "selected");
		   		}
		  		// d3.selectAll(".circle")
			  //  				.attr("class", "uncolor");
			 //  if (selectedBuilding != "None"){
			 //  	d3.selectAll(".uncolor")
	   // 				.attr("class", "circle");
	   // 			d3.selectAll(".selected")
	   // 				.attr("class", "circle");
	   // 			selectedBuilding = "None";
			 //  }

			 //  d3.select("#campussvg")
				// .selectAll(".circle")
				// .attr("class", function(c){
					
				// 	if (building_table.get(c['Building'])[2] == d) {
				// 		return 'selected';
				// 	} else {
				// 		return 'uncolor';
				// 	}
				// });

		  	});

		legendCircles.append('text')
		  .attr('x', legendCircleRadius + legendSpacing - 5)
		  .attr('y', legendCircleRadius - 2 )//- legendSpacing)
		  .attr('font-size', '10')
		  .text(function(d) { return d; });

	}

	function updateHeatMap(data) {

		console.log("BEFORE SORTING!", data);

    	function compareHours(a, b){
    		if (a.Building < b.Building){ return -1; }
    		if (a.Building > b.Building){ return 1; }
    		return 0;
    	}

    	var data = data.sort(compareHours);
    	//console.log("AFTER SORTING!", data2);

		var basics = heatMapBasics();

		var coords = basics.coords,
			w = basics.width,
		   	h = basics.height,
		   	circleRadius = basics.circleRadius
			;

  		var circleScale = d3.scaleSqrt().range([3,12]);

  		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);//.domain([]);

  		latitudeScale.domain([coords.lat1, coords.lat2]);
  		longitudeScale.domain([coords.long1, coords.long2]);

  // 		var svg = d3.select("#campussvg");

        circleScale.domain([d3.min(data, function (d){ return d['Count']; }), d3.max(data, function (d){ return d['Count']; })]);

        var svg = d3.select("#campussvg");
        console.log(data);

		var circles = d3.select("#buildingCircles").selectAll("circle")
			.data(data)
			//.enter()
			//.append('circle')
			//.attr("class", "circle")
			//.transition()
			//.duration(500)
			.attr("class", function(d) {
					if (d.Count == 0){
						return "hiddenCircle";
					}
					else {
						return "circle";
					}
				})
	  		.attr("r", function(d){
	  			return circleScale(d['Count']);
	  		})
	  		.attr("cx", function(d) {
	  			console.log(d["Building"])
	  			return longitudeScale(building_table.get(d['Building'])[0]) - 4;
	  		})
	  		.attr("cy", function(d){
	  			return latitudeScale(building_table.get(d['Building'])[1]) + 4;
	  		})
	  		// .attr("fill", function(d){ return colorScale(building_table.get(d['Building'])[2]); })
	  		//.attr("data-legend",function(d) { return building_table.get(d['Building'])[2]})
	  		.on("mouseover", function(d){
	  			console.log(d['Building'], d['Count']);
	  			var div = d3.select("#buildingTooltip");
	  			div.transition()
			         .duration(200)
			         .style("opacity", .9);
			       div.html(d['Building'] + "<br/>" + d['Count'])
			         .style("left", (d3.event.pageX - 50) + "px")
			         .style("top", (d3.event.pageY - 40) + "px");
	  		})
	  		.on("mouseout", function(d) {
	  			var div = d3.select("#buildingTooltip");
		        div.transition()
		         .duration(500)
		         .style("opacity", 0); 
		     })
	  		.on("mousedown", function(d){
		  			console.log("PRESSED UPDATED ME!");
		  			console.log(d);
		  			if(d3.select("#"+d['Building'].replace(/\s/g, "")).attr("class") == "selected"){
		  				d3.selectAll(".uncolor")
				   			.attr("class", "circle");
				   		d3.selectAll(".selected")
				   			.attr("class", "circle");
				   		selectedBuilding = "None";
				   		updateCharts(origData);
				   		//LOAD ORIGINAL DATA

			   		} else if(selectedBuilding != "None"){

			   			d3.selectAll(".uncolor")
				   			.attr("class", "circle");
				   		d3.selectAll(".selected")
				   			.attr("class", "circle");

				   		d3.json("/api/cache?Building="+d['Building'], inspectBuilding);
			  			selectedBuilding = d['Building'];
			  			d3.selectAll(".circle")
			   			.attr("class", "uncolor");

				   		console.log("#"+d['Building'].replace(/\s/g, ""));
				   		d3.select("#"+d['Building'].replace(/\s/g, ""))
				   			.attr("class", "selected");
			   			//DO STUFF
			   		}
			   		else {
				   		d3.json("/api/cache?Building="+d['Building'], inspectBuilding);
			  			selectedBuilding = d['Building'];
			  			d3.selectAll(".circle")
			   			.attr("class", "uncolor");

				   		console.log("#"+d['Building'].replace(/\s/g, ""));
				   		d3.select("#"+d['Building'].replace(/\s/g, ""))
				   			.attr("class", "selected");
			   		}
		  	});
	  	var circles = svg.selectAll(".circle")
			.transition()
			.duration(500);
	  	// svg.transition();

    //     svg.selectAll('.circle').duration(300)
		  // 	.attr("r", function(d) { return circleScale(d['count']);})
		  // 	.attr("opacity",1);


	}