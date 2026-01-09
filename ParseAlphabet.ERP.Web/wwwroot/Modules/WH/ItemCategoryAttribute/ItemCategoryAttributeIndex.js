var viewData_form_title = "صفات کالا / خدمت";
var viewData_controllername = "ItemCategoryAttributeApi";
var itemAttributeLinesForAddAndDelete = [];
var saveColumnsForLine = ""

$("#listCategory").on("click", function () {
    navigation_item_click('/WH/ItemCategory', 'دسته بندی کالا و خدمات');
});

async function init() {
    let itemCategoryId = +$("#itemCategoryId").val()
    $("#showId").text(itemCategoryId)

    let url1 = "api/WH/ItemCategoryAttributeApi/getlist_itemattributeline"
    await $.ajax({
        url: url1,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(itemCategoryId),
        cache: false,
        success: function (result) {
            $("#tableLineTheadColumns").html("")
            $("#tableLineTheadFields").html("")
            fillTableLineTheadColumns(result.data)
            fillTableLineTheadFields(result.data)
        },
        error: function (xhr) {
            error_handler(xhr, url1)
        }
    });
}

function callbackForFillTableLineTbodyLines() {
    
    let itemCategoryId = +$("#itemCategoryId").val()
    let url2 = "api/WH/ItemCategoryAttributeApi/getlist_baseitemattribute"
    $.ajax({
        url: url2,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(itemCategoryId),
        async: false,
        cache: false,
        success: function (result) {

            itemAttributeLinesForAddAndDelete = []
            itemAttributeLinesForAddAndDelete = result
            fillTableLineTbodyLines()
        },
        error: function (xhr) {
            error_handler(xhr, url2)
        }
    });
}

function fillTableLineTheadColumns(itemAttributeLines) {
    let strTableLineTheadColumns = ""
    let repeatColumns = []
    strTableLineTheadColumns += "<tr>"
    strTableLineTheadColumns += "<th>شناسه</th>"
    for (let i = 0; i < itemAttributeLines.length; i++) {
        if (repeatColumns.length != 0) {
            let checkRepeat = repeatColumns.filter((itemAttributeId) => itemAttributeId == itemAttributeLines[i].itemAttributeId)
            if (checkRepeat.length == 0) {
                repeatColumns.push(itemAttributeLines[i].itemAttributeId)
                strTableLineTheadColumns += `<th>${itemAttributeLines[i].itemAttributeName}</th>`
            }
        } else {
            repeatColumns.push(itemAttributeLines[i].itemAttributeId)
            strTableLineTheadColumns += `<th>${itemAttributeLines[i].itemAttributeName}</th>`
        }
    }
    strTableLineTheadColumns += "<th>عملیات</th>"
    strTableLineTheadColumns += "</tr>"
    $("#tableLineTheadColumns").html(strTableLineTheadColumns)
}

