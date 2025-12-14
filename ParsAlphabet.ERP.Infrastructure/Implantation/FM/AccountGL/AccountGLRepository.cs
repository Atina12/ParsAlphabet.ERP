using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountGL;
using ParsAlphabet.ERP.Application.Dtos.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;

public class AccountGLRepository :
    BaseRepository<AccountGLModel, int, string>,
    IBaseRepository<AccountGLModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public AccountGLRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    Id = "id", Title = "کد کل", Type = (int)SqlDbType.TinyInt, Width = 8, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام کل", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 15,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "categoryName", Title = "گروه حساب", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 10,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "incomeBalanceTypeName", Title = "ترازنامه / سود و زیان", Type = (int)SqlDbType.NVarChar,
                    Size = 100, Width = 8, IsDtParameter = true
                },
                new()
                {
                    Id = "natureTypeName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 7,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 46 }
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
                p.CategoryName,
                p.IncomeBalanceTypeName,
                p.NatureTypeName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<AccountGLGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AccountGLGetPage>>();
        result.Data = new List<AccountGLGetPage>();

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
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_AccountGL_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AccountGLGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
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
                    TableName = "fm.AccountGL",
                    IdColumnName = "Id",
                    ColumnNameList = "Id",
                    IdList = "",
                    OrderBy = "",
                    Filter = "IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
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
                    TableName = "fm.AccountGL",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountGL",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> CheckExistAccountGL(int id, int companyId, byte? isActive)
    {
        var filter = $"Id={id} AND CompanyId={companyId}";


        if (isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AccountGLGetRecord>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "fm.AccountGL",
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

    public async Task<List<MyDropDownViewModel>> GetDropDownByAccountType(byte type, int companyId)
    {
        var filter = string.Empty;

        if (type == 1)
            filter = $"IncomeBalanceId=1 AND ag.CategoryId IN(1,2,3) AND CompanyId={companyId}";
        else if (type == 2)
            filter = $"IncomeBalanceId=2 AND ag.CategoryId IN(4,5,6) AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountGL",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultStatus> Save(AccountGLModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountGL_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                IsSecondLang = false,
                model.Opr,
                model.Id,
                model.Name,
                model.CategoryId,
                model.NatureId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    //public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    //{
    //    var validationResult = await DeleteValidation(keyvalue, companyId);

    //    if (validationResult.Count() > 0)
    //    {
    //        return new MyResultQuery()
    //        {
    //            Successfull = false,
    //            ValidationErrors = validationResult
    //        };
    //    }


    //    var result = new MyResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_DelRecord";
    //        conn.Open();
    //        result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
    //        {
    //            TableName = "fm.AccountGL",
    //            RecordId = keyvalue,
    //            CompanyId = companyId,
    //            Filter = $"CompanyId={companyId}"
    //        }, commandType: CommandType.StoredProcedure);
    //    }
    //    result.Successfull = result.Status == 100;
    //    return result;
    //}

    public async Task<MyResultPage<AccountGLGetRecord>> GetRecordById(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            var data = await conn.QueryFirstOrDefaultAsync<AccountGLGetRecord>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "fm.AccountGL",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            return data.ToMyResultPage();
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId)
    {
        var filter = $"CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountGL",
                    IdColumnName = "",
                    TitleColumnName = "Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetActiveDropDown(int companyId)
    {
        var filter = $"CompanyId={companyId} AND IsActive=1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountGL",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
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
                    TableName = "fm.AccountGL",
                    IdColumnName = "Id",
                    ColumnNameList = "MIN(Id) MinAccountGLId,Max(Id) MaxAccountGLId",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyDropDownViewModel> GetAccountCategoryName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountGL",
                    IdColumnName = "Id",
                    ColumnNameList =
                        $"CategoryId Id,(SELECT CASE WHEN {(MyClaim.IsSecondLang ? 1 : 0)}=0 THEN Name ELSE NameEng END FROM fm.AccountCategory WHERE Id=CategoryId) AS Name",
                    IdList = "",
                    Filter = $"Id={id} AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<int>> GetAllUserAccountGLs(int userId, int companyId)
    {
        var result = new List<int>();

        using (var conn = Connection)
        {
            var parameters = new DynamicParameters();
            parameters.Add("PageNo");
            parameters.Add("PageRowsCount");
            parameters.Add("AccountGLId");
            parameters.Add("AccountGLName");
            parameters.Add("UserId", userId);
            parameters.Add("CompanyId", companyId);

            var sQuery = "[fm].[Spc_AccountGL_DropDown_ByUserId]";
            conn.Open();
            result = (await conn.QueryAsync<AccountGLCategoryDropDown>(sQuery, parameters,
                commandType: CommandType.StoredProcedure)).Select(a => a.Id).ToList();
        }

        return result;
    }

    public async Task<MyResultDataStatus<List<AccountGLCategoryDropDown>>> AccountGLDropDownByUserId(
        GetPublicSearch model, int userId, int companyId)
    {
        int? accountGlId = null;
        var accountGlName = string.Empty;
        if (model.Parameters.Count() > 0)
        {
            if (model.Parameters.Any(x => x.Name == "id"))
            {
                var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
                if (id != "")
                    accountGlId = Convert.ToInt32(id);
            }

            if (model.Parameters.Any(x => x.Name == "name"))
                if (model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault() != "")
                    accountGlName = model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault();
        }
        else if (model.Items.Count() > 0)
        {
            if (int.Parse(model.Items[0].ToString()) != 0)
                accountGlId = int.Parse(model.Items[0].ToString());

            if (model.Items[1].ToString().Trim() != string.Empty)
                accountGlName = model.Items[1].ToString();
        }

        var result = new MyResultDataStatus<List<AccountGLCategoryDropDown>>();
        result.Data = new List<AccountGLCategoryDropDown>();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountGL_DropDown_ByUserId]";
            conn.Open();
            result.Data = (await conn.QueryAsync<AccountGLCategoryDropDown>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                AccountGLId = accountGlId,
                AccountGLName = accountGlName != "" ? accountGlName : null,
                UserId = userId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<AccountGLCategoryDropDown>> AccountGLAccountCategory_Dropdown(string filter, int? pageNo,
        int? pageRowsCount)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable_Paging]";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<AccountGLCategoryDropDown>(sQuery,
                new
                {
                    PageNo = pageNo,
                    pageRowsCount,
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountGL",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "Id,Name,(select Name from fm.AccountCategory WHERE Id=CategoryId) AccountCategoryName",
                    IdList = "",
                    Filter = filter,
                    OrderBy = "Id ASC"
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<List<AccountGLCategoryDropDown>> AccountGLUser_Dropdown(string filter, int? pageNo,
        int? pageRowsCount)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable_Paging]";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<AccountGLCategoryDropDown>(sQuery,
                new
                {
                    PageNo = pageNo,
                    pageRowsCount,
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountSGLUser",
                    IdColumnName = "AccountGLId",
                    ColumnNameList =
                        "AccountGLId,Name,(select Name from fm.AccountCategory WHERE Id=CategoryId) AccountCategoryName",
                    IdList = "",
                    Filter = filter,
                    OrderBy = "Id ASC"
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<List<string>> DeleteValidation(int id, int companyId)
    {
        var validationErros = new List<string>();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Tables_Check_Delete_Relation]";
            conn.Open();

            var result = await conn.QueryAsync<MyResultStatus>(sQuery, new
            {
                TableName = "fm.AccountGL",
                Value = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            if (result.Count() > 0)
            {
                var list = result.Select(x => x.StatusMessage).ToList();
                return list;
            }

            return validationErros;
        }
    }

    public async Task<MyResultDataStatus<IEnumerable<AccountGLSearchViewModel>>> Search(PublicSearch model)
    {
        var result = new MyResultDataStatus<IEnumerable<AccountGLSearchViewModel>>();
        result.Data = new List<AccountGLSearchViewModel>();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable_Paging";
            conn.Open();
            result.Data = await conn.QueryAsync<AccountGLSearchViewModel>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.IsSecondLang,
                model.TableName,
                model.IdColumnName,
                model.ColumnNameList,
                model.IdList,
                model.Filter,
                model.OrderBy
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }
}