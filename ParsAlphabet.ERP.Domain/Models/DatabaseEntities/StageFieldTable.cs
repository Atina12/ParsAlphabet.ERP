using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageFieldTable
{
    public int Id { get; set; }

    public short? StageId { get; set; }

    public byte? FundTypeId { get; set; }

    public short? FieldTableId { get; set; }

    public string FieldTableName { get; set; }

    public byte? Type { get; set; }

    public string TableName { get; set; }
}
