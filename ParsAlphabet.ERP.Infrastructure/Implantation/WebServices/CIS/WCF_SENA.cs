//using CIS.Repositories.Interfaces;
//using CIS.ViewModels.Admission.Admission;
//using CIS.ViewModels.MC.AdmissionRefer;
//using CIS_MyWebService;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Security.Claims;
//using System.ServiceModel;
//using System.Threading.Tasks;
//using static CIS.Common;
//using static CIS.ViewModels.WebServices.WebServiceViewModel;

//namespace CIS.WebServices.CIS
//{
//    public class WCF_SENA
//    {
//        private readonly IErrorLogRepository _errorLogRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly IHttpContextAccessor _accessor;
//        private readonly IConfiguration _configuration;
//        public string EndPointUrl = WCFWebService.WCFBaseUrl + WCFWebService.WCFServiceName;

//        public WCF_SENA(IErrorLogRepository errorLogRepository, IHttpContextAccessor accessor, IConfiguration configuration, ISetupRepository setupRepository)
//        {
//            _errorLogRepository = errorLogRepository;
//            _setupRepository = setupRepository;
//            _accessor = accessor;
//            _configuration = configuration;

//            EndPointUrl = _setupRepository.GetCisWcfUrl().Result + WCFWebService.WCFServiceName;
//        }

//        public async Task<MyResultDataStatus<GetReferralPatientRecord_Result>> GetReferralPatientRecord(HidInfo hidInfo)
//        {
//            var result = new MyResultDataStatus<GetReferralPatientRecord_Result>()
//            {
//                Data = new GetReferralPatientRecord_Result() { }
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(60),
//                    OpenTimeout = TimeSpan.FromSeconds(60),
//                    ReceiveTimeout = TimeSpan.FromSeconds(60),
//                    CloseTimeout = TimeSpan.FromSeconds(60)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                var hid = new HID
//                {
//                    Id = hidInfo.Hid,
//                    AssignerCode = hidInfo.BasicInsurerCode

//                };

//                result.Data = await serviceClient.GetReferralPatientRecordAsync(hid);

//                if (result.Data.ErrorStatus == 100)
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/GetReferralPatientRecord");
//            }
//            return result;
//        }

//        public async Task<MyResultDataStatus<ReferPatientRecord_Result>> SendReferralPatientRecord(SendReferralPatientRecord model)
//        {
//            var result = new MyResultDataStatus<ReferPatientRecord_Result>()
//            {
//                Data = new ReferPatientRecord_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(60),
//                    OpenTimeout = TimeSpan.FromSeconds(60),
//                    ReceiveTimeout = TimeSpan.FromSeconds(60),
//                    CloseTimeout = TimeSpan.FromSeconds(60)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.SendReferralPatientRecordAsync(model.abuseHistorryList,
//                                                                                model.admission,
//                                                                                model.organization,
//                                                                                model.referring,
//                                                                                model.attender,
//                                                                                model.careActionList,
//                                                                                model.clinicList,
//                                                                                model.diagnosisList,
//                                                                                model.drugHistoryList,
//                                                                                model.adverseReactionList,
//                                                                                model.drugOrderedList,
//                                                                                model.familyHistoryList,
//                                                                                model.insurance,
//                                                                                model.medicalHistoryList,
//                                                                                model.physicalExam,
//                                                                                model.developer,
//                                                                                model.lifeCycleState,
//                                                                                model.patient,
//                                                                                model.referralInfo,
//                                                                                model.referralId,
//                                                                                model.compositionUID,
//                                                                                model.patientUID);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) && !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendReferralPatientRecord");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<SaveDentalCase_Result>> SaveDentalCaseRecord(SaveDentalCaseRecord model)
//        {
//            var result = new MyResultDataStatus<SaveDentalCase_Result>()
//            {
//                Data = new SaveDentalCase_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(70),
//                    OpenTimeout = TimeSpan.FromSeconds(70),
//                    ReceiveTimeout = TimeSpan.FromSeconds(70),
//                    CloseTimeout = TimeSpan.FromSeconds(70)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.SaveDentalCaseAsync(model.abuseHistorryList,
//                                                                                model.admission,
//                                                                                model.organization,
//                                                                                model.referring,
//                                                                                model.attender,
//                                                                                model.diagnosisList,
//                                                                                model.dentalDiagnosis,
//                                                                                model.dentalTreatment,
//                                                                                model.drugHistoryList,
//                                                                                model.adverseReactionList,
//                                                                                model.drugOrderedList,
//                                                                                model.familyHistoryList,
//                                                                                model.insurance,
//                                                                                model.medicalHistoryList,
//                                                                                model.developer,
//                                                                                model.lifeCycleState,
//                                                                                model.patient,
//                                                                                model.compositionUID,
//                                                                                model.patientUID);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) && !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendReferralPatientRecord");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<SendFeedbackPatientRecord_Result>> SendFeedbackPatientRecord(SendFeedBackPatientRecord model)
//        {
//            var result = new MyResultDataStatus<SendFeedbackPatientRecord_Result>()
//            {
//                Data = new SendFeedbackPatientRecord_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(60),
//                    OpenTimeout = TimeSpan.FromSeconds(60),
//                    ReceiveTimeout = TimeSpan.FromSeconds(60),
//                    CloseTimeout = TimeSpan.FromSeconds(60)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.SendFeedbackPatientRecordAsync(model.abuseHistorryList,
//                                                                          model.admission,
//                                                                          model.organization,
//                                                                          model.referring,
//                                                                          model.attender,
//                                                                          model.careActionList,
//                                                                          model.clinicList,
//                                                                          model.diagnosisList,
//                                                                          model.drugHistoryList,
//                                                                          model.drugOrderedList,
//                                                                          model.familyHistoryList,
//                                                                          model.followUp,
//                                                                          model.insurance,
//                                                                          model.medicalHistoryList,
//                                                                          null,
//                                                                          model.developer,
//                                                                          model.lifeCycleState,
//                                                                          model.patient,
//                                                                          model.referralId,
//                                                                          model.referralAssigner,
//                                                                          model.compositionUID,
//                                                                          model.patientUID);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) && !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendFeedbackPatientRecord");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<GetFeedbackPatientRecord_Result>> GetFeedbackPatientRecord(HID hid)
//        {
//            var result = new MyResultDataStatus<GetFeedbackPatientRecord_Result>()
//            {
//                Data = new GetFeedbackPatientRecord_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(15),
//                    OpenTimeout = TimeSpan.FromSeconds(15),
//                    ReceiveTimeout = TimeSpan.FromSeconds(15),
//                    CloseTimeout = TimeSpan.FromSeconds(15)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.GetFeedbackPatientRecordAsync(hid);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/GetFeedbackPatientRecord");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<GetActiveReferralId_Result>> GetActiveReferralIDByNationalCode(string nationalCode)
//        {
//            var result = new MyResultDataStatus<GetActiveReferralId_Result>()
//            {
//                Data = new GetActiveReferralId_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(15),
//                    OpenTimeout = TimeSpan.FromSeconds(15),
//                    ReceiveTimeout = TimeSpan.FromSeconds(15),
//                    CloseTimeout = TimeSpan.FromSeconds(15)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetActiveReferralIDByNationalCodeAsync(nationalCode);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/GetActiveReferralIdByNationalCode");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetActiveReferralId_Result>> GetActiveReferralIDByPersonIdentifier(bool isForeign, string nationalCode)
//        {
//            var result = new MyResultDataStatus<GetActiveReferralId_Result>()
//            {
//                Data = new GetActiveReferralId_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(15),
//                    OpenTimeout = TimeSpan.FromSeconds(15),
//                    ReceiveTimeout = TimeSpan.FromSeconds(15),
//                    CloseTimeout = TimeSpan.FromSeconds(15)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                var person = new Person()
//                {
//                    IsForeign = isForeign,
//                    NationalCode = nationalCode
//                };

