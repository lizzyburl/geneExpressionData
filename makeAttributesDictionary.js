//function to make a dictionary of attributes
function makeAttributesDictionary(){
	var attrData = window.attrData;
	//get keys (i.e. gender, age, tissue type)
	var keys = d3.keys(attrData[0].sample);
	//create the html select element
	d3.select("#selectColorCode")
		.selectAll("option")
		.data(keys)
		.enter()
		.append("option")
		.attr("value", function(d){return d;})
		.text(function(d){return d;});
	//create a map for attributes
	attributes = d3.map();
	keys.forEach(function(key){
	var typeIndicator = attrData[0].sample[key];
		var attrValue = {
			key : key,
			dataType: typeof typeIndicator,
		}
		if (attrValue.dataType == "number"){
			attrValue.colorInterpolator = createInterpolatorNumber(key);
		}else if (attrValue.dataType == "string"){
			listOfColorOptions(key);
			attrValue.colorInterpolator = createInterpolatorString(key);
		}
		attributes.set(key, attrValue);
		});
		window.attributes = attributes;
		
} //end function make attributes array
function listOfColorOptions(key){
	var colorOptions = [];
	//make array of different types for color interpolation domain
	window.attrData.forEach(function(val){
		if (colorOptions.indexOf(val.sample[key])<0)
				colorOptions.push(val.sample[key]);
});
	window.colorTypes.set(key, colorOptions);
}//end function listOfColorOptions

function createInterpolatorString(key){
	var colorInterpolator;
	colorOptions = window.colorTypes.get(key);
	if(colorOptions.length<=10){
		colorInterpolator = d3.scale.category10()
		.domain(colorOptions);
	}
	else if (colorOptions.length<=20){
		colorInterpolator = d3.scale.category10()
		.domain(colorOptions);
	}
	else{
		colorRange = [];
		colorOptions.forEach(function(col, i){
			var hueVal = i*280/colorOptions.length;
			var hueColor =  "hsl(" + (hueVal) + ", 100%, 50%)";
			colorRange[i] = hueColor;
		});
		//creates an ordinal scale interpolator based on the interpolated colors
		colorInterpolator = d3.scale.ordinal()
		.domain(colorOptions)
		.range(colorRange);
	}
	return colorInterpolator;
}//end of function createInterpolatorString
function createInterpolatorNumber(key){
		var color1 = "yellow";
		var color2 = "blue";
		var colorDomain = d3.extent(attrData, function(d){return d.sample[key]; });
		//var keyMax = d3.max(attrData, function(d){return d.sample[key]; })
		if (Math.abs(d3.hsl(color1).h - d3.hsl(color2).h)>200) //this is here in case we decide to go red -> purple or red -> blue
			{
				 colorInterpolator = d3.scale.linear()
				.domain( colorDomain ) 
				.interpolate(d3.interpolateRgb)
				.range([color1,  color2]);
			}
		else 
			{
			color1 = d3.hsl(color1);
			color2 = d3.hsl(color2);
			colorInterpolator = d3.scale.linear()
				.domain(colorDomain)
				.interpolate(d3.interpolateHsl)
				.range([color1, color2]);
			}
		return colorInterpolator;
} //end of function createInterpolatorNumber