using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AppointmentUnlimitConfig
{
    public int Id { get; set; }

    public int? ServiceTypeId { get; set; }

    /// <summary>
    /// تعداد حداکثر نوبت ها در صورت انتخاب نوبت آفلاین نامحدود
    /// </summary>
    public short? UnlimitMaxNo { get; set; }
}
