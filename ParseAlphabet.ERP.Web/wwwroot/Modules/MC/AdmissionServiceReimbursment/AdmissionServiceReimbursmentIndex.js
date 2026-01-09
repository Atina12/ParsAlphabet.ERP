var viewData_form_title = "کسورات بیمه",
    viewData_controllername = "AdmissionServiceReimbursmentApi",
    viewData_getrecord_url = `${viewData_baseUrl_MC}/AdmissionApi/getadmissionpatientrecordbyid`,
    viewData_update_url = `${viewData_baseUrl_MC}/${viewData_controllername}/save`,
    viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Attender.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    fill_dataSelectAdmission = `${viewData_baseUrl_MC}/AdmissionApi/getlistadmissioninsurerthirdpartystate`,
    fill_dataSelectAdmissionV1 = `${viewData_baseUrl_MC}/AdmissionApi/getlistadmissioninsurerthirdpartystatev1`,
    viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/admissionservicelinereimbursementcsv`,
    viewData_opencash = `${viewData_baseUrl_MC}/${viewData_controllername}/opencash`,
    formSearch = $('#admissionReimburesmentForm').parsley(),
    insurExpDateValid = true,
    firstLoading = false, valueDate = { from: "", to: "" },
    saveAdmissionInfoForModal = {};

var requestBasicInsurerPagetable = {
    pagetable_id: "requestBasicInsurerPagetable",
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
    lastPageloaded: 0,
    getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`
}

var requestComInsurerPagetable = {
    pagetable_id: "requestComInsurerPagetable",
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
    lastPageloaded: 0,
    getpagetable_url: `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`
}

arr_pagetables.push(requestBasicInsurerPagetable)
arr_pagetables.push(requestComInsurerPagetable)

function initReimbursment() {

    inputMask();
    $(".select2").select2()

    $("#rb_fromReserveDatePersian").inputmask();
    $("#rb_toReserveDatePersian").inputmask();

    kamaDatepicker('rb_fromReserveDatePersian', { withTime: false, position: "bottom" });
    kamaDatepicker('rb_toReserveDatePersian', { withTime: false, position: "bottom" });

    $("#stimul_preview").remove();
    $("#readyforadd").remove();

    $(".footer-addpatient").prepend(`<button id="searchPatient" type="button" class="btn btn-light border-green" style="color:#212529" tabindex="6"><i class="fa fa-search"></i>جستجو</button>`)
    $(".filterBox").remove();
   
    if (typeof configEditReferingDoctorInfoInAdmissionImaging != "undefined")
        configEditReferingDoctorInfoInAdmissionImaging = undefined


    if ($("#rb_fromReserveDatePersian").val() !== "" && $("#rb_toReserveDatePersian").val() !== "")
        fillElmntAdmission()
};

function getpageReimb() {

    let form = $("#admissionReimburesmentForm").parsley();
    let validate = form.validate();
    validateSelect2(form);
    if (!validate)
        return;

    selectTabDefaultConfig(true)
    setTimeout(() => {
        if ($("#tabBoxPagetables").hasClass("d-none"))
            selectTab(1, "requestBasicInsurerPagetable")
        else
            if ($("#requestBasicInsurerPagetableTagA").hasClass("active"))
                selectTab(1, "requestBasicInsurerPagetable")
            else
                selectTab(2, "requestComInsurerPagetable")
    }, 500)

}

function selectTabDefaultConfig(isClick = false) {
    $("#requestBasicInsurerPagetable thead").empty()
    $("#requestComInsurerPagetable thead").empty()
    $("#requestBasicInsurerPagetable tbody").empty()
    $("#requestComInsurerPagetable tbody").empty()
    $("#requestBasicInsurerPagetable #dropCounteresPageTable").empty()
    $("#requestComInsurerPagetable #dropCounteresPageTable").empty()
    $("#requestBasicInsurerPagetable #dropCounteresPageTableName").empty()
    $("#requestComInsurerPagetable #dropCounteresPageTableName").empty()
    $("#requestBasicInsurerPagetable #firstRow").empty()
    $("#requestComInsurerPagetable #firstRow").empty()
    $("#requestBasicInsurerPagetable #lastRow").empty()
    $("#requestComInsurerPagetable #lastRow").empty()
    $("#requestBasicInsurerPagetable #currentPage").empty()
    $("#requestComInsurerPagetable #currentPage").empty()

    //if (!$("#tabBoxPagetables").hasClass("d-none")) {
    //    isClick ? $("#requestBasicInsurerPagetableTagA").click() : ""
    //}
}

function selectTab(tanNo, pageId) {

    selectTabDefaultConfig()

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pageId);
    arr_pagetables[index].pageNo = 0;
    arr_pagetables[index].currentpage = 1;

    getNewPageTable(pageId);

    $("#tabBox").removeClass("d-none")
    $("#tabBoxPagetables").removeClass("d-none")
}

