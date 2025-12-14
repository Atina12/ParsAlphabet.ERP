
var viewData_form_title = "کسورات مالیات تکلیفی",
    viewData_controllername = "PayrollTaxBracketApi",
    viewData_getpagetable_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getpage`,
    viewData_insrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/insert`,
    viewData_updrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/update`,
    viewData_deleterecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/delete`,
    viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getrecordbyid`,
    viewData_csv_url = `${viewData_baseUrl_HR}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.HR.Prn}PayrollTaxBracket.mrt`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    PayrollTaxBracketLine = [],
    startAmountByApi = "1";

$("#userType").on("change", function () {
    if ($(this).prop("checked"))
        pagetable_formkeyvalue = ["myadm", null];
    else
        pagetable_formkeyvalue = ["alladm", null];

    get_NewPageTableV1();

});



$("#stimul_preview").click(function () {
    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;


    var userId = null;
    if ($("#userType").prop("checked"))
        userId = getUserId();
    else
        userId = null;

    var reportParameters = [
        { Item: "PageNo", Value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "PageRowsCount", value: null, SqlDbType: dbtype.Int, Size: 0 },
        { Item: "Name", Value: null, SqlDbType: dbtype.NVarChar, Size: 0 },
        { Item: "CreateUserId", Value: userId, SqlDbType: dbtype.Int, Size: 0 },
    ]

    stimul_report(reportParameters);
});

$("#AddEditModal").on("shown.bs.modal", function () {

    if (modal_open_state == 'Add')
        setDefaultActiveCheckbox($("#isActive"));

});

$("#AddEditModalItems").on("show.bs.modal", function () {
});

$("#AddEditModalItems").on("hidden.bs.modal", function () {
    resetAddEditModalItems()
});

function initForm() {
    $("#stimul_preview")[0].onclick = null;

    $('#userType').bootstrapToggle();

    $(".button-items").prepend($(".toggle"));

    fill_select2(`${viewData_baseUrl_GN}/FiscalYearApi/getdropdown`, "fiscalYearId", true);

    pagetable_formkeyvalue = ["myadm", null];

    get_NewPageTableV1();
}

function export_csv(elemId = undefined) {

    var check = controller_check_authorize(viewData_controllername, "PRN");
    if (!check)
        return;

    if ($("#userType").prop("checked"))
        pagetable_formkeyvalue = ["myadm", null];
    else
        pagetable_formkeyvalue = ["alladm", null];


    $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", true);

    setTimeout(function () {
        let index = arr_pagetables.findIndex(v => v.pagetable_id == pagetable_id);

        if (csvModel == null) {
            csvModel = {
                filters: arrSearchFilter[index].filters,
                Form_KeyValue: pagetable_formkeyvalue
            }
        }

        $.ajax({
            url: viewData_csv_url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(csvModel),
            cache: false,
            success: function (result) {
                generateCsv(result);

                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            },
            error: function (xhr) {
                error_handler(xhr, viewData_csv_url);
                $(`#${elemId == undefined || elemId == null ? "exportCSV" : elemId}`).prop("disabled", false);
            }
        });
    }, 500);
}

