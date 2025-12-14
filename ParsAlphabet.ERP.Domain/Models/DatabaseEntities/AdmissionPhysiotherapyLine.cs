using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionPhysiotherapyLine
{
    public int Id { get; set; }

    public long ErequestId { get; set; }

    public string ServiceTarefCode { get; set; }

    public long TarefTechPrice { get; set; }

    public int ServiceQuantity { get; set; }

    public bool Is2K { get; set; }
}
