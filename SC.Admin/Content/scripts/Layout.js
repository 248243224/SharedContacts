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

var EnumProjectStatus = {
    无状态: 0,
    申请成功: 1,
    申请失败: 2,
    受理中: 3,
    受理失败: 4,
    受理成功: 5,
    计划中: 6,
    计划失败: 7,
    计划成功: 8,
    测试中: 9,
    测试失败: 10,
    测试成功: 11,
    报告编制中: 12,
    报告编制失败: 13,
    报告编制成功: 14,
    报告审核中: 15,
    报告审核失败: 16,
    报告审核成功: 17,
    报告发放中: 18,
    报告发放失败: 19,
    报告发放成功: 20
}

var GetProjectStatuName = function (statuId) {
    var statuName = "";
    switch (statuId) {
        case 0:
            statuName = "无状态";
            break;
        case 1:
            statuName = "申请成功";
            break;
        case 2:
            statuName = "申请失败";
            break;
        case 3:
            statuName = "受理中";
            break;
        case 4:
            statuName = "受理失败";
            break;
        case 5:
            statuName = "受理成功";
            break;
        case 6:
            statuName = "计划中";
            break;
        case 7:
            statuName = "计划失败";
            break;
        case 8:
            statuName = "计划成功";
            break;
        case 9:
            statuName = "测试中";
            break;
        case 10:
            statuName = "测试失败";
            break;
        case 11:
            statuName = "测试成功";
            break;
        case 12:
            statuName = "报告编制中";
            break;
        case 13:
            statuName = "报告编制失败";
            break;
        case 14:
            statuName = "报告编制成功";
            break;
        case 15:
            statuName = "报告审核中";
            break;
        case 16:
            statuName = "报告审核失败";
            break;
        case 17:
            statuName = "报告审核成功";
            break;
        case 18:
            statuName = "报告发放中";
            break;
        case 19:
            statuName = "报告发放失败";
            break;
        case 20:
            statuName = "报告发放成功";
            break;
    }
    return statuName;
}

var AttachmentCategory = {
    模板文档: 0,
    用户提交文档: 1,
    受理单: 2,
    测试报告: 3
}