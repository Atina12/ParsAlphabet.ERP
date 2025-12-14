
var viewData_controllername = "RoleBranchPermissionApi",    
    urlApi = "", branchId = 0, roleId = 0, refreshRowNo = 0, branchPermissionList=[],
    tracking = { onSave: false},
    arr_pagetablesTbBranch = [];

function roleBranchPermission_init(role) {
  
    roleId = role;
    branchPermissionList = [];
    resetTbsBranch();
    getBranchPermission(roleId)

}

function resetTbsBranch() {
    $("#tbBranchGet").html("");

}

function getBranchPermission(roleId) {

    $.ajax({
        url: `${viewData_baseUrl_GN}/RoleBranchPermissionApi/rolebranchpermissiongetlist/${roleId}`,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            let output = '', data = null, resultLen = res.length, inputCheckedVal = '', inputVal = '';
            $("#tbBranchGet").html("")
            $("#getBranchValAll").prop("checked", false)
            if (resultLen == 0) {
                $("#tbBranchGet").append('')
                let emptyStr = `
                        <tr>
                             <td colspan="2" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                $("#tbBranchGet").append(emptyStr)
            }
            else {

                for (var i = 0; i < resultLen; i++) {

                    data = res[i];
                    inputCheckedVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getBranchVal(this,'tbBranch',${resultLen})" checked>`;
                    inputVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getBranchVal(this,'tbBranch',${resultLen})" >`;


                    output = `<tr id="tblist_${i}" onclick="tr_onclickDisplaybranchPermission('tblist',${i})" onkeydown="tr_onkeydownDisplaybranchPermission(${i},${data.Id} ,this,event)" tabindex="-1">
                                        <td style="text-align:center"><label>${data.ExistObject == 1 ? inputCheckedVal : inputVal}</label></td>
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                  </tr>`;


                    $("#tbBranchGet").append(output);
                    
                    branchPermissionmodel = {
                        id: +data.Id,
                        isActive: data.ExistObject 
                    }

                    branchPermissionList.push(branchPermissionmodel)

                }

                let checkAll = branchPermissionList.every(item => item.isActive === 1)
                if (checkAll)
                    $("#getBranchValAll").prop("checked", checkAll)

                
                $("#tbBranch #tblist_0").addClass("highlight").focus()
            }

            tracking.onSave = false

        },
        error: function (xhr) {
            error_handler(xhr, urlApi);
        }
    });
}

function tr_onclickDisplaybranchPermission(tableName,rowNo) {

   
    branchPermissionTrHighlight(tableName, rowNo)

    if (tableName == "tbBranch") {

        urlApi = `${viewData_baseUrl_GN}/RoleBranchPermissionApi/rolebranchpermissiongetlist/${roleId}`;

        $.ajax({
            url: urlApi,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                let output = '', data = null, resultLen = res.length, inputCheckedVal = '', inputVal = '';
                $("#tbBranchGet").html("")
                $("#getBranchValAll").prop("checked", false)
                if (resultLen == 0) {
                    $("#tbBranchGet").append('')
                    let emptyStr = `
                        <tr>
                             <td colspan="2" style="text-align:center">سطری وجود ندارد</td>
                        </tr>
                        `
                    $("#tbBranchGet").append(emptyStr)
                }
                else {

                    for (var i = 0; i < resultLen; i++) {
                        
                        data = res[i];
                        inputCheckedVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getBranchVal(this,'tbBranch',${resultLen})" checked>`;
                        inputVal = '<input class="actionCheck" id="' + data.Id + `" type="checkbox" onchange="getBranchVal(this,'tbBranch',${resultLen})" >`;

                        // Set Checked Value For Action Checkbox While its Selected By User
                        var chkSelected = branchPermissionList.findIndex(x=> x.isActive === true)

                        output = `<tr id="tbBranch_${i}" onclick="tr_onclickDisplaybranchPermission('tbBranch',${i})" onkeydown="tr_onkeydownDisplaybranchPermission(${i},${data.Id} ,this,event)" tabindex="-1">
                                        <td style="text-align:center"><label>${data.ExistObject == 1 || chkSelected != -1  ? inputCheckedVal : inputVal}</label></td>
                                        <td>${data.Id}</td>
                                        <td>${data.Name}</td>
                                  </tr>`;


                        $("#tbBranchGet").append(output);


                        if (data.ExistObject)
                            getBranchVal(inputCheckedVal, 'tbBranch', resultLen)
                    }


                    $("#tbBranch #tbBranch_0").addClass("highlight").focus()
                }

                tracking.onSave = false

            },
            error: function (xhr) {
                error_handler(xhr, urlApi);
            }
        });
    }
}

