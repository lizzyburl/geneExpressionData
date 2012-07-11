function makeHistogramAndList()
{
	attributes = window.attributes;
	document.getElementById("list").innerHTML = "";
	document.getElementById("hist").innerHTML = "";
		
	var wCol = document.getElementsByTagName("div")["list"].offsetWidth;
	var hCol = document.getElementsByTagName("div")["list"].offsetHeight;
	var list = document.getElementById("list");
	//there will be no need for this when i make all of them at once.
	var select = document.getElementById("selectColorCode");
	colorCode = select.options[select.selectedIndex].value;
	
	var divWords = document.createElement("div");
	var isListEmpty = list.firstChild;
	var histValues = [];
	attrData.forEach(function(point, i){
	histValues[i] = point.sample[colorCode];
	});
	dataSetLength = attrData.length;
	var wHist = document.getElementsByTagName("div")["hist"].offsetWidth;
	var hHist = document.getElementsByTagName("div")["hist"].offsetHeight;
	var histPadding = .1*Math.sqrt(hHist*wHist);		
	var heightOfText = 15;
	var keyType = attributes[colorCode];
	var colorInterpolator;
	
	if (attributes[colorCode].dataType == "number")
	{
	var color1 = keyType.colorMin;
	var color2 = keyType.colorMax;
	var colorDomainMin = keyType.keyMin;
	//creates an rgb interpolator if the hue values are too far apart (i.e. red/ blue or red/ purple)
	if (Math.abs(d3.hsl(color1).h - d3.hsl(color2).h)>200)
		{
		colorInterpolator = d3.scale.linear()
			.domain( [keyType.keyMin , keyType.keyMax] ) //
			.interpolate(d3.interpolateRgb)
			.range([color1,  color2]);
		
		}
	else 
		{
		color1 = d3.hsl(color1);
		color2 = d3.hsl(color2);
		colorInterpolator = d3.scale.linear()
			.domain([keyType.keyMin, keyType.keyMax])
			.interpolate(d3.interpolateHsl)
			.range([color1, color2]);
		}
		
		var numBins =15;
		var domainMinxScale; 
		if (keyType.keyMin>=0){
			domainMinxScale = 0;
		}
		else{
			domainMinxScale = keyType.keyMin - ((keyType.keyMax-keyType.keyMin)/(numBins-1));
		}
		
		var xHist = d3.scale.linear()
			.domain([domainMinxScale, keyType.keyMax + ((keyType.keyMax-keyType.keyMin)/(numBins-1))])
			.range([histPadding, wHist-histPadding]);
		
		var histogram = d3.layout.histogram().bins(xHist.ticks(numBins))
			(histValues);
		
		var yHist = d3.scale.linear()
			.domain([0, d3.max(histogram, function(h) { return h.y; })])
			.range([(hHist-histPadding), histPadding]);
		
		var svgHist= d3.select("#hist")
			.append("svg")
			.attr("width", wHist)
			.attr("height", hHist)
			.attr("id", "histsvg");
		
		
		svgHist.selectAll("rect")
			.data(histogram)
			.enter()
			.append("rect")
			.attr("id", "histogramRectangles")
			.attr("width", function(h) {return xHist(h.dx)-xHist(0) - 1;})
			.attr("x", function(h) { 
				return xHist(h.x); })
			.attr("y", function(h) { return yHist(h.y); })
			.attr("height", function(h) {return hHist - yHist(h.y) - histPadding;})//yHist(h.y); })
			.attr("fill", function(h){  return colorInterpolator(h.x); });
		
		var xAxisHist = d3.svg.axis()
			.scale(xHist)
			.orient("bottom")
			.ticks(numBins);
		
		var yAxisHist = d3.svg.axis()
			.scale(yHist)
			.orient("left")
			.ticks(hHist*.05);
		
		svgHist.append("g")
			.attr("class", "axis")
			.attr("transform", "translate( 0," + (hHist - histPadding) + ")")
			.call(xAxisHist);
		
		svgHist.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" +(histPadding)+ ", 0 )")
			.call(yAxisHist);
		
		


		var minMax;
		minMax = "Minimum " + keyType.key + ": " + keyType.keyMin; 
		var divMin = document.createElement("div");
		divMin.textContent= minMax;
		
			divMin.style.fontSize = heightOfText + "px";
		divMin.style.position = "relative";
		divMin.style.fontFamily = "sans-serif";
		divMin.style.top="1px";
		if (isListEmpty==null)
			list.appendChild(divMin);
		
		var divMax = document.createElement("div");
							divMax.textContent= minMax;

		divMax.style.fontSize = heightOfText + "px";
							divMax.style.position = "relative";
							divMax.style.fontFamily = "sans-serif";
							divMax.style.top="1px";

		minMax = "Maximum " + keyType.key + ": "  + keyType.keyMax;
		divMax.textContent = minMax;
			if (isListEmpty==null)
			list.appendChild(divMax);
	}
	else
	{
		var allSame=true;
/*	if(keyType.numColors<6)
		{
		var presetColors= ["hsl(54, 100%, 51%)", "hsl(142, 100%, 44%)", "red", "hsl(290, 100%, 39%)", "hsl(28, 100%, 58%)",  "hsl(215, 100%, 40%)"];
		}*/

	var typeAndNum;
	var j = 0;
	var maxNumOfType = 0;
	//sets colors to go with colorObjects. Colors are equally divided among the hue range
	for (colorObjectId in keyType.colorsList)
		{
			var colorObject = keyType.colorsList[colorObjectId];
		
		if (colorObject.numOfType> maxNumOfType)
			maxNumOfType = colorObject.numOfType;
		
		
		typeAndNum = (colorObject.id )  + "  (" + (colorObject.numOfType) + ")";
		
		//var list = document.getElementsByTagName("div")["list"];
		var tab=document.createElement('table');
		var tbo=document.createElement('tbody');
		var row, cell;

		var divRect = document.createElement("div")
			divRect.style.width = "30px";
		divRect.style.height = heightOfText + "px";
		divRect.style.background = colorObject.color;
		
		divRect.style.top=  "0px";
		row=document.createElement('tr');
		cell=document.createElement('td');
		cell.appendChild(divRect);
		row.appendChild(cell);
		var divWords = document.createElement("div");
		divWords.textContent= typeAndNum;
		divWords.style.fontSize = heightOfText + "px";
		divWords.style.left= "40px";
		//divWords.style.height = heightOfText + "px";
		divWords.style.fontFamily = "sans-serif";
		divWords.style.top= "0px";
		divWords.style.maxWidth= "200px";
			  

		cell = document.createElement('td');
		cell.appendChild(divWords);
		row.appendChild(cell);

		tbo.appendChild(row);
		tab.appendChild(tbo);
		if (isListEmpty== null)
			list.appendChild(tab);
		j++;
		}
		
		
		
	if((keyType.numColors< dataSetLength)&&(keyType.numColors>1))
		{
	
		var wHist = document.getElementsByTagName("div")["hist"].offsetWidth;
		var hHist = document.getElementsByTagName("div")["hist"].offsetHeight;
		var histPadding = .1*Math.sqrt(hHist*wHist);

		
		
		var yHist = d3.scale.linear()
			.domain([0, maxNumOfType])
			.range([(hHist-histPadding), histPadding]);
		
		var xHist = d3.scale.linear()
			.domain([0, keyType.numColors])
			.range([histPadding, wHist-histPadding]);
		
		
		var svgHist= d3.select("#hist")
			.append("svg")
			.attr("width", wHist)
			.attr("height", hHist)
			.attr("id", "histsvg");
		var xScaleData = [];
		
		var i =0;
			//keyType.colorsList.forEach(function(s, i){
			for (colorObjectId in keyType.colorsList){
				var colorObject = keyType.colorsList[colorObjectId];
				
				xScaleData[i] = colorObject.id;
				svgHist.append("rect")
				.attr("id", "histogramRectangles")
				.attr("width", function(h) {return (wHist-(2*histPadding))/(keyType.numColors) - 1;})
				.attr("x", function(h) { 
					return xHist(i); })
				.attr("y", function(h) { return yHist(colorObject.numOfType); })
				.attr("height", function(h) {return hHist - yHist(colorObject.numOfType) - histPadding;})//yHist(h.y); })
				.attr("fill", function(){ return colorObject.color;} );
				i++;
			}
		
		
		var yAxisHist = d3.svg.axis()
			.scale(yHist)
			.orient("left")
			.ticks(hHist*.03);
		
		svgHist.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" +(histPadding)+ ", 0 )")
			.call(yAxisHist);
		
		var xHistOrdinal = d3.scale.ordinal()
			.domain(xScaleData)
			.rangeRoundBands([histPadding, wHist-histPadding]);
		
		var xAxisHist = d3.svg.axis()
			.scale(xHistOrdinal)
			.orient("bottom")
			.ticks(wHist*.03);
		
		svgHist.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate( 0," + (hHist - histPadding) + ")")
			.call(xAxisHist);
		
		}
					
	}

}