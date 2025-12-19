using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FieldTable
{
    public int Id { get; set; }

    public int? TableId { get; set; }

    public string Name { get; set; }

    public string AliasName { get; set; }

    public byte? TypeKey { get; set; }

    public byte? DataType { get; set; }

    public bool? IsActive { get; set; }
}
