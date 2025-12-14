namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracket;

public class AttenderMarginBracketModel
{
    public int Id { get; set; }
    public string Opr => Id == 0 ? "Ins" : "Upd";

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool IsActive { get; set; }

    public int CompanyId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}