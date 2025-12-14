
var activePageId = "", modelAssign = [], modelDiAssign = [],
    CurrentPrimaries = [], CurrentApiSetting = {}, isAfterSave = false,
    pageIdInsUp = "", callBackHeaderFillFunc = undefined, callbackBeforeHeaderFillFunc = undefined,
    callbackBeforeLineFillFunc = undefined, callbackLineFillFunc = undefined, itemsModel = {},
    OutPutCssTable = "", conditionTools = [], conditionAnswer = "", conditionElseAnswer = "",
    lineSelectedId = 0, dataOrder = { colId: "", sort: "", index: 0 }, scrolls = { current: 0, prev: 0 },
    stageStepConfig_url = `${viewData_baseUrl_WF}/StageStepConfigApi/getstagestepconfigcolumn`,
    getStageStepFieldTable_url = `${viewData_baseUrl_WF}/StageStepConfigApi/getstagestepfieldtables`,
    listForCondition = {}, isFormLoaded = true, headerFirstElemId = "", stageStepConfig = [],
    lineEdited = false, isDefaultActivateBtn = false, headerPagination = 0,
    headerNavigationConfigs = [], call_initform = undefined, additionalData = [], changeFromFillPageTable = false, afterHeaderLineActive = undefined,
    getRecordParameterFinalizeFunc = undefined, lastPageHeaderloaded = 0,
    formPlateHeaderLine_PageRowsCount = 15,
    configLineElementPrivilage = undefined,
    defaultCurrency = getDefaultCurrency(),
    defaultRounding = getRounding(defaultCurrency);


function display_pagination(opr) {
    var elemId = $(this).prop("id");
    $("#headerIndex").val("");
    //loadingAsync(true, elemId);
    display_paginationAsync(opr, elemId);
}

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
}

async function display_paginationAsync(opr, elemId) {
    headerPagination = 0;
    switch (opr) {
        case "first":
            headerPagination = 1;
            break;
        case "previous":
            headerPagination = 2;
            break;
        case "next":
            headerPagination = 3;
            break;
        case "last":
            headerPagination = 4;
            break;
    }

    call_initform(headerPagination, elemId)
}

function InitForm(pageId, hasHeaderNav, callBackHeaderFill = undefined, callBackBeforeHeaderFill = undefined, callBackLineFill = undefined, callBackBeforeLineFill = undefined,
    callBackHeaderColumnFill = undefined, getRecordParameterFinalize = undefined) {

    activePageId = pageId;
    if (getRecordParameterFinalize != undefined)
        getRecordParameterFinalizeFunc = getRecordParameterFinalize;

    if (callBackHeaderFill != undefined)
        callBackHeaderFillFunc = callBackHeaderFill;

    if (callBackBeforeHeaderFill != undefined)
        callbackBeforeHeaderFillFunc;

    if (callBackBeforeLineFill !== undefined)
        callbackBeforeLineFillFunc = callBackBeforeLineFill;

    if (callBackLineFill !== undefined)
        callbackLineFillFunc = callBackLineFill
    var pageViewModel = {
        Form_KeyValue: headerLine_formkeyvalue
    }

    appendNavPageButton(activePageId, hasHeaderNav);

    var url = viewData_getpagetable_url;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            if (result.successfull) {
                if (callbackBeforeHeaderFillFunc != undefined)
                    callbackBeforeHeaderFillFunc();

                headerNavigationConfigs = result.columns.navigations;
                showHeader(result);

                $(`#${activePageId} #header-div-content`).css("opacity", 1);
                if (headerPagination > 0) {
                    headerLine_formkeyvalue[0] = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
                    updateAdditionalData();
                }

                if (callBackHeaderFillFunc != undefined)
                    callBackHeaderFillFunc();

                var headerLineData = result.data[arr_headerLinePagetables[0].pagetable_id];

                if (headerLineData != null && headerLineData.headerColumns != null && headerLineData.columns.headerType == "outline") {
                    var lineFields = headerLineData.headerColumns.stageStepConfig.lineFields;
                    if (lineFields != null && lineFields.length > 0) {
                        for (var i in lineFields) {
                            var dataColumn = headerLineData.headerColumns.dataColumns.filter(a => a.id == lineFields[i].fieldId)[0];
                            if (dataColumn != undefined) {
                                dataColumn.notResetInHeader = true;
                            }
                        }
                    }

                    showHeaderColumns(arr_headerLinePagetables[0].pagetable_id, headerLineData);
                }

                if (callbackBeforeLineFillFunc != undefined)
                    callbackBeforeLineFillFunc();
                else {
                    showHeaderLines(arr_headerLinePagetables, result);
                }
            }

            else {
                var msg = alertify.error(result.message);
                msg.delay(alertify_delay);
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

function InitFormLine(callBackBefore = undefined, callBackAfter = undefined) {

    if (callBackBefore != undefined)
        callBackBefore();

    showHeaderLines(arr_headerLinePagetables, null, callBackAfter);

}

function updateAdditionalData() {
}

function appendNavPageButton(pgId, hasHeaderNav) {
    if ($(`#${pgId} #header-div .button-items #headerFirst`).length == 0 && hasHeaderNav) {
        $(`#${pgId} #header-div .button-items`).append(`<button title="اولین" id="headerFirst" onclick="display_pagination('first')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-next"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="قبلی"  id="headerPrevious" onclick="display_pagination('previous')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<input id="headerIndex" onkeydown="headerindexChoose(event)" type="text" autocomplete="off" class="form-control number col-1 d-inline mr-2 ml-1" maxlength="10" placeholder="شناسه برگه"/>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="بعدی"  id="headerNext" onclick="display_pagination('next')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play fa-rotate-180"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="آخرین" id="headerLast" onclick="display_pagination('last')" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-previous"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="چاپ" id="headerLast" onclick="printFromPlateHeaderLine()" type="button" class="btn btn-print waves-effect"><i class="fa fa-print"></i>چاپ</button>`);
    }
}

function remove_filter(elem) {
    var pagetableId = $(elem).closest(".card-body").attr("id");
    $(`#${pagetableId} .btnRemoveFilter`).addClass("d-none");
    $(`#${pagetableId} .btnOpenFilter`).removeClass("d-none");
    pagetable_change_filteritemHeaderLine('filter-non', 'مورد فیلتر', '0', '0', pagetableId);
}

function printFromPlateHeaderLine() {
}

function showHeaderAfterUpd(result) {

    var headerDiv = $(`#${activePageId} #header-div-content`);
    headerDiv.html("");
    var headerMainDiv = `<fieldset class='group-box mt-3 ${result.columns.classes}'><legend>${result.columns.title}</legend></fieldset>`;
    headerDiv.append(headerMainDiv);

    var columns = result.columns.dataColumns;
    var buttons = result.columns.buttons;
    var btn_tbidx = 1000;
    var item = result.data;
    var colwidth = 0;
    var firstElemFocus = false;
    var primaries = "";
    var hiddens = "";
    var itemheader = "";
    var rowno = 1;
    var colno = 0;

    $(`#${activePageId} #headeUpdateModal .modal-body .row`).html("");
    $.each(columns, function (k, v) {
        if (v["isPrimary"] === true)
            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
    })
    var seccoundClass = "plateheader-editmode";
    $(`#${activePageId} #header-div-content fieldset`)
        .append(`<div style="padding: .5rem 0.5rem;">
                    <div class="table-responsive" id="parentPageTableBody" >
                        <table class="table" style="table-layout:fixed">
                            <thead>
                                <tr id="formPlateHeaderTHead"></tr>
                            </thead>
                            <tbody>
                                <tr class="PlateHeader-Body ${seccoundClass}" id="formPlateHeaderTBody"  ${primaries} ${hiddens}></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`);


    for (var j in columns) {
        colwidth = columns[j].width;
        var value = item[columns[j].id];
        if (columns[j].isDtParameter) {
            if (columns[j].id != "action") {
                if (columns[j].isDisplayNone) {

                    itemheader = `<input tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value}" class="form-control displaynone" onchange="object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled/>`;
                    $(`#${activePageId} #header-div-content fieldset`).append(itemheader + "</td>");
                }
                else {
                    var itemheaderThead = `<th style="width:${colwidth}rem">${columns[j].title}</th>`;
                    $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTHead`).append(itemheaderThead);

                    colno += 1;
                    var value = item[columns[j].id] === null ? "" : item[columns[j].id];
                    if (columns[j].hasLink && value != "0" && value != "" && value != null)
                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem"><span onclick="click_link_header(this)" data-id="${columns[j].id}" class="itemLink">${value}</span></td>`;
                    else if (columns[j].isCommaSep) {

                        if (value < 0) {
                            value = "(" + transformNumbers.toComma((Math.abs(value)).toString()) + ")";
                        }
                        else {
                            value = transformNumbers.toComma((value).toString())
                        }

                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem" ${columns[j].className !== "" ? `class="${columns[j].className}"` : ""}>${value}</td>`;
                    }
                    else
                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem">${value}</td>`;

                    $(itemheader).appendTo(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`);
                }
            }
            else {
                $(`#${activePageId} #header-div-content #formPlateHeaderTHead`).append(`<th style="width:${colwidth}rem">${columns[j].title}</th>`);

                for (var k in buttons) {
                    var btn = buttons[k];
                    if (btn.isSeparator == false) {
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="padding:5px !important;width:${colwidth}rem"><button type="button" id="btn_${btn.name}" onclick="run_button_${btn.name}()" class="${btn.className}" tabindex="${btn_tbidx}"><i class="${btn.iconName}" style="float: initial;padding: 0;"></i></button></td>`);
                        btn_tbidx++;
                    }
                    else
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="padding:5px !important;width:${colwidth}rem"><span class="button-seprator-ver"></span></td>`);
                }
            }
        }
    }


    columns = columns.sort((a, b) => (a.inputOrder > b.inputOrder) ? 1 : -1);
    for (var j in columns) {
        colwidth = columns[j].width;
        var value = item[columns[j].id];

        if (!columns[j].isDisplayNone && columns[j].editable && columns[j].id != "action") {

            var validators = "";
            if (columns[j].validations != null) {
                var validations = columns[j].validations;
                for (var v = 0; v < validations.length; v++) {

                    if (validations[v].value1 == null && validations[v].value2 == null) {
                        validators += " " + validations[v].validationName;
                    }
                    else if (validations[v].validationName.indexOf("range") >= 0) {
                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                    }
                    else if (validations[v].value1 != undefined) {
                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                    }
                    else {
                        validators += ` ${validations[v].validationName} `;
                    }
                }
            }

            itemheader = `<div class="form-group col-sm-${colwidth}"><label>${columns[j].title}</label>`;

            if (columns[j].inputType == "") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} tabindex="${btn_tbidx}" ${columns[j].isReadOnly == true ? 'disabled' : ''} type="text" id="${columns[j].id}" value="${value === null ? "" : value}" class="form-control" autocomplete="off" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"/>`;

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                btn_tbidx++;
            }
            else if (columns[j].inputType == "select") {

                var lenInput = columns[j].inputs !== null ? columns[j].inputs.length : 0;

                if (columns[j].fillType === "back") {

                    if (lenInput !== 0) {

                        itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''} tabindex="${btn_tbidx}" data-val="${value}" class="form-control" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                        itemheader += ">";

                        if (columns[j].pleaseChoose)
                            itemheader += `<option value="0">انتخاب کنید</option>`;

                        for (var h = 0; h < lenInput; h++) {

                            var input = columns[j].inputs[h];
                            if (value != +input.id)
                                itemheader += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                            else
                                itemheader += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                        }

                        itemheader += "</select>";
                        if (validators != "")
                            itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                        $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                        if (columns[j].isSelect2) {
                            if (columns[j].editable && !firstElemFocus) {

                                $(`#${columns[j].id}`).select2();
                                firstElemFocus = true;
                                headerFirstElemId = columns[j].id;
                            }
                            else {
                                $(`#${columns[j].id}`).select2();
                            }
                        }
                    }
                    else {
                        itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" data-val="${value}" class="form-control" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                        itemheader += ">";

                        itemheader += "</select>";
                        if (validators != "")
                            itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                        $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                        if (typeof columns[j].select2Title !== typeof undefined && columns[j].select2Title !== "") {

                            if (columns[j].isSelect2 === true) {
                                if (columns[j].editable && !firstElemFocus) {

                                    $(`#${columns[j].id}`).select2();
                                    firstElemFocus = true;
                                    headerFirstElemId = columns[j].id;

                                }
                                else {
                                    $(`#${columns[j].id}`).select2();
                                }
                            }

                            if (typeof item[columns[j].select2Title] !== typeof undefined && item[columns[j].select2Title] !== "") {
                                var newOption = new Option(`${value} - ${item[columns[j].select2Title]}`, value, true, true);
                                $(`#${columns[j].id}`).append(newOption).trigger('change');
                            }
                        }
                    }
                }
                else if (columns[j].fillType === "front") {
                    itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" data-val="${value}" value="${value === null ? "" : value}" class="form-control" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                    itemheader += ">";

                    if (columns[j].pleaseChoose)
                        itemheader += `<option value="0">انتخاب کنید</option>`;

                    itemheader += "</select>";
                    if (validators != "")
                        itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                    $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                    if (columns[j].isSelect2) {
                        if (columns[j].editable && !firstElemFocus) {
                            $(`#${columns[j].id}`).select2();
                            firstElemFocus = true;
                            headerFirstElemId = columns[j].id;

                        }
                        else {
                            $(`#${columns[j].id}`).select2();
                        }
                    }
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "datepersian") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" placeholder="____/__/__" required maxlength="10" autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "datepicker") {

                itemheader += `<div><input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" placeholder="____/__/__" required maxlength="10" autocomplete="off"`;
                itemheader += "/>";
                itemheader += "</div>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "checkbox") {
                itemheader += `<div ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" class="funkyradio funkyradio-success"  onkeydown="funkyradio_keydown(event,'${columns[j].id}')" >`;
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''} type="checkbox" id="${columns[j].id}" onchange="funkyradio_onchange(this)" switch-value="غیر فعال,فعال" name="checkbox" ${value ? "checked" : ""}  ${!columns[j].editable ? "disabled" : ""} />
                                        <label for="${columns[j].id}"></label>
                                   </div>`;
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "number") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control number" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "money") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "money-decimal") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "decimal") {

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else {

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value}" class="form-control" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;//TabIndex   Mr_Tag2
            }
        }
    }

    $.each($("#headeUpdateModal .modal-body .row .persian-datepicker"), function (key, val) {
        kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
    });
    $("#headeUpdateModal .modal-footer #modal-save").attr("tabindex", btn_tbidx);

    funkyradio_switchvalue();
    //setTimeout(function () {
    //    var checkInputs = $("#headeUpdateModal .modal-body .row").find("input[type='checkbox']");
    //    for (var i = 0; i < checkInputs.length; i++) {
    //        setDefaultActiveCheckbox($(checkInputs[i]));
    //    }
    //}, 100);
    if (callBackHeaderFillFunc != undefined)
        callBackHeaderFillFunc();

}

function headerindexChoose(e) {

}

function showHeader(result) {

    var headerDiv = $(`#${activePageId} #header-div-content`);
    headerDiv.html("");
    var headerMainDiv = `<fieldset class='group-box mt-3 ${result.columns.classes}'><legend>${result.columns.title}</legend></fieldset>`;
    headerDiv.append(headerMainDiv);

    var columns = result.columns.dataColumns;
    var buttons = result.columns.buttons;
    var btn_tbidx = 1000;
    var item = result.data;
    var rowno = 1;
    var colno = 0;
    var colwidth = 0;
    var firstElemFocus = false;
    var primaries = "";
    var hiddens = "";
    var itemheader = "";

    $(`#${activePageId} #headeUpdateModal .modal-body .row`).html("");
    $.each(columns, function (k, v) {
        if (v["isPrimary"] === true)
            primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
    })
    var seccoundClass = "plateheader-editmode";
    $(`#${activePageId} #header-div-content fieldset`)
        .append(`<div style="padding: .5rem 0.5rem;">
                    <div class="table-responsive">
                        <table class="table" style="table-layout:fixed">
                            <thead>
                                <tr id="formPlateHeaderTHead">
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="PlateHeader-Body ${seccoundClass}" id="formPlateHeaderTBody" ${primaries} ${hiddens}></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`);




    var columnLength = columns.length;
    for (var j = 0; j < columnLength; j++) {
        colwidth = columns[j].width;
        var value = item[columns[j].id];
        if (columns[j].isDtParameter) {
            if (columns[j].id != "action") {
                if (columns[j].isDisplayNone) {

                    itemheader = `<input tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value}" class="form-control displaynone" onchange="object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled/>`;
                    $(`#${activePageId} #header-div-content fieldset`).append(itemheader + "</td>");
                }
                else {
                    var itemheaderThead = `<th style="width:${colwidth}rem">${columns[j].title}</th>`;
                    $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTHead`).append(itemheaderThead);

                    colno += 1;
                    var value = item[columns[j].id] === null ? "" : item[columns[j].id];
                    if (columns[j].hasLink && value != "0" && value != "" && value != null)
                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem"><span onclick="click_link_header(this)" data-id="${columns[j].id}" class="itemLink">${value}</span></td>`;
                    else if (columns[j].isCommaSep) {

                        if (value < 0) {
                            value = "(" + transformNumbers.toComma((Math.abs(value)).toString()) + ")";
                        }
                        else {
                            value = transformNumbers.toComma((value).toString())
                        }

                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem" ${columns[j].className !== "" ? `class="${columns[j].className}"` : ""}>${value}</td>`;
                    }
                    else
                        itemheader = `<td style="padding:5px !important;width:${colwidth}rem">${value}</td>`;

                    $(itemheader).appendTo(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`);
                }
            }
            else {

                $(`#${activePageId} #header-div-content #formPlateHeaderTHead`).append(`<th style="width:${colwidth}rem">${columns[j].title}</th>`);

                var buttonsLen = buttons.length;

                for (var k = 0; k < buttonsLen; k++) {
                    var btn = buttons[k];
                    if (btn.isSeparator == false) {
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="width:${colwidth}rem"><button type="button" id="btn_${btn.name}" onclick="run_button_${btn.name}()" class="${btn.className}" tabindex="${btn_tbidx}"><i class="${btn.iconName}" style="float: initial;padding: 0;"></i></button></td>`);
                        btn_tbidx++;
                    }
                    else
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="width:${colwidth}rem"><span class="button-seprator-ver"></span></td>`);
                }
            }
        }
    }
    columns = columns.sort((a, b) => (a.inputOrder > b.inputOrder) ? 1 : -1);
    for (var j in columns) {
        colwidth = columns[j].width;
        var value = item[columns[j].id];

        if (!columns[j].isDisplayNone && columns[j].editable && columns[j].id != "action") {
            var validators = "";
            if (columns[j].validations != null) {
                var validations = columns[j].validations;
                for (var v = 0; v < validations.length; v++) {

                    if (validations[v].value1 == null && validations[v].value2 == null) {
                        validators += " " + validations[v].validationName;
                    }
                    else if (validations[v].validationName.indexOf("range") >= 0) {
                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                    }
                    else if (validations[v].value1 != undefined) {
                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                    }
                    else {
                        validators += ` ${validations[v].validationName} `;
                    }
                }
            }

            itemheader = `<div class="form-group col-sm-${colwidth}"><label>${columns[j].title}</label>`;

            if (columns[j].inputType == "") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} tabindex="${btn_tbidx}" ${columns[j].isReadOnly == true ? 'disabled' : ''} type="text" id="${columns[j].id}" value="${value === null ? "" : value}" class="form-control ${columns[j].isNotFocusSelect ? 'notFocusSelect' : ''}" autocomplete="off" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"/>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                btn_tbidx++;
            }
            else if (columns[j].inputType == "select") {

                var lenInput = columns[j].inputs !== null ? columns[j].inputs.length : 0;

                if (columns[j].fillType === "back") {

                    if (lenInput !== 0) {

                        itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''} tabindex="${btn_tbidx}" data-val="${value}" class="form-control" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                        itemheader += ">";

                        if (columns[j].pleaseChoose)
                            itemheader += `<option value="0">انتخاب کنید</option>`;

                        for (var h = 0; h < lenInput; h++) {

                            var input = columns[j].inputs[h];
                            if (value != +input.id)
                                itemheader += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                            else
                                itemheader += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                        }

                        itemheader += "</select>";

                        if (validators != "")
                            itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                        $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                        if (columns[j].isSelect2) {
                            if (columns[j].editable && !firstElemFocus) {

                                $(`#${columns[j].id}`).select2();
                                firstElemFocus = true;
                                headerFirstElemId = columns[j].id;
                            }
                            else {
                                $(`#${columns[j].id}`).select2();
                            }
                        }
                    }
                    else {
                        itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" data-val="${value}" class="form-control" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                        itemheader += ">";

                        itemheader += "</select>";

                        if (validators != "")
                            itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                        $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                        if (typeof columns[j].select2Title !== typeof undefined && columns[j].select2Title !== "") {

                            if (columns[j].isSelect2 === true) {
                                if (columns[j].editable && !firstElemFocus) {

                                    $(`#${columns[j].id}`).select2();
                                    firstElemFocus = true;
                                    headerFirstElemId = columns[j].id;

                                }
                                else {
                                    $(`#${columns[j].id}`).select2();
                                }
                            }

                            if (typeof item[columns[j].select2Title] !== typeof undefined && item[columns[j].select2Title] !== "") {
                                var newOption = new Option(`${value} - ${item[columns[j].select2Title]}`, value, true, true);
                                $(`#${columns[j].id}`).append(newOption).trigger('change');
                            }
                        }
                    }
                }
                else if (columns[j].fillType === "front") {

                    itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" data-val="${value}" value="${value === null ? "" : value}" class="form-control select2" id="${columns[j].id}" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)"`;
                    itemheader += ">";

                    if (columns[j].pleaseChoose)
                        itemheader += `<option value="0">انتخاب کنید</option>`;

                    itemheader += "</select>";

                    if (validators != "")
                        itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                    $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                    if (columns[j].isSelect2) {
                        if (columns[j].editable && !firstElemFocus) {
                            $(`#${columns[j].id}`).select2();
                            firstElemFocus = true;
                            headerFirstElemId = columns[j].id;

                        }
                        else {
                            $(`#${columns[j].id}`).select2();
                        }
                    }
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "datepersian") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="public_object_onchange(this)" onblur="object_onblur(this)"  onfocus="object_onfocus(this)" placeholder="____/__/__"  maxlength="10" autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "datepicker") {

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="public_object_onchange(this)" onblur="object_onblur(this)"  onfocus="object_onfocus(this)" placeholder="____/__/__" required maxlength="10" autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "checkbox") {
                itemheader += `<div ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" class="funkyradio funkyradio-success"  onkeydown="funkyradio_keydown(event,'${columns[j].id}')" >`;
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''} type="checkbox" id="${columns[j].id}" onchange="funkyradio_onchange(this)" switch-value="غیر فعال,فعال" name="checkbox" ${value ? "checked" : ""}  ${!columns[j].editable ? "disabled" : ""} />
                                        <label for="${columns[j].id}"></label>
                                   </div>`;

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "number") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value : ""}" class="form-control number" onchange="public_object_onchange(this)" onblur="object_onblur(this)"  onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "money") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="object_onchange(this)" onblur="public_object_object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "money-decimal") {
                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onchange="object_onchange(this)" onblur="public_object_object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "decimal") {

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onchange="object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else {

                itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly == true ? 'disabled' : ''}  tabindex="${btn_tbidx}" type="text" id="${columns[j].id}" value="${value}" class="form-control" onchange="object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");
                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;//TabIndex   Mr_Tag2
            }
        }
    }

    funkyradio_switchvalue();
    //setTimeout(function () {
    //    var checkInputs = $("#headeUpdateModal .modal-body .row").find("input[type='checkbox']");
    //    for (var i = 0; i < checkInputs.length; i++) {
    //        setDefaultActiveCheckbox($(checkInputs[i]));
    //    }
    //}, 100);

    $.each($("#headeUpdateModal .modal-body .row .persian-datepicker"), function (key, val) {
        kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
    });
    $("#headeUpdateModal .modal-footer #modal-save").attr("tabindex", btn_tbidx);
}

function showHeaderColumns(pageId, result) {
    changeFromFillPageTable = true;
    if ($(`#${activePageId} #${pageId}`).length == 0)
        render_formPlateHeaderLineHtml(arr_headerLinePagetables[0].pagetable_id, result);
    if (isFormLoaded) {
        var colno = 0;
        var rowno = 0;
        var btn_tbidx = 2000;
        var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
        arr_headerLinePagetables[index].headerColumns = result.headerColumns;
        var headerColumns = result.headerColumns != null ? result.headerColumns.dataColumns : null;

        var headerButtons = result.headerColumns != null ? result.headerColumns.buttons : null;

        $(".ins-out").remove();
        $(`#${activePageId} #${pageId}`).prepend(`<div class='ins-out'><div class='row' data-parsley-validate></div></div>`);
        for (var j in headerColumns) {
            var validators = "";
            if (headerColumns[j].validations != null) {
                var validations = headerColumns[j].validations;
                for (var v = 0; v < validations.length; v++) {

                    if (validations[v].value1 == null && validations[v].value2 == null) {
                        validators += " " + validations[v].validationName;
                    }
                    else if (validations[v].validationName.indexOf("range") >= 0) {
                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                    }
                    else if (validations[v].value1 != undefined) {
                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                    }
                    else {
                        validators += ` ${validations[v].validationName} `;
                    }
                }
            }

            colwidth = headerColumns[j].width;

            if (headerColumns[j].isDtParameter) {
                if (headerColumns[j].id != "action") {
                    colno += 1;

                    var itemheader = `<div class="form-group col-sm-${headerColumns[j].width}"><label>${headerColumns[j].title}</label><div>`;

                    if (headerColumns[j].inputType == "select") {
                        itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} class="form-control select2" id="${headerColumns[j].id}" 
                                            ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} ${headerColumns[j].headerReadOnly == true ? ' disabled data-notReset="true"' : ''}
                                            tabindex="${btn_tbidx}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="object_onblur(this)" onfocus="tr_object_onfocus(this,event)" disabled>`;

                        if (headerColumns[j].pleaseChoose)
                            itemheader += `<option value="0">انتخاب کنید</option>`;

                        var lenInput = headerColumns[j].inputs == null ? 0 : headerColumns[j].inputs.length;

                        for (var h = 0; h < lenInput; h++) {
                            var input = headerColumns[j].inputs[h];
                            itemheader += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                        }

                        itemheader += "</select></div>";

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].isSelect2 === true) {
                            if (headerColumns[j].editable && !firstElemFocus) {

                                $(`#${activePageId} #${headerColumns[j].id}`).val(0);
                                firstElemFocus = true;
                            }
                            else {
                                $(`#${activePageId} #${headerColumns[j].id}`).val(0);
                            }

                            $(`#${activePageId} #${headerColumns[j].id}`).select2();
                        }
                        else
                            $(`#${activePageId} #${headerColumns[j].id}`).val(0);

                        //if (headerColumns[j].getInputSelectConfig != undefined) {

                        //    var getInputSelectConfig = headerColumns[j].getInputSelectConfig;
                        //    var elemId = headerColumns[j].id;
                        //    var params = "";
                        //    var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;
                        //    if (parameterItems.length > 0) {
                        //        for (var i = 0; i < parameterItems.length; i++) {
                        //            var paramItem = parameterItems[i].id;
                        //            if (parameterItems[i].inlineType)
                        //                params += $(`#${activePageId} #${paramItem}_${rowno}`).val();
                        //            else
                        //                params += $(`#${activePageId} #${paramItem}`).val();
                        //            if (i < parameterItems.length - 1)
                        //                params += "/";
                        //        }
                        //    }

                        //    $(`#${activePageId} #${elemId}`).empty();

                        //    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {
                        //        fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, '', function () {
                        //            $(`#${elemId}`).trigger("change");
                        //        });
                        //    }

                        //}

                        btn_tbidx++;

                    }
                    else if (headerColumns[j].inputType == "datepersian") {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" tabindex="${btn_tbidx}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} class="form-control persian-date" data-inputmask="${headerColumns[j].inputMask.mask}" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)'  onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" required maxlength="10" autocomplete="off"disabled /></div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        $(`#${activePageId} #${headerColumns[j].id}`).inputmask();
                        if (headerColumns[j].editable /*&& !firstElemFocus*/) {

                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "datepicker") {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""}
                        type="text" id="${headerColumns[j].id}" tabindex="${btn_tbidx}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} 
                        ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} class="form-control persian-datepicker" 
                        data-inputmask="${headerColumns[j].inputMask.mask}" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" 
                        onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)'  
                        onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" maxlength="10" autocomplete="off"disabled /></div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        $(`#${activePageId} #${headerColumns[j].id}`).inputmask();
                        if (headerColumns[j].editable /*&& !firstElemFocus*/) {

                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "checkbox") {

                        itemheader += `<div tabindex="${btn_tbidx}" class="funkyradio funkyradio-success" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''}  onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" tabindex="-1">`;

                        itemheader += `<input onchange="funkyradio_onchange(this)" switch-value="غیر فعال,فعال" ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="checkbox" id="${headerColumns[j].id}" name="checkbox" id="btn_${rowno}_${colno}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} disabled />
                                </div></div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        //setDefaultActiveCheckbox($(`#${headerColumns[j].id}`));
                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "number") {
                        if (headerColumns[j].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${headerColumns[j].minValue} - ${headerColumns[j].maxValue} </div></div>`;

                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${columns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId})'" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled/></div>`;
                            itemheader += priceRangeControl;
                        }
                        else {
                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)"  onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled/></div>`;
                        }

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "money") {

                        showFocusRangeControl
                        if (headerColumns[j].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${headerColumns[j].minValue} - ${headerColumns[j].maxValue} </div></div>`;

                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled/></div>`;
                            itemheader += priceRangeControl;
                        }
                        else {
                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled /></div>`;
                        }

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "money-decimal") {

                        showFocusRangeControl
                        if (headerColumns[j].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${headerColumns[j].minValue} - ${headerColumns[j].maxValue} </div></div>`;

                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled/></div>`;
                            itemheader += priceRangeControl;
                        }
                        else {
                            itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled /></div>`;
                        }

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "decimal") {

                        var mask = headerColumns[j].inputMask != null ? headerColumns[j].inputMask.mask : '';

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""}
                        type="text"
                         id="${headerColumns[j].id}" 
                        ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} 
                        ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''}
                        tabindex="${btn_tbidx}" 
                        class="form-control decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)"
                        data-inputmask='${mask}'
                        onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' 
                        onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)"
                        oninput = "tr_object_oninput(event,this)" 
                        ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''}
                        autocomplete="off"disabled/></div>`;



                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        $(`#${headerColumns[j].id}`).inputmask();
                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else {

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} type="text" id="${headerColumns[j].id}" ${headerColumns[j].headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${headerColumns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} autocomplete="off"disabled/></div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div></div>`;
                        }
                        else
                            itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);
                        //if (columns[j].editable && !firstElemFocus) {
                        //    $(`#${columns[j].id}`).focus();
                        //    firstElemFocus = true;
                        //}
                        btn_tbidx++;
                    }
                }
            }
        }
        //$(`#${pageId} .ins-out`).append(`<button tabindex="${btn_tbidx}" id="haederLineCancel" onclick="headerLineCancel('${pageId}')" class="btn btn-danger mr-1 pa float-left  d-none"><i class="fa fa-times"></i></button></th>`);

        for (var k in headerButtons) {
            var btn = headerButtons[k];

            $(`#${activePageId} #${pageId} .ins-out`).append(`<button type="button" id="${btn.name}" onclick="headerLineIns('${pageId}')" class="${btn.className} float-left waves-effect" tabindex="${btn_tbidx}" disabled>${btn.title}</button>`);
            btn_tbidx++;
        }
        $(`#${activePageId} #${pageId} .ins-out`).append(`<button type="button" id="haederLineActive" data-toggle="tooltip" data-placement="top" data-disabled="false" onclick="headerLineActive('${pageId}')" class="btn ml-2 pa float-sm-left waves-effect" tabindex="${btn_tbidx + 1}">فعال سازی</button>`);
    }

    funkyradio_switchvalue();


    changeFromFillPageTable = false;
    if (typeof callBackHeaderColumnFill != "undefined")
        callBackHeaderColumnFill();
}

