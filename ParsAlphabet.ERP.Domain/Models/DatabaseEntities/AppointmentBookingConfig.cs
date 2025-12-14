using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AppointmentBookingConfig
{
    public byte Id { get; set; }

    public short? BranchId { get; set; }

    public byte? BookingStart { get; set; }

    public byte? BookingEnd { get; set; }
}
