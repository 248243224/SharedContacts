var DeviceEvent = (function () {

    return {

        GetCurrentPosition: function (onSuccess,onError) {
            if (isFunction(onError) && isFunction(onSuccess))
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    };

})();

