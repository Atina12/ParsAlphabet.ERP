//Mr_Tag2 OverWrite
///*HIDDEN LAGENDS*/ Chart.defaults.global.legend.display = false;

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Stacked bar chart\

var dataChart = [], cashName = [], returnAmount = [], returnQty = [], salesAmount = [], salesQty = [], resChart;

(async function () {
    //Clicking barchart\

    var check = await controller_check_authorize("AdmissionApi", "VIW", false);

    if (!check) {
        $("#dailyAdmissionDashboard").addClass("d-none")
        return;
    }


    document.querySelector('#admissionHeader').addEventListener('click', async () => { await appendChart("admissionChart", 1, "adm"); });
    document.querySelector('#itemsHeader').addEventListener('click', async () => { await appendChart("itemsChart", 2, "ite"); });
    document.querySelector('#cashHeader').addEventListener('click', async () => { await appendChart("cashChart", 3, "cash"); });

    //Admission barchart\
    await appendChart("admissionChart", 1, "adm");
})();

async function getDataStackedbarchart(type) {

    var model = {
        type: +type
    }

    var url = "api/MC/AdmissionApi/chartadmission";
    var result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {
            return result.data;
        },
        error: function (xhr) {
            error_handler(xhr, url)
            return JSON.parse(null);
        }
    });

    return result;
}

async function appendChart(id, type, idNo) {

    var dataChart = [], cashName = [], returnAmount = [], returnQty = [], salesAmount = [], salesQty = [], dataChartL;

    await getDataStackedbarchart(type).then(resChart => {

        dataChart = resChart.chartList;
        dataChartL = resChart.chartList.length;
        $(`#${id}`).parent().attr("style", `height:50vh !important;min-width:${((dataChartL) / 4) * 10}em`);
        for (var i = 0; i < dataChartL; i++) {
            var dataValue = dataChart[i];
            cashName.push(dataValue.cashName);
            returnAmount.push(Math.abs(dataValue.returnAmount));
            returnQty.push(Math.abs(dataValue.returnQty));
            salesAmount.push(dataValue.salesAmount);
            salesQty.push(dataValue.salesQty);
        }
        var stackedCtx = document.getElementById(id);
        var rectangleSet = false;
        var stackedConfig = {
            type: 'bar',
            data: {
                labels: cashName,
                datasets: [
                    {
                        label: 'فروش',
                        labelqty: 'تعداد فروش',
                        data: salesAmount,
                        dataqty: salesQty,
                        backgroundColor: "#98FB98",
                        borderWidth: 1,
                        hoverBackgroundColor: "#cafcca",
                        hoverBorderWidth: 0,
                        stack: 'Stack 0',
                    },
                    {
                        label: ' مرجوع',
                        labelqty: 'تعداد مرجوع',
                        data: returnAmount,
                        dataqty: returnQty,
                        backgroundColor: "#F08080 ",
                        hoverBackgroundColor: "#f6b6b6",
                        hoverBorderWidth: 0,
                        stack: 'Stack 1',
                    },
                ]
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return `${cashName[tooltipItem.index]}  :  ` + data.datasets[tooltipItem.datasetIndex].label + "  " + transformNumbers.toComma(tooltipItem.yLabel)
                                + "  " + data.datasets[tooltipItem.datasetIndex].labelqty + "  " + data.datasets[tooltipItem.datasetIndex].dataqty[tooltipItem.index];
                        },
                        title: function () { }
                    }
                },
                scales: {

                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 10,
                            autoSkipPadding: -10000,
                            padding: 0,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                return transformNumbers.toComma(value);
                            }
                        }
                    }]
                },
                animation: {
                    onComplete: function () {
                        if (!rectangleSet) {
                            var scale = window.devicePixelRatio;

                            var sourceCanvas = stackedChart.chart.canvas;
                            var copyWidth = stackedChart.scales['y-axis-0'].width - 10;
                            var copyHeight = stackedChart.scales['y-axis-0'].height + stackedChart.scales['y-axis-0'].top + 10;

                            var targetCtx = document.getElementById(`axis_Test${idNo}`).getContext("2d");

                            targetCtx.scale(scale, scale);
                            targetCtx.canvas.width = copyWidth * scale;
                            targetCtx.canvas.height = copyHeight * scale;

                            targetCtx.canvas.style.width = `${copyWidth}px`;
                            targetCtx.canvas.style.height = `${copyHeight}px`;
                            targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

                            var sourceCtx = sourceCanvas.getContext('2d');

                            // Normalize coordinate system to use css pixels.

                            sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);
                            rectangleSet = true;
                        }
                    },
                    onProgress: function () {
                        if (rectangleSet === true) {
                            var copyWidth = stackedChart.scales['y-axis-0'].width;
                            var copyHeight = stackedChart.scales['y-axis-0'].height + stackedChart.scales['y-axis-0'].top + 10;

                            var sourceCtx = stackedChart.chart.canvas.getContext('2d');
                            sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                        }
                    }
                },
                legend: {
                    onClick: function () { },
                }
            },
        };
        var stackedChart = new Chart(stackedCtx, stackedConfig);

        setTimeout(function () {
            stackedChart.destroy();
            stackedChart = new Chart(stackedCtx, stackedConfig);
        }, 10);

    });
}

//End Stacked bar chart\
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------