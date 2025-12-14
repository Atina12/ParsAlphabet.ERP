var viewData_form_title = "موضوع دریافت / پرداخت",
    viewData_controllername = "TreasurySubjectApi",
    viewData_getrecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getrecordbyid`,
    viewData_getpagetable_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getpage`,
    viewData_deleterecord_url = `${viewData_baseUrl_FM}/${viewData_controllername}/delete`,
    viewData_save_record_url = `${viewData_baseUrl_FM}/${viewData_controllername}/save`,
    viewData_filter_url = `${viewData_baseUrl_FM}/${viewData_controllername}/getfilteritems`,
    viewData_csv_url = `${viewData_baseUrl_FM}/${viewData_controllername}/csv`,
    viewData_print_file_url = `${stimulsBaseUrl.FM.Prn}TreasurySubject.mrt`,
    viewData_stage_hasTreasruSubject_GetList = `${viewData_baseUrl_WF}/StageApi/getdropdownhastreasurysubject`,
    viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 },
    viewData_print_tableName = "",
    form = $(`#treasurySubjectForm`).parsley(),
    arrayCheckNeedStage = [];

get_NewPageTableV1();

fill_dropdown("/api/FMApi/cashflowcategory_getdropdown", "id", "name", "cashFlowCategoryId", true, 0);

function stageChecked(item) {
    let idChcke = $(item).data().value;
    if ($(item).prop("checked")) {
        arrayCheckNeedStage.push({ id: idChcke })
    }
    else {
        var stageIndex = arrayCheckNeedStage.findIndex(x => x.id === idChcke);
        if (stageIndex !== -1)
            arrayCheckNeedStage.splice(stageIndex, 1);
    }
}

function fillItemCheckBox() {
    $.ajax({
        url: viewData_stage_hasTreasruSubject_GetList,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        data: {},
        success: function (result) {
            let str = result.map((item, i) => {
                return `
                        <div class="col-sm-6 pr-0">
                         <label>
                                <input id="no_${item.id}" name="checksFill[]" data-parsley-checkmin="1" required data-parsley-required-message="انتخاب مرحله الزامیست" data-parsley-errors-container="#fillStageItemContainer"   data-value="${item.id}" type="checkbox" onchange="stageChecked(this)"/> 
                                    ${item.id} - ${item.name}
                         </label>
                        </div>`;
            })
            $("#fillStageItem").html(str)
        },
        error: function (xhr) {
            error_handler(xhr, viewData_stage_hasTreasruSubject_GetList)
        }
    });
}
fillItemCheckBox();

function treasurySubjectSave() {
    var validate = form.validate();
    validateSelect2(form);
    var modal_name = "AddEditModal";

    if (!validate) return;

    let parameters = {
        id: +$("#modal_keyid_value").text(),
        name: $("#name").val(),
        cashFlowCategoryId: +$("#cashFlowCategoryId").val(),
        isActive: $("#isActive").prop("checked"),
        stageIdList: arrayCheckNeedStage
    };

    recordInsertUpdate(viewData_save_record_url, parameters, modal_name, modal_open_state == "Add" ? msg_row_created : msg_row_edited);
    get_NewPageTableV1();
}

function run_button_gettreasurysubject(p_keyvalue, rowNo, elem) {

    $("#modal_keyid_value").text(p_keyvalue);

    var check = controller_check_authorize(viewData_controllername, "UPD");
    if (!check)
        return;

    viewData_modal_title = "ویرایش " + viewData_form_title;

    resetStageList();
    $.ajax({
        url: viewData_getrecord_url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(p_keyvalue),
        async: false,
        cache: false,
        success: function (result) {

            modal_open_state = 'Edit';
            modal_clear_items("AddEditModal");

            modal_fill_items(result, "AddEditModal");

            let chekBox = $("#fillStageItem div label").children("input[type='checkbox']");
            let stageIds = result.stageIdList;

            if (stageIds != null) {
                for (var i = 0; i < chekBox.length; i++) {
                    let inputCheck = chekBox[i];
                    for (var j = 0; j < stageIds.length; j++) {
                        if (stageIds[j].id == $(inputCheck).data().value) {
                            $(inputCheck).prop("checked", true).trigger("change");
                        }
                    }
                }
            }

            modal_show("AddEditModal");

        },
        error: function (xhr) {
            error_handler(xhr, viewData_getrecord_url)
        }
    });
}

function resetStageList() {
    var checklist = $("#fillStageItem div label");
    var checkLen = checklist.length;
    for (var i = 0; i < checkLen; i++) {
        $(checklist[i]).find("input").prop("disabled", false).prop("checked", false).trigger("change");
    }
}

$("#AddEditModal").on("hidden.bs.modal", function () {
    arrayCheckNeedStage = [];
    
});
$("#AddEditModal").on("shown.bs.modal", function () {
    if (modal_open_state == "Add") {
        setDefaultActiveCheckbox($("#isActive"));
        $("#fillStageItem input").prop("disabled", false)
    }
    else {
        $("#fillStageItem input:checked").prop("disabled", true)
    }
});
