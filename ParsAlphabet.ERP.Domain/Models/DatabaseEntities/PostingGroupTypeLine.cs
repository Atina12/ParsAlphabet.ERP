using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PostingGroupTypeLine
{
    public byte Id { get; set; }

    public byte? HeaderId { get; set; }

    public string Name { get; set; }

    public byte? IsDecimal { get; set; }
}
