
var viewData_form_title = "بیمه ها";
var viewData_controllername = "InsuranceApi";
var viewData_getpagetable_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`;
var viewData_filter_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`;
var insuranceBoxList = [], form = $('#AddEditModal .modal-body').parsley();
var viewData_print_file_url = `${stimulsBaseUrl.MC.Prn}Insurance.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "";
var viewData_csv_url = `${viewData_baseUrl_MC}/${viewData_controllername}/csv`;
var insurerTypeId = 0
var insurerId = 0

function initInsurance() {
    get_NewPageTableV1();
    bindInsuranceTerminology();
}

function run_button_insurerPatient(insurerid, rowNo, elm, ev) {


    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;


    var index = arr_pagetables.findIndex(v => v.pagetable_id == "insurerPatient_pagetable");
    pagetable_formkeyvalue = [0];

    if (index == -1) {
        var pgt_servicePricing = {
            pagetable_id: "insurerPatient_pagetable",
            editable: true,
            pagerowscount: 15,
            endData: false,
            pageNo: 0,
            currentpage: 1,
            currentrow: 1,
            currentcol: 0,
            highlightrowid: 0,
            trediting: false,
            pagetablefilter: false,
            getpagetable_url: `${viewData_baseUrl_MC}/InsurerPatientApi/getpage`,
            lastPageloaded: 0,
        }

        arr_pagetables.push(pgt_servicePricing);
    }
    else {
        arr_pagetables[index].filteritem = "";
        arr_pagetables[index].filtervalue = "";
        arr_pagetables[index].editable = true;
        arr_pagetables[index].pagerowscount = 15;
        arr_pagetables[index].endData = false;
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
        arr_pagetables[index].currentrow = 1;
        arr_pagetables[index].currentcol = 0;
        arr_pagetables[index].highlightrowid = 0;
        arr_pagetables[index].trediting = false;
        arr_pagetables[index].pagetablefilter = false;
        arr_pagetables[index].lastPageloaded = 0;
    }

    insurerId = insurerid;
    $(".InsurerCodeModal").text(insurerId)
    $(".InsurerNameModal").text($(`#pagetable .pagetablebody #row${rowNo}`).data("name"))
    $(".InsurerTypeModal").text($(`#pagetable .pagetablebody #row${rowNo}`).data("insurertype"))

    insurerTypeId = ($(`#pagetable .pagetablebody #row${rowNo}`).data("insurertypeid"))

    var filterIndex = arrSearchFilter.findIndex(v => v.pagetable_id == "insurerPatient_pagetable");


    if (filterIndex != -1) {
        arrSearchFilter[filterIndex].filters = []
        arrSearchFilterSelect2ajax[filterIndex].filters = []

    }

    pagetable_formkeyvalue[1] = 0;
    pagetable_formkeyvalue[2] = insurerId;



    get_NewPageTableV1("insurerPatient_pagetable", false, () => {
        modal_show("insurerPatientModal")
        $("#selectedPatinet").select2("focus")
        setTimeout(() => {
            $("#insurerPatient_pagetable  .pagetablebody tbody  #row1").focus()
        },400)
     
    })

    patient_init(insurerId, insurerTypeId);

}

