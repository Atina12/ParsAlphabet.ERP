using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Favorite
{
    public int AttenderId { get; set; }

    public int IdentityId { get; set; }

    public byte FavoriteCategoryId { get; set; }

    public byte AdmissionTypeId { get; set; }

    public int CompanyId { get; set; }
}
