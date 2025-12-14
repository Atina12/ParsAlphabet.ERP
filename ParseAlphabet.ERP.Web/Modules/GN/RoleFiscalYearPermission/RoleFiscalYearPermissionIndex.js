
var viewData_controllername = "RoleFiscalYearPermissionApi",    
    urlApi = "", branchId = 0, roleId = 0, refreshRowNo = 0, fiscalYearPermissionList=[],
    tracking = { onSave: false},
    arr_pagetablesTbBranch = [];

function roleFiscalYearPermission_init(role) {
  
    roleId = role;
    fiscalYearPermissionList = [];
    resetTbsFiscalyear();
    getFiscalYearPermission(roleId)

}

function resetTbsFiscalyear() {
    $("#tbFiscalYearGet").html("");
}

function getFiscalYearPermission(roleId) {

    $.ajax({
        url: `${viewData_baseUrl_GN}/RoleFiscalYearPermissionApi/rolefiscalyearpermissiongetlist/${roleId}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            let output = '', data = null, resultLen = res.length, inputCheckedVal = '', inputVal = '';
            $("#tbFiscalYearGet").html("")
            $("#getFiscalYearValAll").prop("checked", false)
            if (resultLen == 0) {
                $("#tbFiscalYearGet").append('')
                let emptyStr = `
                        <tr>
                             <td colspan="2" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tbFiscalYearGet").append(emptyStr)
            }
            else {

                for (var i = 0; i < resultLen; i++) {

                    data = res[i];
                    inputCheckedVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getFiscalYearVal(this,'tbFiscalYear',${resultLen})" checked>`;
                    inputVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getFiscalYearVal(this,'tbFiscalYear',${resultLen})" >`;


                    output = `<tr id="tblist_${i}" onclick="tr_onclickDisplayFiscalYearPermission('tblist',${i})" onkeydown="tr_onkeydownDisplayFiscalYearPermission(${i},${data.Id} ,this,event)" tabindex="-1">
                                        <td style="text-align:center"><label>${data.ExistObject == 1 ? inputCheckedVal : inputVal}</label></td>
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                  </tr>`;


                    $("#tbFiscalYearGet").append(output);

                    fiscalYearPermissionmodel = {
                        id: +data.Id,
                        isActive: data.ExistObject
                    }

                    fiscalYearPermissionList.push(fiscalYearPermissionmodel)
                }

                let checkAll = fiscalYearPermissionList.every(item => item.isActive === 1)
                if (checkAll)
                    $("#getFiscalYearValAll").prop("checked", checkAll)


                $("#tbFiscalYear #tblist_0").addClass("highlight").focus()
            }

            tracking.onSave = false

        },
        error: function (xhr) {
            error_handler(xhr, urlApi);
        }
    });
}


function tr_onclickDisplayFiscalYearPermission(tableName,rowNo) {

   
    fiscalYearPermissionTrHighlight(tableName, rowNo)

    if (tableName == "tbFiscalYear") {



        urlApi = `${viewData_baseUrl_GN}/RoleFiscalYearPermissionApi/rolefiscalYearpermissiongetlist/${roleId}`;

        $.ajax({
            url: urlApi,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let output = '', data = null, resultLen = res.length, inputCheckedVal = '', inputVal = '';
                $("#tbFiscalYearGet").html("")
                $("#getFiscalYearValAll").prop("checked", false)
                if (resultLen == 0) {
                    $("#tbFiscalYearGet").append('')
                    let emptyStr = `
                        <tr>
                             <td colspan="2" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbFiscalYearGet").append(emptyStr)
                }
                else {

                    for (var i = 0; i < resultLen; i++) {
                        
                        data = res[i];
                        inputCheckedVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getFiscalYearVal(this,'tbFiscalYear',${resultLen})" checked>`;
                        inputVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getFiscalYearVal(this,'tbFiscalYear',${resultLen})" >`;

                        // Set Checked Value For Action Checkbox While its Selected By User
                        var chkSelected = fiscalYearPermissionList.findIndex(x=> x.isActive === true)

                        output = `<tr id="tbFiscalYear_${i}" onclick="tr_onclickDisplayfiscalYearPermission('tbFiscalYear',${i})" onkeydown="tr_onkeydownDisplayfiscalYearPermission(${i},${data.Id} ,this,event)" tabindex="-1">
                                        <td style="text-align:center"><label>${data.ExistObject == 1 || chkSelected != -1  ? inputCheckedVal : inputVal}</label></td>
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                  </tr>`;


                        $("#tbFiscalYearGet").append(output);


                        if (data.ExistObject)
                            getFiscalYearVal(inputCheckedVal, 'tbFiscalYear', resultLen)
                    }


                    $("#tbFiscalYear #tbFiscalYear_0").addClass("highlight").focus()
                }

                tracking.onSave = false

            },
            error: function (xhr) {
                error_handler(xhr, urlApi);
            }
        });
    }
}

