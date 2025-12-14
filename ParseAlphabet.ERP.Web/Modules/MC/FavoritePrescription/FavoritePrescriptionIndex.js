var viewData_form_title = "سطرهای نسخه نویسی";
var viewData_modal_title = "سطرهای نسخه نویسی";

var viewData_controllername = "FavoritePrescriptionApi",
    viewData_getpagetable1_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfavoritediassign`,
    viewData_getpagetable2_url = `${viewData_baseUrl_MC}/${viewData_controllername}/getfavoriteassign`,
    viewData_filter_url1 = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_filter_url2 = `${viewData_baseUrl_MC}/${viewData_controllername}/getfilteritems`,
    viewData_assign_api_url = `${viewData_baseUrl_MC}/${viewData_controllername}/insert`,
    viewData_diassign_api_url = `${viewData_baseUrl_MC}/${viewData_controllername}/delete`,
    viewData_get_favorite = `${viewData_baseUrl_MC}/${viewData_controllername}/favoritecategorydropdown`,
    viewData_get_Attendedr = `${viewData_baseUrl_MC}/Attender_AssistantApi/getdropdown`;


function initfavoritePrescription() {
    $("#admissionTypeId").select2()

    fill_select2(viewData_get_Attendedr, "form_Attender", true, 0, false);
    $('#form_Attender').val($('#form_Attender option:eq(0)').val()).trigger('change.select2');

    fill_select2(viewData_get_favorite, "kind", true, 2, false);
    $('#kind').val($('#kind option:eq(0)').val()).trigger('change');
}

function assign_ins() {

    let checkValid = checkValidInput()
    if (!checkValid)
        return

    modelAssing = {
        FavoriteCategory: $("#kind").val(),
        AttenderId: $("#form_Attender").val(),
        admissionTypeId: $("#admissionTypeId").val()
    }
    ins_del_assign(viewData_assign_api_url, "Ins", modelAssing, insert_assign_validate)
}

function assign_del() {

    let checkValid = checkValidInput()
    if (!checkValid)
        return

    modelAssing = {
        FavoriteCategory: $("#kind").val(),
        AttenderId: $("#form_Attender").val(),
        admissionTypeId: $("#admissionTypeId").val()
    }
    ins_del_assign(viewData_diassign_api_url, "Del", modelAssing, delete_assign_validate)
}

function checkValidInput() {

    let attenderId = +$("#form_Attender").val()
    let admissionTypeId = +$("#admissionTypeId").val()
    let kind = +$("#kind").val()

    if (attenderId == 0) {
        alertify.warning("داکتر را وارد کنید").delay(alertify_delay);
        $("#form_Attender").select2("focus")
        return false
    }

    if (admissionTypeId == 0) {
        alertify.warning("نوع پذیرش را وارد کنید").delay(alertify_delay);
        $("#admissionTypeId").select2("focus")
        return false
    }

    if (kind == 0) {
        alertify.warning("نوع را وارد کنید").delay(alertify_delay);
        $("#kind").select2("focus")
        return false
    }

    return true
}

function insert_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

function delete_assign_validate() {
    var result = {
        successfull: true
    }
    return result;
}

$("#form_Attender").on("change", function () {
    var attenderId = +$(this).val();
    var admissionTypeId = +$("#admissionTypeId").val();
    var kind = +$("#kind").val()

    var modelBind2 = {
        pageTableId1: "pagetable1",
        pageTableId2: "pagetable2",
        publicTypeid: kind,
        Id: attenderId,
        url1_Pagetable: viewData_getpagetable1_url,
        url2_Pagetable: viewData_getpagetable2_url,
        url_Filter1: viewData_filter_url1,
        url_Filter2: viewData_filter_url2,
        arrFormkeyValue: [attenderId, kind, admissionTypeId]
    };

    bind_formPlate2(modelBind2);
});

$("#admissionTypeId").on("change", function () {
    let admissionTypeId = $(this).val()

    $("#kind").empty()

    fill_select2(viewData_get_favorite, "kind", true, admissionTypeId, false);

    $('#kind').val($('#kind option:eq(0)').val()).trigger('change');
});

$("#kind").on("change", function () {
    var attenderId = +$("#form_Attender").val()
    var admissionTypeId = +$("#admissionTypeId").val();
    var kind = +$(this).val();
    
    var modelBind2 = {
        pageTableId1: "pagetable1",
        pageTableId2: "pagetable2",
        publicTypeid: kind,
        Id: attenderId,
        url1_Pagetable: viewData_getpagetable1_url,
        url2_Pagetable: viewData_getpagetable2_url,
        url_Filter1: viewData_filter_url1,
        url_Filter2: viewData_filter_url2,
        arrFormkeyValue: [attenderId, kind, admissionTypeId]
    };

    bind_formPlate2(modelBind2);
});

initfavoritePrescription()

