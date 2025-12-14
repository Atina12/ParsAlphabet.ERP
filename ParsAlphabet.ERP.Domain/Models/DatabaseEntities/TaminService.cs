using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminService
{
    public int Id { get; set; }

    public string TarefCode { get; set; }

    public string PartypeCode { get; set; }

    public int? GovernmentPrice { get; set; }

    public int? FreePrice { get; set; }

    public string ServiceName { get; set; }

    public int? Techprice { get; set; }

    public bool? Ismaster { get; set; }

    public bool? Spiral { get; set; }

    public int? MinAge { get; set; }

    public int? MaxAge { get; set; }

    public string GrpCode { get; set; }

    public string AcceptableGender { get; set; }

    public bool? IsActive { get; set; }
}
