var AnalysisScript = (function () {

    return {
        Init: function () {
            $('.easy-pie-chart.percentage').each(function () {
                var $box = $(this).closest('.infobox');
                var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
                var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
                var size = parseInt($(this).data('size')) || 50;
                $(this).easyPieChart({
                    barColor: barColor,
                    trackColor: trackColor,
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: parseInt(size / 10),
                    animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
                    size: size
                });
            })

            $('.sparkline').each(function () {
                var $box = $(this).closest('.infobox');
                var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
                $(this).sparkline('html',
                                 {
                                     tagValuesAttribute: 'data-values',
                                     type: 'bar',
                                     barColor: barColor,
                                     chartRangeMin: $(this).data('min') || 0
                                 });
            });


            //flot chart resize plugin, somehow manipulates default browser resize event to optimize it!
            //but sometimes it brings up errors with normal resize event handlers
            $.resize.throttleWindow = false;

            $(".widget-toolbar ul li").on('click', function () {
                AnalysisScript.DrawPieChart($(this).data("id"));
            })
                   
            AnalysisScript.DrawPieChart(1);
            AnalysisScript.DrawPlotChart();

            $("b").each(function () { $(this).html($(this).html().replace("$", "<i class='fa fa-yen'></i>")) })
        },

        DrawPieChart: function (monthCount, position) {

            var placeholder = $('#piechart-placeholder').css({ 'width': '90%', 'min-height': '150px' });
            $.get("/Project/GetAnalysisPieData?monthCount=" + monthCount, function (data) {
                console.log(data);
                $.plot(placeholder, data, {
                    series: {
                        pie: {
                            show: true,
                            tilt: 0.8,
                            highlight: {
                                opacity: 0.25
                            },
                            stroke: {
                                color: '#fff',
                                width: 2
                            },
                            startAngle: 2,

                        }
                    },
                    legend: {
                        show: true,
                        position: position || "ne",
                        labelBoxBorderColor: null,
                        margin: [-30, 15]
                    }
  ,
                    grid: {
                        hoverable: true,
                        clickable: true
                    }
                })

                //pie chart tooltip example
                var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
                var previousPoint = null;

                placeholder.on('plothover', function (event, pos, item) {
                    if (item) {
                        if (previousPoint != item.seriesIndex) {
                            previousPoint = item.seriesIndex;
                            var tip = item.series['label'] + " : " + item.series['percent'].toFixed(2) + '%';
                            $tooltip.show().children(0).text(tip);
                        }
                        $tooltip.css({ top: pos.pageY + 10, left: pos.pageX + 10 });
                    } else {
                        $tooltip.hide();
                        previousPoint = null;
                    }

                });
            })
        },

        DrawPlotChart: function () {
            var sales_charts = $('#sales-charts').css({ 'width': '100%', 'height': '220px' });

            $.get("/Project/GetLineChartData", function (data) {
                $.plot(sales_charts,
                    data, {
                      hoverable: true,
                      shadowSize: 0,
                      series: {
                          lines: { show: true },
                          points: { show: true }
                      },
                      xaxis: {
                          tickLength: 10,
                          tickSize: 1,
                          tickFormatter: String
                      },
                      grid: {
                          backgroundColor: { colors: ["#fff", "#fff"] },
                          borderWidth: 1,
                          borderColor: '#555'
                      }
                  });
            });
        }
    };
})();