var RedpacketScript = (function () {
    var fd = new FormData();
    return {
        //Init
        Init: function () {

            try {

                Dropzone.autoDiscover = false;
                var myDropzone = new Dropzone('#dropzone', {
                    previewTemplate: $('#preview-template').html(),

                    thumbnailHeight: 120,
                    thumbnailWidth: 120,
                    maxFilesize: 0.5,
                    acceptedFiles: "image/*",
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    maxFiles: 9,
                    dictRemoveFile: '移除',

                    dictDefaultMessage:
                    '<span class="bigger-150 bolder"><i class="ace-icon fa fa-caret-right red"></i> Drop files</span> to upload \
				<span class="smaller-80 grey">(or click)</span> <br /> \
				<i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>'
                    ,

                    thumbnail: function (file, dataUrl) {
                        if (file.previewElement) {
                            $(file.previewElement).removeClass("dz-file-preview");
                            var images = $(file.previewElement).find("[data-dz-thumbnail]").each(function () {
                                var thumbnailElement = this;
                                thumbnailElement.alt = file.name;
                                thumbnailElement.src = dataUrl;
                            });
                            setTimeout(function () { $(file.previewElement).addClass("dz-image-preview"); }, 1);
                        }
                    },
                    init: function () {
                        this.on("addedfile", function (file) {
                            // actions...
                        });
                        this.on("removedfile", function (file) {
                            // actions...

                        });
                    }

                });

                //simulating upload progress
                var minSteps = 6,
                    maxSteps = 60,
                    timeBetweenSteps = 100,
                    bytesPerStep = 100000;

                myDropzone.uploadFiles = function (files) {
                    var self = this;

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

                        for (var step = 0; step < totalSteps; step++) {
                            var duration = timeBetweenSteps * (step + 1);
                            setTimeout(function (file, totalSteps, step) {
                                return function () {
                                    file.upload = {
                                        progress: 100 * (step + 1) / totalSteps,
                                        total: file.size,
                                        bytesSent: (step + 1) * file.size / totalSteps
                                    };

                                    self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
                                    if (file.upload.progress == 100) {
                                        file.status = Dropzone.SUCCESS;
                                        self.emit("success", file, 'success', null);
                                        self.emit("complete", file);
                                        self.processQueue();
                                        $(".dz-progress").hide();
                                    }
                                };
                            }(file, totalSteps, step), duration);
                        }
                    }
                }

                $("#btnPublish").on("click", function () {

                    var packetInfo = {
                        TotalNumber: $("#TotalNumber").val(),
                        Amount: $("#TotalNumber").val(),
                        Lng: $("#TotalNumber").val(),
                        Lat: $("#TotalNumber").val(),
                        TextContent: $("#TotalNumber").val()
                    };
                    fd.append('packetInfo', packetInfo);
                    $.each(myDropzone.files, function (i, file) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            // event.target.result contains base64 encoded image
                            var fileBytes = event.target.result;
                            fd.append('files', fileBytes);
                        };
                        reader.readAsDataURL(file);
                    });

                    RedpacketScript.AddPacket(fd);
                });

                //remove dropzone instance when leaving this page in ajax mode
                $(document).one('ajaxloadstart.page', function (e) {
                    try {
                        myDropzone.destroy();
                    } catch (e) { }
                });

            } catch (e) {
                alert('Dropzone.js does not support older browsers!');
            }
        },
        AddPacket: function (packetData) {
            var deffer = $.ajax({
                url: "127.0.0.1/",
                type: 'POST',
                contentType: false,
                data: packetData,
                cache: false,
                processData: false
            });
        }
    };
})();