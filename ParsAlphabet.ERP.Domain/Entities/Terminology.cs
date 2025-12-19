using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Terminology
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEn { get; set; }

    public string TableName { get; set; }
}
