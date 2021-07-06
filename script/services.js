;(function(){
	var CRS = window.CRS;
    var a = 1;
	var LocalCache = {};
	var createKey = function(api, data){
        var key = {
			api: api,
			data: data || {}
		};
		key = encodeURIComponent(JSON.stringify(key));
		return key;
	}

	var getFullAPI = function(api){
		return '' + api;
	}

	var get = function(api, callback, data){
		var key = createKey(api, data);
		if(LocalCache[key]){
			callback(LocalCache[key]);
			return;
		}
		var url = getFullAPI(api);

		if(url.indexOf('?') == -1){
			url += '?'
		}
		data = data || {};
		for(var prop in data){
			url += (prop + '=' + encodeURIComponent(data[prop]) + '&')
		}

		CRS.fetch({
			url: url
		},function(result){
			result = result || {};
			LocalCache[key] = result.data;
			resultCheck(result, url, callback);
		});
	}

	var post = function(api, callback, data){
		var key = createKey(api, data);
		if(LocalCache[key]){
			callback(LocalCache[key]);
			return;
		}
		var url = getFullAPI(api);
		CRS.post({
			url: url,
			data: data
		},function(result){
			result = result || {};
			LocalCache[key] = result.data;
			resultCheck(result, url, callback);
		});		
	};

	var resultCheck = function(result, url, callback){
		if(!result && typeof result != 'object'){
			console.log('系统错误，请联系管理员！');
			console.log('接口 ' + url + ' 请求失败', result.message);
			return;
		}
		result.code = result.code || 'ok';
		if(result.code == 'ok'){
			result.code = 'ok';
			callback && callback(result.data);
			return;
		}else if(result.code == 'fail'){
			callback && callback(result);
			// alert(result.message)
			return
		}
		else if(result.code == 'deny'){
		  if(a == 1){
			callback && callback(result);
			var msg = result.message || '抱歉，您没有当前无权操作和访问，请联系管理人员';
			
			Vue.prototype.$alert('登录已过期请重新登陆', '提示', {
				confirmButtonText: '确定',
				callback: action => {
					//清理session
					CRS.cache.remove('enterprise');
				    CRS.cache.remove('userInfo');
					var link = location.href.replace("/main.html", "/index.html");
					location.href = link.split('#')[0];
					//返回登录
				}
			});
		  }	
			a = 2;
		}
		else if(result.code == 'nologin'){
			callback && callback(result);
			var msg = result.message || '当前用户没有登录，请重新登录';
			if(url == '/eapi/account/login'){
				CRS.cache.remove('enterprise');
				CRS.cache.remove('userInfo');
		        var link = location.href;
		        link = link.replace("/main.html", "/index.html");
		        location.href = link;
				return;
			}
			console.log(msg);
		}
		else if(result.code == 'error'){
			var msg = result.message || '系统错误';
			if(url == '/eapi/account/login'){
				CRS.cache.remove('enterprise');
				CRS.cache.remove('userInfo');
		        var link = location.href;
		        link = link.replace("/main.html", "/index.html");
		        location.href = link;
				return;
			}
			console.error(msg);
		}else{
			var msg = result.message || '未知错误';
			console.error(msg);
		}
		console.log(url, result);
	}

	//Account1
	var Account = {
		login: function(callback, data){
			/*
			var data = {
				"username":"*string",
				"password":"*string",
				"verify":"*verify"
			}
			*/
			var api = '/api/account/login';
			post(api, callback, data);
		},
		logout: function(callback){
			var api = '/api/account/logout';
			post(api, callback);
		},
		updatePassword: function(callback, data){
			var api = '/api/account/updatePassword';
			var url = getFullAPI(api);
			CRS.post({
				url: url,
				data: data
			},callback);
			// post(api, callback, data);
		},

		readMessage: function(callback, data){
			var api = '/api/message/readMessage';
			post(api, callback, data);
		},
		readAllMessages: function(callback){
			var api = '/api/message/readAllMessages';
			post(api, callback);
		},

	};
	//消息
	var Message = {

	}

	//公司信息设置
	var SetInfo = {
		
	};

	//系统设置
	var System = {

	};

	//车型相关
	var CarType = {

	};

	//车辆相关
	var Car = {

	};

	//服务项
	var Addons = {

	};

	//支付接口
	var Money = {

	};

	//日租订单
	var DayRent = {

	};

	//月租
	var MonthRent = {

	};

	var Contract = {

		
	}
    //导出
	var Export = {

	}

	//客户管理
	var CS = {

	};

	var Uploader = function(files, callback, data){
		var api = '/eapi/files/getUploadURL';
		data.count = files.length;
		data.files = files;
		CRS.uploader(api, data, function(result){
			resultCheck(result, api, callback);
		});
	}


	var UploadBase64 = function(callback, data){
		var api = '/eapi/files/uploadBase64';
		post(api, callback, data);
	}

	var Drivers = {

	};

	var Invoices = {

	};

	var LongPay = {

	};

	var CarCare = {

	};

	var MantanFact = {

	};

	var Stat = {


	};

	var Finan = {


	};

	var AMC = {

	};

	var Insu = {

	};

	var GPS = {

	}

	var GreengoReport = {


	}

	var Chartered = {

	}	

	window.Services = {
		Account: Account,
		SetInfo: SetInfo,
		System: System,
		CarType: CarType,
		Car: Car,
		Money: Money,
		DayRent: DayRent,
		CS: CS,
		MonthRent: MonthRent,
		Contract: Contract,
		Uploader: Uploader,
		UploadBase64: UploadBase64,
		Addons: Addons,
		Drivers: Drivers,
		Invoices: Invoices,
		LongPay: LongPay,
		CarCare: CarCare,
		MantanFact: MantanFact,
		Stat: Stat,
		Finan: Finan,
		Insu: Insu,
		AMC: AMC,
		GPS: GPS,
		Message:Message,
		Export:Export,
		GreengoReport:GreengoReport,
		Chartered:Chartered,
	};
})();
