using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PostingGroupLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public byte? PostingGroupTypeId { get; set; }

    public byte? CompanyId { get; set; }
}
