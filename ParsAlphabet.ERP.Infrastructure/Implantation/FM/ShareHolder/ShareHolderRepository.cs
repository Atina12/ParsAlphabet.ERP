using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.ShareHolder;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.ShareHolder;

public class ShareHolderRepository :
    BaseRepository<ShareHolderModel, int, string>,
    IBaseRepository<ShareHolderModel, int, string>
{
    private readonly PersonGroupRepository _personGroupRepository;

    public ShareHolderRepository(IConfiguration config, PersonGroupRepository personGroupRepository)
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
                    IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "fullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "partnerTypeName", Title = "حقیقی/حقوقی", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2static",
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
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "shareHolderGroup", Title = "گروه سهامداران", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "nationalCode", Title = "شماره/ شناسه ملی", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsPersian = true, IsDtParameter = true, IsFilterParameter = true, Width = 7
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
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true }
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
                p.ShareHolderGroup,
                p.NationalCode,
                p.MobileNo,
                p.TaxCode,
                VATEnable = p.VATEnable ? "دارد" : "ندارد",
                VATInclude = p.VATInclude ? "بلی" : "خیر",
                p.JobTitle,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<ShareHolderGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ShareHolderGetPage>>();
        result.Data = new List<ShareHolderGetPage>();

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
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
        parameters.Add("PartnerTypeId",
            model.Filters.Any(x => x.Name == "partnerTypeName")
                ? model.Filters.FirstOrDefault(x => x.Name == "partnerTypeName").Value
                : null);
        parameters.Add("NationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("PhoneNo",
            model.Filters.Any(x => x.Name == "phoneNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "phoneNo").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_ShareHolder_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ShareHolderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(SaveShareHolder model)
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

        #region accountDetailShareHolderList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberSh,
            BrandName = model.BrandNameSh,
            PartnerTypeId = model.PartnerTypeIdSh,
            VATInclude = model.VATIncludeSh,
            VATEnable = model.VATEnableSh,
            NationalCode = model.NationalCodeSh != null ? model.NationalCodeSh : "",
            ShareHolderGroupId = model.ShareHolderGroupIdSh,
            PersonGroupName = await _personGroupRepository.PersonGroup_GetName(model.ShareHolderGroupIdSh)
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_ShareHolder_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                FirstName = model.FirstNameSh,
                LastName = model.LastNameSh,
                AgentFullName = model.AgentFullNameSh,
                PartnerTypeId = model.PartnerTypeIdSh,
                ShareHolderGroupId = model.ShareHolderGroupIdSh,
                IndustryId = model.IndustryIdSh == 0 ? null : model.IndustryIdSh,
                GenderId = model.GenderIdSh,
                NationalCode = model.NationalCodeSh,
                LocCountryId = model.LocCountryIdSh,
                LocStateId = model.LocStateIdSh,
                LocCityId = model.LocCityIdSh,
                PostalCode = model.PostalCodeSh,
                Address = model.AddressSh,
                PhoneNo = model.PhoneNoSh,
                MobileNo = model.MobileNoSh,
                Email = model.EmailSh,
                WebSite = model.WebSiteSh,
                IdNumber = model.IdNumberSh,
                IdDate = model.IdDateSh,
                VATInclude = model.VATIncludeSh,
                VATAreaId = model.VATAreaIdSh,
                VATEnable = model.VATEnableSh,
                TaxCode = model.TaxCodeSh,
                IsActive = model.IsActiveSh,
                JobTitle = model.JobTitleSh,
                BrandName = model.BrandNameSh,
                PersonTitleId = model.PersonTitleIdSh,
                model.CompanyId,
                AccountDetailShareHolderJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(SaveShareHolder model)
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

        #region accountDetailShareHolderList

        var accountDetailViewModel = new
        {
            IdNumber = model.IdNumberSh,
            BrandName = model.BrandNameSh,
            PartnerTypeId = model.PartnerTypeIdSh,
            VATInclude = model.VATIncludeSh,
            VATEnable = model.VATEnableSh,
            NationalCode = model.NationalCodeSh != null ? model.NationalCodeSh : "",
            ShareHolderGroupId = model.ShareHolderGroupIdSh,
            PersonGroupName = await _personGroupRepository.PersonGroup_GetName(model.ShareHolderGroupIdSh)
        };

        #endregion

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_ShareHolder_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                IndustryId = model.IndustryIdSh == 0 ? null : model.IndustryIdSh,
                ShareHolderGroupId = model.ShareHolderGroupIdSh,
                FirstName = model.FirstNameSh,
                LastName = model.LastNameSh,
                AgentFullName = model.AgentFullNameSh,
                PartnerTypeId = model.PartnerTypeIdSh,
                GenderId = model.GenderIdSh,
                NationalCode = model.NationalCodeSh,
                LocCountryId = model.LocCountryIdSh,
                LocStateId = model.LocStateIdSh,
                LocCityId = model.LocCityIdSh,
                PostalCode = model.PostalCodeSh,
                Address = model.AddressSh,
                PhoneNo = model.PhoneNoSh,
                MobileNo = model.MobileNoSh,
                Email = model.EmailSh,
                WebSite = model.WebSiteSh,
                IdNumber = model.IdNumberSh,
                IdDate = model.IdDateSh,
                VATInclude = model.VATIncludeSh,
                VATAreaId = model.VATAreaIdSh,
                VATEnable = model.VATEnableSh,
                TaxCode = model.TaxCodeSh,
                IsActive = model.IsActiveSh,
                JobTitle = model.JobTitleSh,
                BrandName = model.BrandNameSh,
                PersonTitleId = model.PersonTitleIdSh,
                model.CompanyId,
                AccountDetailShareHolderJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<string>> Validate(SaveShareHolder model, OperationType operationType)
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
                if (model.VATIncludeSh.Value && (model.VATAreaIdSh == 0 || model.VATEnableSh == null))
                {
                    if (model.VATAreaIdSh == 0)
                        error.Add("مقدار VAT منطقه اجباری است");
                    else if (model.VATEnableSh == null)
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
                TableName = "fm.ShareHolder",
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
                    TableName = "fm.ShareHolder",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ShareHolderAccountDetailGetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_ShareHolder_AccountDetail_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<ShareHolderGetRecordForm>> GetRecordById(int id, int CompanyId)
    {
        var result = new MyResultPage<ShareHolderGetRecordForm>();
        var vendor = new ShareHolderGetRecord();
        result.Data = new ShareHolderGetRecordForm();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            vendor = await conn.QueryFirstOrDefaultAsync<ShareHolderGetRecord>(sQuery, new
            {
                TableName = "fm.ShareHolder",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        if (vendor != null)
        {
            result.Data.Id = vendor.Id;
            result.Data.IndustryIdSh = vendor.IndustryId;
            result.Data.ShareHolderGroupIdSh = vendor.PersonGroupId;
            result.Data.FirstNameSh = vendor.FirstName;
            result.Data.LastNameSh = vendor.LastName;
            result.Data.AgentFullNameSh = vendor.AgentFullName;
            result.Data.PartnerTypeIdSh = vendor.PartnerTypeId;
            result.Data.GenderIdSh = vendor.GenderId;
            result.Data.NationalCodeSh = vendor.NationalCode;
            result.Data.LocCountryIdSh = vendor.LocCountryId;
            result.Data.LocStateIdSh = vendor.LocStateId;
            result.Data.LocCityIdSh = vendor.LocCityId;
            result.Data.PostalCodeSh = vendor.PostalCode;
            result.Data.AddressSh = vendor.Address;
            result.Data.PhoneNoSh = vendor.PhoneNo;
            result.Data.MobileNoSh = vendor.MobileNo;
            result.Data.EmailSh = vendor.Email;
            result.Data.WebSiteSh = vendor.WebSite;
            result.Data.JobTitleSh = vendor.JobTitle;
            result.Data.BrandNameSh = vendor.BrandName;
            result.Data.PersonTitleIdSh = vendor.personTitleId;
            result.Data.IdNumberSh = vendor.IdNumber;
            result.Data.IdDateSh = vendor.IdDate;
            result.Data.VATIncludeSh = vendor.VATInclude;
            result.Data.VATAreaIdSh = vendor.VATAreaId;
            result.Data.VATEnableSh = vendor.VATEnable;
            result.Data.TaxCodeSh = vendor.TaxCode;
            result.Data.IsActiveSh = vendor.IsActive;

            #region accountDetailContactList

            var accountDetailViewModel = new
            {
                IdNumber = result.Data.IdNumberSh,
                BrandName = result.Data.BrandNameSh,
                PartnerTypeId = result.Data.PartnerTypeIdSh,
                VATInclude = result.Data.VATIncludeSh,
                VATEnable = result.Data.VATEnableSh,
                NationalCode = result.Data.NationalCodeSh != null ? result.Data.NationalCodeSh : "",
                ShareHolderGroupId = result.Data.ShareHolderGroupIdSh,
                PersonGroupName = result.Data.ShareHolderGroupIdSh > 0
                    ? await _personGroupRepository.PersonGroup_GetName(result.Data.ShareHolderGroupIdSh)
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
                    TableName = "fm.ShareHolder",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }
}