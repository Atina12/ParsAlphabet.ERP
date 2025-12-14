var i = 1;
var isStarted = false;
var data = [];;
var timeOut = undefined;
var templateStr = "";
var arrayExcelHeaderTemp = [];
onmessage = function (e) {
    if (e.data.actionType == "init") {
        data = e.data.rowData;
        arrayExcelHeaderTemp = e.data.arrayExcelHeaderTemp;
        isStarted = true;
        timeOut = this.setInterval(timerOn, 1);
    }
    else if (i >= data.length) {
        clearInterval(timeOut);
    }
}

function timerOn() {

    let modelSum = {}, dataRowDetails = {},
        rowNo = 0, datePickerLength = 0,
        dataRow = "";
    var outputBody = "";
    let dataSheet = data[i];
    let dataSheetLength = dataSheet.length;

    rowNo = i;
    outputBody = `<tr id="ex_${rowNo}" tabindex="-1" data-disabled="true" onkeydown="eventTrTable(${rowNo},event)" onclick="eventClickTrTable(${rowNo},this)" data-parsley-validate>
                                          <td class="text-center"><input class="checkEx" type="checkbox" id="checkEx_${rowNo}" onclick="clickCheck(event)" disabled/></td>
                                          <td class="rowNumberEx">${rowNo}</td>`;
    for (var j = 0; j < dataSheetLength; j++) {
        dataRow = dataSheet[j].toString().trim();
        dataRowDetails = arrayExcelHeaderTemp[j];
        if (!dataRowDetails.editable) outputBody += `<td class="ex-ted notEdit" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><input autocomplete="off"  id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="false" class="form-control"  onkeydown="eventTdTable(${rowNo},${j},event)" value="${dataRow}" ${createValdtion(dataRowDetails.validations)} disabled/></td>`;
        else if (dataRowDetails.inputType == "select") {
            outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}" onkeydown="eventTdTable(${rowNo},${j},event)" ><div class="main-div-ex" id="main_${rowNo}_${dataRowDetails.id}">
                                <input autocomplete="off"  id="${rowNo}_${dataRowDetails.id}" data-parsley-errors-container="#${rowNo}_${dataRowDetails.id}Erorr" data-editable="true" class="form-control"
                                ${createValdtion(dataRowDetails.validations)} value="${+dataRow}" type="text"  disabled />
                                </div><div id="${rowNo}_${dataRowDetails.id}Erorr"></div></td>`;

            let modelFillDropDown = {};
            modelFillDropDown = {
                row: rowNo,
                fillType: dataRowDetails.fillType,
                id: dataRowDetails.id,
                api: dataRowDetails.api,
                parentID: dataRowDetails.parentID,
                isSelect2: dataRowDetails.isSelect2,
                value: +dataRow,
                childID: dataRowDetails.childID,
                childApiUrl: dataRowDetails.childApiUrl,
                inputs: dataRowDetails.inputs,
                validations: dataRowDetails.validations
            };
            arrayDrops.push(modelFillDropDown);
        }
        else if (dataRowDetails.inputType == "datepersian") outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><input autocomplete="off" dir="ltr" id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="true" class="form-control persian-date" onkeydown="eventTdTable(${rowNo},${j},event)" value="${dataRow}" ${createValdtion(dataRowDetails.validations)}  data-inputmask="${dataRowDetails.inputMask}" disabled/></td>`;
        else if (dataRowDetails.inputType == "datepicker") outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><input autocomplete="off" dir="ltr" id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="true" class="form-control persian-datepicker" onkeydown="eventTdTable(${rowNo},${j},event)" value="${dataRow}" ${createValdtion(dataRowDetails.validations)}  data-inputmask="${dataRowDetails.inputMask}" data-parsley-errors-container="#${rowNo}_${dataRowDetails.id}Erorr disabled/><div id="${rowNo}_${dataRowDetails.id}Erorr"></div></td>`;
        else if (dataRowDetails.inputType == "checkbox") outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}" onkeydown="eventTdTable(${rowNo},${j},event)"><div class="funkyradio funkyradio-success" tabindex="0" onkeydown="funkyradio_keydown(event,'${rowNo}_${dataRowDetails.id}');" onfocus="checkBoxEXOnfocus(this)" onblur="checkBoxEXOnblur(this)"><input type="checkbox" class="check-exl form-control"data-editable="true"  name="checkbox" id="${rowNo}_${dataRowDetails.id}" ${createValdtion(dataRowDetails.validations)}  ${dataRow ? "checked" : ""} switch-value="," disabled /><label class="checkExcels" for="${rowNo}_${dataRowDetails.id}"></label></div></td>`;
        else if (dataRowDetails.inputType == "searchplugin") {
            outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><div class="main-div-ex" id="main_${rowNo}_${dataRowDetails.id}"><input autocomplete="off"  id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="true" class="form-control searchplugin search-disable ${dataRowDetails.type == 8 ? 'number' : ''}"  onkeydown="eventTdTable(${rowNo},${j},event)" value="${dataRow}"
                                ${+dataRowDetails.maxLength != 0 ? 'maxlength="' + dataRowDetails.maxLength + '"' : ''}  ${createValdtion(dataRowDetails.validations)} data-parsley-errors-container="#${rowNo}_${dataRowDetails.id}Erorr" disabled/></div><div id="${rowNo}_${dataRowDetails.id}Erorr"></div></td>`;

            //let arrayParentsSearch = [],
            //    modelFillSearch = {}, searchPlagindata = {},
            //    dataParentsSearchLength = 0,
            //    parentsSearch = "";

            //searchPlagindata = dataRowDetails.searchPlugin;

            //if (searchPlagindata.modelItems !== null) {
            //    dataParentsSearchLength = searchPlagindata.modelItems.length;
            //    for (var ix = 0; ix < dataParentsSearchLength; ix++) {
            //        parentsSearch = "";
            //        parentsSearch = searchPlagindata.modelItems[ix];
            //        arrayParentsSearch[ix] = `#${rowNo}_${parentsSearch}`;
            //    }
            //}

            //modelFillSearch = {
            //    row: rowNo,
            //    id: `${rowNo}_${dataRowDetails.id}`,
            //    searchUrl: searchPlagindata.searchUrl,
            //    modelItems: arrayParentsSearch,
            //    selectColumn: searchPlagindata.selectColumn,
            //    column: searchPlagindata.column,
            //    modalSize: searchPlagindata.modalSize,
            //    callBack: searchPlagindata.selectedCallBack
            //};
            //arraySearchs.push(modelFillSearch);
        }
        else if (dataRowDetails.inputType == "number" || dataRowDetails.inputType == "money" || dataRowDetails.inputType == "decimal") {
            outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><input autocomplete="off"  id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="true" class="form-control ${dataRowDetails.inputType}" ${+dataRowDetails.maxLength != 0 ? 'maxlength="' + dataRowDetails.maxLength + '"' : ''} onkeydown="eventTdTable(${rowNo},${j},event)"
                            value="${dataRowDetails.inputType == "money" ? ~~dataRow : ~~dataRow}" ${createValdtion(dataRowDetails.validations)} disabled/></td>`;
            modelSum[dataRowDetails.id] += ~~dataRow;
            //createSummery(modelSum);
        }
        else outputBody += `<td class="ex-ted" id="ex_${rowNo}_${j}" data-row="${rowNo}" data-col="${j}"><input autocomplete="off"  id="${rowNo}_${dataRowDetails.id}" type="text" data-editable="true" class="form-control" ${+dataRowDetails.maxLength != 0 ? 'maxlength="' + dataRowDetails.maxLength + '"' : ''}   onkeydown="eventTdTable(${rowNo},${j},event)" value="${dataRow}"${createValdtion(dataRowDetails.validations)} disabled/></td>`;
    }
    outputBody += `</tr>`;

    postMessage({ currentRow: i, resultTemplate: outputBody });
    i++;

}

function createValdtion(data) {

    if (data !== null) {

        let valdtionValue = "", dataLength;
        dataLength = data.length;
        if (+dataLength !== 0) {

            for (var i = 0; i < dataLength; i++)
                valdtionValue += data[i].validationName + '="" ';

            return valdtionValue.toString();
        }
        else
            return "";
    }
    else
        return "";
}