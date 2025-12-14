namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderPrescription;

public class AttenderPrescriptionGetPage
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }
}

public class AttenderPrescriptionGetRecord
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
    public string FullName { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsActive { get; set; }
}

public class Get_AttenderPrescription : CompanyViewModel
{
    public int AttenderId { get; set; }
    public int UserId { get; set; }
}