function getNewPageTable(pg_id = null) {

    var validate = formSearch.validate();
    validateSelect2(formSearch);

    if (!validate)
        return;

    getPagetable(pg_id);
}

function getPagetable(pg_id = null, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";

    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id),
        pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_filteritem = arr_pagetables[index].filteritem,
        pagetable_filtervalue = arr_pagetables[index].filtervalue,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo;

    if (pagetable_filtervalue != "" && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
        alertify.error('مورد فیلتر انتخاب نشده').delay(alertify_delay);
        return;
    }

    if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && pagetable_filtervalue == "") {
        alertify.error('عبارت فیلتر وارد نشده').delay(alertify_delay);
        return;
    }

    let fieldItemType = +$(`#${pg_id} .btnfilter`).attr("data-type");

    if ([dbtype.Int, dbtype.BigInt, dbtype.SmallInt, dbtype.TinyInt, dbtype.dbtype_Decimal, dbtype.Float, dbtype.Real].indexOf(fieldItemType) > -1)
        if (isNaN(pagetable_filtervalue)) {
            alertify.error('با توجه به مورد فیلتر ، عبارت فیلتر معتبر نمی باشد').delay(alertify_delay);
            return;
        }

    var parameters = parameter();

    let pageViewModel = {
        pageno: pagetable_pageNo,
        pagerowscount: pagetable_pagerowscount,
        fieldOrderBy: dataOrder.col,
        directionOrderBy: dataOrder.type,
        basicInsurerId: parameters.basicInsurerId,
        basicInsurerLineId: parameters.basicInsurerLineId,
        compInsurerId: parameters.compInsurerId,
        compInsurerLineId: parameters.compInsurerLineId,
        patientFullName: parameters.patientFullName,
        fromReserveDatePersian: parameters.fromReserveDatePersian,
        toReserveDatePersian: parameters.toReserveDatePersian,
        attenderId: parameters.attenderId,
        serviceId: parameters.serviceId,
        serviceTypeId: parameters.serviceTypeId,
        id: parameters.id,
        admissionMasterId: parameters.admissionMasterId,
        stageId: parameters.stageId,
        workflowId: parameters.workflowId,
        actionId: parameters.actionId,
        insurerTypeId: pg_id == "requestBasicInsurerPagetable" ? 1 : 2
    }

    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            if (pagetable_currentpage == 1)
                fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

async function fillElmntAdmission() {

    valueDate.from = $("#rb_fromReserveDatePersian").val();
    valueDate.to = $("#rb_toReserveDatePersian").val();
    fillElmntAdmissionOneByOne();

}

async function fillElmntAdmissionOneByOne() {

    let modelFill = {
        fromReserveDatePersian: $("#rb_fromReserveDatePersian").val(),
        toReserveDatePersian: $("#rb_toReserveDatePersian").val(),
        basicInsurerId: 0,
        type: 8,
        basicInsurerIds: "",
        isMultiple: false
    }

    let data = getDataDropDown(modelFill);

    await fill_select2WithData(data.basicInsurerList, "rb_insurerId");
    await fill_select2WithData(data.compInsurerList, "rb_compInsurerId");
    await fill_select2WithData(data.attenderList, "rb_attenderId");
    await fill_select2WithData(data.serviceList, "rb_serviceId");
    await fill_select2WithData(data.serviceTypeList, "rb_serviceTypeId");
    await fill_select2WithData(data.workflowList, "rb_workflowId");
    await fill_select2WithData(data.stageList, "rb_stageId");
}

async function fill_select2WithData(result, elementid) {

    var query = {}, arrayIds = [], placeholder = "";
    $(`#${elementid}`).empty();

    if (elementid == 'rb_insurerId' ||
        elementid == 'rb_compInsurerId' ||
        elementid == 'rb_attenderId' ||
        elementid == 'rb_serviceId' ||
        elementid == 'rb_serviceTypeId' ||
        elementid == 'rb_workflowId' ||
        elementid == 'rb_stageId'

    ) {
        var newOption = new Option(`0 - انتخاب کنید`, 0, false, false);
        $(`#${elementid}`).append(newOption).trigger('change');
    }

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
            allowClear: true,
            escapeMarkup: function (markup) {
                return markup;
            }
        });

        $(`#${elementid}`).val(0).trigger('change.select2');
    }
    $(`#${elementid}`).prop("disabled", false);

}

