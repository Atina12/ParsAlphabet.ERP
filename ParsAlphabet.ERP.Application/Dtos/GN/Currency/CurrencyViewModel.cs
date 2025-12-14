namespace ParsAlphabet.ERP.Application.Dtos.GN.Currency;

public class CurrencyGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte QuantityRounding { get; set; }
    public bool IsActive { get; set; }
}

public class CurrencyGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte QuantityRounding { get; set; }
    public bool IsActive { get; set; }
}