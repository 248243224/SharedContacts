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
        angular.module('ngRouteScApp', ['ui.router', 'ngAnimate'])
            .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
                    .state('packetInfo', {
                        url: "/packetInfo",
                        views: {
                            'other': {
                                templateUrl: 'views/packetInfo.html',
                                controller: 'PacketInfoController'
                            }
                        }
                    })
                    .state('filtration', {
                        url: "/filtration",
                        views: {
                            'content': {
                                templateUrl: 'views/filtration.html',
                                controller: 'FiltrationController'
                            }
                        }
                    })
                    .state('create', {
                        url: "/create",
                        views: {
                            'other': {
                                templateUrl: 'views/create.html',
                                controller: 'CreateController'
                            }
                        }
                    })
                    .state('chat', {
                        url: "/chat",
                        views: {
                            'other': {
                                templateUrl: 'views/chat.html',
                                controller: 'ChatController'
                            }
                        }
                    })
                    .state('userpage', {
                        url: "/userpage",
                        views: {
                            'other': {
                                templateUrl: 'views/userpage.html',
                                controller: 'UserpageController'
                            }
                        }
                    })
                    .state('userinfo', {
                        url: "/userinfo",
                        views: {
                            'other': {
                                templateUrl: 'views/userinfo.html',
                                controller: 'UserinfoController'
                            }
                        }
                    })
                    .state('team', {
                        url: "/team",
                        views: {
                            'other': {
                                templateUrl: 'views/team.html',
                                controller: 'TeamController'
                            }
                        }
                    })
                    .state('withdraw', {
                        url: "/withdraw",
                        views: {
                            'other': {
                                templateUrl: 'views/withdraw.html',
                                controller: 'WithdrawController'
                            }
                        }
                    })
                    .state('agency', {
                        url: "/agency",
                        views: {
                            'other': {
                                templateUrl: 'views/agency.html',
                                controller: 'AgencyController'
                            }
                        }
                    })
                    .state('qrcode', {
                        url: "/qrcode",
                        views: {
                            'other': {
                                templateUrl: 'views/qrcode.html',
                                controller: 'QrcodeController'
                            }
                        }
                    })
                    .state('profits', {
                        url: "/agency",
                        views: {
                            'other': {
                                templateUrl: 'views/profits.html',
                                controller: 'ProfitsController'
                            }
                        }
                    })
                    .state('records', {
                        url: "/records",
                        views: {
                            'other': {
                                templateUrl: 'views/records.html',
                                controller: 'RecordsController'
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

                $urlRouterProvider.otherwise('/login');
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
            .factory('ls', ['$window', function ($window) {
                return {
                    set: function (key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function (key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    setObject: function (key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function (key) {
                        return JSON.parse($window.localStorage[key] || '{}');
                    },
                    clear: function () {
                        $window.localStorage.clear();
                    }
                }
            }])
            .service('sc', function ($state, ls, $http, $rootScope, $window) {
                this.checkTicketStillActive = function () {
                    var loginTime = ls.get('loginTime');

                    if (loginTime) {
                        var curTime = new Date();
                        var diff = curTime.getTime() - new Date(loginTime).getTime();
                        var diffDays = diff / (24 * 3600 * 1000);//相差天数
                        //判断凭证是否过期
                        if (diffDays < scConfig.tokenExpireTime) {
                            $state.go('map');
                        }
                        else {
                            ls.clear();
                        }
                    }
                };
                this.ValidateLogin = function () {
                    var userId = ls.getObject('userInfo').UserId;
                    if (typeof (userId) == "undefined") $state.go('login');
                };
                this.Login = function () {
                    //get from tencent
                    var userInfo = { wechatId: "17623852229", avatarUrl: "", nickName: "", sex: 0 };

                    $http({
                        method: "post",
                        url: scConfig.accountUrl,
                        data: { wechatId: userInfo.wechatId, avatarUrl: userInfo.avatarUrl, nickName: userInfo.nickName, sex: userInfo.sex },
                        timeout: 30000,
                    }).success(function (d, textStatu, xhr) {
                        ls.setObject('userInfo', d);
                        ls.set('loginTime', new Date());
                        //connect chat server
                        ImClient.Init(d.UserId);
                        DeviceEvent.SpinnerHide();
                        $state.go('map');
                    }).error(function (error, textStatu, xhr) {
                        DeviceEvent.SpinnerHide();
                        DeviceEvent.Toast("网络异常");
                    });
                };
                this.logOut = function () {
                    ls.clear();
                    $state.go('login');
                };
            })
            .controller('GuideController', function ($scope, ls, $state) {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    loop: false,
                    onSlideChangeEnd: function (swiper) {
                        if (3 == swiper.activeIndex) {
                            ls.set('guideIsChecked', true);
                            $state.go('login');
                        }
                    }
                });
            })
            .controller('PacketInfoController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('map');
                };
            })
            .controller('FiltrationController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.close = function () {
                    $state.go(curPage);
                };
            })
            .controller('CreateController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go(curPage);
                };

                var callback = function (buttonIndex) {
                    setTimeout(function () {
                        if (buttonIndex == 1) {
                            DeviceEvent.Album();
                        }
                        else if (buttonIndex == 2)
                        {
                            DeviceEvent.TakePhotos();
                        }
                    });
                };
                $scope.showActionSheet = function () {
                    try {
                        var options = {
                            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
                            title: '图片来源',
                            buttonLabels: ['从相册中选择', '拍照'],
                            androidEnableCancelButton: true, // default false
                            winphoneEnableCancelButton: true, // default false
                            addCancelButtonWithLabel: '取消',
                            position: [20, 40], // for iPad pass in the [x, y] position of the popover
                            destructiveButtonLast: true // you can choose where the destructive button is shown
                        };
                        window.plugins.actionsheet.show(options, callback);
                    }
                    catch (e) { console.log(e); }
                };
            })
            .controller('ChatController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go(curPage);
                };
            })
            .controller('UserpageController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('UserinfoController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('TeamController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('WithdrawController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('AgencyController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('ProfitsController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('QrcodeController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
            })
            .controller('RecordsController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('map');
                };
            })
            .controller('MapController', function ($scope, $state, sc, $rootScope, ls) {
                curPage = "map";
                sc.ValidateLogin();
                $scope.openRedPacket = function ($event) {
                    $event.stopPropagation();
                    $state.go('packetInfo');
                };

                try {
                    var translateCallback = function (data) {
                        if (data.status === 0) {
                            var distanceBetweenLast = 0;
                            var isInited = typeof rpMapApi._currentLocationPoint !== "undefined";
                            if (isInited) {
                                distanceBetweenLast = rpMapApi._map.getDistance(rpMapApi._currentLocationPoint, data.points[0]).toFixed(0);//获取二点间距离保留到整数,单位米
                                console.log("distance: " + distanceBetweenLast + " 米");
                            }
                            //大于50米才刷新
                            if (!isInited || distanceBetweenLast > 50) {
                                rpMapApi._map.clearOverlays();
                                //refresh location
                                rpMapApi._currentLocationPoint = data.points[0];
                                curLocation = data.points[0];
                                console.log("point converted: Longitude:" + rpMapApi._currentLocationPoint.lng + "\n Latitude:" + rpMapApi._currentLocationPoint.lat);
                                //refresh center and zoom
                                rpMapApi._map.centerAndZoom(rpMapApi._currentLocationPoint, 17);
                                if (ls.getObject("userInfo").AgencyType == agencyType.NotAgency) {
                                    //rewrite visible circle
                                    rpMapApi.RefreshVisibleCircle();
                                    //reset visible map bounds
                                    rpMapApi.ResetMapBounds();
                                }
                                //mark point
                                rpMapApi.MarkCurrentLocation();
                                //mark red packets
                                rpMapApi.RefreshRedPackets(ls.getObject("userInfo").AgencyType);

                                rpMapApi._map.setCenter(data.points[0]);
                            }
                        }
                    };
                    var rpMapApi = new RedPackets(translateCallback);
                    rpMapApi.MapInit();
                }
                catch (e) {
                    console.log(e);
                    DeviceEvent.Toast("网络异常");
                }
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
            .controller('LoginController', function ($scope, ls, sc, $state) {
                if (!ls.get('guideIsChecked')) $state.go('guide');
                sc.checkTicketStillActive();
                $scope.login = function () {
                    DeviceEvent.SpinnerShow();
                    sc.Login();
                };
            })
            .controller('ContactsController', function ($scope, sc) {
                curPage = "contacts";
                sc.ValidateLogin();
            })
            .controller('MessageController', function ($scope, sc) {
                curPage = "message";
                sc.ValidateLogin();
            })
            .controller('MyController', function ($scope, sc, ls) {
                curPage = "my";
                sc.ValidateLogin();
                $scope.userInfo = ls.getObject("userInfo");
                $scope.logOut = function () {
                    sc.logOut();
                };
            })
    }
};

