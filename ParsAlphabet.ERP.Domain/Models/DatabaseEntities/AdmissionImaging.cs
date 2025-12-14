using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionImaging
{
    public int Id { get; set; }

    public short? BranchId { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }

    public int? AdmissionId { get; set; }

    public int? AttenderId { get; set; }

    public int? PatientId { get; set; }

    public string Content { get; set; }

    public int? BasicInsurerId { get; set; }

    public int? BasicInsurerLineId { get; set; }

    public int? CompInsurerId { get; set; }

    public int? CompInsurerLineId { get; set; }

    public int? ThirdPartyId { get; set; }

    public int? DiscountId { get; set; }

    public string Hid { get; set; }

    public DateOnly? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerNo { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public byte? ActionId { get; set; }

    public int? CompanyId { get; set; }
}
