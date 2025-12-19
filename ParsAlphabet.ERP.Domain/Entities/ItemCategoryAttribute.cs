using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ItemCategoryAttribute
{
    public short Id { get; set; }

    public short? ItemCategoryId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string ItemAttributeLineIds { get; set; }
}
