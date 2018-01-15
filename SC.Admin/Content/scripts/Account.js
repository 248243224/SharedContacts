var AccountScript = (function () {
    //control center url
    var controlCenterUrl="/ControlCenter/Page";
    return {
        //Init
        Init: function () {
            $(document).on('click', '.toolbar a[data-target]', function (e) {
                e.preventDefault();
                var target = $(this).data('target');
                $('.widget-box.visible').removeClass('visible');//hide others
                $(target).addClass('visible');//show target
            });
            //style choose
            $('#btn-login-dark').on('click', function (e) {
                $('body').attr('class', 'login-layout');
                $('#id-text2').attr('class', 'white');
                $('#id-company-text').attr('class', 'blue');

                e.preventDefault();
            });
            $('#btn-login-light').on('click', function (e) {
                $('body').attr('class', 'login-layout light-login');
                $('#id-text2').attr('class', 'grey');
                $('#id-company-text').attr('class', 'blue');

                e.preventDefault();
            });
            $('#btn-login-blur').on('click', function (e) {
                $('body').attr('class', 'login-layout blur-login');
                $('#id-text2').attr('class', 'white');
                $('#id-company-text').attr('class', 'light-blue');

                e.preventDefault();
            });
        },
        //Login
        LoginSucceed: function (returnUrl) {
            if (returnUrl == "") {
                returnUrl = controlCenterUrl;
            }
            location.href = returnUrl;
        },

        LoginBegin: function () {
            $("#loginingIcon").removeClass("hidden");
            $("#login").attr("disabled", true);
        },

        LoginComplete: function () {
            //do something
        },

        LoginFailed: function (ajaxContext) {
           
            if (ajaxContext.responseText) {
                var errorMsg = "<li>" + ajaxContext.responseText + "</li>";
                $("#loginErrorMsg").removeClass("hidden");
                $("#loginErrorMsg ul").html(errorMsg);

                $.gritter.add({
                    title: '登录失败',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            //clear password
            $("#Password").val("");
            //enable login button
            $("#loginingIcon").addClass("hidden");
            $("#login").attr("disabled", false);
        },
        //Register
        RegisterSucceed: function (returnMsg) {
            //如果不需要邮箱激活则取消注释
            //location.href = controlCenterUrl;
            //如果不需要邮箱激活则注释以下内容
            var tipMsg = "<li>" + returnMsg + "</li>";
            $("#registerErrorMsg").removeClass("hidden");
            $("#registerErrorMsg ul").html(tipMsg);

            $.gritter.add({
                title: '注册成功',
                text: returnMsg,
                class_name: 'gritter-success'
            });
            //重置表单
            document.getElementById("formRegister").reset();
        },

        RegisterBegin: function () {
            $("#registeringIcon").removeClass("hidden");
            $("#register").attr("disabled", true);
        },

        RegisterComplete: function () {
            $("#registeringIcon").addClass("hidden");
            $("#register").attr("disabled", false);
        },

        RegisterFailed: function (ajaxContext) {
            var errorMsg = ajaxContext.responseText;
            if (errorMsg) {
                var errorHtml = "";
                $.each(errorMsg.split('|'), function (index, value) {
                    errorHtml += "<li>" + value + "</li>";
                });
                $("#registerErrorMsg").removeClass("hidden");
                $("#registerErrorMsg ul").html(errorHtml);

                $.gritter.add({
                    title: '注册失败',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
        },
        //Forgot Pwd
        ForgotSucceed: function (returnMsg) {

            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
            //重置表单
            document.getElementById("formFogot").reset();
            $("#login-box").addClass("visible");
            $("#forgot-box").removeClass("visible");
        },

        ForgotBegin: function () {
            $("#sendingIcon").removeClass("hidden");
            $("#forgot").attr("disabled", true);
        },

        ForgotComplete: function () {
            $("#sendingIcon").addClass("hidden");
            $("#forgot").attr("disabled", false);
        },

        ForgotFailed: function (ajaxContext) {
            var errorMsg = ajaxContext.responseText;
            if (errorMsg) {               
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
        }
    };
})();

AccountScript.Init();