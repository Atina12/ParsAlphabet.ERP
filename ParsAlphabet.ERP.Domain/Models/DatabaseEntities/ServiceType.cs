using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ServiceType
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string NickName { get; set; }

    public bool? IsDental { get; set; }

    public bool? IsLaboratory { get; set; }

    public bool? IsActive { get; set; }

    public string TerminologyId { get; set; }

    public short? ItemCategoryId { get; set; }

    public short? CostCenterId { get; set; }
}
