var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش سفارش کالا",
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionsale`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionsalecolumns`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repadmissionsalecsv`,
    reportParameters = [],
    reportUrl = "",
    roleId = getRoleId(),
    form = $('#AdmissionSaleReport').parsley();


function initRepAdmissionSaleForm() {

    $(".select2").select2();

    settingReportModule();

    getHeaderColumns();

    fillDropDown()

    $("#fromCreateDateTimePersian").inputmask();
    $("#toCreateDateTimePersian").inputmask();

    kamaDatepicker('fromCreateDateTimePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('toCreateDateTimePersian', { withTime: false, position: "bottom" });

    $("#basicInsurerLineId").val("").prop("disabled", true);

    $("#compInsurerLineId").val("").prop("disabled", true);

    $("#reportType").val("101").trigger("change");

    setTimeout(() => {
        $("#fromCreateDateTimePersian").focus();
    }, 20)
}

function fillDropDown() {
    fill_select2(`${viewData_baseUrl_GN}/BranchApi/getdropdown`, "branchId", true, 0, false, 3, "", () => { $("#branchId").trigger("change") }, "", false, false, true);
    fill_select2(`${viewData_baseUrl_WH}/ItemCategoryApi/getdropdownbytype`, "categoryId", true, -1, false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "basicInsurerId", true, "1/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "compInsurerId", true, "2/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "thirdPartyInsurerId", true, "4/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getlistbytypeid`, "discountInsurerId", true, "5/true/2/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_MC}/PatientApi/getdropdown`, "patientId", true, "2", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_MC}/PatientApi/filter`, "patientNationalCode", true, "3", true, 3, "", undefined, "", false, false, false);
    fill_select2(`${viewData_baseUrl_WH}/ItemApi/itemsaledropdown`, "itemId", true, 0, false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_GN}/UserApi/getdropdown`, "userId", true, "2/false/false", false, 3, "", undefined, "", false, false, true);
    fill_select2(`${viewData_baseUrl_PU}/VendorApi/getdropdown`, "vendorId", true, 0, false, 3, "", undefined, "", false, false, true);
    fill_select2(`/api/SMApi/contracttypegetdropdown`, "contractTypeId", false, 0, false, 3, "", undefined, "", false, false, true);
}

$("#branchId").on("change", function () {

    var branchId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "19,30";

    $("#workflowId").empty();

    fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `${branchId}/${workFlowCategoryId}/${stageClassId}`, false, 3, "",
        () => { $("#workflowId").trigger("change") }, "", false, false, true);
});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "19,30",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `${branchId}/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        branchId = $("#branchId").val().toString() == "" ? null : $("#branchId").val().join(","),
        stageClassId = "19,30",
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id;

    $("#actionId").empty();


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/${branchId}/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);

});

$("#basicInsurerId").on("change", function () {

    let insurerId = $(this).val().toString();

    if (insurerId != "") {

        $("#basicInsurerLineId").attr("disabled", false).html("");
        fill_select2(`${viewData_baseUrl_MC}/InsuranceApi/getinsurerlinelistbyinsurerid`, "basicInsurerLineId", true, `${insurerId}/2`, false, 3, " انتخاب ", undefined, "", false, false, true);
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

$("#showReport").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    modal_show("previewReportModal");
    $("#reportType").val("101").trigger("change");
    setTimeout(function () {
        $('#previewReportModal').trigger('blur');
        $("#previewReportModal select").focus()
    }, 200);

   
});

$("#reportType").on("change", function () {
    var reportType = +$(this).val();
  
    if (reportType === 101)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionSaleReportPreview.mrt`;
    else
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionSaleReportPreviewByPatientId.mrt`;

});

$("#modal-previewReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

   let repParameters = reportParameter();

    var reportModel = {
        reportName: viewData_form_title,
        reportUrl: reportUrl,
        parameters: repParameters,
        reportSetting: reportSettingModel
    }
    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');


});

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

async function fill_select2WithData(result, elementid, isNotMultipel = true, selectabel = false, callBack = undefined) {
    var query = {}, arrayIds = [], placeholder = "";
    $(`#${elementid}`).html("");

    if (result) {
        var data = result.map(function (item) {
            arrayIds.push(item.id);
            return {
                id: item.id, text: `${item.id} - ${item.name}`
            };
        });
        $(`#${elementid}`).select2({
            templateResult: function (item) {
                if (item.loading) {
                    return item.text;
                }
                var term = query.term || '';
                var $result = markMatch(item.text, term);
                return $result;
            },
            language: {
                searching: function (params) {
                    query = params;
                    return 'در حال جستجو...';
                }
            },
            placeholder: placeholder,
            data: data,
            closeOnSelect: true,
            allowClear: isNotMultipel,
            escapeMarkup: function (markup) {
                return markup;
            }
        });

        $(`#${elementid}`).val(0).trigger('change.select2');
    }
    if (!isNotMultipel) {
        $(`#${elementid}`).parent().find(".btn-multipel-more").remove();
        $(`#${elementid}`).on("change", function () { onchangeMultipel(this) });
        $(`#${elementid}`).parent().addClass("multiple-maxheight").removeClass("multiple-maxheight-md");
    }


    if (selectabel) {
        fillselect2MultiPle(elementid, arrayIds, ++counter);
        if (arrayIds.length !== 0)
            $(`#${elementid}`).prepend("<optgroup></optgroup>");
    }
    $(`#${elementid}`).prop("disabled", false);

    if (typeof callBack !== "undefined") callBack();
}

