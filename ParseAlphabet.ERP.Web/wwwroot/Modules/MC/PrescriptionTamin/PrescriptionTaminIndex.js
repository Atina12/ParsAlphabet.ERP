var viewData_form_title = "لیست نسخه نویسی تامین",
    viewData_add_form_title = "نسخه نویسی تامین",
    viewData_display_form_title = "نمایش نسخه",
    viewData_edit_form_title = "نسخه - ویرایش",

    viewData_controllername = "PrescriptionTaminApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_display_page_url = "/MC/PrescriptionTamin/display",
    viewData_add_page_url_prescriptionForm = "/MC/PrescriptionTamin/form",
    viewData_get_PrescriptionOtpCode = `${viewData_baseUrl_MC}/requestPrescriptionTamin/getrequestprescription`,
    viewData_get_checkpermission_url = `${viewData_baseUrl_MC}/${viewData_controllername}/checkpermission`,
    viewData_print_model = { url: "", item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "";

function initPrescriptionIndexForm() {
    $('#userType').bootstrapToggle();

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);


    pagetable_formkeyvalue = ["myPr", 0];
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

function prescriptionTaminForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    //if (checkPermission()) {
    //    var msgCheckPermission = alertify.warning("کاربری شما به ثبت نسخه تخصیص داده نشده");
    //    msgCheckPermission.delay(alertify_delay);
    //    return;
    //}

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(`${viewData_add_page_url_prescriptionForm}/null`, viewData_add_form_title);
    else
        navigation_item_click(`${viewData_add_page_url_prescriptionForm}/null`, "");
}

//function run_button_editprescriptiontamin(prescriptionId, rowNo, btn) {

//    var check = controller_check_authorize(viewData_controllername, "UPD");
//    if (!check)
//        return;

//    var href = `${viewData_add_page_url_prescriptionForm}/${prescriptionId}`;
//    navigation_item_click(href, viewData_edit_form_title);
//}

function run_button_printprescriptiontamin(prescriptionId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    PrintPrescriptionTamin(prescriptionId);

}

function reportParameter(isStageClass7, id) {
    let reportParameters = []

    reportParameters = [
        { Item: `Id`, Value: id, SqlDbType: 8, Size: 0 },
    ]

    return reportParameters;
}

function PrintPrescriptionTamin(id) {

    var reportParameters = reportParameter(false, id);

    var print_file_url = `${stimulsBaseUrl.MC.Prn}PrescriptionTamin.mrt`;
    var reportModel = {
        reportUrl: print_file_url,
        parameters: reportParameters,
        reportSetting: reportSettingModel,
        reportName: viewData_form_title,
    }

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
}

function modal_show(modal_name = null) {
    if (modal_name === null)
        modal_name = modal_default_name;

    var firstRowsCountItem = $(`#${modal_name} .pagerowscount .dropdown-menu .dropdown-item:first`).text();
    $(`#${modal_name} .pagerowscount button:first`).text(firstRowsCountItem);

    $("input").attr("autocomplete", "off");

    $(`#${modal_name}`).modal({ backdrop: "static", show: true });
}

