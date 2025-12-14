
var elemOnKeyDown = undefined, idSelector = "", idElement = "", filterOption = "", filtervalue = "", searchScrolls = { current: 0, prev: 0 },
    currentElemItem = {}, searchResult = 0, isSearcheModalOpen = false, searchDataOrder = { colId: "", sort: "", index: 0 },
    currentSearchPageTable = { pagerowscount: 50, currentpage: 1, endData: false, pageNo: 0, currentrow: 1, filteritem: "", filtervalue: "", filterItems: [], parameters: [], filter: "", searchUrl: "", option: {} }, lastPageNoloaded = 0;
(function ($) {

    $.fn.searchModal = function (options) {
        var elemId = this.attr("id");
        var parent = $(this).parent(),
            btnSearchId = `btn-search-${$(this).attr("id")}`,
            btnSearch = `<span class="input-group-btn input-group-append">
                        <button id="${btnSearchId}" onclick="" class="btn btn-secondary bootstrap-touchspin-up inputsearch-icon" type="button" data-toggle="tooltip" data-placement="bottom" title="جستجو">
                            <i class="fas fa-search"></i>
                        </button>
                     </span>`;
        parent.prepend(`<div class ='input-group bootstrap-touchspin bootstrap-touchspin-injected search-modal-container' id='search-modal-container-${$(this).attr("id")}'></div><div id='${$(this).attr("id")}ErorrContiner'></div>`);
        var container = $(`#search-modal-container-${$(this).attr("id")}`);
        $(this).appendTo(container);
        $(`${btnSearch}`).appendTo(container);
        $(".double-inputsearch-box").find("i").removeClass("fa-search").addClass("fa-ellipsis-h");
        options.btnSearchId = btnSearchId;

        var elmOnKeyDown = function (e) {
            if (e.shiftKey && e.ctrlKey && e.keyCode === KeyCode.key_f) {
                $(`#btn-search-${$(this).attr("id")}`).click();
            }
        };

        elemOnKeyDown = elmOnKeyDown;
        $(`#${elemId}`).on("keydown", elmOnKeyDown);

        $(`#${elemId}`).on("focus", function (ev) {
            $(`#btn-search-${elemId}`).addClass("double-button-search-focus");
        });

        $(`#${elemId}`).on("blur", function () {
            $(`#btn-search-${elemId}`).removeClass("double-button-search-focus");
        });

        $(`#${elemId}`).on("classChange", function () {

            if ($(this).hasClass("search-disable")) {
                $(`#btn-search-${$(this).attr("id")}`).prop("disabled", true);
            }
            else
                $(`#btn-search-${$(this).attr("id")}`).prop("disabled", false);

        });

        $(`#${btnSearchId}`).on("click", function () {
            if (typeof options.onclickFunction !== "undefined") {
                if (options.onclickFunction())
                    clickSearcheBtn();
            }
            else
                clickSearcheBtn();
        });

        function clickSearcheBtn() {
            isSearcheModalOpen = true;
            let elementSearchBody = $(`#modalSearchbody .table-responsive`);
            elementSearchBody.off("scroll");

            $("#searchModal").off("hidden.bs.modal");
            $("#searchModal").on("hidden.bs.modal", modelHidden);

            $("#searchFilterBtn").off("click");
            $("#searchFilterBtn").on("click", searchFilterValueKeyPress);

            $("#searchFilterValue").off("keypress");
            $("#searchFilterValue").on("keypress", searchFilterValueKeyPress);

            $("#searchRemoveFilter").off("click");
            $("#searchRemoveFilter").on("click", removeFilter_Search);

            var elm = $(`#btnSearchFilter`);
            elm.text("مورد فیلتر");
            elm.attr("data-id", "filter-non");
            filterOption = "filter-non";
            var elm_v = $(`#searchFilterValue`);
            elm_v.val("");
            $(`#searchRemoveFilter`).addClass("d-none");
            $(`#searchOpenFilter`).removeClass("d-none");
            filterOption = "";
            filtervalue = "";
            //end reset filterValue


            resetFormSearch();
            currentSearchPageTable.searchUrl = options.searchUrl;
            currentSearchPageTable.filter = options.filter == undefined ? "" : options.filter;
            currentSearchPageTable.option = options;
            if (options.modelItems !== undefined)
                currentSearchPageTable.filterItems = initialModel();
            else
                currentSearchPageTable.parameters = initialModel();
            getvalueSearch();
        }

        function getvalueSearch(isInsert = false) {
            
            if (!isInsert) {
                currentSearchPageTable.pageNo = 0
                currentSearchPageTable.currentpage = 1;
                currentSearchPageTable.currentrow = 1;
                currentSearchPageTable.endData = false;
            }

            var model = {
                items: currentSearchPageTable.filterItems,
                parameters: currentSearchPageTable.parameters,
                filter: currentSearchPageTable.filter == undefined ? "" : currentSearchPageTable.filter,
                pageno: currentSearchPageTable.pageNo,
                pagerowscount: currentSearchPageTable.pagerowscount,
                fieldItem: currentSearchPageTable.filteritem,
                fieldValue: currentSearchPageTable.filtervalue,
                form_KeyValue: currentSearchPageTable.option.form_KeyValue,
                sortModel: {
                    colId: searchDataOrder.colId,
                    sort: searchDataOrder.sort
                }
            }

            //if (!checkResponse(model.items) || model.items.length <= 1) {
            //    var alert = alertify.warning("مورد فیلتر را انتخاب کنید");
            //    alert.delay(alertify_delay);
            //    $('#searchModal #searchFilterValue').val("").focus();
            //    return;
            //}

            $.ajax({
                url: currentSearchPageTable.searchUrl,
                type: "post",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(model),
                success: function (result) {

                    
                    if (result) {
                        if (currentSearchPageTable.pageNo == 0) {
                            if (result.data == null || result.data.length == 0) {
                                var alert = alertify.warning(msg_nothing_found);
                                alert.delay(alertify_delay);
                                $("#searchModal #SearchList").html("")
                                $("#searchModal #SearchList").html(`<tr><td colspan="${$("#searchModal #searchHeader").children().length + 1}" style="text-align:center">سطری وجود ندارد</td></tr>`)
                                $('#searchModal #searchFilterValue').focus();
                                //$(`#${elemId}`).val("").focus();
                                //modelHidden();
                                return;
                            }
                        }
                        else {
                            if (result.data == null || result.data.length == 0)
                                currentSearchPageTable.endData = true;
                        }
                        if (currentSearchPageTable.pageNo == 0) {

                            fillmodalHeader();
                            let elementSearchBody = $(`#modalSearchbody .table-responsive`);
                            elementSearchBody.off("scroll");

                            $("#SearchList").html("");
                        }
                        fillModalSearch(result);
                    }
                },
                error: function (xhr) {
                    error_handler(xhr, currentSearchPageTable.searchUrl)
                }
            });
        }

        function fillmodalHeader() {
            $("#searchHeader").html("");
            $("#filterItms").html("");
            var columnStr = "";
            var filterItemsStr = "";
            let options = currentSearchPageTable.option;
            for (var i = 0; i < options.column.length; i++) {

                if (options.column[i].isDtParameter == undefined || options.column[i].isDtParameter)
                    columnStr += `<th class="${options.column[i].width != undefined ? 'col-width-percent-' + options.column[i].width : ''}">${options.column[i].name}</th>`;

                if (options.column[i].isFilterParameter && typeof options.column[i].name !== "undefined")
                    filterItemsStr += `<button class="dropdown-item" data-id='${options.column[i].id}' data-name='${options.column[i].name}'>${options.column[i].name}</button>`;
            }
            columnStr += `<th class="col-width-percent-20">عملیات</th>`;
            $(columnStr).appendTo("#searchHeader");
            $("#filterItms").html(filterItemsStr);


        }

        function handlerInsertSearch() {
            let elmenet = $(`#modalSearchbody .table-responsive`);
            let elmenetjs = document.querySelector(`#modalSearchbody .table-responsive`);
            elmenet.on('scroll', (e) => {
                searchScrolls.current = elmenet.scrollTop();
                if (searchScrolls.prev !== searchScrolls.current) {
                    searchScrolls.prev = searchScrolls.current;
                    if (elmenetjs.offsetHeight + elmenetjs.scrollTop >= elmenetjs.scrollHeight)
                        insertNewPageSearch();
                }
            });
        }
        function insertNewPageSearch() {
            let pagetable_pageNo = currentSearchPageTable.pageNo,
                pagetable_currentpage = currentSearchPageTable.currentpage,
                pagetable_endData = currentSearchPageTable.endData,
                pageNo = 0;

            if (!pagetable_endData && +pagetable_pageNo == lastPageNoloaded) {
                pageNo = $(`#SearchList tr`).length;
                currentSearchPageTable.currentpage = pagetable_currentpage + 1;
                currentSearchPageTable.pageNo = pageNo;
                getvalueSearch(true);
            }
        }

        function fillModalSearch(result) {
            var value, index, rowStr = "", pagetable_endData = currentSearchPageTable.endData, options = currentSearchPageTable.option,
                pagetable_pagerowscount = currentSearchPageTable.pagerowscount, pagetable_pageno = currentSearchPageTable.pageNo, listLength = result.data.length;
            if (!pagetable_endData) {
                currentSearchPageTable.endData = listLength < pagetable_pagerowscount;
                for (var i = 0; i < listLength; i++) {
                    value = result.data[i];
                    index = pagetable_pageno + i;

                    var setVal = value[options.selectColumn];
                    rowStr += `<tr id="rowSch_${index + 1}" tabindex="-1" data-row="${index + 1}" data-id="${setVal}">`;

                    for (var j = 0; j < options.column.length; j++) {
                        if (options.column[j].isDtParameter == undefined || options.column[j].isDtParameter)
                            rowStr += `<td>${value[options.column[j].id]}</td>`;

                    }

                    rowStr += `<td id="operationSearch_${index + 1}">
                        <button type="button" id="selectId_${index + 1}" data-selectedValue="${setVal}"
                            class="btn btn-info" data-original-title="انتخاب شناسه">
                            <i class="fa fa-check"></i>
                        </button>
                    </td></tr>`;
                }
                $(rowStr).appendTo("#SearchList");

                currentElemItem = options;

                if (options.modalSize != undefined) {
                    $("#searchModal .modal-dialog").removeClass();
                    $("#searchModal div:eq(0)").addClass("modal-dialog");
                    $("#searchModal .modal-dialog").addClass(options.modalSize);
                }
                else {
                    $("#searchModal .modal-dialog").removeClass();
                    $("#searchModal div:eq(0)").addClass("modal-dialog");
                    $("#searchModal .modal-dialog").addClass("modal-xl");
                }

                $("#rowCountResult").text($("#SearchList tr").length);
                lastPageNoloaded = pagetable_pageno;
                focusSearcheRow(currentSearchPageTable.currentrow);

                if (currentSearchPageTable.pageNo == 0) {
                    $("#modalSearchbody .table-responsive").animate({ scrollTop: -10000 }, 'slow');
                    modal_show("searchModal");
                    handlerInsertSearch();
                }

            }
        }

        function resetFormSearch() {

            resetFilterItemSearch();
            $("#SearchList").html("");
        }

        function initialModel() {
            let options = currentSearchPageTable.option;
            let arrayFilterItem = [],
                arrayFiters = currentSearchPageTable.option.column.filter(x => x.isFilterParameter);
            let arrayFitersLn = arrayFiters.length, currentValue = {};
            var modelItems = options.modelItems;
            if (modelItems !== undefined) {
                arrayFilterItem = [0, ""];
                if (modelItems != null) {
                    for (var i = 0; i < modelItems.length; i++) {
                        arrayFilterItem.push($(modelItems[i]).val());
                    }
                }
            }
            else {
                for (var i = 0; i < arrayFitersLn; i++) {
                    currentValue = arrayFiters[i];
                    if (currentValue.isDtParameter == undefined || currentValue.isDtParameter)
                        arrayFilterItem.push({ name: currentValue.id, value: "" });
                    else
                        arrayFilterItem.push({ name: currentValue.id, value: $(`#${currentValue.idInput !== undefined ? currentValue.idInput : currentValue.id}`).val() });
                }
            }
            return arrayFilterItem;
        }

        $(document).on("click", "#SearchList tr", function (e) {
            focusSearcheRow(+$(this).data("row"));
        });

        var removeFilter_Search = () => {
            resetFilterItemSearch()
            filterItemClick();
        }

        function resetFilterItemSearch() {
            $(`#searchRemoveFilter`).addClass("d-none");
            $(`#searchOpenFilter`).removeClass("d-none");
            filterOption = "";
            filtervalue = "";
        }

        $(document).on("click", "#SearchList td button", function () {
            selectIdSearch($(this).data("selectedvalue"));
        })

        function selectIdSearch(id) {
            searchResult = id;
            modal_close('searchModal');
        }

        

        $(document).on("keydown", "#SearchList tr", function (e) {
            var row = +$(this).data("row");
            if ([KeyCode.ArrowUp, KeyCode.ArrowDown, KeyCode.Enter].indexOf(e.keyCode) < 0) return;
            e.preventDefault();
            let countRow = $(`#SearchList tr`).length;

            if (e.keyCode === KeyCode.ArrowUp) {          
                if (row == 1) $("#searchTable").scrollTop(0)           
                focusSearcheRow(row > 1 ? row - 1 : row);
            }

            if (e.keyCode === KeyCode.ArrowDown)
                focusSearcheRow(row < countRow ? row + 1 : row);

            if (e.keyCode === KeyCode.Enter)
                selectIdSearch($(`#rowSch_${row} `).data().id);
        });

        $(document).on("click", "#filterItms button", function () {
            filterItemClick($(this));
        })

        function filterItemClick(elem = undefined) {
            var elm = $(`#btnSearchFilter`);
            var itemid = elem == undefined ? "filter-non" : $(elem).data("id");
            var title = elem == undefined ? "مورد فیلتر" : $(elem).data("name");
            elm.text(title);
            elm.attr("data-id", itemid);
            filterOption = itemid;

            var elm_v = $(`#searchFilterValue`);
            elm_v.val("");

            if (itemid == 'filter-non') {
                let arrayFilterItem = [],
                    arrayFiters = currentSearchPageTable.option.column.filter(x => x.isFilterParameter);
                let arrayFitersLn = arrayFiters.length, currentValue = {};
                if (currentElemItem.modelItems !== undefined) {

                    arrayFilterItem[0] = 0;
                    arrayFilterItem[1] = "";
                    if (currentElemItem.modelItems != null) {
                        for (var i = 0; i < currentElemItem.modelItems.length; i++) {
                            arrayFilterItem.push($(currentElemItem.modelItems[i]).val());
                        }
                    }
                    currentSearchPageTable.filterItems = arrayFilterItem;
                }
                else {

                    for (var i = 0; i < arrayFitersLn; i++) {
                        currentValue = arrayFiters[i];
                        if (currentValue.isDtParameter == undefined || currentValue.isDtParameter)
                            arrayFilterItem.push({ name: currentValue.id, value: "" })
                        else
                            arrayFilterItem.push({ name: currentValue.id, value: $(`#${currentValue.idInput !== undefined ? currentValue.idInput : currentValue.id}`).val() });
                    }

                    currentSearchPageTable.parameters = arrayFilterItem;
                }
                getvalueSearch();
            }
            else {
                $(`#searchOpenFilter`).addClass('d-none');
                $(`#searchRemoveFilter`).removeClass('d-none');
                elm_v.focus();
            }
        }

        function searchFilterValueKeyPress(e, elem = undefined) {
            
            filtervalue = "";
            if (e.type == "click")
                filtervalue = $("#searchFilterBtn").prev("input").val();
            else if (e.which == 13)
                filtervalue = $(this).val();
            if (filtervalue != "") {
                let arrayFilterItem = [],
                    arrayFiters = currentSearchPageTable.option.column.filter(x => x.isFilterParameter);
                let arrayFitersLn = arrayFiters.length, currentValue = {};
                if (currentElemItem.modelItems !== undefined) {
                    if (filterOption == "id") {
                        arrayFilterItem[0] = +filtervalue;
                        arrayFilterItem[1] = "";
                    }
                    else if (filterOption == "name") {
                        arrayFilterItem[0] = 0;
                        arrayFilterItem[1] = filtervalue;
                    }
                    if (currentElemItem.modelItems != null) {
                        for (var i = 0; i < currentElemItem.modelItems.length; i++) {
                            arrayFilterItem.push($(currentElemItem.modelItems[i]).val());
                        }
                    }
                    currentSearchPageTable.filterItems = arrayFilterItem;
                }
                else {

                    for (var i = 0; i < arrayFitersLn; i++) {
                        currentValue = arrayFiters[i];
                        if (currentValue.isDtParameter == undefined || currentValue.isDtParameter) {
                            if (filterOption == currentValue.id)
                                arrayFilterItem.push({ name: currentValue.id, value: filtervalue })
                            else
                                arrayFilterItem.push({ name: currentValue.id, value: "" })
                        }
                        else
                            arrayFilterItem.push({ name: currentValue.id, value: $(`#${currentValue.idInput !== undefined ? currentValue.idInput : currentValue.id}`).val() });
                    }
                    currentSearchPageTable.parameters = arrayFilterItem;
                }

                getvalueSearch();
            }
        }

        function focusSearcheRow(rowNo) {
            $(`#SearchList tr`).removeClass("highlight");
            $(`#rowSch_${rowNo} `).addClass("highlight").focus();
            currentSearchPageTable.currentrow = rowNo;
        }

        $("#searchModal #modal-close").click(function () {
            searchResult = +$(`#${currentElemItem.elemId} `).val() == 0 || Number.isNaN(+ $(`#${currentElemItem.elemId} `).val()) ? "" : +$(`#${currentElemItem.elemId} `).val();
        });

        $("#searchModal").on("shown.bs.modal", function () {
            focusSearcheRow(1);
        });

        function modelHidden() {
            if (+$(`#${elemId} `).val() != +searchResult)
                $(`#${elemId} `).val(searchResult);
            $(`#${elemId} `).focus();

            let elementSearchBody = $(`#modalSearchbody .table-responsive`);
            elementSearchBody.off("scroll");

            isSearcheModalOpen = false;
            elemOnKeyDown = undefined;
            idSelector = ""; idElement = "";
            filterOption = "";
            filtervalue = "";
            searchScrolls = { current: 0, prev: 0 };
            currentElemItem = {};
            searchResult = 0;
            searchDataOrder = { colId: "", sort: "", index: 0 };
            currentSearchPageTable = { form_KeyValue: [], pagerowscount: 50, currentpage: 1, endData: false, pageNo: 0, currentrow: 1, filteritem: "", filtervalue: "", filterItems: [], parameters: [], filter: "", searchUrl: "", option: {} };
            lastPageNoloaded = 0;
            $("#SearchList").empty();
            if (typeof options.selectedCallBack != "undefined")
                options.selectedCallBack();
        }
    }
}(jQuery));

