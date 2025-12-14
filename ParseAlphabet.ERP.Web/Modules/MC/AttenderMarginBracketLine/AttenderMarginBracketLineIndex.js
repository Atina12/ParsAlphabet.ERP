
var brackectList = [], startAmountByApi = "1";

$("#AddEditModalItems").on("show.bs.modal", function () {
    $("#priceTypeId").val(1).trigger("change")
});

$("#AddEditModalItems").on("hidden.bs.modal", function () {
    resetBracketAllItems()
});

$("#priceTypeId").on("change", function (e, callback) {

    let priceTypeId = $(this).val()

    if (priceTypeId == 1)
        $("#attenderCommissionValue").val("").attr("maxlength", 3)
    else
        $("#attenderCommissionValue").val("").attr("maxlength", 11)

})

function initAttenderMarginBracketLine() {
    $("#priceTypeId").select2()
    loadDrowpdown()
}

function loadDrowpdown() {
    fill_select2(`${viewData_baseUrl_HR}/OrganizationalDepartmentApi/getdropdown`, "departmentId", true);
    fill_select2(`api/GNApi/pricetypegetdropdown`, "priceTypeId", true);
}

function run_button_additem(p_keyvalue, rowno, elem, ev) {

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "AddEditModalItems";

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value_item").text(p_keyvalue);
    $("#modal_keyid_caption_item").text("شناسه : ");

    let url = `${viewData_baseUrl_MC}/AttenderMarginBracketLineApi/getpage`;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(p_keyvalue),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            getStartAmount(p_keyvalue)
            Modal_fill_itemsNew(result);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function getStartAmount(headerId) {

    let url = `${viewData_baseUrl_MC}/AttenderMarginBracketLineApi/getstartamount`

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(+headerId),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (result) {
            if (checkResponse(result)) {
                let startAmount = transformNumbers.toComma(result)
                $("#startAmount").val(startAmount)
                startAmountByApi = startAmount
            }
        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
}

function Modal_fill_itemsNew(result) {

    let getBrackectList = result
    let newItems = []

    if (checkResponse(getBrackectList)) {
        for (let i = 0; i < getBrackectList.length; i++) {
            newItems[i] = {
                id: getBrackectList[i].id,
                headerId: getBrackectList[i].headerId,
                startAmount: getBrackectList[i].startAmount,
                endAmount: getBrackectList[i].endAmount,
                priceTypeId: getBrackectList[i].priceTypeId,
                priceType: getBrackectList[i].priceType,
                attenderCommissionValue: getBrackectList[i].attenderCommissionValue,
                createUser: getBrackectList[i].createUser,
                createDateTimePersian: getBrackectList[i].createDateTimePersian
            }
        }
    }

    brackectList = newItems
    makeBracketList()
}

function makeBracketList() {

    $("#tableLine tbody").empty()

    let currentBrackectList = brackectList

    if (currentBrackectList.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="9" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLine tbody").append(emptyStr)
    }
    else {


        for (let i = 0; i < currentBrackectList.length; i++) {


            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:5%;text-align:center">${i + 1}</td>`
            str += `<td style="width:6%;text-align:center">${currentBrackectList[i].id}</td>`
            str += `<td style="width:14%">${transformNumbers.toComma(currentBrackectList[i].startAmount)}</td>`
            str += `<td style="width:14%">${transformNumbers.toComma(currentBrackectList[i].endAmount)}</td>`
            str += `<td style="width:10%">${currentBrackectList[i].priceType}</td>`
            str += `<td style="width:7%">${transformNumbers.toComma(currentBrackectList[i].attenderCommissionValue)}</td>`
            str += `<td style="width:18%; text-align:center" class="dir-ltr">${currentBrackectList[i].createDateTimePersian}</td>`
            str += `<td style="width:15%">${currentBrackectList[i].createUser}</td>`


            str += `
                <td style="width:10% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine(${i + 1},'${currentBrackectList[i].id}',event)" class="btn maroon_outline" title="حذف"><i class="fa fa-trash"></i></button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine(event,${i + 1},${currentBrackectList[i].id})" class="btn green_outline_1" title="ویرایش"><i class="fa fa-edit"></i></button>
                   </div>
                </td>
                `
            str += `</tr>`

            $("#tableLine tbody").append(str)
        }



        $(`#AddEditModalItems tbody #rowItem1`).addClass("highlight");
        //$("#endAmount").focus()
    }

}

function saveUpdateRow(elm) {

    let model = {
        id: +$("#rowId").val(),
        headerId: +$("#modal_keyid_value_item").text(),
        rowNumber: 0,
        startAmount: +removeSep(startAmountByApi),
        endAmount: +removeSep($("#endAmount").val()),
        priceTypeId: +$("#priceTypeId").val(),
        attenderCommissionValue: +removeSep($("#attenderCommissionValue").val()),
        createDateTimePersian: $("#createDateTimePersian").val(),
        createUser: $("#createUserFullName").val()
    }

    let priceTypeText = $("#priceTypeId option:selected").text();


    if (model.startAmount == 0) {
        var msg = alertify.warning("شروع مبلغ نمی تواند صفر یا خالی باشد.");
        msg.delay(alertify_delay);
        $("#endAmount").focus()
        return
    }

    if (model.endAmount == 0) {
        var msg = alertify.warning("مبلغ پایانی نمی تواند صفر یا خالی باشد");
        msg.delay(alertify_delay);
        $("#endAmount").focus()
        return
    }

    if (model.startAmount >= model.endAmount) {
        var msg = alertify.warning("مبلغ شروع نمی تواند بزرگتر یا مساوی مبلغ پایانی باشد.");
        msg.delay(alertify_delay);
        $("#endAmount").focus()
        return
    }

    if (!checkResponse(model.priceTypeId) || model.priceTypeId == "") {
        var msg = alertify.warning("مبنای نرخ را وارد کنید.");
        msg.delay(alertify_delay);
        $("#priceTypeId").select2("focus")
        return
    }

    if (model.priceTypeId == 1) {
        if (model.attenderCommissionValue == 0) {
            var msg = alertify.warning("درصد نمی تواند برابر صفر باشد.");
            msg.delay(alertify_delay);
            $("#attenderCommissionValue").focus()
            return
        }

        if (model.attenderCommissionValue > 100) {
            var msg = alertify.warning("درصد نمی تواند بزرگتر از 100 باشد.");
            msg.delay(alertify_delay);
            $("#attenderCommissionValue").focus()
            return
        }
    }
    else {
        if (model.attenderCommissionValue == 0) {
            var msg = alertify.warning("نرخ نمی تواند برابر صفر باشد.");
            msg.delay(alertify_delay);
            $("#attenderCommissionValue").focus()
            return
        }
    }

    if (brackectList.length != 0) {
        let checkPriceType1 = brackectList.find(item => item.priceTypeId == 2)
        let checkPriceType2 = brackectList.find(item => item.priceTypeId == 1)


        if (checkResponse(checkPriceType1)) {
            var msg = alertify.warning("یک سطر با مبنای  نرخ ثبت شده است , سطر دیگری نمی توانید اضافه کنید.");
            msg.delay(alertify_delay);
            $("#priceTypeId").select2("focus")
            return
        }
        if (checkResponse(checkPriceType2)) {
            if (model.priceTypeId == 2) {
                var msg = alertify.warning("فقط می توانید مبنای  درصد ذخیره کنید");
                msg.delay(alertify_delay);
                $("#priceTypeId").select2("focus")
                return
            }
        }
    }


    let url = `${viewData_baseUrl_MC}/AttenderMarginBracketLineApi/${model.id == 0 ? "insert" : "update"}`;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);

                let index = brackectList.findIndex(v => v.id == result.id);

                if (index == -1) {

                    model.priceType = priceTypeText
                    model.id = result.id
                    brackectList.push(model)
                    getStartAmount(model.headerId)
                    makeBracketList()
                    resetBracketInputs()
                }
                else {
                    brackectList[index].startAmount = model.startAmount
                    brackectList[index].endAmount = model.endAmount
                    brackectList[index].priceTypeId = model.priceTypeId
                    brackectList[index].priceType = priceTypeText
                    brackectList[index].attenderCommissionValue = model.attenderCommissionValue
                    brackectList[index].createDateTimePersian = model.createDateTimePersian
                    brackectList[index].createUser = model.createUser
                    getStartAmount(model.headerId)
                    makeBracketList()
                    resetBracketInputs()
                    return;
                }
            }
            else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                $("#endAmount").focus()
                return
                //resetBracketInputs()

            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function deleteLine(row, id, e) {
    e.preventDefault()
    e.stopPropagation()

    const arr_ids = brackectList.map(item => +item.id);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    if (+id != +largestId) {
        var msg = alertify.warning("از آخرین سطر اجازه حذف دارید.");
        msg.delay(alertify_delay);
        return
    }

    //if (brackectList[row] != undefined) {
    //    var msg = alertify.warning("از آخرین سطر اجازه حذف دارید.");
    //    msg.delay(alertify_delay);
    //    return
    //}

    let url = `${viewData_baseUrl_MC}/AttenderMarginBracketLineApi/delete`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+id),
        async: false,
        cache: false,
        success: function (result) {

            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                brackectList.splice(row - 1, 1)
                makeBracketList()
                resetBracketInputs()
                getStartAmount(+$("#modal_keyid_value_item").text())
            }
            else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
                resetInputsRowUnits()
            }

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function editLine(e, row, id) {
    e.preventDefault()
    e.stopPropagation()

    const arr_ids = brackectList.map(item => +item.id);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    let url = `${viewData_baseUrl_MC}/AttenderMarginBracketLineApi/getrecordbyid`

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(+id),
        async: false,
        cache: false,
        success: function (result) {

            $("#rowNumber").val(+row)
            $("#rowId").val(result.id)
            $("#startAmount").val(transformNumbers.toComma(result.startAmount))
            startAmountByApi = transformNumbers.toComma(result.startAmount)

            if (+id != +largestId)
                $("#endAmount").val(transformNumbers.toComma(result.endAmount)).attr("disabled", "disabled")
            else
                $("#endAmount").val(transformNumbers.toComma(result.endAmount)).removeAttr("disabled")


            $("#priceTypeId").val(result.priceTypeId).trigger("change")
            $("#attenderCommissionValue").val(transformNumbers.toComma(result.attenderCommissionValue))
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row}`).addClass("highlight");
            $("#priceTypeId").select2("focus")

        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function resetBracketInputs() {
    $("#rowNumber").val("")
    $("#rowId").val("")
    $("#endAmount").val("").removeAttr("disabled")
    $("#priceTypeId").val(1).trigger("change")
    $("#attenderCommissionValue").val("")
    $("#endAmount").focus()
}

function resetBracketAllItems() {
    resetBracketInputs()
    brackectList = []
    makeBracketList()
}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function new_tr_Highlight(row) {
    $(`#AddEditModalItems .highlight`).removeClass("highlight");
    $(`#AddEditModalItems tbody #rowItem${row}`).addClass("highlight");
    $(`#AddEditModalItems tbody #rowItem${row}`).focus();
}

function newTrOnkeydown(elm, ev, row) {
    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#AddEditModalItems tbody #rowItem${row - 1}`).length != 0) {
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row - 1}`).addClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row - 1}`).focus();
        }

    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#AddEditModalItems tbody #rowItem${row + 1}`).length != 0) {
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row + 1}`).addClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row + 1}`).focus();
        }
    }
}

initAttenderMarginBracketLine()