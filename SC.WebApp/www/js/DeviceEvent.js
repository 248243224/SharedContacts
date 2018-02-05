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
            //window.plugins.toast.showWithOptions({
            //    message: message,
            //    duration: "short", // 2000 ms 
            //    position: "bottom"
            //    //addPixelsY: -40
            //});
        },
        SpinnerShow: function () {
            // SpinnerPlugin.activityStart("Loading...", { dimBackground: true });
        },
        SpinnerHide: function () {
            // SpinnerPlugin.activityStop();
        },
        TakePhotos: function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 730,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            });
            function onSuccess(imageData) {
                if ($('.item-box').length < 2) {
                    $('.btn-box').css('padding-top', '0.6rem');
                    $('.btn-box p').hide();
                } else {
                    $('.btn-box p').show();
                    $('.btn-box').css('padding-top', '0.4rem');
                }
                var src = 'data:image/jpeg;base64,' + imageData;
                var html = '<div class="item-box">' +
                    '<img src="' + src + '">' +
                    '<div class="iconfont-close"></div>' +
                    '</div>';
                $('.imgs-box').prepend(html);
            }
            function onFail(message) {
                alert(message);
            }
        },
        Album: function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                popoverOptions: CameraPopoverOptions,
                mediaType: Camera.MediaType.PICTURE
            });
            function onSuccess(imageURI) {
                if ($('.item-box').length < 2) {
                    $('.btn-box').css('padding-top', '0.6rem');
                    $('.btn-box p').hide();
                } else {
                    $('.btn-box p').show();
                    $('.btn-box').css('padding-top', '0.4rem');
                }
                var src = 'data:image/jpeg;base64,' + imageData;
                var html = '<div class="item-box">' +
                    '<img src="' + imageURI + '">' +
                    '<div class="iconfont-close"></div>' +
                    '</div>';
                $('.imgs-box').prepend(html);
            }
            function onFail(message) {
                alert(message);
            }
        },
    };

})();

