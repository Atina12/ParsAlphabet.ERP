using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCounter;

public class AdmissionCounterRepository : BaseRepository<AdmissionCounterModel, int, string>,
    IAdmissionCounterRepository
{
    public AdmissionCounterRepository(IConfiguration config) : base(config)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.SmallInt, Width = 4, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "counterUser", Title = "کاربر ", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 12,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "branch", Title = "نام شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 10,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "cashier", Title = "نام صندوق", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "counterTypeName", Title = "ماهیت غرفه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 10,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 9,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, Width = 50, IsDtParameter = true }
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
                p.CounterUser,
                p.Branch,
                p.Cashier,
                p.CounterTypeName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<AdmissionCounterGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionCounterGetPage>>
        {
            Data = new List<AdmissionCounterGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("CounterUserFullName",
            model.Filters.Any(x => x.Name == "counterUser")
                ? model.Filters.FirstOrDefault(x => x.Name == "counterUser").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionCounter_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionCounterGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordById(short id, int companyId)
    {
        var result = new MyResultPage<AdmissionCounterGetRecord>
        {
            Data = new AdmissionCounterGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCounter_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<AdmissionCounterGetRecord>(sQuery, new
            {
                AdmissionCounterId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordByUserId(int id, int companyId)
    {
        var result = new MyResultPage<AdmissionCounterGetRecord>
        {
            Data = new AdmissionCounterGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<AdmissionCounterGetRecord>(sQuery, new
            {
                TableName = "mc.AdmissionCounter",
                Filter = $"CounterUserId='{id}' AND IsActive=1"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(AdmissionCounterModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionCounter_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.BranchId,
                model.CounterTypeId,
                model.IsActive,
                model.CashierId,
                model.CompanyId,
                model.CounterUserId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(AdmissionCounterModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionCounter_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.CounterUserId,
                model.CounterTypeId,
                model.IsActive,
                model.CompanyId,
                model.BranchId,
                model.CashierId
                //model.IsSms
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = await Delete(keyvalue, "mc", companyId);
        return result;
    }

    public async Task<bool> CheckExistCashier(MyDropDownViewModel model)
    {
        var result = 0;
        var filter = string.Empty;
        if (model.Id == 0)
            filter = $"CashierId={model.Name} AND [CompanyId]={model.CompanyId}";
        else
            filter = $"CashierId={model.Name} AND Id<>{model.Id} AND [CompanyId]={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "mc.AdmissionCounter",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result == 0;
    }

    public async Task<bool> CheckExistCounterUser(MyDropDownViewModel model)
    {
        var result = 0;
        var filter = string.Empty;
        if (model.Id == 0)
            filter = $"CounterUserId={model.Name} AND [CompanyId]={model.CompanyId}";
        else
            filter = $"CounterUserId={model.Name} AND Id<>{model.Id} AND [CompanyId]={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "mc.AdmissionCounter",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result == 0;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                TableName = "mc.AdmissionCounter",
                Filter = $"CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<IEnumerable<AdmissionCounterPosDropDown>> AdmissionCounterPosGetDropDown(int userId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCounterPos_GetList]";
            conn.Open();
            var result = await conn.QueryAsync<AdmissionCounterPosDropDown>(sQuery, new
            {
                UserId = userId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<short> GetBranchIdByUserId(int id, int companyId)
    {
        short result;
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "mc.AdmissionCounter",
                ColumnName = "BranchId",
                Filter = $"CounterUserId={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }
}