using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurance;
using ParsAlphabet.ERP.Application.Dtos.Report;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC.Report;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.MC.Report;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionReportApiController(
    IAdmissionReportRepository admissionListReportRepository,
    InsuranceRepository insuranceRepository,
    ICompanyRepository companyRepository)
    : ControllerBase
{

    #region AdmissionService

    [HttpPost]
    [Route("repadmissioncolumns")]
    public GetColumnsViewModel AdmissionColumns()
    {
        return admissionListReportRepository.AdmissionServiceReportGetColumns();
    }

    [Route("repadmissioncsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ExportCsvAdmission(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionReport>(stringedModel);

        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionServiceReportCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش پذیرش.csv" };
    }

    [HttpPost]
    [Route("repadmission")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionServiceReport>>> AdmissionReport(
        [FromBody] GetAdmissionReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionServiceReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repadmissionsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAdmissionServiceReport> SumAdmissionReport([FromBody] GetAdmissionReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionServiceSumTotal(model, roleId);
    }

    #endregion

    #region AdmissionSale

    [HttpPost]
    [Route("repadmissionsalecolumns")]
    public GetColumnsViewModel AdmissionSaleColumns()
    {
        return admissionListReportRepository.AdmissionSaleReportGetColumns();
    }


    [Route("repadmissionsalecsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AdmissionSaleExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionSaleReport>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionSaleReportCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش سفارش کالا.csv" };
    }

    [HttpPost]
    [Route("repadmissionsale")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionSaleReport>>> AdmissionSaleReport(
        [FromBody] GetAdmissionSaleReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionSaleReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repadmissionsalesum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAdmissionSaleReport> SumAdmissionSaleReport([FromBody] GetAdmissionSaleReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionSaleSumTotal(model, roleId);
    }

    #endregion

    #region ServiceTariff

    [HttpPost]
    [Route("repservicetariffcolumns")]
    public GetColumnsViewModel ServiceTariffColumns()
    {
        return admissionListReportRepository.ServiceTariffInsuranceReportGetColumns();
    }

    [HttpPost]
    [Route("repservicetariffcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportServiceTariffCsv([FromBody] GetServiceTariffReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.InsurerTypeId == 2)
        {
            var insurerInfo = new GetInsuranceCode
            {
                CompanyId = model.CompanyId,
                InsurerCode = "",
                InsurerLineCode = "",
                InsurerId = 0,
                InsurerLineId = Convert.ToInt16(model.InsurerId.Value)
            };

            model.InsurerId = Convert.ToInt32(await insuranceRepository.GetInsurerInfo(insurerInfo));
        }

        return await admissionListReportRepository.ServiceInsuranceTariffReportCSV(model);
    }

    [HttpPost]
    [Route("repgetservicetariff")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ServiceTariff>>> GetServiceTariff([FromBody] GetServiceTariffReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionListReportRepository.ServiceTariffInsuranceReportPreview(model);
    }

    #endregion

    #region AttenderServiceTariff

    [HttpPost]
    [Route("repserviceattendertariffcolumns")]
    public GetColumnsViewModel ServiceAttenderTariffColumns()
    {
        return admissionListReportRepository.AttenderTariffGetColumns();
    }


    [HttpPost]
    [Route("repserviceattendertariffcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportServiceAttenderTariffCsv(
        [FromBody] GetServiceAttenderTariffReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionListReportRepository.AttenderServiceTariffCSV(model);
    }


    [HttpPost]
    [Route("repserviceattendertariff")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ServiceAttenderTariff>>> ServiceAttenderTariff(
        [FromBody] GetServiceAttenderTariffReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionListReportRepository.AttenderServiceTariffPreview(model);
    }

    #endregion

    #region AttenderCommission

    [HttpPost]
    [Route("repattendercommissioncolumns")]
    public GetColumnsViewModel AttenderCommissionColumns()
    {
        return admissionListReportRepository.AttenderCommissionGetColumns();
    }


    [HttpPost]
    [Route("repattendercommissiongetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AttenderCommission>>> AttenderCommissionGetPage(
        [FromBody] GetAttenderCommission model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AttenderCommissionPreview(model, roleId);
    }

    [HttpPost]
    [Route("repattendercommissionsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAttenderCommission> AttenderCommissionSumTotal([FromBody] GetAttenderCommission model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AttenderCommissionSumTotal(model, roleId);
    }

    [Route("repattendercommissioncsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AttenderComissionExportCSV(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAttenderCommission>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AttenderCommissionCSV(model, roleId);

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش دستمزد داکتران - صورت ریز.csv" };
    }

    [Route("repattendercommissionsummarycsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AttenderComissionSummaryExportCSV(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAttenderCommission>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AttenderCommissionSummaryCSV(model, roleId);

        return new FileStreamResult(resultCsv, "text/csv")
            { FileDownloadName = "گزارش دستمزد داکتران - صورت خلاصه.csv" };
    }

    #endregion

    #region Insurer

    [HttpPost]
    [Route("repinsurerpreviewcolumns")]
    public GetColumnsViewModel AdmissionInsurerColumns()
    {
        return admissionListReportRepository.AdmissionInsurerPreviewColumns(1);
    }

    [Route("repinsurerpreviewcsv")]
    [HttpGet]
    public async Task<ActionResult> AdmissionInsurerPreviewCSV(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionInsurerReportPreview>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionInsurerPreviewCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش سفارش کالا.csv" };
    }

    [HttpPost]
    [Route("repinsurerpreviewgetpage")]
    public async Task<ReportViewModel<List<AdmissionInsurerReportPreview>>> AdmissionInsurerPreviewGetPage(
        [FromBody] GetAdmissionInsurerReportPreview model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
      
        return await admissionListReportRepository.AdmissionInsurerPreview(model, roleId);
    }

    [HttpPost]
    [Route("repinsurersum")]
    public async Task<SumAdmissionInsurerReportPreview> AdmissionInsurerSummary(
        [FromBody] GetAdmissionInsurerReportPreview model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionInsurerSumTotal(model, roleId);
    }

    [HttpPost]
    [Route("admissionarmedinsurance")]
    [Authenticate(Operation.VIW, "")]
    public async Task<string> GetAdmissionArmedInsurance([FromBody] GetAdmissionInsurerReportPreview model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var result = await admissionListReportRepository.AdmissionInsurerPreview(model, roleId);
        var list = result.Data;
        var company = await companyRepository.GetCompanyInfo();
        var headerArmedInsurance = new HeaderArmedInsurance
        {
            ArmedInsuranceIdentity = company.ArmedInsuranceIdentity,
            CompanyName = company.ArmedInsuranceName,
            CompanyPhoneNo = company.PhoneNo,
            DataLength = list.Count,
            FromDate = model.FromReserveDatePersian,
            ToDate = model.ToReserveDatePersian
        };

        var output = ParsAlphabet.ERP.Application.Common.CIS.GenerateInsuranceArmed(headerArmedInsurance, list);
        return output;
    }

    #endregion

    #region Insurer Summary

    [Route("repinsurersummarypreviewcsv")]
    [HttpGet]
    public async Task<ActionResult> AdmissionInsurerSummaryPreviewCSV(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionInsuranceSummary>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionInsurerSummaryPreviewCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش  خلاصه بیمه گر.csv" };
    }

    [HttpPost]
    [Route("repinsurersummarypreviewgetpage")]
    public async Task<ReportViewModel<IEnumerable>> AdmissionInsurancePreviewGetPage(
        [FromBody] GetAdmissionInsuranceSummary model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionInsurerSummaryPreview(model, roleId);
    }

    [HttpPost]
    [Route("repinsurersummarysum")]
    public async Task<AdmissionInsuranceSummarySum> AdmissionInsuranceSummary(
        [FromBody] GetAdmissionInsuranceSummary model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionInsurerSummaryPreviewSum(model, roleId);
    }

    [HttpPost]
    [Route("admissionInsurancePreviewColumns")]
    public GetColumnsViewModel AdmissionInsurancePreviewColumns()
    {
        return admissionListReportRepository.AdmissionInsurancePreviewColumns(1);
    }

    #endregion

    #region AdmissionClose

    [HttpPost]
    [Route("repadmissioncashclosecolumns")]
    public GetColumnsViewModel AdmissionCashCloseColumns()
    {
        return admissionListReportRepository.AdmissionCashCloseGetColumns();
    }

    [HttpPost]
    [Route("repadmissioncashclosecsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> AdmissionCashCloseExportCsv([FromBody] GetAdmissionCashClose model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionListReportRepository.AdmissionCashCloseCSV(model);
    }

    [HttpPost]
    [Route("repadmissioncashclosegetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionCashClose>>> AdmissionCashCloseGetPage(
        [FromBody] GetAdmissionCashClose model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionListReportRepository.AdmissionCashClosePreview(model);
    }

    #endregion

    #region AdmissionCash

    [HttpPost]
    [Route("repadmissioncashreportcolumns")]
    public GetColumnsViewModel AdmissionCashReportColumns()
    {
        return admissionListReportRepository.AdmissionCashReportGetColumns();
    }

    [Route("repadmissioncashreportcsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AdmissionCashReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionCashReport>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionCashReportCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش دریافت/پرداخت.csv" };
    }


    [HttpPost]
    [Route("repadmissioncashreportgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionCashReport>>> AdmissionCashReportGetPage(
        [FromBody] GetAdmissionCashReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionCashReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repadmissioncashsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAdmissionCashReport> AdmissionCashReportSumTotal([FromBody] GetAdmissionCashReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionCashSumTotal(model, roleId);
    }

    #endregion

    #region AdmissionUser

    [HttpPost]
    [Route("repadmissionuserreportcolumns")]
    public GetColumnsViewModel AdmissionUserReportColumns([FromBody] byte? type=null)
    {
        return admissionListReportRepository.AdmissionUserReportGetColumns(2);
    }


    [Route("repadmissionuserreportcsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AdmissionUserReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionUserSaleService>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await admissionListReportRepository.AdmissionUserReportCSV(model, roleId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش کاربران.csv" };
    }


    [HttpPost]
    [Route("repadmissionserviceuserreportpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionServiceUserReportPreview>>> AdmissionUserServiceReportGetPage(
        [FromBody] GetAdmissionUserSaleService model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        
        return await admissionListReportRepository.AdmissionServiceUserReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repadmissionsaleuserreportpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AdmissionSaleUserReportPreview>>> AdmissionUserSaleReportGetPage(
        [FromBody] GetAdmissionUserSaleService model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionSaleUserReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repadmissionsaleusersum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAdmissionSaleUser> AdmissionSaleUserReportPreviewSumTotal(
        [FromBody] GetAdmissionUserSaleService model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionSaleUserReportPreviewSumTotal(model, roleId);
    }


    [HttpPost]
    [Route("repadmissionserviceusersum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumAdmissionSaleUser> AdmissionServiceUserReportPreviewSumTotal(
        [FromBody] GetAdmissionUserSaleService model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionListReportRepository.AdmissionServiceUserReportPreviewSumTotal(model, roleId);
    }

    #endregion

    #region Cache Report Parameter

    [HttpGet]
    [Route("getcachereportParameter/{reportCacheParameter}")]
    [Authenticate(Operation.VIW, "")]
    public List<GetReportParameter> GetReportParameters(Enum.ParametersReport reportCacheParameter)
    {
        var userId = UserClaims.GetUserId();
        ;

        return admissionListReportRepository.GetCacheParametersInsuranceReport(userId, reportCacheParameter);
    }

    [HttpPost]
    [Route("updatecachereportParameter")]
    [Authenticate(Operation.VIW, "")]
    public bool UpdateReportParameters([FromBody] GetReportParameter model)
    {
        model.UserId = UserClaims.GetUserId();
        ;

        return admissionListReportRepository.UpdateCacheReportParameter(model);
    }

    [HttpPost]
    [Route("addcachereportParameter")]
    [Authenticate(Operation.VIW, "")]
    public string AddReportParameters([FromBody] GetReportParameter model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        return admissionListReportRepository.AddCacheReportParameter(model);
    }

    [HttpGet]
    [Route("removecachereportParameter/{reportCacheParameter}/{keyParameter}")]
    [Authenticate(Operation.VIW, "")]
    public bool RemoveReportParameters(Enum.ParametersReport reportCacheParameter, string keyParameter)
    {
        var userId = UserClaims.GetUserId();
        ;

        return admissionListReportRepository.RemoveCacheReportParameter(userId, reportCacheParameter, keyParameter);
    }

    #endregion
}

[Route("MC/[controller]")]
[Authorize]
public class AdmissionReportController : Controller
{
    [Route("AttenderCommission")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AttenderCommission()
    {
        return PartialView(Views.MC.Report.AttenderCommission);
    }

    [Route("AdmissionList")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AdmissionList()
    {
        return PartialView(Views.MC.Report.AdmissionList);
    }

    [Route("admissionsale")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AdmissionSale()
    {
        return PartialView(Views.MC.Report.AdmissionSaleReport);
    }

    [Route("Insurer")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Insurer()
    {
        return PartialView(Views.MC.Report.Insurer);
    }

    [Route("summaryinsurer")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult SummaryInsurer()
    {
        return PartialView(Views.MC.Report.SummaryInsurer);
    }


    [Route("ServiceTariff")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult ServiceTariff()
    {
        return PartialView(Views.MC.Report.ServiceTariff);
    }

    [Route("ServiceAttenderTariff")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult ServiceAttenderTariff()
    {
        return PartialView(Views.MC.Report.ServiceAttenderTariff);
    }

    [Route("AdmissionCashClose")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AdmissionCashClose()
    {
        return PartialView(Views.MC.Report.AdmissionCashClose);
    }

    [Route("AdmissionCashReport")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AdmissionCashReport()
    {
        return PartialView(Views.MC.Report.AdmissionCashReport);
    }

    [Route("AdmissionUser")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AdmissionUserReport()
    {
        return PartialView(Views.MC.Report.AdmissionUser);
    }
}