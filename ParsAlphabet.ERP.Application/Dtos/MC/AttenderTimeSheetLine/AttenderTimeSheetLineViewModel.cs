namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;

public class AttenderTimeSheetSaveViewModel : CompanyViewModel
{
    public string Opr { get; set; }
    public int Id { get; set; }
    public int DepartmentTimeShiftId { get; set; }
    public byte IsOfflineBookingUnlimit { get; set; }

    public short NumberOnLineAppointment { get; set; }

    public short NumberOffLineAppointment { get; set; }

    public byte AppointmentDistributionTypeId { get; set; }

    public string WorkDayDatePersian { get; set; }

    public DateTime? WorkDayDate => WorkDayDatePersian.ToMiladiDateTime();
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public int AttenderId { get; set; }
    public int CreateUserId { get; set; }
    public byte DayInWeek { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}

public class AttenderTimeSheetDuplicateViewModel
{
    public short FiscalYearId { get; set; }
    public short BranchId { get; set; }
    public short DepartmentId { get; set; }
    public int FromAttenderId { get; set; }
    public string ToAttenderIds { get; set; }
    public byte Type { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;

    public string FromWorkDayDatePersian { get; set; }
    public DateTime? FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime();
    public string ToWorkDayDatePersian { get; set; }
    public DateTime? ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime();
}

public class DetailMedicalTimeShiftViewModel : NewGetPageViewModel
{
    public int AttenderId { get; set; }
    public int FiscalYearId { get; set; }
    public short BranchId { get; set; }
    public byte MonthId { get; set; }
    public byte DayInWeek { get; set; }
}

public class DetailListMedicalTimeShiftViewModel
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public int DepartmentTimeShiftId { get; set; }
    public string ShiftName { get; set; }
    public string Shift => IdAndTitle(DepartmentTimeShiftId, ShiftName);
    public short NumberOfflineAppointment { get; set; }
    public int OfflineRemainedBlocks { get; set; }

    public string NumberOffline =>
        StartTime != "" && EndTime != "" ? OfflineRemainedBlocks + " / " + NumberOfflineAppointment : "";

    public short NumberOnlineAppointment { get; set; }
    public int OnlineRemainedBlocks { get; set; }

    public string NumberOnline =>
        StartTime != "" && EndTime != "" ? OnlineRemainedBlocks + " / " + NumberOnlineAppointment : "";

    public DateTime WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateString("{0}/{1}/{2}");

    public byte IsOfflineBookingUnlimit { get; set; }
    public byte IsOnlineBookingUnlimit { get; set; }

    public int AttenderTimeSheetId { get; set; }


    public string StartTime { get; set; }

    public string EndTime { get; set; }

