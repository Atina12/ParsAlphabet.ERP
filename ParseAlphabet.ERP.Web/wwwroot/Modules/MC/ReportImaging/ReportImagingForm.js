
var viewData_controllername = "ImagingReportApi",
    viewData_form_title = "گزارش تصویربرداری",
    reportUrl = "",
    form = $('.card-body').parsley(),
    roleId = getRoleId(),
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repimaging`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repimagingcsv`,
    viewData_generatePdf_url = `${viewData_baseUrl_MC}/${viewData_controllername}/generatepdf`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repimagingcolumns`,
    viewData_getrecord_url = `${viewData_baseUrl_MC}/AdmissionImagingApi/getrecordbyid`;


async function initAdmissionReport() {

    $(".select2").select2();

    settingReportModule();

    getHeaderColumns();

    $("#fromDate").inputmask();
    $("#toDate").inputmask();

    kamaDatepicker('fromDate', { withTime: false, position: "bottom" });
    kamaDatepicker('toDate', { withTime: false, position: "bottom" });

    fillDropDown()

    $("#basicInsurerLineId").val("").attr("disabled", true);
    $("#compInsurerLineId").val("").attr("disabled", true);

    focusInput(1);
}

function fillDropDown() {

    fill_select2(`${viewData_baseUrl_GN}/branchApi/getdropdown`, "branchId", true, "", false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerId", true, "1/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsurerId", true, "2/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyInsurerId", true, "4/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "discountInsurerId", true, "5/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/AttenderApi/getdropdown`, 'attenderId', true, "2", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, 'departmentId', true, "", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/SpecialityApi/getdropdown`, "specialityId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/ServiceTypeApi/getdropdown`, "serviceTypeId", true, "2", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/ServiceApi/getdropdown`, "serviceId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/PatientApi/filter`, "patientId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`/api/GN/UserApi/getdropdown`, "userId", true, "2/false/false", false, 3, "", undefined, "", false, true, false);
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

async function loadingAsync(loading, elementId, iconClass) {
    if (loading) {
        $(`#${elementId} i`).removeClass(iconClass);
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin");
        $(`#${elementId} i`).addClass(iconClass);
        $(`#${elementId}`).prop("disabled", false)
    }
}

function parameter() {

    let parameters = {
        admissionMasterId: ($("#admissionMasterId").val() == null || $("#admissionMasterId").val() == "") ? null : +$("#admissionMasterId").val(),
        admissionId: ($("#id").val() == null || $("#id").val() == "") ? null : +$("#id").val(),
        branchIds: ($("#branchId").val() == null || $("#branchId").val() == "") ? null : +$("#branchId").val(),
        patientIds: $("#patientId").val().toString() == "" ? null : $("#patientId").val().toString(),
        patientNationalCode: +$("#patientNationalCode").val() == 0 ? null : +$("#patientNationalCode").val(),
        fromCreateDatePersian: $("#fromDate").val() == "" ? null : $("#fromDate").val(),
        toCreateDatePersian: $("#toDate").val() == "" ? null : $("#toDate").val(),
        createUserId: +$("#userId").val() == 0 ? null : +$("#userId").val(),
        basicInsurerIds: $("#basicInsurerId").val().toString() == "" ? null : $("#basicInsurerId").val().toString(),
        basicInsurerLineIds: $("#basicInsurerLineId").val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(),
        compInsurerIds: $("#compInsurerId").val().toString() == "" ? null : $("#compInsurerId").val().toString(),
        compInsurerLineIds: $("#compInsurerLineId").val().toString() == "" ? null : $("#compInsurerLineId").val().toString(),
        thirdPartyInsurerIds: $("#thirdPartyInsurerId").val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(),
        discountInsurerIds: $("#discountInsurerId").val().toString() == "" ? null : $("#discountInsurerId").val().toString(),
        attenderIds: $("#attenderId").val() == "" ? null : $("#attenderId").val().toString(),
        departmentIds: $("#departmentId").val().toString() == "" ? null : $("#departmentId").val().toString(),
        specialtyIds: $("#specialityId").val().toString() == "" ? null : $("#specialityId").val().toString(),
        serviceTypeIds: $("#serviceTypeId").val().toString() == "" ? null : $("#serviceTypeId").val().toString(),
        serviceIds: $("#serviceId").val().toString() == "" ? null : $("#serviceId").val().toString(),
        workflowIds: $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        stageIds: $("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        actionIds: $("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),
        pageNo: 0

    };
    return parameters;
}

function fill_select2Stage(elementid) {

    $(`#${elementid}`).html(`<option value="0">انتخاب کنید</option>`);

    let data = Object.keys(admissionStage).map(function (item) {
        return {
            id: admissionStage[item].id, text: admissionStage[item].id + " - " + admissionStage[item].name
        };
    });
    $(`#${elementid}`).select2({
        templateResult: function (item) {
            return item.text;
        },
        placeholder: "انتخاب",
        data: data,
        allowClear: true,
    });

}

$("#basicInsurerId").on("change", function () {

    let insurerId = $(this).val().toString();

    if (insurerId != "") {

        $("#basicInsurerLineId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsurerLineId", true, `${insurerId}/2`, false, 3, "", undefined, "", false, false, true);
    }
    else
        $("#basicInsurerLineId").attr("disabled", true).html("");

});

