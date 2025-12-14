/*
 Template Name: Stexo - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesdesign
 Website: www.themesdesign.in
 File: Chart js 
 */

!function ($) {
    "use strict";

    var ChartJs = function () { };

    ChartJs.prototype.respChart = function (selector, type, data, options) {
        // get selector by context
        var ctx = selector.get(0).getContext("2d");
        // pointing parent container to make chart js inherit its width
        var container = $(selector).parent();

        // enable resizing matter
        $(window).resize(generateChart);

        // this function produce the responsive Chart JS
        function generateChart() {
            // make chart width fit with its container
            var ww = selector.attr('width', $(container).width());
            switch (type) {
                case 'Bar':
                    new Chart(ctx, { type: 'bar', data: data, options: options });
                    break; break;
            }
            // Initiate new chart or Redraw

        };
        // run function - render chart at first load
        generateChart();
    },
        //init
        ChartJs.prototype.init = function () {
            //barchart\
            //Today barchart\
            var barTodayChart = {
                labels: ["طب کار", "تزریقات", "رادیولوژی", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar", "February", "March", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar"],
                datasets: [
                    {
                        label: "دریافتی",
                        backgroundColor: "rgba(2, 197, 141, 0.4)",
                        borderColor: "#02c58d",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(2, 197, 141, 0.5)",
                        hoverBorderColor: "#02c58d",
                        data: [1000000, 5435000, 3500000, 1100000, 48500000, 8000000, 500000, 32000000, 18200000, 12450000, 40000000, 500000, 6000000, 7000000, 800000, 900000, 1000000, 6300000, 8300000, 16530000, 5760000, 7800000, 15000000, 20300000, 25000000, 30000000, 40000000, 50000000, 600000, 17000000, 8000000, 9000000, 10000000]
                    }
                ]
            };

            var barTodayOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 50000000,
                            min: 0,
                            stepSize: 5000000
                        }
                    }]
                }
            };

            this.respChart($("#barToday"), 'Bar', barTodayChart, barTodayOpts);

            //Yeaterday barchart\

            var barYesterdayChart = {
                labels: ["طب کار", "تزریقات", "رادیولوژی", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar", "February", "March", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        backgroundColor: "rgba(2, 197, 141, 0.4)",
                        borderColor: "#02c58d",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(2, 197, 141, 0.5)",
                        hoverBorderColor: "#02c58d",
                        data: [55, 63, 83, 65, 76, 80, 50, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 63, 83, 65, 76, 80, 50, 23, 25, 30, 40, 50, 60, 70, 80, 90, 100]
                    }
                ]
            };

            var barYesterdayOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10
                        }
                    }]
                }
            };

            this.respChart($("#barYesterday"), 'Bar', barYesterdayChart, barYesterdayOpts);

            //Last Week barchart\

            var barLastweekChart = {
                labels: ["طب کار", "تزریقات", "رادیولوژی", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar", "February", "March", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        backgroundColor: "rgba(2, 197, 141, 0.4)",
                        borderColor: "#02c58d",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(2, 197, 141, 0.5)",
                        hoverBorderColor: "#02c58d",
                        data: [55, 63, 83, 65, 76, 80, 50, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 63, 83, 65, 76, 80, 50, 23, 25, 30, 40, 50, 60, 70, 80, 90, 100]
                    }
                ]
            };

            var barLastweekOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10
                        }
                    }]
                }
            };

            this.respChart($("#barlastweek"), 'Bar', barLastweekChart, barLastweekOpts);

            //Last Month barchart\

            var barLastmonthChart = {
                labels: ["طب کار", "تزریقات", "رادیولوژی", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar", "February", "March", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        backgroundColor: "rgba(2, 197, 141, 0.4)",
                        borderColor: "#02c58d",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(2, 197, 141, 0.5)",
                        hoverBorderColor: "#02c58d",
                        data: [55, 63, 83, 65, 76, 80, 50, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 63, 83, 65, 76, 80, 50, 23, 25, 30, 40, 50, 60, 70, 80, 90, 100]
                    }
                ]
            };

            var barLastmonthOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10
                        }
                    }]
                }
            };

            this.respChart($("#barLastmonth"), 'Bar', barLastmonthChart, barLastmonthOpts);

            //Last Year barchart\

            var barLastyearChart = {
                labels: ["طب کار", "تزریقات", "رادیولوژی", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar", "February", "March", "April", "May", "June", "July", "Jun", "Esfand", "Tir", "Mordad", "Mehr", "Aban", "Azar"],
                datasets: [
                    {
                        label: "Sales Analytics",
                        backgroundColor: "rgba(2, 197, 141, 0.4)",
                        borderColor: "#02c58d",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(2, 197, 141, 0.5)",
                        hoverBorderColor: "#02c58d",
                        data: [55, 63, 83, 65, 76, 80, 50, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 63, 83, 65, 76, 80, 50, 23, 25, 30, 40, 50, 60, 70, 80, 90, 100]
                    }
                ]
            };

            var barLastyearOpts = {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 100,
                            min: 20,
                            stepSize: 10
                        }
                    }]
                }
            };

            this.respChart($("#barLastyear"), 'Bar', barLastyearChart, barLastyearOpts);

            //End barchart\
        },
        $.ChartJs = new ChartJs, $.ChartJs.Constructor = ChartJs

}(window.jQuery),

    //initializing
    $(document).ready(function () {
        "use strict";
        $.ChartJs.init();
    });
