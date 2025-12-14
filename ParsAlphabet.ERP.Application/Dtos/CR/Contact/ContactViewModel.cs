namespace ParsAlphabet.ERP.Application.Dtos.CR.Contact;

public class ContactGetPage
{
    public int Id { get; set; }
    public int PartnerTypeId { get; set; }
    public string PartnerTypeName => PartnerTypeId == 1 ? "1 - حقیقی" : "2 - حقوقی";

    public int ContactGroupId { get; set; }
    public string ContactGroupName { get; set; }
    public string ContactGroup => ContactGroupId == 0 ? "" : $"{ContactGroupId} - {ContactGroupName}";
    public string AgentFullName { get; set; }
    public string PersonTitleName { get; set; }
    public string ContactFullName { get; set; }

    public string FullName => PersonTitleName.IsNullOrEmptyOrWhiteSpace()
        ? ContactFullName
        : $"{PersonTitleName} {ContactFullName}";

    public string JobTitle { get; set; }
    public string BrandName { get; set; }

    public string NationalCode { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public bool VATInclude { get; set; }
    public bool VATEnable { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public bool IsActive { get; set; }
}

public class ContactGetRecord
{
    public int Id { get; set; }

    // public short GroupId { get; set; }
    public byte PersonGroupId { get; set; }
    public byte IndustryId { get; set; }
    public bool? VATInclude { get; set; }
    public byte VATAreaId { get; set; }
    public bool? VATEnable { get; set; }
    public string TaxCode { get; set; }
    public short? DiscGroupId { get; set; }
    public bool? IsActive { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string SearchName { get; set; }
    public byte? PartnerTypeId { get; set; }
    public byte? GenderId { get; set; }
    public string NationalCode { get; set; }
    public short? LocCountryId { get; set; }
    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public string Email { get; set; }
    public string WebSite { get; set; }
    public string AgentFullName { get; set; }
    public short PersonTitleId { get; set; }

    public string IdNumber { get; set; }
    public string JobTitle { get; set; }
    public string BrandName { get; set; }
    public DateTime? IdDate { get; set; }
    public string IdDatePersian => IdDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public string JsonAccountDetailList { get; set; }
}

public class ContactDropDown
{
    public int Id { get; set; }
    public string FullName { get; set; }
}