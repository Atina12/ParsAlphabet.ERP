using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasurySearch;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasurySearch;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySearch;

public class TreasurySearchRepository : ITreasurySearchRepository
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly CurrencyRepository _currencyRepository;
    private readonly IMapper _mapper;

    public TreasurySearchRepository(IConfiguration configuration, ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository, IMapper mapper)
    {
        _configuration = configuration;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _mapper = mapper;
    }

    public IDbConnection Connection => new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<MyResultPage<List<GetTreasuryQuickSearch>>> GetTreasuryQuickSearch(TreasuryQuickSearch model,
        byte roleId)
    {
        var result = new MyResultPage<List<GetTreasuryQuickSearch>>
        {
            Data = new List<GetTreasuryQuickSearch>()
        };

        DateTime? ToDate = null, FromDate = null;

        ToDate = model.ToDatePersian.ToMiladiDateTime();
        FromDate = model.FromDatePersian.ToMiladiDateTime();

        var parameters = new DynamicParameters();
        parameters.Add("pageNo", model.PageNo);
        parameters.Add("pageRowsCount", model.PageRowsCount);
        parameters.Add("Todate", ToDate == null ? null : ToDate);
        parameters.Add("FromDate", FromDate == null ? null : FromDate);
        parameters.Add("FundTypeId", model.FundtypeId == null ? null : model.FundtypeId);
        parameters.Add("Serial ", model.Serial == null ? null : model.Serial);
        parameters.Add("BankId ", model.BankId == null ? null : model.BankId);
        parameters.Add("FromAmount", model.FromPrice == null ? null : model.FromPrice);
        parameters.Add("ToAmount", model.ToPrice == null ? null : model.ToPrice);
        parameters.Add("RoleId", roleId);
        result.Columns = GetColumns();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Sps_Treasury_QuickSearch]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<GetTreasuryQuickSearch>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<GetTreasuryQuickSearchType>>> GetTreasuryQuickSearchType(
        TreasuryQuickSearchtype model)
    {
        var result = new MyResultPage<List<GetTreasuryQuickSearchType>>
        {
            Data = new List<GetTreasuryQuickSearchType>()
        };

        result.Columns = GetColumnsQuickSearchType();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Sps_Treasury_QuickSearchType]";
            conn.Open();
            result.Data = (await conn.QueryAsync<GetTreasuryQuickSearchType>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.DocumentNo,
                model.BondSerialNo,
                model.BankId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = false,
            RunButtonIndex = "documentNo,bondSerialNo,bankId",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "fundType", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 120, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "bondSerialNo", Title = "سریال چک", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 120, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "bank", Title = "بانک", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 10,
                    HasSumValue = false, IsCommaSep = true, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Money, Size = 10, HasSumValue = false,
                    IsCommaSep = true, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "dueDatePersain", Title = "سررسید ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new() { Id = "bankId", IsPrimary = true },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 35 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "selection", Title = "انتخاب", ClassName = "btn blue_outline_1", IconName = "fas fa-check"
                }
            }
        };
        return list;
    }

    public GetColumnsViewModel GetColumnsQuickSearchType()
    {
        var list = new GetColumnsViewModel
        {
            RunButtonIndex = "treasuryId,requestId,stageId,stageClassId,workflowId",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "transitNo", Title = "شناسه مرجع", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "stage", Title = " مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = false, Width = 12
                },
                new()
                {
                    Id = "bank", Title = " بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "bankAccount", Title = "حساب بانکی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "bondSerialNo", Title = "شماره سریال چک", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "accountGLId", Title = "کد کل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "accountDetailId", Title = "کد تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "insertDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 9
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 12 },
                new() { Id = "treasuryId" },
                new() { Id = "requestId" },
                new() { Id = "stageId" },
                new() { Id = "workflowId" },
                new() { Id = "stageClassId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayTreasury", Title = "نمایش", ClassName = "btn green_outline_1 waves-effect",
                    IconName = "far fa-file-excel"
                }
            }
        };
        return list;
    }
}