using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class SendHistory
{
    public Guid Id { get; set; }

    public string ObjectId { get; set; }

    public byte? ObjectTypeId { get; set; }

    public string CentralId { get; set; }

    /// <summary>
    /// 1:INSERT,2:UPDATE,3:DELETE
    /// </summary>
    public byte? OperationTypeId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? SendUserId { get; set; }

    public DateTime? SendDateTime { get; set; }
}
