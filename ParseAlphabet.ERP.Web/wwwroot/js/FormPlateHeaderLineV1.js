var activePageId = "",
    isAfterSave = false,
    callBackHeaderFillFunc = undefined, callbackBeforeHeaderFillFunc = undefined, callbackBeforeLineFillFunc = undefined, callbackLineFillFunc = undefined,
    conditionTools = [], conditionAnswer = "", conditionElseAnswer = "",
    dataOrder = { colId: "", sort: "", index: 0 }, scrolls = { current: 0, prev: 0 },
    listForCondition = {}, isFormLoaded = true, headerFirstElemId = "", stageStepConfig = [],
    isDefaultActivateBtn = false, headerPagination = 0, headerFieldsKey = [], lineFieldsKey = [],
    headerNavigationConfigs = [], call_initform = undefined, additionalData = []
    getRecordParameterFinalizeFunc = undefined, lastPageHeaderloaded = 0,
    //changeFromFillPageTable = false;
    formPlateHeaderLine_PageRowsCount = 15, allowTrigger = true,
    configLineElementPrivilage = undefined;

function display_pagination(oprId) {

    $("#headerIndex").val("");
    headerPagination = oprId;
    //first=1
    //previous=2
    //next=3
    //last=4

    call_initform(oprId)
}

async function loadingAsync(loading, elementId) {

    if (loading)
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
    else
        $(`#${elementId} i`).removeClass("fa fa-spinner fa-spin").addClass("fa fa-save")
}

function InitForm(
    pageId, hasHeaderNav,
    callBackHeaderFill = undefined, callBackBeforeHeaderFill = undefined,
    callBackLineFill = undefined, callBackBeforeLineFill = undefined,
    getRecordParameterFinalize = undefined) {

    activePageId = pageId;

    // call before fill Header Table info
    if (callBackBeforeHeaderFill != undefined)
        callbackBeforeHeaderFillFunc;

    // call after fill Header Table info
    if (callBackHeaderFill != undefined)
        callBackHeaderFillFunc = callBackHeaderFill;

    // call before fill line Table info
    if (callBackBeforeLineFill !== undefined)
        callbackBeforeLineFillFunc = callBackBeforeLineFill;

    // call after fill line Table info
    if (callBackLineFill !== undefined)
        callbackLineFillFunc = callBackLineFill;

    if (getRecordParameterFinalize != undefined)
        getRecordParameterFinalizeFunc = getRecordParameterFinalize;

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

            if (callbackBeforeHeaderFillFunc != undefined)
                callbackBeforeHeaderFillFunc();

            showHeader(result);

            $(`#${activePageId} #header-div-content`).css("opacity", 1);

            if (callBackHeaderFillFunc != undefined)
                callBackHeaderFillFunc();

            if (headerPagination > 0) {
                headerLine_formkeyvalue[0] = +$(`#${activePageId} #formPlateHeaderTBody`).data("id");
                updateAdditionalData();
            }

            var headerLineData = result.data[arr_headerLinePagetables[0].pagetable_id];

            if (headerLineData != null && headerLineData.headerColumns != null && headerLineData.columns.headerType == "outline") {
                var lineFields = headerLineData.headerColumns.stageStepConfig.lineFields;

                if (lineFields != null && lineFields.length > 0) {

                    var lineFieldsLen = lineFields.length;

                    for (var i = 0; i < lineFieldsLen; i++) {

                        let currentLineField = lineFields[i];

                        var dataColumn = headerLineData.headerColumns.dataColumns.find(a => a.id == currentLineField.fieldId)[0];

                        if (dataColumn != undefined)
                            dataColumn.notResetInHeader = true;
                    }
                }

                addElementLine(arr_headerLinePagetables[0].pagetable_id, headerLineData);
            }

            if (callbackBeforeLineFillFunc != undefined)
                callbackBeforeLineFillFunc();
            else
                showHeaderLines(arr_headerLinePagetables[0], result);

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function InitFormLine() {
    showHeaderLines(arr_headerLinePagetables[0], null);
}

function appendNavPageButton(pgId, hasHeaderNav) {
    if ($(`#${pgId} #header-div .button-items #headerFirst`).length == 0 && hasHeaderNav) {
        $(`#${pgId} #header-div .button-items`).append(`<button title="اولین" id="headerFirst" onclick="display_pagination(1)" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-next"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="قبلی"  id="headerPrevious" onclick="display_pagination(2)" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<input id="headerIndex" onkeydown="headerindexChoose(event)" type="text" autocomplete="off" class="form-control number col-1 d-inline mr-2 ml-1" maxlength="10" placeholder="شناسه برگه"/>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="بعدی"  id="headerNext" onclick="display_pagination(3)" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-play fa-rotate-180"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="آخرین" id="headerLast" onclick="display_pagination(4)" type="button" class="header-pagination-btn btn btn-info waves-effect"><i class="mdi mdi-skip-previous"></i></button>`);
        $(`#${pgId} #header-div .button-items`).append(`<button title="چاپ" id="headerLast" onclick="printFromPlateHeaderLine()" type="button" class="btn btn-print waves-effect"><i class="fa fa-print"></i>چاپ</button>`);
    }
}

function headerindexChoose(e) {
}

function printFromPlateHeaderLine() {
}

function updateAdditionalData() {
}

function showHeader(result) {

    var headerDiv = $(`#${activePageId} #header-div-content`);
    headerDiv.html("");
    var headerMainDiv = `<fieldset class='group-box mt-3 ${result.columns.classes != null ? result.columns.classes : ""}'>
                                <legend>${result.columns.title}</legend>
                         </fieldset>`;

    headerDiv.append(headerMainDiv);

    var columns = result.columns.dataColumns;
    var buttons = result.columns.buttons;
    var btn_tbidx = 1000;
    var item = result.data;

    var primaries = "";

    $(`#${activePageId} #headeUpdateModal .modal-body .row`).html("");

    var isPrimaries = columns !== null ? columns.filter(x => x.isPrimary) : [];

    let primaryLen = isPrimaries !== null ? isPrimaries.length : 0;

    for (var i = 0; i < primaryLen; i++) {

        var primary = isPrimaries[i];

        primaries += ' data-' + primary["id"] + '="' + item[primary["id"]] + '"';
    }

    var seccoundClass = "plateheader-editmode";

    $(`#${activePageId} #header-div-content fieldset`).append(`
                                                               <div style="padding: .5rem 0.5rem;">
                                                                    <div class="table-responsive">
                                                                         <table class="table mb-0">
                                                                            <thead>
                                                                                   <tr id="formPlateHeaderTHead"></tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                   <tr class="PlateHeader-Body ${seccoundClass}" id="formPlateHeaderTBody" ${primaries}></tr>
                                                                            </tbody>
                                                                         </table>
                                                                    </div>
                                                               </div>`);

    var columnLength = columns.length;

    for (var j = 0; j < columnLength; j++) {

        var colwidth = columns[j].width;
        var value = item[columns[j].id];

        if (columns[j].isDtParameter) {
            if (columns[j].id != "action") {

                var itemheaderThead = `<th style="width:${colwidth}%">${columns[j].title}</th>`;
                $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTHead`).append(itemheaderThead);

                var value = item[columns[j].id] === null ? "" : item[columns[j].id];

                var itemheader = "";

                if (columns[j].hasLink && value != "0" && value != "" && value != null)
                    itemheader = `<td style="width:${colwidth}%"><span onclick="click_link_header(this)" data-id="${columns[j].id}" class="itemLink">${value}</span></td>`;
                else
                    itemheader = `<td style="width:${colwidth}%">${value}</td>`;

                $(itemheader).appendTo(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`);
            }
            else {

                $(`#${activePageId} #header-div-content #formPlateHeaderTHead`).append(`<th style="width:${colwidth}%">${columns[j].title}</th>`);

                var buttonsLen = buttons.length;

                for (var k = 0; k < buttonsLen; k++) {
                    var btn = buttons[k];
                    if (!btn.isSeparator) {
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="width:${colwidth}%"><button type="button" id="btn_${btn.name}" onclick="run_button_${btn.name}()" class="${btn.className}" tabindex="${btn_tbidx}"><i class="${btn.iconName}" style="float: initial;padding: 0;"></i></button></td>`);
                        btn_tbidx++;
                    }
                    else
                        $(`#${activePageId} #header-div-content fieldset #formPlateHeaderTBody`).append(`<td class="text-center" style="width:${colwidth}%"><span class="button-seprator-ver"></span></td>`);
                }
            }
        }
    }
}

function addElementLine(pageId, result) {
    //changeFromFillPageTable = true;

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
        $(`#${activePageId} #${pageId}`).prepend(`<div class='ins-out' id="outLineElement" tabindex="-1"><div class='row' data-parsley-validate></div></div>`);


        getKeyLineElement(result.headerColumns.stageStepConfig);

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

                    let elementKey = "";

                    if (lineFieldsKey.findIndex(x => x.toLowerCase() === headerColumns[j].id.toLowerCase()) > -1) {
                        elementKey = "elementKey";
                    }

                    var itemheader = `<div class="form-group ${elementKey} col-sm-${headerColumns[j].width}"><label>${headerColumns[j].title}</label><div>`;

                    if (headerColumns[j].inputType == "select") {

                        itemheader += `<select 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                class="form-control element-line ${headerColumns[j].isSelect2 ? "select2" : ""}" id="${headerColumns[j].id}"
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true" data-notReset="true"' : ''}
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="object_onblur(this)"
                                                onfocus="tr_object_onfocus(this)"
                                                disabled>`;

                        if (headerColumns[j].pleaseChoose)
                            itemheader += `<option value="0">انتخاب کنید</option>`;

                        var lenInput = headerColumns[j].inputs == null ? 0 : headerColumns[j].inputs.length;

                        if (lenInput !== 0) {
                            for (var h = 0; h < lenInput; h++) {

                                var input = headerColumns[j].inputs[h];

                                itemheader += `<option value="${input.id}" ${h !== 0 ? "" : "selected"}>${input.id} - ${input.name}</option>`;
                            }

                            itemheader += "</select></div>";

                            if (validators != "") {
                                itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                            }

                            itemheader += "</div>";

                            $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                            if (headerColumns[j].isSelect2) {

                                if (headerColumns[j].editable && !firstElemFocus)
                                    firstElemFocus = true;

                                $(`#${activePageId} #${headerColumns[j].id}`).select2();
                            }
                        }
                        else if (checkResponse(headerColumns[j].getInputSelectConfig)) {

                            var getInputSelectConfig = headerColumns[j].getInputSelectConfig;
                            var elemId = headerColumns[j].id;
                            var params = "";
                            var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;

                            if (parameterItems.length > 0) {
                                for (var p = 0; p < parameterItems.length; p++) {
                                    var paramItem = parameterItems[p].id;
                                    if (parameterItems[p].inlineType)
                                        params += $(`#${activePageId} #${paramItem}_${rowno}`).val();
                                    else
                                        params += $(`#${activePageId} #${paramItem}`).val();

                                    if (p < parameterItems.length - 1)
                                        params += "/";
                                }
                            }

                            itemheader += "</select></div>";

                            if (validators != "") {
                                itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                            }

                            itemheader += "</div>";

                            $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                            if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {

                                fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, `انتخاب ${headerColumns[j].title}`, undefined, "", false, false, false, false, false);
                            }
                        }

                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "datepersian") {
                        itemheader += `<input 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                tabindex="${btn_tbidx}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                class="form-control persian-date element-line"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})" 
                                                onfocus="tr_object_onfocus(this)"
                                                placeholder="____/__/__"
                                                maxlength="10"
                                                autocomplete="off"
                                                disabled />
                                       </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable /*&& !firstElemFocus*/) {

                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "datepicker") {
                        itemheader += `<input 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""}
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                class="form-control persian-datepicker element-line"
                                                tabindex="${btn_tbidx}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''}
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''}
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                placeholder="____/__/__"
                                                maxlength="10"
                                                autocomplete="off"
                                                disabled />
                                       </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();


                        if (headerColumns[j].editable) {

                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "checkbox") {

                        itemheader += `<div 
                                                class="funkyradio funkyradio-success element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')"
                                                onkeydown="funkyradio_keydown(event,'${headerColumns[j].id}')"
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                oninput="tr_object_oninput(event,this)">
                                                tabindex="${btn_tbidx}"
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''}
                                                disabled >`


                        itemheader += `<input 
                                                onchange="funkyradio_onchange(this)"
                                                switch-value=${headerColumns[j].switchValue !== "" && headerColumns[j].switchValue !== null ? headerColumns[j].switchValue : "خیر,بلی"}
                                                type="checkbox"
                                                class="element-line" 
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} disabled />

                                       </div>`;


                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "number") {

                        itemheader += `
                                        <input
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                class="form-control number element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')"  
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''}
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }

                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "strnumber") {

                        itemheader += `
                                        <input
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                class="form-control str-number element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')"  
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''}
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }

                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "money") {

                        itemheader += `
                                        <input
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                class="form-control money element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} 
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "money-decimal") {

                        itemheader += `
                                        <input
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                class="form-control money-decimal element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} 
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${activePageId} #${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }
                        btn_tbidx++;
                    }
                    else if (headerColumns[j].inputType == "decimal") {

                        itemheader += `
                                        <input
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""}
                                                type="text"
                                                id="${headerColumns[j].id}" 
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''}
                                                tabindex="${btn_tbidx}" 
                                                class="form-control decimal element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')"
                                                data-inputmask='${headerColumns[j].inputMask != null ? headerColumns[j].inputMask.mask : ""}'
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput = "tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''}
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();

                        if (headerColumns[j].editable && !firstElemFocus) {
                            $(`#${headerColumns[j].id}`).focus();
                            firstElemFocus = true;
                        }

                        btn_tbidx++;
                    }
                    else {

                        itemheader += `
                                        <input
                                                ${validators}
                                                ${validators != "" ? "data-parsley-errors-container='#" + headerColumns[j].id + "ErrorContainer'" : ""} 
                                                type="text"
                                                id="${headerColumns[j].id}"
                                                ${headerColumns[j].headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${headerColumns[j].notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                class="form-control element-line"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno},${rowno})"
                                                onfocus="tr_object_onfocus(this)"
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                ${headerColumns[j].inputMask !== null ? "datainputmask='" + headerColumns[j].inputMask.mask + "'" : ""}
                                                ${headerColumns[j].maxLength != 0 ? 'maxlength="' + headerColumns[j].maxLength + '"' : ''} 
                                                autocomplete="off"
                                                disabled />
                                        </div>`;

                        if (validators != "") {
                            itemheader += `<div id="${headerColumns[j].id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (headerColumns[j].inputMask !== null)
                            $(`#${activePageId} #${headerColumns[j].id}`).inputmask();


                        btn_tbidx++;
                    }
                }
            }
        }

        for (var k in headerButtons) {
            var btn = headerButtons[k];

            $(`#${activePageId} #${pageId} .ins-out`).append(`<button type="button" id="${btn.name}" onclick="headerLineIns('${pageId}')" class="${btn.className} float-left waves-effect" tabindex="${btn_tbidx}" disabled>${btn.title}</button>`);
            btn_tbidx++;
        }

        $(`#${activePageId} #${pageId} .ins-out`).append(`<button type="button" id="haederLineActive" data-toggle="tooltip" data-placement="top" data-disabled="false" onclick="headerLineActive('${pageId}')" class="btn ml-2 pa float-sm-left waves-effect">فعال سازی</button>`);
    }

    funkyradio_switchvalue();

    if (headerColumns.findIndex(x => x.inputType == "datepicker") > -1) {
        $.each($(`#${activePageId} #${pageId} #outLineElement .persian-datepicker`), function (key, val) {
            kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
        });
    }

    //changeFromFillPageTable = false;
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

