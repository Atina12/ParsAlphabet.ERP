var viewData_form_title = "لیست تصویر برداری",
    viewData_add_form_title = "تصویربرداری",
    viewData_display_form_title = "نمایش تصویربرداری",
    viewData_edit_form_title = "تصویربرداری - ویرایش",
    priscriptionDateValid = true,
    viewData_controllername = "AdmissionImagingApi",
    viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_insrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/update`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`,
    viewData_display_page_url = "/MC/AdmissionImaging/display",
    viewData_add_page_url_AdmissionImagingForm = "/MC/AdmissionImaging/form",
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}AdmissionImaging.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    isSecondLang = false,
    admissiontypeidForReffferingIdOnChange = "", saveAdmissionInfoForModal = {};


function initFrom() {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");

    if (check)
        $("#userType").prop('disabled', false);
    else
        $("#userType").prop('disabled', true);

    $('#userType').bootstrapToggle();

    inputMask();

    pagetable_formkeyvalue = ["myimage", 0];
    get_NewPageTableV1();
}

$("#userType").on("change", function () {

    var check = controller_check_authorize(viewData_controllername, "VIWALL");
    if (!check)
        return;

    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myimage", 0];
    else
        pagetable_formkeyvalue = ["allimage", 0];

    get_NewPageTableV1();

});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#RegistrationId").val("")
    $("#admissionId").val("")
    $("#referringDoctorId").val("").trigger("change")
    $("#prescriptionDatePersian").val("")
});

$("#AddEditModal").on("shown.bs.modal", function () {
    $("#referringDoctorId").select2("focus");
    priscriptionDateValid = true;
});

$("#newAdmEditFormModal").on("hidden.bs.modal", function () {
    let switchUser = ""
    if ($("#userType").prop("checked")) {
        switchUser = "myimage"
    } else {
        switchUser = "allimage"
    }
    pagetable_formkeyvalue = [switchUser, 0];
    get_NewPageTableV1();
});

$("#referringDoctorId").on("change", function () {
    if (admissiontypeidForReffferingIdOnChange == 3) {
        $("#prescriptionDatePersian").prop("required", true).prop("disabled", true);
    } else {
        if (+$("#referringDoctorId").val() !== 0) {
            $("#prescriptionDatePersian").prop("required", true).prop("disabled", false);
        }
        else {
            $("#prescriptionDatePersian").val("").prop("disabled", false).prop("required", true).trigger("change");
        }
    }
});

$("#contentNewAdmissionEdit").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.keyCode === KeyCode.key_s) {
        ev.preventDefault();
        $("#saveForm").click();

    }
});

$(document).on("keydown", function (e) {
    if ([KeyCode.Insert, KeyCode.key_General_1].indexOf(e.which) == -1) return;

    if (e.ctrlKey && e.keyCode === KeyCode.key_General_1) {
        e.preventDefault();
        $("#parentPageTableBody .highlight #btn_print").click()
    }

    if (e.ctrlKey && e.keyCode === KeyCode.Insert) {
        e.preventDefault();
        AdmissionImagingForm();
    }

});

function AdmissionImagingForm() {
    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    if (typeof viewData_add_form_title == "string")
        navigation_item_click(viewData_add_page_url_AdmissionImagingForm, viewData_add_form_title);
    else
        navigation_item_click(viewData_add_page_url_AdmissionImagingForm, "");
}

function run_button_editAdmissionImaging(admissionImageId, rowNo, btn) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;
    let stage = $(`#row${rowNo}`).data("stage");
    var href = `${viewData_add_page_url_AdmissionImagingForm}/${admissionImageId}/${stage}`;
    navigation_item_click(href, viewData_edit_form_title);
}

function run_button_displayAdmissionImaging(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    navigateToModalAdmissionImaging(`/MC/admissionimaging/display/${id}`, "نمایش");

}

