using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionRefer;
using ParsAlphabet.ERP.Application.Interfaces.MC.DeathCertificate1;
using ParsAlphabet.ERP.Application.Interfaces.MC.Dental;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using ParsAlphabet.WebService.Api.Model.CIS;
using ParsAlphabet.WebService.Api.Model.LIS.LaboratoryModel;
using ParsAlphabet.WebService.Api.Model.LIS.PublicViewModel;
using static ParsAlphabet.WebService.Api.Model.CIS.Public.SdkModels;
using SnomedctViewModel = ParsAlphabet.WebService.Api.Model.LIS.PublicViewModel.SnomedctViewModel;
using DoQuantity = ParsAlphabet.WebService.Api.Model.CIS.DoQuantity;
using ReasonEncounter = ParsAlphabet.WebService.Api.Model.CIS.ReasonEncounter;

namespace ParseAlphabet.ERP.Web.WebServices.CIS;

public class BindingCisApiServices
{
    public class BindingReferralModel_MedicalSepas
    {
        private readonly IAdmissionReferRepository _admissionReferRepository;
        private readonly IAdmissionsRepository _admissionsRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ISetupRepository _setupRepository;

        public BindingReferralModel_MedicalSepas(ICompanyRepository companyRepository, ISetupRepository setupRepository,
            IAdmissionReferRepository admissionReferRepository, IAdmissionsRepository admissionsRepository)
        {
            _companyRepository = companyRepository;
            _setupRepository = setupRepository;
            _admissionReferRepository = admissionReferRepository;
            _admissionsRepository = admissionsRepository;
        }

