var WithdrawApplyScript = (function () {
    var table;
    return {
        //Init

        WithdrawApplyInit: function () {

            table = $('#withdrawTable')
                .dataTable({
                    "bAutoWidth": false,
                    "language": { "url": "/Content/scripts/JqTableChinese.json" },
                    "bServerSide": true,
                    "sAjaxSource": config.withdrawApplyApiUrl,//数据接口。
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
                        var applyTime = $('td:eq(3)', nRow).html();
                        $('td:eq(3)', nRow).html(applyTime.substring(0, 10));
                        return nRow;
                    },
                    "columns": [
                        { "data": "ApplyId" },
                        { "data": "SCUser.Name" },
                        { "data": "Amount" },
                        { "data": "ApplyTime" }
                    ],
                    "columnDefs": [
                        //项目状态
                        {
                            "targets": [4],
                            "data": "Statu",
                            "render": function (data, type, full) {
                                var rowHtml = "";
                                switch (data) {
                                    case WithdrawApplyStatu.Completed:
                                        rowHtml = "<span class='label label-sm label-success arrowed-in'>已处理</span>";
                                        break;
                                    case WithdrawApplyStatu.NotCompleted:
                                        rowHtml = "<span class='label label-sm label-danger arrowed-in'>待处理</span>";
                                        break;
                                }
                                return rowHtml;
                            }
                        },
                        //状态切换
                        {
                            "targets": [5],
                            "data": "ApplyId",
                            "render": function (data, type, full) {
                                return "<div class='hidden-sm hidden-xs btn-group'>" +
                                    "<span data-id='" + data + "' class='btn btn-xs btn-warning'><i class='ace-icon fa fa-exchange'></i>切换状态</span>" +
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
        }
    };
})();