$(function () {
    $("#about").on("click", function () {
        var msgHtml = "版本号：<span class='red lighter'>" + centerInfo.version + "</span>";
        msgHtml += "<br />";
        msgHtml += "最新更新日期：<span class='red lighter'>" + centerInfo.latestUpdateTime + "</span>";
        msgHtml += "<br />";
        msgHtml += "邮箱：<span class='red lighter'>" + centerInfo.email + "</span>";
        msgHtml += "<br />";
        msgHtml += "联系电话：<span class='red lighter'>" + centerInfo.companyTel + "</span>";
        msgHtml += "<br />";
        msgHtml += "联系地址：<span class='red lighter'>" + centerInfo.address + "</span>";
        msgHtml += "<br />";
        msgHtml += "所属权：<span class='red lighter'>" + centerInfo.companyName + "&copy; 2016-2017</span>";

        bootbox.dialog({
            title: "<i class='fa fa-leaf'></i>&nbsp&nbsp&nbsp&nbsp共享人脉后台管理平台",
            message: msgHtml
        });
    });
});

var centerInfo = {
    version: "1.1",
    latestUpdateTime: "2018-01-18",
    companyName: "福州搜索互动有限公司",
    companyTel: "0592-2970280 ",
    email: "fzss@contact.com",
    address: "福州市鼓楼区"
}

var WaitDialog = {
    show: function () {
        //backdrop: 'static', keyboard: false 禁止点击背景和键盘ESC关闭等待框
        $("#WaitDialog").modal({ show: true, backdrop: 'static', keyboard: false });
    },

    hide: function () {
        $("#WaitDialog").modal('hide');
    }
};

var WithdrawApplyStatu = {
    NotCompleted,
    Completed
}

var config = {
    withdrawApplyApiUrl: "http://localhost:8047/api/WithdrawApply",
    redpacketApiUrl:"http://localhost:8047/api/RedPacket"
}