function getBranchVal(elm, pagetable_id, tbodyLength) {

    
    let idChcke = $(elm).attr('id');

    let index = branchPermissionList.findIndex(x => {
        return x.id === toNumber(idChcke)
    });

    if ($(elm).prop("checked")) {

        var branchPermissionmodel = {};

        if (index === -1) {
            branchPermissionmodel = {
                id: toNumber(idChcke),
                isActive: 1
            }

            branchPermissionList.push(branchPermissionmodel)

        }
        else {
            branchPermissionList[index].isActive = 1
        }

        branchPermissionmodel = {};
    }
    else {
        if (index != -1)
            branchPermissionList[index].isActive = 0;
    }


    let currenttbBranchList = branchPermissionList;
    let checkAll = currenttbBranchList.every(item => item.isActive === 1)
    
    if (tbodyLength == currenttbBranchList.length && checkAll)
        $("#getBranchValAll").prop("checked", checkAll)
    else
        $("#getBranchValAll").prop("checked", false)

}

function getBranchValAll(elem, pageId) {
    
    if ($(elem).prop("checked") == true)
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", true).trigger("change");
    else
        $(`#${pageId} tbody`).find(".actionCheck").prop("checked", false).trigger("change");
}

function branchPermissionTrHighlight(tableName, rowNo) {
   if (tableName.includes('tbBranch')) {
        $(`#tbStage > tbody > tr.highlight`).removeClass("highlight");
        $(`#tbStage > tbody > tr#${tableName}_${rowNo}`).addClass("highlight");
    }
   
}

function tr_onkeydownDisplaybranchPermission(rowNo, id, elm, e) {

    if (e.keyCode == KeyCode.ArrowUp) {
        e.preventDefault();
        if ($(`#tbBranch > tbody > tr#tblist_${rowNo - 1}`).length > 0) {
            $(`#tbBranch > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbBranch > tbody > tr#tblist_${rowNo - 1}`).addClass("highlight");
            $(`#tbBranch > tbody > tr#tblist_${rowNo - 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.ArrowDown) {
        e.preventDefault();
        if ($(`#tbBranch > tbody > tr#tblist_${rowNo + 1}`).length > 0) {
            $(`#tbBranch > tbody > tr.highlight`).removeClass("highlight");
            $(`#tbBranch > tbody > tr#tblist_${rowNo + 1}`).addClass("highlight");
            $(`#tbBranch > tbody > tr#tblist_${rowNo + 1}`).focus();
        }
    }
    else if (e.keyCode == KeyCode.Space) {
        e.preventDefault();

        $(`#tbBranch > tbody > tr#tblist_${rowNo} input`).click()
    }

}

function saveBranchPermission() {
    
    var model = {
        roleId: roleId,
        branchPermissionList: branchPermissionList
    };

    $(`#roleBranchPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", true)
  
    let result = $.ajax({
        url: `${viewData_baseUrl_GN}/RoleBranchPermissionApi/savebranchpermission`,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {

            var msgError = alertify.success(data.statusMessage);
            msgError.delay(alertify_delay);

            if (model.branchPermissionList.length > 0) {
                tracking.onSave = true
            }

            setTimeout(() => {
                $(`#roleBranchPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
            }, 500)

        },
        error: function (xhr) {
            setTimeout(() => {
                $(`#roleBranchPermissionModal .modal-footer button:not(#modal-close)`).prop("disabled", false)
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

$("#roleBranchPermissionModal").on("hidden.bs.modal", function () {
    tracking = { onSave: false};
});