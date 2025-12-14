var viewData_form_title = "تخصیص نوبت داکتران",
    viewData_controllername_attendershift = "AttenderTimeSheetApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/AttenderApi/getpageAttenderTimeSheet`,
    viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`,
    viewData_filter_url = "";

$('#exportCSV').hide();
$('#stimul_preview').hide();
$('#readyforadd').hide();

pagetable_formkeyvalue = [1];

function initAttenderTimeSheetIndexForm() {

    $("#fromWorkDayDate").val("");
    $("#toWorkDayDate").val("");

    $(".select2").select2()
    $(".button-items").prepend(`<button type="button" onclick="attenderTimeSheetTransform()" class="btn blue_1 waves-effect"><i class="fa fa-file-import"></i>انتقال نوبت داکتران</button>`);

    fillDropDownAttenderTimeSheetForm(1);

    $("#fromWorkDayDate").inputmask();
    $("#toWorkDayDate").inputmask();

    kamaDatepicker('fromWorkDayDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toWorkDayDate', { withTime: false, position: "bottom" });



}

function fillDropDownAttenderTimeSheetForm(type) {

    let fiscalYearId = +$("#fiscalYearId").val();
    let branchId = +$("#branchId").val();
    let departmentId = +$("#departmentId").val();

    $("#tempattenderscheduleblocktimelist").html("");
    $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");

    if (type == 1)
        fill_select2(`${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/attendertimesheetgetproperties`, "fiscalYearId", true, `null/null/null/null/null/${type}/0`, false, 3, "", () => { $("#fiscalYearId").trigger("change") });

    if (type == 2 && fiscalYearId > 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/attendertimesheetgetproperties`, "branchId", true, `${fiscalYearId}/null/null/null/null/${type}/0`);


    if (type == 3 && fiscalYearId > 0 && branchId > 0)
        fill_select2(`${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/attendertimesheetgetproperties`, "departmentId", true, `${fiscalYearId}/${branchId}/null/null/null/${type}/0`);

    if (type == 4 && fiscalYearId > 0 && branchId > 0 && departmentId > 0) {

        fill_select2(`${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/attendertimesheetgetproperties`, "fromAttenderId", true, `${fiscalYearId}/${branchId}/${departmentId}/null/null/${type}/0`);

        fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getattenderlistbydepartmentids`, "toAttenderId", true, `${departmentId}`, false, 3, "", () => { $("#toAttenderId").trigger("change.select2") }, "", false, false, true);

    }

}

function run_button_attenderTimeSheetAssign(attenderId, rowNo) {

    var check = controller_check_authorize(viewData_controllername_attendershift, "INS");
    if (!check)
        return;

    let attenderName = $(`#row${rowNo}`).data("fullname");
    let department = $(`#row${rowNo}`).data("department");

    let departmentId = +department.split('-')[0];
    let departmentName = department.split('-')[1].replaceAll("/", "-");

    navigation_item_click(`/MC/AttenderTimeSheetLine/${attenderId}/${attenderName}/${departmentId}/${departmentName}`, viewData_form_title);
}

function resetAttenderTimeSheetTransform() {

    $("#departmentId").val("").trigger("change");
    $("#fromAttenderId").val("").trigger("change");
    $("#fiscalYearId").val("").trigger("change");
    $("#branchId").val("").trigger("change");
    $("#toAttenderId").val("").trigger("change");

}

function attenderTimeSheetTransform() {
    var check = controller_check_authorize(viewData_controllername_attendershift, "INS");
    if (!check)
        return;

    resetAttenderTimeSheetTransform();
    modal_show(`AttenderTimeSheetTransformModal`);
}

$("#fiscalYearId").on("change", function () {

    var fiscalYearId = +$(this).val() == 0 ? null : +$(this).val();
    $("#branchId").empty();
    $("#departmentId").empty();
    $("#toAttenderId").empty();
    $("#fromAttenderId").empty();

    fillDropDownAttenderTimeSheetForm(2);

    if (fiscalYearId != null) {


        let selectYear = +$("#fiscalYearId").select2('data')[0].text.split("-")[1].split(" ")[3];
        let currentYear = +moment().format('jYYYY/jMM/jDD').split('/')[0];
        let currentMonth = +moment().format('jYYYY/jMM/jDD').split('/')[1];
        if (selectYear == currentYear) {

            let lastDay = getMonthDaysCount(selectYear, currentMonth + 2);

            $("#fromWorkDayDate").val(moment().format("jYYYY/jMM/jDD"));
            $("#toWorkDayDate").val(moment().format(`${selectYear}/jMM/${lastDay}`));


        }
        else {
            var viewData_fiscalYearGetReccord = `${viewData_baseUrl_GN}/FiscalYearApi/getdaterange`;
            $.ajax({
                url: viewData_fiscalYearGetReccord,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(+$("#fiscalYearId").val()),
                success: function (result) {

                    var fiscalStartDate = result.startDatePersian;
                    var fiscalEndDate = result.endDatePersian;
                    $("#fromWorkDayDate").val(fiscalStartDate);
                    $("#toWorkDayDate").val(fiscalEndDate);
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_fiscalYearGetReccord);
                    return "";
                }
            });
        }

    }
    else {

        $("#fromWorkDayDate").val(moment().format("jYYYY/jMM/01"));
        $("#toWorkDayDate").val(moment().format("jYYYY/jMM/jDD"));
    }

})

