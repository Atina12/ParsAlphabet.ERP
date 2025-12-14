
(function ($) {
    $.fn.suggestBox = function (optionValue) {
        let options = optionValue;
        let doneTypingInterval = options.doneTypingInterval != undefined ? options.doneTypingInterval : 500;
        let api = options.api;
        let minLength = 3,
            paramterName = options.paramterName,
            filterModel = typeof options.suggestFilter == "undefined" ? {} : options.suggestFilter,
            form_KeyValue = typeof options.form_KeyValue == "undefined" ? [] : options.form_KeyValue,
            callBackSearche = typeof options.callBackSearche == "undefined" ? () => true : options.callBackSearche,
            currentElm = $(this),
            continerIsOpen = false;

        let id = currentElm.attr("id");
        let continerId = `suggestContainer_${id}`,
            removeItemId = `suggestContainer_removeItem_${id}`,
            openContinerId = `suggestContainer_openContiner_${id}`;

        if (currentElm.parent().find(".suggest-container").length == 0) {
            let dataString =
                `      
                    <span id="${removeItemId}" class="suggest-icon suggest-icon-remove">×</span>
                    <span id="${openContinerId}" class="suggest-icon suggest-icon-open"><i class="fas fa-angle-down"></i></span>
                    <div id="${continerId}" class="suggest-container"></div>
                `;
            currentElm.parent().append("<div class='suggest-main'></div>");
            currentElm.appendTo(currentElm.parent().find(".suggest-main"));
            currentElm.parent().append(dataString);
        }

        currentElm.addClass("suggest-box");
        currentElm.parent().addClass("position-relative");

        var typingTimer;
        clearTimeout(typingTimer);

        //on keydown, clear the countdown 
        currentElm.off("keydown");
        currentElm.on('keydown', function (e) {
            if (e.keyCode === KeyCode.Esc) {
                if (continerIsOpen) {
                    e.preventDefault();
                    e.stopPropagation();
                    resetContainer();
                }
            }

            clearTimeout(typingTimer);
        });

        //on keyup, start the countdown     
        currentElm.off("keyup");
        currentElm.on('keyup', function (e) {
            if (e.keyCode === KeyCode.ArrowDown && $(".suggest-container").hasClass("suggest-container-open")) {
                focusRow("suggestRow");
                return;
            }
            else if (e.keyCode != KeyCode.Enter && e.keyCode != KeyCode.ArrowDown && e.keyCode != KeyCode.Esc && callBackSearche()) {
                let value = currentElm.val();
                if (value.length >= minLength && callBackSearche()) {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(() => { createSuggestBox(value) }, doneTypingInterval);
                }
            }
        });
        currentElm.off("input change");
        currentElm.on('input change', function (e) {
            let value = currentElm.val();
            if (value.length < minLength)
                resetContainer();
        });

        currentElm.off("blur");
        currentElm.on('blur', function (e) {
            nextElm = $(e.relatedTarget);
            if (!nextElm.hasClass("suggest-row")) {
                if (continerIsOpen)
                    resetContainer();
            }
        });

        $(`#${removeItemId}`).off('click');
        $(`#${removeItemId}`).on('click', function (e) {
            currentElm.val("");
            resetContainer();
        });
        $(`#${openContinerId}`).off('click');
        $(`#${openContinerId}`).on('click', function (e) {
            if (continerIsOpen)
                resetContainer();
            else {
                let value = currentElm.val();
                if (value.length >= minLength && callBackSearche())
                    createSuggestBox(value);
            }
        });

        function createSuggestBox(value) {
            var regex = /^[a-zA-Z0-9ا-ی_.-]*$/;
            if (!regex.test(value))
                return false;

            let data = getDatasuggestBox(value);
            fillDatasuggestBox(data.data);
        }

        function getDatasuggestBox(value) {
            let model = createModel(paramterName, value);
            let result = $.ajax({
                url: api,
                type: "post",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(model),
                success: function (result) {
                    return result;
                },
                error: function (xhr) {
                    error_handler(xhr, api)
                }
            });
            return result.responseJSON;
        }

        function createModel(paramterName, value) {
            let model = {};
            let modelParamter = {}

            model["parameters"] = [];
            model["form_KeyValue"] = form_KeyValue;
            model["items"] = typeof filterModel.items == "undefined" ? [] : filterModel.items;
            model["filter"] = typeof filterModel.filter == "undefined" ? "" : filterModel.filter;

            modelParamter.name = paramterName;
            modelParamter.value = value;

            model["parameters"].push(modelParamter);

            return model;
        }

        function setValue(value) {
            currentElm.val(value);
            resetContainer();
        }

        function focusRow(id, newIndex = 0) {
            let newElm = $(`#${id}_${newIndex}`);
            if (newElm.length > 0) {
                $(".suggest-row").removeClass("highlight-suggest");
                newElm.addClass("highlight-suggest").focus();
            }
        }

        function resetContainer() {
            $(`#${continerId}`).html("");
            //currentElm.focus();
            afterEmpty();
        }

        function afterFill() {
            currentElm.addClass("suggest-box-open");
            $(`#${continerId}`).addClass("suggest-container-open");
            $(`#${openContinerId} i`).addClass("fa-angle-up").removeClass("fa-angle-down");
            continerIsOpen = true;
        }

        function afterEmpty() {
            currentElm.removeClass("suggest-box-open");
            $(`#${continerId}`).removeClass("suggest-container-open");
            $(`#${openContinerId} i`).removeClass("fa-angle-up").addClass("fa-angle-down");
            continerIsOpen = false;
        }

        function fillDatasuggestBox(data) {

            let dataLn = data.length, output = '';
            $(`#${continerId}`).html(output);
            if (dataLn > 0) {
                for (var i = 0; i < dataLn; i++) {
                    output += `<div class="suggest-row" id="suggestRow_${i}" tabindex="-1">${data[i].name}</div>`;
                }
                $(`#${continerId}`).html(output);
                $(`#${continerId} .suggest-row`).off('click');
                $(`#${continerId} .suggest-row`).on("click", function () {
                    setValue($(this).text());
                });
                $(`#${continerId} .suggest-row`).off('keydown');
                $(`#${continerId} .suggest-row`).on("keydown", function (e) {
                    if (![KeyCode.ArrowDown, KeyCode.ArrowUp, KeyCode.Enter, KeyCode.Esc].includes(e.keyCode))
                        return;

                    let elm = $(this);
                    let id = elm.attr("id").split("_")[0];
                    let index = +elm.attr("id").split("_")[1];

                    if (e.keyCode === KeyCode.ArrowDown) {
                        e.preventDefault();
                        e.stopPropagation();
                        focusRow(id, index + 1);
                    }
                    else if (e.keyCode === KeyCode.ArrowUp) {
                        e.preventDefault();
                        e.stopPropagation();
                        focusRow(id, index - 1);
                    }
                    else if (e.keyCode === KeyCode.Enter) {
                        e.preventDefault();
                        e.stopPropagation();
                        setValue(elm.text())
                    }
                    else if (e.keyCode === KeyCode.Esc) {
                        if (continerIsOpen) {
                            e.preventDefault();
                            e.stopPropagation();
                            resetContainer();
                        }
                    }

                });
                //focusRow("suggestRow");
                afterFill();
            }
            else
                resetContainer();
        }
        currentElm.trigger("change");
    }
}(jQuery));
