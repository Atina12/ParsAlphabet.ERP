var viewData_JournalStepList_url = `${viewData_baseUrl_FM}/JournalApi/getjournalsteplist`,
    viewData_updateJournalStep_url = `${viewData_baseUrl_FM}/JournalApi/updatestep`;

$("#stepLogModalJournal").on("shown.bs.modal", function () {
    $("#actionJo").focus();
});

function stepLogJournal(id) {

    $("#stepLogRowsJournal").html("");

    $.ajax({
        url: viewData_journalStepList_url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(id),
        success: function (result) {
            var dataList = result.data;
            var listlen = dataList == null ? 0 : dataList.length, trString;
            for (var i = 0; i < listlen; i++) {
                var data = dataList[i];
                trString = `<tr ${i == 0 ? `style="color: green;"` : ""}><td>${data.stepName}</td><td>${data.userFullName}</td><td>${data.stepDateTimePersian}</td></tr>`;
                $("#stepLogRowsJournal").append(trString);
            }
        },
        error: function (xhr) {
            error_handler(xhr, viewData_checkPreviousId_url);
        }
    });
}

function update_actionJournal() {
    
    loadingAsync(true, "update_action_btn");

    var model = {
        requestStepId: +$("#actionJo").val(),
        identityId: + $(`#${activePageTableId} tbody tr#${selectedRowId}`).data("id")
    }

    if (model.requestStepId > 0) {
        $.ajax({
            url: viewData_updateJournalStep_url,
            async: true,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (result) {

                if (result.successfull) {
                    alertify.success(result.validationErrors[0]).delay(alertify_delay);

                    if (stepLogModalJournalForCloseModal == true)
                        modal_close('stepLogModalJournal');

                    stepLogJournal(idForStepAction2);
                    get_NewPageTableV1();
                    $("#actionJo").val(model.requestStepId);
                }
                else {
                    var data_status = +$(`#${activePageTableId} tbody tr.highlight`).data("actionid");
                    $("#actionJo").val(data_status);
                    let errorText = generateErrorString(result.validationErrors);
                    alertify.error(errorText).delay(alertify_delay);
                }

                loadingAsync(false, "update_action_btn", "");
            },
            error: function (xhr) {
                error_handler(xhr, viewData_updateJournalStep_url);
                $("#updateStatusBtn").prop("disabled", false);
                loadingAsync(false, "update_action_btn", "");
            }
        });
    }
    else {
        var msgItem = alertify.warning("لطفا گام را مشخص کنید");
        msgItem.delay(alertify_delay);
        loadingAsync(false, "update_action_btn");
    }
}

async function loadingAsync(loading, elementId) {
    if (loading) {
        $(`#${elementId} i`).addClass(`fa fa-spinner fa-spin`);
        $(`#${elementId}`).prop("disabled", true)
    }
    else {
        $(`#${elementId} i`).removeClass("fa-spinner fa-spin");
        $(`#${elementId}`).prop("disabled", false)
    }
}

