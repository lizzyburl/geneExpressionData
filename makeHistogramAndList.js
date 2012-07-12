function makeHistogramAndList()
{
	attributes = window.attributes;
	//document.getElementById("list").innerHTML = "";
	//document.getElementById("hist").innerHTML = "";
		
	var wCol = document.getElementsByTagName("div")["list"].offsetWidth;
	var hCol = document.getElementsByTagName("div")["list"].offsetHeight;
	var list = document.getElementById("list");
	var hist = document.getElementById("list");
	//there will be no need for this when i make all of them at once.
	var select = document.getElementById("selectColorCode");
	colorChosen = select.options[select.selectedIndex].value;
	//var isListEmpty = list.firstChild;
	var divWords = document.createElement("div");
	var eachHist = {};
	for (colorCode in attributes){
	
		//making list containing div
		//eachHist[colorCode] = document.createElement("hist");
		var divList = document.createElement("div");
		divList.setAttribute("id", "list"+colorCode);			

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
		//var colorInterpolator;
		
		if (attributes[colorCode].dataType == "number")
		{
		var color1 = keyType.colorMin;
		var color2 = keyType.colorMax;
		var colorDomainMin = keyType.keyMin;
		//creates an rgb interpolator if the hue values are too far apart (i.e. red/ blue or red/ purple)
		if (keyType.keyMin!=keyType.keyMax){
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
				.attr("id", "hist" + colorCode);
			if (colorChosen!=colorCode)
				svgHist.attr("display", "none");
			
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
				.attr("fill", function(h){  return attributes[colorCode].colorInterpolator(h.x); });
			
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
			
			

	} //end if(keyMine!=keyMax)
	
	//now makes list
			var minMax;
			minMax = "Minimum " + keyType.key + ": " + keyType.keyMin; 
			var divMin = document.createElement("div");
			divMin.textContent= minMax;
			
			divMin.style.fontSize = heightOfText + "px";
			divMin.style.position = "relative";
			divMin.style.fontFamily = "sans-serif";
			divMin.style.top="1px";
			
	
			//if (colorCode==colorChosen)
			divList.appendChild(divMin);
			
			var divMax = document.createElement("div");
								divMax.textContent= minMax;

			divMax.style.fontSize = heightOfText + "px";
								divMax.style.position = "relative";
								divMax.style.fontFamily = "sans-serif";
								divMax.style.top="1px";

			minMax = "Maximum " + keyType.key + ": "  + keyType.keyMax;
			divMax.textContent = minMax;
			
			
				divList.appendChild(divMax);
				
				if (colorCode==colorChosen)
					divList.style.display = "inline";
					else
					divList.style.display="none";
					
				list.appendChild(divList);

		} //end if number
		
		
	//if string	
	else
		{
			var allSame=true;

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
			
			
			divList.appendChild(tab);
			
			
			j++;
			}
			if (colorCode==colorChosen)
				divList.style.display="inline";
			else
				divList.style.display="none";
				
			
			list.appendChild(divList);
			
			
		if((keyType.numColors< dataSetLength)&&(keyType.numColors>1))
			{
			//eachHist[colorCode] = document.createElement("hist");
			var wHist = document.getElementsByTagName("div")["hist"].offsetWidth;
			var hHist = document.getElementsByTagName("div")["hist"].offsetHeight;
			var histPadding = .1*Math.sqrt(hHist*wHist);

			//divList.setAttribute("id", "list"+colorCode);
			
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
				.attr("id", "hist"+colorCode);
			var xScaleData = [];
			if (colorChosen!=colorCode)
				svgHist.attr("display", "none");
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
}