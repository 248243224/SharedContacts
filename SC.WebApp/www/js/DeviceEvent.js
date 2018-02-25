var DeviceEvent = (function () {

    return {

        GetCurrentPosition: function (onSuccess, onError) {
            if (isFunction(onError) && isFunction(onSuccess))
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
        },
        Alert: function (message, callback, title, buttonName) {
            navigator.notification.alert(
                message,  // message
                callback, // callback
                title,    // title
                buttonName// buttonName
            );
        },
        Confirm: function (message, callback, title, buttonName) {
            navigator.notification.confirm(message, callback, title, buttonName);
        },
        Prompt: function (message, callback, title, buttonName, defaultText) {
            navigator.notification.prompt(
                message,  // message
                callback,                  // callback to invoke
                title,            // title
                buttonName,             // buttonLabels
                defaultText                 // defaultText
            );
        },
        Toast: function (message) {
            window.plugins.toast.showWithOptions({
                message: message,
                duration: "short", // 2000 ms 
                position: "bottom"
                //addPixelsY: -40
            });
        },
        SpinnerShow: function () {
            SpinnerPlugin.activityStart("请稍后...", { dimBackground: true });
        },
        SpinnerHide: function () {
            SpinnerPlugin.activityStop();
        }
    };

})();

