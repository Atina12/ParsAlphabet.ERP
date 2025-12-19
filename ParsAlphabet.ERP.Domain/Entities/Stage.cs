using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Stage
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? InOut { get; set; }

    public byte? DocumentTypeId { get; set; }

    public byte? StageClassId { get; set; }

    public int? WorkflowCategoryId { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsQuantity { get; set; }

    public bool? BySystem { get; set; }

    /// <summary>
    /// 1=HeaderInOut / 2=LineInOut
    /// </summary>
    public byte? InOutDirection { get; set; }
}
