using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferDrugOrderedLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public DateTime? AdministrationDateTime { get; set; }

    public string DrugGenericName { get; set; }

    public short? ProductId { get; set; }

    public decimal? Dosage { get; set; }

    public short? DosageUnitId { get; set; }

    public short? FrequencyId { get; set; }

    public short? RouteId { get; set; }

    public decimal? LongTerm { get; set; }

    public short? LongTermUnitId { get; set; }

    public string Description { get; set; }

    public int? TotalNumber { get; set; }

    public short? ShapeId { get; set; }
}