function showHeaderLines(arr_pagetables, result, callback = undefined) {

    let headerLineData = null;

    var pageId = arr_pagetables[0].pagetable_id;

    if (result !== null)
        headerLineData = result.data[pageId];

    getPagetable_HeaderLine(pageId, headerLineData, false, callback);

}

//function run_button_header_update() {
//    if (typeof checkEditOrDeletePermission != "undefined") {
//        if (!checkEditOrDeletePermission()) {
//            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
//            msgItem.delay(alertify_delay);
//            return;
//        }
//    }
//    if (typeof isLoadEdit !== "undefined")
//        isLoadEdit = true;
//    get_header();
//    if (typeof after_showHeaderModal != "undefined")
//        after_showHeaderModal();
//    modal_show("headeUpdateModal");
//}

function headeUpdateModal_close() {
    modal_close("headeUpdateModal");
}

function header_updateValidtion() {
    header_update();
}

function header_update() {
    var form = $(`#headeUpdateModal .modal-body`).parsley();
    validate = form.validate();
    validateSelect2(form);
    if (!validate) return;

    var newModel = {};
    var swReturn = false;
    var element = $(`#${activePageId} #headeUpdateModal .modal-body .row`);
    var rowdata = $(`#${activePageId} #header-div-content tbody tr:first`).data();

    $.each(rowdata, function (k, v) {
        newModel[k] = v;
    })

    element.find("input,select,img,textarea").each(function () {
        var elm = $(this);
        var elmid = elm.attr("id");
        var val = "";
        if (elm.data("value") != undefined) {
            val = elm.data("value");
        }
        else {
            if (elm.hasClass("money"))
                val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
            else if (elm.hasClass("decimal"))
                val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
            else if (elm.hasClass("number"))
                val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
            else if (elm.hasClass("str-number"))
                val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
            else if (elm.attr("type") == "checkbox")
                val = elm.prop("checked");
            else //if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
                val = elm.val();
            //else
            //    if (val !== null)
            //        val = myTrim(elm.val());
        }
        var tag = elm.prop("tagName").toLowerCase();
        if (tag === `img`) {
            var src = elm.attr("src");
            var pos = src.indexOf("base64,");
            if (pos != -1) {
                val = src.substring(pos + 7);
                var decoded = atob(val);
                if (decoded.length >= 51200) {
                    alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                    swReturn = true;
                    return;
                }
                elmid = elmid + "_base64";
            }
        }

        if (val != "")
            newModel[elmid] = val;
    });
    if (swReturn)
        return;


    $.ajax({
        url: viewData_updrecord_header_url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);
                //call_initform();
                get_header();
                headeUpdateModal_close();
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(4);
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
            error_handler(xhr, viewData_updrecord_header_url)
        }
    });
}

function get_header() {

    var pageViewModel = {
        Form_KeyValue: headerLine_formkeyvalue
    }

    var url = viewData_getHeader_url;

    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: JSON.stringify(pageViewModel),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {

            showHeaderAfterUpd(result);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });

}

function getPagetable_HeaderLine(pg_id = null, result = null, fromInit = false, callBack = undefined, isInsert = false) {

    if (pg_id == null)
        pg_id = "pagetable";
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_id);
    if (!isInsert) {
        arr_headerLinePagetables[index].currentpage = 1;
        arr_headerLinePagetables[index].pageno = 0;
        arr_headerLinePagetables[index].currentrow = 1;
        arr_headerLinePagetables[index].endData = false;
    }
    pageIdInsUp = pg_id;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_pageno = arr_headerLinePagetables[index].pageno;
    var pagetable_pagerowscount = formPlateHeaderLine_PageRowsCount;
    var pagetable_lastpage = arr_headerLinePagetables[index].lastpage;
    var pagetable_filteritem = arr_headerLinePagetables[index].filteritem;
    var pagetable_filtervalue = arr_headerLinePagetables[index].filtervalue;
    var pagetable_url = arr_headerLinePagetables[index].getpagetable_url;
    var pagetable_filter = arr_headerLinePagetables[index].getfilter_url;
    var pagetable_laststate = arr_headerLinePagetables[index].pagetable_laststate;

    if (!checkResponse(pagetable_laststate)) {
        pagetable_laststate = ""
    }

    if (pagetable_laststate == "nextpage") {
        if (pagetable_currentpage < pagetable_lastpage)
            pagetable_currentpage++;
    }
    else if (pagetable_laststate == "prevpage") {
        if (pagetable_currentpage > 1)
            pagetable_currentpage--;
    }

    if (pagetable_currentpage === 0) pagetable_currentpage = 1;

    arr_headerLinePagetables[index].currentpage = pagetable_currentpage;

    //var pagetable_pagerowscount = arr_headerLinePagetables[index].pagerowscount;
    //if (pagetable_pagerowscount === 0)
    //    pagetable_pagerowscount = $(`#${pg_id} .pagerowscount > button:first`).text();

    if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && (pagetable_filtervalue == "" || pagetable_filtervalue == null)) {
        var msg = alertify.error('عبارت فیلتر وارد نشده');
        msg.delay(alertify_delay);
        return;
    }

    if ((pagetable_filtervalue != "" && pagetable_filtervalue != null) && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
        var msg = alertify.error('مورد فیلتر انتخاب نشده');
        msg.delay(alertify_delay);
        return;
    }

    var pageViewModel = {
        pageno: pagetable_pageno,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue,
        sortModel: {
            colId: dataOrder.colId,
            sort: dataOrder.sort
        }
    }
    pageViewModel.Form_KeyValue = headerLine_formkeyvalue;

    var url = "", filterUrl = "";

    if (pagetable_url === undefined)
        url = viewData_getpagetable_url;
    else
        url = pagetable_url;

    if (pagetable_filter === undefined)
        filterUrl = viewData_filter_url;
    else
        filterUrl = pagetable_filter;

    if (result == null) {
        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(pageViewModel),
            dataType: "json",
            contentType: "application/json",
            cache: false,
            success: function (result) {
                arr_headerLinePagetables[index].result = result;

                fill_pagetableHeaderLine(result, pg_id, function () {
                    fill_filter_itemsHeaderLine(result.columns, pg_id, function () {
                        if (callBack != undefined)
                            callBack();
                    });
                }, callbackLineFillFunc, pageViewModel);
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });
    }
    else {
        arr_headerLinePagetables[index].result = result;
        fill_pagetableHeaderLine(result, pg_id, function () {

            fill_filter_itemsHeaderLine(result.columns, pg_id, function () {
                if (callBack != undefined)
                    callBack();
            });
            (result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);
        }, callbackLineFillFunc, pageViewModel);
    }
}

function fillOptionHeader(pg_id) {
    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_headerLinePagetables[index].currentrow = 1;
    arr_headerLinePagetables[index].pageno = 0;
    arr_headerLinePagetables[index].endData = false;


    handlerInsertHeaderLine(pg_id);
    //createPageCountersHeader(pg_id);
}

function handlerInsertHeaderLine(pg_id = null) {

    if (pg_id == null) pg_id = "pagetable";
    let elmenet = $(`#${pg_id} .table-responsive`);
    let elmenetjs = document.querySelector(`#${pg_id} .table-responsive`);
    elmenet.on('scroll', (e) => {
        scrolls.current = elmenet.scrollTop();
        if (scrolls.prev !== scrolls.current) {
            scrolls.prev = scrolls.current;
            if (elmenetjs.offsetHeight + elmenetjs.scrollTop + 10 >= elmenetjs.scrollHeight) {
                insertNewPageHeaderLine(pg_id);
            }
        }
    });
}

function insertNewPageHeaderLine(pg_id) {

    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_id),
        pagetable_pageNo = arr_headerLinePagetables[index].pageno,
        pagetable_currentpage = arr_headerLinePagetables[index].currentpage,
        pagetable_pagerowscount = formPlateHeaderLine_PageRowsCount,
        pagetable_endData = arr_headerLinePagetables[index].endData,
        pageno = 0;
    if (!pagetable_endData && +pagetable_pageNo == lastPageHeaderloaded) {
        pageno = +pagetable_pageNo + +pagetable_pagerowscount;
        arr_headerLinePagetables[index].currentpage = pagetable_currentpage + 1;
        arr_headerLinePagetables[index].pageno = pageno;
        getPagetable_HeaderLine(pg_id, null, false, afterInsertLineHeaderLine, true);
    }
}

function afterInsertLineHeaderLine() {
}

function sortingButtons(elm, pg_name) {

    dataOrder = { colId: "", sort: "", index: 0 };
    var data = $(elm).data();

    dataOrder = { colId: data.colid, sort: data.sort, index: data.index };
    $("i").removeClass("active-sortIcon");
    getPagetable_HeaderLine(pg_name);
}

function fill_pagetableHeaderLine(result, pageId, callback = undefined, callbackAfterFillLine = undefined, pageViewModel) {

    if ($(`#${activePageId} #${pageId}`).length == 0) {
        render_formPlateHeaderLineHtml(pageId, result);
        fill_pageTableHeaderLineFunc(result, pageId, callback, callbackAfterFillLine, pageViewModel);
    }
    else {
        fill_pageTableHeaderLineFunc(result, pageId, callback, callbackAfterFillLine, pageViewModel);
    }

}

