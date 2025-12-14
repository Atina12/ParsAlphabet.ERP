using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PostingGroupHeaderDetail
{
    public int Id { get; set; }

    public int? PostingGroupHeaderId { get; set; }

    public short? BranchId { get; set; }

    public byte? DocumentTypeId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? AccountDetailId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? ModifiedDateTime { get; set; }

    public bool? IsActive { get; set; }
}
