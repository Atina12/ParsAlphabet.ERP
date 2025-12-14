using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItem;

public class AdmissionItemModel : CompanyViewModel
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public byte AdmissionMasterActionId { get; set; }
    public int AdmissionMasterWorkflowId { get; set; }
    public short AdmissionMasterStageId { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int WorkflowId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public int? BasicInsurerId { get; set; }
    public int? BasicInsurerLineId { get; set; }
    public int? CompInsurerId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyInsurerId { get; set; }
    public int? DiscountInsurerId { get; set; }
    public byte ReferralTypeId { get; set; }
    public AdmissionPatient AdmissionPatientJSON { get; set; }
    public List<AdmissionLineItemList> AdmissionItemLineList { get; set; } = new();
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public int UserId { get; set; }
    public int PatientId { get; set; }
}

public class AdmissionLineItemList
{
    public short ItemId { get; set; }
    public string AttributeIds { get; set; }
    public short Qty { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }
    public short ContractTypeId { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal VendorCommissionAmount { get; set; }
    public int? VendorId { get; set; }

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
}