async function getReport() {
    reportParameters = parameter();
    main_getReport();
};

function parameter() {

    let patientId = "";
    if (+$("#patientId").val() > 0)
        patientId = +$("#patientId").val();
    else if (+$("#patientId").val() > 0 && +$("#patientNationalCode").val() != 0)
        patientId = +$("#patientNationalCode").val();
    else if (+$("#patientId").val() == 0 && +$("#patientNationalCode").val() > 0)
        patientId = +$("#patientId").val();
    else
        patientId = 0;

    let parameters = {
        branchId: +$("#branchId").val() == 0 ? null : $("#branchId").val().toString(),
        fromAdmissionMasterId: $("#fromAdmissionMasterId").val().toString() == "" ? null : +$("#fromAdmissionMasterId").val().toString(),
        toAdmissionMasterId: $("#toAdmissionMasterId").val().toString() == "" ? null : +$("#toAdmissionMasterId").val().toString(),
        stageId: $("#stageId").val().toString() == "" ? null : $("#stageId").val().toString(),
        workflowId: $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().toString(),
        actionId: $("#actionId").val().toString() == "" ? null : $("#actionId").val().toString(),
        categoryId: $("#categoryId").val().toString() == "" ? null : $("#categoryId").val().toString(),
        basicInsurerId: $("#basicInsurerId").val().toString() == "" ? null : $("#basicInsurerId").val().toString(),
        basicInsurerLineId: $("#basicInsurerLineId").val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(),
        compInsurerId: $("#compInsurerId").val().toString() == "" ? null : $("#compInsurerId").val().toString(),
        compInsurerLineId: $("#compInsurerLineId").val().toString() == "" ? null : $("#compInsurerLineId").val().toString(),
        thirdPartyInsurerId: $("#thirdPartyInsurerId").val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(),
        discountInsurerId: $("#discountInsurerId").val().toString() == "" ? null : $("#discountInsurerId").val().toString(),
        patientId: patientId == 0 ? null : patientId,
        fromId: +$("#fromId").val() == 0 ? null : +$("#fromId").val(),
        toId: +$("#toId").val() == 0 ? null : +$("#toId").val(),
        itemId: $("#itemId").val().toString() == "" ? null : $("#itemId").val().toString(),
        contractTypeId: $("#contractTypeId").val().toString() == 0 ? null : $("#contractTypeId").val().toString(),
        vendorId: $("#vendorId").val().toString() == "" ? null : $("#vendorId").val().toString(),
        userId: $("#userId").val().toString() == "" ? null : $("#userId").val().toString(),
        fromCreateDateTimePersian: $("#fromCreateDateTimePersian").val() == "" ? null : $("#fromCreateDateTimePersian").val(),
        toCreateDateTimePersian: $("#toCreateDateTimePersian").val() == "" ? null : $("#toCreateDateTimePersian").val(),
        pageNo: 0
    };

    return parameters;
}

