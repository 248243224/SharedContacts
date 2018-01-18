﻿var CommissionScript = (function () {

    var IsPreButtonClicked = false;
    return {
        Init: function () {
            //限制number类型的控件只能输出正整数
            $("input[type=number]").keydown(function (e) {
                var code = parseInt(e.keyCode);
                if (code >= 96 && code <= 105 || code >= 48 && code <= 57 || code == 8) {
                    return true;
                } else {
                    return false;
                }
            });
            //取消点击上一步也会严重表单的问题
            $(".wizard-actions .btn-prev").on("click", function () {
                IsPreButtonClicked = true;
            });
            $(".wizard-actions .btn-next").on("click", function () {
                IsPreButtonClicked = false;
            });

            $('#fuelux-wizard')
           .ace_wizard({
               //step: 4 //optional argument. wizard will jump to step "2" at first
           })
           .on('change', function (e, info) {
               var $validation = true;
               switch (info.step) {
                   case 1:
                       if (IsPreButtonClicked)
                           break;
                       if (!$("#ckbNotice").prop("checked")) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "请您先阅读测试评价委托申请须知,阅读后请勾选已阅读",
                               class_name: 'gritter-error'
                           });
                       }
                       break;
                   case 2:
                       if (IsPreButtonClicked)
                           break;
                       if ($.trim($("#CompanyCName").val()) == ""
                          || $.trim($("#CompanyAddress").val()) == ""
                          || $.trim($("#ProjectContact").val()) == ""
                          || $.trim($("#PMobile").val()) == ""
                          || $.trim($("#PEmail").val()) == ""
                          || $(".field-validation-error").length > 0) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "请您按要求填写相应资料",
                               class_name: 'gritter-error'
                           });
                       }
                       break;
                   case 3:
                       if (IsPreButtonClicked)
                           break;
                       if ($.trim($("#SoftCName").val()) == ""
                          || $.trim($("#Version").val()) == ""
                          || $.trim($("#ProjectFrom_Id").val()) == 0
                          || $.trim($("#SoftTypes").val()) == ""
                          || $.trim($("#SoftScale_Id").val()) == 0
                          || $.trim($("#SoftStructure_Id").val()) == 0
                          || $(".field-validation-error").length > 0) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "请您按要求填写相应资料",
                               class_name: 'gritter-error'
                           });
                       }
                       break;
                   case 4:
                       if (IsPreButtonClicked)
                           break;
                       if ($.trim($("#SoftTestType_Id").val()) == 0
                          || $.trim($("#ReportWay").val())==""
                          || $(".field-validation-error").length > 0) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "请您按要求填写相应资料",
                               class_name: 'gritter-error'
                           });
                       }
                       break;
                   case 5:
                       if (IsPreButtonClicked)
                           break;
                       if ($(".field-validation-error").length > 0) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "请您按要求填写相应资料",
                               class_name: 'gritter-error'
                           });
                       }
                       break;
                   case 6:
                       if (IsPreButtonClicked)
                           break;
                       var files = $("#fileUpload").data('ace_input_files');
                       if (!files || files.length == 0) {
                           $validation = false;
                           $.gritter.add({
                               title: '消息提示',
                               text: "送测物品资料未上传",
                               class_name: 'gritter-error'
                           });
                       }//no files selected
               }
               return $validation;
           })
           .on('finished', function (e) {
               if (!"FormData" in window) {
                   $.gritter.add({
                       title: '消息提示',
                       text: "浏览器版本过低",
                       class_name: 'gritter-error'
                   });
                   return false;
               }
               //add files
               var $form = $("#commission");
               var files = $("#fileUpload").data('ace_input_files');
               if (!files || files.length == 0) {
                   $.gritter.add({
                       title: '消息提示',
                       text: "送测物品资料未上传",
                       class_name: 'gritter-error'
                   });
                   return false;
               }//no files selected
               $form.submit();
           }).on('stepclick', function (e) {
               //e.preventDefault();//this will prevent clicking and selecting steps
           });
            //项目来源
            $(".projectFrom").on("click", function () {
                var checkedVal = $(this).data("id");
                $("#ProjectFrom_Id").val(checkedVal);
            });
            //软件类型

            //所有选中软件类型,以逗号分隔
            var checkedTypes = "";

            //1.嵌入式
            $(".Qrs").on("click", function () {
                checkedTypes = "";
                if ($(this).prop("checked")) {
                    $(".QrsChildren").removeClass("hidden");
                    $(".FQrs").prop("checked", false);
                    $(".FQrsChildren .softType").prop("checked", false);
                    $(".FQrsChildren").addClass("hidden");
                }
                else {
                    $(".QrsChildren .softType").prop("checked", false);
                    $(".QrsChildren").addClass("hidden");
                }
            });
            //2.非嵌入式
            $(".FQrs").on("click", function () {
                checkedTypes = "";
                if ($(this).prop("checked")) {
                    $(".Qrs").prop("checked", false);
                    $(".QrsChildren .softType").prop("checked", false);
                    $(".QrsChildren").addClass("hidden");
                    $(".FQrsChildren").removeClass("hidden");
                }
                else {
                    $(".FQrsChildren .softType").prop("checked", false);
                    $(".FQrsChildren").addClass("hidden");
                }
            });
            $(".softType").on("click", function () {
                var checkedVal = $(this).data("id");
                //选中加
                if ($(this).prop("checked")) {
                    checkedTypes += checkedVal + ",";
                }
                    //非选中减
                else {
                    checkedTypes = checkedTypes.replace(checkedVal + ",", "");
                }
                $("#SoftTypes").val(checkedTypes);
            });
            //软件规模
            $(".softScale").on("click", function () {
                var checkedVal = $(this).data("id");
                $("#SoftScale_Id").val(checkedVal);
            });
            //软件架构
            $(".softStructure").on("click", function () {
                var checkedVal = $(this).data("id");
                $("#SoftStructure_Id").val(checkedVal);
            });
            //测试评价要求
            $(".softTestType").on("click", function () {
                var checkedVal = $(this).data("id");
                $("#SoftTestType_Id").val(checkedVal);
            });
            //检测标准
            $(".TestStandard").on("click", function () {
                var checkedVal = $(this).data("value");
                if (checkedVal == "2") {
                    $("#TestStandard").val("");
                    $("#TestStandard").removeAttr("readOnly");
                }
                else {
                    $("#TestStandard").attr("readOnly", true);
                }
            });
            //样品处理
            $(".SampleHandling").on("click", function () {
                var checkedVal = $(this).data("value");
                if (checkedVal == "3") {
                    $("#SampleHandling").val("");
                    $("#SampleHandling").removeAttr("readOnly");
                }
                else {
                    $("#SampleHandling").attr("readOnly", true);
                    $("#SampleHandling").val(checkedVal);
                }
            });

            //报告配送方式
            $(".reportWay").on("click", function () {
                var checkedVal = $(this).data("value");
                if (checkedVal == "快递") {
                    $("#ReportAddress").removeClass("hidden");
                    $("#receiveAddress").removeClass("hidden");
                }
                else {
                    $("#ReportAddress").addClass("hidden");
                    $("#receiveAddress").addClass("hidden");
                }
                $("#ReportWay").val(checkedVal);
            });
            $('#ComleteTime').datepicker({
                autoclose: true,
                todayHighlight: true
            });
            //送测物品提交
            $('#fileUpload').ace_file_input({
                style: 'well',
                btn_choose: '拖拽文件到这里或点击选择',
                btn_change: null,
                no_icon: 'ace-icon fa fa-cloud-upload',
                droppable: true,
                allowExt: ["zip", "rar"],
                allowMime: ["application/ocelet-stream","application/octet-stream","application/x-zip-compressed","application/x-rar-compressed","application/zip","application/rar"],
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
                if (info.error_count['ext']||info.error_count['mime']) {
                    $.gritter.add({
                        title: '文件上传失败',
                        text: "文件类型只支持zip,rar",
                        class_name: 'gritter-error'
                    });
                }
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

        },
        Succeed: function (projectId) {
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
            console.log(formData_object);
            var deferred = $.ajax({
                url: "/Attachment/AddUserUploads?projectId=" + projectId,
                type: 'POST',
                processData: false,//important
                contentType: false,//important
                dataType: 'json',
                data: formData_object
            });

            deferred
					.done(function (result) {//success

					})
					.fail(function (result) {//failure
					    if (result.responseText) {
					        $.gritter.add({
					            title: '消息提示',
					            text: result.responseText,
					            class_name: 'gritter-error'
					        });
					    }
					})
					.always(function () {//called on both success and failure
					  
					});

            deferred.promise();

            $.gritter.add({
                title: '消息提示',
                text: "申请成功",
                class_name: 'gritter-success'
            });

            location.href = "#Project";
        },

        Begin: function () {
            WaitDialog.show();          
        },
        Complete: function () {
            //do something
            WaitDialog.hide();
        },

        Failed: function (ajaxContext) {
            if (ajaxContext.responseText) {
                $.gritter.add({
                    title: '消息提示',
                    text: ajaxContext.responseText,
                    class_name: 'gritter-error'
                });
            }
        }
    }
})();