function navigateToModalAdmissionImaging(href) {

    initialPage();
    $("#contentdisplayAdmissionImaging #content-page").addClass("displaynone");
    $("#contentdisplayAdmissionImaging #loader").removeClass("displaynone");

    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",

        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentdisplayAdmissionImaging`).html(result);
            modal_show("displayAdmissionImagingModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
    $("#contentdisplayAdmissionImaging #loader,#contentdisplayAdmissionImaging #formHeaderLine #header-div .button-items").addClass("displaynone");
    $("#contentdisplayAdmissionImaging #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentdisplayAdmissionImaging #form,#contentdisplayAdmissionImaging .content").css("margin", 0);
    $("#contentdisplayAdmissionImaging .itemLink").css("pointer-events", " none");
}

function run_button_print(id, rowNo, elm) {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    getAdmissionImagingByIdIndex(id, rowNo);
}

async function getAdmissionImagingByIdIndex(admImgId, rowNo, headerPagination = 0) {

    let model = {
        admissionImagingId: admImgId,
        headerPagination: headerPagination
    }
    if (admImgId !== 0) {

        $.ajax({
            url: viewData_getrecord_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                //printTinyContent(data.data, rowNo);
                printTinyContent2(data.data)
            },
            error: function (xhr) {
                error_handler(xhr, viewData_getrecord_url);
                return {
                    status: -100,
                    statusMessage: "عملیات با خطا مواجه شد",
                    successfull: false
                };
            }
        });
    }
};

async function printTinyContent2(data) {
    
    let content = "", contentHeader = "", tinycontent = data.content;

    contentHeader = await $.get("/Report/NewGetHeaderPrint").then(result => result);
    let admissionDatePersian = data.admissionDateTimePersian.split(" ")[0]
    content = contentHeader
        .replace("SRCIMAGE", "data:image/png;base64,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")
        .replace("@companyName@", "مجتمع صحتی درمانی شهید شوریده")
        .replace("@craeteDate@", moment().format('jYYYY/jMM/jDD'))
        .replace("@admissionDate@", admissionDatePersian == undefined ? "" : admissionDatePersian)
        .replace("@prescriptionDatePersian@", data.prescriptionDatePersian == undefined ? "" : data.prescriptionDatePersian)
        .replace("@username@", uId)
        .replace("@patientFullName@", data.patientFullName == undefined ? "" : data.patientFullName)
        .replace("@referringDoctorName@", data.referringDoctorName == undefined ? "" : data.referringDoctorName)
        .replace("@content@", tinycontent)
        .replace("@admissionId@", data.admissionId == undefined ? "" : data.admissionId)
        .replace("@patientBirthDate@", data.patientBirthDatePersian.split(" ")[0] == undefined ? "" : data.patientBirthDatePersian.split(" ")[0])

    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

async function printTinyContent(data, rowNo) {

    let content = "", contentHeader = "", tableAdm = "", tinycontent = data.content;

    tableAdm = `<table style="border-bottom: 1px solid;width: 100%;direction:rtl; border-spacing:0px;margin-bottom:5px;font-size:12px">
            <thead>
                <tr>
                    <th style="border-style: solid; border-width: 1px 1px 0px 1px;">شناسه پذیرش</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">مراجعه کننده</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">رادیولوژیست</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">داکتر ارجاع دهنده</th>
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">تاریخ نسخه</th>    
                    <th style="border-style: solid; border-width: 1px 0px 0px 1px;">بیمه پایه</th>                                     
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-style: solid; border-width: 1px 1px 0px 1px;margin-right:1px;text-align:center">${data.admissionId == null ? "" : data.admissionId}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px;margin-right:1px;text-align:center">${data.patientFullName == null ? "" : data.patientFullName}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px;margin-right:1px;text-align:center">${data.attenderFullName == null ? "" : data.attenderFullName}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px;margin-right:1px;text-align:center">${data.referringDoctorId == 0 ? "" : `${data.referringDoctorId} - ${data.referringDoctorName}`}</td>
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px;margin-right:1px;text-align:center">${data.prescriptionDatePersian == null ? "" : data.prescriptionDatePersian}</td>   
                    <td style="border-style: solid; border-width: 1px 0px 0px 1px;margin-right:1px;text-align:center">${data.basicInsurerName == null ? "" : data.basicInsurerName}</td>   
                </tr>
            </tbody>
        </table>`;

    contentHeader = await $.get("/Report/GetHeaderPrint").then(result => result);

    content = contentHeader.replace("SRCIMAGE", "'data:image/png;base64,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'")
        .replace("@craeteDate@", moment().format('jYYYY/jMM/jDD'))
        .replace("@companyName@", "مجتمع صحتی درمانی شهید شوریده")
        //.replace("@userName@", data.createUserFullName)
        .replace("@reportName@", "تصویربرداری")
        .replace("@content@", tinycontent)
        .replace("@headerContent@", tableAdm)
        .replace("@otherOption2@", "")
        .replace("@otherOptionValue2@", "")
        .replace("@otherOption1@", "")
        .replace("@otherOptionValue1@", "")
        .replace("@reportDatePersian@", data.createDatePersian == null ? "" : data.createDatePersian.split(' ')[0]);

    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

function modal_ready_for_add() {
    AdmissionImagingForm();
}

function run_button_deleteAdmissionImaging(p_keyvalue, rowno, elem) {

    var check = controller_check_authorize(viewData_controllername, "DEL");
    if (!check)
        return;

    var dataModel = $(`#${activePageTableId} #parentPageTableBody .pagetablebody tbody #row1`).data()

    let model = {
        admissionId: dataModel.admissionid,
        admissionWorkflowId: dataModel.admissionworkflowid,
        admissionStageId: dataModel.admissionstageid,
        id: dataModel.id,
        workflowId: dataModel.workflowid,
        stageId: dataModel.stageid
    }

    alertify.confirm('', msg_delete_row,
        function () {

            $.ajax({
                url: viewData_deleterecord_url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(model),
                async: false,
                cache: false,
                success: function (result) {

                    if (result.successfull == true) {

                        var pagetableid = $(elem).parents(".card-body").attr("id");

                        get_NewPageTableV1(pagetableid, false, () => callbackAfterFilterV1(pagetableid));

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {

                        if (result.statusMessage !== undefined && result.statusMessage !== null) {
                            var msg = alertify.error(result.statusMessage);
                            msg.delay(alertify_delay);
                        }
                        else if (result.validationErrors !== undefined) {
                            generateErrorValidation(result.validationErrors);
                        }
                        else {
                            var msg = alertify.error(msg_row_create_error);
                            msg.delay(2);
                        }
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, viewData_deleterecord_url)
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });
}

function run_button_editAdmission(id, row, elm, event) {

    var check = controller_check_authorize("AdmissionApi", "INS");
    if (!check)
        return;

    let currentRow = $(elm).parent().parent().parent().parent()
    let stageId = +currentRow.data("admissionstageid")
    let workflowId = +currentRow.data("admissionworkflowid")
    let admissionId = +currentRow.data("admissionid")
    var cashier = getCashIdByUserId()

    if (checkResponse(cashier)) {
        let workflowStage = getAdmissionTypeId(stageId, workflowId)
        let admissionTypeId = workflowStage.admissionTypeId

        saveAdmissionInfoForModal = {
            admissionId,
            stageId,
            workflowId,
            admissionTypeId,
        }

        if (admissionTypeId == 2) {
            isReimburesment = true;
            navigateToModalAdmission(`/MC/Admission/newform/${saveAdmissionInfoForModal.admissionId}`, "پذیرش", saveAdmissionInfoForModal.admissionTypeId);
        }
        else if (admissionTypeId == 3) {
            isReimburesment = true;
            navigateToModalAdmission(`/MC/AdmissionServiceTamin/newform/${saveAdmissionInfoForModal.admissionId}`, "پذیرش", saveAdmissionInfoForModal.admissionTypeId);
        }
        else if (admissionTypeId == 4) {
            isReimburesment = true;
            alertify.warning("ویرایش پذیرش نسخه نویسی پاراکلینیک امکان پذیر نیست").delay(admission.delay);
        }
    }
    else {
        alertify.warning(`شما اجازه دسترسی به این بخش را ندارید`);
    }

}

function navigateToModalAdmission(href, titlePage = null, admissionType = null) {

    initialPage();
    $("#contentNewAdmissionEdit #content-page").addClass("displaynone");
    $("#contentNewAdmissionEdit #loader").removeClass("displaynone");
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $(`#contentNewAdmissionEdit`).html(result)
            newOptionForNewAdmission(admissionType)
            modal_show("newAdmEditFormModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });



    $("#contentNewAdmissionEdit #loader").addClass("displaynone");
    $("#contentNewAdmissionEdit #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentNewAdmissionEdit #form,#contentNewAdmissionEdit .content").css("margin", 0);
    $("#contentNewAdmissionEdit #form .header-title .button-items #list_adm ,#contentNewAdmissionEdit #form .header-title .button-items #newForm").remove();
    $("#contentNewAdmissionEdit .step-content:eq(0)").attr("tabindex", "-1").focus();
}

function newOptionForNewAdmission(admissionType) {
   
    $("#saveForm").remove()
    $("#saveReferingDoctorInfoId").removeClass("d-none")
    $("#contentNewAdmissionEdit #firstName").prop("disabled", true)
    $("#contentNewAdmissionEdit #lastName").prop("disabled", true)
    $("#contentNewAdmissionEdit #birthDatePersian").prop("disabled", true)
    $("#contentNewAdmissionEdit #genderId").prop("disabled", true)

    $("#searchPatient").remove()
    $("#getPatientInfoWS").remove()
    $("#getPersobByBirthWS").remove()
    $("#getAttenderHID").remove()
    $("#getrefferingHID").remove()
    $("#getDeserveInfo").remove()

    $("#contentNewAdmissionEdit #tryGetPrescription").remove()
    $("#contentNewAdmissionEdit #removeAllService").remove()
    $("#contentNewAdmissionEdit #reserveBox").remove()
    $("#contentNewAdmissionEdit #addService").remove()
    $("#contentNewAdmissionEdit #healthInsuranceClaim").remove()

    $("#editSectionShabad").remove()
    $("#editSectionPatient").remove()
    $("#addDiagnosis").remove()
    $("#canceledDiagnosis").remove()

    setTimeout(() => {

        $("#countryId").prop("disabled", true)
        $("#mobile").prop("disabled", true)
        $("#diagnosisResonId").prop("disabled", true)
        $("#statusId").prop("disabled", true)
        $("#serverityId").prop("disabled", true)
        $("#reasonForEncounterId").prop("disabled", true)
        $("#comment").prop("disabled", true)
        $("#editCashForm").prop("disabled", true)
        $("#fundTypeId").prop("disabled", true)
        $("#amount").prop("disabled", true)

        $("#serviceId").prop("disabled", true)
        $("#qty").prop("disabled", true)

        $("#tempdiagnosisList thead tr th").last().remove()
        $("#tempDiag tr td").last().remove()
        $("#serviceForm thead tr th").last().remove()

        let tempServiceContent = $("#serviceForm #tempService").children()
        for (let i = 0; i < tempServiceContent.length; i++) {
            $($("#serviceForm #tempService ").children()[i]).children().last().remove()
        }

        if (admissionType == 2)
            $("#serviceForm #sumRowService tr td").last().remove()
        else if (admissionType == 3) {
            $("#serviceForm #sumRowService tr td").first().attr("colspan", "7")
            $("#tablePrescription thead tr th").last().remove()
            $("#tempPrescription  tr td").last().remove()
        }
    }, 1000)


    //cash
    let admissionCashTheadContent = $("#admissionCash thead").children()
    for (let i = 0; i < admissionCashTheadContent.length; i++) {
        $($("#admissionCash thead").children()[i]).children().last().remove()
    }

    setTimeout(() => {

        $("#admissionCash thead tr th").last().remove()

        let tempCashContent = $("#tempCash").children()
        for (let j = 0; j < tempCashContent.length; j++) {
            $($("#tempCash").children()[j]).children().last().remove()
        }

        $("#contentNewAdmissionEdit #basicInsurerNo").prop("disabled", true)
        $("#contentNewAdmissionEdit #basicInsurerBookletPageNo").prop("disabled", true)
        $("#contentNewAdmissionEdit #basicInsurerExpirationDatePersian").prop("disabled", true)

        $("#inOut").prop("disabled", true)
    }, 1000)


    $("#sumRowCash tr td").last().remove()
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

function configEditReferingDoctorInfoInAdmissionImaging() {
    $("#saveReferingDoctorInfoId").removeAttr("disabled")
    $("#editReferingDoctorInfoId").prop("disabled", true)
}

async function modal_close_newAdm() {
    modal_close("newAdmEditFormModal");
}

function comparePrescriptionDate(modelCompare) {
    var url = `/api/SetupApi/comparetime`;
    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(modelCompare),
        success: function (result) {
            return JSON.parse(result);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return -2;
        }
    });

    return result.responseJSON;
}

initFrom();