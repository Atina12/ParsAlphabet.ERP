namespace ParsAlphabet.ERP.Application.Dtos.GN.NoSeriesLine;

public class NoSeriesLineModel : CompanyViewModel
{
    public string Opr => LineNo == 0 ? "Ins" : "Upd";
    public short HeaderId { get; set; }
    public byte LineNo { get; set; }
    public int StartNo { get; set; }
    public int EndNo { get; set; }
}