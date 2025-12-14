
async function initDashbordFrom() {



    checkSummaryFundTyupe();

    //treeViewPageTable()
    //await get_wather(cityname);

   // await get_calendar('current');
}

function checkSummaryFundTyupe() {

    var check = controller_check_authorize("AdmissionCash", "VIW", false);

    if (!check) {
        $("#kpiFundTypeSummary").addClass("d-none")
        return;
    }


    fillCashSummeryUser(0, "");
}

//async function get_calendar(formatType) {


//    var pYear = 0;
//    var pMonth = 0;
//    if (formatType == "current") {
//        pYear = 0;
//        pMonth = 0;
//    }
//    else if (formatType == "before") {
//        pYear = parseInt($('#claendarHeader').attr('year-no'));
//        pMonth = parseInt($('#claendarHeader').attr('month-no')) - 1;
//        if (pMonth == 0) {
//            pYear = pYear - 1
//            pMonth = 12;
//        }
//    }
//    else if (formatType == "next") {
//        pYear = parseInt($('#claendarHeader').attr('year-no'));
//        pMonth = parseInt($('#claendarHeader').attr('month-no')) + 1;
//        if (pMonth == 13) {
//            pYear = pYear + 1
//            pMonth = 1;
//        }
//    }
//    var shamsidatetimeModel = {
//        year: pYear,
//        month: pMonth,
//    }
//    var p_url = '/api/DashboardApi/get_calendar';
//    $.ajax({
//        url: p_url,
//        type: "POST",
//        data: JSON.stringify(shamsidatetimeModel),
//        dataType: "json",
//        contentType: "application/json",
//        cache: false,
//        success: async function (result) {
//            await fill_calendar(result);
//        },
//        error: async function (xhr) {
//            await error_handler(xhr, p_url);
//        }
//    });
//}

//async function fill_calendar(item) {
//    if (item == null) return "";
//    $("#calendarinfo").html("");
//    var str = "";
//    var i;
//    var j = -1;
//    var holidayStyle = '';
//    str += '<table class="table  table-style">';
//    str += '<thead>'
//    str += '<tr id="claendarHeader" year-no="' + item.year + '" month-no="' + item.month + '">';
//    str += '<th><a href="javascript:get_calendar(`before`);" data-toggle="tooltip" data-placement="top" title="ماه قبل"><span class="fas fa-angle-right"></span></a></th>';
//    str += '<th colspan="5">' + item.monthName + ' ' + item.year + '</th>';
//    str += '<th><a href="javascript:get_calendar(`next`);" data-toggle="tooltip" data-placement="top" title="ماه بعد"><span class="fas fa-angle-left"></span></a></th>';
//    str += '</tr>';
//    str += '</thead>'
//    str += '<tr>';
//    str += '<th>ش</th>';
//    str += '<th>ی</th>';
//    str += '<th>د</th>';
//    str += '<th>س</th>';
//    str += '<th>چ</th>';
//    str += '<th>پ</th>';
//    str += '<th>ج</th>';
//    str += '</tr>';
//    str += '<tr>';
//    var k = 0;
//    var r = 0;
//    for (i = 1; i <= 42; i++) {
//        if (k < 7)
//            k++;

//        if (k == 1)
//            str += "<tr>";

//        if (i == item.firstDayOfMonthDayOfWeek)
//            j = 0;
//        if (item.monthHoliDays.includes(j + 1) == true)
//            holidayStyle = 'holiday';
//        else
//            holidayStyle = '';

//        if (j == item.day - 1 && j >= 0)
//            str += '<td class="today ' + holidayStyle + '">';
//        else
//            str += '<td class=" ' + holidayStyle + '">';

//        if (i < item.firstDayOfMonthDayOfWeek)
//            str += '';
//        else {
//            j++;
//            str += j.toString();
//            if (j >= item.monthDaysCount) {
//                break;
//            }
//        }
//        str += '</td>';
//        if (k == 7) {
//            str += "</tr>";
//            k = 0;
//            r++;
//        }
//    }
//    for (n = 1; n <= 7 - k; n++) {
//        str += '<td></td>';
//    }
//    if (r < 5) {
//        str += `<tr style="height:1px">`;
//        for (n = 1; n <= 7; n++) {
//        }
//        str += "</tr>";
//    }
//    str += '</tr>';
//    str += '</table>';
//    $("#calendarinfo").hide().append(str).fadeIn(100);

//};

function treeViewPageTable() {
    treeViewPageTableModel.push({
        treeViewId: "treeviewpage1",
        getDatApi: "",
        insertApi: "",
        updateApi: "",
        deleteApi: "",
        colExpConfig: "",
        filter: ""
    })
    getTreeViewPageTable("treeviewpage1")
}

initDashbordFrom();

//$('#btnPingGet').on('click', () => {
//    getPing()
//})