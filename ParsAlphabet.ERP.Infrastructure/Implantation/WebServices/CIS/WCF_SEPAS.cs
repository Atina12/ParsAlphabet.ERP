//using CIS.Repositories;
//using CIS.Repositories.Interfaces;
//using CIS.ViewModels.Admission.Admission;
//using CIS.ViewModels.MC.AdmissionWebService;
//using ParsAlphabet.WebService.Api.Model.CIS;
//using ServiceStack;
//using System.Security.Claims;
//using static CIS.ViewModels.WebServices.WebServiceViewModel;
////using CIS.ViewModels.MC.DeathCertificate;

//namespace CIS.WebServices.CIS
//{
//    public class WCF_SEPAS
//    {
//        private readonly IErrorLogRepository _errorLogRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly IHttpContextAccessor _accessor;
//        private readonly IConfiguration _configuration;
//        public string EndPointUrl = WCFWebService.WCFBaseUrl + WCFWebService.WCFServiceName;

//        public WCF_SEPAS(IErrorLogRepository errorLogRepository, IHttpContextAccessor accessor, IConfiguration configuration, ISetupRepository setupRepository)
//        {
//            _errorLogRepository = errorLogRepository;
//            _setupRepository = setupRepository;
//            _accessor = accessor;
//            _configuration = configuration;

//            EndPointUrl = _setupRepository.GetCisWcfUrl().Result + WCFWebService.WCFServiceName;
//        }

//        public async Task<MyResultDataStatus<GetPatient_Result>> GetPersonByBirth(GetPersonByBirth birth)
//        {
//            var result = new MyResultDataStatus<GetPatient_Result>()
//            {
//                Data = new GetPatient_Result()
//            };
//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetPersonByBirthAsync(nationalCode: birth.NationalCode, birthYear: birth.BirthYear);

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
//                //else if (result.Data.ErrorMessage.IndexOf("Error at Service. Error at GetPersonByBirth. Error at GetPersonByBirth_MC_T2. Service in reload mode.") > -1)
//                //{
//                //    result.Successfull = false;
//                //    result.Status = -105;
//                //    result.StatusMessage = "سرویس سپاس در حال بارگذاری مجدد";
//                //}
//                //else if (result.Data.ErrorMessage.IndexOf("Error at Service. Error at GetHID. Client found response content type of 'text/html; charset=utf-8', but expected 'text/xml'. The request failed with the error message:") > -1)
//                //{
//                //    result.Successfull = false;
//                //    result.Status = -103;
//                //    result.StatusMessage = "خطا در ارتباط با سپاس";
//                //}
//                //else
//                //{
//                //    result.Successfull = false;
//                //    result.Status = -101;
//                //    result.StatusMessage = "عملیات با خطا مواجه شد";
//                //}
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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetPersonByBirth");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetHealthCareProviderInfo_Result>> GetHealthCareProviderInfo(Provider provider)
//        {
//            var result = new MyResultDataStatus<GetHealthCareProviderInfo_Result>()
//            {
//                Data = new GetHealthCareProviderInfo_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetHealthCareProviderInfoAsync(provider);

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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetHealthCareProviderInfo");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<CallupInsurance_Result>> CallUpInsurance(GetCallUpInsurance model)
//        {
//            var result = new MyResultDataStatus<CallupInsurance_Result>()
//            {
//                Data = new CallupInsurance_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new IServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.CallupInsuranceAsync(model.Person, model.Provider);

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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/CallUpInsurance");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<VerifyHIDStatus_Result>> VerifyHIDStatus(HID hid, Person person)
//        {
//            var result = new MyResultDataStatus<VerifyHIDStatus_Result>();

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(5),
//                    OpenTimeout = TimeSpan.FromSeconds(5),
//                    ReceiveTimeout = TimeSpan.FromSeconds(5),
//                    CloseTimeout = TimeSpan.FromSeconds(5)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.VerifyHIDStatusAsync(hid, person);

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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/VerifyHIDStatus");
//            }

//            //ws.Abort();
//            return result;
//        }

//        public async Task<MyResultDataStatus<GetHID_Result>> GetHID(ViewModels.WebServices.WebServiceViewModel.GetHIDOnline getHID)
//        {
//            var result = new MyResultDataStatus<GetHID_Result>()
//            {
//                Data = new GetHID_Result()
//            };

//            try
//            {
//                //result.Status = -104;// result.Data.ErrorStatus;
//                //result.StatusMessage = result.Data.ErrorMessage;
//                //result.Successfull = false;
//                //return result;

//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                //var customBinding = new BasicHttpBinding()
//                //{
//                //    SendTimeout = TimeSpan.FromSeconds(5),
//                //    OpenTimeout = TimeSpan.FromSeconds(5),
//                //    ReceiveTimeout = TimeSpan.FromSeconds(5),
//                //    CloseTimeout = TimeSpan.FromSeconds(5)
//                //};

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromMilliseconds(500),
//                    OpenTimeout = TimeSpan.FromMilliseconds(500),
//                    ReceiveTimeout = TimeSpan.FromMilliseconds(500),
//                    CloseTimeout = TimeSpan.FromMilliseconds(500)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetHIDAsync(getHID.Person, getHID.Provider, getHID.Insurer, getHID.Referring, getHID.InqueryId);

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
//                    result.StatusMessage = "دریافت شناسه شباد آفلاین";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }
//                result.Successfull = false;

//              //  await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetHID");

//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetHID_Result>> GetHIDUrgent(GetHIDUrgent getHID)
//        {
//            var result = new MyResultDataStatus<GetHID_Result>()
//            {
//                Data = new GetHID_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(5),
//                    OpenTimeout = TimeSpan.FromSeconds(5),
//                    ReceiveTimeout = TimeSpan.FromSeconds(5),
//                    CloseTimeout = TimeSpan.FromSeconds(5)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetHIDurgentAsync(getHID.Person, getHID.Provider, getHID.Insurer, getHID.Referring);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Successfull = false;
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    result.StatusMessage = "عملیات با خطا مواجه شد";
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
//                    result.StatusMessage = "دریافت شناسه شباد آفلاین";
//                    result.Status = -103;
//                }
//                else
//                {
//                    result.StatusMessage = "خطا در ارتباط با وب سرویس";
//                    result.Status = -102;
//                }
//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetHIDUrgent");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetBatchHID_Result>> GenerateBatchHID(Insurer insurer, int count)
//        {
//            var result = new MyResultDataStatus<GetBatchHID_Result>()
//            {
//                Data = new GetBatchHID_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GenerateBatchHIDAsync(insurer, count);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Successfull = false;
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
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

//                result.Successfull = false;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GenerateBatchHID");
//                result.Status = -102;
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<UpdateHID_Result>> UpdateHID(UpdateHID model)
//        {
//            var result = new MyResultDataStatus<UpdateHID_Result>()
//            {
//                Data = new UpdateHID_Result()
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