function render_formPlateHeaderLineHtml(pageId, result) {

    var headerLineDiv = $(`#${activePageId} #header-lines-div`);
    headerLineDiv.html("");

    var pageTableMainDiv = `<fieldset class='group-box mt-3 ${result.columns.classes}' >
                                <legend>${result.columns.title}</legend>
                                <div class = 'card-body' id='${pageId}'>
                                </div>
                            </fieldset>
                            <div id="header-lines-footer"></div>`;

    headerLineDiv.append(pageTableMainDiv);
    var href = '/PB/Public/pageHeaderLine';
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (res) {
            $(`#${activePageId} #${pageId}`).html(res);
        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
}

function fill_pageTableHeaderLineFunc(result, pageId, callback = undefined, clAfterLine = undefined, pageViewModel) {

    if (!result) return "";
    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    var columns = result.columns.dataColumns;
    var buttons = result.columns.buttons;

    var buttoncount = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0;

    var list = result.data;
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    arr_headerLinePagetables[index].editable = result.columns.isEditable;
    arr_headerLinePagetables[index].columns = result.columns;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    var pagetable_hasRowIndex = arr_headerLinePagetables[index].hasRowIndex;
    var pagetable_selectable = arr_headerLinePagetables[index].selectable;
    var pagetable_highlightrowid = arr_headerLinePagetables[index].highlightrowid;
    var pagetable_endData = arr_headerLinePagetables[index].endData;
    var pagetable_pageno = arr_headerLinePagetables[index].pageno;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_pagerowscount = formPlateHeaderLine_PageRowsCount;
    var pagetable_isSum = arr_headerLinePagetables[index].isSum;

    pagetable_hasfilter(pageId, result.columns.hasFilter);

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    if (!pagetable_endData) {
        list = list == null ? [] : list;
        arr_headerLinePagetables[index].endData = list.length < pagetable_pagerowscount;
        if (pagetable_currentpage == 1) {
            var elm_pbody = $(`#${activePageId} #${pageId} .pagetablebody`);
            $(`#${activePageId} #${pageId} .pagetablebody`).addClass("scroll").addClass("table-headerline");
            var btn_tbidx = 3000;

            elm_pbody.html("");


            var str = "";

            str += '<thead>';
            str += '<tr>';


            if (pagetable_editable == true)
                str += '<th style="width:3%"></th>';
            if (pagetable_selectable == true)
                str += '<th style="width:1%;text-align:center !important"><input class="checkall" type="checkbox"/></th>';
            if (pagetable_hasRowIndex == true)
                str += '<th style="width:3%">ردیف</th>';

            for (var i in columns) {
                var col = columns[i];
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '"';
                    if (col.order)
                        str += `class="headerSorting" id="header_${i}" data-type="" data-colid="${col.id}" data-index="${i}" onclick="sortingButtonsByThHeaderLine(${col.order},this,'${pageId}')"><span id="sortIconGroup" class="sortIcon-group">
                <i id="desc_Col_${i}" data-colid="${col.id}" data-index="${i}" data-sort="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                <i id="asc_Col_${i}" data-colid="${col.id}" data-index="${i}" data-sort="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
            </span>` + col.title + '</th>';
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';
            if (result.columns.headerType == "inline") {
                str += `<tr class="ins-row" onblur="tr_include_input('${pageId}')" tabindex="-1">`;
                if (pagetable_editable == true)
                    str += '<th style="width:3%"></th>';
                if (pagetable_selectable == true)
                    str += '<th style="width:1%;text-align:center !important"></th>';
                if (pagetable_hasRowIndex == true)
                    str += '<th style="width:3%">ردیف</th>';

                str += "</tr></thead>";
                elm_pbody.append(str);

                str = "";
                var insRowElem = $(`#${activePageId} #${pageId} .pagetablebody tr`).last();
                for (var i in columns) {
                    var col = columns[i];

                    var onBlurFunc = `tr_object_onblur('${pageId}',this,0,0,event)`;
                    if (col.isDtParameter) {

                        if (columns[i].id != "action") {
                            colno += 1;

                            var validators = "";
                            if (columns[i].validations != null) {
                                var validations = columns[i].validations;
                                for (var v = 0; v < validations.length; v++) {
                                    if (validations[v].value1 == null && validations[v].value2 == null) {
                                        validators += " " + validations[v].validationName;
                                    }
                                    else if (validations[v].validationName.indexOf("range") >= 0) {
                                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                                    }
                                    else {
                                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                                    }
                                }
                            }

                            if (columns[i].inputType == "select") {
                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                                str += `<select 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                    tabindex="${btn_tbidx}" 
                                    ${validators} 
                                    ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                    ${columns[i].headerReadOnly == true ? 'disabled ' : ''}
                                    ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                    class="form-control select2" id="${columns[i].id}" 
                                    onchange="public_tr_object_onchange(this,'${pageId}',event)"
                                    onblur='${onBlurFunc}'
                                    onfocus="tr_object_onfocus(this,event)"`;

                                str += ">";

                                var lenInput = columns[i].inputs.length;

                                for (var h = 0; h < lenInput; h++) {
                                    var input = columns[i].inputs[h];
                                    if (value != +input.id) {
                                        str += `<option value="${input.id}">${input.id} - ${input.name}</option>`;
                                    }
                                    else {
                                        str += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                                    }
                                }
                                str += "</select></th>";
                                insRowElem.append(str);

                                if (columns[i].isSelect2 === true) {
                                    $(`#${activePageId} #${columns[i].id}`).select2();
                                }
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "complexSelect") {
                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                                str += `<div class="complex-select"><input class="form-control" type="text" disabled/><input class="form-control" type="text" disabled/><button onclick="showItems()" class="btn btn-light border-dark " tabindex="${btn_tbidx}">...</button></div></th>`;
                                insRowElem.append(str);
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "datepersian") {
                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                                str += `<input 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                    tabindex="${btn_tbidx}" ${validators} 
                                    ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                    ${columns[i].headerReadOnly == true ? 'disabled ' : ''}
                                    ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                    type="text" id="${columns[i].id}" class="form-control persian-date" data-inputmask="${columns[i].inputMask.mask}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" required maxlength="10" autocomplete="off"/></th>`;
                                insRowElem.append(str);
                                $(`#${columns[i].id}`).inputmask();
                            }
                            else if (columns[i].inputType == "checkbox") {

                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                str += `<div tabindex="${btn_tbidx}" class="funkyradio funkyradio-success" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" tabindex="-1">`;

                                str += `<input ${validators} 
                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                ${columns[i].headerReadOnly != true ? 'checked ' : ''} 
                                ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                switch-value="بلی,خیر" 
                                onchange="funkyradio_onchange(this)"
                                type="checkbox" id="${columns[i].id}" name="checkbox" />
                                </div></th>`;
                                insRowElem.append(str);
                                //setDefaultActiveCheckbox($(`#${columns[i].id}`));
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "number") {
                                if (columns[i].isRangeValue == true) {
                                    var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                                    str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input tabindex="${btn_tbidx}" ${validators}
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''}
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        type="text" id="${columns[i].id}"  class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="" onfocus="tr_object_onfocus(this,event)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                                    str += priceRangeControl + "</th>";
                                    insRowElem.append(str);
                                    btn_tbidx++;
                                }
                                else {
                                    str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input tabindex="${btn_tbidx}" ${validators} 
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''}  
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        type="text" id="${columns[i].id}"  class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                                    insRowElem.append(str);
                                    btn_tbidx++;

                                }
                            }
                            else if (columns[i].inputType == "money") {

                                if (columns[i].isRangeValue == true) {
                                    var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                                    str = '<th style="position:relative;' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input 
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''} 
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        onclick="showRangeControl(this)" onblur="priceRangeBlur(this)" onfocus="showFocusRangeControl(this)" onkeydown="showKeyDownRangeControl(event,this)" tabindex="${btn_tbidx}" ${validators} type="text" id="${columns[i].id}" class="form-control money" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                                    str += priceRangeControl + "</th>";
                                    insRowElem.append(str);
                                    btn_tbidx++;
                                }
                                else {
                                    str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input tabindex="${btn_tbidx}" ${validators} 
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''}  
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        type="text" id="${columns[i].id}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                                    insRowElem.append(str);
                                    btn_tbidx++;
                                }
                            }
                            else if (columns[i].inputType == "money-decimal") {

                                if (columns[i].isRangeValue == true) {
                                    var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                                    str = '<th style="position:relative;' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input 
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''} 
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        onclick="showRangeControl(this)" onblur="priceRangeBlur(this)" onfocus="showFocusRangeControl(this)" onkeydown="showKeyDownRangeControl(event,this)" tabindex="${btn_tbidx}" ${validators} type="text" id="${columns[i].id}" class="form-control money-decimal" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                                    str += priceRangeControl + "</th>";
                                    insRowElem.append(str);
                                    btn_tbidx++;
                                }
                                else {
                                    str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                    str += `<input tabindex="${btn_tbidx}" ${validators} 
                                        ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                        ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                        ${columns[i].headerReadOnly == true ? 'disabled ' : ''}  
                                        ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                        type="text" id="${columns[i].id}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                                    insRowElem.append(str);
                                    btn_tbidx++;
                                }
                            }
                            else if (columns[i].inputType == "decimal") {
                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                str += `<input tabindex="${btn_tbidx}" ${validators} 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ""}
                                    ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ""}  
                                    ${columns[i].headerReadOnly == true ? 'disabled ' : ""} 
                                    ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ""}
                                    ${columns[i].inputmask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}                                    
                                    type="text" id="${columns[i].id}" class="form-control decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" 
                                    onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)"
                                    oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                                insRowElem.append(str);
                                $(`#${columns[i].id}`).inputmask();
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "time") {

                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                str += `<input tabindex="${btn_tbidx}" ${validators} 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ""}
                                    ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ""}  
                                    ${columns[i].headerReadOnly == true ? 'disabled ' : ""} 
                                    ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ""}
                                    ${columns[i].inputmask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}
                                    
                                    type="text" id="${columns[i].id}" class="form-control " onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" placeholder="__:__" oninput="tr_object_oninput(event,this)" maxlength="5" autocomplete="off"/></th>`;
                                insRowElem.append(str);
                                $(`#${columns[i].id}`).inputmask();
                                btn_tbidx++;
                            }
                            else {
                                str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                                str += `<input tabindex="${btn_tbidx}" ${validators} 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                    ${columns[i].defaultReadOnly == true ? 'disabled data-disabled="true"' : ''}  
                                    ${columns[i].headerReadOnly == true ? 'disabled' : ''}  
                                    ${columns[i].notResetInHeader == true ? ' data-notReset="true"' : ''}
                                    type="text" id="${columns[i].id}" class="form-control" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="${onBlurFunc}" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                                insRowElem.append(str);
                                btn_tbidx++;
                            }
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<button id="headerLineInsUp" data-disabled="false" onclick="headerLineIns('${pageId}')" class="btn btn-light border-dark pa float-sm-right"><i class="fa fa-plus"></i></button>`;
                            btn_tbidx++;
                            str += `<button id="haederLineActive" data-disabled="false" onclick="headerLineActive('${pageId}')" data-toggle="tooltip" data-placement="top" class="btn mr-1 pa float-sm-right "><i class="fa fa-check"></i></button>`;
                            //btn_tbidx++;
                            //str += `<button tabindex="${btn_tbidx}" id="haederLineCancel" onclick="headerLineCancel('${pageId}')" class="btn btn-danger mr-1 pa float-sm-right  d-none"><i class="fa fa-times"></i></button></th>`;
                            insRowElem.append(str);
                        }

                    }
                    else if (col.isDisplayNone) {
                        insRowElem.attr(`data-hidden-${columns[i].id}`, 0)
                    }
                }
            }
            else {
                elm_pbody.append(str);
            }
            str = '<tbody>';
        }
        else {
            elm_pbody = $(`#${activePageId} #${pageId} .pagetablebody tbody`);
            str = '';
        }


        if (list == null || list.length == 0) {
            if (pagetable_currentpage == 1)
                str += fillEmptyRow(columns.length);
        }
        else


            for (var i in list) {

                var item = list[i];
                var rowno = +$(`#${activePageId} #${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length + (+i) + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j in columns) {
                    var primaryItems = "", displayItems = "", displaynoneItems = "";

                    $.each(columns, function (k, v) {
                        if (v["isPrimary"] === true)
                            primaryItems += ' data-model.' + v["id"] + '="' + item[v["id"]] + '"';
                        if (result.columns.clientSideDisplayItems == true) {
                            if (v["isDisplayItem"] === true)
                                displayItems += ' data-isdisplayitem-' + v["id"] + '="' + item[v["id"]] + '"';
                        }
                        if (v["isDisplayNone"] === true)
                            displaynoneItems += ' data-isdisplaynoneitem-' + v["id"] + '="' + item[v["id"]] + '"';
                    });


                    if (columns[j].hasSumValue && columns[j].calculateSum) {
                        columns[j].sumValue += isNaN(item[columns[j].id]) ? 0 : +item[columns[j].id];
                    }

                    colwidth = columns[j].width;
                    listForCondition = list[i];
                    if (j == 0) {

                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaryItems + " " + displayItems + " " + displaynoneItems + ' class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this)" tabindex="-2"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                                else {
                                    str += '<tr class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this)" tabindex="-2"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                            }
                            else {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaryItems + " " + displayItems + " " + displaynoneItems + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaryItems + " " + displayItems + " " + displaynoneItems + ' class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this)" tabindex="-2">';
                                }
                                else {
                                    str += '<tr class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this)" tabindex="-2">';
                                }
                            }
                            else {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaryItems + " " + displayItems + " " + displaynoneItems + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                            }
                        }

                        if (pagetable_editable) {
                            str += `<td id="col_${rowno}_1" style="width:3%"></td>`;
                            colno = 1;
                        }
                        if (pagetable_selectable) {
                            str += `<td id="col_${rowno}_0" style="text-align:center;width:2%"><input type="checkbox" `;
                            colno = 0;

                            if (pageId == "pagetable1") {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelDiAssign, function (k, v) {
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

                            }
                            if (pageId == "pagetable2") {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelAssign, function (k, v) {
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
                            }
                            str += '</td >';
                        }
                        if (pagetable_hasRowIndex) {
                            if (arr_headerLinePagetables[index].currentpage == 1) {
                                str += `<td id="col_${rowno}_2" style="width:3%">${parseInt(i) + 1}</td>`;
                                colno = 2;
                            }
                            else {
                                str += `<td id="col_${rowno}_2" style="width:3%">${(parseInt(i) + 1) + ((arr_headerLinePagetables[index].currentpage - 1) * formPlateHeaderLine_PageRowsCount)
                                    }</td >`;
                                colno = 2;
                            }
                        }

                    }


                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];
                            if (columns[j].editable) {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {

                                    str += `<select id="${columns[j].id}_${rowno}_${colno}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;

                                    if (columns[j].pleaseChoose)
                                        str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs.length;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.value) {
                                            str += `<option value="${input.id}">${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "select2") {
                                    var onchange = columns[j].select2Config != null ? `tr_select2_onchange(this,'${pageId}',${rowno},${colno})` : `tr_object_onchange('${pageId}',this,${rowno},${colno})`;
                                    var nameVlue = item[columns[j].id.replace("Id", "") + "Name"];
                                    str += `<div>${nameVlue}</div>`
                                    str += `<div class="displaynone"><select id="${columns[j].id}_${rowno}_${colno}"  data-value='${value}' class="form-control select2" id="${columns[j].id}_${rowno}" onchange="${onchange}" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;
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
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    if (columns[j].switchValue === "") {
                                        str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                                <input type="checkbox" name="checkbox" disabled id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                                <label for="btn_${rowno}_${colno}"></label>
                                            </div>`;
                                    }
                                    else {
                                        str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                                <input id="${columns[j].id}_${rowno}_${colno}" onchange="funkyradio_onchange(this)" switch-value="بلی,خیر" disabled type="checkbox" name="checkbox" id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                                 <label for="btn_${rowno}_${colno}"></label>
                                            </div>`;
                                    }
                                }
                                else if (columns[j].inputType == "number")
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money") {
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                } else if (columns[j].inputType == "money-decimal") {
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                }
                                else if (columns[j].inputType == "decimal")
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""}  onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" maxlength="5" autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "time") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control time" placeholder="__:__" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" maxlength="5" autocomplete="off" disabled>`;

                                }
                                else
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number")
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                }
                                else if (columns[j].inputType == "money-decimal") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                }
                                else if (columns[j].inputType == "decimal")
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {

                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
                                    if (value != null && value != "") {

                                        if (value && columns[j].isCommaSep)
                                            value = value > 0 ? transformNumbers.toComma(value) : `(${transformNumbers.toComma(Math.abs(value))})`;

                                        if (columns[j].type === 5) {
                                            value = value.toString()
                                        }

                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%;"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%;" + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '">' + value + '</td>';
                                }
                                else {


                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value + '</td>';
                                    else
                                        //str += `<td style="width:${colwidth}%"></td>`;
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;

                                }
                            }
                        }
                        else {

                            colno += 1;
                            let strBtn = "";
                            if (result.columns.actionType === "dropdown") {
                                str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%">`;
                                if (window.innerWidth >= 1680)
                                    strBtn += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                else
                                    strBtn += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;

                                for (var k = 0; k < buttoncount; k++) {
                                    var btn = buttons[k];
                                    var condition = createConditionString(btn.condition, item);
                                    if (btn.isSeparator == false) {
                                        if (btn.condition == null || eval(condition)) {
                                            btn_tbidx++;
                                            strBtn += `<button id="btn_${btn.name}${rowno}" onclick="run_header_line_row_${btn.name}('${pageId}',${rowno},event)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                        }
                                    }
                                    else
                                        if (btn.condition == null || eval(condition))
                                            strBtn += `<div class="button-seprator-hor"></div>`;
                                }

                                strBtn += `</div>
                                </div>`;

                                if ($(strBtn).find("button:not(.dropdown-toggle)").length == 0)
                                    strBtn = "";
                                str += strBtn;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%">`;

                                for (var k = 0; k < buttoncount; k++) {
                                    var btn = buttons[k];
                                    var condition = createConditionString(btn.condition, item);
                                    if (!btn.isSeparator) {

                                        if (btn.condition == null || eval(condition)) {
                                            btn_tbidx++;
                                            str += `<button type="button" id="btn_${btn.name}${rowno}" onclick="run_header_line_row_${btn.name}('${pageId}',${rowno},event)" class="${btn.className}" title="${btn.title}"><i class="${btn.iconName}"></i></button>`;
                                        }
                                    }
                                    else
                                        if (btn.condition == null || eval(condition))
                                            str += `<span class="button-seprator-ver"></span>`;
                                }

                                str += '</td>';
                            }
                        }
                    }

                }

                str += '</tr>';

            }
        if (pagetable_currentpage == 1) {
            if (pagetable_isSum !== undefined) {
                str += `</tbody><tfoot class="${!pagetable_isSum ? "d-none" : ""}" id="tfoot_${activePageId}">`;
                if (pagetable_isSum)
                    str += createTfootHeaderLine(pageId, pageViewModel, columns, list);
                str += "</tfoot>";
            }
            else {

                str += '</tbody><tfoot>';
                var amountDebit = 0, amountCredit = 0;
                if (list != null && list.length !== 0) {

                    var firstHasValue = false;
                    var afterFirstHasValue = false;
                    var Sumcolwidth = 0, recordcolwidth = 0, cli = 0;
                    for (var cl in columns) {
                        if (columns[cl].id == "amountDebit")
                            amountDebit = columns[cl].sumValue;

                        if (columns[cl].id == "amountCredit")
                            amountCredit = columns[cl].sumValue;

                        colwidth = columns[cl].width;
                        if (columns[cl].isDtParameter == true) {
                            cli += 1;
                            if (cli == 1) {
                                str += `<td id="totalrecord" class="text-right" style="width:${colwidth}%;">تعداد سطر: ${list.length}</td>`;
                                if (columns[cl].id == "action")
                                    recordcolwidth += colwidth;
                            }
                            else if (cli == 2) {
                                str += `<td id="totalSum" class="text-left" style="width:${colwidth}%;"> جمع</td>`;
                                if (columns[cl].id == "action")
                                    Sumcolwidth += colwidth;
                            }
                            else if (columns[cl].hasSumValue == true) {
                                var value = item[columns[cl].id];

                                var sumValue = "0";


                                if (columns[cl].sumValue >= 0) {
                                    if (columns[cl].type === 5)
                                        sumValue = parseFloat(columns[cl].sumValue).toFixed(defaultRounding)
                                    else
                                        sumValue = transformNumbers.toComma(columns[cl].sumValue.toFixed(defaultRounding))
                                }
                                else {
                                    if (columns[cl].type === 5)
                                        sumValue = parseFloat(columns[cl].sumValue).toFixed(defaultRounding)
                                    else
                                        sumValue = transformNumbers.toComma(columns[cl].sumValue.toFixed(defaultRounding))
                                }

                                str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;

                                firstHasValue = true;
                                afterFirstHasValue = true;
                            }
                            else if (!firstHasValue) {
                                str += `<td style="width:${colwidth}%;"></td>`;
                            }
                            else if (afterFirstHasValue = true) {
                                if (columns.filter(a => a.id == "amountDebit" || a.id == "amountCredit").length > 0 && +cl == columns.filter(a => a.isDtParameter).length - 1) {
                                    var finalAmount = parseFloat(amountDebit) - parseFloat(amountCredit);

                                    str += `<td id="finalAmount" style="width:${colwidth}%;">${finalAmount >= 0 ? transformNumbers.toComma(Math.abs(finalAmount)) : "(" + transformNumbers.toComma(Math.abs(finalAmount)) + ")"}</td>`;
                                }
                                else {
                                    str += `<td style="width:${colwidth}%;"></td>`;
                                }
                            }
                        }
                    }
                }
                str += "</tr>";
                str += "</tfoot>";
            }
        }
        else
            $("#total_qty_rows").text(+$("#total_qty_rows").text() + +list.length);

        elm_pbody.append(str);


        var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
        arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

        if (elm_pbody.find(`tbody > #row${pagetable_currentrow}`).length != 0)
            elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
        else
            elm_pbody.find(`tbody > #row1`).addClass("highlight");

        $("#formHeaderLine input").inputmask()

        pagetable_laststate = "";
        if (arr_headerLinePagetables[index].pageno == 0) {
            fillOptionHeader(arr_headerLinePagetables[index].pagetable_id);
            appendDetails(columns)
        }


        funkyradio_switchvalue();

        //setTimeout(function () {
        //    var checkInputs = elm_pbody.find("input[type='checkbox']");
        //    for (var i = 0; i < checkInputs.length; i++) {
        //        setDefaultActiveCheckbox($(checkInputs[i]));
        //    }
        //}, 100);
        //if (!isAfterSave) {
        //    var headerTypeClass = result.columns.headerType == "inline" ? "ins-row" : "ins-out";

        //    if (headerTypeClass == "ins-row")
        //        disabledInsElements(`.${headerTypeClass}`, true);
        //}
        //else {
        //    headerLineActive(pageId);
        //}

        $(".footer-card").addClass("d-none");
        $(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
        if (typeof $(`#header_${dataOrder.index}`).data() != "undefined") {
            $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;
        }

        if (result.headerColumns == null || (!result.headerColumns.hasStageStepConfig)) {
            $(`#${activePageId} #loader`).addClass("displaynone");
            $(`#${activePageId} #content-page`).fadeIn().removeClass("displaynone");
        }
        afterFillPageTableHeaderLine(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageno, function () {

            if (callback != undefined)
                callback();
            if (pagetable_currentpage == 1) {
                if (typeof clAfterLine !== "undefined") {
                    clAfterLine();
                }
                if (result.headerColumns == null || (result.headerColumns != null && !result.headerColumns.hasStageStepConfig)) {
                    show_headerLineDive();
                }
            }
            lastPageHeaderloaded = arr_headerLinePagetables[index].pageno;
        });

        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();

    }
}

