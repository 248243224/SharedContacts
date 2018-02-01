(function() {
    RedPackets = function(TranslateCallback) {
        this._currentLocationPoint;
        this._map;
        this._visibleBounds = 1000;// km
        this._visibleCircle = null;
        this._translateCallback = TranslateCallback;
    };
    RedPackets.prototype.MapInit = function() {
        var rp = this;
        rp._map = new BMap.Map("redPackestMap", { minZoom: 15, enableClicking: true });
        rp._map.enableScrollWheelZoom(true);
        this.RefreshCurrentLocation();
        //refresh location every 30 seconds
        setInterval(function() { rp.RefreshCurrentLocation(); }, scConfig.mapRefreshIntervel);
    };
    RedPackets.prototype.MarkCurrentLocation = function() {
        var rp = this;
        var locationIcon = new BMap.Icon("images/location.png", new BMap.Size(30, 30));
        var marker = new BMap.Marker(rp._currentLocationPoint, { icon: locationIcon });
        rp._map.addOverlay(marker);

        var label = new BMap.Label("我的位置", { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
        label.setStyle({
            fontSize: "12px",
            backgroundColor: "rgba(0,0,0,0)",
            border: "0",
            fontWeight: "bold",
            color: "black"
        });
        marker.setAnimation(BMAP_ANIMATION_DROP); //flash useless in mobile
    };
    RedPackets.prototype.RefreshRedPackets = function() {
        var rp = this;
        $.get(scConfig.redPacketsUrl, function(data) {
            $.each(data, function() {

                var point = new BMap.Point($(this)[0].Lng, $(this)[0].Lat);
                rp.AddPacketMarker(point);
            })
        });
    };
    RedPackets.prototype.AddPacketMarker = function(point) {
        var rp = this;
        var packetIcon = new BMap.Icon("images/large_packet.png", new BMap.Size(35, 45), { offset: new BMap.Size(10, 25) });
        var marker = new BMap.Marker(point, { icon: packetIcon });
        rp._map.addOverlay(marker);
        marker.addEventListener("click", function() {
            alert("您点击了标注");
        });
    };
    RedPackets.prototype.GetCurrentCenter = function() {
        var rp = this;
        return rp._currentLocationPoint
    };
    RedPackets.prototype.ResetMapBounds = function() {
        var rp = this;

        //可见范围为圆弧半径加200米
        var visibleCircleBounds = new BMap.Circle(rp._currentLocationPoint, rp._visibleBounds / 2 + 200, {
            strokeColor: "black",
            strokeWeight: 0.1,
            strokeStyle: "dashed",//dashed or solid
            fillColor: "#E2E8F1",
            fillOpacity: 0.1
        });
        rp._map.addOverlay(visibleCircleBounds);
        var b = visibleCircleBounds.getBounds();
        BMapLib.AreaRestriction.setBounds(rp._map, b);
    };
    RedPackets.prototype.RefreshVisibleCircle = function() {
        var rp = this;

        rp._visibleCircle = new BMap.Circle(rp._currentLocationPoint, rp._visibleBounds / 2, {
            strokeColor: "black",
            strokeWeight: 2,
            strokeStyle: "dashed",//dashed or solid
            fillColor: "#E2E8F1",
            fillOpacity: 0.1
        });
        rp._map.addOverlay(rp._visibleCircle);            //add circle
    };
    RedPackets.prototype.RefreshCurrentLocation = function() {
        var rp = this;
        DeviceEvent.SpinnerShow();
        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        var onSuccess = function(position) {
            console.log('Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n');
            var ggPoint = new BMap.Point(position.coords.longitude, position.coords.latitude);
            rp.LocationToBmapPoint(ggPoint);
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            console.log('get position failed' + 'code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
            DeviceEvent.Toast("获取当前位置失败");
        }

        DeviceEvent.GetCurrentPosition(onSuccess, onError);
    };

    RedPackets.prototype.LocationToBmapPoint = function(ggPoint) {
        var rp = this;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, rp._translateCallback);
    };

})();
