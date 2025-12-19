using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PosPayment
{
    public long Id { get; set; }

    public string RefNo { get; set; }

    public string CardNo { get; set; }

    public string TerminalNo { get; set; }

    public string AccountNo { get; set; }

    public int? PosId { get; set; }

    public string Amount { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string PaymentId { get; set; }
}