//                result.Data = await serviceClient.GetActiveReferralIDByPersonIdentifierAsync(person);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/GetActiveReferralIdByNationalCode");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<SaveDeathCertificate_Result>> SaveDeathCetificateRecord(SaveDeathCertificateRecord model)
//        {
//            var result = new MyResultDataStatus<SaveDeathCertificate_Result>()
//            {
//                Data = new SaveDeathCertificate_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(70),
//                    OpenTimeout = TimeSpan.FromSeconds(70),
//                    ReceiveTimeout = TimeSpan.FromSeconds(70),
//                    CloseTimeout = TimeSpan.FromSeconds(70)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.SaveDeathCertificateAsync(model.organization,
//                                                                                model.burialAttesterDetails,
//                                                                                model.individualRegister,
//                                                                                model.issueDate,
//                                                                                model.serialNumber,
//                                                                                model.comment,
//                                                                                model.deathDate,
//                                                                                model.deathLocation,
//                                                                                model.deathTime,
//                                                                                model.householdHeadNationalCode,
//                                                                                model.infantDeliveryInfo,
//                                                                                model.mother,
//                                                                                model.sourceOfNotification,
//                                                                                model.deathCauseList,
//                                                                                model.relatedConditionList,
//                                                                                model.developer,
//                                                                                model.patient,
//                                                                                model.compositionUID,
//                                                                                model.patientUID);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) && !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.Successfull = false;
//                }
//            }
//            catch (Exception ex)
//            {
//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendReferralPatientRecord");
//            }

//            //ws.Abort();
//            return result;
//        }

//    }

//    public class BindingReferralModel_WCF
//    {
//        private readonly ICompanyRepository _companyRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly IAdmissionReferRepository _admissionReferRepository;
//        private readonly IAdmissionsRepository _admissionsRepository;
//        public BindingReferralModel_WCF(ICompanyRepository companyRepository, ISetupRepository setupRepository,
//                                IAdmissionReferRepository admissionReferRepository, IAdmissionsRepository admissionsRepository)
//        {
//            _companyRepository = companyRepository;
//            _setupRepository = setupRepository;
//            _admissionReferRepository = admissionReferRepository;
//            _admissionsRepository = admissionsRepository;
//        }

