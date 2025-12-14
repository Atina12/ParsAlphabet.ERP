using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountSGL;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGL;

public class AccountSGLRepository :
    BaseRepository<AccountSGLModel, int, string>,
    IBaseRepository<AccountSGLModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountGLRepository _accountGLRepository;
    private readonly IPublicRepository _publicRepository;

    public AccountSGLRepository(IConfiguration config,
        IHttpContextAccessor accessor,
        AccountGLRepository accountGLRepository, IPublicRepository publicRepository)
        : base(config)
    {
        _accessor = accessor;
        _accountGLRepository = accountGLRepository;
        _publicRepository = publicRepository;
    }

    public GetColumnsViewModel GetColumns(byte? typeId)
    {
        var list = new GetColumnsViewModel
        {
            ActionType = typeId == 0 ? "dropdown" : "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "glId", Title = "کد کل", Type = (int)SqlDbType.Int, Width = 8, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "glName", Title = "نام کل", Type = (int)SqlDbType.VarChar, Width = 15, IsDtParameter = true,
                    IsFilterParameter = true
                },
                new()
                {
                    Id = "id", Title = "کد معین", Type = (int)SqlDbType.TinyInt, Width = 10, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام معین", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 15,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "accountDetailRequired", Title = "تنظیمات تفصیل", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Width = 6, IsDtParameter = true,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 38 }
            }
        };

        if (typeId == 0)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "getaccountsgl", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "deletesgl", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            };
        else if (typeId == 1)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "accountSGLUser", Title = "تخصیص کاربران به معین", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(null).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.GLId,
                p.GlName,
                p.Id,
                p.Name,
                p.AccountDetailRequired,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<AccountSGLGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AccountSGLGetPage>>();
        result.Data = new List<AccountSGLGetPage>();

        MyClaim.Init(_accessor);

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("GLId",
            model.Filters.Any(x => x.Name == "glId")
                ? model.Filters.FirstOrDefault(x => x.Name == "glId").Value
                : null);
        parameters.Add("GLName",
            model.Filters.Any(x => x.Name == "glName")
                ? model.Filters.FirstOrDefault(x => x.Name == "glName").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        if (model.Form_KeyValue.Length > 0)
            result.Columns = GetColumns(Convert.ToByte(model.Form_KeyValue[0]?.ToString()));
        else
            result.Columns = GetColumns(null);

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_AccountSGL_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AccountSGLGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<List<int>> GetAll()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<int>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "Id",
                    IdList = "",
                    OrderBy = "",
                    Filter = "IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<List<GetAccountDetail>> GetExceptGLSGLNoSeries(object glsglaccountDetail)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Get_ExceptGLSGLNoSeries]";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<GetAccountDetail>(sQuery,
                new
                {
                    RequiredGLSGLJson = JsonConvert.SerializeObject(glsglaccountDetail)
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<List<Tuple<int, int>>> GetAllGLSGL()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<int, int, Tuple<int, int>>(sQuery, Tuple.Create,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "GLId,Id",
                    IdList = "",
                    OrderBy = ""
                }, null, true, "*", (int?)CommandType.StoredProcedure);

            return result.ToList();
        }
    }

    public async Task<List<AccountGlSglModel>> GetAllGlSgl(string accountGlIds)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<AccountGlSglModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "GlId AccountGlId,Id AccountSGlId",
                    Filter = $"GlId IN({accountGlIds})",
                    IdList = "",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<MyResultPage<AccountSGLGetRecord>> GetRecordById(int id, int glId, int companyId)
    {
        var result = new MyResultPage<AccountSGLGetRecord>
        {
            Data = new AccountSGLGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<AccountSGLGetRecord>(sQuery, new
            {
                TableName = "fm.AccountSGL",
                Filter = $"Id = {id} and GlId = {glId} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data == null;


        result.Data.GlName = await _accountGLRepository.GetName(result.Data.GLId, companyId);


        return result;
    }

    public async Task<MyResultStatus> Insert(AccountSGLModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGL_InsUpd]";
            conn.Open();

            MyClaim.Init(_accessor);
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Ins",
                model.Id,
                model.GLId,
                model.AccountCategoryId,
                model.Name,
                model.AccountDetailRequired,
                model.IsActive,
                model.CompanyId,
                Ids = JsonConvert.SerializeObject(model.Ids),
                CurrencyIds = JsonConvert.SerializeObject(model.CurrencyIds)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> Update(AccountSGLModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountSGL_InsUpd]";
            conn.Open();

            MyClaim.Init(_accessor);

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Upd",
                model.Id,
                model.GLId,
                model.Name,
                model.AccountCategoryId,
                model.AccountDetailRequired,
                model.IsActive,
                model.CompanyId,
                Ids = JsonConvert.SerializeObject(model.Ids),
                CurrencyIds = JsonConvert.SerializeObject(model.CurrencyIds)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<int> GetMaxId(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_MaxId";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int glId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    Filter = $"GLId={glId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetActiveDropDown(int glId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    Filter = $"GLId={glId} AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<short> GetGLId(int glId, int Companyid)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    ColumnName = "GLId",
                    Filter = $"Id={glId} AND CompanyId={Companyid}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetName(int id, int glId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId} AND GLId={glId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetAccountDetailRequired(int id, int glId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    ColumnName = "AccountDetailRequired",
                    Filter = $"Id={id} AND GLId={glId} AND CompanyId={companyId} "
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<ID>> GetNoSeriesIds(int accountGLId, int accountSGLId, int companyId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);

            var sQuery = "[pb].Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryAsync<ID>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGLNoSeries",
                    IdColumnName = "",
                    ColumnNameList = "NoSeriesId AS Id",
                    IdList = "",
                    Filter = $"AccountGLId={accountGLId} AND AccountSGLId={accountSGLId}  AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<List<ID>> GetCurrencyIds(int accountGLId, int accountSGLId, int companyId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);

            var sQuery = "[pb].Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryAsync<ID>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGLCurrency",
                    IdColumnName = "",
                    ColumnNameList = "CurrencyId AS Id",
                    IdList = "",
                    Filter = $"AccountGLId={accountGLId} AND AccountSGLId={accountSGLId}  AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<AccountSGLSetting> GetSetting(int accountGLId, int accountSGLId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            MyClaim.Init(_accessor);

            var result = await conn.QueryFirstOrDefaultAsync<AccountSGLSetting>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "ISNULL(AccountDetailRequired,0) AccountDetailRequired",
                    IdList = "",
                    Filter = $"GLId={accountGLId} AND Id={accountSGLId} AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAccountDetailList(Get_AccountSGL model, int companyId)
    {
        var tb_Name = "";
        var columnName = "Id,FullName As Name";
        switch (model.NoSeriesId)
        {
            case 102:
                tb_Name = "pu.Vendor";
                break;
            case 103:
                tb_Name = "sm.Customer";
                break;
            case 104:
                tb_Name = "hr.Employee";
                break;
            default:
                tb_Name = "fm.AccountDetail";
                columnName = "Id,Name";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = tb_Name,
                    ColumnName = columnName,
                    Filter = $"CompanyId={companyId} AND IsActive=1 AND Id={model.Id}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<byte> CheckExistAccountSGL(int id, int glId, int companyId, byte isActive)
    {
        var filter = $"Id={id} AND GLId={glId} AND CompanyId={companyId}";


        if (isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AccountSGLGetRecord>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "Id,IsActive",
                    IdList = "",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            if (result == null || result.Id == 0)
                return 3;

            return result.IsActive ? Convert.ToByte(1) : Convert.ToByte(2);
        }
    }

    public async Task<Tuple<int, int>> GetMinMax(int companyId)
    {
        var filter = $"CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);
            var result = await conn.QuerySingleOrDefaultAsync<Tuple<int, int>>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList = "MIN(Id) MinAccountSGLId,Max(Id) MaxAccountSGLId",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<AccountSGLSearchDropDown>> GetAllUserAccountSGLs(int? accountGLId, int? accountSGLId,
        string accountSGLName, int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var parameters = new DynamicParameters();
            parameters.Add("PageNo");
            parameters.Add("PageRowsCount");
            parameters.Add("AccountGLId", accountGLId);
            parameters.Add("AccountSGLId", accountSGLId);
            parameters.Add("AccountSGLName", accountSGLName);
            parameters.Add("UserId", userId);
            parameters.Add("CompanyId", companyId);

            var sQuery = "[fm].[Spc_AccountSGL_DropDown_ByUserId]";
            conn.Open();
            var result =
                (await conn.QueryAsync<AccountSGLSearchDropDown>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultDataStatus<List<AccountSGLSearchDropDown>>> AccountSGLDropDownByUserId(
        GetPublicSearch model, int userId, int companyId)
    {
        int? accountGlId = null;
        int? accountSGlId = null;
        string accountSGlName = null;

        if (model.Parameters.Count() > 0)
        {
            if (model.Parameters.Any(x => x.Name == "id"))
            {
                var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
                if (id != "")
                    accountSGlId = Convert.ToInt32(id);
            }

            if (model.Parameters.Any(x => x.Name == "accountGLId"))
                if (model.Parameters.Where(x => x.Name == "accountGLId").Select(x => x.Value).FirstOrDefault() != "")
                    accountGlId = Convert.ToInt32(model.Parameters.Where(x => x.Name == "accountGLId")
                        .Select(x => x.Value).FirstOrDefault());

            if (model.Parameters.Any(x => x.Name == "name"))
                if (model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault() != "")
                    accountSGlName = model.Parameters.Where(x => x.Name == "name").Select(x => x.Value)
                        .FirstOrDefault();
        }
        else if (model.Items.Count() > 0)
        {
            if ((int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0) != 0)
                accountSGlId = int.Parse(model.Items[0].ToString());

            if (model.Items[1].ToString().Trim() != string.Empty)
                accountSGlName = model.Items[1].ToString();

            if ((int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0) != 0)
                accountGlId = int.Parse(model.Items[2].ToString());
        }

        var result = new MyResultDataStatus<List<AccountSGLSearchDropDown>>();
        result.Data = new List<AccountSGLSearchDropDown>();

        result.Data = await GetAllUserAccountSGLs(accountGlId, accountSGlId, accountSGlName, userId, companyId);

        result.Successfull = true;
        return result;
    }

    public async Task<List<AccountSGLSearchDropDown>> AccountSGLAccount_Dropdown(string filter, int? pageNo,
        int? pageRowsCount)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable_Paging]";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<AccountSGLSearchDropDown>(sQuery,
                new
                {
                    PageNo = pageNo,
                    pageRowsCount,
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGL",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "Id,Name,GLId AccountGLId,(SELECT Name FROM fm.AccountGL WHERE Id=GLId) AccountGLName,AccountDetailRequired,IsActive",
                    IdList = "",
                    Filter = filter,
                    OrderBy = "Id ASC"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.Distinct().ToList();
        }
    }

    public async Task<int> GetLastAccountSGLId(int accountGLId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "fm.AccountSGL",
                    ColumnName = "MAX(Id)",
                    Filter = $"GLId={accountGLId} AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result += 1;
        }
    }

    public async Task<MyResultQuery> DeleteSGL(int id, int companyId, int glId)
    {
        var result = new MyResultQuery();
        result.ValidationErrors = new List<string>();
        var validationDelete = await DeleteValidationSgl(id, glId, companyId);
        if (validationDelete.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validationDelete;
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_AccountSGL_Delete]";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
                {
                    AccountGLId = glId,
                    AccountSGLId = id,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
                conn.Close();
            }

            result.Successfull = result.Status == 100;
        }

        return result;
    }

    public async Task<List<string>> DeleteValidationSgl(int id, int glId, int companyId)
    {
        var result = new List<string>();
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_AccountSGL_CheckRelation]";
            conn.Open();
            result = (await conn.QueryAsync<string>(sQuery,
                new { AccountGLId = glId, AccountSGLId = id, CompanyId = companyId },
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchAccountSGL(
       GetPublicSearch model)
    {
        var filter = $"CompanyId={UserClaims.GetCompanyId()}";

        if (!model.Filter.IsNullOrEmptyOrWhiteSpace())
            filter += $" {model.Filter}";

        if ((int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0) != 0)
            filter +=
                $" AND Id={(int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0)}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Name LIKE N'%{model.Items[1]}%'";

        if ((int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0) != 0)
            filter +=
                $" AND GLId={(int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0)}";

        MyClaim.Init(_accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = UserClaims.GetCompanyId(),
            TableName = "fm.AccountSGL",
            IdColumnName = "Id",
            TitleColumnName = "Name",
            Filter = filter,
            OrderBy = "GLId ASC,Id ASC"
        };

        var result = await _publicRepository.Search(searchModel);
        return result;
    }

    public async Task<MyResultDataStatus<List<AccountSGLSearchDropDown>>> AccountGLAccountCategory_Dropdown(
       GetPublicSearch model)
    {
        var result = new MyResultDataStatus<List<AccountSGLSearchDropDown>>();
        result.Data = new List<AccountSGLSearchDropDown>();

        var filter = $"CompanyId={UserClaims.GetCompanyId()}";

        if (!model.Filter.IsNullOrEmptyOrWhiteSpace())
            filter += $" {model.Filter}";

        if (model.Parameters.Any(x => x.Name == "id"))
        {
            var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
            if (id != "")
                filter += $" AND Id={id}";
        }

        if (model.Parameters.Any(x => x.Name == "name"))
            if (model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault() != "")
                filter +=
                    $" AND Name LIKE N'%{model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault()}%'";

        if (model.Parameters.Any(x => x.Name == "accountGLId") && model.Parameters.Any(x => x.Name == "toAccountGLId"))
            filter +=
                $" AND GLId BETWEEN {model.Parameters.Where(x => x.Name == "accountGLId").Select(x => x.Value).FirstOrDefault()} AND {model.Parameters.Where(x => x.Name == "toAccountGLId").Select(x => x.Value).FirstOrDefault()}";
        else if (model.Parameters.Any(x => x.Name == "accountGLId"))
            filter +=
                $" AND GLId={model.Parameters.Where(x => x.Name == "accountGLId").Select(x => x.Value).FirstOrDefault()}";

        result.Data = await AccountSGLAccount_Dropdown(filter, model.PageNo, model.PageRowsCount);

        return result;
    }
}