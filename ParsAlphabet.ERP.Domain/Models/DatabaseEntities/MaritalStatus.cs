using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MaritalStatus
{
    public byte Id { get; set; }

    public string Name { get; set; }
    public ICollection<Patient> Patients { get; set; }

}
