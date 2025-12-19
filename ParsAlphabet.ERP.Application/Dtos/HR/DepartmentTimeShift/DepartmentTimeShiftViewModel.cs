namespace ParsAlphabet.ERP.Application.Dtos.HR.DepartmentTimeShift;

public class DepartmentTimeShiftGetPage
{
    public int Id { get; set; }

    public short FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);


    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public string ShiftName { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class DepartmentTimeShiftGetRecord
{
    public int Id { get; set; }
    public int DepartmentTimeShiftLineId { get; set; }
    public short FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public string ShiftName { get; set; }
    public string Description { get; set; }
    public int CreateuserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public bool IsActive { get; set; }
    public string Active => IsActive ? "فعال" : "غیرفعال";
    public byte DayInWeek { get; set; }
    public byte DayId => DayOfWeekToShamsi(DayInWeek);
    public string DayName => GetDayName(DayId);
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}

public class DepartmentTimeShiftLineGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public byte DayInWeek { get; set; }
    public byte DayId => DayOfWeekToShamsi(DayInWeek);
    public string DayName => GetDayName(DayId);
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public bool? Locked { get; set; }
    public bool? isLock => !Locked;
}

public class DepartmentTimeShiftLineDelModel
{
    public int Id { get; set; }
    public int DepartmentShiftId { get; set; }
    public int UserId { get; set; }
    public string FromAppointmentDate { get; set; }
    public string ToAppointmentDate { get; set; }
    public TimeSpan FromTime { get; set; }
    public byte DayInWeek { get; set; }
    public string FormType { get; set; }
    public bool? IsLock { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}