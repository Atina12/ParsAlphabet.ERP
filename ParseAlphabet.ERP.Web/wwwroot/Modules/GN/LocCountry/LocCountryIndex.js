var viewData_form_title = "کشور";
var viewData_controllername = "LocCountryApi";
var viewData_getrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getrecordbyid`;
var viewData_getpagetable_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getpage`;
var viewData_deleterecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/delete`;
var viewData_insrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/insert`;
var viewData_updrecord_url = `${viewData_baseUrl_GN}/${viewData_controllername}/update`;
var viewData_filter_url = `${viewData_baseUrl_GN}/${viewData_controllername}/getfilteritems`;
var viewData_print_file_url = `${stimulsBaseUrl.GN.Prn}LocCountry.mrt`;
var viewData_print_model = { url: viewData_print_file_url, item: "@Id", value: 0, sqlDbType: 8, size: 0 }
var viewData_print_tableName = "gn.LocCountry";
isSecondLang = true;
var viewData_csv_url = `${viewData_baseUrl_GN}/${viewData_controllername}/csv`;

get_NewPageTableV1();
