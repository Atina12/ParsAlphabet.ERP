namespace ParsAlphabet.ERP.Application.Dtos.MC.Speciality;

public class SpecialityGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Code { get; set; }
    public bool IsActive { get; set; }
}

public class SpecialityGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int TerminologyId { get; set; }
    public string TerminologyName { get; set; }
    public bool IsActive { get; set; }
}

public class CheckExistSpeciality : CompanyViewModel
{
    public int Id { get; set; }
    public int TerminologyId { get; set; }
}