using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.LIS.LaboratoryModel;
using ParsAlphabet.WebService.Api.Model.LIS.PublicViewModel;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.LIS;

public class RestSEPASLIS
{
    private readonly IHttpClientFactory _clientFactory;

    public RestSEPASLIS(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<SaveLaboratory_Result> SendLaboratory(LaboratoryModel laboratory)
    {
        var client = new HttpClientRequest(_clientFactory);

        var url = $"{CallWebService.ApiLIS.LabApiUrl}/{CallWebService.ApiLIS.saveLabApi}";

        var result = await client.OnPost(CallWebService.ApiLIS.baseUrl, url, JsonConvert.SerializeObject(laboratory),
            "application/json", null);

        var resultModel = JsonConvert.DeserializeObject<SaveLaboratory_Result>(result.ResponseContent);

        return resultModel;
    }
}

public class Binding_LIS
{
    private readonly AdmissionServiceRepository _admissionRepository;
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly InsuranceRepository _insuranceRepository;
    private readonly ISetupRepository _setupRepository;

    public Binding_LIS(
        ICompanyRepository companyRepository,
        ISetupRepository setupRepository,
        InsuranceRepository insuranceRepository,
        IAdmissionsRepository admissionsRepository,
        AdmissionServiceRepository admissionRepository)
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
            AdmissionTime = model.AdmissionCreateTime
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
        result.CompositionUID = model.CompositionUID;
        var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);

        result.Organization = new OrganizationViewModel
        {
            OrganizationId = companyInfo.WebServiceGuid,
            OrganizationName = companyInfo.Name,
            UserNationalCode = companyInfo.NationCode,
            UserFirstName = companyInfo.ManagerFirstName,
            UserLastName = companyInfo.ManagerLastName,
            OrganizationType = new OrganizationTypeViewModel { Id = organizationType.Id, Name = organizationType.Name }
        };
        result.Patient = new PatientViewModel
        {
            FirstName = model.PatientFirstName,
            BirthDate = model.PatientBirthDate,
            FullAddress = model.PatientAddress,
            GenderId = model.PatientGenderId.ToString(),
            HomeTel = model.PatientMobileNo,
            LastName = model.PatientLastName,
            MobileNumber = model.PatientMobileNo,
            NationalCode = model.PatientNationalCode,
            NationalityId = admissionInfo.PatientNationalityId
        };
        result.PatientUID = model.PersonUID;

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

        var insurerCode = await _insuranceRepository.GetInsurerCodeById(admissionInfo.BasicInsurerId, companyInfo.Id);

