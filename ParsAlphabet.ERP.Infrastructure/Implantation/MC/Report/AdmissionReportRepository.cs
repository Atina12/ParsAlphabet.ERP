using System.Collections;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.Report;
using ParsAlphabet.ERP.Application.Interfaces.MC.Report;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Report;

public class AdmissionReportRepository : IAdmissionReportRepository
{
    #region Define Repo

    private readonly IConfiguration _reportConfig;
    private readonly ManageRedisRepository _manageRedisRepository;
    private readonly IMapper _mapper;

    public AdmissionReportRepository(ManageRedisRepository manageRedisRepository, IConfiguration reportConfig,
        IMapper mapper)
    {
        _reportConfig = reportConfig;
        _manageRedisRepository = manageRedisRepository;
        _mapper = mapper;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    #endregion

    #region Admission Service Report

    public GetColumnsViewModel AdmissionServiceReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repadmissionsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "createTimePersian", Title = "زمان ثبت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerExpirationDatePersian", Title = "تاریخ انقضا دفترچه",
                    Type = (int)SqlDbType.VarChar, Size = 5, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerNo", Title = "شماره بیمه", Type = (int)SqlDbType.VarChar, Size = 16,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "basicInsurerBookletPageNo", Title = "شماره صفحه دفترچه", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "prescriptionDatePersian", Title = "تاریخ نسخه", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "serviceNationalCode", Title = "کدملی خدمت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 30
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 20, IsDtParameter = true,
                    Width = 5, HasSumValue = true
                },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ واقعی خدمت", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10, IsCommaSep = true
                },
                new()
                {
                    Id = "basicInsurer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "basicInsurerLine", Title = "صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },

                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "compInsurerLine", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },

                new()
                {
                    Id = "thirdPartyInsurer", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },

                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10, IsCommaSep = true
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "netAmount", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> AdmissionServiceReportCSV(GetAdmissionReport model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();
        var rows = new List<AdmissionServiceReport>();

        var columns1 = AdmissionServiceReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
            .Select(z => z.Title).ToList();

        var getPage = await AdmissionServiceReportPreview(model, roleId);
        var rowsAdmissionService = (from p in getPage.Data
            select new
            {
                p.Id,
                p.AdmissionMasterId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.CreateDatePersian,
                p.CreateTimePersian,
                p.ReserveDatePersian,
                p.Patient,
                p.PatientNationalCode,
                p.Attender,
                p.ReferringDoctor,
                p.BasicInsurerExpirationDatePersian,
                p.BasicInsurerNo,
                p.BasicInsurerBookletPageNo,
                p.PrescriptionDatePersian,
                p.Department,
                p.ServiceType,
                p.ServiceNationalCode,
                p.Service,
                p.Quantity,
                p.ServiceActualAmount,
                p.BasicInsurer,
                p.BasicInsurerLine,
                p.BasicShareAmount,
                p.CompInsurer,
                p.CompInsurerLine,
                p.CompShareAmount,
                p.ThirdPartyInsurer,
                p.ThirdPartyAmount,
                p.DiscountInsurer,
                p.DiscountAmount,
                p.NetAmount,
                p.ActionIdName,
                p.User
            }).ToList();

        csvStream = await csvGenerator.GenerateCsv(rowsAdmissionService, columns1);
        return csvStream;
    }

    public async Task<ReportViewModel<List<AdmissionServiceReport>>> AdmissionServiceReportPreview(
        GetAdmissionReport model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionServiceReport>>
        {
            Data = new List<AdmissionServiceReport>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionServiceReportPreview";
            conn.Open();

            var userId = model.UserId.ToString();
            result.Data = (await conn.QueryAsync<AdmissionServiceReport>(sQuery,
                new
                {
                    model.Id,
                    model.AdmissionMasterId,
                    model.BranchId,
                    model.PatientId,
                    model.FromDate,
                    model.ToDate,
                    model.FromReserveDate,
                    model.ToReserveDate,
                    userId,
                    model.BasicInsurerId,
                    model.BasicInsurerLineId,
                    model.CompInsurerId,
                    model.CompInsurerLineId,
                    model.ThirdPartyInsurerId,
                    model.DiscountInsurerId,
                    model.AttenderId,
                    model.DepartmentIds,
                    model.SpecialityId,
                    model.ServiceTypeId,
                    model.ServiceId,
                    model.CompanyId,
                    model.StageId,
                    model.WorkflowId,
                    model.ActionId,
                    model.PageNo,
                    model.PageRowsCount,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure)).ToList();

            result.Columns = AdmissionServiceReportGetColumns();

            conn.Close();
            return result;
        }
    }

    public async Task<SumAdmissionServiceReport> AdmissionServiceSumTotal(GetAdmissionReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionServiceReportPreview_Sum]";
            conn.Open();

            var total = await conn.QueryFirstOrDefaultAsync<SumAdmissionServiceReport>(sQuery,
                new
                {
                    model.Id,
                    model.AdmissionMasterId,
                    model.BranchId,
                    model.PatientId,
                    model.FromDate,
                    model.ToDate,
                    model.FromReserveDate,
                    model.ToReserveDate,
                    model.UserId,
                    model.BasicInsurerId,
                    model.BasicInsurerLineId,
                    model.CompInsurerId,
                    model.CompInsurerLineId,
                    model.ThirdPartyInsurerId,
                    model.DiscountInsurerId,
                    model.AttenderId,
                    model.DepartmentIds,
                    model.SpecialityId,
                    model.ServiceTypeId,
                    model.ServiceId,
                    model.CompanyId,
                    model.StageId,
                    model.WorkflowId,
                    model.ActionId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return total;
        }
    }

    #endregion

    #region Admission Sale Report

    public GetColumnsViewModel AdmissionSaleReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repadmissionsalesum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "item", Title = "کالا", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "itemCategory", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "attributeName", Title = "صفت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "itemUnit", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "contractType", Title = "نوع قرارداد", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "vendor", Title = "تامین کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 12,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.SmallInt, IsDtParameter = true, Width = 5,
                    HasSumValue = true
                },
                new()
                {
                    Id = "itemActualAmount", Title = "مبلغ واقعی آیتم", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, IsCommaSep = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "basicInsurer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "basicInsurerLine", Title = "صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "compInsurerLine", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "thirdPartyInsurer", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true
                },
                new()
                {
                    Id = "netAmount", Title = "خالص قابل دریافت", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 9, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "vendorCommissionAmount", Title = "مبلغ کمیسیون", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 9, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "revenueAmount", Title = "درآمد مرکز", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 9, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> AdmissionSaleReportCSV(GetAdmissionSaleReport model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = AdmissionSaleReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
            .Select(z => z.Title).ToList();

        var getPage = await AdmissionSaleReportPreview(model, roleId);
        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.AdmissionMasterId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.CreateDateTimePersian,
                p.Item,
                p.ItemCategory,
                p.AttributeName,
                p.ItemUnit,
                p.ContractType,
                p.Vendor,
                p.Patient,
                p.PatientNationalCode,
                p.Quantity,
                p.ItemActualAmount,
                p.BasicInsurer,
                p.BasicInsurerLine,
                p.BasicShareAmount,
                p.CompInsurer,
                p.CompInsurerLine,
                p.CompShareAmount,
                p.ThirdPartyInsurer,
                p.ThirdPartyAmount,
                p.DiscountInsurer,
                p.DiscountAmount,
                p.NetAmount,
                p.VendorCommissionAmount,
                p.RevenueAmount,
                p.ActionIdName,
                p.User
            };
        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns);
    }

    public async Task<ReportViewModel<List<AdmissionSaleReport>>> AdmissionSaleReportPreview(
        GetAdmissionSaleReport model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionSaleReport>>
        {
            Data = new List<AdmissionSaleReport>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionSaleReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionSaleReport>(sQuery, new
            {
                model.BranchId,
                model.StageId,
                model.WorkflowId,
                model.ActionId,
                model.CategoryId,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.ThirdPartyInsurerId,
                model.DiscountInsurerId,
                model.PatientId,
                model.FromId,
                model.ToId,
                model.FromAdmissionMasterId,
                model.ToAdmissionMasterId,
                model.ItemId,
                model.ContractTypeId,
                model.VendorId,
                model.UserId,
                model.FromDate,
                model.ToDate,
                model.CompanyId,
                model.PageNo,
                model.PageRowsCount,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AdmissionSaleReportGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<SumAdmissionSaleReport> AdmissionSaleSumTotal(GetAdmissionSaleReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionSaleReportPreview_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SumAdmissionSaleReport>(sQuery, new
            {
                model.BranchId,
                model.StageId,
                model.WorkflowId,
                model.ActionId,
                model.CategoryId,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.ThirdPartyInsurerId,
                model.DiscountInsurerId,
                model.PatientId,
                model.FromId,
                model.ToId,
                model.FromAdmissionMasterId,
                model.ToAdmissionMasterId,
                model.ItemId,
                model.ContractTypeId,
                model.VendorId,
                model.UserId,
                model.FromDate,
                model.ToDate,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    #endregion

    #region Admission Cash Report

    public GetColumnsViewModel AdmissionCashReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repadmissioncashsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "cashId", Title = "شناسه صندوق", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "cashCreateDateTimeLineHeaderPersian", Title = "تاریخ ثبت (پابرگ)",
                    Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "cashUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "fundType", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },
                new() { Id = "pos", Title = "کیوسک", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "accountNo", Title = "شماره حساب", Type = (int)SqlDbType.VarChar, Size = 12,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "currency", Title = "ارز", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "detailAccount", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر ارز", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 8, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 12,
                    HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "refNo", Title = "شناسه مرجع", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "terminalNo", Title = "شماره ترمینال", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 13, IsCommaSep = true
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> AdmissionCashReportCSV(GetAdmissionCashReport model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            AdmissionCashReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                .Select(z => z.Title));
        var getPage = await AdmissionCashReportPreview(model, roleId);
        var Rows = from p in getPage.Data
            select new
            {
                p.AdmissionMasterId,
                p.CashId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.CashCreateDateTimeLineHeaderPersian,
                p.CashUser,
                p.Patient,
                p.PatientNationalCode,
                p.FundType,
                p.Pos,
                p.AccountNo,
                p.Currency,
                p.DetailAccount,
                p.ExchangeRate,
                p.Amount,
                p.RefNo,
                p.TerminalNo,
                p.ActionIdName
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<ReportViewModel<List<AdmissionCashReport>>> AdmissionCashReportPreview(
        GetAdmissionCashReport model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionCashReport>>
        {
            Data = new List<AdmissionCashReport>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionCashReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionCashReport>(sQuery, new
            {
                model.CompanyId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.BranchId,
                model.CurrencyId,
                model.FundTypeId,
                model.PosIds,
                model.DetailAccountId,
                model.FromAdmissionMasterId,
                model.ToAdmissionMasterId,
                model.FromCashId,
                model.ToCashId,
                model.FromDate,
                model.ToDate,
                model.FromTime,
                model.ToTime,
                model.UserId,
                model.PageNo,
                model.PageRowsCount,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AdmissionCashReportGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<SumAdmissionCashReport> AdmissionCashSumTotal(GetAdmissionCashReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionCashReportPreview_Sum]";
            conn.Open();
            var result = await conn.QuerySingleOrDefaultAsync<SumAdmissionCashReport>(sQuery, new
            {
                model.CompanyId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.BranchId,
                model.CurrencyId,
                model.FundTypeId,
                model.DetailAccountId,
                model.FromAdmissionMasterId,
                model.ToAdmissionMasterId,
                model.FromCashId,
                model.ToCashId,
                model.FromDate,
                model.PosIds,
                model.ToDate,
                model.FromTime,
                model.ToTime,
                model.UserId,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    #endregion

    #region Service Tariff

    public GetColumnsViewModel ServiceTariffInsuranceReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "serviceCode", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "serviceTypeName", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "basicInsurer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerCode", Title = "کدملی بیمه اجباری", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsuranceBox", Title = "صندوق", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "thirdParty", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicPriceTypeDesc", Title = "مبنای تعرفه بیمه", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "servicePrice", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, Size = 10, IsCommaSep = true,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "servicePrice_IPD", Title = "تعرفه گردشگری", Type = (int)SqlDbType.Float, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicPrice", Title = "تعرفه بیمه اجباری", Type = (int)SqlDbType.Float, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicSharePer", Title = "درصد بیمه اجباری", Type = (int)SqlDbType.Float, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compPrice", Title = "تعرفه بیمه تکمیلی", Type = (int)SqlDbType.Float, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compSharePer", Title = "درصد بیمه تکمیلی", Type = (int)SqlDbType.Float, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "thirdPartyDiscountPer", Title = "درصد طرف قرارداد", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> ServiceInsuranceTariffReportCSV(GetServiceTariffReport model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                ServiceTariffInsuranceReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await ServiceTariffInsuranceReportPreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Service,
                p.ServiceCode,
                p.ServiceTypeName,
                p.BasicInsurer,
                p.BasicInsurerCode,
                p.BasicInsuranceBox,
                p.CompInsurer,
                p.ThirdParty,
                p.BasicPriceTypeDesc,
                p.ServicePrice,
                p.ServicePrice_IPD,
                p.BasicPrice,
                p.BasicSharePer,
                p.CompPrice,
                p.CompSharePer,
                p.ThirdPartyDiscountPer
                //ServiceActive = p.ServiceActive == true ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<ReportViewModel<List<ServiceTariff>>> ServiceTariffInsuranceReportPreview(
        GetServiceTariffReport model)
    {
        var result = new ReportViewModel<List<ServiceTariff>>
        {
            Data = new List<ServiceTariff>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_ServiceInsuranceTariffPreview";
            conn.Open();
            result.Data = (await conn.QueryAsync<ServiceTariff>(sQuery, new
            {
                model.ServiceTypeId,
                model.FromServiceId,
                model.ToServiceId,
                model.InsurerId,
                model.InsurerLineId,
                model.ServiceActive,
                model.CompanyId,
                model.InsurerTypeId,
                model.FromNationalCode,
                model.ToNationalCode,
                model.PageNo,
                model.PageRowsCount
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = ServiceTariffInsuranceReportGetColumns();
            conn.Close();
            return result;
        }
    }

    #endregion

    #region Attender Tariff

    public GetColumnsViewModel AttenderTariffGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "code", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.VarChar, Size = 5, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "price", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "price_IPD", Title = "تعرفه گردشگری", Type = (int)SqlDbType.Decimal, IsCommaSep = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "commissInputTypeDesc", Title = "مبنای سهم طبیب", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "commissPrice", Title = "سهم طبیب", Type = (int)SqlDbType.Money, Size = 10, IsCommaSep = true,
                    IsDtParameter = true, Width = 7, HasSumValue = true
                },
                new()
                {
                    Id = "attenderTaxPer", Title = "مالیات", Type = (int)SqlDbType.BigInt, Size = 10, IsCommaSep = true,
                    IsDtParameter = true, Width = 7
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> AttenderServiceTariffCSV(GetServiceAttenderTariffReport model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                AttenderTariffGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await AttenderServiceTariffPreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.AttenderId,
                p.FullName,
                p.SpecialityName,
                p.DepartmentId,
                p.Code,
                p.DepartmentName,
                p.Price,
                p.Price_IPD,
                p.CommissInputTypeDesc,
                p.CommissPrice,
                p.AttenderTaxPer
            };
        return result;
    }

    public async Task<ReportViewModel<List<ServiceAttenderTariff>>> AttenderServiceTariffPreview(
        GetServiceAttenderTariffReport model)
    {
        var result = new ReportViewModel<List<ServiceAttenderTariff>>
        {
            Data = new List<ServiceAttenderTariff>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_ServiceAttenderTariffPreview";
            conn.Open();
            result.Data = (await conn.QueryAsync<ServiceAttenderTariff>(sQuery, new
            {
                model.AttenderId,
                model.FromServiceId,
                model.ToServiceId,
                model.FromCode,
                model.ToCode,
                model.IsActive,
                model.ServiceTypeId,
                model.DepartmentId,
                model.CompanyId,
                model.PageNo,
                model.PageRowsCount
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AttenderTariffGetColumns();
            conn.Close();
            return result;
        }
    }

    #endregion

    #region Attender Comission

    public GetColumnsViewModel AttenderCommissionGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repattendercommissionsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 200, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "serviceCode", Title = "شناسه ملی خدمت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 200, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "کدملی مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "qty", Title = "تعداد", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5,
                    HasSumValue = true
                },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 12, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "attenderCommissionType", Title = "مبنای سهم طبیب", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "attenderTaxAmount", Title = "مالیات طبیب", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 12, IsCommaSep = true, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "attenderPatientGrossAmount", Title = "سهم ناخالص طبیب - مراجعه کننده",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsDtParameter = true, Width = 17,
                    HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "attenderInsurerGrossAmount", Title = "سهم ناخالص طبیب - بیمه", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsDtParameter = true, Width = 17, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "attenderCommissionAmount", Title = "جمع سهم ناخالص طبیب", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsDtParameter = true, HasSumValue = true, Width = 12, HasRounding = true
                },
                new()
                {
                    Id = "grossRevenueAmount", Title = "ناخالص درآمد مرکز", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "companyBasicShareReimbursementAmount", Title = "کسور بیمه اجباری مرکز",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsDtParameter = true, Width = 10,
                    HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "companyCompShareReimbursementAmount", Title = "کسور بیمه تکمیلی مرکز ",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsDtParameter = true, Width = 10,
                    HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "companyReimbursementAmount", Title = "جمع کسور مرکز", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "penaltyAmount", Title = "سهم کنسلی نوبت مراجعه کننده ", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "netRevenueAmount", Title = "خالص درآمد مرکز", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true, HasRounding = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 10
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<AttenderCommission>>> AttenderCommissionPreview(GetAttenderCommission model,
        byte roleId)
    {
        var result = new ReportViewModel<List<AttenderCommission>>
        {
            Data = new List<AttenderCommission>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AttenderCommissionPreview";
            conn.Open();
            result.Data = (await conn.QueryAsync<AttenderCommission>(sQuery,
                new
                {
                    model.BranchId,
                    model.WorkflowId,
                    model.StageId,
                    model.ActionId,
                    model.AttenderId,
                    model.FromDate,
                    model.ToDate,
                    model.DepartmentIds,
                    model.CompanyId,
                    model.PageNo,
                    model.PageRowsCount,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AttenderCommissionGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<MemoryStream> AttenderCommissionCSV(GetAttenderCommission model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = AttenderCommissionGetColumns().DataColumns.Select(z => z.Title).ToList();
        var getPage = await AttenderCommissionPreview(model, roleId);
        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.AdmissionMasterId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.ReserveDatePersian,
                p.Attender,
                p.ServiceCode,
                p.Service,
                p.Department,
                p.Patient,
                p.PatientNationalCode,
                p.Qty,
                p.ServiceActualAmount,
                p.AttenderCommissionType,
                p.AttenderPatientGrossAmount,
                p.AttenderInsurerGrossAmount,
                p.AttenderCommissionAmount,
                p.AttenderTaxAmount,
                p.AttenderNetAmount,
                p.GrossRevenueAmount,
                p.CompanyBasicShareReimbursementAmount,
                p.CompanyCompShareReimbursementAmount,
                p.CompanyReimbursementAmount,
                p.NetRevenueAmount,
                p.ActionIdName
            };
        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns);
    }

    public async Task<SumAttenderCommission> AttenderCommissionSumTotal(GetAttenderCommission model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].Spr_AttenderCommissionPreview_Sum";
            conn.Open();
            var result = await conn.QuerySingleOrDefaultAsync<SumAttenderCommission>(sQuery, new
            {
                model.BranchId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.AttenderId,
                model.FromDate,
                model.ToDate,
                model.DepartmentIds,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public GetColumnsViewModel AttenderCommissionSummaryGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 200, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "serviceCode", Title = "شناسه ملی خدمت", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 200, IsDtParameter = true,
                    Width = 20
                },
                new() { Id = "qty", Title = "تعداد", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, Size = 10,
                    IsDtParameter = true, Width = 12, IsCommaSep = true
                },
                new()
                {
                    Id = "attenderCommissionType", Title = "مبنای سهم طبیب", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "attenderCommissionAmount", Title = "جمع سهم ناخالص طبیب", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsDtParameter = true, Width = 12, HasRounding = true
                },
                new()
                {
                    Id = "attenderTaxAmount", Title = "مالیات طبیب", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 12, IsCommaSep = true, HasRounding = true
                },
                new()
                {
                    Id = "attenderNetAmount", Title = "سهم خالص طبیب", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsDtParameter = true, Width = 15, HasRounding = true
                },
                new()
                {
                    Id = "grossRevenueAmount", Title = "ناخالص درآمد مرکز", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasRounding = true
                },
                new()
                {
                    Id = "penaltyAmount", Title = "سهم کنسلی نوبت مراجعه کننده ", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasRounding = true
                },
                new()
                {
                    Id = "companyBasicShareReimbursementAmount", Title = "کسور بیمه اجباری مرکز",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsDtParameter = true, Width = 10, HasRounding = true
                },
                new()
                {
                    Id = "companyCompShareReimbursementAmount", Title = "کسور بیمه تکمیلی مرکز ",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsDtParameter = true, Width = 10, HasRounding = true
                },
                new()
                {
                    Id = "companyReimbursementAmount", Title = "جمع کسور مرکز", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, HasRounding = true
                },
                new()
                {
                    Id = "netRevenueAmount", Title = "خالص درآمد مرکز", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasRounding = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 10
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<AttenderSummeryCommission>>> AttenderCommissionSummaryPreview(
        GetAttenderCommission model, byte roleId)
    {
        var result = new ReportViewModel<List<AttenderSummeryCommission>>
        {
            Data = new List<AttenderSummeryCommission>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_Attender_Commission_TaxReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AttenderSummeryCommission>(sQuery,
                new
                {
                    model.FromDate,
                    model.ToDate,
                    model.AttenderId,
                    model.ActionId,
                    model.StageId,
                    model.WorkflowId,
                    model.DepartmentIds,
                    model.BranchId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AttenderCommissionSummaryGetColumns();
            conn.Close();
            return result;
        }
    }


    public async Task<MemoryStream> AttenderCommissionSummaryCSV(GetAttenderCommission model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = AttenderCommissionSummaryGetColumns().DataColumns.Select(z => z.Title).ToList();
        var getPage = await AttenderCommissionSummaryPreview(model, roleId);
        var Rows = from p in getPage.Data
            select new
            {
                p.Department,
                p.Attender,
                p.ServiceCode,
                p.Service,
                p.Qty,
                p.ServiceActualAmount,
                p.AttenderCommissionType,
                p.AttenderCommissionAmount,
                p.AttenderTaxAmount,
                p.AttenderNetAmount,
                p.GrossRevenueAmount,
                p.PenaltyAmount,
                p.CompanyBasicShareReimbursementAmount,
                p.CompanyCompShareReimbursementAmount,
                p.CompanyReimbursementAmount,
                p.NetRevenueAmount,
                p.ActionIdName
            };
        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns);
    }

    #endregion

    #region Admission Close

    public GetColumnsViewModel AdmissionCashCloseGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 14
                },
                new()
                {
                    Id = "cashier", Title = "صندوقدار", Type = (int)SqlDbType.Int, Size = 5, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "inOut", Title = "دریافت/برداشت", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "fundType", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "detailAccount", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "announcementAmount", Title = "مبلغ اظهاری", Type = (int)SqlDbType.Money, Size = 5,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "realAmount", Title = "مبلغ واقعی", Type = (int)SqlDbType.Money, Size = 5,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> AdmissionCashCloseCSV(GetAdmissionCashClose model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                AdmissionCashCloseGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await AdmissionCashClosePreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Branch,
                p.Cashier,
                p.InOut,
                p.FundType,
                p.DetailAccountName,
                p.AnnouncementAmount,
                p.RealAmount
            };
        return result;
    }

    public async Task<ReportViewModel<List<AdmissionCashClose>>> AdmissionCashClosePreview(GetAdmissionCashClose model)
    {
        var result = new ReportViewModel<List<AdmissionCashClose>>
        {
            Data = new List<AdmissionCashClose>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("BranchId", model.BranchId);
        parameters.Add("FromWorkDayDate", model.FromWorkDayDate);
        parameters.Add("ToWorkDayDate", model.ToWorkDayDate);
        parameters.Add("CreateUserId", model.CreateUserId);
        parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionClosePreview";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionCashClose>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = AdmissionCashCloseGetColumns();
            conn.Close();
            return result;
        }
    }

    #endregion

    #region Admission Insurance Report

    public GetColumnsViewModel AdmissionInsurerPreviewColumns(byte isFile)
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repinsurersum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "rowNumber", Title = "ردیف", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "rowNumberAdmission", Title = "ردیف پذیرش", Type = (int)SqlDbType.Int,
                    IsDtParameter = isFile == 1, Width = 13
                },
                new() { Id = "id", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 12 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 12
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 15
                },

                new()
                {
                    Id = "patient", Title = "نام مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                },


                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.VarChar, Size = 13,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "attender", Title = "نام طبیب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },

                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "prescriptionDatePersian", Title = "تاریخ نسخه", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "basicInsurerNo", Title = "شماره بیمه", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "basicInsurerBookletPageNo", Title = "شماره صفحه دفترچه", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerExpirationDatePersian", Title = "تاریخ انقضاء دفترچه",
                    Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "basicInsurer", Title = "نام بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerLine", Title = "صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "compInsurerLine", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "thirdPartyInsurer", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "serviceType", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "code", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 200, IsDtParameter = true,
                    Width = 25
                },
                new()
                {
                    Id = "qty", Title = "تعداد", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 5,
                    HasSumValue = true
                },

                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "netAmount", Title = "قابل دریافت", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 10, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "confirmedBySystemName", Title = "ارسال نسخه بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    Size = 30, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "confirmedBasicSharePrice", Title = "کسور بیمه اجباری", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsCommaSep = true, HasSumValue = true, Width = 10
                },
                new()
                {
                    Id = "confirmedCompSharePrice", Title = "کسور بیمه تکمیلی", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsCommaSep = true, HasSumValue = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> AdmissionInsurerPreviewCSV(GetAdmissionInsurerReportPreview model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns1 = AdmissionInsurerPreviewColumns(model.IsFile).DataColumns
            .Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title).ToList();

        var getPage = await AdmissionInsurerPreview(model, roleId);
        var Rows1 = from p in getPage.Data
            select new
            {
                p.RowNumber,
                p.Id,
                p.AdmissionMasterId,
                p.Workflow,
                p.Stage,
                p.Patient,
                p.NationalCode,
                p.Attender,
                p.Department,
                p.ReserveDatePersian,
                p.CreateDatePersian,
                p.HID,
                p.ReferringDoctor,
                p.PrescriptionDatePersian,
                p.BasicInsurerNo,
                p.BasicInsurerBookletPageNo,
                p.BasicInsurerExpirationDatePersian,
                p.BasicInsurer,
                p.BasicInsurerLine,
                p.CompInsurer,
                p.CompInsurerLine,
                p.ThirdPartyInsurer,
                p.DiscountInsurer,
                p.ServiceTypeName,
                p.Code,
                p.Service,
                p.Qty,
                p.ServiceActualAmount,
                p.BasicShareAmount,
                p.CompShareAmount,
                p.ThirdPartyAmount,
                p.DiscountAmount,
                p.NetAmount,
                p.ActionIdName,
                p.ConfirmedBySystemName,
                p.ConfirmedBasicSharePrice,
                p.ConfirmedCompSharePrice
            };
        return csvStream = await csvGenerator.GenerateCsv(Rows1, Columns1);
        ;
    }

    public async Task<ReportViewModel<List<AdmissionInsurerReportPreview>>> AdmissionInsurerPreview(
        GetAdmissionInsurerReportPreview model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionInsurerReportPreview>>
        {
            Data = new List<AdmissionInsurerReportPreview>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionServiceInsuranceDetailReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionInsurerReportPreview>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.FromReserveDate,
                model.ToReserveDate,
                model.WorkflowIds,
                model.StageIds,
                model.ActionIds,
                model.BasicInsurerIds,
                model.BasicInsurerLineIds,
                model.CompInsurerIds,
                model.CompInsurerLineIds,
                model.ThirdPartyInsurerIds,
                model.DiscountInsurerIds,
                model.AttenderIds,
                model.DepartmentIds,
                model.SpecialityIds,
                model.ReferringDoctorIds,
                model.ServiceTypeIds,
                model.ServiceIds,
                model.ConfirmedBySystems,
                model.ConfirmedBasicSharePrice,
                model.ConfirmedCompSharePrice,
                model.IsBasicShareAmount,
                model.IsCompShareAmount,
                model.IsThirdPartyAmount,
                model.IsDiscountAmount,
                model.OrderBy,
                model.OrderByDestination,
                //RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();

            result.Columns = AdmissionInsurerPreviewColumns(model.IsFile);
            conn.Close();

            if (model.IsFile == 1)
                result.Data = SetListInsurer(result.Data);

            return result;
        }
    }

    public List<AdmissionInsurerReportPreview> SetListInsurer(List<AdmissionInsurerReportPreview> data)
    {
        var result = new List<AdmissionInsurerReportPreview>();

        if (!data.ListHasRow())
            return result;

        var admissionHeader = data.Select(x => x.Id).Distinct().ToList();
        var len = admissionHeader.Count();

        for (var i = 0; i < len; i++)
        {
            var rList = data.Where(d => d.Id == admissionHeader[i]).ToList();
            var rowNumber = i + 1;

            foreach (var r in rList)
            {
                var model = new AdmissionInsurerReportPreview
                {
                    RowNumber = r.RowNumber,
                    RowNumberAdmission = rowNumber,
                    Id = r.Id,
                    WorkflowId = r.WorkflowId,
                    WorkflowName = r.WorkflowName,
                    StageId = r.StageId,
                    StageName = r.StageName,
                    ActionId = r.ActionId,
                    ActionName = r.ActionName,
                    PatientId = r.PatientId,
                    PatientName = r.PatientName,
                    NationalCode = r.NationalCode,
                    ReferringDoctorId = r.ReferringDoctorId,
                    ReferringDoctorFullName = r.ReferringDoctorFullName,
                    AttenderId = r.AttenderId,
                    AttenderName = r.AttenderName,
                    DepartmentId = r.DepartmentId,
                    DepartmentName = r.DepartmentName,
                    PrescriptionDatePersian = r.PrescriptionDatePersian,
                    ReserveDatePersian = r.ReserveDatePersian,
                    CreateDatePersian = r.CreateDatePersian,
                    BasicInsurerExpirationDatePersian = r.BasicInsurerExpirationDatePersian,
                    BasicInsurerNo = r.BasicInsurerNo,
                    BasicInsurerBookletPageNo = r.BasicInsurerBookletPageNo,
                    GenderId = r.GenderId,
                    MSC = r.MSC,
                    HID = r.HID,
                    BasicInsurerId = r.BasicInsurerId,
                    BasicInsurerName = r.BasicInsurerName,
                    BasicInsurerLineId = r.BasicInsurerLineId,
                    BasicInsurerLineName = r.BasicInsurerLineName,
                    CompInsurerId = r.CompInsurerId,
                    CompInsurerName = r.CompInsurerName,
                    CompInsurerLineId = r.CompInsurerLineId,
                    CompInsurerLineName = r.CompInsurerLineName,
                    ThirdPartyInsurerId = r.ThirdPartyInsurerId,
                    ThirdPartyInsurerName = r.ThirdPartyInsurerName,
                    DiscountInsurerId = r.DiscountInsurerId,
                    DiscountInsurerName = r.DiscountInsurerName,
                    ServiceTypeId = r.ServiceTypeId,
                    ServiceTypeName = r.ServiceTypeName,
                    ServiceId = r.ServiceId,
                    Code = r.Code,
                    ServiceName = r.ServiceName,
                    Qty = r.Qty,
                    ServiceActualAmount = r.ServiceActualAmount,
                    PatientShareAmount = r.PatientShareAmount,
                    BasicShareAmount = r.BasicShareAmount,
                    CompShareAmount = r.CompShareAmount,
                    ThirdPartyAmount = r.ThirdPartyAmount,
                    DiscountAmount = r.DiscountAmount,
                    NetAmount = r.NetAmount,
                    ConfirmedBySystem = r.ConfirmedBySystem,
                    ConfirmedBasicSharePrice = r.ConfirmedBasicSharePrice,
                    ConfirmedCompSharePrice = r.ConfirmedCompSharePrice
                };

                result.Add(model);
                model = new AdmissionInsurerReportPreview();
            }
        }

        return result;
    }

    public async Task<SumAdmissionInsurerReportPreview> AdmissionInsurerSumTotal(GetAdmissionInsurerReportPreview model,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_AdmissionServiceInsuranceDetailReportPreview_Sum]";
            conn.Open();
            var result = await conn.QuerySingleOrDefaultAsync<SumAdmissionInsurerReportPreview>(sQuery, new
            {
                model.FromReserveDate,
                model.ToReserveDate,

                model.WorkflowIds,
                model.StageIds,
                model.ActionIds,

                model.BasicInsurerIds,
                model.BasicInsurerLineIds,
                model.CompInsurerIds,
                model.CompInsurerLineIds,

                model.ThirdPartyInsurerIds,
                model.DiscountInsurerIds,
                model.AttenderIds,
                model.DepartmentIds,
                model.SpecialityIds,
                model.ReferringDoctorIds,
                model.ServiceTypeIds,
                model.ServiceIds,
                model.ConfirmedBySystems,

                model.ConfirmedBasicSharePrice,
                model.ConfirmedCompSharePrice,
                model.IsBasicShareAmount,
                model.IsCompShareAmount,
                model.IsThirdPartyAmount,
                model.IsDiscountAmount,
                //RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public List<GetReportParameter> GetCacheParametersInsuranceReport(int userId, ParametersReport reportCacheParameter)
    {
        var cache = _manageRedisRepository.GetDataReportParameters(userId);

        if (cache != null)
        {
            var parameteList = cache.Where(x => x.UserId == userId && x.ReportType == reportCacheParameter).ToList();

            return parameteList;
        }

        return null;
    }

    public bool UpdateCacheReportParameter(GetReportParameter model)
    {
        var cache = _manageRedisRepository.GetDataReportParameters(model.UserId);

        if (cache != null)
        {
            var parameter = cache.FirstOrDefault(x =>
                x.UserId == model.UserId && x.KeyParameter == model.KeyParameter && x.ReportType == model.ReportType);

            parameter.Parameters = model.Parameters;

            var expirationTime = DateTimeOffset.Now.AddDays(100.0);

            _manageRedisRepository.SetDataReportParameters(model.UserId, cache);
            return true;
        }

        return false;
    }

    public string AddCacheReportParameter(GetReportParameter model)
    {
        var cache = _manageRedisRepository.GetDataReportParameters(model.UserId);


        if (cache != null)
        {
            if (cache.Any(x =>
                    x.UserId == model.UserId && x.ReportType == model.ReportType &&
                    x.KeyParameter == model.KeyParameter))
                return "";

            cache.Add(model);

            _manageRedisRepository.SetDataReportParameters(model.UserId, cache);

            return model.KeyParameter;
        }

        cache = new List<GetReportParameter>();

        cache.Add(model);

        _manageRedisRepository.SetDataReportParameters(model.UserId, cache);

        return model.KeyParameter;
    }

    public bool RemoveCacheReportParameter(int userId, ParametersReport reportCacheParameter, string keyParameter)
    {
        var cache = _manageRedisRepository.GetDataReportParameters(userId);

        if (cache != null)
        {
            var model = cache.SingleOrDefault(x =>
                x.UserId == userId && x.ReportType == reportCacheParameter && x.KeyParameter == keyParameter);

            if (!model.NotNull())
                return false;

            var expirationTime = DateTimeOffset.Now.AddDays(100.0);

            cache.Remove(model);

            _manageRedisRepository.SetDataReportParameters(model.UserId, cache);

            if (cache.Count == 0)
                _manageRedisRepository.RemoveDataReportParameters(userId);

            return true;
        }

        return false;
    }

    #endregion

    #region Admission Insurance Summary Report

    public GetColumnsViewModel AdmissionInsurancePreviewColumns(byte type)
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/MC/AdmissionReportApi/repinsurersummarysum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = type == 2 || type == 4 || type == 6 || type == 8 || type == 10, Width = 9
                },
                new()
                {
                    Id = "admissionCount", Title = "تعداد مراجعه کننده", Type = (int)SqlDbType.Decimal, Size = 13,
                    IsDtParameter = true, Width = 9, HasSumValue = true
                },
                new()
                {
                    Id = "lineCount", Title = "تعداد خدمت", Type = (int)SqlDbType.Decimal, Size = 13,
                    IsDtParameter = true, Width = 9, HasSumValue = true
                },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ خدمت", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 9, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "basicInsurer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = type == 1 || type == 2, Width = 9
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 1 || type == 2, Width = 9, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = type == 3 || type == 4, Width = 10
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 3 || type == 4, Width = 10, IsCommaSep = true, HasSumValue = true
                },


                new()
                {
                    Id = "thirdPartyInsurer", Title = "طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = type == 5 || type == 6, Width = 10
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 5 || type == 26, Width = 10, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = type == 7 || type == 8, Width = 10
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 7 || type == 8, Width = 10, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "netAmount", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 9 || type == 10, Width = 8, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "notConfirmedBasicShareAmount", Title = "کسور بیمه اجباری", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 1 || type == 2 || type == 9 || type == 10, Width = 8, IsCommaSep = true,
                    HasSumValue = true
                },
                new()
                {
                    Id = "notConfirmedCompShareAmount", Title = "کسور بیمه تکمیلی", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 3 || type == 4, Width = 8, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "netBasicInsurerShareAmount", Title = "خالص سهم بیمه اجباری", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 1 || type == 2, Width = 8, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "netCompInsurerShareAmount", Title = "خالص سهم بیمه تکمیلی", Type = (int)SqlDbType.Money,
                    IsDtParameter = type == 3 || type == 4, Width = 8, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<IEnumerable>> AdmissionInsurerSummaryPreview(GetAdmissionInsuranceSummary model,
        byte roleId)
    {
        var result = new ReportViewModel<IEnumerable>();

        var parameter = new
        {
            model.PageNo,
            model.PageRowsCount,
            model.BranchIds,
            model.WorkflowIds,
            model.StageIds,
            model.ActionIds,
            model.FromReserveDate,
            model.ToReserveDate,
            model.BasicInsurerIds,
            model.BasicInsurerLineIds,
            model.CompInsurerIds,
            model.CompInsurerLineIds,
            model.ThirdPartyInsurerIds,
            model.DiscountInsurerIds,
            model.ServiceTypeIds,
            model.ConfirmedBasicSharePrice,
            model.ConfirmedCompSharePrice,
            model.IsBasicShareAmount,
            model.IsCompShareAmount,
            RoleId = roleId,
            model.Type
        };


        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionServiceInsuranceReportPreview";
            conn.Open();

            if (model.Type == 1)
            {
                result.Data = new List<AdmissionInsuranceSummaryBasicShareAmount>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryBasicShareAmount>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 2)
            {
                result.Data = new List<AdmissionInsuranceSummaryBasicShareAmountByServiceType>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryBasicShareAmountByServiceType>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 3)
            {
                result.Data = new List<AdmissionInsuranceSummaryCompShareAmount>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryCompShareAmount>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 4)
            {
                result.Data = new List<AdmissionInsuranceSummaryCompShareAmountByServiceType>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryCompShareAmountByServiceType>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 5)
            {
                result.Data = new List<AdmissionInsuranceSummaryThirdPartyAmount>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryThirdPartyAmount>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 6)
            {
                result.Data = new List<AdmissionInsuranceSummaryThirdPartyAmountByServiceType>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryThirdPartyAmountByServiceType>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 7)
            {
                result.Data = new List<AdmissionInsuranceSummaryDiscountAmount>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryDiscountAmount>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 8)
            {
                result.Data = new List<AdmissionInsuranceSummaryDiscountAmountByServiceType>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryDiscountAmountByServiceType>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else if (model.Type == 9)
            {
                result.Data = new List<AdmissionInsuranceSummaryNetAmount>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryNetAmount>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }
            else
            {
                result.Data = new List<AdmissionInsuranceSummaryNetAmountByServiceType>();
                result.Data =
                    (await conn.QueryAsync<AdmissionInsuranceSummaryNetAmountByServiceType>(sQuery, parameter,
                        commandType: CommandType.StoredProcedure)).ToList();
            }

            result.Columns = AdmissionInsurancePreviewColumns(model.Type);
            conn.Close();

            return result;
        }
    }

    public async Task<AdmissionInsuranceSummarySum> AdmissionInsurerSummaryPreviewSum(
        GetAdmissionInsuranceSummary model, byte roleId)
    {
        var parameter = new
        {
            model.BranchIds,
            model.WorkflowIds,
            model.StageIds,
            model.ActionIds,
            model.FromReserveDate,
            model.ToReserveDate,
            model.BasicInsurerIds,
            model.BasicInsurerLineIds,
            model.CompInsurerIds,
            model.CompInsurerLineIds,
            model.ThirdPartyInsurerIds,
            model.DiscountInsurerIds,
            model.ServiceTypeIds,
            model.ConfirmedBasicSharePrice,
            model.ConfirmedCompSharePrice,
            model.IsBasicShareAmount,
            model.IsCompShareAmount,
            RoleId = roleId,
            model.Type
        };


        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionServiceInsuranceReportPreview_Sum";

            conn.Open();

            var result =
                await conn.QueryFirstOrDefaultAsync<AdmissionInsuranceSummarySum>(sQuery, parameter,
                    commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<MemoryStream> AdmissionInsurerSummaryPreviewCSV(GetAdmissionInsuranceSummary model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns1 = AdmissionInsurancePreviewColumns(model.Type).DataColumns
            .Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title).ToList();

        var getPage = await AdmissionInsurerSummaryPreview(model, roleId);

        var tt = getPage.Data.Cast<object>();
        if (model.Type == 1)
        {
            var List = new List<AdmissionInsuranceSummaryBasicShareAmount>(getPage.Data
                .Cast<AdmissionInsuranceSummaryBasicShareAmount>());

            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.BasicInsurer,
                    a.BasicShareAmount,
                    a.NotConfirmedBasicShareAmount,
                    a.NetBasicInsurerShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 2)
        {
            var List = new List<AdmissionInsuranceSummaryBasicShareAmountByServiceType>(
                getPage.Data.Cast<AdmissionInsuranceSummaryBasicShareAmountByServiceType>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.ServiceType,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.BasicInsurer,
                    a.BasicShareAmount,
                    a.NotConfirmedBasicShareAmount,
                    a.NetBasicInsurerShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 3)
        {
            var List = new List<AdmissionInsuranceSummaryCompShareAmount>(getPage.Data
                .Cast<AdmissionInsuranceSummaryCompShareAmount>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.CompInsurer,
                    a.CompShareAmount,
                    a.NotConfirmedCompShareAmount,
                    a.NetCompInsurerShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 4)
        {
            var List = new List<AdmissionInsuranceSummaryCompShareAmountByServiceType>(
                getPage.Data.Cast<AdmissionInsuranceSummaryCompShareAmountByServiceType>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.ServiceType,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.CompInsurer,
                    a.CompShareAmount,
                    a.NotConfirmedCompShareAmount,
                    a.NetCompInsurerShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 5)
        {
            var List = new List<AdmissionInsuranceSummaryThirdPartyAmount>(getPage.Data
                .Cast<AdmissionInsuranceSummaryThirdPartyAmount>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.ThirdPartyInsurer,
                    a.ThirdPartyAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 6)
        {
            var List = new List<AdmissionInsuranceSummaryThirdPartyAmountByServiceType>(
                getPage.Data.Cast<AdmissionInsuranceSummaryThirdPartyAmountByServiceType>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.ServiceType,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.ThirdPartyInsurer,
                    a.ThirdPartyAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 7)
        {
            var List = new List<AdmissionInsuranceSummaryDiscountAmount>(getPage.Data
                .Cast<AdmissionInsuranceSummaryDiscountAmount>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.DiscountInsurer,
                    a.DiscountAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 8)
        {
            var List = new List<AdmissionInsuranceSummaryDiscountAmountByServiceType>(
                getPage.Data.Cast<AdmissionInsuranceSummaryDiscountAmountByServiceType>());
            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.ServiceType,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.DiscountInsurer,
                    a.DiscountAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }

        if (model.Type == 9)
        {
            var List = new List<AdmissionInsuranceSummaryNetAmount>(getPage.Data
                .Cast<AdmissionInsuranceSummaryNetAmount>());

            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.NetAmount,
                    a.NotConfirmedBasicShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }
        else
        {
            var List = new List<AdmissionInsuranceSummaryNetAmountByServiceType>(
                getPage.Data.Cast<AdmissionInsuranceSummaryNetAmountByServiceType>());

            var row1 = from a in List
                select new
                {
                    a.Branch,
                    a.Workflow,
                    a.Stage,
                    a.ServiceType,
                    a.AdmissionCount,
                    a.LineCount,
                    a.ServiceActualAmount,
                    a.NetAmount,
                    a.NotConfirmedBasicShareAmount,
                    a.ActionIdName
                };

            return csvStream = await csvGenerator.GenerateCsv(row1, Columns1);
        }
    }

    #endregion

    #region Admission User Report

    public GetColumnsViewModel AdmissionUserReportGetColumns(byte itemtype)
    {
        var list = new GetColumnsViewModel();

        if (itemtype == 2)
        {
            list.SumDynamic = true;
            list.GetSumApi = "/api/MC/AdmissionReportApi/repadmissionserviceusersum";

            list.DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه ثبت ", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 11
                },
                new() { Id = "branch", Title = "شعبه", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 7 },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 16
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "nationalCode", Title = "کدملی", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "serviceActualAmount", Title = "مبلغ واقعی خدمت", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, HasSumValue = true, Width = 7, IsCommaSep = true
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "netAmount", Title = "خالص سهم مراجعه کننده", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.VarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                }
            };
        }
        else if (itemtype == 1)
        {
            list.SumDynamic = true;
            list.GetSumApi = "/api/MC/AdmissionReportApi/repadmissionsaleusersum";
            list.DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 11
                },
                new() { Id = "branch", Title = "شعبه", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 7 },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 11
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "nationalCode", Title = "کدملی", Type = (int)SqlDbType.VarChar, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "vendor", Title = "تامین کننده کالا", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "itemActualAmount", Title = "مبلغ واقعی کالا", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, HasSumValue = true, Width = 7, IsCommaSep = true
                },
                new()
                {
                    Id = "basicShareAmount", Title = "سهم بیمه اجباری", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "compShareAmount", Title = "سهم بیمه تکمیلی", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "thirdPartyAmount", Title = "سهم طرف قرارداد", Type = (int)SqlDbType.Money,
                    IsDtParameter = true, Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "discountAmount", Title = "سهم تخفیف", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "netAmount", Title = "خالص سهم کالا", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 7, HasSumValue = true, IsCommaSep = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.VarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                }
            };
        }


        return list;
    }

    public async Task<MemoryStream> AdmissionUserReportCSV(GetAdmissionUserSaleService model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            AdmissionUserReportGetColumns(model.ItemTypeId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                .Select(z => z.Title));


        if (model.ItemTypeId == 2)
        {
            var getPage = await AdmissionServiceUserReportPreview(model, roleId);
            var Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.AdmissionMasterId,
                    p.Branch,
                    p.Workflow,
                    p.Stage,
                    p.CreateDatePersian,
                    p.ReserveDatePersian,
                    p.Patient,
                    p.NationalCode,
                    p.Attender,
                    p.Department,
                    p.ServiceActualAmount,
                    p.BasicShareAmount,
                    p.CompShareAmount,
                    p.ThirdPartyAmount,
                    p.DiscountAmount,
                    p.NetAmount,
                    p.ActionIdName,
                    p.User
                };

            return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
        }
        else
        {
            var getPage = await AdmissionSaleUserReportPreview(model, roleId);
            var Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.AdmissionMasterId,
                    p.Branch,
                    p.Workflow,
                    p.Stage,
                    p.CreateDatePersian,
                    p.Patient,
                    p.NationalCode,
                    p.Vendor,
                    p.ItemActualAmount,
                    p.BasicShareAmount,
                    p.CompShareAmount,
                    p.ThirdPartyAmount,
                    p.DiscountAmount,
                    p.NetAmount,
                    p.ActionIdName,
                    p.User
                };


            return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
        }
    }

    public async Task<ReportViewModel<List<AdmissionServiceUserReportPreview>>> AdmissionServiceUserReportPreview(
        GetAdmissionUserSaleService model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionServiceUserReportPreview>>
        {
            Data = new List<AdmissionServiceUserReportPreview>()
        };

        using (var conn = Connection)
        {
            var departmentId = model.DepartmentId.ToString();
            
            var test = int.TryParse(departmentId, out var newValue);
            var sQuery = "mc.Spr_AdmissionServiceUserReportPreview";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionServiceUserReportPreview>(sQuery, new
            {
                model.BranchId,
                model.FromDate,
                model.ToDate,
                model.AttenderId,
                departmentId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.UserId,
                model.CompanyId,
                model.PageNo,
                model.PageRowsCount,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            result.Columns = AdmissionUserReportGetColumns(model.ItemTypeId);
            return result;
        }
    }

    public async Task<ReportViewModel<List<AdmissionSaleUserReportPreview>>> AdmissionSaleUserReportPreview(
        GetAdmissionUserSaleService model, byte roleId)
    {
        var result = new ReportViewModel<List<AdmissionSaleUserReportPreview>>
        {
            Data = new List<AdmissionSaleUserReportPreview>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.[Spr_AdmissionSaleUserReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AdmissionSaleUserReportPreview>(sQuery, new
            {
                model.BranchId,
                model.FromDate,
                model.ToDate,
                model.VendorId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.UserId,
                model.CompanyId,
                model.PageNo,
                model.PageRowsCount,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            result.Columns = AdmissionUserReportGetColumns(model.ItemTypeId);
            return result;
        }
    }

    public async Task<SumAdmissionSaleUser> AdmissionSaleUserReportPreviewSumTotal(GetAdmissionUserSaleService model,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionSaleUserReportPreview_Sum";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SumAdmissionSaleUser>(sQuery, new
            {
                model.BranchId,
                model.FromDate,
                model.ToDate,
                model.VendorId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.UserId,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<SumAdmissionSaleUser> AdmissionServiceUserReportPreviewSumTotal(GetAdmissionUserSaleService model,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_AdmissionServiceUserReportPreview_Sum";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SumAdmissionSaleUser>(sQuery, new
            {
                model.BranchId,
                model.FromDate,
                model.ToDate,
                model.AttenderId,
                model.DepartmentId,
                model.ActionId,
                model.StageId,
                model.WorkflowId,
                model.UserId,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    #endregion
}