async function modal_RemoveDeleteModal(modal_name) {


    var idStr = $("#modal_keyid_value").text();
    var otpCodeStr = $("#OtpCode").val();

    if (otpCodeStr == "" || otpCodeStr == "0" || otpCodeStr == null)
        return;

    var model = {
        ids: idStr,
        otpCode: otpCodeStr

    }
    let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/deleterequestprescription`;
    await fetchManager(url, {
        method: 'POST',
        body: JSON.stringify(model),
        headers: { 'Content-Type': 'application/json' },
    }).then((result) => {

        if (result != null && result.status == 200) {
            alertify.success("حذف با موفقیت انجام شد");
            modal_close("DeleteModal");
            deleterequestprescription(+ids);
        }

        else {

            alertify.warning("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", 6);
        }
    });

}

async function deleterequestprescription(id) {

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
    await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(id),
        success: function (result) {
            if (result.successfull == true) {
                get_NewPageTableV1("pagetable");

                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
            }
            else {

                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(alertify_delay);
                }
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }


    });
}

function run_button_displayprescriptiontamin(prescriptionId, rowNo, btn) {

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

initPrescriptionIndexForm();

$(document).on("keydown", function (e) {
    if ([KeyCode.Insert].indexOf(e.which) == -1) return;


    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        prescriptionTaminForm();
    }

});


function run_button_saveAndSendToWebService(prescriptionId, rowNo, btn) {


    getResultRequestEPrescriptionTamin(prescriptionId).then(result => {

        if (result.successfull) {
            get_NewPageTableV1("pagetable");
        }
        else if (checkResponse(result.data) && result.data.length > 0) {

            $("#result_prescriptionrow").html("");
            let str = "";

            for (var ix = 0; ix < result.data.length; ix++) {
                let dataRes = result.data[ix].item2;
                let id = result.data[ix].item1;

                dataRes.problems = dataRes.validationErrors == null ? [] : dataRes.validationErrors;

                if (typeof dataRes.validationErrors !== "undefined" && dataRes.validationErrors.length == 0)
                    str += `<tr><td>${id}</td><td>${result.data[ix].item2.status}</td></tr>`
                else
                    str += `<tr><td>${result.data[ix].item1}</td><td>${result.data[ix].item2.status} | ${result.data[ix].item2.validationErrors}</td></tr>`;
            }

            get_NewPageTableV1("pagetable");

            $("#result_prescriptionrow").append(str);

            modal_show("wcf_prescriptiontamin_error_result");
        }
        else if (!result.successfull && result.status === 401) {
            var msgItem = alertify.warning(result.statusMessage);
            msgItem.delay(alertify_delay);
        }

    });
}

$("#wcfprescriptiontaminresultmodal-close").click(() => modal_close("wcf_prescriptiontamin_error_result"));

async function editRequestEPrescriptionTamin(data) {

    var model = {
        ids: data,
        otpCode: null
    }
    if (data.length > 0) {
        let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/deleterequestprescription`;
        await fetchManager(url, {
            method: 'POST',
            body: JSON.stringify(model),
            headers: { 'Content-Type': 'application/json' },
        }).then((result) => {

            if (result != null && result.status == 200) {
                if (result.data.errMessage == null || result.data.errMessage == "")
                    sendETaminPrescription(data);
                else {
                    alertify.warning(result.data.errMessage, 6);
                }
            }

            else {

                alertify.warning("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", 6);
            }
        });
    }
    else {
        loadingAsync(false, $("#sendRequestEPrescription").prop("id"));
        var msgItem = alertify.warning("موردی برای ارسال وجود ندارد");
        msgItem.delay(alertify_delay);

        return;
    }

}

async function getResultRequestEPrescriptionTamin(data) {

    let url = `${viewData_baseUrl_MC}/requestPrescriptionTamin/sendrequestprescription`;
    let response = await $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        cache: false,
        data: JSON.stringify(data),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return "";
        }


    });

    return response;
}


function run_button_deleteprescriptiontamin(p_keyvalue, rowno, elem, ev) {


    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "DeleteModal";

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    var requestPrescriptionId = +$(`#row${rowno}`).data("requesteprescriptionid");

    if (requestPrescriptionId === 0) {

        var url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;

        var deleteModel = {
            id: +p_keyvalue,
            workflowId: +$(`#row${rowno}`).data("workflowid"),
            stageId: +$(`#row${rowno}`).data("stageid"),
            admissionId: +$(`#row${rowno}`).data("admissionid"),
            admissionWorkflowId: +$(`#row${rowno}`).data("admissionworkflowid"),
            admissionStageId: +$(`#row${rowno}`).data("admissionstageid"),
        }

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(deleteModel),
            async: false,
            cache: false,
            success: function (result) {

                if (result.status == 100) {
                    get_NewPageTableV1();

                }
                else {
                    alertify.error(result.statusMessage);
                    return;
                }

            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });

        return;
    }


    var model = { id: p_keyvalue, opr: "DEL" };

    $.ajax({
        url: viewData_get_PrescriptionOtpCode,
        type: "get",
        dataType: "",
        contentType: "application/json",
        data: model,
        async: false,
        cache: false,
        success: function (result) {

            if (result != null && result.status == 200) {
                modal_show(modal_name);
            }
            else if (result != null && result.status == -101) {
                alertify.warning(result.reason);
            }
            else {

                alertify.warning("پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید", 6);
            }

        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_PrescriptionOtpCode)
        }
    });

    /*  modal_show(modal_name);*/
}