function getDataDropDown(modelFill) {

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

function parameter() {
    let parameters = {
        id: +$("#rb_AdmissionId").val() == 0 ? null : +$("#rb_AdmissionId").val(),
        admissionMasterId: +$("#rb_AdmissionMasterId").val() == 0 ? null : +$("#rb_AdmissionMasterId").val(),
        workflowId: +$("#rb_workflowId").val() == 0 ? null : +$("#rb_workflowId").val(),
        stageId: +$("#rb_stageId").val() == 0 ? null : +$("#rb_stageId").val(),
        basicInsurerId: +$(`#rb_insurerId`).val() == 0 ? null : +$(`#rb_insurerId`).val(),
        basicInsurerLineId: +$("#rb_basicInsurerLineId").val() == 0 ? null : +$("#rb_basicInsurerLineId").val(),
        compInsurerId: +$("#rb_compInsurerId").val() == 0 ? null : +$("#rb_compInsurerId").val(),
        compInsurerLineId: +$("#rb_compInsurerLineId").val() == 0 ? null : +$("#rb_compInsurerLineId").val(),
        patientFullName: $("#rb_patientFullName").val() == "" ? null : $("#rb_patientFullName").val(),
        fromReserveDatePersian: $("#rb_fromReserveDatePersian").val() == "" ? null : $("#rb_fromReserveDatePersian").val(),
        toReserveDatePersian: $("#rb_toReserveDatePersian").val() == "" ? null : $("#rb_toReserveDatePersian").val(),
        attenderId: +$("#rb_attenderId").val() == 0 ? null : +$("#rb_attenderId").val(),
        serviceId: +$("#rb_serviceId").val() == 0 ? null : +$("#rb_serviceId").val(),
        serviceTypeId: +$("#rb_serviceTypeId").val() == 0 ? null : +$("#rb_serviceTypeId").val()
    };
    return parameters;
}

function setPatientInfo(id, firstName, lastName, genderId, mobileNo, nationalCode, countryId) {

    $("#firstName").val(firstName);
    $("#lastName").val(lastName);
    $("#genderId").val(genderId).trigger("change");
    $("#nationalCode").val(nationalCode !== "null" ? nationalCode : "");
    modal_close("searchPatientModal");
    $("#firstName").focus();
}

function fill_NewPageTable(result, pageId = null, callBack = undefined) {

    rowsChange = false;

    if (pageId == null) pageId = "pagetable";
    if (!result) return "";

    let columns = result.columns.dataColumns,
        buttons = result.columns.buttons,
        list = result.data,
        columnsL = columns.length,
        listLength = list.length,
        buttonsL = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0,
        index = arr_pagetables.findIndex(v => v.pagetable_id == pageId),
        conditionTools = [],
        conditionAnswer = "",
        conditionElseAnswer = "";


    arr_pagetables[index].editable = result.columns.isEditable;
    arr_pagetables[index].selectable = result.columns.isSelectable;
    arr_pagetables[index].columns = columns;
    arr_pagetables[index].trediting = false;

    let pagetable_editable = arr_pagetables[index].editable,
        pagetable_selectable = arr_pagetables[index].selectable,
        pagetable_highlightrowid = arr_pagetables[index].highlightrowid,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_endData = arr_pagetables[index].endData;


    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";


    if (!pagetable_endData) {
        arr_pagetables[index].endData = listLength < pagetable_pagerowscount;

        let elm_pbody = $(`#${pageId} .pagetablebody`),
            btn_tbidx = 1000,
            str = "",
            rowLength = $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length;

        if (pagetable_currentpage == 1) {
            let col = {}, width = 0;
            rowLength = 0;
            elm_pbody.html("");
            str += '<thead class="table-thead-fixed">';
            str += '<tr>';
            if (pagetable_editable == true)
                str += `<th style="width:${(+$(`#${pageId} .pagetablebody `).width() / 101) * 2}px"></th>`;
            if (pagetable_selectable == true)
                str += `<th style="width:${(+$(`#${pageId} .pagetablebody `).width() / 101) * 2}px;text-align:center !important"><input onchange="changeAll(this,'${pageId}')" class="checkall" type="checkbox"></th>`;
            for (var i = 0; i < columnsL; i++) {
                col = columns[i];
                width = (+$(`#${pageId} .pagetablebody`).width() / 101) * +col.width;
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + width + 'px;' : '') + '"';
                    if (col.id != "action") {
                        if (result.columns.order)
                            str += `class="headerSorting" id="header_${i}" data-type="" data-col="${col.id}" data-index="${i}" onclick="sortingButtonsByTh(${result.columns.order},this)"><span id="sortIconGroup" class="sortIcon-group">
                                <i id="desc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                                <i id="asc_Col_${i}" data-col="${col.id}" data-index="${i}" data-type="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
                            </span>` + col.title + '</th>';
                        else
                            str += '>' + col.title + '</th>';
                    }
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';

        }
        else
            elm_pbody = $(`#${pageId} .pagetablebody tbody`);

        if (list.length == 0) {
            if (rowLength == 0)
                str += fillEmptyRow($(str).find("tr th").length);
        }
        else
            for (var i = 0; i < listLength; i++) {
                var item = list[i];
                var rowno = rowLength + i + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j = 0; j < columnsL; j++) {
                    var primaries = "";


                    for (var k = 0; k < columnsL; k++) {
                        var v = columns[k];
                        if (v["isPrimary"] === true)
                            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                    }

                    colwidth = columns[j].width;
                    if (j == 0) {
                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${item[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                str += '<tr' + primaries + ' class="highlight" id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-2">';
                            }
                            else {
                                str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="tr_onkeydown(event,`' + pageId + '`)" onclick="tr_onclick(`' + pageId + '`,this,event)" tabindex="-1">';
                            }
                        }
                        if (pagetable_editable == true)
                            str += `<td id="col_${rowno}_0" style="width:2%"></td>`;

                        if (pagetable_selectable == true) {
                            str += `<td id="col_${rowno}_1" style="width:2%;text-align:center"><input onchange="itemChange(this)" type="checkbox"`;

                            var validCount = 0;
                            var primaryCount = 0;
                            var isCol = false;

                            var selectedItems = arr_pagetables[index].selectedItems;
                            $.each(selectedItems, function (k, v) {
                                $.each(v, function (key, val) {
                                    var column = columns.filter(a => a.id.toLowerCase() == key)[0];
                                    primaryCount += 1;
                                    if (item[column.id] == val)
                                        validCount += 1;
                                })
                                if (validCount == primaryCount)
                                    isCol = true;
                                primaryCount = 0;
                                validCount = 0;
                            })
                            if (isCol) {
                                str += 'checked />';
                            }
                            else {
                                str += '/>';
                            }
                            str += '</td >';

                        }
                    }
                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];
                            if (columns[j].editable) {
                                str += `<td ${columns[j].inputType == "select2" ? "data-select2='true'" : ""} id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {
                                    str += `<select id="${columns[j].id}_${rowno}" disabled class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})">`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "dynamicSelect") {

                                    str += `<select class="form-control" disabled onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})">`;
                                    str += `<option value="0">انتخاب کنید</option>`;
                                    var inputsName = `${columns[j].id}Inputs`;
                                    var lenInput = item[inputsName] != null ? item[inputsName].length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = item[inputsName][h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" tabindex="-1">
                                            <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                            <label for="btn_${rowno}_${colno}"></label>
                                        </div>`;
                                }
                                else if (columns[j].inputType == "searchPlugin") {
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number searchPlugin" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                }
                                else if (columns[j].inputType == "select2") {
                                    var onchange = `tr_object_onchange('${pageId}',this,${rowno},${colno})`;
                                    var nameVlue = "";
                                    if (columns[j].id.indexOf("Id") != -1) {
                                        var val = item[columns[j].id.replace("Id", "") + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }
                                    else {
                                        var val = item[columns[j].id + "Name"];
                                        nameVlue = val != null ? val : '';
                                    }

                                    str += `<div>${nameVlue}</div>`
                                    str += `<div class="displaynone"><select data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
                                    str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs != null ? columns[j].inputs.length : 0;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.id) {
                                            str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                        }
                                    }

                                    str += "</select></div>";
                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != null ? value : ''}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input type="text" id="${columns[j].id}_${rowno}" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip") || columns[j].type === 9) {
                                    if (value != null && value != "") {
                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5) {
                                            value = value.toString();
                                        }
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%">' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                }
                                else {
                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;">' + value + '</td>';
                                    else
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {
                            colno += 1;

                            if (result.columns.actionType === "dropdown") {
                                str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                    }
                                    else
                                        str += `<div class="button-seprator-hor"></div>`;
                                }

                                str += `</div>
                                </div>`;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                                for (var k = 0; k < buttonsL; k++) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        str += `<button type="button" ${btn.isFocusInline == true ? 'data-isfocusinline="true"' : ''}  id="btn_${btn.name}" onclick="run_button_${btn.name}(${item[columns[0].id]},${rowno},this)" class="${btn.className}" data-toggle="tooltip" data-placement="bottom" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                    }
                                    else
                                        str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                    }
                }
                str += '</tr>';
            }

        if (pagetable_currentpage == 1)
            str += '</tbody>';

        elm_pbody.append(str);
        afterFillPageTable(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack);
    }
}

function insertNewPage(pg_id) {
    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id),
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_endData = arr_pagetables[index].endData,
        pageNo = 0;
    lastPageloaded = arr_pagetables[index].lastPageloaded

    if (!pagetable_endData && +pagetable_pageNo == lastPageloaded) {
        pageNo = +pagetable_pageNo + +pagetable_pagerowscount;
        arr_pagetables[index].currentpage = pagetable_currentpage + 1;
        arr_pagetables[index].pageNo = pageNo;
        getNewPageTable(pg_id, true);
    }
}

function tr_onkeydown(ev, pg_name) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space, KeyCode.Page_Up, KeyCode.Page_Down].indexOf(ev.which) == -1) return;
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentcol = arr_pagetables[index].currentcol
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var pagetable_currentpage = arr_pagetables[index].currentpage;
    var pagetable_lastpage = arr_pagetables[index].lastpage;
    var pagetable_editable = arr_pagetables[index].editable;
    var pagetable_selectable = arr_pagetables[index].selectable;
    var pagetable_tr_editing = arr_pagetables[index].trediting;

    if ($(`#${pagetable_id} .pagetablebody > tbody > tr > td:last-child > .dropdown`).hasClass("show"))
        return;

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);
            }
            else {
                pagetable_currentrow--;
                arr_pagetables[index].currentrow = pagetable_currentrow;
                after_change_tr(pg_name, KeyCode.ArrowUp);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowUp);
            }
            else if (pagetable_currentpage !== 1)
                pagetable_prevpage(pagetable_id);
        }
    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if (document.activeElement.className.indexOf("select2") >= 0) // Open when ArrowDone In Select2
            return;

        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
            }
            else {
                pagetable_currentrow++;
                arr_pagetables[index].currentrow = pagetable_currentrow;

                after_change_tr(pg_name, KeyCode.ArrowDown);
            }
        }
        else {
            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                //arr_pagetables[index].currentrow = 1;
                //pagetable_nextpage(pagetable_id);
            }
        }
    }
    else if (ev.which === KeyCode.Enter) {
        if (pagetable_editable) {
            if (!pagetable_tr_editing)
                pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);

            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio").first()
            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {
                var currentElmCol = $(currentElm).parent("td").attr("id").split("_")[2];

                if (currentElmCol == pagetable_currentcol && !arr_pagetables[index].trediting) {
                    set_row_editing(pg_name);
                    //disableUpdate();
                    currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td`).find("input:not([data-disabled]),select:not([data-disabled]),div.funkyradio:not([data-disabled])").first()
                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else
                        currentElm.focus();
                }
                else {
                    var nextElm = undefined,
                        nextTds = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} td`),
                        nextTdsL = nextTds.length;

                    for (var x = 0; x < nextTdsL; x++) {
                        var v = nextTds[x];
                        if (nextElm == undefined) {
                            if ($(v).attr("id") != undefined) {
                                var currentcol = $(v).attr("id").split("_")[2];
                                if (currentcol > pagetable_currentcol) {
                                    var nxtElm = $(v).find("input,select,div.funkyradio").first();
                                    if ($(nxtElm).attr("readonly") != "readonly")
                                        nextElm = nxtElm;
                                }
                            }
                        }
                    }

                    // المنت بعدی وجود داشت
                    if (nextElm != undefined && nextElm.length != 0) {
                        if (currentElm.hasClass("funkyradio")) {
                            var td_lbl_funkyradio = currentElm.find("label");
                            td_lbl_funkyradio.removeClass("border-thin");
                        }

                        if (nextElm.hasClass("funkyradio")) {
                            nextElm.focus();

                            var td_lbl_funkyradio = nextElm.find("label");
                            td_lbl_funkyradio.addClass("border-thin");
                        }
                        else
                            nextElm.focus();
                    }
                    else {
                        // سظر بعدی وجود داشت
                        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {

                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_currentrow++;
                                arr_pagetables[index].currentrow = pagetable_currentrow;

                                after_change_tr(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                //pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select").attr("disabled", true);
                }
            }
        }
    }
    else if (ev.which === KeyCode.Esc) {
        if (pagetable_editable) {

            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {

                after_change_tr(pg_name, KeyCode.Esc);

                getNewPageTable();
                pagetable_currentcol = arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);

            }
            else {
                var modal_name = $(`#${pagetable_id}`).closest("div.modal").attr("id");
                modal_close(modal_name);
            }
        }
    }
    else if (ev.which === KeyCode.Space) {

        //if (pagetable_editable === false && pagetable_tr_editing === false) {
        //    ev.preventDefault();
        //    return;
        //}

        if (pagetable_editable && pagetable_tr_editing) {



            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("select,div.funkyradio").first()

            if (elm.hasClass("funkyradio") && !elm.prop("disabled")) {

                ev.preventDefault();
                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol} .funkyradio #btn_${pagetable_currentrow}_${pagetable_currentcol}`);
                checkbox_funky.prop("checked", !checkbox_funky.prop("checked")).trigger("change");
            }
            else if (elm.prop("tagName").toLowerCase() === "select") {


                //var selected = $(elm)[0].selectedIndex;
                //$(elm).prop('selectedIndex', selected);
                //$(elm).click();
            }
        }

        else if (pagetable_editable === false && pagetable_tr_editing === false || pagetable_selectable) {
            ev.preventDefault();
            pagetable_currentcol = 1;

            var editMode = false;
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input", "select").each(function () {
                if ($(this).prop("disabled") == false && $(this).attr("type") != "checkbox")
                    editMode = true;
            })

            var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input[type='checkbox']").first();
            if (!editMode) {
                if (elm.prop("checked")) {
                    var pagetable = $(`#${pg_name}`);
                    $(pagetable).find("input[type='checkbox']").first().prop("checked", false);
                }
                elm.prop("checked", !elm.prop("checked"));
                itemChange(elm);
            }
        }
    }

}

