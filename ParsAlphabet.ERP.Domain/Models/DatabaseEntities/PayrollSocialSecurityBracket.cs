using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PayrollSocialSecurityBracket
{
    public int Id { get; set; }

    public short? FiscalYearId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public int? InsurerId { get; set; }

    public string WorkshopCode { get; set; }

    public string WorkshopName { get; set; }

    public short? ContractNo { get; set; }

    public byte? SocialSecurityTypeId { get; set; }

    public byte? EmployerScpercentage { get; set; }

    public byte? EmployeeScpercentage { get; set; }

    public byte? UnEmploymentScpercentage { get; set; }

    public long? MaxPensionableAmount { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
