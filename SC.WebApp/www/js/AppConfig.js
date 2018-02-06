
var curPage = "";
var curLocation = null;
var curCity = "";
var SCServer = "http://10.229.18.134:8084/";

var scConfig = {
    iMServer: SCServer.concat("signalr"),
    redPacketsUrl: SCServer.concat("api/redpacket/"),
    accountUrl: SCServer.concat("api/account/"),
    mapRefreshInterval: 6000 * 10 * 2, //2 min
    tokenExpireTime: 7,//days
    attachmentUrl: SCServer.concat("api/attachment?url="),
    packetRecordsUrl: SCServer.concat("api/packetrecord/"),
}
var agencyType = {
    NotAgency: 0,
    City: 1,
    Country: 2,
}



