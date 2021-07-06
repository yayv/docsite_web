(function(AMap){
	//测距
	var ruler = null;
	var isMesuritMode = false;

	function mesurit(){
	    //https://lbs.amap.com/api/javascript-api/example/mouse-operate-map/measure-distance/?sug_index=2
	    AMap.plugin(["AMap.RangingTool"],function(){   
	    	//自定义样式
	        var startMarkerOptions= {
	            icon: new AMap.Icon({
	                size: new AMap.Size(19, 31),//图标大小
	                imageSize:new AMap.Size(19, 31),
	                image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
	            })
	        };
	        var endMarkerOptions = {
	            icon: new AMap.Icon({
	                size: new AMap.Size(19, 31),//图标大小
	                imageSize:new AMap.Size(19, 31),
	                image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
	            }),
	            offset: new AMap.Pixel(-9, -31)
	        };
	        var midMarkerOptions = {
	            icon: new AMap.Icon({
	                size: new AMap.Size(19, 31),//图标大小
	                imageSize:new AMap.Size(19, 31),
	                image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
	            }),
	            offset: new AMap.Pixel(-9, -31)
	        };
	        var lineOptions = {
	            strokeStyle: "solid",
	            strokeColor: "#fff",
	            strokeOpacity: 1,
	            strokeWeight: 5
	        };
	        var rulerOptions = {
	            startMarkerOptions: startMarkerOptions,
	            midMarkerOptions:midMarkerOptions,
	            endMarkerOptions: endMarkerOptions,
	            lineOptions: lineOptions
	        };
	    	ruler = new AMap.RangingTool(map, rulerOptions);
	    	isMesuritMode = false;
	    	ruler.turnOff();

	    	AMap.event.addListener(ruler, "end", function(e){ 
	    		console.log('RangingTool End');
	    		console.log(e);
	    		// window.HisLayers.push(e.polyline);
	    	}); 

	    	AMap.event.addListener(ruler, "addnode", function(e){ 
	    		console.log('RangingTool addnode');
	    		console.log(e);
	    		// window.HisLayers.push(e.marker);
	    	});
	    }); 
		ruler.turnOn();
		isMesuritMode = true;
	}

	//关闭测距
	function mesuritOff(){
		ruler && ruler.turnOff();
		isMesuritMode = false;
	}

	//store
	function store(layer){
		AMap.HisLayers = AMap.HisLayers || [];
		AMap.HisLayers.push(layer);
	}

	//清理
	function clearAll(){
		// console.log('clearAll');
		// console.log(layers);
		var layers = AMap.HisLayers;
		layers.forEach(function(layer, index){
			// console.log(layer)
			map.remove(layer);
		});
		AMap.HisLayers = [];
	}

	AMap.utils = {
		store: store,
		clearAll: clearAll,
		mesurit: mesurit,
		mesuritOff: mesuritOff
	};
})(AMap);
