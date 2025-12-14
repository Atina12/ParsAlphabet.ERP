using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;

public class VendorRepository :
    BaseRepository<VendorModel, int, string>,
    IBaseRepository<VendorModel, int, string>

{
    private readonly PersonGroupRepository _personGroupRepository;

    public VendorRepository(IConfiguration config, PersonGroupRepository personGroupRepository)
        : base(config)
    {
        _personGroupRepository = personGroupRepository;
    }

    public GetColumnsViewModel GetColumns(string formType = "vendor")
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
                    Id = "vendorFullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "partnerTypeName", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "agentFullName", Title = "نام نماینده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "vendorGroup", Title = "گروه تامین کننده گان", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "brandName", Title = "نام تجاری", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "nationalCode", Title = "شماره/ شناسه ملی", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 11, IsPersian = true, IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = formType == "vendor", IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "taxCode", Title = "کداقتصادی", Type = (int)SqlDbType.VarChar, Size = 16, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "vatEnable", Title = "اعتبارVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "vatInclude", Title = "مشمولVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "jobTitle", Title = "عنوان شغلی ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "insurer", Title = "بیمه گر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = formType == "vendor", Width = 7
                },
                new()
                {
                    Id = "insuranceNo", Title = "شماره بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = formType == "vendor", IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            }
        };

        if (formType == "vendor")
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true }
            };
        else
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "vendorItemList", Title = "لیست آیتم", IconName = "fa fa-list color-green" },
                new() { Name = "vendorItemPrice", Title = "تخصیص کالا", IconName = "fa fa-stethoscope" }
            };

        return list;
    }


    public GetColumnsViewModel GetColumnsVendorItemPrice(string formType = "vendor")
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
                    Id = "vendorFullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "partnerTypeName", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "agentFullName", Title = "نام نماینده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "vendorGroup", Title = "گروه تامین کننده گان", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "brandName", Title = "نام تجاری", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "nationalCode", Title = "شماره/ شناسه ملی", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsPersian = true, IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "taxCode", Title = "کداقتصادی", Type = (int)SqlDbType.VarChar, Size = 16, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "vatEnable", Title = "اعتبارVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "vatInclude", Title = "مشمولVAT", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "jobTitle", Title = "عنوان شغلی ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                }
            }
        };

        if (formType == "vendor")
        {
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true }
            };
        }
        else
        {
            list.ActionType = "inline";
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "vendorItemPrice", Title = "حق الزحمهکالا", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-stethoscope"
                }
            };
        }

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var column = new GetColumnsViewModel();

        var formType = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        if (formType == 1) column = GetColumnsVendorItemPrice();
        else column = GetColumns();
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                column.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);

        if (formType == 1)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.VendorFullName,
                    p.PartnerTypeName,
                    p.AgentFullName,
                    p.VendorGroup,
                    p.BrandName,
                    p.NationalCode,
                    p.TaxCode,
                    VATEnable = p.VATEnable ? "دارد" : "ندارد",
                    VATInclude = p.VATInclude ? "بلی" : "خیر",
                    p.JobTitle,
                    IsActive = p.IsActive ? "فعال" : "غیرفعال",
                    IsDetail = p.IsDetail ? "دارد" : "ندارد"
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.VendorFullName,
                    p.PartnerTypeName,
                    p.AgentFullName,
                    p.VendorGroup,
                    p.BrandName,
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

    public async Task<MyResultPage<List<VendorGetPage>>> GetPage(NewGetPageViewModel model, string formType = "vendor")
    {
        var result = new MyResultPage<List<VendorGetPage>>();
        result.Data = new List<VendorGetPage>();
        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "vendorFullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "vendorFullName").Value
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
        parameters.Add("InsuranceNo",
            model.Filters.Any(x => x.Name == "insuranceNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "insuranceNo").Value
                : null);

        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns(formType);

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Vendor_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<VendorGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(SaveVendor model)
    {
        var validateResult = new List<string>();
        validateResult = await Validate(model, OperationType.Insert);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultQuery();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        #region accountDetailVendorList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberVe,
            AgentFullName = model.AgentFullNameVe,
            JobTitle = model.JobTitleVe,
            BrandName = model.BrandNameVe != "" || model.BrandNameVe != null ? model.BrandNameVe : "",
            PartnerTypeId = model.PartnerTypeIdVe,
            VATInclude = model.VATIncludeVe,
            VATEnable = model.VATEnableVe,
            NationalCode = model.NationalCodeVe != "" || model.NationalCodeVe != null ? model.NationalCodeVe : "",
            PersonGroupId = model.VendorGroupIdVe,
            PersonGroupName = model.VendorGroupIdVe > 0
                ? await _personGroupRepository.PersonGroup_GetName(Convert.ToInt32(model.VendorGroupIdVe))
                : ""
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Vendor_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                FirstName = model.FirstNameVe,
                LastName = model.LastNameVe,
                AgentFullName = model.AgentFullNameVe,
                PartnerTypeId = model.PartnerTypeIdVe,
                VendorGroupId = model.VendorGroupIdVe,
                IndustryId = model.IndustryIdVe == 0 ? null : model.IndustryIdVe,
                GenderId = model.GenderIdVe,
                NationalCode = model.NationalCodeVe,
                LocCountryId = model.LocCountryIdVe,
                LocStateId = model.LocStateIdVe,
                LocCityId = model.LocCityIdVe,
                PostalCode = model.PostalCodeVe,
                Address = model.AddressVe,
                PhoneNo = model.PhoneNoVe,
                MobileNo = model.MobileNoVe,
                Email = model.EmailVe,
                WebSite = model.WebSiteVe,
                IdNumber = model.IdNumberVe,
                IdDate = model.IdDateVe,
                VATInclude = model.VATIncludeVe,
                VATAreaId = model.VATAreaIdVe,
                VATEnable = model.VATEnableVe,
                TaxCode = model.TaxCodeVe,
                IsActive = model.IsActiveVe,
                JobTitle = model.JobTitleVe,
                BrandName = model.BrandNameVe,
                PersonTitleId = model.PersonTitleIdVe,
                InsurerId = model.InsurerIdVe,
                InsuranceNo = model.InsuranceNoVe != "" ? model.InsuranceNoVe : "",
                model.CompanyId,
                AccountDetailVendorListGroupJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(SaveVendor model)
    {
        var validateResult = new List<string>();

        validateResult = await Validate(model, OperationType.Insert);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultQuery();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        #region accountDetailVendorList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberVe,
            AgentFullName = model.AgentFullNameVe,
            JobTitle = model.JobTitleVe,
            BrandName = model.BrandNameVe != "" || model.BrandNameVe != null ? model.BrandNameVe : "",
            PartnerTypeId = model.PartnerTypeIdVe,
            VATInclude = model.VATIncludeVe,
            VATEnable = model.VATEnableVe,
            NationalCode = model.NationalCodeVe != "" || model.NationalCodeVe != null ? model.NationalCodeVe : "",
            PersonGroupId = model.VendorGroupIdVe,
            PersonGroupName = model.VendorGroupIdVe > 0
                ? await _personGroupRepository.PersonGroup_GetName(Convert.ToInt32(model.VendorGroupIdVe))
                : ""
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Vendor_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                IndustryId = model.IndustryIdVe == 0 ? null : model.IndustryIdVe,
                VendorGroupId = model.VendorGroupIdVe,
                FirstName = model.FirstNameVe,
                LastName = model.LastNameVe,
                AgentFullName = model.AgentFullNameVe,
                PartnerTypeId = model.PartnerTypeIdVe,
                GenderId = model.GenderIdVe,
                NationalCode = model.NationalCodeVe,
                LocCountryId = model.LocCountryIdVe,
                LocStateId = model.LocStateIdVe,
                LocCityId = model.LocCityIdVe,
                PostalCode = model.PostalCodeVe,
                Address = model.AddressVe,
                PhoneNo = model.PhoneNoVe,
                MobileNo = model.MobileNoVe,
                Email = model.EmailVe,
                WebSite = model.WebSiteVe,
                IdNumber = model.IdNumberVe,
                IdDate = model.IdDateVe,
                VATInclude = model.VATIncludeVe,
                VATAreaId = model.VATAreaIdVe,
                VATEnable = model.VATEnableVe,
                TaxCode = model.TaxCodeVe,
                IsActive = model.IsActiveVe,
                JobTitle = model.JobTitleVe,
                BrandName = model.BrandNameVe,
                PersonTitleId = model.PersonTitleIdVe,
                InsurerId = model.InsurerIdVe,
                InsuranceNo = model.InsuranceNoVe != "" ? model.InsuranceNoVe : "",
                model.CompanyId,
                AccountDetailVendorListGroupJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<string>> Validate(SaveVendor model, OperationType operationType)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(() =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
                if (model.VATIncludeVe.Value && (model.VATAreaIdVe == 0 || model.VATEnableVe == null))
                {
                    if (model.VATAreaIdVe == 0)
                        error.Add("مقدار VAT منطقه اجباری است");
                    else if (model.VATEnableVe == null)
                        error.Add("مقدار اعتبار VAT اجباری است");
                }
        });

        return error;
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
                TableName = "pu.Vendor",
                RecordId = keyvalue,
                CompanyId,
                Filter = $"CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term != null && term.Trim().Length != 0)
            filter =
                $"Id='{(int.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term}%' AND IsActive = 1 AND CompanyId={companyId}";
        else
            filter = "IsActive = 1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "pu.Vendor",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term != null && term.Trim().Length != 0)
            filter =
                $"Id='{(int.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term}%' AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "pu.Vendor",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
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
                    TableName = "pu.Vendor",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> VendorAccountDetailGetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Vendor_AccountDetail_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<VendorGetRecordForm>> GetRecordById(int id, int CompanyId)
    {
        var result = new MyResultPage<VendorGetRecordForm>();
        var vendor = new VendorGetRecord();
        result.Data = new VendorGetRecordForm();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            vendor = await conn.QueryFirstOrDefaultAsync<VendorGetRecord>(sQuery, new
            {
                TableName = "pu.Vendor",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        if (vendor != null)
        {
            result.Data.Id = vendor.Id;
            result.Data.IndustryIdVe = vendor.IndustryId;
            result.Data.VendorGroupIdVe = vendor.PersonGroupId;
            result.Data.FirstNameVe = vendor.FirstName;
            result.Data.LastNameVe = vendor.LastName;
            result.Data.AgentFullNameVe = vendor.AgentFullName;
            result.Data.PartnerTypeIdVe = vendor.PartnerTypeId;
            result.Data.GenderIdVe = vendor.GenderId;
            result.Data.NationalCodeVe = vendor.NationalCode;
            result.Data.LocCountryIdVe = vendor.LocCountryId;
            result.Data.LocStateIdVe = vendor.LocStateId;
            result.Data.LocCityIdVe = vendor.LocCityId;
            result.Data.PostalCodeVe = vendor.PostalCode;
            result.Data.AddressVe = vendor.Address;
            result.Data.PhoneNoVe = vendor.PhoneNo;
            result.Data.MobileNoVe = vendor.MobileNo;
            result.Data.EmailVe = vendor.Email;
            result.Data.WebSiteVe = vendor.WebSite;
            result.Data.JobTitleVe = vendor.JobTitle;
            result.Data.BrandNameVe = vendor.BrandName;
            result.Data.PersonTitleIdVe = vendor.personTitleId;
            result.Data.IdNumberVe = vendor.IdNumber;
            result.Data.IdDateVe = vendor.IdDate;
            result.Data.VATIncludeVe = vendor.VATInclude;
            result.Data.VATAreaIdVe = vendor.VATAreaId;
            result.Data.VATEnableVe = vendor.VATEnable;
            result.Data.TaxCodeVe = vendor.TaxCode;
            result.Data.IsActiveVe = vendor.IsActive;
            result.Data.InsurerIdVe = vendor.InsurerId;
            result.Data.InsuranceNoVe = vendor.InsuranceNo;

            #region accountDetailVendorList

            var accountDetailViewModel = new
            {
                vendor.IdNumber,
                vendor.AgentFullName,
                vendor.JobTitle,
                BrandName = vendor.BrandName != "" || vendor.BrandName != null ? vendor.BrandName : "",
                vendor.PartnerTypeId,
                vendor.VATInclude,
                vendor.VATEnable,
                NationalCode = vendor.NationalCode != "" || vendor.NationalCode != null ? vendor.NationalCode : "",
                vendor.PersonGroupId,
                PersonGroupName = vendor.PersonGroupId > 0
                    ? await _personGroupRepository.PersonGroup_GetName(vendor.PersonGroupId)
                    : ""
            };

            result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion
        }

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
                    TableName = "pu.Vendor",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }

    public async Task<string> GetaccountDetailEnableVat(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "pu.Vendor",
                    ColumnName = "VATEnable",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}