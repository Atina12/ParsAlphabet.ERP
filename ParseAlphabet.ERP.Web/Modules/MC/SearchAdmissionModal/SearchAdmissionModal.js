var arrayCounts = [50, 100];
var headerTableName = ''

function initSearchAdmissionModal(tableName) {
    $('#workflowId').html("");
    
    var newOption2 = new Option("انتخاب کنید", 0, true, true);
    $('#workflowId').append(newOption2).trigger('change');

    // نسخه نویسی تامین
    if (tableName == "mc.PrescriptionTamin") {
        $("#diveAction").addClass("d-none");
        fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `0/10,14/17`, false, 3, "", () => {
            $("#workflowId").val(154).trigger("change")
        });
        admissionSearch();
    }
    else {
        fill_select2(`${viewData_baseUrl_WF}/WorkflowApi/getdropdown`, "workflowId", true, `0/10,14/0`, false, 3, "", () => {
            $("#workflowId").val(0).trigger("change")
        });
        $("#diveAction").removeClass("d-none");

        var newOption3 = new Option("انتخاب کنید", 0, true, true);
        $('#actionId').append(newOption3).trigger('change');

        fill_select2(`${viewData_baseUrl_WF}/StageActionApi/getdropdown`, "actionId", true, "10/1/null", false, 3, "", () => {
            $("#actionId").val(0).trigger("change")
        });

    }


    headerTableName = tableName;
}
$("#searchAdmissionModal_pagetable .filterBox").addClass("d-none");

$("#searchAdmission").on("click", function () {
    admissionSearch();
});

$("#searchAdmissionModal").on("hidden.bs.modal", async function () {
    //$("#admissionId").val("")
    //$("#patientNationalCode").val("")
    //$("#patientFullName").val("")
    //$("#createDatePersian").val("")
    //$("#attenderId").val(0).trigger("change.select2")

});

//$("#searchAdmissionModal").on("shown.bs.modal", async function () {
//});

function admissionSearch() {
    let pg_id = "searchAdmissionModal_pagetable";

    get_NewPageTable(pg_id);
}


