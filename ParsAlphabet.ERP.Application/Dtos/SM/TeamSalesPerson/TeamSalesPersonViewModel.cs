namespace ParsAlphabet.ERP.Application.Dtos.SM.TeamSalesPerson;

public class TeamSalesPersonGetPage
{
    public int EmployeeId { get; set; }
    public string EmployeeFullName { get; set; }
    public bool IsActive { get; set; }
}

public class TeamSalesPersonGetRecord
{
    public int TeamId { get; set; }
    public int EmployeeId { get; set; }
    public bool IsActive => TeamId != 0 && EmployeeId != 0;
}

public class Get_TeamSalesPerson
{
    public int TeamId { get; set; }
    public int EmployeeId { get; set; }
}