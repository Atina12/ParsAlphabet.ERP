namespace ParsAlphabet.ERP.Application.Dtos.MC.InsurerPatient;

public class InsurerPatientGetPage
{
    public int Id { get; set; }
    public int PatientId { get; set; }

    public int InsurerTypeId { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public string CreateUserFullName { get; set; }
    public bool isActive { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();
}

public class InsurerPatientGetRecord
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int CreateUserId { get; set; }
    public int InsurerTypeId { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public string CreateUserFullName { get; set; }
    public bool isActive { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string createDateTimePersian => CreateDateTime.ToPersianDateStringNull();
}