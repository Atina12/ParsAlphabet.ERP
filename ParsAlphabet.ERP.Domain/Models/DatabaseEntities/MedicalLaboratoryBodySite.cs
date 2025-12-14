using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MedicalLaboratoryBodySite
{
    public int Id { get; set; }

    public int? MedicalLaboratoryId { get; set; }

    /// <summary>
    /// کدینگ Snomedct وقتی فیلد IsBodySite یک باشد
    /// </summary>
    public int? BodySiteId { get; set; }

    /// <summary>
    /// کدینگ Snomedct وقتی فیلد IsLaterality یک باشد
    /// </summary>
    public int? LateralityId { get; set; }
}
