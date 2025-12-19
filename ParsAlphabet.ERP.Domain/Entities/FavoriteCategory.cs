using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FavoriteCategory
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }

    public byte? AdmissionTypeId { get; set; }

    public byte? ServiceType { get; set; }
}
