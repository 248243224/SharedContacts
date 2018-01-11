var RedPackets = (function () {

    var _currentLocationPoint;
    var _map;
    var _visibleBounds = 1000;// km
    var _config = new AppConfig();

    return {

        MapInit: function () {
            //init location
            this.RefreshCurrentLocation();
            _map = new BMap.Map("redPackestMap", { minZoom: 10, enableClicking: true });
            _map.enableScrollWheelZoom(true);
        },
        MarkCurrentLocation: function () {
            try {
                var locationIcon = new BMap.Icon("img/location.png", new BMap.Size(100, 100));
                var marker = new BMap.Marker(_currentLocationPoint, { icon: locationIcon });
                _map.addOverlay(marker);

                var label = new BMap.Label("我的位置", { offset: new BMap.Size(20, -10) });
                marker.setLabel(label);
                label.setStyle({
                    fontSize: "12px",
                    backgroundColor: "rgba(0,0,0,0)",
                    border: "0",
                    fontWeight: "bold",
                    color:"black"
                });

                //marker.setAnimation(BMAP_ANIMATION_DROP); //flash useless in mobile
            }
            catch (e) { console.log(e); }
        },
        RefreshRedPackets: function () {
            try {
                $.get(_config.redPacketsUrl, function (data) {
                    $.each(data, function () {

                        var point = new BMap.Point($(this)[0].Lng, $(this)[0].Lat);
                        RedPackets.AddMarker(point);
                    })
                });
            }
            catch (e) {
                console.log(e);
            }
        },
        AddMarker: function (point) {
            var marker = new BMap.Marker(point);
            _map.addOverlay(marker);
        },

        ResetMapBounds: function () {
            var b = new BMap.Bounds(new BMap.Point(121.50228608265713, 30.247565690084752), new BMap.Point(121.70228608265713, 32.247565690084752));
            try {
                BMapLib.AreaRestriction.setBounds(_map, b);
            } catch (e) {
                console.log(e);
            }
        },
        RefreshVisibleCircle: function () {
            var circle = new BMap.Circle(_currentLocationPoint, _visibleBounds / 2, {
                strokeColor: "black",
                strokeWeight: 2,
                strokeStyle: "dashed",//dashed or solid
                fillColor: "#E2E8F1",
                fillOpacity: 0.5
            });
            _map.addOverlay(circle);            //add circle
        },
        RefreshCurrentLocation: function () {
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
                //RedPackets.ResetMapBounds();

                _map.setCenter(data.points[0]);
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