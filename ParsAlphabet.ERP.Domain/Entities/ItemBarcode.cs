using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ItemBarcode
{
    public int Id { get; set; }

    public int? ItemId { get; set; }

    public string AttributeIds { get; set; }

    public string Barcode { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
