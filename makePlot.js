function makePlot(geneX, geneY, studyID, n){
	attrData = window.attrData;
    attributes = window.attributes;
	//gets height and width of div container
	var width = parseInt(d3.select("#plot" + n).style("width"));
	var height = parseInt(d3.select("#plot" + n).style("height"));
	var padding = 4*Math.log(width) + 30;
	
	var gene_x = geneX;
	var gene_y = geneY;
    var studyid = studyID;
	
	var svg = d3.select("#plot" + n)
	.append("svg")
	.attr("id", "svg" + n)
	.attr("width", width)
	.attr("height", height);
	
	//getting data from the database
	//var data = {studyid: studyid, gene_x: gene_x, gene_y: gene_y};
    //$.getJSON("http://yates.webfactional.com/studies/getData", data, function(d){
	//getting data from my computer
    $.getJSON("xyData.txt",  function(d){
	
		//finds the domain and range
		var xMax = d3.max(d, function(d){return d.x; });
	    var xMin = d3.min(d, function(d){return d.x; });
	    var yMax = d3.max(d, function(d){ return d.y; });
	    var yMin = d3.min(d, function(d){ return d.y; });
	        		
	    //sets the x- scale
	   var xScale = d3.scale.linear()
		.domain([xMin-(xMin*.1), xMax + (xMax*.05)])
		.range([padding, width- padding]);
	
	    //sets the y- scale
	    var yScale = d3.scale.linear()
		.domain([yMin-(yMin*.1),yMax + (yMax*.05)])
		.range([height - padding, padding]);
		
			makeTitles();
function makeTitles(){	
	//creates a title
	svg.append("text")
	.attr("id", "title")
	.attr("text-anchor", "middle")
	.attr("x", width/2- padding/2)
	.attr("y", padding/2)
	.text(studyid)
	.attr("font-family", "sans-serif")
	.attr("font-size", 10+width/70)
	.attr("fill", "black");

	//creates an x label
	svg.append("text")
	.attr("id", "x_label")
	.attr("text-anchor", "middle")
	.attr("x", width*.5- padding*.5)
	.attr("y", height-padding*.2)
	.text(gene_x)
	.attr("font-family", "sans-serif")
	.attr("font-size", padding*.22)
	.attr("fill", "black");
	
	//creates a y label
	svg.append("text")
	.attr("id", "y_label")
	.attr("text-anchor", "middle")
	.attr("y", padding*.2 + 5)
	.attr("x", -height/2)
	.attr("transform", "rotate(-90)")
	.text(gene_y)
	.attr("font-family", "sans-serif")
	.attr("font-size", padding*.22)
	.attr("fill", "black");
	
	}//end function makeTitles
	
		//figures out selected colorCode
		var colorCode = d3.select("#selectColorCode").property("value");
			
		svg.selectAll("circle")
		.data(d)
		.enter()
		.append("circle")
			.attr("cx", function(d){
				return xScale(d.x);
				})
			.attr("cy", function(d) {
				return yScale(d.y);
				})
			.attr("r", width*height*.00001)
			.attr("class", "allCircles")
			.attr("fill", function(d, i){
			return attributes.get(colorCode).colorInterpolator(attrData[i].sample[colorCode]);
				})
			.style("opacity", .5)
			.attr("stroke", "black")
			.attr("stroke-width", .5)
			.on("click", function(d, i){
				fillInfoList(d, i);
				makeRadiusBigger(this);
				d3.event.stopPropagation();
			})
			.on("mouseover", function(d, i){rollOver(d, i, this, xScale, yScale)})
			.on("mouseout", function(){rollOff();});
			
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(width*.015);  //Set rough # of ticks
		
		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(height*.015);

		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(2," + (height - padding) + ")")
		.call(xAxis);

		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" +( padding + 2 )+ ",0)")
			.call(yAxis);

		d3.select("#plot" + n).append("div")	
			.attr("class", "pointText")
			.attr("id", "pointText")
			.style("font-size", 13)
			.style("font-family", "sans-serif")
			.style("display", "none")
			.style("background", "white")
			.style("height", 17)
			.style("min-width", 10)
			.style("max-width", 200)
			.style("position", "absolute");		
		
	}); //ends getJSON
} //ends function makePlot