function pagetable_hasfilter(pg_name, hasFilter) {
    if (!hasFilter)
        $(`#${pg_name} .filterBox`).addClass("d-none");
    else
        $(`#${pg_name} .filterBox`).removeClass("d-none");
}

function afterFillPageTableHeaderLine(result, index, pagetable_currentpage, elm_pbody, pageId, columns, pagetable_pageNo, callBack) {
    if ($(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length > 0)
        createPageFooterInfo_headerLine(1, $(`#${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length, pagetable_currentpage, pageId);
    else
        createPageFooterInfo_headerLine(0, 0, 0, pageId);

    ////searchPlugin config
    //searchPluginConfig(pageId, columns);
    ////select2 config
    ////select2Config(pageId);

    //let pagetable_currentrow = arr_pagetables[index].currentrow;
    //elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus().addClass("highlight");

    ////if ($("#parentPageTableBody").prop('scrollHeight') <= $("#parentPageTableBody").height() && pagetable_currentpage == 1)
    ////    insertNewPage(pageId);

    //let dataDatePicker = $(".persian-datepicker"), dataDatePickerL = $(".persian-datepicker").length;
    //for (var i = 0; i < dataDatePickerL; i++)
    //    kamaDatepicker(`${$(dataDatePicker[i]).attr('id')}`, { withTime: false, position: "bottom" });

    //$(`#${dataOrder.sort}_Col_${dataOrder.index}`).addClass("active-sortIcon");
    //if (typeof $(`#header_${dataOrder.index}`).data() != "undefined")
    //    $(`#header_${dataOrder.index}`).data().sort = dataOrder.sort;

    ////if (pagetable_currentpage == 1)
    ////    ColumnResizeablePageTable(`${pageId} .pagetablebody`);

    //lastPageloaded = pagetable_pageNo;
    if (typeof callBack != "undefined")
        callBack(result);

}

function createPageFooterInfo_headerLine(first, last, pageNo, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";

    $(`#${pg_id} #totalrecord`).text(`تعداد سطر : ${last}`);
    $(`#${pg_id} #currentPage`).text(pageNo);
}

function createTfootHeaderLine(pageId, pageViewModel, columns, list) {
    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    let urlSum = arr_headerLinePagetables[index].getsum_url;
    let dataSum = getTfootHeaderLine(urlSum, pageViewModel);
    let str = "";

    if (checkResponse(dataSum)) {
        str += "<tr>"
        let amountDebit = 0, amountCredit = 0;
        if (list != null && list.length !== 0) {

            let firstHasValue = false;
            let afterFirstHasValue = false;
            let cli = 0;
            for (var cl in columns) {
                if (columns[cl].id == "amountDebit")
                    amountDebit = dataSum[columns[cl].id];

                if (columns[cl].id == "amountCredit")
                    amountCredit = dataSum[columns[cl].id];

                colwidth = columns[cl].width;
                if (columns[cl].isDtParameter == true) {
                    cli += 1;
                    if (cli == 1)
                        str += `<td id="totalrecord" class="text-right" style="width:${colwidth}%;">تعداد سطر: <span id="total_qty_rows">${list.length}</span></td>`;

                    else if (cli == 2)
                        str += `<td id="totalSum" class="text-left" style="width:${colwidth}%;"> جمع</td>`;

                    else if (columns[cl].hasSumValue == true) {

                        var sumValue = "0";
                        sumValue = (dataSum[columns[cl].id] != null && dataSum[columns[cl].id] >= 0) ?
                            transformNumbers.toComma(dataSum[columns[cl].id]) : `(${transformNumbers.toComma(Math.abs(dataSum[columns[cl].id]))})`;

                        str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;
                        firstHasValue = true;
                        afterFirstHasValue = true;
                    }

                    else if (!firstHasValue)
                        str += `<td style="width:${colwidth}%;"></td>`;

                    else if (afterFirstHasValue == true) {

                       

                        if (columns.filter(a => a.id == "amountDebit" || a.id == "amountCredit").length > 0 ) {

                            var finalAmount = parseFloat(amountDebit) - parseFloat(amountCredit);
                           

                            str += `<td id="finalAmount" class="total-amount ${+finalAmount != 0 ? "highlight-danger" : ""}" style="width:${colwidth}%;"> ${finalAmount >= 0 ? transformNumbers.toComma(Math.abs(finalAmount)) : "(" + transformNumbers.toComma(Math.abs(finalAmount)) + ")"}</td>`;
                        }
                        else {
                            str += `<td style="width:${colwidth}%;"></td>`;
                        }
                    }
                }
            }
        }
        str += "</tr>";
    }
    return str;

}

function getTfootHeaderLine(url, model) {
    let result = $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: result => result,
        error: function (xhr) {
            error_handler(xhr, url);
            return null;
        }
    });
    return result.responseJSON;
}

function createConditionString(condition, item) {
    if (condition !== null) {

        let string = "", length = condition.length;

        for (var i = 0; i < length; i++)
            if (i + 1 == length)
                string += `(${item[condition[i].fieldName]} ${condition[i].operator} ${condition[i].fieldValue})`;
            else
                string += `(${item[condition[i].fieldName]} ${condition[i].operator} ${condition[i].fieldValue}) && `;

        return string;
    }
    return ""
}

function tr_include_input(pageId) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";

    if (typeof (configTreasuryElementPrivilage) != "undefined")
        configTreasuryElementPrivilage(`#${activePageId} #${pageId} .${headerId}`, false);

}

function appendDetails(columns) {
    $("#header-lines-footer").html("");
    var arr_Temp = [];
    var output = `<div class="detail-headerLine row col-md-12">`;
    for (var i in columns) {
        var col = columns[i], idcol = col.id;
        if (col.isDisplayItem == true)
            arr_Temp.push({ id: idcol, titles: col.title });
    }

    for (var j in arr_Temp) {
        var vals = arr_Temp[j];
        output += `<div class="item-detail-box"><div class="item-detail-group">
            <label class="item-detail">${vals.titles}</label>
            <label id="${vals.id}" class="item-detail-val"></label>
            </div></div>`;

    }

    output += `</div >`;
    $(output).appendTo("#header-lines-footer");
}

function headerLineRowAfterClick(pageId, id) {
    var newModel = {}, indexcol;
    var hiddenData = $(`#${activePageId} #${pageId} #row${id}`).data();
    $.each(hiddenData, function (k, v) {
        if (k.indexOf("isdisplayitem") >= 0) {
            id = k.toLowerCase();
            newModel[id.replace('isdisplayitem', '')] = v;
        }
    })
    $.each(newModel, function (index, value) {
        indexcol = index;
        $(`#${indexcol}`).text(value);
    });
}

function fill_filter_itemsHeaderLine(columns, pg_name = null, callBack = undefined) {
    pg_name = pg_name == null ? "pagetable" : pg_name;

    if (!columns.hasFilter)
        return;

    var list = columns.dataColumns;
    var str = '<div>';
    var filterLength = list.length;
    for (var i = 0; i < filterLength; i++) {
        var item = list[i];
        if (item.isFilterParameter)
            str += `<button id="filter_${item.id}" class="dropdown-item" data-input="${item.filterType}" data-api="${item.filterTypeApi}" onclick="
                        javascript:pagetable_change_filteritemHeaderLine('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}',this)">
                        ${item.title}</button>`;
    }

    str += "</div>";

    $(`#${activePageId} #${pg_name} .filteritems`).html(str);

    if (callBack != undefined)
        callBack();
}

function pagetable_changefilteritemHeaderLine(itemid, title, type, size, pg_name) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    arr_headerLinePagetables[index].currentpage = 1;

    var elm = $(`#${activePageId} #${pg_name} .btnfilter`)
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);

    //pagetable_filteritem = itemid;
    arr_headerLinePagetables[index].filteritem = itemid;

    var elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");
    //pagetable_filtervalue = "";
    arr_headerLinePagetables[index].filtervalue = "";

    if (itemid.toLowerCase().indexOf("date") >= 0)
        elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
    else
        elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    if (itemid === "filter-non") {
        getPagetable_HeaderLine(pg_name);
    }
    else {
        $(`#${activePageId} #${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${activePageId} #${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function filter_value_onkeypressHeaderLine(e, fltvalue) {
    if (e.which == 13) {
        e.preventDefault();

        var pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id");

        var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_headerLinePagetables[index].currentrow = 1;
        arr_headerLinePagetables[index].filtervalue = $(fltvalue).val();
        arr_headerLinePagetables[index].data = null;
        getPagetable_HeaderLine(pagetableId);
    }
}

function filtervalue_onsearchclick(elm_search) {
    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_headerLinePagetables[index].filtervalue = $(elm_search).prev("input").val();
    getPagetable_HeaderLine(pagetableId);
}

function get_FirstColIndexHasInput(pg_name) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_editable = arr_headerLinePagetables[index].editable;

    if (pagetable_editable) {
        var p_Elmbody = $(`#${pg_name} .pagetablebody`);
        var td_id_has_elm = p_Elmbody.find(`tbody >  #row${pagetable_currentrow} > td > input:not([type='checkbox']),tbody >  #row${pagetable_currentrow} > td > select:first:not([readonly]),tbody >  #row${pagetable_currentrow} > td > .funkyradio >input`).closest("td").attr("id");
        if (checkResponse(td_id_has_elm)) {
            var index_uline_Second = td_id_has_elm.indexOf("_", td_id_has_elm.indexOf("_") + 1);
            var column_index = td_id_has_elm.replace(td_id_has_elm.substring(0, index_uline_Second + 1), "");
            return +column_index;
        }

    }
}

function pagetableNextpage(pagetable_id) {
    //pagetable_laststate = "nextpage";
    //getPagetable_HeaderLine(pagetable_id);
}

function pagetablePrevpage(pagetable_id) {
    //pagetable_laststate = "prevpage";
    //getPagetable_HeaderLine(pagetable_id);
}

function public_object_Onclick(pg_name, elm, evt) {



    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    if (tr_clicked_rowno == pagetable_currentrow) {
        return;
    }

    if (trediting) {
        if (elm.hasClass("funkyradio"))
            elm.prop("checked", !elm.prop("checked"));

        return;
    }

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

    tr_HighlightHeaderLine(pg_name);
}

function public_object_onchange(elem) {

    local_objectChange(elem);
}

async function public_tr_object_onchange(elem, pageId, e) {

    if (!changeFromFillPageTable) {

        var elemId = $(elem).attr("id");
        var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
        var headerColumn = arr_headerLinePagetables[index].headerColumns;
        var column = headerColumn.dataColumns.filter(a => a.id == elemId)[0];
        if (!$(elem).data("getStageStepConfigBlocked")) {
            await getStageStepConfig(elem, headerColumn, null, pageId, async function () {
                if (typeof local_tr_object_onchange != 'undefined')
                    await local_tr_object_onchange(elem, pageId);

                if ((headerColumn.stageStepConfig == undefined || (headerColumn.stageStepConfig.lineFields.filter(a => a.fieldId == $(elem).attr("id")).length == 0)) && arr_headerLinePagetables[index].stageStepColumns != undefined) {
                    column = arr_headerLinePagetables[index].stageStepColumns.filter(a => a.id == elemId)[0];
                    if (column != undefined) {
                        fill_inputSelectItemsByParent(column, pageId);
                    }
                }

            })
        }
        else {
            $(elem).data("getStageStepConfigBlocked", false);

        }
    }
}

//#region stageStepConfig
async function getStageStepConfig(elem, headerColumn, stageStepConfigModelData, pageId, callback = undefined) {

    if (elem == null || (isStageStepLineField(headerColumn, elem) && +$(elem).val() > 0)) {
        updateStageStepConfigModel(headerColumn, stageStepConfigModelData);

        $.ajax({
            url: `${stageStepConfig_url}/${+$(elem).val() == 0}`,
            data: JSON.stringify(headerColumn),
            method: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json",
            success: function (res) {

                if (res != null && res.data != null && res.data.length > 0) {
                    var newHeaderColumns = res.data;
                    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
                    arr_headerLinePagetables[index].stageStepColumns = newHeaderColumns;

                    update_lineHeaderColumnsByStageStepConfig(newHeaderColumns, pageId, function () {

                        fill_inputSelectItems(newHeaderColumns, function () {
                            if (isFormLoaded) {
                                isFormLoaded = false;
                            }
                            if (isAfterSave) {
                                if (typeof (configTreasuryElementPrivilage) != "undefined")
                                    configTreasuryElementPrivilage(".ins-out", true);
                            }
                            if (typeof callback != "undefined")
                                callback();

                            show_headerLineDive();
                        });
                    });

                }
                else {
                    var msg = alertify.error("تنظیمات برگه برای این مرحله انجام نشده ، به مدیر سیستم اطلاع دهید");
                    msg.delay(alertify_delay);
                }
            }
        })
    }
    else if (typeof callback != "undefined")
        callback();
}

function show_headerLineDive() {

    $(`#${activePageId} #header-lines-div`).fadeIn().removeClass("displaynone");
    if (!$(`#${activePageId} #loader`).hasClass("displaynone")) {
        $(`#${activePageId} #loader`).addClass("displaynone");
        $(`#${activePageId} #content-page`).fadeIn().removeClass("displaynone");
        $(`#${activePageId} #header-div-content`).css("opacity", 1);
        $(`#${activePageId} #header-lines-div`).css("opacity", 1);

    }
}

function isStageStepLineField(headerColumn, elem) {
    return (headerColumn.stageStepConfig != undefined && headerColumn.stageStepConfig.lineFields.filter(a => a.fieldId == $(elem).attr("id")).length > 0);
}

function getStageStepFieldTables(headerColumns, callBack = undefined) {
    $.ajax({
        url: getStageStepFieldTable_url,
        data: JSON.stringify(headerColumns.formKey),
        method: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        success: function (res) {
            if (res != null && res.data != null) {

                stageStepConfig = res.data;
                headerColumns.stageStepConfig = res.data;
                var lineFields = headerColumns.stageStepConfig.lineFields;
                if (lineFields != null && lineFields.length > 0) {
                    for (var i in lineFields) {
                        var dataColumn = headerColumns.dataColumns.filter(a => a.id == lineFields[i].fieldId)[0];
                        if (dataColumn != undefined) {
                            dataColumn.notResetInHeader = true;
                        }
                    }
                }
                if (typeof callBack != "undefined")
                    callBack();
            }
        }
    })

}

function update_lineHeaderColumnsByStageStepConfig(newHeaderColumns, pageId, callBack) {

    if (newHeaderColumns.length > 0) {
        var colno = 0;
        var btn_tbidx = 2001;
        var firstElemFocus = false;
        for (var i in newHeaderColumns) {
            var newHeaderColumn = newHeaderColumns[i];
            var newElemId = newHeaderColumn.id;
            var oldColumnContainer = $(`#${newElemId}`).parents(".form-group").first();

            var validators = "";
            if (newHeaderColumn.validations != null) {
                var validations = newHeaderColumn.validations;
                for (var v = 0; v < validations.length; v++) {

                    if (validations[v].value1 == null && validations[v].value2 == null) {
                        validators += " " + validations[v].validationName;
                    }
                    else if (validations[v].validationName.indexOf("range") >= 0) {
                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                    }
                    else if (validations[v].value1 != undefined) {
                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                    }
                    else {
                        validators += ` ${validations[v].validationName} `;
                    }
                }
            }
            var colwidth = newHeaderColumn.width;
            colno += 1;
            var value = "";
            var itemheader = "";
            if (!newHeaderColumn.isDisplayNone) {
                if (oldColumnContainer.length > 0)
                    itemheader = `<label>${newHeaderColumn.title}</label>`;
                else
                    itemheader = `<div class="form-group col-sm-${newHeaderColumn.width}"><label>${newHeaderColumn.title}</label><div>`

                if (newHeaderColumn.inputType == "select") {
                    itemheader += `<select ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} class="form-control select2" id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} ${newHeaderColumn.headerReadOnly == true ? ' disabled data-notReset="true"' : ''}
                                            tabindex="${btn_tbidx}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="object_onblur(this,event)" onfocus="tr_object_onfocus(this,event)">`;

                    if (newHeaderColumn.pleaseChoose)
                        itemheader += `<option value="0">انتخاب کنید</option>`;

                    var lenInput = newHeaderColumn.inputs == null ? 0 : newHeaderColumn.inputs.length;

                    for (var h = 0; h < lenInput; h++) {
                        var input = newHeaderColumn.inputs[h];
                        itemheader += `<option value="${input.id}" selected>${input.id} - ${input.name}</option>`;
                    }
                    itemheader += "</select></div>";

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader);
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }


                    if (newHeaderColumn.isSelect2 === true) {
                        if (newHeaderColumn.editable && !firstElemFocus) {

                            $(`#${newHeaderColumn.id}`).val(0);
                            firstElemFocus = true;
                        }
                        else {
                            $(`#${newHeaderColumn.id}`).val(0);
                        }

                        $(`#${newHeaderColumn.id}`).select2();
                    }
                    else
                        $(`#${newHeaderColumn.id}`).val(0);
                    btn_tbidx++;

                }
                else if (newHeaderColumn.inputType == "datepersian") {
                    itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" tabindex="${btn_tbidx}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} class="form-control persian-date" data-inputmask="${newHeaderColumn.inputMask.mask}" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},0,event)"  onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" maxlength="10" autocomplete="off"/></div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }
                    else
                        itemheader += "</div>";

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    $(`#${newHeaderColumn.id}`).inputmask();
                    if (newHeaderColumn.editable /*&& !firstElemFocus*/) {

                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "datepicker") {
                    itemheader += `<div><input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" tabindex="${btn_tbidx}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} class="form-control persian-datepicker" data-inputmask="${newHeaderColumn.inputMask.mask}" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},0,event)"  onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" maxlength="10" autocomplete="off"/></div>`;

                    if (validators != "") {
                        itemheader += `</div><div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }


                    $(`#${newHeaderColumn.id}`).inputmask();
                    if (newHeaderColumn.editable /*&& !firstElemFocus*/) {

                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "checkbox") {
                    itemheader += `<div tabindex="${btn_tbidx}" class="funkyradio funkyradio-success" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''}  onchange="public_tr_object_onchange(this,'${pageId}',event)"  onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" tabindex="-1">`;



                    itemheader += `<input onchange="funkyradio_onchange(this)" switch-value="بلی,خیر" ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="checkbox" id="${newHeaderColumn.id}" name="checkbox" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} />
                                </div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }
                    //setDefaultActiveCheckbox($(`#${newHeaderColumn.id}`));

                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "number") {
                    if (newHeaderColumn.isRangeValue == true) {
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${newHeaderColumn.minValue} - ${newHeaderColumn.maxValue} </div></div>`;

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${columns[j].notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId})'" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                        itemheader += priceRangeControl;
                    }
                    else {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,0,0,event)"  onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                    }

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "strnumber") {

                    showFocusRangeControl
                    if (newHeaderColumn.isRangeValue == true) {
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${newHeaderColumn.minValue} - ${newHeaderColumn.maxValue} </div></div>`;

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control str-number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                        itemheader += priceRangeControl;
                    }
                    else {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control str-number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,0,0,event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                    }

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "money") {

                    showFocusRangeControl
                    if (newHeaderColumn.isRangeValue == true) {
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${newHeaderColumn.minValue} - ${newHeaderColumn.maxValue} </div></div>`;

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                        itemheader += priceRangeControl;
                    }
                    else {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,0,0,event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                    }

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                } else if (newHeaderColumn.inputType == "money-decimal") {

                    showFocusRangeControl
                    if (newHeaderColumn.isRangeValue == true) {
                        var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${newHeaderColumn.minValue} - ${newHeaderColumn.maxValue} </div></div>`;

                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="priceRangeBlur(this,'${pageId}')" onfocus="showFocusRangeControl(this,'${pageId}')" onkeydown="showKeyDownRangeControl(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                        itemheader += priceRangeControl;
                    }
                    else {
                        itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,0,0,event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;
                    }

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "decimal") {

                    itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                    type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} 
                    ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}"                     
                    class="form-control decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" 
                    onblur="tr_object_onblur('${pageId}',this,0,0,event)" onfocus="tr_object_onfocus(this,event)" 
                    onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)"
                    ${newHeaderColumn.inputMask != null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""} 
                    ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }

                    $(`#${newHeaderColumn.id}`).inputmask()



                    if (newHeaderColumn.editable && !firstElemFocus) {
                        $(`#${newHeaderColumn.id}`).focus();
                        firstElemFocus = true;
                    }
                    btn_tbidx++;
                }
                else {

                    itemheader += `<input ${validators} ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} type="text" id="${newHeaderColumn.id}" ${newHeaderColumn.headerReadOnly == true ? 'disabled data-disabled="true"' : ''} ${newHeaderColumn.notResetInHeader == true ? ' data-notReset="true"' : ''} tabindex="${btn_tbidx}" class="form-control" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,0,0,event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} autocomplete="off"/></div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (oldColumnContainer.length > 0) {
                        oldColumnContainer.html("");
                        oldColumnContainer.append(itemheader)
                        oldColumnContainer.removeClass("displaynone");
                    }
                    else {
                        $(`#${pageId} .ins-out .row`).append(itemheader);
                    }


                    btn_tbidx++;
                }
            }
        }


        var itemContainers = $(`#${pageId} .ins-out .row .form-group`);
        for (var i = 0; i < itemContainers.length; i++) {
            //delete column
            var elemId = $($(itemContainers[i]).find("select,input")[0]).attr("id");
            var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
            if (newHeaderColumns.filter(a => a.id == elemId).length == 0 && !isStageStepLineField(arr_headerLinePagetables[index].headerColumns, $(`#${elemId}`))) {
                $(`#${elemId}`).parents(".form-group").first().addClass("displaynone");
                $(`#${elemId}`).parents(".form-group").first().find(".select2-container").remove();
                $(`#${elemId}`).parents(".form-group").first().append(`<input id = "${elemId}_1"/>`);
                $(`#${elemId}`).remove();
                $(`#${elemId}_1`).attr("id", elemId);

            }
        }

        $.each($(`#${activePageId} #header-lines-div fieldset .persian-datepicker`), function (key, val) {
            kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
        });

        $("#headerLineInsUp").attr("tabindex", btn_tbidx);

    }
    else {
        var msg = alertify.error("تنظیمات برگه برای این مرحله انجام نشده ، به مدیر سیستم اطلاع دهید");
        msg.delay(alertify_delay);
    }

    funkyradio_switchvalue();

    if (callBack != undefined)
        callBack();
}

