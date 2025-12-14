using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate;

public class DeathCertificateHeader : CompanyViewModel
{
    public int Id { get; set; }
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int AdmissionId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string NationalId { get; set; }
    public byte GenderId { get; set; }
    public int BurialAttesterId { get; set; }
    public int IndividualRegisterId { get; set; }
    public int CountryId { get; set; }
    public int CountryDivisionEstateId { get; set; }
    public int CountryDivisionCityId { get; set; }

    public int CreateUserId { get; set; }
    public string RelatedHID { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public DateTime? IssueDate { get; set; }

    [NotMapped]
    public string IssueDatePersian
    {
        get => IssueDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            IssueDate = str == null ? null : str.Value;
        }
    }

    public DateTime? BirthDate { get; set; }

    [NotMapped]
    public string BirthDatePersian
    {
        get => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            BirthDate = str == null ? null : str.Value;
        }
    }

    public string SerialNumber { get; set; }
    public string Comment { get; set; }
    public string HouseholdHeadNationalCode { get; set; }
    public DateTime? DeathDateTime { get; set; }

    [NotMapped]
    public string DeathDateTimePersian
    {
        get => DeathDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");

        set
        {
            var str2 = value.ToMiladiDateTime();
            DeathDateTime = str2 == null ? null : str2.Value;
        }
    }

    public int DeathLocationId { get; set; }
    public int SourceOfNotificationId { get; set; }
}

public class DeathCertificate : DeathCertificateHeader
{
    // public List<AdmissionReferMedicalHistoryLineList> DeathMedicalHistoryLines { get; set; }
    public List<DeathCauseLineList> DeathCauseLines { get; set; }
    public List<DeathInfantDeliveryLineList> DeathInfantDeliveryLines { get; set; }
}

public class DeathCauseLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int CauseId { get; set; }
    public byte StatusId { get; set; }
    public double DurationDeath { get; set; }

    public short DurationDeathUnitId { get; set; }
    //public string DurationDeathUnitName { get; set; }
}

public class DeathInfantDeliveryLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public double InfantWeight { get; set; }
    public byte InfantWeightUnitId { get; set; }
    public byte DeliveryNumber { get; set; }
    public byte DeliveryPriority { get; set; }
    public short DeliveryAgentId { get; set; }
    public short DeliveryLocationId { get; set; }
    public string MotherNationalCode { get; set; }
    public string MotherFirstName { get; set; }
    public string MotherLastName { get; set; }
    public byte MotherGenderId { get; set; }
    public DateTime? MotherBirthDate { get; set; }

    [NotMapped]
    public string MotherBirthDatePersian
    {
        get => MotherBirthDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            MotherBirthDate = str == null ? null : str.Value;
        }
    }

    public string MotherMobileNumber { get; set; }
}