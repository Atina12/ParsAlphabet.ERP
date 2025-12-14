using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Bundle;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Bundle;

public class BundleRepository :
    BaseRepository<BundleModel, int, string>,
    IBaseRepository<BundleModel, int, string>
{
    public BundleRepository(IConfiguration config)
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
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "cashier", Title = "کیوسک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "kioskIpAddress", Title = "آی پی کیوسک", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "typeName", Title = "نوع", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "1", Name = "آقایان" },
                        new() { Id = "2", Name = "بانوان" },
                        new() { Id = "3", Name = "عمومی" }
                    },
                    Width = 10
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 10,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
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
                p.Branch,
                p.Cashier,
                p.KioskIpAddress,
                p.TypeName,
                p.CreateUser,
                p.CreateDateTimePersian,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<BundelGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<BundelGetPage>>
        {
            Data = new List<BundelGetPage>()
        };


        var parameters = new DynamicParameters();


        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("Type",
            model.Filters.Any(x => x.Name == "type")
                ? model.Filters.FirstOrDefault(x => x.Name == "type").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Bundle_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<BundelGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }


    public async Task<MyResultPage<BundelGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<BundelGetRecord>
        {
            Data = new BundelGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Bundle_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<BundelGetRecord>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }


    public async Task<MyResultStatus> Insert(BundleViewModel model)
    {
        var result = new MyResultStatus();


        var validateResult = await ValidateBudle(model.CashierId, OperationType.Insert);

        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Bundle_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.Name,
                model.CashierId,
                model.BranchId,
                model.Type,
                model.CreateUserId,
                model.CreateDateTime,
                model.IsActive,
                BundleLineJSON = JsonConvert.SerializeObject(model.BundleLineList)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }


    public async Task<string> ValidateBudle(int cashierId, OperationType operationType)
    {
        var error = "";
        if (cashierId <= 0)
        {
            error = "صندوق را انتخاب کنید";
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert)
            {
                var existItem = await ExistBundle(cashierId);
                if (!existItem) error = "کیوسک انتخابی قبلا ثبت شده است";
            }
        });
        return error;
    }


    public async Task<bool> ExistBundle(int CashierId)
    {
        var filter = "";

        if (CashierId > 0)
        {
            filter = $"CashierId='{CashierId}' ";


            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_GetItem";
                conn.Open();
                var result = await conn.ExecuteScalarAsync<string>(sQuery,
                    new
                    {
                        TableName = "mc.bundle",
                        ColumnName = "Id",
                        Filter = filter
                    }, commandType: CommandType.StoredProcedure);

                return string.IsNullOrEmpty(result);
            }
        }

        return true;
    }

    public virtual async Task<MyResultStatus> Delete(int id)
    {
        var result = new MyResultStatus();

        {
            using (var conn = Connection)
            {
                var sQuery = "[mc].[Spc_Bundle_Delete]";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                    sQuery, new
                    {
                        Id = id
                    }, commandType: CommandType.StoredProcedure);
            }
        }
        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام نشد" };

        return result;
    }
}