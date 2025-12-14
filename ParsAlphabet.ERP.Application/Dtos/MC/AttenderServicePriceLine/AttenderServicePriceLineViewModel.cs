namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;

public class AttenderServicePriceAssignGetPage
{
    public List<AttenderServicePriceAssignList> Assigns { get; set; }
}

public class AttenderServicePriceAssignList
{
    public int AttenderServicePriceId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);
    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
    public int AttenderMarginBracketId { get; set; }
    public string AttenderMarginBracketName { get; set; }
    public string AttenderMarginBracket => IdAndTitle(AttenderMarginBracketId, AttenderMarginBracketName);
    public int MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class AttenderServicePriceDiAssignGetPage
{
    public List<AttenderServicePriceDiAssignList> Assigns { get; set; }
}

public class AttenderServicePriceDiAssignList
{
    public int AttenderServicePriceId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);

    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);

    public int MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);
    public string AttenderMarginBracketName { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class AttenderDuplicate
{
    public int FromAttenderId { get; set; }
    public int ToAttenderId { get; set; }
    public string FromServiceIds { get; set; }
    public byte? FromMedicalSubjectId { get; set; }
    public int? FromAttenderMarginBracketId { get; set; }
    public int CreateUserId { get; set; }
    public bool IsPreview { get; set; }
}

public class AttenderServiceList : AttenderMarginBracket.AttenderMarginBracketLine
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);
    public int MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);

    public int AttenderMarginBracketId { get; set; }
    public string AttenderMarginBracketName { get; set; }
    public string AttenderMarginBracket => IdAndTitle(AttenderMarginBracketId, AttenderMarginBracketName);
}

public class ServiceByAttender
{
    public int ServiceId { get; set; }
    public int? RvuCode { get; set; }
    public string CdtCode { get; set; }
    public string TaminCode { get; set; }
    public string Name { get; set; }
}

public class AttenderServiceInfo
{
    public string Msc { get; set; }
    public string MscExpireDatePersian { get; set; }
    public byte MscTypeId { get; set; }
    public int ServiceCount { get; set; }
}

public class AttenderServiceSendHistoryGetpage
{
    public int Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);
    public byte MedicalSubjectId { get; set; }
    public string MedicalSubjectName { get; set; }
    public string MedicalSubject => IdAndTitle(MedicalSubjectId, MedicalSubjectName);
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

public class AttenderServiceSendHistoryGetRecord
{
    public int Id { get; set; }
    public Guid SendHistoryId { get; set; }
    public int AttenderId { get; set; }
    public int ServiceId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public short CompanyId { get; set; }
}