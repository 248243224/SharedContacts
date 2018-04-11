(function () {
    RedPackets = function (TranslateCallback) {
        this._currentLocationPoint;
        this._map;
        this._visibleBounds = 1000;// km
        this._visibleCircle = null;
        this._translateCallback = TranslateCallback;
    };

    RedPackets.prototype.MapInit = function (agencyType) {
        var rp = this;
        var minZoom = 8;
        if (agencyType == 0) minZoom = 17;
        rp._map = new BMap.Map("redPackestMap", { minZoom: minZoom, enableClicking: true });
        rp._map.enableScrollWheelZoom(true);
        this.RefreshCurrentLocation();
        //refresh location every 2 minutes
        if (typeof (mapRefreshInterval) != 'undefined') {
            clearInterval(mapRefreshInterval), function () {
                mapRefreshInterval = setInterval(function () { rp.RefreshCurrentLocation(); }, scConfig.mapRefreshInterval);
            }
        }
        else {
            mapRefreshInterval = setInterval(function () { rp.RefreshCurrentLocation(); }, scConfig.mapRefreshInterval);
        }
    };
    RedPackets.prototype.MarkCurrentLocation = function () {
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
    RedPackets.prototype.RefreshRedPackets = function (userId, agencyType) {
        var rp = this;
        var positionDetailsCB = function (details) {
            details = JSON.parse(details);
            curCity = details.result.addressComponent.city;
            if (agencyType == 1) {
                //draw city boundary
                var bdary = new BMap.Boundary();
                bdary.get(curCity, function (rs) {       //获取行政区域
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeColor: "#ff0000",
                            strokeWeight: 3,
                            strokeStyle: "solid",//dashed or solid
                            fillColor: "#E2E8F1",
                            fillOpacity: 0.3
                        }); //建立多边形覆盖物
                        rp._map.addOverlay(ply);  //添加覆盖物
                        //  rp._map.setViewport(ply.getPath());    //调整视野    
                    }
                });
            }

            $.get(scConfig.redPacketsUrl, { userId: userId, lon: rp._currentLocationPoint.lng, lat: rp._currentLocationPoint.lat, city: details.result.addressComponent.city, agencyType: agencyType }, function (data) {
                $.each(data, function () {
                    if ($(this)[0].UserId == 29) {
                        var point = new BMap.Point(rp._currentLocationPoint.lng + Math.random() * 0.005, rp._currentLocationPoint.lat + Math.random() * 0.001);
                        rp.AddPacketMarker(point, $(this)[0].PacketId + "," + $(this)[0].SCUser.Name + "," + $(this)[0].SCUser.AvatarUrl);
                    } else {
                        var point = new BMap.Point($(this)[0].Lng, $(this)[0].Lat);
                        rp.AddPacketMarker(point, $(this)[0].PacketId + "," + $(this)[0].SCUser.Name + "," + $(this)[0].SCUser.AvatarUrl);
                    }
                })
            });
        }
        rp.GetPositionDetails(rp._currentLocationPoint, positionDetailsCB);
    };

    RedPackets.prototype.GetPositionDetails = function (point, callback) {
        var apiUrl = "http://api.map.baidu.com/geocoder/v2/?output=json&ak=iRgb4mnUr0w1bwoU4kTIWyzCKHYdpXEZ&location=" + point.lat + "," + point.lng;
        $.get(apiUrl, function (data) {
            callback(data);
        });
    };

    RedPackets.prototype.AddPacketMarker = function (point, packetInfo) {
        var rp = this;
        var packetIcon = new BMap.Icon("images/large_packet.png", new BMap.Size(35, 45), { offset: new BMap.Size(10, 25) });
        var marker = new BMap.Marker(point, { icon: packetIcon });
        var label = new BMap.Label(packetInfo, { offset: new BMap.Size(20, -10) });
        label.setStyle({ display: "none" });
        marker.setLabel(label);
        rp._map.addOverlay(marker);
        marker.addEventListener("click", function (e) {
            var packetInfo = e.target.getLabel().content;
            var packetId = packetInfo.split(",")[0];
            var userName = packetInfo.split(",")[1];
            var userPic = packetInfo.split(",")[2];

            $(".hot-box").data("packetid", packetId);
            $(".pop-box").find("img").attr("src", userPic);
            $(".pop-box").find(".name").text(userName);
            $('.pop-box').show();
        });
    };
    RedPackets.prototype.GetCurrentCenter = function () {
        var rp = this;
        return rp._currentLocationPoint;
    };
    RedPackets.prototype.ResetMapBounds = function () {
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
    RedPackets.prototype.RefreshVisibleCircle = function () {
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
    RedPackets.prototype.RefreshCurrentLocation = function () {
        var rp = this;
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

    RedPackets.prototype.LocationToBmapPoint = function (ggPoint) {
        var rp = this;
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, rp._translateCallback);
    };

})();
