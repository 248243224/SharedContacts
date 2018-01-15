var ProjectScript = (function () {
    var table;
    return {
        //Init
        BusinessInit: function () {
            table = $('#projectTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=business",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    if (aData.ProjectStatus_Id == EnumProjectStatus.申请失败 || aData.ProjectStatus_Id == EnumProjectStatus.受理失败) { //对于申请失败和受理失败的申请改变为修改标签
                        $('td:eq(6)', nRow).html(
                            "<a class='tooltip-error' data-rel = 'tooltip' title = '点击按反馈修改委托书' data-placement = 'top' href='#/Commission/Display?projectId=" + aData.Id + "'><i class='ace-icon fa fa-edit'></i>修改委托书</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "<span class='tooltip-warning red' style='cursor:pointer' data-rel = 'tooltip' title = '点击查看失败原因' data-placement = 'top' onclick='ProjectScript.ShowErrorBackMsg(" + aData.Id + ")'><i class='ace-icon fa fa-comments'></i>查看失败反馈消息</span>");
                    }
                    else if (aData.ProjectStatus_Id == EnumProjectStatus.计划失败
                        || aData.ProjectStatus_Id == EnumProjectStatus.测试失败
                        || aData.ProjectStatus_Id == EnumProjectStatus.报告编制失败
                        //|| aData.ProjectStatus_Id == EnumProjectStatus.报告审核失败 /*报告审核失败原因供计划执行人员查看*/
                        || aData.ProjectStatus_Id == EnumProjectStatus.报告发放失败) { //对于这些失败不允许修改,只允许查看错误信息
                        $('td:eq(6)', nRow).append(
                            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "<span style='cursor:pointer' class='tooltip-warning red' data-rel = 'tooltip' title = '点击查看失败原因' data-placement = 'top' href='#' onclick='ProjectScript.ShowErrorBackMsg(" + aData.Id + ")'><i class='ace-icon fa fa-comments'></i>查看失败反馈消息</span>");
                    }
                    if (aData.ProjectStatus_Id < EnumProjectStatus.受理成功)//受理成功的项目才允许下载受理单
                    {
                        $('td:eq(8)', nRow).empty();
                    }
                    if (aData.ProjectStatus_Id < EnumProjectStatus.报告发放成功)//报告发放成功的项目才能查看发放详情
                    {
                        $('td:eq(5)', nRow).empty();
                    }
                    var applyTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(applyTime.substring(0, 10));
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Commission[0].Version" },
                  { "data": "CreateDate" },            
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //报告发放详情
                    {
                        "targets": [5],
                        "data": "Commission",
                        "render": function (data, type, full) {
                            return "<a class='tooltip-success' onclick='ProjectScript.ShowReportDetails(\"" + data[0].ReportWay + "\",\"" + data[0].TrackingNumber + "\",\"" + data[0].ExpressCompany + "\",\"" + data[0].TrackingRemark + "\")' data-rel = 'tooltip' title = '点击查看报告发放详情'><i class='ace-icon fa fa-search'></i>查看发放详情</a>";
                        }
                    },
                    //查看委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a class='tooltip-success' data-rel = 'tooltip' title = '点击查看委托书' data-placement = 'top' href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i>查看委托申请书</a>";
                        }
                    },
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //受理单下载(category ：2 =>受理单类型)
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.受理单 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                ]
            });
        },

        AcceptInit: function () {
            //自动转换人民币大写
            $("#Price").keyup(function () {
                $("#RmbUpper").val(ProjectScript.digitUppercase($(this).val()));
            });

            table = $('#acceptTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=accept",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //开始受理
                    $(".beginAccept").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至受理中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.受理中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#acceptTable").dataTable().fnDraw(false);
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
                    $(".acceptSucceed").on(ace.click_event, function () {
                        //初始化受理单
                        $("#accectForm")[0].reset();
                        $("#ProjectId").val($(this).data("id"));
                        $("#CurrentProjectStatu").val($(this).data("statu"));
                        $("#ProjectName").val($(this).data("projectname") + " " + $(this).data("version"));
                        $("#CompanyName").val($(this).data("companyname"));
                        $("#ProjectCode").val($(this).data("projectcode"));
                        $("#AcceptTime").val(ProjectScript.GetNowFormatDate());
                        $("#Category").val($(this).data("category"));

                        $(".isMoneyPayOff").on("click", function () {
                            $("#IsMoneyPayOff").val($(this).data("id"));
                        });
                    });
                    $(".acceptFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写受理失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else if ($.trim(result).length > 300) {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能超过300个字",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.受理失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#acceptTable").dataTable().fnDraw(false);
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
                    var applyTime = $('td:eq(4)', nRow).html();
                    $('td:eq(4)', nRow).html(applyTime.substring(0, 10));
                    //给受理成功Button加上必要属性
                    $('td:eq(9) .acceptSucceed', nRow).attr("data-projectname", aData.Commission[0].SoftCName);
                    $('td:eq(9) .acceptSucceed', nRow).attr("data-companyname", aData.Commission[0].CompanyCName);
                    $('td:eq(9) .acceptSucceed', nRow).attr("data-projectcode", aData.Code);
                    $('td:eq(9) .acceptSucceed', nRow).attr("data-category", aData.Commission[0].SoftTestType.Name);
                    $('td:eq(9) .acceptSucceed', nRow).attr("data-version", aData.Commission[0].Version);
                    //添加当前状态用户判断当前项目状态是否已经被其他用户更新
                    $('td:eq(9) span', nRow).attr("data-statu", aData.ProjectStatus_Id);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Commission[0].CompanyCName" },
                  { "data": "Commission[0].Version" },
                  { "data": "CreateDate" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [5],
                        "data": "ProjectStatus_Id",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            switch (data) {
                                case EnumProjectStatus.申请成功:
                                    rowHtml = "<span class='label label-sm label-success arrowed-in'>申请成功</span>";
                                    break;
                                case EnumProjectStatus.受理中:
                                    rowHtml = "<span class='label label-sm label-warning arrowed-in'>受理中</span>";
                                    break;
                                case EnumProjectStatus.受理失败:
                                    rowHtml = "<span class='label label-sm label-danger arrowed-in'>受理失败</span>";
                                    break;
                            }
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //状态切换
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<div class='hidden-sm hidden-xs btn-group'>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginAccept'><i class='ace-icon fa fa-coffee'></i>受理中</span>" +
                                "<span href='#modal-accept' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success acceptSucceed'><i class='ace-icon fa fa-check'></i>受理成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger acceptFailed'><i class='ace-icon fa fa-times'></i>受理失败</span>" +
                             "</div>";
                        }
                    }]
            });

            //初始化model时间控件
            $('.date-picker').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        },

        MyAcceptInit: function () {
            table = $('#myAcceptTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=myAccept",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    var applyTime = $('td:eq(4)', nRow).html();
                    $('td:eq(4)', nRow).html(applyTime.substring(0, 10));
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "Commission[0].Version" },
                  { "data": "CreateDate" },
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [5],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                     //查看委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //受理单下载(category ：2 =>受理单类型)
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.受理单 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                ]
            });
        },

        PlanInit: function () {
            table = $('#planTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=plan",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //开始计划
                    $(".beginPlan").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至计划中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.计划中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#planTable").dataTable().fnDraw(false);
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
                    $(".planSucceed").on(ace.click_event, function () {
                        $("#planForm")[0].reset();
                        $("#ProjectId").val($(this).data("id"));
                        $("#CurrentProjectStatu").val($(this).data("statu"));
                        $("#TestTime").val(ProjectScript.GetNowFormatDate());
                        $("#TestContactName").val($(this).data("contactname"))
                        $("#TestContactPhone").val($(this).data("contactphone"))
                    });
                    $(".planFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写计划失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.计划失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#planTable").dataTable().fnDraw(false);
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
                    var applyTime = $('td:eq(5)', nRow).html();
                    $('td:eq(5)', nRow).html(applyTime.substring(0, 10));
                    //添加当前状态用户判断当前项目状态是否已经被其他用户更新
                    $('td:eq(10) span', nRow).attr("data-statu", aData.ProjectStatus_Id);
                    $('td:eq(10) .planSucceed', nRow).attr("data-contactName", aData.Commission[0].ProjectContact);
                    $('td:eq(10) .planSucceed', nRow).attr("data-contactPhone", aData.Commission[0].PMobile);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "Commission[0].CompanyCName" },
                  { "data": "Commission[0].Version" },
                  { "data": "CreateDate" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [6],
                        "data": "ProjectStatus_Id",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            switch (data) {
                                case EnumProjectStatus.受理成功:
                                    rowHtml = "<span class='label label-sm label-success arrowed-in'>受理成功</span>";
                                    break;
                                case EnumProjectStatus.计划中:
                                    rowHtml = "<span class='label label-sm label-warning arrowed-in'>计划中</span>";
                                    break;
                                case EnumProjectStatus.计划失败:
                                    rowHtml = "<span class='label label-sm label-danger arrowed-in'>计划失败</span>";
                                    break;
                            }
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //状态切换
                    {
                        "targets": [10],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<div class='hidden-sm hidden-xs btn-group'>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginPlan'><i class='ace-icon fa fa-coffee'></i>计划中</span>" +
                                "<span href='#modal-plan' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success planSucceed'><i class='ace-icon fa fa-check'></i>计划成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger planFailed'><i class='ace-icon fa fa-times'></i>计划失败</span>" +
                             "</div>";
                        }
                    }]
            });

            //初始化model时间控件
            $('.date-picker').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        },

        MyPlanInit: function () {
            table = $('#myPlanTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=myPlan",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    var applyTime = $('td:eq(4)', nRow).html();
                    $('td:eq(4)', nRow).html(applyTime.substring(0, 10));
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "Commission[0].Version" },
                  { "data": "CreateDate" },
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [5],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                     //查看委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                ]
            });
        },

        TestInit: function () {
            table = $('#testTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=test",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //开始测试
                    $(".beginTest").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至测试中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.测试中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#testTable").dataTable().fnDraw(false);
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
                    $(".testSucceed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至测试成功吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.测试成功 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#testTable").dataTable().fnDraw(false);
                                    $(".test").removeClass("hidden");
                                    $(".report").addClass("hidden");
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
                    $(".testFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写测试失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.测试失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#testTable").dataTable().fnDraw(false);
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
                    //开始报告编制
                    $(".beginReport").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至报告编制中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.报告编制中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#testTable").dataTable().fnDraw(false);
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
                    $(".reportSucceed").on(ace.click_event, function () {
                        //重置上传控件
                        $('#fileUpload').ace_file_input('reset_input');
                        $("#projectId").val($(this).data("id"));
                        $("#currentProjectStatu").val($(this).data("statu"))
                    });
                    $(".reportFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写报告编制失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.报告编制失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#testTable").dataTable().fnDraw(false);
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
                    var createTime = $('td:eq(5)', nRow).html();
                    $('td:eq(5)', nRow).html(createTime.substring(0, 10));
                    var testTime = $('td:eq(7)', nRow).html();
                    $('td:eq(7)', nRow).html(testTime.substring(0, 10));
                    if (aData.ProjectStatus_Id >= EnumProjectStatus.测试成功) {
                        $('td:eq(13)', nRow).find(".report").removeClass("hidden");
                        $('td:eq(13)', nRow).find(".test").addClass("hidden");
                    }
                    if (aData.ProjectStatus_Id == EnumProjectStatus.报告审核失败) {
                        $('td:eq(13)', nRow).find(".reSubmit").removeClass("hidden");
                        $('td:eq(13)', nRow).find(".test").addClass("hidden");
                        $('td:eq(13)', nRow).find(".report").addClass("hidden");
                    }
                    //添加当前状态用户判断当前项目状态是否已经被其他用户更新
                    $('td:eq(13) span', nRow).attr("data-statu", aData.ProjectStatus_Id);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "TestContactName" },
                  { "data": "TestContactPhone" },
                  { "data": "CreateDate" },
                  ,
                  { "data": "TestTime" },
                  { "data": "TestAddress" },
                  { "data": "MainTesterName" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [6],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [10],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [11],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [12],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //状态切换
                    {
                        "targets": [13],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<div class='hidden-sm hidden-xs btn-group'>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginTest test'><i class='ace-icon fa fa-coffee'></i>测试中</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-success testSucceed test'><i class='ace-icon fa fa-check'></i>测试成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger testFailed test'><i class='ace-icon fa fa-times'></i>测试失败</span>" +

                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginReport hidden report'><i class='ace-icon fa fa-coffee'></i>报告编制中</span>" +
                                "<span href='#modal-uploadReport' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success hidden reportSucceed report'><i class='ace-icon fa fa-check'></i>报告编制成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger reportFailed hidden report'><i class='ace-icon fa fa-times'></i>报告编制失败</span>" +

                                "<span href='#modal-uploadReport' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success hidden reportSucceed reSubmit'><i class='ace-icon fa fa-check'></i>重新提交报告</span>" +
                                "<span onclick='ProjectScript.ShowErrorBackMsg(" + data + ")' class='btn btn-xs btn-danger hidden reSubmit'><i class='ace-icon fa fa-comments'></i>查看失败原因</span>" +
                             "</div>";
                        }
                    }]
            });

            //初始化model时间控件
            $('.date-picker').datepicker({
                autoclose: true,
                todayHighlight: true
            });

            //测试报告提交
            $('#fileUpload').ace_file_input({
                style: 'well',
                btn_choose: '拖拽文件到这里或点击选择',
                btn_change: null,
                no_icon: 'ace-icon fa fa-cloud-upload',
                droppable: true,
                thumbnail: 'small',//large | fit
                maxSize: 10485760,//bytes,
                //,icon_remove:null//set null, to hide remove/reset button
                /**,before_change:function(files, dropped) {
                    //Check an example below
                    //or examples/file-upload.html
                    return true;
                }*/
                /**,before_remove : function() {
                    return true;
                }*/

                preview_error: function (filename, code) {
                    //code = 1 means file load error
                    //code = 2 image load error (possibly file is not an image)
                    //code = 3 preview failed
                }

            }).on('change', function () {
                //console.log($(this).data('ace_input_files'));
                //console.log($(this).data('ace_input_method'));
            }).on('file.error.ace', function (ev, info) {
                if (info.error_count['size']) {
                    $.gritter.add({
                        title: '文件上传失败',
                        text: "文件大小超出限制,最大为10MB",
                        class_name: 'gritter-error'
                    });
                }

                //you can reset previous selection on error
                //ev.preventDefault();
                //file_input.ace_file_input('reset_input');
            });

            $("#reportSubmit").on('click', function () {
                //上传附件
                formData_object = new FormData();//create empty FormData object
                //and then add files
                var field_name = $("#fileUpload").attr('name');
                var files = $("#fileUpload").data('ace_input_files');
                //for fields with "multiple" file support, field name should be something like `myfile[]`
                if (files && files.length > 0) {
                    for (var f = 0; f < files.length; f++) {
                        formData_object.append(field_name, files[f]);
                    }
                }
                else {
                    $.gritter.add({
                        title: '消息提示',
                        text: "测试报告未上传",
                        class_name: 'gritter-error'
                    });
                    return false;
                }
                console.log(formData_object);
                var projectId = $("#projectId").val();
                var currentStatu = $("#currentProjectStatu").val();
                var deferred = $.ajax({
                    url: "/Project/ReportSuccess?projectId=" + projectId + "&currentStatu=" + currentStatu,
                    type: 'POST',
                    processData: false,//important
                    contentType: false,//important
                    dataType: 'json',
                    data: formData_object
                });
                $("#modal-uploadReport").modal("hide");
                WaitDialog.show();
                deferred
                        .done(function (returnMsg) {//success
                            //刷新列表
                            $("#testTable").dataTable().fnDraw(false);
                            $.gritter.add({
                                title: '消息提示',
                                text: returnMsg,
                                class_name: 'gritter-success'
                            });
                        })
                        .fail(function (result) {//failure
                            if (result.responseText) {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: result.responseText,
                                    class_name: 'gritter-error'
                                });
                            }
                            $("#modal-uploadReport").modal({ "show": true });
                        })
                        .always(function () {//called on both success and failure
                            WaitDialog.hide();
                        });

                deferred.promise();
            });
        },

        MyTestInit: function () {
            table = $('#myTestTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=myTest",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    var createTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(createTime.substring(0, 10));
                    var testTime = $('td:eq(5)', nRow).html();
                    $('td:eq(5)', nRow).html(testTime.substring(0, 10));
                    if (aData.ProjectStatus_Id == EnumProjectStatus.测试成功)
                        $('td:eq(11)', nRow).empty();
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "CreateDate" },
                  ,
                  { "data": "TestTime" },
                  { "data": "TestAddress" },
                  { "data": "MainTesterName" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [10],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //测试报告下载
                    {
                        "targets": [11],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.测试报告 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }]
            });
        },

        CheckInit: function () {
            table = $('#checkTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=check",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //开始审核
                    $(".beginCheck").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至报告审核中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.报告审核中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#checkTable").dataTable().fnDraw(false);
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
                    $(".checkSucceed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        $("#ReportCheckForm")[0].reset();
                        $("#ProjectId").val(projectId);
                        $("#CurrentProjectStatu").val(currentStatu);                      
                    });
                    $(".checkFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写报告审核失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.报告审核失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#checkTable").dataTable().fnDraw(false);
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
                    var createTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(createTime.substring(0, 10));

                    //添加当前状态用户判断当前项目状态是否已经被其他用户更新
                    $('td:eq(9) span', nRow).attr("data-statu", aData.ProjectStatus_Id);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "CreateDate" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [5],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //测试报告下载
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.测试报告 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    },
                    //状态切换
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<div class='hidden-sm hidden-xs btn-group'>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginCheck'><i class='ace-icon fa fa-coffee'></i>报告审核中</span>" +
                                "<span href='#modal-check' data-toggle='modal' data-id='" + data + "' class='btn btn-xs btn-success checkSucceed'><i class='ace-icon fa fa-check'></i>报告审核成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger checkFailed'><i class='ace-icon fa fa-times'></i>报告审核失败</span>" +
                             "</div>";
                        }
                    }]
            });

            //初始化model时间控件
            $('.date-picker').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        },

        MyCheckInit: function () {
            table = $('#myCheckTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=myCheck",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {// 当创建了行，但还未绘制到屏幕上的时候调用，通常用于改变行的class风格 
                    var createTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(createTime.substring(0, 10));
                    var testTime = $('td:eq(5)', nRow).html();
                    $('td:eq(5)', nRow).html(testTime.substring(0, 10));
                    var reportSendTime = $('td:eq(7)', nRow).html();
                    $('td:eq(7)', nRow).html(reportSendTime.substring(0, 10));
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "CreateDate" },
                  ,
                  { "data": "TestTime" },
                  { "data": "TestAddress" },
                  { "data": "Commission[0].ReportSendTime" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [10],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //测试报告下载
                    {
                        "targets": [11],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.测试报告 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }]
            });
        },

        SendInit: function () {
            table = $('#sendTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=send",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    //开始发放
                    $(".beginSend").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.confirm("确认将项目状态切换至报告发放中吗", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.报告发放中 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#sendTable").dataTable().fnDraw(false);
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
                    $(".sendSucceed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        var reportWay = $(this).data("reportway");
                        if (reportWay == "快递") {
                            $("#ReportSendForm")[0].reset();
                            $("#ProjectId").val(projectId);
                            $("#CurrentProjectStatu").val(currentStatu);
                            $("#modal-express").modal('show');
                        }
                        else {
                            bootbox.confirm("确认将项目状态切换至报告发放成功吗", function (result) {
                                if (result) {
                                    WaitDialog.show();
                                    $.ajax({
                                        url: "/Project/ChangeOrderStatus",
                                        type: "POST",
                                        data: { projectId: projectId, currentStatu: currentStatu, status: EnumProjectStatus.报告发放成功 },
                                        dataType: 'json'
                                    })
                                    .done(function (returnMsg) {
                                        //刷新列表
                                        $("#sendTable").dataTable().fnDraw(false);
                                        $(".test").removeClass("hidden");
                                        $(".report").addClass("hidden");
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
                        }
                    });
                    $(".sendFailed").on(ace.click_event, function () {
                        var projectId = $(this).data("id");
                        var currentStatu = $(this).data("statu");
                        bootbox.prompt("请填写报告发放失败反馈信息", function (result) {
                            if (result === null) {
                            }
                            else if ($.trim(result) == "") {
                                $.gritter.add({
                                    title: '消息提示',
                                    text: "操作失败,反馈信息不能为空",
                                    class_name: 'gritter-error'
                                });
                            }
                            else {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/ChangeOrderStatus",
                                    type: "POST",
                                    data: { projectId: projectId, currentStatu: currentStatu, errorBackMsg: result, status: EnumProjectStatus.报告发放失败 },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $("#sendTable").dataTable().fnDraw(false);
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
                    var createTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(createTime.substring(0, 10));
                    var reportSendTime = $('td:eq(7)', nRow).html();
                    $('td:eq(7)', nRow).html(reportSendTime.substring(0, 10));

                    //添加当前状态用户判断当前项目状态是否已经被其他用户更新
                    $('td:eq(12) span', nRow).attr("data-statu", aData.ProjectStatus_Id);
                    $('td:eq(12) span', nRow).eq(1).attr("data-reportway", aData.Commission[0].ReportWay);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "CreateDate" },
                  ,
                  { "data": "Commission[0].ReportWay" },
                  { "data": "Commission[0].ReportAddress" },
                  { "data": "Commission[0].ReportSendTime" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [10],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //测试报告下载
                    {
                        "targets": [11],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.测试报告 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    },
                    //状态切换
                    {
                        "targets": [12],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<div class='hidden-sm hidden-xs btn-group'>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-warning beginSend'><i class='ace-icon fa fa-coffee'></i>报告发放中</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-success sendSucceed'><i class='ace-icon fa fa-check'></i>报告发放成功</span>" +
                                "<span data-id='" + data + "' class='btn btn-xs btn-danger sendFailed'><i class='ace-icon fa fa-times'></i>报告发放失败</span>" +
                             "</div>";
                        }
                    }]
            });
        },

        ProjectListInit: function () {
            table = $('#projectListTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetTableData?tableType=projectList",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "fnDrawCallback": function (oSettings) { //重新加载回调
                    $('[data-rel=tooltip]').tooltip();//初始化tooltip
                    //是否禁用
                    $(".isStopped").on(ace.click_event, function () {
                        var isStopped = $(this).data("isstopped");
                        var projectId = $(this).data("id");
                        bootbox.confirm("确认切换项目状态吗?", function (result) {
                            if (result) {
                                WaitDialog.show();
                                $.ajax({
                                    url: "/Project/StoppedOrRecover",
                                    type: "POST",
                                    data: { isStopped: isStopped, projectId: projectId },
                                    dataType: 'json'
                                })
                                .done(function (returnMsg) {
                                    //刷新列表
                                    $('#projectListTable').dataTable().fnDraw(false);
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
                    var createTime = $('td:eq(3)', nRow).html();
                    $('td:eq(3)', nRow).html(createTime.substring(0, 10));

                    if (aData.ProjectStatus_Id < EnumProjectStatus.受理成功)//受理成功的项目才允许下载受理单
                    {
                        $('td:eq(8)', nRow).empty();
                    }
                    if (aData.ProjectStatus_Id < EnumProjectStatus.报告编制成功)
                        $('td:eq(9)', nRow).empty();
                    if (aData.ProjectStatus_Id == EnumProjectStatus.报告发放成功)//已结束的项目没有终止选项
                        $('td:eq(10)', nRow).empty();
                    $('td:eq(10)', nRow).find(".isStopped").attr("data-id", aData.Id);
                    return nRow;
                },
                "columns": [
                  { "data": "Id" },
                  { "data": "Commission[0].SoftCName" },
                  { "data": "Code" },
                  { "data": "CreateDate" }
                ],
                "columnDefs": [
                    //项目状态
                    {
                        "targets": [4],
                        "data": "ProjectStatus.Name",
                        "render": function (data, type, full) {
                            var rowHtml = "";
                            if (data.indexOf("成功") != -1)//成功
                                rowHtml = "<span class='label label-sm label-success arrowed-in'>" + data + "</span>";
                            else if (data.indexOf("中") != -1)//进行中
                                rowHtml = "<span class='label label-sm label-warning arrowed-in'>" + data + "</span>";
                            else //失败
                                rowHtml = "<span class='label label-sm label-danger arrowed-in'>" + data + "</span>";
                            return rowHtml;
                        }
                    },
                    //查看委托书
                    {
                        "targets": [5],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='#/Commission/Display?projectId=" + data + "'><i class='ace-icon fa fa-search'></i></a>";
                        }
                    }
                    ,
                    //导出委托书
                    {
                        "targets": [6],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Commission/Export?projectId=" + data + "'><i class='ace-icon fa fa-share'></i></a>";
                        }
                    }
                    ,
                    //附件下载(category ：1 =>用户附件类型)
                    {
                        "targets": [7],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.用户提交文档 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                                        ,
                    //受理单下载(category ：2 =>受理单类型)
                    {
                        "targets": [8],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.受理单 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    }
                    ,
                    //测试报告下载
                    {
                        "targets": [9],
                        "data": "Id",
                        "render": function (data, type, full) {
                            return "<a href='/Attachment/GetAttachment?category=" + AttachmentCategory.测试报告 + "&projectId=" + data + "'><i class='ace-icon fa fa-download'></i></a>";
                        }
                    },
                     //临时终止
                    {
                        "targets": [10],
                        "data": "IsStopped",
                        "render": function (data, type, full) {
                            if (data == "" || data == null)
                                data = false;
                            if (data)
                                return "<span data-isStopped='" + !data + "' class='btn btn-xs btn-success isStopped'><i class='ace-icon fa fa-check'></i>恢复</span>";
                            else
                                return "<span data-isStopped='" + !data + "' class='btn btn-xs btn-danger isStopped'><i class='ace-icon fa fa-ban'></i>终止</span>";
                        }
                    }
                ]
            });
        },
        OperationLogListInit: function () {
            table = $('#operationLogListTable')
            .dataTable({
                "bAutoWidth": false,
                "language": { "url": "/Content/scripts/JqTableChinese.json" },
                "bServerSide": true,
                "sAjaxSource": "/Project/GetOperationLogTableData",//数据接口。
                'bPaginate': true,                      //是否分页。
                "bProcessing": true,                    //当datatable获取数据时候是否显示正在处理提示信息。
                'bFilter': true,                       //是否使用内置的过滤功能。
                'bLengthChange': true,                  //是否允许用户自定义每页显示条数。
                "bSort": false, // 排序功能
                "bStateSave": false,// 状态保存
                'sPaginationType': 'full_numbers',      //分页样式
                "sServerMethod": "get",//请求方式
                "fnServerParams": function (aoData) {
                    aoData.push(
                       { "name": "sDateTimeRange", "value": $('#reportrange span').html() }//时间参数
                    );
                },
                "dom":
                   "<'row'<'col-sm-5'l<'#refresh'>><'col-sm-7'<'#mytoolbox'>f>r>" +
                   "t" +
                   "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "initComplete": ProjectScript.InitComplete,
                "columns": [
                  { "data": "Id" },
                  { "data": "Project.Commission[0].SoftCName" },
                  { "data": "Project.Code" },
                  ,
                  { "data": "AppUser.Name" },
                  { "data": "CreateTime" }
                ],
                "columnDefs": [
                 {
                     "targets": [3],
                     "data": "ProjectStatus_Id",
                     "render": function (data, type, full) {
                         var rowHtml = "状态切换为" + GetProjectStatuName(data);
                         return rowHtml;
                     }
                 }]
            });
        },
        ShowErrorBackMsg: function (projectId) {
            $.ajax({
                url: "/Project/GetErrorBackMsg",
                type: "get",
                data: { projectId: projectId },
                dataType: 'json'
            })
            .done(function (errorBackMsg) {
                //显示错误消息
                bootbox.dialog({
                    //title:"失败反馈信息如下：",
                    message: "失败反馈消息：<span class='red lighter'>" + errorBackMsg + "</span>"
                });
            })
            .error(function (ajaxContext) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            })
        },
        ShowReportDetails: function (receiveType, expressNum, expressCompany, remark) {
            var msgHtml = "报告接收方式：<span class='red lighter'>" + receiveType + "</span>";
            msgHtml += "<br />";
            if (receiveType == "快递") {
                msgHtml += "快递单号：<span class='red lighter'>" + expressNum + "</span>";
                msgHtml += "<br />";
                msgHtml += "快递公司：<span class='red lighter'>" + expressCompany + "</span>";
                msgHtml += "<br />";
                msgHtml += "备注信息：<span class='red lighter'>" + remark + "</span>";
            }
            else {
                msgHtml += "评测中心电话：<span class='red lighter'>" + centerInfo.companyTel + "</span>";
                msgHtml += "<br />";
                msgHtml += "评测中心地址：<span class='red lighter'>" + centerInfo.address + "</span>";
            }
            bootbox.dialog({
                //title: "报告发放详情",
                message: msgHtml
            });
        },
        GetNowFormatDate: function () {
            var date = new Date();
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        /**
         * 表格加载渲染完毕后执行的方法
         * @param data
         */
        InitComplete: function (data) {
            var dataPlugin =
               '<div id="reportrange" style="cursor:pointer;margin-top:3px" class="dateRange pull-left"> ' +
               '按日期过滤：<i class="glyphicon glyphicon-calendar fa fa-calendar"></i> ' +
               '<span id="searchDateRange"></span>  ' +
               '<b class="caret"></b></div> ';
            $('#mytoolbox').append(dataPlugin);
            //刷新按钮
            var refreshButton = '<span class="btn btn-xs btn-white btn-info btn-round"><i class="ace-icon fa fa-refresh"></i>刷新</span>';
            $('#refresh').append(refreshButton);
            $(".dataTables_length").addClass("pull-left");
            $(".dataTables_length").attr("style", "margin-right:20px");
            $("#refresh span").on('click', function () {
                //重新加载
                table.fnDraw();
            });
            //时间插件
            //$('#reportrange span').html(moment().subtract('day', 1).format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
            $('#reportrange span').html('2016-01-01 00:00:00' + ' - ' + '2099-01-01 00:00:00');
            $('#reportrange').daterangepicker(
            {
                // startDate: moment().startOf('day'),
                //endDate: moment(),
                //minDate: '01/01/2012',    //最小时间
                maxDate: moment(), //最大时间
                //dateLimit: {
                //    days: 30
                //}, //起止时间的最大间隔
                showDropdowns: true,
                showWeekNumbers: false, //是否显示第几周
                timePicker: true, //是否显示小时和分钟
                timePickerIncrement: 1, //时间的增量，单位为分钟
                timePicker12Hour: false, //是否使用12小时制来显示时间
                ranges: {
                    //'最近1小时': [moment().subtract('hours',1), moment()],
                    '今日': [moment().startOf('day'), moment()],
                    '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                    '最近7日': [moment().subtract('days', 6), moment()],
                    '最近30日': [moment().subtract('days', 29), moment()],
                },
                opens: 'right', //日期选择框的弹出位置
                buttonClasses: ['btn btn-default'],
                applyClass: 'btn-small btn-primary blue',
                cancelClass: 'btn-small',
                format: 'YYYY-MM-DD HH:mm:ss', //控件中from和to 显示的日期格式
                separator: ' to ',
                locale: {
                    applyLabel: '确定',
                    cancelLabel: '取消',
                    fromLabel: '起始时间',
                    toLabel: '结束时间',
                    customRangeLabel: '自定义',
                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    firstDay: 1
                }
            }, function (start, end, label) {//格式化日期显示框
                $('#reportrange span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
            });

            //设置日期菜单被选项  --开始--
            var dateOption;
            if ("${riqi}" == 'day') {
                dateOption = "今日";
            } else if ("${riqi}" == 'yday') {
                dateOption = "昨日";
            } else if ("${riqi}" == 'week') {
                dateOption = "最近7日";
            } else if ("${riqi}" == 'month') {
                dateOption = "最近30日";
            } else if ("${riqi}" == 'year') {
                dateOption = "最近一年";
            } else {
                dateOption = "自定义";
            }
            $(".daterangepicker").find("li").each(function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                }
                if (dateOption == $(this).html()) {
                    $(this).addClass("active");
                }
            });
            //设置日期菜单被选项  --结束--

            //选择时间后触发重新加载的方法
            $("#reportrange").on('apply.daterangepicker', function () {
                //当选择时间后，出发dt的重新加载数据的方法
                table.fnDraw();
            });

            function getParam(url) {
                var data = decodeURI(url).split("?")[1];
                var param = {};
                var strs = data.split("&");

                for (var i = 0; i < strs.length; i++) {
                    param[strs[i].split("=")[0]] = strs[i].split("=")[1];
                }
                return param;
            }
        },

        AcceptSucceed: function (returnMsg) {
            //刷新列表
            $("#acceptTable").dataTable().fnDraw(false);
            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
        },

        AcceptBegin: function () {
            $("#modal-accept").modal("hide");
            WaitDialog.show();
        },

        AcceptComplete: function () {
            //do something
            WaitDialog.hide();
        },

        AcceptFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            $("#modal-accept").modal({ "show": true });
        },

        PlanSucceed: function (returnMsg) {
            //刷新列表
            $("#planTable").dataTable().fnDraw(false);
            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
        },

        PlanBegin: function () {
            $("#modal-plan").modal("hide");
            WaitDialog.show();
        },

        PlanComplete: function () {
            //do something
            WaitDialog.hide();
        },

        PlanFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            $("#modal-plan").modal({ "show": true });
        },
        ReportCheckSucceed: function (returnMsg) {
            //刷新列表
            $("#checkTable").dataTable().fnDraw(false);
            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
        },

        ReportCheckBegin: function () {
            $("#modal-check").modal("hide");
            WaitDialog.show();
        },

        ReportCheckComplete: function () {
            //do something
            WaitDialog.hide();
        },

        ReportCheckFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            $("#modal-check").modal({ "show": true });
        },

        ReportSendSucceed: function (returnMsg) {
            //刷新列表
            $("#sendTable").dataTable().fnDraw(false);
            $.gritter.add({
                title: '消息提示',
                text: returnMsg,
                class_name: 'gritter-success'
            });
        },

        ReportSendBegin: function () {
            $("#modal-express").modal("hide");
            WaitDialog.show();
        },

        ReportSendComplete: function () {
            //do something
            WaitDialog.hide();
        },

        ReportSendFailed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
            $("#modal-express").modal({ "show": true });
        },
        /** 数字金额大写转换(可以处理整数,小数,负数) */
        digitUppercase: function (n) {
            var fraction = ['角', '分'];
            var digit = [
                '零', '壹', '贰', '叁', '肆',
                '伍', '陆', '柒', '捌', '玖'
            ];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
        }
    };
})();