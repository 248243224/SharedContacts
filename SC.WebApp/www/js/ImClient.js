var ImClient = (function () {

    return {

        MessageArrived: function (from, name, avatar, content) {
            $("#footer-msg").addClass("remind");
            var msgHtml = "<div class='item-box clearfix'><div class='img-box'><img src='" + avatar + "'></div> <div class='txt-box'>" + content + "</div></div>"
            $(".chat-box").append(msgHtml);

            var preChatInfo = JSON.parse(localStorage.getItem("recentChats_" + from));
            var curTime = getNowFormatDate();
            var unReadNumber = 0;
            if (preChatInfo != null)
                unReadNumber = preChatInfo.unReadNumber;
            var chatInfo = { friendId: from, avatar: avatar, name: name, lastMsg: content, unReadNumber: unReadNumber + 1, time: curTime };
            localStorage.setItem("recentChats_" + from, JSON.stringify(chatInfo));
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