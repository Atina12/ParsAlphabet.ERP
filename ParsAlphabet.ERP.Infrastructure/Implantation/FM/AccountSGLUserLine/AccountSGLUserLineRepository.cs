using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountSGLUserLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGLUserLine;

public class AccountSGLUserLineRepository :
    BaseRepository<AccountSGLUserLineModel, int, string>,
    IBaseRepository<AccountSGLUserLineModel, int, string>
{
    public AccountSGLUserLineRepository(IConfiguration config)
        : base(config)
    {
    }

    public GetColumnsViewModel GetColumnsDiAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGLId", Title = "کد کل", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "accountGL", Title = "حساب کل ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 27
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "accountSGL", Title = "حساب معین ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 27
                },
                new()
                {
                    Id = "accountDetailRequiredTitle", Title = "تنظیمات حسابداری ", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Size = 100, Width = 27
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت معین", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 7,
                    Align = "center"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGLId", Title = "کد کل", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "accountGL", Title = "حساب کل ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 19
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "accountSGL", Title = "حساب معین ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 19
                },
                new()
                {
                    Id = "accountDetailRequiredTitle", Title = "تنظیمات حسابداری ", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Size = 100, Width = 19
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت معین", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 7,
                    Align = "center"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<AccountSGLUserLineAssignList>> GetPageDiAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AccountSGLUserLineAssignList>();
        result.Data = new AccountSGLUserLineAssignList();

        var p_userId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int?
            p_accountGLId = null,
            p_accountSGLId = null;

        string
            p_accountGLName = string.Empty,
            p_accountSGLName = string.Empty;

        switch (model.FieldItem)
        {
            case "accountGL":
                p_accountGLName = model.FieldValue;
                break;
            case "accountGLId":
                p_accountGLId = Convert.ToInt32(model.FieldValue);
                break;
            case "accountSGL":
                p_accountSGLName = model.FieldValue;
                break;
            case "accountSGLId":
                p_accountSGLId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("AccountGLId", p_accountGLId);
        parameters.Add("AccountGLName", p_accountGLName);
        parameters.Add("AccountSGLId", p_accountSGLId);
        parameters.Add("AccountSGLName", p_accountSGLName);
        parameters.Add("UserId", p_userId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsDiAssign();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGLUser_DiAssign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<AccountSGLUserLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<AccountSGLUserLineAssignList>> GetPageAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AccountSGLUserLineAssignList>();
        result.Data = new AccountSGLUserLineAssignList();

        var p_userId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int?
            p_accountGLId = null,
            p_accountSGLId = null;

        string
            p_accountGLName = string.Empty,
            p_accountSGLName = string.Empty;

        switch (model.FieldItem)
        {
            case "accountGL":
                p_accountGLName = model.FieldValue;
                break;
            case "accountGLId":
                p_accountGLId = Convert.ToInt32(model.FieldValue);
                break;
            case "accountSGL":
                p_accountSGLName = model.FieldValue;
                break;
            case "accountSGLId":
                p_accountSGLId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("AccountGLId", p_accountGLId);
        parameters.Add("AccountGLName", p_accountGLName);
        parameters.Add("AccountSGLId", p_accountSGLId);
        parameters.Add("AccountSGLName", p_accountSGLName);
        parameters.Add("UserId", p_userId);
        parameters.Add("CompanyId", model.CompanyId);
        result.Columns = GetColumnsAssign();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGLUser_Assign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<AccountSGLUserLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> AccountSGLUserAssign(AccountSGLUserLineAssign model, int userId)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGLUser_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.UserId,
                AccountGLSGLJson = JsonConvert.SerializeObject(model.Assign),
                model.CompanyId,
                CreateUserId = userId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> AccountSGLUserDiAssign(AccountSGLUserLineAssign model, int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGLUser_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                model.UserId,
                AccountGLSGLJson = JsonConvert.SerializeObject(model.Assign),
                model.CompanyId,
                CreateUserId = userId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<bool> CheckAccessGLSGLUser(Get_AccountSGLUserLine model)
    {
        var filter = $"UserId={model.UserId} AND CompanyId={model.CompanyId}";

        if (model.AccountGLId != 0)
            filter += $" AND AccountGLId = {model.AccountGLId}";

        if (model.AccountSGLId != 0)
            filter += $" AND AccountSGLId = {model.AccountSGLId}";


        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.AccountSGLUser",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            return result != 0;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsAssign().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPageAssign(model);
        result.Rows = from p in getPage.Data.Assigns
            select new
            {
                p.AccountGL,
                p.AccountSGL,
                p.AccountDetailRequiredTitle
            };
        return result;
    }
}