function set_row_editing(pg_name) {

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    let pagetable_id = arr_pagetables[index].pagetable_id;
    let pagetable_currentrow = arr_pagetables[index].currentrow;
    let pagetable_editable = arr_pagetables[index].editable;
    let admissionType = 1
    $(":focus").blur();
    $(":focus").focusout();
    arr_pagetables[index].currentcol = getFirstColIndexHasInput(pg_name);

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,div.funkyradio").eq("0").removeAttr("data-disabled");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,div.funkyradio").eq("1").removeAttr("data-disabled");
    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,div.funkyradio").eq("2").removeAttr("data-disabled");

    if (pagetable_editable) {

        arr_pagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input:not([data-disabled]),select:not([data-disabled]),div.funkyradio:not([data-disabled])").attr("disabled", false);
    }
}

function tr_save_row(pg_name, keycode) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;

    var modelList = [];

    modelList = getModelInfoByRow(pagetable_currentrow, pagetable_id);

    if (!validateItem(modelList, pagetable_currentrow, 2, true))
        return;

    $.ajax({
        url: viewData_update_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelList),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);

                after_save_row(pg_name, "success", keycode, false);
            }
            else {
                var msg = alertify.error(msg_row_edit_error);
                msg.delay(alertify_delay);

                after_save_row(pg_name, "error", keycode, false);
            }
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_save_url_service);

            //getNewPageTable();

            after_save_row(pg_name, "error", keycode, false);

            return false;
        }
    });

};

