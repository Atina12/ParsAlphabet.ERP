

var formReplace1 = $('#formReplaceValidateForModalPatient1').parsley()
var formReplace2 = $('#formReplaceValidateForModalPatient2').parsley()

function initFormReplace() {

    //Replace


    $("#reservedListFrom .loadin-div + .row").css("display", "none")
    $("#reservedListFrom").css("display", "inline")
    $("#reservedListTo .loadin-div + .row").css("display", "none")
    $("#reservedListTo").css("display", "inline")

   
    $("#fromReserveDate1").inputmask();
    $("#toReserveDate1").inputmask();

    $("#fromReserveDate2").inputmask();
    $("#toReserveDate2").inputmask();

    inputMask();
    inboundLoadDropdownReplace();


}
function inboundLoadDropdownReplace() {

    $(".select2").select2();

    $("#attenderIdReplace,#patientIdReplaceFrom,#patientIdReplaceTo").empty()

}
function patientAttenderScheduleBlockSearch(patientId, fromReserveDateTimePersian, toReserveDateTimePersian,pagetable) {

    var attenderIdReplace = $("#attenderIdReplace").val()
    var isOnline = $("#typeOnLineReplace").val()
    if (attenderIdReplace == null || attenderIdReplace == undefined || attenderIdReplace == "") {
       
        msg_s = alertify.warning("داکتر را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#attenderIdReplace").select2("focus");
        return;
    }

    if (isOnline == null || isOnline == undefined || isOnline == "" || isOnline == 0) {
        msg_s = alertify.warning("نوبت را انتخاب کنید");
        msg_s.delay(admission.delay);

        $("#typeOnLineReplace").select2("focus");
        return;
    }
    var modelSearch = {
        attenderId: attenderIdReplace,
        patientId,
        fromReserveDateTimePersian,
        toReserveDateTimePersian,
        isOnline: +isOnline == 1 ? 1 : 0
    }

    patientReservedList_NewPagetable(pagetable, isInsert = false, callBack = undefined, modelSearch);



}

function patientReservedList_NewPagetable(pg_id = null, isInsert, callBack, modelSearch) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_pagetables[index].currentpage = 0;
    arr_pagetables[index].selectedItems = [];
    let pagetable_formkeyvalue = []
    pagetable_formkeyvalue[0] = modelSearch.attenderId;
    pagetable_formkeyvalue[1] = modelSearch.patientId;
    pagetable_formkeyvalue[2] = modelSearch.fromReserveDateTimePersian;
    pagetable_formkeyvalue[3] = modelSearch.toReserveDateTimePersian;
    pagetable_formkeyvalue[4] = modelSearch.isOnline;
    pagetable_formkeyvalue[5] = "Replace"

    arr_pagetables[index].pagetable_formkeyvalue = pagetable_formkeyvalue;
    get_NewPageTable(pg_id, isInsert, callBack);


}

