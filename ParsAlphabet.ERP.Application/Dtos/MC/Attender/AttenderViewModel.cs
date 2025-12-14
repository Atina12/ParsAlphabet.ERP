namespace ParsAlphabet.ERP.Application.Dtos.MC.Attender;

public class AttenderGetPage
{
    public bool AcceptableParaClinic;
    public int Id { get; set; }
    public string FullName { get; set; }
    public byte GenderId { get; set; }
    public string GenderName { get; set; }
    public string Gender => IdAndTitle(GenderId, GenderName);
    public string FatherName { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public string IdNumber { get; set; }
    public string NationalCode { get; set; }
    public string MSC { get; set; }
    public string MSCTypeName { get; set; }
    public string MscExpDatePersian { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public int SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string Speciality => IdAndTitle(SpecialityId, SpecialityName);
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public string Role => IdAndTitle(RoleId, RoleName);
    public byte AttenderTaxPer { get; set; }
    public bool IsActive { get; set; }
    public string BirthDatePersian { get; set; }
    public string LocCityName { get; set; }
    public string LocStateName { get; set; }
    public string Address { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public int CentralId { get; set; }
    public string SendResult => CentralId > 0 ? "ارسال شده" : "ارسال نشده";
}

public class ScheduleAttenderGetRecord
{
    public int Id { get; set; }
    public int CentralId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string FatherName { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public string IdNumber { get; set; }
    public short? GenderId { get; set; }
    public string NationalCode { get; set; }
    public string MSC { get; set; }
    public byte MSC_TypeId { get; set; }
    public DateTime? MSC_ExpDate { get; set; }

    public string MSC_ExpDatePersian
    {
        get => MSC_ExpDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            MSC_ExpDate = str == null ? null : str.Value;
        }
    }

    public DateTime? BirthDate { get; set; }

    public string BirthDatePersian
    {
        get => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BirthDate = str == null ? null : str.Value;
        }
    }

    public string Address { get; set; }

    public short SpecialityId { get; set; }
    public byte RoleId { get; set; }
    public int DepartmentId { get; set; }

    public byte AttenderTaxPer { get; set; }
    public bool IsActive { get; set; }
    public string SpecialityName { get; set; }
    public short LocStateId { get; set; }
    public int LocCityId { get; set; }
    public string PrescriptionTypeId { get; set; }
    public string AcceptableParaclinic { get; set; }
    public byte ContractType { get; set; }
    public string JsonAccountDetailList { get; set; }
}

public class CheckAttenderNationalCode : CompanyViewModel
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
}

public class AdmissionAttenderScheduleGetPage
{
    public string ReserveDatePersian { get; set; }
    public int AttenderId { get; set; }
    public string AttenderName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderName);
    public string SpecialityName { get; set; }
    public string Msc { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public int ShiftId { get; set; }
    public string ShiftName { get; set; }
    public string Shift => IdAndTitle(ShiftId, ShiftName);
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public short NumberOnlineAppointment { get; set; }
    public short NumberOfflineAppointment { get; set; }
    public int RequestAdmission { get; set; }
    public int ReturnAdmission { get; set; }
    public int EnterToRoom { get; set; }
    public int Remian => NumberOnlineAppointment + NumberOfflineAppointment - RequestAdmission - EnterToRoom;
}

public class GetAttenderAdmissionDropDown : CompanyViewModel
{
    public DateTime? FromReserveDate { get; set; }

    public string FromReserveDatePersian
    {
        get => FromReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromReserveDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ToReserveDate { get; set; }

    public string ToReserveDatePersian
    {
        get => ToReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToReserveDate = str == null ? null : str.Value;
        }
    }

    public int? AttenderId { get; set; }
    public string AttenderName { get; set; }
    public string MSC { get; set; }
}

public class AttenderAdmissionDropDown
{
    public int AttenderId { get; set; }
    public string Name { get; set; }
    public string MSC { get; set; }
}

public class AttenderDropDownList : MyDropDownViewModel
{
    public short BranchId { get; set; }
}

public class AttenderScheduleBlockDropDownList
{
    public int Id { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string PatientFullName { get; set; }

    public string Name => StartTime + "-" + EndTime + "-" + PatientFullName;

    public string Text => $"{Id} - {Name}";
}

public class AttenderSendHistoryGetRecord
{
    public int Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public int? CentralId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public byte GenderId { get; set; }
    public string Email { get; set; }
    public int SpecialityId { get; set; }
    public string Msc { get; set; }
    public DateTime? Msc_ExpDate { get; set; }
    public byte? MSC_TypeId { get; set; }
    public bool BookingEnabled { get; set; } = true;
    public string Description { get; set; }
    public byte BranchId { get; set; }
    public short CompanyId { get; set; }
}

public class AttenderViewModel
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string FullName { get; set; }
}

public class GetAttenderViewModel
{
    public int AttenderId { get; set; }
    public byte directPaging { get; set; }
}