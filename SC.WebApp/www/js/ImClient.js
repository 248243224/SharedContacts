var ImClient = (function () {

    var userId = "jane";
    var serverUrl = "http://10.229.18.134:8089/signalr";

    return {
        GetServerUrl: function () {
            return serverUrl;
        },

        MessageArrived: function (content) {
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

var imConnection = new ImHubConnection(ImClient.GetServerUrl(), ImClient.MessageArrived, ImClient.ConnectionEstablishedFunction);