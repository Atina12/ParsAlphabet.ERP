var winQuickSearch, quickSearchWindow = true;

$("body").on("keydown", ev => {
    if (ev.ctrlKey && ev.keyCode == 77 && quickSearchWindow == true)
        openQuickSearchForm();
});

function openQuickSearchForm(istreasury = true) {
    
    if (typeof winQuickSearch == "undefined" || winQuickSearch.closed) {

        let screenWidth = $(window).width();
        let screenHeight = $(window).height();

        if (istreasury)
            winQuickSearch = window.open("/FM/TreasurySearch/quicksearchrequest", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);
        else
            winQuickSearch = window.open("/FM/TreasurySearch/quicksearchtreasury", "Quicksearch", `height=${screenHeight},width=${screenWidth}`);
       
           

        window.onbeforeunload = () => winQuickSearch.close();
    }
    else
        winQuickSearch.focus();
}


