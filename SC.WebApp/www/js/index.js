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

