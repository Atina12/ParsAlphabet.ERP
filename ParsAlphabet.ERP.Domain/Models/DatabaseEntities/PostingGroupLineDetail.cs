using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PostingGroupLineDetail
{
    public int Id { get; set; }

    public int? PostingGroupLineId { get; set; }

    public byte? PostingGroupTypeLineId { get; set; }

    public int? StageIdentityId { get; set; }

    public byte? StageIdentityTypeId { get; set; }

    public string StageIdentityTypeName { get; set; }

    public short? ItemCategoryId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? AccountDetailId { get; set; }

    public short? BranchId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? ModifiedDateTime { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
