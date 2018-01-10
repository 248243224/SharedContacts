var RedPackets = (function () {

    var _currentLocationPoint;
    var _map;
    var _visibleBounds = 1000;// km

    return {

        MapInit: function () {
            //init location
            this.RefreshCurrentLocation();
            _map = new BMap.Map("redPackestMap", { minZoom: 10, enableMapClick: false });
            _map.enableScrollWheelZoom(true);
        },
        MarkCurrentLocation: function () {

            var locationIcon = new BMap.Icon("img/location.png", new BMap.Size(100, 100));
            var marker = new BMap.Marker(_currentLocationPoint, { icon: locationIcon });
            _map.addOverlay(marker);
            //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //flash
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
                strokeColor: "blue",
                strokeWeight: 2,
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

                //reset visible map bounds
                RedPackets.ResetMapBounds();

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