//        public async Task<SendReferralPatientRecord> AdmissionSendReferralBinding(int referralId)
//        {
//            var result = new SendReferralPatientRecord();
//            var referral = await _admissionReferRepository.GetAdmissionRefer(referralId);
//            var companyInfo = await _companyRepository.GetCompanyInfo();
//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
//            var systemId = await _setupRepository.GetCisWcfSystemId();
//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,
//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };
//            var patient = new Patient
//            {
//                NationalCode = referral.PatientNationalCode,
//                FirstName = referral.PatientFirstName,
//                LastName = referral.PatientLastName,
//                MobileNumber = referral.PatientMobileNo,
//                FullAddress = referral.PatientAddress,
//                GenderId = referral.PatientGenderId.ToString(),
//                BirthDate = referral.PatientBirthDate,
//                NationalityId = referral.PatientNationalityId
//            };
//            var developer = new Developer
//            {
//                SystemId = systemId
//            };
//            var admission = new Admission()
//            {
//                AdmissionId = referral.AdmissionId.ToString(),
//                AdmissionDate = referral.AdmissionCreateDatePersian,
//                AdmissionTime = referral.AdmissionCreateTime,
//                HID = referral.AdmissionHID
//            };
//            result.organization = organization;
//            result.compositionUID = referral.CompositionUID;
//            result.patient = patient;
//            result.patientUID = referral.PersonUID;
//            result.referralId = referral.Id.ToString();
//            result.developer = developer;
//            result.admission = admission;
//            result.abuseHistorryList = referral.AdmissionReferAbuseHistoryLines != null ? referral.AdmissionReferAbuseHistoryLines.Select(a => new AbuseHistory
//            {
//                AbuseDuration = new DoQuantity
//                {
//                    Magnitude = a.AbuseDuration,
//                    Unit = a.AbuseDurationUnitName
//                },
//                AmountOfAbuse = new DoQuantity
//                {
//                    Magnitude = a.AmountOfAbuseDosage,
//                    Unit = a.AmountOfAbuseUnitName
//                },
//                QuitDate = a.QuitDatePersian.ToString(),
//                StartDate = a.StartDatePersian.ToString(),
//                SubstanceType = new Snomedct
//                {
//                    Code = a.SubstanceTypeCode,
//                    Value = a.SubstanceTypeName
//                }
//            }).ToArray() : null;
//            result.careActionList = referral.AdmissionReferCareActionLines != null ? referral.AdmissionReferCareActionLines.Select(a => new CareAction
//            {
//                ActionDescription = a.ActionDescription,
//                ActionName = new ActionNameType
//                {
//                    Code = a.ActionCode.ToString(),
//                    Name = a.ActionName
//                },
//                EndDate = string.IsNullOrEmpty(a.EndDateTimePersian) ? "" : a.EndDateTimePersian.Split(" ")[0],
//                StartDate = string.IsNullOrEmpty(a.StartDateTimePersian) ? "" : a.StartDateTimePersian.Split(" ")[0],
//                EndTime = a.EndTime,
//                StartTime = a.StartTime,
//                TimeTaken = new DoQuantity
//                {
//                    Magnitude = a.TimeTaken,
//                    Unit = a.TimeTakenUnitName
//                }
//            }).ToArray() : null;
//            result.clinicList = referral.AdmissionReferClinicFindingLines != null ? referral.AdmissionReferClinicFindingLines.Select(a => new ClinicFinding
//            {
//                AgeOfOnset = new DoQuantity
//                {
//                    Magnitude = a.AgeOfOnset,
//                    Unit = "a"
//                },
//                AnatomicalLocations = null,
//                DateofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian) ? "" : a.OnSetDateTimePersian.Split(" ")[0],
//                TimeofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian) ? "" : a.OnSetDateTimePersian.Split(" ")[1],
//                Description = a.Description,
//                Finding = new FindingType
//                {
//                    Code = a.FindingCode,
//                    Name = a.FindingName
//                },
//                Severity = new InjurySeverityType
//                {
//                    SeverityCode = a.SeverityId.ToString(),
//                    SeverityName = a.SeverityName
//                },
//                SeverityValue = 0,
//                NillSignificant = a.NillSignificant,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                }
//            }).ToArray() : null;
//            result.drugHistoryList = referral.AdmissionReferDrugHistoryLines != null ? referral.AdmissionReferDrugHistoryLines.Select(a => new DrugHistory
//            {
//                Medication = new Medication
//                {
//                    Code = a.MedicationCode,
//                    Name = a.MedicationName
//                },
//                RouteOfAdministartion = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                }
//            }).ToArray() : null;
//            result.drugOrderedList = referral.AdmissionReferDrugOrderedLines != null ? referral.AdmissionReferDrugOrderedLines.Select(a => new DrugOrdered
//            {
//                AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[0],
//                AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[1],
//                Description = a.Description,
//                Dosage = new DoQuantity
//                {
//                    Magnitude = a.Dosage,
//                    Unit = a.DosageUnitName
//                },
//                DrugGenericName = a.DrugGenericName,
//                DrugProduct = new DrugProduct
//                {
//                    Code = a.ProductCode.ToString(),
//                    Value = a.ProductName
//                },
//                Frequency = new Snomedct
//                {
//                    Code = a.FrequencyCode,
//                    Value = a.FrequencyName
//                },
//                LongTerm = new DoQuantity
//                {
//                    Magnitude = a.LongTerm,
//                    Unit = a.LongTermUnitName
//                },
//                Route = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                },
//                TotalNumber = a.TotalNumber
//            }).ToArray() : null;
//            result.familyHistoryList = referral.AdmissionReferalFamilyHisotryLines != null ? referral.AdmissionReferalFamilyHisotryLines.Select(a => new FamilyHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                IsCauseofDeath = a.IsCauseofDeath,
//                RelatedPerson = new RelatedPerson
//                {
//                    Code = a.RelatedPersonCode,
//                    Name = a.RelatedPersonName
//                }
//            }).ToArray() : null;
//            result.medicalHistoryList = referral.AdmissionReferMedicalHistoryLines != null ? referral.AdmissionReferMedicalHistoryLines.Select(a => new MedicalHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                },
//                DateofOnset = a.DateOfOnsetPersian
//            }).ToArray() : null;
//            result.insurance = new BillInsurance
//            {
//                Insurer = new Insurer() { Id = referral.BasicInsurerCode.ToString(), Name = referral.BasicInsurerName },
//                InsuranceNumber = referral.InsurNo,
//                BasicInsuranceBoxId = referral.InsuranceBoxCode != null ? referral.InsuranceBoxCode.ToString() : "",
//                BasicInsuranceBoxName = referral.InsuranceBoxName,
//                BasicInsurerHID = new HID()
//                {
//                    AssignerCode = referral.BasicInsurerCode == "1" || referral.BasicInsurerCode == "2" ? referral.BasicInsurerCode : "3",
//                    Id = referral.AdmissionHID
//                },
//                BasicInsurerSerialNumber = referral.InsurPageNo != 0 ? referral.InsurPageNo.ToString() : "",
//                BasicInsuranceExpDate = referral.InsurExpDatePersian
//            };
//            result.diagnosisList = referral.AdmissionDiagnosisLines != null ? referral.AdmissionDiagnosisLines.Select(a => new Diagnosis
//            {
//                Comment = a.Comment,
//                DiagnosisDate = a.CreateDatePersian,
//                DiagnosisInfo = new Reason
//                {
//                    Code = a.DiagnosisReasonCode,
//                    Value = a.DiagnosisReasonName
//                },
//                DiagnosisTime = a.CreateTime,
//                Severity = new DiagnosisSeverity
//                {
//                    SeverityCode = a.ServerityId.ToString(),
//                    SeverityName = a.SeverityName
//                },
//                Status = new DiagnosisStatus
//                {
//                    StatusCode = a.StatusId.ToString(),
//                    StatusName = a.DiagnosisStatusName
//                }
//            }).ToArray() : null;
//            result.attender = new ProviderComp
//            {
//                FirstName = referral.AttenderFirstName,
//                LastName = referral.AttenderLastName,
//                FullName = referral.AttenderFullName,
//                MscTypeId = referral.AttenderMSCTypeId,
//                Id = referral.AttenderMSCId.ToString(),
//                Role = new AttenderRole() { Id = referral.AttenderRoleCode, Name = referral.AttenderRoleName },
//                Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(referral.AttenderSpecialtyId.ToString()) ? referral.AttenderSpecialtyId.ToString() : "", Name = referral.AttenderSpecialtyName },
//            };
//            result.referralInfo = new ReferralInfo
//            {
//                ReferredReason = new ReferredReason
//                {
//                    Code = referral.ReferredReasonId.ToString(),
//                    Value = referral.ReferredReasonName
//                },
//                ReferredDate = referral.ReferredCreateDatePersian,
//                ReferredFacility = null,
//                ReferredProvider = null,
//                ReferredTime = referral.ReferredCreateTime,
//                ReferredType = new ReferredType
//                {
//                    Code = referral.ReferredTypeId.ToString(),
//                    Value = referral.ReferredReasonTypeName
//                },
//                Description = referral.ReferredDescription
//            };
//            result.referring = new ReferringComp
//            {
//                FirstName = referral.AttenderFirstName,
//                LastName = referral.AttenderLastName,
//                FullName = referral.AttenderFullName,
//                MscTypeId = referral.AttenderMSCTypeId,
//                Id = referral.AttenderMSCId.ToString(),
//                Role = new ReferringRole() { Id = "1.3", Name = "پزشک ارجاع دهنده" },
//                Specialty = new ReferringSpecialty() { Id = !string.IsNullOrEmpty(referral.AttenderSpecialtyId.ToString()) ? referral.AttenderSpecialtyId.ToString() : "", Name = referral.AttenderSpecialtyName },
//            };
//            result.physicalExam = new PhysicalExam
//            {
//                BloodPressureList = referral.AdmissionReferBloodPressureLines != null ? referral.AdmissionReferBloodPressureLines.Select(a => new BloodPressure
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    DiastolicBP = new DoQuantity
//                    {
//                        Magnitude = a.DiastolicBP,
//                        Unit = "mm Hg"
//                    },
//                    Position = new Snomedct
//                    {
//                        Code = a.PositionCode,
//                        Value = a.PositionName
//                    },
//                    SystolicBP = new DoQuantity
//                    {
//                        Magnitude = a.SystolicBP,
//                        Unit = "mm Hg"
//                    }
//                }).ToArray() : null,
//                PulseList = referral.AdmissionReferPulseLines != null ? referral.AdmissionReferPulseLines.Select(a => new Pulse
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    ClinicalDescription = a.ClinicalDescription,
//                    IsPulsePresent = a.IsPulsePresent,
//                    Method = new Snomedct
//                    {
//                        Code = a.MethodCode,
//                        Value = a.MethodName
//                    },
//                    //Position = null,
//                    //Position = new Position
//                    //{
//                    //    Code = a.PositionCode,
//                    //    Value = a.PositionName
//                    //},
//                    PulseRate = new DoQuantity
//                    {
//                        Magnitude = a.PulseRate,
//                        Unit = "/min"
//                    },
//                    LocationOfMeasurment = new Snomedct
//                    {
//                        Code = a.LocationOfMeasurmentCode,
//                        Value = a.LocationOfMeasurmentName
//                    },
//                    Character = new Snomedct
//                    {
//                        Code = a.CharacterCode,
//                        Value = a.CharacterName
//                    },
//                    //Regularity = new Snomedct
//                    //{
//                    //    Code = a.RegularityCode,
//                    //    Value = a.RegularityName
//                    //},
//                    //Volume = new Snomedct
//                    //{
//                    //    Code = a.VolumeCode,
//                    //    Value = a.VolumeName
//                    //}
//                }).ToArray() : null,
//                VitalSignsList = referral.AdmissionReferVitalSignsLines != null ? referral.AdmissionReferVitalSignsLines.Select(a => new VitalSigns
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    PulseRate = new DoQuantity
//                    {
//                        Magnitude = a.PulseRate,
//                        Unit = "/min"
//                    },
//                    RespiratoryRate = new DoQuantity
//                    {
//                        Magnitude = a.RespiratoryRate,
//                        Unit = "/min"
//                    },
//                    Temperature = new DoQuantity
//                    {
//                        Magnitude = a.Temperature,
//                        Unit = "C"
//                    },
//                    TemperatureLocation = new Snomedct()
//                    {
//                        Code = a.TemperatureLocationCode,
//                        Value = a.TemperatureLocationName
//                    }

