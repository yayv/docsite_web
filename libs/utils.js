window.CRS = {};

CRS.templateCache = {};

CRS.getTpl = function(id){
    return '<div>' + CNS.$(id).innerHTML + '</div>';
}

CRS.getTemplate = function(name, url){
    var tpl = CRS.templateCache[name];
	if (tpl) {
		return tpl;
	}

	var xhr = new XMLHttpRequest();
	xhr.open('get', url, false);
    xhr.send(null);

	if (xhr.readyState == 4 && xhr.status == 200) {
		tpl = '<div>' + xhr.responseText + '</div>';
		CRS.templateCache[name] = tpl;
		return tpl;
	}
}

CRS.log = function(params){
    // if(CRS.config.debug){
        console.log(params);
    // }
}

CRS.ua = function(){
    var UA = navigator.userAgent.toLowerCase();
    return  (UA.indexOf('msie')>-1) ? UA.split('; ')[1].split(' ').join('/') :
        (UA.indexOf('chrome')>-1) ? ('chrome' + UA.split('chrome')[1]).split(' ')[0] :
        (UA.indexOf('firefox')>-1) ? 'firefox' + UA.split('firefox')[1] :
        (UA.indexOf('safari')>-1) ? 'safari' + UA.split('safari')[1] :
        (UA.indexOf('opera')>-1) ? UA.split(' ')[0] : UA;
};

CRS.getFullAPI = function(api){
    var base = '/';
    if(api.indexOf('http') == 0){
        return api;
    }
    return base + api;
}

CRS.fetch = function(params, callback){
    // var data = params.data || {};
    var url = params.url;

    var headers = params.headers || {};
        headers['Content-Type'] = 'application/json';

    fetch(url, {
        // credentials: 'include',
        method: 'GET',
        headers: new Headers(headers)
    }).then(function(response){
        //打印返回的json数据
        response.json().then(function(data){
            callback(data);
        })
    }).catch(function(e){
        console.log('error: ' + e.toString());
    });
}

//post
CRS.post = function(params, callback){
    
    var data = params.data || {};
    // console.log( data )
    var url = params.url;
    var headers = params.headers || {};
        headers['Content-Type'] = 'application/json';
    fetch(url, {
        method: 'POST',
        headers: new Headers(headers),
        // credentials: 'include',
        body: JSON.stringify(data)
    }).then(function(response){     
            //打印返回的json数据
            response.json().then(function(data){
                callback(data);
            })
    }).catch(function(e){
        callback({code:'fail'});
        console.log('error: ' + e.toString());
    });
}

CRS.loadJS = function(links,callback){
    var total = links.length;
    var steps = 0;

    for(var i=0;i<links.length;i++){
        load(links[i]);
    }

    function load(url){
        var node = document.createElement("script");
            node.src = url;
        document.getElementsByTagName('head')[0].appendChild(node);
        node.onload = function(){
            steps += 1;
            if( steps >= total ){
                callback && callback();
            }
        };
    }
}

CRS.loadLib = function(libConfig, callback){
    if(typeof libConfig == 'string'){
        libConfig = CRS.res[libConfig];
    }
    if(libConfig.isLoaded){
        callback && callback();
        return;
    }
    var core = libConfig.core;
    var plugins = libConfig.plugins;

    CRS.loadJS(core, function(){
        if(!plugins){
            callback && callback();
            return;
        }
        CRS.loadJS(plugins, function(){
            libConfig.isLoaded = true;
            callback && callback();
        });
    });
}

CRS.proxy = function(callback){
    if(window.Services){
        callback(window.Services);
        return;
    }
    var page = '//mofangchuxing.com/h5/proxy.html';
    var id = 'APIProxyIframe';
    var proxy = document.getElementById(id);
    if(!proxy){
        proxy = document.createElement('iframe');
        proxy.id = 'APIProxyIframe';
        proxy.style.cssText = 'display:none;';
        proxy.src = page;
        document.body.appendChild(proxy);
    }
    if(proxy && proxy.className == 'isLoaded'){
        callback && callback(proxy.contentWindow.Services);
    };
    proxy.onload = function(){
        proxy.className = 'isLoaded';
        callback && callback(proxy.contentWindow.Services);
    }

}

CRS.isEmptyJson = function(json){
    var times = 0;
    var steps = 0;
    for(var prop in json){
        times += 1;
        if(json[prop]){
            steps += 1;
        }
    }
    // console.log(json)
    // console.log(times, steps)
    return times != steps;
}

