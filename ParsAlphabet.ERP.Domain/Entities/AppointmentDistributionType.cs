using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AppointmentDistributionType
{
    /// <summary>
    /// شناسه نحوه توزیع نوبت های آنلاین و حضوری
    /// 1- آنلاین اول / آفلاین آخر
    /// 2- آنلاین آخر / آفلاین اول
    /// 3- آنلاین/آفلاین (یک در میان )
    /// 
    /// </summary>
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }
}
