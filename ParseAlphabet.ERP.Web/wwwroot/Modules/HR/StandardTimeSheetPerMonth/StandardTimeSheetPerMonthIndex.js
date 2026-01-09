

function initStandardTimeSheetPerMonth(lineId, rowNo, elm) {

    $("#modal_keyid_value_standardTimeSheetPerMonth").text(lineId)

    buildStandarTimeSheetBody(lineId)

    standardTimeSheetPerMonthGetRecord(lineId, null, null)

    modal_show("standardTimeSheetPerMonthModal")
}

function buildStandarTimeSheetBody(lineId) {

    let strBody = ""
    let month = ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'قوس', 'عقرب', 'جدی', 'دلو', 'حوت']

    strBody += `
                <thead>
                  <tr>
                    <th style="width:5%"></th>
                    <th style="width:10%">شناسه</th>
                    <th style="width:15%">ماه</th>
                    <th style="width:20%">ساعت کار موظف</th>
                    <th style="width:31%">کاربر ثبت کننده</th>
                    <th style="width:29%">تاریخ ثبت</th>
                  </tr>
                  </thead>
                  <tbody>`

    for (let i = 0; i < month.length; i++) {
        strBody += ` <tr id="standardTimeSheetPerMonthRow_${i + 1}" onclick="standardTimeSheetPerMonthClick(${i + 1},this,event,${lineId})" onkeydown="standardTimeSheetPerMonthKeydown(${i + 1},this,event,${lineId})" tabindex="-1">
                         <td id="standardTimeSheetPerMonthIcon_${i + 1}" class="text-center standardTimeSheetEditIcon"></td>
                         <td id="monthId_${i + 1}" class="text-center"></td>
                         <td>${month[i]}</td>
                         <td><input id="standardTimeSheetPerMonth_${i + 1}" 
                                    type="text"
                                    onkeydown="standardTimeSheetPerMonthInputKeydown(${i + 1},this,event,${lineId})" 
                                    class="form-control number standardTimeSheetPerMonthInpus" maxlength="3" tabindex="1" readonly></td>
                         <td id="createUserFullName_${i + 1}" style="width:20%"></td>
                         <td id="createDateTime_${i + 1}" style="width:20%"></td>
                     </tr>`
    }

    strBody += "</tbody>"

    $("#standardTimeSheetPerMont table").html(strBody)
    $("#standardTimeSheetPerMont #standardTimeSheetPerMonthRow_1").addClass("highlight").focus()

}

function standardTimeSheetPerMonthClick(row, elm, e) {
    e.preventDefault();

    let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

    if (currentInput.prop("readonly")) {
        $(`#standardTimeSheetPerMont input`).prop("readonly", true)
        $(`.standardTimeSheetEditIcon`).html("")
        $(`#standardTimeSheetPerMont .highlight`).removeClass("highlight");
        $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row}`).addClass("highlight").focus();
    }
    else {
        currentInput.select()
    }
}

function standardTimeSheetPerMonthKeydown(row, elm, ev, lineId) {

    if (ev.which === KeyCode.ArrowUp) {
        ev.preventDefault();

        if ($(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row - 1}`).length != 0) {
            let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

            if (!currentInput.prop("readonly")) {

                let elementValue = +currentInput.val()
                if (elementValue > 750) {
                    var msgResult = alertify.warning("ساعت کار نمی تواند بیشتر از 750 ساعت باشد");
                    msgResult.delay(alertify_delay);
                    $(`#standardTimeSheetPerMonth_${row}`).focus()
                    return
                }

                saveStandardTimeSheetPerMont(row, elementValue, lineId, 'up')
            }
            else {
                $(`#standardTimeSheetPerMont .highlight`).removeClass("highlight");
                $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row - 1}`).addClass("highlight");
                $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row - 1}`).focus();
            }

        }

    }
    else if (ev.which === KeyCode.ArrowDown) {
        ev.preventDefault();


        if ($(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row + 1}`).length != 0) {


            let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

            if (!currentInput.prop("readonly")) {

                let elementValue = +currentInput.val()
                if (elementValue > 750) {
                    var msgResult = alertify.warning("ساعت کار نمی تواند بیشتر از 750 ساعت باشد");
                    msgResult.delay(alertify_delay);
                    $(`#standardTimeSheetPerMonth_${row}`).focus()
                    return
                }

                saveStandardTimeSheetPerMont(row, elementValue, lineId, 'down')
            }
            else {
                $(`#standardTimeSheetPerMont .highlight`).removeClass("highlight");
                $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row + 1}`).addClass("highlight");
                $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${row + 1}`).focus();
            }

        }

    }
    else if (ev.which === KeyCode.Enter) {
        ev.preventDefault();

        let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

        if (currentInput.prop("readonly")) {
            $(`#standardTimeSheetPerMont input`).prop("readonly", true)
            setTimeout(() => {
                $(`#standardTimeSheetPerMonthIcon_${row}`).html(`<i class="fas fa-edit editrow"></i>`)
                currentInput.prop("readonly", false).select()
            }, 10)
        }
    }
    else if (ev.which === KeyCode.Esc) {
        ev.preventDefault();

        let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)


        if (!currentInput.prop("readonly")) {
            $(`#standardTimeSheetPerMont input`).prop("readonly", true)
            $(`.standardTimeSheetEditIcon`).html("")
            standardTimeSheetPerMonthGetRecord(lineId, row, null)
        }
        else {
            modal_close('standardTimeSheetPerMonthModal')
        }

    }

}