//                }).ToArray() : null,
//                WaistHipsList = referral.AdmissionReferWaistHipLines != null ? referral.AdmissionReferWaistHipLines.Select(a => new WaistHip
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    HipCircumference = new DoQuantity
//                    {
//                        Magnitude = a.HipCircumference,
//                        Unit = "cm"
//                    },
//                    WaistCircumference = new DoQuantity
//                    {
//                        Magnitude = a.WaistCircumference,
//                        Unit = "cm"
//                    }
//                }).ToArray() : null,
//                HeightWeightList = referral.AdmissionReferHeightWeightLines != null ? referral.AdmissionReferHeightWeightLines.Select(a => new HeightWeight
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    Height = new DoQuantity
//                    {
//                        Magnitude = a.Height,
//                        Unit = "cm"
//                    },
//                    Weight = new DoQuantity
//                    {
//                        Magnitude = a.Weight,
//                        Unit = "km"
//                    }
//                }).ToArray() : null
//            };
//            result.adverseReactionList = referral.AdmissionReferAdverseReactionLines != null ? referral.AdmissionReferAdverseReactionLines.Select(a => new AdverseReaction
//            {
//                Description = a.Description,
//                Reaction = new Snomedct
//                {
//                    Code = a.ReactionCode.ToString(),
//                    Value = a.ReactionName
//                },
//                ReactionCategory = new Snomedct
//                {
//                    Code = a.ReactionCategoryCode.ToString(),
//                    Value = a.ReactionCategoryName
//                },
//                Severity = new DiagnosisSeverity
//                {
//                    SeverityCode = a.DiagnosisSeverityId.ToString(),
//                    SeverityName = a.DiagnosisSeverityName,
//                },
//                CausativeAgent = new Snomedct
//                {
//                    Code = a.CausativeAgentCode,
//                    Value = a.CausativeAgentName
//                },
//                CausativeAgentCategory = new Snomedct
//                {
//                    Code = a.CausativeAgentCategoryCode,
//                    Value = a.CausativeAgentCategoryName
//                }
//            }).ToArray() : null;

//            return result;
//        }

//        public async Task<SendFeedBackPatientRecord> SendFeedbackPatientRecordBinding(int referralId)
//        {
//            var result = new SendFeedBackPatientRecord();
//            var referral = await _admissionReferRepository.GetAdmissionFeedback(referralId);
//            var companyInfo = await _companyRepository.GetCompanyInfo();
//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
//            var systemId = await _setupRepository.GetCisWcfSystemId();

//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,
//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };
//            var patient = new Patient
//            {
//                NationalCode = referral.PatientNationalCode,
//                FirstName = referral.PatientFirstName,
//                LastName = referral.PatientLastName,
//                MobileNumber = referral.PatientMobileNo,
//                FullAddress = referral.PatientAddress,
//                GenderId = referral.PatientGenderId.ToString(),
//                BirthDate = referral.PatientBirthDate,
//                NationalityId = referral.PatientNationalityId
//            };
//            var developer = new Developer
//            {
//                SystemId = systemId
//            };
//            var admission = new Admission()
//            {
//                AdmissionId = referral.AdmissionId.ToString(),
//                AdmissionDate = referral.AdmissionCreateDatePersian,
//                AdmissionTime = referral.AdmissionCreateTime,
//                HID = referral.AdmissionHID
//            };

//            var assignerCode = string.Empty;
//            if (referral.RelatedHID.StartsWith("Z"))
//            {
//                if (referral.RelatedHID.Length == 12)
//                    assignerCode = referral.RelatedHID.Substring(1, 2);
//                else
//                    assignerCode = referral.RelatedHID.Substring(1, 1);
//            }
//            else
//                if (referral.RelatedHID.Length == 11)
//                assignerCode = referral.RelatedHID.Substring(0, 2);
//            else
//                assignerCode = referral.RelatedHID.Substring(0, 1);

//            //var assignerCode = referral.RelatedHID.Substring(0, 2);
//            //var referralHID = referral.RelatedHID.Remove(0, 2);
//            var referralHID = referral.RelatedHID;
//            var referralAssigner = string.Empty;

//            if (assignerCode == "1")
//                referralAssigner = "1";
//            else if (assignerCode == "2")
//                referralAssigner = "2";
//            else
//                referralAssigner = "3";

//            result.organization = organization;
//            result.compositionUID = referral.CompositionUID;
//            result.patient = patient;
//            result.patientUID = referral.PersonUID;
//            result.referralId = referralHID;
//            result.referralAssigner = referralAssigner;
//            result.developer = developer;
//            result.admission = admission;
//            result.abuseHistorryList = referral.AdmissionReferAbuseHistoryLines != null ? referral.AdmissionReferAbuseHistoryLines.Select(a => new AbuseHistory
//            {
//                AbuseDuration = new DoQuantity
//                {
//                    Magnitude = a.AbuseDuration,
//                    Unit = a.AbuseDurationUnitName
//                },
//                AmountOfAbuse = new DoQuantity
//                {
//                    Magnitude = a.AmountOfAbuseDosage,
//                    Unit = a.AmountOfAbuseUnitName
//                },
//                QuitDate = a.QuitDatePersian.ToString(),
//                StartDate = a.StartDatePersian.ToString(),
//                SubstanceType = new Snomedct
//                {
//                    Code = a.SubstanceTypeCode,
//                    Value = a.SubstanceTypeName
//                }
//            }).ToArray() : null;
//            result.careActionList = referral.AdmissionReferCareActionLines != null ? referral.AdmissionReferCareActionLines.Select(a => new CareAction
//            {
//                ActionDescription = a.ActionDescription,
//                ActionName = new ActionNameType
//                {
//                    Code = a.ActionCode.ToString(),
//                    Name = a.ActionName
//                },
//                EndDate = string.IsNullOrEmpty(a.EndDateTimePersian) ? "" : a.EndDateTimePersian.Split(" ")[0],
//                StartDate = string.IsNullOrEmpty(a.StartDateTimePersian) ? "" : a.StartDateTimePersian.Split(" ")[0],
//                EndTime = a.EndTime,
//                StartTime = a.StartTime,
//                TimeTaken = new DoQuantity
//                {
//                    Magnitude = a.TimeTaken,
//                    Unit = a.TimeTakenUnitName
//                }
//            }).ToArray() : null;
//            result.clinicList = referral.AdmissionReferClinicFindingLines != null ? referral.AdmissionReferClinicFindingLines.Select(a => new ClinicFinding
//            {
//                AgeOfOnset = new DoQuantity
//                {
//                    Magnitude = a.AgeOfOnset,
//                    Unit = "a"
//                },
//                AnatomicalLocations = null,
//                DateofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian) ? "" : a.OnSetDateTimePersian.Split(" ")[0],
//                TimeofOnset = string.IsNullOrEmpty(a.OnSetDateTimePersian) ? "" : a.OnSetDateTimePersian.Split(" ")[1],
//                Description = a.Description,
//                Finding = new FindingType
//                {
//                    Code = a.FindingCode,
//                    Name = a.FindingName
//                },
//                Severity = new InjurySeverityType
//                {
//                    SeverityCode = a.SeverityId.ToString(),
//                    SeverityName = a.SeverityName
//                },
//                SeverityValue = 0,
//                NillSignificant = a.NillSignificant,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                }
//            }).ToArray() : null;
//            result.drugHistoryList = referral.AdmissionReferDrugHistoryLines != null ? referral.AdmissionReferDrugHistoryLines.Select(a => new DrugHistory
//            {
//                Medication = new Medication
//                {
//                    Code = a.MedicationCode,
//                    Name = a.MedicationName
//                },
//                RouteOfAdministartion = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                }
//            }).ToArray() : null;
//            result.drugOrderedList = referral.AdmissionReferDrugOrderedLines != null ? referral.AdmissionReferDrugOrderedLines.Select(a => new DrugOrdered
//            {
//                AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[0],
//                AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[1],
//                Description = a.Description,
//                Dosage = new DoQuantity
//                {
//                    Magnitude = a.Dosage,
//                    Unit = a.DosageUnitName
//                },
//                DrugGenericName = a.DrugGenericName,
//                DrugProduct = new DrugProduct
//                {
//                    Code = a.ProductCode.ToString(),
//                    Value = a.ProductName
//                },
//                Frequency = new Snomedct
//                {
//                    Code = a.FrequencyCode,
//                    Value = a.FrequencyName
//                },
//                LongTerm = new DoQuantity
//                {
//                    Magnitude = a.LongTerm,
//                    Unit = a.LongTermUnitName
//                },
//                Route = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                },
//                TotalNumber = a.TotalNumber
//            }).ToArray() : null;
//            result.familyHistoryList = referral.AdmissionReferalFamilyHisotryLines != null ? referral.AdmissionReferalFamilyHisotryLines.Select(a => new FamilyHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                IsCauseofDeath = a.IsCauseofDeath,
//                RelatedPerson = new RelatedPerson
//                {
//                    Code = a.RelatedPersonCode,
//                    Name = a.RelatedPersonName
//                }
//            }).ToArray() : null;
//            result.medicalHistoryList = referral.AdmissionReferMedicalHistoryLines != null ? referral.AdmissionReferMedicalHistoryLines.Select(a => new MedicalHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                },
//                //DateofOnset = a.DateOfOnsetPersian
//                DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0],
//                //DateofOnset = string.IsNullOrEmpty(a.DateOfOnsetPersian) ? "" : a.DateOfOnsetPersian.Split(" ")[0],
//            }).ToArray() : null;
//            result.insurance = new BillInsurance
//            {
//                Insurer = new Insurer() { Id = referral.BasicInsurerCode.ToString(), Name = referral.BasicInsurerName },
//                InsuranceNumber = referral.InsurNo,
//                BasicInsuranceBoxId = referral.InsuranceBoxCode != null ? referral.InsuranceBoxCode.ToString() : "",
//                BasicInsuranceBoxName = referral.InsuranceBoxName,
//                BasicInsurerHID = new HID()
//                {
//                    AssignerCode = referral.BasicInsurerCode == "1" || referral.BasicInsurerCode == "2" ? referral.BasicInsurerCode : "3",
//                    Id = referral.AdmissionHID
//                },
//                BasicInsurerSerialNumber = referral.InsurPageNo != 0 ? referral.InsurPageNo.ToString() : "",
//                BasicInsuranceExpDate = referral.InsurExpDatePersian
//            };
//            //result.lifeCycleState = new LifeCycleState
//            //{
//            //    StatusCode = referral.LifeCycleStateCode,
//            //    StatusName = referral.LifeCycleStateName
//            //};

