(function () {

    var dataApiServer = "http://192.168.0.110:8089/api";
    var signalrServer = "http://192.168.0.110:8089";

    //
    // constructor for AppConfig
    //
    AppConfig = function () {
    };

    AppConfig.prototype.iMServer = signalrServer.concat("/signalr");
    AppConfig.prototype.redPacketsUrl = dataApiServer.concat("/redpacket/");

})();

