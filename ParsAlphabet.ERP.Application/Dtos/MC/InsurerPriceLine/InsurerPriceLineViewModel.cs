namespace ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;

public class InsurerPriceLineGetPage
{
    public int InsurerPriceId { get; set; }
    public int MedicalItemPriceId { get; set; }

    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);

    public int InsurerLineId { get; set; }
    public string InsurerLineName { get; set; }
    public string InsurerLine => IdAndTitle(InsurerLineId, InsurerLineName);

    public byte InsurerPriceCalculationMethodId { get; set; }
    public string InsurerPriceCalculationMethodName { get; set; }

    public string InsurerPriceCalculationMethod =>
        IdAndTitle(InsurerPriceCalculationMethodId, InsurerPriceCalculationMethodName);

    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public bool IsActive { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class InsurerPriceLineGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public int InsurerId { get; set; }
    public int InsurerLineId { get; set; }
    public int MedicalItemPriceId { get; set; }
    public byte InsurerPriceCalculationMethodId { get; set; }
    public string InsurerPriceCalculationMethodName { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class ServiceCountCalculationMethodViewModel
{
    public short InsurerPriceCalculationMethodId { get; set; }
    public string InsurerPriceCalculationMethodName { get; set; }
    public decimal InsurerSharePer { get; set; }
    public int ServiceCount { get; set; }
}

public class CalculationMethodServiceCountViewModel
{
    public int InsurerId { get; set; }
    public short? InsurerLineId { get; set; }
    public byte ItemTypeId { get; set; }
    public byte? InsurerPriceCalculationMethodId { get; set; }
}

public class NewGetCalculationMethodGetPage : NewGetPageViewModel
{
    public byte ItemTypeId { get; set; }
    public int InsurerId { get; set; }
    public short? InsurerLineId { get; set; }
    public byte InsurerPriceCalculationMethodId { get; set; }
    public decimal InsurerSharePer { get; set; }
}

public class CalculationMethodGetPage
{
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);

    public int InsurerLineId { get; set; }
    public string InsurerLineName { get; set; }
    public string InsurerLine => IdAndTitle(InsurerLineId, InsurerLineName);

    public byte InsurerTypeId { get; set; }
    public string InsurerTypeName { get; set; }
    public string InsurerType => IdAndTitle(InsurerTypeId, InsurerTypeName);

    public byte InsurerPriceCalculationMethodId { get; set; }
    public string InsurerPriceCalculationMethodName { get; set; }

    public string InsurerPriceCalculationMethod =>
        IdAndTitle(InsurerPriceCalculationMethodId, InsurerPriceCalculationMethodName);

    public decimal BeginPrice { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public int CreateUserId { get; set; }

    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class ResultSaveInsurerPrice : MyResultStatus
{
    public Guid? SendHistoryId { get; set; }
}

public class InsurerPriceGetCentral
{
    public int? CentralId { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
}

public class InsurerPriceSendHistoryGetList
{
    public int LocalId { get; set; }
    public string CentralId { get; set; }
    public Guid SendHistoryId { get; set; }
    public int MedicalItemPriceId { get; set; }
    public int ItemId { get; set; }
    public int InsurerId { get; set; }
    public short InsurerLineId { get; set; }
    public byte InsurerPriceCalculationMethodId { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public short CompanyId { get; set; }
}

public class ResultDuplicateInsurerPrice : MyResultStatus
{
    public int InsurerPriceId { get; set; }
    public Guid? SendHistoryId { get; set; }
}

public class InsurerPriceSendHistoryGetpage
{
    public int Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public short CompanyId { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int SendUserId { get; set; }
    public string SendUserFullName { get; set; }
    public string SendUser => IdAndTitle(SendUserId, SendUserFullName);
    public DateTime SendDateTime { get; set; }
    public string SendDateTimePersian => SendDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class InsurerPriceSendHistoryGetRecord
{
    public int Id { get; set; }
    public string CentralId { get; set; }
    public Guid SendHistoryId { get; set; }
    public int MedicalItemPriceId { get; set; }
    public int InsurerId { get; set; }
    public int InsurerLineId { get; set; }
    public byte InsurerPriceCalculationMethodId { get; set; }
    public decimal InsurerPrice { get; set; }
    public decimal InsurerSharePer { get; set; }
    public short CompanyId { get; set; }
}