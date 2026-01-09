
var elemntInCheque = null, lastWidthCheque = 0, lastHeightCheque = 0,
    verticalRulerPointer = $("#vertical-ruler-pointer div"),
    horizontalRulerPointer = $("#horizontal-ruler-pointer div"),
    chequeOptions = {}, isInsert = true, canDeleteBankCheque = false;

function initForm() {
    $(".select2").select2()

    setInputmask()

    loadDropDownForm()

    setDefaultActiveCheckbox($("#isActive"));

    initialSettings()
}

function setInputmask() {
    $("#chequeWidth").inputmask()
    $("#chequeHeight").inputmask()
    $("#distanceFromTop").inputmask()
    $("#distanceFromRight").inputmask()
    $("#widthChequeElements").inputmask()
    $("#heightChequeElements").inputmask()
}

function loadDropDownForm() {
    fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "sourceBank", true, 0, false);
    fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "destinationBank", true, 0, false);
    fill_select2(`${viewData_baseUrl_FM}/BankApi/getdropdownisactive`, "bankId", true, 0, false);
}

async function initialSettings(noBank = false) {


    canDeleteBankCheque = false
    isInsert = true
    elemntInCheque = null
    $("#numericDateLabelText").text(toPersianNum("1401/12/12"))
    $("#nationalCodeLable").text(toPersianNum("0921876548"))
    $("#numericAmountLableText").text(toPersianNum("15,000,000,000") + "\u273D\u273D\u273D")

    $("#showLabelsOrContentCheque").data("content", true)
    $("#showLabelsOrContentCheque").text("نمایش محتوا")

    $("#numericDateLabel").css("display", "none")
    $("#numericDateContentLable").css("display", "")

    $("#letterDateLabel").css("display", "none")
    $("#letterDateContent").css("display", "")

    $("#letterAmountLabel").css("display", "none")
    $("#letterAmountContent").css("display", "")

    $("#recipientLable").css("display", "none")
    $("#recipientContent").css("display", "")

    $("#nationalCodeLable").css("display", "none")
    $("#nationalCodeContent").css("display", "")

    $("#numericAmountLable").css("display", "none")
    $("#numericAmountContentLable").css("display", "")

    $("#descriptionLable").css("display", "none")
    $("#descriptionContent").css("display", "")

    $(".elementFocus").css("border", "2px solid #BBB")
    $("#distanceFromTop").prop("disabled", true)
    $("#distanceFromRight").prop("disabled", true)
    $("#widthChequeElements").prop("disabled", true)
    $("#heightChequeElements").prop("disabled", true)
    $("#fontTextCheque").prop("disabled", true)
    $("#fontSizeCheque").prop("disabled", true)

    $("#privateSettingCheque input").val("").trigger("change")
    $("#fontTextCheque").prop('selectedIndex', 0).trigger("change");

    if (noBank) {
        $("#statusOfBankCheckAmounts").prop('selectedIndex', 0).trigger("change");
        $("#colorPrint").prop('selectedIndex', 0).trigger("change")
    }
    else
        $("#publicSettingCheque select").prop('selectedIndex', 0).trigger("change");

    $("#copyCheque select").prop('selectedIndex', 0).trigger("change");
    $("#elementOptions").html("")
    $("#selecSourceBank").prop('selectedIndex', 0).trigger("change");
    $("#selecDestinationBank").prop('selectedIndex', 0).trigger("change");
    $("#cheque > div").css("display", "")
    $("#cheque > div").css("display", "flex")

    chequeOptions = {

        bankId: +$("#bankId").val(),
        colorText: $("#colorPrint").val(),

        width: "170mm",
        height: "85mm",

        numericDate_Top: "5mm",
        numericDate_Right: "15mm",
        numericDate_Width: "46mm",
        numericDate_Height: "7mm",
        numericDate_Font: "iransans",
        numericDate_FontSize: "12px",
        numericDate_IsActive: true,

        letterDate_Top: "17mm",
        letterDate_Right: "15mm",
        letterDate_Width: "50mm",
        letterDate_Height: "7mm",
        letterDate_Font: "iransans",
        letterDate_FontSize: "12px",
        letterDate_IsActive: true,

        numericAmount_Top: "60mm",
        numericAmount_Right: "79mm",
        numericAmount_Width: "90mm",
        numericAmount_Height: "7mm",
        numericAmount_Font: "iransans",
        numericAmount_FontSize: "12px",
        numericAmount_IsActive: true,

        letterAmount_Top: "30mm",
        letterAmount_Right: "0mm",
        letterAmount_Width: "169mm",
        letterAmount_Height: "7mm",
        letterAmount_Font: "iransans",
        letterAmount_FontSize: "12px",
        letterAmount_IsActive: true,

        recipient_Top: "45mm",
        recipient_Right: "0mm",
        recipient_Width: "75mm",
        recipient_Height: "7mm",
        recipient_Font: "iransans",
        recipient_FontSize: "12px",
        recipient_IsActive: true,

        idNo_Top: "45mm",
        idNo_Right: "90mm",
        idNo_Width: "79mm",
        idNo_Height: "7mm",
        idNo_Font: "iransans",
        idNo_FontSize: "12px",
        idNo_IsActive: true,

        description_Top: "73mm",
        description_Right: "0mm",
        description_Width: "169mm",
        description_Height: "7mm",
        description_Font: "iransans",
        description_FontSize: "12px",
        description_IsActive: true,

        numericDate_IsSeprate: false,
        numericAmount_IsSeprate: false

    }


    //numericDate
    $("#numericDate").css("margin-top", chequeOptions.numericDate_Top)
    $("#numericDate").css("margin-right", chequeOptions.numericDate_Right)
    $("#numericDate").css("width", chequeOptions.numericDate_Width)
    $("#numericDate").css("height", chequeOptions.numericDate_Height)



    //letterDate
    $("#letterDate").css("margin-top", chequeOptions.letterDate_Top)
    $("#letterDate").css("margin-right", chequeOptions.letterDate_Right)
    $("#letterDate").css("width", chequeOptions.letterDate_Width)
    $("#letterDate").css("height", chequeOptions.letterDate_Height)



    //numericAmountContent
    $("#numericAmount").css("margin-top", chequeOptions.numericAmount_Top)
    $("#numericAmount").css("margin-right", chequeOptions.numericAmount_Right)
    $("#numericAmount").css("width", chequeOptions.numericAmount_Width)
    $("#numericAmount").css("height", chequeOptions.numericAmount_Height)



    //letterAmount
    $("#letterAmount").css("margin-top", chequeOptions.letterAmount_Top)
    $("#letterAmount").css("margin-right", chequeOptions.letterAmount_Right)
    $("#letterAmount").css("width", chequeOptions.letterAmount_Width)
    $("#letterAmount").css("height", chequeOptions.letterAmount_Height)



    //recipientContent
    $("#recipient").css("margin-top", chequeOptions.recipient_Top)
    $("#recipient").css("margin-right", chequeOptions.recipient_Right)
    $("#recipient").css("width", chequeOptions.recipient_Width)
    $("#recipient").css("height", chequeOptions.recipient_Height)



    //nationalCode
    $("#nationalCode").css("margin-top", chequeOptions.idNo_Top)
    $("#nationalCode").css("margin-right", chequeOptions.idNo_Right)
    $("#nationalCode").css("width", chequeOptions.idNo_Width)
    $("#nationalCode").css("height", chequeOptions.idNo_Height)



    ////description
    $("#description").css("margin-top", chequeOptions.description_Top)
    $("#description").css("margin-right", chequeOptions.description_Right)
    $("#description").css("width", chequeOptions.description_Width)
    $("#description").css("height", chequeOptions.description_Height)


    //public change
    $("#cheque > div").css("font-family", "iransans")
    $("#cheque > div").css("font-size", "12px")

    //
    if (chequeOptions.numericDate_IsSeprate)
        $("#numericDateSetting").val(1).trigger("change")
    else
        $("#numericDateSetting").val(0).trigger("change")

    if (chequeOptions.numericAmount_IsSeprate)
        $("#numericAmountSetting").val(1).trigger("change")
    else
        $("#numericAmountSetting").val(0).trigger("change")

    makeRulerVertical("85")
    makeRulerHorizonal("170")

    setTimeout(() => {
        $("#bankId").select2("focus")
    }, 100)

}

