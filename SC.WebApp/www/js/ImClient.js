var ImClient = (function () {

    var userId = "jane";

    return {

        MessageArrived: function (from, content) {
            alert(content);
        },

        ConnectionEstablishedFunction: function (connectionId) {
            console.log(connectionId + ", connect established");
        },

        Init: function () {
            //connect server
            if (!imConnection.isConnected) {
                imConnection.connect(userId);
            }
        }

    };

})();
var imConnection = new ImHubConnection(new AppConfig().iMServer, ImClient.MessageArrived, ImClient.ConnectionEstablishedFunction);