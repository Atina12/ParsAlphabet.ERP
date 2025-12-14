using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;
using ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.PersonAccount;

public class PersonAccountRepository : IPersonAccountRepository
{
    private readonly IConfiguration _config;
    private readonly EmployeeRepository _employeeRepository;

    public PersonAccountRepository(IConfiguration config, EmployeeRepository employeeRepository)
    {
        _config = config;
        _employeeRepository = employeeRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns(byte personTypeId)
    {
        var personApi = string.Empty;

        if (personTypeId == 1)
            personApi = "api/SM/CustomerApi/getalldatadropdown";
        else if (personTypeId == 2)
            personApi = "api/PU/VendorApi/getalldatadropdown";
        else if (personTypeId == 3)
            personApi = "api/HR/EmployeeApi/getalldatadropdown";
        else if (personTypeId == 6)
            personApi = "api/MC/AttenderApi/getdropdown/2";
        else
            personApi = "api/CR/ContactApi/getalldatadropdown";

        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "number"
                },
                new()
                {
                    Id = "person", Title = "شخص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = personApi, Width = 10
                },
                new()
                {
                    Id = "bank", Title = "نام بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown",
                    Width = 8
                },
                new()
                {
                    Id = "accountNo", Title = "شماره حساب", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "shebaNoTyped", Title = "شماره شبا", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "cardNo", Title = "شماره کارت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "isDefualt", Title = "حساب اصلی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 27 }
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
                GetColumns(0).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Person,
                p.Bank,
                p.AccountNo,
                p.ShebaNoTyped,
                p.CardNo,
                IsDefualt = p.IsDefualt ? "هست" : "نیست",
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<PersonAccountGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PersonAccountGetPage>>
        {
            Data = new List<PersonAccountGetPage>()
        };

        var p_personTypeId = Convert.ToByte(model.Form_KeyValue[1]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("KeyId",
            model.Filters.Any(x => x.Name == "person")
                ? model.Filters.FirstOrDefault(x => x.Name == "person").Value
                : null);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("PersonTypeId", p_personTypeId);
        parameters.Add("BankId",
            model.Filters.Any(x => x.Name == "bank")
                ? model.Filters.FirstOrDefault(x => x.Name == "bank").Value
                : null);
        parameters.Add("AccountNo",
            model.Filters.Any(x => x.Name == "accountNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "accountNo").Value
                : null);
        parameters.Add("CardNo",
            model.Filters.Any(x => x.Name == "cardNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "cardNo").Value
                : null);
        parameters.Add("ShebaNo",
            model.Filters.Any(x => x.Name == "shebaNoTyped")
                ? model.Filters.FirstOrDefault(x => x.Name == "shebaNoTyped").Value
                : null);

        result.Columns = GetColumns(p_personTypeId);

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_PersonAccount_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PersonAccountGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<PersonAccountGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<PersonAccountGetRecord>
        {
            Data = new PersonAccountGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<PersonAccountGetRecord>(sQuery, new
            {
                TableName = "gn.PersonAccount",
                Filter = $"Id = {id}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data == null;


        result.Data.PersonName = await _employeeRepository.GetEmployeeName(result.Data.PersonId, companyId);


        return result;
    }

    public async Task<MyResultQuery> Insert(PersonAccountModel model)
    {
        //model.AccountNo = model.AccountNo.Replace("-", "");
        //model.ShebaNo = model.ShebaNo.Replace("-", "");
        //model.CardNo = model.CardNo.Replace("-", "");

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_PersonAccount_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.PersonId,
                model.PersonTypeId,
                model.BankId,
                model.AccountNo,
                model.CardNo,
                model.ShebaNo,
                model.IsDefualt,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;

        return result;
    }

    public async Task<MyResultQuery> Update(PersonAccountModel model)
    {
        //model.AccountNo = model.AccountNo.Replace("-", "");
        //model.ShebaNo = model.ShebaNo.Replace("-", "");
        //model.CardNo = model.CardNo.Replace("-", "");

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_PersonAccount_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.PersonId,
                model.PersonTypeId,
                model.BankId,
                model.AccountNo,
                model.CardNo,
                model.ShebaNo,
                model.IsDefualt,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;

        return result;
    }

    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "gn.PersonAccount",
                Filter = $"Id = {id}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }


    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.PersonAccount",
                    Filter = "IsActive = 1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}