//            result.diagnosisList = referral.AdmissionDiagnosisLines != null ? referral.AdmissionDiagnosisLines.Select(a => new Diagnosis
//            {
//                Comment = a.Comment,
//                DiagnosisDate = a.CreateDatePersian,
//                DiagnosisInfo = new Reason
//                {
//                    Code = a.DiagnosisReasonId.ToString(),
//                    Value = a.DiagnosisReasonName
//                },
//                DiagnosisTime = a.CreateTime,
//                Severity = new DiagnosisSeverity
//                {
//                    SeverityCode = a.ServerityId.ToString(),
//                    SeverityName = a.SeverityName
//                },
//                Status = new DiagnosisStatus
//                {
//                    StatusCode = a.StatusId.ToString(),
//                    StatusName = a.DiagnosisStatusName
//                }
//            }).ToArray() : null;

//            result.attender = new ProviderComp
//            {
//                FirstName = referral.AttenderFirstName,
//                LastName = referral.AttenderLastName,
//                FullName = referral.AttenderFullName,
//                MscTypeId = referral.AttenderMSCTypeId,
//                Id = referral.AttenderMSCId.ToString(),
//                Role = new AttenderRole() { Id = referral.AttenderRoleCode, Name = referral.AttenderRoleName },
//                Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(referral.AttenderSpecialtyId.ToString()) ? referral.AttenderSpecialtyId.ToString() : "", Name = referral.AttenderSpecialtyName },
//            };

//            // var doDate = Convert_To_DoDate(referral.ReferredCreateDatePersian);

//            //result.referralInfo = new ReferralInfo
//            //{
//            //    ReferredReason = new ReferredReason
//            //    {
//            //        Code = referral.ReferredReasonId.ToString(),
//            //        Value = referral.ReferredReasonName
//            //    },
//            //    ReferredDate = referral.ReferredCreateDatePersian,
//            //    ReferredFacility = null,
//            //    ReferredProvider = null,
//            //    ReferredTime = referral.ReferredCreateTime,
//            //    ReferredType = new ReferredType
//            //    {
//            //        Code = referral.ReferredTypeId.ToString(),
//            //        Value = referral.ReferredReasonTypeName
//            //    },
//            //    Description = referral.ReferredDescription
//            //};

//            result.referring = new ReferringComp
//            {
//                FirstName = referral.AttenderFirstName,
//                LastName = referral.AttenderLastName,
//                FullName = referral.AttenderFullName,
//                MscTypeId = referral.AttenderMSCTypeId,
//                Id = referral.AttenderMSCId.ToString(),
//                Role = new ReferringRole() { Id = "1.3", Name = "پزشک ارجاع دهنده" },
//                Specialty = new ReferringSpecialty() { Id = !string.IsNullOrEmpty(referral.AttenderSpecialtyId.ToString()) ? referral.AttenderSpecialtyId.ToString() : "", Name = referral.ReferringSpecialtyName },
//            };
//            result.physicalExam = new PhysicalExam
//            {
//                BloodPressureList = referral.AdmissionReferBloodPressureLines != null ? referral.AdmissionReferBloodPressureLines.Select(a => new BloodPressure
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    DiastolicBP = new DoQuantity
//                    {
//                        Magnitude = a.DiastolicBP,
//                        Unit = "mm Hg"
//                    },
//                    Position = new Snomedct
//                    {
//                        Code = a.PositionCode,
//                        Value = a.PositionName
//                    },
//                    SystolicBP = new DoQuantity
//                    {
//                        Magnitude = a.SystolicBP,
//                        Unit = "mm Hg"
//                    }
//                }).ToArray() : null,
//                PulseList = referral.AdmissionReferPulseLines != null ? referral.AdmissionReferPulseLines.Select(a => new Pulse
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    ClinicalDescription = a.ClinicalDescription,
//                    IsPulsePresent = a.IsPulsePresent,
//                    Method = new Snomedct
//                    {
//                        Code = a.MethodCode,
//                        Value = a.MethodName
//                    },
//                    //Position = null,
//                    //Position = new Position
//                    //{
//                    //    Code = a.PositionCode,
//                    //    Value = a.PositionName
//                    //},
//                    PulseRate = new DoQuantity
//                    {
//                        Magnitude = a.PulseRate,
//                        Unit = "/min"
//                    }
//                }).ToArray() : null,
//                VitalSignsList = referral.AdmissionReferVitalSignsLines != null ? referral.AdmissionReferVitalSignsLines.Select(a => new VitalSigns
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    PulseRate = new DoQuantity
//                    {
//                        Magnitude = a.PulseRate,
//                        Unit = "/min"
//                    },
//                    RespiratoryRate = new DoQuantity
//                    {
//                        Magnitude = a.RespiratoryRate,
//                        Unit = "/min"
//                    },
//                    Temperature = new DoQuantity
//                    {
//                        Magnitude = a.Temperature,
//                        Unit = "C"
//                    }
//                }).ToArray() : null,
//                WaistHipsList = referral.AdmissionReferWaistHipLines != null ? referral.AdmissionReferWaistHipLines.Select(a => new WaistHip
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    HipCircumference = new DoQuantity
//                    {
//                        Magnitude = a.HipCircumference,
//                        Unit = "cm"
//                    },
//                    WaistCircumference = new DoQuantity
//                    {
//                        Magnitude = a.WaistCircumference,
//                        Unit = "cm"
//                    }
//                }).ToArray() : null,
//                HeightWeightList = referral.AdmissionReferHeightWeightLines != null ? referral.AdmissionReferHeightWeightLines.Select(a => new HeightWeight
//                {
//                    ObservationDate = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[0],
//                    ObservationTime = string.IsNullOrEmpty(a.ObservationDateTimePersian) ? "" : a.ObservationDateTimePersian.Split(" ")[1],
//                    Height = new DoQuantity
//                    {
//                        Magnitude = a.Height,
//                        Unit = "cm"
//                    },
//                    Weight = new DoQuantity
//                    {
//                        Magnitude = a.Weight,
//                        Unit = "km"
//                    }
//                }).ToArray() : null,
//            };
//            result.followUp = new FollowUpPlan
//            {
//                NextEncounter = new DoQuantity
//                {
//                    Magnitude = referral.FollowUpNextEncounter,
//                    Unit = referral.FollowUpNextEncounterUnitName
//                },
//                NextEncounterDate = referral.FollowUpDateTime.ToString(),
//                NextEncounterTime = referral.FollowUpDateTime != null ? referral.FollowUpDateTime.ToString().Split(" ")[1] : "",
//                Description = referral.FollowUpDescription,
//                Type = new FollowUpType
//                {
//                    Code = referral.FollowUpNextEncounterType.ToString(),
//                    Name = referral.FollowUpNextEncounterTypeName
//                }
//            };