function funkyradio_onchange(elm) {

    var switchValue = $(elm).attr("switch-value").split(',');
    if ($(elm).prop("checked")) {
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        /*  $(lbl_funkyradio1).text(switchValue[0]);*/
    }
    else {
        var lbl_funkyradio0 = $(elm).siblings("label");
        $(lbl_funkyradio0).attr("for", $(elm).attr("id"));
        /* $(lbl_funkyradio0).text(switchValue[1]);*/
    }
}

function funkyradio_switchvalue() {

    if ($("div > .funkyradio input").length > 0) {
        $("div > .funkyradio ").each(function (index) {

            $("div > .funkyradio ")[index].onfocus = function () {
                var lbl_funkyradio = $(this).find("label");
                lbl_funkyradio.addClass("border-thin");
            };

            $("div > .funkyradio ")[index].onblur = function () {
                var lbl_funkyradio = $(this).find("label");
                lbl_funkyradio.removeClass("border-thin");
            };

            var funkyradio_elm = $("div > .funkyradio ")[index];
            var funkyradio_chk = $(funkyradio_elm).find("input:checkbox");
            var switchValue = funkyradio_chk.attr("switch-value").split(',');

            $(funkyradio_elm).find("label").remove();
            // $(funkyradio_elm).append(`<label for="${funkyradio_chk.attr("id")}">${switchValue[1]}</label>`);
            $(funkyradio_elm).append(`<label for="${funkyradio_chk.attr("id")}"></label>`);
        });
    }
}

function fill_inputSelectItems(newHeaderColumns, callback = undefined) {

    for (var i in newHeaderColumns) {
        var column = newHeaderColumns[i];

        var getInputSelectConfig = column.getInputSelectConfig;
        if (getInputSelectConfig != null && column.isSelect2) {
            var elemId = column.id;
            var params = "";
            var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;
            if (parameterItems.length > 0) {
                for (var i = 0; i < parameterItems.length; i++) {
                    var paramItem = parameterItems[i].id;
                    params += +$(`#${paramItem}`).val();

                    if (i < parameterItems.length - 1)
                        params += "/";
                }
            }

            if (column.pleaseChoose)
                $(`#${elemId}`).html(`<option value="0">انتخاب کنید</option>`);
            else
                $(`#${elemId}`).empty();

            if (getInputSelectConfig.fillUrl != "" && ((params.split("/").filter(a => a == "0" || a == "null").length == 0) || params == "")) {

                fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, '');
            }
        }
    }

    //if (isFormLoaded) {
    //    isFormLoaded = false;
    //    if (lineSelectedId == 0) {
    //        
    //        disabledInsElements(".ins-out", true);
    //    }
    //}

    if (typeof callback != "undefined")
        callback();
}

function fill_inputSelectItemsByParent(column, pageId, callback = undefined) {

    if (column.fillColumnInputSelectIds != null) {
        var fillColumnInputSelectIds = column.fillColumnInputSelectIds;
        for (var i = 0; i < fillColumnInputSelectIds.length; i++) {
            var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
            var stageStepColumns = arr_headerLinePagetables[index].stageStepColumns;
            var headerColumns = arr_headerLinePagetables[index].headerColumns.dataColumns;
            if (stageStepColumns != undefined) {
                var changeItemCol = stageStepColumns.filter(a => a.id == fillColumnInputSelectIds[i])[0] == undefined ?
                    headerColumns.filter(a => a.id == fillColumnInputSelectIds[i])[0] :
                    stageStepColumns.filter(a => a.id == fillColumnInputSelectIds[i])[0];
                //4
                var getInputSelectConfig = checkResponse(changeItemCol) ? changeItemCol.getInputSelectConfig : null;
                if (getInputSelectConfig != null) {
                    if (changeItemCol.isSelect2) {
                        var elemId = changeItemCol.id;
                        var params = "";
                        var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;
                        if (parameterItems.length > 0) {
                            for (var i = 0; i < parameterItems.length; i++) {
                                var paramItem = parameterItems[i].id;
                                if (parameterItems[i].inlineType)
                                    params += $(`#${paramItem}_${rowno}`).val();
                                else
                                    params += $(`#${paramItem}`).val();

                                if (i < parameterItems.length - 1)
                                    paramItem += "/";
                            }
                        }

                        $(`#${elemId}`).empty();

                        if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {

                            fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, '', function () {
                                var val = +$(`#${elemId}`).data("value");
                                if (val > 0)
                                    $(`#${elemId}`).val(val).trigger("change");
                                else
                                    $(`#${elemId}`).trigger("change");

                                if (typeof callback != "undefined")
                                    callback();
                            });
                        }
                    }
                }
            }
        }
    }
    else if (typeof callback != "undefined")
        callback();
}

function updateStageStepConfigModel(columns, rowData = null) {

    var stageStepConfig = columns.stageStepConfig;
    if (stageStepConfig != null) {

        if (stageStepConfig.headerFields != null && stageStepConfig.headerFields.length > 0) {
            for (var i = 0; i < stageStepConfig.headerFields.length; i++) {
                stageStepConfig.headerFields[i].fieldValue = $(`#${stageStepConfig.headerFields[i].fieldId}`).val();
            }
        }

        if (stageStepConfig.lineFields != null && stageStepConfig.lineFields.length > 0) {
            for (var i = 0; i < stageStepConfig.lineFields.length; i++) {
                if (rowData == null)
                    stageStepConfig.lineFields[i].fieldValue = $(`#${stageStepConfig.lineFields[i].fieldId}`).val();
                else
                    stageStepConfig.lineFields[i].fieldValue = rowData[`${stageStepConfig.lineFields[i].fieldId}`];
            }
        }
    }
}

//#endregion

function trOnkeydown(ev, pg_name, elm) {

    if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter, KeyCode.Esc, KeyCode.Space].indexOf(ev.which) == -1) return;

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_lastpage = arr_headerLinePagetables[index].lastpage;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    var pagetable_tr_editing = arr_headerLinePagetables[index].trediting;
    var pagetable_currentcol = arr_headerLinePagetables[index].currentcol;

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
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
                after_change_trHeaderLine(pg_name, KeyCode.ArrowUp);
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
    else if (ev.which === KeyCode.Esc) {

        if (pagetable_editable) {

            ev.preventDefault();
            ev.stopPropagation();

            if (pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow);
                after_change_tr(pg_name, KeyCode.Esc);
                //run_header_line_row_edit(pg_name, pagetable_currentrow);

                if (typeof getrecord == "function") {
                    getrecord(pg_name);

                    //pagetable_currentcol = arr_headerLinePagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
                }

            }
            else {
                var modal_name = $(`#${pagetable_id}`).closest("div.modal").attr("id");
                modal_close(modal_name);
            }
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
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

                after_change_trHeaderLine(pg_name, KeyCode.ArrowDown);
            }
        }
        else {

            if (pagetable_editable && pagetable_tr_editing) {
                // function exist
                if (typeof tr_save_row === "function")
                    tr_save_row(pagetable_id, KeyCode.ArrowDown);

            }
            else if (pagetable_currentpage != pagetable_lastpage) {
                //arr_headerLinePagetables[index].currentrow = 1;
                //pagetable_nextpage(pagetable_id);
            }
        }
    }
    else if (ev.which === KeyCode.Enter) {

        if (pagetable_editable) {
            if (!pagetable_tr_editing) {
                configSelect2_trEditing(pagetable_id, pagetable_currentrow, true);

                //pagetable_currentcol = arr_headerLinePagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
            }

            var currentElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input,select,div.funkyradio,.search-modal-container > input").first()
            // ستون فعلی - input یا select وجود داشت
            if (currentElm.length != 0) {

                if (currentElm.attr("disabled") == "disabled") {
                    set_row_editing(pg_name);

                    if (currentElm.hasClass("funkyradio")) {
                        currentElm.focus();

                        var td_lbl_funkyradio = currentElm.find("label");
                        td_lbl_funkyradio.addClass("border-thin");
                    }
                    else if (currentElm.hasClass("select2")) {
                        var colno = currentElm.parent().parent().attr("id").split("_")[2];
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2();
                        $(`#${pg_name} #${currentElm.attr('id')}`).select2("focus");
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
                                if (+currentcol > +pagetable_currentcol) {
                                    var nxtElm = $(v).find('input,select,div.funkyradio,button[data-isfocusinline="true"]').first();
                                    if (nxtElm.length > 0 && $(nxtElm).attr("readonly") != "readonly") {
                                        nextElm = nxtElm;
                                    }
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
                        if (nextElm.hasClass("select2")) {
                            var colno = nextElm.parent().parent().attr("id").split("_")[2];
                            tr_onfocus(pg_name, colno);
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2();
                            $(`#${pg_name} #${nextElm.attr('id')}`).select2("focus");
                        }
                        else if (nextElm.hasClass("funkyradio")) {
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
                                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

                                after_change_trHeaderLine(pg_name, KeyCode.ArrowDown);
                            }
                        }
                        else {
                            if (pagetable_editable && pagetable_tr_editing) {
                                // function exist
                                if (typeof tr_save_row === "function")
                                    tr_save_row(pagetable_id, KeyCode.ArrowDown);
                            }
                            else {
                                pagetable_nextpage(pagetable_id);
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).addClass("highlight");
                                $(`#${pagetable_id} .pagetablebody > tbody > #row1`).focus();
                            }
                        }
                    }
                }
            }
            else {
                var nextElm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol + 1}`).find("input:first,select:first,div.funkyradio:first,.search-modal-container > input");
                if (nextElm.length != 0)
                    nextElm[0].focus();
                else {
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,.search-modal-container > input").attr("disabled", true);
                }
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

            if (elm.hasClass("funkyradio")) {

                ev.preventDefault();
                var checkbox_funky = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("input[type='checkbox']").first();/*.funkyradio #btn_${pagetable_currentrow}_${pagetable_currentcol}`);*/
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

    //else if (ev.which === KeyCode.Space) {
    //    ev.preventDefault();
    //    if (pagetable_editable && pagetable_tr_editing) {
    //        var elm = $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td#col_${pagetable_currentrow}_${pagetable_currentcol}`).find("div.funkyradio").first()

    //        if (elm.hasClass("funkyradio")) {
    //            var checkbox_funky = $(`#btn_${pagetable_currentrow}_${pagetable_currentcol}`)
    //            checkbox_funky.prop("checked", !checkbox_funky.prop("checked"))
    //        }
    //    }
    //}

}

function after_change_tr(pg_name, keycode) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var currentrow = arr_headerLinePagetables[index].currentrow;
    var tr_editing = arr_headerLinePagetables[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_HighlightHeaderLine(pg_name);
    if (keycode === KeyCode.Esc) {

        if (tr_editing) {
            initialRow(pagetable_id, false);
            $(`#${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

function set_row_editing(pg_name) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();

    //arr_headerLinePagetables[index].currentcol = getFirstColIndexHasInput(pg_name);
    var pagetable_currentcol = arr_headerLinePagetables[index].currentcol;

    if (pagetable_editable) {

        arr_headerLinePagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).html("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select:not([data-disabled]),div.funkyradio").attr("disabled", false);
    }
}

function itemChange(elem) {
    
    if (elem.length < 1) return;
    var rowCount = $(elem).parents(".card-body tbody").find("tr").length;
    var pagetable_id = $(elem).parents(".card-body").attr("id");
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);
    var selectedItems = typeof arr_pagetables[index].selectedItems == "undefined" ? [] : arr_pagetables[index].selectedItems;
    var isSelected = $(elem).prop("checked");
    var primaryData = $(elem).parents("tr").data();

    if (isSelected === true) {
        var checks = $(`#${pagetable_id} input[type='checkbox']`),
            checksL = checks.length,
            count = 0;
        for (var i = 0; i < checksL; i++) {
            var v = checks[i];
            if ($(v).prop("checked") == true)
                count += 1;
        }

        if (count >= rowCount) {
            var pagetable = $(`#${pagetable_id}`);
            $(pagetable).find("input[type='checkbox']").first().prop("checked", true);
        }
        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        selectedItems.push(JSON.parse(item));

    }
    else {

        var pagetable = $(elem).parents(".card-body");
        $(`#${pagetable_id}`).find("input[type='checkbox']").first().prop("checked", false);
        var validCount = 0,
            primaryCount = 0,
            selectedItemsL = selectedItems.length;

        var primaryDataArr = Object.keys(primaryData).map((key) => [key, primaryData[key]]);
        var item = "{ ";
        for (var k = 0; k < primaryDataArr.length; k++) {
            var v = primaryDataArr[k];
            item += `"${v[0]}": "${v[1]}",`;
        }
        item += "}";
        item = item.replace(",}", "}");
        primaryData = JSON.parse(item)

        for (var k = 0; k < selectedItemsL; k++) {
            var v = selectedItems[k];
            $.each(v, function (key, val) {
                primaryCount += 1;

                if (primaryData[key].toString() == val.toString())
                    validCount += 1;

            })
            if (validCount == primaryCount) {
                selectedItems = jQuery.grep(selectedItems, function (value) {
                    return value != v;
                });
            }
            primaryCount = 0;
            validCount = 0;
        }
    }

    arr_pagetables[index].selectedItems = selectedItems;
}

function getFirstColIndexHasInput(pg_name) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_editable = arr_headerLinePagetables[index].editable;

    if (pagetable_editable) {
        var p_Elmbody = $(`#${pg_name} .pagetablebody`);
        var td_id_has_elm = p_Elmbody.find(`tbody >  #row${pagetable_currentrow} > td > input:not([type='checkbox']),tbody >  #row${pagetable_currentrow} > td select:not(:disabled),tbody >  #row${pagetable_currentrow} > td select:not([readonly]),tbody >  #row${pagetable_currentrow} > td  > .funkyradio >input,tbody >  #row${pagetable_currentrow} > td .search-modal-container > input`).closest("td").first().attr("id");

        if (td_id_has_elm != undefined) {
            var index_uline_Second = td_id_has_elm.indexOf("_", td_id_has_elm.indexOf("_") + 1);
            var column_index = td_id_has_elm.replace(td_id_has_elm.substring(0, index_uline_Second + 1), "");
            return +column_index;
        }
        else
            return 0;
    }
}

function configSelect2_trEditing(pg_name, rowno, enableConfig = false) {

    $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td[data-select2='true']`).each(function () {
        if ($(`#${pg_name} #${$(this).attr("id")} div`).first().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).first().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).first().addClass("displaynone");

        if ($(`#${pg_name} #${$(this).attr("id")} div`).last().hasClass("displaynone"))
            $(`#${pg_name} #${$(this).attr("id")} div`).last().removeClass("displaynone");
        else
            $(`#${pg_name} #${$(this).attr("id")} div`).last().addClass("displaynone");

    })
    if (enableConfig) {

        var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
        var columns = arr_headerLinePagetables[index].columns;
        $(`#${pg_name} .pagetablebody > tbody > tr#row${rowno} td`).find("select.select2").each(function () {
            var elemId = $(this).attr("id");
            var colId = elemId.split("_")[0];
            var column = columns.filter(a => a.id == colId)[0];
            var getInputSelectConfig = column.getInputSelectConfig;
            if (getInputSelectConfig != null && column.isSelect2) {
                var params = "";
                var parameterItems = getInputSelectConfig.parameters;
                if (parameterItems != null && parameterItems.length > 0) {
                    for (var i = 0; i < parameterItems.length; i++) {
                        var paramItem = parameterItems[i].id;
                        if (parameterItems[i].inlineType)
                            params += $(`#${pg_name} #${paramItem}_${rowno}`).val();
                        else
                            params += $(`#${paramItem}`).val();

                        if (i < parameterItems.length - 1)
                            params += "/";
                    }
                }
                var val = +$(`#${pg_name} #${elemId}`).data("value");
                $(`#${pg_name} #${elemId}`).empty();

                if (column.pleaseChoose)
                    $(`#${pg_name} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {

                    fill_select2(getInputSelectConfig.fillUrl, `${pg_name} #${elemId}`, true, params, false, 0, '', function () {
                        $(`#${pg_name} #${elemId}`).val(val).trigger("change");
                    });
                }
            }
            else {
                var val = +$(`#${pg_name} #${$(this).attr("id")}`).data("value");
                $(`#${pg_name} #${elemId}`).select2();
                $(`#${pg_name} #${elemId}`).val(val).trigger("change");
            }
        });
    }

    if (typeof after_configSelect2_trEditing != "undefined")
        after_configSelect2_trEditing();

}

function trOnclick(pg_name, elm, evt) {
    //disabledInsElements(".ins-out", true);
    //disabledInsElements(".ins-row", true);

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;
    var tr_clicked_rowno = +$(elm).attr("id").replace(/row/g, "");

    headerLineRowAfterClick(pg_name, tr_clicked_rowno)//Mr_Tag2

    if (tr_clicked_rowno == pagetable_currentrow) {
        return;
    }

    //if (trediting) {
    //    if (elm.hasClass("funkyradio"))
    //        elm.prop("checked", !elm.prop("checked"));

    //    return;
    //}

    pagetable_currentrow = +$(elm).attr("id").replace(/row/g, "");
    arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
    tr_HighlightHeaderLine(pg_name);
}

function tr_HighlightHeaderLine(pg_name) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;

    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

function trOnfocus(pg_name, colno) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;

    if (trediting) {
        var elm = $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input[type=text]");
        if (!elm.hasClass("funkyradio"))
            elm.select();
    }
}

function after_change_trHeaderLine(pg_name, keycode) {



    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var currentrow = arr_headerLinePagetables[index].currentrow;
    var tr_editing = arr_headerLinePagetables[index].trediting;

    if (keycode == KeyCode.ArrowUp || keycode == KeyCode.ArrowDown || keycode == KeyCode.Enter)
        tr_HighlightHeaderLine(pg_name);
    if (keycode === KeyCode.Esc) {

        if (tr_editing) {
            initialRowHeaderLine(pagetable_id, false);
            $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr#row${currentrow}`).focus();
        }

    }
}

