using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PostingGroupAccount
{
    public int Id { get; set; }

    public int? IdentityId { get; set; }

    public short? StageId { get; set; }

    public int? IdentityLineId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? InOut { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
