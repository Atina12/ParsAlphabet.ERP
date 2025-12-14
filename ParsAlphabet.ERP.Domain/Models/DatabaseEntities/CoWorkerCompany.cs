using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CoWorkerCompany
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string Address { get; set; }

    public string PhoneNo { get; set; }
}