function run_button_service(attrId) {

    pagetable_id = "service_pagetable";
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

    arr_pagetables[index].pagerowscount = 15;
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].lastpage = 1;
    arr_pagetables[index].currentrow = 1;
    arr_pagetables[index].currentcol = 0;
    arr_pagetables[index].highlightrowid = 0;
    arr_pagetables[index].trediting = false;
    arr_pagetables[index].filteritem = "";
    arr_pagetables[index].filtervalue = "";

    $(`#${pagetable_id} .filtervalue`).val('').inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");
    $(`#${pagetable_id} .btnfilter`).text("مورد فیلتر");
    $(`#${pagetable_id} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetable_id} .btnOpenFilter`).removeClass("d-none");

    service_init(attrId, pagetable_id);
    modal_show(`serviceModal`);
}

function updateRows(callBack = undefined) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "pagetable");
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var itemHasError = false;
    var modelList = [];
    for (var i = 0; i < $(`#${pagetable_id} .pagetablebody tbody tr`).length; i++) {
        var index = i + 1;
        var model = null;
        model = getModelInfoByRow(index);
        if (validateItem(model, index))
            modelList.push(model);
        else
            itemHasError = true;
    }

    if (!itemHasError) {
        $.ajax({
            url: viewData_update_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(modelList),
            async: false,
            cache: false,
            success: function (result) {
                if (result.successfull) {
                    var msg = alertify.success(msg_row_edited);
                    msg.delay(alertify_delay);
                    if (typeof callBack != "undefined")
                        callBack(true);
                }
                else {
                    var msg = alertify.error(msg_row_edit_error);
                    msg.delay(alertify_delay);

                    if (typeof callBack != "undefined")
                        callBack(false);
                }
                return result;
            },
            error: function (xhr) {
                error_handler(xhr, viewData_save_url_service);

                if (typeof callBack != "undefined")
                    callBack(true);

                return false;
            }
        });
    }
    else {
        var msg = alertify.error("تعدادی از سطرها حاوی خطا هستند، با مکث روی سطرهای قرمز، جزئیات خطا را ملاحظه کنید");
        msg.delay(alertify_delay);
    }
}

