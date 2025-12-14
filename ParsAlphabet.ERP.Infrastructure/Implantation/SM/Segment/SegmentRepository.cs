using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.Segment;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.Segment;

public class SegmentRepository :
    BaseRepository<SegmentModel, int, string>,
    IBaseRepository<SegmentModel, int, string>
{
    public SegmentRepository(IConfiguration config) : base(config)
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
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = false
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 10, Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 19 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "segmentline", Title = "تخصیص متغیرها", ClassName = "",
                    IconName = "fa fa-list color-deep-blue"
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
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<SegmentGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<SegmentGetPage>>
        {
            Data = new List<SegmentGetPage>()
        };

        var parameters = new DynamicParameters();
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
            var sQuery = "[sm].[Spc_Segment_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SegmentGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<SegmentGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<SegmentGetRecord>
        {
            Data = new SegmentGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<SegmentGetRecord>(sQuery, new
            {
                TableName = "sm.Segment",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }


        return result;
    }

    public async Task<MyResultQuery> Insert(SegmentModel model)
    {
        model.CreateDateTime = DateTime.Now;

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_Segment_InsUpd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.Name,
                model.NameEng,
                model.CreateDateTime,
                model.Note,
                model.UserId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(SegmentModel model)
    {
        model.CreateDateTime = DateTime.Now;
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_Segment_InsUpd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.Name,
                model.NameEng,
                model.CreateDateTime,
                model.Note,
                model.UserId,
                model.IsActive,
                model.CompanyId
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
                TableName = "sm.Segment",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "fm.CostCenter",
                    Filter = $"IsActive = 1 AND CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> GetIsActive(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "fm.Segment",
                    ColumnName = "IsActive",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}