function showHeaderAfterUpd(result) {

    let btn_tbidx = 1000;
    let item = result.data;
    let colwidth = 0;
    let firstElemFocus = false;
    let itemheader = "";

    showHeader(result);

    let columns = result.columns.dataColumns;
    columns = columns.sort((a, b) => (a.inputOrder > b.inputOrder) ? 1 : -1);
    let columnLen = checkResponse(columns) ? columns.length : 0;


    for (var j = 0; j < columnLen; j++) {

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

            if (columns[j].inputType == "select") {

                var lenInput = columns[j].inputs !== null ? columns[j].inputs.length : 0;

                if (columns[j].fillType === "back") {

                    if (lenInput !== 0) {

                        itemheader += `<select 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly ? 'disabled' : ''} 
                                                tabindex="${btn_tbidx}" 
                                                data-val="${value}" 
                                                class="form-control"
                                                id="${columns[j].id}" 
                                                onchange="public_object_onchange(this)"
                                                onblur="object_onblur(this)"
                                                onfocus="object_onfocus(this)"`;

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
                        itemheader += `<select 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly ? 'disabled' : ''}  
                                                tabindex="${btn_tbidx}" 
                                                data-val="${value}" 
                                                class="form-control"
                                                id="${columns[j].id}" 
                                                onchange="public_object_onchange(this)"
                                                onblur="object_onblur(this)"
                                                onfocus="object_onfocus(this)"`;
                        itemheader += ">";

                        itemheader += "</select>";
                        if (validators != "")
                            itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                        $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                        if (typeof columns[j].select2Title !== typeof undefined && columns[j].select2Title !== "") {

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

                            if (typeof item[columns[j].select2Title] !== typeof undefined && item[columns[j].select2Title] !== "") {
                                var newOption = new Option(`${value} - ${item[columns[j].select2Title]}`, value, true, true);
                                $(`#${columns[j].id}`).append(newOption).trigger('change');
                            }
                        }
                    }
                }
                else if (columns[j].fillType === "front") {
                    itemheader += `<select 
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} ${columns[j].isReadOnly ? 'disabled' : ''}  
                                            tabindex="${btn_tbidx}" 
                                            data-val="${value}" 
                                            value="${value === null ? "" : value}" 
                                            class="form-control" id="${columns[j].id}" 
                                            onchange="public_object_onchange(this)"
                                            onblur="object_onblur(this)"
                                            onfocus="object_onfocus(this)"`;

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
                itemheader += `<input 
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''}  
                                        tabindex="${btn_tbidx}" 
                                        type="text"
                                        id="${columns[j].id}" 
                                        value="${value != 0 ? value : ""}" 
                                        class="form-control persian-date"
                                        data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                        onchange="public_object_onchange(this)"
                                        onblur="object_onblur(this)"
                                        onfocus="object_onfocus(this)"
                                        placeholder="____/__/__"
                                        required maxlength="10"
                                        autocomplete="off"`;

                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");



                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "datepicker") {

                itemheader += `<div>
                                     <input
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                            ${columns[j].isReadOnly ? 'disabled' : ''}  
                                            tabindex="${btn_tbidx}" 
                                            type="text"
                                            id="${columns[j].id}" 
                                            value="${value != 0 ? value : ""}" 
                                            class="form-control persian-datepicker"
                                            data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                            onchange="public_object_onchange(this)"
                                            onblur="object_onblur(this)"
                                            onfocus="object_onfocus(this)"
                                            placeholder="____/__/__"
                                            required
                                            maxlength="10"
                                            autocomplete="off"`;

                itemheader += "/>";
                itemheader += "</div>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");


                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {

                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else if (columns[j].inputType == "checkbox") {

                itemheader += `<div 
                                    ${columns[j].isReadOnly ? 'disabled' : ''}  
                                    tabindex="${btn_tbidx}" 
                                    class="funkyradio funkyradio-success"
                                    onkeydown="funkyradio_keydown(event,'${columns[j].id}')" >`;

                itemheader += `<input 
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''} type="checkbox" id="${columns[j].id}" 
                                        onchange="funkyradio_onchange(this)"
                                        switch-value="غیر فعال,فعال"
                                        ${value ? "checked" : ""}  
                                        ${!columns[j].editable ? "disabled" : ""} />

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

                itemheader += `<input
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''}  
                                        tabindex="${btn_tbidx}" 
                                        type="text"
                                        id="${columns[j].id}" 
                                        value="${value != 0 ? value : ""}" 
                                        class="form-control number"
                                        data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                        onchange="public_object_onchange(this)"
                                        onblur="object_onblur(this)"
                                        onfocus="object_onfocus(this)"
                                        ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                        autocomplete="off"`;

                itemheader += "/>";
                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "strnumber") {

                itemheader += `<input
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''}  
                                        tabindex="${btn_tbidx}" 
                                        type="text"
                                        id="${columns[j].id}" 
                                        value="${value != 0 ? value : ""}" 
                                        class="form-control str-number"
                                        data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                        onchange="public_object_onchange(this)"
                                        onblur="object_onblur(this)"
                                        onfocus="object_onfocus(this)"
                                        ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                        autocomplete="off"`;

                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "money") {
                itemheader += `<input 
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''}  
                                        tabindex="${btn_tbidx}" 
                                        type="text"
                                        id="${columns[j].id}" 
                                        value="${value != 0 ? transformNumbers.toComma(value) : ""}" 
                                        class="form-control money"
                                        data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                        onchange="public_object_onchange(this)"
                                        onblur="public_object_onblur(this)"
                                        onfocus="object_onfocus(this)"
                                        ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                        autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "money-decimal") {
                itemheader += `<input 
                                        ${validators} 
                                        ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                        ${columns[j].isReadOnly ? 'disabled' : ''}  
                                        tabindex="${btn_tbidx}" 
                                        type="text"
                                        id="${columns[j].id}" 
                                        value="${value != 0 ? transformNumbers.toComma(value) : ""}" 
                                        class="form-control money-decimal"
                                        data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                        onchange="public_object_onchange(this)"
                                        onblur="public_object_onblur(this)"
                                        onfocus="object_onfocus(this)"
                                        ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                        autocomplete="off"`;
                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;
                }

                btn_tbidx++;
            }
            else if (columns[j].inputType == "decimal") {

                itemheader += `<input 
                                       ${validators} 
                                       ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                       ${columns[j].isReadOnly ? 'disabled' : ''} 
                                       tabindex="${btn_tbidx}" 
                                       type="text"
                                       id="${columns[j].id}" 
                                       value="${value != 0 ? value.toString().split('.').join("/") : ""}" 
                                       class="form-control decimal"
                                       data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                       onchange="public_object_onchange(this)"
                                       onblur="object_onblur(this)"
                                       onfocus="object_onfocus(this)"
                                       ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                       autocomplete="off"`;

                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
            else {

                itemheader += `<input 
                                       ${validators} 
                                       ${validators != "" ? "data-parsley-errors-container='#" + columns[j].id + "ErrorContainer'" : ""} 
                                       ${columns[j].isReadOnly ? 'disabled' : ''}  
                                       tabindex="${btn_tbidx}" 
                                       type="text"
                                       id="${columns[j].id}" 
                                       value="${value === null ? "" : value}"
                                       class="form-control"
                                       autocomplete="off"
                                       data-inputmask="${columns[j].inputMask != null ? columns[j].inputMask.mask : ""}"
                                       ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''}
                                       onchange="public_object_onchange(this)"
                                       onblur="object_onblur(this)"
                                       onfocus="object_onfocus(this)"`

                itemheader += "/>";

                if (validators != "")
                    itemheader += `<div id="${columns[j].id}ErrorContainer"></div>`;

                $(itemheader + "</div>").appendTo("#headeUpdateModal .modal-body .row");

                if (columns[j].inputMask != null)
                    $(`#${columns[j].id}`).inputmask();

                if (columns[j].editable && !firstElemFocus) {
                    $(`#${columns[j].id}`).focus();
                    firstElemFocus = true;
                    headerFirstElemId = columns[j].id;

                }
                btn_tbidx++;
            }
        }
    }

    if (columns.findIndex(x => x.inputType == "datepicker") > -1) {
        $.each($("#headeUpdateModal .modal-body .row .persian-datepicker"), function (key, val) {
            kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
        });
    }

    $("#headeUpdateModal .modal-footer #modal-save").attr("tabindex", btn_tbidx);

    funkyradio_switchvalue();

    if (callBackHeaderFillFunc != undefined)
        callBackHeaderFillFunc();

}

