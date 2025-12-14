namespace ParsAlphabet.ERP.Application.Dtos.MC;

public class SetupClientTamin : CompanyViewModel
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string SoftwareClientId { get; set; }
    public string SoftwareClientSecret { get; set; }
    public byte ClientType { get; set; }
    public string ServiceFullUrl { get; set; }
    public string AcceptableParaClinicTypeId { get; set; }
}

public class TaminServicePrescription
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string TaminPrescriptionTypeId { get; set; }
    public string TaminPrescriptionTypeName { get; set; }
    public string Status { get; set; }
    public string TaminPrescriptionCtegoryId { get; set; }
    public string BimSw { get; set; }
    public string GCode { get; set; }
    public string WsCode { get; set; }
    public string ParaclinicTareffCode { get; set; }
}

public class MedicalTimeShiftDisplay
{
    public Guid Id { get; set; }
    public Guid? CentralId { get; set; }

    public short FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName); //1

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName); //2


    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName); //3

    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName); //4


    public int DepartmentTimeShiftId { get; set; }
    public string DepartmentTimeShiftName { get; set; }
    public string DepartmentTimeShift => IdAndTitle(DepartmentTimeShiftId, DepartmentTimeShiftName); //5


    public DateTime AppointmentDate { get; set; }
    public string AppointmentDatePersian => AppointmentDate.ToPersianDateString("{0}/{1}/{2}"); //6

    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Time => StartTime + "  " + EndTime; //7
    public string RangeTime { get; set; }

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

    public string OfflineBookingUnLimitTitle => NumberOffLineAppointment + " -" + IsOfflineBookingUnLimitTitle; //8
    public short NumberOnLineAppointment { get; set; }
    public byte IsOnlineBookingUnLimit { get; set; }

    public string IsOnlineBookingUnLimitTitle
    {
        get
        {
            if (IsOnlineBookingUnLimit == 1)
                return "غیرفعال";
            if (IsOnlineBookingUnLimit == 2)
                return "نامحدود";
            return "محدود";
        }
    }

    public string OnlineBookingUnLimitTitle => NumberOnLineAppointment + " - " + IsOnlineBookingUnLimitTitle; //9
    public short ReserveNo { get; set; } //10

    public DateTime BookingStartDate { get; set; }
    public string BookingStartDatePersian => BookingStartDate.ToPersianDateString("{0}/{1}/{2}");

    public DateTime BookingEndDate { get; set; }
    public string BookingEndDatePersian => BookingEndDate.ToPersianDateString("{0}/{1}/{2}");

    public string BookingDatePersian => BookingStartDatePersian + " " + BookingEndDatePersian; //11

    public bool HasPatient { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string NationalCode { get; set; }
    public DateTime ReserveDateTime { get; set; }
    public string ReserveDateTimePersian => ReserveDateTime.ToPersianDateString("{0}/{1}/{2}");
    public int AdmissionId { get; set; }
    public bool Locked { get; set; }
    public int AttenderTimeSheetId { get; set; }

    public int MedicalShiftTimeSheetId { get; set; }
    public DateTime WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateString("{0}/{1}/{2}");
    public short YearId { get; set; }
    public string MonthId { get; set; }
    public string DayId { get; set; }

    public byte AppointmentDistributionTypeId { get; set; }
    public string AppointmentDistributionTypeName { get; set; }

    public string AppointmentDistributionType =>
        IdAndTitle(AppointmentDistributionTypeId, AppointmentDistributionTypeName);

    public bool IsOnline { get; set; }
    public string AppointmentTypeName => IsOnline ? "آنلاین" : "حضوری";


    public byte DayInWeek { get; set; }
    public string DayName => GetDayName(DayOfWeekToShamsi(DayInWeek));
}

public class CsvScheduleBlcokViewModel
{
    public string stringedModel { get; set; }
    public string formType { get; set; }
}