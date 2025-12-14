using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount;
using static ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount.PatientAccountViewModel;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.PatientAccount;

public class PatientAccountRepository :
    BaseRepository<PatientAccountModel, int, string>,
    IBaseRepository<PatientAccountModel, int, string>
{
    public PatientAccountRepository(IConfiguration _config) : base(_config)
    {
    }

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "patientId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8, FilterType = "number"
                },
                new()
                {
                    Id = "fullName", Title = "شخص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "nationalCode", Title = "کدملی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 8
                },
                new()
                {
                    Id = "bank", Title = "نام بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown",
                    Width = 12
                },
                new()
                {
                    Id = "bankAccountNo", Title = "شماره حساب", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 9
                },
                new()
                {
                    Id = "bankShebaNo", Title = "شماره شبا", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "bankCardNo", Title = "شماره کارت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },

            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
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
                p.PatientId,
                p.FullName,
                p.NationalCode,
                p.Bank,
                p.BankAccountNo,
                p.BankShebaNo,
                p.BankCardNo
            };
        return result;
    }

    public async Task<MyResultPage<List<PatientAccountGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PatientAccountGetPage>>
        {
            Data = new List<PatientAccountGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("NationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("BankId",
            model.Filters.Any(x => x.Name == "bank")
                ? model.Filters.FirstOrDefault(x => x.Name == "bank").Value
                : null);
        parameters.Add("BankAccountNo",
            model.Filters.Any(x => x.Name == "bankAccountNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "bankAccountNo").Value
                : null);
        parameters.Add("BankShebaNo",
            model.Filters.Any(x => x.Name == "bankShebaNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "bankShebaNo").Value
                : null);
        parameters.Add("BankCardNo",
            model.Filters.Any(x => x.Name == "bankCardNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "bankCardNo").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Patient_BankInfo_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PatientAccountGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<PatientAccountGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<PatientAccountGetRecord>
        {
            Data = new PatientAccountGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Patient_BankInfo_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<PatientAccountGetRecord>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data == null;

        return result;
    }

    public async Task<MyResultQuery> Update(PatientAccountModel model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Patient_UpdateBankInfo]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.PatientId,
                model.BankId,
                model.BankAccountNo,
                model.BankShebaNo,
                model.BankCardNo,
                model.CompanyId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);

            result.Successfull = result.Status == 100;

            return result;
        }
    }
}