using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportControl;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportControl;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportControl;

public class ReportControlRepository : IReportControlRepository
{
    #region Define Variable

    private readonly IConfiguration _reportConfig;

    public ReportControlRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    #endregion

    #region Control Service

    public GetColumnsViewModel ServiceControlGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "code", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.Int, Size = 5, IsDtParameter = true,
                    Width = 4
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<ServiceControl>>> ServiceControlGetPage(GetServiceControl model)
    {
        var result = new ReportViewModel<List<ServiceControl>>
        {
            Data = new List<ServiceControl>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("Type", model.Type);
        parameters.Add("CompanyId", model.CompanyId);
        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_Service_Control";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ServiceControl>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            result.Columns = ServiceControlGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> ServiceControlCsv(GetServiceControl model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                ServiceControlGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };

        var getPage = await ServiceControlGetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.ServiceId,
                p.Code,
                p.Name,
                p.Price,
                p.Price_IPD
            };
        return result;
    }

    #endregion

    #region Control Insurer

    public GetColumnsViewModel InsurerControlGetColumns(byte isnurerTypeId)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "basicInsuer", Title = "بیمه اجباری", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = isnurerTypeId == 1, Width = 5
                },
                new()
                {
                    Id = "basicInsurerLine", Title = "صندوق بیمه اجباری", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = isnurerTypeId == 1, Width = 4
                },
                new()
                {
                    Id = "compInsurer", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = isnurerTypeId == 2, Width = 4
                },
                new()
                {
                    Id = "compInsurerLine", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = isnurerTypeId == 2, Width = 4
                },
                new()
                {
                    Id = "thridPartyInsurer", Title = "طرف قرار داد", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = isnurerTypeId == 4, Width = 4
                },
                new()
                {
                    Id = "discountInsurer", Title = "تخفیف", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = isnurerTypeId == 5, Width = 4
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<InsurerControl>>> InsurerControlGetPage(GetServiceControl model)
    {
        var result = new ReportViewModel<List<InsurerControl>>
        {
            Data = new List<InsurerControl>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("InsurerTypeId", model.Type);
        parameters.Add("CompanyId", model.CompanyId);
        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_Insurer_Control";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InsurerControl>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            result.Columns = InsurerControlGetColumns(model.Type);
            conn.Close();
            return result;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> InsurerControlCsv(GetServiceControl model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                InsurerControlGetColumns(model.Type).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await InsurerControlGetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.BasicInsuer,
                p.BasicInsurerLine,
                p.CompInsurer,
                p.CompInsurerLine,
                p.ThridPartyInsurer,
                p.DiscountInsurer
            };
        return result;
    }

    #endregion

    #region Control Attender

    public GetColumnsViewModel AttenderControlGetColumns(byte type)
    {
        var list = new GetColumnsViewModel();

        if (type != 4)
            list.DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 5, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 5,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "attenderTaxPer", Title = "مالیات طبیب", Type = (int)SqlDbType.Float, IsDtParameter = true,
                    Width = 4
                }
            };
        else
            list.DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه طبیب", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "fullName", Title = "نام طبیب", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "serviceId", Title = "شناسه خدمت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "serviceNationalCode", Title = "نمبر تذکره خدمت", Type = (int)SqlDbType.Int, Size = 5,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "serviceName", Title = "نام خدمت", Type = (int)SqlDbType.NVarChar, Size = 5,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "price", Title = "تعرفه مرکز", Type = (int)SqlDbType.Float, Size = 5, IsDtParameter = true,
                    IsCommaSep = true, Width = 4
                }
                // new DataColumnsViewModel { Id = "priceIPD", Title = "تعرفه گردشگری", Type = (int)SqlDbType.Float, Size = 5, IsDtParameter = true,IsCommaSep=true, Width=4 }
            };

        return list;
    }

    public async Task<ReportViewModel<List<AttenderControl>>> AttenderControlGetPage(GetAttenderControl model)
    {
        var result = new ReportViewModel<List<AttenderControl>>
        {
            Data = new List<AttenderControl>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("AttenderId", model.AttenderId);
        parameters.Add("IsActive", model.IsActive);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("Type", model.Type);
        using (var conn = Connection)
        {
            var sQuery = "mc.Spr_Attender_Control";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AttenderControl>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            result.Columns = AttenderControlGetColumns(model.Type);
            conn.Close();
            return result;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> AttenderControlCsv(GetAttenderControl model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                AttenderControlGetColumns(model.Type).DataColumns.Where(x => x.IsDtParameter).Select(z => z.Title))
        };
        var getPage = await AttenderControlGetPage(model);

        if (model.Type != 4)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.FullName,
                    p.SpecialityName,
                    p.MobileNo,
                    p.DepartmentName,
                    p.NationalCode,
                    p.AttenderTaxPer
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.FullName,
                    p.ServiceId,
                    p.ServiceNationalCode,
                    p.ServiceName,
                    p.Price,
                    p.PriceIPD
                };


        return result;
    }

    #endregion
}