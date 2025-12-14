using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AttenderAssistant
{
    public int AttenderId { get; set; }

    public int UserId { get; set; }

    public int? CompanyId { get; set; }
}
