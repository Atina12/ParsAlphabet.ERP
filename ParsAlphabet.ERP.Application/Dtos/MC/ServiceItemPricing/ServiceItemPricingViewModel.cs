namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;

public class ServiceItemPricingGetPage
{
    public int MedicalItemPriceId { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }

    public string Item => IdAndTitle(ItemId, ItemName);

    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);
    public int InsurerTypeId { get; set; }
    public string InsurerTypeName { get; set; }
    public string InsurerType => IdAndTitle(InsurerTypeId, InsurerTypeName);
    public int MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);
    public decimal BeginPrice { get; set; }
    public decimal EndPrice { get; set; }
    public int PricingModelId { get; set; }

    public string PricingModeName => GetEnumDescription((EnumpriceType)PricingModelId);


    public string PricingModelName { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class NewGetServiceItemPricingGetPage : NewGetPageViewModel
{
    public int? MedicalItemPriceId { get; set; }
    public int? ItemId { get; set; }
    public byte? ItemTypeId { get; set; }
    public byte? InsurerTypeId { get; set; }
    public int? MedicalSubjectId { get; set; }
    public bool IncludeAll { get; set; }
}

public class ServiceItemPricingGetRecord
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public byte ItemTypeId { get; set; }
    public byte InsureTyperId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public byte PricingModelId { get; set; }
    public decimal BeginPrice { get; set; }
    public decimal EndPrice { get; set; }
    public bool IsActive { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class UpdateServicePriceUpd : CompanyViewModel
{
    public int? ServiceTypeId { get; set; }
    public byte? MedicalSubjectId { get; set; }
    public byte? InsurerTypeId { get; set; }
    public string Attribute { get; set; }
    public decimal? ProfessionalPrice { get; set; }
    public decimal? TechnicalPrice { get; set; }
    public decimal? AnesthesiaPrice { get; set; }
    public decimal? CompPrice { get; set; }
    public bool HasNationalCode { get; set; }
    public int? FromNationalCode { get; set; }
    public int? ToNationalCode { get; set; }
    public int? FromServiceId { get; set; }
    public int? ToServiceId { get; set; }
    public bool IsPreview { get; set; }
    public bool IncludeAll { get; set; }
    public int UserId { get; set; }
}

public class UpdateInsurerPrice : CompanyViewModel
{
    public byte ItemTypeId { get; set; }
    public byte? InsurerTypeId { get; set; }
    public int? InsurerId { get; set; }
    public int? InsurerLineId { get; set; }
    public string ServiceTypeId { get; set; }
    public string Attribute { get; set; }
    public byte? InsurerPriceCalculationMethodId { get; set; }
    public decimal? ProfessionalPrice { get; set; }
    public decimal? TechnicalPrice { get; set; }
    public decimal? AnesthesiaPrice { get; set; }
    public decimal? CompPrice { get; set; }
    public decimal? SharePer { get; set; }
    public int? FromNationalCode { get; set; }
    public int? ToNationalCode { get; set; }
    public int? FromServiceId { get; set; }
    public int? ToServiceId { get; set; }
    public bool HasNationalCode { get; set; }
    public bool IsPreview { get; set; }
    public int UserId { get; set; }
}

public class UpdateItemPrice : CompanyViewModel
{
    public int? FromItemId { get; set; }
    public int? ToItemId { get; set; }
    public int? MedicalSubjectId { get; set; }
    public byte? InsurerTypeId { get; set; }
    public int? ItemCategoryId { get; set; }
    public byte? PricingModelId { get; set; }
    public decimal BeginPrice { get; set; }
    public decimal? EndPrice { get; set; }
    public bool IsPreview { get; set; }
    public bool IncludeAll { get; set; }
    public int UserId { get; set; }
}

public class InsuranceDuplicate : CompanyViewModel
{
    public byte OperationType { get; set; }
    public int? ItemId { get; set; }
    public byte ItemTypeId { get; set; }
    public int FromInsurerId { get; set; }
    public int? FromInsurerLineId { get; set; }
    public byte FromInsurerPriceCalculationMethodId { get; set; }
    public string FromInsurerSharePer { get; set; }
    public int? ToInsurerId { get; set; }
    public int? ToInsurerLineId { get; set; }
    public decimal? ToInsurerSharePer { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public bool IsPreview { get; set; }
    public int UserId { get; set; }
}

public class MedicalItemPriceDuplicate
{
    public byte OperationType { get; set; }
    public int? ItemId { get; set; }
    public byte ItemTypeId { get; set; }
    public byte FromMedicalSubjectId { get; set; }
    public byte FromInsurerTypeId { get; set; }
    public byte ToMedicalSubjectId { get; set; }
    public byte ToInsurerTypeId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
    public bool IsPreview { get; set; }
}

public class ServiceItemPriceSendHistoryGetList
{
    public int LocalId { get; set; }
    public int? CentralId { get; set; }
    public Guid SendHistoryId { get; set; }
    public int ItemId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public decimal BeginPrice { get; set; }
    public short CompanyId { get; set; }
}

public class MedicalItemPriceSendHistoryGetpage
{
    public int Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public byte MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);
    public decimal BeginPrice { get; set; }
    public short CompanyId { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int SendUserId { get; set; }
    public string SendUserFullName { get; set; }
    public string SendUser => IdAndTitle(SendUserId, SendUserFullName);
    public DateTime SendDateTime { get; set; }
    public string SendDateTimePersian => SendDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class MedicalItemPriceGetCentral
{
    public int CentralId { get; set; }
    public int ItemId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public decimal BeginPrice { get; set; }

    public short CompanyId { get; set; }
}

public class ResultDuplicateMedicalItemPrice : MyResultStatus
{
    public int MedicalItemPriceId { get; set; }
    public Guid? SendHistoryId { get; set; }
}

public class ResultValidateInsurerPriceMedicalItemPrice
{
    public int InsurerPriceId { get; set; }
    public int InsurerId { get; set; }
    public int InsurerLineId { get; set; }
    public int MedicalItemPriceId { get; set; }
}

public class ResultValidateAttenderServiceMedicalItemPrice
{
    public int AttenderId { get; set; }
    public int ServiceId { get; set; }
    public int AttenderServiceId { get; set; }
    public int MedicalItemPriceId { get; set; }
}

public class ResultValidateVendorItemMedicalItemPrice
{
    public int VendorItemPriceId { get; set; }
    public int VendorId { get; set; }
    public int ItemId { get; set; }
}

public class ResultUpdateServicePrice : MyResultStatus
{
    public int MedicalItemPriceId { get; set; }
    public Guid? SendHistoryId { get; set; }
}

public class ResultUpdateInsurerPrice : MyResultStatus
{
    public int InsurerPriceId { get; set; }
    public Guid? SendHistoryId { get; set; }
}

public class ResultSaveMedicalItemPrice : MyResultStatus
{
    public Guid? SendHistoryId { get; set; }
}

public class ValidationModel
{
    public int? MedicalItemPriceId { get; set; }
    public int? ItemId { get; set; }
    public byte? ItemTypeId { get; set; }
    public byte? MedicalSubjectId { get; set; }
    public byte? InsurerTypeId { get; set; }
    public string Attribute { get; set; }
    public int? ServiceTypeId { get; set; }
    public bool? HasNationalCode { get; set; }
    public int? FromNationalCode { get; set; }
    public int? ToNationalCode { get; set; }
    public int? FromServiceId { get; set; }
    public int? ToServiceId { get; set; }
}