function makeRulerVertical(chequeLength = "85") {

    let elementVertical = $("#vertical-ruler-content")
    let contentVertical = ""
    let chequeLengthStr = chequeLength
    chequeLengthStr = chequeLengthStr / 10
    let checkIntOrFloor = chequeLengthStr.toString().includes(".")
    let cm = 0
    let mm = 0
    let newChequeHeight = ""

    //floor
    if (checkIntOrFloor) {
        cm = +chequeLengthStr.toString().split(".")[0]
        mm = +chequeLengthStr.toString().split(".")[1]
    }
    //int
    else {
        cm = +chequeLengthStr
        mm = 0
    }

    newChequeHeight = +`${cm}.${mm}`
    lastHeightCheque = newChequeHeight

    if (mm != 0)
        cm++

    for (let i = 1; i <= cm; i++) {

        if (i == cm && mm != 0) {
            contentVertical += ` 
                    <div style="width:${mm}mm !important" class="d-flex flex-column h-100">     
                    <div class="d-flex h-50 w-100">
                    `
        }
        else {
            contentVertical += ` 
                    <div style="width:10mm !important" class="d-flex flex-column h-100">     
                    <div class="d-flex h-50 w-100 ">
                    `
        }

        if (i != cm) {
            for (let j = 0; j < 10; j++) {
                if (j == 9) {
                    contentVertical += `
                                    <div style="width:1mm" class="d-flex justify-content-end">
                                        <div style="background-color:black;width:1px" class="h-100"></div>
                                    </div>
                                    `
                }
                else {
                    contentVertical += `
                                    <div style="width:1mm" class="d-flex justify-content-end">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                }
            }
        }
        else {
            if (mm == 0) {
                for (let j = 0; j < 10; j++) {
                    if (j == 9) {
                        contentVertical += `
                                    <div style="width:1mm" class="d-flex justify-content-end">
                                        <div style="background-color:black;width:1px" class="h-100"></div>
                                    </div>
                                    `
                    }
                    else {
                        contentVertical += `
                                    <div style="width:1mm" class="d-flex justify-content-end">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                    }
                }
            }
            else {
                for (let j = 0; j < mm; j++) {
                    contentVertical += `
                                    <div style="width:1mm" class="d-flex justify-content-end">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                }
            }
        }

        if (i == cm && mm != 0) {
        }
        else {
            contentVertical += `
                                </div >
                                    <div class="h-50 w-100" style="font-size:8px;text-align:end;font-weight:700">
                                        ${i}
                                    </div>         
                                </div >
                            `
        }
    }

    $("#cheque").css("height", `${newChequeHeight * 10}mm`)
    $("#vertical-ruler-pointer").css("width", `${newChequeHeight * 10}mm`)

    newChequeHeight = newChequeHeight.toString().replace(".", "/")

    if (!newChequeHeight.includes("/"))
        newChequeHeight = newChequeHeight + "/0"

    $("#chequeHeight").val(newChequeHeight)

    elementVertical.html(contentVertical)

}

function makeRulerHorizonal(chequeWidth = "170") {

    let elementHorizonal = $("#horizontal-ruler-content")
    let contentHorizonal = ""
    let chequeWidthStr = chequeWidth
    chequeWidthStr = chequeWidthStr / 10
    let checkIntOrFloor = chequeWidthStr.toString().includes(".")
    let cm = 0
    let mm = 0
    let newChequeWidth = ""

    //floor
    if (checkIntOrFloor) {
        cm = +chequeWidthStr.toString().split(".")[0]
        mm = +chequeWidthStr.toString().split(".")[1]
    }
    //int
    else {
        cm = +chequeWidthStr
        mm = 0
    }

    newChequeWidth = +`${cm}.${mm}`
    lastWidthCheque = newChequeWidth

    if (mm != 0)
        cm++

    for (let i = 1; i <= cm; i++) {


        if (i == cm && mm != 0) {
            contentHorizonal += ` 
                    <div style="width:${mm}mm !important" class="d-flex flex-column h-100">     
                    <div class="d-flex h-50 w-100 flex-row-reverse">
                    `
        }
        else {
            contentHorizonal += ` 
                    <div style="width:10mm !important" class="d-flex flex-column h-100">     
                    <div class="d-flex h-50 w-100 flex-row-reverse">
                    `
        }


        if (i != cm) {
            for (let j = 0; j < 10; j++) {
                if (j == 9) {
                    contentHorizonal += `
                                    <div style="width:1mm" class="d-flex justify-content-start">
                                        <div style="background-color:black;width:1px" class="h-100"></div>
                                    </div>
                                    `
                }
                else {
                    contentHorizonal += `
                                    <div style="width:1mm" class="d-flex justify-content-start">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                }
            }
        }
        else {
            if (mm == 0) {
                for (let j = 0; j < 10; j++) {
                    if (j == 9) {
                        contentHorizonal += `
                                    <div style="width:1mm" class="d-flex justify-content-start">
                                        <div style="background-color:black;width:1px" class="h-100"></div>
                                    </div>
                                    `
                    }
                    else {
                        contentHorizonal += `
                                    <div style="width:1mm" class="d-flex justify-content-start">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                    }
                }
            }
            else {
                for (let j = 0; j < mm; j++) {
                    contentHorizonal += `
                                    <div style="width:1mm" class="d-flex justify-content-start">
                                        <div style="background-color:black;width:1px" class="h-50"></div>
                                    </div>
                                    `
                }
            }
        }

        if (i == cm && mm != 0) {
        }
        else {
            contentHorizonal += `
                                </div >
                                    <div class="h-50 w-100" style="font-size:8px;text-align:start;font-weight:700">
                                        ${i}
                                    </div>         
                                </div >
                            `
        }
    }


    $("#cheque").css("width", `${newChequeWidth * 10}mm`)



    newChequeWidth = newChequeWidth.toString().replace(".", "/")

    if (!newChequeWidth.includes("/"))
        newChequeWidth = newChequeWidth + "/0"

    $("#chequeWidth").val(newChequeWidth)
    elementHorizonal.html(contentHorizonal)
}

function elementOptions(elm) {

    let elemntChequeId = elm.prop("id")
    
    if (elemntChequeId == "numericDate") {
        $("#numericChequeElementOptions").css("display", "")
        $("#numericAmountElementOptions").css("display", "none")
    }
    else if (elemntChequeId == "numericAmount") {
        $("#numericChequeElementOptions").css("display", "none")
        $("#numericAmountElementOptions").css("display", "")
    } 
    else {
        $("#numericChequeElementOptions").css("display", "none")
        $("#numericAmountElementOptions").css("display", "none")
    }

}

function numericDateSetting(elm) {
    let value = $(elm).val()

    //نمایش محتوا
    if (value == 0) {
        $("#numericDateLabelBox").html("")
        $("#numericDateLabelBox").css("display", "none")
        $("#numericDateLabelText").css("dipslay", "flex")
    }
    else if (value == 1) {
        $("#numericDateLabelBox")
            .html(`<div style="display:flex;white-space: nowrap;width: max-content;margin-right:3px">
                        <div id="numericDateLabelBox1" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:0px 2px 2px 0px'>${toPersianNum(2)}</div>
                        <div id="numericDateLabelBox2" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericDateLabelBox3" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(2)}</div>
                        <div id="numericDateLabelBox4" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericDateLabelBox5" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericDateLabelBox6" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericDateLabelBox7" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(4)}</div>
                        <div id="numericDateLabelBox8" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:2px 0px 0px 2px'>${toPersianNum(1)}</div>
                 </div>`)
        $("#numericDateLabelBox").css("display", "flex")
        $("#numericDateLabelText").css("display", "")
    }


    //نمایش عناوین
    if (value == 0) {
        $("#numericDateContentOnBox").html("")
        $("#numericDateContentOnBox").css("display", "none")
        $("#numericDateContent").css("display", "flex")
        chequeOptions.numericDate_IsSeprate = false
    }
    else if (value == 1) {
        $("#numericDateContentOnBox")
            .html(`<div style="display:flex;white-space: nowrap;width: max-content;margin-right:3px">
                        <div id="numericChequeBox1" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:0px 2px 2px 0px'>${toPersianNum(2)}</div>
                        <div id="numericChequeBox2" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericChequeBox3" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(2)}</div>
                        <div id="numericChequeBox4" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericChequeBox5" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(1)}</div>
                        <div id="numericChequeBox6" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericChequeBox7" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(4)}</div>
                        <div id="numericChequeBox8" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:2px 0px 0px 2px'>${toPersianNum(1)}</div>
                 </div>`)

        $("#numericDateContentOnBox").css("display", "flex")
        $("#numericDateContent").css("display", "none")
        chequeOptions.numericDate_IsSeprate = true
    }


}

function numericAmountSetting(elm) {
    let value = $(elm).val()

    //نمایش محتوا
    if (value == 0) {
        $("#numericAmountLableBox").html("")
        $("#numericAmountLableBox").css("display", "none")
        $("#numericAmountLableText").css("display", "flex")
    }
    else if (value == 1) {
        $("#numericAmountLableBox") /*\u273D*/
            .html(`<div style="display:flex;margin-right:3px;width: max-content;white-space: nowrap;">
                        <div id="numericAmountLableBox1" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:2px 0px 0px 2px'>${toPersianNum(1)}</div>
                        <div id="numericAmountLableBox2" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(5)}</div>
                        <div id="numericAmountLableBox3" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox4" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox5" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox6" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox7" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox8" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox9" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox10" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox11" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div id="numericAmountLableBox12" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div id="numericAmountLableBox13" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div id="numericAmountLableBox14" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div id="numericAmountLableBox15" style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:0px 2px 2px 0px'>\u273D</div>
                 </div>`)
        $("#numericAmountLableBox").css("display", "flex")
        $("#numericAmountLableText").css("display", "none")
    }


    //نمایش عناوین
    if (value == 0) {
        $("#numericAmountContentOnBox").html("")
        $("#numericAmountContentOnBox").css("display", "none")
        $("#numericAmountContent").css("display", "flex")
        chequeOptions.numericAmount_IsSeprate = false
    }
    else if (value == 1) {
        $("#numericAmountContentOnBox")
            .html(`<div style="display:flex;margin-right:3px;width: max-content;white-space: normal;">
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:2px 0px 0px 2px'>${toPersianNum(1)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(5)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>${toPersianNum(0)}</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black'>\u273D</div>
                        <div  style='display:flex;justify-content:center;align-items:center;width:20px;height:20px;border:1px solid black;border-radius:0px 2px 2px 0px'>\u273D</div>
                 </div>`)
        $("#numericAmountContentOnBox").css("display", "flex")
        $("#numericAmountContent").css("display", "none")
        chequeOptions.numericAmount_IsSeprate = true
    }
}

function funkyradio_onchange(elm) {

    var switchValue = $(elm).attr("switch-value").split(',');
    let id = $("#statusOfBankCheckAmounts").children("option:selected").attr("data-id")

    if ($(elm).prop("checked")) {
        var lbl_funkyradio1 = $(elm).siblings("label");
        $(lbl_funkyradio1).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio1).text(switchValue[0]);


        $(`#${id}`).css("display", "flex")

        if (id == "numericDate")
            chequeOptions.numericDate_IsActive = true
        else if (id == "letterDate")
            chequeOptions.letterDate_IsActive = true
        else if (id == "letterAmount")
            chequeOptions.letterAmount_IsActive = true
        else if (id == "recipient")
            chequeOptions.recipient_IsActive = true
        else if (id == "nationalCode")
            chequeOptions.idNo_IsActive = true
        else if (id == "numericAmount")
            chequeOptions.numericAmount_IsActive = true
        else if (id == "description")
            chequeOptions.description_IsActive = true

    }
    else {
        var lbl_funkyradio0 = $(elm).siblings("label");
        $(lbl_funkyradio0).attr("for", $(elm).attr("id"));
        $(lbl_funkyradio0).text(switchValue[1]);

        $(`#${id}`).css("display", "none")

        if (id == "numericDate")
            chequeOptions.numericDate_IsActive = false
        else if (id == "letterDate")
            chequeOptions.letterDate_IsActive = false
        else if (id == "letterAmount")
            chequeOptions.letterAmount_IsActive = false
        else if (id == "recipient")
            chequeOptions.recipient_IsActive = false
        else if (id == "nationalCode")
            chequeOptions.idNo_IsActive = false
        else if (id == "numericAmount")
            chequeOptions.numericAmount_IsActive = false
        else if (id == "description")
            chequeOptions.description_IsActive = false
    }
}

async function saveForm() {

    if ($("#bankId").val() == 0) {
        var msg = alertify.warning("بانک را انتخاب کنید");
        msg.delay(alertify_delay);
        $("#bankId").select2("focus")
        return
    }

    let check = await checkInputs()
    if (!check)
        return


    let model = chequeOptions

    if (isInsert) {
        let url = `${viewData_baseUrl_FM}/TreasuryBondDesignApi/insert`;

        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: result => {

                if (result.successfull) {
                    var msg = alertify.success("چک بانکی با موفقیت ذخیره شد");
                    msg.delay(alertify_delay);

                }
                else {
                    var msg = alertify.error("عملیات ذخیره سازی با مشکل مواجه شده است");
                    msg.delay(alertify_delay);
                }

                $("#bankId").select2("focus")

            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }
    else {
        let url = `${viewData_baseUrl_FM}/TreasuryBondDesignApi/update`;

        $.ajax({
            url: url,
            async: false,
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: result => {

                if (result.successfull) {
                    var msg = alertify.success("چک بانکی با موفقیت بروزرسانی شد");
                    msg.delay(alertify_delay);
                }
                else {
                    var msg = alertify.error("عملیات بروزرسازی با مشکل مواجه شده است");
                    msg.delay(alertify_delay);
                }

                $("#bankId").select2("focus")
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }

}

function deleteBankForm() {

    let bankId = +$("#bankId").val()

    if (bankId == 0) {
        var msg = alertify.warning("بانک را انتخاب کنید");
        msg.delay(alertify_delay);
        $("#bankId").select2("focus")
        return
    }

    if (!canDeleteBankCheque) {
        var msg = alertify.warning("برای این بانک چکی ثبت نشده است");
        msg.delay(alertify_delay);
        $("#bankId").select2("focus")
        return
    }

    alertify.confirm('اخطار', 'آیا از حذف اطمینان دارید؟',
        function () {
            let url = `${viewData_baseUrl_FM}/TreasuryBondDesignApi/delete/${bankId}`;

            $.ajax({
                url: url,
                async: false,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                //data: JSON.stringify(model),
                success: result => {
                    if (result.successfull) {
                        var msg = alertify.success("حذف چک با موفقیت انجام شد");
                        msg.delay(alertify_delay);
                        $("#bankId").val(0).trigger("change")
                    }
                    else {
                        var msg = alertify.error("عملیات حذف ناموفق بود");
                        msg.delay(alertify_delay);
                    }

                },
                error: function (xhr) {
                    error_handler(xhr, url);
                }
            });
        },
        function () {
            var msg = alertify.error('عملیات حذف لغو شد');
            msg.delay(admission.delay);
        }
    ).set('labels', { ok: 'بله', cancel: 'خیر' });


    $(".ajs-ok").attr("title", "Enter")
    $(".ajs-cancel").attr("title", "Esc")

}

function showLabelsOrContentCheque(elm) {
    let contentStatus = $(elm).data("content")

    if (contentStatus) {
        $(elm).data("content", false)
        $(elm).text("نمایش عناوین")

        $("#numericDateLabel").css("display", "")
        $("#numericDateContentLable").css("display", "none")

        $("#letterDateLabel").css("display", "")
        $("#letterDateContent").css("display", "none")

        $("#letterAmountLabel").css("display", "")
        $("#letterAmountContent").css("display", "none")


        $("#recipientLable").css("display", "")
        $("#recipientContent").css("display", "none")

        $("#nationalCodeLable").css("display", "")
        $("#nationalCodeContent").css("display", "none")

        $("#numericAmountLable").css("display", "")
        $("#numericAmountContentLable").css("display", "none")

        $("#descriptionLable").css("display", "")
        $("#descriptionContent").css("display", "none")
    }
    else {
        $(elm).data("content", true)
        $(elm).text("نمایش محتوا")

        $("#numericDateLabel").css("display", "none")
        $("#numericDateContentLable").css("display", "")

        $("#letterDateLabel").css("display", "none")
        $("#letterDateContent").css("display", "")

        $("#letterAmountLabel").css("display", "none")
        $("#letterAmountContent").css("display", "")

        $("#recipientLable").css("display", "none")
        $("#recipientContent").css("display", "")

        $("#nationalCodeLable").css("display", "none")
        $("#nationalCodeContent").css("display", "")

        $("#numericAmountLable").css("display", "none")
        $("#numericAmountContentLable").css("display", "")

        $("#descriptionLable").css("display", "none")
        $("#descriptionContent").css("display", "")

    }

    $("#bankId").select2("focus")
}

function setInputsByElementsCheque(elmId) {

    let marginTop = ""
    let marginRight = ""
    let width = ""
    let height = ""
    let fontFamily = ""
    let fontSize = ""


    if (elmId == "numericDate") {
        marginTop = chequeOptions.numericDate_Top
        marginRight = chequeOptions.numericDate_Right
        width = chequeOptions.numericDate_Width
        height = chequeOptions.numericDate_Height
        fontFamily = chequeOptions.numericDate_Font
        fontSize = chequeOptions.numericDate_FontSize
        if (chequeOptions.numericDate_IsSeprate)
            $("#numericDateSetting").val(1).trigger("change")
        else
            $("#numericDateSetting").val(0).trigger("change")
    }
    else if (elmId == "letterDate") {
        marginTop = chequeOptions.letterDate_Top
        marginRight = chequeOptions.letterDate_Right
        width = chequeOptions.letterDate_Width
        height = chequeOptions.letterDate_Height
        fontFamily = chequeOptions.letterDate_Font
        fontSize = chequeOptions.letterDate_FontSize
    }
    else if (elmId == "letterAmount") {
        marginTop = chequeOptions.letterAmount_Top
        marginRight = chequeOptions.letterAmount_Right
        width = chequeOptions.letterAmount_Width
        height = chequeOptions.letterAmount_Height
        fontFamily = chequeOptions.letterAmount_Font
        fontSize = chequeOptions.letterAmount_FontSize
    }
    else if (elmId == "recipient") {
        marginTop = chequeOptions.recipient_Top
        marginRight = chequeOptions.recipient_Right
        width = chequeOptions.recipient_Width
        height = chequeOptions.recipient_Height
        fontFamily = chequeOptions.recipient_Font
        fontSize = chequeOptions.recipient_FontSize
    }
    else if (elmId == "nationalCode") {
        marginTop = chequeOptions.idNo_Top
        marginRight = chequeOptions.idNo_Right
        width = chequeOptions.idNo_Width
        height = chequeOptions.idNo_Height
        fontFamily = chequeOptions.idNo_Font
        fontSize = chequeOptions.idNo_FontSize
    }
    else if (elmId == "numericAmount") {
        marginTop = chequeOptions.numericAmount_Top
        marginRight = chequeOptions.numericAmount_Right
        width = chequeOptions.numericAmount_Width
        height = chequeOptions.numericAmount_Height
        fontFamily = chequeOptions.numericAmount_Font
        fontSize = chequeOptions.numericAmount_FontSize
        if (chequeOptions.numericAmount_IsSeprate)
            $("#numericAmountSetting").val(1).trigger("change")
        else
            $("#numericAmountSetting").val(0).trigger("change")
    }
    else if (elmId == "description") {
        marginTop = chequeOptions.description_Top
        marginRight = chequeOptions.description_Right
        width = chequeOptions.description_Width
        height = chequeOptions.description_Height
        fontFamily = chequeOptions.description_Font
        fontSize = chequeOptions.description_FontSize
    }


    marginTop = marginTop.split("mm")[0]
    marginTop = marginTop / 10
    if (!marginTop.toString().includes("."))
        marginTop = marginTop + "/0"
    marginTop = marginTop.toString().replace(".", "/")
    ////
    marginRight = marginRight.split("mm")[0]
    marginRight = marginRight / 10
    if (!marginRight.toString().includes("."))
        marginRight = marginRight + "/0"
    marginRight = marginRight.toString().replace(".", "/")
    ////
    width = width.split("mm")[0]
    width = width / 10
    if (!width.toString().includes("."))
        width = width + "/0"
    width = width.toString().replace(".", "/")
    ////
    height = height.split("mm")[0]
    height = height / 10
    if (!height.toString().includes("."))
        height = height + "/0"
    height = height.toString().replace(".", "/")



    $("#distanceFromTop").val(marginTop == 0 ? "0/0" : marginTop)
    $("#distanceFromRight").val(marginRight == 0 ? "0/0" : marginRight)
    $("#widthChequeElements").val(width == 0 ? "0/0" : width)
    $("#heightChequeElements").val(height == 0 ? "0/0" : height)

    if (fontFamily.includes("iransans"))
        $("#fontTextCheque").val("iransans").trigger("change")
    else if (fontFamily.includes("B Badr"))
        $("#fontTextCheque").val("B Badr").trigger("change")
    else if (fontFamily.includes("B Titr"))
        $("#fontTextCheque").val("B Titr").trigger("change")

    fontSize = fontSize.split("px")[0]

    $("#fontSizeCheque").val(fontSize)
}

function toPersianNum(number) {
    number = number.toString().replaceAll("1", "۱");
    number = number.toString().replaceAll("2", "۲");
    number = number.toString().replaceAll("3", "۳");
    number = number.toString().replaceAll("4", "۴");
    number = number.toString().replaceAll("5", "۵");
    number = number.toString().replaceAll("6", "۶");
    number = number.toString().replaceAll("7", "۷");
    number = number.toString().replaceAll("8", "۸");
    number = number.toString().replaceAll("9", "۹");
    number = number.toString().replaceAll("0", "۰");
    return number;
}

function setModelCheque(id, value) {

    let statusOfBankCheckAmounts = $("#statusOfBankCheckAmounts").val()

    if (statusOfBankCheckAmounts == 1) {
        if (id == "distanceFromTop")
            chequeOptions.numericDate_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.numericDate_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.numericDate_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.numericDate_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.numericDate_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.numericDate_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 2) {
        if (id == "distanceFromTop")
            chequeOptions.letterDate_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.letterDate_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.letterDate_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.letterDate_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.letterDate_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.letterDate_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 3) {
        if (id == "distanceFromTop")
            chequeOptions.letterAmount_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.letterAmount_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.letterAmount_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.letterAmount_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.letterAmount_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.letterAmount_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 4) {
        if (id == "distanceFromTop")
            chequeOptions.recipient_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.recipient_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.recipient_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.recipient_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.recipient_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.recipient_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 5) {
        if (id == "distanceFromTop")
            chequeOptions.idNo_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.idNo_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.idNo_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.idNo_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.idNo_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.idNo_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 6) {
        if (id == "distanceFromTop")
            chequeOptions.numericAmount_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.numericAmount_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.numericAmount_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.numericAmount_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.numericAmount_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.numericAmount_FontSize = value
    }
    else if (statusOfBankCheckAmounts == 7) {
        if (id == "distanceFromTop")
            chequeOptions.description_Top = value
        else if (id == "distanceFromRight")
            chequeOptions.description_Right = value
        else if (id == "widthChequeElements")
            chequeOptions.description_Width = value
        else if (id == "heightChequeElements")
            chequeOptions.description_Height = value
        else if (id == "fontTextCheque")
            chequeOptions.description_Font = value
        else if (id == "fontSizeCheque")
            chequeOptions.description_FontSize = value
    }
}

function setSettingsByBank() {

    //colorText
    $("#colorPrint").val(chequeOptions.colorText).trigger("change")


    //numericDate
    $("#numericDate").css("margin-top", chequeOptions.numericDate_Top)
    $("#numericDate").css("margin-right", chequeOptions.numericDate_Right)
    $("#numericDate").css("width", chequeOptions.numericDate_Width)
    $("#numericDate").css("height", chequeOptions.numericDate_Height)
    $("#numericDate").css("font-family", chequeOptions.numericDate_Font)
    $("#numericDate").css("font-size", chequeOptions.numericDate_FontSize)


    //letterDate
    $("#letterDate").css("margin-top", chequeOptions.letterDate_Top)
    $("#letterDate").css("margin-right", chequeOptions.letterDate_Right)
    $("#letterDate").css("width", chequeOptions.letterDate_Width)
    $("#letterDate").css("height", chequeOptions.letterDate_Height)
    $("#letterDate").css("font-family", chequeOptions.letterDate_Font)
    $("#letterDate").css("font-size", chequeOptions.letterDate_FontSize)


    //numericAmountContent
    $("#numericAmount").css("margin-top", chequeOptions.numericAmount_Top)
    $("#numericAmount").css("margin-right", chequeOptions.numericAmount_Right)
    $("#numericAmount").css("width", chequeOptions.numericAmount_Width)
    $("#numericAmount").css("height", chequeOptions.numericAmount_Height)
    $("#numericAmount").css("font-family", chequeOptions.numericAmount_Font)
    $("#numericAmount").css("font-size", chequeOptions.numericAmount_FontSize)


    //letterAmount
    $("#letterAmount").css("margin-top", chequeOptions.letterAmount_Top)
    $("#letterAmount").css("margin-right", chequeOptions.letterAmount_Right)
    $("#letterAmount").css("width", chequeOptions.letterAmount_Width)
    $("#letterAmount").css("height", chequeOptions.numericAmount_Height)
    $("#letterAmount").css("font-family", chequeOptions.letterAmount_Font)
    $("#letterAmount").css("font-size", chequeOptions.letterAmount_FontSize)


    //recipientContent
    $("#recipient").css("margin-top", chequeOptions.recipient_Top)
    $("#recipient").css("margin-right", chequeOptions.recipient_Right)
    $("#recipient").css("width", chequeOptions.recipient_Width)
    $("#recipient").css("height", chequeOptions.recipient_Height)
    $("#recipient").css("font-family", chequeOptions.recipient_Font)
    $("#recipient").css("font-size", chequeOptions.recipient_FontSize)


    //nationalCode
    $("#nationalCode").css("margin-top", chequeOptions.idNo_Top)
    $("#nationalCode").css("margin-right", chequeOptions.idNo_Right)
    $("#nationalCode").css("width", chequeOptions.idNo_Width)
    $("#nationalCode").css("height", chequeOptions.idNo_Height)
    $("#nationalCode").css("font-family", chequeOptions.idNo_Font)
    $("#nationalCode").css("font-size", chequeOptions.idNo_FontSize)


    ////description
    $("#description").css("margin-top", chequeOptions.description_Top)
    $("#description").css("margin-right", chequeOptions.description_Right)
    $("#description").css("width", chequeOptions.description_Width)
    $("#description").css("height", chequeOptions.description_Height)
    $("#description").css("font-family", chequeOptions.description_Font)
    $("#description").css("font-size", chequeOptions.description_FontSize)


    // متنی یا چهارخانه
    if (chequeOptions.numericDate_IsSeprate)
        $("#numericDateSetting").val(1).trigger("change")
    else
        $("#numericDateSetting").val(0).trigger("change")

    if (chequeOptions.numericAmount_IsSeprate)
        $("#numericAmountSetting").val(1).trigger("change")
    else
        $("#numericAmountSetting").val(0).trigger("change")


    //isActiveElm
    if (chequeOptions.numericDate_IsActive)
        $("#cheque  #numericDate").css("display", "flex")
    else
        $("#cheque  #numericDate").css("display", "none")

    if (chequeOptions.letterDate_IsActive)
        $("#cheque  #letterDate").css("display", "flex")
    else
        $("#cheque  #letterDate").css("display", "none")

    if (chequeOptions.letterAmount_IsActive)
        $("#cheque  #letterAmount").css("display", "flex")
    else
        $("#cheque  #letterAmount").css("display", "none")


    if (chequeOptions.recipient_IsActive)
        $("#cheque  #recipient").css("display", "flex")
    else
        $("#cheque  #recipient").css("display", "none")

    if (chequeOptions.idNo_IsActive)
        $("#cheque  #nationalCode").css("display", "flex")
    else
        $("#cheque  #nationalCode").css("display", "none")


    if (chequeOptions.numericAmount_IsActive)
        $("#cheque  #numericAmount").css("display", "flex")
    else
        $("#cheque  #numericAmount").css("display", "none")


    if (chequeOptions.description_IsActive)
        $("#cheque  #description").css("display", "flex")
    else
        $("#cheque  #description").css("display", "none")

    //width - height
    makeRulerVertical(chequeOptions.height.split("mm")[0])
    makeRulerHorizonal(chequeOptions.width.split("mm")[0])

}

function printCheque() {

    let content = $("#chequeForPrint").html()
    content = content.replaceAll("border: 2px solid rgb(187, 187, 187);", "")
    content = content.replaceAll("background: url(&quot;/Content/images/dot.png&quot;) 0% 0% / 10mm 10mm repeat" , "")


    document.querySelector("#frmDirectPrint").contentDocument.children[0].innerHTML = content;
    $('#frmDirectPrint').contents().find("body").html($('#frmDirectPrint').contents().find("body").html() + footerBodyPrintIfrem);
}

function checkInputs() {



    let width = $("#chequeWidth").val()
    let height = $("#chequeHeight").val()
    let distanceFromTop = $("#distanceFromTop").val()
    let distanceFromRight = $("#distanceFromRight").val()
    let widthChequeElements = $("#widthChequeElements").val()
    let heightChequeElements = $("#heightChequeElements").val()
    let fontSizeCheque = +$("#fontSizeCheque").val()
    let widthCheque = lastWidthCheque
    let heightCheque = lastHeightCheque


    width = width.replaceAll("_", 0)
    width = width.replaceAll("/", ".")
    if (+width < 15 || +width > 20) {
        var msg = alertify.warning("عرض چک باید بین 15 تا 20 سانتی متر باشد");
        msg.delay(alertify_delay);
        $("#chequeWidth").focus()
        return false
    }

    height = height.replaceAll("_", 0)
    height = height.replaceAll("/", ".")
    if (+height < 6 || +height > 10) {
        var msg = alertify.warning("عرض چک باید بین 15 تا 20 سانتی متر باشد");
        msg.delay(alertify_delay);
        $("#chequeHeight").focus()
        return false
    }

    if ($("#statusOfBankCheckAmounts").val() == 0)
        return true

    distanceFromTop = distanceFromTop.replaceAll("_", 0)
    distanceFromTop = distanceFromTop.replaceAll("/", ".")
    if (+distanceFromTop > +heightCheque) {
        //var msg = alertify.warning(`فاصله از بالا نمی تواند بیشتر از ارتفاع چک (${heightCheque}cm) باشد`);
        //msg.delay(alertify_delay);
        $("#distanceFromTop").focus()
        return false
    }

    distanceFromRight = distanceFromRight.replaceAll("_", 0)
    distanceFromRight = distanceFromRight.replaceAll("/", ".")
    if (+distanceFromRight > +widthCheque) {
        //var msg = alertify.warning(`فاصله از راست نمی تواند بیشتر از عرض چک (${widthCheque}cm) باشد`);
        //msg.delay(alertify_delay);
        $("#distanceFromRight").focus()
        return false
    }

    widthChequeElements = widthChequeElements.replaceAll("_", 0)
    widthChequeElements = widthChequeElements.replaceAll("/", ".")
    if (+widthChequeElements > +widthCheque) {
        //var msg = alertify.warning(`عرض وارد شده، باید کمتر از عرض چک (${widthCheque}cm) باشد`);
        //msg.delay(alertify_delay);
        $("#widthChequeElements").focus()
        return false
    }

    heightChequeElements = heightChequeElements.replaceAll("_", 0)
    heightChequeElements = heightChequeElements.replaceAll("/", ".")
    if (+heightChequeElements > +heightCheque) {
        //var msg = alertify.warning(`ارتفاع وارد شده، باید کمتر از ارتفاع چک (${heightCheque}cm) باشد`);
        //msg.delay(alertify_delay);
        $("#heightChequeElements").focus()
        return false
    }

    if (fontSizeCheque > 20 || fontSizeCheque < 8) {
        //var msg = alertify.warning("اندازه فونت باید بین 8 تا 20 پیکسل باشد");
        //msg.delay(alertify_delay);
        $("#fontSizeCheque").focus()
        return false;
    }

    return true

}

$("#bankId").on("change", function () {

    let bankId = +$(this).val()

    if (bankId == 0)
        initialSettings(true)
    else {
        let url = `${viewData_baseUrl_FM}/TreasuryBondDesignApi/getrecordbybankid/${bankId}`;

        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: result => {

                if (checkResponse(result.data)) {
                    chequeOptions = null
                    chequeOptions = result.data
                    isInsert = false
                    canDeleteBankCheque = true
                    setSettingsByBank()
                }
                else {
                    var msg = alertify.warning("برای این بانک چکی ثبت نشده است");
                    msg.delay(alertify_delay);
                    isInsert = true
                    initialSettings(true)
                }
            },
            error: function (xhr) {
                error_handler(xhr, url);
            }
        });
    }

})

$("#colorPrint").on("change", function () {
    let colorPrint = $(this).val()

    chequeOptions.colorText = colorPrint

    if (colorPrint == "black")
        $("#cheque div").css("color", "black")
    else if (colorPrint == "blue")
        $("#cheque div").css("color", "blue")
    else if (colorPrint == "red")
        $("#cheque div").css("color", "red")
    else if (colorPrint == "green")
        $("#cheque div").css("color", "green")
})

$("#chequeWidth").on("blur", function () {

    let chequeWidth = $(this).val()

    chequeWidth = chequeWidth.replaceAll("_", 0)

    chequeWidth = chequeWidth.replaceAll("/", ".")

    if (+chequeWidth < 15 || +chequeWidth > 20) {
        var msg = alertify.warning("عرض چک باید بین 15 تا 20 سانتی متر باشد");
        msg.delay(alertify_delay);

        if (chequeWidth == "")
            $(this).val("0/0")
        else if (!chequeWidth.includes("/"))
            $(this).val(chequeWidth + "/0")
        else
            $(this).val(chequeWidth)

        return;
    }


    chequeOptions.width = `${chequeWidth * 10}mm`
    makeRulerHorizonal(chequeWidth * 10)

})

$("#chequeHeight").on("blur", function () {

    let chequeHeight = $(this).val()

    chequeHeight = chequeHeight.replaceAll("_", 0)

    chequeHeight = chequeHeight.replaceAll("/", ".")

    if (+chequeHeight < 6 || +chequeHeight > 10) {
        var msg = alertify.warning("ارتفاع چک باید بین 6 تا 10 سانتی متر باشد");
        msg.delay(alertify_delay);

        chequeHeight = chequeHeight.replaceAll(".", "/")

        if (chequeHeight == "")
            $(this).val("0/0")
        else if (!chequeHeight.includes("/"))
            $(this).val(chequeHeight + "/0")
        else
            $(this).val(chequeHeight)

        return;
    }

    chequeOptions.height = `${chequeHeight * 10}mm`
    makeRulerVertical(chequeHeight * 10)

})

$("#distanceFromTop").on("blur", function () {

    let distanceFromTop = $(this).val()
    let heightCheque = lastHeightCheque

    distanceFromTop = distanceFromTop.replaceAll("_", 0)

    if (distanceFromTop == "" || distanceFromTop == "00/0")
        $(this).val("0/0")
    else
        $(this).val(distanceFromTop)

    distanceFromTop = distanceFromTop.replaceAll("/", ".")


    if (+distanceFromTop > +heightCheque) {
        var msg = alertify.warning(`فاصله از بالا نمی تواند بیشتر از ارتفاع چک (${heightCheque}cm) باشد`);
        msg.delay(alertify_delay);
        return;
    }

    setModelCheque("distanceFromTop", `${distanceFromTop == "" ? 0 : distanceFromTop * 10}mm`)


    if (checkResponse(elemntInCheque))
        $(elemntInCheque).css("margin-top", `${distanceFromTop == "" ? 0 : distanceFromTop * 10}mm`)

})

$("#distanceFromRight").on("blur", function () {

    let distanceFromRight = $(this).val()
    let widthCheque = lastWidthCheque


    distanceFromRight = distanceFromRight.replaceAll("_", 0)

    if (distanceFromRight == "" || distanceFromRight == "00/0")
        $(this).val("0/0")
    else
        $(this).val(distanceFromRight)

    distanceFromRight = distanceFromRight.replaceAll("/", ".")

    if (+distanceFromRight > +widthCheque) {
        var msg = alertify.warning(`فاصله از راست نمی تواند بیشتر از عرض چک (${widthCheque}cm) باشد`);
        msg.delay(alertify_delay);
        return;
    }


    setModelCheque("distanceFromRight", `${distanceFromRight == "" ? 0 : distanceFromRight * 10}mm`)


    if (checkResponse(elemntInCheque))
        $(elemntInCheque).css("margin-right", `${distanceFromRight == "" ? 0 : distanceFromRight * 10}mm`)


})

$("#widthChequeElements").on("blur", function () {

    let widthChequeElements = $(this).val()
    let widthCheque = lastWidthCheque

    widthChequeElements = widthChequeElements.replaceAll("_", 0)

    if (widthChequeElements == "" || widthChequeElements == "00/0")
        $(this).val("0/0")
    else
        $(this).val(widthChequeElements)

    widthChequeElements = widthChequeElements.replaceAll("/", ".")

    if (+widthChequeElements > +widthCheque) {
        var msg = alertify.warning(`عرض وارد شده، باید کمتر از عرض چک (${widthCheque}cm) باشد`);
        msg.delay(alertify_delay);
        return;
    }

    setModelCheque("widthChequeElements", `${widthChequeElements == "" ? 0 : widthChequeElements * 10}mm`)

    if (checkResponse(elemntInCheque))
        $(elemntInCheque).css("width", `${widthChequeElements == "" ? 0 : widthChequeElements * 10}mm`)

})

$("#heightChequeElements").on("blur", function () {

    let heightChequeElements = $(this).val()
    let heightCheque = lastHeightCheque

    heightChequeElements = heightChequeElements.replaceAll("_", 0)

    if (heightChequeElements == "" || heightChequeElements == "00/0")
        $(this).val("0/0")
    else
        $(this).val(heightChequeElements)

    heightChequeElements = heightChequeElements.replaceAll("/", ".")

    if (+heightChequeElements > +heightCheque) {
        var msg = alertify.warning(`ارتفاع وارد شده، باید کمتر از ارتفاع چک (${heightCheque}cm) باشد`);
        msg.delay(alertify_delay);
        return;
    }

    setModelCheque("heightChequeElements", `${heightChequeElements == "" ? 0 : heightChequeElements * 10}mm`)

    if (checkResponse(elemntInCheque))
        $(elemntInCheque).css("height", `${heightChequeElements == "" ? 0 : heightChequeElements * 10}mm`)

})

$("#fontTextCheque").on("change", function () {
    let fontTextCheque = $(this).val()


    setModelCheque("fontTextCheque", fontTextCheque)

    if (checkResponse(elemntInCheque)) {
        if (fontTextCheque == "iransans")
            $(elemntInCheque).css("font-family", 'iransans')
        else if (fontTextCheque == 'B Badr')
            $(elemntInCheque).css("font-family", 'B Badr')
        else if (fontTextCheque == 'B Titr')
            $(elemntInCheque).css("font-family", 'B Titr')
    }
})

$("#fontSizeCheque").on("blur", function () {
    let fontSizeCheque = +$(this).val()

    if (fontSizeCheque > 20 || fontSizeCheque < 8) {
        var msg = alertify.warning("اندازه فونت باید بین 8 تا 20 پیکسل باشد");
        msg.delay(alertify_delay);
        return;
    }

    setModelCheque("fontSizeCheque", `${fontSizeCheque}px`)

    if (checkResponse(elemntInCheque))
        $(elemntInCheque).css("font-size", `${fontSizeCheque}px`)

})

$("#copybankCheque").on("click", function () {

    let originBankId = +$("#sourceBank").val()
    let destinationBankId = +$("#destinationBank").val()

    if (originBankId == 0) {
        var msg = alertify.warning("بانک مبدا را وارد کنید");
        msg.delay(alertify_delay);
        $("#sourceBank").select2("focus")
        return;
    }

    if (destinationBankId == 0) {
        var msg = alertify.warning("بانک مقصد را وارد کنید");
        msg.delay(alertify_delay);
        $("#destinationBank").select2("focus")
        return;
    }

    if (originBankId == destinationBankId) {
        var msg = alertify.warning("بانک مبدا و مقصد نمی تواند یکی باشد");
        msg.delay(alertify_delay);
        return;
    }


    let url = `${viewData_baseUrl_FM}/TreasuryBondDesignApi/bankduplicate`;

    let model = {
        originBankId,
        destinationBankId
    }

    $.ajax({
        url: url,
        async: false,
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: result => {

            if (result.successfull) {
                var msg = alertify.success("کپی بانک با موفقیت انجام شد");
                msg.delay(alertify_delay);
                $("#bankId").val(0).trigger("change")
                $("#bankId").select2("focus")
            }
            else {
                var msg = alertify.error("کپی بانک ناموفق بود");
                msg.delay(alertify_delay);
            }

        },
        error: function (xhr) {
            error_handler(xhr, url);
        }
    });
})

$("#statusOfBankCheckAmounts").on("change", function () {
    
    let elmId = $("#statusOfBankCheckAmounts").children("option:selected").attr("data-id")
    let elm = $(`#${elmId}`)
    let elmVal = $(this).val()

    $(".elementFocus").css("border", "2px solid #BBB")

    if (elmVal != 0) {
        if (elmId == "numericDate")
            $("#isActive").prop("checked", chequeOptions.numericDate_IsActive)
        else if (elmId == "letterDate")
            $("#isActive").prop("checked", chequeOptions.letterDate_IsActive)
        else if (elmId == "letterAmount")
            $("#isActive").prop("checked", chequeOptions.letterAmount_IsActive)
        else if (elmId == "recipient")
            $("#isActive").prop("checked", chequeOptions.recipient_IsActive)
        else if (elmId == "nationalCode")
            $("#isActive").prop("checked", chequeOptions.idNo_IsActive)
        else if (elmId == "numericAmount")
            $("#isActive").prop("checked", chequeOptions.numericAmount_IsActive)
        else if (elmId == "description")
            $("#isActive").prop("checked", chequeOptions.description_IsActive)

        elemntInCheque = elm
        setInputsByElementsCheque(elmId)
        elm.css("border", "2px solid #EF5350")
        $("#privateSettingCheque input,#privateSettingCheque select").removeAttr("disabled")
    }
    else {
        $("#isActive").prop("checked", true)
        elemntInCheque = null
        $("#privateSettingCheque input,#privateSettingCheque select").attr("disabled", "disabled")
        $("#distanceFromTop").val("")
        $("#distanceFromRight").val("")
        $("#widthChequeElements").val("")
        $("#heightChequeElements").val("")
        $("#fontTextCheque").prop('selectedIndex', 0)
        $("#fontSizeCheque").val("")
    }

    elementOptions(elm)
})

$("#cheque").mouseover(function () {
    verticalRulerPointer.css("display", "")
    horizontalRulerPointer.css("display", "")
})

$("#cheque").mousemove(function (e) {

    let offsetX = e.offsetX
    let offsetY = e.offsetY
    let width = Math.round(+$("#chequeBackground").css("width").split("px")[0])

    horizontalRulerPointer.css("margin-right", width - offsetX)
    verticalRulerPointer.css("margin-right", offsetY)

});

$("#cheque").mouseout(function (e) {
    verticalRulerPointer.css("display", "none")
    horizontalRulerPointer.css("display", "none")
})

$("#TreasuryBondDesign").on("keydown", function (ev) {
    if (ev.ctrlKey && ev.keyCode === KeyCode.key_s) {
        ev.preventDefault();
        saveForm()
    }
});

initForm()
