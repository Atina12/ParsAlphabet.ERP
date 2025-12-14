using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrder;

public class SaleOrderRepository : ISaleOrderRepository
{
    private readonly ICompanyRepository _companyRepository;

    private readonly IConfiguration _config;
    private readonly CurrencyRepository _currencyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ISaleOrderLogRepository _saleOrderLogRepository;
    private readonly StageActionRepository _stageActionRepository;

    public SaleOrderRepository(IConfiguration config,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        FiscalYearRepository fiscalYearRepository,
        StageActionRepository stageActionRepository,
        ISaleOrderLogRepository saleOrderStepRepository
    )
    {
        _config = config;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageActionRepository = stageActionRepository;
        _saleOrderLogRepository = saleOrderStepRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(model.CompanyId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.RequestId,
                p.Branch,
                p.Stage,
                p.OrderDatePersian,
                p.OrderNo,
                p.TreasurySubject,
                p.NoSeries,
                p.AccountDetail,
                p.ReturnReason,
                p.CreateDateTimePersian,
                p.UserName,
                p.ActionName
            };
        return result;
    }

    public async Task<MyResultPage<List<SaleOrderGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<SaleOrderGetPage>>
        {
            Data = new List<SaleOrderGetPage>()
        };

        int? p_id = null;
        int? p_stageId = null;
        short? p_branchId = null;
        int? p_noSeriesId = null, p_treasurySubject = null;
        string p_userFullName = null, p_actionName = null;
        DateTime? p_fromOrderDatePersian = null, p_toOrderDatePersian = null;


        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "userName":
                p_userFullName = model.FieldValue;
                break;
            case "branch":
                p_branchId = Convert.ToInt16(model.FieldValue);
                break;
            case "orderDatePersian":
                p_fromOrderDatePersian = model.FieldValue.Split("     ")[1].ToMiladiDateTime();
                p_toOrderDatePersian = model.FieldValue.Split("     ")[0].ToMiladiDateTime();
                break;
            case "stageId":
                p_stageId = Convert.ToInt32(model.FieldValue);
                break;
            case "actionIdName":
                p_actionName = model.FieldValue;
                break;
            case "noSeriesId":
                p_noSeriesId = Convert.ToInt32(model.FieldValue);
                break;
            case "treasurySubject":
                p_treasurySubject = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("BranchId", p_branchId);
        parameters.Add("StageId", p_stageId);
        parameters.Add("NoSeriesId", p_noSeriesId);
        parameters.Add("UserFullName", p_userFullName);
        parameters.Add("ActionName", p_actionName);
        parameters.Add("FromOrderDatePersian", p_fromOrderDatePersian);
        parameters.Add("ToOrderDatePersian", p_toOrderDatePersian);
        parameters.Add("TreasurySubject", p_treasurySubject);
        parameters.Add("CompanyId", model.CompanyId);

        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
            parameters.Add("CreateUserId");
        else
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));

        result.Columns = GetColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrder_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SaleOrderGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<SaleOrderGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<SaleOrderGetRecord>
        {
            Data = new SaleOrderGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SaleOrder_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<SaleOrderGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(SaleOrderModel model)
    {
        var validationError = await Validate(model.OrderDate, model.CompanyId, OperationType.Insert);
        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var getPersonAction = new GetAction();
        getPersonAction.CompanyId = model.CompanyId;
        getPersonAction.StageId = model.StageId;
        getPersonAction.Priority = 1;
        //getPersonAction.WorkFlowId = model.WorkFlowId;
        var stageAction = await _stageActionRepository.GetAction(getPersonAction);
        model.ActionId = stageAction.ActionId;


        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrder_Ins";
            conn.Open();
            var outPut = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.Id,
                model.StageId,
                model.BranchId,
                model.PersonGroupTypeId,
                model.OrderDate,
                model.TreasurySubjectId,
                model.ReturnReasonId,
                model.Note,
                CreateUserId = model.UserId,
                model.CreateDateTime,
                model.CompanyId,
                model.ActionId,
                model.AccountGLId,
                model.AccountSGLId,
                NoSeriesId = model.NoSeriesId == 0 ? null : model.NoSeriesId,
                AccountDetailId = model.AccountDetailId == 0 ? null : model.AccountDetailId,
                model.IsOrderQuantity,
                model.InOut,
                DocumentTypeId = model.DocumentTypeId == 0 ? null : model.DocumentTypeId,
                model.RequestId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0 ? true : false;
            result.Id = outPut;

            if (result.Successfull)
            {
                var updateLogModel = new UpdateAction
                {
                    RequestActionId = model.ActionId,
                    IdentityId = int.Parse(result.Id.ToString()),
                    StageId = model.StageId,
                    CompanyId = model.CompanyId,
                    UserId = model.UserId
                };
                //await _saleOrderLogRepository.UpdateSaleOrderLog(updateLogModel, OperationType.Insert);
            }
        }

        return result;
    }

    public async Task<MyResultStatus> Update(SaleOrderModel model)

    {
        var validationError = await Validate(model.OrderDate, model.CompanyId, OperationType.Insert);
        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrder_Upd";
            conn.Open();
            var outPut = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.Id,
                model.PersonGroupTypeId,
                model.OrderDate,
                model.TreasurySubjectId,
                model.ReturnReasonId,
                model.Note,
                CreateUserId = model.UserId,
                model.CreateDateTime,
                model.CompanyId,
                model.AccountGLId,
                model.AccountSGLId,
                NoSeriesId = model.NoSeriesId == 0 ? null : model.NoSeriesId,
                AccountDetailId = model.AccountDetailId == 0 ? null : model.AccountDetailId,
                model.IsOrderQuantity,
                model.InOut,
                model.RequestId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Id = model.Id;
        }

        return result;
    }

    public async Task<MyResultStatus> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultStatus();
        var personOrder = GetSaleOrderInfo(keyvalue, companyId).Result;
        var validationError =
            await _saleOrderLogRepository.ValidateDeleteStep(personOrder, companyId, OperationType.Delete);

        if (validationError.Count > 0)
        {
            result.Successfull = false;
            result.ValidationErrors = validationError;
            return result;
        }

        using (var conn = Connection)
        {
            // string sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            //result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
            //    sQuery, new
            //    {
            //        TableName = "sm.SaleOrderLine",
            //        Filter = $"HeaderId={keyvalue}"
            //    }, commandType: CommandType.StoredProcedure);
            //if (result.Status == 100)
            {
                using (var conn1 = Connection)
                {
                    var sQuery1 = "pb.Spc_Tables_DelRecordWithFilter";
                    conn1.Open();
                    result = await conn1.QueryFirstOrDefaultAsync<MyResultStatus>(
                        sQuery1, new
                        {
                            TableName = "sm.SaleOrder",
                            Filter = $"Id={keyvalue}"
                        }, commandType: CommandType.StoredProcedure);
                }
            }
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام شد" };
        return result;
    }

    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "sm.SaleOrder",
                ColumnName = "Id",
                Filter =
                    $"Id={id} AND CompanyId={companyId} AND StageId IN(SELECT s.Id FROM wf.Stage s WHERE s.WorkflowCategoryId=3 AND s.StageClassId=1)"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public GetColumnsViewModel GetColumns(int companyId)
    {
        var defaultCurrencyId = _companyRepository.GetDefaultCurrency(companyId).Result;
        var defaultCurrencyName = _currencyRepository.GetName(defaultCurrencyId).Result;

        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "isDataEntry", FieldValue = "1", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },

                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },

                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown"
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "stageId", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 50,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/3/1/2/1"
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 13, FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "orderNo", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15, FilterType = "select2",
                    FilterTypeApi = "/api/FM/TreasurySubjectApi/gettreasurysubjectbystageid/0/3/1", InputType = "number"
                },
                new()
                {
                    Id = "noSeriesId", Title = "گروه تفصیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 50,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/NoSeriesLineApi/getdropdown_noseriesbyworkflowId/3"
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "returnReason", Title = "دلیل برگشت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "userName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displaySimple", Title = $"نمایش ({defaultCurrencyName})", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new() { Name = "displayAdvance", Title = "نمایش (ارزی)", ClassName = "", IconName = "far fa-file-alt" },
                new()
                {
                    Name = "editSalesOrders", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "printFromPlateHeaderLine", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print"
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "OrderDetailSimple", Title = $"تخصیص متغیر ({defaultCurrencyName})", ClassName = "",
                    IconName = "fa fa-list color-green"
                },
                new()
                {
                    Name = "OrderDetailAdvance", Title = "تخصیص متغیر (ارزی)", ClassName = "",
                    IconName = "fa fa-list color-green"
                },
                new()
                {
                    Name = "showStepLogsSaleOrder", Title = "گام ها", ClassName = "",
                    IconName = "fas fa-history color-green"
                }
            }
        };
        return list;
    }

    public async Task<List<string>> Validate(DateTime? OrderDate, int companyId, OperationType operationType)
    {
        var error = new List<string>();

        if (OrderDate == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(OrderDate, companyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }

    public async Task<SaleOrderViewModel> GetSaleOrderInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<SaleOrderViewModel>(sQuery, new
            {
                TableName = "sm.SaleOrder",
                ColumnName = "Id,StageId,ActionId,OrderDate",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}