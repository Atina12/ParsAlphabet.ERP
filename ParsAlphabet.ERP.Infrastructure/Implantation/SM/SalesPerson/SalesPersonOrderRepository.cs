using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPerson;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SalesPerson;

public class SalesPersonOrderRepository : ISalesPersonOrderRepository
{
    private readonly IConfiguration _config;

    public SalesPersonOrderRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new() { Id = "stageId", Title = "شناسه سفارش", IsDtParameter = true, Width = 5 },
                new() { Id = "stageName", Title = "نوع سفارش", IsDtParameter = true, Width = 8 },
                new()
                {
                    Id = "branchName", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "currencyId", Title = "شناسه پول", Type = (int)SqlDbType.TinyInt, Size = 50,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "currencyName", Title = "واحد پول", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "userFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new() { Id = "returnReasonName", Title = "دلیل برگشت", IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 8
                },
                new() { Id = "createDateTimePersian", Title = "تاریخ ثبت", IsDtParameter = true, Width = 10 },
                new() { Id = "status", Title = "وضعیت", IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "officialInvoice", Title = "صورتحساب رسمی", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "editOrder", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "OrderDetail", Title = "ثبت سفارش", ClassName = "", IconName = "fa fa-list color-green" }
            }
        };

        return list;
    }

    public GetColumnsViewModel AllocationColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "partnerTypeName", Title = "شخصیت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 5
                },
                new()
                {
                    Id = "genderName", Title = "جنسیت", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "fullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
    {
        model.PageNo = 0;
        model.PageRowsCount = 0;

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
                StageName = p.StageId + " - " + p.StageName,
                BranchName = p.BranchId + " - " + p.BranchName,
                CurrencyName = p.CurrencyId + " - " + p.CurrencyName,
                p.UserFullName,
                p.ReturnReasonName,
                p.OrderDatePersian,
                p.CreateDateTimePersian,
                p.Status,
                OfficialInvoice = p.OfficialInvoice ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<SalesPersonOrderGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<SalesPersonOrderGetPage>>
        {
            Data = new List<SalesPersonOrderGetPage>()
        };

        var p_id = 0;
        string p_branchName = "",
            p_currencyName = "",
            p_userFullName = "",
            p_orderDatePersian = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "branchName":
                p_branchName = model.FieldValue;
                break;
            case "userFullName":
                p_userFullName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("BranchName", p_branchName);
        parameters.Add("StageId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("CurrencyName", p_currencyName);
        parameters.Add("UserFullName", p_userFullName);
        parameters.Add("OrderDatePersian", p_orderDatePersian);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_PersonOrder_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SalesPersonOrderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        var totalRecord = parameters.Get<int>("TotalRecord");

        if (result.Data.Count != 0 && model.PageRowsCount != 0)
        {
            result.CurrentPage = model.PageNo;
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;
            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Count - 1;
        }

        return result;
    }

    public async Task<MyResultPage<SalesPersonOrderGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<SalesPersonOrderGetRecord>
        {
            Data = new SalesPersonOrderGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<SalesPersonOrderGetRecord>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(SalesPersonOrderModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_PersonOrder_InsUpd";
            conn.Open();
            model.Note = "";
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.Id,
                model.StageId,
                model.BranchId,
                model.CurrencyId,
                model.OrderDate,
                model.ReturnReasonId,
                model.CreateDateTime,
                model.UserId,
                model.OfficialInvoice,
                Status = 1, // Default value is open
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);

            result.Successfull = result.Status == 100;
        }

        return result;
    }

    public async Task<MyResultStatus> Update(SalesPersonOrderModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_PersonOrder_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.OrderDate,
                model.ReturnReasonId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> UpdateInLine(SalesPersonOrderModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_PersonOrder_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.StageId,
                model.BranchId,
                model.PersonTypeId,
                model.PersonId,
                model.EmployeeId,
                model.OrderDate,
                model.ReturnReasonId,
                model.Note,
                model.Status,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultStatus> Delete(int keyvalue, int CompanyId)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "pu.PurchaseOrder",
                    Filter = $"Id={keyvalue}",
                    CompanyId
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
                    TableName = "pu.PurchaseOrder",
                    TitleColumnName = "FullName",
                    Filter = $"CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> GetFixedAssetClassId(GetSalesPersonOrder model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "pu.PurchaseOrder",
                    ColumnName = "OfficialInvoice",
                    Filter =
                        $"Id={model.Id} AND OrderTypeId={model.OrderTypeId} AND BranchId={model.BranchId} AND CompanyId={model.CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}