//            return result;
//        }
//    }

//    public class BindingDentalModel_WCF
//    {
//        private readonly ICompanyRepository _companyRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly IDentalRepository _admissionDentalRepository;
//        private readonly IAdmissionsRepository _admissionsRepository;
//        public BindingDentalModel_WCF(ICompanyRepository companyRepository,
//                                ISetupRepository setupRepository,
//                                IDentalRepository dentalRepository,
//                                IAdmissionsRepository admissionsRepository)
//        {
//            _companyRepository = companyRepository;
//            _setupRepository = setupRepository;
//            _admissionDentalRepository = dentalRepository;
//            _admissionsRepository = admissionsRepository;
//        }

//        public async Task<SaveDentalCaseRecord> SendDentalBinding(int dentalId)
//        {
//            var result = new SaveDentalCaseRecord();
//            var dental = await _admissionDentalRepository.GetAdmissionDental(dentalId);
//            var companyInfo = await _companyRepository.GetCompanyInfo();
//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
//            var systemId = await _setupRepository.GetCisWcfSystemId();
//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,
//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };
//            var patient = new Patient
//            {
//                NationalCode = dental.PatientNationalCode,
//                FirstName = dental.PatientFirstName,
//                LastName = dental.PatientLastName,
//                MobileNumber = dental.PatientMobileNo,
//                FullAddress = dental.PatientAddress,
//                GenderId = dental.PatientGenderId.ToString(),
//                BirthDate = dental.PatientBirthDate,
//                NationalityId = dental.PatientNationalityId
//            };
//            var developer = new Developer
//            {
//                SystemId = systemId
//            };
//            var admission = new Admission()
//            {
//                AdmissionId = dental.AdmissionId.ToString(),
//                AdmissionDate = dental.AdmissionCreateDatePersian,
//                AdmissionTime = dental.AdmissionCreateTime,
//                HID = dental.AdmissionHID
//            };

//            result.organization = organization;
//            result.compositionUID = dental.CompositionUID;
//            result.patient = patient;
//            result.patientUID = dental.PersonUID;
//            result.referralId = dental.Id.ToString();
//            result.developer = developer;
//            result.admission = admission;
//            result.abuseHistorryList = dental.DentalAbuseHistoryLines != null ? dental.DentalAbuseHistoryLines.Select(a => new AbuseHistory
//            {
//                AbuseDuration = new DoQuantity
//                {
//                    Magnitude = a.AbuseDuration,
//                    Unit = a.AbuseDurationUnitName
//                },
//                AmountOfAbuse = new DoQuantity
//                {
//                    Magnitude = a.AmountOfAbuseDosage,
//                    Unit = a.AmountOfAbuseUnitName
//                },
//                QuitDate = a.QuitDatePersian.ToString(),
//                StartDate = a.StartDatePersian.ToString(),
//                SubstanceType = new Snomedct
//                {
//                    Code = a.SubstanceTypeCode,
//                    Value = a.SubstanceTypeName
//                }
//            }).ToArray() : null;

//            result.drugHistoryList = dental.DentalDrugHistoryLines != null ? dental.DentalDrugHistoryLines.Select(a => new DrugHistory
//            {
//                Medication = new Medication
//                {
//                    Code = a.MedicationCode,
//                    Name = a.MedicationName
//                },
//                RouteOfAdministartion = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                }
//            }).ToArray() : null;

//            result.drugOrderedList = dental.DentalDrugOrderedLines != null ? dental.DentalDrugOrderedLines.Select(a => new DrugOrdered
//            {
//                AdministrationDate = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[0],
//                AdministrationTime = string.IsNullOrEmpty(a.AdministrationDateTimePersian) ? "" : a.AdministrationDateTimePersian.Split(" ")[1],
//                Description = a.Description,
//                Dosage = new DoQuantity
//                {
//                    Magnitude = a.Dosage,
//                    Unit = a.DosageUnitName
//                },
//                DrugGenericName = a.DrugGenericName,
//                DrugProduct = new DrugProduct
//                {
//                    Code = a.ProductCode.ToString(),
//                    Value = a.ProductName
//                },
//                Frequency = new Snomedct
//                {
//                    Code = a.FrequencyCode,
//                    Value = a.FrequencyName
//                },
//                LongTerm = new DoQuantity
//                {
//                    Magnitude = a.LongTerm,
//                    Unit = a.LongTermUnitName
//                },
//                Route = new Snomedct
//                {
//                    Code = a.RouteCode,
//                    Value = a.RouteName
//                },
//                TotalNumber = a.TotalNumber
//            }).ToArray() : null;

//            result.adverseReactionList = dental.DentalAdverseReactionLines != null ? dental.DentalAdverseReactionLines.Select(a => new AdverseReaction
//            {
//                Description = a.Description,
//                Reaction = new Snomedct
//                {
//                    Code = a.ReactionCode.ToString(),
//                    Value = a.ReactionName
//                },
//                ReactionCategory = new Snomedct
//                {
//                    Code = a.ReactionCategoryCode.ToString(),
//                    Value = a.ReactionCategoryName
//                },
//                Severity = new DiagnosisSeverity
//                {
//                    SeverityCode = a.DiagnosisSeverityId.ToString(),
//                    SeverityName = a.DiagnosisSeverityName,
//                },
//                CausativeAgent = new Snomedct
//                {
//                    Code = a.CausativeAgentCode,
//                    Value = a.CausativeAgentName
//                },
//                CausativeAgentCategory = new Snomedct
//                {
//                    Code = a.CausativeAgentCategoryCode,
//                    Value = a.CausativeAgentCategoryName
//                }
//            }).ToArray() : null;

