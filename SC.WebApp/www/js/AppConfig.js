﻿
var curPage = "";
var curLocation = null;

var scConfig = {
    dataApiServer: "http://192.168.0.110:8089/api",
    signalrServer: "http://192.168.0.110:8089",
    iMServer: "http://192.168.0.110:8089/signalr",
    redPacketsUrl: "http://192.168.0.110:8089/api/redpacket/",
    accountUrl: "http://192.168.0.110:8089/api/account/",
    mapRefreshInterval: 6000 * 10 * 2, //2 min
    tokenExpireTime: 7,//days
}
var agencyType = {
    NotAgency: 0,
    City: 1,
    Country: 2,
}



