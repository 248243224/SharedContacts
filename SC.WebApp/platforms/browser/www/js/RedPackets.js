var RedPackets = (function () {

    var _currentLocationPoint;
    var _map;
    var _visibleBounds = 1000;// km
    var _config = new AppConfig();
    var _visibleCircle;

    return {

        MapInit: function () {
            //init location
            this.RefreshCurrentLocation();
            _map = new BMap.Map("redPackestMap", { minZoom: 15, enableClicking: true });
            _map.enableScrollWheelZoom(true);
        },
        MarkCurrentLocation: function () {
            try {
                var locationIcon = new BMap.Icon("images/location.png", new BMap.Size(30, 30));
                var marker = new BMap.Marker(_currentLocationPoint, { icon: locationIcon });
                _map.addOverlay(marker);

                var label = new BMap.Label("我的位置", { offset: new BMap.Size(20, -10) });
                marker.setLabel(label);
                label.setStyle({
                    fontSize: "12px",
                    backgroundColor: "rgba(0,0,0,0)",
                    border: "0",
                    fontWeight: "bold",
                    color: "black"
                });

                //marker.setAnimation(BMAP_ANIMATION_DROP); //flash useless in mobile
            }
            catch (e) {
                console.log(e);
                DeviceEvent.Toast("标记当前位置失败");
            }
        },
        RefreshRedPackets: function () {
            try {
                $.get(_config.redPacketsUrl, function (data) {
                    $.each(data, function () {

                        var point = new BMap.Point($(this)[0].Lng, $(this)[0].Lat);
                        RedPackets.AddPacketMarker(point);
                    })
                });
            }
            catch (e) {
                console.log(e);
            }
        },
        AddPacketMarker: function (point) {
            var packetIcon = new BMap.Icon("images/large_packet.png", new BMap.Size(35, 45), { offset: new BMap.Size(10, 25) });
            var marker = new BMap.Marker(point, { icon: packetIcon });
            _map.addOverlay(marker);
            marker.addEventListener("click", function () {
                alert("您点击了标注");
            });
        },
        GetCurrentCenter: function () { return _currentLocationPoint },
        ResetMapBounds: function () {
            //可见范围为圆弧半径加200米
            var visibleCircleBounds = new BMap.Circle(_currentLocationPoint, _visibleBounds / 2 + 200, {
                strokeColor: "black",
                strokeWeight: 0.1,
                strokeStyle: "dashed",//dashed or solid
                fillColor: "#E2E8F1",
                fillOpacity: 0.1
            });
            _map.addOverlay(visibleCircleBounds);
            var b = visibleCircleBounds.getBounds();
            try {
                BMapLib.AreaRestriction.setBounds(_map, b);
            } catch (e) {
                console.log(e);
            }
        },
        RefreshVisibleCircle: function () {
            _visibleCircle = new BMap.Circle(_currentLocationPoint, _visibleBounds / 2, {
                strokeColor: "black",
                strokeWeight: 2,
                strokeStyle: "dashed",//dashed or solid
                fillColor: "#E2E8F1",
                fillOpacity: 0.1
            });
            _map.addOverlay(_visibleCircle);            //add circle
        },
        RefreshCurrentLocation: function () {

            DeviceEvent.SpinnerShow();
            // onSuccess Callback
            // This method accepts a Position object, which contains the
            // current GPS coordinates
            //
            var onSuccess = function (position) {
                console.log('Latitude: ' + position.coords.latitude + '\n' +
                    'Longitude: ' + position.coords.longitude + '\n' +
                    'Altitude: ' + position.coords.altitude + '\n' +
                    'Accuracy: ' + position.coords.accuracy + '\n' +
                    'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                    'Heading: ' + position.coords.heading + '\n' +
                    'Speed: ' + position.coords.speed + '\n' +
                    'Timestamp: ' + position.timestamp + '\n');
                var ggPoint = new BMap.Point(position.coords.longitude, position.coords.latitude);
                RedPackets.LocationToBmapPoint(ggPoint);
            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                console.log('get position failed' + 'code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
                DeviceEvent.Toast("获取当前位置失败");
            }

            DeviceEvent.GetCurrentPosition(onSuccess, onError);
        },
        TranslateCallback: function (data) {
            if (data.status === 0) {

                //refresh location
                _currentLocationPoint = data.points[0];
                console.log("point converted: Longitude:" + _currentLocationPoint.lng + "\n Latitude:" + _currentLocationPoint.lat);
                //refresh center and zoom
                _map.centerAndZoom(_currentLocationPoint, 17);
                //rewrite visible circle
                RedPackets.RefreshVisibleCircle();
                //mark point
                RedPackets.MarkCurrentLocation();
                //mark red packets
                RedPackets.RefreshRedPackets();
                //reset visible map bounds
                RedPackets.ResetMapBounds();

                _map.setCenter(data.points[0]);
                DeviceEvent.SpinnerHide();
            }
        },
        LocationToBmapPoint: function (ggPoint) {
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 1, 5, this.TranslateCallback)
        }
    };

})();