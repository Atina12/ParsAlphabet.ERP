using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DeathInfantDelivery
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? InfantWeight { get; set; }

    public byte? InfantWeightUnitId { get; set; }

    public byte? DeliveryNumber { get; set; }

    public byte? DeliveryPriority { get; set; }

    public short? DeliveryAgentId { get; set; }

    public short? DeliveryLocationId { get; set; }

    public string MotherNationalCode { get; set; }

    public string MotherFirstName { get; set; }

    public string MotherLastName { get; set; }

    public byte? MotherGenderId { get; set; }

    public DateOnly? MotherBirthDate { get; set; }

    public string MotherMobileNumber { get; set; }
}
