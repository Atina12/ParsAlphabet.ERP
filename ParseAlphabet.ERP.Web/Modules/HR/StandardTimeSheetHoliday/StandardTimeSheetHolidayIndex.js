var stopMultipleClickOnBtn = true,
    lastItemClickForDay = [0, 0],
    saveMonth = "",
    checkRefreshList = false;

function initStandardTimeShitHolyday() {
    $("#startMonth").select2()
    $("#endMonth").select2()
}

function getMonth() {
    
    let url = `${viewData_baseUrl_PB}/PublicApi/monthgetdropdown/null`
    $.ajax({
        url: url,
        type: "get",
        cache: false,
        success: function (result) {
            setInputForTransit(result)
            setMonth(result).then(firstMonthId => {
                $(`#showMonth #month_${firstMonthId}`).click()
            })
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function setInputForTransit(month) {
    saveMonth = month
    let strMonth = ""

    for (let i = 0; i < month.length; i++) {
        let currentMonth = month[i]
        strMonth += `<option value="${currentMonth.id}">${currentMonth.text}</option>`
    }

    $("#startMonth").html(strMonth)
    $("#startMonth").trigger("change")
}

async function setMonth(month) {
    $("#showMonth").html("")
    let strMonth = "<ul class='d-flex w-100'>"
    let monthLength = month.length
    let setFirstId = ""
    for (let i = 0; i < monthLength; i++) {
        let currentMonth = month[i]
        if (i == 0) {
            setFirstId = currentMonth.id
        }
        strMonth += `<li >
                        <button type="button" id="month_${currentMonth.id}" onclick="getDays(${currentMonth.id},this)" style="width:95%" class="btn btn-light waves-effect waves-light">${currentMonth.name}</button>
                     </li>`
    }
    strMonth += "</ul>"
    $("#showMonth").html(strMonth)
    return setFirstId
}

function getDays(month, elm, setMonthStyleForDays = false) {


    if (!stopMultipleClickOnBtn)
        return

    lastItemClickForDay = [0, 0]
   
    if (!setMonthStyleForDays) {
        if ($(elm).hasClass("btn-success"))
            return;

        $('#showMonth button').removeClass("btn-success");
        $(elm).addClass("btn-success");
    }

    apiGetDays(month)
}

function apiGetDays(month) {

    let lineId = $("#modal_keyid_value_personnelCalendar").text()

    if (stopMultipleClickOnBtn) {
        stopMultipleClickOnBtn = false
        loaderOnPageTable(true, "showDays")
        let url = `${viewData_baseUrl_HR}/StandardTimeSheetHolidayApi/gettimesheetholidays/${lineId}/${month}`
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            cache: false,
            async: true,
            success: function (result) {
                setDays(result)
                stopMultipleClickOnBtn = true
            },
            error: function (xhr) {
                stopMultipleClickOnBtn = true
                loaderOnPageTable(false, "showDays")
                error_handler(xhr, url)
            }
        });
    }
}

function setDays(days) {

    $("#showDaysWeekLine").html("")
    let monthLenth = days.length
    let strDays = ""

    $("#fiscalYear").text(days[0].fiscalYear)

    for (let i = -1; i < monthLenth; i++) {

        let day = days[i]

        if (i == -1) {
            let startDayWeek = days[i + 1].dayOfWeek
            for (let j = 0; j < startDayWeek; j++) {
                strDays += `<li class="d-flex align-items-center justify-content-center" style="width: 14.28%;visibility:hidden; text-align: center;height:30px"></li>`
            }
        }
        else {

            var shiftCount = `<span id="showShiftId_${i + 1}" style="font-size:12px;color:#30419b" class="${day.medicalShiftCount != 0 ? '' : 'd-none'}"> - ${day.medicalShiftCount != 0 ? `شیفت : (${day.medicalShiftCount})` : ""}</span>`

            strDays += `<li class="d-flex align-items-center justify-content-center showDaysWeekLineLiExist">
                            <div id="days_${i + 1}" selectprop="false" isholiday="${day.isHoliday}" dayOfWeek="${day.dayOfWeek}" fiscalyear="${day.fiscalYear}" propdayid="${day.id == null ? 0 : day.id}" 
                                        class="newtooltip w-100 d-flex flex-column justify-content-center showDaysWeekLineLiExistFirstDiv"
                                        onclick="setHoliDay(this,'${+day.dayId}','${day.monthId}','${day.fiscalYear}',${day.dayOfWeek})">

                                <div id="isHoliday_${i + 1}" class="isHoliday" style="background-color:${day.isHoliday ? "rgba(255, 0, 0,0.2)" : "unset"}"></div>                                   
                                <div class="d-flex justify-content-between align-items-center">
                                    <div id="dayId_${i + 1}" style="width:100%">
                                        <span>${day.dayId}</span>
                                        ${shiftCount}
                                    </div>
                                    <span class="dayClicked"><i id="selectDay_${i + 1}" class="fas fa-check" style="color:white"></i></span>
                                </div>
                                <div class="newtooltiptext">
                                    <div id="createUser_${i + 1}" style="overflow: hidden;white-space: nowrap;">${day.createUser == null ? "" : day.createUser}</div>
                                    <div id="createDateTimePersian_${i + 1}">${day.createDateTimePersian == null ? "" : day.createDateTimePersian}</div>
                                </div>    
                            </div>
                        </li>`
        }
    }

    $("#showDaysWeekLine").html(strDays)
    loaderOnPageTable(false, "showDays")
    $(".newtooltip").hover(function () {
        let id = $(this).prop("id")
        let isHolidayCheck = $(this).attr("isholiday")
        if (isHolidayCheck == "true")
            $(`#${id} .newtooltiptext`).css("visibility", "visible")
    }, function () {
        let id = $(this).prop("id")
        $(`#${id} .newtooltiptext`).css("visibility", "hidden")
    });
}

function setHoliDay(elm, dayId, monthId, fiscalYear) {

    let id = +$(elm).attr("propdayid")
    let isHoliday = $(elm).attr("isholiday")

    let workDayDate = makeFullYear(fiscalYear, monthId, dayId);


    resultSetHoliDay(elm, id, dayId, monthId, fiscalYear, workDayDate, isHoliday)
        .then(result => {
            if (lastItemClickForDay[0] == dayId && lastItemClickForDay[1] == monthId)
                return;

            lastItemClickForDay = [dayId, monthId]
           
        })
}

async function resultSetHoliDay(elm, id, dayId, monthId, fiscalYear, workDayDate, isHoliday) {

    let headerId = +$("#modal_keyid_value_personnelCalendar").text()
    let elementId = $(elm).attr("id")

    let model = {
        id,
        headerId,
        monthId,
        dayId,
        holidayDatePersian: workDayDate,
    }

    if (stopMultipleClickOnBtn) {
        stopMultipleClickOnBtn = false

        let url = `${viewData_baseUrl_HR}/StandardTimeSheetHolidayApi/savestandardtimesheetholiday`


        await $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(model),
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success: function (result) {

                stopMultipleClickOnBtn = true;

                if (result.successfull) {

                    let isHoliday = $(elm).attr("isholiday")

                    $(elm).attr("propdayid", +$(elm).attr("propdayid") != 0 ? 0 : result.id)

                    $(elm).attr("isholiday", !(isHoliday == 'true'))

                    if (isHoliday == 'true') {
                        $(`#isHoliday_${+dayId}`).css("background-color", "rgba(255, 255, 255,0.2) !important")
                        $(`#createUser_${+dayId}`).text("")
                        $(`#createDateTimePersian_${+dayId}`).text("")
                    }
                    else {
                        $(`#isHoliday_${+dayId}`).css("background-color", "rgba(255, 0, 0,0.2) !important")
                        $(`#createUser_${+dayId}`).text(`${result.userId} - ${result.createUserFullName}`)
                        $(`#createDateTimePersian_${+dayId}`).text(result.dateTimePersian)
                    }

                    $(`#${elementId} .newtooltiptext`).css("visibility", "hidden")

                }
                else {
                    var msg = alertify.warning(result.statusMessage);
                    msg.delay(alertify_delay);
                }

            },
            error: function (xhr) {
                stopMultipleClickOnBtn = true
                error_handler(xhr, url)
            }
        });
    }
}

