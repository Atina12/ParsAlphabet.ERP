using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountDetail;
using ParsAlphabet.ERP.Application.Dtos.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;

public class AccountDetailRepository :
    BaseRepository<AccountDetailModel, int, string>,
    IBaseRepository<AccountDetailModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public AccountDetailRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 10, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "noSeriesName", Title = "گروه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "partnerTypeName", Title = "شخصیت", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "active", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.NoSeriesName,
                p.PartnerTypeName,
                p.NationalCode,
                Active = p.Active ? "فعال" : "غیرفعال"
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }


    public async Task<MyResultPage<List<AccountDetailGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AccountDetailGetPage>>();
        result.Data = new List<AccountDetailGetPage>();

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
        parameters.Add("NationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("NoSeriesName",
            model.Filters.Any(x => x.Name == "noSeriesName")
                ? model.Filters.FirstOrDefault(x => x.Name == "noSeriesName").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        var sQuery = "fm.Spc_AccountDetail_GetPage";
        using (var conn = Connection)
        {
            conn.Open();
            result.Data =
                (await Connection.QueryAsync<AccountDetailGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<int>> GetAll(bool? isActive = null)
    {
        var filter = "";

        if (isActive != null)
            filter = isActive.Value ? "IsActive=1" : "IsActive=0";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryAsync<int>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountDetail",
                    IdColumnName = "Id",
                    ColumnNameList = "Id",
                    IdList = "",
                    OrderBy = "",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

    public async Task<MyResultStatus> Save(AccountDetailModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountDetail_InsUpd]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Ins",
                model.Id,
                model.NoSeriesId,
                model.Name,
                model.CreateDateTime,
                model.CompanyId,
                model.DataJson,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<byte> CheckExistAccountDetail(int id, int companyId, byte? isActive)
    {
        var filter = $"Id={id} AND CompanyId={companyId}";


        if (isActive != 2)
            filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AccountDetailSearch>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "fm.AccountDetail",
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

    public async Task<string> GetName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<string> GetAccountDetaisNameiesName(int id, short noSeriesId, int companyId)
    {
        var tb_Name = "";
        switch (noSeriesId)
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
                tb_Name = "wh.Warehouse";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = tb_Name,
                    ColumnName = "FullName",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAccountDetailNameWhitNoSeries(short noSeriesId, int companyId)
    {
        var tb_Name = "";
        switch (noSeriesId)
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
                tb_Name = "wh.Warehouse";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = tb_Name,
                    TitleColumnName = "FullName",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    //NoSeries
    public async Task<short> GetNoSeries(long id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "NoSeriesId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

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
                    TableName = "fm.AccountDetail",
                    IdColumnName = "Id",
                    ColumnNameList = "MIN(Id) MinAccountDetailId,Max(Id) MaxAccountDetailId",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultDataStatus<IEnumerable<AccountDetailSearch>>> SearchPlugin(PublicSearch model)
    {
        var result = new MyResultDataStatus<IEnumerable<AccountDetailSearch>>();
        result.Data = new List<AccountDetailSearch>();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable_Paging";
            conn.Open();
            result.Data = await conn.QueryAsync<AccountDetailSearch>(sQuery, new
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

    public async Task<MyResultDataStatus<IEnumerable<AccountDetailSearch>>> SearchPluginPagination(
        GetAccountDetailSearch model)
    {
        var result = new MyResultDataStatus<IEnumerable<AccountDetailSearch>>();
        result.Data = new List<AccountDetailSearch>();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountDetail_Search]";
            conn.Open();
            result.Data = await conn.QueryAsync<AccountDetailSearch>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.CompanyId,
                model.Id,
                model.Name,
                model.FromAccountGLId,
                model.ToAccountGLId,
                model.FromAccountSGLId,
                model.ToAccountSGLId,
                model.NoSeriesName,
                model.IsActive,
                model.IdNumber,
                model.AgentFullName,
                model.JobTitle,
                model.BrandName,
                model.NationalCode,
                model.PersonGroupName
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }


    public async Task<string> GetBrandNameByAccountDetailId(int AccountDetailId)
    {
        var BrandName = "";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            BrandName = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "JSON_VALUE(DataJson,'$.BrandName') BrandName ",
                    Filter = $"id={AccountDetailId}"
                }, commandType: CommandType.StoredProcedure);
        }

        return BrandName;
    }


    public async Task<List<MyDropDownViewModel>> GetAccountDetailByItem(short categoryId, short stageId,
        string postingGroupTypeLineIds, short branchId, int userId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountDetail_ByItem]";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                ItemCategoryId = categoryId,
                StageId = stageId,
                PostingGroupTypeLineIds = postingGroupTypeLineIds,
                BranchId = branchId,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);

            return result.AsList();
        }
    }
}