        public async Task<SendReferralPatientRecordInputModel> AdmissionSendReferralBinding_MedicalSepas(int referralId)
        {
            var result = new SendReferralPatientRecordInputModel();
            var referral = await _admissionReferRepository.GetAdmissionRefer(referralId);
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
            var systemId = await _setupRepository.GetCisWcfSystemId();
            var organization = new Organization
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationType { Code = organizationType.Id, Value = organizationType.Name }
            };
            var patient = new Patient
            {
                NationalCode = referral.PatientNationalCode,
                FirstName = referral.PatientFirstName,
                LastName = referral.PatientLastName,
                MobileNumber = referral.PatientMobileNo,
                FullAddress = referral.PatientAddress,
                GenderId = referral.PatientGenderId.ToString(),
                BirthDate = referral.PatientBirthDate,
                NationalityId = referral.PatientNationalityId,
                HomeTel = referral.PatientPhoneNo,
                Father_FirstName = referral.PatientFatherFirstName,
                PostalCode = referral.PatientPostalCode,
                MaritalStatusId = referral.PatientMaritalStatusId,
                EducationLevel = referral.PatientEducationLevelId > 0
                    ? new EducationLevel
                    {
                        Code = referral.PatientEducationLevelId.ToString(), Value = referral.PatientEducationLevelName
                    }
                    : null,
                IDCardNumber = referral.PatientIdCardNumber,
                JobTitle = referral.PatientJobTitle
            };
            var developer = new Developer
            {
                SystemId = systemId
            };
            var admission = new Admission
            {
                AdmissionId = referral.AdmissionId.ToString(),
                AdmissionDate = referral.AdmissionCreateDatePersian,
                AdmissionTime = referral.AdmissionCreateTime,
                HID = referral.AdmissionHID,
                ReasonForEncounter = referral.ReasonForEncounterCode != "0" && referral.ReasonForEncounterCode != ""
                    ? new ReasonEncounter
                        { Code = referral.ReasonForEncounterCode, Value = referral.ReasonForEncounterName }
                    : null
            };
            result.Organization = organization;
            result.CompositionUID = referral.CompositionUID == null ? "" : referral.CompositionUID;
            result.Patient = patient;
            result.PatientUID = referral.PersonUID == null ? "" : referral.PersonUID;
            result.ReferralId = referral.Id.ToString();
            result.Developer = developer;
            result.Admission = admission;
            result.AbuseHistorryList = referral.AdmissionReferAbuseHistoryLines != null
                ? referral.AdmissionReferAbuseHistoryLines.Select(a => new AbuseHistory
                {
                    AbuseDuration = new DoQuantity
                    {
                        Magnitude = a.AbuseDuration,
                        Unit = a.AbuseDurationUnitName
                    },
                    AmountOfAbuse = new DoQuantity
                    {
                        Magnitude = a.AmountOfAbuseDosage,
                        Unit = a.AmountOfAbuseUnitName
                    },
                    QuitDate = a.QuitDatePersian.ToString(),
                    StartDate = a.StartDatePersian.ToString(),
                    SubstanceType = new Snomedct
                    {
                        Code = a.SubstanceTypeCode,
                        Value = a.SubstanceTypeName
                    }
                }).ToList()
                : null;
            result.CareActionList = referral.AdmissionReferCareActionLines != null
                ? referral.AdmissionReferCareActionLines.Select(a => new CareAction
                {
                    ActionDescription = a.ActionDescription,
                    ActionName = new ActionNameType
                    {
                        Code = a.ActionCode.ToString(),
                        Value = a.ActionName
                    },
                    EndDate = string.IsNullOrEmpty(a.EndDateTimePersian) ? "" : a.EndDateTimePersian.Split(" ")[0],
                    StartDate =
                        string.IsNullOrEmpty(a.StartDateTimePersian) ? "" : a.StartDateTimePersian.Split(" ")[0],
                    EndTime = a.EndTime,
                    StartTime = a.StartTime,
                    TimeTaken = new DoQuantity
                    {
                        Magnitude = a.TimeTaken,
                        Unit = a.TimeTakenUnitName
                    }
                }).ToList()
                : null;
            result.ClinicList = referral.AdmissionReferClinicFindingLines != null
                ? referral.AdmissionReferClinicFindingLines.Select(a => new ClinicFinding
                {
                    AgeOfOnset = new DoQuantity
                    {
                        Magnitude = a.AgeOfOnset,
                        Unit = "a"
                    },
                    AnatomicalLocations = null,
                    DateofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian)
                        ? ""
                        : a.OnSetDateTimePersian.Split(" ")[0],
                    TimeofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian)
                        ? ""
                        : a.OnSetDateTimePersian.Split(" ")[1],
                    Description = a.Description,
                    Finding = new FindingType
                    {
                        Code = a.FindingCode,
                        Value = a.FindingName
                    },
                    Severity = new InjurySeverityType
                    {
                        Code = a.SeverityId.ToString(),
                        Value = a.SeverityName.ToString()
                    },
                    SeverityValue = 0,
                    NillSignificant = a.NillSignificant,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    }
                }).ToList()
                : null;
            result.DrugHistoryList = referral.AdmissionReferDrugHistoryLines != null
                ? referral.AdmissionReferDrugHistoryLines.Select(a => new DrugHistory
                {
                    Medication = new Medication
                    {
                        Code = a.MedicationCode,
                        Value = a.MedicationName
                    },
                    RouteOfAdministartion = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    }
                }).ToList()
                : null;
            result.DrugOrderedList = referral.AdmissionReferDrugOrderedLines != null
                ? referral.AdmissionReferDrugOrderedLines.Select(a => new DrugOrdered
                {
                    AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[0],
                    AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[1],
                    Description = a.Description,
                    Dosage = new DoQuantity
                    {
                        Magnitude = a.Dosage,
                        Unit = a.DosageUnitName
                    },
                    DrugGenericName = a.DrugGenericName,
                    DrugProduct = new DrugProduct
                    {
                        Code = a.ProductCode.ToString(),
                        Value = a.ProductName
                    },
                    Frequency = new Snomedct
                    {
                        Code = a.FrequencyCode,
                        Value = a.FrequencyName
                    },
                    LongTerm = new DoQuantity
                    {
                        Magnitude = a.LongTerm,
                        Unit = a.LongTermUnitName
                    },
                    Route = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    },
                    TotalNumber = a.TotalNumber
                }).ToList()
                : null;
            result.FamilyHistoryList = referral.AdmissionReferalFamilyHisotryLines != null
                ? referral.AdmissionReferalFamilyHisotryLines.Select(a => new FamilyHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    IsCauseofDeath = a.IsCauseofDeath,
                    RelatedPerson = new RelatedPerson
                    {
                        Code = a.RelatedPersonCode,
                        Value = a.RelatedPersonName
                    }
                }).ToList()
                : null;
            result.MedicalHistoryList = referral.AdmissionReferMedicalHistoryLines != null
                ? referral.AdmissionReferMedicalHistoryLines.Select(a => new MedicalHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    },
                    DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0]
                }).ToList()
                : null;
            result.Insurance = new BillInsurance
            {
                Insurer = new Insurer { Code = referral.BasicInsurerCode, Value = referral.BasicInsurerName },
                InsuranceNumber = referral.InsurNo,
                BasicInsuranceBoxId = referral.InsuranceBoxCode != null ? referral.InsuranceBoxCode : "",
                BasicInsuranceBoxName = referral.InsuranceBoxName,
                BasicInsurerHID = new HID
                {
                    AssignerCode = referral.BasicInsurerCode == "1" || referral.BasicInsurerCode == "2"
                        ? referral.BasicInsurerCode
                        : "3",
                    Id = referral.AdmissionHID
                },
                BasicInsurerSerialNumber = referral.InsurPageNo != 0 ? referral.InsurPageNo.ToString() : "",
                BasicInsuranceExpDate = referral.InsurExpDatePersian
            };
            result.DiagnosisList = referral.AdmissionDiagnosisLines != null
                ? referral.AdmissionDiagnosisLines.Select(a => new Diagnosis
                {
                    Comment = a.Comment,
                    DiagnosisDate = a.CreateDatePersian,
                    DiagnosisInfo = new Reason
                    {
                        Code = a.DiagnosisReasonCode,
                        Value = a.DiagnosisReasonName
                    },
                    DiagnosisTime = a.CreateTime,
                    Severity = new DiagnosisSeverity
                    {
                        Code = a.ServerityId.ToString(),
                        Value = a.SeverityName
                    },
                    Status = new DiagnosisStatus
                    {
                        Code = a.StatusId.ToString(),
                        Value = a.DiagnosisStatusName
                    }
                }).ToList()
                : null;
            result.Attender = new ProviderComp
            {
                FirstName = referral.AttenderFirstName,
                LastName = referral.AttenderLastName,
                FullName = referral.AttenderFullName,
                MscTypeId = referral.AttenderMSCTypeId,
                Id = referral.AttenderMSCId,
                Role = new AttenderRole { Code = referral.AttenderRoleCode, Value = referral.AttenderRoleName },
                Specialty = new AttenderSpecialty
                {
                    Code = !string.IsNullOrEmpty(referral.AttenderSpecialtyId) ? referral.AttenderSpecialtyId : "",
                    Value = referral.AttenderSpecialtyName
                }
            };

            result.ReferralInfo = new ReferralInfo
            {
                ReferredReason = new ReferredReason
                {
                    Code = referral.ReferredReasonId.ToString(),
                    Value = referral.ReferredReasonName
                },
                ReferredDate = referral.ReferredCreateDatePersian,
                ReferredFacility = null, //***
                ReferredProvider = new HealthcareProviderVO
                {
                    FirstName = referral.AdmitingDoctorFirstName,
                    LastName = referral.AdmitingDoctorLastName,
                    FullName = referral.AdmitingDoctorFullName,
                    Specialty = new DO_CODED_TEXT
                    {
                        Coded_string = !string.IsNullOrEmpty(referral.AdmitingSpecialtyId.ToString())
                            ? referral.AdmitingSpecialtyId.ToString()
                            : "",
                        Value = referral.AdmitingSpecialtyName, Terminology_id = "thritaehr.specialty"
                    }
                }, // null,//***
                ReferredTime = referral.ReferredCreateTime,
                ReferredType = new ReferredType
                {
                    Code = referral.ReferredTypeId.ToString(),
                    Value = referral.ReferredReasonTypeName
                },
                Description = referral.ReferredDescription
            };
            result.Referring = new ReferringComp
            {
                FirstName = referral.AttenderFirstName,
                LastName = referral.AttenderLastName,
                FullName = referral.AttenderFullName,
                MscTypeId = referral.AttenderMSCTypeId,
                Id = referral.AttenderMSCId,
                Role = new ReferringRole { Code = "1.3", Value = "پزشک ارجاع دهنده" },
                Specialty = new ReferringSpecialty
                {
                    Code = !string.IsNullOrEmpty(referral.AttenderSpecialtyId) ? referral.AttenderSpecialtyId : "",
                    Value = referral.AttenderSpecialtyName
                }
            };
            result.PhysicalExam = new PhysicalExam
            {
                BloodPressureList = referral.AdmissionReferBloodPressureLines != null
                    ? referral.AdmissionReferBloodPressureLines.Select(a => new BloodPressure
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        DiastolicBP = new DoQuantity
                        {
                            Magnitude = a.DiastolicBP,
                            Unit = "mm Hg"
                        },
                        Position = new Snomedct
                        {
                            Code = a.PositionCode,
                            Value = a.PositionName
                        },
                        SystolicBP = new DoQuantity
                        {
                            Magnitude = a.SystolicBP,
                            Unit = "mm Hg"
                        }
                    }).ToList()
                    : null,
                PulseList = referral.AdmissionReferPulseLines != null
                    ? referral.AdmissionReferPulseLines.Select(a => new Pulse
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        ClinicalDescription = a.ClinicalDescription,
                        IsPulsePresent = a.IsPulsePresent,
                        Method = new Snomedct
                        {
                            Code = a.MethodCode,
                            Value = a.MethodName
                        },
                        //Position = null,
                        //Position = new Position
                        //{
                        //    Code = a.PositionCode,
                        //    Value = a.PositionName
                        //},
                        PulseRate = new DoQuantity
                        {
                            Magnitude = a.PulseRate,
                            Unit = "/min"
                        },
                        LocationOfMeasurment = new Snomedct
                        {
                            Code = a.LocationOfMeasurmentCode,
                            Value = a.LocationOfMeasurmentName
                        },
                        Character = new Snomedct
                        {
                            Code = a.CharacterCode,
                            Value = a.CharacterName
                        },
                        Regularity = new Snomedct
                        {
                            Code = a.RegularityCode,
                            Value = a.RegularityName
                        },
                        Volume = new Snomedct
                        {
                            Code = a.VolumeCode,
                            Value = a.VolumeName
                        }
                    }).ToList()
                    : null,
                VitalSignsList = referral.AdmissionReferVitalSignsLines != null
                    ? referral.AdmissionReferVitalSignsLines.Select(a => new VitalSigns
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        PulseRate = new DoQuantity
                        {
                            Magnitude = a.PulseRate,
                            Unit = "/min"
                        },
                        RespiratoryRate = new DoQuantity
                        {
                            Magnitude = a.RespiratoryRate,
                            Unit = "/min"
                        },
                        Temperature = new DoQuantity
                        {
                            Magnitude = a.Temperature,
                            Unit = "C"
                        },
                        TemperatureLocation = new Snomedct
                        {
                            Code = a.TemperatureLocationCode,
                            Value = a.TemperatureLocationName
                        }
                    }).ToList()
                    : null,
                WaistHipsList = referral.AdmissionReferWaistHipLines != null
                    ? referral.AdmissionReferWaistHipLines.Select(a => new WaistHip
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        HipCircumference = new DoQuantity
                        {
                            Magnitude = a.HipCircumference,
                            Unit = "cm"
                        },
                        WaistCircumference = new DoQuantity
                        {
                            Magnitude = a.WaistCircumference,
                            Unit = "cm"
                        }
                    }).ToList()
                    : null,
                HeightWeightList = referral.AdmissionReferHeightWeightLines != null
                    ? referral.AdmissionReferHeightWeightLines.Select(a => new HeightWeight
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        Height = new DoQuantity
                        {
                            Magnitude = a.Height,
                            Unit = "cm"
                        },
                        Weight = new DoQuantity
                        {
                            Magnitude = a.Weight,
                            Unit = "km"
                        }
                    }).ToList()
                    : null
            };
            result.AdverseReactionList = referral.AdmissionReferAdverseReactionLines != null
                ? referral.AdmissionReferAdverseReactionLines.Select(a => new AdverseReaction
                {
                    Description = a.Description,
                    Reaction = new Snomedct
                    {
                        Code = a.ReactionCode.ToString(),
                        Value = a.ReactionName
                    },
                    ReactionCategory = new Snomedct
                    {
                        Code = a.ReactionCategoryCode.ToString(),
                        Value = a.ReactionCategoryName
                    },
                    Severity = new DiagnosisSeverity
                    {
                        Code = a.DiagnosisSeverityId.ToString(),
                        Value = a.DiagnosisSeverityName.ToString()
                    },
                    CausativeAgent = new CausativeAgent
                    {
                        Code = a.CausativeAgentCode,
                        Value = a.CausativeAgentName
                    },
                    CausativeAgentCategory = new Snomedct
                    {
                        Code = a.CausativeAgentCategoryCode,
                        Value = a.CausativeAgentCategoryName
                    }
                }).ToList()
                : null;

            return result;
        }

        public async Task<SendFeedbackPatientRecordInputModel> SendFeedbackPatientRecordBinding_Medical(int referralId)
        {
            var result = new SendFeedbackPatientRecordInputModel();
            var referral = await _admissionReferRepository.GetAdmissionFeedback(referralId);
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
            var systemId = await _setupRepository.GetCisWcfSystemId();

            var organization = new Organization
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationType { Code = organizationType.Id, Value = organizationType.Name }
            };
            var patient = new Patient
            {
                NationalCode = referral.PatientNationalCode,
                FirstName = referral.PatientFirstName,
                LastName = referral.PatientLastName,
                MobileNumber = referral.PatientMobileNo,
                FullAddress = referral.PatientAddress,
                GenderId = referral.PatientGenderId.ToString(),
                BirthDate = referral.PatientBirthDate,
                NationalityId = referral.PatientNationalityId,
                HomeTel = referral.PatientPhoneNo,
                Father_FirstName = referral.PatientFatherFirstName,
                PostalCode = referral.PatientPostalCode,
                MaritalStatusId = referral.PatientMaritalStatusId,
                EducationLevel = referral.PatientEducationLevelId > 0
                    ? new EducationLevel
                    {
                        Code = referral.PatientEducationLevelId.ToString(), Value = referral.PatientEducationLevelName
                    }
                    : null,
                IDCardNumber = referral.PatientIdCardNumber,
                JobTitle = referral.PatientJobTitle
            };
            var developer = new Developer
            {
                SystemId = systemId
            };
            var admission = new Admission
            {
                AdmissionId = referral.AdmissionId.ToString(),
                AdmissionDate = referral.AdmissionCreateDatePersian,
                AdmissionTime = referral.AdmissionCreateTime,
                HID = referral.AdmissionHID,
                ReasonForEncounter = referral.ReasonForEncounterCode != "0" && referral.ReasonForEncounterCode != ""
                    ? new ReasonEncounter
                        { Code = referral.ReasonForEncounterCode, Value = referral.ReasonForEncounterName }
                    : null
            };

            var assignerCode = string.Empty;
            if (referral.RelatedHID != null && referral.RelatedHID != "")
            {
                if (referral.RelatedHID.StartsWith("Z"))
                {
                    if (referral.RelatedHID.Length == 12)
                        assignerCode = referral.RelatedHID.Substring(1, 2);
                    else
                        assignerCode = referral.RelatedHID.Substring(1, 1);
                }
                else if (referral.RelatedHID.Length == 11)
                {
                    assignerCode = referral.RelatedHID.Substring(0, 2);
                }
                else
                {
                    assignerCode = referral.RelatedHID.Substring(0, 1);
                }
            }

            //var assignerCode = referral.RelatedHID.Substring(0, 2);
            //var referralHID = referral.RelatedHID.Remove(0, 2);
            var referralHID = referral.RelatedHID;
            var referralAssigner = string.Empty;

            if (assignerCode == "1")
                referralAssigner = "1";
            else if (assignerCode == "2")
                referralAssigner = "2";
            else
                referralAssigner = "3";

            result.Organization = organization;
            result.CompositionUID = referral.CompositionUID;
            result.Patient = patient;
            result.PatientUID = referral.PersonUID;
            result.ReferralId = referralHID;
            result.ReferralAssigner = referralAssigner;
            result.Developer = developer;
            result.Admission = admission;
            result.AbuseHistorryList = referral.AdmissionReferAbuseHistoryLines != null
                ? referral.AdmissionReferAbuseHistoryLines.Select(a => new AbuseHistory
                {
                    AbuseDuration = new DoQuantity
                    {
                        Magnitude = a.AbuseDuration,
                        Unit = a.AbuseDurationUnitName
                    },
                    AmountOfAbuse = new DoQuantity
                    {
                        Magnitude = a.AmountOfAbuseDosage,
                        Unit = a.AmountOfAbuseUnitName
                    },
                    QuitDate = a.QuitDatePersian.ToString(),
                    StartDate = a.StartDatePersian.ToString(),
                    SubstanceType = new Snomedct
                    {
                        Code = a.SubstanceTypeCode,
                        Value = a.SubstanceTypeName
                    }
                }).ToList()
                : null;
            result.CareActionList = referral.AdmissionReferCareActionLines != null
                ? referral.AdmissionReferCareActionLines.Select(a => new CareAction
                {
                    ActionDescription = a.ActionDescription,
                    ActionName = new ActionNameType
                    {
                        Code = a.ActionCode.ToString(),
                        Value = a.ActionName
                    },
                    EndDate = string.IsNullOrEmpty(a.EndDateTimePersian) ? "" : a.EndDateTimePersian.Split(" ")[0],
                    StartDate =
                        string.IsNullOrEmpty(a.StartDateTimePersian) ? "" : a.StartDateTimePersian.Split(" ")[0],
                    EndTime = a.EndTime,
                    StartTime = a.StartTime,
                    TimeTaken = new DoQuantity
                    {
                        Magnitude = a.TimeTaken,
                        Unit = a.TimeTakenUnitName
                    }
                }).ToList()
                : null;
            result.ClinicList = referral.AdmissionReferClinicFindingLines != null
                ? referral.AdmissionReferClinicFindingLines.Select(a => new ClinicFinding
                {
                    AgeOfOnset = new DoQuantity
                    {
                        Magnitude = a.AgeOfOnset,
                        Unit = "a"
                    },
                    AnatomicalLocations = null,
                    DateofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian)
                        ? ""
                        : a.OnSetDateTimePersian.Split(" ")[0],
                    TimeofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian)
                        ? ""
                        : a.OnSetDateTimePersian.Split(" ")[1],
                    Description = a.Description,
                    Finding = new FindingType
                    {
                        Code = a.FindingCode,
                        Value = a.FindingName
                    },
                    Severity = new InjurySeverityType
                    {
                        Code = a.SeverityId.ToString(),
                        Value = a.SeverityName
                    },
                    SeverityValue = 0,
                    NillSignificant = a.NillSignificant,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    }
                }).ToList()
                : null;
            result.DrugHistoryList = referral.AdmissionReferDrugHistoryLines != null
                ? referral.AdmissionReferDrugHistoryLines.Select(a => new DrugHistory
                {
                    Medication = new Medication
                    {
                        Code = a.MedicationCode,
                        Value = a.MedicationName
                    },
                    RouteOfAdministartion = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    }
                }).ToList()
                : null;
            result.DrugOrderedList = referral.AdmissionReferDrugOrderedLines != null
                ? referral.AdmissionReferDrugOrderedLines.Select(a => new DrugOrdered
                {
                    AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[0],
                    AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[1],
                    Description = a.Description,
                    Dosage = new DoQuantity
                    {
                        Magnitude = a.Dosage,
                        Unit = a.DosageUnitName
                    },
                    DrugGenericName = a.DrugGenericName,
                    DrugProduct = new DrugProduct
                    {
                        Code = a.ProductCode.ToString(),
                        Value = a.ProductName
                    },
                    Frequency = new Snomedct
                    {
                        Code = a.FrequencyCode,
                        Value = a.FrequencyName
                    },
                    LongTerm = new DoQuantity
                    {
                        Magnitude = a.LongTerm,
                        Unit = a.LongTermUnitName
                    },
                    Route = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    },
                    TotalNumber = a.TotalNumber
                }).ToList()
                : null;
            result.FamilyHistoryList = referral.AdmissionReferalFamilyHisotryLines != null
                ? referral.AdmissionReferalFamilyHisotryLines.Select(a => new FamilyHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    IsCauseofDeath = a.IsCauseofDeath,
                    RelatedPerson = new RelatedPerson
                    {
                        Code = a.RelatedPersonCode,
                        Value = a.RelatedPersonName
                    }
                }).ToList()
                : null;
            result.MedicalHistoryList = referral.AdmissionReferMedicalHistoryLines != null
                ? referral.AdmissionReferMedicalHistoryLines.Select(a => new MedicalHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    },
                    //DateofOnset = a.DateOfOnsetPersian
                    DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0]
                    //DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0],
                }).ToList()
                : null;
            result.Insurance = new BillInsurance
            {
                Insurer = new Insurer { Code = referral.BasicInsurerCode, Value = referral.BasicInsurerName },
                InsuranceNumber = referral.InsurNo,
                BasicInsuranceBoxId = referral.InsuranceBoxCode != null ? referral.InsuranceBoxCode : "",
                BasicInsuranceBoxName = referral.InsuranceBoxName,
                BasicInsurerHID = new HID
                {
                    AssignerCode = referral.BasicInsurerCode == "1" || referral.BasicInsurerCode == "2"
                        ? referral.BasicInsurerCode
                        : "3",
                    Id = referral.AdmissionHID
                },
                BasicInsurerSerialNumber = referral.InsurPageNo != 0 ? referral.InsurPageNo.ToString() : "",
                BasicInsuranceExpDate = referral.InsurExpDatePersian
            };
            //result.lifeCycleState = new LifeCycleState
            //{
            //    StatusCode = referral.LifeCycleStateCode,
            //    StatusName = referral.LifeCycleStateName
            //};

            result.DiagnosisList = referral.AdmissionDiagnosisLines != null
                ? referral.AdmissionDiagnosisLines.Select(a => new Diagnosis
                {
                    Comment = a.Comment,
                    DiagnosisDate = a.CreateDatePersian,
                    DiagnosisInfo = new Reason
                    {
                        Code = a.DiagnosisReasonCode.ToString(),
                        Value = a.DiagnosisReasonName
                    },
                    DiagnosisTime = a.CreateTime,
                    Severity = new DiagnosisSeverity
                    {
                        Code = a.ServerityId.ToString(),
                        Value = a.SeverityName
                    },
                    Status = new DiagnosisStatus
                    {
                        Code = a.StatusId.ToString(),
                        Value = a.DiagnosisStatusName
                    }
                }).ToList()
                : null;

            result.Attender = new ProviderComp
            {
                FirstName = referral.AttenderFirstName,
                LastName = referral.AttenderLastName,
                FullName = referral.AttenderFullName,
                MscTypeId = referral.AttenderMSCTypeId,
                Id = referral.AttenderMSCId,
                Role = new AttenderRole { Code = referral.AttenderRoleCode, Value = referral.AttenderRoleName },
                Specialty = new AttenderSpecialty
                {
                    Code = !string.IsNullOrEmpty(referral.AttenderSpecialtyId) ? referral.AttenderSpecialtyId : "",
                    Value = referral.AttenderSpecialtyName
                }
            };

            // var doDate = Convert_To_DoDate(referral.ReferredCreateDatePersian);

            //result.referralInfo = new ReferralInfo
            //{
            //    ReferredReason = new ReferredReason
            //    {
            //        Code = referral.ReferredReasonId.ToString(),
            //        Value = referral.ReferredReasonName
            //    },
            //    ReferredDate = referral.ReferredCreateDatePersian,
            //    ReferredFacility = null,
            //    ReferredProvider = null,
            //    ReferredTime = referral.ReferredCreateTime,
            //    ReferredType = new ReferredType
            //    {
            //        Code = referral.ReferredTypeId.ToString(),
            //        Value = referral.ReferredReasonTypeName
            //    },
            //    Description = referral.ReferredDescription
            //};

            result.Referring = new ReferringComp
            {
                FirstName = referral.AttenderFirstName,
                LastName = referral.AttenderLastName,
                FullName = referral.AttenderFullName,
                MscTypeId = referral.AttenderMSCTypeId,
                Id = referral.AttenderMSCId,
                Role = new ReferringRole { Code = "1.3", Value = "پزشک ارجاع دهنده" },
                Specialty = new ReferringSpecialty
                {
                    Code = !string.IsNullOrEmpty(referral.AttenderSpecialtyId) ? referral.AttenderSpecialtyId : "",
                    Value = referral.AttenderSpecialtyName
                }
            };
            result.PhysicalExam = new PhysicalExam
            {
                BloodPressureList = referral.AdmissionReferBloodPressureLines != null
                    ? referral.AdmissionReferBloodPressureLines.Select(a => new BloodPressure
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        DiastolicBP = new DoQuantity
                        {
                            Magnitude = a.DiastolicBP,
                            Unit = "mm Hg"
                        },
                        Position = new Snomedct
                        {
                            Code = a.PositionCode,
                            Value = a.PositionName
                        },
                        SystolicBP = new DoQuantity
                        {
                            Magnitude = a.SystolicBP,
                            Unit = "mm Hg"
                        }
                    }).ToList()
                    : null,
                PulseList = referral.AdmissionReferPulseLines != null
                    ? referral.AdmissionReferPulseLines.Select(a => new Pulse
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        ClinicalDescription = a.ClinicalDescription,
                        IsPulsePresent = a.IsPulsePresent,
                        Method = new Snomedct
                        {
                            Code = a.MethodCode,
                            Value = a.MethodName
                        },
                        //Position = null,
                        //Position = new Position
                        //{
                        //    Code = a.PositionCode,
                        //    Value = a.PositionName
                        //},
                        PulseRate = new DoQuantity
                        {
                            Magnitude = a.PulseRate,
                            Unit = "/min"
                        }
                    }).ToList()
                    : null,
                VitalSignsList = referral.AdmissionReferVitalSignsLines != null
                    ? referral.AdmissionReferVitalSignsLines.Select(a => new VitalSigns
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        PulseRate = new DoQuantity
                        {
                            Magnitude = a.PulseRate,
                            Unit = "/min"
                        },
                        RespiratoryRate = new DoQuantity
                        {
                            Magnitude = a.RespiratoryRate,
                            Unit = "/min"
                        },
                        Temperature = new DoQuantity
                        {
                            Magnitude = a.Temperature,
                            Unit = "C"
                        }
                    }).ToList()
                    : null,
                WaistHipsList = referral.AdmissionReferWaistHipLines != null
                    ? referral.AdmissionReferWaistHipLines.Select(a => new WaistHip
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        HipCircumference = new DoQuantity
                        {
                            Magnitude = a.HipCircumference,
                            Unit = "cm"
                        },
                        WaistCircumference = new DoQuantity
                        {
                            Magnitude = a.WaistCircumference,
                            Unit = "cm"
                        }
                    }).ToList()
                    : null,
                HeightWeightList = referral.AdmissionReferHeightWeightLines != null
                    ? referral.AdmissionReferHeightWeightLines.Select(a => new HeightWeight
                    {
                        ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[0],
                        ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian)
                            ? ""
                            : a.ObservationDateTimePersian.Split(" ")[1],
                        Height = new DoQuantity
                        {
                            Magnitude = a.Height,
                            Unit = "cm"
                        },
                        Weight = new DoQuantity
                        {
                            Magnitude = a.Weight,
                            Unit = "km"
                        }
                    }).ToList()
                    : null
            };
            result.FollowUp = new FollowUpPlan
            {
                NextEncounter = new DoQuantity
                {
                    Magnitude = referral.FollowUpNextEncounter,
                    Unit = referral.FollowUpNextEncounterUnitName
                },
                NextEncounterDate = referral.FollowUpDateTimePersian != null
                    ? referral.FollowUpDateTimePersian.Split(" ")[0]
                    : "", // referral.FollowUpDateTime.ToString(),
                NextEncounterTime = referral.FollowUpDateTimePersian != null
                    ? referral.FollowUpDateTimePersian.Split(" ")[1]
                    : "",
                Description = referral.FollowUpDescription,
                Type = new FollowUpType
                {
                    Code = referral.FollowUpNextEncounterType.ToString(),
                    Value = referral.FollowUpNextEncounterTypeName
                }
            };

            return result;
        }
    }

    public class BindingDentalModel_MedicalSepas
    {
        private readonly IDentalRepository _admissionDentalRepository;
        private readonly IAdmissionsRepository _admissionsRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ISetupRepository _setupRepository;

        public BindingDentalModel_MedicalSepas(ICompanyRepository companyRepository, ISetupRepository setupRepository,
            IDentalRepository admissionDentalRepository
            , IAdmissionsRepository admissionsRepository)
        {
            _companyRepository = companyRepository;
            _setupRepository = setupRepository;
            _admissionsRepository = admissionsRepository;
            _admissionDentalRepository = admissionDentalRepository;
        }

        public async Task<SaveDentalCaseInputModel> SendDentalBinding_MedicalSepas(int dentalId)
        {
            var result = new SaveDentalCaseInputModel();
            var dental = await _admissionDentalRepository.GetAdmissionDental(dentalId);
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
            var systemId = await _setupRepository.GetCisWcfSystemId();
            var organization = new Organization
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationType { Code = organizationType.Id, Value = organizationType.Name }
            };
            var patient = new Patient
            {
                NationalCode = dental.PatientNationalCode,
                FirstName = dental.PatientFirstName,
                LastName = dental.PatientLastName,
                MobileNumber = dental.PatientMobileNo,
                FullAddress = dental.PatientAddress,
                GenderId = dental.PatientGenderId.ToString(),
                BirthDate = dental.PatientBirthDate,
                NationalityId = dental.PatientNationalityId,
                HomeTel = dental.PatientPhoneNo,
                Father_FirstName = dental.PatientFatherFirstName,
                PostalCode = dental.PatientPostalCode,
                MaritalStatusId = dental.PatientMaritalStatusId,
                EducationLevel = dental.PatientEducationLevelId > 0
                    ? new EducationLevel
                        { Code = dental.PatientEducationLevelId.ToString(), Value = dental.PatientEducationLevelName }
                    : null,
                IDCardNumber = dental.PatientIdCardNumber,
                JobTitle = dental.PatientJobTitle
            };
            var developer = new Developer
            {
                SystemId = systemId
            };
            var admission = new Admission
            {
                AdmissionId = dental.AdmissionId.ToString(),
                AdmissionDate = dental.AdmissionCreateDatePersian,
                AdmissionTime = dental.AdmissionCreateTime,
                HID = dental.AdmissionHID
                //ReasonForEncounter=
            };

            result.Organization = organization;
            result.CompositionUID = dental.CompositionUID;
            result.Patient = patient;
            result.PatientUID = dental.PersonUID;
            // result.ReferralId = dental.Id.ToString();
            result.Developer = developer;
            result.Admission = admission;
            result.AbuseHistorryList = dental.DentalAbuseHistoryLines != null
                ? dental.DentalAbuseHistoryLines.Select(a => new AbuseHistory
                {
                    AbuseDuration = new DoQuantity
                    {
                        Magnitude = a.AbuseDuration,
                        Unit = a.AbuseDurationUnitName
                    },
                    AmountOfAbuse = new DoQuantity
                    {
                        Magnitude = a.AmountOfAbuseDosage,
                        Unit = a.AmountOfAbuseUnitName
                    },
                    QuitDate = a.QuitDatePersian.ToString(),
                    StartDate = a.StartDatePersian.ToString(),
                    SubstanceType = new Snomedct
                    {
                        Code = a.SubstanceTypeCode,
                        Value = a.SubstanceTypeName
                    }
                }).ToList()
                : null;

            result.DrugHistoryList = dental.DentalDrugHistoryLines != null
                ? dental.DentalDrugHistoryLines.Select(a => new DrugHistory
                {
                    Medication = new Medication
                    {
                        Code = a.MedicationCode,
                        Value = a.MedicationName
                    },
                    RouteOfAdministartion = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    }
                }).ToList()
                : null;

            result.DrugOrderedList = dental.DentalDrugOrderedLines != null
                ? dental.DentalDrugOrderedLines.Select(a => new DrugOrdered
                {
                    AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[0],
                    AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian)
                        ? ""
                        : a.AdministrationDateTimePersian.Split(" ")[1],
                    Description = a.Description,
                    Dosage = new DoQuantity
                    {
                        Magnitude = a.Dosage,
                        Unit = a.DosageUnitName
                    },
                    DrugGenericName = a.DrugGenericName,
                    DrugProduct = new DrugProduct
                    {
                        Code = a.ProductCode.ToString(),
                        Value = a.ProductName
                    },
                    Frequency = new Snomedct
                    {
                        Code = a.FrequencyCode,
                        Value = a.FrequencyName
                    },
                    LongTerm = new DoQuantity
                    {
                        Magnitude = a.LongTerm,
                        Unit = a.LongTermUnitName
                    },
                    Route = new Snomedct
                    {
                        Code = a.RouteCode,
                        Value = a.RouteName
                    },
                    TotalNumber = a.TotalNumber
                }).ToList()
                : null;

            result.AdverseReactionList = dental.DentalAdverseReactionLines != null
                ? dental.DentalAdverseReactionLines.Select(a => new AdverseReaction
                {
                    Description = a.Description,
                    Reaction = new Snomedct
                    {
                        Code = a.ReactionCode.ToString(),
                        Value = a.ReactionName
                    },
                    ReactionCategory = new Snomedct
                    {
                        Code = a.ReactionCategoryCode.ToString(),
                        Value = a.ReactionCategoryName
                    },
                    Severity = new DiagnosisSeverity
                    {
                        Code = a.DiagnosisSeverityId.ToString(),
                        Value = a.DiagnosisSeverityName
                    },
                    CausativeAgent = new CausativeAgent
                    {
                        Code = a.CausativeAgentCode,
                        Value = a.CausativeAgentName
                    },
                    CausativeAgentCategory = new Snomedct
                    {
                        Code = a.CausativeAgentCategoryCode,
                        Value = a.CausativeAgentCategoryName
                    }
                }).ToList()
                : null;

            result.FamilyHistoryList = dental.DentalFamilyHisotryLines != null
                ? dental.DentalFamilyHisotryLines.Select(a => new FamilyHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    IsCauseofDeath = a.IsCauseofDeath,
                    RelatedPerson = new RelatedPerson
                    {
                        Code = a.RelatedPersonCode,
                        Value = a.RelatedPersonName
                    }
                }).ToList()
                : null;

            result.MedicalHistoryList = dental.DentalMedicalHistoryLines != null
                ? dental.DentalMedicalHistoryLines.Select(a => new MedicalHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    },
                    DateofOnset = a.DateOfOnsetPersian
                }).ToList()
                : null;

            if (dental.DentalTreatmentLineDetails != null)
                if (dental.DentalToothLines.ListHasRow())
                {
                    var treatmentList = new DentalTreatment[dental.DentalToothLines.Count];

                    for (var i = 0; i < dental.DentalToothLines.Count; i++)
                    {
                        var currentTooth = dental.DentalToothLines[i];

                        treatmentList[i] = new DentalTreatment();

                        var tooth = new Tooth
                        {
                            IsMissing = currentTooth.IsMissing,
                            Part = new Snomedct
                                { Code = currentTooth.PartCode.ToString(), Value = currentTooth.PartName },
                            ToothName = new ToothName { Code = currentTooth.ToothCode, Value = currentTooth.ToothName },
                            Segment = new Segment { Code = currentTooth.SegmentCode, Value = currentTooth.SegmentName }
                        };

                        treatmentList[i].Tooth = tooth;

                        if (dental.DentalTreatmentLineDetails != null)
                        {
                            var dentalTreatmentList = dental.DentalTreatmentLineDetails.Where(t =>
                                t.HeaderId == currentTooth.HeaderId && t.RowNumber == currentTooth.RowNumber).ToList();
                            treatmentList[i].Treatment = new ServiceDetails[dentalTreatmentList.Count].ToList();

                            if (dentalTreatmentList.ListHasRow())
                                for (var d = 0; d < dentalTreatmentList.Count; d++)
                                {
                                    var currentTreatment = dentalTreatmentList[d];
                                    var treatment = new ServiceDetails
                                    {
                                        Service = new ServiceTreathment
                                        {
                                            Code = currentTreatment.ServiceCode,
                                            Value = currentTreatment.ServiceCodeName
                                        },
                                        ServiceType = new serviceType
                                        {
                                            Code = currentTreatment.ServiceTypeId,
                                            Value = currentTreatment.ServiceTypeName
                                        },
                                        ServiceCount = new DoQuantity
                                        {
                                            Magnitude = currentTreatment.ServiceCount,
                                            Unit = currentTreatment.ServiceCountUnitName
                                        },
                                        StartDate = currentTreatment.StartDateTimePersian.Split(" ")[0],
                                        StartTime = currentTreatment.StartDateTimePersian.Split(" ")[1],
                                        EndDate = currentTreatment.EndDateTimePersian.Split(" ")[0],
                                        EndTime = currentTreatment.EndDateTimePersian.Split(" ")[1],

                                        BasicInsuranceContribution = currentTreatment.BasicInsuranceContribution,
                                        PatientContribution = currentTreatment.PatientContribution,
                                        TotalCharge = currentTreatment.TotalCharge
                                    };
                                    treatmentList[i].Treatment[d] = treatment;
                                }
                        }

                        treatmentList[i].Comment = dental.DentalToothLines[i].Comment;
                    }

                    result.DentalTreatmentList = treatmentList.ToList();
                }

            if (dental.DentalToothLineDetails != null)
                if (dental.DentalToothLines.ListHasRow())
                {
                    var diagnosisList = new DentalDiagnosis[dental.DentalToothLines.Count];

                    for (var i = 0; i < dental.DentalToothLines.Count; i++)
                    {
                        var currentTooth = dental.DentalToothLines[i];

                        diagnosisList[i] = new DentalDiagnosis();

                        var tooth = new Tooth
                        {
                            IsMissing = currentTooth.IsMissing,
                            Part = new Snomedct
                                { Code = currentTooth.PartCode.ToString(), Value = currentTooth.PartName },
                            ToothName = new ToothName { Code = currentTooth.ToothCode, Value = currentTooth.ToothName },
                            Segment = new Segment { Code = currentTooth.SegmentCode, Value = currentTooth.SegmentName }
                        };

                        diagnosisList[i].Tooth = tooth;

                        if (dental.DentalToothLineDetails != null)
                        {
                            var dentalDiagnosisList = dental.DentalToothLineDetails.Where(t =>
                                t.HeaderId == currentTooth.HeaderId && t.RowNumber == currentTooth.RowNumber).ToList();
                            diagnosisList[i].Diagnosis = new Diagnosis[dentalDiagnosisList.Count].ToList();

                            if (dentalDiagnosisList.ListHasRow())
                                for (var d = 0; d < dentalDiagnosisList.Count; d++)
                                {
                                    var currentDiagnosis = dentalDiagnosisList[d];

                                    var diagnosis = new Diagnosis
                                    {
                                        DiagnosisInfo = new Reason
                                        {
                                            Code = currentDiagnosis.DiagnosisReasonCode,
                                            Value = currentDiagnosis.DiagnosisReasonName
                                        },
                                        Severity = new DiagnosisSeverity
                                        {
                                            Code = currentDiagnosis.ServerityId.ToString(),
                                            Value = currentDiagnosis.SeverityName
                                        },
                                        Status = new DiagnosisStatus
                                        {
                                            Code = currentDiagnosis.StatusId.ToString(),
                                            Value = currentDiagnosis.DiagnosisStatusName
                                        },
                                        DiagnosisDate = currentDiagnosis.CreateDatePersian,
                                        DiagnosisTime = currentDiagnosis.CreateTime,
                                        Comment = currentDiagnosis.Comment
                                    };
                                    diagnosisList[i].Diagnosis[d] = diagnosis;
                                }
                        }

                        diagnosisList[i].Comment = dental.DentalToothLines[i].Comment;
                    }

                    result.DentalDiagnosisList = diagnosisList.ToList();
                }

            var insuranceList = new List<BillInsurance>();
            var billInsurances = new[]
            {
                new BillInsurance
                {
                    Insurer = new Insurer { Code = dental.BasicInsurerCode, Value = dental.BasicInsurerName },
                    InsuranceNumber = dental.InsurNo,
                    BasicInsuranceBoxId = dental.InsurerLineCode != null ? dental.InsurerLineCode : "",
                    BasicInsuranceBoxName = dental.InsurerLineName,
                    BasicInsurerHID = new HID
                    {
                        AssignerCode = dental.BasicInsurerCode == "1" || dental.BasicInsurerCode == "2"
                            ? dental.BasicInsurerCode
                            : "3",
                        Id = dental.AdmissionHID
                    },
                    BasicInsurerSerialNumber = dental.InsurPageNo != 0 ? dental.InsurPageNo.ToString() : "",
                    BasicInsuranceExpDate = dental.BasicInsurerExpirationDatePersian
                }
            };

            result.InsuranceList = billInsurances.ToList();

            result.DiagnosisList = dental.AdmissionDiagnosisLines != null
                ? dental.AdmissionDiagnosisLines.Select(a => new Diagnosis
                {
                    Comment = a.Comment,
                    DiagnosisDate = a.CreateDatePersian,
                    DiagnosisInfo = new Reason
                    {
                        Code = a.DiagnosisReasonCode,
                        Value = a.DiagnosisReasonName
                    },
                    DiagnosisTime = a.CreateTime,
                    Severity = new DiagnosisSeverity
                    {
                        Code = a.ServerityId.ToString(),
                        Value = a.SeverityName
                    },
                    Status = new DiagnosisStatus
                    {
                        Code = a.StatusId.ToString(),
                        Value = a.DiagnosisStatusName
                    }
                }).ToList()
                : null;
            result.Attender = new ProviderComp
            {
                FirstName = dental.AttenderFirstName,
                LastName = dental.AttenderLastName,
                FullName = dental.AttenderFullName,
                MscTypeId = dental.AttenderMSCTypeId,
                Id = dental.AttenderMSCId,
                Role = new AttenderRole { Code = dental.AttenderRoleCode, Value = dental.AttenderRoleName },
                Specialty = new AttenderSpecialty
                {
                    Code = !string.IsNullOrEmpty(dental.AttenderSpecialtyId) ? dental.AttenderSpecialtyId : "",
                    Value = dental.AttenderSpecialtyName
                }
            };

            //result.Referring = new ReferringComp
            //{
            //    FirstName = dental.AttenderFirstName,
            //    LastName = dental.AttenderLastName,
            //    FullName = dental.AttenderFullName,
            //    MscTypeId = dental.AttenderMSCTypeId,
            //    Id = dental.AttenderMSCId.ToString(),
            //    Role = new ReferringRole() { Code = "1.3", Value = "پزشک ارجاع دهنده" },
            //    Specialty = new ReferringSpecialty() { Code = !string.IsNullOrEmpty(dental.AttenderSpecialtyId.ToString()) ? dental.AttenderSpecialtyId.ToString() : "", Value = dental.AttenderSpecialtyName },
            //};

            return result;
        }
    }

    public class BindingDeathCertificateModel_MedicalSepas
    {
        private readonly IAdmissionsRepository _admissionsRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IDeathCertificateRepository _deathCertificateRepository;
        private readonly ISetupRepository _setupRepository;

        public BindingDeathCertificateModel_MedicalSepas(ICompanyRepository companyRepository,
            ISetupRepository setupRepository,
            IDeathCertificateRepository deathCertificateRepository,
            IAdmissionsRepository admissionsRepository)
        {
            _companyRepository = companyRepository;
            _setupRepository = setupRepository;
            _deathCertificateRepository = deathCertificateRepository;
            _admissionsRepository = admissionsRepository;
        }

        public async Task<SaveDeathCertificateInputModel> SendDeathCertificateBinding(int deathId)
        {
            var result = new SaveDeathCertificateInputModel();
            var death = await _deathCertificateRepository.GetDeathCertificate(deathId);
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
            var systemId = await _setupRepository.GetCisWcfSystemId();
            var organization = new Organization
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationType { Code = organizationType.Id, Value = organizationType.Name }
            };
            var patient = new Patient
            {
                UnIdentified = death.NationalCode != "" && death.NationalCode != null && death.NationalCode != "0"
                    ? false
                    : true,
                NationalCode = death.NationalCode,
                FirstName = death.PatientFirstName,
                LastName = death.PatientLastName,
                MobileNumber = death.PatientMobileNo,
                FullAddress = death.PatientAddress,
                GenderId = death.PatientGenderId.ToString(),
                BirthDate = death.BirthDate,
                NationalityId = death.PatientNationalityId,
                HomeTel = death.PatientPhoneNo,
                Father_FirstName = death.FatherFirstName,
                PostalCode = death.PostalCode,
                MaritalStatusId = death.MaritalStatusId,
                EducationLevel = death.EducationLevelId > 0
                    ? new EducationLevel { Code = death.EducationLevelId.ToString(), Value = death.EducationLevelName }
                    : null,
                IDCardNumber = death.IdCardNumber,
                JobTitle = death.JobTitle
            };

            var developer = new Developer
            {
                SystemId = systemId
            };


            result.Organization = organization;
            result.CompositionUID = death.CompositionUID;
            result.Patient = patient;
            result.PatientUID = death.PersonUID;
            result.Developer = developer;
            //result.admission = admission;

            result.DeathCauseList = death.DeathCauseLines != null
                ? death.DeathCauseLines.Select(a => new DeathCause
                {
                    CauseInfo = new FindingType
                    {
                        Code = a.CauseCode,
                        Value = a.CauseName
                    },
                    Duration2Death = new DoQuantity
                    {
                        Magnitude = a.DurationDeath,
                        Unit = a.DurationDeathUnitName
                    },
                    Status = new DeathCauseStatus
                    {
                        Code = a.StatusId.ToString(),
                        Value = a.DeathCauseStatusName
                    }
                }).ToList()
                : null;


            result.RelatedConditionList = death.DeathMedicalHistoryLines != null
                ? death.DeathMedicalHistoryLines.Select(a => new MedicalHistory
                {
                    Condition = new Condition
                    {
                        Code = a.ConditionCode,
                        Value = a.ConditionName
                    },
                    Description = a.Description,
                    OnsetDurationToPresent = new DoQuantity
                    {
                        Magnitude = a.OnsetDurationToPresent,
                        Unit = a.OnsetDurationToPresentUnitName
                    },
                    DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0]
                }).ToList()
                : null;


            if (death.DeathInfantDeliveryLines.ListHasRow())
            {
                var currentInfantDelivery = death.DeathInfantDeliveryLines[0];

                var Mother = new Patient
                {
                    //NationalCode = currentInfantDelivery.MotherNationalCode,
                    //FirstName = currentInfantDelivery.MotherFirstName,
                    //LastName = currentInfantDelivery.MotherLastName,
                    //MobileNumber = currentInfantDelivery.MotherMobileNumber,
                    //GenderId = 2.ToString(),
                    //BirthDate = currentInfantDelivery.MotherBirthDatePersian
                    NationalCode = death.NationalCode,
                    FirstName = death.PatientFirstName,
                    LastName = death.PatientLastName,
                    MobileNumber = death.PatientMobileNo,
                    FullAddress = death.PatientAddress,
                    GenderId = death.PatientGenderId.ToString(),
                    BirthDate = death.BirthDate,
                    NationalityId = death.PatientNationalityId,
                    HomeTel = death.PatientPhoneNo,
                    Father_FirstName = death.FatherFirstName,
                    PostalCode = death.PostalCode,
                    MaritalStatusId = death.MaritalStatusId,
                    EducationLevel = death.EducationLevelId > 0
                        ? new EducationLevel
                            { Code = death.EducationLevelId.ToString(), Value = death.EducationLevelName }
                        : null,
                    IDCardNumber = death.IdCardNumber,
                    JobTitle = death.JobTitle
                };
                result.Mother = Mother;

                var InfantDelivery = new InfantDelivery
                {
                    DeliveryPriority = currentInfantDelivery.DeliveryPriority,
                    DeliveryNumber = currentInfantDelivery.DeliveryNumber,
                    InfantWeight = new DoQuantity
                    {
                        Magnitude = currentInfantDelivery.InfantWeight,
                        Unit = currentInfantDelivery.InfantWeightUnitName
                    },
                    DeliveryAgent = new DeliveryAgent
                    {
                        Code = currentInfantDelivery.DeliveryAgentCode, Value = currentInfantDelivery.DeliveryAgentName
                    },
                    DeliveryLocation = new DeliveryLocation
                    {
                        Code = currentInfantDelivery.DeliveryLocationId.ToString(),
                        Value = currentInfantDelivery.DeathLocationName
                    }
                };
                result.InfantDeliveryInfo = InfantDelivery;
            }


            result.IssueDate = death.IssueDatePersian;
            result.DeathArea = new HighLevelAreaVO
            {
                Country = new DO_CODED_TEXT
                    { Coded_string = "IR", Value = "Iran, Islamic Republic of", Terminology_id = "ISO_3166-1" },
                Province = new DO_CODED_TEXT
                {
                    Coded_string = death.CountryDivisionEstateCode, Value = death.CountryDivisionEstateName,
                    Terminology_id = "CountryDivisions"
                },
                City = new DO_CODED_TEXT
                {
                    Coded_string = death.CountryDivisionCityCode, Value = death.CountryDivisionCityName,
                    Terminology_id = "CountryDivisions"
                }
            };
            result.HouseholdHeadNationalCode = death.HouseholdHeadNationalCode;
            result.SerialNumber = death.SerialNumber;
            result.Comment = death.Comment;
            result.DeathDate = death.DeathDateTimePersian;
            result.DeathTime = death.DeathTimePersian;
            result.DeathLocation = new DeathLocation { Code = death.DeathLocationId, Value = death.DeathLocationName };
            result.SourceOfNotification = new SourceOfNotification
                { Code = death.SourceOfNotificationId.ToString(), Value = death.SourceofDeathNotificationName };

            result.BurialAttesterDetails = new ProviderComp
            {
                FirstName = death.BurialAttesterFirstName,
                LastName = death.BurialAttesterLastName,
                FullName = death.BurialAttesterFullName,
                MscTypeId = death.BurialAttesterMSCTypeId,
                Id = death.BurialAttesterMSCId,
                //Role = new AttenderRole() { Id = death.BurialAttesterRoleCode, Name = death.BurialAttesterRoleName },
                Specialty = new AttenderSpecialty
                {
                    Code = !string.IsNullOrEmpty(death.BurialAttesterSpecialtyId)
                        ? death.BurialAttesterSpecialtyId
                        : "",
                    Value = death.BurialAttesterSpecialtyName
                }
            };

            result.IndividualRegister = new ProviderComp
            {
                FirstName = death.IndividualRegisterFirstName,
                LastName = death.IndividualRegisterLastName,
                FullName = death.IndividualRegisterFullName,
                MscTypeId = death.IndividualRegisterMSCTypeId,
                Id = death.IndividualRegisterMSCId,
                Specialty = new AttenderSpecialty
                {
                    Code = !string.IsNullOrEmpty(death.IndividualRegisterSpecialtyId)
                        ? death.IndividualRegisterSpecialtyId
                        : "",
                    Value = death.IndividualRegisterSpecialtyName
                }
            };

            return result;
        }
    }

    public class BindingLIS_MedicalSepas
    {
        private readonly AdmissionServiceRepository _admissionRepository;
        private readonly IAdmissionsRepository _admissionsRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly InsuranceRepository _insuranceRepository;
        private readonly ISetupRepository _setupRepository;

        public BindingLIS_MedicalSepas(ICompanyRepository companyRepository,
            ISetupRepository setupRepository,
            IAdmissionsRepository admissionsRepository,
            AdmissionServiceRepository admissionRepository,
            InsuranceRepository insuranceRepository)
        {
            _companyRepository = companyRepository;
            _setupRepository = setupRepository;
            _admissionsRepository = admissionsRepository;
            _admissionRepository = admissionRepository;
            _insuranceRepository = insuranceRepository;
        }

        public async Task<LaboratoryModel> BindLaboratory(GetMedicalLaboratory model)
        {
            var result = new LaboratoryModel();
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var admissionSearch = new GetAdmissionSearch
            {
                AttenderId = 0,
                CompanyId = companyInfo.Id,
                Id = model.AdmissionId
            };
            var admissionInfo = await _admissionRepository.GetAdmission(admissionSearch);
            result.SystemId = await _setupRepository.GetCisWcfSystemId();

            result.Admission = new AdmissionViewModel
            {
                HID = model.AdmissionHID,
                AdmissionId = model.AdmissionId.ToString(),
                AdmissionDate = model.AdmissionCreateDatePersian,
                AdmissionTime = model.AdmissionCreateTime,
                ReasonForEncounter = model.ReasonForEncounterCode != "0" && model.ReasonForEncounterCode != ""
                    ? new ParsAlphabet.WebService.Api.Model.LIS.PublicViewModel.ReasonEncounter
                        { Id = model.ReasonForEncounterCode, Name = model.ReasonForEncounterName }
                    : null
            };
            result.AttenderProvider = new HealthCareProviderViewModel
            {
                FirstName = model.AttenderFirstName,
                LastName = model.AttenderLastName,
                FullName = model.AttenderFullName,
                Id = model.AttenderMSCId,
                MscTypeId = model.AttenderMSCTypeId,
                Role = new TreatmentRoleViewModel
                {
                    Id = model.AttenderRoleCode,
                    Name = model.AttenderRoleName
                },
                Specialty = new TreatmentSpecialityViewModel
                {
                    Id = model.AttenderSpecialtyId,
                    Name = model.AttenderSpecialtyName
                }
            };
            result.CompositionUID = model.CompositionUID == null ? "" : model.CompositionUID;
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);

            result.Organization = new OrganizationViewModel
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationTypeViewModel
                    { Id = organizationType.Id, Name = organizationType.Name }
            };
            result.Patient = new PatientViewModel
            {
                FirstName = model.PatientFirstName,
                BirthDate = model.PatientBirthDate,
                FullAddress = model.PatientAddress,
                GenderId = model.PatientGenderId.ToString(),
                HomeTel = model.PatientPhoneNo,
                LastName = model.PatientLastName,
                MobileNumber = model.PatientMobileNo,
                NationalCode = model.PatientNationalCode,
                NationalityId = admissionInfo.PatientNationalityId,
                Father_FirstName = model.PatientFatherFirstName,
                PostalCode = model.PatientPostalCode,
                MaritalStatusId = model.PatientMaritalStatusId,
                EducationLevelId =
                    model.PatientEducationLevelId
                        .ToString(), //(model.PatientEducationLevelId > 0 ? new EducationLevel() { Code = model.PatientEducationLevelId.ToString(), Value = model.PatientEducationLevelName } : null),
                IDCardNumber = model.PatientIdCardNumber,
                JobTitle = model.PatientJobTitle
            };
            result.PatientUID = model.PersonUID == null ? "" : model.PersonUID;

            if (!string.IsNullOrEmpty(admissionInfo.ReferringMSCId))
                result.ReferringProvider = new HealthCareProviderViewModel
                {
                    MscTypeId = admissionInfo.ReferringMSCTypeId,
                    FirstName = admissionInfo.ReferringFirstName,
                    FullName = admissionInfo.ReferringFullName,
                    LastName = admissionInfo.ReferringLastName,
                    Role = new TreatmentRoleViewModel
                    {
                        Id = "",
                        Name = ""
                    },
                    Id = "",
                    Specialty = new TreatmentSpecialityViewModel
                    {
                        Id = "",
                        Name = ""
                    }
                };

            var insurerCode =
                await _insuranceRepository.GetInsurerCodeById(admissionInfo.BasicInsurerId, companyInfo.Id);

            result.InsuranceList = new List<BillInsuranceViewModel>
            {
                new()
                {
                    BasicInsuranceBox = new InsuranceBoxViewModel
                    {
                        Id = model.InsuranceBoxCode == "0" || model.InsuranceBoxCode == null
                            ? ""
                            : model.InsuranceBoxCode,
                        Name = model.InsuranceBoxName
                    },
                    BasicInsurerHID = new HIDViewModel
                    {
                        AssignerCode = insurerCode == "1" || insurerCode == "2" ? insurerCode : "3",
                        Id = admissionInfo.AdmissionHID
                    },
                    InsuranceNumber = admissionInfo.BasicInsurerNo,
                    Insurer = new InsurerViewModel
                    {
                        Id = insurerCode,
                        Name = admissionInfo.BasicInsurerName
                    },
                    BasicInsurerSerialNumber = string.IsNullOrEmpty(admissionInfo.InsurPageNo.ToString())
                        ? ""
                        : admissionInfo.InsurPageNo.ToString(),
                    BasicInsuranceExpDate = admissionInfo.BasicInsurerExpirationDatePersian
                }
            };

            result.LabTestResult = new LabTestResultViewModel();

            #region add diagnosises

            if (model.MedicalLaboratoryDiagnosises != null)
            {
                result.DiagnosisList = new List<DiagnosisViewModel>();
                foreach (var diagnosis in model.MedicalLaboratoryDiagnosises)
                {
                    //result.DiagnosisList.Add(new DiagnosisViewModel
                    //{
                    //    Comment = diagnosis.Comment,
                    //    DiagnosisDate = diagnosis.CreateDatePersian,
                    //    DiagnosisTime = diagnosis.CreateTime,
                    //    DiagnosisInfo = new ICDViewModel
                    //    {
                    //        Id = diagnosis.DiagnosisReasonCode,
                    //        Name = diagnosis.DiagnosisReasonName
                    //    },
                    //    Severity = new OrdinalViewModel
                    //    {
                    //        Id = diagnosis.ServerityId.ToString(),
                    //        Name = diagnosis.ServerityName
                    //    },
                    //    Status = new DiagnosisStatusViewModel
                    //    {
                    //        Id = diagnosis.StatusId.ToString(),
                    //        Name = diagnosis.DiagnosisStatusName
                    //    }
                    //});
                }
            }

            #endregion add diagnosises

            foreach (var request in model.MedicalLaboratoryRequests)
            {
                #region add requests

                //result.LabRequest = new LabRequestViewModel
                //{
                //    Specimen = new SpecimenDetailsViewModel
                //    {
                //        AdequacyForTesting = new AdequacyForTestingViewModel
                //        {
                //            Id = request.AdequacyForTestingId.ToString(),
                //            Name = request.AdequacyForTestingName
                //        },
                //        CollectionProcedure = new SnomedctViewModel
                //        {
                //            Id = request.CollectionProcedureCode.ToString(),
                //            Name = request.CollectionProcedureName
                //        },
                //        SpecimenIdentifier = request.SpecimenIdentifier,
                //        SpecimenTissueType = new SnomedctViewModel
                //        {
                //            Id = request.SpecimenTypeCode,
                //            Name = request.SpecimenTypeName
                //        },
                //        DateofCollection = request.SpecimenDateTime.ToPersianDateString("{0}/{1}/{2}"),
                //        TimeofCollection = request.SpecimenDateTime.ToPersianDateString("{3}:{4}:{5}")
                //    },
                //    SpecimenCode = request.SpecimenCode,
                //    SpecimenDate = request.SpecimenDateTime.ToPersianDateString("{0}/{1}/{2}"),
                //    SpecimenTime = request.SpecimenDateTime.ToPersianDateString("{3}:{4}:{5}"),
                //    SpecimenType = new SnomedctViewModel
                //    {
                //        Id = request.SpecimenTypeId.ToString(),
                //        Name = request.SpecimenTypeName
                //    }
                //};

                #endregion add requests

                #region add requestMethods

                foreach (var requestMethod in request.MedicalLaboratoryRequestMethods)
                {
                    var requestMethodItem = new GeneralLaboratoryResult
                    {
                        //Protocol = new LaboratoryProtocolViewModel
                        //{
                        //    Method = new SnomedctViewModel
                        //    {
                        //        Id = requestMethod.MethodCode.ToString(),
                        //        Name = requestMethod.MethodName
                        //    },
                        //    MethodDescription = requestMethod.MethodDescription,
                        //    ProcessDate = requestMethod.ProcessDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //    ProcessTime = requestMethod.ProcessDateTime.ToPersianDateString("{3}:{4}:{5}"),
                        //    ReceiptDate = requestMethod.ReceiptDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //    ReceiptTime = requestMethod.ReceiptDateTime.ToPersianDateString("{3}:{4}:{5}")
                        //},
                        //DateResult = requestMethod.ResultDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //TimeResult = requestMethod.ResultDateTime.ToPersianDateString("{3}:{4}:{5}"),
                        //LaboratoryPanel = new LNCViewModel
                        //{
                        //    Id = requestMethod.LaboratoryPanelCode,
                        //    Name = requestMethod.LaboratoryPanelName
                        //},
                        Specimen = new SpecimenDetailsViewModel
                        {
                            AdequacyForTesting = new AdequacyForTestingViewModel
                            {
                                Id = result.LabRequest.Specimen.AdequacyForTesting.Id,
                                Name = result.LabRequest.Specimen.AdequacyForTesting.Name
                            },
                            CollectionProcedure = new SnomedctViewModel
                            {
                                Id = result.LabRequest.Specimen.CollectionProcedure.Id,
                                Name = result.LabRequest.Specimen.CollectionProcedure.Name
                            },
                            DateofCollection = result.LabRequest.Specimen.DateofCollection,
                            TimeofCollection = result.LabRequest.Specimen.TimeofCollection,
                            SpecimenIdentifier = result.LabRequest.Specimen.SpecimenIdentifier,
                            SpecimenTissueType = new SnomedctViewModel
                            {
                                Id = result.LabRequest.Specimen.SpecimenTissueType.Id,
                                Name = result.LabRequest.Specimen.SpecimenTissueType.Name
                            }
                        }
                    };

                    #region add results

                    if (requestMethod.MedicalLaboratoryResults != null)
                    {
                        foreach (var resultItem in requestMethod.MedicalLaboratoryResults)
                        {
                            requestMethodItem.LaboratoryResultRowList = new LaboratoryResultRowViewModel();

                            #region add references

                            var references = new List<ReferenceRangeViewModel>();
                            if (resultItem.MedicalLaboratoryReferences != null)
                            {
                                //foreach (var reference in resultItem.MedicalLaboratoryReferences)
                                //{
                                //    references.Add(new ReferenceRangeViewModel
                                //    {
                                //        AgeRange = new SnomedctViewModel
                                //        {
                                //            Id = reference.AgeRangeCode,
                                //            Name = reference.AgeRangeName
                                //        },
                                //        Condition = reference.Condition,
                                //        Description = reference.Description,
                                //        Gender = new GenderViewModel
                                //        {
                                //            Id = reference.GenderId.ToString(),
                                //            Name = reference.GenderName
                                //        },
                                //        HighRangeDescriptive = reference.HighRangeDescriptive,
                                //        LowRangeDescriptive = reference.LowRangeDescriptive
                                //    });
                                //}
                            }

                            #endregion add references

                            var resultTypeDetail =
                                JsonConvert.DeserializeObject<ResultTypeDetail>(resultItem.ResultTypeDetail);
                            //switch (resultItem.ResultType)
                            //{
                            //    case 1:
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowBooleanList = new List<LaboratoryResultRowBooleanViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowBooleanList.Add(new LaboratoryResultRowBooleanViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //               // Id = resultItem.ResultStatusCode.ToString(),
                            //               // Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                //Id = resultItem.TestNameCode.ToString(),
                            //                //Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                //Id = resultItem.TestPanelCode.ToString(),
                            //                //Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResult = resultTypeDetail.testResultBoolean
                            //        });
                            //        break;
                            //    case 2:
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCodedList = new List<LaboratoryResultRowCodedViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCodedList.Add(new LaboratoryResultRowCodedViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //                //Id = resultItem.ResultStatusCode.ToString(),
                            //                //Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                //Id = resultItem.TestNameCode.ToString(),
                            //                //Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                //Id = resultItem.TestPanelCode.ToString(),
                            //                //Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResult = new SnomedctViewModel
                            //            {
                            //                Id = resultTypeDetail.testResultCoded.ToString(),
                            //                Name = resultTypeDetail.testResultCodedName
                            //            }
                            //        });
                            //        break;
                            //    case 3:
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCountList = new List<LaboratoryResultRowCountViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCountList.Add(new LaboratoryResultRowCountViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //                Id = resultItem.ResultStatusCode.ToString(),
                            //                Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestNameCode.ToString(),
                            //                Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestPanelCode.ToString(),
                            //                Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResult = resultTypeDetail.testResultCount
                            //        });
                            //        break;
                            //    case 4:
                            //        var ordinalName = "";
                            //        if (resultTypeDetail.testResultOrdinal == 0)
                            //            ordinalName = "منفی";
                            //        else if (resultTypeDetail.testResultOrdinal == 1)
                            //            ordinalName = "خفیف";
                            //        else if (resultTypeDetail.testResultOrdinal == 2)
                            //            ordinalName = "متوسط";
                            //        else if (resultTypeDetail.testResultOrdinal == 3)
                            //            ordinalName = "شدید";
                            //        else if (resultTypeDetail.testResultOrdinal == 4)
                            //            ordinalName = "بسیار شدید";
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowOrdinalList = new List<LaboratoryResultRowOrdinalViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowOrdinalList.Add(new LaboratoryResultRowOrdinalViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //                Id = resultItem.ResultStatusCode.ToString(),
                            //                Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestNameCode.ToString(),
                            //                Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestPanelCode.ToString(),
                            //                Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResult = new OrdinalViewModel
                            //            {
                            //                Id = resultTypeDetail.testResultOrdinal.ToString(),
                            //                Name = ordinalName
                            //            }
                            //        });
                            //        break;
                            //    case 5:
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowProportionList = new List<LaboratoryResultRowProportionViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowProportionList.Add(new LaboratoryResultRowProportionViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //                Id = resultItem.ResultStatusCode.ToString(),
                            //                Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestNameCode.ToString(),
                            //                Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestPanelCode.ToString(),
                            //                Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResultDenominator = resultTypeDetail.testResultDenominator,
                            //            TestResultNumerator = resultTypeDetail.testResultNumerator,
                            //            TestResultType = resultTypeDetail.testResultTypeId
                            //        });
                            //        break;
                            //    case 6:
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowQuantityList = new List<LaboratoryResultRowQuantityViewModel>();
                            //        requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowQuantityList.Add(new LaboratoryResultRowQuantityViewModel
                            //        {
                            //            Comment = resultItem.Comment,
                            //            ResultStatus = new SnomedctViewModel
                            //            {
                            //                Id = resultItem.ResultStatusCode.ToString(),
                            //                Name = resultItem.ResultStatusName
                            //            },
                            //            //Status = new SnomedctViewModel
                            //            //{
                            //            //    Id = null,
                            //            //    Name = null
                            //            //},
                            //            TestName = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestNameCode.ToString(),
                            //                Name = resultItem.TestNameName
                            //            },
                            //            TestPanel = new LNCViewModel
                            //            {
                            //                Id = resultItem.TestPanelCode.ToString(),
                            //                Name = resultItem.TestPanelName
                            //            },
                            //            TestSequence = resultItem.TestSequence,
                            //            ReferenceRange = references,
                            //            TestResultUnit = resultTypeDetail.testResultUnitName,
                            //            TestResultMagnitude = resultTypeDetail.testResultUnitId
                            //        });
                            //        break;
                            //}
                        }

                        result.LabTestResult.GeneralLaboratoryResultList = new List<GeneralLaboratoryResult>();
                        result.LabTestResult.GeneralLaboratoryResultList.Add(requestMethodItem);
                    }

                    #endregion add results
                }

                #endregion add requestMethods
            }

            return result;
        }

        public async Task<PathologyModel> BindPathology(GetMedicalLaboratory model)
        {
            var result = new PathologyModel();
            var companyInfo = await _companyRepository.GetCompanyInfo();
            var admissionSearch = new GetAdmissionSearch
            {
                AttenderId = 0,
                CompanyId = companyInfo.Id,
                Id = model.AdmissionId
            };
            var admissionInfo = await _admissionRepository.GetAdmission(admissionSearch);
            result.SystemId = await _setupRepository.GetCisWcfSystemId();

            result.Admission = new AdmissionViewModel
            {
                HID = model.AdmissionHID,
                AdmissionId = model.AdmissionId.ToString(),
                AdmissionDate = model.AdmissionCreateDatePersian,
                AdmissionTime = model.AdmissionCreateTime,
                ReasonForEncounter = model.ReasonForEncounterCode != "0" && model.ReasonForEncounterCode != ""
                    ? new ParsAlphabet.WebService.Api.Model.LIS.PublicViewModel.ReasonEncounter
                        { Id = model.ReasonForEncounterCode, Name = model.ReasonForEncounterName }
                    : null
            };
            result.AttenderProvider = new HealthCareProviderViewModel
            {
                FirstName = model.AttenderFirstName,
                LastName = model.AttenderLastName,
                FullName = model.AttenderFullName,
                Id = model.AttenderMSCId,
                MscTypeId = model.AttenderMSCTypeId,
                Role = new TreatmentRoleViewModel
                {
                    Id = model.AttenderRoleCode,
                    Name = model.AttenderRoleName
                },
                Specialty = new TreatmentSpecialityViewModel
                {
                    Id = model.AttenderSpecialtyId,
                    Name = model.AttenderSpecialtyName
                }
            };
            result.CompositionUID = model.CompositionUID == null ? "" : model.CompositionUID;
            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);

            result.Organization = new OrganizationViewModel
            {
                OrganizationId = companyInfo.WebServiceGuid,
                OrganizationName = companyInfo.Name,
                UserNationalCode = companyInfo.NationCode,
                UserFirstName = companyInfo.ManagerFirstName,
                UserLastName = companyInfo.ManagerLastName,
                OrganizationType = new OrganizationTypeViewModel
                    { Id = organizationType.Id, Name = organizationType.Name }
            };
            result.Patient = new PatientViewModel
            {
                FirstName = model.PatientFirstName,
                BirthDate = model.PatientBirthDate,
                FullAddress = model.PatientAddress,
                GenderId = model.PatientGenderId.ToString(),
                HomeTel = model.PatientPhoneNo,
                LastName = model.PatientLastName,
                MobileNumber = model.PatientMobileNo,
                NationalCode = model.PatientNationalCode,
                NationalityId = admissionInfo.PatientNationalityId,
                Father_FirstName = model.PatientFatherFirstName,
                PostalCode = model.PatientPostalCode,
                MaritalStatusId = model.PatientMaritalStatusId,
                EducationLevelId =
                    model.PatientEducationLevelId
                        .ToString(), //(model.PatientEducationLevelId > 0 ? new EducationLevel() { Code = model.PatientEducationLevelId.ToString(), Value = model.PatientEducationLevelName } : null),
                IDCardNumber = model.PatientIdCardNumber,
                JobTitle = model.PatientJobTitle
            };
            result.PatientUID = model.PersonUID == null ? "" : model.PersonUID;

            if (!string.IsNullOrEmpty(admissionInfo.ReferringMSCId))
                result.ReferringProvider = new HealthCareProviderViewModel
                {
                    MscTypeId = admissionInfo.ReferringMSCTypeId,
                    FirstName = admissionInfo.ReferringFirstName,
                    FullName = admissionInfo.ReferringFullName,
                    LastName = admissionInfo.ReferringLastName,
                    Role = new TreatmentRoleViewModel
                    {
                        Id = "",
                        Name = ""
                    },
                    Id = "",
                    Specialty = new TreatmentSpecialityViewModel
                    {
                        Id = "",
                        Name = ""
                    }
                };

            var insurerCode =
                await _insuranceRepository.GetInsurerCodeById(admissionInfo.BasicInsurerId, companyInfo.Id);

            result.InsuranceList = new List<BillInsuranceViewModel>
            {
                new()
                {
                    BasicInsuranceBox = new InsuranceBoxViewModel
                    {
                        Id = model.InsuranceBoxCode == "0" || model.InsuranceBoxCode == null
                            ? ""
                            : model.InsuranceBoxCode,
                        Name = model.InsuranceBoxName
                    },
                    BasicInsurerHID = new HIDViewModel
                    {
                        AssignerCode = insurerCode == "1" || insurerCode == "2" ? insurerCode : "3",
                        Id = admissionInfo.AdmissionHID
                    },
                    InsuranceNumber = admissionInfo.BasicInsurerNo,
                    Insurer = new InsurerViewModel
                    {
                        Id = insurerCode,
                        Name = admissionInfo.BasicInsurerName
                    },
                    BasicInsurerSerialNumber = string.IsNullOrEmpty(admissionInfo.InsurPageNo.ToString())
                        ? ""
                        : admissionInfo.InsurPageNo.ToString(),
                    BasicInsuranceExpDate = admissionInfo.BasicInsurerExpirationDatePersian
                }
            };

            // result.LabResult = new PathologyViewModelGeneral();

            foreach (var request in model.MedicalLaboratoryRequests)
                result.LabResult = new PathologyViewModelGeneral
                {
                    Specimen = new SpecimenDetailsViewModel
                    {
                        //AdequacyForTesting = new AdequacyForTestingViewModel
                        //{
                        //    Id = request.AdequacyForTestingId.ToString(),
                        //    Name = request.AdequacyForTestingName
                        //},
                        //CollectionProcedure = new SnomedctViewModel
                        //{
                        //    Id = request.CollectionProcedureCode.ToString(),
                        //    Name = request.CollectionProcedureName
                        //},
                        //SpecimenIdentifier = request.SpecimenIdentifier,
                        //SpecimenTissueType = new SnomedctViewModel
                        //{
                        //    Id = request.SpecimenTypeCode,
                        //    Name = request.SpecimenTypeName
                        //},
                        //DateofCollection = request.SpecimenDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //TimeofCollection = request.SpecimenDateTime.ToPersianDateString("{3}:{4}:{5}")
                    },
                    Protocol = new LaboratoryProtocolViewModel
                    {
                        Method = new SnomedctViewModel
                        {
                            Id = request.MedicalLaboratoryRequestMethods[0].MethodId.ToString()
                            // Name = request.MedicalLaboratoryRequestMethods[0].MethodName
                        },
                        MethodDescription = request.MedicalLaboratoryRequestMethods[0].MethodDescription
                        //ProcessDate = request.MedicalLaboratoryRequestMethods[0].ProcessDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //ProcessTime = request.MedicalLaboratoryRequestMethods[0].ProcessDateTime.ToPersianDateString("{3}:{4}:{5}"),
                        //ReceiptDate = request.MedicalLaboratoryRequestMethods[0].ReceiptDateTime.ToPersianDateString("{0}/{1}/{2}"),
                        //ReceiptTime = request.MedicalLaboratoryRequestMethods[0].ReceiptDateTime.ToPersianDateString("{3}:{4}:{5}")
                    },
                    DateResult = request.MedicalLaboratoryRequestMethods[0].ResultDateTimePersian.Split(" ")[0],
                    TimeResult = request.MedicalLaboratoryRequestMethods[0].ResultDateTimePersian.Split(" ")[1]
                    //SpecimenCode = request.SpecimenCode,
                    //SpecimenDate = request.SpecimenDateTime.ToPersianDateString("{0}/{1}/{2}"),
                    //SpecimenTime = request.SpecimenDateTime.ToPersianDateString("{3}:{4}:{5}"),
                    //SpecimenType = new SnomedctViewModel
                    //{
                    //    Id = request.SpecimenTypeId.ToString(),
                    //    Name = request.SpecimenTypeName
                    //}
                };


            if (model.MedicalLaboratoryPathology != null)
                for (var i = 0; i < model.MedicalLaboratoryPathology.Count; i++)
                {
                    result.LabResult.ClinicalInformation = model.MedicalLaboratoryPathology[i].ClinicalInformation;
                    result.LabResult.MacroscopicExamination =
                        model.MedicalLaboratoryPathology[i].MacroscopicExamination;
                    result.LabResult.MicroscopicExamination =
                        model.MedicalLaboratoryPathology[i].MicroscopicExamination;
                    for (var j = 0; j < model.MedicalLaboratoryPathology[i].PathologyDiagnosis.Count; j++)
                        result.LabResult.PathologyDiagnosis = model.MedicalLaboratoryPathology[i].PathologyDiagnosis
                            .Select(a => new PathologyDiagnosisViewModel
                            {
                                // DiagnosisCode = model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisCode,// new Icdo3() { Id = model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisCode, Name = model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisName },
                                Diagnosis = new Icdo3 { Id = a.DiagnosisCode, Name = a.DiagnosisName },
                                DiagnosisDescription = a.Description,
                                Morphology = new Icdo3 { Id = a.MorphologyCode, Name = a.MorphologyName },
                                MorphologyDifferentiation = new Icdo3
                                    { Id = a.MorphologyDifferentiationCode, Name = a.MorphologyDifferentiationName },
                                Topography = new Icdo3 { Id = a.TopographyCode, Name = a.TopographyName },
                                TopographyLaterality = new SnomedctViewModel
                                    { Id = a.TopographyLateralityCode, Name = a.TopographyLateralityName }
                                //DiagnosisName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisName,
                                //Description= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].Description,
                                //DiagnosisId= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisId,
                                //DiagnosisStatusId= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisStatusId,
                                //DiagnosisStatusName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].DiagnosisStatusName,
                                //MorphologyCode= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].MorphologyCode,
                                //MorphologyName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].MorphologyName,
                                //MorphologyDifferentiationCode= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].MorphologyDifferentiationCode,
                                //MorphologyDifferentiationName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].MorphologyDifferentiationName,
                                //TopographyCode= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].TopographyCode,
                                //TopographyName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].TopographyName,
                                //TopographyLateralityCode= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].TopographyLateralityCode,
                                //TopographyLateralityName= model.MedicalLaboratoryPathology[i].PathologyDiagnosis[i].TopographyLateralityName
                            }).ToList();
                }

            return result;
        }
    }
}