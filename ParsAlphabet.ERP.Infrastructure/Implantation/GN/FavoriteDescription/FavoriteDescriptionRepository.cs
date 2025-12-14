using System.Collections;
using System.Data;
using CIS.Repositories.Interfaces;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.FavoriteDescription;

public class FavoriteDescriptionRepository(IConfiguration config, IPublicRepository publicRepository, IHttpContextAccessor accessor) : IFavoriteDescriptionRepository
{
    public IDbConnection Connection => new SqlConnection(config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns(string workFlowCategoryId)
    {
        var filterTypeApi = "";

        switch (workFlowCategoryId)
        {
            case "1":
                filterTypeApi = "/api/WF/StageApi/getdropdownbyworkflowcategoryid/1/0";
                break;
            case "2,6":
                filterTypeApi = "/api/WF/StageApi/getdropdownbyworkflowcategoryid/2,6/0";
                break;

            case "11":
                filterTypeApi = "/api/WF/StageApi/getdropdownbyworkflowcategoryid/11/0";
                break;
        }

        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 5,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 120, Width = 18,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = filterTypeApi
                },
                new()
                {
                    Id = "description", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 120, Width = 40,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<FavoriteDescriptionGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FavoriteDescriptionGetPage>>();
        result.Data = new List<FavoriteDescriptionGetPage>();

        var workFlowCategoryId = model.Form_KeyValue[0]?.ToString();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("Description",
            model.Filters.Any(x => x.Name == "description")
                ? model.Filters.FirstOrDefault(x => x.Name == "description").Value
                : null);

        parameters.Add("WorkflowCategoryId", workFlowCategoryId);


        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns(workFlowCategoryId);

        using (var conn = Connection)
        {
            var sQuery = "GN.Spc_FavoriteDescription_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FavoriteDescriptionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<FavoriteDescriptionGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<FavoriteDescriptionGetRecord>
        {
            Data = new FavoriteDescriptionGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<FavoriteDescriptionGetRecord>(sQuery, new
            {
                TableName = "GN.FavoriteDescription",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(FavoriteDescriptionModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[GN].[Spc_FavoriteDescription_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                Description = model.Description.ConvertArabicAlphabet(),
                model.CompanyId,
                model.StageId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(FavoriteDescriptionModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[GN].[Spc_FavoriteDescription_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.Description,
                model.CompanyId,
                model.StageId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "GN.FavoriteDescription",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(model.Form_KeyValue[0]?.ToString()).DataColumns
                    .Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Stage,
                p.Description,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByUserId(int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "GN.FavoriteDescription",
                    IdColumnName = "id",
                    TitleColumnName = "Description",
                    Filter = $"UserId={userId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescription(
      GetPublicSearch model)
    {
        var filter = $"CompanyId={UserClaims.GetCompanyId()} AND IsActive=1";

        //if (int.Parse(model.Items[0].ToString()) != 0)
        //    filter += $" AND Id={int.Parse(model.Items[0].ToString())}";

        //if (model.Items[1].ToString().Trim() != string.Empty)
        //    filter += $" AND Description LIKE N'%{model.Items[1]}%'";
        if (model.Form_KeyValue != null && model.Form_KeyValue.Length > 0)
            filter += $" AND StageId = {Convert.ToInt32(model.Form_KeyValue[0])}";

        if (model.Parameters.Any(x => x.Name == "id"))
        {
            var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
            if (id != "")
                filter += $" AND Id={id}";
        }

        if (model.Parameters.Any(x => x.Name == "name"))
            if (model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault() != "")
                filter +=
                    $" AND Description LIKE N'%{model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault()}%'";

        MyClaim.Init(accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = UserClaims.GetCompanyId(),
            TableName = "gn.FavoriteDescription",
            IdColumnName = "Id",
            TitleColumnName = "Description",
            Filter = filter
        };

        var result = await publicRepository.Search(searchModel);
        return result;
    }

    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescriptionOld(
       GetPublicSearch model)
    {
        var filter = $"CompanyId={UserClaims.GetCompanyId()} AND IsActive=1";

        if (int.Parse(model.Items[0].ToString()) != 0)
            filter += $" AND Id={int.Parse(model.Items[0].ToString())}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Description LIKE N'%{model.Items[1]}%'";

        MyClaim.Init(accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = UserClaims.GetCompanyId(),
            TableName = "gn.FavoriteDescription",
            IdColumnName = "Id",
            TitleColumnName = "Description",
            Filter = filter
        };

        var result = await publicRepository.Search(searchModel);
        return result;
    }
}