function makeFullYear(year, month, day) {
    let fullYear = `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
    return fullYear;
}


function copyMonth() {

    let monthId = $("#startMonth").val().padStart(2, "0")
    let monthDestination = $("#endMonth").val().padStart(2, "0")
    let yearId = +$("#fiscalYear").text()

    if (monthId == monthDestination) {
        var msg = alertify.warning("ماه مبدا و مقصد نمی تواند یکی باشد");
        msg.delay(alertify_delay);
        return
    }


    let timeSheetId = +$("#modal_keyid_value_personnelCalendar").text()
    let model = {
        FromTimeSheetId: timeSheetId,
        FromMonthId: monthId,
        ToTimeSheetId: timeSheetId,
        ToMonthId: monthDestination,
        type: 1,
    }

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetApi/duplicate`
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                getMonth()
            }
            else {
                var msg = alertify.warning(result.statusMessage);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

$("#AddEditModalPersonnelCalendar").on("show.bs.modal", function () {
    $("#yearOfCelender").text(saveYearRowForLine.split("-")[1])
    getMonth()
});

$("#AddEditModalPersonnelCalendar").on("hidden.bs.modal", function () {
    $("#showMonth").html("")
    $("#showDaysWeekLine").html("")
    $("#startMonth").html("")
    $("#endMonth").html("")
    saveYearRowForLine = ""
    saveMonth = ""
    attenderStandardTimeSheet = ""
    departmentIdLine = ""
});



$("#startMonth").on("change", function () {

    let monthId = $(this).val()
    let strMonth = ""

    if (checkResponse(monthId) && monthId != 0) {
        let newListOfMonth = saveMonth.filter(item => item.id != monthId)

        for (let i = 0; i < newListOfMonth.length; i++) {
            let ListOfMonth = newListOfMonth[i]
            strMonth += `<option value="${ListOfMonth.id}">${ListOfMonth.text}</option>`
        }
        $("#endMonth").html(strMonth)
        $("#endMonth").trigger("change")
    }
})

initStandardTimeShitHolyday()