function getModelInfoByRow(row, pageId) {

    var modelList = null;
    var headerId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${row}`).data("id");
    var serviceId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${row}`).data("serviceid");
    var insurerTypeId = 0;

    if (pageId == "requestBasicInsurerPagetable") {
        insurerTypeId = 1;
        var confirmedBySystem = $(`#${pagetable_id} .pagetablebody > tbody > #row${row} > #col_${row}_15 select`).val();
        var confirmedBasicSharePrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${row} > #col_${row}_16 input`).prop("checked");
        var confirmedCompSharePrice = false;
    }
    else {
        insurerTypeId = 2;
        var confirmedBySystem = 0;
        var confirmedBasicSharePrice = false;
        var confirmedCompSharePrice = $(`#${pagetable_id} .pagetablebody > tbody > #row${row} > #col_${row}_12 input`).prop("checked");
    }

    modelList = [
        {
            headerId: headerId,
            serviceId: serviceId,
            confirmedBasicSharePrice: confirmedBasicSharePrice == false ? -1 : 1,
            confirmedCompSharePrice: confirmedCompSharePrice == false ? -1 : 1,
            confirmedBySystem: confirmedBySystem
        }
    ]

    var model = {
        reimbursementModel: modelList,
        insurerTypeId: insurerTypeId
    }

    return model;

}

