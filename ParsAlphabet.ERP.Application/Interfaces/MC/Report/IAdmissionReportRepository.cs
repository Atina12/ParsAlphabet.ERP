using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.Report;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Report;

public interface IAdmissionReportRepository
{
    GetColumnsViewModel AdmissionServiceReportGetColumns();
    Task<MemoryStream> AdmissionServiceReportCSV(GetAdmissionReport model, byte roleId);

    Task<ReportViewModel<List<AdmissionServiceReport>>> AdmissionServiceReportPreview(GetAdmissionReport model,
        byte roleId);

    Task<SumAdmissionServiceReport> AdmissionServiceSumTotal(GetAdmissionReport model, byte roleId);

    GetColumnsViewModel AdmissionSaleReportGetColumns();
    Task<MemoryStream> AdmissionSaleReportCSV(GetAdmissionSaleReport model, byte roleId);

    Task<ReportViewModel<List<AdmissionSaleReport>>> AdmissionSaleReportPreview(GetAdmissionSaleReport model,
        byte roleId);

    Task<SumAdmissionSaleReport> AdmissionSaleSumTotal(GetAdmissionSaleReport model, byte roleId);

    GetColumnsViewModel AdmissionCashReportGetColumns();

    Task<MemoryStream> AdmissionCashReportCSV(GetAdmissionCashReport model, byte roleId);

    Task<ReportViewModel<List<AdmissionCashReport>>> AdmissionCashReportPreview(GetAdmissionCashReport model,
        byte roleId);

    Task<SumAdmissionCashReport> AdmissionCashSumTotal(GetAdmissionCashReport model, byte roleId);

    GetColumnsViewModel ServiceTariffInsuranceReportGetColumns();
    Task<CSVViewModel<IEnumerable>> ServiceInsuranceTariffReportCSV(GetServiceTariffReport model);
    Task<ReportViewModel<List<ServiceTariff>>> ServiceTariffInsuranceReportPreview(GetServiceTariffReport model);

    GetColumnsViewModel AttenderTariffGetColumns();
    Task<CSVViewModel<IEnumerable>> AttenderServiceTariffCSV(GetServiceAttenderTariffReport model);

    Task<ReportViewModel<List<ServiceAttenderTariff>>> AttenderServiceTariffPreview(
        GetServiceAttenderTariffReport model);


    GetColumnsViewModel AttenderCommissionGetColumns();
    Task<MemoryStream> AttenderCommissionCSV(GetAttenderCommission model, byte roleId);
    Task<MemoryStream> AttenderCommissionSummaryCSV(GetAttenderCommission model, byte roleId);
    Task<ReportViewModel<List<AttenderCommission>>> AttenderCommissionPreview(GetAttenderCommission model, byte roleId);
    Task<SumAttenderCommission> AttenderCommissionSumTotal(GetAttenderCommission model, byte roleId);

    GetColumnsViewModel AdmissionCashCloseGetColumns();
    Task<CSVViewModel<IEnumerable>> AdmissionCashCloseCSV(GetAdmissionCashClose model);
    Task<ReportViewModel<List<AdmissionCashClose>>> AdmissionCashClosePreview(GetAdmissionCashClose model);

    GetColumnsViewModel AdmissionInsurerPreviewColumns(byte isFile);
    Task<MemoryStream> AdmissionInsurerPreviewCSV(GetAdmissionInsurerReportPreview model, byte roleId);

    Task<ReportViewModel<List<AdmissionInsurerReportPreview>>> AdmissionInsurerPreview(
        GetAdmissionInsurerReportPreview model, byte roleId);

    Task<SumAdmissionInsurerReportPreview>
        AdmissionInsurerSumTotal(GetAdmissionInsurerReportPreview model, byte roleId);

    GetColumnsViewModel AdmissionUserReportGetColumns(byte admissionType);
    Task<MemoryStream> AdmissionUserReportCSV(GetAdmissionUserSaleService model, byte roleId);

    Task<ReportViewModel<List<AdmissionServiceUserReportPreview>>> AdmissionServiceUserReportPreview(
        GetAdmissionUserSaleService model, byte roleId);

    Task<ReportViewModel<List<AdmissionSaleUserReportPreview>>> AdmissionSaleUserReportPreview(
        GetAdmissionUserSaleService model, byte roleId);

    Task<SumAdmissionSaleUser> AdmissionSaleUserReportPreviewSumTotal(GetAdmissionUserSaleService model, byte roleId);

    Task<SumAdmissionSaleUser>
        AdmissionServiceUserReportPreviewSumTotal(GetAdmissionUserSaleService model, byte roleId);

    List<GetReportParameter> GetCacheParametersInsuranceReport(int userId, ParametersReport reportCacheParameter);
    bool UpdateCacheReportParameter(GetReportParameter model);
    string AddCacheReportParameter(GetReportParameter model);
    bool RemoveCacheReportParameter(int userId, ParametersReport reportCacheParameter, string keyParameter);

    Task<ReportViewModel<IEnumerable>> AdmissionInsurerSummaryPreview(GetAdmissionInsuranceSummary model, byte roleId);

    Task<AdmissionInsuranceSummarySum> AdmissionInsurerSummaryPreviewSum(GetAdmissionInsuranceSummary model,
        byte roleId);

    Task<MemoryStream> AdmissionInsurerSummaryPreviewCSV(GetAdmissionInsuranceSummary model, byte roleId);
    GetColumnsViewModel AdmissionInsurancePreviewColumns(byte type);
}