$("#workflowId").on("change", function () {
    var param = "";
    if (+$(this).val() !== 0) {
        param = $("#workflowId").val();
    }
    else
        param = "0";

    let branchId = $("#branchId").val();
    $("#stageId").empty();

    var stageClassIds="17,28"

    if (headerTableName == "mc.PrescriptionTamin")
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/${param}/10,14/${stageClassIds}/0/1`, false, 3);
    else
        fill_select2(`${viewData_baseUrl_WF}/StageApi/getstagedropdownbyworkflowid`, "stageId", true, `null/${param}/10,14/${stageClassIds}/0/2`, false, 3);

});

function get_NewPageTable(pg_id = null, isInsert = false, callBack = undefined) {

    if (pg_id == null) pg_id = "pagetable";

    activePageTableId = pg_id;

    let index = arr_pagetables.findIndex(v => v.pagetable_id == pg_id);

    if (!isInsert) {
        arr_pagetables[index].pageNo = 0;
        arr_pagetables[index].currentpage = 1;
    }

    let pagetable_url = arr_pagetables[index].getpagetable_url,
        pagetable_pagerowscount = arr_pagetables[index].pagerowscount,
        pagetable_pageNo = arr_pagetables[index].pageNo,
        pagetable_currentpage = arr_pagetables[index].currentpage,
        configFilterRes = configFilterNewPageTable(pg_id);

    if (!configFilterRes) return;

    var attenderId = +$("#attenderId").val()
    var attenders = ""
    if (attenderId != 0 && checkResponse(attenderId)) {
        var attender = $("#attenderId option:selected").text().split("-")
        attenders = [{ id: +attender[0].trim(), name: attender[1].trim() }]
    } else {
        attenders = []
    }

    let pageViewModel = {
        workflowId: +$("#workflowId").val() == "" || +$("#workflowId").val() == 0 ? null : $("#workflowId").val(),
        stageId: +$("#stageId").val() == "" || +$("#stageId").val() == 0 ? null : $("#stageId").val(),
        actionId: (headerTableName == "mc.PrescriptionTamin" ? 5 : +$("#actionId").val() == "" || +$("#actionId").val() == 0 ? null : $("#actionId").val()),
        //    stateId: 3,
        id: +$("#admissionId").val() == 0 ? null : +$("#admissionId").val(),
        createDatePersian: $("#createDatePersian").val() == "" ? null : $("#createDatePersian").val(),
        patientFullName: $("#patientFullName").val() == "" ? null : $("#patientFullName").val(),
        patientNationalCode: $("#patientNationalCode").val() == "" ? null : $("#patientNationalCode").val(),
        attenderId: ((attenders != null && attenders.length > 0) ? attenders[0].id : null),
        headerTableName: headerTableName,
        pageNo: pagetable_pageNo,
        pageRowsCount: pagetable_pagerowscount,
    }

    pageViewModel.form_KeyValue = pagetable_formkeyvalue;

    let url = "";

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

            if (pagetable_currentpage == 1) fillOption(result, pg_id);

            fill_NewPageTable(result, pg_id, callBack);
            refreshBackPageTable(false, pg_id);
        },
        error: function (xhr) {
            error_handler(xhr, url);
            refreshBackPageTable(true, pg_id);
        }
    });

}

function run_button_setAdmissionInfo(admissionId) {

    let data = getfeildByAdmissionId(admissionId)
    fillAdmission(data)
}

function fillAdmission(data) {
    
    $("#admissionSelected").html("");

    var admissionOutput = `<tr data-admissionid="${data.admissionId}" data-workflowid="${data.workflowId}" data-stageid="${data.stageId}">
                               <td>${!checkResponse(data.admissionId) ? "" : data.admissionId}</td> 
                               <td>${!checkResponse(data.patientId) ? "" : data.patientId} - ${!checkResponse(data.patientFullName) ? "" : data.patientFullName}</td> 
                               <td>${!checkResponse(data.patientNationalCode) ? "" : data.patientNationalCode}</td> 
                               <td>${!checkResponse(data.basicInsurerName) ? "" : data.basicInsurerName}</td> 
                               <td>${!checkResponse(data.basicInsurerLineName) ? "" : data.basicInsurerLineName}</td> 
                               <td>${data.compInsurerLineId == 0 || !checkResponse(data.compInsurerLineName) ? "" : `${data.compInsurerLineId} - ${data.compInsurerLineName}`}</td> 
                               <td>${data.thirdPartyInsurerId == 0 || !checkResponse(data.thirdPartyInsurerId) ? "" : `${data.thirdPartyInsurerId} -  ${data.thirdPartyInsurerName}`}</td> 
                               <td>${!checkResponse(data.admissionHID) ? "" : data.admissionHID}</td> 
                               <td>${!checkResponse(data.basicInsurerExpirationDatePersian) ? "" : data.basicInsurerExpirationDatePersian}</td> 
                               <td>${!checkResponse(data.attenderFullName) ? "" : data.attenderFullName}</td> 
                               <td><button type="button" onclick="displayAdmission(${data.admissionId},this)" class="btn blue_outline_1" data-toggle="tooltip" data-placement="bottom" title="نمایش مراجعه کننده">
                                    <i class="fa fa-list"></i>
                                    </button></td> 
                           </tr>`

    $("#admissionSelected").html(admissionOutput);
    modal_close("searchAdmissionModal");

    if (typeof setAdmissionInfo_otherConfig !== "undefined")
        setAdmissionInfo_otherConfig(data)
}

function getfeildByAdmissionId(admId) {

    let viewData_get_AdmissionSearch = `${viewData_baseUrl_MC}/AdmissionApi/search`

    var modelSearch = {
        stateId: 0,
        id: +admId,
        createDatePersian: "",
        patientFullName: "",
        patientNationalCode: ""
    }

    var result = $.ajax({
        url: viewData_get_AdmissionSearch,
        async: false,
        cache: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(modelSearch),
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            error_handler(xhr, viewData_get_AdmissionSearch);
            return null;
        }
    });
    return result.responseJSON;
};

document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode === KeyCode.key_f) {
        e.preventDefault();
        modal_show('searchAdmissionModal')
    }
}
initSearchAdmissionModal()