function makePlot( geneX, geneY, studyID)
{
    attrData = window.attrData;
	attributes = window.attributes;
	var offClickElem;
	var clicked = false;
    //Width and height
    var w = document.getElementsByTagName("div")["plot"].offsetWidth;
    var h = document.getElementsByTagName("div")["plot"].offsetHeight;
    
    //sets padding
    var padding = 4*Math.log(w) +30;
    //var xAxis = d3.svg.axis();
    

    var gene_x = geneX;
    var gene_y = geneY; 
    var studyid = studyID;
    //Create SVG element
    


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
		//.attr("id", "this")
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
				svg.attr("display", "none");
				}
			else
			{
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
					    //finds the colorObject key that matches the data from point.

					 /*   attributes[colorCode].colorsList.forEach(function(c, i){
						    if (c.id==numCol)
							{
							    colIndex = i;
							}
						});
					    //returns the corresponding color*/

						//alert(attributes[colorCode].colorsList[numCol].color);
						return attributes[colorCode].colorsList[numCol].color;
					   // return attributes[colorCode].colorsList[colIndex].color;
					        
					}
				})
			    .style("opacity", .5)
			    .attr("stroke", "black")
			    .attr("stroke-width", .5)
			    .on("mouseover", function(){
				
				    //shows the x and y location: This needs to be changed still.
				    svg.append("rect")
					.attr("fill", "white")
					//.text(function(){return (colorCode + ": " + point.sample[colorCode])})//"(" + x + ", " + y + ")";})
					.attr("x",  function() { return xScale(x)+3;} )
					.attr("y", function() { return yScale(y)-19;})
					.attr("id", "boxText"+colorCode)
					.attr("width", function(){return (5+(8*(colorCode.length + (String(attrData[i].sample[colorCode]).length))));})
					.attr("height", 20)
					.attr("display", "block");
				    svg.append("text")
					.text(function(){return (colorCode + ": " + attrData[i].sample[colorCode])})//"(" + x + ", " + y + ")";})
					.attr("x",  function() { return xScale(x)+3;} )
					.attr("y", function() { return yScale(y)-3;})
					.attr("id", "pointText"+colorCode)
					.attr("font-size", 13)
					.attr("font-family", "sans-serif")
					.attr("display", "block");
					
				})
			    .on("mouseout", function(){
					d3.selectAll("#boxText" + colorCode).attr("display", "none");
					d3.selectAll("#pointText" + colorCode).attr("display", "none");

					/*
				    var elem = document.getElementById("pointText"+colorCode);
				    elem.parentNode.removeChild(elem);
				    elem = document.getElementById("boxText"+colorCode);
				    elem.parentNode.removeChild(elem);
*/
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
						
						clicked = true;
						infoDiv.appendChild(infoDivPart);					
					} //ends for each attribute
				}); //ends on click
		    });// ends loop through points
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
			
			
			
		} //ends for loop of color codes
		
	    };//semi colon
	    //creates the axises
	        
	    $("#selectColorCode").change(function(e) {
		        
		   // if ($('#this').attr("exists") == "true"){
			//var circlesToRemove = svg.selectAll("circle");
			//circlesToRemove.remove();
			colorChosen = select.options[select.selectedIndex].value;
			var plot = document.getElementById("plot");
			var hist = document.getElementById("hist");
			var list = document.getElementById("list");
			
			for (colorCode in window.attributes)
			{		

					if(colorCode==colorChosen){
						d3.selectAll(".svg" + colorCode).attr("display", "inline");
						}
					else{
						d3.selectAll(".svg" + colorCode).attr("display", "none");
						d3.selectAll("#boxText" + colorCode).attr("display", "none");
						d3.selectAll("#pointText" + colorCode).attr("display", "none");
						}
						
						
						//});
						//}
					//}
				//var colorHist = d3.select("#hist"+colorCode);
				//alert(colorCode+": "+colorHist);
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
			//document.getElementById("list").innerHTML = "";
			//document.getElementById("hist").innerHTML = "";
			
			
			//drawGraph(d); 

		     
		}); //ends change

		$(document).click(function() { 
					
			var infoDiv = document.getElementById("info");
			if(!clicked){
					makeRadiusSmallerAgain();
					infoDiv.innerHTML = "";
					
					}
			
			clicked = false;
				
		});	//ends click
		function makeRadiusSmallerAgain(){
					var offClickElem = document.getElementById("offClick");
					d3.select(offClickElem).attr("r", w*h*.00001).attr("id", "allCircles").style("opacity", .5).attr("stroke-width", .5);
		}

	});  //this is supposed to end getJSON




}