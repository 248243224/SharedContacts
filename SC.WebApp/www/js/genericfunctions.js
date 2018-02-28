function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getBaseUrl() {
    var url = window.location.href;
    var arr = url.split("/");
    return arr[0] + "//" + arr[2]
}

function htmlEncode(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ResizeImage(file) {
    var img = document.createElement("img");
    img.src = file;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 400;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    dataurl = canvas.toDataURL("image/png");
    return dataURItoBlob(dataurl); 
}
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });
}

function getJsonItem(arr, n, v) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][n] == v)
            return arr[i];
}  

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getHours() + seperator2 + date.getMinutes();
    return currentdate;
}

function validateAmount(element) {
    element.bind('keypress', function (e) {
        // 在 keypress 事件中拦截错误输入

        var sCharCode = String.fromCharCode(e.charCode);
        var sValue = this.value;

        if (/[^0-9.]/g.test(sCharCode) || __getRegex(sCharCode).test(sValue)) {
            return false;
        }

        /**
         * 根据用户输入的字符获取相关的正则表达式
         * @param  {string} sCharCode 用户输入的字符，如 'a'，'1'，'.' 等等
         * @return {regexp} patt 正则表达式
         */
        function __getRegex(sCharCode) {
            var patt;
            if (/[0]/g.test(sCharCode)) {
                // 判断是否为空
                patt = /^$/g;
            } else if (/[.]/g.test(sCharCode)) {
                // 判断是否已经包含 . 字符或者为空
                patt = /((\.)|(^$))/g;
            } else if (/[1-9]/g.test(sCharCode)) {
                // 判断是否已经到达小数点后两位
                patt = /\.\d{2}$/g;
            }
            return patt;
        }
    }).bind('keyup paste', function () {
        // 在 keyup paste 事件中进行完整字符串检测

        var patt = /^((?!0)\d+(\.\d{1,2})?)$/g;

        if (!patt.test(this.value)) {
            // 错误提示相关代码，边框变红、气泡提示什么的
            console.log('输入格式不正确！');
        }
    });
}