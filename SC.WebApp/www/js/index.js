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
            //init fast click
            FastClick.attach(document.body);
            navigator.splashscreen.show();
        }
    },
    RouteInit: function () {
        try {
            angular.module('ngRouteScApp', ['ui.router','ngAnimate'])
                .config(function ($stateProvider, $urlRouterProvider) {
                    $stateProvider
                        .state('guide', {
                            url: "/guide",
                            templateUrl: 'views/guide.html',
                            controller: 'GuideController'
                        })
                        .state('map', {
                            url: "/map",
                            templateUrl: 'views/map.html',
                            controller: 'MapController'
                        })
                        .state('login', {
                            url: "/login",
                            templateUrl: 'views/login.html',
                            controller: 'LoginController',
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
                            }, 500, done);
                        },
                        leave: function (element, done) {
                            element.css({
                                opacity: 1
                            });
                            element.animate({
                                opacity: 0
                            }, 500, done);
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
                    RedPackets.MapInit();
                    ImClient.Init();
                })
                .controller('LoginController', function ($scope) {

                })
        }
        catch (e) {
            console.log(e);
        }
    }
};
