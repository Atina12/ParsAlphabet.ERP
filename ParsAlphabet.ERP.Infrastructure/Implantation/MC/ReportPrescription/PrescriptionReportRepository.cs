//using AutoMapper.Configuration;

using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportPrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportPrescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportPrescription;

public class PrescriptionReportRepository : IPrescriptionReportRepository
{
    private readonly IConfiguration _reportConfiguration;

    public PrescriptionReportRepository(IConfiguration reportConfig)
    {
        _reportConfiguration = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfiguration.GetConnectionString("DefaultConnection"));

    public async Task<CSVViewModel<IEnumerable>> PrescriptionReportCSV(GetPrescriptionReportViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>();
        result.Columns = string.Join(',',
            RepPrescriptionServiceGetColumn().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                .Select(z => z.Title));

        var getPage = await PrescriptionReportPreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
            };
        return result;
    }

    public async Task<ReportViewModel<List<object>>> PrescriptionReportPreview(GetPrescriptionReportViewModel model)
    {
        var result = new ReportViewModel<List<object>>
        {
            Data = new List<object>()
        };

        using (var conn = Connection)
        {
            var sQuery = "";
            conn.Open();

            result.Data = (await conn.QueryAsync<object>(sQuery,
                new
                {
                    model.Id,
                    model.AttenderId,
                    model.BasicInsuranceBoxId,
                    model.BasicInsurerId,
                    model.CompInsuranceBoxId,
                    model.DiagnosisResonId,
                    model.FromDate,
                    model.ImageServiceId,
                    model.IsCompounded,
                    model.LabServiceId,
                    model.PatientId,
                    model.ProductId,
                    model.ServiceCenterId,
                    model.ShabadStatus,
                    model.SpecialityId,
                    model.StatusId,
                    model.ThirdPartyId,
                    model.ToDate,
                    model.UserId,
                    model.CompanyId,
                    model.PageNo,
                    model.PageRowsCount
                }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = RepPrescriptionServiceGetColumn();
            conn.Close();
            return result;
        }
    }

    public GetColumnsViewModel RepPrescriptionServiceGetColumn()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 4 },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "patientFullName", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "attenderFullName", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "basicInsurerName", Title = "نام بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "basicInsuranceBoxName", Title = "نام صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "compInsurerName", Title = "نام بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "thirdPartyName", Title = "نام طرف قرارداد", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "product", Title = "دارو", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "qty", Title = "تعداد", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "dosage", Title = "مقدار مصرف", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "abuseDurationUnitId", Title = "واحد مصرف", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "frequency", Title = "تواتر مصرف", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "routeIddrugHistory", Title = "طریقه مصرف", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "routeIddrugHistory", Title = "شرط مصرف", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "methodId", Title = "روش مصرف", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "priorityIdDrug", Title = "اولویت مصرف", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "reason", Title = "دلیل تجویز", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "bodySite", Title = "محل استفاده", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "asNeedId", Title = "شرط استفاده", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "imageCompounded", Title = "جزئیات تصویر", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "doNotPerform", Title = "عدم انجام", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                }
                // new DataColumnsViewModel { Id = "isMissing", Title = "دندان کشیدنی", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian =true, IsDtParameter = true, Width=4},
                //new DataColumnsViewModel { Id = "tooth", Title = "شماره دندان", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian =true, IsDtParameter = true, Width=4},
                //new DataColumnsViewModel { Id = "partTooth", Title = "بخش دندان", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian =true, IsDtParameter = true, Width=4},
                //new DataColumnsViewModel { Id = "segmentTooth", Title = "سطح دندان", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian =true, IsDtParameter = true, Width=4},
            }
        };

        return list;
    }
}