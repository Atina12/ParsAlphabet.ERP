#region using
using CIS.Repositories.Interfaces;
using ERPCentral.Interface.App.Application.General.Token;
using ERPCentral.Interface.App.Application.Medical.AdmissionService;
using ERPCentral.Interface.App.Application.Medical.Attender;
using ERPCentral.Interface.App.Application.Medical.AttenderScheduleBlock;
using ERPCentral.Interface.App.Application.Medical.AttenderService;
using ERPCentral.Interface.App.Application.Medical.Branch;
using ERPCentral.Interface.App.Application.Medical.InsurerPrice;
using ERPCentral.Interface.App.Application.Medical.MedicalItemPrice;
using ERPCentral.Interface.App.Application.Medical.Service;
using ParsAlphabet.ERP.Application.Interfaces._Dashboard;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Home;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.CR;
using ParsAlphabet.ERP.Application.Interfaces.FA;
using ParsAlphabet.ERP.Application.Interfaces.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM.CostCenterLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroupCartable;
using ParsAlphabet.ERP.Application.Interfaces.FM.Report;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryBondDesign;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryReport;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestCartable;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasurySearch;
using ParsAlphabet.ERP.Application.Interfaces.GN;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.GN.FiscalYearLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.NoSeriesLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionRefer;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces.MC.Attender_Assistant;
using ParsAlphabet.ERP.Application.Interfaces.MC.DeathCertificate1;
using ParsAlphabet.ERP.Application.Interfaces.MC.Dental;
using ParsAlphabet.ERP.Application.Interfaces.MC.FavoritePrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.Insurer;
using ParsAlphabet.ERP.Application.Interfaces.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.Report;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportControl;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportDental;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportImaging;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportPrescription;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Application.Interfaces.SM;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLog;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;
using ParsAlphabet.ERP.Application.Interfaces.WF;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionReport;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionTrialBalancesReport;
using ParsAlphabet.ERP.Application.Interfaces.WH;
using ParsAlphabet.ERP.Infrastructure.Implantation._Dashboard;
using ParsAlphabet.ERP.Infrastructure.Implantation._ErrorLog;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation._Home;
using ParsAlphabet.ERP.Infrastructure.Implantation._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation._Setup;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.Contact;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAsset;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetLocation;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetSubClass;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountCategory;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGLUserLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Bank;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Cashier;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenter;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenterLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostOfGoodsTemplate;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostOfGoodsTemplateLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.DocumentType;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Journal;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.NewTreasury;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.PosPayment;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.PostingGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.PostingGroupCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Report;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.ShareHolder;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryBond;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryBondDesign;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryReport;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequest;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequestCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequestLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySearch;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySubject;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.VAT;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Branch;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.CentralToken;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.CurrencyExchange;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FavoriteDescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYearLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.IndustryGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCity;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCountry;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocState;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.NoSeriesLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.PersonAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Role;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleBranchPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleFiscalYearPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Token;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.DepartmentTimeShift;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.EmployeeContractType;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.OrganizationalDepartment;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollSocialSecurityBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollTaxBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheet;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetHoliday;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetPerMonth;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCash;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionClose;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCounter;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiscrepancyCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImaging;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImagingTemplate;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItem;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItemCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMasterCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionRefer;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionServiceReimbursment;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionStageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionWebService;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender_Assistant;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracketLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderServicePriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Bundle;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.DeathCertificate;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Dental;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.FavoritePrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.HealthIDOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurer;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPatient;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageParaclinicTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Patient;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.PatientAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Prescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.PrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReferringDoctor;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Report;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportControl;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportDental;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportImaging;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReportPrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Service;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceCenter;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceItemPricing;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceType;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Speciality;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.VendorItemPriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoiceCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderSearch;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseReport;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Customer;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerDiscountGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerSalesPrice;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Segment;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SegmentLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ShipmentMethod;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Team;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.TeamSalesPerson;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAdmissionService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderScheduleBlockService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderServices;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderServiceService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralBranchServices;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralInsurerPriceService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralMedicalItemPriceServices;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralServices;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.AuthorizationRequestParaClinicService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.CommonRequestParaClinicService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.RequestEprescriptionParaClinicService;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Workflow;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_Warehouse;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_WarehouseLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemAttribute;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemBarcode;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategory;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategoryAttribute;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequest;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransactionCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemUnit;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Report.ItemTransactionReport;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Report.ItemTransactionTrialBalancesReport;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculationLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.User_WarehouseLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Warehouse;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionSearch;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WBin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Zone;
using ParseAlphabet.ERP.Web.Redis;
using ParseAlphabet.ERP.Web.WebServices.SSO.AuthorizationParaClinicService;
using ParseAlphabet.ERP.Web.WebServices.SSO.CommonParaClinicService;
using ParseAlphabet.ERP.Web.WebServices.SSO.EPrescriptionParaClinicService;
using IRequestEprescriptionParaClinicService =
    ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription.IRequestEprescriptionParaClinicService;