function fillInsurerTypeId(type) {

    var data = {
        id: 0,
        text: 'انتخاب کنید'
    };

    var newOption1 = new Option(data.text, data.id, true, true);

    $('#insurerTypeId').append(newOption1).trigger('change')

    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getinsurertypedropdown`, "insurerTypeId", true);

    if (type == 'add') {
        $('#insurerTypeId option[value="1"]').remove();
        $('#insurerTypeId option[value="2"]').remove();
        $('#insurerTypeId').trigger("change")
    }

}

function newConfigByAddOrEdit(type) {

    if (type == 'edit') {

        let insurerTypeId = $("#insurerTypeId").val()

        if (insurerTypeId == 1 || insurerTypeId == 2) {
            $("#name").attr("disabled", "disabled")
            $("#insurerTerminologyId").attr("disabled", "disabled")
            $("#tableLine thead tr th:last-child").css("display", "none")
            $("#tableLine tbody tr td:last-child").css("display", "none")
            $("#boxName").attr("disabled", "disabled")
            $("#insuranceBoxTerminologyId").attr("disabled", "disabled")
            $("#isActiveBox").attr("disabled", "disabled")
            $("#isActive").parent(".funkyradio ").focus()
            if (insuranceBoxList.length == 0) {
                $("#tableLine tbody").html(`<tr><td colspan="5" style="text-align:center">سطری وجود ندارد</td></tr>`)
            }
        }
    }

}

async function bindInsuranceTerminology() {
    var data = {
        id: 0,
        text: 'انتخاب کنید'
    };

    var newOption2 = new Option(data.text, data.id, true, true);

    $('#insurerTerminologyId').append(newOption2).trigger('change');

    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getinsurerterminologydropdown`, "insurerTerminologyId", true);
    fill_select2(`${viewData_baseUrl_MC}/${viewData_controllername}/getinsuranceboxterminologydropdown`, "insuranceBoxTerminologyId", true);
}

async function saveInsurance() {

    var validate = form.validate();
    validateSelect2(form);
    if (!validate) return;



    if ($("#insurerTypeId").val() == 1 || $("#insurerTypeId").val() == 2) {

        if (insuranceBoxList.length == 0) {
            var msgError = alertify.warning("صندوق بیمه را وارد کنید.");
            msgError.delay(alertify_delay);
            $("#boxName").focus()
            return
        }
    }

    if ($("#insurerTypeId").val() == 4 || $("#insurerTypeId").val() == 5) {

        if ($("#insurerTerminologyId").val() != 0) {
            var msgError = alertify.warning("با توجه به نوع بیمه ترمینولوژی اجاره ثبت ندارد.");
            msgError.delay(alertify_delay);
            return
        }

        if (insuranceBoxList.length > 0) {
            var msgError = alertify.warning("با توجه به نوع بیمه صندوق بیمه اجازه ثبت ندارد.");
            msgError.delay(alertify_delay);
            return
        }
    }

    let newInsuranceBoxList = []
    let insurerTypeId = +$("#insurerTypeId").val()
    let insurerTerminologyId = $("#insurerTerminologyId").val()

    if (insurerTypeId == 4 || insurerTypeId == 5)
        insurerTerminologyId = null


    for (let i = 0; i < insuranceBoxList.length; i++) {

        let newInsuranceBoxListModel = {
            id: insuranceBoxList[i].id,
            name: insuranceBoxList[i].name.trim(),
            insuranceBoxTerminologyId: insuranceBoxList[i].insuranceBoxTerminologyId,
            isActive: insuranceBoxList[i].isActive,
            insurerId: +insuranceBoxList[i].insurerId
        }

        newInsuranceBoxList.push(newInsuranceBoxListModel)
    }

    var model = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        insurerTypeId,
        insurerTerminologyId,
        isActive: $("#isActive").prop("checked"),
        insuranceBoxList: newInsuranceBoxList,
    };

    saveInsurerAsync(model)
        .then(async (data) => {
            if (data.successfull) {
                var msgError = alertify.success(data.statusMessage);
                msgError.delay(alertify_delay);
                modal_close()

                setTimeout(() => {
                    $("#saveForm").removeAttr("disabled")
                }, 500)

                get_NewPageTableV1()
            }
            else {
                //var msgError = alertify.error(data.statusMessage);
                //msgError.delay(alertify_delay);
                if (data.validationErrors !== undefined)
                    generateErrorValidation(data.validationErrors)
            }
        })
}

