using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AppointmentBookingConfig
{
    public byte Id { get; set; }

    public short? BranchId { get; set; }

    public byte? BookingStart { get; set; }

    public byte? BookingEnd { get; set; }
}
