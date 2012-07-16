var gene_x;
var gene_y;

function makePlot( geneX, geneY, studyID)
{
    attrData = window.attrData;
	attributes = window.attributes;
    //Width and height
    var w = document.getElementsByTagName("div")["plot"].offsetWidth;
    var h = document.getElementsByTagName("div")["plot"].offsetHeight;
    //alert("W: " + w);
    //sets padding
    var padding = 4*Math.log(w) +30;
    //var xAxis = d3.svg.axis();
    

    gene_x = geneX;
    gene_y = geneY; 
    var studyid = studyID;
    //Create SVG element
    var clicked  = false;


   // var data = {studyid: studyid, gene_x: gene_x, gene_y: gene_y};
    //$.getJSON("http://yates.webfactional.com/studies/getChartData", data, function(d){
	    $.getJSON("xyData.txt",  function(d){
	    //getting data

		//  $.getJSON("complexData.txt", data, function(d){
		var select = document.getElementById("selectColorCode");
	    //finds max x and y to set the scale
		
	    var xMax = d3.max(d, function(d){return d.x; });
	    var xMin = d3.min(d, function(d){return d.x; });
	    var yMax = d3.max(d, function(d){ return d.y; });
	    var yMin = d3.min(d, function(d){ return d.y; });
	    
	    //sets the x- scale
	    var xScale = d3.scale.linear()
		.domain([xMin-(xMin*.1), xMax + (xMax*.05)])
		.range([padding, w- padding]);

	    //sets the y- scale
	    var yScale = d3.scale.linear()
		.domain([yMin-(yMin*.1),yMax + (yMax*.05)])
		.range([h - padding, padding]);

		var isListEmpty = list.firstChild;
	    //finds the index of the key in the attributes array
	    
	    drawGraph();
	    function drawGraph(){
		
		    //goes through attributes array

		select = document.getElementById("selectColorCode");
		colorChosen = select.options[select.selectedIndex].value;	
		dataSetLength  = d.length;
		for (colorCode in attributes){
		var svg = d3.select("#plot")
		.append("svg")
		.attr("exists","true")
		.attr("id", "svg" + colorCode +gene_x + gene_y)
		.attr("width", w)
		.attr("height", h);
				var keyType = attributes[colorCode];
				svg.attr("class", "svg" + colorCode);
			//	var heightOfText = 15;
				//]
				//if the key definitions are numbers
				if (keyType.dataType=="number")
				    {
						var colorDomainMin = keyType.keyMin;
				    } //ends key type is a number
			//var colorPlotToHide = document.getElementById("svg" + colorCode);
			if(colorCode!=colorChosen){
				//svg.attr("visibility", "hidden");
				svg.attr("display", "none");
				}
			else
			{
				//svg.attr("visibility", "visible");
				svg.attr("display", "inline");
			}
				


		   // });if
		   

					

		//goes through the points to plot
		d.forEach(function(point,i){
			//finds the x and y location
			var x = point.x;
			var y = point.y;
			
			//finds the piece of data that is crucial to color coding the graph (i.e. male)
			numCol = attrData[i].sample[colorCode];
			//finds the index for the correct key in the colorsList array as defined by colorCode

			var colIndex;
			//DRAWS ALL THE THINGS!!!
			var numOfType= [];
			
			svg.append("circle")
			    .attr("cx", function() {
				    return xScale(x);
				})
			    .attr("cy", function(d) {
				    return yScale(y);
				})
			    .attr("r", w*h*.00001)
			    .attr("id", "allCircles")
			    .attr("fill", function(){ if (attributes[colorCode].dataType == "number")
					{
					    //interpolates a color with the color interpolator
					    return (attributes[colorCode].colorInterpolator(numCol));
					}
				    else
					{ 
						return attributes[colorCode].colorsList[numCol].color;
					        
					}
				})
			    .style("opacity", .5)
			    .attr("stroke", "black")
			    .attr("stroke-width", .5)
			    .on("mouseover", function(){
					rollOn(i, point, xScale, yScale);
				})
			    .on("mouseout", function(){
					rollOff();
				}) 
				.on("click", function(){
					var text;
					var infoDiv = document.getElementById("info");
					infoDiv.innerHTML = "";
					makeRadiusSmallerAgain();
					d3.select(this).attr("r", w*h*.000012).attr("id", "offClick").style("opacity", .9).attr("stroke-width", 1.3);
					for(attr in attributes){
						text= attr + ": " + attrData[i].sample[attr];
						var infoDivPart = document.createElement("div");
											infoDivPart.textContent= text;
						infoDivPart.style.fontSize = "14px";
											infoDivPart.style.position = "relative";
											infoDivPart.style.fontFamily = "sans-serif";						
						infoDiv.appendChild(infoDivPart);
					clicked = true;						
					} //ends for each attribute
				}); //ends on click			
		    });// ends loop through points
			
			
		//makes a square and text for each color type in svg
		d3.select("#svg" + colorCode + gene_x + gene_y).append("rect")
					.attr("fill", "white")
					.attr("height", 20)
					.attr("class", "boxText"+colorCode)
					.attr("display", "block")
					.attr("zIndex", 100);
					
				d3.select("#svg" + colorCode + gene_x + gene_y).append("text")
					.attr("class", "pointText"+colorCode)
					.attr("font-size", 13)
					.attr("font-family", "sans-serif")
					.attr("display", "block")
					.attr("zIndex", 100);

					
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(w*.015);  //Set rough # of ticks
		
	    var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(h*.015);

	    svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(2," + (h - padding) + ")")
		.call(xAxis);

	    svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" +( padding + 2 )+ ",0)")
		.call(yAxis);

		    //creates an x label
    svg.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "middle")
	.attr("x", w*.5- padding*.5)
	.attr("y", h-padding*.2)
	.text(gene_x)
	.attr("font-family", "sans-serif")
	.attr("font-size", padding*.22)
	.attr("fill", "black");

    //creates a title
    svg.append("text")
	.attr("class", "title")
	.attr("text-anchor", "middle")
	.attr("x", w/2- padding/2)
	.attr("y", padding/2)
	.text(studyid)
	.attr("font-family", "sans-serif")
	.attr("font-size", 10+w/70)
	.attr("fill", "black");
    
    //creates a y label
    svg.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "middle")
	.attr("y", padding*.2 + 5)
	.attr("x", -h/2)
	.attr("transform", "rotate(-90)")
	.text(gene_y)
	.attr("font-family", "sans-serif")
	.attr("font-size", padding*.22)
	.attr("fill", "black");
		//BRUSH!!!
		/*
 var brush = d3.svg.brush()
      .on("brushstart", brushstart)
      .on("brush", brush)
      .on("brushend", brushend);
	  

svg.append("g")
    .attr("class", "brush")
    .call(d3.svg.brush().x(xScale).y(yScale)
    .on("brushstart", brushstart)
    .on("brush", brush)
    .on("brushend", brushend));

function brushstart() {
  svg.classed("selecting", true);
}

function brush() {
  var e = d3.event.target.extent();
  circle.classed("selected", function(d) {
    return e[0][0] <= d[0] && d[0] <= e[1][0]
        && e[0][1] <= d[1] && d[1] <= e[1][1];
  });
}

function brushend() {
  svg.classed("selecting", !d3.event.target.empty());
}


		*/			
			
			
		} //ends for loop of color codes
		
};//semi colon
	  
	        
	    $("#selectColorCode").change(function(e) {

			colorChosen = select.options[select.selectedIndex].value;
			var plot = d3.select("#plot");
			var hist = d3.select("#hist");
			var list = d3.select("#list");
			
			for (colorCode in window.attributes)
			{		

					if(colorCode==colorChosen){
						d3.selectAll(".svg" + colorCode).attr("display", "block");

						}
					else{
						d3.selectAll(".svg" + colorCode).attr("display", "none");
						d3.selectAll(".svg" + colorCode).selectAll(".boxText" + colorCode).attr("display", "none");
						d3.selectAll(".svg" + colorCode).selectAll(".pointText" + colorCode).attr("display", "none");
						}
						
				if(d3.select("#hist"+colorCode)!=null){
				if(colorCode==colorChosen){
						d3.select("#hist"+colorCode).attr("display", "inline");
						
						}
					else{
						d3.select("#hist"+colorCode).attr("display", "none");
						}
				}
				//var infoList = d3.select("#list" + colorCode);
				
				
				var infoList = document.getElementById("list" + colorCode);
				if(colorCode==colorChosen){
						infoList.style.display = "inline";

						}
					else{
						infoList.style.display = "none";
						}
						
				//alert(colorCode+": "+colorHist);
				//if(colorHist!=null){
			/*	if(colorCode==colorChosen){
						d3.select("#list").select("#list" + colorCode).attr("display", "inline");
	
						}
					else{
						d3.select("#list").select("#list" + colorCode).attr("display", "none");
						}
						*/
				//}
				//var infoList = document.getElementById("list" + colorCode);
				
				
			}
		}); //ends change

		$(document).click(function() { 
					
			var infoDiv = d3.select("#info");
			if(!clicked){
					makeRadiusSmallerAgain();
					infoDiv.html("");					
					}
			
			clicked = false;
				
		});	//ends click
		function makeRadiusSmallerAgain(){
					var offClickElem = document.getElementById("offClick");
					d3.select(offClickElem).attr("r", w*h*.00001).attr("id", "allCircles").style("opacity", .5).attr("stroke-width", .5);
		}

	});  //this is supposed to end getJSON
}