function run_button_printPatientPrescriptionTamin(p_keyvalue, rowno, elm, ev) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;


    getPrintPatientPrescriptionTamin(p_keyvalue);

}

function getPatientPrintData(id) {

    var url = `${viewData_baseUrl_MC}/PrescriptionTaminApi/patientprint`;

    let output = $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return output.responseJSON;
}

function getPrintPatientPrescriptionTamin(prescriptionId) {

    let setupInfo = getSetupInfo();
    let contentData = getPatientPrintData(prescriptionId);

    var prescription = (contentData != null && contentData != undefined && contentData.length > 0) ? contentData[0] : null;

    let content =
        `<div style="display: flex; width: 260px; flex-wrap: wrap;word-break: break-word;text-align:right;font-size:13px;font-family: 'IRANSansWebFaNum'"> 
           <div style="width:100%;display: inline-flex;padding:2px;">
                <span style="width:30%; text-align: center">
                    <img src="data:image/png;base64,${setupInfo.logoBase64}" style="height:50px;width:50px;border-width:0px;" />
                </span>                
                <div style="width: 70%; text-align: right; display: grid; ">
                  <span style="width:100%; text-align:right">${setupInfo.name}</span>                   
                </div>
           </div>
           <div style="width:100%;border-bottom:1px solid #000;padding:5px 0 0 10px">
             <span style="width:100%;font-size:17px;text-align:center">${prescription.stageName}</span> 
           </div>

            <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding-bottom:5px">
                <div style="width: 100%;display: inline-flex;">
                    <div style="width: 45%">${prescription.admissionId} / ${prescription.admissionMasterId}</div>
                    <div style="width: 55%">:شناسه پرونده / پذیرش</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width:45%;">${prescription.createDatePersian}</div>
                    <div style="width: 55%">:تاریخ نسخه</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width: 45%">${prescription.patientFullName}</div>
                    <div style="width: 55%">:مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width: 45%">${prescription.patientNationalCode}</div>
                    <div style="width: 55%">:نمبر تذکره مراجعه کننده</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width: 45%">${prescription.attenderName} / ${prescription.msc}</div>
                    <div style="width: 55%">:داکتر</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width: 45%">${prescription.specialtyName}</div>
                    <div style="width: 55%">:تخصص</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width:45%;">${prescription.prescriptionCategoryName}</div>
                    <div style="width: 55%;">:نوع نسخه</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width:45%;"><b>${prescription.trackingCode}</b></div>
                    <div style="width: 55%;">:کد رهگیری</div>
                </div>
                <div style="width: 100%;display: inline-flex;padding-bottom:5px">
                    <div style="width:45%;">${prescription.requestEPrescriptionId}</div>
                    <div style="width: 55%;">:شناسه الکترونیک</div>
                </div>
            </div>
        `;

    if (checkResponse(prescription.branchAddress) && prescription.branchAddress != "") {
        content += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding-bottom:5px; border-top:1px solid #000">
                        <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;;text-align:center"">${prescription.branchAddress}</div>
                        </div>
                    </div>`
    }

    if (prescription.branchLineInfoList != null) {

        var branchLineInfoList = prescription.branchLineInfoList;
        var branchLineInfoListLen = prescription.branchLineInfoList.length;

        let branchLineTypeNameList = "";

        for (let i = 0; i < branchLineInfoListLen; i++) {

            if (branchLineInfoList[i].branchLineTypeId == 1) {

                if (checkResponse(branchLineInfoList[i].value) && branchLineInfoList[i].value != "")
                    branchLineTypeNameList += `${branchLineInfoList[i].value} /`;
            }
        }

        if (branchLineTypeNameList != "")
            content += `<div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center">${branchLineTypeNameList.slice(0, -1)}</div></div>`

    }


    content += "</div>"

    if (setupInfo.centralWebsite != "" && setupInfo.centralWebsite != null)
        content += ` <div style="width:100%;display: inline-flex;flex-wrap: wrap;padding:2px;border-top:2px solid #000">
                            <div style="width: 100%;display: inline-flex;">
                            <div style="width: 100%;text-align:center"> ${setupInfo.centralWebsite} : نوبت دهی </div></div></div>`

    sendToPrint(content);
}

function sendToPrint(content) {
    $('#frmDirectPrint').contents().find("body").html(content + footerBodyPrintIfrem);
}