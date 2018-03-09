var curPage = "";
var curLocation = null;
var curCity = "";
//var SCServer = "http://192.168.48.1:8084/";
var SCServer = "http://sc.handsave.com/";
var mapRefreshInterval = null;

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
    alipayUrl: SCServer.concat("api/alipay/"),
    appId: "wx4722ea6aded42ab7",
    appSecret: "8a575ff0f4cbc92047ed126d060abf5a",
    profitsUrl: SCServer.concat("api/profit/"),
    teamUrl: SCServer.concat("api/team/"),
    userContactsUrl: SCServer.concat("api/usercontacts/"),
    chatUrl: SCServer.concat("api/message/"),
}
var agencyType = {
    NotAgency: 0,
    City: 1,
    Country: 2,
}