//            result.familyHistoryList = dental.DentalFamilyHisotryLines != null ? dental.DentalFamilyHisotryLines.Select(a => new FamilyHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                IsCauseofDeath = a.IsCauseofDeath,
//                RelatedPerson = new RelatedPerson
//                {
//                    Code = a.RelatedPersonCode,
//                    Name = a.RelatedPersonName
//                }
//            }).ToArray() : null;

//            result.medicalHistoryList = dental.DentalMedicalHistoryLines != null ? dental.DentalMedicalHistoryLines.Select(a => new MedicalHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                },
//                DateofOnset = a.DateOfOnsetPersian
//            }).ToArray() : null;

//            if (dental.DentalTreatmentLineDetails != null)
//            {
//                if (dental.DentalToothLines.ListHasRow())
//                {
//                    var treatmentList = new DentalTreatment[dental.DentalToothLines.Count];

//                    for (int i = 0; i < dental.DentalToothLines.Count; i++)
//                    {
//                        var currentTooth = dental.DentalToothLines[i];

//                        treatmentList[i] = new DentalTreatment();

//                        var tooth = new Tooth()
//                        {
//                            IsMissing = currentTooth.IsMissing,
//                            Part = new Snomedct() { Code = currentTooth.PartId.ToString(), Value = currentTooth.PartName },
//                            ToothName = new ToothName() { Code = currentTooth.ToothCode, Value = currentTooth.ToothName },
//                            Segment = new Segment() { Code = currentTooth.SegmentCode, Value = currentTooth.SegmentName },
//                        };

//                        treatmentList[i].Tooth = tooth;

//                        if (dental.DentalTreatmentLineDetails != null)
//                        {
//                            var dentalTreatmentList = dental.DentalTreatmentLineDetails.Where(t => t.HeaderId == currentTooth.HeaderId && t.RowNumber == currentTooth.RowNumber).ToList();
//                            treatmentList[i].Treatment = new ServiceDetails[dentalTreatmentList.Count];

//                            if (dentalTreatmentList.ListHasRow())
//                            {
//                                for (int d = 0; d < dentalTreatmentList.Count; d++)
//                                {
//                                    var currentTreatment = dentalTreatmentList[d];
//                                    var treatment = new ServiceDetails()
//                                    {
//                                        Service = new ServiceTreathment() { SeverityCode = currentTreatment.ServiceCode.ToString(), SeverityName = currentTreatment.ServiceCodeName },
//                                        ServiceType = new serviceType() { Id = currentTreatment.ServiceTypeId.ToString(), Name = currentTreatment.ServiceTypeName },
//                                        ServiceCount = new DoQuantity() { Magnitude = currentTreatment.ServiceCount, Unit = currentTreatment.ServiceCountUnitName }
//                                    };
//                                    treatmentList[i].Treatment[d] = treatment;
//                                }
//                            }
//                        }

//                        treatmentList[i].Comment = dental.DentalToothLines[i].Comment;

//                    }

//                    result.dentalTreatment = treatmentList;
//                }
//            }

//            if (dental.DentalToothLineDetails != null)
//            {
//                if (dental.DentalToothLines.ListHasRow())
//                {
//                    var diagnosisList = new DentalDiagnosis[dental.DentalToothLines.Count];

//                    for (int i = 0; i < dental.DentalToothLines.Count; i++)
//                    {
//                        var currentTooth = dental.DentalToothLines[i];

//                        diagnosisList[i] = new DentalDiagnosis();

//                        var tooth = new Tooth()
//                        {
//                            IsMissing = currentTooth.IsMissing,
//                            Part = new Snomedct() { Code = currentTooth.PartId.ToString(), Value = currentTooth.PartName },
//                            ToothName = new ToothName() { Code = currentTooth.ToothCode, Value = currentTooth.ToothName },
//                            Segment = new Segment() { Code = currentTooth.SegmentCode.ToString(), Value = currentTooth.SegmentName },
//                        };

//                        diagnosisList[i].Tooth = tooth;

//                        if (dental.DentalToothLineDetails != null)
//                        {
//                            var dentalDiagnosisList = dental.DentalToothLineDetails.Where(t => t.HeaderId == currentTooth.HeaderId && t.RowNumber == currentTooth.RowNumber).ToList();
//                            diagnosisList[i].Diagnosis = new Diagnosis[dentalDiagnosisList.Count];

//                            if (dentalDiagnosisList.ListHasRow())
//                            {
//                                for (int d = 0; d < dentalDiagnosisList.Count; d++)
//                                {
//                                    var currentDiagnosis = dentalDiagnosisList[d];

//                                    var diagnosis = new Diagnosis()
//                                    {
//                                        DiagnosisInfo = new Reason()
//                                        {
//                                            Code = currentDiagnosis.DiagnosisReasonCode,
//                                            Value = currentDiagnosis.DiagnosisReasonName
//                                        },
//                                        Severity = new DiagnosisSeverity() { SeverityCode = currentDiagnosis.ServerityId.ToString(), SeverityName = currentDiagnosis.SeverityName },
//                                        Status = new DiagnosisStatus() { StatusCode = currentDiagnosis.StatusId.ToString(), StatusName = currentDiagnosis.DiagnosisStatusName },
//                                        DiagnosisDate = currentDiagnosis.CreateDatePersian,
//                                        DiagnosisTime = currentDiagnosis.CreateTime,
//                                        Comment = currentDiagnosis.Comment
//                                    };
//                                    diagnosisList[i].Diagnosis[d] = diagnosis;
//                                }
//                            }
//                        }
//                        diagnosisList[i].Comment = dental.DentalToothLines[i].Comment;

//                    }

//                    result.dentalDiagnosis = diagnosisList;
//                }
//            }

//            var insuranceList = new List<BillInsurance>();
//            var billInsurances = new[]
//                      {
//                    new BillInsurance {
//                        Insurer=new Insurer(){Id=dental.BasicInsurerCode.ToString(),Name=dental.BasicInsurerName },
//                        InsuranceNumber = dental.InsurNo,
//                        BasicInsuranceBoxId = dental.InsurerLineCode!=null?dental.InsurerLineCode.ToString():"",
//                        BasicInsuranceBoxName = dental.InsurerLineName,
//                        BasicInsurerHID = new HID()
//                        {
//                            AssignerCode = dental.BasicInsurerCode == "1" || dental.BasicInsurerCode == "2" ? dental.BasicInsurerCode : "3",
//                            Id=dental.AdmissionHID
//                        },
//                        BasicInsurerSerialNumber = dental.InsurPageNo!=0?dental.InsurPageNo.ToString():"",
//                        BasicInsuranceExpDate = dental.BasicInsurerExpirationDatePersian
//                    }
//            };

//            result.insurance = billInsurances;

//            result.diagnosisList = dental.AdmissionDiagnosisLines != null ? dental.AdmissionDiagnosisLines.Select(a => new Diagnosis
//            {
//                Comment = a.Comment,
//                DiagnosisDate = a.CreateDatePersian,
//                DiagnosisInfo = new Reason
//                {
//                    Code = a.DiagnosisReasonCode,
//                    Value = a.DiagnosisReasonName
//                },
//                DiagnosisTime = a.CreateTime,
//                Severity = new DiagnosisSeverity
//                {
//                    SeverityCode = a.ServerityId.ToString(),
//                    SeverityName = a.SeverityName
//                },
//                Status = new DiagnosisStatus
//                {
//                    StatusCode = a.StatusId.ToString(),
//                    StatusName = a.DiagnosisStatusName
//                }
//            }).ToArray() : null;
//            result.attender = new ProviderComp
//            {
//                FirstName = dental.AttenderFirstName,
//                LastName = dental.AttenderLastName,
//                FullName = dental.AttenderFullName,
//                MscTypeId = dental.AttenderMSCTypeId,
//                Id = dental.AttenderMSCId.ToString(),
//                Role = new AttenderRole() { Id = dental.AttenderRoleCode, Name = dental.AttenderRoleName },
//                Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(dental.AttenderSpecialtyId.ToString()) ? dental.AttenderSpecialtyId.ToString() : "", Name = dental.AttenderSpecialtyName },
//            };

