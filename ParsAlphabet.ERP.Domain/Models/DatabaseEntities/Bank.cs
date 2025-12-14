using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Bank
{
    public short Id { get; set; }

    public int CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }
    public ICollection<Patient> Patients { get; set; }

}