function headerLineIns(pageId, callBack = undefined) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : arr_headerLinePagetables[index].headerType == "inline" ? "ins-row" : "ins-rowEditable";
    var opr = "";

    if (headerId == "ins-rowEditable")
        opr = $(`#${pageId} tbody tr.highlight`).data()["model.id"] == undefined ? "Ins" : "Up"
    else
        opr = $(`.${headerId}`).data()["model.id"] == undefined ? "Ins" : "Up"

    if (headerId == "ins-out") {
        var validate = true;
        var form = null;

        form = $(`#${activePageId} #${pageId} .${headerId} > .row`).parsley();
        validate = form.validate();
        validateSelect2(form);
        if (!validate) return;
    }
    var newModel = {};
    var detailModel = null;
    var url = "";
    if (opr == "Ins") {
        lineEdited = false;

        for (var i = 0; i < additionalData.length; i++) {
            newModel[additionalData[i].name] = additionalData[i].value;
        }
        url = arr_headerLinePagetables[index].insRecord_Url;

        $(`#${activePageId} #${pageId} .${headerId}`).removeData();
    }
    else {

        lineEdited = true;
        var primaryData = headerId == "ins-rowEditable" ? $(`#${activePageId} #${pageId} tbody tr.highlight`).data() : $(`#${activePageId} #${pageId} .${headerId}`).data();

        $.each(primaryData, function (k, v) {
            if (k.indexOf("model.") == 0) {
                if (k.indexOf("isdisplaynoneitem") != -1)
                    newModel[k.replace("isdisplaynoneitem", "")] = v;
                if (k.indexOf("select2-id") == -1) {
                    var modelId = k.split("model.")[1];
                    newModel[modelId] = v;
                }
            }
        })
        for (var i = 0; i < additionalData.length; i++) {
            newModel[additionalData[i].name] = additionalData[i].value;
        }

        url = arr_headerLinePagetables[index].upRecord_Url;
    }

    var swReturn = false;

    var element = headerId == "ins-rowEditable" ? $(`#${activePageId} #${pageId} tr.highlight`) : $(`#${activePageId} #${pageId} .${headerId}`);

    element.find("input,select,img,textarea,input:hidden").each(function () {
        var elm = $(this);
        if ((elm.hasClass("form-control") || elm.attr("type") == "checkbox")/* && elm.attr("disabled") != "disabled"*/) {

            var elmid = headerId == "ins-rowEditable" ? elm.attr("id").split("_")[0] : elm.attr("id");
            var val = "";

            if (elm.hasClass("money"))
                val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
            else if (elm.hasClass("decimal"))
                val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
            else if (elm.hasClass("number"))
                val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
            else if (elm.hasClass("str-number"))
                val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
            else if (elm.attr("type") == "checkbox")
                val = elm.prop("checked");
            else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
                val = elm.val();
            else
                if (val !== null)
                    val = myTrim(elm.val());

            var tag = elm.prop("tagName").toLowerCase();
            if (tag === `img`) {
                var src = elm.attr("src");
                var pos = src.indexOf("base64,");
                if (pos != -1) {
                    val = src.substring(pos + 7);
                    var decoded = atob(val);
                    if (decoded.length >= 51200) {
                        alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                        swReturn = true;
                        return;
                    }
                    elmid = elmid + "_base64";
                }
            }
            if (val != "") {
                if (headerId == "ins-row" && elm.data("inputid") != undefined)
                    elmid = elm.data("inputid");
                newModel[elmid] = val;
            }
        }
    });

    if (swReturn)
        return;
    var validateModel = true;
    if (typeof arr_headerLinePagetables[index].saveValidationFunc != "undefined")
        validateModel = arr_headerLinePagetables[index].saveValidationFunc(newModel);
    if (validateModel) {




        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(newModel),
            async: false,
            cache: false,
            success: function (result) {
                if (result.successfull) {
                    var msg = alertify.success(msg_row_edited);
                    msg.delay(alertify_delay);
                    if (typeof callBack == "undefined") {
                        getPagetable_HeaderLine(pageId);
                        if (opr === "Ins") {
                            isAfterSave = true;
                            if (typeof after_insertLine != "undefined")
                                after_insertLine();
                        }
                        else {
                            if (typeof after_UpdateLine != "undefined")
                                after_UpdateLine();
                            isAfterSave = false;
                        }
                    }
                    else
                        callBack(true);
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

                    if (typeof callBack != "undefined")
                        callBack(false);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }

}

function tr_save_row(pg_name, keycode) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var currentrow = arr_headerLinePagetables[index].currentrow;

    var validRow = true;
    if (typeof (save_row_validation) != "undefined")
        validRow = save_row_validation(pagetable_id, currentrow);

    if (validRow) {
        headerLineIns(pg_name, function (result) {
            if (result) {
                getPagetable_HeaderLine(pg_name, null, null, function () {
                    arr_headerLinePagetables[index].currentrow = currentrow;
                    after_save_row(pg_name, "success", keycode, false);
                });
            }
            else
                after_save_row(pg_name, "error", keycode, false);
        });
    }
};

function after_save_row(pg_name, result_opr, keycode, initial) {


    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_currentpage = arr_headerLinePagetables[index].currentpage;
    var pagetable_lastpage = arr_headerLinePagetables[index].lastpage;
    var trediting = arr_headerLinePagetables[index].trediting;

    if (trediting)
        initialRow(pagetable_id, initial);

    if (keycode == KeyCode.ArrowDown) {
        // اگر سطر بعدی وجود داشت
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow + 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow++;
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

                tr_HighlightHeaderLine(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage != pagetable_lastpage) {
                arr_headerLinePagetables[index].currentrow = 1;
                pagetable_nextpage(pagetable_id);
            }
            else if (pagetable_currentpage == pagetable_lastpage)
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
        }
    }
    else if (keycode == KeyCode.ArrowUp) {
        if ($(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow - 1}`)[0] !== undefined) {
            if (result_opr == "success") {
                pagetable_currentrow--;
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow >= 1 ? pagetable_currentrow : 1;

                tr_HighlightHeaderLine(pg_name);
            }
            else if (result_opr == "cancel") {
                initialRow(pagetable_id, initial);
                $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
            }
        }
        else {
            if (pagetable_currentpage == 1) {
                if (result_opr == "success" || result_opr == "cancel")
                    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
                if (result_opr == "cancel")
                    initialRow(pagetable_id, initial);
            }
            else if (pagetable_currentpage != 1)
                pagetable_prevpage(pagetable_id);
        }
    }

    arr_headerLinePagetables[index].currentcol = get_FirstColIndexHasInput(pagetable_id);
}

function initialRow(pg_name, isInitial) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    arr_headerLinePagetables[index].trediting = false;

    $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).find(".editrow").remove();
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio").attr("disabled", true);/* : not([type = 'checkbox'])*/
    $(`#${pagetable_id} .pagetablebody > tbody > tr`).find("input,select,div.funkyradio > label").removeClass("border-thin");

    if (isInitial) {

        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input").val("");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("select").val("0").trigger("change");
    }

}

function headerLineCancel(pageId) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";

    var insRowInputs = $(`#${pageId} .${headerId}`).find("input,select");
    for (var i = 0; i < insRowInputs.length; i++) {
        $(insRowInputs[i]).val("");
        if ($(insRowInputs[i]).prop("tagName") == "SELECT")
            $(insRowInputs[i]).trigger("change");
    }
    //var btnCancel = $(`#${pageId} .${headerId} #haederLineCancel`);
    //btnCancel.addClass("d-none");

    var btnInsUp = $(`#${pageId} .${headerId} #headerLineInsUp`);
    btnInsUp.html('<i class="fa fa-plus"></i>');
}

function run_header_line_row_edit(pageId, rowNo, ev) {

    if (ev != undefined)
        ev.stopPropagation();


    if (typeof checkEditOrDeletePermission != "undefined") {
        if (!checkEditOrDeletePermission()) {
            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }

    if (typeof validationEditRow !== "undefined") {
        let valid = validationEditRow();
        if (!valid) return;
    }

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : arr_headerLinePagetables[index].headerType == "inline" ? "ins-row" : "ins-rowEditable";

    $(`#${pageId} table tbody tr`).removeClass("highlight");
    $(`#${pageId} table tbody tr#row${rowNo}`).addClass("highlight");

    var url = arr_headerLinePagetables[index].getRecord_Url;

    if (headerId != "ins-rowEditable") {
        var insRow = $(`#${pageId} .${headerId}`)[0];
        $(`.${headerId}`).removeData();
    }
    var currentRowData = $(`#${pageId} .pagetablebody > tbody > #row${rowNo}`).data();
    var get_record_model = {};
    $.each(currentRowData, function (k, v) {

        if (k.indexOf("isdisplayitem") == -1) {
            if (headerId != "ins-rowEditable") {
                var columnId = k.replace("isdisplaynoneitem", "");
                $(insRow).data(`${columnId}`, v);
            }

            if (k.indexOf("isdisplaynoneitem") == -1) {
                var modelId = k.split("model.")[1];
                get_record_model[modelId] = v;
            }
        }

    });

    if (typeof getRecordParameterFinalizeFunc != "undefined")
        get_record_model = getRecordParameterFinalizeFunc(get_record_model);

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(get_record_model),
        cache: false,
        success: function (result) {

            if (result.data != null) {
                var data = result.data;
                lineSelectedId = data.id;
                if (arr_headerLinePagetables[index].headerColumns != null && arr_headerLinePagetables[index].headerColumns.hasStageStepConfig == true) {

                    getStageStepConfig(null, arr_headerLinePagetables[index].headerColumns, result.data, pageId, function () {
                        var insRowInputs = $(`#${pageId} .${headerId}`).find("input,select");
                        //handle_hasDetailConfig();
                        for (var i = 0; i < insRowInputs.length; i++) {
                            var elem = $(insRowInputs[i]);
                            $.each(data, function (k, v) {

                                if ($(elem).attr("id") == k) {

                                    if ($(elem).prop("tagName") == "SELECT") {
                                        $(`#${$(elem).attr("id")}`).data("value", v);
                                    }
                                }
                            })
                        }

                        for (var i = 0; i < insRowInputs.length; i++) {
                            var elem = $(insRowInputs[i]);
                            $.each(data, function (k, v) {
                                if ($(elem).attr("id") == k || (headerId == "ins-row" && $(elem).data("inputid") == k)) {
                                    if ($(elem).hasClass("money"))
                                        $(`#${$(elem).attr("id")}`).val(transformNumbers.toComma(v));
                                    else if ($(elem).hasClass("money-decimal"))
                                        $(`#${$(elem).attr("id")}`).val(transformNumbers.toComma(v));
                                    else
                                        $(`#${$(elem).attr("id")}`).val(v);

                                    if ($(elem).prop("tagName") == "SELECT") {
                                        if (isStageStepLineField(arr_headerLinePagetables[index].headerColumns, $(elem))) {
                                            $(`#${$(elem).prop("id")}`).data("getStageStepConfigBlocked", true);
                                        }
                                        $(`#${$(elem).attr("id")}`).change();
                                    }

                                    else if ($(elem).attr("type") == "checkbox" && v === true)
                                        $(`#${$(elem).attr("id")}`).prop("checked", true);
                                    else
                                        $(`#${$(elem).attr("id")}`).prop("checked", false);
                                }
                            });
                        }
                    });
                }
                else {

                    var insRowInputs = headerId == "ins-rowEditable" ? $(`#${pageId} tbody tr.highlight`).find("input,select") : $(`#${pageId} .${headerId}`).find("input,select");
                    var data = result.data;
                    lineSelectedId = data.id;
                    //handle_hasDetailConfig();
                    if (headerId == "ins-row" && typeof configTreasuryElementPrivilage == "function")
                        configTreasuryElementPrivilage(`.ins-row`, true);

                    for (var i = 0; i < insRowInputs.length; i++) {
                        var elem = $(insRowInputs[i]);
                        $.each(data, function (k, v) {
                            if ($(elem).attr("id").split("_")[0] == k || (headerId == "ins-row" && $(elem).data("inputid") == k)) {
                                if ($(elem).hasClass("money"))
                                    $(`#${$(elem).attr("id")}`).val(transformNumbers.toComma(v));
                                else
                                    $(`#${$(elem).attr("id")}`).val(v);

                                if ($(elem).prop("tagName") == "SELECT") {

                                    $(`#${$(elem).attr("id")}`).trigger("change");
                                }

                                else if ($(elem).attr("type") == "checkbox" && v === true)
                                    $(`#${$(elem).attr("id")}`).prop("checked", true);
                                else
                                    $(`#${$(elem).attr("id")}`).prop("checked", false);
                            }
                        });
                    }
                }
                if (typeof callBackAfterEdit !== "undefined")
                    callBackAfterEdit();
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
    //disabledInsElements(`#${pageId} .${headerId}`, false, true);
    if (typeof (configLineElementPrivilage) != "undefined")
        configLineElementPrivilage(`.${headerId}`, true);
}

function run_header_line_row_delete(pageId, rowNo) {

    if (typeof checkEditOrDeletePermission != "undefined") {
        if (!checkEditOrDeletePermission("Del")) {
            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }

    if (typeof validationDeleteRow !== "undefined") {
        let valid = validationDeleteRow();
        if (!valid) return;
    }

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var url = arr_headerLinePagetables[index].delRecord_Url;

    var currentRowData = $(`#${pageId} .pagetablebody > tbody > #row${rowNo}`).data();
    var delete_record_model = {};
    $.each(currentRowData, function (k, v) {
        if (k.indexOf("isdisplayitem") == -1 && k.indexOf("isdisplaynoneitem") == -1) {
            var modelId = k.split("model.")[1];
            delete_record_model[modelId] = v;
        }
    });

    for (var i = 0; i < additionalData.length; i++) {
        delete_record_model[additionalData[i].name] = additionalData[i].value;
    }
    $(`#${pageId} table tbody tr`).removeClass("highlight");
    $(`#${pageId} table tbody tr#row${rowNo}`).addClass("highlight");

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(delete_record_model),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                var msg = alertify.success(msg_row_deleted);
                msg.delay(alertify_delay);

                getPagetable_HeaderLine(pageId, null, false, () => {
                    if (typeof run_header_line_row_After_delete !== "undefined")
                        run_header_line_row_After_delete();
                });
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
                    var msg = alertify.error("حذف سطر با مشکل مواجه شد");
                    msg.delay(2);
                }
            }
        },
        error: function (xhr) {

            error_handler(xhr, url)
        }
    });
}

function set_row_editingHeaderline(pg_name) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    $(":focus").blur();
    $(":focus").focusout();

    if (pagetable_editable) {
        arr_headerLinePagetables[index].trediting = true;
        $(`#${pagetable_id} .pagetablebody > tbody > tr > td:first`).find(".editrow").remove();
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow} > td:first`).append("<i class='fas fa-edit editrow'></i>");
        $(`#${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).find("input,select,div.funkyradio").attr("disabled", false);
    }
}

function run_header_Line_Detail(listUrl, getRecordUrl, insUpUrl, deleteUrl, elem) {
    initial_detail_config(listUrl, getRecordUrl, insUpUrl, deleteUrl, elem);
    show_line_det();
}

function initial_detail_config(listUrl, getRecordUrl, insUpUrl, deleteUrl, elem) {
    CurrentPrimaries = [];
    var primaryData = $(elem).parents("tr").data();
    $.each(primaryData, function (k, v) {
        if (k.split("model.")[1].indexOf("hidden") == -1) {
            var modelId = k.split("model.")[1];
            var item = {
                Title: modelId,
                Value: v
            };
            CurrentPrimaries.push(item);
        }

    })

    CurrentApiSetting = {
        listUrl: listUrl,
        getRecordUrl: getRecordUrl,
        insUpUrl: insUpUrl,
        deleteUrl: deleteUrl,
    };
}

function show_line_det() {
    show_model_det();
    show_det_page();
}

function show_det_page() {
    $.ajax({
        url: CurrentApiSetting.listUrl,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(CurrentPrimaries),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                fill_det_page(result)
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(4);
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
            error_handler(xhr, CurrentApiSetting.listUrl)
        }
    });
}

function show_model_det() {

    $(`#detLineModal`).modal({ "backdrop": "static" });

}

function close_modal_det() {
    modal_close("detLineModal");
}

$('#detLineModal').on('shown.bs.modal', function (e) {
    var elem = $("#detLineModal table thead .ins-det-row th:first");
    elem.find("input,select").each(function () {
        if ($(this).hasClass("select2-hidden-accessible")) {
            $(this).select2('focus');
        }
        else {
            $(this).focus();
        }
    })
})