$("#branchId").on("change", function () {

    $("#departmentId").empty();
    $("#fromAttenderId").empty();

    fillDropDownAttenderTimeSheetForm(3);
})

$("#departmentId").on("change", function () {

    $("#fromAttenderId").empty();
    $("#toAttenderId").empty();
    fillDropDownAttenderTimeSheetForm(4);
})

$("#fromAttenderId").on("change", function () {

    $("#tempattenderscheduleblocktimelist").html("");
    $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");

    let fromAttenderId = +$(this).val();

    if (fromAttenderId > 0)

        getAttenderScheduleBlockTimeList();

})

function checkValidateWorkDayDate() {

    let fromWorkDayDate = $("#fromWorkDayDate").val();
    let toWorkDayDate = $("#toWorkDayDate").val();

    let isfromWorkDayDate = isValidShamsiDate(fromWorkDayDate);
    let istoWorkDayDate = isValidShamsiDate(toWorkDayDate);
    let iscompareResult = compareShamsiDate(fromWorkDayDate, toWorkDayDate);
    let iscompareShamsiDateYear = compareShamsiDateYear(fromWorkDayDate, toWorkDayDate);

    if (!isfromWorkDayDate || !istoWorkDayDate || !iscompareResult || !iscompareShamsiDateYear)
        return false;
    else
        return true;
}