function modelAppendInsuranceBox() {

    let rowNumber = +$("#rowNumber").val()

    //add
    if (rowNumber == 0) {

        let model = {
            id: 0,
            name: $("#boxName").val().trim(),
            insuranceBoxTerminologyId: $("#insuranceBoxTerminologyId").val(),
            insuranceBoxTerminologyName: $("#insuranceBoxTerminologyId option:selected").text(),
            isActive: $("#isActiveBox").prop("checked"),
            insurerId: +$("#modal_keyid_value").text()
        }

        insuranceBoxList.push(model)
        listOfItems();
    }
    //edit
    else {

        insuranceBoxList[rowNumber - 1].name = $("#boxName").val().trim()
        insuranceBoxList[rowNumber - 1].insuranceBoxTerminologyId = $("#insuranceBoxTerminologyId").val()
        insuranceBoxList[rowNumber - 1].insuranceBoxTerminologyName = $("#insuranceBoxTerminologyId option:selected").text()
        insuranceBoxList[rowNumber - 1].isActive = $("#isActiveBox").prop("checked")

        listOfItems();
    }
}

async function saveInsurerAsync(model) {

    //`${viewData_baseUrl_MC}/${viewData_controllername}/update`

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/save`
    $("#saveForm").prop("disabled", true)

    let result = await $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {
            return data;
        },
        error: function (xhr) {

            setTimeout(() => {
                $("#saveForm").removeAttr("disabled")
            }, 500)
            error_handler(xhr, url);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

    return result;
}

function listOfItems() {

    $("#tableLine tbody").empty()

    if (insuranceBoxList.length == 0) {
        let emptyStr = `
                        <tr>
                             <td colspan="6" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
        $("#tableLine tbody").append(emptyStr)
    }
    else {

        for (let i = 0; i < insuranceBoxList.length; i++) {

            let str = `<tr id='rowItem${i + 1}' onclick="newTrOnclick(${i + 1})" onkeydown="newTrOnkeydown(this,event,${i + 1})" tabindex="-1">`

            str += `<td style="width:6%" class="text-center">${i + 1}</td>`
            str += `<td style="width:31%">${insuranceBoxList[i].name}</td>`
            str += `<td style="width:31%">${insuranceBoxList[i].insuranceBoxTerminologyName}</td>`
            str += `<td style="width:22%">${insuranceBoxList[i].isActive == true ? "فعال" : "غیرفعال"}</td>`


            str += `
                    <td style="width:10% text-align="center">
                       <div style="display:flex;justify-content :center">
                            <button id='rowItemDelete${i + 1}' type="button" style="margin-left: 4px;padding: 4px 8px 2px 8px  !important;font-size:11px !important" id="btn_delete" onclick="deleteLine(this,${i + 1},event)" class="btn maroon_outline rowItemDelete" title="حذف"><i class="fa fa-trash"></i></button>
                            <button type="button" style="padding: 4px 6px 2px 6px !important;font-size:11px !important" id="btn_edit" onclick="editLine(this,${i + 1},'${insuranceBoxList[i].name}',${insuranceBoxList[i].insuranceBoxTerminologyId},${insuranceBoxList[i].isActive},event)" class="btn green_outline_1 rowItemEdit" title="ویرایش"><i class="fa fa-edit"></i></button>
                       </div>
                    </td>
                `;

            str += `</tr>`;

            $("#tableLine tbody").append(str)
        }

        $(`#AddEditModal tbody #rowItem1`).addClass("highlight");
        resetInputsBox()
    }
}

function deleteLine(elm, row, e) {
    e.preventDefault()
    e.stopPropagation()

    if (insurerTypeId == 1 || insurerTypeId == 2) {
        var msgItem = alertify.warning("نوع بیمه نمی تواند اجباری یا تکمیلی باشد امکان حذف ندارید.");
        msgItem.delay(alertify_delay);
        return
    }

    if (insurerTypeId == 4 || insurerTypeId == 5) {
        var msgItem = alertify.warning("نوع بیمه نمی تواند طرف قرارداد یا تخفیف باشد امکان حذف ندارید.");
        msgItem.delay(alertify_delay);
        return
    }

    insuranceBoxList.splice(row - 1, 1)
    listOfItems()
}

