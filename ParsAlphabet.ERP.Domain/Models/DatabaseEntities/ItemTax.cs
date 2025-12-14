using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemTax
{
    public string Id { get; set; }

    public string Type { get; set; }

    public string Date { get; set; }

    public string RunDate { get; set; }

    public string ExpirationDate { get; set; }

    public string SpecialOrGeneral { get; set; }

    public string TaxableOrFree { get; set; }

    public string Vat { get; set; }

    public string VatCustomPurposes { get; set; }

    public string DescriptionOfId { get; set; }

    public int ItemTypeId { get; set; }

    public long Id1 { get; set; }
}
