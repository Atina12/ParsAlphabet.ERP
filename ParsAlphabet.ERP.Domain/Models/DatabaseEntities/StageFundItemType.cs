using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageFundItemType
{
    public short Id { get; set; }

    public short? StageId { get; set; }

    public byte? FundItemTypeId { get; set; }

    public byte? PostingGroupTypeId { get; set; }

    public byte? FundItemType { get; set; }

    public string FundItemTypeName { get; set; }

    public byte? InOut { get; set; }

    public short? PreviousStageId { get; set; }

    public bool? BankReport { get; set; }

    public int? WorkflowId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
