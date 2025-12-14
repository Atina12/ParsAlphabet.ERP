namespace ParsAlphabet.ERP.Application.Dtos.PU.VendorItems;

public class VendorItemsGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public long VendorGroupId { get; set; }
    public string VendorGroupName { get; set; }
    public string VendorGroup => VendorGroupId > 0 ? $"{VendorGroupId} - {VendorGroupName}" : "";
    public long CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Category => CategoryId > 0 ? $"{CategoryId} - {CategoryName}" : "";
    public bool IsActive { get; set; }

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class VendorItemAssignList
{
    public List<VendorItemsGetPage> Assigns { get; set; }
}

public class VendorItemAssign
{
    public short NoSeriesId { get; set; }
    public int IdentityId { get; set; }
    public int PersonGroupTypeId { get; set; }
    public byte ItemTypeId { get; set; }
    public List<ID> Assign { get; set; }
}

public class VendorItemsGetRecord
{
    public int VendorId { get; set; }
    public int ItemId { get; set; }
    public bool IsActive => ItemId != 0 && VendorId != 0;
}

public class Get_VendorItems
{
    public int VendorId { get; set; }
    public int ItemId { get; set; }
}

public class GetVendorItemList
{
    public int VendorId { get; set; }
    public int ItemId { get; set; }
    public byte ItemTypeId { get; set; }
}

public class GetlistItemVendorViewModel
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string FullNameIds => IdAndTitle(Id, FullName);

    public int PersonGroupId { get; set; }
    public string PersonGroupName { get; set; }
    public string PersonGroup => IdAndTitle(PersonGroupId, PersonGroupName);

    public int PersonGroupTypeId { get; set; }
    public string PersonGroupTypeName { get; set; }
    public string PersonGroupType => IdAndTitle(PersonGroupTypeId, PersonGroupTypeName);

    public int PartnerTypeId { get; set; }
    public string PartnerTypeName { get; set; }
    public string PartnerType => IdAndTitle(PartnerTypeId, PartnerTypeName);

    public bool IsActive { get; set; }
    public string IsActiveStr => IsActive ? "فعال" : "غیرفعال";

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string UserFullName => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
}