function headeUpdateModal_close() {
    modal_close("headeUpdateModal");
}

/**
 دریافت html مربوط به پابرگ
 * @param {any} pageId
 * @param {any} result
 */
function render_formPlateHeaderLineHtml(pageId, result) {

    var headerLineDiv = $(`#${activePageId} #header-lines-div`);

    $(`#${activePageId} #header-lines-div #pageLineListBox`).remove();

    var pageTableMainDiv = `<fieldset id="pageLineListBox" class='group-box mt-3 ${result.columns.classes != null ? result.columns.classes : ""}' tabindex="-2" >
                                <legend>${result.columns.title}</legend>
                                    <div class='card-body' id='${pageId}' tabindex="-1"></div>
                            </fieldset>
                            <div id="header-lines-footer"></div>`;

    headerLineDiv.append(pageTableMainDiv);

    var href = '/PB/Public/pageHeaderLineV1';

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

function tr_object_onfocus(elem) {

    selectText(elem);
}

/**
 * فانکشن مربوط به input header - input Line(mode Input Inline)
 * @event {any} e
 * @this {any} elem
 */
function tr_object_onkeydown(e, elem) {

}

function object_onfocus(elem) {
}

function object_onblur(elem) {
}

async function public_tr_object_onchange(elem, pageId) {

    var elemId = $(elem).attr("id");

    if (typeof local_tr_object_onchange != 'undefined')
        await local_tr_object_onchange(elem, pageId);

    //if (!changeFromFillPageTable) {

    //    //var elemId = $(elem).attr("id");
    //    //var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    //    //var headerColumn = arr_headerLinePagetables[index].headerColumns;
    //    //var column = headerColumn.dataColumns.filter(a => a.id == elemId)[0];

    //    //if ((headerColumn.stageStepConfig == undefined || (headerColumn.stageStepConfig.lineFields.filter(a => a.fieldId == $(elem).attr("id")).length == 0)) && arr_headerLinePagetables[index].stageStepColumns != undefined) {
    //    //    column = arr_headerLinePagetables[index].stageStepColumns.filter(a => a.id == elemId)[0];
    //    //    if (column != undefined) {
    //    //        fill_inputSelectItemsByParent(column, pageId);
    //    //    }
    //    //}
    //}
    //else {
    //    $(elem).data("getStageStepConfigBlocked", false);
    //}


    //    if (!$(elem).data("getStageStepConfigBlocked")) {
    //        await getStageStepConfig(elem, headerColumn, null, pageId, async function () {
    //            if (typeof local_tr_object_onchange != 'undefined')
    //                await local_tr_object_onchange(elem, pageId);

    //            if ((headerColumn.stageStepConfig == undefined || (headerColumn.stageStepConfig.lineFields.filter(a => a.fieldId == $(elem).attr("id")).length == 0)) && arr_headerLinePagetables[index].stageStepColumns != undefined) {
    //                column = arr_headerLinePagetables[index].stageStepColumns.filter(a => a.id == elemId)[0];
    //                if (column != undefined) {
    //                    fill_inputSelectItemsByParent(column, pageId);
    //                }
    //            }

    //        })
    //    }
    //    else {
    //        $(elem).data("getStageStepConfigBlocked", false);

    //    }
    //}
}

function showHeaderLines(arr_pagetables, result) {

    let headerLineData = null;

    if (result !== null)
        headerLineData = result.data[val.pagetable_id];

    getPagetable_HeaderLine(arr_pagetables.pagetable_id, headerLineData);
}

function getPagetable_HeaderLine(pg_id = null, result = null, callBack = undefined, isInsert = false) {

    if (pg_id == null)
        pg_id = "pagetable";
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_headerLinePagetables[index].currentpage = 1;
        arr_headerLinePagetables[index].pageno = 0;
        arr_headerLinePagetables[index].currentrow = 1;
        arr_headerLinePagetables[index].endData = false;
    }

    //pageIdInsUp = pg_id;
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

    if (pagetable_currentpage === 0)
        pagetable_currentpage = 1;

    arr_headerLinePagetables[index].currentpage = pagetable_currentpage;

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
            async: false,
            success: function (result) {
                /*arr_headerLinePagetables[index].result = result;*/

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
        /*        arr_headerLinePagetables[index].result = result;*/
        fill_pagetableHeaderLine(result, pg_id, function () {

            fill_filter_itemsHeaderLine(result.columns, pg_id, function () {
                if (callBack != undefined)
                    callBack();
            });
            (result.totalRecordCount, result.pageStartRow, result.pageEndRow, pg_id);
        }, callbackLineFillFunc, pageViewModel);
    }
}