    public string Time => StartTime != "" && EndTime != "" ? StartTime + " - " + EndTime : "";


    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class AttenderTimeSheetGetPage
{
    public int Id { get; set; }
    public DateTime WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateString("{0}/{1}/{2}");
    public int MedicalTimeShiftId { get; set; }
    public string ShiftName { get; set; }

    public string Shift => IdAndTitle(MedicalTimeShiftId, ShiftName);
    public int NumberOnlineAppointment { get; set; }
    public int NumberOfflineAppointment { get; set; }

    public byte DayInWeek { get; set; }
    public byte DayId => DayOfWeekToShamsi(DayInWeek);
    public string DayName => GetDayName(DayId);
    public string StartTime { get; set; }
    public string EndTime { get; set; }

    public int CreateUserId { get; set; }

    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
}

public class ExistAttenderViewModel
{
    public int Id { get; set; }
}

public class AttenderTimeSheetLineViewModel
{
    public int AttenderId { get; set; }
    public DateTime? WorkDayDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}

public class AttenderScheduleBlockSaveResult : MyResultStatus
{
    public Guid? SendHistoryId { get; set; }
    public Guid? AttenderScheduleBlockId { get; set; }
    public Guid? CentralId { get; set; }
}

public class AttenderScheduleBlockSendHistoryGetList
{
    public Guid LocalId { get; set; }
    public Guid? CentralId { get; set; }
    public int AttenderId { get; set; }
    public Guid SendHistoryId { get; set; }
    public string ShiftName { get; set; }
    public int DepartmentTimeShiftId { get; set; }
    public short BranchId { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime BookingEndDate { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public short ReserveNo { get; set; }
    public int? PatientId { get; set; }
    public int? AdmissionId { get; set; }
    public string TrackingCode { get; set; }
    public DateTime? ReserveDateTime { get; set; }
    public short NumberOnlineAppointment { get; set; }
    public short CompanyId { get; set; }
}

public class AttenderScheduleBlockSendHistoryGetPage
{
    public long Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public string ShiftName { get; set; }
    public int MedicalTimeShiftId { get; set; }
    public short BranchId { get; set; }
    public DateTime BookingStartDate { get; set; }
    public string BookingStartDatePersian => BookingStartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime BookingEndDate { get; set; }
    public string BookingEndDatePersian => BookingEndDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime AppointmentDate { get; set; }
    public string AppointmentDatePersian => AppointmentDate.ToPersianDateString("{0}/{1}/{2}");
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public short ReserveNo { get; set; }
    public int PatientId { get; set; }
    public int AdmissionId { get; set; }
    public string TrackingCode { get; set; }
    public DateTime ReserveDateTime { get; set; }
    public short CompanyId { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int SendUserId { get; set; }
    public string SendUserFullName { get; set; }
    public string SendUser => IdAndTitle(SendUserId, SendUserFullName);
    public DateTime SendDateTime { get; set; }
    public string SendDateTimePersian => SendDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class AttenderTimeSheetGetList
{
    public int Id { get; set; }
    public int DepartmentTimeShiftId { get; set; }
    public string ShiftName { get; set; }
    public string DepartmentTimeShiftName => IdAndTitle(DepartmentTimeShiftId, ShiftName);
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string Time => StartTime + " - " + EndTime;

    public short NumberOffLineAppointment { get; set; }
    public byte IsOfflineBookingUnLimit { get; set; }

    public string IsOfflineBookingUnLimitTitle
    {
        get
        {
            if (IsOfflineBookingUnLimit == 1)
                return "غیرفعال";
            if (IsOfflineBookingUnLimit == 2)
                return "نامحدود";
            return "محدود";
        }
    }

    public string OfflineBookingUnLimitTitle => NumberOffLineAppointment + " -" + IsOfflineBookingUnLimitTitle;
    public short NumberOnLineAppointment { get; set; }
    public byte IsOnlineBookingUnLimit { get; set; }

    public string IsOnlineBookingUnLimitTitle
    {
        get
        {
            if (IsOnlineBookingUnLimit == 1)
                return "غیرفعال";
            return "محدود";
        }
    }

    public string OnlineBookingUnLimitTitle => NumberOnLineAppointment + " - " + IsOnlineBookingUnLimitTitle;
    public int AppointmentDistributionTypeId { get; set; }
    public string AppointmentDistributionTypeName { get; set; }

    public string AppointmentDistributionType =>
        IdAndTitle(AppointmentDistributionTypeId, AppointmentDistributionTypeName);

    public DateTime WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateString("{0}/{1}/{2}");

    public byte DayInWeek { get; set; }
    public byte DayId => DayOfWeekToShamsi(DayInWeek);
    public string DayName => GetDayName(DayId);

    public int AttenderTimeSheetId { get; set; }

    public byte monthId => Convert.ToByte(WorkDayDatePersian.Split("/")[1]);

    public string monthName => GetMonthWithOutId(monthId);

    public string month => IdAndTitle(monthId, monthName);

    public bool? Locked { get; set; }
}

public class AttenderTimeSheetViewModel
{
    public short FiscalYearId { get; set; }
    public byte? MonthId { get; set; }
    public byte DayInWeek { get; set; }
    public short BranchId { get; set; }
    public int AttenderId { get; set; }
}

public class AttenderTimeSheetLineSaveResult<T> : MyResultDataStatus<T>
{
    public bool CentralSuccessfull { get; set; }
    public int CentralStatus { get; set; }
    public string CentralStatusMessage { get; set; }
    public List<string> CentralValidationErrors { get; set; }
}

public class AttenderTimeSheetGetPropertiesDto
{
    public string? FiscalYearId { get; set; }
    public string? BranchId { get; set; }
    public string? DepartmentId { get; set; }
    public string? FromWorkDayDatePersian { get; set; }
    public string? ToWorkDayDatePersian { get; set; }
    public byte Type { get; set; }
    public byte? Isclosed { get; set; }
}