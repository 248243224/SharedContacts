
var curPage = "";
var curLocation = null;
var curCity = "";
var SCServer = "http://10.229.18.134:8084/";
//var SCServer = "http://192.168.0.110:8084/";

var scConfig = {
    iMServer: SCServer.concat("signalr"),
    redPacketsUrl: SCServer.concat("api/redpacket/"),
    accountUrl: SCServer.concat("api/account/"),
    mapRefreshInterval: 6000 * 10 * 2, //2 min
    tokenExpireTime: 7,//days
    attachmentUrl: SCServer.concat("api/attachment?url="),
    packetRecordsUrl: SCServer.concat("api/packetrecord/"),
    userInfoUrl: SCServer.concat("api/user/"),
    withdrawUrl: SCServer.concat("api/withdrawapply/"),
    appId: "wx4722ea6aded42ab7",
    appSecret: "8a575ff0f4cbc92047ed126d060abf5a",
    profitsUrl: SCServer.concat("api/profit/"),
    teamUrl: SCServer.concat("api/team/"),
}
var agencyType = {
    NotAgency: 0,
    City: 1,
    Country: 2,
}