function fill_pagetableHeaderLine(result, pageId, callback = undefined, callbackAfterFillLine = undefined, pageViewModel) {
    fill_pageTableHeaderLineFunc(result, pageId, callback, callbackAfterFillLine, pageViewModel);
}

function fill_pageTableHeaderLineFunc(result, pageId, callback = undefined, clAfterLine = undefined, pageViewModel) {

    if (!result) return "";
    conditionTools = [];
    conditionAnswer = "";
    conditionElseAnswer = "";
    listForCondition = {};

    let columns = checkResponse(result.columns) ? result.columns.dataColumns : null;
    let columnsLen = checkResponse(columns) ? columns.length : 0;

    let isPrimaryArray = columnsLen !== 0 ? columns.filter(o => o.isPrimary) : [];
    let isPrimaryLen = checkResponse(isPrimaryArray) ? isPrimaryArray.length : 0;
    let buttons = checkResponse(result.columns) ? result.columns.buttons : null;

    let buttoncount = (buttons != null && typeof (buttons) !== "undefined") ? buttons.length : 0;

    let list = result.data;
    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    arr_headerLinePagetables[index].editable = result.columns.isEditable;
    arr_headerLinePagetables[index].columns = result.columns;
    var pagetable_editable = arr_headerLinePagetables[index].editable;
    //var pagetable_hasRowIndex = arr_headerLinePagetables[index].hasRowIndex;
    //var pagetable_selectable = arr_headerLinePagetables[index].selectable;
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

            for (var i in columns) {
                var col = columns[i];
                if (col.isDtParameter) {
                    str += `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                    if (col.order)
                        str += `class="headerSorting" id="header_${i}" data-type="" data-colid="${col.id}" data-index="${i}" onclick="sortingButtonsByThHeaderLine(${col.order},this,'${pageId}')">
                                        <span id="sortIconGroup" class="sortIcon-group">
                                                <i id="desc_Col_${i}" data-colid="${col.id}" data-index="${i}" data-sort="desc" title="مرتب سازی نزولی" class="fa fa-long-arrow-alt-down sortIcon"></i>
                                                <i id="asc_Col_${i}" data-colid="${col.id}" data-index="${i}" data-sort="asc" title="مرتب سازی صعودی" class="fa fa-long-arrow-alt-up sortIcon"></i>
                                        </span>` + col.title + '</th>';
                    else
                        str += '>' + col.title + '</th>';
                }
            }

            str += '</tr>';

            // زمانی که فیلدهای مربوط به dataEntry به صورت inline Table باشد
            // یعنی input داخل هدر جدول می باشد
            if (result.columns.headerType == "inline") {

                str += `<tr class="ins-row" onblur="tr_include_input('${pageId}')" tabindex="-1">`;

                str += "</tr></thead>";
                elm_pbody.append(str);

                str = "";
                var insRowElem = $(`#${activePageId} #${pageId} .pagetablebody tr`).last();

                for (var i = 0; i < columnsLen; i++) {

                    var col = columns[i];

                    let onBlurFunc = `tr_object_onblur('${pageId}',this,0,0,event)`;
                    let onChangeFunc = `public_tr_object_onchange(this,'${pageId}')`;
                    let onFocusFunc = `tr_object_onfocus(this)`;
                    let onKeydownFunc = `tr_object_onkeydown(event,this)`;

                    if (col.isDtParameter) {

                        if (columns[i].id != "action") {
                            colno += 1;

                            var validators = "";
                            if (columns[i].validations != null) {

                                let validations = columns[i].validations;
                                let validationLen = validations.length;

                                for (var v = 0; v < validationLen; v++) {

                                    if (validations[v].value1 == null && validations[v].value2 == null)
                                        validators += " " + validations[v].validationName;
                                    else if (validations[v].validationName.indexOf("range") >= 0)
                                        validators += ` ${validations[v].validationName} = "[${validations[v].value1},${validations[v].value2}]" `;
                                    else
                                        validators += ` ${validations[v].validationName} = "${validations[v].value1}" `;
                                }
                            }

                            if (columns[i].inputType == "select") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<select 
                                    ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                    tabindex="${btn_tbidx}" 
                                    ${validators} 
                                    ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                    ${columns[i].headerReadOnly ? 'disabled ' : ''}
                                    ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                    class="form-control"
                                    id="${columns[i].id}"
                                    onchange="${onChangeFunc}"
                                    onblur="${onBlurFunc}"
                                    onfocus="${onFocusFunc}"
                                    onkeydown="${onKeydownFunc}"`;

                                str += ">";

                                var lenInput = columns[i].inputs.length;

                                if (lenInput !== 0) {
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

                                    if (columns[i].isSelect2) {
                                        $(`#${activePageId} #${columns[i].id}`).select2();
                                    }
                                }
                                else if (checkResponse(columns[i].getInputSelectConfig)) {

                                    var getInputSelectConfig = columns[i].getInputSelectConfig;
                                    var elemId = columns[i].id;
                                    var params = "";
                                    var parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;

                                    if (parameterItems.length > 0) {
                                        for (var p = 0; p < parameterItems.length; p++) {
                                            var paramItem = parameterItems[p].id;
                                            if (parameterItems[p].inlineType)
                                                params += $(`#${activePageId} #${paramItem}_${rowno}`).val();
                                            else
                                                params += $(`#${activePageId} #${paramItem}`).val();
                                            if (p < parameterItems.length - 1)
                                                params += "/";
                                        }
                                    }

                                    str += "</select>";

                                    if (validators != "") {
                                        itemheader += `<div id="${columns[i].id}ErrorContainer"></div>`;
                                    }

                                    str += "</th>";

                                    $(`#${activePageId} #${pageId} .ins-out .row`).append(str);

                                    /*$(`#${activePageId} #${pageId} .ins-out .row #${elemId}`).empty();*/

                                    if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "") {

                                        fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, `انتخاب ${columns[i].title}`, undefined, "", false, false, false, false, false);
                                    }
                                }

                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "datepersian") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                                tabindex="${btn_tbidx}" ${validators} 
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ''}
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                                type="text" id="${columns[i].id}" 
                                                class="form-control persian-date"
                                                ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                placeholder="____/__/__"
                                                required
                                                maxlength="10"
                                                autocomplete="off" />
                                       </th>`;

                                insRowElem.append(str);

                                if (columns[i].inputMask != null)
                                    $(`#${columns[i].id}`).inputmask();
                            }
                            else if (columns[i].inputType == "checkbox") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<div 
                                             tabindex="${btn_tbidx}" 
                                             class="funkyradio funkyradio-success"
                                             onchange="${onChangeFunc}"
                                             onblur="${onBlurFunc}"
                                             onfocus="${onFocusFunc}"
                                             tabindex="-1">`;

                                str += `<input ${validators} 
                                             ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                             ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                             ${!columns[i].headerReadOnly ? 'checked ' : ''} 
                                             ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                             switch-value="بلی,خیر" 
                                             onchange="funkyradio_onchange(this)"
                                             type="checkbox"
                                             id="${columns[i].id}" />
                                </div></th>`;
                                insRowElem.append(str);
                                //setDefaultActiveCheckbox($(`#${columns[i].id}`));
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "number") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" 
                                                ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ''}  
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control number"
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                oninput="tr_object_oninput(event,this)"
                                                ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} 
                                                autocomplete="off" />
                                        </th>`;
                                insRowElem.append(str);
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "money") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" 
                                                ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ''}  
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control money"
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                oninput="tr_object_oninput(event,this)"
                                                ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} 
                                                autocomplete="off" />
                                        </th>`;
                                insRowElem.append(str);
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "money-decimal") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" 
                                                ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ''}  
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control money-decimal"
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                oninput="tr_object_oninput(event,this)"
                                                ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} 
                                                autocomplete="off" />
                                        </th>`;
                                insRowElem.append(str);
                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "decimal") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ""}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ""}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ""} 
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ""}
                                                ${columns[i].inputMask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control decimal"
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                oninput="tr_object_oninput(event,this)"
                                                ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''} 
                                                autocomplete="off" />
                                        </th>`;
                                insRowElem.append(str);


                                if (columns[i].inputMask != null)
                                    $(`#${columns[i].id}`).inputmask();

                                btn_tbidx++;
                            }
                            else if (columns[i].inputType == "time") {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" 
                                                ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ""}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ""}  
                                                ${columns[i].headerReadOnly ? 'disabled ' : ""} 
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ""}
                                                ${columns[i].inputMask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control "
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                placeholder="__:__"
                                                oninput="tr_object_oninput(event,this)"
                                                maxlength="5"
                                                autocomplete="off" />
                                        </th>`;

                                insRowElem.append(str);

                                if (columns[i].inputmask !== null)
                                    $(`#${columns[i].id}`).inputmask();

                                btn_tbidx++;
                            }
                            else {

                                str = `<th style="${(col.align == "center" ? ' text-align:center!important;' : '') + (col.width != 0 ? "width:" + col.width + "%;" : "")}"`;

                                str += `<input 
                                                tabindex="${btn_tbidx}" 
                                                ${validators}
                                                ${columns[i].inputId != undefined ? `data-inputid="${columns[i].inputId}"` : ''}
                                                ${columns[i].defaultReadOnly ? 'disabled data-disabled="true"' : ''}  
                                                ${columns[i].headerReadOnly ? 'disabled' : ''}  
                                                ${columns[i].notResetInHeader ? ' data-notReset="true"' : ''}
                                                ${columns[i].inputMask !== null ? `data-inputmask="${columns[i].inputMask.mask}"` : ""}
                                                type="text"
                                                id="${columns[i].id}" 
                                                class="form-control"
                                                onchange="${onChangeFunc}"
                                                onblur="${onBlurFunc}" 
                                                onfocus="${onFocusFunc}"
                                                onkeydown="${onKeydownFunc}"
                                                oninput="tr_object_oninput(event,this)"
                                                ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''}
                                                autocomplete="off" />
                                        </th>`;
                                insRowElem.append(str);

                                if (columns[i].inputmask !== null)
                                    $(`#${columns[i].id}`).inputmask();

                                btn_tbidx++;
                            }
                        }
                        else {
                            str = '<th style="' + ((col.align == "center") ? ' text-align:' + col.align + '!important;' : '') + ((col.width != 0) ? ' width:' + col.width + '%;' : '') + '">';

                            str += `<button id="headerLineInsUp" data-disabled="false" onclick="headerLineIns('${pageId}')" class="btn btn-light border-dark pa float-sm-right"><i class="fa fa-plus"></i></button>`;
                            btn_tbidx++;
                            str += `<button id="haederLineActive" data-disabled="false" onclick="headerLineActive('${pageId}')" data-toggle="tooltip" data-placement="top" class="btn mr-1 pa float-sm-right "><i class="fa fa-check"></i></button>`;
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
                str += fillEmptyRow(columnsLen);
        }
        else {

            for (var i in list) {

                var item = list[i];
                var rowno = +$(`#${activePageId} #${pageId} .pagetablebody tbody tr:not(#emptyRow)`).length + (+i) + 1;
                var colno = 0;
                var colwidth = 0;

                for (var j = 0; j < columnsLen; j++) {

                    let primaryItems = "", displayItems = "", displaynoneItems = "";

                    for (var f = 0; f < isPrimaryLen; f++) {
                        let v = isPrimaryArray[f];
                        if (v.isPrimary)
                            primaryItems += ` data-model.${v.id}="${item[v.id]}" `;
                    }

                    if (columns[j].hasSumValue && columns[j].calculateSum) {
                        columns[j].sumValue += isNaN(item[columns[j].id]) ? 0 : +item[columns[j].id];
                    }

                    colwidth = columns[j].width;
                    listForCondition = list[i];

                    // ایجاد شرط های اعمال شده بر روی سطر
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
                    }


                    if (columns[j].isDtParameter) {
                        /*another column*/
                        if (columns[j].id != "action") {
                            colno += 1;
                            var value = item[columns[j].id];

                            // زمانی که جدول قابل ویرایش باشد
                            if (columns[j].editable) {
                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "select") {

                                    str += `<select 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    class="form-control"
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" 
                                                    onfocus="tr_onfocus('${pageId}',${colno})"  
                                                    disabled>`;

                                    if (columns[j].pleaseChoose)
                                        str += `<option value="0">انتخاب کنید</option>`;

                                    var lenInput = columns[j].inputs == null ? 0 : columns[j].inputs.length;

                                    if (lenInput !== 0) {

                                        for (var h = 0; h < lenInput; h++) {

                                            let input = columns[j].inputs[h];
                                            if (value != +input.value) {
                                                str += `<option value="${input.id}">${input.name}</option>`;
                                            }
                                            else {
                                                str += `<option value="${input.id}" selected>${input.name}</option>`;
                                            }
                                        }
                                        str += "</select>";
                                    }
                                    else if (checkResponse(columns[j].getInputSelectConfig)) {

                                        let getInputSelectConfig = columns[j].getInputSelectConfig;
                                        let elemId = columns[j].id;
                                        let params = "";
                                        let parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;

                                        if (parameterItems.length > 0) {

                                            for (var p = 0; p < parameterItems.length; p++) {

                                                var paramItem = parameterItems[p].id;

                                                if (parameterItems[p].inlineType)
                                                    params += $(`#${activePageId} #${paramItem}_${rowno}`).val();
                                                else
                                                    params += $(`#${activePageId} #${paramItem}`).val();

                                                if (p < parameterItems.length - 1)
                                                    params += "/";
                                            }

                                        }

                                        str += "</select></div>";

                                        if (validators != "") {
                                            str += `<div id="${columns[j].id}ErrorContainer"></div>`;
                                        }

                                        str += "</div>";

                                        $(`#${activePageId} #${pageId} .ins-out .row`).append(str);

                                        if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "")
                                            fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, `انتخاب ${columns[j].title}`, undefined, "", false, false, false, false, false);
                                    }


                                }
                                else if (columns[j].inputType == "datepersian") {

                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? value : ""}" 
                                                    class="form-control persian-date"
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  
                                                    onfocus="tr_onfocus('${pageId}',${colno})" 
                                                    placeholder="____/__/__"
                                                    maxlength="10"
                                                    autocomplete="off"
                                                    disabled />`;

                                }
                                else if (columns[j].inputType == "datepicker") {

                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? value : ""}" 
                                                    class="form-control persian-datepicker"
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  
                                                    onfocus="tr_onfocus('${pageId}',${colno})" 
                                                    placeholder="____/__/__"
                                                    required
                                                    maxlength="10"
                                                    autocomplete="off"
                                                    disabled />`;

                                }
                                else if (columns[j].inputType == "checkbox") {
                                    if (columns[j].switchValue === "") {
                                        str += `<div class="funkyradio funkyradio-success" onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" onblur="tr_object_onblur('${pageId}',this,${rowno},${colno})" onfocus="tr_onfocus('${pageId}',${colno})" disabled tabindex="-1">
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
                                else if (columns[j].inputType == "number") {
                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? value : ""}" 
                                                    class="form-control number"
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)"  
                                                    onfocus="tr_onfocus('${pageId}',${colno})" 
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''}
                                                    autocomplete="off"
                                                    disabled />`;
                                }
                                else if (columns[j].inputType == "money") {
                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? transformNumbers.toComma(value).replaceAll('.', '/') : ""}" 
                                                    class="form-control money"
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" 
                                                    onfocus="tr_onfocus('${pageId}',${colno})"
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                                    autocomplete="off"
                                                    disabled />`;
                                }
                                else if (columns[j].inputType == "decimal") {
                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? value.toString().split('.').join("/") : ""}" 
                                                    class="form-control decimal"
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" 
                                                    onfocus="tr_onfocus('${pageId}',${colno})"
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    ${columns[i].maxLength != 0 ? 'maxlength="' + columns[i].maxLength + '"' : ''}
                                                    autocomplete="off"
                                                    disabled />`;
                                }
                                else if (columns[j].inputType == "time") {
                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value != 0 ? value.toString().split('.').join("/") : ""}" 
                                                    class="form-control time"
                                                    placeholder="__:__"
                                                    ${columns[i].inputMask != null ? "data-inputmask='" + columns[i].inputMask.mask + "'" : ""}
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" 
                                                    onfocus="tr_onfocus('${pageId}',${colno})"
                                                    maxlength="5"
                                                    autocomplete="off"
                                                    disabled />`;
                                }
                                else {
                                    str += `<input 
                                                    id="${columns[j].id}_${rowno}_${colno}" 
                                                    type="text"
                                                    value="${value}" 
                                                    class="form-control"
                                                    onchange="tr_object_onchange('${pageId}',this,${rowno},${colno})" 
                                                    onblur="tr_object_onblur('${pageId}',this,${rowno},${colno},event)" 
                                                    onfocus="tr_onfocus('${pageId}',${colno})" 
                                                    ${columns[j].maxLength != 0 ? 'maxlength="' + columns[j].maxLength + '"' : ''} 
                                                    autocomplete="off"
                                                    disabled />`;
                                }

                                str += "</td>"
                            }
                            else if (columns[j].isReadOnly) {

                                str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%;">`;

                                if (columns[j].inputType == "number") {
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value : ""}" class="form-control number" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                }
                                else if (columns[j].inputType == "money") {

                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? transformNumbers.toComma(value).replaceAll('.', '/') : ""}" class="form-control money" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                }
                                else if (columns[j].inputType == "decimal") {
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value != 0 ? value.toString().split('.').join("/") : ""}" class="form-control decimal" onfocus="tr_onfocus('${pageId}',${colno})"  autocomplete="off" readonly>`;
                                }
                                else {
                                    str += `<input id="${columns[j].id}_${rowno}_${colno}" type="text" value="${value}" class="form-control" onfocus="tr_onfocus('${pageId}',${colno})" autocomplete="off" readonly>`;
                                }
                                str += "</td>"
                            }
                            else {
                                // نمایش تاریخ همراه با زمان
                                if (columns[j].id.toLowerCase().indexOf('datetimepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value.substring(0, 10) + '<p class="mb-0 mt-neg-5">' + value.substring(11, 19); +'</p></td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                // نمایش تاریخ
                                else if (columns[j].id.toLowerCase().indexOf('datepersian') >= 0) {
                                    if (value != null && value != "") {
                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;"' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;
                                    }
                                }
                                // نمایش اعداد با نوع bigint/int/smallint/tinyint/decimal/float / custome type IP
                                else if ((columns[j].type === 0 || columns[j].type === 8 || columns[j].type === 16 || columns[j].type === 20 || columns[j].type === 5 || columns[j].type === 6) || (columns[j].inputType == "ip")) {

                                    if (value != null && value != "") {

                                        if (columns[j].type === 5 || columns[j].type === 6) {
                                            value = value.toString().split('.').join("/");
                                        }
                                        if (value && columns[j].isCommaSep) {
                                            value = value > 0 ? transformNumbers.toComma(Math.abs(value)).replaceAll('.', '/') : `(${transformNumbers.toComma(Math.abs(value)).replaceAll('.', '/')})`;
                                        }

                                        str += '<td id="col_' + rowno + '_' + colno + '" style="width:' + colwidth + "%; " + ((columns[j].align == "center") ? 'text-align:' + columns[j].align + '!important;' : '') + '" >' + value + '</td>';
                                    }
                                    else {
                                        str += `<td id="col_${rowno}_${colno}"  style="width:${colwidth}%;"></td>`;
                                    }
                                }
                                else if (columns[j].type == 2) {
                                    if (value)
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
                                        str += `<td id="col_${rowno}_${colno}" style="width:${colwidth}%"></td>`;

                                }
                            }
                        }
                        /*action column*/
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
                                    if (!btn.isSeparator) {
                                        if (btn.condition == null || eval(condition)) {
                                            btn_tbidx++;
                                            strBtn += `<button onclick="run_header_line_row_${btn.name}('${pageId}',${rowno},event)" class="dropdown-item btn_${btn.name}" title="${btn.title}" tabindex="${btn_tbidx}"><i class="${btn.iconName} ml-2"></i>${btn.title}</button>`;
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
                                            str += `<button type="button" onclick="run_header_line_row_${btn.name}('${pageId}',${rowno},event)" class="${btn.className} btn_${btn.name}" title="${btn.title}"><i class="${btn.iconName}"></i></button>`;
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
                        if (columns[cl].isDtParameter) {
                            cli += 1;
                            if (cli == 1) {
                                str += `<td id="totalrecord" class="text-right  font-600" style="width:${colwidth}%;">تعداد سطر: ${list.length}</td>`;
                                if (columns[cl].id == "action")
                                    recordcolwidth += colwidth;
                            }
                            else if (cli == 2) {
                                str += `<td id="totalSum" class="text-left  font-600" style="width:${colwidth}%;"> جمع</td>`;
                                if (columns[cl].id == "action")
                                    Sumcolwidth += colwidth;
                            }
                            else if (columns[cl].hasSumValue) {
                                var value = item[columns[cl].id];

                                var sumValue = "0";

                                if (columns[cl].sumValue >= 0) {
                                    if (columns[cl].type === 5)
                                        sumValue = parseFloat(columns[cl].sumValue).toFixed(3).replaceAll('.', '/')
                                    else
                                        sumValue = transformNumbers.toComma(Math.abs(columns[cl].sumValue)).replaceAll('.', '/');
                                }
                                else {
                                    if (columns[cl].type === 5)
                                        sumValue = `(${parseFloat(columns[cl].sumValue).toFixed(3).replaceAll('.', '/')})`
                                    else
                                        sumValue = `(${transformNumbers.toComma(Math.abs(columns[cl].sumValue)).replaceAll('.', '/')})`;
                                }

                                str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;

                                firstHasValue = true;
                                afterFirstHasValue = true;
                            }
                            else if (!firstHasValue) {
                                str += `<td class="font-600" style="width:${colwidth}%;"></td>`;
                            }
                            else if (afterFirstHasValue = true) {
                                if (columns.filter(a => a.id == "amountDebit" || a.id == "amountCredit").length > 0 && +cl == columns.filter(a => a.isDtParameter).length - 1) {
                                    var finalAmount = parseFloat(amountDebit) - parseFloat(amountCredit);

                                    str += `<td id="finalAmount" class="font-600" style="width:${colwidth}%;">${finalAmount >= 0 ? transformNumbers.toComma(Math.abs(finalAmount)).replaceAll('.', '/') : "(" + transformNumbers.toComma(Math.abs(finalAmount)).replaceAll('.', '/') + ")"}</td>`;
                                }
                                else {
                                    str += `<td class="font-600" style="width:${colwidth}%;"></td>`;
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
        elm_pbody.find(`tbody > #row${pagetable_currentrow}`).addClass("highlight");

        pagetable_laststate = "";
        if (arr_headerLinePagetables[index].pageno == 0) {
            fillOptionHeader(arr_headerLinePagetables[index].pagetable_id);
            appendDetails(columns)
        }

        if (columns.findIndex(x => x.inputType == "datepicker") > -1) {
            $.each($(`#${activePageId} #${pageId} .pagetablebody .persian-datepicker`), function (key, val) {
                kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
            });
        }

        funkyradio_switchvalue();

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

    if (typeof callBack != "undefined")
        callBack(result);
}

function createPageFooterInfo_headerLine(first, last, pageNo, pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";

    $(`#${pg_id} #totalrecord`).text(`تعداد سطر : ${last}`);
    $(`#${pg_id} #currentPage`).text(pageNo);
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

function filtervalue_onkeypressHeaderLine(e, fltvalue) {

    if (e.which == KeyCode.Enter) {
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

    if (e.which != KeyCode.Enter) {
        let pagetableId = $(fltvalue).parents("div.card-body").attr("id");
        let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
        arr_headerLinePagetables[index].filtervalue = $(fltvalue).hasClass("double-input") ? genarateValueFilter($(fltvalue)) : $(fltvalue).val();
    }
}

function filtervalue_onsearchclickHeaderLine(elm_search) {
    var pagetableId = $(elm_search).closest("div").closest("div.card-body").attr("id");
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_headerLinePagetables[index].filtervalue = $(elm_search).prev("input").hasClass("double-input") ? genarateValueFilter($(elm_search).prev("input")) : $(elm_search).prev("input").val();
    InitFormLine();
}

function filtervalue_onChangeHeaderLine(fltvalue) {

    let pagetableId = $(fltvalue).closest("div").closest("div.card-body").attr("id"),
        index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pagetableId);
    arr_headerLinePagetables[index].filtervalue = $(fltvalue).val();
    if (+$(fltvalue).val() !== 0)
        InitFormLine();
}

function genarateValueFilter(element) {
    return $(element).val() + "     " + $(element).prev(".double-input").val();
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

                if (columns[cl].isDtParameter) {
                    cli += 1;
                    if (cli == 1)
                        str += `<td id="totalrecord" class="text-right  font-600" style="width:${colwidth}%;">تعداد سطر: <span id="total_qty_rows">${list.length}</span></td>`;

                    else if (cli == 2)
                        str += `<td id="totalSum" class="text-left  font-600" style="width:${colwidth}%;"> جمع</td>`;

                    else if (columns[cl].hasSumValue) {
                        var sumValue = "0";
                        sumValue = dataSum[columns[cl].id] >= 0 ?
                            transformNumbers.toComma(dataSum[columns[cl].id]).replaceAll('.', '/') : `(${transformNumbers.toComma(Math.abs(dataSum[columns[cl].id])).replaceAll('.', '/')})`;

                        str += `<td class="total-amount" style="width:${colwidth}%">${sumValue}</td>`;
                        firstHasValue = true;
                        afterFirstHasValue = true;
                    }

                    else if (!firstHasValue)
                        str += `<td class="font-600" style="width:${colwidth}%;"></td>`;

                    else if (afterFirstHasValue) {
                        if (columns.filter(a => a.id == "amountDebit" || a.id == "amountCredit").length > 0 && +cl == columns.filter(a => a.isDtParameter).length - 1) {
                            var finalAmount = parseFloat(amountDebit) - parseFloat(amountCredit);
                            str += `<td id="finalAmount" class="font-600 ${+finalAmount != 0 ? "highlight-danger" : ""}" style="width:${colwidth}%;">${finalAmount >= 0 ? transformNumbers.toComma(Math.abs(finalAmount)).replaceAll('.', '/') : "(" + transformNumbers.toComma(Math.abs(finalAmount)).replaceAll('.', '/') + ")"}</td>`;
                        }
                        else
                            str += `<td class="font-600" style="width:${colwidth}%;"></td>`;
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

function fillOptionHeader(pg_id) {
    let index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_id);
    arr_headerLinePagetables[index].currentrow = 1;
    arr_headerLinePagetables[index].pageno = 0;
    arr_headerLinePagetables[index].endData = false;

    handlerInsertHeaderLine(pg_id);
}

function handlerInsertHeaderLine(pg_id = null) {
    if (pg_id == null) pg_id = "pagetable";
    let elmenet = $(`#${pg_id} .table-responsive  tbody`);
    let elmenetjs = document.querySelector(`#${pg_id} .table-responsive  tbody `);
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
        getPagetable_HeaderLine(pg_id, null, afterInsertLineHeaderLine, true);
    }
}

function appendDetails(columns) {
    $("#header-lines-footer").html("");

    var output = `<div class="detail-headerLine row col-md-12">`;

    var columnIsDisplayItem = columns.filter(c => c.isDisplayItem);

    for (var i in columnIsDisplayItem) {
        var col = columns[i];
        output += `<div class="item-detail-box"><div class="item-detail-group">
            <label class="item-detail">${col.title}</label>
            <label id="${col.id}" class="item-detail-val"></label>
            </div></div>`;
    }

    output += `</div>`;
    $(output).appendTo("#header-lines-footer");
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

function run_button_header_update() {
    if (typeof checkEditOrDeletePermission != "undefined") {
        if (!checkEditOrDeletePermission()) {
            var msgItem = alertify.warning("در حال حاضر امکان تغییر اطلاعات وجود ندارد");
            msgItem.delay(alertify_delay);
            return;
        }
    }

    if (typeof isLoadEdit !== "undefined")
        isLoadEdit = true;

    get_header();

    if (typeof after_showHeaderModal != "undefined")
        after_showHeaderModal();

    modal_show("headeUpdateModal");
}

function tr_HighlightHeaderLine(pg_name) {
    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_headerLinePagetables[index].pagetable_id;
    var pagetable_currentrow = arr_headerLinePagetables[index].currentrow;

    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr.highlight`).removeClass("highlight");
    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).addClass("highlight");
    $(`#${activePageId} #${pagetable_id} .pagetablebody > tbody > tr#row${pagetable_currentrow}`).focus();
}

// دکمه افزودن جهت ثبت موارد وارد شده Insert/Update
function headerLineIns(pageId) {

    var index = arr_headerLinePagetables.findIndex(v => v.pagetable_id == pageId);
    var headerId = arr_headerLinePagetables[index].headerType == "outline" ? "ins-out" : arr_headerLinePagetables[index].headerType == "inline" ? "ins-row" : "ins-rowEditable";
    var opr = "";

    if (headerId == "ins-rowEditable")
        opr = $(`#${pageId} tbody tr.highlight`).data()["model.id"] == undefined ? "Ins" : "Up"
    else
        opr = $(`#${pageId} #outLineElement`).data()["model.id"] == undefined ? "Ins" : "Up"

    if (headerId == "ins-out") {
        var validate = true;
        var form = null;

        form = $(`#${activePageId} #${pageId} #outLineElement > .row`).parsley();
        validate = form.validate();
        validateSelect2(form);
        if (!validate) return;
    }

    var newModel = {};

    var url = "";

    if (opr == "Ins") {

        for (var i = 0; i < additionalData.length; i++) {
            newModel[additionalData[i].name] = additionalData[i].value;
        }
        url = arr_headerLinePagetables[index].insRecord_Url;

        $(`#${activePageId} #${pageId} #outLineElement`).removeData();
    }
    else {

        var primaryData = headerId == "ins-rowEditable" ? $(`#${activePageId} #${pageId} tbody tr.highlight`).data() : $(`#${activePageId} #${pageId} #outLineElement`).data();

        $.each(primaryData, function (k, v) {
            if (k.indexOf("model.") == 0) {

                if (k.indexOf("isdisplaynoneitem") != -1)
                    newModel[k.replace("isdisplaynoneitem", "")] = v;

                if (k.indexOf("select2-id") == -1) {
                    var modelId = k.split("model.")[1];
                    newModel[modelId] = v;
                }
            }
        });

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
                val = +removeSep(elm.val())
            else if (elm.hasClass("decimal"))
                val = +removeSep(elm.val().replace(/\//g, "."));
            else if (elm.hasClass("number"))
                val = +removeSep(elm.val()) !== 0 ? +elm.val() : 0;
            else if (elm.hasClass("str-number"))
                val = removeSep(elm.val());
            else if (elm.attr("type") == "checkbox")
                val = elm.prop("checked");
            else if (elm.hasClass("select2") || elm.prop("tagName").toLowerCase() == "select")
                val = elm.val();
            else
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

                    getPagetable_HeaderLine(pageId);

                    if (opr === "Ins") {
                        if (typeof after_insertLine != "undefined")
                            after_insertLine();
                    }
                    else {
                        if (typeof after_UpdateLine != "undefined")
                            after_UpdateLine();
                    }
                }
                else {

                    if (result.statusMessage !== undefined && result.statusMessage !== null) {
                        var msg = alertify.error(result.statusMessage);
                        msg.delay(alertify_delay);
                    }
                    else if (checkResponse(result.validationErrors)) {
                        generateErrorValidation(result.validationErrors);
                    }
                    else {
                        var msg = alertify.error(msg_row_create_error);
                        msg.delay(alertify_delay);
                    }
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
}

// دکمه ویرایش در هر سطر پابرگ - ستون عملیات - get Record
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

            var data = result.data;

            if (data != null) {

                allowTrigger = false

                if (arr_headerLinePagetables[index].headerColumns != null && arr_headerLinePagetables[index].headerColumns.hasStageStepConfig) {

                    getStageStepConfig(null, arr_headerLinePagetables[index].headerColumns, data, pageId);

                    for (var i = 0; i < lineFieldsKey.length; i++) {
                        var lineField = lineFieldsKey[i];
                        $(`#${lineField}`).val(data[lineField]).trigger("change.select2");
                    }

                }
                else {

                    var insRowInputs = headerId == "ins-rowEditable" ? $(`#${pageId} tbody tr.highlight`).find("input,select") : $(`#${pageId} .${headerId}`).find("input,select");

                    if (headerId == "ins-row" && typeof configTreasuryElementPrivilage == "function")
                        configTreasuryElementPrivilage(`.ins-row`, "edit");

                    for (var i = 0; i < insRowInputs.length; i++) {
                        var elem = $(insRowInputs[i]);


                        $.each(data, function (k, v) {
                            if ($(elem).attr("id").split("_")[0] == k || (headerId == "ins-row" && $(elem).data("inputid") == k)) {
                                if ($(elem).hasClass("money"))
                                    $(`#${$(elem).attr("id")}`).val(transformNumbers.toComma(v));

                                if ($(elem).prop("tagName") == "SELECT") {

                                    $(`#${$(elem).attr("id")}`).trigger("change");
                                }
                                else if ($(elem).attr("type") == "checkbox")
                                    $(`#${$(elem).attr("id")}`).prop("checked", v);
                            }
                        });
                    }
                }

                if (typeof (configLineElementPrivilage) != "undefined")
                    configLineElementPrivilage(`.${headerId}`, "edit");

                allowTrigger = true;
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

// دکمه حذف در هر سطر پابرگ - ستون عملیات
function run_header_line_row_delete(pageId, rowNo) {

    if (typeof checkEditOrDeletePermission != "undefined") {
        if (!checkEditOrDeletePermission()) {
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
            if (result.successfull) {
                var msg = alertify.success(msg_row_deleted);
                msg.delay(alertify_delay);

                getPagetable_HeaderLine(pageId, null, () => {
                    if (typeof run_header_line_row_After_delete !== "undefined")
                        run_header_line_row_After_delete();
                }, false);
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

function getStageStepConfig(elem, headerColumn, stageStepConfigModelData, pageId) {

    if (elem == null || (isStageStepLineField(headerColumn, elem) && +$(elem).val() > 0)) {

        updateStageStepConfigModel(headerColumn, stageStepConfigModelData);

        let url = `${viewData_baseUrl_WF}/StageStepConfigApi/getstagestepconfigcolumn/${+$(elem).val() == 0}`;

        $.ajax({
            url: url,
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

                    update_lineHeaderColumnsByStageStepConfig(newHeaderColumns, stageStepConfigModelData, pageId);
                }

            },
            error: function (xhr) {
                error_handler(xhr, url);
                return false;
            }
        })
    }
}

function isStageStepLineField(headerColumn, elem) {
    return (headerColumn.stageStepConfig != undefined && headerColumn.stageStepConfig.lineFields.filter(a => a.fieldId == $(elem).attr("id")).length > 0);
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

function update_lineHeaderColumnsByStageStepConfig(newHeaderColumns, data, pageId) {

    $(`#${activePageId} #${pageId} #outLineElement .row .form-group:not(.elementKey)`).remove();

    if (newHeaderColumns.length > 0) {
        let colno = 0;
        let btn_tbidx = 2001;
        let newHeaderColumnsLen = newHeaderColumns.length;

        for (var i = 0; i < newHeaderColumnsLen; i++) {

            let newHeaderColumn = newHeaderColumns[i];

            let validators = "";

            if (newHeaderColumn.validations != null) {

                let validations = newHeaderColumn.validations;

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

            colno += 1;

            let itemheader = "";
            if (!newHeaderColumn.isDisplayNone) {

                let value = "#NONE#";

                if (checkResponse(data))
                    value = data[newHeaderColumn.id];


                itemheader = `<div class="form-group col-sm-${newHeaderColumn.width}"><label>${newHeaderColumn.title}</label><div>`

                if (newHeaderColumn.inputType == "select") {

                    itemheader += `<select 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                                class="form-control element-line ${newHeaderColumn.isSelect2 ? "select2" : ""}"
                                                id="${newHeaderColumn.id}"
                                                ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''}
                                                ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                                tabindex="${btn_tbidx}"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno})"
                                                onfocus="tr_object_onfocus(this)">`;

                    if (newHeaderColumn.pleaseChoose)
                        itemheader += `<option value="0">انتخاب کنید</option>`;

                    let lenInput = newHeaderColumn.inputs == null ? 0 : newHeaderColumn.inputs.length;

                    if (lenInput !== 0) {

                        for (var h = 0; h < lenInput; h++) {
                            var input = newHeaderColumn.inputs[h];
                            itemheader += `<option value="${input.id}" ${input.id === value ? "selected" : ""}>${input.id} - ${input.name}</option>`;
                        }
                        itemheader += "</select></div>";

                        if (validators != "") {
                            itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if (newHeaderColumn.isSelect2)
                            $(`#${newHeaderColumn.id}`).select2();

                    }
                    else if (checkResponse(newHeaderColumn.getInputSelectConfig)) {

                        let getInputSelectConfig = newHeaderColumn.getInputSelectConfig;
                        let elemId = newHeaderColumn.id;
                        let params = "";
                        let parameterItems = getInputSelectConfig.parameters != null ? getInputSelectConfig.parameters : 0;

                        if (parameterItems.length > 0) {

                            for (var y = 0; y < parameterItems.length; y++) {
                                let paramItem = parameterItems[y].id;
                                if (parameterItems[y].inlineType)
                                    params += $(`#${activePageId} #${paramItem}_${rowno}`).val();
                                else
                                    params += $(`#${activePageId} #${paramItem}`).val();
                                if (y < parameterItems.length - 1)
                                    params += "/";
                            }
                        }

                        itemheader += "</select></div>";

                        if (validators != "") {
                            itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div>`;
                        }

                        itemheader += "</div>";

                        $(`#${activePageId} #${pageId} .ins-out .row`).append(itemheader);

                        if ((params.split("/").filter(a => a == "0" || a == "null").length == 0) && getInputSelectConfig.fillUrl != "")
                            fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, `انتخاب ${newHeaderColumn.title}`, undefined, "", false, false, false, false, false);

                        if (value !== "#NONE#")
                            $(`#${elemId}`).val(value).trigger("change");
                    }

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "datepersian") {

                    itemheader += `<input 
                                                ${validators} 
                                                ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                                type="text"
                                                value="${value !== "#NONE#" ? value : ""}"
                                                id="${newHeaderColumn.id}" 
                                                tabindex="${btn_tbidx}" 
                                                ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                                class="form-control persian-date element-line"
                                                ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                                onkeydown="tr_object_onkeydown(event,this)"
                                                oninput="tr_object_oninput(event,this)"
                                                onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                onblur="tr_object_onblur('${pageId}',this,${colno})"  
                                                onfocus="tr_object_onfocus(this)"
                                                placeholder="____/__/__"
                                                maxlength="10"
                                                autocomplete="off"/>
                                       </div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }
                    else
                        itemheader += "</div>";

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "datepicker") {
                    itemheader += `<div>
                                            <input
                                                    ${validators} 
                                                    ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                                    type="text"
                                                    value="${value !== "#NONE#" ? value : ""}"
                                                    id="${newHeaderColumn.id}" 
                                                    tabindex="${btn_tbidx}" 
                                                    ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                                    ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                                    class="form-control persian-datepicker element-line"
                                                    data-inputmask="${newHeaderColumn.inputMask.mask}"
                                                    ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                                    onkeydown="tr_object_onkeydown(event,this)"
                                                    oninput="tr_object_oninput(event,this)"
                                                    onchange="public_tr_object_onchange(this,'${pageId}')" 
                                                    onblur="tr_object_onblur('${pageId}',this,${colno})"
                                                    onfocus="tr_object_onfocus(this)"
                                                    placeholder="____/__/__"
                                                    maxlength="10"
                                                    autocomplete="off"/>
                                   </div>`;

                    if (validators != "")
                        itemheader += `</div><div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    btn_tbidx++;

                }
                else if (newHeaderColumn.inputType == "checkbox") {
                    itemheader += `<div 
                                        tabindex="${btn_tbidx}" 
                                        class="funkyradio funkyradio-success element-line"
                                        ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                        ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''}  
                                        onchange="public_tr_object_onchange(this,'${pageId}')"  
                                        onfocus="tr_object_onfocus(this)"
                                        onblur="tr_object_onblur('${pageId}',this,${colno})"
                                        onkeydown="tr_object_onkeydown(event,this)"
                                        oninput="tr_object_oninput(event,this)">`;



                    itemheader += `<input 
                                            onchange="funkyradio_onchange(this)"
                                            switch-value="بلی,خیر"
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                            type="checkbox"
                                            class="element-line"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} />
                                </div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    if (value !== "#NONE#")
                        $(`#${newHeaderColumn.id}`).prop("checked", value);

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "number") {
                    itemheader += `
                                    <input
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                            type="text"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                            tabindex="${btn_tbidx}" 
                                            class="form-control number element-line"
                                            onchange="public_tr_object_onchange(this,'${pageId}')" 
                                            onblur="tr_object_onblur('${pageId}',this,${colno})"
                                            onfocus="tr_object_onfocus(this)"
                                            onkeydown="tr_object_onkeydown(event,this)"
                                            oninput="tr_object_oninput(event,this)"
                                            ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                            ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} 
                                            autocomplete="off" />
                                  </div>`;


                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    if (value !== "#NONE#")
                        $(`#${newHeaderColumn.id}`).val(value);

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "strnumber") {


                    itemheader += `<input 
                                            ${validators} 
                                            ${validators != "" ?
                            "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                            type="text"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                            tabindex="${btn_tbidx}" 
                                            class="form-control str-number element-line"
                                            onchange="public_tr_object_onchange(this,'${pageId}')" 
                                            onblur="tr_object_onblur('${pageId}',this,${colno})"
                                            onfocus="tr_object_onfocus(this)"
                                            onkeydown="tr_object_onkeydown(event,this)"
                                            oninput="tr_object_oninput(event,this)"
                                            ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                            ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''} 
                                            autocomplete="off" />
                                            </div>`;


                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    if (value !== "#NONE#")
                        $(`#${newHeaderColumn.id}`).val(value);

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "money") {

                    itemheader += `<input 
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                            type="text"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                            tabindex="${btn_tbidx}" 
                                            class="form-control money element-line"
                                            onchange="public_tr_object_onchange(this,'${pageId}')" 
                                            onblur="tr_object_onblur('${pageId}',this,${colno})"
                                            onfocus="tr_object_onfocus(this)"
                                            onkeydown="tr_object_onkeydown(event,this)"
                                            oninput="tr_object_oninput(event,this)"
                                            ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                            ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''}
                                            autocomplete="off" />
                                  </div>`;


                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();
                    if (value !== "#NONE#")
                        $(`#${newHeaderColumn.id}`).val(transformNumbers.toComma(value).replaceAll('.', '/'));

                    btn_tbidx++;
                }
                else if (newHeaderColumn.inputType == "decimal") {

                    itemheader += `<input 
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""}
                                            type="text"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''}
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                            tabindex="${btn_tbidx}"
                                            class="form-control decimal element-line"
                                            onchange="public_tr_object_onchange(this,'${pageId}')"
                                            onblur="tr_object_onblur('${pageId}',this,${colno})"
                                            onfocus="tr_object_onfocus(this)"
                                            onkeydown="tr_object_onkeydown(event,this)"
                                            oninput="tr_object_oninput(event,this)"
                                            ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                            ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''}
                                            autocomplete="off" />
                                   </div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    if (value !== "#NONE#") {

                        if (Number.isInteger(+value)) {

                            if (newHeaderColumn.isCommaSep)
                                $(`#${newHeaderColumn.id}`).val(transformNumbers.toComma(value));
                            else
                                $(`#${newHeaderColumn.id}`).val((value).toString());
                        }
                        else {
                            let decimalPoint = (value).toString().split('.');

                            if (decimalPoint[1] === undefined) {
                                $(`#${newHeaderColumn.id}`).val(transformNumbers.toComma(value));
                            }
                            else {
                                if (decimalPoint[1].length > 0) {
                                    if (newHeaderColumn.isCommaSep) {
                                        $(`#${newHeaderColumn.id}`).val(`${transformNumbers.toComma(decimalPoint[0])}/${decimalPoint[1]}`);
                                    }
                                    else {
                                        $(`#${newHeaderColumn.id}`).val(`${decimalPoint[0]}/${decimalPoint[1]}`);
                                    }
                                }
                            }
                        }
                    }

                    btn_tbidx++;
                }
                else {

                    itemheader += `<input 
                                            ${validators} 
                                            ${validators != "" ? "data-parsley-errors-container='#" + newHeaderColumn.id + "ErrorContainer'" : ""} 
                                            type="text"
                                            id="${newHeaderColumn.id}" 
                                            ${newHeaderColumn.headerReadOnly ? 'disabled data-disabled="true"' : ''} 
                                            ${newHeaderColumn.notResetInHeader ? ' data-notReset="true"' : ''} 
                                            tabindex="${btn_tbidx}" 
                                            class="form-control element-line"
                                            onchange="public_tr_object_onchange(this,'${pageId}')" 
                                            onblur="tr_object_onblur('${pageId}',this,${colno})"
                                            onfocus="tr_object_onfocus(this)"
                                            onkeydown="tr_object_onkeydown(event,this)"
                                            oninput="tr_object_oninput(event,this)"
                                            ${newHeaderColumn.inputMask !== null ? `data-inputmask="${newHeaderColumn.inputMask.mask}"` : ""}
                                            ${newHeaderColumn.maxLength != 0 ? 'maxlength="' + newHeaderColumn.maxLength + '"' : ''}
                                            autocomplete="off" />
                                   </div>`;

                    if (validators != "") {
                        itemheader += `<div id="${newHeaderColumn.id}ErrorContainer"></div></div>`;
                    }

                    $(`#${pageId} .ins-out .row`).append(itemheader);

                    if (newHeaderColumn.inputmask !== null)
                        $(`#${newHeaderColumn.id}`).inputmask();

                    if (value !== "#NONE#")
                        $(`#${newHeaderColumn.id}`).val(value);

                    btn_tbidx++;
                }
            }
        }

        if (newHeaderColumns.findIndex(x => x.inputType == "datepicker") > -1) {
            $.each($(`#${activePageId} #${pageId} #outLineElement .persian-datepicker`), function (key, val) {
                kamaDatepicker(`${$(val).attr('id')}`, { withTime: false, position: "bottom" });
            });
        }

        $("#headerLineInsUp").attr("tabindex", btn_tbidx);

        funkyradio_switchvalue();
    }
    else {
        let msgSetting = alertify.error("تنظیمات برگه برای این مرحله انجام نشده ، به مدیر سیستم اطلاع دهید");
        msgSetting.delay(alertify_delay);
    }
}

function getKeyLineElement(config) {

    headerFieldsKey = [];
    lineFieldsKey = [];

    if (!checkResponse(config)) {
        return;
    }

    if (checkResponse(config.headerFields))
        for (var i = 0; i < config.headerFields.length; i++) {
            headerFieldsKey.push(config.headerFields[i].fieldId);
        }

    if (checkResponse(config.lineFields))
        for (var i = 0; i < config.lineFields.length; i++) {
            lineFieldsKey.push(config.lineFields[i].fieldId);
        }
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

                var getInputSelectConfig = changeItemCol.getInputSelectConfig;

                if (changeItemCol.isSelect2 && getInputSelectConfig != null) {

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

                        fill_select2(getInputSelectConfig.fillUrl, elemId, true, params, false, 0, '',
                            function () {
                                var val = +$(`#${elemId}`).data("value");
                                $(`#${elemId}`).val(val).trigger("change");
                            }
                            , "", false, false, false, false, false);
                    }
                }
            }
        }
    }
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