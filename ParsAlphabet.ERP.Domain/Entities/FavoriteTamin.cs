using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FavoriteTamin
{
    public int Id { get; set; }

    public int? AttenderId { get; set; }

    public int? TaminServicePrescriptionId { get; set; }

    public byte? TaminPrescriptionTypeId { get; set; }

    /// <summary>
    /// 1:GCode,2:WsCode
    /// </summary>
    public byte? CodeTypeId { get; set; }

    public byte? Quantity { get; set; }

    public byte? TaminDrugInstructionId { get; set; }

    public int? TaminDrugAmountId { get; set; }

    public int? TaminDrugUsageId { get; set; }

    public int? Repeat { get; set; }

    public byte? TaminParentOrganId { get; set; }

    public byte? TaminOrganId { get; set; }

    public byte? TaminIllnessId { get; set; }

    public byte? TaminPlanId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
