namespace ParsAlphabet.ERP.Application.Dtos.HR.DepartmentTimeShift;

public class DepartmentTimeShiftModel
{
    public int Id { get; set; }
    public int MedicalShiftId { get; set; }
    public short FiscalYearId { get; set; }
    public short BranchId { get; set; }
    public int DepartmentId { get; set; }
    public string ShiftName { get; set; }
    public string Description { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public bool IsActive { get; set; }

    public int ModifiedUserId { get; set; }
    public DateTime ModifiedDateTime { get; set; } = DateTime.Now;
}

public class DepartmentTimeShiftLineModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public byte DayInWeek { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public DateTime CurrentDateTime { get; set; } = DateTime.Now;
}

public class DepartmentTimeShiftDuplicateViewModel
{
    public short? FromFiscalYearId { get; set; }
    public short? FromBranchId { get; set; }
    public int? FromDepartmentId { get; set; }
    public int? FromId { get; set; }
    public List<ToDepartmentTimeshift> ToDepartmentTimeshiftModel { get; set; }
    public byte Type { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}

public class ToDepartmentTimeshift
{
    public short? FiscalYearId { get; set; }
    public short? BranchId { get; set; }
    public int? DepartmentId { get; set; }
    public string ShiftName { get; set; }
}