using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ObjectDocumentPostingGroup
{
    public int Id { get; set; }

    public int? ObjectDocumentId { get; set; }

    public int? ObjectDocumentLineId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? AccountDetailId { get; set; }

    public short? NoSeriesId { get; set; }

    public short? CategoryId { get; set; }

    public byte? PostingGroupTypeId { get; set; }

    public byte? PostingGroupTypeLineId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public bool? IsLast { get; set; }
}
