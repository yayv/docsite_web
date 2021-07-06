AMap.drawLines = function(map, data, callback){
	//https://lbs.amap.com/api/loca-api/demos/scatter/scatter_citys
	var styles = data.styles || {};
	var layer = new Loca.LinkLayer({
	    map: map,
	    fitView: true,
	    zIndex: styles.zIndex || 1000,
	    eventSupport: true,    // selectStyle 配置需要开启 eventSupport: true
	});

	// 传入原始数据
	layer.setData(data.data, {
	    lnglat: 'line'   // 指定坐标数据的来源，数据格式: 经度在前，维度在后，数组格式。
	});

	// 配置样式
	layer.setOptions({
	    style: {
            borderWidth: 2,
            opacity: 0.5,
            color: 'yellow'
        }
	});

	layer.render();

	callback && callback(layer);
}


AMap.drawArea = function(map, callback){
	var points = [];
	var lastPoint = '', firstPoint = '';
	var layer = null;

	// 绑定事件
	map.on('click', getPoint);

	// 解绑事件
	map.on('dblclick', function(e){
		getPoint(e);
		// map.off('click', getPoint);
		return;
	});


	function getPoint(e){
		console.log(JSON.stringify(points))

		var lnglat = e.lnglat;
		var currentPoint = [lnglat.getLng(), lnglat.getLat()].join(',');
		var type = 'drawing';

		if(lastPoint == ''){
			layer = new Loca.LinkLayer({
			    map: map,
			    fitView: false
			});

			lastPoint = currentPoint;
			firstPoint = currentPoint;
			return;
		}

		points.push({
			name: '',
			line: [lastPoint, currentPoint]
		});
		lastPoint = currentPoint;

		if(e.type == 'dblclick'){
			points.push({
				name: '',
				line: [currentPoint, firstPoint]
			});
			type = 'end';
		}


		// console.log('getPoint');
		// console.log(e);
		// console.log(points);

		drawLine(type);
	}

	function drawLine(type){
		// console.log('drawLine');
		// console.log(points);

		// 传入原始数据
		layer.setData(points, {
		    lnglat: 'line'   // 指定坐标数据的来源，数据格式: 经度在前，维度在后，数组格式。
		});

		// 配置样式
		layer.setOptions({
		    style: {
	            borderWidth: 5,
	            opacity: 1,
	            color: 'green'
	        }
		});

		layer.render();

		if(type == 'end'){
			points = [];
			lastPoint = '';
			firstPoint = '';
			callback && callback(layer, points);
		}
	}
}

AMap.roadmap = function(map, road, calback){
	//https://lbs.amap.com/api/javascript-api/reference/overlay/?sug_index=1

	var linePoints = road.line;
	var _speed = 120;  //speed为指定速度，单位：千米/小时
	var speed = road.speed || _speed;
	// positionIndex = new AMap.Lnglat(
	// 	linArr[0].Longitude,
	// 	linArr[0].Latitude
	// )
	var arr  = road.line[0];//数组第一个 起点位置

	var marker = new AMap.Marker({
		map: map,
        position:arr,//数组第一个
        icon: "https://webapi.amap.com/images/car.png",
        // icon: "http://rms.zhongzhongtech.com/user/images/car-icon.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: 30,
    });

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: linePoints,
        showDir: true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
		// strokeStyle: "solid"  //线样式
		lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
        lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
    });

    var passedPolyline = new AMap.Polyline({
        map: map,
        // path: lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
    });


    marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
    });

    map.setFitView();

    var roadmap = {
    	car: marker,
    	road: polyline,
	    start: function() {
	        marker.moveAlong(linePoints, speed);
	    },
	    pause: function() {
	        marker.pauseMove();
	    },
	    resume: function() {
	        marker.resumeMove();
	    },
	    stop: function () {
	        marker.stopMove();
	    }
    }

    calback && calback(roadmap);
}
