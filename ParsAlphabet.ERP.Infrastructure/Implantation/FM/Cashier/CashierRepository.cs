using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.Cahier;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.Cashier;

public class CashierRepository :
    BaseRepository<CashierModel, int, string>,
    IBaseRepository<CashierModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public CashierRepository(IConfiguration config,
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
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "branchName", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "ipAddress", Title = "آی پی کیوسک", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "isStand", Title = "کیوسک", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 50 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
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
                p.Name,
                p.BranchName,
                p.IpAddress,
                IsStand = p.IsStand ? "بلی" : "خیر",
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<CashierGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CashierGetPage>>();
        result.Data = new List<CashierGetPage>();

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("BranchName",
            model.Filters.Any(x => x.Name == "branchName")
                ? model.Filters.FirstOrDefault(x => x.Name == "branchName").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CashierGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<CashierGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<CashierGetRecord>();
        result.Data = new CashierGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<CashierGetRecord>(sQuery, new
            {
                CashierId = id,
                IpAddress = "",
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultPage<CashierGetRecord>> GetRecordByIpAddress(string ip, int companyId)
    {
        var result = new MyResultPage<CashierGetRecord>();
        result.Data = new CashierGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<CashierGetRecord>(sQuery, new
            {
                CashierId = 0,
                IpAddress = ip,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_Delete]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                CashierId = keyvalue,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        if (result.Status == -100)
            result.StatusMessage = "پوزهای صندوق موردنظر دارای گردش می باشد مجاز به حذف نمی باشید";
        else if (result.Status == -101)
            result.StatusMessage = "حطا ، شرح خطا به جدول لاگ ارسال";
        else
            result.StatusMessage = "عملیات حذف با موفقیت انجام شد";


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int companyId, short branchId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.Cashier",
                    Filter = $"CompanyId={companyId} AND IsActive=1 AND IsStand=0 AND BranchId={branchId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownPos()
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_PosBank_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<PosViewModel>(sQuery, commandType: CommandType.StoredProcedure);
            var finalResult = from r in result
                select new MyDropDownViewModel
                {
                    Id = r.Id,
                    Name = $"{r.Name} - {r.BankAccountName} / {r.AccountNo}"
                };


            return finalResult;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownCashStand(short branchId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_GetStands]";
            conn.Open();

            var result = await conn.QueryAsync<cashStandViewModel>(sQuery, new
            {
                BranchId = branchId
            }, commandType: CommandType.StoredProcedure);

            var finalResult = from r in result
                select new MyDropDownViewModel
                {
                    Id = r.Id,
                    Name = $"{r.Name} / {r.IpAddress}"
                };


            return finalResult;
        }
    }

    public async Task<string> GetName(short id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.Cashier",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultQuery> Insert(CashierModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.Name,
                model.BranchId,
                model.IsActive,
                model.IsStand,
                model.IpAddress,
                PosList = JsonConvert.SerializeObject(model.PosList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultQuery> Update(CashierModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Cashier_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.Name,
                model.BranchId,
                model.IsActive,
                model.IsStand,
                model.IpAddress,
                PosList = JsonConvert.SerializeObject(model.PosList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    //public async Task<GetCashierIdByIp> GetCashierIdByIpAsync(string ipAddress,int id)
    //{
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_GetTable";
    //        conn.Open();
    //        var result = await conn.QueryFirstOrDefaultAsync<GetCashierIdByIp>(sQuery, new
    //        {
    //            IsSecondLang = false,
    //            TableName = "fm.Cashier",
    //            IdColumnName="Id",
    //            ColumnNameList = "Id,ISNULL(BranchId,0) BranchId",
    //            Filter = $"IpAddress='{ipAddress}' AND IsStand=1"
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();

    //        return result;
    //    }
    //}

    public async Task<bool> CheckExistIP(MyDropDownViewModel model)
    {
        var result = 0;
        var filter = string.Empty;
        if (model.Id == 0)
            filter = $"IpAddress='{model.Name}' AND [CompanyId]={model.CompanyId} AND IsStand=1";
        else
            filter = $"IpAddress='{model.Name}' AND Id<>{model.Id} AND [CompanyId]={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "fm.Cashier",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result == 0;
    }


    public int GetCashierIdByIp(string ipAddress)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = conn.ExecuteScalar<int>(sQuery, new
            {
                TableName = "fm.Cashier",
                ColumnName = "ISNULL(Id,0)",
                Filter = $"IpAddress='{ipAddress}' AND IsStand=1"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }
}