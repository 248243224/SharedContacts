
var curPage = "";
var curLocation = null;
var curCity = "";

var scConfig = {
    dataApiServer: "http://10.229.18.134:8084/api",
    signalrServer: "http://10.229.18.134:8084",
    iMServer: "http://10.229.18.134:8084/signalr",
    redPacketsUrl: "http://10.229.18.134:8084/api/redpacket/",
    accountUrl: "http://10.229.18.134:8084/api/account/",
    mapRefreshInterval: 6000 * 10 * 2, //2 min
    tokenExpireTime: 7,//days
}
var agencyType = {
    NotAgency: 0,
    City: 1,
    Country: 2,
}