function rollOn (i, point, xScale, yScale){
	var select = document.getElementById("selectColorCode");
	var colorCode =  select.options[select.selectedIndex].value;
	var box = d3.select("#svg" + colorCode + gene_x + gene_y).select(".boxText" + colorCode);
	//d3.selectAll(".svg" + colorCode).selectAll(".boxText" + colorCode)
	x = point.x;
	y = point.y;
	box.attr("x",  function() {return xScale(x)+3;} )
	.attr("y", function() { return yScale(y)-19;})
	.attr("width", function(){return (5+(8*(colorCode.length + (String(attrData[i].sample[colorCode]).length))));})
	.attr("display", "block");
	
	d3.select("#svg" + colorCode + gene_x + gene_y).selectAll(".pointText" + colorCode)
	.text(function(){return (colorCode + ": " + attrData[i].sample[colorCode])})//"(" + x + ", " + y + ")";})
	.attr("x",  function() { return xScale(x)+3;} )
	.attr("y", function() { return yScale(y)-3;})
	.attr("display", "block");
}
function rollOff(){
	var select = document.getElementById("selectColorCode");
	colorCode =  select.options[select.selectedIndex].value;
	d3.selectAll(".svg" + colorCode).selectAll(".boxText" + colorCode).attr("display", "none");
	d3.selectAll(".svg" + colorCode).selectAll(".pointText" + colorCode).attr("display", "none");
}