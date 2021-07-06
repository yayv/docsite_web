AMap.drawPoints = function(map, data, callback){
	//https://lbs.amap.com/api/loca-api/demos/scatter/scatter_citys
	var styles = data.styles || {};
	var layer = new Loca.ScatterPointLayer({
	// var layer = new Loca.IconLayer({
	    map: map,
	    zIndex: styles.zIndex || 1000,
		eventSupport: true,    // selectStyle 配置需要开启 eventSupport: true
		fitView: true
	});

	// 传入原始数据
	layer.setData(data.data, {
	    lnglat: 'lnglat'   // 指定坐标数据的来源，数据格式: 经度在前，维度在后，数组格式。
	});

	//配置样式
	var size = styles.size || 20;
	var color = styles.color || 'white';
	var opacity = styles.opacity || 1;
	layer.setOptions({
		unit: 'px',
	    style: {
	    	opacity: opacity,
	        radius: size/2,     // 圆形半径，单位像素
	        color: color, // 填充颜色
	        borderWidth: size/2,   // 边框宽度
	        borderColor: color  // 边框颜色
	    },
	    selectStyle: {
            radius: size/2 + 5,
            color: 'green',
            borderColor: 'green'
		},
		//气租猫图标
		// source: function (res) {
		// 	// console.log(res)
        //     var i = res.index;
        //     return 'http://rms.zhongzhongtech.com/user/images/car-icon.png';
		// }, 
		// style: {
        //     size: 28,
        // }
	});

	layer.render();

	callback && callback(layer);
}