$("#compInsurerId").on("change", function () {

    let insurerId = $(this).val().toString();

    if (insurerId != "") {

        $("#compInsurerLineId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "compInsurerLineId", true, `${insurerId}/2`, false, 3, " انتخاب ", undefined, "", false, false, true);
    }
    else
        $("#compInsurerLineId").attr("disabled", true).html("");
});

$("#branchId").on("change", function () {

    let branchId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", true, false, true)

});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        bySystem = 0,
        isActive = 2;


    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", true, false, true);
});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14",//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true,
        `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "",
        () => { $("#actionId").trigger("change") }, "", true, false, true);


});

$("#previewReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionImaging.mrt`;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var repParameters = [
        { Item: "AdmissionMasterId", Value: +$("#admissionMasterId").val() == 0 ? null : $("#admissionMasterId").val(), SqlDbType: dbtype.Int },
        { Item: "AdmissionId", Value: +$("#id").val() == 0 ? null : $("#id").val(), SqlDbType: dbtype.Int },
        { Item: "BranchIds", Value: +$("#branchId").val() == 0 ? null : $("#branchId").val(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "PatientIds", Value: $(`#patientId`).val().toString() == "" ? null : $("#patientId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "PatientNationalCode", Value: $(`#patientNationalCode`).val() == "" ? null : $("#patientNationalCode").val(), SqlDbType: dbtype.NVarChar, Size: 13 },
        { Item: "FromCreateDate", Value: $(`#fromDate`).val() != "" ? convertToMiladiDate($(`#fromDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToCreateDate", Value: $(`#toDate`).val() != "" ? convertToMiladiDate($(`#toDate`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "CreateUserId", Value: +$(`#userId`).val() == 0 ? null : +$("#userId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurerIds", Value: $(`#basicInsurerId`).val().toString() == "" ? null : $("#basicInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "BasicInsurerLineIds", Value: $(`#basicInsurerLineId`).val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerIds", Value: $(`#compInsurerId`).val().toString() == "" ? null : $("#compInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerLineIds", Value: $(`#compInsurerLineId`).val().toString() == "" ? null : $("#compInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ThirdPartyInsurerIds", Value: $(`#thirdPartyInsurerId`).val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "DiscountInsurerIds", Value: $(`#discountInsurerId`).val().toString() == "" ? null : $("#discountInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "AttenderIds", Value: $(`#attenderId`).val().toString() == "" ? null : $("#attenderId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "DepartmentIds", Value: $(`#departmentId`).val() == "" ? null : $("#departmentId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "SpecialtyIds", Value: $(`#specialityId`).val().toString() == "" ? null : $("#specialityId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ServiceTypeIds", Value: $(`#serviceTypeId`).val().toString() == 0 ? null : $("#serviceTypeId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ServiceIds", Value: $(`#serviceId`).val().toString() == "" ? null : $("#serviceId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "WorkflowIds", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageIds", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ActionIds", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "FromDatePersian", Value: $(`#fromDate`).val() != "" ? $(`#fromDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toDate`).val() != "" ? $(`#toDate`).val() : "", itemType: "Var" },
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 }
    ]

    var reportModel = {
        reportName: `${viewData_form_title} ${$("#reportType option:selected").text()}`,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
   
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
});

$("#getReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    await loadingAsync(true, "getReport", "fas fa-sticky-note");
    await getReport();

});

$("#exportPDF").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

     exportPdf();
    
})

function exportPdf() {
    reportParameters = parameter();
    
    $.ajax({
        url: viewData_generatePdf_url,
        type: "get",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        data: { stringedModel: JSON.stringify(reportParameters) },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (result) {
            
            var a = document.createElement('a');
            var blob = new Blob([result], { type: "application/zip" })
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'ImagingFiles.zip';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        },
        error: function (xhr) {
            error_handler(xhr, viewData_generatePdf_url);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });


}

$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let csvModel = parameter();

    csvModel.pageNo = null;
    csvModel.pageRowsCount = null;

    var urlCSV = viewData_csv_url;
    loadingAsync(true, "exportCSV", "fa fa-file-excel");
    $.ajax({
        url: urlCSV,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {

                let element = document.createElement('a')
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(urlCSV);
            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
})

initAdmissionReport();

window.Parsley._validatorRegistry.validators.comparedate = undefined
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        var value2 = $(`#${requirement}`).val();

        if (value === "" || value2 === "")
            return true;

        var compareResult = compareShamsiDate(value, value2);
        return compareResult;
    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

window.Parsley._validatorRegistry.validators.chekdoubledate = undefined
window.Parsley.addValidator('chekdoubledate', {
    validateString: function (value, requirement) {

        if ((+$("#fromDate").val() == 0 || +$("#toDate").val() == 0)) return false;

        return true;
    },
    messages: {
        en: 'وارد کردن تاریخ ثبت الزامیست.',
    }
});

window.Parsley._validatorRegistry.validators.shamsidateservice = undefined
window.Parsley.addValidator('shamsidateservice', {
    validateString: function (value) {
        if (+value !== 0) return isValidShamsiDate(value);
        else return true;
    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});
