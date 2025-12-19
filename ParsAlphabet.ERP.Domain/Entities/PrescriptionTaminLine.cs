using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PrescriptionTaminLine
{
    public int Id { get; set; }

    public int? PrescriptionId { get; set; }

    public int? ServiceId { get; set; }

    public int? Quantity { get; set; }

    public int? DrugAmountId { get; set; }

    public string DrugAmountCode { get; set; }

    public string Dose { get; set; }

    public int? Repeat { get; set; }

    public int? DrugInstructionId { get; set; }

    public string DrugInstructionCode { get; set; }

    public byte? DrugUsageId { get; set; }

    public string DrugUsageCode { get; set; }

    public string TaminPrescriptionTypeId { get; set; }

    public string ServiceCode { get; set; }

    public string ParaclinicTareffGroupId { get; set; }

    public short? ParentOrganId { get; set; }

    public short? OrganId { get; set; }

    public byte? PlanId { get; set; }

    public string PlanCode { get; set; }

    public byte? IllnessId { get; set; }

    public DateOnly? DoDate { get; set; }

    public string NoteDetailsEprscId { get; set; }

    public byte? SendResult { get; set; }

    public DateTime? SendDateTime { get; set; }
}
