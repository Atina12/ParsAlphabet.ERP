namespace ParsAlphabet.ERP.Application.Dtos.FM.VAT;

public class VATGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte VATPer { get; set; }
    public bool IsActive { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeriesIdName => IdAndTitle(NoSeriesId, NoSeriesName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetailIdName => IdAndTitle(AccountDetailId, AccountDetailName);
    public int VATTypeId { get; set; }
    public string VATTypeName { get; set; }
    public string VATType => IdAndTitle(VATTypeId, VATTypeName);
}

public class VATGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte VATPer { get; set; }
    public bool IsActive { get; set; }
    public short NoSeriesId { get; set; }
    public int AccountDetailId { get; set; }
    public byte VATTypeId { get; set; }
}

public class VatDropDownViewModel : MyDropDownViewModel
{
    public byte Percentage { get; set; }
    public byte VatTypeId { get; set; }
    public string VatTypeName { get; set; }
}