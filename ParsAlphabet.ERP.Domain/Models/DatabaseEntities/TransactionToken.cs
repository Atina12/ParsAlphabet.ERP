using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TransactionToken
{
    public int Id { get; set; }

    public string Token { get; set; }

    public DateTime? ExpirationDateTime { get; set; }

    /// <summary>
    /// 1:Send,2:Receive
    /// </summary>
    public byte? TransactionTypeId { get; set; }
}
