using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class EducationLevel
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    public ICollection<Patient> Patients { get; set; }

}
