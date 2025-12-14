using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.Customer;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.Customer;

public class CustomerRepository :
    BaseRepository<CustomerModel, int, string>,
    IBaseRepository<CustomerModel, int, string>
{
    private readonly PersonGroupRepository _personGroupRepository;

    public CustomerRepository(IConfiguration config, PersonGroupRepository personGroupRepository)
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
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "fullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "partnerTypeName", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "1", Name = "حقیقی" },
                        new() { Id = "2", Name = "حقوقی" }
                    },
                    Width = 14
                },
                new()
                {
                    Id = "agentFullName", Title = "نام نماینده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "customerGroup", Title = "گروه مشتریان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "brandName", Title = "نام تجاری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "nationalCode", Title = "شماره/ شناسه ملی", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "taxCode", Title = "کداقتصادی", Type = (int)SqlDbType.VarChar, Size = 16, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "vatEnable", Title = "اعتبارVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "vatInclude", Title = "مشمولVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "jobTitle", Title = "عنوان شغلی ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "insurer", Title = "بیمه گر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "insuranceNo", Title = "شماره بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
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
                p.CustomerGroup,
                p.NationalCode,
                p.MobileNo,
                p.TaxCode,
                VATEnable = p.VATEnable ? "دارد" : "ندارد",
                VATInclude = p.VATInclude ? "بلی" : "خیر",
                p.JobTitle,
                p.Insurer,
                p.InsuranceNo,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<CustomerGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CustomerGetPage>>
        {
            Data = new List<CustomerGetPage>()
        };

        int? p_id = null;
        byte? p_partnerType_id = null;
        string p_fullName = null, p_agentFullName = null, p_nationalCode = null, p_phoneNo = null, p_mobileNo = null;

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "partnerTypeId":
                p_partnerType_id = Convert.ToByte(model.FieldValue);
                break;
            case "fullName":
                p_fullName = model.FieldValue;
                break;
            case "agentFullName":
                p_agentFullName = model.FieldValue;
                break;
            case "nationalCode":
                p_nationalCode = model.FieldValue;
                break;
            case "phoneNo":
                p_phoneNo = model.FieldValue;
                break;
            case "mobileNo":
                p_mobileNo = model.FieldValue;
                break;
        }

        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
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
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("PartnerTypeId",
            model.Filters.Any(x => x.Name == "partnerTypeName")
                ? model.Filters.FirstOrDefault(x => x.Name == "partnerTypeName").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_Customer_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CustomerGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(CustomerSave model)
    {
        #region accountDetailCustomerList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberCu,
            AgentFullName = model.AgentFullNameCu,
            JobTitle = model.JobTitleCu,
            BrandName = model.BrandNameCu != "" || model.BrandNameCu != null ? model.BrandNameCu : "",
            PartnerTypeId = model.PartnerTypeIdCu,
            VATInclude = model.VATIncludeCu,
            VATEnable = model.VATEnableCu,
            NationalCode = model.NationalCodeCu != "" || model.NationalCodeCu != null ? model.NationalCodeCu : "",
            PersonGroupId = model.PersonGroupIdCu,
            PersonGroupName = model.PersonGroupIdCu > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupIdCu)
                : ""
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_Customer_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                FirstName = model.FirstNameCu,
                LastName = model.LastNameCu,
                AgentFullName = model.AgentFullNameCu,
                PartnerTypeId = model.PartnerTypeIdCu,
                PersonGroupId = model.PersonGroupIdCu,
                IndustryId = model.IndustryIdCu == 0 ? null : model.IndustryIdCu,
                GenderId = model.GenderIdCu,
                NationalCode = model.NationalCodeCu,
                LocCountryId = model.LocCountryIdCu,
                LocStateId = model.LocStateIdCu,
                LocCityId = model.LocCityIdCu,
                PostalCode = model.PostalCodeCu,
                Address = model.AddressCu,
                PhoneNo = model.PhoneNoCu,
                MobileNo = model.MobileNoCu,
                Email = model.EmailCu,
                WebSite = model.WebSiteCu,
                IdNumber = model.IdNumberCu,
                IdDate = model.IdDateCu,
                VATInclude = model.VATIncludeCu,
                VATAreaId = model.VATAreaIdCu,
                VATEnable = model.VATEnableCu,
                TaxCode = model.TaxCodeCu,
                GroupId = model.GroupIdCu,
                IsActive = model.IsActiveCu,
                JobTitle = model.JobTitleCu,
                PersonTitleId = model.PersonTitleIdCu,
                BrandName = model.BrandNameCu,
                InsurerId = model.InsurerIdCu,
                InsuranceNo = model.InsuranceNoCu != "" ? model.InsuranceNoCu : "",
                model.CompanyId,
                AccountDetailCustomerListGroupJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(CustomerSave model)
    {
        #region accountDetailCustomerList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberCu,
            AgentFullName = model.AgentFullNameCu,
            JobTitle = model.JobTitleCu,
            BrandName = model.BrandNameCu != "" || model.BrandNameCu != null ? model.BrandNameCu : "",
            PartnerTypeId = model.PartnerTypeIdCu,
            VATInclude = model.VATIncludeCu,
            VATEnable = model.VATEnableCu,
            NationalCode = model.NationalCodeCu != "" || model.NationalCodeCu != null ? model.NationalCodeCu : "",
            PersonGroupId = model.PersonGroupIdCu,
            PersonGroupName = model.PersonGroupIdCu > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupIdCu)
                : ""
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_Customer_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                FirstName = model.FirstNameCu,
                LastName = model.LastNameCu,
                AgentFullName = model.AgentFullNameCu,
                PartnerTypeId = model.PartnerTypeIdCu,
                PersonGroupId = model.PersonGroupIdCu,
                IndustryId = model.IndustryIdCu == 0 ? null : model.IndustryIdCu,
                GenderId = model.GenderIdCu,
                NationalCode = model.NationalCodeCu,
                LocCountryId = model.LocCountryIdCu,
                LocStateId = model.LocStateIdCu,
                LocCityId = model.LocCityIdCu,
                PostalCode = model.PostalCodeCu,
                Address = model.AddressCu,
                PhoneNo = model.PhoneNoCu,
                MobileNo = model.MobileNoCu,
                Email = model.EmailCu,
                WebSite = model.WebSiteCu,
                IdNumber = model.IdNumberCu,
                IdDate = model.IdDateCu,
                VATInclude = model.VATIncludeCu,
                VATAreaId = model.VATAreaIdCu,
                VATEnable = model.VATEnableCu,
                TaxCode = model.TaxCodeCu,
                GroupId = model.GroupIdCu,
                IsActive = model.IsActiveCu,
                JobTitle = model.JobTitleCu,
                PersonTitleId = model.PersonTitleIdCu,
                BrandName = model.BrandNameCu,
                InsurerId = model.InsurerIdCu,
                InsuranceNo = model.InsuranceNoCu != "" ? model.InsuranceNoCu : "",
                model.CompanyId,
                AccountDetailCustomerListGroupJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int CompanyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "sm.Customer",
                RecordId = keyvalue,
                CompanyId,
                Filter = $"CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(int Companyid)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "sm.Customer",
                    TitleColumnName = "FullName",
                    Filter = $"CompanyId={Companyid}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByGroupId(string groupIds)
    {
        var filter = string.Empty;

        if (!groupIds.IsNullOrEmptyOrWhiteSpace() && groupIds != "null")
            filter = $"PersonGroupId IN({groupIds})";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "sm.Customer",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int Companyid)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "sm.Customer",
                    TitleColumnName = "FullName",
                    Filter = $"IsActive = 1 AND CompanyId={Companyid}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<CustomerGetRecordForm>> GetRecordById(int id, int CompanyId)
    {
        var result = new MyResultPage<CustomerGetRecordForm>();
        result.Data = new CustomerGetRecordForm();
        var customer = new CustomerGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            customer = await conn.QueryFirstOrDefaultAsync<CustomerGetRecord>(sQuery, new
            {
                TableName = "sm.Customer",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Data.Id = customer.Id;
        result.Data.IndustryIdCu = customer.IndustryId;
        result.Data.PersonGroupIdCu = customer.PersonGroupId;
        result.Data.FirstNameCu = customer.FirstName;
        result.Data.LastNameCu = customer.LastName;
        result.Data.AgentFullNameCu = customer.AgentFullName;
        result.Data.PartnerTypeIdCu = customer.PartnerTypeId;
        result.Data.GenderIdCu = customer.GenderId;
        result.Data.NationalCodeCu = customer.NationalCode;
        result.Data.LocCountryIdCu = customer.LocCountryId;
        result.Data.LocStateIdCu = customer.LocStateId;
        result.Data.LocCityIdCu = customer.LocCityId;
        result.Data.PostalCodeCu = customer.PostalCode;
        result.Data.AddressCu = customer.Address;
        result.Data.PhoneNoCu = customer.PhoneNo;
        result.Data.MobileNoCu = customer.MobileNo;
        result.Data.EmailCu = customer.Email;
        result.Data.WebSiteCu = customer.WebSite;
        result.Data.JobTitleCu = customer.JobTitle;
        result.Data.BrandNameCu = customer.BrandName;
        result.Data.PersonTitleIdCu = customer.PersonTitleId;
        result.Data.IdNumberCu = customer.IdNumber;
        result.Data.IdDateCu = customer.IdDate;
        result.Data.VATIncludeCu = customer.VATInclude;
        result.Data.VATAreaIdCu = customer.VATAreaId;
        result.Data.VATEnableCu = customer.VATEnable;
        result.Data.TaxCodeCu = customer.TaxCode;
        result.Data.GroupIdCu = customer.GroupId;
        result.Data.IsActiveCu = customer.IsActive;
        result.Data.InsurerIdCu = customer.InsurerId;
        result.Data.InsuranceNoCu = customer.InsuranceNo;

        #region accountDetailCustomerList

        var accountDetailViewModel = new
        {
            customer.IdNumber,
            customer.AgentFullName,
            customer.JobTitle,
            BrandName = customer.BrandName != "" || customer.BrandName != null ? customer.BrandName : "",
            customer.PartnerTypeId,
            customer.VATInclude,
            customer.VATEnable,
            NationalCode = customer.NationalCode != "" || customer.NationalCode != null ? customer.NationalCode : "",
            customer.PersonGroupId,
            PersonGroupName = customer.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(customer.PersonGroupId)
                : ""
        };
        result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

        #endregion

        return result;
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
                    TableName = "sm.Customer",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }
}