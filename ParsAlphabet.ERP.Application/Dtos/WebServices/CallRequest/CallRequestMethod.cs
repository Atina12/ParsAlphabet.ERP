namespace ParsAlphabet.ERP.Application.Dtos.WebServices.CallRequest;

public static class CallWebService
{
    public static class ApiLIS
    {
        public static string protocol = "http";
        public static string portNumber = "83";
        public static string address = "192.168.1.10";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";

        public static string LabApiUrl = "/api/lis/parsalphabet/lab";
        public static string saveLabApi = "savelab";
        public static string getlistApi = "/getlist";
    }

    public static class ApiPIS
    {
        public static string protocol = "http";
        public static string address = "192.168.1.10";
        public static string portNumber = "84";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";
        public static string PharmacyApiUrl = "";
    }

    public static class ApiSSO
    {
        public static string protocol = "http";
        public static string address = "192.168.1.10";
        public static string portNumber = "85";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";

        public static class ParaClinic
        {
            public static class Common
            {
                public static string routeBase = $"{baseUrl}/api/sso/common/";
                public static string deserveInfo = $"{routeBase}deserveinfo/@@nationalcode@@";
            }

            public static class Authorization
            {
                public static string routeBase = "/api/sso/auth/";
                public static string getToken = $"{routeBase}gettokenpara";
                public static string deleteToken = $"{routeBase}deletetoken";
            }

            public static class MedicalCenter
            {
                public static string routeBase = "/api/sso/medicalcenter/";
                public static string paraClinic = $"{routeBase}paraclinictype";
                public static string serviceType = $"{routeBase}servicetype";
                public static string acceptableService = $"{routeBase}acceptableservices";
            }

            public static class EPrescription
            {
                public static string routeBase = "/api/sso/eprescription/";
                public static string ePrescriptionList = $"{routeBase}list/@@nationalcode@@/@@trackingcode@@";
                public static string ePrescriptiondetailList = $"{routeBase}detaillist/";
                public static string ePrescriptionSend = $"{routeBase}send";
                public static string ePrescriptionDelete = $"{routeBase}deleteprescription/@@registerId@@";
                public static string ePrescriptionSendLaboratory = $"{routeBase}sendlaboratory";
                public static string ePrescriptionSendwithwarning = $"{routeBase}sendwithwarning";
                public static string sendPaperPrescription = $"{routeBase}sendpaperprescription";
            }

            public static class RequestEprescription
            {
                public static string routeBase = "/api/sso/requesteprescription/";
                public static string RequestePrescriptionSend = $"{routeBase}send";
            }
        }
    }

    public static class ApiSSOREPrescription
    {
        public static string protocol = "http";
        public static string address = "localhost";
        public static string portNumber = "3686";

        public static class Common
        {
            public static string routeBase = "/api/ssoreprescription/common/";
            public static string deserveInfo = $"{routeBase}deserveinfo/@@siam_id@@/@@docId@@/@@patientId@@/";
        }

        public static class Authorization
        {
            public static string routeBase = "/api/ssoreprescription/auth/";
            public static string getToken = $"{routeBase}gettokenpara";
            public static string deleteToken = $"{routeBase}deletetoken";
        }

        public static class RequestEprescription
        {
            public static string routeBase = "/api/ssoreprescription/reqep/";
            public static string RequestePrescriptionSend = $"{routeBase}send";
            public static string RequestePrescriptionGet = $"{routeBase}get/@@headerID@@/@@docId@@";
            public static string RequestePrescriptionEdit = $"{routeBase}edit/@@headerID@@/@@docId@@/@@otpCode@@";
            public static string RequestePrescriptionDelete = $"{routeBase}delete/@@headerID@@/@@docId@@/@@otpCode@@";
        }
    }

    public static class ApiCIS
    {
        public static string protocol = "http";
        public static string address = "192.168.1.10";
        public static string portNumber = "81";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";


        public static class Referral
        {
            public static string routeBase = "/api/sepas/referral/";
            public static string SendReferralUrl = $"{routeBase}sendreferralpatientrecord";
            public static string GetReferralUrl = $"{routeBase}getreferralpatientrecord";
        }

        public static class FeedBack
        {
            public static string routeBase = "/api/sepas/feedback/";
            public static string SendFeedbackUrl = $"{routeBase}sendfeedbackpatientrecord";
            public static string GetFeedbackUrl = $"{routeBase}getfeedbackpatientrecord";
        }

        public static class Dental
        {
            public static string routeBase = "/api/sepas/dental/";
            public static string SaveDentalCaseUrl = $"{routeBase}savedentalcase";
        }

        public static class Death
        {
            public static string routeBase = "/api/sepas/death/";
            public static string SaveDeathCaseUrl = $"{routeBase}savedeathcertificate";
        }
    }

    public static class ApiCentral
    {
        public static string protocol = "http";
        public static string address = "192.168.1.10";
        public static string portNumber = "87";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";

        public static class ErpSender
        {
            public static string routeBase = "/api/erpsender/";

            public static class CentralAttender
            {
                public static string SendAttenderUrl = $"{routeBase}attender/send";
            }

            public static class CentralBranch
            {
                public static string SendBranchUrl = $"{routeBase}branch/send";
            }

            public static class CentralService
            {
                public static string SendServiceUrl = $"{routeBase}service/send";
            }
        }
    }
}

public class CallBehPardakht
{
    //public string baseUrl = "http://localhost:1024";
    private string _baseUrl = "";
    public string apiUrl = "/bpmpospc/service";

    public string baseUrl
    {
        get => _baseUrl;
        set => _baseUrl = !string.IsNullOrEmpty(value) ? "http://" + value + ":1024" : "";
    }
}