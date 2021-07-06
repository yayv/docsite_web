(function(AMap){
    var infoWin;
    /**
     * 封装便捷的撞题
     * @param {AMap.Map} map
     * @param {Array} event
     * @param {Object} content
     */
    function open(map, event, content) {
        if (!infoWin) {
            infoWin = new AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                offset: new AMap.Pixel(5, 1)
            });
        }

        var x = event.offsetX || '';
        var y = event.offsetY || '';

        var lngLat = map.containerToLngLat(new AMap.Pixel(x, y));
        let infoDom = document.createElement('div');
        infoDom.innerHTML = content.tpl;
        infoWin.setContent(infoDom);
        infoWin.open(map, lngLat);
    }

    function close() {
        if (infoWin) {
            infoWin.close();
        }
    }

    AMap.infoWindow = {
        open: open,
        close: close
    };
})(AMap);
