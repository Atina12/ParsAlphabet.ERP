namespace ERPCentral.Interface.App.CallRequest;

public class CallWebService
{
    public static class CentralApiUrl
    {
        public static string protocol = "http";

        public static string address = "websla.ir";
        //public static string address = "94.183.250.121";

        public static string portNumber = "8022";
        public static string baseUrl = $"{protocol}://{address}:{portNumber}";

        public static class ErpNode
        {
            public static string routeBase = "/api/node/";

            public static class Token
            {
                public static string GetTokenUrl = $"{routeBase}token/geterptoken";
                public static string CheckTokenUrl = $"{routeBase}token/checktoken";
            }

            public static class Attender
            {
                public static string SendAttenderUrl = $"{routeBase}attender/send";
            }

            public static class Branch
            {
                public static string SendBranchUrl = $"{routeBase}branch/send";
            }

            public static class Service
            {
                public static string SendServiceUrl = $"{routeBase}service/send";
            }

            public static class AttenderService
            {
                public static string SendAttenderServiceUrl = $"{routeBase}attenderservice/send";
            }

            public static class MedicalItemPrice
            {
                public static string SendMedicalItemPriceUrl = $"{routeBase}medicalitemprice/send";
                public static string SendMedicalItemPriceBulkUrl = $"{routeBase}medicalitemprice/send/bulk";
            }

            public static class AttenderScheduleBlock
            {
                public static string SendAttenderScheduleBlockSaveUrl =
                    $"{routeBase}attenderscheduleblock/save/@@companyId@@";

                public static string SendAttenderScheduleBlockDeleteUrl = $"{routeBase}attenderscheduleblock/delete";

                public static string SendAttenderScheduleBlockValidateUrl =
                    $"{routeBase}attenderscheduleblock/validation";

                public static string SendAttenderScheduleBlockUpdateRangeTimeUrl =
                    $"{routeBase}attenderscheduleblock/updaterangetime/@@companyId@@";

                public static string SendAttenderScheduleBlockUpdateShiftNameUrl =
                    $"{routeBase}attenderscheduleblock/updateshiftname/@@companyId@@";

                //public static string SendAttenderScheduleBlockUpdateMedicalShiftUrl = $"{routeBase}attenderscheduleblock/updatemedicalshift/@@companyId@@";
                public static string SendAttenderScheduleBlockChangeLockUrl =
                    $"{routeBase}attenderscheduleblock/changelock";
            }

            public static class AdmissionService
            {
                public static string AdmissionServiceReturnUrl = $"{routeBase}admission/savereturn/@@admissionId@@";
            }

            public static class InsurerPrice
            {
                public static string SendInsurerPriceUrl = $"{routeBase}insurerprice/send";
                public static string SendInsurerPriceBulkUrl = $"{routeBase}insurerprice/send/bulk";
            }
        }
    }
}