function editLine(elm, rowNumber, name, insuranceBoxTerminologyId, isActive, e) {
    e.preventDefault()
    e.stopPropagation()



    if (insurerTypeId == 1 || insurerTypeId == 2) {
        var msgItem = alertify.warning("نوع بیمه نمی تواند اجباری یا تکمیلی باشد امکان ویرایش ندارید.");
        msgItem.delay(alertify_delay);
        return
    }

    if (insurerTypeId == 4 || insurerTypeId == 5) {
        var msgItem = alertify.warning("نوع بیمه نمی تواند اجباری یا تکمیلی باشد امکان ویرایش ندارید.");
        msgItem.delay(alertify_delay);
        return
    }

    $("#rowNumber").val(rowNumber);
    $("#boxName").val(name)
    $("#insuranceBoxTerminologyId").val(insuranceBoxTerminologyId).trigger("change")
    $("#isActiveBox").prop("checked", isActive).trigger("change")
    $("#boxName").focus()
    $(`#AddEditModal tbody tr`).removeClass("highlight");

}

function run_button_edit(p_keyvalue) {
    var check = controller_check_authorize(viewData_controllername, "UPD")
    if (!check)
        return;

    fillInsurerTypeId('edit')

    var modal_name = null

    $("#insurerTypeId").prop("disabled", true)

    $("#rowKeyId").removeClass("d-none");
    if (modal_name == null)
        modal_name = modal_default_name;

    $(".modal").find("#modal_title").text("ویرایش " + viewData_form_title);

    $("#modal_keyid_value").text(p_keyvalue);
    $("#modal_keyid_caption").text("شناسه : ");

    let url = `${viewData_baseUrl_MC}/${viewData_controllername}/getrecordbyid`
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {
            modal_open_state = 'Edit';
            modal_clear_items(modal_name);
            modal_fill_items(result.data, modal_name);
            modal_show(modal_name);
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function modal_fill_items(item, modal_name = null,) {

    if (!item) return;
    if (modal_name == null)
        modal_name = modal_default_name;

    $("#name").val(item.name);
    $("#insurerTypeId").val(item.insurerTypeId).trigger("change");

    $("#insurerTerminologyId").val(item.insurerTerminologyId == null ? 0 : item.insurerTerminologyId).trigger("change");
    $("#isActive").prop("checked", item.isActive).trigger("change");

    let newInsuranceBoxList = item.insuranceBoxList

    if (checkResponse(newInsuranceBoxList)) {

        for (let i = 0; i < newInsuranceBoxList.length; i++) {

            let newInsuranceBoxListModel = {
                id: newInsuranceBoxList[i].id,
                name: newInsuranceBoxList[i].name,
                insuranceBoxTerminologyName: newInsuranceBoxList[i].insuranceBoxTerminology,
                insuranceBoxTerminologyId: newInsuranceBoxList[i].insuranceBoxTerminologyId,
                isActive: newInsuranceBoxList[i].isActive,
                insurerId: +newInsuranceBoxList[i].insurerId
            }

            insuranceBoxList.push(newInsuranceBoxListModel)
        }

    }
    else
        insuranceBoxList = []

    listOfItems();

    newConfigByAddOrEdit('edit')
}

function resetInputsBox() {
    $("#rowNumber").val("")
    $("#boxName").val("")
    $("#insuranceBoxTerminologyId").prop("selectedIndex", 0).trigger("change")
    setDefaultActiveCheckbox($("#isActiveBox"));
    $("#boxName").focus()
}

function resetForm() {

    insuranceBoxList = []
    $("#name").val("").removeAttr("disabled")
    $("#insurerTypeId").val(0).removeAttr("disabled").trigger("change")
    $("#insurerTerminologyId").val(0).removeAttr("disabled").trigger("change")
    setDefaultActiveCheckbox($("#isActive"));
    $("#isActive").removeAttr("disabled")
    $("#rowNumber").val("")
    $("#boxName").val("").removeAttr("disabled")
    $("#insuranceBoxTerminologyId").prop("selectedIndex", 0).trigger("change")
    setDefaultActiveCheckbox($("#isActiveBox"));
    $("#saveForm").css("display", "block")
    $("#tableLine thead tr th:last-child").css("display", "")
    $("#tableLine tbody tr td:last-child").css("display", "")
    $("#insuranceBoxTerminologyId").removeAttr("disabled")
    $("#isActiveBox").removeAttr("disabled")

    listOfItems()

}

function newTrOnclick(row) {
    new_tr_Highlight(row)
}

function newTrOnkeydown(elm, ev, row) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row - 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row - 1}`).focus();
        }

    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();
        if ($(`#AddEditModal #rowItem${row + 1}`).length != 0) {
            $(`#AddEditModal .highlight`).removeClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).addClass("highlight");
            $(`#AddEditModal #rowItem${row + 1}`).focus();
        }
    }

}

