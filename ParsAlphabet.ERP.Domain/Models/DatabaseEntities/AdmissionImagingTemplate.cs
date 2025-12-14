using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionImagingTemplate
{
    public int Id { get; set; }

    public string Subject { get; set; }

    public int? AttenderId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string Template { get; set; }

    public int? CompanyId { get; set; }

    public string Code { get; set; }

    public int? UsedCount { get; set; }
}