function validateItem(modelValidate, row, isFromSingleLine = false) {
    var result = true;
    var resultError = "";

    var item = modelValidate.reimbursementModel[0];

    if (item.confirmedBySystem == 0 && item.confirmedBasicSharePrice == 1) {
        resultError = "زمانیکه وضعیت ارسال نسخ تعیین نشده، کسور بیمه اجباری نمیتواند انتخاب شود";
        result = false;
    }

    if (!result) {
        if (isFromSingleLine) {
            var msg = alertify.error(resultError);
            msg.delay(alertify_delay);
        }

        //disableUpdate();
        $(`#pagetable .pagetablebody > tbody #row${row}`).addClass("row-danger");
        $(`#pagetable .pagetablebody > tbody #row${row}`).attr("title", resultError);

    }
    else {
        $(`#pagetable .pagetablebody > tbody #row${row}`).removeClass("row-danger");
        $(`#pagetable .pagetablebody > tbody #row${row}`).removeAttr("title");
    }

    return result;
}

function navigateToModalAdmission(href, titlePage = null) {

    initialPage();
    $("#contentNewAdmission #content-page").addClass("displaynone");
    $("#contentNewAdmission #loader").removeClass("displaynone");
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (result) {
            $("#contentNewAdmission").html(result);
            modal_show("newAdmFormModal");
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });

    $("#contentNewAdmission #loader").addClass("displaynone");
    $("#contentNewAdmission #content-page").fadeIn().removeClass("displaynone").css("margin", 0);
    $("#contentNewAdmission #form,#contentNewAdmission .content").css("margin", 0);
    $("#contentNewAdmission #form .header-title .button-items #list_adm ,#contentNewAdmission #form .header-title .button-items #newForm").remove();
    $("#contentNewAdmission .step-content:eq(0)").attr("tabindex", "-1").focus();
}

async function modal_close_newAdm(afterSave = false) {

    afterSave ? getpageReimb() : ""
    modal_close("newAdmFormModal");
}

function checkOpenCashReimbursement(id) {
    let result = $.ajax({
        url: `${viewData_baseUrl_MC}/AdmissionApi/opencash`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, `${viewData_baseUrl_MC}/AdmissionApi/opencash`);
            return null;
        }
    });
    return result.responseJSON;
}

function getStageAction(workflowId, stageId, actionId, priority) {

    var url = `${viewData_baseUrl_WF}/StageActionApi/getaction`

    let model = {
        workflowId,
        stageId,
        actionId,
        priority: priority,
        isActive: true
    }

    var result = $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        success: function (result) {
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            return false;
        }
    });
    return result.responseJSON;
}

function run_button_edit(id, row, elm) {

    
    var check = controller_check_authorize("AdmissionApi", "UPD");
    if (!check)
        return;

    var cashierConfig = getCashIdByUserId();
    if (!checkResponse(cashierConfig)) {
        alertify.warning(`شناسه غرفه برای این سیستم مشخص نشده`);
        return;
    }


    let admissionMasterId = $(elm).parents(`tr#row${row}`).data("admissionmasterid")

    var resultOpenCash = checkOpenCashReimbursement(admissionMasterId);
    if (resultOpenCash) {
        alertify.warning("به علت بستن صندوق ویرایش پذیرش امکان پذیر نمی باشد").delay(admission.delay);
        return;
    }

    let currentRow = $(elm).parent().parent()
    let stageId = currentRow.data("stageid")
    let workflowId = currentRow.data("workflowid")
    let actionId = currentRow.data("actionid")

    let workflowStage = getAdmissionTypeId(stageId, workflowId)
    let admissionTypeId = workflowStage.admissionTypeId

    //saveAdmissionInfoForModal = {
    //    admissionId: id,
    //    stageId,
    //    workflowId,
    //    actionId
    //}

    admissionCashDetail = {}
    if (admissionTypeId == 2) {
        isReimburesment = true;
        navigateToModalAdmission(`/MC/Admission/newform/${id}`, "پذیرش");
    }
    else if (admissionTypeId == 3) {
        isReimburesment = true;
        navigateToModalAdmission(`/MC/AdmissionServiceTamin/newform/${id}`, "پذیرش");
    }
    else if (admissionTypeId == 4) {
        isReimburesment = true;
        alertify.warning("ویرایش پذیرش نسخه نویسی پاراکلینیک امکان پذیر نیست").delay(admission.delay);
    }

}

function tr_object_onchange(pg_name, selectObject, rowno, colno) { }

window.Parsley._validatorRegistry.validators.comparedate = undefined;
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

$(document).on("onkeydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        e.stopPropagation();
        $("#searchPatient").click();
    }
})

$("#newAdmFormModal").on("hidden.bs.modal", async function () {

});