function fillTableLineTheadFields(itemAttributeLines, callback) {
    let strtableLineTheadFields = ""
    let repeatColumns = []
    let tabindex = 1
    let width = ""

    strtableLineTheadFields += "<tr>"
    strtableLineTheadFields += '<th style="width:5%"><input id="idNumber" type="text" class="form-control " maxlength="50" disabled="" autocomplete="off"></th>'

    for (let i = 0; i < itemAttributeLines.length; i++) {
        if (repeatColumns.length != 0) {
            let checkRepeat = repeatColumns.filter((itemAttributeId) => itemAttributeId == itemAttributeLines[i].itemAttributeId)
            if (checkRepeat.length == 0) {
                repeatColumns.push(itemAttributeLines[i].itemAttributeId)
                tabindex++
            }
        } else {
            repeatColumns.push(itemAttributeLines[i].itemAttributeId)
            tabindex++
        }
    }

    tabindex = saveColumnsForLine = tabindex - 1
    width = (100 / saveColumnsForLine) + "%"

    tabindex = 1
    repeatColumns = []
    for (let i = 0; i < itemAttributeLines.length; i++) {
        let id = itemAttributeLines[i].itemAttributeId
        let name = itemAttributeLines[i].itemAttributeName
        if (repeatColumns.length != 0) {
            let checkRepeat = repeatColumns.filter((itemAttributeId) => itemAttributeId == itemAttributeLines[i].itemAttributeId)
            if (checkRepeat.length == 0) {
                repeatColumns.push(itemAttributeLines[i].itemAttributeId)
                strtableLineTheadFields += `<th id="th_${tabindex}" style="width:${width}"><select id="select_id_${tabindex}" itemattributeid="${id}" itemAttributeName="${name}" data-placeholder="انتخاب کنید" class="form-control select2" propIndex="${tabindex}" onchange="inputOnchange(this,${tabindex})" tabindex="${tabindex}" disabled></select></th>`
                tabindex++
            }
        } else {
            repeatColumns.push(itemAttributeLines[i].itemAttributeId)
            strtableLineTheadFields += `<th id="th_${tabindex}" style="width:${width}"><select id="select_id_${tabindex}" itemattributeid="${id}" itemAttributeName="${name}" data-placeholder="انتخاب کنید" class="form-control select2" propIndex="${tabindex}" onchange="inputOnchange(this,${tabindex})" tabindex="${tabindex}" disabled></select></th>`
            tabindex++
        }
    }
    strtableLineTheadFields += `
                                <th style="width:5%">
                                    <div style="display:flex;justify-content:center;width:100%">
                                        <button id="saveRow" type="button" onclick="saveUpdateRow(this)" class="btn blue_outline_1 pa float-sm-right" style="word-break:initial" tabindex="${tabindex}">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                        <button id="resetInputs" type="button" onclick="resetInputsRow(this)" class="btn btn-outline-danger pa mr-2 float-sm-right" tabindex="${tabindex + 1}">
                                            <i class="fa fa-times"></i>
                                        </button>
                                    </div>
                                </th>
                                `
    strtableLineTheadFields += "</tr>"
    $("#tableLineTheadFields").html(strtableLineTheadFields)
    $("#tableLineTheadFields select").select2()
    $("#tableLineTheadFields select[propindex=1]").select2("focus")

    $('#tableLineTheadFields select').each(function () {
        if (this.type != "hidden") {
            if ($(this).attr("propIndex") == 1) {
                $(this).prop("disabled", false)
            }

            let itemattributeid = $(this).attr("itemattributeid")
            let filterById = itemAttributeLines.filter(item => item.itemAttributeId == itemattributeid)
            if (filterById.length != 0) {

                let str = "<option value='0'>انتخاب کنید</option>"
                for (let i = 0; i < filterById.length; i++) {

                    if (filterById[i].itemAttributeId === 3 || filterById[i].itemAttributeId === 4)
                        str += `<option value="${filterById[i].itemAttributeLineId}">${filterById[i].itemAttributeLineId} - ${filterById[i].itemAttributeLineName.replace('.', '/')}</option>`
                    else
                        str += `<option value="${filterById[i].itemAttributeLineId}">${filterById[i].itemAttributeLineId} - ${filterById[i].itemAttributeLineName}</option>`

                }
                let id = $(this).attr("id")
                $(`#${id}`).append(str)
            }
        }
    });
}

function fillTableLineTbodyLines() {
    
    $("#tableLineTbodyLines").html("")
    let columns = saveColumnsForLine
    let columnsWidth = (100 / columns) + "%"

    if (itemAttributeLinesForAddAndDelete.length === 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="${columns + 2}" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLineTbodyLines").append(emptyStr)
    } else {
        for (let i = 0; i < itemAttributeLinesForAddAndDelete.length; i++) {

            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:5%;text-align:center">${i + 1}</td>`
            for (let j = 1; j <= columns; j++) {
                let Attribute = itemAttributeLinesForAddAndDelete[i][`Attribute${j - 1}`];
                let AttributeName = itemAttributeLinesForAddAndDelete[i][`AttributeName${j - 1}`];

                str += `<td id="td_row${i}_columns${j}" style="width:${columnsWidth};text-align:center">${Attribute} - ${AttributeName}</td>`
            }

            str += `
                <td style="width:5% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine(this,event,${i + 1})" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                   </div>
                </td>
                `
            str += `</tr>`
            $("#tableLineTbodyLines").append(str)
        }

        $(`#tableLineTbodyLines #rowItem1`).addClass("highlight");

    }
    resetInputsRow()
}

function resetInputsRow(elm) {
    $("#tableLineTheadFields th select[itemattributeid =1]").prop('selectedIndex', 0).trigger("change")
    $("#tableLineTheadFields th select[itemattributeid =1]").select2("focus")
}

