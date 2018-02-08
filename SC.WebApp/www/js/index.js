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
        //set cache
        $.ajaxSetup({ cache: true });
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
            StatusBar.styleDefault();
            StatusBar.overlaysWebView(true);
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
                            userId: null
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
                                    //get userinfo
                                    $.get("https://api.weixin.qq.com/sns/userinfo?access_token=" + data.access_token + "&openid=" + data.openid, function (userInfo) {
                                        var userInfo = { openId: userInfo.openid, avatarUrl: userInfo.headimgurl, unionId: userInfo.unionid, name: userInfo.nickname, sex: userInfo.sex };
                                        //check user 
                                        $http({
                                            method: "post",
                                            url: scConfig.accountUrl,
                                            data: { openId: userInfo.openId, avatarUrl: userInfo.avatarUrl, name: userInfo.name, sex: userInfo.sex },
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
                                    });
                                });
                            }, function (reason) {
                                alert("Failed: " + reason);
                            });
                        }, function (reason) {
                            alert("Failed: " + reason);
                        });
                    }
                    catch (e) {
                        console.log(e);
                        DeviceEvent.Toast("网络错误");
                    }

                    //var userInfo = { openId: "17623852229", avatarUrl: "http://119.28.54.31:8055/user_2.jpg", unionId: "10191656", name: "蜡笔小新", sex: 0 };
                    //try {
                    //    $http({
                    //        method: "post",
                    //        url: scConfig.accountUrl,
                    //        data: { openId: userInfo.openId, avatarUrl: userInfo.avatarUrl, name: userInfo.name, sex: userInfo.sex },
                    //        timeout: 30000,
                    //    }).success(function (d, textStatu, xhr) {
                    //        ls.setObject('userInfo', d);
                    //        ls.set('loginTime', new Date());
                    //        //connect chat server
                    //        ImClient.Init(d.UserId);
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
            .controller('PacketInfoController', function ($scope, $state, sc, $stateParams) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go($stateParams.returnUrl);
                };
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
                            }).error(function () { alert("发布失败"); });
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

                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100) {
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

                    console.log(packetNumber);
                    console.log(packetAmount);
                    console.log(textContentLength);

                    if (textContentLength > 200) DeviceEvent.Toast("文字内容不能超过200个字");
                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100) {
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

                    if (packetNumber == 0 || packetNumber > 100) { $("#pakectNumber").val(""); DeviceEvent.Toast("红包个数不能超过100") }//红包个数最小1个最大100个
                    if (textContentLength > 0 && textContentLength <= 200 && packetAmount > 0 && packetNumber > 0 && packetNumber <= 100) {
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
                $('#file').on('change', function () {
                    if ($('.item-box').length < 2) {
                        $('.btn-box').css('padding-top', '0.6rem');
                        $('.btn-box p').hide();
                    } else {
                        $('.btn-box p').show();
                        $('.btn-box').css('padding-top', '0.4rem');
                    }

                    var fileObj = document.getElementById("file");
                    $.each(fileObj.files, function (index, element) {

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            if (fileContents.size() >= 8) return;
                            var fileName = guid();
                            fileContents.insert(fileName, e.target.result);
                            var src = e.target.result;
                            var html = '<div class="item-box">' +
                                '<img src="' + src + '">' +
                                '<div class="iconfont-close" data-filename="' + fileName + '"></div>' +
                                '</div>';
                            $('.imgs-box').prepend(html);
                        };
                        reader.readAsDataURL(element);
                    });
                });
                $('.imgs-box').on('click', '.iconfont-close', function () {
                    $(this).parent('.item-box').remove();
                    fileContents.erase($(this).data("filename"));
                });

            })
            .controller('ChatController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go(curPage);
                };
            })
            .controller('UserpageController', function ($scope, $state, sc, $stateParams) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
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
            })
            .controller('TeamController', function ($scope, $state, sc) {
                sc.ValidateLogin();
                $scope.back = function () {
                    $state.go('my');
                };
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
            .controller('ContactsController', function ($scope, sc) {
                curPage = "contacts";
                sc.ValidateLogin();
            })
            .controller('MessageController', function ($scope, sc) {
                curPage = "message";
                sc.ValidateLogin();
            })
            .controller('MyController', function ($scope, $state, sc, ls) {
                curPage = "my";
                sc.ValidateLogin();
                $scope.userInfo = ls.getObject("userInfo");
                $scope.goUserpage = function () {
                    $state.go('userpage', { userId: $scope.userInfo.UserId })
                }
                $scope.goWithdraw = function () {
                    if ($scope.userInfo.AliPay == null) {
                        DeviceEvent.Confirm("您还未填写支付宝账号",
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

