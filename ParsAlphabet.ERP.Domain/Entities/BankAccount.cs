using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class BankAccount
{
    public int Id { get; set; }

    public short? BankId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public int? BankAccountCategoryId { get; set; }

    public int? BranchNo { get; set; }

    public string BranchName { get; set; }

    public string AccountNo { get; set; }

    public int? LanguageId { get; set; }

    public short? LocCountryId { get; set; }

    public short? LocStateId { get; set; }

    public short? LocCityId { get; set; }

    public string Address { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }

    public string ShebaNo { get; set; }
}
