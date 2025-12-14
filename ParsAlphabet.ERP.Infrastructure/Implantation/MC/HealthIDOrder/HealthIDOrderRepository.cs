using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.HealthIDOrder;
using GenerateBatchHID = ParsAlphabet.WebService.Api.Model.TaskSchedule.Behdasht.GenerateBatchHID;
using MyResultStatus = ParsAlphabet.ERP.Application.Dtos.MyResultStatus;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.HealthIDOrder;

public class HealthIDOrderRepository :
    BaseRepository<HealthIDOrderModel, int, string>,
    IBaseRepository<HealthIDOrderModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public HealthIDOrderRepository(IConfiguration config,
        IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "insurerId", Title = "شناسه بیمه", Type = (int)SqlDbType.SmallInt, IsPrimary = true, Width = 6
                },
                new()
                {
                    Id = "insurer", Title = "بیمه گر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "quantity", Title = "تعداد درخواست", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "balance", Title = "تعداد مانده", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "validCount", Title = "تعداد مانده معتبر", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 32 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "deleteExpiredHID", Title = "حذف شبادهای منقضی", ClassName = "",
                    IconName = "fa fa-trash color-maroon"
                },
                new() { Name = "requestHID", Title = "درخواست HID", ClassName = "", IconName = "far fa-file-alt" }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsHealthId()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 20
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, Size = 15, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "validDatePersian", Title = "تاریخ اعتبار", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 40
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        model.PageNo = null;
        model.PageRowsCount = null;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Insurer,
                p.Quantity,
                p.Balance,
                p.ValidCount,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<HealthIDOrderGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<HealthIDOrderGetPage>>();
        result.Data = new List<HealthIDOrderGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("InsurerName",
            model.Filters.Any(x => x.Name == "insurer")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurer").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_HealthIDOrder_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<HealthIDOrderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<GetHealthId>>> GetPageHealthId(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<GetHealthId>>();
        result.Data = new List<GetHealthId>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("InsurerId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("HID",
            model.Filters.Any(x => x.Name == "hid") ? model.Filters.FirstOrDefault(x => x.Name == "hid").Value : null);

        result.Columns = GetColumnsHealthId();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_HealthID_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<GetHealthId>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<short> GetCountGenerateBatchHID(int insurerId, int CompanyId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);


            var sQuery = "[mc].[Spc_Count_GenerateBatchHID]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    InsurerId = insurerId,
                    CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<bool> InsertGeneratedBatchHID(GenerateBatchHID model)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);

            var sQuery = "[mc].[Spc_HealthID_InsUpd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery,
                new
                {
                    Opr = "Ins",
                    model.InsurerId,
                    model.ValidDate,
                    //model.CompanyId,
                    HIDList = JsonConvert.SerializeObject(model.HIDList)
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return true;
        }
    }

    public async Task<string> GetHid(byte insurerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Get_HID]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    InsurerId = insurerId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result ?? string.Empty;
        }
    }

    public async Task<MyResultStatus> DeleteExpiredHID(byte insurerId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_HealthID_Delete]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    InsurerId = insurerId,
                    CurrentDate = DateTime.Now.ToString("yyyy/MM/dd"),
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }
}