function reportParameter() {
    let patientId = "";
    if (+$("#patientId").val() > 0)
        patientId = +$("#patientId").val();
    else if (+$("#patientId").val() > 0 && +$("#patientNationalCode").val() != 0)
        patientId = +$("#patientNationalCode").val();
    else if (+$("#patientId").val() == 0 && +$("#patientNationalCode").val() > 0)
        patientId = +$("#patientId").val();
    else
        patientId = 0;
   
    let repParameters = [
        { Item: "BranchId", Value: $(`#branchId`).val().toString() == "" ? null : $("#branchId").val().join(","), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "FromAdmissionMasterId", Value: $(`#fromAdmissionMasterId`).val().toString() == "" ? null : $("#fromAdmissionMasterId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "ToAdmissionMasterId", Value: $(`#toAdmissionMasterId`).val().toString() == "" ? null : $("#toAdmissionMasterId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "WorkflowId", Value: $(`#workflowId`).val().toString() == "" ? null : $("#workflowId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "StageId", Value: $(`#stageId`).val().toString() == "" ? null : $("#stageId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ActionId", Value: $(`#actionId`).val().toString() == "" ? null : $("#actionId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CategoryId", Value: $(`#categoryId`).val().toString() == "" ? null : $("#categoryId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "BasicInsurerId", Value: $(`#basicInsurerId`).val().toString() == "" ? null : $("#basicInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "BasicInsurerLineId", Value: $(`#basicInsurerLineId`).val().toString() == "" ? null : $("#basicInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerId", Value: $(`#compInsurerId`).val().toString() == "" ? null : $("#compInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "CompInsurerLineId", Value: $(`#compInsurerLineId`).val().toString() == "" ? null : $("#compInsurerLineId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "ThirdPartyInsurerId", Value: $(`#thirdPartyInsurerId`).val().toString() == "" ? null : $("#thirdPartyInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "DiscountInsurerId", Value: $(`#discountInsurerId`).val().toString() == "" ? null : $("#discountInsurerId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "PatientId", Value: patientId == 0 ? null : patientId, SqlDbType: dbtype.Int },
        { Item: "FromId", Value: +$(`#fromId`).val() == 0 ? null : +$("#fromId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ToId", Value: +$(`#toId`).val() == 0 ? null : +$("#toId").val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "ItemId", Value: +$(`#itemId`).val() == 0 ? null : +$("#itemId").val(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ContractTypeId", Value: $(`#contractTypeId`).val().toString() == "" ? null : $("#contractTypeId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "VendorId", Value: $(`#vendorId`).val().toString() == "" ? null : $("#vendorId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "UserId", Value: $(`#userId`).val().toString() == "" ? null : $("#userId").val().toString(), SqlDbType: dbtype.NVarChar, Size: 1000 },
        { Item: "FromDate", Value: $(`#fromCreateDateTimePersian`).val() != "" ? convertToMiladiDate($(`#fromCreateDateTimePersian`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToDate", Value: $(`#toCreateDateTimePersian`).val() != "" ? convertToMiladiDate($(`#toCreateDateTimePersian`).val()) : null, SqlDbType: dbtype.Date, Size: 10 },
        { Item: "FromDatePersian", Value: $(`#fromCreateDateTimePersian`).val() != "" ? $(`#fromCreateDateTimePersian`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toCreateDateTimePersian`).val() != "" ? $(`#toCreateDateTimePersian`).val() : "", itemType: "Var" },
        { Item: "VendorName", Value: $(`#vendorId`).val().toString() == "" ? "همه" : $("#vendorId").val().toString(), itemType: "Var" },
        { Item: "Pageno", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Pagerowscount", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 }
    ]
    return repParameters;
}

function export_AdmissionSaleReport_csv() {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    loadingAsync(true, "exportCSV", "fa fa-file-excel");
    $.ajax({
        url: viewData_csv_url,
        type: "get",
        datatype: "text",
        contentType: "text/csv",
        xhrFields: {
            responseType: 'blob'
        },
        data: { stringedModel: JSON.stringify(csvModel) },
        success: function (result) {
            if (result) {
                let element = document.createElement('a');
                element.setAttribute('href', window.URL.createObjectURL(result));
                element.setAttribute('download', `${viewData_form_title}.csv`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                window.URL.revokeObjectURL(viewData_csv_url);
            }
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        },
        error: function (xhr) {
            error_handler(xhr)
            loadingAsync(false, "exportCSV", "fa fa-file-excel");
        }
    });
};

window.Parsley._validatorRegistry.validators.comparedate = undefined
window.Parsley.addValidator('comparedate', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            var value2 = $(`#${requirement}`).val();

            if (value === "" || value2 === "")
                return true;

            var compareResult = compareShamsiDate(value, value2);
            return compareResult;
        }

    },
    messages: {
        en: 'تاریخ شروع از تاریخ پایان بزرگتر است.',
    }
});

window.Parsley._validatorRegistry.validators.chekdoubledate = undefined
window.Parsley.addValidator('chekdoubledate', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            if ((+$("#fromCreateDateTimePersian").val() == 0 || +$("#toCreateDateTimePersian").val() == 0)) return false;

            return true;
        }
    },
    messages: {
        en: 'وارد کردن تاریخ ثبت الزامیست.',
    }
});

window.Parsley._validatorRegistry.validators.shamsidateservice = undefined
window.Parsley.addValidator('shamsidateservice', {
    validateString: function (value) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            if (+value !== 0)
                return isValidShamsiDate(value);
            else
                return true;
        }

    },
    messages: {
        en: 'فرمت تاریخ صحیح نیست .',
    }
});

window.Parsley._validatorRegistry.validators.dateisonemonth = undefined;
window.Parsley.addValidator('dateisonemonth', {
    validateString: function (value, requirement) {
        let patientId = +$("#patientId").val();
        let patientNationalCode = +$("#patientNationalCode").val();
        if (patientId != 0 || patientNationalCode != 0)
            return true;

        else {
            let toDateValue = $(`#${requirement}`).val();
            let fromDateValue = value;
            return checkDateIsOnMonth(fromDateValue, toDateValue);
        }
        

    },
    messages: {
        en: 'بازه تاریخ نمیتواند بیشتر از یک ماه باشد.',
    }
});

initRepAdmissionSaleForm()
