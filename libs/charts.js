(function(CRS){
	var colors = ["hsl(210, 53.94%, 71.775%)", "hsl(210, 78.57%, 29%)", "hsl(210, 49.45%, 58.46%)", "hsl(210, 42.86%, 42%)", "hsl(210, 73.05%, 59.185%)", "hsl(210, 73.91%, 45.425%)", "hsl(210, 82.01%, 77.76%)", "hsl(210, 69.65%, 50%)", "hsl(210, 89.08%, 63%)", "hsl(210, 53.92%, 52.26%)", "hsl(210, 50.33%, 51%)", "hsl(210, 56.91%, 67.51%)", "hsl(210, 92.31%, 38%)", "hsl(210, 44.13%, 62%)", "hsl(210, 80.31%, 79%)", "hsl(210, 98.02%, 33.835%)", "hsl(210, 92.52%, 86.625%)", "hsl(210, 88.68%, 47.17%)", "hsl(210, 62.6%, 47.97%)", "hsl(210, 83.49%, 25%)"];

	var drawLines = function(id, data){
		var title = data.title || '';
		var yAxis = data.data;
		var xAxis = data.xAxis;
		var series = [];
		var legend = [];

		for(var i=0;i<yAxis.length;i++){
			var item = yAxis[i];
			legend.push( item.name );
			series.push({
				name: item.name,
				type: 'line',
				// stack: '总量',
				data: item.data
			});
		}

		var option = {
		    title: {
		        text: title
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data: legend
		    },
		    grid: {
		        left: '2%',
		        right: '2%',
		        bottom: '2%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            // saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category', //https://www.echartsjs.com/zh/option.html#xAxis.type
		        // boundaryGap: ['10%', '100%'],
		        axisTick: {
		        	inside: true
		        },
		        axisLabel: {
		        	show: true,
		        	rotate: 55
		        },
		        data: xAxis
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: series
		};

		console.log('line option');
		console.log(option);

		// getList(randomNumber,100)
		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var drawCircles = function(id, data){
		// ['60', '70', '90', '4','5'],
		var labels = [];
		var values = [];

		data = data.data;

		function getColor(_color, val){
			var index = Math.ceil(val/10);
			return colors[index];
			var warnings = ["#ed473a", "#f39631"];
			if(val > 80){
				return warnings[0];
			}else if(val > 60){
				return warnings[1];
			}else{
				return _color;
			}
		}

		for(var i=0;i<data.length;i++){
			labels.push(data[i]);

			values.push({
				value: data[i]/100,
				itemStyle: {
					color: getColor(colors[i], data[i])
				}
			});
		}
		var option = {
		    angleAxis: {
		    	max: 1,
		    	axisLine: {
		    		lineStyle : {color: "#ccc", width: 1}
		    	},
		    	splitLine: {
		    		lineStyle : {color: "#ccc", width: 1, opacity: 0.5}
		    	},
		    	axisTick: {
		    		show: false
		    	},
		    	splitArea: {
		    		show: false
		    	},
		    	axisLabel: {
		    		show: false
		    	}
		    },
		    radiusAxis: {
		        type: 'category',
		        min: 1,
		        data: labels,
		        z: 10
		    },
		    polar: {},
		    series: [{
		        type: 'bar',
		        data: values,
		        coordinateSystem: 'polar',
		        // name: 'ddddddddddd',
		        stack: 'a'
		    }],
		    legend: {
		        show: false,
		        data: ['A', 'B', 'C',"D", "E"]
		    }
		};

		console.log('draw circles');
		console.log(values);

		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var draWaver = function(id, data){
		// var data = [["5-05",116],["5-06",129],["6-24",60]];
		data = data.data;

		console.log('draWaver');
		console.log(data);

		var dateList = data.map(function (item) {
		    return item[0];
		});
		var valueList = data.map(function (item) {
		    return item[1];
		});

		var valueList2 = [];
		var isCompare = data[0].length == 3;
		if(isCompare){
			valueList2 = data.map(function (item) {
			    return item[2];
			});
		}

		var option = {
		    // Make gradient line here
		    visualMap: [{
		        show: false,
		        type: 'continuous',
		        seriesIndex: 0
		    }],
		    title: [],
		    tooltip: {
		        trigger: 'axis'
		    },
		    xAxis: [{
		        data: dateList,
		        axisTick: {interval:0}
		    }],
		    yAxis: [{
		        splitLine: {show: false},
		        min : 2,
		        max: 100
		    }],
		    grid: [{
		    	top: '10%',
		    	left: '10%',
		    	right: '5%',
		        bottom: '10%'
		    }],
		    series: [{
		        type: 'line',
        		smooth: true,
		        showSymbol: false,
		        lineStyle: {
		        	color: colors[3],
		        	width: 1
		        },
		        data: valueList
		    }]
		};

		if(isCompare){
			option.series.push({
		        type: 'line',
        		smooth: true,
		        showSymbol: false,
		        lineStyle: {
		        	color: "green",
		        	width: 1
		        },
		        data: valueList2
		    });
		}

		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var drawColums = function(id, data){
		//https://www.echartsjs.com/examples/zh/editor.html?c=dynamic-data
		var isVertical = data.isVertical;
		var title = data.title;
		var series = data.data;

		series.forEach(function(serie){
			serie.type = 'bar';
		});

		var option = {
			color: colors,
		    title: {
		        text: title
		    },
		    xAxis: {
		        type: 'category',
		        axisTick: {
		        	show: true,
			        inside: true
		        },
		        axisLabel: {
		        	show: true,
		        	rotate: 90
		        },
		        data: data.xAxis
		    },
		    yAxis: [
		        {
		            type: 'value',
		            scale: true,
		            name: '出车天数',
		            max: 30,
		            min: 0,
		            boundaryGap: [0.2, 0.2]
		        },
		        {
		            type: 'value',
		            scale: true,
		            name: '车辆租金',
		            max: 2200,
		            min: 0,
		            boundaryGap: [0.2, 0.2]
		        }
		    ],
		    series: series
		};

		// getList(randomNumber,100)
		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var drawPie = function(id, data){
		var series = data.data;

		series.forEach(function(item, index){
			item.itemStyle = {
				color : colors[index%colors.length]
			}
		});

		var option = {
		    title : {
		        text: data.title,
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        type: 'scroll',
		        orient: 'vertical',
		        right: 10,
		        top: 20,
		        bottom: 20,
		        show: data.show
		    },
		    series : [
		        {
		            name: data.name,
		            type: 'pie',
		            radius : '85%',
		            center: ['40%', '50%'],
		            data: series,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};

		// getList(randomNumber,100)
		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var drawFunnel = function(id, data){
		var legends = [];
		var data1 = [], data2 = [];

		for(var i=0;i<data.length;i++){
			data1.push({
				name: data[i].name,
				value: data[i].value1
			});
			data2.push({
				name: data[i].name,
				value: data[i].value2
			});
			legends.push(data[i].name);
		}

		var option = {
		    title: {
		        text: ' ',
		        subtext: ' '
		    },
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}%"
		    },
		    legend: {
		        data:  legends
		    },
		    series: [
		        {
		            name: '预期',
		            type: 'funnel',
		            left: '10%',
		            width: '80%',
		            label: {
		                formatter: '{b}预期'
		            },
		            labelLine: {
		                show: false
		            },
		            itemStyle: {
		                opacity: 0.7
		            },
		            emphasis: {
		                label: {
		                    position: 'inside',
		                    formatter: '{b}预期: {c}%'
		                }
		            },
		            data: data1
		        },
		        {
		            name: '实际',
		            type: 'funnel',
		            left: '10%',
		            width: '80%',
		            maxSize: '80%',
		            label: {
		                position: 'inside',
		                formatter: '{c}%',
		                color: '#fff'
		            },
		            itemStyle: {
		                opacity: 0.5,
		                borderColor: '#fff',
		                borderWidth: 2
		            },
		            emphasis: {
		                label: {
		                    position: 'inside',
		                    formatter: '{b}实际: {c}%'
		                }
		            },
		            data: data2
		        }
		    ]
		};

		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	var drawStacks = function(id, data){
		var xAxis = data.xAxis;
		var legends = [];

		var stacks = data.stacks;
		for(var i=0;i<stacks.length;i++){
			legends.push(stacks[i].name);
			stacks[i].type = 'bar';
			stacks[i].barWidth = 10;
		}

		var option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    legend: {
		        data: legends
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: [
		        {
		            type: 'category',
		            data: xAxis
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value'
		        }
		    ],
		    series: stacks
		};

		// console.log(option)

		var target = document.getElementById(id);
		var _chart = echarts.init(target);
			_chart.setOption(option);
	}

	CRS.charts = {
		lines: drawLines,
		colums: drawColums,
		circles: drawCircles,
		curves: draWaver,
		pie: drawPie,
		funnel: drawFunnel,
		stacks: drawStacks
	};
})(window.CRS = window.CRS || {});
