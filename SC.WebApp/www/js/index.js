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
        this.RouteInit();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // disable back button in andriod
        //document.addEventListener("backbutton", this.BackButtonCallback, false);
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
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(true);
        //init fast click
        FastClick.attach(document.body);
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
                        },
                        params: {
                            obj: null,
                            returnUrl: "map"
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
                        },
                        params: {
                            userId: null,
                            title: null,
                            records: null
                        }
                    })
                    .state('userpage', {
                        url: "/userpage",
                        views: {
                            'other': {
                                templateUrl: 'views/userpage.html',
                                controller: 'UserpageController'
                            }
                        },
                        params: {
                            userId: null,
                            returnUrl: null
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
                    .state('update', {
                        url: "/update",
                        views: {
                            'other': {
                                templateUrl: 'views/update.html',
                                controller: 'UpdateController'
                            }
                        },
                        params: {
                            obj: { title: null, type: null, value: null }
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
                        cache: true,
                        url: "/records",
                        views: {
                            'other': {
                                templateUrl: 'views/records.html',
                                controller: 'RecordsController'
                            }
                        }
                    })
                    .state('success', {
                        url: "/success",
                        views: {
                            'other': {
                                templateUrl: 'views/success.html',
                                controller: 'SuccessController'
                            }
                        },
                        params: {
                            obj: { header: null, title: null, details: null, amount: null }
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
                        }, 150, done);
                    },
                    leave: function (element, done) {
                        element.css({
                            opacity: 1
                        });
                        element.animate({
                            opacity: 0
                        }, 150, done);
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
                    try {
                        Wechat.isInstalled(function (installed) {
                            var scope = "snsapi_userinfo",
                                state = "_" + (+new Date());
                            Wechat.auth(scope, state, function (response) {
                                // you may use response.code to get the access token.
                                //get access_token
                                $.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + scConfig.appId + "&secret=" + scConfig.appSecret + "&code=" + response.code + "&grant_type=authorization_code", function (data) {
                                    var rerturnData = JSON.parse(data);
                                    //get userinfo
                                    $.get("https://api.weixin.qq.com/sns/userinfo?access_token=" + rerturnData.access_token + "&openid=" + rerturnData.openid, function (userInfo) {
                                        var user_info = JSON.parse(userInfo);
                                        var user = { openId: user_info.openid, avatarUrl: user_info.headimgurl, unionId: rerturnData.unionid, name: user_info.nickname, sex: user_info.sex };
                                        //check user 
                                        $http({
                                            method: "post",
                                            url: scConfig.accountUrl,
                                            data: { openId: user.openId, avatarUrl: user.avatarUrl, name: user.name, sex: user.sex, unionid: user.unionId },
                                            timeout: 30000,
                                        }).success(function (d, textStatu, xhr) {
                                            ls.setObject('userInfo', d);
                                            ls.set('loginTime', new Date());
                                            DeviceEvent.SpinnerHide();
                                            $state.go('map');
                                        }).error(function (error, textStatu, xhr) {
                                            DeviceEvent.SpinnerHide();
                                            DeviceEvent.Toast("网络异常");
                                        });
                                    });
                                });
                            }, function (reason) {
                                DeviceEvent.SpinnerHide();
                                DeviceEvent.Toast("Failed: " + reason);
                            });
                        }, function (reason) {
                            DeviceEvent.SpinnerHide();
                            DeviceEvent.Toast("Failed: " + reason);
                        });
                    }
                    catch (e) {
                        DeviceEvent.SpinnerHide();
                        DeviceEvent.Toast("网络错误");
                    }

                    //var userInfo = { openId: "17623852228", avatarUrl: "http://119.28.54.31:8055/user_2.jpg", unionId: "10191656", name: "蜡笔小新", sex: 0 };
                    //try {
                    //    $http({
                    //        method: "post",
                    //        url: scConfig.accountUrl,
                    //        data: { openId: userInfo.openId, avatarUrl: userInfo.avatarUrl, name: userInfo.name, sex: userInfo.sex, unionId: userInfo.unionId },
                    //        timeout: 30000,
                    //    }).success(function (d, textStatu, xhr) {
                    //        ls.setObject('userInfo', d);
                    //        ls.set('loginTime', new Date());
                    //        DeviceEvent.SpinnerHide();
                    //        $state.go('map');
                    //    }).error(function (error, textStatu, xhr) {
                    //        DeviceEvent.SpinnerHide();
                    //        DeviceEvent.Toast("网络异常");
                    //    });
                    //}
                    //catch (e) {
                    //    console.log(e);
                    //    DeviceEvent.Toast("网络错误");
                    //}
                };
                this.logOut = function () {
                    DeviceEvent.Confirm("退出之后需要重新登陆",
                        function (buttonIndex) {
                            if (buttonIndex == 1) {
                                ls.clear();
                                ls.set('guideIsChecked', true);
                                $state.go('login');
                            }
                        }, "请确认退出", ['确认', '取消']);
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
            .controller('PacketInfoController', function ($scope, $state, sc, ls, $stateParams) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go($stateParams.returnUrl);
                };
                $scope.showLink = function (link) {
                    var inAppBrowserRef = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
                    inAppBrowserRef.show();
                }
                $scope.addFriend = function () {
                    if (ls.getObject("userInfo").UserId == $scope.packetInfo.UserId) {
                        DeviceEvent.Toast("不能关注自己");
                        return;
                    }
                    $.post(scConfig.userContactsUrl.concat("?userId=" + ls.getObject("userInfo").UserId + "&friendId=" + $scope.packetInfo.UserId), function (ret) {
                        if (ret == 0) DeviceEvent.Toast("已经关注过该用户了");
                        else if (ret == 1) DeviceEvent.Toast("关注成功");
                    });
                }
                $scope.attchmentRootUrl = scConfig.attachmentUrl;
                if ($stateParams.returnUrl == "map")
                    $scope.packetInfo = $stateParams.obj.Result;
                else
                    $scope.packetInfo = JSON.parse($stateParams.obj);
            })
            .controller('FiltrationController', function ($scope, $state, sc, $stateParams) {
                sc.ValidateLogin();
                $scope.close = function () {
                    $state.go(curPage);
                };
            })
            .controller('CreateController', function ($scope, $state, $http, $stateParams, sc, ls) {
                sc.ValidateLogin();
                var enableSubmit = false;
                $scope.back = function () {
                    $state.go(curPage);
                };

                var callback = function (buttonIndex) {
                    setTimeout(function () {
                        function onSuccess(imageData) {
                            if ($('.item-box').length < 2) {
                                $('.btn-box').css('padding-top', '0.6rem');
                                $('.btn-box p').hide();
                            } else {
                                $('.btn-box p').show();
                                $('.btn-box').css('padding-top', '0.4rem');
                            }
                            if (fileContents.size() >= 8) return;
                            var fileName = guid();
                            var imgSrc = 'data:image/jpeg;base64,' + imageData;
                            fileContents.insert(fileName, imgSrc);
                            var html = '<div class="item-box">' +
                                '<img src="' + imgSrc + '">' +
                                '<div class="iconfont-close" data-filename="' + fileName + '"></div>' +
                                '</div>';
                            $('.imgs-box').prepend(html);
                        }
                        function onFail(message) {
                            DeviceEvent.Toast(message);
                        }
                        // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1) 
                        if (buttonIndex == 1) {
                            DeviceEvent.OpenCamera(onSuccess, onFail);
                        }
                        if (buttonIndex == 2) {
                            DeviceEvent.OpenAlbum(onSuccess, onFail);
                        }
                    });
                };

                $scope.getImg = function () {
                    var options = {
                        androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL 
                        title: '选择图片来源',
                        buttonLabels: ['拍照', '从相册中选择'],
                        androidEnableCancelButton: true, // default false 
                        winphoneEnableCancelButton: true, // default false 
                        addCancelButtonWithLabel: '取消',
                        position: [20, 40], // for iPad pass in the [x, y] position of the popover 
                        destructiveButtonLast: true // you can choose where the destructive button is shown 
                    };
                    // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter 
                    // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin) 
                    window.plugins.actionsheet.show(options, callback);
                };

                var locationChooseMapInit = function () {
                    $("#locationMap").css("height", document.body.clientHeight / 2);
                    $("#locationMap").css("width", document.body.clientWidth);
                    var map = new BMap.Map("locationMap", { minZoom: 8, enableClicking: true });
                    map.enableScrollWheelZoom(true);
                    map.centerAndZoom(curLocation, 18);

                    var packetIcon = new BMap.Icon("images/large_packet.png", new BMap.Size(35, 45), { offset: new BMap.Size(10, 25) });
                    var marker = new BMap.Marker(curLocation, { icon: packetIcon });
                    map.addOverlay(marker);
                    map.addEventListener("click", function (e) {
                        map.clearOverlays();
                        var mk = new BMap.Marker(e.point, { icon: packetIcon });
                        map.addOverlay(mk);
                        map.centerAndZoom(e.point, 18);
                        $scope.packetInfo.Lng = e.point.lng;
                        $scope.packetInfo.Lat = e.point.lat;
                    });

                    $(".yes-btn").hide();
                    $(".black-btn").show();
                    $("#locationMap").hide();
                };
                locationChooseMapInit();

                $scope.locationChooseShow = function () {
                    $("#locationMap").show();
                    $(".yes-btn").show();
                    $(".black-btn").hide();
                    $(".content-box").hide();
                    $(".all-input").hide();
                    $("#title").text("红包发布位置选择");
                };
                $scope.locationChooseHide = function () {
                    $("#locationMap").hide();
                    $(".yes-btn").hide();
                    $(".black-btn").show();
                    $(".content-box").show();
                    $(".all-input").show();
                    $("#title").text("红包信息");
                };

                $scope.packetInfo = {
                    TotalNumber: null,
                    Amount: null,
                    Lng: curLocation.lng,
                    Lat: curLocation.lat,
                    TextContent: null,
                    Link: null,
                    City: curCity,
                    UserId: ls.getObject("userInfo").UserId
                };
                $scope.publish = function () {
                    if (enableSubmit) {
                        try {
                            DeviceEvent.SpinnerShow();

                            // 第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理 https://docs.open.alipay.com/204/105465/
                            $.post(scConfig.alipayUrl + "?subject=红包&totalAmount=" + $scope.packetInfo.Amount, function (data) {
                                payInfo = data;
                                // 第二步：调用支付插件            
                                cordova.plugins.alipay.payment(payInfo, function success(e) {
                                    var fd = new FormData();
                                    $scope.packetInfo.Amount = parseInt($scope.packetInfo.Amount);
                                    fd.append('packetinfo', JSON.stringify($scope.packetInfo));
                                    $.each(fileContents._vals, function (i, file) {
                                        var resizedImage = ResizeImage(file);
                                        fd.append('files', resizedImage);
                                    });
                                    $.ajax({
                                        url: scConfig.redPacketsUrl,
                                        type: 'POST',
                                        contentType: false,
                                        data: fd,
                                        cache: false,
                                        processData: false
                                    }).success(function () {
                                        DeviceEvent.SpinnerHide();
                                        $state.go('success', { obj: { header: "发布成功", title: "红包已发布", details: "非常感谢您的支持", amount: $scope.packetInfo.Amount } });
                                    }).error(function () { DeviceEvent.Toast("发布失败"); });
                                }, function error(e) {
                                    DeviceEvent.SpinnerHide();
                                    DeviceEvent.Toast("支付失败");
                                });
                            });
                        }
                        catch (e) {
                            console.log(e);
                            DeviceEvent.Toast("网络错误");
                        }
                    }
                }

                //validate
                validateAmount($('#pakectAmount'));


                $('#pakectAmount').bind('keyup paste', function () {

                    var packetNumber = parseInt($("#pakectNumber").val());
                    var packetAmount = parseInt($("#pakectAmount").val());
                    var textContentLength = $.trim($("#textContent").val()).length;

                    if (packetAmount < 0.1 * packetNumber) { DeviceEvent.Toast("每个红包金额不能小于0.1元"); }
                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100 && packetAmount >= 0.1 * packetNumber) {
                        enableSubmit = true;
                        $(".btn").css("background", "#fe625c");
                    }
                    else {
                        enableSubmit = false;
                        $(".btn").css("background", "#b3b3b3");
                    }
                });

                $('#textContent').bind('keyup paste', function () {
                    var packetNumber = parseInt($("#pakectNumber").val());
                    var packetAmount = parseInt($("#pakectAmount").val());
                    var textContentLength = $.trim($("#textContent").val()).length;

                    if (textContentLength > 200) DeviceEvent.Toast("文字内容不能超过200个字");
                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100 && packetAmount >= 0.1 * packetNumber) {
                        enableSubmit = true;
                        $(".btn").css("background", "#fe625c");
                    }
                    else {
                        enableSubmit = false;
                        $(".btn").css("background", "#b3b3b3");
                    }
                });

                $('#pakectNumber').bind('keyup paste', function () {
                    var packetNumber = parseInt($("#pakectNumber").val());
                    var packetAmount = parseInt($("#pakectAmount").val());
                    var textContentLength = $.trim($("#textContent").val()).length;

                    if (packetNumber == 0 || packetNumber > 100) { $("#pakectNumber").val(""); DeviceEvent.Toast("红包个数不能超过100"); }//红包个数最小1个最大100个
                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100 && packetAmount >= 0.1 * packetNumber) {
                        enableSubmit = true;
                        $(".btn").css("background", "#fe625c");
                    }
                    else {
                        enableSubmit = false;
                        $(".btn").css("background", "#b3b3b3");
                    }
                });

                var fileContents = new _pair_array_t();

                $('.select span').click(function () {
                    if ($(this).hasClass('active')) {
                        $('.sift-box').hide();
                        $(this).removeClass('active');
                    } else {
                        $('.sift-box').show();
                        $(this).addClass('active');
                    }
                })
                $('.imgs-box').on('click', '.iconfont-close', function () {
                    $(this).parent('.item-box').remove();
                    fileContents.erase($(this).data("filename"));
                });
            })
            .controller('ChatController', function ($scope, $state, sc, $stateParams, ls) {
                sc.ValidateLogin();
                $scope.title = $stateParams.title;
                $scope.friendId = $stateParams.userId;
                $scope.avatar = $stateParams.avatar;
                var enableSend = false;
                // $scope.msgRecords = $stateParams.records;
                $scope.back = function () {
                    $state.go(curPage);
                };
                $('#content').bind('keyup paste', function () {
                    if ($.trim($(this).val()).length > 0) {
                        $("#btnSend").css("background", "#fe625c");
                        enableSend = true;
                    }
                    else {
                        $("#btnSend").css("background", "#b3b3b3");
                        enableSend = false;
                    }
                });
                $scope.content = "";
                $scope.sendMsg = function () {
                    if (enableSend) {
                        var msgHtml = "<div class='item-box clearfix oneself'><div class='img-box'><img src='" + ls.getObject("userInfo").AvatarUrl + "'></div> <div class='txt-box'>" + $scope.content + "</div></div>"
                        $(".chat-box").append(msgHtml);
                        $.post(scConfig.chatUrl.concat('?userId=' + ls.getObject("userInfo").UserId + '&friendId=' + $stateParams.userId + '&content=' + $scope.content + '&avatar=' + ls.getObject("userInfo").AvatarUrl + '&name=' + ls.getObject("userInfo").Name), function () {
                        });
                        var lastMsg = $scope.content;
                        $scope.content = "";

                        var from = $stateParams.userId;
                        var preChatInfo = JSON.parse(localStorage.getItem("recentChats_" + from));
                        var curTime = getNowFormatDate();

                        var chatInfo = { friendId: from, avatar: ls.getObject("userInfo").AvatarUrl, name: $stateParams.title, lastMsg: lastMsg, unReadNumber: 0, time: curTime };
                        localStorage.setItem("recentChats_" + from, JSON.stringify(chatInfo));
                    }
                }
            })
            .controller('UserpageController', function ($scope, $state, sc, $stateParams) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go($stateParams.returnUrl);
                };
                $.get(scConfig.userInfoUrl + "?userId=" + $stateParams.userId, function (userInfo) {
                    $scope.$apply(function () {
                        $scope.userInfo = userInfo;
                    });
                });
            })
            .controller('UpdateController', function ($scope, $state, sc, ls, $stateParams) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('userinfo');
                };
                var enableSubmit = false;
                $scope.updateInfo = $stateParams.obj;
                $scope.save = function () {
                    if (enableSubmit) {
                        DeviceEvent.SpinnerShow();
                        var userInfo = {};
                        switch ($scope.updateInfo.type) {
                            case "name":
                                userInfo = { UserId: ls.getObject("userInfo").UserId, Name: $scope.updateInfo.value };
                                break;
                            case "alipay":
                                userInfo = { UserId: ls.getObject("userInfo").UserId, AliPay: $scope.updateInfo.value };
                                break;
                            case "alipayName":
                                userInfo = { UserId: ls.getObject("userInfo").UserId, AliPayName: $scope.updateInfo.value };
                                break;
                        }
                        $.post(scConfig.userInfoUrl, userInfo, function (user) {
                            //update userInfo
                            ls.setObject("userInfo", user);
                            DeviceEvent.SpinnerHide();
                            $state.go('userinfo');
                        });
                    }
                };

                $('.input-box input').bind('input propertychange', function () {
                    if ($(this).val().length > 0 && $.trim($('.input-box input').val()) != "") {
                        $('.input-box i').show();
                        $('.yes-btn').css('opacity', '1');
                        enableSubmit = true;
                    } else {
                        $('.input-box i').hide();
                        $('.yes-btn').css('opacity', '0.8');
                        enableSubmit = false;
                    }
                });
                $('.input-box i').click(function () {
                    $('.input-box input').val('');
                    $('.input-box i').hide();
                    $('.yes-btn').css('opacity', '0.8');
                    enableSubmit = false;
                })
            })
            .controller('UserinfoController', function ($scope, $state, ls, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
                $scope.userInfo = ls.getObject("userInfo");
                $scope.updateName = function () {
                    $state.go('update', { obj: { title: "设置你的昵称", type: "name", value: $scope.userInfo.Name } });
                }
                $scope.updateAlipay = function () {
                    $state.go('update', { obj: { title: "设置支付宝账号", type: "alipay", value: $scope.userInfo.Alipay } });
                }
                $scope.updateAlipayName = function () {
                    $state.go('update', { obj: { title: "设置支付宝姓名", type: "alipayName", value: $scope.userInfo.AliPayName } });
                }
            })
            .controller('TeamController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
                $scope.goUserpage = function (userId) {
                    $state.go('userpage', { userId: userId, returnUrl: "team" })
                }
                DeviceEvent.SpinnerShow();
                $.get(scConfig.teamUrl.concat("?userId=" + ls.getObject("userInfo").UserId), function (members) {
                    $scope.$apply(function () {
                        $scope.teamInfo = members;
                        DeviceEvent.SpinnerHide();
                    });
                });
            })
            .controller('WithdrawController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                var enableSubmit = false;
                $scope.userInfo = ls.getObject("userInfo");
                $scope.back = function () {
                    $state.go('my');
                };
                DeviceEvent.SpinnerShow();
                $scope.withdrawInfo = { totalAmount: null, withdrawAmount: null };
                $.get(scConfig.withdrawUrl.concat("?userId=" + $scope.userInfo.UserId), function (totalAmount) {
                    $scope.$apply(function () {
                        $scope.withdrawInfo = { totalAmount: totalAmount, withdrawAmount: totalAmount };
                    });
                    if (totalAmount > 0) {
                        enableSubmit = true;
                        $(".btn").css("background", "#ff8569");
                    }
                    DeviceEvent.SpinnerHide();
                });

                $scope.submit = function () {
                    if (enableSubmit) {
                        DeviceEvent.SpinnerShow();
                        $.post(scConfig.withdrawUrl.concat("?userId=" + $scope.userInfo.UserId), function () {
                            DeviceEvent.SpinnerHide();
                            $state.go('success', { obj: { header: "提现成功", title: "提现申请已提交", details: "二个工作日内到账", amount: $scope.withdrawInfo.withdrawAmount } });
                        });
                    }
                };
                $scope.withdrawAll = function () {
                    $scope.withdrawInfo.withdrawAmount = $scope.withdrawInfo.totalAmount;
                    if ($scope.withdrawInfo.withdrawAmount != null && $scope.withdrawInfo.withdrawAmount > 0) {
                        enableSubmit = true;
                        $(".btn").css("background", "#ff8569");
                    }
                };

                validateAmount($('.pay-box input'));

                $('.pay-box input').bind('keyup', function () {
                    if ($(this).val() <= $scope.withdrawInfo.totalAmount && $(this).val() > 0) {
                        enableSubmit = true;
                        $(".btn").css("background", "#ff8569");
                    }
                    else {
                        $(this).val("");
                        enableSubmit = false;
                        $(".btn").css("background", "#b3b3b3");
                    }
                });
            })
            .controller('AgencyController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };

                $scope.buyAgency = function (type) {
                    DeviceEvent.SpinnerShow();
                    var title = "";
                    var amount = 0;
                    var subject = "";
                    var payInfo = "";

                    if (type == 1) {
                        if (ls.getObject("userInfo").AgencyType == 1 || ls.getObject("userInfo").AgencyType == 2) {
                            DeviceEvent.Toast("您已经是代理");
                            DeviceEvent.SpinnerHide();
                            return;
                        }
                        title = "市区代理已生效";
                        subject = "市区代理";
                        amount = 0.01;
                    }
                    else {
                        if (ls.getObject("userInfo").AgencyType == 2) {
                            DeviceEvent.Toast("您已经是全国代理");
                            DeviceEvent.SpinnerHide();
                            return;
                        }
                        title = "全国代理已生效";
                        subject = "全国代理";
                        amount = 0.01;
                    }
                    // 第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理 https://docs.open.alipay.com/204/105465/
                    $.post(scConfig.alipayUrl + "?subject=" + subject + "&&totalAmount=" + amount, function (data) {
                        payInfo = data;
                        // 第二步：调用支付插件            
                        cordova.plugins.alipay.payment(payInfo, function success(e) {
                            var userInfo = { UserId: ls.getObject("userInfo").UserId, AgencyType: type };
                            $.post(scConfig.userInfoUrl, userInfo, function (user) {
                                DeviceEvent.SpinnerHide();
                                //update user info
                                ls.setObject("userInfo", user);
                                $state.go('success', { obj: { header: "购买成功", title: title, details: "您已完成本次交易", amount: amount } });
                            })
                        }, function error(e) {
                            DeviceEvent.SpinnerHide();
                            DeviceEvent.Toast("支付失败");
                        });
                    });
                }
                $('.tab-box .col-md-6').click(function () {
                    $(this).find('.item-box').addClass('active').parents('.col-md-6').siblings().find('.item-box').removeClass('active');
                    $('.tab-conter .item-box').eq($(this).index()).addClass('active').siblings().removeClass('active');
                })
            })
            .controller('ProfitsController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
                $.get(scConfig.profitsUrl.concat("?userId=" + ls.getObject("userInfo").UserId), function (data) {
                    $scope.$apply(function () {
                        $scope.profits = data;
                    });
                });
            })
            .controller('QrcodeController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
                $scope.userAvatar = ls.getObject("userInfo").AvatarUrl;
                //二维码生成
                $("#qrCode").empty();
                $("#qrCode").qrcode({
                    render: "canvas",
                    width: window.innerWidth - 100,
                    height: window.innerHeight / 2.5,
                    text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx457087c6f3e2d3be&redirect_uri=http://scadmin.handsave.com/WechatAuth/AuthCallback&response_type=code&scope=snsapi_userinfo&state=" + ls.getObject("userInfo").UserId + "&connect_redirect=1#wechat_redirect"
                });
            })
            .controller('RecordsController', function ($scope, $state, sc, ls) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('map');
                };
                $scope.showDetails = function (type, index) {
                    var packetInfo = null;
                    if (type === "recieve") packetInfo = JSON.stringify($scope.Records.Recieved.PacketList[index]);
                    else packetInfo = JSON.stringify($scope.Records.Send.PacketList[index]);
                    $state.go('packetInfo', { obj: packetInfo, returnUrl: "records" });
                }
                $scope.attchmentRootUrl = scConfig.attachmentUrl;
                $scope.Records = {};
                DeviceEvent.SpinnerShow();
                try {
                    $.get(scConfig.packetRecordsUrl + "?userId=" + ls.getObject("userInfo").UserId, function (records) {
                        $scope.$apply(function () {
                            $scope.Records = records;
                        });
                        DeviceEvent.SpinnerHide();
                    });
                }
                catch (e) {
                    console.log(e)
                    DeviceEvent.Toast("网络错误");
                }
            })
            .controller('SuccessController', function ($scope, $state, sc, $stateParams) {
                $scope.back = function () {
                    $state.go(curPage);
                };
                $scope.successInfo = $stateParams.obj;
                var _interval = setInterval(function () {
                    if (parseInt($("#time").text()) > 0) {
                        $("#time").text(parseInt($("#time").text()) - 1);
                    }
                    else {
                        clearInterval(_interval);
                        $state.go(curPage);
                    }
                }, 1000);
            })
            .controller('MapController', function ($scope, $state, $http, sc, $rootScope, ls) {
                curPage = "map";
                sc.ValidateLogin();

                //connect im server
                ImClient.Init(ls.getObject("userInfo").UserId);

                $scope.openRedPacket = function ($event) {
                    $event.stopPropagation();
                    DeviceEvent.SpinnerShow();
                    $.post(scConfig.redPacketsUrl.concat("?userId=" + ls.getObject("userInfo").UserId + "&packetId=" + $(".hot-box").data("packetid")), function (packetInfo) {
                        DeviceEvent.SpinnerHide();
                        $state.go('packetInfo', { obj: packetInfo, returnUrl: "map" });
                    });
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
                                rpMapApi.RefreshRedPackets(ls.getObject("userInfo").UserId, ls.getObject("userInfo").AgencyType);

                                rpMapApi._map.setCenter(data.points[0]);
                            }
                            DeviceEvent.SpinnerHide();
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
            .controller('ContactsController', function ($scope, sc, ls, $state) {
                curPage = "contacts";
                $scope.goChat = function (friendId, friendName) {
                    $state.go('chat', { userId: friendId, title: friendName, records: "" });
                }
                $.get(scConfig.userContactsUrl.concat("?userId=" + ls.getObject("userInfo").UserId), function (data) {
                    $scope.$apply(function () {
                        $scope.Contacts = data;
                    });
                });
                sc.ValidateLogin();
            })
            .controller('MessageController', function ($scope, sc, $state) {
                curPage = "message";
                sc.ValidateLogin();

                var messageArrived = function (from, name, avatar, content) {
                    $("#footer-msg").addClass("remind");
                    var msgHtml = "<div class='item-box clearfix'><div class='img-box'><img src='" + avatar + "'></div> <div class='txt-box'>" + content + "</div></div>"
                    $(".chat-box").append(msgHtml);

                    var preChatInfo = JSON.parse(localStorage.getItem("recentChats_" + from));
                    var curTime = getNowFormatDate();
                    var unReadNumber = 0;
                    if (preChatInfo != null)
                        unReadNumber = preChatInfo.unReadNumber;
                    var chatInfo = { friendId: from, avatar: avatar, name: name, lastMsg: content, unReadNumber: unReadNumber + 1, time: curTime };
                    localStorage.setItem("recentChats_" + from, JSON.stringify(chatInfo));
                    var msgRecords = [];
                    for (var i = localStorage.length - 1; i >= 0; i--) {
                        if (localStorage.key(i).indexOf("recentChats_") != -1)
                            msgRecords.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                    }

                    $scope.$apply(function () {
                        $scope.msgRecords = msgRecords;
                    });
                }
                imConnection.setFunctions(messageArrived, null);

                $scope.goChat = function (friendId, friendName) {
                    var preChatInfo = JSON.parse(localStorage.getItem("recentChats_" + friendId));
                    preChatInfo.unReadNumber = 0;
                    localStorage.setItem("recentChats_" + friendId, JSON.stringify(preChatInfo));
                    $state.go('chat', { userId: friendId, title: friendName, records: "" });
                }

                var msgRecords = [];
                for (var i = localStorage.length - 1; i >= 0; i--) {
                    if (localStorage.key(i).indexOf("recentChats_") != -1)
                        msgRecords.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                }
                $scope.msgRecords = msgRecords;
            })
            .controller('MyController', function ($scope, $state, sc, ls) {
                curPage = "my";
                sc.ValidateLogin();
                $scope.userInfo = ls.getObject("userInfo");
                $scope.goUserpage = function () {
                    $state.go('userpage', { userId: $scope.userInfo.UserId, returnUrl: "my" })
                }
                $scope.goWithdraw = function () {
                    if ($scope.userInfo.AliPay == null || $scope.userInfo.AliPayName == null) {
                        DeviceEvent.Confirm("您还未填写支付宝账号或姓名",
                            function (buttonIndex) {
                                if (buttonIndex == 1) {
                                    $state.go('userinfo');
                                }
                            }, "请完善个人资料", ['去填写', '取消']);
                    }
                    else {
                        $state.go('withdraw');
                    }
                }
                $scope.logOut = function () {
                    sc.logOut();
                };
            })
    }
};