CRS.jsonMerge = function(a, b, isWrite, filter){
    for (var prop in b)
    if (isWrite || typeof a[prop] === 'undefined' || a[prop] === null)
        a[prop] = filter ? filter(b[prop]) : b[prop];
    return a;
}

CRS.guid = function(){
    return 'mf-' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
}

CRS.trim = {
    left : function(str){
        return str.replace( /^\s*/, '');
    },
    right : function(str){
        return str.replace(/(\s*$)/g, "");
    },
    both : function(str){
        return str.replace(/^\s+|\s+$/g,"");
    },
    all : function(str){
        return str.replace(/\s+/g,"");
    }
}

//cache
CRS.cache = (function() {
    /*
    说明：
    1: JSON.stringfy --> set --> get --> JSON.parse
    2: data format well return as set`s
    3: undefined in array will be null after stringfy+parse
    4: NS --> namespace 缩写
    */
    var keyNS = 'mf-default-';

    function get(key) {
        /*
        legal data: "" [] {} null flase true

        illegal: undefined
            1: key not set
            2: key is cleared
            3: key removed
            4: wrong data format
        */
        var tempKey = keyNS + key;
        if (!isKeyExist(tempKey)) {
            return null;
        }
        // maybe keyNS could avoid conflict
        var val = localStorage.getItem(tempKey) || sessionStorage.getItem(tempKey);
        val = JSON.parse(val);
        // val format check
        if (val !== null
            && Object.prototype.hasOwnProperty.call(val, 'type')
            && Object.prototype.hasOwnProperty.call(val, 'data')) {
            return val.data;
        }
        return null;
    }
    // isPersistent
    function set(key, val, isTemp) {
        var store;
        if (isTemp) {
            store = sessionStorage;
        } else {
            store = localStorage;
        }
        store.setItem(keyNS + key, JSON.stringify({
            data: val,
            type: (typeof val)
        }));
    }

    function remove(key) {
        var tempKey = keyNS + key;
        localStorage.removeItem(tempKey);
        sessionStorage.removeItem(tempKey);
    }

    function isKeyExist(key) {
        // do not depend on value cause of ""和0
        return Object.prototype.hasOwnProperty.call(localStorage, key)
            || Object.prototype.hasOwnProperty.call(sessionStorage, key);
    }

    function setKeyNS(NS) {
        var isString = typeof NS === 'string';
        if (isString && NS !== '') {
            keyNS = NS;
        }
    }

    return {
        setKeyNS: setKeyNS,
        get: get,
        set: set,
        remove: remove
    };
})();

CRS.subs = function(temp, data, regexp){
    if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
    var ret = [];
    for(var i=0,j=data.length;i<j;i++){
        ret.push(replaceAction(data[i]));
    }
    return ret.join("");
    function replaceAction(object){
        return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
            if (match.charAt(0) == '\\') return match.slice(1);
            return (object[name] != undefined) ? object[name] : '';
        });
    }
}

CRS.getPara = function(url,name){
    // url = url.split("&apm;").join("&");
    if(url == ''){
        return '';
    }

    u = new URL(url);
    u.searchParams.sort();
    v = u.searchParams.get(name);    

/*
    var v = '', _p = name + '=';    

    if(url.indexOf("&" + _p)>-1){
        v = url.split("&" + _p)[1] || '';
    }

    if(url.indexOf("?" + _p)>-1){
        v = url.split("?" + _p)[1] || '';
    }
    v = v.split("&")[0] || '';
*/
    return v;
}

CRS.dateFormat = function(date, fmt) {
    fmt = fmt || 'yyyy.MM.dd hh:mm:ss';
    var dateObj = new Date();
    if(date){
        // date = date.split('-').join('/');
        dateObj = new Date(date);
    }
    var o = {
        "M+" : dateObj.getMonth()+1,                 //月份
        "d+" : dateObj.getDate(),                    //日
        "h+" : dateObj.getHours(),                   //小时
        "m+" : dateObj.getMinutes(),                 //分
        "s+" : dateObj.getSeconds(),                 //秒
        "q+" : Math.floor((dateObj.getMonth()+3)/3), //季度
        "S"  : dateObj.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
    }
    return fmt;
}

CRS.qrcode = function(data, callback){
    var size = 480;
    var url = data.url;
    var logo = data.logo;
    var canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
    var context = canvas.getContext("2d");

    var node = document.createElement("div");
    new QRCode(node, url.toString());
    setTimeout(draw,0);

    function draw(){
        var qcodeOrg = node.getElementsByTagName("img")[0].src;
        var img = new Image();
            img.src  = qcodeOrg;
        context.drawImage(img, 0, 0, size, size);

        var img2 = new Image();
            img2.src  = logo;

        img2.onload = function(){
            context.drawImage(img2, 200, 200, 80, 80);
            var newImageData = canvas.toDataURL("image/png");
            callback(newImageData);
        }
    }
}

