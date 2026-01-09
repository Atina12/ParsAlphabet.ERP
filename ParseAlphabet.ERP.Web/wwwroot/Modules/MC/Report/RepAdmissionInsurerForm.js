
var viewData_controllername = "AdmissionReportApi",
    viewData_form_title = "گزارش بیمه گرها",
    reportUrl = "",
    arrayIdsAS = [],
    form = $('.card-body').parsley(),
    viewData_PreviewReport_GetReport = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurerpreviewgetpage`,
    viewData_PreviewReport_GetHeader = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurerpreviewcolumns`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurerpreviewcsv`,
    valueDate = { from: "", to: "" },
    flagSearch = false,
    arrayDetailReportType = [101, 102, 104, 105, 106, 107, 108, 115],
    reportTypeSwitch = "reportType",
    roleId = getRoleId(),
    filterItemsArr = [],
    filterItemsEditRowVariable = null;


async function initAdmissionReport() {

    $(".select2").select2();

    settingReportModule();
    getHeaderColumns();
    setFilterItemsBox()
    appendToSetting();
    getFilterItems()

    $('#reportTypeFile').bootstrapToggle();
    $("#fromReserveDate").inputmask();
    $("#toReserveDate").inputmask();

    fillConfirmedBySystem();

    fill_select2Stage("stageId");

    $("#basicInsurerLineId").attr("disabled", true);
    $("#compInsurerLineId").attr("disabled", true);

    if ($("#fromReserveDate").val() !== "" && $("#toReserveDate").val() !== "")
        fillElmntAdmission()

    focusInput(1);
}

function setFilterItemsBox() {

    //ایجاد کلیک ها
    let btnContent = `
                      <button type="button" class="btn blue_1" style="border-radius: 0px 3px 3px 0px;margin-left: -11px;">
                            <span id="countOfFilterItemsArr" class="mr-1">0</span>
                      </button>
                      <button id="filterItemsShowBtn" type="button" class="btn blue_1 filterItemsShowBtn" tabindex="-1">
                            <i class="fas fa-sticky-note ml-1"></i>
                            نمایش
                          </button>
                      <button id="filterItemsSaveBtn" type="button" dataedit="save" class="btn blue_1 waves-effect">
                            <i class="fa fa-plus-circle"></i>
                            <span>ذخیره</span>                  
                      </button>
                      <span id="filterItemsSpanBoxName">
                            <input id="filterItemsBoxName" type="text" class="form-control" maxlength="40" autocomplete="off" placeholder="نام مورد فیلتر">
                      </span>
                   `

    $("#filterItemsBox").append(btnContent)

    //ایجاد محتوا
    let content = `    
                     <div id="filterItemsContentBox" class="d-none"></div>
                     <div id="filterItemsContentBoxDetails" class="d-none filterItemsContentBoxDetails"></div>    
                    `
    $("#filterItemsContent").append(content)
}

function appendToSetting() {

    $("#reportSettingModal .modal-body")
        .append(`
                   <div class="col-sm-12 row">
                             <label class="col-sm-12 p-0" style="color: #777;">مرتب سازی</label>
                       <div class="col-lg-8 p-0">
                           <div class="form-group">
                               <div>
                                   <select id="sorting" class="form-control">
                                       <option value="1">تاریخ رزرو - شناسه داکتر</option>
                                       <option value="2">تاریخ ثبت</option>
                                       <option value="3">دپارتمان</option>
                                       <option value="4">شناسه داکتر - تاریخ رزرو</option>
                                       <option value="5">شناسه </option>
                                   </select>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-4 p-0">
                           <input id="sortingMode" type="checkbox" checked data-toggle="toggle" data-on="نزولی" data-off="صعودی" data-onstyle="" data-offstyle="secondary" data-width="100" data-height="27">
                       </div>
                   </div>
`);

    $('#sortingMode').bootstrapToggle();
}

function getFilterItems() {

    let getFilterItems_api = `${viewData_baseUrl_MC}/AdmissionReportApi/getcachereportParameter/${reportCacheParameter.insurance}`

    $.ajax({
        url: getFilterItems_api,
        type: "get",
        async: false,
        success: function (result) {
            if (checkResponse(result)) {
                filterItemsArr = result
                showFilterItems()
            }
        },
        error: function (xhr) {
            error_handler(xhr, getFilterItems_api);
        }
    })
}

function showFilterItems() {

    let filterItems = filterItemsArr
    let filterItemsLength = filterItems.length
    let count = 0

    let strContent = '<div class="d-flex justify-content-center">'

    if (filterItems.length == 0) {

        strContent += '<div style="width:315px;color:red;text-align:center">'
        strContent += 'لیستی برای نمایش موجود نیست'
        strContent += '<div>'
    }
    else {
        strContent += '<ul style="list-style:none;margin-bottom:0px;width:326px;max-height: 245px;overflow-y: auto">'

        for (let i = 0; i < filterItemsLength; i++) {

            let filterItem = filterItems[i].parameters

            strContent += `<li id="filterItem_${i}" class="p-1 m-2 d-flex justify-content-between showHover" data-rowno="${i}" onclick="insertFilterItems(${i},'filterItem_${i}')"  onmouseenter="filterItemsHoverIn(${i})">
                              <div style="width:30px;position:relative">
                                  <div class="d-flex justify-content-center align-items-center showHoverNumber">
                                      ${i + 1}   
                                  </div>
                              </div>
                              <div class="d-flex justify-content-start align-items-center showHoverContent">
                                    ${filterItem.filterItemsArrayName}   
                              </div>
                              <div class="d-flex justify-content-end">
                                   <button type="button"  onclick="setItemsForEdit(event,${i},'${filterItem.filterItemsArrayName}','filterItem_${i}')" style="font-size:7px !important" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit" style="margin-left: 0px;"></i></button>
                                   <button type="button"  onclick="filterItemsDeleteRow(event,${i})" style="font-size:7px !important" class="btn maroon_outline ml-1" title="حذف"><i class="fa fa-trash" style="margin-left: 0px;"></i></button>
                              </div>
                            </li>    
                         `
            count = i + 1
        }

        strContent += "</ul>"
    }

    strContent += "</div>"

    $("#countOfFilterItemsArr").text(count)
    $("#filterItemsContentBox").scrollTop(0)
    $("#filterItemsContentBox").html("")
    $("#filterItemsContentBox").html(strContent)
}

function fillConfirmedBySystem() {
    $("#confirmedBySystem").parent().find(".btn-multipel-more").remove();
    $("#confirmedBySystem").on("change", function () { onchangeMultipel(this) });
    $("#confirmedBySystem").parent().addClass("multiple-maxheight").removeClass("multiple-maxheight-md");
    $("#confirmedBySystem").prepend("<optgroup></optgroup>");
    fillselect2MultiPle("confirmedBySystem", [1, 2, 3, 9], 1);
}

function getDataDropDown(modelFill) {

    var fill_dataSelectAdmissionV1 = `${viewData_baseUrl_MC}/AdmissionApi/getlistadmissioninsurerthirdpartystatev1`;


    let res = $.ajax({
        url: fill_dataSelectAdmissionV1,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(modelFill),
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, fill_dataSelectAdmissionV1);
        }
    });

    return res.responseJSON;
}

async function fillElmntAdmission(callback) {

    let isValid = checkDateIsOnMonth($("#fromReserveDate").val(), $("#toReserveDate").val())

    if (isValid) {
        valueDate.from = $("#fromReserveDate").val();
        valueDate.to = $("#toReserveDate").val();
        fillElmntAdmissionOneByOne(callback);
    }
    else
        emptyElmntAdmissionOneByOne(callback);
}

async function fillElmntAdmissionOneByOne(callback) {

    let modelFill = {
        type: 8,
        basicInsurerIds: "",
        compInsurerIds: "",
        fromReserveDatePersian: $("#fromReserveDate").val(),
        toReserveDatePersian: $("#toReserveDate").val()
    }

    data = getDataDropDown(modelFill);

    await fill_select2WithData(data.workflowList, "workflowId", false, true);
    await fill_select2WithData(data.stageList, "stageId", false, true);
    await fill_select2WithData(data.actionList, "actionId", false, true);
    await fill_select2WithData(data.basicInsurerList, "basicInsurerId", false, true);
    await fill_select2WithData(data.compInsurerList, "compInsurerId", false, true);
    await fill_select2WithData(data.thirdPartyList, "thirdPartyId", false, true);
    await fill_select2WithData(data.discountList, "discountId", false, true);
    await fill_select2WithData(data.attenderList, "attenderId", false, true);
    await fill_select2WithData(data.serviceList, "serviceId", false, true);
    await fill_select2WithData(data.departmentList, "departmentId", false, true);
    await fill_select2WithData(data.serviceTypeList, "serviceTypeId", false, true);
    await fill_select2WithData(data.specialityList, "specialityId", false, true);
    await fill_select2WithData(data.referringDoctorList, "referringDoctorId", false, true);

    if (checkResponse(callback))
        callback()
}

async function emptyElmntAdmissionOneByOne(callback) {

    await fill_select2WithData([], "workflowId", false, true);
    await fill_select2WithData([], "stageId", false, true);
    await fill_select2WithData([], "actionId", false, true);

    await fill_select2WithData([], "basicInsurerId", false, true);
    await fill_select2WithData([], "compInsurerId", false, true);
    await fill_select2WithData([], "thirdPartyId", false, true);
    await fill_select2WithData([], "discountId", false, true);
    await fill_select2WithData([], "attenderId", false, true);
    await fill_select2WithData([], "serviceId", false, true);
    await fill_select2WithData([], "departmentId", false, true);
    await fill_select2WithData([], "serviceTypeId", false, true);
    await fill_select2WithData([], "specialityId", false, true);
    await fill_select2WithData([], "referringDoctorId");

    if (checkResponse(callback))
        callback()
}

async function getReport() {

    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    reportParameters = parameter();
    main_getReport();
};

async function getInsureFile() {
    reportParameters = parameter();
    main_getInsureFile()
}

function pagetable_goToPage(pagetable_currentpage = 1, pagetable_laststate = "") {
    if (pagetable_currentpage === 0)
        pagetable_currentpage = 1;

    main_getInsureFile(pagetable_currentpage, pagetable_laststate)
}

function main_getInsureFile(pagetable_currentpage = 1, pagetable_laststate) {
    reportParameters.isFile = 1
    var isLoadingData = $("#loaderSReaport").hasClass("fa-spinner");
    initialPageing();
    createPageFooterInfo(0, 0, 0, false);
    if (!isLoadingData) {
        getGetInsureFileAsync(reportParameters, pagetable_currentpage, pagetable_laststate, () => {
            $("#dataRowsReport tr:eq(0)").addClass("highlight").focus();
            checkSumDynamic(reportParameters);
        });
    }
}

async function getGetInsureFileAsync(model, pagetable_currentpage, pagetable_laststate, callBack = undefined) {

    let pageRowscount = +$(`#mainReport #dropDownCountersName`).text();

    model.pageRowscount = null;
    $.ajax({
        url: viewData_PreviewReport_GetReport,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            var dataLength = result.data.length

            pagetable_lastpage = Math.ceil(dataLength / pageRowscount)

            if (pagetable_laststate == "nextpage") {
                if (pagetable_currentpage < pagetable_lastpage)
                    pagetable_currentpage++;
            }
            else if (pagetable_laststate == "prevpage") {
                if (pagetable_currentpage > 1)
                    pagetable_currentpage--;
            }
            if (pagetable_currentpage === 0)
                pagetable_currentpage = 1

            pagetable_pagination(pagetable_lastpage, pagetable_currentpage)
            let newResult = makeNewResult(pagetable_currentpage, pagetable_lastpage, pageRowscount, result, dataLength)

            appendDataRow(newResult, callBack, "mainReport", true);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_PreviewReport_GetReport);
            loadingAsync(false, "getReport", "fas fa-sticky-note");
            refreshBackData(model.pageno, model.pagerowscount);
            return null;
        }
    });
}

