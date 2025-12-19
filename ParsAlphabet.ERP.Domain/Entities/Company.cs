using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Company
{
    public byte Id { get; set; }

    public short? CentralId { get; set; }

    public string Name { get; set; }

    public string ManagerFirstName { get; set; }

    public string ManagerLastName { get; set; }

    public string Address { get; set; }

    public string PostalCode { get; set; }

    public short? StateId { get; set; }

    public short? CityId { get; set; }

    public short? CountryId { get; set; }

    public byte[] Logo { get; set; }

    public byte[] LogoNavigation { get; set; }

    public byte[] LogoNavigation1 { get; set; }

    public string PhoneNo { get; set; }

    public string Email { get; set; }

    public string WebSite { get; set; }

    /// <summary>
    /// ارز پیش فرض
    /// </summary>
    public byte? DefaultCurrencyId { get; set; }

    /// <summary>
    /// شناسه ملی/کدملی
    /// </summary>
    public string NationCode { get; set; }

    /// <summary>
    /// کد اقتصادی
    /// </summary>
    public string TaxCode { get; set; }

    public bool? Vatenable { get; set; }

    /// <summary>
    /// مالیات عملکرد
    /// </summary>
    public byte? IncomeTaxPer { get; set; }

    public string WebServiceOrgGuid { get; set; }

    public byte? WebServiceOrgTerminologyId { get; set; }

    public string ArmedInsuranceIdentity { get; set; }

    public string ArmedInsuranceName { get; set; }

    public string TaminInsuranceIdentity { get; set; }

    public byte? IndustryGroup { get; set; }

    /// <summary>
    /// شماره ثبت / شماره شناسنامه
    /// </summary>
    public string IdNumber { get; set; }

    public string SiamId { get; set; }

    public int? UserActiveCount { get; set; }

    public short? BranchCount { get; set; }

    public short? CurrencyCount { get; set; }

    public byte? CompanyTypeId { get; set; }

    /// <summary>
    /// کلید عمومی برای  رمز کردن EncryptionKey مربوط به ارسال اطلاعات از erp به نود
    /// </summary>
    public string PublicKey { get; set; }

    /// <summary>
    /// کلیدی که با PublicKey رمز می شود و به نود ارسال می شود تا نود یک توکن به erp اختصاص دهد
    /// </summary>
    public string EncryptionKey { get; set; }

    /// <summary>
    /// نام کاربری erp برای ارسال اطلاعات به نود
    /// </summary>
    public string UserName { get; set; }

    /// <summary>
    /// رمز عبور erp برای ارسال اطلاعات به نود
    /// </summary>
    public string Password { get; set; }
}