function fill_det_page(result) {
    if (!result) return "";
    var columns = result.columns.dataColumns;
    var buttoncount = 2;
    var buttons = result.columns.buttons;

    if (buttons != null)
        buttoncount += buttons.length;

    conditionTools = [];
    conditionAnswer = "";
    elseAnswerCondition = "";
    listForCondition = {};

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    var list = result.data;
    var pageId = "detLineModal";
    $(`#${pageId} #modal_title`).text(result.columns.title);
    var detDiv = $(`#${pageId} .modal-body`);
    detDiv.html("");
    var href = '/pb/public/pageHeaderLineDet';
    $.ajax({
        url: href,
        type: "get",
        datatype: "html",
        contentType: "application/html; charset=utf-8",
        async: false,
        cache: false,
        dataType: "html",
        success: function (res) {
            detDiv.html(res);

            var elm_pbody = $(`#${pageId} .pagetablebody`);
            elm_pbody.html("");

            var btn_tbidx = 3000;

            var str = "";

            str += '<thead>';
            str += '<tr>';


            //str += '<th style="width:3%">ردیف</th>';

            for (var i in columns) {
                var col = columns[i];
                if (col.isDtParameter) {
                    str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">' + col.title + '</th>';
                }
            }

            str += '</tr>';


            str += '<tr class="ins-det-row">';
            elm_pbody.append(str);
            str = "";
            var insRowElem = $(`#${pageId} .pagetablebody tr`).last();

            for (var i in columns) {
                var col = columns[i];
                if (col.isDtParameter) {
                    if (columns[i].id != "action") {
                        colno += 1;

                        if (columns[i].inputType == "select") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                            str += `<select tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  class="form-control select2" id="${columns[i].id}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)"`;

                            str += ">";

                            if (columns[i].pleaseChoose)
                                str += `<option value="0">انتخاب کنید</option>`;

                            var lenInput = columns[i].inputs.length;

                            for (var h = 0; h < lenInput; h++) {
                                var input = columns[i].inputs[h];
                                if (value != +input.id) {
                                    str += `<option value="${input.id}">${input.name}</option>`;
                                }
                                else {
                                    str += `<option value="${input.id}" selected>${input.name}</option>`;
                                }
                            }
                            str += "</select></th>";
                            insRowElem.append(str);

                            if (columns[i].isSelect2 === true) {
                                $(`#${columns[i].id}`).select2();
                            }

                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "datepersian") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control persian-datepicker" data-inputmask="${columns[i].inputMask.mask}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' data-parsley-shamsidate  onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" required maxlength="10" autocomplete="off"/></th>`;
                            insRowElem.append(str);
                            $(`#${columns[i].id}`).inputmask();

                            if (btn_tbidx == 3000)
                                $(`#${columns[i].id}`).focus();
                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "checkbox") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<div tabindex="${btn_tbidx}" class="funkyradio id="${columns[i].id}" funkyradio-success" onchange="public_tr_object_onchange(this,'${pageId}')" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno})' onfocus="tr_object_onfocus(this)" tabindex="-1">`;

                            str += `<input ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="checkbox" id="${columns[i].id}" name="checkbox" />
                                </div></th>`;
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "number") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}"  class="form-control number" onchange="public_object_onchange(this)" onblur="object_onblur(this)"  onfocus="object_onfocus(this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);
                            if (btn_tbidx == 3000)
                                $(`#${columns[i].id}`).focus();
                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "money") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control money" onchange="public_object_onchange(this)" onblur="public_object_object_onblur(this)" onfocus="object_onfocus(this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);

                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "money-decimal") {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control money-decimal" onchange="public_object_onchange(this)" onblur="public_object_object_onblur(this)" onfocus="object_onfocus(this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);

                            btn_tbidx++;
                        }
                        else if (columns[i].inputType == "decimal") {

                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control decimal" ${columns[i].inputmask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}  onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);


                            btn_tbidx++;
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control" onchange="public_object_onchange(this)" onblur="object_onblur(this)" onfocus="object_onfocus(this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);

                            btn_tbidx++;
                        }
                    }
                    else {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                        str += `<button tabindex="${btn_tbidx}" id="btn_det" onclick="detLineInsUp(this,'Ins')" class="btn btn-light border-dark pa float-sm-right"><i class="fa fa-plus"></i></button>`;
                        //btn_tbidx++;
                        //str += `<button tabindex="${btn_tbidx}" id="btn_det_cancel" onclick="detLineCancel()" class="btn btn-danger pa mr-1 float-sm-right pr-4 pl-4 d-none"><i class="fa fa-times"></i></button>`;
                        insRowElem.append(str);
                    }

                }
            }
            $.each($(`#${pageId} .pagetablebody tr .persian-datepicker`), function (key, val) {
                kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
            })
            str = '<tbody>';
            if (list.length == 0 || list == null) {
                str += fillEmptyRow(columns.length);
            }
            else
                for (var i in list) {
                    var item = list[i];
                    var rowno = (+i) + 1;
                    var colno = 0;
                    var colwidth = 0;
                    for (var j in columns) {
                        var primaries = "";

                        $.each(columns, function (k, v) {
                            if (v["isPrimary"] === true)
                                primaries += ' data-' + v["id"] + '="' + item[v["id"]] + '"';
                        })
                        colwidth = columns[j].width;
                        listForCondition = list[i];
                        if (j == 0) {
                            if (conditionResult != "noCondition") {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                            }
                            else {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                            }
                            //if (arr_headerLinePagetables[index].currentpage == 1)
                            //    str += `<td id="col_${rowno}_2" style="width:3%">${parseInt(i) + 1}</td>`;
                            //else
                            //    str += `<td id="col_${rowno}_2" style="width:3%">${(parseInt(i) + 1) + ((arr_headerLinePagetables[index].currentpage - 1) * formPlateHeaderLine_PageRowsCount)
                            //        }</td >`;

                        }
                        if (columns[j].isDtParameter) {
                            if (columns[j].id != "action") {
                                colno += 1;
                                var value = item[columns[j].id];
                                if (columns[j].editable) {

                                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;
                                    if (columns[j].inputType == "select") {

                                        str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;

                                        if (columns[j].pleaseChoose)
                                            str += `<option value="0">انتخاب کنید</option>`;

                                        var lenInput = columns[j].inputs.length;

                                        for (var h = 0; h < lenInput; h++) {
                                            var input = columns[j].inputs[h];
                                            if (value != +input.value) {
                                                str += `<option value="${input.id}">${input.name}</option>`;
                                            }
                                            else {
                                                str += `<option value="${input.id}" selected>${input.name}</option>`;
                                            }
                                        }
                                        str += "</select>";
                                    }
                                    else if (columns[j].inputType == "datepersian") {

                                        str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                    }
                                    else if (columns[j].inputType == "datepicker") {

                                        str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                    }
                                    else if (columns[j].inputType == "checkbox") {
                                        str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input onchange="funkyradio_onchange(this)" type="checkbox" name="checkbox" id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                        </div>`;
                                    }
                                    else if (columns[j].inputType == "number")
                                        str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                    else if (columns[j].inputType == "money")
                                        str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                    else if (columns[j].inputType == "money-decimal")
                                        str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                    else if (columns[j].inputType == "decimal")
                                        str += `<input type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                    else
                                        str += `<input type="text" value="${value}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                    str += "</td>"
                                }
                                else if (columns[j].isReadOnly) {

                                    str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                    if (columns[j].inputType == "number")
                                        str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                    else if (columns[j].inputType == "money")
                                        str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                    else if (columns[j].inputType == "money-decimal")
                                        str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                    else if (columns[j].inputType == "decimal")
                                        str += `<input type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                    else
                                        str += `<input type="text" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                    str += "</td>"
                                }
                                else {
                                    if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                        if (value != null && value != "") {
                                            str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%" >' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                        }
                                        else {
                                            str += `<td style="width:${colwidth}%"></td>`;
                                        }
                                    }
                                    else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                        if (value != null && value != "") {
                                            str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + ' width:' + colwidth + '%" >' + value + '</td>';
                                        }
                                        else {
                                            str += `<td style="width:${colwidth}%"></td>`;
                                        }
                                    }
                                    else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
                                        if (value != null && value != "") {
                                            if (value && columns[j].isCommaSep)
                                                value = transformNumbers.toComma(value)
                                            if (columns[j].type === 5) {
                                                value = value.toString()
                                            }
                                            str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%" >' + value + '</td>';
                                        }
                                        else {
                                            str += `<td style="width:${colwidth}%" ></td>`;
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
                                            str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + ' width:' + colwidth + '%;" >' + value + '</td>';
                                        else
                                            str += `<td style="width:${colwidth}%"></td>`;
                                    }
                                }
                            }
                            else {

                                if (result.columns.actionType === "dropdown") {
                                    str += `<td style="width:${colwidth}%">`;
                                    str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                    for (var k in buttons) {
                                        var btn = buttons[k];
                                        if (btn.isSeparator == false) {
                                            btn_tbidx++;
                                            if (btn.isDetailBtn == true) {
                                                str += `<button id="btn_${btn.name}" onclick="run_header_Line_Detail('${btn.listUrl}','${btn.getRecordUrl}','${btn.insUpUrl}','${btn.deleteUrl}',this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                            }
                                            else
                                                str += `<button id="btn_${btn.name}" onclick="run_det_header_${btn.name}(${rowno})" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                        }
                                        else
                                            str += `<div class="button-seprator-hor"></div>`;
                                    }

                                    str += `</div>
                                </div>`;
                                    str += '</td>';
                                }
                                else if (result.columns.actionType === "inline") {

                                    str += `<td style="width:${colwidth}%">`;

                                    for (var k in buttons) {
                                        var btn = buttons[k];
                                        if (btn.isSeparator == false) {
                                            btn_tbidx++;
                                            if (btn.isDetailBtn)
                                                str += `<button id="btn_${btn.name}" onclick="run_header_line_Detail('${btn.listUrl}','${btn.getRecordUrl}','${btn.insUpUrl}','${btn.deleteUrl}',this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                            else
                                                str += `<button  type="button" id="btn_${btn.name}" onclick="run_det_header_${btn.name}(${rowno})" class="${btn.className}" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
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
            str += '</tbody>';

            elm_pbody.append(str);

        },
        error: function (xhr) {
            error_handler(xhr, href);
        }
    });
}

function detLineInsUp(elem, opr) {
    //var form = $(`#${pageId} .ins-row`).parsley();
    //var validate = form.validate();
    //if (!validate) return;
    var pageId = "detLineModal"
    var newModel = {};
    var url = CurrentApiSetting.insUpUrl;
    if (opr === "Ins") {
        for (var i = 0; i < CurrentPrimaries.length; i++) {
            newModel[CurrentPrimaries[i].Title] = CurrentPrimaries[i].Value;
        }
    }
    else {
        var primaryData = $(elem).parents(".ins-det-row").data();

        $.each(primaryData, function (k, v) {
            newModel[k] = v;
        })
    }
    newModel["Opr"] = opr;

    var swReturn = false;
    var element = $(`#${pageId} .ins-det-row`);
    element.find("input,select,img,textarea,input:hidden").each(function () {
        var elm = $(this);
        if (elm.hasClass("form-control") || elm.prop("tagName") == "CHECKBOX") {
            var elmid = elm.attr("id");
            var val = "";

            if (elm.hasClass("money"))
                val = +removeSep(elm.val()) !== 0 ? +removeSep(elm.val()) : 0;
            else if (elm.hasClass("decimal"))
                val = +removeSep(elm.val()) !== 0 ? removeSep(elm.val().replace(/\//g, ".")) : 0;
            else if (elm.hasClass("number"))
                val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
            else if (elm.hasClass("str-number"))
                val = +removeSep(elm.val()) !== 0 ? elm.val() : "";
            else if (elm.attr("type") == "checkbox")
                val = elm.prop("checked");
            else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
                val = elm.val();
            else
                if (val !== null)
                    val = myTrim(elm.val());

            var tag = elm.prop("tagName").toLowerCase();
            if (tag === `img`) {
                var src = elm.attr("src");
                var pos = src.indexOf("base64,");
                if (pos != -1) {
                    val = src.substring(pos + 7);
                    var decoded = atob(val);
                    if (decoded.length >= 51200) {
                        alertify.alert("کنترل حجم", msg_picturesize_limit_50);
                        swReturn = true;
                        return;
                    }
                    elmid = elmid + "_base64";
                }
            }

            if (val != "")
                newModel[elmid] = val;
        }
    });

    if (swReturn)
        return;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull == true) {
                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);
                show_det_page();
            }
            else {
                if (result.statusMessage !== undefined && result.statusMessage !== null) {
                    var msg = alertify.error(result.statusMessage);
                    msg.delay(4);
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
            error_handler(xhr, url)
        }
    });
}

function detLineCancel() {
    var pageId = "detLineModal";
    var insRowInputs = $(`#${pageId} .ins-det-row`).find("input,select");
    for (var i = 0; i < insRowInputs.length; i++) {
        $(insRowInputs[i]).val("");
        if ($(insRowInputs[i]).prop("tagName") == "SELECT")
            $(insRowInputs[i]).trigger("change");
    }
    var btnCancel = $(`#${pageId} .ins-det-row #btn_det_cancel`);
    btnCancel.addClass("d-none");

    var btnInsUp = $(`#${pageId} .ins-det-row #btn_det`);
    btnInsUp.html('<i class="fa fa-plus"></i>');
}

function run_det_header_edit(rowNo) {

    url = CurrentApiSetting.getRecordUrl;
    var pageId = "detLineModal";
    var insRowInputs = $(`#${pageId} .ins-det-row`).find("input,select");
    var btnInsUp = $(`#${pageId} .ins-det-row  #btn_det`);
    btnInsUp.html(`<i class="fa fa-plus"></i>`);
    btnInsUp.attr("onclick", `detLineInsUp(this,'Up')`);
    var btnCancel = $(`#${pageId} .ins-det-row #btn_det_cancel`);
    btnCancel.removeClass("d-none");

    var insRow = $(`#${pageId} .ins-det-row`)[0];
    var currentRowData = $(`#${pageId} .pagetablebody > tbody > #row${rowNo}`).data();
    var get_record_model = {};
    $.each(currentRowData, function (k, v) {
        $(insRow).attr(`data-${k}`, v);
        get_record_model[k] = v;
    })

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(get_record_model),
        async: false,
        cache: false,
        success: function (result) {

            if (result.data != null) {

                $.each(result.data, function (k, v) {
                    $.each(insRowInputs, function (key, val) {
                        var elem = val;
                        if ($(elem).attr("id") == k) {
                            $(elem).val(v);
                            if ($(elem).prop("tagName") == "SELECT")
                                $(elem).trigger("change");

                            else if ($(elem).attr("type") == "checkbox" && v === true)
                                $(elem).prop("checked", true);
                            else
                                $(elem).prop("checked", false);
                        }
                    })
                })
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    })
}

function run_det_header_delete(rowNo) {
    var url = CurrentApiSetting.deleteUrl;
    var pageId = "detLineModal";
    var currentRowData = $(`#${pageId} .pagetablebody > tbody > #row${rowNo}`).data();
    var delete_record_model = {};
    $.each(currentRowData, function (k, v) {
        delete_record_model[k] = v;
    })

    alertify.confirm('', msg_delete_row,
        function () {
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(delete_record_model),
                async: false,
                cache: false,
                success: function (result) {
                    if (result.successfull == true) {
                        //var pagetableid = $(elem).closest("td").parent().parent().parent().parent().parent().attr("id");

                        show_det_page();

                        var msg = alertify.success('حذف سطر انجام شد');
                        msg.delay(alertify_delay);
                    }
                    else {
                        var msg = alertify.error(result.statusMessage);
                        msg.delay(alertify_delay);
                    }
                },
                error: function (xhr) {

                    error_handler(xhr, url);
                }
            });

        },
        function () { var msg = alertify.error('انصراف از حذف'); msg.delay(alertify_delay); }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });

}

function showRangeControl(elem, pageId) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";
    if (headerId == "ins-out")
        $(elem).parents("div").find(".range-price-table").addClass("show");
    else
        $(elem).parents("th").find(".range-price-table").addClass("show");
}

function showKeyDownRangeControl(e, elem) {
    if (e.which === KeyCode.Enter) {
        get_prices();
    }
}

function showFocusRangeControl(elem, pageId) {
    elem.select();
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";
    if (headerId == "ins-out")
        $(elem).parents("div").find(".range-price-table").addClass("show");
    else
        $(elem).parents("th").find(".range-price-table").addClass("show");
}

function closeRangecontrol(e, elem) {
    if (e.which === KeyCode.Enter) {
        $(elem).parents(".range-price-table").removeClass("show");
    }
}

function priceRangeBlur(elem, pageId) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : "ins-row";
    if (headerId == "ins-out")
        $(elem).parents("div").find(".range-price-table").removeClass("show");
    else
        $(elem).parents("th").find(".range-price-table").removeClass("show");
    //get_prices();
}

function showItems() {
    modal_show("ItemModal");
    getItemDropDownPageTable();
}

function click_link_Lineheader(elm) {
}

function click_link_header(elm) {
}

