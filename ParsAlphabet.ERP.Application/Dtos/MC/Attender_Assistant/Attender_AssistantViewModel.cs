namespace ParsAlphabet.ERP.Application.Dtos.MC.Attender_Assistant;

public class AttenderAssistantGetPage
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }
}

public class AssistantAttenderGetPage
{
    public int Id { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(Id, AttenderFullName);

    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public int SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string Speciality => IdAndTitle(SpecialityId, SpecialityName);
    public bool AttenderIsActive { get; set; }
    public bool IsActive { get; set; }
}

public class Attender_AssistantGetRecord
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }
}

public class Get_Attender_Assistant : CompanyViewModel
{
    public int AttenderId { get; set; }
    public int UserId { get; set; }
}