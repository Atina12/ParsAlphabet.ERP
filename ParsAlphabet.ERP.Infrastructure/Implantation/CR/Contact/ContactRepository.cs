using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.CR.Contact;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.CR.Contact;

public class ContactRepository :
    BaseRepository<ContactModel, int, string>,
    IBaseRepository<ContactModel, int, string>
{
    private readonly PersonGroupRepository _personGroupRepository;

    public ContactRepository(IConfiguration config, PersonGroupRepository personGroupRepository)
        : base(config)
    {
        _personGroupRepository = personGroupRepository;
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
                    IsFilterParameter = true, Width = 4, FilterType = "number"
                },
                new()
                {
                    Id = "fullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "partnerTypeName", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "partnerTypeId", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.TinyInt,
                    IsFilterParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "1", Name = "حقیقی" },
                        new() { Id = "2", Name = "حقوقی" }
                    },
                    Width = 7
                },
                new()
                {
                    Id = "agentFullName", Title = "نام نماینده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "jobTitle", Title = "عنوان شغلی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 8
                },
                new()
                {
                    Id = "brandName", Title = "نام تجاری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 8
                },
                new()
                {
                    Id = "nationalCode", Title = "شماره/ شناسه ملی", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "contactGroup", Title = "گروه اشخاص", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 7
                },
                new()
                {
                    Id = "phoneNo", Title = "تلفن ثابت", Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "vatInclude", Title = "مشمولVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    IsFilterParameter = false, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "vatEnable", Title = "اعتبارVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    IsFilterParameter = false, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                }
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
                p.FullName,
                p.PartnerTypeName,
                p.AgentFullName,
                p.JobTitle,
                p.BrandName,
                p.NationalCode,
                p.ContactGroup,
                p.PhoneNo,
                p.MobileNo,
                VATInclude = p.VATInclude ? "بلی" : "خیر",
                VATEnable = p.VATEnable ? "دارد" : "ندارد",
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<ContactGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ContactGetPage>>
        {
            Data = new List<ContactGetPage>()
        };


        var parameters = new DynamicParameters();
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("PartnerTypeId",
            model.Filters.Any(x => x.Name == "partnerTypeId")
                ? model.Filters.FirstOrDefault(x => x.Name == "partnerTypeId").Value
                : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("AgentFullName",
            model.Filters.Any(x => x.Name == "agentFullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "agentFullName").Value
                : null);
        parameters.Add("NationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("PhoneNo",
            model.Filters.Any(x => x.Name == "phoneNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "phoneNo").Value
                : null);
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_Contact_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ContactGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<ContactGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<ContactGetRecord>
        {
            Data = new ContactGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<ContactGetRecord>(sQuery, new
            {
                TableName = "cr.Contact",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);


            #region accountDetailContactList

            var accountDetailViewModel = new
            {
                result.Data.IdNumber,
                result.Data.AgentFullName,
                result.Data.JobTitle,
                BrandName = result.Data.BrandName != "" || result.Data.BrandName != null ? result.Data.BrandName : "",
                result.Data.PartnerTypeId,
                result.Data.VATInclude,
                result.Data.VATEnable,
                NationalCode = result.Data.NationalCode != "" || result.Data.NationalCode != null
                    ? result.Data.NationalCode
                    : "",
                result.Data.PersonGroupId,
                PersonGroupName = result.Data.PersonGroupId > 0
                    ? await _personGroupRepository.PersonGroup_GetName(result.Data.PersonGroupId)
                    : ""
            };
            result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(ContactModel model)
    {
        var result = new MyResultQuery();

        #region accountDetailContactList

        var accountDetailViewModel = new
        {
            model.IdNumber,
            model.AgentFullName,
            model.JobTitle,
            BrandName = model.BrandName != "" || model.BrandName != null ? model.BrandName : "",
            model.PartnerTypeId,
            model.VATInclude,
            model.VATEnable,
            NationalCode = model.NationalCode != "" || model.NationalCode != null ? model.NationalCode : "",
            model.PersonGroupId,
            PersonGroupName = model.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupId)
                : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_Contact_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Id = 0,
                model.IndustryId,
                model.PersonGroupId,
                model.FirstName,
                model.LastName,
                model.AgentFullName,
                model.GenderId,
                model.PartnerTypeId,
                model.NationalCode,
                model.LocCountryId,
                LocStateId = model.LocStateId == 0 ? null : model.LocStateId,
                model.LocCityId,
                model.PostalCode,
                model.Address,
                model.PhoneNo,
                model.MobileNo,
                model.Email,
                model.WebSite,
                model.IdNumber,
                model.IdDate,
                model.VATInclude,
                model.VATAreaId,
                model.VATEnable,
                model.TaxCode,
                model.IsActive,
                model.JobTitle,
                model.BrandName,
                model.PersonTitleId,
                model.CompanyId,
                AccountDetailContactJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(ContactModel model)
    {
        var result = new MyResultQuery();

        #region accountDetailContactList

        var accountDetailViewModel = new
        {
            model.IdNumber,
            model.AgentFullName,
            model.JobTitle,
            BrandName = model.BrandName != "" || model.BrandName != null ? model.BrandName : "",
            model.PartnerTypeId,
            model.VATInclude,
            model.VATEnable,
            NationalCode = model.NationalCode != "" || model.NationalCode != null ? model.NationalCode : "",
            model.PersonGroupId,
            PersonGroupName = model.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupId)
                : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_Contact_InsUpd ";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Id,
                model.IndustryId,
                model.PersonGroupId,
                model.FirstName,
                model.LastName,
                model.AgentFullName,
                model.GenderId,
                model.PartnerTypeId,
                model.NationalCode,
                model.LocCountryId,
                LocStateId = model.LocStateId == 0 ? null : model.LocStateId,
                model.LocCityId,
                model.PostalCode,
                model.Address,
                model.PhoneNo,
                model.MobileNo,
                model.Email,
                model.WebSite,
                model.IdNumber,
                model.IdDate,
                model.VATInclude,
                model.VATAreaId,
                model.VATEnable,
                model.TaxCode,
                model.IsActive,
                model.JobTitle,
                model.BrandName,
                model.PersonTitleId,
                model.CompanyId,
                AccountDetailContactJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "cr.Contact",
                RecordId = keyvalue,
                CompanyId = companyId,
                Filter = $"CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "cr.Contact",
                    TitleColumnName = "FullName",
                    Filter = $"IsActive = 1 AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "cr.Contact",
                    TitleColumnName = "FullName",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> ExistNationalCode(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"NationalCode='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"NationalCode='{model.Name}' AND (Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "cr.Contact",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }
}