CRS.getUserMedia = function(callbacks){
    var vendorUrl = window.URL || window.webkitURL;
    var _getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
     // || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({
        video: {
            width: 600,
            height: 800
        }, //使用摄像头对象
        audio: false  //不适用音频
    }, function(stream){
        console.log(stream);
        // stream = window.URL.createObjectURL(stream);
        console.log(stream);
        callbacks.ok(stream);
    }, function(error) {
        //error.code
        console.log(error);
        callbacks.fail && callbacks.fail(error);
    });
}


CRS.getImageFromVideo = function(video, callback){
    var size = 400;
    var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, size, size);
    context.save();
    var image = canvas.toDataURL("image/png");
    callback(image);
}

CRS.getLocation = function(callbacks){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPositionSuccess,getPositionError,{timeout:15000});
    }else {
         callbacks.fail && callbacks.fail("抱歉，您所使用的浏览器不支持 Geolocation 接口");
    }

    function getPositionSuccess(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var alti = position.coords.altitude;
        var acc = position.coords.accuracy;
        //var lng = position.coords.altitudeAccuracy;
        //var head = position.coords.heading
        //var speed = position.coords.speed
        // dom.info.innerHTML = "您所在的位置： 经度" + lat + "，纬度" + lng + ',海拔' + alti + ',精准度' + acc;
        callbacks.ok([lat, lng]);
    }

    function getPositionError(error){
        var err = '';
        switch(error.code){
            case error.TIMEOUT :
                err = "连接超时，请重试";
                break;
            case error.PERMISSION_DENIED :
                err = "您拒绝了使用位置共享服务，查询已取消";
                break;
            case error.POSITION_UNAVAILABLE :
                err = "我们暂时无法为您提供位置服务";
                break;
        }
        console.log(err, error);
        callbacks.fail && callbacks.fail(error);
    }
}

CRS.getLocalImageData = function(file, callback){
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(evt){
        var file = evt.target.result;
        // compressImage(file, function (base64) {
            callback && callback(file);
        // });
        // file = window.URL.createObjectURL(file);
    }
}

CRS.uploader = function(api, data, callback){
    //docs: https://docs.minio.io/cn/upload-files-from-browser-using-pre-signed-urls.html

    // `upload` iterates through all files selected and invokes a helper function called `retrieveNewURL`.
    var fn = function(data){
        console.log(data);
    }
    callback = callback || fn;

    // 发请求到Node.js server获取上传URL。
    // `retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
    // generate a pre-signed URL for use in uploading that file:
    var files = data.files;
    CRS.post({
        url: api,
        data: {
            count: data.count || 1,
            userId: data.userId
        }
    },function(result){
        if(result.code == 'ok'){
            var urls = result.data;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var url = urls[i];

                // 上传文件到服务器
                uploadFile(file, url, callback);
            }
        }else{
            console.error(result);
        }
    });

    // 使用Fetch API来上传文件到S3。
    // ``uploadFile` accepts the current filename and the pre-signed URL. It then uses `Fetch API`
    // to upload this file to S3 at `play.min.io:9000` using the URL:
    function uploadFile(file, url, callback) {
        fetch(url.upload, {
            method: 'put',
            body: file
        }).then(() => {
            // If multiple files are uploaded, append upload status on the next line.
            // document.querySelector('#status').innerHTML += `<br>Uploaded ${file.name}.`;
            var result = {
                code: 'ok',
                data: {
                    name: file.name,
                    size: Math.ceil(file.size/1024),
                    url: url.view
                },
                originFile: file
            };
            // console.log('uploaded', result);
            callback(result);
        }).catch((e) => {
            console.error(e);
            callback({
                code: 'fail',
                data: e
            });
        });
    }
}

CRS.print = function(obj){
    var newWindow = window.open("打印窗口","_blank");
    var docStr = obj.innerHTML;

    newWindow.document.write('<lin' + 'k hr' + 'ef="//frontend.mofangchuxing.com/element-ui/index.css?print" re' + 'l="stylesheet">');
    newWindow.document.write('<lin' + 'k hr' + 'ef="ent.css?print" re' + 'l="stylesheet">');


    newWindow.document.write(docStr);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
}