function pagetable_pagination(max, pageno, pg_id = "mainReport") {
    $(`#${pg_id} .pagination`).html("");

    var str = "";
    if (pageno == 1)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_goToPage(' + (pageno - 1).toString() + ',\'' + pg_id + '\' )" tabindex="-1">قبلی</button>';
    str += '</li>';
    var br = 5;
    if (max <= 7) {
        for (i = 1; i <= max; i++) {
            if (i == pageno) {
                str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
            else {
                str += '<li class="page-item"><button class="page-link' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
            }
        }
    }
    else
        if (pageno < br)
            for (i = 1; i <= max; i++) {
                if (i == pageno) {
                    str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                }
                else {
                    if (i <= br || i == max)
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    if (i == br) {
                        str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                    }
                }
            }
        else
            if (pageno >= br && pageno <= max - br + 1)
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                        str += '<li class="page-item"><button class="page-link" onclick="javascript:pagetable_goToPage(' + (i - 1).toString() + ',\'' + pg_id + '\')">' + (i - 1).toString() + '</button></li>';
                        str += '<li class="page-item active"><button class="page-link" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + (i + 1).toString() + ',\'' + pg_id + '\')">' + (i + 1).toString() + '</button></li>';
                        str += '<li class="page-item disabled"><button class="page-link" onclick="#">...</button></li>';
                    }
                    else {
                        if (i == 1 || i == max)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                }
            else
                for (i = 1; i <= max; i++) {
                    if (i == pageno) {
                        str += '<li class="page-item active"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                    }
                    else {
                        if (i == 1 || i > max - br)
                            str += '<li class="page-item"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="javascript:pagetable_goToPage(' + i.toString() + ',\'' + pg_id + '\')">' + i.toString() + '</button></li>';
                        if (i == max - br) {
                            str += '<li class="page-item disabled"><button class="page-link ' + (i == max ? ' pagetablemaxpage' : '') + '" onclick="#">...</button></li>';
                        }
                    }
                }
    if (pageno == max)
        str += '<li class="page-item disabled">';
    else
        str += '<li class="page-item">';
    str += '<button class="page-link" onclick="javascript:pagetable_goToPage(' + (pageno + 1).toString() + ',\'' + pg_id + '\')" tabindex="-1">بعدی</button>';
    str += '</li>';

    $(`#${pg_id} .pagination`).append(str);
}

function makeNewResult(pagetable_currentpage, pagetable_lastpage, pageRowscount, result, dataLength) {
    let startData = ((pagetable_currentpage - 1) * pageRowscount)
    let lenNewResult = (startData + pageRowscount);
    let data = []
    let newResult = {}

    if (pagetable_currentpage != pagetable_lastpage && checkResponse(result) && dataLength != 0) {
        for (i = startData; i < lenNewResult; i++) {
            data.push(result.data[i]);
        }
    } else {
        let lenNewResultLastPage = startData + (dataLength - startData)
        for (i = startData; i < lenNewResultLastPage; i++) {
            data.push(result.data[i]);
        }
    }
    newResult = { columns: result.columns, data: data }
    return newResult
}

function onkeyDownRowReport(e) {
    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;

    let pagetable_currentpage = $("#mainReport .pagination .active button").text()

    if (reportTypeSwitch == "reportType") {
        if (e.keyCode === KeyCode.ArrowUp)
            if ($(e.target).prev().length != 0) {
                $(`#dataRowsReport tr`).removeClass("highlight");
                $(e.target).prev().focus().addClass("highlight");
            }

        if (e.keyCode === KeyCode.ArrowDown)
            if ($(e.target).next().length != 0) {
                $(`#dataRowsReport tr`).removeClass("highlight");
                $(e.target).next().focus().addClass("highlight");
            }
    }
    else if (reportTypeSwitch == "reportInsureFile") {
        if (e.keyCode === KeyCode.ArrowUp)
            if ($(e.target).prev().length != 0) {
                $(`#dataRowsReport tr`).removeClass("highlight");
                $(e.target).prev().focus().addClass("highlight");
            } else {
                pagetable_goToPage(pagetable_currentpage, "prevpage")
            }

        if (e.keyCode === KeyCode.ArrowDown)
            if ($(e.target).next().length != 0) {
                $(`#dataRowsReport tr`).removeClass("highlight");
                $(e.target).next().focus().addClass("highlight");
            } else {
                pagetable_goToPage(pagetable_currentpage, "nextpage")
            }
    }
}

function validationPrint() {

    let validate = form.validate();
    validateSelect2(form);
    if (!validate) return false;

    if ($("#fromReserveDate").val() !== "" && $("#toReserveDate").val() !== "")
        if (!compareShamsiDate($("#fromReserveDate").val(), $("#toReserveDate").val())) {
            var msg = alertify.error("تاریخ شروع از تاریخ پایان بزرگتر است");
            msg.delay(alertify_delay);
            return false;
        }

    return true;
}

function createPrintModel() {

    let reportParameterStimul = [], reportType = +$("#reportType").val(), typeValue = 0, reportModel = {};

    if (reportType == 112)
        typeValue = 4;
    else if (reportType == 111)
        typeValue = 3
    else if (reportType == 110)
        typeValue = 2
    else
        typeValue = 1;

    reportParameterStimul = createReportParameter(reportType, typeValue)

    reportModel = { reportName: `${viewData_form_title} ${$("#reportType option:selected").text()}`, reportUrl: reportUrl, parameters: reportParameterStimul, reportSetting: reportSettingModel };

    return reportModel;
}

function createReportParameter(reportType, typeValue) {

    let checkTypeforTypeFiled = checkExistValueInArray([109, 110, 111, 112], reportType);

    let checkTypeforPagenoFiled = checkExistValueInArray(arrayDetailReportType, reportType);

    // Same as preview

    //101,102,104,105,106,107,108,115 -  mc.Spr_AdmissionServiceInsuranceDetailReportPreview
    //103 - mc.Spr_AdmissionServiceInsuranceSummaryReportPreview
    //109,110,111,112 -  mc.Spr_AdmissionService_Insurnace
    // 113 - mc.Spc_AdmissionServiceBasicInsuranceBill
    // 114 - mc.Spc_AdmissionServiceCompInsuranceBill

    let repParameters = [
        { Item: "FromReserveDate", Value: $(`#fromReserveDate`).val() != "" ? convertToMiladiDate($(`#fromReserveDate`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "ToReserveDate", Value: $(`#toReserveDate`).val() != "" ? convertToMiladiDate($(`#toReserveDate`).val()) : "", SqlDbType: dbtype.Date, Size: 10 },
        { Item: "StageIds", Value: $(`#stageId`).val().toString() == "" ? null : $(`#stageId`).val().toString(), SqlDbType: dbtype.Int, Size: 500 },
        { Item: "WorkflowIds", Value: $(`#workflowId`).val().toString() == "" ? null : $(`#workflowId`).val().toString(), SqlDbType: dbtype.Int, Size: 500 },
        { Item: "ActionIds", Value: $(`#actionId`).val().toString() == "" ? null : $(`#actionId`).val().toString(), SqlDbType: dbtype.Int, Size: 500 },
        { Item: "ConfirmedBySystems", Value: $(`#confirmedBySystem`).val().toString() == "" ? null : $(`#confirmedBySystem`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 12 },
        { Item: "ConfirmedBasicSharePrice", Value: +$(`#confirmedBasicSharePrice`).val() == -1 ? null : +$(`#confirmedBasicSharePrice`).val(), SqlDbType: dbtype.SmallInt, Size: 0 },
        { Item: "ConfirmedCompSharePrice", Value: +$(`#confirmedCompSharePrice`).val() == -1 ? null : +$(`#confirmedCompSharePrice`).val(), SqlDbType: dbtype.SmallInt, Size: 0 },
        { Item: "BasicInsurerIds", Value: $(`#basicInsurerId`).val().toString() == "" ? null : $(`#basicInsurerId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "BasicInsurerLineIds", Value: $(`#basicInsurerLineId`).val().toString() == "" ? null : $(`#basicInsurerLineId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "CompInsurerIds", Value: $(`#compInsurerId`).val().toString() == "" ? null : $(`#compInsurerId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "CompInsurerLineIds", Value: $(`#compInsurerLineId`).val().toString() == "" ? null : $(`#compInsurerLineId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "ThirdPartyInsurerIds", Value: $(`#thirdPartyId`).val().toString() == "" ? null : $(`#thirdPartyId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "DiscountInsurerIds", Value: $(`#discountId`).val().toString() == "" ? null : $(`#discountId`).val().toString(), SqlDbType: dbtype.VarChar, Size: 1000 },
        { Item: "DepartmentIds", Value: $(`#departmentId`).val().toString() == "" ? null : $(`#departmentId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "AttenderIds", Value: $(`#attenderId`).val().toString() == "" ? null : $(`#attenderId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 4000 },
        { Item: "SpecialityIds", Value: $(`#specialityId`).val().toString() == "" ? null : $(`#specialityId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 8000 },
        { Item: "ServiceTypeIds", Value: $(`#serviceTypeId`).val().toString() == "" ? null : $(`#serviceTypeId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "ServiceIds", Value: $(`#serviceId`).val().toString() == "" ? null : $(`#serviceId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 8000 },
        { Item: "ReferringDoctorIds", Value: $(`#referringDoctorId`).val() == "" ? null : $(`#referringDoctorId`).val().toString(), SqlDbType: dbtype.NVarChar, Size: 500 },
        { Item: "IsBasicShareAmount", Value: +$(`#isBasicSharePrice`).val() == -1 ? null : +$(`#isBasicSharePrice`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsCompShareAmount", Value: +$(`#isCompSharePrice`).val() == -1 ? null : +$(`#isCompSharePrice`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsThirdPartyAmount", Value: +$(`#isThirdParty`).val() == -1 ? null : +$(`#isThirdParty`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "IsDiscountAmount", Value: +$(`#isDiscount`).val() == -1 ? null : +$(`#isDiscount`).val(), SqlDbType: dbtype.Int, Size: 0 },
        { Item: "BasicInsurer", Value: $(`#basicInsurerId`).val().toString() != "" && $(`#basicInsurerId`).val().length == 1 ? $("#basicInsurerId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "BasicInsurerBox", Value: $(`#basicInsurerLineId`).val().toString() != "" && $(`#basicInsurerLineId`).val().length == 1 ? $("#basicInsurerLineId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "CompInsurer", Value: $(`#compInsurerLineId`).val().toString() != "" && $(`#compInsurerLineId`).val().length == 1 ? $("#compInsurerLineId").select2('data')[0].text : 0, itemType: "Var" },
        { Item: "FromDatePersian", Value: $(`#fromReserveDate`).val() != "" ? $(`#fromReserveDate`).val() : "", itemType: "Var" },
        { Item: "ToDatePersian", Value: $(`#toReserveDate`).val() != "" ? $(`#toReserveDate`).val() : "", itemType: "Var" },
        { Item: "RoleId", Value: roleId, SqlDbType: dbtype.TinyInt, Size: 0 },
    ];

    if (checkTypeforPagenoFiled)
        repParameters.push(
            { Item: "OrderBy", Value: $(`#sorting`).val(), SqlDbType: dbtype.NVarChar, Size: 100 },
            { Item: "OrderByDestination", Value: $("#sortingMode").prop("checked") ? 1 : 2, SqlDbType: dbtype.TinyInt, Size: 0 },
            { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
            { Item: "PageRowsCount", Value: null, SqlDbType: dbtype.Int, Size: 0 }
        );

    if (checkTypeforTypeFiled)
        repParameters.push({ Item: "Type", Value: typeValue, SqlDbType: dbtype.TinyInt, Size: 0 });

    return repParameters;
}
 
function modal_closePreviewRepor(modal_name) {
    var form = $(`#${modal_name} div.modal-body`).parsley();
    $(`#${modal_name} div.modal-body *`).removeClass("parsley-error");
    form.reset();

    modal_close(modal_name);
    $(`#${modal_name} .pagerowscount`).removeClass("dropup");
};

function parameter() {

    let parameters =
    {
        fromReserveDatePersian: $("#fromReserveDate").val() == "" ? null : $("#fromReserveDate").val(),
        toReserveDatePersian: $("#toReserveDate").val() == "" ? null : $("#toReserveDate").val(),
        workflowIds: $("#workflowId").val() == "" ? null : $("#workflowId").val().toString(),
        stageIds: $("#stageId").val() == "" ? null : $("#stageId").val().toString(),
        actionIds: $("#actionId").val() == "" ? null : $("#actionId").val().toString(),
        basicInsurerIds: $("#basicInsurerId").val() == "" ? null : $("#basicInsurerId").val().toString(),
        basicInsurerLineIds: $("#basicInsurerLineId").val() == "" ? null : $("#basicInsurerLineId").val().toString(),
        compInsurerIds: $("#compInsurerId").val() == "" ? null : $("#compInsurerId").val().toString(),
        compInsurerLineIds: $("#compInsurerLineId").val() == "" ? null : $("#compInsurerLineId").val().toString(),
        thirdPartyInsurerIds: $("#thirdPartyId").val() == "" ? null : $("#thirdPartyId").val().toString(),
        discountInsurerIds: $("#discountId").val() == "" ? null : $("#discountId").val().toString(),
        attenderIds: $("#attenderId").val() == "" ? null : $("#attenderId").val().toString(),
        departmentIds: $("#departmentId").val() == "" ? null : $("#departmentId").val().toString(),
        specialityIds: $("#specialityId").val() == "" ? null : $("#specialityId").val().toString(),
        referringDoctorIds: $("#referringDoctorId").val() == "" ? null : $("#referringDoctorId").val().toString(),
        serviceTypeIds: +$("#serviceTypeId").val() == 0 ? null : $("#serviceTypeId").val().toString(),
        serviceIds: $("#serviceId").val() == "" ? null : $("#serviceId").val().toString(),
        confirmedBySystems: $("#confirmedBySystem").val() == "" ? null : $("#confirmedBySystem").val().toString(),
        confirmedBasicSharePrice: +$("#confirmedBasicSharePrice").val() == -1 ? null : +$("#confirmedBasicSharePrice").val(),
        confirmedCompSharePrice: +$("#confirmedCompSharePrice").val() == -1 ? null : +$("#confirmedCompSharePrice").val(),
        isBasicShareAmount: +$("#isBasicSharePrice").val() == -1 ? null : +$("#isBasicSharePrice").val(),
        isCompShareAmount: +$("#isCompSharePrice").val() == -1 ? null : +$("#isCompSharePrice").val(),
        isThirdPartyAmount: +$("#isThirdParty").val() == -1 ? null : +$("#isThirdParty").val(),
        isDiscountAmount: +$("#isDiscount").val() == -1 ? null : +$("#isDiscount").val(),
        orderBy: $("#sorting").val(),
        orderByDestination: $("#sortingMode").prop("checked") ? 2 : 1,
        pageNo: 0,
        pageRowsCount: +$(`#dropDownCountersName`).text()
    };
    return parameters;
}

function getFileInsurerXml(modelReport, basicInsurerLineName) {

    var fileTitle = ""

    if (basicInsurerLineName == null)
        fileTitle = "فایل بیمه"
    else
        fileTitle = basicInsurerLineName.trim()



    var url = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionarmedinsurance`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "text",
        contentType: "application/json",
        data: JSON.stringify(modelReport),
        async: false,
        cache: false,
        success: function (response) {

            $("#exportFileInsuranceSeparation").prop("disabled", false);
            $("#exportFileInsuranceAggregation").prop("disabled", false);

            if (response != "")
                generateTxtFile(response, fileTitle);
            else {
                var alert = alertify.warning("سطری وجود ندارد");
                alert.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
            $("#exportFileInsuranceSeparation").prop("disabled", false);
            $("#exportFileInsuranceAggregation").prop("disabled", false);
        }
    });
}

async function getDataSearchElemnts(type, search = false, isEndElement = false) {

    var url, model;
    if (type == "service") {
        url = `${viewData_baseUrl_MC}/ServiceApi/getserviceadmissionlist`;
        model = {
            fromReserveDatePersian: $("#fromReserveDate").val() == null ? "" : $("#fromReserveDate").val(),
            toReserveDatePersian: $("#toReserveDate").val() == null ? "" : $("#toReserveDate").val(),
            serviceId: $("#idSearch").val() == null || $("#idSearch").val() == '' ? null : +$("#idSearch").val(),
            serviceName: $("#codeSearch").val() == null || $("#codeSearch").val() == '' ? null : $("#codeSearch").val(),
            servicecode: $("#nameSearch").val() == null || $("#nameSearch").val() == '' ? null : +$("#nameSearch").val(),
        };
        $("#nameModalSearch").text("خدمات");
        $("#nameModalSearch").addClass("service-type");
        $("#nameModalSearch").removeClass("attender-type");
        $(".namesSearch:not(label)").removeClass("col-width-percent-75").addClass("col-width-percent-10");
        $(".codesSearch:not(label)").removeClass("col-width-percent-15").addClass("col-width-percent-80");
        $(".namesSearchBox").removeClass("col-lg-7").addClass("col-lg-2");
        $(".codesSearchBox").removeClass("col-lg-2").addClass("col-lg-7");
        $("#nameSearch").addClass("number");
        $("#codeSearch").removeClass("number");
    }
    else {

        url = `${viewData_baseUrl_MC}/AttenderApi/getattenderadmissionlist`;
        model = {
            fromReserveDatePersian: $("#fromReserveDate").val() == null ? null : $("#fromReserveDate").val(),
            toReserveDatePersian: $("#toReserveDate").val() == null ? null : $("#toReserveDate").val(),
            attenderId: $("#idSearch").val() == null || $("#idSearch").val() == '' ? null : +$("#idSearch").val(),
            attenderName: $("#nameSearch").val() == null || $("#nameSearch").val() == '' ? null : $("#nameSearch").val(),
            mSC: $("#codeSearch").val() == null || $("#codeSearch").val() == '' ? null : $("#codeSearch").val(),
        };
        $("#nameModalSearch").text("داکتران");
        $("#nameModalSearch").addClass("attender-type");
        $("#nameModalSearch").removeClass("service-type");
        $(".namesSearch:not(label)").removeClass("col-width-percent-10").addClass("col-width-percent-75");
        $(".codesSearch:not(label)").removeClass("col-width-percent-80").addClass("col-width-percent-15");
        $(".namesSearchBox").removeClass("col-lg-2").addClass("col-lg-7");
        $(".codesSearchBox").removeClass("col-lg-7").addClass("col-lg-2");
        $("#nameSearch").removeClass("number");
        $("#codeSearch").addClass("number");
    }

    $(".namesSearch").text(type == "service" ? "نمبر تذکره" : "نام و  تخلص");
    $(".codesSearch").text(type == "service" ? "نام" : "نظام داکتری");

    flagSearch = false;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            appendSearchElemnts(data, type, search)
                .then(res => {
                    if (+res != 0) {
                        if (!search)
                            modal_show(`searchElementsModal`);
                        else
                            $(`#tempSearchElements tr`).removeClass("highlight");

                        $("#checkAllElements").prop("checked", $(`.checkSearch`).toArray().every(x => x.checked == true));
                    }
                    else {
                        if (search) $("#tempSearchElements").html(fillEmptyRow(4));
                        else {
                            var msg = alertify.warning(`برای تاریخ رزرو مشخص شده ${type == "service" ? "خدمتی" : "معالجی"} وجود ندارد`);
                            msg.delay(alertify_delay);
                        }
                    }
                });
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });
    return true;
}

async function appendSearchElemnts(data, type, search = false) {

    var dataLength = data.length;
    $("#tempSearchElements").html("");
    if (dataLength == 0)
        return 0;
    else {
        if (!search) {
            arrayIdsAS = [];
            let output = '', details = null, id = 0;
            for (var i = 0; i < dataLength; i++) {

                details = data[i];
                id = type == "service" ? details.id : details.attenderId;
                arrayIdsAS.push({ id: type == "service" ? details.id : details.attenderId, name: details.name, checked: false });

                output += `<tr tabindex="-1" id="row__${+i + 1}" onkeydown="eventTrTable(${+i + 1},event,${dataLength})" onclick="eventclickRow(${+i + 1})">
                          <td class="text-center"><input class="checkSearch" type="checkbox" onchange="changeCheckBox(this)" id="c_${id}" /></td> 
                          <td> ${id}</td>
                          <td> ${type == "service" ? details.code : details.name}</td>
                          <td> ${type == "service" ? details.name : details.msc}</td>
                     </tr>`;
            }
            $(output).appendTo("#tempSearchElements");
        }
        else {
            let output = '', details = null, indexOfElement = 0, id = 0;
            for (var i = 0; i < dataLength; i++) {

                details = data[i];
                id = type == "service" ? details.id : details.attenderId;
                indexOfElement = arrayIdsAS.findIndex((x) => +x.id == +id);
                output += `<tr tabindex="-1" id="row__${+i + 1}" onkeydown="eventTrTable(${+i + 1},event,${dataLength})" onclick="eventclickRow(${+i + 1})">
                          <td class="text-center"><input class="checkSearch" type="checkbox" ${arrayIdsAS[indexOfElement].checked ? "checked" : ""}  onchange="changeCheckBox(this)" id="c_${id}" /></td> 
                          <td> ${id}</td>
                          <td> ${type == "service" ? details.code : details.name}</td>
                          <td> ${type == "service" ? details.name : details.msc}</td>
                     </tr>`;
            }
            $(output).appendTo("#tempSearchElements");
        }
        return 1;
    }

}

function changeCheckBox(elm) {
    let isChecked = $(elm).prop("checked"), indexOfElement = 0;

    indexOfElement = arrayIdsAS.findIndex((x) => +x.id == +$(elm).prop("id").split("_")[1]);
    arrayIdsAS[indexOfElement].checked = isChecked;

    $("#checkAllElements").prop("checked", $(`.checkSearch`).toArray().every(x => x.checked == true));
}

function eventTrTable(row, e, countRow) {

    e.preventDefault();

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Space].indexOf(e.keyCode) < 0) return;

    $(`#tempSearchElements tr`).removeClass("highlight");
    var mode = $(`#row__${row} .checkSearch`).prop("checked") ? false : true;
    if (e.keyCode === KeyCode.ArrowUp)
        if (row > 1)
            $(`#row__${row - 1}`).addClass("highlight").focus();
        else
            $(`#row__${row}`).addClass("highlight").focus();


    if (e.keyCode === KeyCode.ArrowDown)
        if (row < countRow)
            $(`#row__${row + 1}`).focus().addClass("highlight");
        else
            $(`#row__${row}`).focus().addClass("highlight");


    if (e.keyCode === KeyCode.Space) {
        $(`#row__${row}`).addClass("highlight").focus();
        $(`#row__${row} .checkSearch`).prop("checked", mode).trigger("change");
    }

}

function eventclickRow(row) {

    $(`#tempSearchElements tr`).removeClass("highlight");
    $(`#row__${row}`).focus().addClass("highlight");
};

async function fill_select2PostMetod(p_url, elementid, param = 0, isNotMultipel = true, selectabel = false) {
    var query = {}, arrayIds = [], placeholder = "";
    $(`#${elementid}`).html("");


    $.ajax({
        url: p_url,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (result) {
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
        },
        error: function (xhr) {
            error_handler(xhr, p_url);
        }
    });
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

async function resetFilterForms(todayDate) {

    $(".card-body select.form-control:not([multiple]),.card-body select.select2:not([multiple])").prop("selectedIndex", 0).trigger("change");
    $(".card-body select[multiple]").val("").trigger("change");

    $(".card-body input.form-control:not(.persian-date,[placeholder='__:__'])").val("");

    if (todayDate != null) {
        $("#filterItemsContentBox ul > li > div:nth-child(2) ").css("color", "black")
        $(".card-body input.form-control.persian-date").val(todayDate);
        resetBtnInputFilterItemList()
    }

    $(".card-body .funkyradio input:checkbox").prop("checked", false).trigger("change");
}

async function saveAndEditFilterItems(editsave) {

    let filterItemsBoxName = $("#filterItemsBoxName").val().trim()
    let filterItemsArray = []

    //اعتبار سنجی از تاریخ تا تاریخ
    let validate = await validateElements()
    if (!validate)
        return


    //چک کردن موجود بودن نام فیلتر مشابه
    let checkTheSameFilterType = await checkTheSameFilterTypeFunc(filterItemsBoxName)
    if (checkTheSameFilterType)
        return


    ////حداقل یک بیمه اجباری باید وارد شده باشد
    //let haveVisitInTheEnteredPeriod = await haveVisitInTheEnteredPeriodFunc()
    //if (haveVisitInTheEnteredPeriod)
    //    return


    //ذخیره مورد فیلتر ها در آرایه 
    let { checkingTheNumberOfEnteredFilters, newfilterItemsArray } = await saveFilterItemsArrfunc()


    //حداقل 5 مورد فیلتر باید وارد شده باشد - به غیر 
    //(از وضعیت - کسور بیمه اجباری - کسور بیمه تکمیلی - سهم بیمه اجباری - سهم بیمه تکمیلی - سهم  طرف قرار داد - سهم تخفیف - وضعیت طرف قرار داد)
    if (checkingTheNumberOfEnteredFilters < 3) {
        var msg = alertify.warning("حداقل 3 مورد از بین بیمه ها ، تب داکتر و خدمت وارد شود");
        msg.delay(8);
        return
    }


    //فقط مواردی که دارای مقدار هستند نگهداری شوند
    let filterItemsArrayJustFilled = await filterItemsArrayJustFilledFunc(newfilterItemsArray)
    filterItemsArray = filterItemsArrayJustFilled


    //چک کردن مورد فیلترهای جدید با ذخیره شده های قبلی
    let { isSimilarArr } = await checkingFiltersItemSavedOnesFunc(editsave, filterItemsArray)
    if (isSimilarArr)
        return

    //ذخیره و بروزرسانی
    if (editsave == 'save') {
        saveFilterItems(filterItemsBoxName, filterItemsArray, () => {
            showFilterItems()
        })
    }
    else {
        editFilterItems(filterItemsBoxName, filterItemsArray, () => {
            showFilterItems()
        })
    }

    $("#filterItemsBoxName").val("")
}

function validateElements() {

    let fromReserveDateValid = $('#fromReserveDate').parsley();
    let toReserveDateValid = $('#toReserveDate').parsley();

    let isFromReserveDateValid = fromReserveDateValid.validate()
    let isToReserveDateValid = toReserveDateValid.validate()

    if (isFromReserveDateValid != true || isToReserveDateValid != true) {
        $("#fromReserveDate").focus()
        return false
    }

    return true
}

async function saveFilterItems(filterItemsArrayName, filterItemsArray, callback) {

    let model = {
        reportType: reportCacheParameter.insurance,
        parameters: { filterItemsArrayName, filterItemsArray }
    }

    let saveFilterItems_api = `${viewData_baseUrl_MC}/AdmissionReportApi/addcachereportParameter`

    $.ajax({
        url: saveFilterItems_api,
        type: "post",
        dataType: "text",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {
            if (checkResponse(result) && result.length != 0) {

                model.keyParameter = result;

                filterItemsArr.push(model)

                var msg = alertify.success(`مورد فیلتر (${filterItemsArrayName}) با موفقیت ذخیره شد.`);
                msg.delay(alertify_delay);

                callback()
            }
            else {
                var msg = alertify.error(`ذخیره انجام نشد به مدیر سیستم اطلاع دهید`);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, saveFilterItems_api);
        }
    })

}

function editFilterItems(filterItemsArrayName, filterItemsArray, callback) {


    $("#filterItemsSaveBtn").attr("dataedit", 'save')
    $("#filterItemsBoxName").val("").prop("disabled", false)
    $("#filterItemsSaveBtn span").text("ذخیره")

    let newFilterItemsArr = filterItemsArr[filterItemsEditRowVariable]

    let model = {
        keyParameter: newFilterItemsArr.keyParameter,
        reportType: newFilterItemsArr.reportType,
        parameters: { filterItemsArrayName, filterItemsArray }
    }


    let updateFilterItems_api = `${viewData_baseUrl_MC}/AdmissionReportApi/updatecachereportParameter`

    $.ajax({
        url: updateFilterItems_api,
        type: "post",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (result) {

            if (result) {

                filterItemsArr[filterItemsEditRowVariable].keyParameter = model.keyParameter
                filterItemsArr[filterItemsEditRowVariable].parameters = model.parameters
                filterItemsArr[filterItemsEditRowVariable].reportType = model.reportType

                var msg = alertify.success(`مورد فیلتر (${newFilterItemsArr.parameters.filterItemsArrayName}) با موفقیت بروزرسانی شد.`);
                msg.delay(alertify_delay);

                callback()

            }
            else {
                var msg = alertify.error(`بروزرسانی انجام نشد به مدیر سیستم اطلاع دهید `);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {

            error_handler(xhr, updateFilterItems_api);
        }
    })

}

function setItemsForEdit(e, row, itemName, filterItemId) {
    e.stopPropagation();

    $("#filterItemsSaveBtn").attr("dataedit", 'edit')
    $("#filterItemsBoxName").val(itemName)
    $("#filterItemsSaveBtn span").text("ویرایش")
    $("#filterItemsContentBox ul > li > div:nth-child(2)").css("color", "black")
    $(`#${filterItemId} > div:nth-child(2)`).css("color", "red")
    filterItemsEditRowVariable = row

    setFilters(row, false)
}

function insertFilterItems(row, filterItemId) {

    $("#filterItemsContentBox ul > li > div:nth-child(2)").css("color", "black")
    $(`#${filterItemId}> div:nth-child(2)`).css("color", "red")

    setFilters(row, true)
}

async function setFilters(row, editOrInsert = true) {

    if (editOrInsert)
        resetBtnInputFilterItemList()

    resetFilterForms(null)

    let newFilterItemsArr = filterItemsArr[row]
    let filterItems = newFilterItemsArr.parameters.filterItemsArray
    let filterItemsLength = filterItems.length

    let fromReserveDate = await filterItems.find(item => item.id == "fromReserveDate")
    $("#fromReserveDate").val(fromReserveDate.value)

    let toReserveDate = await filterItems.find(item => item.id == "toReserveDate")
    $("#toReserveDate").val(toReserveDate.value).trigger("input", [() => {

        for (let i = 0; i < filterItemsLength; i++) {

            let filterItem = filterItems[i]
            let filterItemType = filterItem.type
            let filterItemValue = filterItem.value;
            let filterItemElmId = filterItem.id;
            let filterItemElement = $(`#${filterItemElmId}`)

            if (filterItemType == 'SELECT') {

                if (filterItemElement.hasClass("select2")) {

                    let isMultiple = filterItemElement.attr("multiple") !== undefined;

                    if (isMultiple) {
                        $(`#clear_${filterItemElmId}`).click()

                        $(`#${filterItemElmId}`).select2("close");
                        $(`#${filterItemElmId}`).val(filterItemValue).trigger("change");
                    }
                    else
                        $(`#${filterItemElmId}`).val(filterItemElement).trigger("change");
                }
                else
                    filterItemElement.val(filterItemValue).trigger("change");
            }
            else if (filterItemType == 'INPUT') {
                if (filterItemElmId != "fromReserveDate" && filterItemElmId != "toReserveDate")
                    filterItemElement.val(filterItemValue).trigger("input")
            }
            else if (filterItemType == 'CHECKBOX') {
                filterItemElement.prop("checked", filterItemValue).trigger("change")
            }
        }
    }])
}

function filterItemsDeleteRow(e, row) {
    e.stopPropagation()
    e.preventDefault()

    resetBtnInputFilterItemList()

    let model = {
        keyParameter: filterItemsArr[row].keyParameter,
        reportType: filterItemsArr[row].reportType
    }

    let deleteFilterItems_api = `${viewData_baseUrl_MC}/AdmissionReportApi/removecachereportParameter/${model.reportType}/${model.keyParameter}`

    $.ajax({
        url: deleteFilterItems_api,
        type: "get",
        async: false,
        success: function (result) {

            if (result) {
                let deleteItemName = filterItemsArr[row].parameters.filterItemsArrayName

                let msg = alertify.success(`مورد فیلتر (${deleteItemName}) با موفقیت حذف شد.`);
                msg.delay(alertify_delay);

                filterItemsArr = filterItemsArr.filter((item, index) => index != row)

                showFilterItems()

            }
            else {
                var msg = alertify.error("حذف انجام نشد به مدیر سیستم اطلاع دهید");
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, deleteFilterItems_api);
        }
    })

}

function showFilterItemsDetails(row) {

    let newFilterItems = filterItemsArr[row].parameters
    let newFilterItemsDetails = newFilterItems.filterItemsArray
    let newFilterItemsDetailsLength = newFilterItemsDetails.length
    let newFilterItemsArrayName = newFilterItems.filterItemsArrayName

    let strContent = '<div class="d-flex flex-column" style="overflow-y: auto;max-height:244px;min-width:300px">'
    strContent += `<div style="width:100%;padding:0px 4px 0px 4px"><div style="width:100%;text-align:center;background-color : #B9F6CA;border-radius:10px 0px 10px 0px" class="d-flex justify-content-center">${newFilterItemsArrayName}</div></div>`
    strContent += '<ul style="list-style:none;margin-bottom:0px">'


    for (let i = 0; i < newFilterItemsDetailsLength; i++) {

        let filterItem = newFilterItemsDetails[i]
        let content = ""

        if (filterItem.type == 'SELECT') {

            if ($(`#${filterItem.id}`).hasClass("select2")) {
                if (filterItem.value.length !== 0) {

                    //for (let j = 0; j < filterItem.value.length; j++) {
                    //    content += filterItem.value[j] + " / "
                    //}

                    content = "دارد"
                }
            }
            else {
                let selectVal = filterItem.value[0]

                if (selectVal == -1)
                    content = ""
                else if (selectVal == 1)
                    content = "دارد"
                else if (selectVal == 2 || selectVal == 0)
                    content = "ندارد"
            }

        }
        else if (filterItem.type == 'INPUT') {
            if (checkResponse(filterItem) && filterItem != "")
                content = filterItem.value
        }
        else if (filterItem.type == 'CHECKBOX') {

            let element = $(`#${filterItem.id}`)
            let switchValue = $(element).attr("switch-value").split(',');

            if ($(element).prop("checked"))
                content = switchValue[0]
            else
                content = switchValue[1]
        }


        strContent += `<li class="p-1 m-2 d-flex justify-content-start" style="cursor: pointer;position:relative;box-shadow: 0px 0px 2px rgba(0,0,0,0.5);border-radius:5px;white-space: nowrap;">
                          <div style="width:30px;position:relative">
                              <div class="d-flex justify-content-center align-items-center" style="position:absolute;top:-3px;right:-3px;width:28px;height:28px;border-radius:0px 5px 5px 0px;background-color:#B9F6CA;color:black">
                                 ${i + 1}   
                              </div>
                          </div> 
                          <div class="d-flex justify-content-start align-items-center" style="overflow: hidden;font-size:13px;" >
                                <div>${filterItem.label} : </div>
                                <div style="${content == '' ? 'background-color:rgb(255, 55, 0,0.3)' : ''}">${content == "" ? "داده ای ثبت نشده است" : content}</div>    
                          </div>
                        </li>    
                       `
    }

    strContent += "</ul></div>"

    $("#filterItemsContentBoxDetails").scrollTop(0)
    $("#filterItemsContentBoxDetails").html("")
    $("#filterItemsContentBoxDetails").html(strContent)
    $("#filterItemsContentBoxDetails").removeClass("d-none")
}

function checkTheSameFilterTypeFunc(filterItemsBoxName) {

    let res = false

    if (filterItemsBoxName != "") {
        if (filterItemsArr.length != 0) {
            for (let i = 0; i < filterItemsArr.length; i++) {

                if (filterItemsEditRowVariable != null) {
                    if (filterItemsArr[i].parameters.filterItemsArrayName == filterItemsArr[filterItemsEditRowVariable].parameters.filterItemsArrayName)
                        continue
                    else {
                        if (filterItemsArr[i].parameters.filterItemsArrayName == filterItemsBoxName) {
                            var msg = alertify.warning(`مورد فیلتر با نام (${filterItemsBoxName}) موجود است.`);
                            msg.delay(alertify_delay);
                            res = true
                        }
                    }
                }
                else {
                    if (filterItemsArr[i].parameters.filterItemsArrayName == filterItemsBoxName) {
                        var msg = alertify.warning(`مورد فیلتر با نام (${filterItemsBoxName}) موجود است.`);
                        msg.delay(alertify_delay);
                        res = true
                    }
                }

            }
        }
    }
    else {
        $("#filterItemsBoxName").focus()
        var msg = alertify.warning("نام مورد فیلتر را وارد کنید.");
        msg.delay(alertify_delay);
        res = true
    }

    return res
}

function haveVisitInTheEnteredPeriodFunc() {

    let res = false

    if ($("#basicInsurerId").val().length == 0) {
        var msg = alertify.warning("بیمه اجباری باید وارد شود.");
        msg.delay(alertify_delay);
        res = true
    }

    return res
}

function saveFilterItemsArrfunc() {

    let checkingTheNumberOfEnteredFilters = 0
    let newfilterItemsArray = []
    let notInFilter = [
        "confirmedBasicSharePrice",
        "confirmedCompSharePrice",
        "isBasicSharePrice",
        "isCompSharePrice",
        "isThirdParty",
        "isDiscount",
        "confirmedBySystem",
        "fromReserveDate",
        "toReserveDate"
    ]

    $("#tabContent select,#tabContent input").each(function () {

        let item = $(this)
        let itemId = item.prop("id")
        let itemValue = item.val()
        let itemTagName = item.prop("tagName")
        let itemLabel = item.closest(".form-group").children("label").text()

        if (itemTagName == 'INPUT') {
            if (item.prop("type") == 'checkbox') {
                itemValue = item.prop("checked")
                itemTagName = 'CHECKBOX'
            }
            else {
                if (itemValue != "" && checkResponse(itemValue)) {

                    if (itemId == "fromReserveDate")
                        itemLabel = "تاریخ رزرو از "
                    else if (itemId == "toReserveDate")
                        itemLabel = "تاریخ رزرو تا"

                    if (!notInFilter.includes(itemId))
                        checkingTheNumberOfEnteredFilters++
                }

            }
        }
        else if (itemTagName == 'SELECT') {
            if (typeof itemValue == 'string') {
                if (itemValue != "" && checkResponse(itemValue) && itemValue != "-1") {
                    if (!notInFilter.includes(itemId))
                        checkingTheNumberOfEnteredFilters++
                }
                itemValue = [itemValue]
            }
            else {
                if (itemValue.length != 0)
                    if (!notInFilter.includes(itemId))
                        checkingTheNumberOfEnteredFilters++
            }
        }

        if (checkResponse(itemId) && itemId != "") {
            let model = {
                id: itemId,
                label: itemLabel,
                type: itemTagName,
                value: itemValue
            }
            newfilterItemsArray.push(model)
        }
    });

    return { checkingTheNumberOfEnteredFilters, newfilterItemsArray }

}

function filterItemsArrayJustFilledFunc(filterItemsArray) {

    let newFilterItemsArr = filterItemsArray
    let filterItemsLenght = newFilterItemsArr.length
    let newFilterItemsArrElementFill = []

    for (let i = 0; i < filterItemsLenght; i++) {

        let filterItem = newFilterItemsArr[i]
        let filterItemType = filterItem.type
        let filterItemValue = filterItem.value;
        let filterItemElmId = filterItem.id;
        let filterItemElement = $(`#${filterItemElmId}`)

        if (filterItemType == 'SELECT') {
            if (filterItemElement.hasClass("select2")) {
                if (filterItemValue.length != 0)
                    newFilterItemsArrElementFill.push(filterItem)
            }
            else {
                if (filterItemValue[0] != -1)
                    newFilterItemsArrElementFill.push(filterItem)
            }
        }
        else if (filterItemType == 'INPUT') {
            if (filterItemValue != "")
                newFilterItemsArrElementFill.push(filterItem)
        }
        else if (filterItemType == 'CHECKBOX')
            newFilterItemsArrElementFill.push(filterItem)
    }

    return newFilterItemsArrElementFill
}

function checkingFiltersItemSavedOnesFunc(editsave, filterItemsArray) {

    let isSimilarArr = true

    if (editsave == 'save') {
        if (filterItemsArr.length != 0) {

            for (let i = 0; i < filterItemsArr.length; i++) {

                let newFilterItemsArr = filterItemsArr[i].parameters
                let newFilterItems = newFilterItemsArr.filterItemsArray
                let newFilterItemsArrLength = newFilterItems.length
                let newFilterItemsArrayName = filterItemsArr[i].parameters.filterItemsArrayName
                isSimilarArr = true


                //آیا طول دو آرایه با هم برابر است
                if (newFilterItemsArrLength == filterItemsArray.length) {

                    for (let j = 0; j < newFilterItemsArrLength; j++) {
                        let existItem = filterItemsArray.find(item => item.id == newFilterItems[j].id)

                        if (existItem != undefined) {

                            if (!_.isEqual(JSON.stringify(existItem.value), JSON.stringify(newFilterItems[j].value))) {
                                isSimilarArr = false
                                break
                            }
                        }
                        else {
                            isSimilarArr = false
                            break
                        }
                    }
                }
                else
                    isSimilarArr = false

                if (isSimilarArr) {
                    var msg = alertify.warning(`مورد فیلتر (${newFilterItemsArrayName}) ، با داده های وارد شده از قبل موجود می باشد`);
                    msg.delay(alertify_delay);
                    break
                }
            }

        }
        else
            isSimilarArr = false
    }
    else
        isSimilarArr = false

    return { isSimilarArr }
}

function resetBtnInputFilterItemList() {
    filterItemsEditRowVariable = null
    $("#filterItemsSaveBtn").attr("dataedit", 'save')
    $("#filterItemsBoxName").val("").prop("disabled", false)
    $("#filterItemsSaveBtn span").text("ذخیره")
}

function filterItemsHoverIn(row) {
    showFilterItemsDetails(row)
}

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

initAdmissionReport();

$("#basicInsurerId").on("change", async function () {

    var insurerIds = $("#basicInsurerId").val().toString();

    if (insurerIds == "")
        $("#basicInsurerLineId").html("").prop("disabled", true).trigger("change");

    if (insurerIds != "") {
        let modelFill = {
            type: 2,
            basicInsurerIds: insurerIds,
            compInsurerIds: "",
            fromReserveDatePersian: $("#fromReserveDate").val(),
            toReserveDatePersian: $("#toReserveDate").val()
        }

        var data = getDataDropDown(modelFill);

        $("#basicInsurerLineId").prop("disabled", false);
        await fill_select2WithData(data.basicInsurerLineList, "basicInsurerLineId", false, true);
    }

    ExportFile()
});

$("#compInsurerId").on("change", async function () {

    var insurerIds = $("#compInsurerId").val().toString();

    if (insurerIds == "")
        $("#compInsurerLineId").html("").prop("disabled", true).trigger("change");

    if (insurerIds != "") {
        let modelFill = {
            type: 3,
            basicInsurerIds: "",
            compInsurerIds: insurerIds,
            fromReserveDatePersian: $("#fromReserveDate").val(),
            toReserveDatePersian: $("#toReserveDate").val()
        }

        data = getDataDropDown(modelFill);

        $("#compInsurerLineId").prop("disabled", false);
        await fill_select2WithData(data.compInsurerLineList, "compInsurerLineId", false, true);
    }

    ExportFile()
});

$("#basicInsurerLineId").on("change", function () {
    ExportFile()
});

$("#compInsurerLineId").on("change", function () {
    ExportFile()
});

function ExportFile() {
    let checkReportType = $("#reportTypeFile").prop("checked")

    if (checkReportType) {
        $("#exportFileInsuranceSeparation").prop("disabled", true);
        $("#exportFileInsuranceAggregation").prop("disabled", true);

    }
    else {
        let isAccess = checkAccessExportFile()

        if (isAccess) {
            $("#exportFileInsuranceSeparation").prop("disabled", false);
            $("#exportFileInsuranceAggregation").prop("disabled", false);
        }
        else {
            $("#exportFileInsuranceSeparation").prop("disabled", true);
            $("#exportFileInsuranceAggregation").prop("disabled", true);
        }

    }
}

function checkAccessExportFile() {

    let basicInsurerIds = $("#basicInsurerId").val() != null ? $("#basicInsurerId").val().toString().split(',') : "";
    let basicInsurerLineIds = $("#basicInsurerLineId").val() != null ? $("#basicInsurerLineId").val().toString().split(',') : "";
    let compInsurerIds = $("#compInsurerId").val() != null ? $("#compInsurerId").val().toString().split(',') : "";
    let compInsurerLineIds = $("#compInsurerLineId").val() != null ? $("#compInsurerLineId").val().toString().split(',') : "";

    basicInsurerIds = basicInsurerIds.length == 1 && basicInsurerIds[0] == '' ? [] : basicInsurerIds
    basicInsurerLineIds = basicInsurerLineIds.length == 1 && basicInsurerLineIds[0] == '' ? [] : basicInsurerLineIds
    compInsurerIds = compInsurerIds.length == 1 && compInsurerIds[0] == '' ? [] : compInsurerIds
    compInsurerLineIds = compInsurerLineIds.length == 1 && compInsurerLineIds[0] == '' ? [] : compInsurerLineIds



    if (basicInsurerIds.length == 0 && compInsurerIds.length == 0)
        return false

    if (basicInsurerIds.length != 0 && compInsurerIds.length != 0) {

        let countExist = []
        let countNotEcist = 0

        for (let i = 0; i < basicInsurerIds.length; i++) {
            if (["8036", "8001", "8000"].includes(basicInsurerIds[i]))
                countExist.push(basicInsurerIds[i])
            else
                countNotEcist++
        }

        if (countExist.length > 0)
            return false

        if (basicInsurerLineIds.length == 0 && compInsurerLineIds.length == 0)
            return false
        else
            return true

    }

    if (basicInsurerIds.length != 0) {
        let countExist = []
        let countNotEcist = 0

        for (let i = 0; i < basicInsurerIds.length; i++) {
            if (["8036", "8001", "8000"].includes(basicInsurerIds[i]))
                countExist.push(basicInsurerIds[i])
            else
                countNotEcist++
        }

        if (countExist.length > 0)
            return false


        if (basicInsurerLineIds.length == 0)
            return false
        else
            return true
    }

    if (compInsurerIds.length != 0) {
        if (compInsurerLineIds.length == 0)
            return false
        else
            return true
    }


}

function isAccessOnExportFileFu() {

    let basicInsurerIds = $("#basicInsurerId").val() != null ? $("#basicInsurerId").val().toString().split(',') : "";
    let basicInsurerLineIds = $("#basicInsurerLineId").val() != null ? $("#basicInsurerLineId").val().toString().split(',') : "";
    let compInsurerIds = $("#compInsurerId").val() != null ? $("#compInsurerId").val().toString().split(',') : "";
    let compInsurerLineIds = $("#compInsurerLineId").val() != null ? $("#compInsurerLineId").val().toString().split(',') : "";

    basicInsurerIds = basicInsurerIds.length == 1 && basicInsurerIds[0] == '' ? [] : basicInsurerIds
    basicInsurerLineIds = basicInsurerLineIds.length == 1 && basicInsurerLineIds[0] == '' ? [] : basicInsurerLineIds
    compInsurerIds = compInsurerIds.length == 1 && compInsurerIds[0] == '' ? [] : compInsurerIds
    compInsurerLineIds = compInsurerLineIds.length == 1 && compInsurerLineIds[0] == '' ? [] : compInsurerLineIds


    if (basicInsurerIds.length == 0 && compInsurerIds.length == 0) {
        var msg = alertify.warning("بیمه اجباری یا بیمه تکمیلی را وارد کنید");
        msg.delay(alertify_delay);
        $("#basicInsurerId").select2("focus")
        return false
    }

    if (basicInsurerIds.length != 0 && compInsurerIds.length != 0) {

        let countExist = []
        let countNotEcist = 0

        for (let i = 0; i < basicInsurerIds.length; i++) {
            if (["8036", "8001", "8000"].includes(basicInsurerIds[i]))
                countExist.push(basicInsurerIds[i])
            else
                countNotEcist++
        }

        if (countExist.length > 0) {
            var msg = alertify.warning("مجاز به دریافت فایل بیمه برای آزاد , تامین و خدمات درمانی نمی باشد.");
            msg.delay(alertify_delay);
            return false

        }

        if (basicInsurerLineIds.length == 0 && compInsurerLineIds.length == 0) {
            var msg = alertify.warning("صندوق بیمه اجباری یا صندوق بیمه تکمیلی را وارد کنید");
            msg.delay(alertify_delay);
            $("#basicInsurerLineId").select2("focus")
            return false
        }
        else
            return true

    }

    if (basicInsurerIds.length != 0) {


        let countExist = []
        let countNotEcist = 0

        for (let i = 0; i < basicInsurerIds.length; i++) {
            if (["8036", "8001", "8000"].includes(basicInsurerIds[i]))
                countExist.push(basicInsurerIds[i])
            else
                countNotEcist++
        }

        if (countExist.length > 0) {
            var msg = alertify.warning("مجاز به دریافت فایل بیمه برای آزاد , تامین و خدمات درمانی نمی باشد.");
            msg.delay(alertify_delay);
            return false
        }

        if (basicInsurerLineIds.length == 0) {
            var msg = alertify.warning("صندوق بیمه اجباری را وارد کنید");
            msg.delay(alertify_delay);
            $("#basicInsurerLineId").select2("focus")
            return false
        }
        else
            return true
    }

    if (compInsurerIds.length != 0) {
        if (compInsurerLineIds.length == 0) {
            var msg = alertify.warning("صندوق بیمه تکمیلی را وارد کنید");
            msg.delay(alertify_delay);
            $("#compInsurerLineId").select2("focus")
            return false
        }
        else
            return true
    }

}

$("#reportTypeFile").on("change", function () {

    if ($(this).prop("checked")) {
        //$("#basicInsurerId").prop("required", false)
        //$("#basicInsurerLineId").prop("required", false)
        $("#exportFileInsuranceSeparation").prop("disabled", true);
        $("#exportFileInsuranceAggregation").prop("disabled", true);

        reportTypeSwitch = "reportType"
        $("#footerPageing").html("")
        $("#footerPageing").append(
            `<div class="col-sm-12 col-md-9" >
                  <div class="pagetablefooterinfo row col-md-12 ">
                        <div class="dataTables_info text-right">
                            نمایش <span id="firstRow">0</span> تا  <span id="lastRow">0</span>  - صفحه  <span id="currentPage">0</span>
                        </div>
                        <div>
                            <i id="loaderSReaport"></i>
                        </div>
                    </div>
              </div >
              <div class="col-md-3">
                    <div id="countRowButton" class="btn-group pagerowscount dropup float-left">
                        <button type="button" class="btn btn-default" data-toggle="dropdown" id="dropDownCountersName"></button>
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">-</span>
                        </button>
                        <div class="dropdown-menu" id="dropDownCounters">
                        </div>
                    </div>
              </div>`
        );
    }
    else {
        $("#exportFileInsuranceSeparation").prop("disabled", true);
        $("#exportFileInsuranceAggregation").prop("disabled", true);
        //$("#basicInsurerId").prop("required", true)
        //$("#basicInsurerLineId").prop("required", true)

        reportTypeSwitch = "reportInsureFile"

        $("#footerPageing").html("")
        $("#footerPageing").append(
            `<div class="col-md-3">
                  <div class="pagetablefooterinfo row col-md-12 ">
                        <div class="dataTables_info text-right">
                            نمایش 
                            <span id="firstRow">0</span> تا  <span id="lastRow">0</span><span id="currentPage">0</span>
                        </div>
                        <div>
                            <i id="loaderSReaport"></i>
                        </div>
                   </div>
             </div>
             <div class="col-md-6">
                 <ul class=" pagination justify-content-center mb-0"></ul>
             </div>
             <div class="col-md-3">
                  <div id="countRowButton" class="btn-group pagerowscount dropup float-left">
                      <button type="button" class="btn btn-default" data-toggle="dropdown" id="dropDownCountersName"></button>
                      <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span class="sr-only">-</span>
                      </button>
                      <div class="dropdown-menu" id="dropDownCounters">
                      </div>
                  </div>
             </div>`
        );
        $("#currentPage").css("display", "none")

    }

    getHeaderColumns();
    ExportFile()

});

$("#getReport").on("click", async function () {


    var check = controller_check_authorize(viewData_controllername, "VIW");
    if (!check)
        return;

    var validate = validationPrint();
    if (!validate)
        return;

    if (!$("#reportTypeFile").prop("checked")) {
        let isAccessOnEcportFile = isAccessOnExportFileFu()
        if (!isAccessOnEcportFile)
            return
    }


    await loadingAsync(true, "getReport", "fas fa-sticky-note");

    if (reportTypeSwitch == "reportType")
        await getReport();
    else if (reportTypeSwitch == "reportInsureFile")
        await getInsureFile();
});

$("#exportCSV")[0].onclick = null;
$("#exportCSV").click(function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/repinsurerpreviewcsv`;
    let csvModel = parameter();
    csvModel.pageno = null;
    csvModel.pagerowscount = null;
    viewData_form_title = "گزارش بیمه گرها";

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
});

$("#reportType").on("change", function () {

    var reportType = +$(this).val();

    // Same as preview
    //101,102,104,105,106,107,108 -  mc.Spr_AdmissionServiceInsuranceDetailReportPreview // DONE
    //103 - mc.Spr_AdmissionServiceInsuranceSummaryReportPreview // DONE
    //109,110,111,112 -  mc.Spr_AdmissionService_Insurnace // (109,110,111 DONE) - 112(Not DONE)
    // 113 - mc.Spc_AdmissionServiceBasicInsuranceBill // DONE
    // 114 - mc.Spc_AdmissionServiceCompInsuranceBill // DONE


    //COMPLETE 101,102,104,105,106,107,108,115 - COMPLETE
    //COMPLETE 103 - COMPLETE
    //COMPLETE 109,110,111,112 - COMPLETE
    //113 PENDING
    //114 PENDING


    if (reportType === 101)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceInsuranceReportPreview.mrt`;
    else if (reportType === 102)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceInsuranceDetailByServiceReportPreview.mrt`;
    else if (reportType === 103)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceInsuranceSummaryReportPreview.mrt`;
    else if (reportType === 104)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionServiceInsuranceDetailByInsurerReportPreview.mrt`;
    else if (reportType === 105)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionInsuranceByBasicInsurerReportPreview.mrt`;
    else if (reportType === 106)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionInsuranceByCompInsurerReportPreview.mrt`;
    else if (reportType === 107)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionInsuranceByThirtPartyReportPreview.mrt`;
    else if (reportType === 108)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionInsuranceByBasicInsurerSummeryReportPreview.mrt`;
    else if (reportType === 115)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionInsuranceByDiscountReportPreview.mrt`;
    else if (reportType === 109)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService_Insurance1.mrt`;
    else if (reportType === 110)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService_Insurance2.mrt`;
    else if (reportType === 111)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService_Insurance3.mrt`;
    else if (reportType === 112)
        reportUrl = `${stimulsBaseUrl.MC.Rep}AdmissionService_InsuranceBasic.mrt`;

    else if (reportType === 113)
        reportUrl = `${stimulsBaseUrl.MC.Rep}BasicInsurance_Document.mrt`;
    else if (reportType === 114)
        reportUrl = `${stimulsBaseUrl.MC.Rep}CompInsurance_Document.mrt`;

});

$("#reportType").val("101").trigger("change");

$("#previewReport").on("click", function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    var validate = validationPrint();
    if (!validate)
        return;

    modal_show("previewReportModal");
    setTimeout(function () {
        $('#previewReportModal').trigger('blur');
        $("#previewReportModal select").focus()
    }, 200);
});

$(".select2-search__field")[0].onfocus = null;

$("#exportFileInsuranceSeparation").on("click", async function () {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    if (!$("#reportTypeFile").prop("checked")) {
        let isAccessOnEcportFile = isAccessOnExportFileFu()
        if (!isAccessOnEcportFile)
            return
    }


    $("#exportFileInsuranceSeparation").prop("disabled", true);

    setTimeout(function () {

        var model = parameter();
        model.isFile = 1
        model.pageno = null;
        model.pagerowscount = null;

        let basicInsurerLineIds = model.basicInsurerLineIds.toString().split(",")
        let basicInsurerLineInfo = []


        for (let i = 0; i < basicInsurerLineIds.length; i++) {

            let basicInsurerLineName = $(`#basicInsurerLineId option[value=${basicInsurerLineIds[i]}]`).text().trim().split("-")[1]
            basicInsurerLineInfo.push({
                id: basicInsurerLineIds[i],
                name: basicInsurerLineName
            })
        }

        model.basicInsurerIds = null

        for (let i = 0; i < basicInsurerLineInfo.length; i++) {
            model.basicInsurerLineIds = basicInsurerLineInfo[i].id
            getFileInsurerXml(model, basicInsurerLineInfo[i].name);
        }

    }, 100);
});

$("#exportFileInsuranceAggregation").on("click", async function () {
    
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    if (!$("#reportTypeFile").prop("checked")) {
        let isAccessOnEcportFile = isAccessOnExportFileFu()
        if (!isAccessOnEcportFile)
            return
    }


    $("#exportFileInsuranceAggregation").prop("disabled", true);

    setTimeout(function () {

        var model = parameter();
        model.isFile = 1
        model.pageno = null;
        model.pagerowscount = null;
        model.basicInsurerIds = null


        getFileInsurerXml(model, null);

    }, 100);
});

$(".search-service,.search-attender").on("click", function () {

    if ($(this).hasClass("search-service"))
        getDataSearchElemnts("service");
    else
        getDataSearchElemnts("Attender");
});

$("#searchElementsModal").on("shown.bs.modal", () => { $(`#idSearch`).focus(); });

$("#searchElementsModal").on("hidden.bs.modal", function () {
    $(`#searchElementsModal input`).val("");
    $(`#searchElementsModal input[type=checkbox]`).prop("checked", false);
});

$("#checkAllElements").on("change", function () {

    var checkBoxLength = $(".checkSearch").length;

    for (var i = 0; i < checkBoxLength; i++) {
        $(`.checkSearch:eq(${i})`).prop("checked", $(this).prop("checked"));
        arrayIdsAS.filter((x) => +x.id == +$(`.checkSearch:eq(${i})`).prop("id").split("_")[1])[0].checked = $(this).prop("checked");
    }


});

$("#fromReserveDate,#toReserveDate").on("input", function (e, callback) {

    if ($("#fromReserveDate").val() !== "" && $("#toReserveDate").val() !== "" && isValidShamsiDate($("#fromReserveDate").val()) && isValidShamsiDate($("#toReserveDate").val())) {

        if (!compareShamsiDate($("#fromReserveDate").val(), $("#toReserveDate").val())) {
            var msg = alertify.error("تاریخ شروع از تاریخ پایان بزرگتر است");
            msg.delay(alertify_delay);
            return false;
        }

        isValidDates(true, callback)
    }
    else
        isValidDates(false)

});

function isValidDates(isValidDate, callback = null) {

    if (isValidDate) {
        setTimeout(function () {
            fillElmntAdmission(callback);
        }, 100);
    }
    else {
        $("#workflowId").val("").trigger("change.select2");
        $("#stageId").val("").trigger("change.select2");
        $("#actionId").val("").trigger("change.select2");

        $("#basicInsurerId").val("").trigger("change.select2");
        $("#basicInsurerLineId").val("").trigger("change.select2");
        
        $("#compInsurerId").val("").trigger("change.select2");
        $("#compInsurerLineId").val("").trigger("change.select2");
        
        $("#thirdPartyId").val("").trigger("change.select2");
        $("#discountId").val("").trigger("change.select2");

        $("#attenderId").val("").trigger("change.select2");
        $("#departmentId").val("").trigger("change.select2");
        $("#referringDoctorId").val("").trigger("change.select2");
        $("#specialityId").val("").trigger("change.select2");

        $("#serviceTypeId").val("").trigger("change.select2");
        $("#serviceId").val("").trigger("change.select2");

        $(`#workflowId,#stageId,#actionId,#basicInsurerId,#compInsurerId,#thirdPartyId,#discountId #attenderId,#departmentId,
           #specialityId,#referringDoctorId, #serviceTypeId,#serviceId,#basicInsurerLineId,#compInsurerLineId`).prop("disabled", true);
    }
}

$("#buttonSearchElementsModal").on("click", function () {

    if ($("#nameModalSearch").hasClass("service-type"))
        getDataSearchElemnts("service", true);
    else
        getDataSearchElemnts("attender", true);

});

$("#searchElementsModal .modal-body input:not(:checkbox)")
    .on("input", function () {
        flagSearch = true;
    })
    .on("blur", function (e) {

        if (e.currentTarget.getAttribute("id") == "codeSearch")
            if (typeof e.relatedTarget !== "undefined" && e.relatedTarget !== null)
                if (e.relatedTarget.tagName.toLocaleLowerCase() == "button") $(e.currentTarget).focus();

        if (typeof e.relatedTarget !== "undefined" && e.relatedTarget !== null) {
            if (e.relatedTarget.tagName.toLocaleLowerCase() != "tr" && flagSearch) $("#buttonSearchElementsModal").click();
        }
        else {
            if (flagSearch) $("#buttonSearchElementsModal").click();
        }

    });

$("#codeSearch").on("keydown", function (e) {
    if (e.keyCode == KeyCode.ArrowDown) {
        $(`#tempSearchElements tr`).removeClass("highlight");
        $(`#row__${1}`).addClass("highlight").focus();
    }
});

$("#SaveSearch").on("click", function () {

    let fieldId = $("#nameModalSearch").hasClass("attender-type") ? "attenderId" : "serviceId"
    let arrayIdsASLen = arrayIdsAS.length;

    $(`#clear_${fieldId}`).click()

    setTimeout(() => {
        for (let i = 0; i < arrayIdsASLen; i++) {

            let currentValue = arrayIdsAS[i].id;
            let checkBoxId = `state${fieldId}_${currentValue}`;
            let optionId = $(`#${fieldId} option[value="${currentValue}"]`).attr("id");

            $(`#${optionId}`).prop("selected", arrayIdsAS[i].checked).trigger("change")
            clickCheckBox(checkBoxId, optionId)
        }
    }, 300)

    modal_close("searchElementsModal");

});

$("#filterItemsSaveBtn").on("click", function () {
    let editsave = $(this).attr("dataedit")
    saveAndEditFilterItems(editsave)
})

$("#filterItemsBoxName").on("keypress", function (e) {
    if (e.keyCode === KeyCode.Enter) {
        e.preventDefault();
        $("#filterItemsSaveBtn").click()
    }
})

$("#filterItemsShowBtn").on("blur", function (e) {

    setTimeout(() => {
        $("#filterItemsContentBox ul").scrollTop(0)
        $("#filterItemsContentBox").addClass("d-none")
        $("#filterItemsContentBoxDetails").html("")
        $("#filterItemsContentBoxDetails").addClass("d-none")
    }, 300)

})

$("#filterItemsShowBtn").on("click", function () {

    if (filterItemsArr.length == 0) {
        let strContent = '<div class="d-flex justify-content-center">'
        strContent += '<div style="width:315px;color:red;text-align:center">'
        strContent += 'لیستی برای نمایش موجود نیست'
        strContent += '<div>'
        strContent += "</div>"
        $("#countOfFilterItemsArr").text(0)
        $("#filterItemsContentBox").scrollTop(0)
        $("#filterItemsContentBox").html("")
        $("#filterItemsContentBox").html(strContent)

    }

    $("#filterItemsContentBox").removeClass("d-none")

})

$("#modal-previewReport").on("click", function () {

    let validate = validationPrint();
    if (!validate)
        return;

    let reportModel = createPrintModel();

    window.open(`${viewData_report_url}?strReportModel=${JSON.stringify(reportModel)}`, '_blank');
});

$("#workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28",
        bySystem = 0,
        isActive = 2;

    $("#stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3, "",
        () => { $("#stageId").trigger("change") }, "", false, false, true);

});

$('#stageId').on('change', function () {

    let stageId = $("#stageId").val().toString() == "" ? null : $("#stageId").val().join(","),
        workflowId = $("#workflowId").val().toString() == "" ? null : $("#workflowId").val().join(","),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "17,22,28";

    $("#actionId").empty();


    fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdownactionlistbystage`, "actionId", true, `${stageId}/${workflowId}/2/2/null/${workFlowCategoryId}/false/${stageClassId}`, false, 3, "", undefined, "", false, false, true);


});
