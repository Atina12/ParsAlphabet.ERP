namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;

public class AttenderTimeSheetLineModel
{
    public int AttenderId { get; set; }
    public int AttenderShiftId { get; set; }
    public short? DepartmentId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}