using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.BankAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Bank;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;

public class BankAccountRepository : BaseRepository<BankAccountModel, int, string>,
    IBaseRepository<BankAccountModel, int, string>
{
    private readonly AccountDetailRepository _accountDetailRepository;
    private readonly BankRepository _bankRepository;
    private readonly IConfiguration _config;

    public BankAccountRepository(IConfiguration config, BankRepository bankRepository,
        AccountDetailRepository AccountDetailRepository) : base(config)
    {
        _config = config;
        _bankRepository = bankRepository;
        _accountDetailRepository = AccountDetailRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 5, IsDtParameter = true,
                    IsFilterParameter = true
                },
                new()
                {
                    Id = "bank", Title = "بانک", IsPrimary = true, Width = 15, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/FM/BankApi/getdropdown"
                },
                new()
                {
                    Id = "accountNo", Title = "شماره حساب", Type = (int)SqlDbType.VarChar, Size = 16, Width = 15,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "shebaNo", Title = "شماره شبا", Type = (int)SqlDbType.VarChar, Size = 16, Width = 13,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "accountName", Title = "نام حساب", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 7,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "bankAccountCategory", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 7, IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "branchNo", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 7,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "countryName", Title = "کشور", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 15,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Width = 5, IsDtParameter = true,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
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
                p.Bank,
                p.AccountNo,
                p.ShebaNo,
                p.AccountName,
                p.BankAccountCategory,
                p.BranchNo,
                p.CountryName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<BankAccountGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<BankAccountGetPage>>
        {
            Data = new List<BankAccountGetPage>()
        };

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("BankId",
            model.Filters.Any(x => x.Name == "bank")
                ? model.Filters.FirstOrDefault(x => x.Name == "bank").Value
                : null);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AccountCategoryName",
            model.Filters.Any(x => x.Name == "bankAccountCategory")
                ? model.Filters.FirstOrDefault(x => x.Name == "bankAccountCategory").Value
                : null);
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
            var sQuery = "[fm].[Spc_BankAccount_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<BankAccountGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<BankAccountGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<BankAccountGetRecord>();
        result.Data = new BankAccountGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<BankAccountGetRecord>(sQuery, new
            {
                TableName = "fm.BankAccount",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Data.BankName = await _bankRepository.GetName(result.Data.BankId, companyId);

        #region accountDetailBankAccountList

        var accountDetailViewModel = new
        {
            result.Data.AccountNo,
            result.Data.BankId,
            BankName = result.Data.BankId > 0 ? result.Data.BankName : ""
        };

        result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

        #endregion

        return result;
    }

    public async Task<MyResultQuery> Insert(BankAccountModel model)
    {
        var result = new MyResultQuery();

        #region accountDetailBankAccountList

        var accountDetailViewModel = new
        {
            model.AccountNo,
            model.BankId,
            BankName = model.BankId > 0 ? await _bankRepository.GetName(model.BankId, model.CompanyId) : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccount_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.BankId,
                Name = model.Name.ConvertArabicAlphabet(),
                model.BankAccountCategoryId,
                model.BranchNo,
                BranchName = model.BranchName.ConvertArabicAlphabet(),
                model.AccountNo,
                model.ShebaNo,
                model.LocCountryId,
                model.LocStateId,
                model.LocCityId,
                Address = model.Address.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId,
                accountDetailBankAccount = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(BankAccountModel model)
    {
        var result = new MyResultQuery();

        #region accountDetailBankAccountList

        var accountDetailViewModel = new
        {
            model.AccountNo,
            model.BankId,
            BankName = model.BankId > 0 ? await _bankRepository.GetName(model.BankId, model.CompanyId) : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccount_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.BankId,
                Name = model.Name.ConvertArabicAlphabet(),
                model.BankAccountCategoryId,
                model.BranchNo,
                BranchName = model.BranchName.ConvertArabicAlphabet(),
                model.AccountNo,
                model.ShebaNo,
                model.LocCountryId,
                model.LocStateId,
                model.LocCityId,
                Address = model.Address.ConvertArabicAlphabet(),
                model.IsActive,
                model.CompanyId,
                accountDetailBankAccount = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int bankId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccount_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    bankId,
                    companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> AccountDetailGetDropDown(int bankId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccountHasAccountDetail_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    bankId,
                    companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel2>> Search(int companyId, int accountId, int bankId, string name)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccount_Search]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel2>(sQuery,
                new
                {
                    CompanyId = companyId,
                    AccountId = accountId,
                    BankId = bankId,
                    Name = name.ConvertArabicAlphabet()
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByBankCategoryId(short bankCategoryId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "fm.BankAccount",
                    IdColumnName = "id",
                    TitleColumnName = "Name",
                    //IdList = null,
                    Filter = $"BankAccountCategoryId={bankCategoryId} AND CompanyId={companyId} AND IsActive = 1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDownByBankCategoryId(short bankCategoryId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "fm.BankAccount",
                    IdColumnName = "id",
                    TitleColumnName = "Name",
                    //IdList = null,
                    Filter = $"BankAccountCategoryId={bankCategoryId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<short> GetBankId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fm.BankAccount",
                    ColumnName = "BankId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetAccountName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.BankAccount",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}