function getFiscalYearVal(elm, pagetable_id, tbodyLength) {

    
    let idChcke = $(elm).attr('id');

    let index = fiscalYearPermissionList.findIndex(x => {
        return x.id === toNumber(idChcke)
    });

    if ($(elm).prop("checked")) {

        var fiscalYearPermissionmodel = {};

        if (index === -1) {
            fiscalYearPermissionmodel = {
                id: toNumber(idChcke),
                isActive: 1
            }

            fiscalYearPermissionList.push(fiscalYearPermissionmodel)

        }
        else {
            fiscalYearPermissionList[index].isActive = 1
        }

        fiscalYearPermissionmodel = {};
    }
    else {
        if (index != -1)
            fiscalYearPermissionList[index].isActive = 0;
    }


    let currenttbFiscalYearList = fiscalYearPermissionList;
    let checkAll = currenttbFiscalYearList.every(item => item.isActive === 1)

    if (tbodyLength == currenttbFiscalYearList.length && checkAll)
        $("#getFiscalYearValAll").prop("checked", checkAll)
    else
        $("#getFiscalYearValAll").prop("checked", false)

}


function getFiscalYearValAll(elem, pageId) {
    
    if ($(elem).prop("checked") == true)
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", true).trigger("change");
    else
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", false).trigger("change");
}

function fiscalYearPermissionTrHighlight(tableName, rowNo) {
    if (tableName.includes('tbFiscalYear')) {
        $(`#tbStage > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbStage > tbody > tr#${tableName}_${rowNo}`).addClass("highlight");
    }
   
}

function tr_onkeydownDisplayFiscalYearPermission(rowNo, id, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#tbFiscalYear > tbody > tr#tblist_${rowNo - 1}`).length > 0) {
            $(`#tbFiscalYear > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbFiscalYear > tbody > tr#tblist_${rowNo - 1}`).addClass("highlight");
            $(`#tbFiscalYear > tbody > tr#tblist_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#tbFiscalYear > tbody > tr#tblist_${rowNo + 1}`).length > 0) {
            $(`#tbFiscalYear > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbFiscalYear > tbody > tr#tblist_${rowNo + 1}`).addClass("highlight");
            $(`#tbFiscalYear > tbody > tr#tblist_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();

        $(`#tbFiscalYear > tbody > tr#tblist_${rowNo} input`).click()
    }

}


function saveFiscalYearPermission() {
    
    var model = {
        roleId: roleId,
        fiscalYearPermissionList: fiscalYearPermissionList
    };

    $(`#roleFiscalYearPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", true)
  
    let result = $.ajax({
        url: `${viewData_baseUrl_GN}/RoleFiscalYearPermissionApi/savefiscalyearpermission`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {

            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);

            if (model.fiscalYearPermissionList.length > 0) {
                tracking.onSave = true
            }

            setTimeout(() => {
                $(`#roleFiscalYearPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)

        },
        error: function (xhr) {
            setTimeout(() => {
                $(`#roleFiscalYearPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)
            error_handler(xhr, url_save);
            return {
                status: -100,
                statusMessage: "عملیات با خطا مواجه شد",
                successfull: false
            };
        }
    });

}

$("#roleFiscalYearPermissionModal").on("hidden.bs.modal", function () {
    tracking = { onSave: false};
});