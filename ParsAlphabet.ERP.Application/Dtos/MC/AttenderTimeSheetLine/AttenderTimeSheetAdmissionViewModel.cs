using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;

public class GetAttenderTimeShift
{
    public int AttenderId { get; set; }
    public string CurrentDate { get; set; }
    public string CurrentTime { get; set; }
    public short BranchId { get; set; }
    public bool IsOnline { get; set; }
}

public class AttenderTimeSheetIdslockViewMOdel
{
    public string Ids { get; set; }
    public int AttenderId { get; set; }
}

public class AttenderShiftdDetailViewModel
{
    public int AttenderId { get; set; }
    public int FiscalYearId { get; set; }
    public short BranchId { get; set; }
}

public class AttenderTimeShiftGetGroupDetailViewModel
{
    public byte DayInWeek { get; set; }
    public byte DayId => DayOfWeekToShamsi(DayInWeek);
    public string DayName => GetDayName(DayId);

    public string Month1 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail1 => Month1 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month1)
        : null;

    public string Month2 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail2 => Month2 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month2)
        : null;

    public string Month3 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail3 => Month3 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month3)
        : null;

    public string Month4 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail4 => Month4 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month4)
        : null;

    public string Month5 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail5 => Month5 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month5)
        : null;

    public string Month6 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail6 => Month6 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month6)
        : null;

    public string Month7 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail7 => Month7 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month7)
        : null;

    public string Month8 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail8 => Month8 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month8)
        : null;

    public string Month9 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail9 => Month9 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month9)
        : null;

    public string Month10 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail10 => Month10 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month10)
        : null;

    public string Month11 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail11 => Month11 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month11)
        : null;

    public string Month12 { get; set; }

    public AttenderTimeShiftGroupListViewModel MonthListDetail12 => Month12 != null
        ? JsonConvert.DeserializeObject<AttenderTimeShiftGroupListViewModel>(Month12)
        : null;
}

public class AttenderTimeShiftGroupListViewModel
{
    public bool MonthLocked { get; set; }
    public List<AttenderTimeShiftGroupDetailViewModel> MonthDetail { get; set; }
}

public class AttenderTimeShiftGroupDetailViewModel
{
    public int DepartmentTimeShiftId { get; set; }
    public string ShiftName { get; set; }
    public int NumberOnlineAppointment { get; set; }
    public int NumberOfflineAppointment { get; set; }
    public int FilledBlocks { get; set; }
    public int AllocatedBlocks { get; set; }
}

public class PresenceDaysModel
{
    public int AttenderId { get; set; }
    public short BranchId { get; set; }
    public DateTime? WorkDayDate { get; set; }
}

public class PresenceDaysViewModel
{
    public string DayInWeek { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public byte MinDayInWeek { get; set; }

    public string DayName
    {
        get
        {
            if (DayInWeek != "")
            {
                byte dayId;
                var dayOfName = "";
                var sortName = false;
                var ids = DayInWeek.Split(',')?.Select(byte.Parse)?.ToList();

                if (ids.Count == 1) return GetDayName(DayOfWeekToShamsi(ids[0]));


                sortName = ids.Zip(ids.Skip(1), (a, b) => a + 1 == b).All(x => x);

                if (sortName)
                {
                    dayOfName = GetDayName(DayOfWeekToShamsi(ids[0])) + " تا " +
                                GetDayName(DayOfWeekToShamsi(ids[ids.Count - 1]));
                }
                else
                {
                    for (var i = 0; i < ids.Count; i++)
                    {
                        dayId = DayOfWeekToShamsi(ids[i]);
                        dayOfName += GetDayName(dayId) + "/";
                    }

                    dayOfName = dayOfName.Remove(dayOfName.Length - 1, 1);
                }

                return dayOfName;
            }

            return "";
        }
    }
}

public class AttenderWorkDayListViewModel
{
    public DateTime WorkDayDate { get; set; }
    public string WorkDayDatePersian => WorkDayDate.ToPersianDateString("{0}/{1}/{2}");
    public string StartTime { get; set; }
    public string EndTime { get; set; }
}