        result.InsuranceList = new List<BillInsuranceViewModel>
        {
            new()
            {
                BasicInsuranceBox = new InsuranceBoxViewModel
                {
                    Id = model.InsuranceBoxCode == "0" || model.InsuranceBoxCode == null ? "" : model.InsuranceBoxCode,
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
                //  //  DiagnosisDate = diagnosis.CreateDatePersian,
                //   // DiagnosisTime = diagnosis.CreateTime,
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
            //            Id = request.SpecimenTypeId.ToString(),
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
                //var requestMethodItem = new GeneralLaboratoryResult
                //{
                //    Protocol = new LaboratoryProtocolViewModel
                //    {
                //        Method = new SnomedctViewModel
                //        {
                //            Id = requestMethod.MethodCode.ToString(),
                //            Name = requestMethod.MethodName
                //        },
                //        MethodDescription = requestMethod.MethodDescription,
                //        ProcessDate = requestMethod.ProcessDateTime.ToPersianDateString("{0}/{1}/{2}"),
                //        ProcessTime = requestMethod.ProcessDateTime.ToPersianDateString("{3}:{4}:{5}"),
                //        ReceiptDate = requestMethod.ReceiptDateTime.ToPersianDateString("{0}/{1}/{2}"),
                //        ReceiptTime = requestMethod.ReceiptDateTime.ToPersianDateString("{3}:{4}:{5}")
                //    },
                //    DateResult = requestMethod.ResultDateTime.ToPersianDateString("{0}/{1}/{2}"),
                //    TimeResult = requestMethod.ResultDateTime.ToPersianDateString("{3}:{4}:{5}"),
                //    LaboratoryPanel = new LNCViewModel
                //    {
                //        Id = requestMethod.LaboratoryPanelId.ToString(),
                //        Name = requestMethod.LaboratoryPanelName
                //    },
                //    Specimen = new SpecimenDetailsViewModel
                //    {
                //        AdequacyForTesting = new AdequacyForTestingViewModel
                //        {
                //            Id = result.LabRequest.Specimen.AdequacyForTesting.Id,
                //            Name = result.LabRequest.Specimen.AdequacyForTesting.Name
                //        },
                //        CollectionProcedure = new SnomedctViewModel
                //        {
                //            Id = result.LabRequest.Specimen.CollectionProcedure.Id,
                //            Name = result.LabRequest.Specimen.CollectionProcedure.Name
                //        },
                //        DateofCollection = result.LabRequest.Specimen.DateofCollection,
                //        TimeofCollection = result.LabRequest.Specimen.TimeofCollection,
                //        SpecimenIdentifier = result.LabRequest.Specimen.SpecimenIdentifier,
                //        SpecimenTissueType = new SnomedctViewModel
                //        {
                //            Id = result.LabRequest.Specimen.SpecimenTissueType.Id,
                //            Name = result.LabRequest.Specimen.SpecimenTissueType.Name
                //        }
                //    }
                //};

                #region add results

                if (requestMethod.MedicalLaboratoryResults != null)
                {
                    //foreach (var resultItem in requestMethod.MedicalLaboratoryResults)
                    //{
                    //    requestMethodItem.LaboratoryResultRowList = new LaboratoryResultRowViewModel();

                    //    #region add references
                    //    var references = new List<ReferenceRangeViewModel>();
                    //    if (resultItem.MedicalLaboratoryReferences != null)
                    //    {
                    //        foreach (var reference in resultItem.MedicalLaboratoryReferences)
                    //        {
                    //            references.Add(new ReferenceRangeViewModel
                    //            {
                    //                AgeRange = new SnomedctViewModel
                    //                {
                    //                    Id = reference.AgeRangeId.ToString(),
                    //                    Name = reference.AgeRangeName
                    //                },
                    //                Condition = reference.Condition,
                    //                Description = reference.Description,
                    //                Gender = new GenderViewModel
                    //                {
                    //                    Id = reference.GenderId.ToString(),
                    //                    Name = reference.GenderName
                    //                },
                    //                HighRangeDescriptive = reference.HighRangeDescriptive,
                    //                LowRangeDescriptive = reference.LowRangeDescriptive
                    //            });
                    //        }
                    //    }
                    //    #endregion add references

                    //    var resultTypeDetail = JsonConvert.DeserializeObject<ResultTypeDetail>(resultItem.ResultTypeDetail);
                    //    switch (resultItem.ResultType)
                    //    {
                    //        case 1:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowBooleanList = new List<LaboratoryResultRowBooleanViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowBooleanList.Add(new LaboratoryResultRowBooleanViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResult = resultTypeDetail.testResultBoolean
                    //            });
                    //            break;
                    //        case 2:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCodedList = new List<LaboratoryResultRowCodedViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCodedList.Add(new LaboratoryResultRowCodedViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResult = new SnomedctViewModel
                    //                {
                    //                    Id = resultTypeDetail.testResultCoded.ToString(),
                    //                    Name = resultTypeDetail.testResultCodedName
                    //                }
                    //            });
                    //            break;
                    //        case 3:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCountList = new List<LaboratoryResultRowCountViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowCountList.Add(new LaboratoryResultRowCountViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResult = resultTypeDetail.testResultCount
                    //            });
                    //            break;
                    //        case 4:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowOrdinalList = new List<LaboratoryResultRowOrdinalViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowOrdinalList.Add(new LaboratoryResultRowOrdinalViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResult = new OrdinalViewModel
                    //                {
                    //                    Id = resultTypeDetail.testResultOrdinal.ToString(),
                    //                    Name = ""
                    //                }
                    //            });
                    //            break;
                    //        case 5:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowProportionList = new List<LaboratoryResultRowProportionViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowProportionList.Add(new LaboratoryResultRowProportionViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResultDenominator = resultTypeDetail.testResultDenominator,
                    //                TestResultNumerator = resultTypeDetail.testResultNumerator,
                    //                TestResultType = resultTypeDetail.testResultTypeId
                    //            });
                    //            break;
                    //        case 6:
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowQuantityList = new List<LaboratoryResultRowQuantityViewModel>();
                    //            requestMethodItem.LaboratoryResultRowList.LaboratoryResultRowQuantityList.Add(new LaboratoryResultRowQuantityViewModel
                    //            {
                    //                Comment = resultItem.Comment,
                    //                ResultStatus = new SnomedctViewModel
                    //                {
                    //                    Id = resultItem.ResultStatusCode.ToString(),
                    //                    Name = resultItem.ResultStatusName
                    //                },
                    //                Status = new SnomedctViewModel
                    //                {
                    //                    Id = null,
                    //                    Name = null
                    //                },
                    //                TestName = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestNameCode.ToString(),
                    //                    Name = resultItem.TestNameName
                    //                },
                    //                TestPanel = new LNCViewModel
                    //                {
                    //                    Id = resultItem.TestPanelCode.ToString(),
                    //                    Name = resultItem.TestPanelName
                    //                },
                    //                TestSequence = resultItem.TestSequence,
                    //                ReferenceRange = references,
                    //                TestResultUnit = resultTypeDetail.testResultUnitName,
                    //                TestResultMagnitude = resultTypeDetail.testResultUnitId
                    //            });
                    //            break;
                    //    }

                    //}

                    //result.LabTestResult.GeneralLaboratoryResultList = new List<GeneralLaboratoryResult>();
                    //result.LabTestResult.GeneralLaboratoryResultList.Add(requestMethodItem);
                }

                #endregion add results
            }

            #endregion add requestMethods
        }

        return result;
    }
}