function getAttenderScheduleBlockTimeList() {
    let fromAttenderId = $("#fromAttenderId").val();
    if (fromAttenderId > 0) {
        let ischeckValidateWorkDay = checkValidateWorkDayDate();

        if (!ischeckValidateWorkDay) {
            $("#tempattenderscheduleblocktimelist").html("");
            $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");
            return;
        }
        else {


            let fromCreateDate = moment.from($("#fromWorkDayDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
            let toCreateDate = moment.from($("#toWorkDayDate").val(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
            formType = "attenderTimeSheetTransform";
            attenderTimesheetCurrent = {
                attenderTimeSheetIds: null,
                medicalShiftTimeSheetIds: null,
                standardTimeSheetIds: null,
                departmentTimeShiftIds: null,
                attenderId: fromAttenderId,
                fiscalYearId: +$("#fiscalYearId").val(),
                branchId: +$("#branchId").val(),
                dayInWeek: null,
                hasPatient: null,
                fromAppointmentDate: fromCreateDate,
                toAppointmentDate: toCreateDate,
                departmentId: +$("#departmentId").val(),
                fromTime: null
            }

            displayAssignAttenderTimesheetLine(0);

        }
    }

}


function showAssignList(result) {

    if (attenderTimesheetCurrent.hasPatient == 1) {
        if (result.data.length > 0) {
            let str = `<div class=" d-flex justify-content-start">
                     <h4 class="font-16 my-2"><span class="text-gray">داکتر: </span><span>${viewData_form_title}</span></h4>
            </div>  `;
            $(".modal-content #content").html(str);

            var msg = alertify.error("داکتر مقصد دارای نوبت است مجاز به تغییر نمی باشید");
            msg.delay(alertify_delay);

            $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");
            modal_show(`attenderTimesheetLineAssignModals`);
        }
        else
            run_button_insert_AttenderTimeSheetTransform();
    }
    else
        if (result.data.length > 0)
            $("#attenderscheduleblocktimelistfieldset").removeClass("displaynone");
}




$("#attenderTimesheetLineAssignModals").on("hidden.bs.modal", function () {


    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["myadm", 0];
    else
        pagetable_formkeyvalue = ["alladm", 0];



    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: null,
        attenderId: null,
        fiscalYearId: null,
        branchId: null,
        dayInWeek: null,
        hasPatient: null,
        fromAppointmentDate: null,
        toAppointmentDate: null,
        departmentId: null,
        fromTime: null
    }


    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "attenderTimesheetLineAssign_pagetable");
    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []
    }

})

$("#insertAttenderTimeSheetTransform").click(function () {
    var validate = validateAttenderTimeSheetTransform();
    if (!validate) return;



    attenderTimesheetCurrent = {
        attenderTimeSheetIds: null,
        medicalShiftTimeSheetIds: null,
        standardTimeSheetIds: null,
        departmentTimeShiftIds: null,
        attenderId: $("#toAttenderId").val().toString(),
        fiscalYearId: +$("#fiscalYearId").val(),
        branchId: +$("#branchId").val(),
        dayInWeek: null,
        hasPatient: 1,
        fromAppointmentDate: convertToMiladiDate($("#fromWorkDayDate").val()),
        toAppointmentDate: convertToMiladiDate($("#toWorkDayDate").val()),
        departmentId: +$("#departmentId").val(),
        fromTime: null
    }


    displayAssignAttenderTimesheetLine(0);


})


function validateAttenderTimeSheetTransform() {
    let result = true;
    if ($("#fiscalYearId").val() == "" || $("#fiscalYearId").val() == null) {
        var msg = alertify.error("سال مالی را انتخاب نمایید");
        msg.delay(alertify_delay);
        result = false;
    }
    else if ($("#branchId").val() == "" || $("#branchId").val() == null) {
        var msg = alertify.error("شعبه را انتخاب نمایید");
        msg.delay(alertify_delay);
        result = false;
    }
    else if ($("#departmentId").val() == "" || $("#departmentId").val() == null) {
        var msg = alertify.error("دپارتمان را انتخاب نمایید");
        msg.delay(alertify_delay);
        result = false;
    }

    else if ($("#fromAttenderId").val() == "" || $("#fromAttenderId").val() == null) {
        var msg = alertify.error("داکتر مبدا را انتخاب نمایید");
        msg.delay(alertify_delay);
        result = false;
    }

    else if ($("#toAttenderId").val().toString() == "") {
        var msg = alertify.error("داکتر مقصد را انتخاب نمایید");
        msg.delay(alertify_delay);
        result = false;
    }

    else if (+$("#fromAttenderId").val() > 0 && $("#toAttenderId").val().toString() != "") {
        var ischeck = checkattenderchnage(+$("#fromAttenderId").val(), $("#toAttenderId").val().toString());
        if (!ischeck) {
            var msg = alertify.error("داکتر مبدا و مقصد نمیتواند یکسان باشد");
            msg.delay(alertify_delay);
            result = false;
        }

    }
    return result;

}

function run_button_insert_AttenderTimeSheetTransform() {
    
    if (+$("#fiscalYearId").val() != 0) {

        documentDateValidAttenderTimeSheetTransform(function (res) {

            if (res) {
                var model = {
                    fiscalYearId: +$("#fiscalYearId").val(),
                    branchId: +$("#branchId").val(),
                    departmentId: +$("#departmentId").val(),
                    fromAttenderId: +$("#fromAttenderId").val(),
                    toAttenderIds: $("#toAttenderId").val().toString(),
                    fromWorkDayDatePersian: $("#fromWorkDayDate").val(),
                    toWorkDayDatePersian: $("#toWorkDayDate").val(),
                    type: 1,

                }

                var url = `${viewData_baseUrl_MC}/AttenderTimeSheetLineApi/insertduplicate`;

                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "JSON",
                    contentType: "application/json",
                    cache: false,
                    async: false,
                    data: JSON.stringify(model),
                    success: function (result) {

                        switch (result.status) {

                            case 100:
                                alertify.success(result.statusMessage).delay(7);
                                modal_close("AttenderTimeSheetTransformModal");
                                get_NewPageTableV1();
                                break;

                            case 101:
                                alertify.warning(result.statusMessage).delay(7);
                                modal_close("AttenderTimeSheetTransformModal");
                                get_NewPageTableV1();
                                break;

                            case 102:
                                alertify.warning(result.statusMessage).delay(7);
                                generateErrorValidation(result.validationErrors);
                                modal_close("AttenderTimeSheetTransformModal");
                                get_NewPageTableV1();
                                break;

                            case -100:
                            case -103:
                                generateErrorValidation(result.validationErrors);
                                break;

                            case -101:
                            case -104:
                                alertify.error(result.statusMessage).delay(7);
                                break;

                            case -102:
                                alertify.error(result.statusMessage).delay(7);
                                if (result.data.length > 0)
                                    showErrorAttenderTimeSheet(result.data);
                                break;

                        }



                    },
                    error: function (xhr) {
                        error_handler(xhr, url);
                        return "";
                    }
                });
            }
            else {
                var msg = alertify.error('بازه تاریخ سند در محدوده سال مالی نمی باشد');
                msg.delay(alertify_delay);
                return;
            }
        })
    }
}

