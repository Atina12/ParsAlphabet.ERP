using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrLncmap
{
    public int Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string DetailCode { get; set; }

    public string DetailValue { get; set; }

    public string DetailTerminology { get; set; }

    public string OrderOrResult { get; set; }

    public string PanelCode { get; set; }

    public string PrescriptionStatus { get; set; }

    public string RvuCode { get; set; }

    public string RvuValue { get; set; }

    public string RvuGroup { get; set; }

    public string RvuCategory { get; set; }

    public string RvyType { get; set; }

    public int? Id1 { get; set; }
}
