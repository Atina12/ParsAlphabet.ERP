using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionSale
{
    public int Id { get; set; }

    public int? AdmissionMasterId { get; set; }

    public short StageId { get; set; }

    public byte? ActionId { get; set; }

    public int WorkflowId { get; set; }

    public int PatientId { get; set; }

    public short? CustomerGroupId { get; set; }

    public DateTime CreateDateTime { get; set; }

    public int CreateUserId { get; set; }

    public bool? IsReturn { get; set; }

    public short BranchId { get; set; }

    public int CompanyId { get; set; }

    public decimal? AdmissionAmount { get; set; }

    public int BasicInsurerId { get; set; }

    public short? BasicInsurerLineId { get; set; }

    public int? CompInsurerId { get; set; }

    public short? CompInsurerLineId { get; set; }

    public int? ThirdPartyInsurerId { get; set; }

    public int? DiscountInsurerId { get; set; }

    public byte? ReferralTypeId { get; set; }

    public byte? MedicalSubjectId { get; set; }

    public DateTime? ModifyDateTime { get; set; }

    public int? ModifyUserId { get; set; }
}
