using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItem;

public class AdmissionItemGetPage
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public byte AdmissionMasterWorkflowCategoryId { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => BranchId == 0 ? "" : $"{BranchId} - {BranchName}";
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);
    public short SumQty { get; set; }
    public decimal NetAmount { get; set; }
    public decimal CashAmount { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public byte MedicalRevenue { get; set; }

    public bool Conflict => NetAmount != CashAmount;
}

public class AdmissionItemDisplay
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public byte AdmissionMasterActionId { get; set; }
    public string AdmissionMasterActionName { get; set; }

    public short AdmissionMasterStageId { get; set; }
    public string AdmissionMasterStageName { get; set; }

    public short AdmissionMasterWorkflowId { get; set; }
    public string AdmissionMasterWorkflowName { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }

    public byte MedicalSubjectId { get; set; }
    public byte ReferralTypeId { get; set; }
    public string ReferralTypeName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public int PatientId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PatientFullName { get; set; }
    public byte GenderId { get; set; }
    public string GenderName { get; set; }
    public string CountryName { get; set; }
    public short CountryId { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string IdCardNumber { get; set; }
    public string PostalCode { get; set; }
    public string JobTitle { get; set; }
    public byte MaritalStatusId { get; set; }
    public string MaritalStatusName { get; set; }
    public byte EducationLevelId { get; set; }
    public string EducationLevelName { get; set; }

    public byte MedicalRevenue { get; set; }
    public string PhoneNo { get; set; }
    public string PatientFatherFirstName { get; set; }

    public string Address { get; set; }
    public DateTime? BirthDate { get; set; }
    public DateTime PatientBirthDate { get; set; }
    public string PatientBirthDatePersian => PatientBirthDate.ToPersianDateString();

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }

    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public short CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }

    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string JsonStrItemLine { get; set; }

    public List<AdmissionLineItemDisplay> AdmissionLineList =>
        JsonConvert.DeserializeObject<List<AdmissionLineItemDisplay>>(JsonStrItemLine);
}

public class AdmissionLineItemDisplay
{
    public short ItemId { get; set; }
    public string ItemName { get; set; }
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public short Qty { get; set; }

    public decimal DiscountAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }
    public short ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }

    public byte PriceTypeId { get; set; }
    public string PriceTypeName { get; set; }
    public decimal CommissionPrice { get; set; }
    public int VendorId { get; set; }
    public string VendorName { get; set; }
    public decimal BasicPrice { get; set; }
    public decimal BasicItemPrice { get; set; }
    public byte BasicPercentage { get; set; }
    public byte BasicCalculationMethodId { get; set; }


    public decimal CompPrice { get; set; }
    public decimal CompItemPrice { get; set; }
    public byte CompPercentage { get; set; }
    public byte CompCalculationMethodId { get; set; }

    public decimal ThirdPartyPrice { get; set; }
    public decimal ThirdPartyItemPrice { get; set; }
    public byte ThirdPartyPercentage { get; set; }
    public byte ThirdPartyCalculationMethodId { get; set; }

    public decimal DiscountPrice { get; set; }
    public decimal DiscountItemPrice { get; set; }
    public byte DiscountPercentage { get; set; }
    public byte DiscountCalculationMethodId { get; set; }

    public byte VATPercentage { get; set; }
    public string AttributeIds { get; set; }
}

public class GetCalculateItemPrice : CompanyViewModel
{
    public int ItemId { get; set; }
    public byte Qty { get; set; }
    public decimal Price { get; set; }
    public int? BasicInsurerId { get; set; }
    public short? BasicInsurerLineId { get; set; }
    public int? CompInsurerId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyId { get; set; }
    public int? DiscountInsurerId { get; set; }
    public byte MedicalSubjectId { get; set; }
}

public class CalculateItemPrice
{
    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public short UnitId { get; set; }
    public string UnitName { get; set; }
    public byte PricingModelId { get; set; }
    public string PricingModelName { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }


    public decimal BasicPrice { get; set; }
    public decimal BasicItemPrice { get; set; }
    public decimal BasicItemAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public byte BasicPercentage { get; set; }
    public byte BasicCalculationMethodId { get; set; }


    public decimal CompPrice { get; set; }
    public decimal CompItemPrice { get; set; }
    public decimal CompShareAmount { get; set; }
    public byte CompPercentage { get; set; }
    public byte CompCalculationMethodId { get; set; }

    public decimal ThirdPartyPrice { get; set; }
    public decimal ThirdPartyItemPrice { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public byte ThirdPartyPercentage { get; set; }
    public byte ThirdPartyCalculationMethodId { get; set; }

    public decimal DiscountPrice { get; set; }
    public decimal DiscountItemPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public byte DiscountPercentage { get; set; }
    public byte DiscountCalculationMethodId { get; set; }

    public byte ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }


    public int VendorId { get; set; }
    public string VendorName { get; set; }

    public int CompanyId { get; set; }
    public string CompanyName { get; set; }


    public byte VendorCommissionType { get; set; }
    public int VendorCommissionValue { get; set; }
    public int VendorCommissionPrice { get; set; }
    public decimal VendorCommissionAmount { get; set; } = 0;

    public byte VATPercentage { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal BasicComplementShareAmount { get; set; }
    public decimal NetAmount { get; set; }

    public short Status { get; set; }
    public string StatusMessage { get; set; }
}

public class AdmissionItemPrint
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public int BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchAddress { get; set; }
    public string BranchPhone1 { get; set; }
    public string BranchPhone2 { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string AlterDate => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string AlterTime => CreateDateTime.ToPersianDateString("{3}:{4}:{5}");
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public short Qty { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public string AdmissionCashInfoJSON { get; set; }

    public List<AdmissionCashInfo> AdmissionCashInfoList =>
        JsonConvert.DeserializeObject<List<AdmissionCashInfo>>(AdmissionCashInfoJSON);

    public string JsonBranchLine { get; set; }

    public List<BranchLineInfoPrint> BranchLineInfoList
        => JsonConvert.DeserializeObject<List<BranchLineInfoPrint>>(JsonBranchLine);
}

public class GetAdmissionSaleItem
{
    public int? VendorId { get; set; }
    public string FromWorkDayDatePersian { get; set; }
    public DateTime FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime().Value;
    public string ToWorkDayDatePersian { get; set; }
    public DateTime ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime().Value;
}