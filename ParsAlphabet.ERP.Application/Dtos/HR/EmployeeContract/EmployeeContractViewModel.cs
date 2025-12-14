namespace ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContract;

public class EmployeeContractGetPage
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public bool IsActive { get; set; }
}

public class EmployeeContractGetRecord
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime? StartDate { get; set; }

    public string StartDatePersian
    {
        get => StartDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            StartDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ExpDate { get; set; }

    public string ExpDatePersian
    {
        get => ExpDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            ExpDate = str == null ? null : str.Value;
        }
    }

    public short SCId { get; set; }
    public short STaxId { get; set; }
    public short WorkGroupId { get; set; }
    public bool IsActive { get; set; }
}