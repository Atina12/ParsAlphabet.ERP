using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class OpenAccountType
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActiveAdm { get; set; }

    public bool? IsActiveSale { get; set; }

    public bool? IsActiveAdmClose { get; set; }
}