async function displacementReserveReplaceDate() {

    let admissionidpagetable1 = $("#reservedListFrom .highlight").data("admissionid")
    let admissionidpagetable2 = $("#reservedListTo .highlight").data("admissionid")

    let currentdate = moment.from(getTodayPersianDate(), 'fa', 'YYYY/MM/DD').format('jYYYY/jMM/jDD');
    let reservedatepersianFrom = $("#reservedListFrom .highlight").data("reservedatepersian")
    let reservedatepersianTo = $("#reservedListFrom .highlight").data("reservedatepersian")


    if (currentdate > reservedatepersianFrom) {
        msg_s = alertify.warning("تاریخ رزرو نوبت مبدا  نمیتواند کمتر از تاریخ روز جاری باشد")
        msg_s.delay(admission.delay);
        return
    }
    if (currentdate > reservedatepersianTo) {
        msg_s = alertify.warning("تاریخ رزرو نوبت مقصد  نمیتواند کمتر از تاریخ روز جاری باشد")
        msg_s.delay(admission.delay);
        return
    }

    if (admissionidpagetable1 == null || admissionidpagetable1 == undefined || admissionidpagetable1 == "" || admissionidpagetable2 == null || admissionidpagetable2 == undefined || admissionidpagetable2 == "") {
        msg_s = alertify.warning("تاریخ رزرو نوبت مبدا یا مقصد نمی تواند خالی بماند")
        msg_s.delay(admission.delay);
        return
    }

    if ($("#reservedListFrom .highlight").data("admissionid") == $("#reservedListTo .highlight").data("admissionid")) {
        msg_s = alertify.warning("شناسه پذیرش نمی تواند یکسان باشد")
        msg_s.delay(admission.delay);
        return
    }

    let reserveTimeFrom = $("#reservedListFrom .highlight").data("reservetime")
    let reserveTimeTo = $("#reservedListTo .highlight").data("reservetime")
    let { currentDate, currentTime, currentDateTime } = await getCurrentDateTime()


    if (currentTime > reserveTimeFrom && currentdate <= reservedatepersianFrom) {
        msg_s = alertify.warning("زمان رزرو نوبت مبدا  به اتمام رسیده است")
        msg_s.delay(admission.delay);
        return
    }
    if (currentTime > reserveTimeTo && currentdate <= reservedatepersianTo) {
        msg_s = alertify.warning("زمان رزرو نوبت مقصد  به اتمام رسیده است")
        msg_s.delay(admission.delay);
        return
    }




    var model = {
        fromAdmissionId: $("#reservedListFrom .highlight").data("admissionid"),
        fromAttenderScheduleBlockId: $("#reservedListFrom .highlight").data("attenderscheduleblockid"),
        fromReserveDatePersian: reservedatepersianFrom,
        fromReserveShiftId: $("#reservedListFrom .highlight").data("reserveshiftid"),
        fromReserveNo: $("#reservedListFrom  .highlight").data("reserveno"),
        reserveTimeFrom,
        toAdmissionId: $("#reservedListTo .highlight").data("admissionid"),
        toAttenderScheduleBlockId: $("#reservedListTo .highlight").data("attenderscheduleblockid"),
        toReserveDatePersian: reservedatepersianTo,
        toReserveShiftId: $("#reservedListTo .highlight").data("reserveshiftid"),
        toReserveNo: $("#reservedListTo .highlight").data("reserveno"),
        reserveTimeTo


    }


    if (model.fromReserveShiftId == 0 || model.fromReserveNo == 0 || model.toReserveShiftId == 0 || model.toReserveNo == 0) {
        msg_s = alertify.warning("مشکلی رخ داده است دوباره تلاش کنید")
        msg_s.delay(admission.delay);
        return
    }



    let url = `${viewData_baseUrl_MC}/AdmissionApi/updatereservedatepatient`;

    let modelReplace = {
        fromAttenderScheduleBlockId: model.fromAttenderScheduleBlockId,
        toAttenderScheduleBlockId: model.toAttenderScheduleBlockId
    };

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelReplace),
        success: function (result) {

            if (result != null) {
                $("#searchReservedListFrom").click()
                $("#searchReservedListTo").click()
                msg_s = alertify.success(`جابه جایی نوبت رزرو  ${$("#reservedListFrom .highlight").data("admissionid")} ,${$("#reservedListTo .highlight").data("admissionid")} , ${result.statusMessage}`);
                msg_s.delay(admission.delay);


            }
            else {
                msg_s = alertify.success(result.statusMessage);
                msg_s.delay(admission.delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function clearAttenderScheduleBlockReplaceTab() {

    $("#attenderIdReplace").val("").trigger("change");
    $("#patientIdReplaceFrom").val("").trigger("change");
    $("#patientIdReplaceTo").val("").trigger("change");
    $("#typeOnLineReplace").val("0").trigger("change");

    $("#reservedListFrom #parentPageTableBody tbody").html("")
    $("#reservedListTo #parentPageTableBody tbody").html("")

    $("#reservedListFrom #firstRow").html(0)
    $("#reservedListFrom #lastRow").html(0)
    $("#reservedListFrom #currentPage").html(0)
    $("#reservedListFrom #dropCounteresPageTableName").html("")
    $("#reservedListFrom #dropCounteresPageTable").html("")

    $("#reservedListTo #firstRow").html(0)
    $("#reservedListTo #lastRow").html(0)
    $("#reservedListTo #currentPage").html(0)
    $("#reservedListTo #dropCounteresPageTableName").html("")
    $("#reservedListTo #dropCounteresPageTable").html("")

    $("#attenderScheduleBlockReplaceTab").addClass('active');
    $("#attenderScheduleBlockReplace").addClass('active');

    $("#fromReserveDate1").val(moment().format('jYYYY/jMM/jDD'));
    $("#toReserveDate1").val(moment().format('jYYYY/jMM/jDD'));
   
    $("#fromReserveDate2").val(moment().format('jYYYY/jMM/jDD'));
    $("#toReserveDate2").val(moment().format('jYYYY/jMM/jDD'));
    

}


$("#attenderIdReplace").on("change", function () {
    $("#reservedListFrom tbody").html(``)
    $("#reservedListFrom tbody").html(`<tr id="emptyRow"><td colspan="8" style="text-align:center">سطری وجود ندارد</td></tr>`)
    $("#reservedListTo tbody").html(``)
    $("#reservedListTo tbody").html(`<tr id="emptyRow"><td colspan="8" style="text-align:center">سطری وجود ندارد</td></tr>`)
})

$("#searchReservedListFrom").on("click", function () {

    var validate1 = formReplace1.validate();
    validateSelect2(formReplace1);
    if (!validate1) return;

    var patientId = $("#patientIdReplaceFrom").val() == "" ? null : $("#patientIdReplaceFrom").val()
    var fromReserveDateTimePersian1 = $("#fromReserveDate1").val()
    var toReserveDateTimePersian1 = $("#toReserveDate1").val()
    
    var reservedListFrom = {
        pagetable_id: "reservedListFrom",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`,
        getfilter_url: ``,
        lastPageloaded: 0,
        selectedItems: []
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == reservedListFrom.pagetable_id);
    if (index == -1) {
        arr_pagetables.push(reservedListFrom);
    } else {
        arr_pagetables[index].pagetable_id = "reservedListFrom"
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].endData = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0
    }


    patientAttenderScheduleBlockSearch(patientId, fromReserveDateTimePersian1, toReserveDateTimePersian1, reservedListFrom.pagetable_id);
})

$("#searchReservedListTo").on("click", function () {
    var validate2 = formReplace2.validate();
    validateSelect2(formReplace2);
    if (!validate2) return;

    var patientId = $("#patientIdReplaceTo").val() == "" ? null : $("#patientIdReplaceTo").val()
    var fromReserveDateTimePersian2 = $("#fromReserveDate2").val()
    var toReserveDateTimePersian2 = $("#toReserveDate2").val()
  
    var reservedListTo = {
        pagetable_id: "reservedListTo",
        editable: false,
        pagerowscount: 15,
        endData: false,
        pageNo: 0,
        currentpage: 1,
        currentrow: 1,
        currentcol: 0,
        highlightrowid: 0,
        trediting: false,
        pagetablefilter: false,
        filteritem: "",
        filtervalue: "",
        getpagetable_url: `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`,
        getfilter_url: ``,
        lastPageloaded: 0,
        selectedItems: []
    };

    let index = arr_pagetables.findIndex(v => v.pagetable_id == reservedListTo.pagetable_id);

    if (index == -1) {
        arr_pagetables.push(reservedListTo);
    } else {
        arr_pagetables[index].pagetable_id = "reservedListTo"
        arr_pagetables[index].editable = false
        arr_pagetables[index].pagerowscount = 15
        arr_pagetables[index].endData = false
        arr_pagetables[index].pageNo = 0
        arr_pagetables[index].currentpage = 1
        arr_pagetables[index].currentrow = 1
        arr_pagetables[index].currentcol = 0
        arr_pagetables[index].highlightrowid = 0
        arr_pagetables[index].trediting = false
        arr_pagetables[index].pagetablefilter = false
        arr_pagetables[index].filteritem = ""
        arr_pagetables[index].filtervalue = ""
        arr_pagetables[index].getpagetable_url = `${viewData_baseUrl_MC}/AdmissionApi/patientreservedlist`
        arr_pagetables[index].selectedItems = []
        arr_pagetables[index].lastPageloaded = 0
    }

    patientAttenderScheduleBlockSearch(patientId, fromReserveDateTimePersian2, toReserveDateTimePersian2, reservedListTo.pagetable_id);
})

initFormReplace();