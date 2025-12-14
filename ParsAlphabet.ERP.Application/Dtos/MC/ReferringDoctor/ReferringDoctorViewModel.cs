namespace ParsAlphabet.ERP.Application.Dtos.MC.ReferringDoctor;

public class ReferringDoctorGetPage
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public string Address { get; set; }
    public int SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string Speciality => IdAndTitle(SpecialityId, SpecialityName);
    public int GenderId { get; set; }
    public string GenderName { get; set; }
    public string Gender => IdAndTitle(GenderId, GenderName);
    public string MSC { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public string Role => IdAndTitle(RoleId, RoleName);
    public string LocStateName { get; set; }
    public string LocCityName { get; set; }
    public bool IsActive { get; set; }
}

public class ReferringDoctorGetRecord
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int? GenderId { get; set; }
    public string Address { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public short SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string MSC { get; set; }
    public byte MSC_TypeId { get; set; }
    public byte RoleId { get; set; }
    public bool IsActive { get; set; }
    public short LocStateId { get; set; }
    public int LocCityId { get; set; }
}