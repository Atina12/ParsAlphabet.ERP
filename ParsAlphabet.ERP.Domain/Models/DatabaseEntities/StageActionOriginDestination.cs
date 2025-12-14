using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageActionOriginDestination
{
    public long Id { get; set; }

    public int? OriginTransactionId { get; set; }

    public int? OriginWorkflowId { get; set; }

    public short? OriginStageId { get; set; }

    public byte? OriginWorkflowCategoryId { get; set; }

    public int? DestinationTransactionId { get; set; }

    public int? DestinationWorkflowId { get; set; }

    public short? DestinationStageId { get; set; }

    public byte? DestinationWorkflowCategoryId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