function showErrorAttenderTimeSheet(data) {

    let output = "";

    for (var i = 0; i < data.length; i++) {
        output += `<tr>
                    <td class="col-width-percent-15">${data[i].attenderId} - ${data[i].attenderFullName}</td>                  
                    <td class="col-width-percent-12">${data[i].patientIdCentral}</td>
                    <td class="col-width-percent-10">${data[i].patientId} - ${data[i].patientFullName}</td>
                    <td class="col-width-percent-8">${data[i].patientNationalCode}</td>
                    <td class="col-width-percent-11">${data[i].admissionIdCentral}</td>
                    <td class="col-width-percent-7">${data[i].admissionId}</td>
                    <td class="col-width-percent-12">${data[i].reserveDateTimeCentralPersian}</td>
                    <td class="col-width-percent-7">${data[i].reserveDateTimePersian}</td>
                    <td class="col-width-percent-20">${data[i].attenderScheduleBlockId}</td>
                   </tr>`;
    }

    $(`#tempErrorAttenderTimeSheet`).html(output);
    modal_show("errorAttenderTimeSheet");
}

function documentDateValidAttenderTimeSheetTransform(callBack = undefined) {

    $.ajax({
        url: viewData_fiscalYearGetReccord,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+$("#fiscalYearId").val()),
        success: function (result) {

            var fiscalStartDate = +result.startDatePersian.replace(/\//g, "");
            var fiscalEndDate = +result.endDatePersian.replace(/\//g, "");
            var fromDocumentDate = +$("#fromWorkDayDate").val().replace(/\//g, "");
            var toDocumentDate = +$("#toWorkDayDate").val().replace(/\//g, "");

            if ((fromDocumentDate <= fiscalEndDate && fromDocumentDate >= fiscalStartDate) && (toDocumentDate <= fiscalEndDate && toDocumentDate >= fiscalStartDate))
                result = true;
            else
                result = false;
            if (typeof callBack == "function")
                callBack(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_fiscalYearGetReccord);
            return "";
        }
    });

}

function checkattenderchnage(fromAttender, toAttender) {

    var resultcheck = true;
    var toAttenderIds = toAttender.split(',');

    for (var i = 0; i < toAttenderIds.length; i++) {
        if (toAttenderIds[i] == fromAttender)
            resultcheck = false;

    }
    return resultcheck;
}

get_NewPageTableV1();

initAttenderTimeSheetIndexForm();

window.Parsley._validatorRegistry.validators.comparedate = undefined;
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var iscompareResult = compareShamsiDate(value, value2);

        if (!iscompareResult) {
            $("#tempattenderscheduleblocktimelist").html("");
            $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");
        }

        return iscompareResult


    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

window.Parsley._validatorRegistry.validators.compareshamsidateyear = undefined;
window.Parsley.addValidator('compareshamsidateyear', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();
        if (value !== "" && value2 !== "" && requirement !== "") {
            let iscompareShamsiDateYear = compareShamsiDateYear(value, value2);
            if (!iscompareShamsiDateYear) {
                $("#tempattenderscheduleblocktimelist").html("");
                $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");
            }

            return iscompareShamsiDateYear
        }
        else
            return true;
    },
    messages: {
        en: 'تاریخ شروع و پایان باید در یک سال باشند.',
    }
});

window.Parsley._validatorRegistry.validators.shamsidate = undefined
window.Parsley.addValidator('shamsidate', {
    validateString: function (value) {
        if (+value !== 0) {

            let validShamsiDate = isValidShamsiDate(value);
            if (!validShamsiDate) {
                $("#tempattenderscheduleblocktimelist").html("");
                $("#attenderscheduleblocktimelistfieldset").addClass("displaynone");
            }

            return validShamsiDate
        }
        else return true;
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});


$("#fromWorkDayDate").on("keydown", function (e) {

    if ([KeyCode.Enter].indexOf(e.keyCode) < 0) return;

    var valThis = $(this).val(), elmAfter;

    if ($(this).hasClass("persian-date") || $(this).hasClass("persian-datepicker")) {

        if ($(this).hasClass("persian-datepicker"))
            elmAfter = $(this).parent().parent().parent().next().find("input");
        else if ($(this).hasClass("persian-date"))
            elmAfter = $(this).parent().next().find("input");

        if (elmAfter.hasClass("persian-date") || elmAfter.hasClass("persian-datepicker"))
            elmAfter.val(valThis);

    }
    else if ($(this).hasClass("double-input")) {

        elmAfter = $(this).next();
        if (elmAfter.hasClass("double-input"))
            elmAfter.val(valThis);
    }
    else if ($(this).hasClass("double-inputsearch")) {

        elmAfter = $(this).parent().next().next().find("input");
        if (elmAfter.hasClass("double-inputsearch"))
            elmAfter.val(valThis);
    }

    if (e.keyCode === KeyCode.Enter)
        getAttenderScheduleBlockTimeList();
});

$("#toWorkDayDate").on("keydown", function (e) {

    if (e.keyCode === KeyCode.Enter)

        getAttenderScheduleBlockTimeList();
});