//                //var customBinding = new BasicHttpBinding()
//                //{
//                //    SendTimeout = TimeSpan.FromMilliseconds(500),
//                //    OpenTimeout = TimeSpan.FromMilliseconds(500),
//                //    ReceiveTimeout = TimeSpan.FromMilliseconds(500),
//                //    CloseTimeout = TimeSpan.FromMilliseconds(500)
//                //};

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.UpdateHIDAsync(model.Hid, model.Person, model.Provider, model.Insurer, model.Referring);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    //if (result.Data.ErrorMessage.Contains("این شناسه قبلا ابطال شده است"))
//                    //{
//                    //    result.Status = -104;
//                    //    result.StatusMessage = "این شناسه قبلا ابطال شده است";
//                    //}
//                    //else if (result.Data.ErrorMessage.Contains("بروز رسانی تنها برای شناسه های رزرو قابل انجام می باشد."))
//                    //{
//                    //    result.Status = -105;
//                    //    result.StatusMessage = "بروز رسانی تنها برای شناسه های رزرو قابل انجام می باشد";
//                    //}

//                    //else
//                    //{
//                    //    result.Status = -101;
//                    //    result.StatusMessage = "عملیات با خطا مواجه شد";
//                    //}

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
//                    result.Status = -103;
//                else
//                    result.Status = -102;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/UpdateHID");
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<EliminateHID_Result>> EliminateHID(EliminateHID model)
//        {
//            var result = new MyResultDataStatus<EliminateHID_Result>()
//            {
//                Data = new EliminateHID_Result()
//            };

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);


//                result.Data = await serviceClient.EliminateHIDAsync(model.Hid, model.Person, model.ReasonValue, model.Description);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    //result=1
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
//                    result.Status = -103;
//                else
//                    result.Status = -102;

//                result.Successfull = false;
//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/EliminateHID");
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<SavePatientBill_Result>> SavePatientBill(SavePatientBill model)
//        {
//            var result = new MyResultDataStatus<SavePatientBill_Result>();

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(40),
//                    OpenTimeout = TimeSpan.FromSeconds(40),
//                    ReceiveTimeout = TimeSpan.FromSeconds(40),
//                    CloseTimeout = TimeSpan.FromSeconds(40)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.SavePatientBillAsync(model.Developer, model.Organization, model.Admission, model.Patient, model.ProviderComp, model.ReferringComp, model.BillInsurances, model.Services, model.Diagnoses);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Successfull = false;
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
//                    //result.Status = -101;
//                    //result.StatusMessage = "عملیات با خطا م============================================واجه شد";
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
//                    result.Status = -103;
//                else
//                    result.Status = -102;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/SavePatientBill");
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetInsurerReimbursement_Result>> GetInsurerReimbursement(HID model)
//        {
//            var result = new MyResultDataStatus<GetInsurerReimbursement_Result>();

//            try
//            {

//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(40),
//                    OpenTimeout = TimeSpan.FromSeconds(40),
//                    ReceiveTimeout = TimeSpan.FromSeconds(40),
//                    CloseTimeout = TimeSpan.FromSeconds(40)
//                };

//                customBinding.MaxReceivedMessageSize = 2147483647;
//                customBinding.MaxBufferSize = 2147483647;

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetInsurerReimbursementAsync(model);

//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Successfull = false;
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
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
//                    result.Status = -103;
//                else
//                    result.Status = -102;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetInsurerReimbursement");
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<GetActiveInsurerReimbursement_Result>> GetActiveInsurerReimbursementHIDByNationalCode(string nationalCode)
//        {
//            var result = new MyResultDataStatus<GetActiveInsurerReimbursement_Result>();

//            try
//            {
//                var endPointAddress = new EndpointAddress(EndPointUrl);

//                var customBinding = new BasicHttpBinding()
//                {
//                    SendTimeout = TimeSpan.FromSeconds(25),
//                    OpenTimeout = TimeSpan.FromSeconds(25),
//                    ReceiveTimeout = TimeSpan.FromSeconds(25),
//                    CloseTimeout = TimeSpan.FromSeconds(25)
//                };

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.GetActiveInsurerReimbursementHIDByNationalCodeAsync(nationalCode);

//                if (result.Data.HIDList != null && result.Data.HIDList.Length == 0)
//                {
//                    result.Successfull = false;
//                    result.Status = -100;
//                    result.StatusMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد";