#endregion

namespace ParseAlphabet.ERP.Web.Utility.ServiceCollection;

public static class Dependencies
{
    public static IServiceCollection AddTransients(this IServiceCollection services)
    {
        #region public

        services.AddHttpContextAccessor();
        services.AddScoped<IRedisService, RedisService>();

    
        #endregion

        #region Module

        services.AddTransient<IDashboardRepository, DashboardRepository>();
        services.AddTransient<IErrorLogRepository, ErrorLogRepository>();
        services.AddTransient<HistoryRepository>();
        services.AddTransient<IHomeRepository, HomeRepository>();
        services.AddTransient<ILoginRepository, LoginRepository>();
        services.AddTransient<ISetupRepository, SetupRepository>();

        #endregion

        #region CR

        services.AddTransient<ICRRepository, CRRepository>();
        services.AddTransient<ContactRepository>();
        services.AddTransient<PersonGroupRepository>();

        #endregion

        #region FA

        services.AddTransient<IFARepository, FARepository>();
        services.AddTransient<FixedAssetRepository>();
        services.AddTransient<FixedAssetLocationRepository>();
        services.AddTransient<FixedAssetSubClassRepository>();

        #endregion

        #region FM

        services.AddTransient<IFinanceRepository, FinanceRepository>();
        services.AddTransient<AccountCategoryRepository>();
        services.AddTransient<AccountDetailRepository>();
        services.AddTransient<AccountGLRepository>();
        services.AddTransient<AccountSGLRepository>();
        services.AddTransient<AccountSGLUserLineRepository>();
        services.AddTransient<BankRepository>();
        services.AddTransient<BankAccountRepository>();
        services.AddTransient<CashierRepository>();
        services.AddTransient<CostCenterRepository>();
        services.AddTransient<ICostCenterLineRepository, CostCenterLineRepository>();
        services.AddTransient<DocumentTypeRepository>();
        services.AddTransient<JournalRepository>();
        services.AddTransient<JournalActionRepository>();
        services.AddTransient<IJournalLineRepository, JournalLineRepository>();
        services.AddTransient<JournalStageActionRepository>();
        services.AddTransient<INewTreasuryRepository, NewTreasuryRepository>();
        services.AddTransient<INewTreasuryLineRepository, NewTreasuryLineRepository>();
        services.AddTransient<ITreasuryRequestRepository, TreasuryRequestRepository>();
        services.AddTransient<ITreasuryRequestLineRepository, TreasuryRequestLineRepository>();
        services.AddTransient<PosPaymentRepository>();
        services.AddTransient<IPostingGroupRepository, PostingGroupRepository>();
        services.AddTransient<IPostingGroupCartableRepository, PostingGroupCartableRepository>();
        services.AddTransient<ITreasuryRequestCartableRepository, TreasuryRequestCartableRepository>();
        services.AddTransient<IJournalReportRepository, JournalReportRepository>();
        services.AddTransient<ShareHolderRepository>();
        services.AddTransient<TreasuryBondRepository>();
        services.AddTransient<ITreasuryReportRepository, TreasuryReportRepository>();
        services.AddTransient<ITreasurySearchRepository, TreasurySearchRepository>();
        services.AddTransient<ITreasuryBondDesignRepository, TreasuryBondDesignRepository>();
        services.AddTransient<TreasuryStageActionRepository>();
        services.AddTransient<TreasurySubjectRepository>();
        services.AddTransient<VATRepository>();
        services.AddTransient<PostingGroupSystemRepository>();
        services.AddTransient<CostOfGoodsTemplateRepository>();
        services.AddTransient<CostOfGoodsTemplateLineRepository>();

        #endregion

        #region GN

        services.AddTransient<IGNRepository, GNRepository>();
        services.AddTransient<BranchRepository>();
        services.AddTransient<ICompanyRepository, CompanyRepository>();
        services.AddTransient<CurrencyRepository>();
        services.AddTransient<CurrencyExchangeRepository>();
        services.AddTransient<IFavoriteDescriptionRepository, FavoriteDescriptionRepository>();
        services.AddTransient<FiscalYearRepository>();
        services.AddTransient<IFiscalYearLineRepository, FiscalYearLineRepository>();
        services.AddTransient<IndustryGroupRepository>();
        services.AddTransient<LocCityRepository>();
        services.AddTransient<LocCountryRepository>();
        services.AddTransient<LocStateRepository>();
        services.AddTransient<INoSeriesLineRepository, NoSeriesLineRepository>();
        services.AddTransient<IPersonAccountRepository, PersonAccountRepository>();
        services.AddTransient<RoleRepository>();
        services.AddTransient<RoleWorklfowPermissionRepository>();
        services.AddTransient<RoleBranchPermissionRepository>();
        services.AddTransient<RoleFiscalYearPermissionRepository>();
        services.AddTransient<UserRepository>();
        services.AddTransient<CompanyRepository>();
        services.AddTransient<CentralTokenRepository>();
        services.AddTransient<ITokenRepository, TokenRepository>();
        services.AddTransient<IBranchService, BranchService>();
        services.AddTransient<SendHistoryRepository>();

        //webService
        services.AddTransient<ICentralTokenService, CentralTokenService>();
        services.AddTransient<ITokenService, TokenService>();
        services.AddTransient<IBranchServiceCentral, BranchServiceCentral>();

        #endregion

        #region HR

        services.AddTransient<EmployeeRepository>();

        services.AddTransient<DepartmentTimeShiftRepository>();

        services.AddTransient<EmployeeContractTypeRepository>();

        services.AddTransient<StandardTimeSheetRepository>();
        services.AddTransient<StandardTimeSheetHolidayRepository>();
        services.AddTransient<StandardTimeSheetPerMonthRepository>();

        services.AddTransient<OrganizationalDepartmentRepository>();
        services.AddTransient<PayrollSocialSecurityBracketRepository>();
        services.AddTransient<PayrollTaxBracketRepository>();

        #endregion

        #region MC

        services.AddTransient<AdmissionServiceRepository>();

        services.AddTransient<AdmissionCashRepository>();
        // services.AddTransient<IAdmissionCashStandRepository, AdmissionCashStandRepository>();
        services.AddTransient<IAdmissionCloseRepository, AdmissionCloseRepository>();
        services.AddTransient<IAdmissionCounterRepository, AdmissionCounterRepository>();
        services.AddTransient<AdmissionDiagnosisRepository>();
        services.AddTransient<AdmissionImagingRepository>();
        services.AddTransient<AdmissionImagingTemplateRepository>();

        services.AddTransient<AdmissionCartableRepository>();
        services.AddTransient<AdmissionItemCartableRepository>();
        services.AddTransient<AdmissionMasterCartableRepository>();

        services.AddTransient<AdmissionDiscrepancyCartableRepository>();

        services.AddTransient<IAdmissionReferRepository, AdmissionReferRepository>();
        services.AddTransient<AdmissionItemRepository>();
        services.AddTransient<AdmissionServiceReimbursmentRepository>();
        services.AddTransient<IAdmissionServiceTaminRepository, AdmissionServiceTaminRepository>();
        services.AddTransient<AdmissionStageActionRepository>();
        services.AddTransient<AdmissionStageActionLogRepository>();
        services.AddTransient<AdmissionTaminWebServiceRepository>();
        services.AddTransient<IAdmissionWebServiceRepository, AdmissionWebServiceRepository>();
        services.AddTransient<IAdmissionMasterRepository,AdmissionMasterRepository>();
        services.AddTransient<AttenderRepository>();
        services.AddTransient<IAttender_AssistantRepository, Attender_AssistantRepository>();
        services.AddTransient<AttenderMarginBracketRepository>();
        services.AddTransient<AttenderMarginBracketLineRepository>();
        services.AddTransient<MedicalShiftTimeSheetRepository>();
        services.AddTransient<AttenderTimeSheetLineRepository>();
        services.AddTransient<AttenderServicePriceLineRepository>();
        services.AddTransient<IDeathCertificateRepository, DeathCertificateRepository>();
        services.AddTransient<IDentalRepository, DentalRepository>();
        services.AddTransient<IFavoritePrescriptionRepository, FavoritePrescriptionRepository>();
        services.AddTransient<HealthIDOrderRepository>();

        services.AddTransient<IInsurerRepository, InsurerRepository>();
        services.AddTransient<InsuranceRepository>();

        services.AddTransient<InsurerPriceLineRepository>();
        services.AddTransient<ManageTaminTokenRepository>();
        services.AddTransient<ManageRequestPrescriptionTaminRepository>();
        services.AddTransient<IMedicalLaboratoryRepository, MedicalLaboratoryRepository>();
        services.AddTransient<PatientRepository>();
        services.AddTransient<IPrescriptionRepository, PrescriptionRepository>();
        services.AddTransient<PrescriptionTaminRepository>();
        services.AddTransient<ReferringDoctorRepository>();
        services.AddTransient<IAdmissionReportRepository, AdmissionReportRepository>();
        services.AddTransient<IReportControlRepository, ReportControlRepository>();
        services.AddTransient<IDentalReportRepository, DentalReportRepository>();
        services.AddTransient<IPrescriptionReportRepository, PrescriptionReportRepository>();
        services.AddTransient<IImagingReportRepository, ImagingReportRepository>();
        services.AddTransient<ServiceRepository>();
        services.AddTransient<InsurerPatientRepository>();
        services.AddTransient<ServiceItemPricingRepository>();
        services.AddTransient<ServiceCenterRepository>();
        services.AddTransient<ServiceTypeRepository>();
        services.AddTransient<SpecialityRepository>();
        services.AddTransient<VendorItemPriceLineRepository>();
        services.AddTransient<PatientAccountRepository>();


        // WebService
        services.AddTransient<IAuthorizationParaClinicService, AuthorizationParaClinicService>();
        services.AddTransient<ICommonParaClinicService, CommonParaClinicService>();
        services.AddTransient<IEPrescriptionParaClinicService, EPrescriptionParaClinicService>();
        services.AddTransient<IRequestEprescriptionParaClinicService, RequestEprescriptionParaClinicService>();
        services.AddTransient<IAuthorizationRequestParaClinicService, AuthorizationRequestParaClinicService>();
        services.AddTransient<ICommonRequestParaClinicService, CommonRequestParaClinicService>();

        // Central WebService
        services.AddTransient<IAttenderServiceCentral, AttenderServiceCentral>();
        services.AddTransient<IAttenderService, AttenderService>();
        services.AddTransient<IServiceServiceCentral, ServiceServiceCentral>();
        services.AddTransient<IService_Service, Service_Service>();
        services.AddTransient<IAttenderServiceServiceCentral, AttenderServiceServiceCentral>();
        services.AddTransient<IAttenderServiceService, AttenderServiceService>();
        services.AddTransient<IMedicalItemPriceServiceCentral, MedicalItemPriceServiceCentral>();
        services.AddTransient<IMedicalItemPriceService, MedicalItemPriceService>();
        services.AddTransient<IAttenderScheduleBlockServiceCentral, AttenderScheduleBlockServiceCentral>();
        services.AddTransient<IAttenderScheduleBlockService, AttenderScheduleBlockService>();
        services.AddTransient<IAdmissionServiceCentral, AdmissionServiceCentral>();
        services.AddTransient<IAdmissionService, AdmissionService>();
        services.AddTransient<IInsurerPriceServiceCentral, InsurerPriceServiceCentral>();
        services.AddTransient<IInsurerPriceService, InsurerPriceService>();

        #endregion

        #region PB

        services.AddTransient<PublicRepository>();
        services.AddTransient<ManageRedisRepository>();
        services.AddTransient<IPublicRepository, PublicRepository>();

        #endregion

        #region PU

        services.AddTransient<IPurchaseOrderActionRepository, PurchaseOrderActionRepository>();
        services.AddTransient<IPurchaseInvoiceRepository, PurchaseInvoiceRepository>();
        services.AddTransient<PurchaseInvoiceCartableRepository>();
        services.AddTransient<IPurchaseInvoiceLineRepository, PurchaseInvoiceLineRepository>();
        services.AddTransient<PurchaseOrderRepository>();
        services.AddTransient<IPurchaseOrderLineRepository, PurchaseOrderLineRepository>();
        services.AddTransient<PurchaseOrderCartableRepository>();
        services.AddTransient<PurchaseOrderSearchRepository>();
        services.AddTransient<PurchaseReportRepository>();
        services.AddTransient<VendorRepository>();
        services.AddTransient<VendorItemsRepository>();
        services.AddTransient<PurchaseOrderStageActionRepository>();

        #endregion

        #region SM

        services.AddTransient<ISMRepository, SMRepository>();
        services.AddTransient<CustomerRepository>();
        services.AddTransient<CustomerDiscountGroupRepository>();
        services.AddTransient<CustomerSalesPriceRepository>();
        services.AddTransient<ReturnReasonRepository>();
        services.AddTransient<SegmentRepository>();
        services.AddTransient<SegmentLineRepository>();
        services.AddTransient<ShipmentMethodRepository>();
        services.AddTransient<TeamRepository>();
        services.AddTransient<TeamSalesPersonRepository>();
        services.AddTransient<ISaleOrderRepository, SaleOrderRepository>();
        services.AddTransient<ISaleOrderLogRepository, SaleOrderLogRepository>();
        services.AddTransient<ISaleOrderLineRepository, SaleOrderLineRepository>();
        services.AddTransient<IAdmissionsRepository, AdmissionsRepository>();

        #endregion

        #region WF

        services.AddTransient<IWFRepository, WFRepository>();
        services.AddTransient<WorkflowRepository>();
        services.AddTransient<StageRepository>();
        services.AddTransient<StageActionRepository>();
        services.AddTransient<StageActionLogRepository>();
        services.AddTransient<StageStepConfigRepository>();
        services.AddTransient<StageFundItemTypeRepository>();
        services.AddTransient<StageActionOriginDestinationRepository>();

        #endregion

        #region WH

        services.AddTransient<IWHRepository, WHRepository>();
        services.AddTransient<ItemRepository>();
        services.AddTransient<Item_WarehouseRepository>();
        services.AddTransient<Item_WarehouseLineRepository>();
        services.AddTransient<ItemAttributeRepository>();
        services.AddTransient<ItemCategoryRepository>();
        services.AddTransient<ItemCategoryAttributeRepository>();
        services.AddTransient<ItemRequestRepository>();
        services.AddTransient<ItemRequestLineRepository>();
        services.AddTransient<ItemRequestCartableRepository>();
        services.AddTransient<ItemTransactionCartableRepository>();
        services.AddTransient<ItemTransactionRepository>();
        services.AddTransient<ItemTransactionLineRepository>();
        services.AddTransient<IItemTransactionReportRepository, ItemTransactionReportRepository>();
        services
            .AddTransient<IItemTransactionTrialBalancesReportRepository,
                ItemTransactionTrialBalancesReportRepository>();
        services.AddTransient<ItemUnitRepository>();
        services.AddTransient<User_WarehouseLineRepository>();
        services.AddTransient<WarehouseRepository>();
        services.AddTransient<WarehouseTransactionSearchRepository>();
        services.AddTransient<WarehouseStageActionRepository>();
        services.AddTransient<WarehouseTransactionRepository>();
        services.AddTransient<WarehouseTransactionLineRepository>();
        services.AddTransient<BinRepository>();
        services.AddTransient<ItemBarcodeRepository>();
        services.AddTransient<ZoneRepository>();
        services.AddTransient<UnitCostCalculationRepository>();
        services.AddTransient<UnitCostCalculationLineRepository>();
        services.AddTransient<BundleRepository>();

        #endregion

        return services;
    }
}