function standardTimeSheetPerMonthInputKeydown(row, elm, e, lineId) {

    e.stopPropagation()

    if (e.which === KeyCode.ArrowUp) {
        e.preventDefault();

        let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

        if (!currentInput.prop("readonly")) {

            let elementValue = +currentInput.val()
            if (elementValue > 750) {
                var msgResult = alertify.warning("ساعت کار نمی تواند بیشتر از 750 ساعت باشد");
                msgResult.delay(alertify_delay);
                $(`#standardTimeSheetPerMonth_${row}`).focus()
                return
            }

            saveStandardTimeSheetPerMont(row, elementValue, lineId, 'up')

        }

    }
    else if (e.which === KeyCode.ArrowDown) {
        e.preventDefault();

        let currentInput = $(`#standardTimeSheetPerMonthRow_${row} input`)

        if (!currentInput.prop("readonly")) {

            let elementValue = +currentInput.val()
            if (elementValue > 750) {
                var msgResult = alertify.warning("ساعت کار نمی تواند بیشتر از 750 ساعت باشد");
                msgResult.delay(alertify_delay);
                $(`#standardTimeSheetPerMonth_${row}`).focus()
                return
            }

            saveStandardTimeSheetPerMont(row, elementValue, lineId, 'down')
        }

    }
    else if (e.which === KeyCode.Enter) {

        let currentInput = $(elm)
        let elementValue = +currentInput.val()
        if (elementValue > 750) {
            var msgResult = alertify.warning("ساعت کار نمی تواند بیشتر از 750 ساعت باشد");
            msgResult.delay(alertify_delay);
            $(`#standardTimeSheetPerMonth_${row}`).focus()
            return
        }

        saveStandardTimeSheetPerMont(row, elementValue, lineId, 'enter')
    }
    else if (e.which === KeyCode.Esc) {
        standardTimeSheetPerMonthGetRecord(lineId, row, null)
    }
}

function saveStandardTimeSheetPerMont(row, standardMonthWorkingHours, standardTimeSheetId, opr) {

    let id = $(`#monthId_${row}`).text() == "" ? 0 : +$(`#monthId_${row}`).text()

    let model = {
        id,
        standardTimeSheetId,
        monthId: row,
        standardMonthWorkingHours,
    }

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetPerMonthApi/savestandardtimesheetpermonth`

    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        cache: false,
        success: function (result) {

            if (result.successfull) {
                var msgResult = alertify.success(result.statusMessage);
                msgResult.delay(alertify_delay);
                standardTimeSheetPerMonthGetRecord(model.standardTimeSheetId, model.monthId, opr)
            }
            else {
                var msgResult = alertify.error(result.statusMessage);
                msgResult.delay(alertify_delay);
            }

        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });

}

function standardTimeSheetPerMonthGetRecord(lineId = 0, monthId = 0, opr) {

    let url = `${viewData_baseUrl_HR}/StandardTimeSheetPerMonthApi/getstandardtimesheetpermonth/${lineId}/${monthId}`

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        async: false,
        success: function (result) {

            configStandardTimeSheetPerMonth(result, monthId, opr)
        },
        error: function (xhr) {
            error_handler(xhr, url);
            configStandardTimeSheetPerMonth(null, 0)
        }
    });
}

function configStandardTimeSheetPerMonth(data, monthId, opr) {

    if (checkResponse(data) && data.length != 0) {

        for (let i = 0; i < data.length; i++) {
            $(`#monthId_${data[i].monthId}`).text(data[i].id)
            $(`#standardTimeSheetPerMonth_${data[i].monthId}`).val(data[i].standardMonthWorkingHours)
            $(`#createUserFullName_${data[i].monthId}`).text(data[i].createUserFullName)
            $(`#createDateTime_${data[i].monthId}`).text(data[i].createDateTimePersian)
        }

        if (monthId != 0) {
            if (opr == null) {
                $(`#standardTimeSheetPerMonthRow_${monthId}`).focus()
            }
            else if (opr == 'up') {
                if ($(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId - 1}`).length != 0) {
                    $(`#standardTimeSheetPerMont .highlight`).removeClass("highlight");
                    $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId - 1}`).addClass("highlight");
                    $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId - 1}`).focus();
                }
                else {
                    $(`#standardTimeSheetPerMonthRow_${monthId}`).focus()
                }
            }
            else if (opr == 'down' || opr == 'enter') {
                if ($(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId + 1}`).length != 0) {
                    $(`#standardTimeSheetPerMont .highlight`).removeClass("highlight");
                    $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId + 1}`).addClass("highlight");
                    $(`#standardTimeSheetPerMont tr#standardTimeSheetPerMonthRow_${monthId + 1}`).focus();
                }
                else {
                    $(`#standardTimeSheetPerMonthRow_${monthId}`).focus()
                }
            }

        }
    }
    else {
        if (monthId != 0) {
            $(`#monthId_${monthId}`).text("")
            $(`#standardTimeSheetPerMonth_${monthId}`).val("")
            $(`#createUserFullName_${monthId}`).text("")
            $(`#createDateTime_${monthId}`).text("")
            $(`#standardTimeSheetPerMonthRow_${monthId}`).focus()
        }
    }


    $("#standardTimeSheetPerMont input").prop("readonly", true)
    $(`.standardTimeSheetEditIcon`).html("")

}

