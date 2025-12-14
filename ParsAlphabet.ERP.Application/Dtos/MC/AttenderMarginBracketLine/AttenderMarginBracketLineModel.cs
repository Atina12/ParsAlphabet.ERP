namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracketLine;

public class AttenderMarginBracketLineModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int RowNumber { get; set; }
    public decimal StartAmount { get; set; }
    public decimal EndAmount { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal AttenderCommissionValue { get; set; }
    public int CompanyId { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}