function new_tr_Highlight(row) {
    $(`#AddEditModal .highlight`).removeClass("highlight");
    $(`#AddEditModal #rowItem${row}`).addClass("highlight");
    $(`#AddEditModal #rowItem${row}`).focus();
}

function setDefaultActiveCheckbox(elm) {
    var switchValue = $(elm).attr("switch-value").split(',');
    if (!$(elm).prop("checked")) {
        $(elm).prop("checked", true);
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio1).text(switchValue[0]);
    }
}

function run_button_accountDetail(id, rowNo, elm) {

    var check = controller_check_authorize(viewData_controllername, "INS");
    if (!check)
        return;

    var insurerTypeId = +$(`#pagetable .pagetablebody #row${rowNo}`).data("insurertypeid")

    var tableName = "mc.Insurer"

    if (insurerTypeId === 4)
        tableName = "mc.InsurerThirdParty";
    else if (insurerTypeId === 5)
        tableName = "mc.InsurerDiscount";

    addAccountDetail(id, tableName, `${viewData_baseUrl_MC}/InsuranceApi/getrecordbyid`, "id", "name", "isActive", "", initInsurance);
}

$("#AddEditModal").on("show.bs.modal", function () {

    if (modal_open_state != "Edit") {
        setDefaultActiveCheckbox($("#isActive"));
        fillInsurerTypeId('add')
    }

    setDefaultActiveCheckbox($("#isActiveBox"));
});

$("#AddEditModal").on("hidden.bs.modal", function () {
    $("#insurerTypeId").empty()
    resetForm()
});

$("#insurerTypeId").on("change", function () {

    let insurerTypeId = $(this).val()

    if (insurerTypeId == 4 || insurerTypeId == 5 || insurerTypeId == 0) {
        $("#insurerTerminologyId").val(0).attr("disabled", "disabled").removeAttr("data-parsley-selectvalzero").trigger("change")
        $("#boxName").attr("disabled", "disabled")
        $("#insuranceBoxTerminologyId").attr("disabled", "disabled")
        $("#isActiveBox").attr("disabled", "disabled")
        $("#saveRow").attr("disabled", "disabled")
        $("#resetInputs").attr("disabled", "disabled")
        $(".rowItemEdit").attr("disabled", "disabled")
    }
    else {
        $("#insurerTerminologyId").attr("data-parsley-selectvalzero", true).removeAttr("disabled")
        $("#boxName").removeAttr("disabled", "disabled")
        $("#insuranceBoxTerminologyId").removeAttr("disabled", "disabled")
        $("#isActiveBox").removeAttr("disabled", "disabled")
        $("#saveRow").removeAttr("disabled", "disabled")
        $("#resetInputs").removeAttr("disabled", "disabled")
        $(".rowItemEdit").removeAttr("disabled", "disabled")
    }

})

$("#patientModal").on("hidden.bs.modal", function () {
    if ($("#physicianToSecretaryLink").hasClass("active"))
        pagetable_formkeyvalue = [0];

});

$("#insurerPatientModal").on("hidden.bs.modal", function () {
    pagetable_formkeyvalue = [];
});

initInsurance();
