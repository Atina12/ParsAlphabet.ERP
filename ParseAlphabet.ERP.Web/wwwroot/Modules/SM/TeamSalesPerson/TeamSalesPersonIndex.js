var viewData_controllername_teamSalesPerson = "TeamSalesPersonApi",
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername_teamSalesPerson}/getpage`,
    viewData_save_record_url = `${viewData_baseUrl_SM}/${viewData_controllername_teamSalesPerson}/save`,
    teamSalesId = 0;

function TeamSalesPerson_init(teamId, pg_name) {
    viewData_getpagetable_url = `${viewData_baseUrl_SM}/${viewData_controllername_teamSalesPerson}/getpage`;
    viewData_getrecord_url = `${viewData_baseUrl_SM}/${viewData_controllername_teamSalesPerson}/getrecordbyid`;
    viewData_filter_url = `${viewData_baseUrl_SM}/${viewData_controllername_teamSalesPerson}/getfilteritems`;    
    pagetable_formkeyvalue = [+teamId];
    teamSalesId = +teamId;

    get_NewPageTableV1(pg_name);
}

var formTeamSalesPerson = $('#teamSalesPerson_pagetable').parsley();

//$("#teamSalesPersonModal").on("hidden.bs.modal", function () {
//    teamInit();
//})

function tr_object_onchange(pg_name, selectObject, rowno, colno) {

}

function tr_object_onblur(pg_name, selectObject, rowno, colno) {

}

function tr_save_row(pg_name, keycode) {
    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var pagetable_currentrow = arr_pagetables[index].currentrow;
    if (pg_name == "teamSalesPerson_pagetable") {
       
        var employeeId = +$(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_1`).text(); 
        var isActive = $(`#${pagetable_id} .pagetablebody > tbody > #row${pagetable_currentrow} > #col_${pagetable_currentrow}_3 > .funkyradio > input:checkbox`).prop("checked");

        var teamSalesPerson_model = {
            teamId: teamSalesId,
            employeeId: employeeId,
            isActive: isActive
        }
        var viewData_save_url = `${viewData_baseUrl_SM}/teamSalesPersonApi/save`;

        alertify.confirm('', msg_confirm_row,
            function () {
                // save
                var output = $.ajax({
                    url: viewData_save_url,
                    type: "post",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(teamSalesPerson_model),
                    async: false,
                    cache: false,
                    success: function (result) {
                        if (result.successfull) {
                            var msg = alertify.success(msg_row_edited);
                            msg.delay(alertify_delay);
                            getrecord(pg_name);
                            after_save_row(pg_name, "success", keycode, false);
                        }
                        else {
                            var msg = alertify.error(msg_row_edit_error);
                            msg.delay(alertify_delay);
                            getrecord(pg_name);
                            after_save_row(pg_name, "error", keycode, false);
                        }
                        return result;
                    },
                    error: function (xhr) {
                        error_handler(xhr, viewData_save_url);
                        getrecord(pg_name)
                        after_save_row(pg_name, "error", keycode, false);

                        return false;
                    }
                }).responseJSON;

                return output.successfull;
            },
            function () {
                // cancel
                var msg = alertify.error('انصراف از ثبت');
                msg.delay(alertify_delay);
                getrecord(pg_name);
                after_save_row(pg_name, "cancel", keycode, false);
            }
        ).set('labels', { ok: 'بله', cancel: 'خیر' });
    }
};

function getrecord(pg_name) {

    var index = arr_pagetables.findIndex(v => v.pagetable_id == pg_name);
    var pagetable_id = arr_pagetables[index].pagetable_id;
    var currentrow = arr_pagetables[index].currentrow;

    var url = "";

    if (pg_name == "teamSalesPerson_pagetable") {

        var model = {
            teamId: teamSalesId,
            employeeId: +$(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_1`).text()
        }

        url = `${viewData_baseUrl_SM}/teamSalesPersonApi/getrecordbyid`;

        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            async: false,
            cache: false,
            success: function (result) {
                var teamSalesPerson = result.data;

                if (teamSalesPerson != null) {
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3 > .funkyradio > input`).prop("checked", teamSalesPerson.isActive);
                }
                else {      
                    $(`#${pagetable_id} .pagetablebody > tbody > #row${currentrow} > #col_${currentrow}_3>.funkyradio > input`).prop("checked", false);
                }
            },
            error: function (xhr) {
                error_handler(xhr, url)
            }
        });

    }
}