using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminServicePrescriptionOld
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Code { get; set; }

    public string TaminPrescriptionTypeId { get; set; }

    public string TaminPrescriptionTypeName { get; set; }

    public string Status { get; set; }

    public string TaminPrescriptionCategoryId { get; set; }

    public string BimSw { get; set; }

    public string Gcode { get; set; }

    public string WsCode { get; set; }

    public string ParaclinicTareffCode { get; set; }

    public byte? Sex { get; set; }

    public decimal? Price { get; set; }

    public string PriceDate { get; set; }

    public string DoseCode { get; set; }

    public string StatusDate { get; set; }

    public string BgType { get; set; }

    public string AgreementFlag { get; set; }

    public string IsDeleted { get; set; }

    public string Visible { get; set; }

    public string DentalServiceType { get; set; }

    public string HosPrescType { get; set; }

    public string CountIsRestricted { get; set; }

    public string Terminology { get; set; }

    public string CodeComplete { get; set; }

    public bool? IsActive { get; set; }
}
