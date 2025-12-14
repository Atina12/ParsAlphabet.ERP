using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionClose;

public class AdmissionCloseRepository : IAdmissionCloseRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountDetailRepository _AccountDetailRepository;
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly INewTreasuryRepository _newTreasuryRepository;

    public AdmissionCloseRepository(IConfiguration config, IHttpContextAccessor accessor,
        FiscalYearRepository fiscalYearRepository, INewTreasuryRepository newTreasuryRepository,
        AccountDetailRepository AccountDetailRepository, ILoginRepository loginRepository)
    {
        _config = config;
        _accessor = accessor;
        _fiscalYearRepository = fiscalYearRepository;
        _newTreasuryRepository = newTreasuryRepository;
        _AccountDetailRepository = AccountDetailRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "status", FieldValue = "1", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "treasuryId", Title = "شناسه خزانه", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new() { Id = "branchId", IsPrimary = true },
                new()
                {
                    Id = "workDayDatePersian", Title = "تاریخ روز کاری", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "closeDatePersian", Title = "تاریخ بستن", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "announcementAmount", Title = "جمع اظهاری", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    FilterType = "money", IsCommaSep = true, Width = 10
                },
                new()
                {
                    Id = "realAmount", Title = "جمع واقعی", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    FilterType = "money", IsCommaSep = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },

                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false"
                },

                new()
                {
                    Id = "statusName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "1", Name = "باز" },
                        new() { Id = "2", Name = "بسته" }
                    },
                    Width = 7
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 24 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new() { Name = "print", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print" },
                new() { Name = "excell", Title = "اکسل", ClassName = "btn blue_1", IconName = "fa fa-file-excel" },
                new() { Name = "editAdm", Title = "تخصیص متغیرها", ClassName = "", IconName = "fa fa-edit color-green" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var getPage = await GetPage(model, userId);
        result.Rows = from r in getPage.Data
            select new
            {
                r.Id,
                r.TreasuryId,
                r.Branch,
                r.WorkDayDatePersian,
                r.CloseDatePersian,
                r.AnnouncementAmount,
                r.RealAmount,
                r.CreateDateTimePersian,
                r.CreateUser,
                r.StatusName
            };
        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> DifferenceCsv(GetAdmissionCloseWorkday model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = "کاربر ثبت کننده,شماره درخواست,نوع درخواست,تاریخ,خالص قابل دریافت"
        };

        var getPage = await AdmissionCashDifference(model);
        result.Rows = from r in getPage
            select new
            {
                r.UserFullName,
                r.RequestId,
                AdmissionTypeName = r.AdmissionTypeId != 0 ? r.AdmissionTypeId + " - " + r.AdmissionTypeName : "",
                r.CreateDateTimePersian,
                r.NetAmount
            };
        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> AdmissionCloseCSV(int id)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = "شناسه,نام صندوقدار,اظهاری/واقعی ,نوع وجه,حساب باز,تفصیل,وجه,وضعیت"
        };

        IEnumerable<AdmissionCloseCSV> resultCSV = null;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_CSV]";
            conn.Open();
            resultCSV = await conn.QueryAsync<AdmissionCloseCSV>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Rows = from r in resultCSV
            select new
            {
                r.Id,
                r.UserName,
                r.DataType,
                r.FundTypeName,
                r.OpenAccTypeName,
                DetailAccountName = r.DetailAccountId != 0 ? r.DetailAccountId + " - " + r.DetailAccountName : "",
                r.Amount,
                r.StatusName
            };

        return result;
    }

    public async Task<MyResultPage<List<AdmissionCloseGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<AdmissionCloseGetPage>>
        {
            Data = new List<AdmissionCloseGetPage>()
        };

        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;

        var fromWorkDayDateMiladi = (DateTime?)null;
        var toWorkDayDateMiladi = (DateTime?)null;

        var fromCloseDateMiladi = (DateTime?)null;
        var toCloseDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "workDayDatePersian"))
        {
            fromWorkDayDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toWorkDayDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "closeDatePersian"))
        {
            fromCloseDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "closeDatePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toCloseDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "closeDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("TreasuryId",
            model.Filters.Any(x => x.Name == "treasuryId")
                ? model.Filters.FirstOrDefault(x => x.Name == "treasuryId").Value
                : null);

        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);

        parameters.Add("FromWorkDayDate", fromWorkDayDateMiladi);
        parameters.Add("ToWorkDayDate", toWorkDayDateMiladi);

        parameters.Add("FromCloseDate", fromCloseDateMiladi);
        parameters.Add("ToCloseDate", toCloseDateMiladi);

        parameters.Add("BranchName",
            model.Filters.Any(x => x.Name == "branchName")
                ? model.Filters.FirstOrDefault(x => x.Name == "branchName").Value
                : null);

        parameters.Add("Status",
            model.Filters.Any(x => x.Name == "statusName")
                ? model.Filters.FirstOrDefault(x => x.Name == "statusName").Value
                : null);


        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionCloseApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId",
                    model.Filters.Any(x => x.Name == "createUser")
                        ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                        : null);
        }
        else
        {
            if (checkAccessViewAll.Successfull)
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    parameters.Add("CreateUserId",
                        model.Filters.Any(x => x.Name == "createUser")
                            ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                            : null);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "createUser").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "createUser").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
        }


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionCloseGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultQuery> AdmissionCloseInsert(GetAdmissionCloseWorkday model)
    {
        var finalResult = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionClose_Ins";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new
                {
                    model.Opr,
                    model.BranchId,
                    model.WorkDayDate,
                    model.UserId,
                    model.CompanyId,
                    model.CreateDateTime
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            if (result.Status == 100)
            {
                finalResult.Id = result.Id;
                finalResult.Successfull = true;
                finalResult.StatusMessage = result.StatusMessage;
            }
            else
            {
                finalResult.Successfull = false;
                finalResult.StatusMessage = result.StatusMessage;
            }

            return finalResult;
        }
    }

    public async Task<DateTime> GetCloseDate(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(sQuery,
                new
                {
                    TableName = "mc.AdmissionClose",
                    ColumnName = "Cast(CreateDateTime AS DATE)",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<GetAdmissionClose> GetRecordById(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            MyClaim.Init(_accessor);
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<GetAdmissionClose>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "mc.AdmissionClose",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "CreateDateTime,CAST(WorkDayDate AS DATE) WorkDayDate,CAST(CloseDateTime AS DATE) CloseDateTime,BranchId,UserId,CompanyId",
                    IdList = "",
                    Filter = $"Id={id}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<AdmissionCloseWorkDay>> AdmissionCloseLineDisplay(GetAdmissionCloseWorkday model, int userId)
    {
        var result = new List<AdmissionCloseWorkDay>();

        var parameters = new DynamicParameters();

        var directPaging = model.DirectPaging;
        var paginationParameters = new DynamicParameters();

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionCloseApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.AdmissionClose");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", model.Id);

            var filter = string.Empty;

            if (!checkAccessViewAll.Successfull)
                filter = $"AND UserId={userId}";
            else
                filter = "";

            paginationParameters.Add("FilterParam", filter);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                model.Id = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }


        parameters.Add("BranchId", model.BranchId);
        parameters.Add("Id", model.Id);
        parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionCloseSummary_Display";
            conn.Open();
            result = (await conn.QueryAsync<AdmissionCloseWorkDay>(sQuery, parameters,
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultDataQuery<List<AdmissionCloseWorkDay>>> AdmissionCloseCalculate(
        GetAdmissionCloseWorkday model, int userId)
    {
        var finalResult = new MyResultDataQuery<List<AdmissionCloseWorkDay>>
        {
            Data = new List<AdmissionCloseWorkDay>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionClose_Ins";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new
                {
                    model.Opr,
                    model.BranchId,
                    model.WorkDayDate,
                    model.UserId,
                    CloseId = model.Id,
                    model.CompanyId,
                    model.CreateDateTime
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            if (result.Status == 100)
            {
                finalResult.Successfull = true;
                finalResult.Message = result.StatusMessage;
                finalResult.Data = await AdmissionCloseLineDisplay(model, userId);
            }
            else
            {
                finalResult.Successfull = false;
                finalResult.Message = result.StatusMessage;
                finalResult.Data = null;
            }

            return finalResult;
        }
    }

    public async Task<IEnumerable<AnnouncementDetailCloseLine>> GetAnnouncementAdmissionCloseLine(GetCloseLine model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCloseLine_Announcement_Display]";
            conn.Open();
            var result = await conn.QueryAsync<AnnouncementDetailCloseLine>(sQuery, new
            {
                model.CloseId,
                model.UserId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<IEnumerable<RealDetailCloseLine>> GetRealAdmissionCloseLine(GetRealAnnouncementDetail model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCloseLine_Real_Display]";
            conn.Open();
            var result = await conn.QueryAsync<RealDetailCloseLine>(sQuery, new
            {
                model.CloseId,
                model.LineId,
                //model.DetailAccountTypeId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultQuery> AdmissionCloseLineSave(AdmissionCloseLineSave model)
    {
        var parameters = new DynamicParameters();
        parameters.Add("Opr", model.Id == 0 ? "Ins" : "Upd");
        parameters.Add("Id", model.Id);
        parameters.Add("CloseId", model.CloseId);
        parameters.Add("LineId", model.LineId);
        parameters.Add("AdmissionUserId", model.AdmissionUserId);
        parameters.Add("FundTypeId", model.FundTypeId);
        parameters.Add("DetailAccountId", model.DetailAccountId);
        parameters.Add("Amount", model.Amount);
        parameters.Add("ExchangeRate", model.ExchangeRate);
        parameters.Add("SumClose", dbType: DbType.Decimal, direction: ParameterDirection.Output);
        parameters.Add("InOut", model.InOut);
        parameters.Add("CreateDate", DateTime.Now);
        parameters.Add("CurrencyId", model.CurrencyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCloseLine_InsUpd]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SaveAdmissionCloseLine>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);
            conn.Close();

            result.SumAdmissionClose = parameters.Get<decimal>("SumClose");

            result.Successfull = result.Status != -102;
            return result;
        }
    }

    public async Task<AdmissionCloseInsertResult> AdmissionCloseDocumentInsert(GetCloseLine model)
    {
        var result = new AdmissionCloseInsertResult();
        var resultError =
            await ValidateConfirmUnConfirm(model, model.Confirm ? OperationType.Confirm : OperationType.UnConfirm);
        if (resultError.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationMessageError = resultError;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_SendToTreasury]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<AdmissionCloseInsertResult>(sQuery, new
            {
                model.CloseId,
                model.UserId,
                model.CompanyId,
                model.CloseDateTime,
                model.Confirm
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100 || result.Status == 101;

            if (!result.Successfull)
                result.ValidationMessageError.Add(
                    new MyResultStatus { Id = -104, StatusMessage = result.StatusMessage });

            return result;
        }
    }

    public async Task<decimal> GetSumAdmissionClose(int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_Sum]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<decimal>(sQuery, new
            {
                headerId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<long> GetTreasuryId(int closeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                TableName = "mc.AdmissionClose",
                ColumnName = "ISNULL(TreasuryId,0)",
                Filter = $"Id={closeId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<SettlementResult> CheckSettlementSummary(GetSettlement model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_Check_Summary_Settlement]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SettlementResult>(sQuery, new
            {
                model.CloseId,
                model.UserId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<SettlementResult> CheckSettlementAnnouncement(GetSettlement model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_Check_Announcement_Settlement]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SettlementResult>(sQuery, new
            {
                model.CloseId,
                model.LineId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> GetWorkDayStatus(string dayDatePersIan, short branchId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_CashierWorkDay_Status]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                DayDate = dayDatePersIan.ToMiladiDateTime(),
                BranchId = branchId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> RemoveRealLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_DelRecordWithFilter]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionCloseLine",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<bool> CheckExistOpenCash(string dateTime, short branchId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AdmissionClose",
                ColumnName = "Id",
                Filter =
                    $"CAST([WorkDayDate] AS DATE)=CAST('{dateTime}' AS DATE) AND ISNULL(CloseDateTime,'')<>'' AND [BranchId]={branchId} AND [CompanyId]={companyId} "
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result != 0;
        }
    }

    public async Task<List<AdmissionCashDifference>> AdmissionCashDifference(GetAdmissionCloseWorkday model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCash_Difference]";
            conn.Open();
            var result = (await conn.QueryAsync<AdmissionCashDifference>(sQuery, new
            {
                model.BranchId,
                model.WorkDayDate,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<List<AdmissionCloseRequest>>> AdmissionCloseSearch(
        AdmissionCloseRequestSearchModel model)
    {
        var toWorkDayDate = model.ToWorkDayDate;


        if (DateTime.Compare(model.ToWorkDayDate.Value.Date, DateTime.Now.Date) >= 0)
            toWorkDayDate = DateTime.Now.AddDays(-1);


        var result = new MyResultPage<List<AdmissionCloseRequest>>();

        result.Columns = GetColumnsAdmissionCloseSearch();

        using (var conn = Connection)
        {
            conn.Open();

            var sQueryReq = "[mc].[Spc_AdmissionCloseNotReady]";
            result.Data = (await conn.QueryAsync<AdmissionCloseRequest>(sQueryReq, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.FromWorkDayDate,
                ToWorkDayDate = toWorkDayDate,
                model.BranchId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            result.Successfull = true;
            return result;
        }
    }

    public async Task<bool> CheckExist(int id, int companyId, int userId)
    {
        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionCloseApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        var filter = $"Id={id} AND CompanyId={companyId}";

        if (!checkAccessViewAll.Successfull)

            filter += $" AND UserId={userId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AdmissionClose",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<MyResultStatus> Delete(int id)
    {
        var result = new MyResultStatus();

        string validateResult;
        validateResult = await Validate(id);

        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionClose_Del]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام نشد" };

        return result;
    }

    public GetColumnsViewModel GetColumnsAdmissionCloseSearch()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "sumAmountReceived", Title = "خالص دریافتی", Type = (int)SqlDbType.Float, IsDtParameter = true,
                    IsCommaSep = true, Width = 30
                },
                new()
                {
                    Id = "sumAmountPayment", Title = "خالص پرداختی", Type = (int)SqlDbType.Float, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, IsCommaSep = true, Width = 30
                },
                new()
                {
                    Id = "sumAmount", Title = "مانده", Type = (int)SqlDbType.Decimal, Size = 10, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 20
                },
                new() { Id = "action", Title = "انتخاب", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "showServiceLines", Title = "افزودن", ClassName = "btn btn-info", IconName = "fas fa-check"
                }
            }
        };

        return list;
    }

    public async Task<DateTime> GetWorkDayDate(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(sQuery, new
            {
                TableName = "mc.AdmissionClose",
                ColumnName = "WorkDayDate",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<int>> GetAccountDetailIdList(int closeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = (await conn.QueryAsync<int>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "mc.AdmissionCloseLine",
                IdColumnName = "Id",
                ColumnNameList = "DetailAccountId",
                IdList = "",
                Filter = $"HeaderId={closeId} AND ISNULL(DetailAccountId,0)<>0",
                OrderBy = "DetailAccountId DESC"
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyResultStatus>> ValidateConfirmUnConfirm(GetCloseLine model, OperationType operationType)
    {
        var error = new List<MyResultStatus>();

        if (model.CloseId == 0 || model.CompanyId == 0)
            error.Add(new MyResultStatus { Id = -100, StatusMessage = "اطلاعات ورودی معتبر نمی باشد" });
        else
            await Task.Run(async () =>
            {
                var workDayDate = await GetWorkDayDate(model.CloseId, model.CompanyId);
                var fiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(workDayDate, model.CompanyId);

                if (!fiscalYear.Successfull)
                    error.Add(new MyResultStatus { Id = -101, StatusMessage = fiscalYear.StatusMessage });


                if (operationType == OperationType.Confirm)
                {
                    var detailAccountIdList = await GetAccountDetailIdList(model.CloseId);

                    var accountDetailIdModel = detailAccountIdList.Select(x => x).Distinct().ToList();
                    var accountDetailIdDb = await _AccountDetailRepository.GetAll();
                    var accountDetailExceptList = accountDetailIdModel.Except(accountDetailIdDb).ToList();

                    if (accountDetailExceptList.Count() > 0)
                        error.Add(new MyResultStatus
                            { Id = -102, StatusMessage = string.Join("  ,  ", accountDetailExceptList) });
                }
                else
                {
                    var treasuryId = await GetTreasuryId(model.CloseId);

                    var journalId = await _newTreasuryRepository.GetJournalIdByTreasuryId(treasuryId, 57);

                    if (journalId != 0)
                        error.Add(new MyResultStatus
                        {
                            Id = -103,
                            StatusMessage =
                                $"برگه دارای سند حسابداری به شناسه : ({journalId}) می باشد ، مجاز به برگشت از خزانه نمی باشید."
                        });
                }
            });

        return error;
    }

    public async Task<string> Validate(int id)
    {
        var error = "";

        if (id == 0)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی حذف بستن برگه صندوق

            var hasCheckTreasuryAdmissionClose = await CheckTreasuryAdmissionClose(id);
            if (hasCheckTreasuryAdmissionClose) error = " امکان حذف ندارید";

            #endregion
        });

        return error;
    }


    public async Task<bool> CheckTreasuryAdmissionClose(int id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_AdmissionClose_CheckTreasury]";
            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result > 0 ? true : false;
        }
    }
}