//                }
//                else if (string.IsNullOrEmpty(result.Data.ErrorMessage) && result.Data.HIDList != null && result.Data.HIDList.Length > 0)
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    result.Successfull = false;
//                    result.Status = result.Data.ErrorStatus;
//                    result.StatusMessage = result.Data.ErrorMessage;
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
//                    result.Status = -103;
//                else
//                    result.Status = -102;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/GetActiveInsurerReimbursementHIDByNationalCode");
//                result.StatusMessage = "خطا در ارتباط با وب سرویس";
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<SaveMedicationPrescriptions_Result>> SaveMedicationPrescriptions(Developer developer,
//                                             Organization organization, Admission admission, Patient patient, ProviderComp attender,
//                                             ReferringComp referring, BillInsurance insurance, Prescription prescription, HID hid, List<Diagnosis> diagnosis, List<Drug> drugList)
//        {
//            var result = new MyResultDataStatus<SaveMedicationPrescriptions_Result>()
//            {
//                Data = new SaveMedicationPrescriptions_Result()
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

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.SaveMedicationPrescriptionsAsync(developer, organization, admission, patient, attender, referring
//                                                                                      , insurance, prescription, diagnosis.ToArray(), hid, drugList.ToArray());
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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/SaveMedicationPrescriptions");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<SaveMedicalImagingPrescriptions_Result>> SaveMedicalImagingPrescriptions(Developer developer,
//                                             Organization organization, Admission admission, Patient patient, ProviderComp attender,
//                                             ReferringComp referring, BillInsurance insurance, Prescription prescription, HID hid, List<Diagnosis> diagnosis, List<Image> imageList)
//        {
//            var result = new MyResultDataStatus<SaveMedicalImagingPrescriptions_Result>()
//            {
//                Data = new SaveMedicalImagingPrescriptions_Result()
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

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.SaveMedicalImagingPrescriptionsAsync(developer, organization, admission, patient, attender, referring
//                                                                                      , insurance, prescription, diagnosis.ToArray(), hid, imageList.ToArray());
//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    //if (result.Data.ErrorMessage.IndexOf("Return Null") > -1)
//                    //{
//                    //    result.Status = -104;
//                    //    result.StatusMessage = "با توجه به تاریخ اعتبار ، امکان ارایه خدمت میسر نمی باشد";
//                    //}
//                    //else
//                    //{
//                    //    result.Status = -101;
//                    //    result.StatusMessage = "عملیات با خطا مواجه شد";
//                    //}

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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/SaveMedicalImagingPrescriptions");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<SaveLaboratoryPrescriptions_Result>> SaveLaboratoryPrescriptions(Developer developer,
//                                             Organization organization, Admission admission, Patient patient, ProviderComp attender,
//                                             ReferringComp referring, BillInsurance insurance, PrescriptionLab prescription, HID hid, List<Diagnosis> diagnosis, List<Lab> labList)
//        {
//            var result = new MyResultDataStatus<SaveLaboratoryPrescriptions_Result>()
//            {
//                Data = new SaveLaboratoryPrescriptions_Result()
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

//                var serviceClient = new MyServiceClient(customBinding, endPointAddress);

//                result.Data = await serviceClient.SaveLaboratoryPrescriptionsAsync(developer, organization, admission, patient, attender, referring
//                                                                                      , insurance, prescription, diagnosis.ToArray(), hid, labList.ToArray());
//                if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//                {
//                    result.Successfull = true;
//                    result.Status = 100;
//                    result.StatusMessage = "عملیات با موفقیت انجام شد";
//                }
//                else
//                {
//                    //if (result.Data.ErrorMessage.IndexOf("Return Null") > -1)
//                    //{
//                    //    result.Status = -104;
//                    //    result.StatusMessage = "با توجه به تاریخ اعتبار ، امکان ارایه خدمت میسر نمی باشد";
//                    //}
//                    //else
//                    //{
//                    //    result.Status = -101;
//                    //    result.StatusMessage = "عملیات با خطا مواجه شد";
//                    //}

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

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/SaveLaboratoryPrescriptions");
//            }

//            return result;
//        }

//        public async Task<MyResultDataStatus<ResultSendPrescription>> SaveAllPrescription(SendPrescription model, byte prescriptionType)
//        {
//            var result = new MyResultDataStatus<ResultSendPrescription>()
//            {
//                Data = new ResultSendPrescription(),
//                DateTime = DateTime.Now
//            };


//            var resultMedication = new MyResultDataStatus<SaveMedicationPrescriptions_Result>();
//            var resultImaging = new MyResultDataStatus<SaveMedicalImagingPrescriptions_Result>();
//            var resultLaboratory = new MyResultDataStatus<SaveLaboratoryPrescriptions_Result>();

//            try
//            {
//                if (prescriptionType == 1)
//                {
//                    resultMedication = await SaveMedicationPrescriptions(model.Developer, model.Organization, model.Admission, model.Patient, model.ProviderComp, model.ReferringComp, model.BillInsurance, model.Prescription, model.HID, model.Diagnoses, model.Drugs);
//                    result.Data = new ResultSendPrescription()
//                    {
//                        CompositionUID = resultMedication.Data.CompositionUID,
//                        MessageUID = resultMedication.Data.MessageUID,
//                        PatientUID = resultMedication.Data.PatientUID,
//                        ErrorMessage = resultMedication.Data.ErrorMessage,
//                        ErrorStatus = resultMedication.Data.ErrorStatus
//                    };
//                }
//                else if (prescriptionType == 2)
//                {
//                    resultLaboratory = await SaveLaboratoryPrescriptions(model.Developer, model.Organization, model.Admission, model.Patient, model.ProviderComp, model.ReferringComp, model.BillInsurance, model.PrescriptionLab, model.HID, model.Diagnoses, model.Labs);
//                    result.Data = new ResultSendPrescription()
//                    {
//                        CompositionUID = resultLaboratory.Data.CompositionUID,
//                        MessageUID = resultLaboratory.Data.MessageUID,
//                        PatientUID = resultLaboratory.Data.PatientUID,
//                        ErrorMessage = resultLaboratory.Data.ErrorMessage,
//                        ErrorStatus = resultLaboratory.Data.ErrorStatus
//                    };
//                }
//                else
//                {
//                    resultImaging = await SaveMedicalImagingPrescriptions(model.Developer, model.Organization, model.Admission, model.Patient, model.ProviderComp, model.ReferringComp, model.BillInsurance, model.Prescription, model.HID, model.Diagnoses, model.Images);
//                    result.Data = new ResultSendPrescription()
//                    {
//                        CompositionUID = resultImaging.Data.CompositionUID,
//                        MessageUID = resultImaging.Data.MessageUID,
//                        PatientUID = resultImaging.Data.PatientUID,
//                        ErrorMessage = resultImaging.Data.ErrorMessage,
//                        ErrorStatus = resultImaging.Data.ErrorStatus
//                    };
//                }
//            }
//            catch (Exception ex)
//            {
//                result.Status = -100;
//                result.StatusMessage = "شرح خطا به جدول لاگ ارسال شد";
//                result.Successfull = false;

//                MyClaim.Init(_accessor);

//                var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
//                int userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

//                string messageError;

//                if (bool.Parse(errorLogIsComplete))
//                    messageError = ex.ToString();
//                else
//                    messageError = ex.Message;

//                await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebServiceSEPAS/SaveAllPrescription");
//            }

//            if (string.IsNullOrEmpty(result.Data.ErrorMessage))
//            {
//                result.StatusMessage = "عملیات با موفقیت انجام شد";
//                result.Status = 100;
//                result.Successfull = true;
//            }
//            else
//            {
//                result.StatusMessage = result.Data.ErrorMessage;
//                result.Status = result.Data.ErrorStatus;
//                result.Successfull = false;
//            }

//            return result;
//        }


//    }

//    public class BindingModelPrescription_WCF
//    {
//        private readonly ICompanyRepository _companyRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly InsuranceRepository _insuranceRepository;
//        private readonly AdmissionServiceRepository _admissionRepository;
//        private readonly IAdmissionsRepository _admissionsRepository;

//        private readonly IPrescriptionRepository _prescriptionRepository;

//        public BindingModelPrescription_WCF(
//            IPrescriptionRepository prescriptionRepository, 
//            ICompanyRepository companyRepository, 
//            ISetupRepository setupRepository, 
//            InsuranceRepository insuranceRepository,
//            AdmissionServiceRepository admissionRepository, 
//            IAdmissionsRepository admissionsRepository)
//        {
//            _companyRepository = companyRepository;
//            _setupRepository = setupRepository;
//            _insuranceRepository = insuranceRepository;
//            _admissionRepository = admissionRepository;
//            _admissionsRepository = admissionsRepository;
//            _prescriptionRepository = prescriptionRepository;
//        }


//        public async Task<SendPrescription> BindPrescription(GetPrescriptionByAdmissionId model, int userid)
//        {
//            var sendPrescription = new SendPrescription();

//            var companyInfo = await _companyRepository.GetCompanyInfo();

//            var systemId = await _setupRepository.GetCisWcfSystemId();

//            var admissionSearch = new GetAdmissionSearch()
//            {
//                AttenderId = 0,
//                CompanyId = companyInfo.Id,
//                Id = model.AdmissionId
//            };

//            var admissionInfo = await _admissionRepository.GetAdmission(admissionSearch);

//            var developer = new Developer
//            {
//                SystemId = systemId
//            };

//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);

//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,
//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };

//            var admission = new Admission()
//            {
//                AdmissionId = admissionInfo.AdmissionId,
//                AdmissionDate = admissionInfo.AdmissionDate,
//                AdmissionTime = admissionInfo.AdmissionTime,
//                ReasonEncounter = admissionInfo.ReasonForEncounterId != 0 ? new ReasonEncounter() { Code = admissionInfo.ReasonForEncounterCode, Value = admissionInfo.ReasonForEncounterName } : null,
//                HID = model.PrescriptionHID
//            };

//            var patient = new Patient()
//            {
//                NationalCode = admissionInfo.PatientNationalCode,
//                FirstName = admissionInfo.PatientFirstName,
//                LastName = admissionInfo.PatientLastName,
//                GenderId = admissionInfo.PatientGenderId,
//                BirthDate = admissionInfo.PatientBirthDate,
//                NationalityId = admissionInfo.PatientNationalityId,
//                MobileNumber = admissionInfo.PatientMobileNo,
//                FullAddress = admissionInfo.PatientAddress,
//                EducationLevel = new EducationLevel() { Code = admissionInfo.PatientEducationLevelId.ToString(), Value = admissionInfo.PatientEducationLevelName },
//                Father_FirstName = admissionInfo.PatientFatherFirstName,
//                HomeTel = admissionInfo.PatientHomeTel,
//                IDCardNumber = admissionInfo.PatientIdCardNumber,
//                JobTitle = admissionInfo.PatientJobTitle,
//                MaritalStatusId = admissionInfo.PatientMaritalStatusId,
//                PostalCode = admissionInfo.PatientPostalCode
//            };

//            var attender = new ProviderComp()
//            {
//                Id = admissionInfo.AttenderMSCId,
//                MscTypeId = admissionInfo.AttenderMSCTypeId,
//                FirstName = admissionInfo.AttenderFirstName,
//                LastName = admissionInfo.AttenderLastName,
//                Role = new AttenderRole() { Id = admissionInfo.AttenderRoleCode, Name = admissionInfo.AttenderRoleName },
//                Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(admissionInfo.AttenderSpecialtyId.ToString()) ? admissionInfo.AttenderSpecialtyId.ToString() : "", Name = admissionInfo.AttenderSpecialtyName },
//            };

//            var referring = new ReferringComp()
//            {
//                Id = admissionInfo.ReferringMSCId,
//                MscTypeId = admissionInfo.ReferringMSCTypeId,
//                FirstName = admissionInfo.ReferringFirstName,
//                LastName = admissionInfo.ReferringLastName,
//            };

//            var insurerCode = await _insuranceRepository.GetInsurerCodeById(admissionInfo.BasicInsurerId, companyInfo.Id);

//            var insurance = new BillInsurance()
//            {
//                Insurer = new Insurer() { Id = insurerCode, Name = admissionInfo.BasicInsurerName },
//                InsuranceNumber = admissionInfo.BasicInsurerNo,
//                BasicInsuranceBoxId = admissionInfo.BasicInsurerCode,
//                BasicInsuranceBoxName = admissionInfo.BasicInsurerLineName,
//                BasicInsurerHID = new HID() { AssignerCode = insurerCode == "1" || insurerCode == "2" ? insurerCode : "3", Id = admissionInfo.AdmissionHID },
//                BasicInsuranceExpDate = admissionInfo.BasicInsurerExpirationDatePersian,
//                BasicInsurerSerialNumber = string.IsNullOrEmpty(admissionInfo.InsurPageNo.ToString()) ? "" : admissionInfo.InsurPageNo.ToString()
//            };

//            var prescription = new Prescription();
//            var prescriptionLab = new PrescriptionLab();

//            if (model.PrescriptionTypeId == 1 || model.PrescriptionTypeId == 3)
//            {
//                prescription = new Prescription()
//                {
//                    IssueDate = model.CreateDatePersian,
//                    IssueTime = model.CreateTime,
//                    ExpiryDate = model.ExpiryDatePersian,
//                    CompositionUID = model.CompositionUID,
//                    PatientUID = model.PatientUID,
//                    Repeats = model.RepeatCount,
//                    Note = model.Note,
//                    Priority = model.PriorityId != 0 ? new Snomedct() { Code = model.PriorityCode, Value = model.PriorityName } : null
//                };
//            }
//            else
//            {
//                var speciment = new Specimen();

//                speciment.AdequacyForTesting = model.AdequacyForTestingId != 0 ? new AdequacyForTesting() { Code = model.AdequacyForTestingId.ToString(), Name = model.AdequacyForTestingName } : null;
//                speciment.SpecimenTissueType = model.SpecimenTissueTypeId != 0 ? new Snomedct() { Code = model.SpecimenTissueTypeCode, Value = model.SpecimenTissueTypeName } : null;
//                speciment.CollectionProcedure = model.CollectionProcedureId != 0 ? new Snomedct() { Code = model.CollectionProcedureCode, Value = model.CollectionProcedureName } : null;
//                speciment.DateofCollection = model.CollectionDatePersian;
//                speciment.TimeofCollection = model.CollectionTime;
//                speciment.SpecimenIdentifier = model.SpecimenIdentifier;


//                prescriptionLab = new PrescriptionLab()
//                {
//                    IssueDate = model.CreateDatePersian,
//                    IssueTime = model.CreateTime,
//                    ExpiryDate = model.ExpiryDatePersian,
//                    CompositionUID = model.CompositionUID,
//                    PatientUID = model.PatientUID,
//                    Repeats = model.RepeatCount,
//                    Note = model.Note,
//                    Priority = model.PriorityId != 0 ? new Snomedct() { Code = model.PriorityCode, Value = model.PriorityName } : null,
//                    Intent = model.IntentId != 0 ? new Snomedct() { Code = model.IntentCode, Value = model.IntentName } : null,
//                    Specimen = new Specimen()
//                    {
//                        AdequacyForTesting = speciment.AdequacyForTesting,
//                        CollectionProcedure = speciment.CollectionProcedure,
//                        SpecimenIdentifier = speciment.SpecimenIdentifier,
//                        DateofCollection = speciment.DateofCollection,
//                        TimeofCollection = speciment.TimeofCollection,
//                        SpecimenTissueType = speciment.SpecimenTissueType
//                    }
//                };
//            }

//            var hid = new HID()
//            {
//                AssignerCode = insurerCode == "1" || insurerCode == "2" ? insurerCode : "3",
//                Id = model.PrescriptionHID
//            };

//            var diagnosesList = new List<Diagnosis>();

//            if (model.PrescriptionDiagnosisLines != null)
//            {
//                if (model.PrescriptionDiagnosisLines.Count > 0)
//                {
//                    for (int d = 0; d < model.PrescriptionDiagnosisLines.Count; d++)
//                    {
//                        var currentDiagnosis = model.PrescriptionDiagnosisLines[d];

//                        var diagnoisis = new Diagnosis()
//                        {
//                            DiagnosisDate = currentDiagnosis.CreateDatePersian,
//                            DiagnosisTime = currentDiagnosis.CreateTime,
//                            Comment = currentDiagnosis.Comment,
//                            DiagnosisInfo = new Reason() { Code = currentDiagnosis.DiagnosisReasonId.ToString(), Value = currentDiagnosis.DiagnosisReasonName },
//                            Severity = new DiagnosisSeverity() { SeverityCode = currentDiagnosis.ServerityId.ToString(), SeverityName = currentDiagnosis.ServerityName },
//                            Status = new DiagnosisStatus() { StatusCode = currentDiagnosis.StatusId.ToString(), StatusName = currentDiagnosis.StatusName }
//                        };

//                        diagnosesList.Add(diagnoisis);
//                    }
//                }
//            }

//            var drugList = new List<Drug>();
//            var drug = new Drug();

//            var ingredientList = new List<Ingredient>();
//            var ingredient = new Ingredient();

//            var imageList = new List<Image>();
//            var image = new Image();

//            var labList = new List<Lab>();
//            var lab = new Lab();

//            if (model.PrescriptionTypeId == 1)
//            {
//                if (model.PrescriptionDrugLines != null)
//                {
//                    if (model.PrescriptionDrugLines.Count > 0)
//                    {
//                        for (int i = 0; i < model.PrescriptionDrugLines.Count; i++)
//                        {
//                            drug = new Drug();

//                            var currentDrug = model.PrescriptionDrugLines[i];

//                            drug.Description = currentDrug.Description;
//                            drug.PatientInstruction = currentDrug.Description;

//                            var drugProduct = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrERX", "Code", "Name", $"Id={currentDrug.ProductId}");

//                            if (drugProduct == null)
//                            {
//                                drug.ProductInfo = null;
//                            }
//                            else
//                            {
//                                drug.ProductInfo = new DrugProduct() { Code = drugProduct.Id, Value = drugProduct.Name };
//                            }

//                            var drugDosageUnitInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrUCUM", "Id", "Name", $"Id={currentDrug.DosageUnitId}");

//                            if (drugDosageUnitInfo == null)
//                            {
//                                drug.DosageInfo = null;
//                            }
//                            else
//                            {
//                                drug.DosageInfo = new DrugDosage() { Magnitude = currentDrug.Dosage, Unit = drugDosageUnitInfo.Name };
//                            }

//                            var frequencyInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentDrug.FrequencyId}");

//                            if (frequencyInfo == null)
//                            {
//                                drug.FrequencyInfo = null;
//                            }
//                            else
//                            {
//                                drug.FrequencyInfo = new Snomedct() { Code = frequencyInfo.Id, Value = frequencyInfo.Name };
//                            }

//                            var routeInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"IsRoute=1 AND Id={currentDrug.RouteId}");

//                            if (routeInfo == null)
//                            {
//                                drug.RouteInfo = null;
//                            }
//                            else
//                            {
//                                drug.RouteInfo = new Snomedct() { Code = routeInfo.Id, Value = routeInfo.Name };
//                            }


//                            drug.TotalNumber = currentDrug.TotalNumber;
//                            drug.TotalNumberUnit = currentDrug.TotalNumberUnitName;
//                            var reasonInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrICD", "Code", "Value", $"Id={currentDrug.ReasonId}");

//                            if (reasonInfo == null)
//                            {
//                                drug.ReasonInfo = null;
//                            }
//                            else
//                            {
//                                drug.ReasonInfo = new Reason() { Code = reasonInfo.Id, Value = reasonInfo.Name };
//                            }

//                            var asNeedInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentDrug.AsNeedId}");

//                            if (asNeedInfo == null)
//                            {
//                                drug.AsNeededInfo = null;
//                            }
//                            else
//                                drug.AsNeededInfo = new Snomedct() { Code = asNeedInfo.Id, Value = asNeedInfo.Name };


//                            var drugBodySiteInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentDrug.BodySiteId} AND IsBodySite=1");

//                            if (drugBodySiteInfo == null)
//                                drug.BodySiteInfo = null;
//                            else
//                                drug.BodySiteInfo = new Snomedct() { Code = drugBodySiteInfo.Id, Value = drugBodySiteInfo.Name };

//                            var drugPriorityInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentDrug.PriorityId} AND IsPriority=1");

//                            if (drugPriorityInfo == null)
//                                drug.PriorityInfo = null;
//                            else
//                                drug.PriorityInfo = new Snomedct() { Code = drugPriorityInfo.Id, Value = drugPriorityInfo.Name };

//                            ingredientList = new List<Ingredient>();

//                            if (model.PrescriptionDrugLineDetails != null)
//                            {
//                                if (model.PrescriptionDrugLineDetails.Count > 0)
//                                {
//                                    for (int j = 0; j < model.PrescriptionDrugLineDetails.Count; j++)
//                                    {
//                                        ingredient = new Ingredient();

//                                        var detailRowNumber = j + 1;

//                                        var currentDrugDetail = model.PrescriptionDrugLineDetails.SingleOrDefault(p => p.RowNumber == currentDrug.RowNumber && p.DetailRowNumber == detailRowNumber);

//                                        if (currentDrugDetail != null)
//                                        {
//                                            var detailProductInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrERX", "Code", "Name", $"Id={currentDrugDetail.ProductId}");

//                                            if (detailProductInfo == null)
//                                                ingredient.DrugProduct = null;
//                                            else
//                                                ingredient.DrugProduct = new DrugProduct() { Code = detailProductInfo.Id, Value = detailProductInfo.Name };

//                                            var detailDosageUnitInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrUCUM", "Id", "Name", $"Id={currentDrugDetail.UnitId}");

//                                            if (detailDosageUnitInfo == null)
//                                                ingredient.DosageInfo = null;
//                                            else
//                                                ingredient.DosageInfo = new DrugDosage() { Magnitude = currentDrugDetail.Qty, Unit = detailDosageUnitInfo.Name };

//                                            ingredient.AmountMax = currentDrugDetail.QtyMax;

//                                            var detailDrugRole = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentDrugDetail.RoleId}");

//                                            if (detailDrugRole == null)
//                                                ingredient.RoleInfo = null;
//                                            else
//                                                ingredient.RoleInfo = new Snomedct() { Code = detailDrugRole.Id, Value = detailDrugRole.Name };

//                                            ingredientList.Add(ingredient);
//                                        }
//                                    }

//                                    drug.IngredientList = ingredientList.Count() > 0 ? ingredientList.ToArray() : null;
//                                }
//                                else
//                                    drug.IngredientList = null;
//                            }
//                            else
//                                drug.IngredientList = null;

//                            drugList.Add(drug);
//                        }
//                    }
//                }
//            }
//            else if (model.PrescriptionTypeId == 3)
//            {
//                if (model.PrescriptionImageLines != null)
//                {
//                    if (model.PrescriptionImageLines.Count > 0)
//                    {
//                        for (int m = 0; m < model.PrescriptionImageLines.Count; m++)
//                        {
//                            image = new Image();

//                            var currentImage = model.PrescriptionImageLines[m];

//                            var imageService = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrLNC", "Code", "Name", $"Id={currentImage.ServiceId}");

//                            if (imageService == null)
//                                image.ImageService = null;
//                            else
//                                image.ImageService = new ImageService() { ServiceCode = imageService.Id, ServiceName = imageService.Name };

//                            image.PatientInstruction = currentImage.PatientInstruction;
//                            image.Note = currentImage.Note;

//                            var imageBodySite = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentImage.BodySiteId}");
//                            var imageLaterality = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentImage.LateralityId}");
//                            image.AnatomicalLocationInfo = new AnatomicalLocation();
//                            if (imageBodySite == null)
//                                image.AnatomicalLocationInfo.BodySite = null;
//                            else
//                                image.AnatomicalLocationInfo.BodySite = new Snomedct() { Code = imageBodySite.Id, Value = imageBodySite.Name };

//                            if (imageLaterality == null)
//                                image.AnatomicalLocationInfo.Laterality = null;
//                            else
//                                image.AnatomicalLocationInfo.Laterality = new Snomedct() { Code = imageLaterality.Id, Value = imageLaterality.Name };

//                            var imageDetailList = new List<ImageService>();
//                            var imageDetail = new ImageService();

//                            if (model.PrescriptionImageLineDetails != null)
//                            {
//                                if (model.PrescriptionImageLineDetails.Count > 0)
//                                {
//                                    for (byte id = 0; id < model.PrescriptionImageLineDetails.Count; id++)
//                                    {
//                                        imageDetail = new ImageService();

//                                        var detailImageRowNumber = id + 1;

//                                        var currentImageDetail = model.PrescriptionImageLineDetails.SingleOrDefault(p => p.RowNumber == currentImage.RowNumber && p.DetailRowNumber == detailImageRowNumber);

//                                        if (currentImageDetail != null)
//                                        {
//                                            var imageDetailServiceId = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"IsImageServiceDetail=1 AND Id={currentImageDetail.ServiceId}");

//                                            if (imageDetailServiceId == null)
//                                            {
//                                                imageDetail = null;
//                                            }
//                                            else
//                                            {
//                                                imageDetail.ServiceCode = imageDetailServiceId.Id;
//                                                imageDetail.ServiceName = imageDetailServiceId.Name;
//                                            }

//                                            imageDetailList.Add(imageDetail);
//                                        }
//                                    }

//                                    image.ServiceDetail = imageDetailList.Count() > 0 ? imageDetailList.ToArray() : null;
//                                }
//                                else
//                                    image.ServiceDetail = null;
//                            }
//                            else
//                                image.ServiceDetail = null;

//                            imageList.Add(image);
//                        }
//                    }
//                }
//            }
//            else
//            {
//                if (model.PrescriptionLabLines != null)
//                {
//                    if (model.PrescriptionLabLines.Count > 0)
//                    {
//                        for (int l = 0; l < model.PrescriptionLabLines.Count; l++)
//                        {
//                            lab = new Lab();

//                            var currentLab = model.PrescriptionLabLines[l];

//                            lab.DoNotPerform = currentLab.DoNotPerform;

//                            var labService = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrLNC", "Code", "Name", $"Id={currentLab.ServiceId}");
//                            lab.LabService = new LabService() { ServiceCode = labService.Id, ServiceName = labService.Name };

//                            lab.Note = currentLab.Note;

//                            var labAsNeedInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrSNOMEDCT", "Code", "Name", $"Id={currentLab.AsNeedId}");

//                            if (labAsNeedInfo == null)
//                            {
//                                lab.AsNeededInfo = null;
//                            }
//                            else
//                            {
//                                lab.AsNeededInfo = new Snomedct() { Code = labAsNeedInfo.Id, Value = labAsNeedInfo.Name };
//                            }

//                            var labReasonInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrICD", "Code", "Value", $"Id={currentLab.ReasonId}");


//                            if (labReasonInfo == null)
//                            {
//                                lab.ReasonInfo = null;
//                            }
//                            else
//                            {
//                                lab.ReasonInfo = new Reason() { Code = labReasonInfo.Id, Value = labReasonInfo.Name, Text = "" };
//                            }

//                            var labMethodInfo = await _prescriptionRepository.GetPrescriptionItemInfo("mc.thrICD", "Code", "Value", $"Id={currentLab.MethodId}");


//                            if (labReasonInfo == null)
//                            {
//                                lab.ReasonInfo = null;
//                            }
//                            else
//                            {
//                                lab.ReasonInfo = new Reason() { Code = labReasonInfo.Id, Value = labReasonInfo.Name, Text = "" };
//                            }


//                            lab.PatientInstruction = currentLab.PatientInstruction;

//                            labList.Add(lab);
//                        }
//                    }
//                }
//            }


//            sendPrescription = new SendPrescription()
//            {
//                Developer = developer,
//                Organization = organization,
//                Admission = admission,
//                Patient = patient,
//                ProviderComp = attender,
//                ReferringComp = referring,
//                BillInsurance = insurance,
//                Prescription = prescription,
//                PrescriptionLab = prescriptionLab,
//                HID = hid,
//                Diagnoses = diagnosesList,
//                Drugs = drugList,
//                Images = imageList,
//                Labs = labList
//            };

//            return sendPrescription;
//        }
//    }

//    public class BindingGetHID_WCF
//    {
//        private readonly AdmissionServiceRepository _admissionRepository;

//        public BindingGetHID_WCF(AdmissionServiceRepository admissionRepository)
//        {
//            _admissionRepository = admissionRepository;
//        }

//        public async Task<UpdateHID> BindPrescriptionHidUpdate(int admissionId, int CompanyId)
//        {
//            var result = new UpdateHID();
//            var admissionSearchModel = new GetAdmissionSearch
//            {
//                Id = admissionId,
//                CompanyId = CompanyId
//            };

//            var admission = await _admissionRepository.GetAdmission(admissionSearchModel);

//            var hid = new HID
//            {
//                Id = admission.AdmissionHID,
//                AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3"
//            };
//            var person = new Person
//            {
//                IsForeign = admission.PatientNationalityId.ToLower() != "ir",
//                NationalCode = admission.PatientNationalCode
//            };
//            var provider = new Provider
//            {
//                Id = admission.AttenderMSCId.ToString(),
//                MscType = admission.AttenderMSCTypeId
//            };
//            var insurer = new Insurer
//            {
//                Id = admission.BasicInsurerCode.ToString(),
//                Name = admission.BasicInsurerName
//            };
//            var referring = new ReferringDoctor
//            {
//                Id = admission.ReferringMSCId == null ? "" : admission.ReferringMSCId.ToString(),
//                MscTypeId = admission.ReferringMSCTypeId
//            };

//            result.Hid = hid;
//            result.Person = person;
//            result.Provider = provider;
//            result.Insurer = insurer;
//            result.Referring = referring;

//            return result;
//        }

//        public async Task<GetHIDUrgent> BindGetHidUrgent(int admissionId, int companyId)
//        {
//            var modelSearch = new GetAdmissionSearch()
//            {
//                AttenderId = 0,
//                CreateDatePersian = "",
//                Id = admissionId,
//                PatientFullName = null,
//                PatientNationalCode = null,
//                CompanyId = companyId
//            };

//            var admission = await _admissionRepository.GetAdmission(modelSearch);

//            var hidUrgent = new GetHIDUrgent();

//            hidUrgent.Person = new Person() { NationalCode = admission.PatientNationalCode, IsForeign = admission.PatientReferralTypeId == 4 };
//            hidUrgent.Provider = new Provider() { Id = admission.AttenderMSCId, MscType = admission.AttenderMSCTypeId };
//            hidUrgent.Insurer = new Insurer() { Id = admission.BasicInsurerCode, Name = admission.BasicInsurerName };
//            hidUrgent.Referring = new ReferringDoctor() { Id = !string.IsNullOrEmpty(admission.ReferringMSCId) ? admission.ReferringMSCId : null, MscTypeId = admission.ReferringMSCTypeId };

//            var insurerCodeList = new List<string>();
//            insurerCodeList.Add("1");
//            insurerCodeList.Add("2");
//            insurerCodeList.Add("37");

//            var exist = insurerCodeList.Any(i => i == admission.BasicInsurerCode);

//            // اگر بیمه تامین - خدمات درمانی و آزاد نبود
//            if (!exist)
//            {
//                hidUrgent.GetOnline = false;
//                hidUrgent.InsurerCode = "37";
//            }
//            // اگر نوع مراجعه اصلی بود یا اتباع و اگر بیمه تامین - خدمات درمانی و آزاد بود
//            else if ((admission.PatientReferralTypeId == 1 || admission.PatientReferralTypeId == 4) && exist)
//            {
//                hidUrgent.GetOnline = true;
//                hidUrgent.InsurerCode = admission.BasicInsurerCode;
//            }
//            // اگر نوع مراجعه مجهول و نوزاد بود و بیمه تامین - خدمات درمان - آزاد بود
//            else if ((admission.PatientReferralTypeId == 2 || admission.PatientReferralTypeId == 3) && exist)
//            {
//                hidUrgent.GetOnline = false;
//                hidUrgent.InsurerCode = admission.BasicInsurerCode;
//            }

//            return hidUrgent;
//        }
//    }

//    public class BindingReimburesmentModel_WCF
//    {
//        private readonly ICompanyRepository _companyRepository;
//        private readonly ISetupRepository _setupRepository;
//        private readonly AdmissionServiceRepository _admissionRepository;
//        private readonly AdmissionDiagnosisRepository _admissionDiagnosisRepository;
//        private readonly IAdmissionsRepository _admissionsRepository;
//        private readonly IAdmissionWebServiceRepository _admissionReimburesmentRepository;
//        private readonly IPrescriptionRepository _prescriptionRepository;
//        public BindingReimburesmentModel_WCF(ICompanyRepository companyRepository,
//                                ISetupRepository setupRepository,
//                                AdmissionDiagnosisRepository admissionDiagnosisRepository,
//                                AdmissionServiceRepository admissionRepository, IAdmissionWebServiceRepository admissionReimburesmentRepository,
//                                IAdmissionsRepository admissionsRepository, IPrescriptionRepository prescriptionRepository)
//        {
//            _companyRepository = companyRepository;
//            _setupRepository = setupRepository;
//            _admissionRepository = admissionRepository;
//            _admissionsRepository = admissionsRepository;
//            _admissionReimburesmentRepository = admissionReimburesmentRepository;
//            _prescriptionRepository = prescriptionRepository;
//            _admissionDiagnosisRepository = admissionDiagnosisRepository;
//        }

//        public async Task<UpdateHID> BindAdmissionHidUpdate(int admissionId,int companyId)
//        {
//            var result = new UpdateHID();
//            var admissionSearchModel = new GetAdmissionSearch
//            {
//                Id = admissionId,
//                CompanyId=companyId
//            };

//            var admission = await _admissionRepository.GetAdmission(admissionSearchModel);
//            if (!admission.HIDOnline)
//            {
//                var hid = new HID
//                {
//                    Id = admission.AdmissionHID,
//                    AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3",
//                };
//                var person = new Person
//                {
//                    IsForeign = admission.PatientNationalityId.ToLower() != "ir",
//                    NationalCode = admission.PatientNationalCode
//                };
//                var provider = new Provider
//                {
//                    Id = admission.AttenderMSCId.ToString(),
//                    MscType = admission.AttenderMSCTypeId
//                };
//                var insurer = new Insurer
//                {
//                    Id = admission.BasicInsurerCode.ToString(),
//                    Name = admission.BasicInsurerName
//                };
//                var referring = new ReferringDoctor
//                {
//                    Id = admission.ReferringMSCId == null ? "" : admission.ReferringMSCId.ToString(),
//                    MscTypeId = admission.ReferringMSCTypeId
//                };

//                result.Hid = hid;
//                result.Person = person;
//                result.Provider = provider;
//                result.Insurer = insurer;
//                result.Referring = referring;
//            }
//            return result;
//        }

//        public async Task<EliminateHID> BindAdmissionHidEliminate(int admissionId, int CompanyId)
//        {
//            var result = new EliminateHID();
//            var admissionSearchModel = new GetAdmissionSearch
//            {
//                Id = admissionId,
//                CompanyId = CompanyId
//            };

//            var admission = await _admissionRepository.GetAdmission(admissionSearchModel);
//            var hid = new HID
//            {
//                Id = admission.AdmissionHID,
//                AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3"
//            };
//            var person = new Person
//            {
//                IsForeign = admission.PatientNationalityId.ToLower() != "ir",
//                NationalCode = admission.PatientNationalCode
//            };

//            result.Hid = hid;
//            result.Person = person;
//            result.Description = "انصراف از پذیرش";
//            result.ReasonValue = "انصراف از پذیرش";

//            return result;
//        }

//        public async Task<HID> BindAdmissionReimbursement(int admissionId, int CompanyId)
//        {
//            var result = new HID();
//            var admissionSearchModel = new GetAdmissionSearch
//            {
//                Id = admissionId,
//                CompanyId = CompanyId
//            };

//            var admission = await _admissionRepository.GetAdmission(admissionSearchModel);

//            var hid = new HID
//            {
//                //"2981YBBI4"
//                // 2

//                Id = "2985YVX57",
//                AssignerCode = "2",//admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3"
//                //AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3"
//            };

//            result = hid;

//            return result;
//        }

//        public async Task<SavePatientBill> BindAdmissionSavePatientBill(AdmissionSearch admission)
//        {
//            var result = new SavePatientBill();
//            var companyInfo = await _companyRepository.GetCompanyInfo();

//            var developer = new Developer
//            {
//                SystemId = await _setupRepository.GetCisWcfSystemId()
//            };

//            var organizationType = await _admissionsRepository.GetThrOrganization(companyInfo.TerminologyId);

//            var organization = new Organization
//            {
//                OrganizationId = companyInfo.WebServiceGuid,
//                OrganizationName = companyInfo.Name,
//                UserNationalCode = companyInfo.NationCode,
//                UserFirstName = companyInfo.ManagerFirstName,
//                UserLastName = companyInfo.ManagerLastName,

//                OrganizationType = new OrganizationType { Id = organizationType.Id, Name = organizationType.Name }
//            };

//            var providerComp = new ProviderComp
//            {
//                Id = admission.AttenderMSCId.ToString(),
//                MscTypeId = admission.AttenderMSCTypeId,
//                FirstName = admission.AttenderFirstName,
//                LastName = admission.AttenderLastName,

//                Role = new AttenderRole() { Id = admission.AttenderRoleCode, Name = admission.AttenderRoleName },
//                Specialty = new AttenderSpecialty() { Id = !string.IsNullOrEmpty(admission.AttenderSpecialtyId.ToString()) ? admission.AttenderSpecialtyId.ToString() : "", Name = admission.AttenderSpecialtyName },
//            };
//            var patient = new Patient
//            {

//                NationalCode = admission.PatientNationalCode,
//                FirstName = admission.PatientFirstName,
//                LastName = admission.PatientLastName,
//                MobileNumber = admission.PatientMobileNo,
//                FullAddress = admission.PatientAddress,
//                GenderId = admission.PatientGenderId,
//                BirthDate = admission.PatientBirthDate,
//                NationalityId = admission.PatientNationalityId,
//                Father_FirstName = admission.PatientFatherFirstName,
//                HomeTel = admission.PatientHomeTel,
//                IDCardNumber = admission.PatientIdCardNumber,
//                MaritalStatusId = admission.PatientMaritalStatusId,
//                JobTitle = admission.PatientJobTitle,
//                PostalCode = admission.PatientPostalCode,
//                EducationLevel = admission.PatientEducationLevelId != 0 ? new EducationLevel() { Code = admission.PatientEducationLevelId.ToString(), Value = admission.PatientEducationLevelName } : null
//            };

//            var referringComp = new ReferringComp
//            {
//                Id = admission.ReferringMSCId == null ? "" : admission.ReferringMSCId.ToString(),
//                MscTypeId = admission.ReferringMSCTypeId,
//                FirstName = admission.ReferringFirstName,
//                LastName = admission.ReferringLastName
//            };
//            var billInsurances = new[]
//            {
//                    new BillInsurance {
//                        Insurer=new Insurer(){Id=admission.BasicInsurerCode.ToString(),Name=admission.BasicInsurerName },
//                        InsuranceNumber = admission.BasicInsurerNo,
//                        BasicInsuranceBoxId = admission.BasicInsurerCode!=null?admission.BasicInsurerCode.ToString():"",
//                        BasicInsuranceBoxName = admission.BasicInsurerLineName,
//                        BasicInsurerHID = new HID()
//                        {
//                            AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3",
//                            Id=admission.AdmissionHID
//                        },
//                        BasicInsurerSerialNumber = admission.InsurPageNo!=0?admission.InsurPageNo.ToString():"",
//                        BasicInsuranceExpDate = admission.BasicInsurerExpirationDatePersian
//                    }
//            };

//            var serviceLines = await _admissionReimburesmentRepository.GetAdmissionServiceLineWcf(Convert.ToInt32(admission.AdmissionId), admission.CompanyId);


//            var admissionItm = new Admission
//            {
//                AdmissionId = admission.AdmissionId,
//                AdmissionDate = admission.AdmissionDate,
//                AdmissionTime = admission.AdmissionTime,
//                HID = admission.AdmissionHID,
//                CompositionUID = admission.SaveBillCompositionUID,
//                PatientUID = admission.PersonUID,
//                ReasonEncounter = admission.ReasonForEncounterId != 0 ? new ReasonEncounter() { Code = admission.ReasonForEncounterCode, Value = admission.ReasonForEncounterName } : null,
//                TotalInsurerSharePrice = serviceLines.Sum(s => s.BasicInsuranceContribution),
//                TotalPatientSharePrice = serviceLines.Sum(s => s.PatientContribution),
//                TotalPrice = serviceLines.Sum(s => s.TotalCharge)
//            };

//            var diagnosisList = await _admissionDiagnosisRepository.GetDiagnosisList(int.Parse(admission.AdmissionId));

//            var diagnosis = new List<Diagnosis>();


//            if (diagnosisList.ListHasRow())
//            {
//                for (int dg = 0; dg < diagnosisList.Count; dg++)
//                {
//                    var currentDiagnosis = diagnosisList[dg];

//                    var diagnose = new Diagnosis()
//                    {
//                        Comment = currentDiagnosis.Comment,
//                        DiagnosisDate = currentDiagnosis.CreateDatePersian,
//                        DiagnosisTime = currentDiagnosis.CreateTime,
//                        DiagnosisInfo = new Reason() { Code = currentDiagnosis.DiagnosisReasonCode, Value = currentDiagnosis.DiagnosisReasonName },
//                        Severity = new DiagnosisSeverity() { SeverityCode = currentDiagnosis.ServerityId.ToString(), SeverityName = currentDiagnosis.ServerityName },
//                        Status = new DiagnosisStatus() { StatusCode = currentDiagnosis.StatusId.ToString(), StatusName = currentDiagnosis.StatusName }
//                    };

//                    diagnosis.Add(diagnose);
//                }
//            }
//            else
//                diagnosis = null;


//            result.Developer = developer;
//            result.Organization = organization;
//            result.ProviderComp = providerComp;
//            result.Patient = patient;
//            result.ReferringComp = referringComp;
//            result.BillInsurances = billInsurances;
//            result.Admission = admissionItm;
//            result.Diagnoses = diagnosis != null ? diagnosis.ToArray() : null;
//            result.Services = serviceLines.ToArray();

//            return result;

//        }

//        public Wcf_Result ValidateAdmissionSavePatientBill(SavePatientBill model)
//        {
//            var modelResult = new Wcf_Result();
//            var result = "";
//            for (int i = 0; i < model.Services.Length; i++)
//            {
//                var service = model.Services[i];

//                if (string.IsNullOrEmpty(service.ServiceTypeId))
//                {
//                    result += $"{service.ServiceId} - {service.ServiceName} \n";
//                }
//            }


//            modelResult.AdmissionHid = model.Admission.HID;
//            modelResult.ErrorMessage = result;

//            //var list=model.Services.Where(x => x.ServiceTypeId == null);

//            return modelResult;
//        }


//    }
//}

