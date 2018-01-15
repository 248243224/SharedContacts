var UserScript = (function () {

    return {
        //Init
        Init: function () {
            $("#btnReset").on('click', function () {
                //以form开头的Id
                $("[id^=form]").each(function () {
                    $(this)[0].reset();
                });
            });
            $("#btnSubmit").on('click', function () {
                switch ($(".tabbable .active a").text().trim()) {
                    case "基本信息":
                        $("#formUserInfo").submit();
                        break;
                    case "设置":
                        //$("#formSetting").click();
                        $.gritter.add({
                            title: '消息提示',
                            text: "模块筹备中...",
                            class_name: 'gritter-error'
                        });
                        break;
                    case "密码":
                        var oldPassword = $("#OldPassword");
                        var newPassword = $("#NewPassword");
                        var confirmPassword = $("#ConfirmPassword");
                        var errorMsg = "";
                        if ($.trim(oldPassword.val()) == "") {
                            errorMsg = "旧密码不能为空";
                            oldPassword.focus();
                        }
                        else if ($.trim(oldPassword.val()).length < 6) {
                            errorMsg = "旧密码至少6位";
                            oldPassword.focus();
                        }
                        else if ($.trim(newPassword.val()) == "") {
                            errorMsg = "新密码不能为空";
                            newPassword.focus();
                        }
                        else if ($.trim(newPassword.val()).length < 6) {
                            errorMsg = "新密码至少6位";
                            newPassword.focus();
                        }
                        else if ($.trim(newPassword.val()) != $.trim(confirmPassword.val())) {
                            errorMsg = "二次输入密码不一致";
                            confirmPassword.focus();
                        }
                        else
                            $("#formPassWord").submit();
                        if (errorMsg != "")
                            $.gritter.add({
                                title: '消息提示',
                                text: errorMsg,
                                class_name: 'gritter-error'
                            });
                        break;
                }
            });
            //邮箱不能修改
            $("#Email").attr("readonly", "");
            //初始化tooptip
            $('[data-rel=tooltip]').tooltip();
        },
        //Update 
        UserUpdateSucceed: function (msg) {
            //移除提示框
            $("#completeInfoReminder").addClass("hidden");
            $("#completeUserInfoTip").addClass("hidden");
            $("#sidebarCommission").removeClass("hidden");
            $("#sidebarStatus").removeClass("hidden");
            $("#sidebarProjects").removeClass("hidden");
            $.gritter.add({
                title: '消息提示',
                text: msg,
                class_name: 'gritter-success'
            });
        },
        UserUpdateBegin: function () {
            WaitDialog.show();
        },
        UserUpdateComplete: function () {
            //do something
            WaitDialog.hide();
        },
        UserUpdateFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
        },
        //Reset Pwd
        ChangePasswordSucceed: function (msg) {
            $("#formPassWord")[0].reset();
            $.gritter.add({
                title: '消息提示',
                text: msg,
                class_name: 'gritter-success'
            });
        },
        ChangePasswordBegin: function () {
            WaitDialog.show();
        },
        ChangePasswordComplete: function () {
            //do something
            WaitDialog.hide();
        },
        ChangePasswordFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
        },
        UserManageInit: function () {
            $('#userTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/User/GetUsers?tableType=user",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //是否禁用
                    $(".isEnable").on(ace.click_event, function () {
                        var isEnable = $(this).data("isenable");
                        var userId = $(this).data("id");
                        bootbox.confirm("确认切换用户状态吗?", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/User/ChangeStatus",
                                    type: "POST",
                                    data: { isEnable: isEnable, userId: userId },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $('#userTable').dataTable().fnDraw(false);
                                    $.gritter.add({
                                        title: '消息提示',
                                        text: returnMsg,
                                        class_name: 'gritter-success'
                                    });
                                })
                                .error(function (ajaxContext) {
                                    $.gritter.add({
                                        title: '消息提示',
                                        text: ajaxContext.responseText,
                                        class_name: 'gritter-error'
                                    });
                                })
                                .complete(function () {
                                    WaitDialog.hide();
                                })
                            }
                        });
                    });
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    $('td:eq(6)', nRow).find(".isEnable").attr("data-id", aData.Id);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "CompanyCName" },
                  { "data": "Email" },
                  { "data": "ContactPhone" }
                ],
                "columnDefs": [
                    //是否激活
                    {
                        "targets": [4],
                        "data": "EmailConfirmed",
                        "render": function (data, type, full) {
                            if (data)
                                return "已激活";
                            else
                                return "未激活";
                        }
                    },
                    //是否禁用
                    {
                        "targets": [5],
                        "data": "IsEnable",
                        "render": function (data, type, full) {
                            if (data)
                                return "未禁用";
                            else
                                return "已禁用";
                        }
                    }
                    ,
                    //状态切换
                    {
                        "targets": [6],
                        "data": "IsEnable",
                        "render": function (data, type, full) {
                            if (data)
                                return "<span data-isenable='" + data + "' class='btn btn-xs btn-danger isEnable'><i class='ace-icon fa fa-ban'></i>禁用</span>";
                            else
                                return "<span data-isenable='" + data + "' class='btn btn-xs btn-success isEnable'><i class='ace-icon fa fa-check'></i>启用</span>";
                        }
                    }]
            });
        },

        CenterUserManageInit: function () {
          var table=  $('#centerUserTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/User/GetUsers?tableType=centerUser",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $(".userInfoEdit").on(ace.click_event, function () {
                        $("#userForm")[0].reset();

                        $("#Email").attr("readonly", true);
                        $(".Password").addClass("hidden");
                        $("#Name").attr("readonly", true);
                        $("#Email").val("nothandle@mail.com");
                        $("#Password").val("Acoder,1125");

                        var checkedTypes = $(this).data("roles") + ",";
                        $("#Name").val($(this).data("name"));
                        $("#UserId").val($(this).data("id"));
                        $("#CurrentRoles").val(checkedTypes);
                        $("#Email").val($(this).data("email"));
                        $("#ContactPhone").val($(this).data("tel"));
                        $("#UserRoleList").val(checkedTypes);
                        $("#IsEnable").val($(this).data("isenable"));
                        $(".isEnable[data-value=" + $(this).data("isenable") + "]").prop("checked", "checked");

                        var roleList = checkedTypes.split(",");
                        $.each(roleList, function (index, data) {
                            if (data != "") {
                                $(".role[data-value=" + data + "]").prop("checked", "checked");
                            }
                        });
                        
                        $(".role").on('click', function () {
                            var checkedVal = $(this).data("value");
                            //选中加
                            if ($(this).prop("checked")) {
                                checkedTypes += checkedVal + ",";
                            }
                                //非选中减
                            else {
                                checkedTypes = checkedTypes.replace(checkedVal + ",", "");
                            }
                            $("#UserRoleList").val(checkedTypes)
                        });
                        $(".isEnable").on('click', function () {
                            $("#IsEnable").val($(this).data("value"));
                        });
                    });
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    $.get("/User/GetRoles?userId=" + aData.Id, function (roleName) {
                        if (roleName != null)
                        {
                            $('td:eq(4)', nRow).html(roleName);
                            $('td:eq(5)', nRow).find(".userInfoEdit")
                                               .attr("data-name", aData.Name)
                                               .attr("data-email", aData.Email)
                                               .attr("data-roles", roleName)
                                               .attr("data-isenable", aData.IsEnable)
                                               .attr("data-tel", aData.ContactPhone);
                        }
                    });

                    return nRow;
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#add'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": function (data) {
                    var addButton = '<span href="#modal-userInfo" data-toggle="modal" class="btn btn-xs btn-white btn-info btn-round"><i class="ace-icon fa fa-plus"></i>新建用户</span>';
                    $('#add').append(addButton);
                    $(".dataTables_length").addClass("pull-left");
                    $(".dataTables_length").attr("style", "margin-right:20px");
                    var checkedTypes = "";
                    $("#add span").on('click', function () {
                        $("#userForm")[0].reset();
                        $("#Email").removeAttr("readonly");
                        $("#Name").removeAttr("readonly");
                        $(".Password").removeClass("hidden");
                        $(".role").on('click', function () {
                            var checkedVal = $(this).data("value");
                            //选中加
                            if ($(this).prop("checked")) {
                                checkedTypes += checkedVal + ",";
                            }
                                //非选中减
                            else {
                                checkedTypes = checkedTypes.replace(checkedVal + ",", "");
                            }
                            $("#UserRoleList").val(checkedTypes)
                        });
                        $(".isEnable").on('click', function () {
                            $("#IsEnable").val($(this).data("value"));
                        });
                    });
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Name" },
                  { "data": "ContactPhone" },
                  { "data": "Email" }
                ],
                "columnDefs": [
                      {
                          "targets": [4],
                          "data": "Id",
                          "render": function (data, type, full) {
                              return "";
                          }
                      }
                    ,
                    //编辑
                    {
                        "targets": [5],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<span href='#modal-userInfo' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success userInfoEdit'><i class='ace-icon fa fa-pencil-square-o'></i>编辑</span>";
                        }
                    }
                ]
            });
        },

        EditOrAddSucceed: function (returnMsg) {
            //刷新列表
            $("#centerUserTable").dataTable().fnDraw(false);
            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
        },

        EditOrAddBegin: function () {
            if ($.trim($("#UserRoleList").val()) == "") {
                $.gritter.add({
                    title: '消息提示',
                    text: "必须选择一个角色",
                    class_name: 'gritter-error'
                });
                return false;
            }
            $("#modal-userInfo").modal("hide");
            WaitDialog.show();
        },

        EditOrAddComplete: function () {
            //do something
            WaitDialog.hide();
        },

        EditOrAddFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            $("#modal-userInfo").modal({ "show": true });
        },
    };
})();