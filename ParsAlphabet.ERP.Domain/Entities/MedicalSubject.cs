using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MedicalSubject
{
    public byte Id { get; set; }

    /// <summary>
    /// نام نوع تعرفه
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// نام لاتین نوع تعرفه
    /// </summary>
    public string NameEng { get; set; }

    /// <summary>
    /// وضعیت گردشگری بودن تعرفه
    /// </summary>
    public bool? IsIpd { get; set; }

    /// <summary>
    /// وضعیت آنلاین بودن تعرفه
    /// </summary>
    public bool? IsOnline { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
