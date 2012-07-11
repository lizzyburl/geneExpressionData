function makeAttributesDictionary(){
	attrData = window.attrData;
 //returns an array of keys (i.e. gender, age, id, ancestry, etc.)
	    var getKeys = Object.keys(attrData[0].sample);
	    //creates an array to hold keyTypeObject objects
	    var attributes = {};
		var select = document.getElementById("selectColorCode");
	    /*The keyTypeObject has:
	            for all
		          key (i.e. gender, age, etc.)
			        dataType (i.e. number, string, etc.)
				      for numbers
				            keyMax (maximum value that ever occurs for this key)
					          keyMin (minimum value that ever occurs for this key)
	    */
	    var keyTypeObject;
	    //function to create colorObjects. These contain i.d.s (i.e. male, female), and colors that correspond with those i.d.s
	  /*  function colorObject (id, color, numOfType)
	    {
		this.id = id;
		this.color = color;
		this.numOfType = numOfType;
	    };*/
	    
			var isInSelect = (select.length==0);
		
			//loops through the keys that were returned to create the keyTypeObjects
		getKeys.forEach( function(keyTemp, i){
		    //gets the first value in the data set to verify the type of the key
		    var typeIndicator = attrData[0].sample[keyTemp];
		function colorObject (id, color, numOfType)
	    {
		this.id = id;
		this.color = color;
		this.numOfType = numOfType;
	    };
		    if(isInSelect)
				select.options[select.options.length] = new Option(keyTemp, keyTemp);
		    //creates a keyTypeObject
		    keyTypeObject = {
			key: keyTemp,
			dataType: typeof typeIndicator
		    };
			var colorInterpolator;
		    //gives the object the min and max properties if it is a number.
		    if (keyTypeObject.dataType == "number")
			{
				
			    keyTypeObject.keyMax = d3.max(attrData, function(d){return d.sample[keyTypeObject.key]; }); 
			    keyTypeObject.keyMin = d3.min(attrData, function(d){return d.sample[keyTypeObject.key]; });
			    keyTypeObject.colorMin = "yellow";
				keyTypeObject.colorMax = "blue";
				var color1 = keyTypeObject.colorMin;
				var color2 = keyTypeObject.colorMax;
				if (Math.abs(d3.hsl(color1).h - d3.hsl(color2).h)>200)
					{
					     colorInterpolator = d3.scale.linear()
						.domain( [keyTypeObject.keyMin , keyTypeObject.keyMax] ) //
						.interpolate(d3.interpolateRgb)
						.range([color1,  color2]);
					}
				else 
					{
					color1 = d3.hsl(color1);
					color2 = d3.hsl(color2);
					colorInterpolator = d3.scale.linear()
						.domain([keyTypeObject.keyMin, keyTypeObject.keyMax])
						.interpolate(d3.interpolateHsl)
						.range([color1, color2]);
					}
				keyTypeObject.colorInterpolator = colorInterpolator;
			}
		    else if (keyTypeObject.dataType == "string")
			{
			    //stringTypes is an array that will hold colorObjects
			    var stringTypes = [];
			    //this is an array that will just hold the ids of key object. This exists for the purpose of checking whether or not the id already exists before creating a new object for it.
			    var stringTypesCheck =[];
				keyTypeObject.colorsList = {};

			    //goes through the whole data set to look for different definitions of the temporary key.
			    attrData.forEach(function(keyValue){
				        
				    //if this new definition (i.e. female) does not already exist
				    if(stringTypesCheck.indexOf(keyValue.sample[keyTemp])<0)
					{
					    //creates a new color object for the definition and assigns it a dummy variable color
					    var colorTemp = new colorObject( keyValue.sample[keyTemp], "#ff0000", 1);
						
					    //pushes the definition to the array and the color object to the array of color objects.
					    stringTypesCheck.push(keyValue.sample[keyTemp]);
					    stringTypes.push(colorTemp);
						keyTypeObject.colorsList[keyValue.sample[keyTemp]] = colorTemp;
						
					}
				    else 
					{
					    keyIndex = stringTypesCheck.indexOf(keyValue.sample[keyTemp]);
					    var numBefore = stringTypes[keyIndex].numOfType;
					    stringTypes[keyIndex].numOfType = numBefore + 1;
					    keyTypeObject.colorsList[keyValue.sample[keyTemp]].numOfType= numBefore + 1;   
					}			        
				});
			    //adds the array of color objects to the keyTypeObject object
			    //keyTypeObject.colorsList = stringTypes;
			    //counts how long the list is
				
			    keyTypeObject.numColors = stringTypes.length;
			var j = 0;	
		for(colorObjectId in keyTypeObject.colorsList){
			var colorObject = keyTypeObject.colorsList[colorObjectId];
			if(keyTypeObject.numColors<6)
		{
		var presetColors= ["hsl(54, 100%, 51%)", "hsl(142, 100%, 44%)", "red", "hsl(290, 100%, 39%)", "hsl(28, 100%, 58%)",  "hsl(215, 100%, 40%)"];
		}
			if(keyTypeObject.numColors<6)
			{
			
			if(keyTypeObject.key=="gender"||keyTypeObject.key=="sex")
				{
				if(colorObject.id=="male"||colorObject.id=="man"||colorObject.id=="boy")
				   colorObject.color = "blue";
				else if (colorObject.id=="woman"||colorObject.id=="female"||colorObject.id=="girl")
					colorObject.color = "fuchsia";
				else {
					colorObject.color = presetColors[j];
					j++;
					}
				}
			else
				{
				colorObject.color = presetColors[j];
				j++;
				}
			}
		else{
			
			var hueVal = j*280/keyTypeObject.numColors;
			var hueColor =  "hsl(" + (hueVal) + ", 100%, 50%)";
			colorObject.color =  hueColor;//colorInterpolator(j);
			   }
			}
		    
			}
			attributes[keyTemp] = keyTypeObject;
		});
		
		return attributes;
}