function run_button_addpayrolltaxbracket(p_keyvalue, rowno, elem, ev) {
    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    var modal_name = null

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = "AddEditModalItems";

    $(".modal").find("#modal_title").text("ویرایش آیتم های " + viewData_form_title);

    $("#modal_keyid_value_item").text(p_keyvalue);
    $("#modal_keyid_caption_item").text("شناسه : ");

    let viewData_getrecord_url = `${viewData_baseUrl_HR}/${viewData_controllername}/payrolltaxbracketlinelist/${p_keyvalue}`;

    $.ajax({
        url: viewData_getrecord_url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            getStartAmount(p_keyvalue)
            Modal_fill_itemsNew(result.data);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function getStartAmount(headerId) {

    let url = `${viewData_baseUrl_HR}/${viewData_controllername}/getnewstartamount`

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

    let payrollTaxBracketLineList = result.payrollTaxBracketLineList;
    let newItems = [];
    if (checkResponse(payrollTaxBracketLineList)) {
        for (let i = 0; i < payrollTaxBracketLineList.length; i++) {
            newItems[i] = {
                id: payrollTaxBracketLineList[i].id,
                rowNumber: payrollTaxBracketLineList[i].rowNumber,
                startAmount: payrollTaxBracketLineList[i].startAmount,
                endAmount: payrollTaxBracketLineList[i].endAmount,
                taxPercentage: payrollTaxBracketLineList[i].taxPercentage
            }
        }
    }
    PayrollTaxBracketLine = newItems;
    listOfcountingPayrollTaxBracketLine();
}

function resetInputsRowPayrollTaxBracketLine() {
    $("#rowNumber").val("");
    $("#itemId").val("");
    getStartAmount(+$("#modal_keyid_value_item").text())
    $("#endAmount").val("");
    $("#taxPercentage").val("");
    $("#endAmount").focus();
}

function resetAddEditModalItems() {
    resetInputsRowPayrollTaxBracketLine()
    PayrollTaxBracketLine = []
    listOfcountingPayrollTaxBracketLine()
}

function saveUpdateRowPayrollTaxBracketLine(elm) {

    let id = +$("#itemId").val()
    let headerId = +$("#modal_keyid_value_item").text()
    let startAmount = +removeSep(startAmountByApi) /* +removeSep($("#startAmount").val())*/
    let endAmount = +removeSep($("#endAmount").val());
    let taxPercentage = +$("#taxPercentage").val();

    if (!checkResponse(startAmount) || startAmount == "") {
        var msgItem = alertify.warning("مبلغ شروع را وارد کنید");
        msgItem.delay(alertify_delay);
        $("#startAmount").focus();
        return
    }


    if (endAmount == 0) {
        var msg = alertify.warning("مبلغ پایانی نمی تواند صفر یا خالی باشد");
        msg.delay(alertify_delay);
        $("#endAmount").focus()
        return
    }

    if (startAmount >= endAmount) {
        var msg = alertify.warning("مبلغ شروع نمی تواند بزرگتر یا مساوی مبلغ پایانی باشد.");
        msg.delay(alertify_delay);
        $("#endAmount").focus()
        return
    }

    if (taxPercentage == 0) {
        var msg = alertify.warning("درصد نمی تواند خالی یا برابر صفر باشد.");
        msg.delay(alertify_delay);
        $("#taxPercentage").focus()
        return
    }

    if (taxPercentage > 100) {
        var msg = alertify.warning("درصد نمی تواند بزرگتر از 100 باشد.");
        msg.delay(alertify_delay);
        $("#taxPercentage").focus()
        return
    }

    let model = {
        id,
        headerId,
        startAmount,
        endAmount,
        taxPercentage
    }

    let viewData_insertpayrolltaxbracketline = `${viewData_baseUrl_HR}/${viewData_controllername}/insertpayrolltaxbracketline`;
    let viewData_updatepayrolltaxbracketline = `${viewData_baseUrl_HR}/${viewData_controllername}/updatepayrolltaxbracketline`;
    let url = model.id == 0 ? viewData_insertpayrolltaxbracketline : viewData_updatepayrolltaxbracketline

    $.ajax({
        url,
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
                //generateErrorValidation(result.validationErrors);

                let index = PayrollTaxBracketLine.findIndex(v => v.id == result.id);

                if (index == -1) {

                    model.id = result.id
                    PayrollTaxBracketLine.push(model)
                    getStartAmount(headerId)
                    listOfcountingPayrollTaxBracketLine()
                    resetInputsRowPayrollTaxBracketLine()
                }
                else {

                    PayrollTaxBracketLine[index].id = model.id
                    PayrollTaxBracketLine[index].headerId = model.headerId
                    PayrollTaxBracketLine[index].startAmount = model.startAmount
                    PayrollTaxBracketLine[index].endAmount = model.endAmount
                    PayrollTaxBracketLine[index].taxPercentage = model.taxPercentage

                    getStartAmount(headerId)
                    listOfcountingPayrollTaxBracketLine()
                    resetInputsRowPayrollTaxBracketLine()
                }
            }
            else {
                //var msg = alertify.error(result.statusMessage);
                //msg.delay(alertify_delay);
                generateErrorValidation(result.validationErrors);
                $("#endAmount").focus()
                //resetBracketInputs()

            }
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });


}

function listOfcountingPayrollTaxBracketLine() {

    $("#tableLine tbody").empty()

    let payrollTaxBracketLineReverse = PayrollTaxBracketLine;

    if (payrollTaxBracketLineReverse.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="6" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLine tbody").append(emptyStr)
    }
    else {
        for (var i = 0; i < payrollTaxBracketLineReverse.length; i++) {
            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`
            str += `<td style="width:8%;text-align:center">${i + 1}</td>`
            str += `<td style="width:8%;text-align:center">${payrollTaxBracketLineReverse[i].id}</td>`
            str += `<td style="width:26%" class="money">${transformNumbers.toComma(payrollTaxBracketLineReverse[i].startAmount)}</td>`
            str += `<td style="width:26%" class="money">${transformNumbers.toComma(payrollTaxBracketLineReverse[i].endAmount)}</td>`
            str += `<td style="width:20%">${payrollTaxBracketLineReverse[i].taxPercentage}</td>`
            str += `
                <td style="width:12% text-align="center">
                   <div style="display:flex;justify-content :center">
                        <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" 
                                onclick="deleteLine(this, ${i + 1}, event,
                            '${payrollTaxBracketLineReverse[i].id}',
                            '${payrollTaxBracketLineReverse[i].rowNumber}',
                            '${payrollTaxBracketLineReverse[i].startAmount}',
                            '${payrollTaxBracketLineReverse[i].endAmount}',
                             ${payrollTaxBracketLineReverse[i].taxPercentage})" 
                            class="btn maroon_outline" title="حذف">
                            <i class="fa fa-trash"></i>
                        </button>
                        <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine(this,${i + 1},'${payrollTaxBracketLineReverse[i].id}',event)" class="btn green_outline_1" title="ویرایش">
                            <i class="fa fa-edit"></i>
                        </button>
                   </div>
                </td>
                `
            str += `</tr>`

            $("#tableLine tbody").append(str)
        }

        $(`#AddEditModalItems tbody #rowItem1`).addClass("highlight");

    }

}

function deleteLine(elm, row, e, id, rowNumber, startAmount, endAmount, taxPercentage) {
    e.preventDefault()
    e.stopPropagation()

    const arr_ids = PayrollTaxBracketLine.map(item => +item.id);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    if (+id != +largestId) {
        var msg = alertify.warning("از آخرین سطر اجازه حذف دارید.");
        msg.delay(alertify_delay);
        return
    }

    let deleteModel = {
        headerId: +$("#modal_keyid_value_item").text(),
        rowNumber: +rowNumber,
        startAmount: +startAmount,
        endAmount: +endAmount,
        taxPercentage: +taxPercentage,
    }

    let viewData_deletepayrolltaxbracketline = `${viewData_baseUrl_HR}/${viewData_controllername}/deletepayrolltaxbracketline`

    $.ajax({
        url: viewData_deletepayrolltaxbracketline,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(deleteModel),
        async: false,
        cache: false,
        success: function (result) {
            if (result.successfull) {
                var msg = alertify.success(result.statusMessage);
                msg.delay(alertify_delay);
                PayrollTaxBracketLine.splice(row - 1, 1)
                listOfcountingPayrollTaxBracketLine()
                resetInputsRowPayrollTaxBracketLine()
            } else {
                var msg = alertify.error(result.statusMessage);
                msg.delay(alertify_delay);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_deletepayrolltaxbracketline)
        }
    });
}

function editLine(elm, row, id, e) {

    e.preventDefault()
    e.stopPropagation()

    const arr_ids = PayrollTaxBracketLine.map(item => +item.id);
    const largestId = arr_ids.reduce((a, b) => Math.max(a, b), -Infinity);

    let edit_url = `${viewData_baseUrl_HR}/${viewData_controllername}/getlinerecordbyid/${id}`

    $.ajax({
        url: edit_url,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        //data: JSON.stringify(+id),
        async: false,
        cache: false,
        success: function (result) {
            $("#rowNumber").val(row)
            $("#itemId").val(result.id)
            $("#startAmount").val(transformNumbers.toComma(result.startAmount))
            startAmountByApi = transformNumbers.toComma(result.startAmount)

            if (+id != +largestId) 
                $("#endAmount").val(transformNumbers.toComma(result.endAmount)).attr("disabled", "disabled")
            else
                $("#endAmount").val(transformNumbers.toComma(result.endAmount)).removeAttr("disabled")

            $("#taxPercentage").val(result.taxPercentage.toString());
            $(`#AddEditModalItems .highlight`).removeClass("highlight");
            $(`#AddEditModalItems tbody #rowItem${row}`).addClass("highlight");
        },
        error: function (xhr) {
            error_handler(xhr, edit_url)
        }
    });
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

initForm();