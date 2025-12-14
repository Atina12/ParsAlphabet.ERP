using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CurrencyExchange
{
    public byte Id { get; set; }

    public byte? CurrencyId { get; set; }

    public DateOnly? UpdateDate { get; set; }

    public decimal? PurchaseRate { get; set; }

    public decimal? SalesRate { get; set; }

    public byte? CompanyId { get; set; }
}
