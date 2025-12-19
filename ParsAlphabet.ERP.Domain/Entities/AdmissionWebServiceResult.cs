using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionWebServiceResult
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public DateTime? EliminateHiddateTime { get; set; }

    public byte? EliminateHidresult { get; set; }

    /// <summary>
    /// شناسه مراجعه کننده
    /// </summary>
    public string PersonUid { get; set; }

    public DateTime? SaveBillDateTime { get; set; }

    /// <summary>
    /// شناسه مراجعه
    /// </summary>
    public string SaveBillCompositionUid { get; set; }

    /// <summary>
    /// شناسه تراکنش
    /// </summary>
    public string SaveBillMessageUid { get; set; }

    public byte? SaveBillResult { get; set; }

    public DateTime? RembDateTime { get; set; }

    /// <summary>
    /// شناسه مراجعه
    /// </summary>
    public string RembCompositionUid { get; set; }

    /// <summary>
    /// شناسه تراکنش
    /// </summary>
    public string RembMessageUid { get; set; }

    public byte? RembResult { get; set; }

    public DateTime? UpdateHidonlineDateTime { get; set; }

    public byte? UpdateHidresult { get; set; }
}
