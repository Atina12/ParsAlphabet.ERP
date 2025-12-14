using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.LocCity;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCity;

public class LocCityRepository :
    BaseRepository<LocCityModel, int, string>,
    IBaseRepository<LocCityModel, int, string>
{
    public LocCityRepository(IConfiguration config)
        : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 6, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام شهر ", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "stateName", Title = "نام ولایت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 20
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
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
                p.StateName,
                p.Name
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }


    public async Task<MyResultPage<List<LocCityGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<LocCityGetPage>>();
        result.Data = new List<LocCityGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();


        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_LocCity_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<LocCityGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(short stateId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.LocCity",
                    Filter = $"StateId={stateId}",
                    OrderBy = "IsCapital DESC"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<short> GetStateId(short stateId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "gn.LocCity",
                    ColumnName = "StateId",
                    Filter = $"Id={stateId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}