$("#contentNewAdmission").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.keyCode === KeyCode.key_s) {
        ev.preventDefault();
        $("#saveForm").click();
    }
});

$("#AddEditModal").on("shown.bs.modal", function () {

    if ($("#basicInsurer").val().indexOf("8036") >= 0) {
        $("#insurNo").prop("disabled", true);
        $("#insurExpDatePersian").prop("disabled", true);
        $("#insurPageNo").prop("disabled", true);
    }
    else {
        $("#insurNo").prop("disabled", false);
        $("#insurExpDatePersian").prop("disabled", false);
        $("#insurPageNo").prop("disabled", false);
    }
});

$("#rb_fromReserveDatePersian,#rb_toReserveDatePersian").on("blur", function () {

    let currentId = $(this).prop("id")

    if ($("#rb_fromReserveDatePersian").val() !== "" && $("#rb_toReserveDatePersian").val() !== "" && isValidShamsiDate($("#rb_fromReserveDatePersian").val()) && isValidShamsiDate($("#rb_toReserveDatePersian").val())) {

        if (valueDate.from !== $("#rb_fromReserveDatePersian").val() || valueDate.to !== $("#rb_toReserveDatePersian").val()) {

            $("#rb_serviceId,#rb_attenderId,#rb_compInsurerId,#rb_insurerId").prop("disabled", true);
            fillElmntAdmission()
            if (currentId == 'rb_toReserveDatePersian')
                setTimeout(() => {
                    $("#rb_workflowId").select2("focus")
                }, 200)
        }
    }
});

$("#rb_insurerId").on("change", async function () {

    if (+$(this).val() != 0) {
        let modelFill = {
            fromReserveDatePersian: $("#rb_fromReserveDatePersian").val(),
            toReserveDatePersian: $("#rb_toReserveDatePersian").val(),
            basicInsurerId: $("#rb_insurerId").val(),
            type: 2,
            basicInsurerIds: $("#rb_insurerId").val(),
            isMultiple: false
        },
            data = getDataDropDown(modelFill);


        if (checkResponse(data.basicInsurerLineList)) {
            data.basicInsurerLineList.splice(0, 0, { id: 0, name: "انتخاب کنید", text: "انتخاب کنید" })
            await fill_select2WithData(data.basicInsurerLineList, "rb_basicInsurerLineId");
            $("#rb_basicInsurerLineId").prop("disabled", false);
        }
    }
    else {
        $("#rb_basicInsurerLineId").prop("disabled", true);
        $("#rb_basicInsurerLineId").html("<option value='0'>انتخاب کنید</option>");
    }

    $("#rb_basicInsurerLineId").val($("select#rb_basicInsurerLineId option:first").val()).trigger("change");
});

$("#rb_compInsurerId").on("change", async function () {

    if (+$(this).val() != 0) {
        let modelFill = {
            fromReserveDatePersian: $("#rb_fromReserveDatePersian").val(),
            toReserveDatePersian: $("#rb_toReserveDatePersian").val(),
            type: 3,
            compInsurerIds: $("#rb_compInsurerId").val(),
        }

        data = getDataDropDown(modelFill);

        if (checkResponse(data.compInsurerLineList)) {
            data.compInsurerLineList.splice(0, 0, { id: 0, name: "انتخاب کنید", text: "انتخاب کنید" })
            await fill_select2WithData(data.compInsurerLineList, "rb_compInsurerLineId");
            $("#rb_compInsurerLineId").prop("disabled", false);

        }
    }
    else {

        $("#rb_compInsurerLineId").prop("disabled", true);
        $("#rb_compInsurerLineId").html("<option value='0'>انتخاب کنید</option>");

    }

    $("#rb_compInsurerLineId").val($("select#rb_compInsurerLineId option:first").val()).trigger("change");
});

$("#searchPatient").on("click", function () {

    if ($("#firstName").val().trim().length < 3 && $("#lastName").val().trim().length < 3 && $("#nationalCode").val().length === 0 && $("#mobile").val().length === 0) {
        $("#firstName").focus();
        return;
    }

    var patientNationalCode = $("#nationalCode").val().length > 0 ? $("#nationalCode").val() : "";
    var patientFullName = `${$("#firstName").val().trim()} ${$("#lastName").val().trim()}`;
    var insurNo = "";
    var mobileNo = "";

    patientSearch(patientNationalCode, patientFullName, insurNo, mobileNo);
});

$("#rb_workflowId").on("change", function () {

    let workflowId = $(this).val().toString() == "" ? null : $(this).val(),
        workFlowCategoryId = "10,14";//workflowCategoryIds.medicalCare.id,
        stageClassId = "9,10,17,22,26,28",
        bySystem = 0,
        isActive = 2;

    $("#rb_stageId").empty();

    fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "rb_stageId", true, `null/${workflowId}/${workFlowCategoryId}/${stageClassId}/${bySystem}/${isActive}`, false, 3);

});

initReimbursment();
