using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PersonAccount
{
    public int Id { get; set; }

    public int? PersonId { get; set; }

    public byte? PersonTypeId { get; set; }

    public byte? BankId { get; set; }

    public string AccountNo { get; set; }

    public string CardNo { get; set; }

    public string ShebaNo { get; set; }

    public bool? IsDefualt { get; set; }

    public bool? IsActive { get; set; }
}
