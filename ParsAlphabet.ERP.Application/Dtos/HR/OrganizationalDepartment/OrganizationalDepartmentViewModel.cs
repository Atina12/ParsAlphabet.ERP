namespace ParsAlphabet.ERP.Application.Dtos.HR.OrganizationalDepartment;

public class OrganizationalDepartmentGetPage
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public bool IsActive { get; set; }
}

public class OrganizationalDepartmentGetRecord
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public bool IsActive { get; set; }
}

public class OrganizationalDepartmentDropDown : MyDropDownViewModel
{
    public bool IsActive { get; set; }
}