var RedpacketScript = (function () {
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

                    WaitDialog.show();

                    var fd = new FormData();

                    var packetInfo = {
                        TotalNumber: $("#TotalNumber").val(),
                        Amount: $("#Amount").val(),
                        Lng: $("#Lng").val(),
                        Lat: $("#Lat").val(),
                        TextContent: $("#TextContent").val(),
                        Link: $("#Link").val(),
                        UserId: 0
                    };
                    fd.append('packetinfo', JSON.stringify(packetInfo));
                    $.each(myDropzone.files, function (i, file) {
                        fd.append('files', file);
                    });
                    RedpacketScript.AddPacket(fd)
                        .done(WaitDialog.hide);
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
        InitMap: function () {
            var map = new BMap.Map("allmap");
            var navigationControl = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                enableGeolocation: true
            });
            map.addControl(navigationControl);

            function getLocation(e) {
                map.clearOverlays();
                var mk = new BMap.Marker(e.point);
                map.addOverlay(mk);
                map.centerAndZoom(e.point, 18);
                $("#Lng").val(e.point.lng);
                $("#Lat").val(e.point.lat);
            }
            map.addEventListener("click", getLocation);

            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    map.enableScrollWheelZoom(true);
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.centerAndZoom(r.point, 18);

                    $("#Lng").val(r.point.lng);
                    $("#Lat").val(r.point.lat);
                }
                else {
                    alert('failed' + this.getStatus());
                }
            }, { enableHighAccuracy: true })
        },
        AddPacket: function (packetData) {
            return deffer = $.ajax({
                url: config.redpacketApiUrl,
                type: 'POST',
                contentType: false,
                data: packetData,
                cache: false,
                processData: false
            });
        }
    };
})();