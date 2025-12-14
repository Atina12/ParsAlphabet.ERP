using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CheckUpdate
{
    public int Id { get; set; }

    public string Description { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
