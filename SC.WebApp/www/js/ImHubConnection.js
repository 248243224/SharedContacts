(function () {

    //
    // constructor for ScannerHubConnection
    //
    ImHubConnection = function (pathToSignalR, messageArrivedFunction, connectionEstablishedFunction) {
        this.pathToSignalR = pathToSignalR;
        this.messageArrivedFunction = messageArrivedFunction;
        this.connectionEstablishedFunction = connectionEstablishedFunction;
        this.connection = $.hubConnection();
        this.isConnected = false;
        this.isConnecting = false;

        //
        // Set up the actual hub proxy object, but do not connect just yet
        //
        var twc = this;
        twc.imHubProxy = twc.connection.createHubProxy('SCImHub');

        twc.imHubProxy.on('messageArrived', function (from, name, avatar, content) {

            if (isFunction(twc.messageArrivedFunction))
                twc.messageArrivedFunction(from, name, avatar, content);
        });


        twc.connection.disconnected(function () {
            twc.isConnected = false;
        });


    };

    //
    // Set functions
    //
    ImHubConnection.prototype.setFunctions = function (messageArrivedFunction, connectionEstablishedFunction) {
        this.messageArrivedFunction = messageArrivedFunction;
        this.connectionEstablishedFunction = connectionEstablishedFunction;
        //
        // Whenever we call setFunctions() we should see if we are connected and if not, attempt to re-connect.
        //
        if (this.isConnected == false && this.isConnecting == false) {
            console.log("ImHubConnection: we are not connected, so attempting to reconnect now...");
            this.connect();
        }
        else {
            console.log("ImHubConnection: we are already connected, so not attempting to connect again.");
        }
    }

    //
    // Connect
    //
    ImHubConnection.prototype.connect = function (userId) {

        var twc = this;
        if (twc.isConnecting == true) {
            //
            // already connecting, don't connect again or else we might be getting
            // duplicate images.
            //
            console.log("ImHubConnection: called connect but we are already connecting, so we won't try to connect again.  state is " + twc.connection.state);
            return;
        }
        else if (twc.isConnected == true) {
            console.log("ImHubConnection: called connect but we are already connected, so we won't try to connect again.  state is " + twc.connection.state);
            return;
        }
        twc.isConnecting = true;

        this.UserId = userId;
        this.connection.qs = "UserId=" + this.UserId;

        twc.connection.url = twc.pathToSignalR;

        twc.connection.start().done(function () {

            twc.isConnected = (twc.connection.state == 1);

            if (isFunction(twc.connectionEstablishedFunction))
                twc.connectionEstablishedFunction(twc.connection.id);
            twc.isConnecting = false;
            if (twc.isConnected)
                console.log("ImHubConnection: connect success");
            else
                console.log("ImHubConnection: connect failed");
        }).fail(function () {
            console.log("ImHubConnection: connect failed");
            twc.isConnected = false;
            twc.isConnecting = false;
        });
    };

    ImHubConnection.prototype.disconnect = function () {

        var twc = this;

        twc.connection.stop().done(function () {
            twc.isConnected = false;
            slimlog("ImHubConnection isConnected=" + twc.isConnected);
        });
    };

})();

