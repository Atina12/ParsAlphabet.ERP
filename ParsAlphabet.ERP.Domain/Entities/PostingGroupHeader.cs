using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PostingGroupHeader
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public short? StageId { get; set; }

    public byte? PostingGroupTypeId { get; set; }

    public int? CompanyId { get; set; }
}
