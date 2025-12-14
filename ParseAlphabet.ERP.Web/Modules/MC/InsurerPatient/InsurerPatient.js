var viewData_controllername_Insurer_Patinet = "InsurerPatientApi";
var insurerTypeId = 0
var insurerId = 0

$("#selectedPatinet").select2({ placeholder: "نحوه نمایش" });

function patient_init(insurerid, insurerTypeid) {

    insurerTypeId = insurerTypeid;
    insurerId = insurerid;
    //$("#selectedPatinet").val("0").trigger("change");

    
}

$("#selectedPatinet").on("change", function () {

    pagetable_formkeyvalue[1] = +$(this).val();
    var index = arr_pagetables.findIndex(v => v.pagetable_id == "insurerPatient_pagetable");
    arr_pagetables[index].currentpage = 1;
    arr_pagetables[index].currentrow = 1;
    get_NewPageTableV1("insurerPatient_pagetable");
    
});

function tr_save_row(pg_name, keycode) {

    var check = controller_check_authorize(viewData_controllername_Insurer_Patinet, "INS");
    if (!check)
        return;


    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    var url = `${viewData_baseUrl_MC}/InsurerPatientApi/save`;
    var patientId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow}`).data("patientid")

    var model = {
        insurerId: insurerId,
        InsurerTypeId: insurerTypeId,
        userId: 1,
        PatientId: patientId,
        isActive: $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_4 > .funkyradio > input:checkbox`).prop("checked"),
    }

    tr_save_row_ajax(url, model, pg_name, keycode)


};

function tr_save_row_ajax(url, model, pg_name, keycode) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "insurerPatient_pagetable");
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;

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

                $(`#${pagetable_id} .pagetablebody tbody #row${currentrow}`).data("id", result.id)

                var msg = alertify.success(msg_row_edited);
                msg.delay(alertify_delay);
                getrecord(pagetable_id, result.id);
                after_save_row(pg_name, "success", keycode, false);
            }
            else {
                var msg = alertify.error(msg_row_edit_error);
                msg.delay(alertify_delay);
                getrecord(pagetable_id, 0);
                after_save_row(pg_name, "error", keycode, false);
            }
            return result;
        },
        error: function (xhr) {
            error_handler(xhr, url);
            after_save_row(pg_name, "error", keycode, false);
        }
    })
}

function getrecord() {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == "insurerPatient_pagetable");
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentRow = arr_pagetables[index].currentrow;

    var id = +$(`#${pagetable_id} .pagetablebody tbody #row${currentRow}`).data("id")

    if (id === 0)
        setDefaultRowOnModal(pagetable_id, currentRow);
    else
        getrecordAjax(pagetable_id, currentRow, id);

}

function setDefaultRowOnModal(pagetable_id, currentrow) {
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 input`).prop("checked", false).trigger("change");
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 `).text("");
    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 `).text("");
}

function getrecordAjax(pagetable_id, currentrow, id) {

    let url = `${viewData_baseUrl_MC}/InsurerPatientApi/getrecordbyid`;

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        async: false,
        cache: false,
        success: function (result) {
            getrecord_setValue(result, pagetable_id, currentrow)
        },
        error: function (xhr) {
            error_handler(xhr, url)
        }
    });
}

function getrecord_setValue(result, pagetable_id, currentrow) {

    if (result != null || result != undefined) {

        var createDatePersian = ""
        var createTime = "";

        if (result.createDateTimePersian !== "") {
            createDatePersian = result.createDateTimePersian.split(" ")[0];
            createTime = result.createDateTimePersian.split(" ")[1];
        }

        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_4 input`).prop("checked", true).trigger("change");
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_5 `).text(result.createUserFullName);
        $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_6 `).html(`${createDatePersian}<p class="mb-0 mt-neg-5">${createTime}</p>`);
    }
    else
        setDefaultRowOnModal(pagetable_id, currentrow)
}