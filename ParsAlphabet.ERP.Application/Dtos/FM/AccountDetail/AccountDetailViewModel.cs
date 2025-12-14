namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountDetail;

public class AccountDetailGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NoSeriesName { get; set; }
    public string PartnerTypeName { get; set; }
    public string NationalCode { get; set; }
    public bool Active { get; set; }
}

public class AccountDetailSearch
{
    public int Id { get; set; }
    public string Name { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => $"{NoSeriesId} - {NoSeriesName}";
    public bool IsActive { get; set; }
    public string IsActiveStr => IsActive ? "فعال" : "غیرفعال";
    public string IdNumber { get; set; }
    public string AgentFullName { get; set; }
    public string JobTitle { get; set; }
    public string BrandName { get; set; }
    public int PartnerTypeId { get; set; }
    public string PartnerTypeStr => PartnerTypeId == 1 ? "حقیقی" : "حقوقی";
    public bool VATInclude { get; set; }
    public string IncludeVatStr => VATInclude ? "دارد" : "ندارد";
    public bool VATEnable { get; set; }
    public string EnableVatStr => VATEnable ? "دارد" : "ندارد";

    public string NationalCode { get; set; }
    public string PersonGroupId { get; set; }
    public string PersonGroupName { get; set; }
}

public class GetAccountDetailSearch : NewGetPageViewModel
{
    public int? Id { get; set; }
    public string Name { get; set; }
    public int? FromAccountGLId { get; set; }
    public int? ToAccountGLId { get; set; }
    public int? FromAccountSGLId { get; set; }
    public int? ToAccountSGLId { get; set; }

    public string NoSeriesName { get; set; }
    public bool? IsActive { get; set; }
    public string IdNumber { get; set; }
    public string AgentFullName { get; set; }
    public string JobTitle { get; set; }
    public string BrandName { get; set; }
    public string NationalCode { get; set; }
    public string PersonGroupName { get; set; }
}

public class NoSeries
{
    public int Id { get; set; }
    public short NoSeriesId { get; set; }
}

public class AcountDetail_BrandName
{
    public int AccountDetailId { get; set; }
}