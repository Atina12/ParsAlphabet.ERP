var viewData_form_title = "لیست نسخه نویسی",
    viewData_add_form_title = "نسخه نویسی",
    viewData_display_form_title = "نمایش نسخه",
    viewData_edit_form_title = "نسخه - ویرایش",
    viewData_controllername = "PrescriptionApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_prescreptionType_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getprescriptiontypebyid`,
    viewData_sendWebService_url = `${viewData_baseUrl_MC}/${viewData_controllername}/sendwebservice`,
    viewData_getHid_url = `${viewData_baseUrl_MC}/${viewData_controllername}/gethid`,
    viewData_checkSent_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checksent`,
    viewData_checkHid_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkhid`,
    viewData_display_page_url = "/MC/Prescription/display",
    viewData_add_page_url_prescriptionForm = "/MC/Prescription/form",
    viewData_get_checkpermission_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkpermission`,

    viewData_drugPrint_file_url = `${stimulsBaseUrl.MC.Prn}PrescriptionDrug.mrt`,
    viewData_print_model = { url: "", item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "";


function initPrescriptionIndexForm() {
    pagetable_formkeyvalue = ["myPr", 0];
    $('#userType').bootstrapToggle();



    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    get_NewPageTableV1();
}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myPr", 0];
    else
        pagetable_formkeyvalue = ["allPr", 0];

    get_NewPageTableV1();

});

function prescriptionForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;
    
    //var resultMsc = getMscType();

    //if (resultMsc !== 1) {
    //    var msgMscType = alertify.warning("ثبت نسخه فقط برای داکتران امکانپذیر می باشد");
    //    msgMscType.delay(alertify_delay);
    //    return;
    //}

    if (checkPermission()) {
        var msgCheckPermission = alertify.warning("کاربری شما به ثبت نسخه تخصیص داده نشده");
        msgCheckPermission.delay(alertify_delay);
        return;
    }

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_prescriptionForm, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_prescriptionForm, "");
}

function run_button_printprescription(prescriptionId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: viewData_drugPrint_file_url,
        parameters: [
            { Item: "Id", Value: prescriptionId, SqlDbType: dbtype.Int, Size: 0 },
        ],
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');

}

function run_button_displayprescription(prescriptionId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var href = `${viewData_display_page_url}/${prescriptionId}`;
    navigateToModalDisplay(href, viewData_display_form_title);
}

function navigateToModalDisplay(href) {

    initialPage();
    $("#contentdisplayForm #content-page").addClass("displaynone");
    $("#contentdisplayForm #loader").removeClass("displaynone");
    lastpagetable_formkeyvalue = pagetable_formkeyvalue;
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayForm`).html(result);
            modal_show("displayFormModel");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayForm #loader,#contentdisplayForm #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayForm #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayForm #form,#contentdisplayForm .content").css("margin", 0);
    $("#contentdisplayForm .itemLink").css("pointer-events", " none");
}

function run_button_editprescription(prescriptionId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    //var resultMsc = getMscType();

    //if (resultMsc !== 1) {
    //    var msgMscType = alertify.warning("ثبت نسخه فقط برای داکتران امکانپذیر می باشد");
    //    msgMscType.delay(alertify_delay);
    //    return;
    //}

    var href = `${viewData_add_page_url_prescriptionForm}/${prescriptionId}`;
    navigation_item_click(href, viewData_edit_form_title);
}

async function run_button_sendtowebservice(prescriptionId, rowNo, btn){

    await addWaitingWSPAsync(btn, rowNo);

    var check = checkSent(prescriptionId);

    var checkHidResult = checkHid(prescriptionId);

    if (!checkHidResult) {
        var msgSent = alertify.warning("ابتدا شناسه شباد را دریافت نمایید");
        msgSent.delay(prMsg.delay);
        setTimeout(() => {
            removeWaitingWSPAsync(rowNo);
        }, 100);
        return;
    }

    if (check) {
        var msgSent = alertify.warning("این نسخه قبلا به سپاس ارسال شده");
        msgSent.delay(prMsg.delay);
        setTimeout(() => {
            removeWaitingWSPAsync(rowNo);
        }, 100);
        return;
    }



    $.ajax({
        url: viewData_sendWebService_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(prescriptionId),
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msgSend = alertify.success("نسخه با موفقیت ارسال شد");
                msgSend.delay(alertify_delay);
                removeWaitingWSPAsync(rowNo);
            }
            else {
                var msgSend = alertify.warning(result.statusMessage);
                msgSend.delay(alertify_delay);
                removeWaitingWSPAsync(rowNo);
            }
            get_NewPageTableV1();

        },
        error: function (xhr) {
            error_handler(xhr, viewData_sendWebService_url);
            removeWaitingWSPAsync(rowNo);
        }
    });
}

async function run_button_getHid(prescriptionId, rowNo, btn) {

    await addWaitingHIDAsync(btn, rowNo);

    var check = checkHid(prescriptionId);

    if (check) {
        var msgSent = alertify.warning("شناسه شباد دریافت شده");
        msgSent.delay(prMsg.delay);
        setTimeout(() => {
            removeWaitingHIDAsync(rowNo);
        }, 100);
        return;
    }

    $.ajax({
        url: viewData_getHid_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(prescriptionId),
        cache: false,
        success: function (result) {
            if (result.successfull) {
                if (result.status == 99) {
                    var msgSend = alertify.success("دریافت شناسه شباد آفلاین با موفقیت انجام شد");
                    msgSend.delay(alertify_delay);
                }
                else {
                    var msgSend = alertify.success("دریافت شناسه شباد آنلاین با موفقیت انجام شد");
                    msgSend.delay(alertify_delay);
                }

                removeWaitingHIDAsync(rowNo);
                get_NewPageTableV1();
            }
            else {
                var msgSend = alertify.warning(result.statusMessage);
                msgSend.delay(alertify_delay);
                removeWaitingHIDAsync(rowNo);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getHid_url);
            removeWaitingHIDAsync(rowNo);
        }
    });

}

function checkSent(id) {
    var output = $.ajax({
        url: viewData_checkSent_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_checkSent_url);
            return 0;
        }
    });
    return output.responseJSON;
}

function checkHid(id) {
    var output = $.ajax({
        url: viewData_checkHid_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_checkHid_url);
            return 0;
        }
    });
    return output.responseJSON;
}

async function addWaitingWSPAsync(btn, rowNo) {
    $(`#row${rowNo}`).addClass("operating-error");
}

async function removeWaitingWSPAsync(rowNo) {
    $(`#row${rowNo}`).removeClass("operating-error");
}

async function addWaitingHIDAsync(btn, rowNo) {
    $(`#row${rowNo}`).addClass("operating-success");
}

async function removeWaitingHIDAsync(rowNo) {
    $(`#row${rowNo}`).removeClass("operating-success");
}

function checkPermission() {
    var output = $.ajax({
        url: viewData_get_checkpermission_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: {},
        cache: false,
        async: false,
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_checkpermission_url);
            return false;
        }
    });

    return output.responseJSON;
}

$(document).on("keydown", function (e) {
    if ([KeyCode.Insert].indexOf(e.which) == -1) return;

    
    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        prescriptionForm();
    }

});

function modal_ready_for_add() {
    prescriptionForm();
}

initPrescriptionIndexForm();