//            result.referring = new ReferringComp
//            {
//                FirstName = dental.AttenderFirstName,
//                LastName = dental.AttenderLastName,
//                FullName = dental.AttenderFullName,
//                MscTypeId = dental.AttenderMSCTypeId,
//                Id = dental.AttenderMSCId.ToString(),
//                Role = new ReferringRole() { Id = "1.3", Name = "پزشک ارجاع دهنده" },
//                Specialty = new ReferringSpecialty() { Id = !string.IsNullOrEmpty(dental.AttenderSpecialtyId.ToString()) ? dental.AttenderSpecialtyId.ToString() : "", Name = dental.AttenderSpecialtyName },
//            };

//            return result;
//        }

//    }
//    public class BindingDeathCertificateModel_WCF
//    {
//        private readonly ICompanyRepository _companyRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly IDeathCertificateRepository _deathCertificateRepository;
//        private readonly IAdmissionsRepository _admissionsRepository;
//        public BindingDeathCertificateModel_WCF(ICompanyRepository companyRepository,
//                                ISetupRepository setupRepository,
//                                IDeathCertificateRepository deathCertificateRepository,
//                                IAdmissionsRepository admissionsRepository)
//        {
//            _companyRepository = companyRepository;
//            _setupRepository = setupRepository;
//            _deathCertificateRepository = deathCertificateRepository;
//            _admissionsRepository = admissionsRepository;
//        }

//        public async Task<SaveDeathCertificateRecord> SendDeathCertificateBinding(int deathId)
//        {
//            var result = new SaveDeathCertificateRecord();
//            var death = await _deathCertificateRepository.GetDeathCertificate(deathId);
//            var companyInfo = await _companyRepository.GetCompanyInfo();
//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);
//            var systemId = await _setupRepository.GetCisWcfSystemId();
//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,
//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };
//            var patient = new Patient
//            {

//                NationalCode = death.NationalId,
//                FirstName = death.FirstName,
//                LastName = death.LastName,
//                //MobileNumber = death.PatientMobileNo,
//                //FullAddress = death.PatientAddress,
//                GenderId = death.GenderId.ToString(),
//                BirthDate = death.BirthDatePersian
//                //NationalityId = death.PatientNationalityId
//            };

//            var developer = new Developer
//            {
//                SystemId = systemId
//            };


//            result.organization = organization;
//            result.compositionUID = death.CompositionUID;
//            result.patient = patient;
//            result.patientUID = death.PersonUID;
//            result.developer = developer;
//            //result.admission = admission;

//            result.deathCauseList = death.DeathCauseLines != null ? death.DeathCauseLines.Select(a => new DeathCause
//            {
//                CauseInfo = new FindingType
//                {
//                    Code = a.CauseCode,
//                    Name = a.CauseName
//                },
//                Duration2Death = new DoQuantity
//                {
//                    Magnitude = a.DurationDeath,
//                    Unit = a.DurationDeathUnitName
//                },
//                Status = new DeathCauseStatus
//                {
//                    Code = a.StatusId.ToString(),
//                    Name = a.DeathCauseStatusName
//                }
//            }).ToArray() : null;


//            result.relatedConditionList = death.DeathMedicalHistoryLines != null ? death.DeathMedicalHistoryLines.Select(a => new MedicalHistory
//            {
//                Condition = new Condition
//                {
//                    Code = a.ConditionCode,
//                    Name = a.ConditionName
//                },
//                Description = a.Description,
//                OnsetDurationToPresent = new DoQuantity
//                {
//                    Magnitude = a.OnsetDurationToPresent,
//                    Unit = a.OnsetDurationToPresentUnitName
//                },
//                DateofOnset = a.DateOfOnsetPersian
//            }).ToArray() : null;


//            if (death.DeathInfantDeliveryLines.ListHasRow())
//            {
//                var currentInfantDelivery = death.DeathInfantDeliveryLines[0];

//                var Mother = new Patient
//                {
//                    NationalCode = currentInfantDelivery.MotherNationalCode,
//                    FirstName = currentInfantDelivery.MotherFirstName,
//                    LastName = currentInfantDelivery.MotherLastName,
//                    MobileNumber = currentInfantDelivery.MotherMobileNumber,
//                    GenderId = 2.ToString(),
//                    BirthDate = currentInfantDelivery.MotherBirthDatePersian
//                };
//                result.mother = Mother;

//                var InfantDelivery = new InfantDelivery()
//                {
//                    DeliveryPriority = currentInfantDelivery.DeliveryPriority,
//                    DeliveryNumber = currentInfantDelivery.DeliveryNumber,
//                    InfantWeight = new DoQuantity() { Magnitude = currentInfantDelivery.InfantWeight, Unit = currentInfantDelivery.InfantWeightUnitName },
//                    DeliveryAgent = new DeliveryAgent() { Code = currentInfantDelivery.DeliveryAgentCode, Name = currentInfantDelivery.DeliveryAgentName },
//                    DeliveryLocation = new DeliveryLocation() { Code = currentInfantDelivery.DeliveryLocationId.ToString(), Name = currentInfantDelivery.DeathLocationName },
//                };
//                result.infantDeliveryInfo = InfantDelivery;
//            }


//            result.issueDate = death.IssueDatePersian;
//            result.householdHeadNationalCode = death.HouseholdHeadNationalCode;
//            result.serialNumber = death.SerialNumber;
//            result.comment = death.Comment;
//            result.deathDate = death.DeathDateTimePersian;
//            result.deathTime = death.DeathTimePersian;
//            result.deathLocation = new DeathLocation() { Code = death.DeathLocationId, Name = death.DeathLocationName };
//            result.sourceOfNotification = new SourceOfNotification() { Code = death.SourceOfNotificationId.ToString(), Name = death.SourceofDeathNotificationName };

//            result.burialAttesterDetails = new ProviderComp
//            {
//                FirstName = death.BurialAttesterFirstName,
//                LastName = death.BurialAttesterLastName,
//                FullName = death.BurialAttesterFullName,
//                MscTypeId = death.BurialAttesterMSCTypeId,
//                Id = death.BurialAttesterMSCId.ToString(),
//                //Role = new AttenderRole() { Id = death.BurialAttesterRoleCode, Name = death.BurialAttesterRoleName },
//                //  Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(death.BurialAttesterSpecialtyId.ToString()) ? death.BurialAttesterSpecialtyId.ToString() : "", Name = death.BurialAttesterSpecialtyName },
//            };

//            result.individualRegister = new ProviderComp
//            {
//                FirstName = death.BurialAttesterFirstName,
//                LastName = death.BurialAttesterLastName,
//                FullName = death.BurialAttesterFullName,
//                MscTypeId = death.BurialAttesterMSCTypeId,
//                Id = death.BurialAttesterMSCId.ToString(),
//                //Role = new AttenderRole() { Id = death.BurialAttesterRoleCode, Name = death.BurialAttesterRoleName },
//                //Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(death.BurialAttesterSpecialtyId.ToString()) ? death.BurialAttesterSpecialtyId.ToString() : "", Name = death.BurialAttesterSpecialtyName },
//            };

//            return result;
//        }

//    }
//}