function deleteLine(elm, e, row) {
    e.preventDefault()
    e.stopPropagation()
    let stirngOfVal = ""

    $(`#tableLineTbodyLines #rowItem${row} td`).each(function () {
        if (this.type != "hidden") {
            if (checkResponse($(this).attr("id"))) {
                stirngOfVal += $(this).text().split("-")[0].trim() + ","
            }
        }
    });

    stirngOfVal = stirngOfVal.substring(0, stirngOfVal.length - 1)

    model = {
        itemCategoryId: +$("#itemCategoryId").val(),
        itemAttributeLineIds: stirngOfVal
    }

    let url = "api/WH/ItemCategoryAttributeApi/delete_itemattributeline"
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                $("#tableLineTbodyLines").html("")
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                itemAttributeLinesForAddAndDelete.splice(row - 1, 1)
                fillTableLineTbodyLines()
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function saveUpdateRow(elm) {
    
    let model = {},
        modelForShow = {},
        arrOfVal = [],
        arrOfValIndex = 0,
        stopFunction = false,
        arrOfText = [],
        stirngOfVal = "";

    $('#tableLineTheadFields select').each(function () {
        if (this.type != "hidden") {

            let selectId = $(this).attr("id")
            let selectVal = $(this).val()
            let selectText = $(`#${selectId} option:selected`).text()
            let selectItemattributename = $(`#${selectId}`).attr("itemattributename")

            arrOfVal[arrOfValIndex] = selectVal
            arrOfText[arrOfValIndex] = selectText
            if (selectVal != null && selectVal == 0) {
                var msg = alertify.warning(`${selectItemattributename} را وارد کنید`);
                msg.delay(alertify_delay);
                $(`#${selectId}`).select2("focus")
                stopFunction = true
                return false
            }
            arrOfValIndex++
        }
    })

    if (stopFunction) return

    for (let i = 0; i < arrOfVal.length; i++) {
        if (checkResponse(arrOfVal[i + 1]))
            stirngOfVal += `${arrOfVal[i]},`
        else
            stirngOfVal += `${arrOfVal[i]}`
    }

    model = {
        itemCategoryId: +$("#itemCategoryId").val(),
        itemAttributeLineIds: stirngOfVal
    }

    let countOfSelect = 0
    $('#tableLineTheadFields select').each(function () {
        if (this.type != "hidden") {
            let id = $(this).attr("id")
            let itemattributeid = $(this).attr("itemattributeid")
            let itemattributename = $(this).attr("itemattributename")
            modelForShow[`Attribute${countOfSelect}`] = $(this).val()
            modelForShow[`ItemAttributeId${countOfSelect}`] = itemattributeid

            //if (itemattributeid == 6)
            //    modelForShow[`AttributeName${countOfSelect}`] = sex1[$(`#${id} option:selected`).text().split("-")[1].trim()]
            //else
            modelForShow[`AttributeName${countOfSelect}`] = $(`#${id} option:selected`).text().split("-")[1].trim()
            countOfSelect++
        }
    });

    let url = "api/WH/ItemCategoryAttributeApi/insert_itemattributeline"
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {
 
            if (result.successfull) {
                $("#tableLineTbodyLines").html("")

                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                itemAttributeLinesForAddAndDelete.push(modelForShow)
                fillTableLineTbodyLines()
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                $("#tableLineTheadFields th select[itemattributeid=1]").select2("focus")
            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function inputOnchange(elm, tabindex) {
    let currentELmVal = $(elm).val()
    if (currentELmVal != 0) {
        $('#tableLineTheadFields select').each(function () {
            if (this.type != "hidden") {
                if ($(this).attr("propIndex") == tabindex + 1) {
                    $(this).val("0").trigger("change")
                    $(this).prop("disabled", false)
                }
            }
        });
    } else {
        $('#tableLineTheadFields select').each(function () {
            if (this.type != "hidden") {
                if ($(this).attr("propIndex") == tabindex + 1) {
                    $(this).val("0").trigger("change")
                    $(this).prop("disabled", true)
                }
            }
        });
    }
}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
    $(`#tableLineTbodyLines #rowItem${row}`).addClass("highlight");
    $(`#tableLineTbodyLines #rowItem${row}`).focus();
}

function newTrOnkeydown(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#tableLineTbodyLines #rowItem${row - 1}`).length != 0) {
            $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableLineTbodyLines #rowItem${row - 1}`).addClass("highlight");
            $(`#tableLineTbodyLines #rowItem${row - 1}`).focus();
        }

    } else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#tableLineTbodyLines #rowItem${row + 1}`).length != 0) {
            $(`#tableLineTbodyLines .highlight`).removeClass("highlight");
            $(`#tableLineTbodyLines #rowItem${row + 1}`).addClass("highlight");
            $(`#tableLineTbodyLines #rowItem${row + 1}`).focus();
        }
    }
}

init().then((result) => {
    callbackForFillTableLineTbodyLines()
})
