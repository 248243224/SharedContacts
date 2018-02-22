var ImClient = (function () {

    return {

        MessageArrived: function (from, content) {
            $("#footer-msg").addClass("remind");
        },

        ConnectionEstablishedFunction: function (connectionId) {
            console.log(connectionId + ", connect established");
        },

        Init: function (userId) {
            //connect server
            if (!imConnection.isConnected) {
                imConnection.connect(userId);
            }
        }

    };

})();
var imConnection = new ImHubConnection(scConfig.iMServer, ImClient.MessageArrived, ImClient.ConnectionEstablishedFunction);