function getItemDropDownPageTable() {

    var pg_id = "itemPageTable";
    var pagetable_currentpage = itemPagetable.currentpage;
    var pagetable_lastpage = itemPagetable.lastpage;
    var pagetable_filteritem = itemPagetable.filteritem;
    var pagetable_filtervalue = itemPagetable.filtervalue;
    var pagetable_url = itemPagetable.getpagetable_url;
    var pagetable_filter = itemPagetable.getfilter_url

    if (pagetable_laststate == "nextpage") {
        if (pagetable_currentpage < pagetable_lastpage)
            pagetable_currentpage++;
    }
    else if (pagetable_laststate == "prevpage") {
        if (pagetable_currentpage > 1)
            pagetable_currentpage--;
    }

    if (pagetable_currentpage === 0) pagetable_currentpage = 1;

    itemPagetable.currentpage = pagetable_currentpage;

    //var pagetable_pagerowscount = itemPagetable.pagerowscount;
    //if (pagetable_pagerowscount === 0)
    //    pagetable_pagerowscount = $(`#${pg_id} .pagerowscount > button:first`).text();

    if ((pagetable_filteritem !== "filter-non" && pagetable_filteritem !== "") && pagetable_filtervalue == "") {
        var msg = alertify.error('عبارت فیلتر وارد نشده');
        msg.delay(alertify_delay);
        return;
    }

    if (pagetable_filtervalue != "" && (pagetable_filteritem === "filter-non" || pagetable_filteritem === "")) {
        var msg = alertify.error('مورد فیلتر انتخاب نشده');
        msg.delay(alertify_delay);
        return;
    }

    var pageViewModel = {
        pageno: pagetable_currentpage,
        pagerowscount: pagetable_pagerowscount,
        fieldItem: pagetable_filteritem,
        fieldValue: pagetable_filtervalue
    }
    pageViewModel.Form_KeyValue = headerLine_formkeyvalue;

    var url = "";

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
            fill_ItemDropDownPageTable(result, pg_id, function () {
                fill_filter_itemPageTable(result.columns);
                //if (detect_Mobile())
                //    pagetablePagination_mobile(result.maxPageCount, pagetable_currentpage, "");
                //else
                //    pagetablePagination(result.maxPageCount, pagetable_currentpage, pg_id);
                //pagetablePagefooterinfo(result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);
            });

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function fill_ItemDropDownPageTable(result, pageId, callback = undefined) {

    if (!result) return "";
    var columns = result.columns.dataColumns;
    var list = result.data;

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    arr_headerLinePagetables[index].editable = result.columns.isEditable;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    var pagetable_selectable = arr_headerLinePagetables[index].selectable;
    var pagetable_highlightrowid = arr_headerLinePagetables[index].highlightrowid;

    pagetable_hasfilter(pageId, result.columns.hasFilter);

    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    var conditionResult = result.columns.conditionOn;
    if (conditionResult != "") {
        conditionTools = result.columns.condition;
        conditionAnswer = result.columns.answerCondition;
        conditionElseAnswer = result.columns.elseAnswerCondition;
    }
    else
        conditionResult = "noCondition";

    var headerLineDiv = $(`#${activePageId} #header-lines-div`);
    headerLineDiv.html("");
    var pageTableMainDiv = `<fieldset class='group-box mt-3 ${result.columns.classes}'><legend>${result.columns.title}</legend><div class = 'card-body' id='${pageId}'></div></fieldset>`;
    headerLineDiv.append(pageTableMainDiv);

    $(`#${pageId}`).load(window.location.origin + "/Modules/PageTableHeaderLine.cshtml", function () {
        var elm_pbody = $(`#${pageId} .pagetablebody`);
        elm_pbody.html("");

        var btn_tbidx = 1000;

        var str = "";

        str += '<thead>';
        str += '<tr>';


        if (pagetable_editable == true)
            str += '<th style="width:3%"></th>';
        if (pagetable_selectable == true)
            str += '<th style="width:1%;text-align:center !important"><input class="checkall" type="checkbox"/></th>';

        str += '<th style="width:3%">ردیف</th>';

        for (var i in columns) {
            var col = columns[i];
            if (col.isDtParameter) {
                str += '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">' + col.title + '</th>';
            }
        }

        str += '</tr>';


        str += '<tr class="ins-row">';
        if (pagetable_editable == true)
            str += '<th style="width:3%"></th>';
        if (pagetable_selectable == true)
            str += '<th style="width:1%;text-align:center !important"></th>';

        str += '<th style="width:3%">ردیف</th></tr></thead>';
        elm_pbody.append(str);
        str = "";
        var insRowElem = $(`#${pageId} .pagetablebody tr`).last();
        for (var i in columns) {
            var col = columns[i];

            if (col.isDtParameter) {
                if (columns[i].id != "action") {
                    colno += 1;

                    var validators = "";

                    if (columns[i].validations != null) {
                        var validations = columns[i].validations;
                        for (var v = 0; v < validations.length; v++) {
                            if (validations[v].value1 == null && validations[v].value2 == null) {
                                validators += " " + validations[v].validationName;
                            }
                            else if (validations[v].validationName.indexOf("range") >= 0) {
                                validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                            }
                            else {
                                validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                            }
                        }
                    }

                    if (columns[i].inputType == "select") {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                        str += `<select tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  class="form-control select2" id="${columns[i].id}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)"`;

                        str += ">";

                        if (columns[i].pleaseChoose)
                            str += `<option value="0">انتخاب کنید</option>`;

                        var lenInput = columns[i].inputs.length;

                        for (var h = 0; h < lenInput; h++) {
                            var input = columns[i].inputs[h];
                            if (value != +input.id) {
                                str += `<option value="${input.id}">${input.name}</option>`;
                            }
                            else {
                                str += `<option value="${input.id}" selected>${input.name}</option>`;
                            }
                        }
                        str += "</select></th>";
                        insRowElem.append(str);

                        if (columns[i].isSelect2 === true) {
                            $(`#${columns[i].id}`).select2();
                        }
                        btn_tbidx++;
                    }
                    else if (columns[i].inputType == "complexSelect") {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                        str += `<div class="complex-select"><input class="form-control" type="text" disabled/><input class="form-control" type="text" disabled/><button onclick="showItems()" class="btn btn-light border-dark " tabindex="${btn_tbidx}">...</button></div></th>`;
                        insRowElem.append(str);
                        btn_tbidx++;
                    }
                    else if (columns[i].inputType == "datepersian") {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';
                        str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control persian-datepicker" data-inputmask="${columns[i].inputMask.mask}" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno},event)' onfocus="tr_object_onfocus(this,event)" placeholder="____/__/__" required maxlength="10" autocomplete="off"/></th>`;
                        $(`#${columns[i].id}`).inputmask();
                        insRowElem.append(str);
                    }
                    else if (columns[i].inputType == "checkbox") {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                        str += `<div tabindex="${btn_tbidx}" class="funkyradio funkyradio-success" id="${columns[i].id}" onchange="public_tr_object_onchange(this,'${pageId}')" onblur='tr_object_onblur('${pageId}',this,${colno},${rowno})' onfocus="tr_object_onfocus(this)" tabindex="-1">`;

                        str += `<input onchange="funkyradio_onchange(this)" ${validators} ${columns[i].headerReadOnly != true ? 'checked' : ''} type="checkbox" id="${columns[i].id}" name="checkbox" />
                                </div></th>`;
                        insRowElem.append(str);
                        btn_tbidx++;
                    }
                    else if (columns[i].inputType == "number") {
                        if (columns[i].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}"  class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                            str += priceRangeControl + "</th>";
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}"  class="form-control number" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);
                            btn_tbidx++;

                        }
                    }
                    else if (columns[i].inputType == "money") {

                        if (columns[i].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                            str = '<th style="position:relative;' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input onclick="showRangeControl(this)" onblur="priceRangeBlur(this)" onfocus="showFocusRangeControl(this)" onkeydown="showKeyDownRangeControl(event,this)" tabindex="${btn_tbidx}" ${validators} type="text" id="${columns[i].id}" class="form-control money" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                            str += priceRangeControl + "</th>";
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control money" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                    }
                    else if (columns[i].inputType == "money-decimal") {

                        if (columns[i].isRangeValue == true) {
                            var priceRangeControl = `<div onblur="rangeControlBlur()" class='range-price-table'><div class='fixed-val-price'>${columns[i].minValue} - ${columns[i].maxValue} </div></div>`;
                            str = '<th style="position:relative;' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input onclick="showRangeControl(this)" onblur="priceRangeBlur(this)" onfocus="showFocusRangeControl(this)" onkeydown="showKeyDownRangeControl(event,this)" tabindex="${btn_tbidx}" ${validators} type="text" id="${columns[i].id}" class="form-control money-decimal" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/>`;
                            str += priceRangeControl + "</th>";
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control money-decimal" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                            insRowElem.append(str);
                            btn_tbidx++;
                        }
                    }
                    else if (columns[i].inputType == "decimal") {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                        str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control decimal"${columns[i].inputmask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}  onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} autocomplete="off"/></th>`;
                        insRowElem.append(str);
                        btn_tbidx++;
                    }
                    else {
                        str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                        str += `<input tabindex="${btn_tbidx}" ${validators} ${columns[i].headerReadOnly == true ? 'disabled data-disabled="true"' : ''}  type="text" id="${columns[i].id}" class="form-control" onchange="public_tr_object_onchange(this,'${pageId}',event)" onblur="tr_object_onblur('${pageId}',this,${colno},${rowno},event)" onfocus="tr_object_onfocus(this,event)" onkeydown="tr_object_onkeydown(event,this)" oninput="tr_object_oninput(event,this)" ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} ${columns[i].isReadOnly == true ? 'readonly' : ''} autocomplete="off"/></th>`;
                        insRowElem.append(str);
                        btn_tbidx++;
                    }
                }
                else {

                    str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                    str += `<button tabindex="${btn_tbidx}" id="headerLineInsUp" data-disabled="false" onclick="headerLineIns('${pageId}')" class="btn btn-light border-dark pa float-sm-right"><i class="fa fa-plus"></i></button>`;
                    btn_tbidx++;
                    str += `<button tabindex="${btn_tbidx}" id="haederLineActive" data-disabled="false" onclick="headerLineActive('${pageId}')" data-toggle="tooltip" data-placement="top" class="btn mr-1 pa float-sm-right  "><i class="fa fa-check"></i></button>`;
                    //btn_tbidx++;
                    //str += `<button tabindex="${btn_tbidx}" id="haederLineCancel" onclick="headerLineCancel('${pageId}')" class="btn btn-danger mr-1 pa float-sm-right  d-none"><i class="fa fa-times"></i></button></th>`;
                    insRowElem.append(str);
                }

            }
            else if (col.isDisplayNone) {
                insRowElem.attr(`data-hidden-${columns[i].id}`, 0)
            }
        }

        str = '<tbody>';
        if (list.length == 0 || list == null) {
            str += fillEmptyRow(columns.length);
        }
        else
            for (var i in list) {
                var item = list[i];
                var rowno = (+i) + 1;
                var colno = 0;
                var colwidth = 0;
                for (var j in columns) {
                    var primaries = "";
                    var hiddens = "";

                    $.each(columns, function (k, v) {

                        if (v["isPrimary"] === true)
                            primaries += ' data-model.' + v["id"] + '="' + item[v["id"]] + '"';
                        if (v["isDisplayNone"] === true)
                            hiddens += ' data-hidden-' + v["id"] + '="' + item[v["id"]] + '"';
                    })


                    if (columns[j].hasSumValue == true) {
                        columns[j].sumValue += isNaN(item[columns[j].id]) ? 0 : item[columns[j].id];
                    }

                    colwidth = columns[j].width;
                    listForCondition = list[i];
                    if (j == 0) {
                        if (conditionResult != "noCondition") {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + " " + hiddens + ' class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                                else {
                                    str += '<tr class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-2"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                            }
                            else {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + " " + hiddens + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1"' + `
                             style="${eval(`${listForCondition[conditionTools[0].fieldName]} ${conditionTools[0].operator} ${conditionTools[0].fieldValue}`) ? conditionAnswer : conditionElseAnswer}"` + '>';
                                }
                            }
                        }
                        else {
                            if (pagetable_highlightrowid != 0 && item[columns[j].id] == pagetable_highlightrowid) {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + " " + hiddens + ' class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-2">';
                                }
                                else {
                                    str += '<tr class="highlight" id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-2">';
                                }
                            }
                            else {
                                if (columns[j].isPrimary) {
                                    str += '<tr' + primaries + " " + hiddens + ' id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                                else {
                                    str += '<tr id="row' + rowno + '" onkeydown="trOnkeydown(event,`' + pageId + '`,this)" onclick="trOnclick(`' + pageId + '`,this,event)" tabindex="-1">';
                                }
                            }
                        }



                        if (pagetable_editable)
                            str += `<td id="col_${rowno}_1"></td>`;
                        if (pagetable_selectable) {
                            str += `<td id="col_${rowno}_0" style="text-align:center"><input type="checkbox" `;

                            if (pageId == "pagetable1") {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelDiAssign, function (k, v) {
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

                            }
                            if (pageId == "pagetable2") {
                                var validCount = 0;
                                var primaryCount = 0;
                                var isCol = false;
                                $.each(modelAssign, function (k, v) {
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
                            }
                            str += '</td >';
                        }

                        if (arr_headerLinePagetables[index].currentpage == 1)
                            str += `<td id="col_${rowno}_2">${parseInt(i) + 1}</td>`;
                        else
                            str += `<td id="col_${rowno}_2">${(parseInt(i) + 1) + ((arr_headerLinePagetables[index].currentpage - 1) * formPlateHeaderLine_PageRowsCount)
                                }</td >`;

                    }
                    if (columns[j].isDtParameter) {
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];

                            if (columns[j].editable) {

                                str += `<td id="col_${rowno}_${colno}">`;
                                if (columns[j].inputType == "select") {

                                    str += `<select class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})"  disabled>`;

                                    if (columns[j].pleaseChoose)
                                        str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs.length;

                                    for (var h = 0; h < lenInput; h++) {
                                        var input = columns[j].inputs[h];
                                        if (value != +input.value) {
                                            str += `<option value="${input.id}">${input.name}</option>`;
                                        }
                                        else {
                                            str += `<option value="${input.id}" selected>${input.name}</option>`;
                                        }
                                    }
                                    str += "</select>";
                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control persian-date" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control persian-datepicker" data-inputmask="${columns[j].inputMask.mask}" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" placeholder="____/__/__" required maxlength="10" autocomplete="off" disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
                                            <input onchange="funkyradio_onchange(this)" type="checkbox" name="checkbox" id="btn_${rowno}_${colno}" ${value ? "checked" : ""} />
                                        </div>`;
                                }

                                else if (columns[j].inputType == "number")
                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else if (columns[j].inputType == "money-decimal")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;
                                else
                                    str += `<input type="text" value="${value}" class="form-control" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" onfocus="tr_onfocus('${pageId}',${colno})" ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} autocomplete="off" disabled>`;

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}">`;

                                if (columns[j].inputType == "number")
                                    str += `<input type="text" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                else if (columns[j].inputType == "money-decimal")
                                    str += `<input type="text" value="${value != 0 ? transformNumbers.toComma(value) : ""}" class="form-control money-decimal" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                else if (columns[j].inputType == "decimal")
                                    str += `<input type="text" value="${value != 0 ? value.toString() : ""}" class="form-control decimal" ${columns[j].inputMask != null ? `data-inputmask="${columns[j].inputMask.mask}"` : ""} onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                else
                                    str += `<input type="text" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;

                                str += "</td>"
                            }
                            else {
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td></td>`;
                                    }
                                }
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td></td>`;
                                    }
                                }
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {
                                    if (value != null && value != "") {
                                        if (value && columns[j].isCommaSep)
                                            value = transformNumbers.toComma(value)
                                        if (columns[j].type === 5) {
                                            value = value.toString()
                                        }
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td ></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value == true)
                                        value = '<i class="fas fa-check"></i>';
                                    else
                                        value = '<i></i>';
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '">' + value + '</td>';
                                }
                                else if (columns[j].type == 21) {
                                    value = '<a href="javascript:showpicture(' + item[columns[j].id] + ');"><img src="data:image/png;base64,' + value + '" alt="" height="35"></a>'
                                    str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '">' + value + '</td>';
                                }
                                else {
                                    if (value != null && value != "")
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="' + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value + '</td>';
                                    else
                                        str += `<td style="width:${colwidth}%"></td>`;
                                }
                            }
                        }
                        else {

                            if (result.columns.actionType === "dropdown") {
                                str += `<td>`;
                                str += `<div class="dropdown">
                                    <button class="btn blue_outline_1 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">عملیات</button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
                                for (var k in buttons) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        if (btn.isDetailBtn == true) {
                                            str += `<button id="btn_${btn.name}${rowno}" onclick="run_header_line_Detail('${btn.listUrl}','${btn.getRecordUrl}','${btn.insUpUrl}','${btn.deleteUrl}',this)" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                        }
                                        else
                                            str += `<button id="btn_${btn.name}${rowno}" onclick="run_header_line_row_${btn.name}('${pageId}',${rowno})" class="dropdown-item" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
                                    }
                                    else
                                        str += `<div class="button-seprator-hor"></div>`;
                                }

                                str += `</div>
                                </div>`;
                                str += '</td>';
                            }
                            else if (result.columns.actionType === "inline") {

                                str += `<td>`;

                                for (var k in buttons) {
                                    var btn = buttons[k];
                                    if (btn.isSeparator == false) {
                                        btn_tbidx++;
                                        if (btn.isDetailBtn)
                                            str += `<button id="btn_${btn.name}${rowno}" onclick="run_header_line_Detail('${btn.listUrl}','${btn.getRecordUrl}','${btn.insUpUrl}','${btn.deleteUrl}',this)" class="${btn.className}" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
                                        else
                                            str += `<button  type="button" id="btn_${btn.name}${rowno}" onclick="run_header_line_row_${btn.name}('${pageId}',${rowno})" class="${btn.className}" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName}"></i></button>`;
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
        str += "<tr style=\"background-color:#f1f1f1\" >";

        if (list.length !== 0) {
            var sumColSpan = 0;
            var firstHasValue = false;
            var afterFirstHasValue = false;
            for (var cl in columns) {

                colwidth = columns[cl].width;
                if (cl == 0) {
                    str += `<td id="totalSum" class="text-center">جمع</td>`;
                }
                else if (columns[cl].isDtParameter == true) {
                    if (columns[cl].hasSumValue == true) {
                        var value = item[columns[cl].id];
                        str += `<td class="total-amount">${transformNumbers.toComma(columns[cl].sumValue)}</td>`;
                        firstHasValue = true;
                        afterFirstHasValue = true;
                    }
                    else if (!firstHasValue) {
                        sumColSpan += 1;
                        //str += `<td></td>`;
                    }
                    else if (afterFirstHasValue = true) {
                        str += `<td></td>`;
                    }
                }

            }
            str += `<td></td>`;
        }
        str += "</tr>";
        str += '</tbody>';

        elm_pbody.append(str);
        $("#totalSum").attr("colspan", sumColSpan);

        var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;
        var pagetable_laststate = arr_headerLinePagetables[index].pagetable_laststate

        if (!checkResponse(pagetable_laststate)) {
            pagetable_laststate = ""
        }

        if (pagetable_laststate == "" && pagetable_currentrow != 0) {
            var elm_pbody_row = elm_pbody.find(`tbody >  #row${pagetable_currentrow}`)
            if (elm_pbody_row[0] == undefined) {
                pagetable_currentrow = 1;
                arr_headerLinePagetables[index].currentrow = pagetable_currentrow;
            }

            elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).addClass("highlight");
            elm_pbody.find(`tbody >  #row${pagetable_currentrow}`).focus();

        }
        else if (pagetable_laststate == "" || pagetable_laststate == "nextpage") {
            pagetable_currentrow = 1;
            arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

            elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
            elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
        }
        else if (pagetable_laststate == "prevpage") {

            pagetable_currentrow = +elm_pbody.find("tbody > tr:last").attr("id").replace(/row/g, "");
            arr_headerLinePagetables[index].currentrow = pagetable_currentrow;

            elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");
            elm_pbody.find(`tbody > #row${pagetable_currentrow}`).focus();
        }

        pagetable_laststate = "";

        if (callback != undefined)
            callback();
    });

}

function sortingButtonsByThHeaderLine(has, elm, pg_name) {
    if (has) {
        var data = $(elm).data();
        dataOrder = { colId: "", sort: "", index: 0 };
        var sort = data.sort == "desc" ? "asc" : "desc";
        dataOrder = { colId: data.colid, sort: sort, index: data.index };
        $("i").removeClass("active-sortIcon");
        getPagetable_HeaderLine(pg_name);
    }
}

function tr_object_oninput(ev, elm) {
}

function fill_filter_itemPageTable(columns) {

    if (!columns.hasFilter)
        return;


    var list = columns.dataColumns;
    var str = '<div>';
    var filterLength = list.length;
    for (var i = 0; i < filterLength; i++) {
        var item = list[i];
        if (item.isFilterParameter) {
            str += `<button id="filter_${item.id}" class="dropdown-item" data-input="${item.filterType}" data-api="${item.filterTypeApi}" onclick="
                        javascript:pagetable_change_filteritemHeaderLine('${item.id}','${item.title}','${item.type}','${item.size}','${pg_name}',this)">
                        ${item.title}</button>`;
        }
    }

    str += "</div>";

    $(`#${pg_name} .filteritems`).html(str);
}

$("#headeUpdateModal").on("shown.bs.modal", function () {
    let firstInput = $(`#headeUpdateModal .modal-body`).find("[tabindex]:not(:disabled)").first();
    setTimeout(() => {
        if ($(firstInput).hasClass("select2") || $(firstInput).hasClass("select2-hidden-accessible"))
            $(firstInput).select2("focus");
        else
            $(firstInput).focus();
    }, 100);
});

function pagetable_change_filteritemHeaderLine(itemid, title, type, size, pg_name, elmDrop = null) {

    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);

    let elm = $(`#${pg_name} .btnfilter`);
    elm.text(title);
    elm.attr("data-id", itemid);
    elm.attr("data-type", type);
    elm.attr("data-size", size);
    arr_headerLinePagetables[index].filteritem = itemid;

    let elm_v = $(`#${pg_name} .filtervalue`);
    elm_v.val("");

    if (elmDrop == null) {

        resetFilterInputHeaderLine(elm_v.parents(".app-search"), pg_name);
        arr_headerLinePagetables[index].filtervalue = "";

        if (itemid.toLowerCase().indexOf("date") >= 0)
            elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
        else
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir");

    }
    else {
        let type = $(elmDrop).data("input"),
            api = $(elmDrop).data("api"),
            parentfilterVal = elm_v.parents(".app-search"),
            outPut = "";


        if (!elm_v.hasClass("select2") && !elm_v.hasClass("double-input"))
            elm_v.inputmask("remove").attr("placeholder", "عبارت فیلتر").removeAttr("dir").attr("class", "form-control filtervalue");
        else
            resetFilterInputHeaderLine(parentfilterVal, pg_name);


        switch (type) {
            case "text":
                elm_v.addClass("text-filter-value");
            case "number":
            case "money":
            case "decimal":
                elm_v.addClass(type);
                break;

            case "strnumber":
                elm_v.addClass("str-number");
                break;

            case "persiandate":
                elm_v.inputmask({ "mask": "9999/99/99" }).attr("placeholder", "____/__/__").attr("dir", "ltr");
                break;

            case "doublepersiandate":
                //elm_v.inputmask("9999/99/99     9999/99/99", {
                //    "placeholder": "(از)" + "/__/__     " + "(تا)" + "/__/__"
                //}).attr("dir", "ltr");
                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `
                    <div class="double-input-box">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressHeaderLine(event, 'next')" oninput="filtervalue_onInputHeaderLine(event, this)"   data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                        <input type="text" class="form-control filtervalue double-input" onkeypress="filtervalue_onkeypressHeaderLine(event, this)" oninput="filtervalue_onInputHeaderLine(event, this)"  data-inputmask="'mask':'9999/99/99'" placeholder="عبارت فیلتر" autocomplete="off">
                            <a onclick="filtervalue_onsearchclickHeaderLine(this)"><i class="fa fa-search"></i></a>
                    <div>`;

                $(parentfilterVal).html(outPut);
                $(`#${pg_name} .filtervalue`).inputmask();
                $(`#${pg_name} .filtervalue.double-input:eq(0)`).focus();
                break;

            case "select2":

                $(parentfilterVal).find(".filtervalue").remove();
                outPut = `<select id="filterValueSelect2" class="form-control select2 filtervalue" onChange="filtervalue_onChangeHeaderLine(this)"></select>`;
                $(parentfilterVal).html(outPut);
                fill_select2(api, `${pg_name} #filterValueSelect2`, true, 0, false, 0, "انتخاب کنید", () => { $(`#filterValueSelect2`).select2(); });

                break;

            default:
                break;
        }

    }

    if (itemid === "filter-non") {
        resetFilterInputHeaderLine(elm_v.parents(".app-search"), pg_name);
        arr_headerLinePagetables[index].filtervalue = null;
        InitFormLine();
    }
    else {
        $(`#${pg_name} .btnOpenFilter`).addClass('d-none');
        $(`#${pg_name} .btnRemoveFilter`).removeClass('d-none');
        elm_v.focus();
    }
}

function filtervalue_onkeypressHeaderLine(e, fltvalue) {

    if (e.which == 13) {
        if ($(fltvalue).hasClass("text-filter-value") && $(fltvalue).val().length < 3) {
            alertify.error('حداقل سه حرف وارد کنید').delay(alertify_delay);
            return false;
        }

        if (fltvalue == "next") {
            $(e.currentTarget).next().val(e.currentTarget.value).focus();
            return;
        }
        e.preventDefault();

        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_headerLinePagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();

        InitFormLine();
    }
}

function filtervalue_onInputHeaderLine(e, fltvalue) {

    if (e.which != 13) {
        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_headerLinePagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
    }
}

function filtervalue_onChangeHeaderLine(fltvalue) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_headerLinePagetables[index].filtervalue = $(fltvalue).val();
    if (+$(fltvalue).val() !== 0)
        InitFormLine();
}

function filtervalue_onsearchclickHeaderLine(elm_search) {
    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_headerLinePagetables[index].filtervalue = $(elm_search).prev("input").hasClass("double-input") ? genarateValueFilter($(elm_search).prev("input")) : $(elm_search).prev("input").val();
    InitFormLine();
}

function genarateValueFilter(element) {
    return $(element).val() + "     " + $(element).prev(".double-input").val();
}

function resetFilterInputHeaderLine(parentfilterVal, pg_name) {
    let outPut = "";
    $(parentfilterVal).find(".filtervalue").remove();
    outPut = `
                    <input type="text" class="form-control filtervalue" onkeypress="filtervalue_onkeypressHeaderLine(event, this)" oninput="filtervalue_onInputHeaderLine(event, this)" placeholder="عبارت فیلتر" autocomplete="off">
                      <a onclick="filtervalue_onsearchclickHeaderLine(this)"><i class="fa fa-search"></i></a>
                                `
    $(parentfilterVal).html(outPut);
    elm_v = $(`#${pg_name} .filtervalue`);

};

function tr_onfocus(pg_name, colno) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    arr_headerLinePagetables[index].currentcol = colno;
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var currentrow = arr_headerLinePagetables[index].currentrow;
    var trediting = arr_headerLinePagetables[index].trediting;

    if (trediting) {
        var elm = $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_${colno}`).find("input:first,select:first,div.funkyradio:first");
        if (!elm.hasClass("funkyradio"))
            elm.select();
    }
}

function tr_object_onchange(pageId, elem, rowno, colno) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var columns = arr_headerLinePagetables[index].columns;
    var column = null;
    var colId = "";
    var elemId = $(elem).attr("id");
    if (elemId != undefined) {
        colId = $(elem).attr("id").split("_")[0];
        column = columns.dataColumns.filter(a => a.id == colId)[0];
    }
    //#region select2 config
    if (column != undefined && column != null && column.isSelect2) {
        if ($(elem).val() != null && $(elem).val() != undefined && +$(elem).val() != 0)
            $(elem).data("value", $(elem).val());
        var title = $(`#select2-${elemId}-container`).attr("title");
        if (title != undefined)
            $(`#col_${rowno}_${colno} div`).first().html(title);
        if (column.fillColumnInputSelectIds != null) {
            var fillColumnInputSelectIds = column.fillColumnInputSelectIds;
            for (var i = 0; i < fillColumnInputSelectIds.length; i++) {
                var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
                var columns = arr_headerLinePagetables[index].columns;
                var changeItemCol = columns.filter(a => a.id == fillColumnInputSelectIds[i])[0];

                var getInputSelectConfig = changeItemCol.getInputSelectConfig;
                if (changeItemCol.isSelect2 && getInputSelectConfig != null) {
                    var elemId = `${changeItemCol.id}_${rowno}`;
                    //$(`#${elemId}`).data("value", 0);
                    var params = "";
                    var parameterItems = getInputSelectConfig.parameters;
                    if (parameterItems.length > 0) {
                        for (var i = 0; i < parameterItems.length; i++) {
                            var paramItem = parameterItems[i].id;
                            if (parameterItems[i].inlineType)
                                params += $(`#${pageId} #${paramItem}_${rowno}`).val();
                            else
                                params += $(`#${paramItem}`).val();

                            if (i < parameterItems.length - 1)
                                params += "/";
                        }
                    }
                    $(`#${pageId} #${elemId}`).html("");

                    if (changeItemCol.pleaseChoose)
                        $(`#${pageId} #${elemId}`).append("<option value='0'>انتخاب کنید</option>");

                    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {

                        fill_select2(getInputSelectConfig.fillUrl, `${pageId} #${elemId}`, true, params, false, 0, 'انتخاب', function () {
                            $(`#${pageId} #${elemId}`).trigger("change");
                        });
                    }
                }
            }
        }
    }
    //#endregion

}
