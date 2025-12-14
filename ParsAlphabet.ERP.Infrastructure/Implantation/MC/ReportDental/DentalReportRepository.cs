using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportDental;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportDental;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportDental;

public class DentalReportRepository : IDentalReportRepository
{
    private readonly IConfiguration _reportConfig;

    public DentalReportRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    public async Task<CSVViewModel<IEnumerable>> DentalReportCSV(GetDentalReportViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>();
        result.Columns = string.Join(',',
            DentalReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));

        var getPage = await DentalReportPreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
            };
        return result;
    }

    public GetColumnsViewModel DentalReportGetColumns()
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
                    Id = "isMissing", Title = "دندان کشیدنی", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "tooth", Title = "شماره دندان", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "partTooth", Title = "بخش دندان", Type = (int)SqlDbType.NVarChar, Size = 10, IsPersian = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "segmentTooth", Title = "سطح دندان", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPersian = true, IsDtParameter = true, Width = 4
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<object>>> DentalReportPreview(GetDentalReportViewModel model)
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
                    model.AttenderId,
                    model.BasicInsuranceBoxId,
                    model.BasicInsurerId,
                    model.CompInsuranceBoxId,
                    model.FromDate,
                    model.ToDate,
                    model.IsMissing,
                    model.PartId,
                    model.PatientId,
                    model.SegmentId,
                    model.ServiceCenterId,
                    model.ShabadStatus,
                    model.SpecialityId,
                    model.ThirdPartyId,
                    model.ToothId,
                    model.UserId,
                    model.CompanyId,
                    model.PageNo,
                    model.PageRowsCount
                }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = DentalReportGetColumns();
            conn.Close();
            return result;
        }
    }
}