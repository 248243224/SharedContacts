/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var curPage = "";
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        this.RouteInit();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // disable back button in andriod
        document.addEventListener("backbutton", this.BackButtonCallback, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        if (id == "deviceready") {
            console.log('Received Event: ' + id);
            //init status bar
            if (cordova.platformId != 'android') {
                StatusBar.styleDefault();
                StatusBar.overlaysWebView(true);
            }
            else {
                StatusBar.overlaysWebView(false);
            }
            //init fast click
            FastClick.attach(document.body);
        }
    },
    BackButtonCallback: function () { },
    RouteInit: function () {
        try {
            angular.module('ngRouteScApp', ['ui.router', 'ngAnimate'])
                .config(function ($stateProvider, $urlRouterProvider) {
                    $stateProvider
                        .state('guide', {
                            url: "/guide",
                            views: {
                                'other': {
                                    templateUrl: 'views/guide.html',
                                    controller: 'GuideController'
                                }
                            }
                        })
                        .state('map', {
                            url: "/map",
                            cache: true,
                            views: {
                                'content': {
                                    templateUrl: 'views/map.html',
                                    controller: 'MapController'
                                },
                                'footer': {
                                    templateUrl: 'views/footer.html',
                                    controller: 'FooterController'
                                }
                            }

                        })
                        .state('login', {
                            url: "/login",
                            views: {
                                'other': {
                                    templateUrl: 'views/login.html',
                                    controller: 'LoginController'
                                }
                            }
                        })
                        .state('contacts', {
                            url: "/contacts",
                            cache: true,
                            views: {
                                'content': {
                                    templateUrl: 'views/contacts.html',
                                    controller: 'ContactsController'
                                },
                                'footer': {
                                    templateUrl: 'views/footer.html',
                                    controller: 'FooterController'
                                }
                            }
                        })
                        .state('message', {
                            url: "/message",
                            cache: true,
                            views: {
                                'content': {
                                    templateUrl: 'views/message.html',
                                    controller: 'MessageController',
                                },
                                'footer': {
                                    templateUrl: 'views/footer.html',
                                    controller: 'FooterController'
                                }
                            }
                        })
                        .state('my', {
                            url: "/my",
                            cache: true,
                            views: {
                                'content': {
                                    templateUrl: 'views/my.html',
                                    controller: 'MyController',
                                },
                                'footer': {
                                    templateUrl: 'views/footer.html',
                                    controller: 'FooterController'
                                }
                            }
                        })

                    $urlRouterProvider.otherwise('/guide');
                })
                .animation('.fade', function () {
                    return {
                        enter: function (element, done) {
                            element.css({
                                opacity: 0
                            });
                            element.animate({
                                opacity: 1
                            }, 100, done);
                        },
                        leave: function (element, done) {
                            element.css({
                                opacity: 1
                            });
                            element.animate({
                                opacity: 0
                            }, 100, done);
                        }
                    };
                })
                .controller('GuideController', function ($scope, $state) {
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        loop: false,
                        onSlideChangeEnd: function (swiper) {
                            if (3 == swiper.activeIndex) {
                                $state.go('login');
                            }
                        }
                    });
                })
                .controller('MapController', function ($scope) {     
                    curPage = "map";
                    RedPackets.MapInit();
                })
                .controller('FooterController', function ($scope, $state) {
                    switch (curPage) {
                        case "map":
                            $(".item-box.map").addClass("active");
                            break;
                        case "message":
                            $(".item-box.message").addClass("active");
                            break;
                        case "my":
                            $(".item-box.my").addClass("active");
                            break;
                        case "contacts":
                            $(".item-box.contacts").addClass("active");
                            break;
                    }
                })
                .controller('LoginController', function ($scope, $state) {
                    ImClient.Init();
                })
                .controller('ContactsController', function ($scope) {
                    curPage = "contacts";
                })
                .controller('MessageController', function ($scope) {
                    curPage = "message";
                })
                .controller('MyController', function ($scope) {
                    curPage = "my";
                })
        }
        catch (e) {
            console.log(e);
        }
    }
};

var RedPackets = (function () {
    var _currentLocationPoint;
    var _map;
    var _visibleBounds = 1000;// km
    var _config = new AppConfig();
    var _visibleCircle;
    return {

        MapInit: function () {

            if (typeof _map === "undefined") {
                _map = new BMap.Map("redPackestMap", { minZoom: 15, enableClicking: true });
                _map.enableScrollWheelZoom(true);
                RedPackets.RefreshCurrentLocation();
                //refresh location every 30 seconds
                setInterval(function () { RedPackets.RefreshCurrentLocation(); }, 3000 * 10);
            }
            else {
                _map.setCenter(_currentLocationPoint);
            }
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
                var distanceBetweenLast = 0;
                var isInited = typeof _currentLocationPoint !== "undefined";
                if (isInited) {
                    distanceBetweenLast = _map.getDistance(_currentLocationPoint, data.points[0]).toFixed(0);//获取二点间距离保留到整数,单位米
                    console.log("distance: " + distanceBetweenLast + " 米");
                }
                //大于50米才刷新
                if (!isInited || distanceBetweenLast > 50) {
                    _map.clearOverlays();
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
                }
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
