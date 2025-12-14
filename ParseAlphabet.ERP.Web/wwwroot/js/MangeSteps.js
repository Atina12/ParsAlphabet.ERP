var activeStepId = "";

function initSteps(id, callBackChange = undefined, callBackFocus = undefined, callBackNext = undefined, callBackPrve = undefined, callBackanimtionSteps = undefined) {

    activeStepId = id;
    $(`#${id}`).steps({
        onChange: function (currentIndex, newIndex, stepDirection) {
            let changeResult = true;

            //createLastElment(id);

            if (typeof callBackanimtionSteps != "undefined")
                callBackanimtionSteps(currentIndex, newIndex, stepDirection);
            else
                animtionSteps();
            //========

            if (typeof callBackChange != "undefined")
                changeResult = callBackChange(currentIndex, newIndex, stepDirection);

            if (!changeResult)
                return changeResult;

            //========
            if (typeof callBackFocus != "undefined")
                callBackFocus(currentIndex, newIndex, stepDirection);
            else
                focusSteps();

            return true;
        },
    });


    $(`#${id}`).off("keydown");
    $(`#${id}`).on("keydown", function (ev) {
        if (ev.keyCode === KeyCode.ArrowRight && ev.ctrlKey)
            if (typeof callBackPrve != "undefined")
                callBackPrve(ev);
            else
                changeSteps(ev, "prev");

        else if (ev.keyCode === KeyCode.ArrowLeft && ev.ctrlKey)
            if (typeof callBackNext != "undefined")
                callBackNext(ev);
            else
                changeSteps(ev, "next");

    });
}

function focusSteps() {

    let firstInput = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").first(),
        tabIndexInput = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").first().prop("tabIndex"),
        last = $(`.step-tab-panel.active`).find("[tabindex]:not(:disabled,span)").last().prop("tabIndex");

    if (firstInput.length < 1)
        return $(`#${activeStepId}`).attr("tabindex", "-2").focus();

    if (!firstInput.prop("disabled") && (firstInput.hasClass("form-control") || firstInput.prop("tagName") == "BUTTON")) {
        for (var i = tabIndexInput; i < last; i++) {

            firstInput = $(`.step-tab-panel.active [tabindex=${i}]`).first();

            if (!firstInput.prop("disabled") && (firstInput.hasClass("form-control") || firstInput.prop("tagName") == "BUTTON")) {

                firstInput.hasClass("select2") ?
                    $(`.step-tab-panel.active #${firstInput.attr("id")}`).next().find('.select2-selection').focus()
                    : $(`.step-tab-panel.active #${firstInput.attr("id")}`).focus();
                break;
            }

        }
    }
    else
        firstInput.hasClass("select2") ?
            $(`.step-tab-panel.active #${firstInput.attr("id")}`).next().find('.select2-selection').focus() : firstInput.focus();

}

function changeSteps(ev, type) {

    ev.preventDefault();
    ev.stopPropagation();

    if (type == "prev") {
        if ($(".step-tab-panel.active").data().step !== "step1")
            $("#prevbutton").click();

    }
    else if (type == "next") {
        let lastStep = "step" + $(".step-tab-panel").length;

        if ($(".step-tab-panel.active").data().step !== lastStep)
            $("#nextbutton").click();
    }
}

function animtionSteps() {

    $(".step-tab-panel.active").removeClass("d-none").fadeIn(150);
    $(".step-tab-panel:not(.active)").addClass("d-none").hide();
    $('.select2-hidden-accessible').each(function (i, obj) {
        $(`#${$(obj).attr("id")}`).select2("close");
    });

}

function createLastElment(id) {

    let idLastElm = $(`#${id} .step-tab-panel.active .last-child-step`).attr("id");

    //$(`#${idLastElm}`).keydown = function (ev) {
    //    ev.preventDefault();
    //    
    //    if (ev.keyCode === KeyCode.Enter)
    //        if (typeof callBackNext != "undefined")
    //            callBackNext(ev);
    //        else
    //            changeSteps(ev, "next");

    //}

    $(`#${idLastElm}`).on("keydown", function (ev) {
        ev.preventDefault();
        if (ev.keyCode === KeyCode.Enter)
            if (typeof callBackNext != "undefined")
                callBackNext(ev);
            else
                changeSteps(ev, "next");
    });
}