namespace ParsAlphabet.ERP.Application.Dtos.MC.FavoritePrescription;

public class FavoriteAssign
{
    public int AttenderId { get; set; }
    public byte FavoriteCategory { get; set; }
    public List<AssignFavorite> Assign { get; set; }
    public int AdmissionTypeId { get; set; }
}

public class GetFavoriteAssignDropDown
{
    public int Id { get; set; }
    public byte FavoriteCategory { get; set; }

    public string Term { get; set; }
}

public class AssignFavorite
{
    public int Id { get; set; }
}

public class AssignList
{
    public List<Assigns> Assigns { get; set; }
}

public class Assigns
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
}

public class FavoritenTaminGetPage
{
    public int Id { get; set; }

    public int TaminServicePrescriptionId { get; set; }
    public bool CodeTypeId { get; set; }
    public string ServiceCode { get; set; } //wsCode
    public string ServiceName { get; set; } //wsCode
    public string Service => ServiceCode + "/" + TaminServicePrescriptionId + "-" + ServiceName;

    public string Quantity { get; set; }

    public int TaminDrugInstructionId { get; set; }
    public string TaminDrugInstructionCode { get; set; }
    public string TaminDrugInstructionName { get; set; }
    public string TaminDrugInstruction => IdAndTitle(TaminDrugInstructionId, TaminDrugInstructionName);

    public int TaminDrugAmountId { get; set; }
    public string TaminDrugAmountName { get; set; }
    public string TaminDrugAmount => IdAndTitle(TaminDrugAmountId, TaminDrugAmountName);

    public int TaminDrugUsageId { get; set; }
    public string TaminDrugUsageName { get; set; }
    public string TaminDrugUsage => IdAndTitle(TaminDrugUsageId, TaminDrugUsageName);

    public string Repeat { get; set; }

    public int TaminParentOrganId { get; set; }
    public string TaminParentOrganName { get; set; }
    public string TaminParentOrgan => IdAndTitle(TaminParentOrganId, TaminParentOrganName);

    public int TaminOrganId { get; set; }
    public string TaminOrganName { get; set; }
    public string TaminOrgan => IdAndTitle(TaminOrganId, TaminOrganName);

    public int TaminIllnessId { get; set; }
    public string TaminIllnessName { get; set; }
    public string TaminIllness => IdAndTitle(TaminIllnessId, TaminIllnessName);

    public int TaminPlanId { get; set; }
    public string TaminPlanName { get; set; }
    public string TaminPlan => IdAndTitle(TaminPlanId, TaminPlanName);

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public DateTime EffectiveDate => DateTime.Now;
    public string EffectiveDatePersian => EffectiveDate.ToPersianDateString("{0}/{1}/{2}");
}

public class SaveFavoritenTamin
{
    public int? Id { get; set; }
    public int AttenderId { get; set; }
    public int TaminServicePrescriptionId { get; set; }
    public byte TaminPrescriptionTypeId { get; set; }
    public bool CodeTypeId { get; set; }
    public byte Quantity { get; set; }
    public byte? TaminDrugInstructionId { get; set; }
    public int? TaminDrugAmountId { get; set; }
    public int? TaminDrugUsageId { get; set; }
    public int? Repeat { get; set; }
    public byte? TaminParentOrganId { get; set; }
    public byte? TaminOrganId { get; set; }
    public byte? TaminIllnessId { get; set; }
    public byte? TaminPlanId { get; set; }
    public int CreateUserId { get; set; }
}