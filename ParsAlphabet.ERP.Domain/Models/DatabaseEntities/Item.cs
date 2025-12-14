using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Item
{
    public int Id { get; set; }

    public byte ItemTypeId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? CategoryId { get; set; }

    public short? UnitId { get; set; }

    public bool? Vatenable { get; set; }

    public short? Vatid { get; set; }

    public bool? PriceIncludingVat { get; set; }

    public bool? BarcodeMandatory { get; set; }

    public DateOnly? SubscriptionFromDate { get; set; }

    public DateOnly? SubscriptionToDate { get; set; }

    public bool? UnLimited { get; set; }

    public short? PayrollTaxId { get; set; }

    public bool? ExclusiveSupplier { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
