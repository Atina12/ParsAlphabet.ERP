using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TempTaminService
{
    public int Id { get; set; }

    public string SrvName { get; set; }

    public string SrvCode { get; set; }

    public string SrvType { get; set; }

    public string SrvBimSw { get; set; }

    public string WsSrvCode { get; set; }
}
