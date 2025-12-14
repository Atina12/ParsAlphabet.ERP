using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionReferCareActionLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public DateTime? StartDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }

    /// <summary>
    /// ارتباط با جدول RVU
    /// </summary>
    public short? ActionNameId { get; set; }

    public string ActionDescription { get; set; }

    public decimal? TimeTaken { get; set; }

    public short? TimeTakenUnitId { get; set; }
}
