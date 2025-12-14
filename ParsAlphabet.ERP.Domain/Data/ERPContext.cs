using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

namespace ParsAlphabet.ERP.Domain.Data;

public partial class ERPContext : DbContext
{
    public ERPContext()
    {
    }

    public ERPContext(DbContextOptions<ERPContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AccountCategory> AccountCategories { get; set; }

    public virtual DbSet<AccountDetail> AccountDetails { get; set; }

    public virtual DbSet<AccountGl> AccountGls { get; set; }

    public virtual DbSet<AccountNatureType> AccountNatureTypes { get; set; }

    public virtual DbSet<AccountSgl> AccountSgls { get; set; }

    public virtual DbSet<AccountSglcurrency> AccountSglcurrencies { get; set; }

    public virtual DbSet<AccountSglnoSeries> AccountSglnoSeries { get; set; }

    public virtual DbSet<AccountSgluser> AccountSglusers { get; set; }

    public virtual DbSet<AccountingPeriod> AccountingPeriods { get; set; }

    public virtual DbSet<ParsAlphabet.ERP.Domain.Models.DatabaseEntities.Action> Actions { get; set; }

    public virtual DbSet<AdmissionCash> AdmissionCashes { get; set; }

    public virtual DbSet<AdmissionCashLine> AdmissionCashLines { get; set; }

    public virtual DbSet<AdmissionClose> AdmissionCloses { get; set; }

    public virtual DbSet<AdmissionCloseLine> AdmissionCloseLines { get; set; }

    public virtual DbSet<AdmissionCloseTempLine> AdmissionCloseTempLines { get; set; }

    public virtual DbSet<AdmissionCounter> AdmissionCounters { get; set; }

    public virtual DbSet<AdmissionCounterType> AdmissionCounterTypes { get; set; }

    public virtual DbSet<AdmissionDental> AdmissionDentals { get; set; }

    public virtual DbSet<AdmissionDentalAbuseHistoryLine> AdmissionDentalAbuseHistoryLines { get; set; }

    public virtual DbSet<AdmissionDentalAdverseReactionLine> AdmissionDentalAdverseReactionLines { get; set; }

    public virtual DbSet<AdmissionDentalDiagnosisLine> AdmissionDentalDiagnosisLines { get; set; }

    public virtual DbSet<AdmissionDentalDrugHistoryLine> AdmissionDentalDrugHistoryLines { get; set; }

    public virtual DbSet<AdmissionDentalDrugOrderedLine> AdmissionDentalDrugOrderedLines { get; set; }

    public virtual DbSet<AdmissionDentalFamilyHisotryLine> AdmissionDentalFamilyHisotryLines { get; set; }

    public virtual DbSet<AdmissionDentalMedicalHistoryLine> AdmissionDentalMedicalHistoryLines { get; set; }

    public virtual DbSet<AdmissionDentalToothLine> AdmissionDentalToothLines { get; set; }

    public virtual DbSet<AdmissionDentalToothLineDetail> AdmissionDentalToothLineDetails { get; set; }

    public virtual DbSet<AdmissionDentalTreatmentLineDetail> AdmissionDentalTreatmentLineDetails { get; set; }

    public virtual DbSet<AdmissionDiagnosis> AdmissionDiagnoses { get; set; }

    public virtual DbSet<AdmissionDropDown> AdmissionDropDowns { get; set; }

    public virtual DbSet<AdmissionHealthClaim> AdmissionHealthClaims { get; set; }

    public virtual DbSet<AdmissionImaging> AdmissionImagings { get; set; }

    public virtual DbSet<AdmissionImagingTemplate> AdmissionImagingTemplates { get; set; }

    public virtual DbSet<AdmissionMaster> AdmissionMasters { get; set; }

    public virtual DbSet<AdmissionPhysiotherapy> AdmissionPhysiotherapies { get; set; }

    public virtual DbSet<AdmissionPhysiotherapyLine> AdmissionPhysiotherapyLines { get; set; }

    public virtual DbSet<AdmissionRefer> AdmissionRefers { get; set; }

    public virtual DbSet<AdmissionReferAbuseHistoryLine> AdmissionReferAbuseHistoryLines { get; set; }

    public virtual DbSet<AdmissionReferAdverseReactionLine> AdmissionReferAdverseReactionLines { get; set; }

    public virtual DbSet<AdmissionReferBloodPressureLine> AdmissionReferBloodPressureLines { get; set; }

    public virtual DbSet<AdmissionReferCareActionLine> AdmissionReferCareActionLines { get; set; }

    public virtual DbSet<AdmissionReferClinicFindingLine> AdmissionReferClinicFindingLines { get; set; }

    public virtual DbSet<AdmissionReferClinicFindingLineDetail> AdmissionReferClinicFindingLineDetails { get; set; }

    public virtual DbSet<AdmissionReferDrugHistoryLine> AdmissionReferDrugHistoryLines { get; set; }

    public virtual DbSet<AdmissionReferDrugOrderedLine> AdmissionReferDrugOrderedLines { get; set; }

    public virtual DbSet<AdmissionReferFollowUp> AdmissionReferFollowUps { get; set; }

    public virtual DbSet<AdmissionReferHeightWeightLine> AdmissionReferHeightWeightLines { get; set; }

    public virtual DbSet<AdmissionReferMedicalHistoryLine> AdmissionReferMedicalHistoryLines { get; set; }

    public virtual DbSet<AdmissionReferPulseLine> AdmissionReferPulseLines { get; set; }

    public virtual DbSet<AdmissionReferType> AdmissionReferTypes { get; set; }

    public virtual DbSet<AdmissionReferVitalSignsLine> AdmissionReferVitalSignsLines { get; set; }

    public virtual DbSet<AdmissionReferWaistHipLine> AdmissionReferWaistHipLines { get; set; }

    public virtual DbSet<AdmissionReferalFamilyHisotryLine> AdmissionReferalFamilyHisotryLines { get; set; }

    public virtual DbSet<AdmissionRevenueAllocation> AdmissionRevenueAllocations { get; set; }

    public virtual DbSet<AdmissionSale> AdmissionSales { get; set; }

    public virtual DbSet<AdmissionSaleLine> AdmissionSaleLines { get; set; }

    public virtual DbSet<AdmissionSaleLinePrice> AdmissionSaleLinePrices { get; set; }

    public virtual DbSet<AdmissionService> AdmissionServices { get; set; }

    public virtual DbSet<AdmissionServiceExtraProperty> AdmissionServiceExtraProperties { get; set; }

    public virtual DbSet<AdmissionServiceExtraPropertyElement> AdmissionServiceExtraPropertyElements { get; set; }

    public virtual DbSet<AdmissionServiceLine> AdmissionServiceLines { get; set; }

    public virtual DbSet<AdmissionServiceLinePrice> AdmissionServiceLinePrices { get; set; }

    public virtual DbSet<AdmissionServiceReimbursement> AdmissionServiceReimbursements { get; set; }

    public virtual DbSet<AdmissionWebServiceResult> AdmissionWebServiceResults { get; set; }

    public virtual DbSet<AggregatedCounter> AggregatedCounters { get; set; }

    public virtual DbSet<AppointmentBookingConfig> AppointmentBookingConfigs { get; set; }

    public virtual DbSet<AppointmentDistributionType> AppointmentDistributionTypes { get; set; }

    public virtual DbSet<AppointmentUnlimitConfig> AppointmentUnlimitConfigs { get; set; }

    public virtual DbSet<Attender> Attenders { get; set; }

    public virtual DbSet<AttenderAssistant> AttenderAssistants { get; set; }

    public virtual DbSet<AttenderMarginBracket> AttenderMarginBrackets { get; set; }

    public virtual DbSet<AttenderMarginBracketLine> AttenderMarginBracketLines { get; set; }

    public virtual DbSet<AttenderRole> AttenderRoles { get; set; }

    public virtual DbSet<AttenderScheduleBlock> AttenderScheduleBlocks { get; set; }

    public virtual DbSet<AttenderServicePrice> AttenderServicePrices { get; set; }

    public virtual DbSet<AttenderTimeSheet> AttenderTimeSheets { get; set; }

    public virtual DbSet<AttenderToken> AttenderTokens { get; set; }

    public virtual DbSet<BalanceInvoice> BalanceInvoices { get; set; }

    public virtual DbSet<BalanceTreasury> BalanceTreasuries { get; set; }

    public virtual DbSet<Bank> Banks { get; set; }

    public virtual DbSet<BankAccount> BankAccounts { get; set; }

    public virtual DbSet<BankAccountCategory> BankAccountCategories { get; set; }

    public virtual DbSet<Bin> Bins { get; set; }

    public virtual DbSet<BinCategory> BinCategories { get; set; }

    public virtual DbSet<BookingType> BookingTypes { get; set; }

    public virtual DbSet<Branch> Branches { get; set; }

    public virtual DbSet<BranchLine> BranchLines { get; set; }

    public virtual DbSet<BranchLineType> BranchLineTypes { get; set; }

    public virtual DbSet<Bundle> Bundles { get; set; }

    public virtual DbSet<BundleLine> BundleLines { get; set; }

    public virtual DbSet<CalculationBasedType> CalculationBasedTypes { get; set; }

    public virtual DbSet<CashFlowCategory> CashFlowCategories { get; set; }

    public virtual DbSet<Cashier> Cashiers { get; set; }

    public virtual DbSet<CashierPo> CashierPos { get; set; }

    public virtual DbSet<CentralProperty> CentralProperties { get; set; }

    public virtual DbSet<CheckUpdate> CheckUpdates { get; set; }

    public virtual DbSet<CoWorkerCompany> CoWorkerCompanies { get; set; }

    public virtual DbSet<CommissionBase> CommissionBases { get; set; }

    public virtual DbSet<CommissionMethod> CommissionMethods { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanyAcceptableParaClinicType> CompanyAcceptableParaClinicTypes { get; set; }

    public virtual DbSet<CompanyType> CompanyTypes { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<CostCategory> CostCategories { get; set; }

    public virtual DbSet<CostCenter> CostCenters { get; set; }

    public virtual DbSet<CostCenterLine> CostCenterLines { get; set; }

    public virtual DbSet<CostDriver> CostDrivers { get; set; }

    public virtual DbSet<CostDriverType> CostDriverTypes { get; set; }

    public virtual DbSet<CostObject> CostObjects { get; set; }

    public virtual DbSet<CostOfGoodsTemplate> CostOfGoodsTemplates { get; set; }

    public virtual DbSet<CostOfGoodsTemplateLine> CostOfGoodsTemplateLines { get; set; }

    public virtual DbSet<CostRelation> CostRelations { get; set; }

    public virtual DbSet<CostType> CostTypes { get; set; }

    public virtual DbSet<CostingMethod> CostingMethods { get; set; }

    public virtual DbSet<Counter> Counters { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<CurrencyExchange> CurrencyExchanges { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerContractType> CustomerContractTypes { get; set; }

    public virtual DbSet<CustomerDiscountGroup> CustomerDiscountGroups { get; set; }

    public virtual DbSet<CustomerSalesPrice> CustomerSalesPrices { get; set; }

    public virtual DbSet<CustomerSalesPriceDetail> CustomerSalesPriceDetails { get; set; }

    public virtual DbSet<DayInWeek> DayInWeeks { get; set; }

    public virtual DbSet<DayOfMonth> DayOfMonths { get; set; }

    public virtual DbSet<DeathCause> DeathCauses { get; set; }

    public virtual DbSet<DeathCertificate> DeathCertificates { get; set; }

    public virtual DbSet<DeathInfantDelivery> DeathInfantDeliveries { get; set; }

    public virtual DbSet<DeathMedicalHistoryLine> DeathMedicalHistoryLines { get; set; }

    public virtual DbSet<DepartmentBranch> DepartmentBranches { get; set; }

    public virtual DbSet<DepartmentTimeShift> DepartmentTimeShifts { get; set; }

    public virtual DbSet<DepartmentTimeShiftLine> DepartmentTimeShiftLines { get; set; }

    public virtual DbSet<DepreciationBook> DepreciationBooks { get; set; }

    public virtual DbSet<DepreciationBookEntryHeader> DepreciationBookEntryHeaders { get; set; }

    public virtual DbSet<DepreciationBookEntryLine> DepreciationBookEntryLines { get; set; }

    public virtual DbSet<DepreciationMethod> DepreciationMethods { get; set; }

    public virtual DbSet<DepreciationPeriodType> DepreciationPeriodTypes { get; set; }

    public virtual DbSet<DestinationType> DestinationTypes { get; set; }

    public virtual DbSet<DocumentAccountHeader> DocumentAccountHeaders { get; set; }

    public virtual DbSet<DocumentAccountLine> DocumentAccountLines { get; set; }

    public virtual DbSet<DocumentType> DocumentTypes { get; set; }

    public virtual DbSet<EducationLevel> EducationLevels { get; set; }

    public virtual DbSet<EliminateHidreason> EliminateHidreasons { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeeContract> EmployeeContracts { get; set; }

    public virtual DbSet<EmployeeContractType> EmployeeContractTypes { get; set; }

    public virtual DbSet<EmployeeShiftTimeSheet> EmployeeShiftTimeSheets { get; set; }

    public virtual DbSet<EmployeeTimeSheet> EmployeeTimeSheets { get; set; }

    public virtual DbSet<ErrorLog> ErrorLogs { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<FavoriteCategory> FavoriteCategories { get; set; }

    public virtual DbSet<FavoriteDescription> FavoriteDescriptions { get; set; }

    public virtual DbSet<FavoriteTamin> FavoriteTamins { get; set; }

    public virtual DbSet<FieldTable> FieldTables { get; set; }

    public virtual DbSet<FinancialStep> FinancialSteps { get; set; }

    public virtual DbSet<FiscalYear> FiscalYears { get; set; }

    public virtual DbSet<FiscalYearLine> FiscalYearLines { get; set; }

    public virtual DbSet<FixedAsset> FixedAssets { get; set; }

    public virtual DbSet<FixedAssetCategory> FixedAssetCategories { get; set; }

    public virtual DbSet<FixedAssetClass> FixedAssetClasses { get; set; }

    public virtual DbSet<FixedAssetLocation> FixedAssetLocations { get; set; }

    public virtual DbSet<FixedAssetMaintenance> FixedAssetMaintenances { get; set; }

    public virtual DbSet<FixedAssetSubClass> FixedAssetSubClasses { get; set; }

    public virtual DbSet<FixedAssetValuationType> FixedAssetValuationTypes { get; set; }

    public virtual DbSet<FundType> FundTypes { get; set; }

    public virtual DbSet<FundTypeAdm> FundTypeAdms { get; set; }

    public virtual DbSet<Gender> Genders { get; set; }

    public virtual DbSet<Hash> Hashes { get; set; }

    public virtual DbSet<HealthId> HealthIds { get; set; }

    public virtual DbSet<HealthIdorder> HealthIdorders { get; set; }

    public virtual DbSet<HealthIdstate> HealthIdstates { get; set; }

    public virtual DbSet<History> Histories { get; set; }

    public virtual DbSet<HoliDay> HoliDays { get; set; }

    public virtual DbSet<Hqstype> Hqstypes { get; set; }

    public virtual DbSet<IncomeBalanceType> IncomeBalanceTypes { get; set; }

    public virtual DbSet<IndustryGroup> IndustryGroups { get; set; }

    public virtual DbSet<Insurer> Insurers { get; set; }

    public virtual DbSet<InsurerLine> InsurerLines { get; set; }

    public virtual DbSet<InsurerPatient> InsurerPatients { get; set; }

    public virtual DbSet<InsurerPrice> InsurerPrices { get; set; }

    public virtual DbSet<InsurerPriceCalculationMethod> InsurerPriceCalculationMethods { get; set; }

    public virtual DbSet<InsurerType> InsurerTypes { get; set; }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<ItemAttribute> ItemAttributes { get; set; }

    public virtual DbSet<ItemAttributeLine> ItemAttributeLines { get; set; }

    public virtual DbSet<ItemBarcode> ItemBarcodes { get; set; }

    public virtual DbSet<ItemCategory> ItemCategories { get; set; }

    public virtual DbSet<ItemCategoryAttribute> ItemCategoryAttributes { get; set; }

    public virtual DbSet<ItemSubUnit> ItemSubUnits { get; set; }

    public virtual DbSet<ItemTax> ItemTaxes { get; set; }

    public virtual DbSet<ItemTransaction> ItemTransactions { get; set; }

    public virtual DbSet<ItemTransactionLine> ItemTransactionLines { get; set; }

    public virtual DbSet<ItemTransactionLineDetail> ItemTransactionLineDetails { get; set; }

    public virtual DbSet<ItemType> ItemTypes { get; set; }

    public virtual DbSet<ItemUnit> ItemUnits { get; set; }

    public virtual DbSet<ItemUnitDetail> ItemUnitDetails { get; set; }

    public virtual DbSet<ItemUnitTax> ItemUnitTaxes { get; set; }

    public virtual DbSet<ItemWarehouse> ItemWarehouses { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<JobParameter> JobParameters { get; set; }

    public virtual DbSet<JobQueue> JobQueues { get; set; }

    public virtual DbSet<Journal> Journals { get; set; }

    public virtual DbSet<JournalLine> JournalLines { get; set; }

    public virtual DbSet<JournalLineDetail> JournalLineDetails { get; set; }

    public virtual DbSet<JournalPostedGroup> JournalPostedGroups { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<List> Lists { get; set; }

    public virtual DbSet<LocCity> LocCities { get; set; }

    public virtual DbSet<LocCountry> LocCountries { get; set; }

    public virtual DbSet<LocState> LocStates { get; set; }

    public virtual DbSet<MadicalLaboratoryResultLineInterpretation> MadicalLaboratoryResultLineInterpretations { get; set; }

    public virtual DbSet<MadicalLaboratoryResultLineInterpretationTemplate> MadicalLaboratoryResultLineInterpretationTemplates { get; set; }

    public virtual DbSet<MaritalStatus> MaritalStatuses { get; set; }

    public virtual DbSet<MedicalItemPrice> MedicalItemPrices { get; set; }

    public virtual DbSet<MedicalLaboratory> MedicalLaboratories { get; set; }

    public virtual DbSet<MedicalLaboratoryBodySite> MedicalLaboratoryBodySites { get; set; }

    public virtual DbSet<MedicalLaboratoryDiagnosis> MedicalLaboratoryDiagnoses { get; set; }

    public virtual DbSet<MedicalLaboratoryMicrobiologicalCulture> MedicalLaboratoryMicrobiologicalCultures { get; set; }

    public virtual DbSet<MedicalLaboratoryPathology> MedicalLaboratoryPathologies { get; set; }

    public virtual DbSet<MedicalLaboratoryPathologyLine> MedicalLaboratoryPathologyLines { get; set; }

    public virtual DbSet<MedicalLaboratoryPathologyLineTemplate> MedicalLaboratoryPathologyLineTemplates { get; set; }

    public virtual DbSet<MedicalLaboratoryPathologyTemplate> MedicalLaboratoryPathologyTemplates { get; set; }

    public virtual DbSet<MedicalLaboratoryReferenceRange> MedicalLaboratoryReferenceRanges { get; set; }

    public virtual DbSet<MedicalLaboratoryReferenceRangeTemplate> MedicalLaboratoryReferenceRangeTemplates { get; set; }

    public virtual DbSet<MedicalLaboratoryRequest> MedicalLaboratoryRequests { get; set; }

    public virtual DbSet<MedicalLaboratoryResult> MedicalLaboratoryResults { get; set; }

    public virtual DbSet<MedicalLaboratoryResultLine> MedicalLaboratoryResultLines { get; set; }

    public virtual DbSet<MedicalLaboratoryResultLineTemplate> MedicalLaboratoryResultLineTemplates { get; set; }

    public virtual DbSet<MedicalLaboratoryResultTemplate> MedicalLaboratoryResultTemplates { get; set; }

    public virtual DbSet<MedicalLaboratorySpeciman> MedicalLaboratorySpecimen { get; set; }

    public virtual DbSet<MedicalLaboratorySpecimenTemplate> MedicalLaboratorySpecimenTemplates { get; set; }

    public virtual DbSet<MedicalLaboratoryTemplate> MedicalLaboratoryTemplates { get; set; }

    public virtual DbSet<MedicalSubject> MedicalSubjects { get; set; }

    public virtual DbSet<Month> Months { get; set; }

    public virtual DbSet<Msctype> Msctypes { get; set; }

    public virtual DbSet<NationalCode> NationalCodes { get; set; }

    public virtual DbSet<Navigation> Navigations { get; set; }

    public virtual DbSet<NavigationOperation> NavigationOperations { get; set; }

    public virtual DbSet<NoSeries> NoSeries { get; set; }

    public virtual DbSet<NoSeriesAssignNextStage> NoSeriesAssignNextStages { get; set; }

    public virtual DbSet<NoSeriesLine> NoSeriesLines { get; set; }

    public virtual DbSet<Notify> Notifies { get; set; }

    public virtual DbSet<ObjectDocumentPostingGroup> ObjectDocumentPostingGroups { get; set; }

    public virtual DbSet<ObjectType> ObjectTypes { get; set; }

    public virtual DbSet<OpenAccountType> OpenAccountTypes { get; set; }

    public virtual DbSet<OperationType> OperationTypes { get; set; }

    public virtual DbSet<OrganizationalDepartment> OrganizationalDepartments { get; set; }

    public virtual DbSet<PageNotify> PageNotifies { get; set; }

    public virtual DbSet<ParGrpCode> ParGrpCodes { get; set; }

    public virtual DbSet<PartnerType> PartnerTypes { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<PatientInfo> PatientInfos { get; set; }

    public virtual DbSet<PatientReferralType> PatientReferralTypes { get; set; }

    public virtual DbSet<PayrollSocialSecurityBracket> PayrollSocialSecurityBrackets { get; set; }

    public virtual DbSet<PayrollTaxBracket> PayrollTaxBrackets { get; set; }

    public virtual DbSet<PayrollTaxBracketLine> PayrollTaxBracketLines { get; set; }

    public virtual DbSet<PersonAccount> PersonAccounts { get; set; }

    public virtual DbSet<PersonGroup> PersonGroups { get; set; }

    public virtual DbSet<PersonGroupType> PersonGroupTypes { get; set; }

    public virtual DbSet<PersonInvoice> PersonInvoices { get; set; }

    public virtual DbSet<PersonInvoiceLine> PersonInvoiceLines { get; set; }

    public virtual DbSet<PersonTitle> PersonTitles { get; set; }

    public virtual DbSet<Po> Pos { get; set; }

    public virtual DbSet<PosPayment> PosPayments { get; set; }

    public virtual DbSet<PosProvider> PosProviders { get; set; }

    public virtual DbSet<PostingGroupAccount> PostingGroupAccounts { get; set; }

    public virtual DbSet<PostingGroupHeader> PostingGroupHeaders { get; set; }

    public virtual DbSet<PostingGroupHeaderDetail> PostingGroupHeaderDetails { get; set; }

    public virtual DbSet<PostingGroupJob> PostingGroupJobs { get; set; }

    public virtual DbSet<PostingGroupLine> PostingGroupLines { get; set; }

    public virtual DbSet<PostingGroupLineDetail> PostingGroupLineDetails { get; set; }

    public virtual DbSet<PostingGroupMethod> PostingGroupMethods { get; set; }

    public virtual DbSet<PostingGroupType> PostingGroupTypes { get; set; }

    public virtual DbSet<PostingGroupTypeLine> PostingGroupTypeLines { get; set; }

    public virtual DbSet<Prescription> Prescriptions { get; set; }

    public virtual DbSet<PrescriptionDrugLine> PrescriptionDrugLines { get; set; }

    public virtual DbSet<PrescriptionDrugLineDetail> PrescriptionDrugLineDetails { get; set; }

    public virtual DbSet<PrescriptionImageLine> PrescriptionImageLines { get; set; }

    public virtual DbSet<PrescriptionImageLineDetail> PrescriptionImageLineDetails { get; set; }

    public virtual DbSet<PrescriptionLabLine> PrescriptionLabLines { get; set; }

    public virtual DbSet<PrescriptionTamin> PrescriptionTamins { get; set; }

    public virtual DbSet<PrescriptionTaminEdit> PrescriptionTaminEdits { get; set; }

    public virtual DbSet<PrescriptionTaminLine> PrescriptionTaminLines { get; set; }

    public virtual DbSet<PrescriptionTaminLineEdit> PrescriptionTaminLineEdits { get; set; }

    public virtual DbSet<PrescriptionType> PrescriptionTypes { get; set; }

    public virtual DbSet<PriceType> PriceTypes { get; set; }

    public virtual DbSet<PricingModel> PricingModels { get; set; }

    public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }

    public virtual DbSet<PurchaseOrderInvoice> PurchaseOrderInvoices { get; set; }

    public virtual DbSet<PurchaseOrderLine> PurchaseOrderLines { get; set; }

    public virtual DbSet<PurchaseOrderLineDetail> PurchaseOrderLineDetails { get; set; }

    public virtual DbSet<ReferringDoctor> ReferringDoctors { get; set; }

    public virtual DbSet<RelationShipType> RelationShipTypes { get; set; }

    public virtual DbSet<ReturnReason> ReturnReasons { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RoleAuthenticate> RoleAuthenticates { get; set; }

    public virtual DbSet<RoleBranchPermission> RoleBranchPermissions { get; set; }

    public virtual DbSet<RoleFiscalYearPermission> RoleFiscalYearPermissions { get; set; }

    public virtual DbSet<RoleStageStepAuthenticate> RoleStageStepAuthenticates { get; set; }

    public virtual DbSet<RoleWorkflowPermission> RoleWorkflowPermissions { get; set; }

    public virtual DbSet<RollCallDevice> RollCallDevices { get; set; }

    public virtual DbSet<SaleOrder> SaleOrders { get; set; }

    public virtual DbSet<SaleOrderActionLog> SaleOrderActionLogs { get; set; }

    public virtual DbSet<SaleOrderLine> SaleOrderLines { get; set; }

    public virtual DbSet<SaleOrderLineDetail> SaleOrderLineDetails { get; set; }

    public virtual DbSet<Schema> Schemas { get; set; }

    public virtual DbSet<Segment> Segments { get; set; }

    public virtual DbSet<SegmentLine> SegmentLines { get; set; }

    public virtual DbSet<SendHistory> SendHistories { get; set; }

    public virtual DbSet<Server> Servers { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceCenter> ServiceCenters { get; set; }

    public virtual DbSet<ServiceType> ServiceTypes { get; set; }

    public virtual DbSet<Set> Sets { get; set; }

    public virtual DbSet<Setup> Setups { get; set; }

    public virtual DbSet<SetupClientWebService> SetupClientWebServices { get; set; }

    public virtual DbSet<SetupHealthCare> SetupHealthCares { get; set; }

    public virtual DbSet<ShareHolder> ShareHolders { get; set; }

    public virtual DbSet<ShipmentMethod> ShipmentMethods { get; set; }

    public virtual DbSet<SignalRgroup> SignalRgroups { get; set; }

    public virtual DbSet<SignalRgroupLine> SignalRgroupLines { get; set; }

    public virtual DbSet<Speciality> Specialities { get; set; }

    public virtual DbSet<Stage> Stages { get; set; }

    public virtual DbSet<StageAction> StageActions { get; set; }

    public virtual DbSet<StageActionLog> StageActionLogs { get; set; }

    public virtual DbSet<StageActionOriginDestination> StageActionOriginDestinations { get; set; }

    public virtual DbSet<StageActionRelation> StageActionRelations { get; set; }

    public virtual DbSet<StageClass> StageClasses { get; set; }

    public virtual DbSet<StageFieldTable> StageFieldTables { get; set; }

    public virtual DbSet<StageFormPlate> StageFormPlates { get; set; }

    public virtual DbSet<StageFundItemType> StageFundItemTypes { get; set; }

    public virtual DbSet<StageStepConfig> StageStepConfigs { get; set; }

    public virtual DbSet<StageStepConfigDetail> StageStepConfigDetails { get; set; }

    public virtual DbSet<StageStepConfigLine> StageStepConfigLines { get; set; }

    public virtual DbSet<StandardTimeSheet> StandardTimeSheets { get; set; }

    public virtual DbSet<StandardTimeSheetHoliday> StandardTimeSheetHolidays { get; set; }

    public virtual DbSet<StandardTimeSheetPerMonth> StandardTimeSheetPerMonths { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<TableName> TableNames { get; set; }

    public virtual DbSet<TaminDrugAmount> TaminDrugAmounts { get; set; }

    public virtual DbSet<TaminDrugInstruction> TaminDrugInstructions { get; set; }

    public virtual DbSet<TaminDrugUsage> TaminDrugUsages { get; set; }

    public virtual DbSet<TaminEprescription> TaminEprescriptions { get; set; }

    public virtual DbSet<TaminIllness> TaminIllnesses { get; set; }

    public virtual DbSet<TaminOrgan> TaminOrgans { get; set; }

    public virtual DbSet<TaminParaClinicType> TaminParaClinicTypes { get; set; }

    public virtual DbSet<TaminParaclinicGroup> TaminParaclinicGroups { get; set; }

    public virtual DbSet<TaminPlan> TaminPlans { get; set; }

    public virtual DbSet<TaminPrescriptionCategory> TaminPrescriptionCategories { get; set; }

    public virtual DbSet<TaminPrescriptionType> TaminPrescriptionTypes { get; set; }

    public virtual DbSet<TaminService> TaminServices { get; set; }

    public virtual DbSet<TaminServiceGroup> TaminServiceGroups { get; set; }

    public virtual DbSet<TaminServicePrescription> TaminServicePrescriptions { get; set; }

    public virtual DbSet<TaminServicePrescriptionOld> TaminServicePrescriptionOlds { get; set; }

    public virtual DbSet<TaminServiceType> TaminServiceTypes { get; set; }

    public virtual DbSet<TaminToken> TaminTokens { get; set; }

    public virtual DbSet<TaskHistory> TaskHistories { get; set; }

    public virtual DbSet<TaskScheduleHistory> TaskScheduleHistories { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamSalesPerson> TeamSalesPeople { get; set; }

    public virtual DbSet<TeethNumber> TeethNumbers { get; set; }

    public virtual DbSet<TeethNumberSystem> TeethNumberSystems { get; set; }

    public virtual DbSet<TempTaminService> TempTaminServices { get; set; }

    public virtual DbSet<Terminology> Terminologies { get; set; }

    public virtual DbSet<TerminologyMap> TerminologyMaps { get; set; }

    public virtual DbSet<ThrAdmissionType> ThrAdmissionTypes { get; set; }

    public virtual DbSet<ThrAdum> ThrAda { get; set; }

    public virtual DbSet<ThrArrivalMode> ThrArrivalModes { get; set; }

    public virtual DbSet<ThrAtc> ThrAtcs { get; set; }

    public virtual DbSet<ThrCdt> ThrCdts { get; set; }

    public virtual DbSet<ThrCountryDivision> ThrCountryDivisions { get; set; }

    public virtual DbSet<ThrDatatype> ThrDatatypes { get; set; }

    public virtual DbSet<ThrDeathCauseStatus> ThrDeathCauseStatuses { get; set; }

    public virtual DbSet<ThrDeathLocation> ThrDeathLocations { get; set; }

    public virtual DbSet<ThrDiagnosisStatus> ThrDiagnosisStatuses { get; set; }

    public virtual DbSet<ThrDurationDeath> ThrDurationDeaths { get; set; }

    public virtual DbSet<ThrErx> ThrErxes { get; set; }

    public virtual DbSet<ThrFdi> ThrFdis { get; set; }

    public virtual DbSet<ThrFdoir> ThrFdoirs { get; set; }

    public virtual DbSet<ThrFollowupPlanType> ThrFollowupPlanTypes { get; set; }

    public virtual DbSet<ThrHq> ThrHqs { get; set; }

    public virtual DbSet<ThrIcd> ThrIcds { get; set; }

    public virtual DbSet<ThrIcdfa> ThrIcdfas { get; set; }

    public virtual DbSet<ThrIcdo3> ThrIcdo3s { get; set; }

    public virtual DbSet<ThrIcpc2p> ThrIcpc2ps { get; set; }

    public virtual DbSet<ThrInjurySeverityType> ThrInjurySeverityTypes { get; set; }

    public virtual DbSet<ThrInsuranceBox> ThrInsuranceBoxes { get; set; }

    public virtual DbSet<ThrInsurer> ThrInsurers { get; set; }

    public virtual DbSet<ThrIrc> ThrIrcs { get; set; }

    public virtual DbSet<ThrJob> ThrJobs { get; set; }

    public virtual DbSet<ThrLifeCycle> ThrLifeCycles { get; set; }

    public virtual DbSet<ThrLnc> ThrLncs { get; set; }

    public virtual DbSet<ThrLncmap> ThrLncmaps { get; set; }

    public virtual DbSet<ThrMediumType> ThrMediumTypes { get; set; }

    public virtual DbSet<ThrNcpdp> ThrNcpdps { get; set; }

    public virtual DbSet<ThrOrdinalTerm> ThrOrdinalTerms { get; set; }

    public virtual DbSet<ThrOrganization> ThrOrganizations { get; set; }

    public virtual DbSet<ThrPoint> ThrPoints { get; set; }

    public virtual DbSet<ThrProporation> ThrProporations { get; set; }

    public virtual DbSet<ThrReferredReason> ThrReferredReasons { get; set; }

    public virtual DbSet<ThrReferredType> ThrReferredTypes { get; set; }

    public virtual DbSet<ThrRelatedPerson> ThrRelatedPeople { get; set; }

    public virtual DbSet<ThrRvu> ThrRvus { get; set; }

    public virtual DbSet<ThrServiceCountUnit> ThrServiceCountUnits { get; set; }

    public virtual DbSet<ThrServiceType> ThrServiceTypes { get; set; }

    public virtual DbSet<ThrSnomedct> ThrSnomedcts { get; set; }

    public virtual DbSet<ThrSourceofDeathNotification> ThrSourceofDeathNotifications { get; set; }

    public virtual DbSet<ThrSpecialty> ThrSpecialties { get; set; }

    public virtual DbSet<ThrSpecimenAdequacy> ThrSpecimenAdequacies { get; set; }

    public virtual DbSet<ThrThritaEhr> ThrThritaEhrs { get; set; }

    public virtual DbSet<ThrUcum> ThrUcums { get; set; }

    public virtual DbSet<ThrUsage> ThrUsages { get; set; }

    public virtual DbSet<TransactionToken> TransactionTokens { get; set; }

    public virtual DbSet<Treasury> Treasuries { get; set; }

    public virtual DbSet<TreasuryBond> TreasuryBonds { get; set; }

    public virtual DbSet<TreasuryBondDesign> TreasuryBondDesigns { get; set; }

    public virtual DbSet<TreasuryLine> TreasuryLines { get; set; }

    public virtual DbSet<TreasuryLineDetail> TreasuryLineDetails { get; set; }

    public virtual DbSet<TreasurySubject> TreasurySubjects { get; set; }

    public virtual DbSet<TreasurySubjectLine> TreasurySubjectLines { get; set; }

    public virtual DbSet<UnitCostCalculation> UnitCostCalculations { get; set; }

    public virtual DbSet<UnitCostCalculationLine> UnitCostCalculationLines { get; set; }

    public virtual DbSet<UnitCostCalculationLineDetail> UnitCostCalculationLineDetails { get; set; }

    public virtual DbSet<UrlWhiteList> UrlWhiteLists { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLanguage> UserLanguages { get; set; }

    public virtual DbSet<UserWarehouse> UserWarehouses { get; set; }

    public virtual DbSet<Vat> Vats { get; set; }

    public virtual DbSet<Vatarea> Vatareas { get; set; }

    public virtual DbSet<Vattype> Vattypes { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    public virtual DbSet<VendorGroup> VendorGroups { get; set; }

    public virtual DbSet<VendorItem> VendorItems { get; set; }

    public virtual DbSet<VendorItemPrice> VendorItemPrices { get; set; }

    public virtual DbSet<Warehouse> Warehouses { get; set; }

    public virtual DbSet<Workflow> Workflows { get; set; }

    public virtual DbSet<WorkflowBranch> WorkflowBranches { get; set; }

    public virtual DbSet<WorkflowCategory> WorkflowCategories { get; set; }

    public virtual DbSet<WorkflowCategoryLine> WorkflowCategoryLines { get; set; }

    public virtual DbSet<WorkflowStage> WorkflowStages { get; set; }

    public virtual DbSet<WorkingHourType> WorkingHourTypes { get; set; }

    public virtual DbSet<WorkingHourTypeLine> WorkingHourTypeLines { get; set; }

    public virtual DbSet<WorkingHourTypeLineDetail> WorkingHourTypeLineDetails { get; set; }

    public virtual DbSet<WorkingOperator> WorkingOperators { get; set; }

    public virtual DbSet<Zone> Zones { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=.; Initial Catalog=ERP;Integrated Security=true;TrustServerCertificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountCategory>(entity =>
        {
            entity.ToTable("AccountCategory", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AccountDetail>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CompanyId });

            entity.ToTable("AccountDetail", "fm");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<AccountGl>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CompanyId });

            entity.ToTable("AccountGL", "fm");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AccountNatureType>(entity =>
        {
            entity.ToTable("AccountNatureType", "fm");

            entity.Property(e => e.Name).HasMaxLength(10);
            entity.Property(e => e.NameEng)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AccountSgl>(entity =>
        {
            entity.HasKey(e => new { e.Glid, e.Id, e.CompanyId });

            entity.ToTable("AccountSGL", "fm");

            entity.Property(e => e.Glid).HasColumnName("GLId");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AccountSglcurrency>(entity =>
        {
            entity.HasKey(e => new { e.AccountGlid, e.AccountSglid, e.CurrencyId, e.CompanyId });

            entity.ToTable("AccountSGLCurrency", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
        });

        modelBuilder.Entity<AccountSglnoSeries>(entity =>
        {
            entity.HasKey(e => new { e.AccountGlid, e.AccountSglid, e.NoSeriesId, e.CompanyId });

            entity.ToTable("AccountSGLNoSeries", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
        });

        modelBuilder.Entity<AccountSgluser>(entity =>
        {
            entity.ToTable("AccountSGLUser", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AccountingPeriod>(entity =>
        {
            entity.ToTable("AccountingPeriod", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ParsAlphabet.ERP.Domain.Models.DatabaseEntities.Action>(entity =>
        {
            entity.ToTable("Action", "wf");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
        });

        modelBuilder.Entity<AdmissionCash>(entity =>
        {
            entity.ToTable("AdmissionCash", "mc");

            entity.Property(e => e.CashAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifyDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionCashLine>(entity =>
        {
            entity.ToTable("AdmissionCashLine", "mc");

            entity.Property(e => e.AccountNo)
                .HasMaxLength(18)
                .IsUnicode(false);
            entity.Property(e => e.Amount).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.CardNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasPrecision(3);
            entity.Property(e => e.ExchangeRate).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.RefNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.TerminalNo)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AdmissionClose>(entity =>
        {
            entity.ToTable("AdmissionClose", "mc");

            entity.Property(e => e.CloseDateTime).HasColumnType("datetime");
            entity.Property(e => e.CreateDatetime).HasColumnType("datetime");
            entity.Property(e => e.WorkDayDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionCloseLine>(entity =>
        {
            entity.ToTable("AdmissionCloseLine", "mc");

            entity.Property(e => e.Amount).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.DecimalAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.ExchangeRate).HasColumnType("numeric(15, 3)");
        });

        modelBuilder.Entity<AdmissionCloseTempLine>(entity =>
        {
            entity.ToTable("AdmissionCloseTempLine", "mc");

            entity.Property(e => e.Amount).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.ExchangeRate).HasColumnType("numeric(18, 3)");
        });

        modelBuilder.Entity<AdmissionCounter>(entity =>
        {
            entity.ToTable("AdmissionCounter", "mc");
        });

        modelBuilder.Entity<AdmissionCounterType>(entity =>
        {
            entity.ToTable("AdmissionCounterType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AdmissionDental>(entity =>
        {
            entity.ToTable("AdmissionDental", "mc");

            entity.Property(e => e.CompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CompositionUID");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Isqueriable).HasColumnName("ISQueriable");
            entity.Property(e => e.MessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MessageUID");
            entity.Property(e => e.PersonUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PersonUID");
            entity.Property(e => e.ReferralId)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.ReferringDoctorMscId)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.RelatedHid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("RelatedHID");
            entity.Property(e => e.SentDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDentalAbuseHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.RowNumber, e.HeaderId }).HasName("PK_AdmissionDentalAbuseHistory");

            entity.ToTable("AdmissionDentalAbuseHistoryLine", "mc");

            entity.Property(e => e.AbuseDuration).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.AmountOfAbuseDosage).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionDentalAdverseReactionLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber }).HasName("PK_AdmissionDentalAdverseReaction");

            entity.ToTable("AdmissionDentalAdverseReactionLine", "mc");

            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.DiagnosisSeverityId).HasComment("thrOrdinalTerm");
        });

        modelBuilder.Entity<AdmissionDentalDiagnosisLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDentalDiagnosisLine", "mc");

            entity.Property(e => e.Comment).HasMaxLength(300);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDentalDrugHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDentalDrugHistoryLine", "mc");

            entity.Property(e => e.MedicationId).HasComment("thrFDOIR");
        });

        modelBuilder.Entity<AdmissionDentalDrugOrderedLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDentalDrugOrderedLine", "mc");

            entity.Property(e => e.AdministrationDateTime).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.Dosage).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.DrugGenericName).HasMaxLength(50);
            entity.Property(e => e.LongTerm).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionDentalFamilyHisotryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber }).HasName("PK_AdmissionDentalFamilyHisotry");

            entity.ToTable("AdmissionDentalFamilyHisotryLine", "mc");

            entity.Property(e => e.ConditionId).HasComment("thrICD");
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        modelBuilder.Entity<AdmissionDentalMedicalHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDentalMedicalHistoryLine", "mc");

            entity.Property(e => e.ConditionId).HasComment("thrICD");
            entity.Property(e => e.DateOfOnset).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.OnsetDurationToPresent).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionDentalToothLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDentalToothLine", "mc");

            entity.Property(e => e.Comment).HasMaxLength(300);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDentalToothLineDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber, e.DetailRowNumber }).HasName("PK_AdmissionDentalToothLineDetail_1");

            entity.ToTable("AdmissionDentalToothLineDetail", "mc");

            entity.Property(e => e.Comment).HasMaxLength(300);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDentalTreatmentLineDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber, e.DetailRowNumber }).HasName("PK_AdmissionDentalTreatmentLineDetail_1");

            entity.ToTable("AdmissionDentalTreatmentLineDetail", "mc");

            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.ServiceCount).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.ServiceTypeId)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.StartDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDiagnosis>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionDiagnosis", "mc");

            entity.Property(e => e.Comment).HasMaxLength(300);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionDropDown>(entity =>
        {
            entity.ToTable("AdmissionDropDown", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AdmissionHealthClaim>(entity =>
        {
            entity.HasKey(e => new { e.InsurerId, e.CompanyId });

            entity.ToTable("AdmissionHealthClaim", "mc");
        });

        modelBuilder.Entity<AdmissionImaging>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_DocumentImaging");

            entity.ToTable("AdmissionImaging", "mc");

            entity.Property(e => e.BasicInsurerNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Hid)
                .HasMaxLength(20)
                .HasColumnName("HID");
        });

        modelBuilder.Entity<AdmissionImagingTemplate>(entity =>
        {
            entity.ToTable("AdmissionImagingTemplate", "mc");

            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Subject).HasMaxLength(100);
        });

        modelBuilder.Entity<AdmissionMaster>(entity =>
        {
            entity.ToTable("AdmissionMaster", "mc");

            entity.Property(e => e.Amount)
                .HasComment("مبلغ کل پرونده با احتساب موارد مرجوع شده")
                .HasColumnType("decimal(15, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.PayableAmount)
                .HasComment("مبلغ کل پرونده که باید پرداخت شود")
                .HasColumnType("decimal(15, 3)");
        });

        modelBuilder.Entity<AdmissionPhysiotherapy>(entity =>
        {
            entity.ToTable("AdmissionPhysiotherapy", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ErequestId).HasColumnName("ERequestId");
        });

        modelBuilder.Entity<AdmissionPhysiotherapyLine>(entity =>
        {
            entity.ToTable("AdmissionPhysiotherapyLine", "mc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ErequestId).HasColumnName("ERequestId");
            entity.Property(e => e.ServiceTarefCode)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<AdmissionRefer>(entity =>
        {
            entity.ToTable("AdmissionRefer", "mc");

            entity.Property(e => e.AdmitingDoctorMscId)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CompositionUID");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Isqueriable).HasColumnName("ISQueriable");
            entity.Property(e => e.MessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MessageUID");
            entity.Property(e => e.PersonUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PersonUID");
            entity.Property(e => e.ReferralId)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.ReferredDescription).HasMaxLength(200);
            entity.Property(e => e.ReferringDoctorMscId)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.RelatedHid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("RelatedHID");
            entity.Property(e => e.SentDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionReferAbuseHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.RowNumber, e.HeaderId }).HasName("PK_AdmissionReferAbuseHistory");

            entity.ToTable("AdmissionReferAbuseHistoryLine", "mc");

            entity.Property(e => e.AbuseDuration).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.AmountOfAbuseDosage).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferAdverseReactionLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber }).HasName("PK_AdmissionReferAdverseReaction");

            entity.ToTable("AdmissionReferAdverseReactionLine", "mc");

            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.DiagnosisSeverityId).HasComment("thrOrdinalTerm");
        });

        modelBuilder.Entity<AdmissionReferBloodPressureLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber }).HasName("PK_AdmissionReferBloodPressure");

            entity.ToTable("AdmissionReferBloodPressureLine", "mc");

            entity.Property(e => e.DiastolicBp)
                .HasColumnType("numeric(6, 2)")
                .HasColumnName("DiastolicBP");
            entity.Property(e => e.ObservationDateTime).HasColumnType("datetime");
            entity.Property(e => e.SystolicBp)
                .HasColumnType("numeric(6, 2)")
                .HasColumnName("SystolicBP");
        });

        modelBuilder.Entity<AdmissionReferCareActionLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferCareActionLine", "mc");

            entity.Property(e => e.ActionDescription).HasMaxLength(100);
            entity.Property(e => e.ActionNameId).HasComment("ارتباط با جدول RVU");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.StartDateTime).HasColumnType("datetime");
            entity.Property(e => e.TimeTaken).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferClinicFindingLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferClinicFindingLine", "mc");

            entity.Property(e => e.AgeOfOnset).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.FindingId).HasComment("thrICD");
            entity.Property(e => e.OnsetDateTime).HasColumnType("datetime");
            entity.Property(e => e.OnsetDurationToPresent).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferClinicFindingLineDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber, e.DetailRowNumber });

            entity.ToTable("AdmissionReferClinicFindingLineDetail", "mc");
        });

        modelBuilder.Entity<AdmissionReferDrugHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferDrugHistoryLine", "mc");

            entity.Property(e => e.MedicationId).HasComment("thrFDOIR");
        });

        modelBuilder.Entity<AdmissionReferDrugOrderedLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferDrugOrderedLine", "mc");

            entity.Property(e => e.AdministrationDateTime).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.Dosage).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.DrugGenericName).HasMaxLength(50);
            entity.Property(e => e.LongTerm).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferFollowUp>(entity =>
        {
            entity.HasKey(e => e.HeaderId).HasName("PK_FollowUp");

            entity.ToTable("AdmissionReferFollowUp", "mc");

            entity.Property(e => e.HeaderId).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.NextEncounterDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<AdmissionReferHeightWeightLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferHeightWeightLine", "mc");

            entity.Property(e => e.Height).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.ObservationDateTime).HasColumnType("datetime");
            entity.Property(e => e.Weight).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferMedicalHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferMedicalHistoryLine", "mc");

            entity.Property(e => e.ConditionId).HasComment("thrICD");
            entity.Property(e => e.DateOfOnset).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.OnsetDurationToPresent).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferPulseLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferPulseLine", "mc");

            entity.Property(e => e.ClinicalDescription).HasMaxLength(100);
            entity.Property(e => e.ObservationDateTime).HasColumnType("datetime");
            entity.Property(e => e.PulseRate).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferType>(entity =>
        {
            entity.ToTable("AdmissionReferType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AdmissionReferVitalSignsLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferVitalSignsLine", "mc");

            entity.Property(e => e.ObservationDateTime).HasColumnType("datetime");
            entity.Property(e => e.PulseRate).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.RespiratoryRate).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.Temperature).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferWaistHipLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("AdmissionReferWaistHipLine", "mc");

            entity.Property(e => e.HipCircumference).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.ObservationDateTime).HasColumnType("datetime");
            entity.Property(e => e.WaistCircumference).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<AdmissionReferalFamilyHisotryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber }).HasName("PK_AdmissionReferalFamilyHisotry");

            entity.ToTable("AdmissionReferalFamilyHisotryLine", "mc");

            entity.Property(e => e.ConditionId).HasComment("thrICD");
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        modelBuilder.Entity<AdmissionRevenueAllocation>(entity =>
        {
            entity.HasKey(e => new { e.ReserveDate, e.AttenderId, e.BranchId }).HasName("PK_AdmissionRevenueAllocation_1");

            entity.ToTable("AdmissionRevenueAllocation", "mc");
        });

        modelBuilder.Entity<AdmissionSale>(entity =>
        {
            entity.ToTable("AdmissionSale", "mc");

            entity.Property(e => e.AdmissionAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiscountInsurerId).IsSparse();
            entity.Property(e => e.ModifyDateTime).HasColumnType("datetime");
            entity.Property(e => e.ThirdPartyInsurerId).IsSparse();
        });

        modelBuilder.Entity<AdmissionSaleLine>(entity =>
        {
            entity.ToTable("AdmissionSaleLine", "mc");

            entity.Property(e => e.AttributeIds)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.BasicShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.NetAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.PatientShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.ThirdPartyAmount).HasColumnType("numeric(15, 3)");
        });

        modelBuilder.Entity<AdmissionSaleLinePrice>(entity =>
        {
            entity.HasKey(e => e.AdmissionSaleLineId);

            entity.ToTable("AdmissionSaleLinePrice", "mc");

            entity.Property(e => e.AdmissionSaleLineId).ValueGeneratedNever();
            entity.Property(e => e.BasicItemPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.BasicPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompItemPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountItemPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.ThirdPartyItemPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.ThirdPartyPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.Vatpercentage).HasColumnName("VATPercentage");
            entity.Property(e => e.VendorCommissionAmount).HasColumnType("numeric(18, 3)");
        });

        modelBuilder.Entity<AdmissionService>(entity =>
        {
            entity.ToTable("AdmissionService", "mc");

            entity.Property(e => e.AdmissionAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.AdmissionPenaltyAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.AdmissionRemainedAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.BasicInsurerBookletPageNo)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.BasicInsurerNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiscountInsurerId).IsSparse();
            entity.Property(e => e.ModifyDateTime).HasColumnType("datetime");
            entity.Property(e => e.ReserveTime).HasPrecision(0);
            entity.Property(e => e.ThirdPartyInsurerId).IsSparse();
        });

        modelBuilder.Entity<AdmissionServiceExtraProperty>(entity =>
        {
            entity.HasKey(e => new { e.AdmissionServiceId, e.ElementId });

            entity.ToTable("AdmissionServiceExtraProperty", "mc");

            entity.Property(e => e.ElementValue).HasMaxLength(500);
        });

        modelBuilder.Entity<AdmissionServiceExtraPropertyElement>(entity =>
        {
            entity.ToTable("AdmissionServiceExtraPropertyElements", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ElementName).HasMaxLength(100);
            entity.Property(e => e.ElementNameEn)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AdmissionServiceLine>(entity =>
        {
            entity.ToTable("AdmissionServiceLine", "mc");

            entity.Property(e => e.BasicShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.NetAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.PatientShareAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.PenaltyAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.RemainedAmount).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.ThirdPartyAmount).HasColumnType("numeric(15, 3)");
        });

        modelBuilder.Entity<AdmissionServiceLinePrice>(entity =>
        {
            entity.HasKey(e => e.AdmissionServiceLineId);

            entity.ToTable("AdmissionServiceLinePrice", "mc");

            entity.Property(e => e.AdmissionServiceLineId).ValueGeneratedNever();
            entity.Property(e => e.AttenderCommissionAmount).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.AttenderCommissionValue).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.BasicPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.BasicServicePrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CompServicePrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.DiscountServicePrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.ThirdPartyPrice).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.ThirdPartyServicePrice).HasColumnType("numeric(15, 3)");
        });

        modelBuilder.Entity<AdmissionServiceReimbursement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_AdmissionServiceConfirmPrice");

            entity.ToTable("AdmissionServiceReimbursement", "mc");

            entity.Property(e => e.ConfirmedBasicSharePrice).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.ConfirmedCompSharePrice).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.ConfirmedDeduction).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.ConfirmedPatientSharePrice).HasColumnType("decimal(15, 3)");
        });

        modelBuilder.Entity<AdmissionWebServiceResult>(entity =>
        {
            entity.ToTable("AdmissionWebServiceResult", "mc");

            entity.Property(e => e.EliminateHiddateTime)
                .HasColumnType("datetime")
                .HasColumnName("EliminateHIDDateTime");
            entity.Property(e => e.EliminateHidresult).HasColumnName("EliminateHIDResult");
            entity.Property(e => e.PersonUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("شناسه مراجعه کننده")
                .HasColumnName("PersonUID");
            entity.Property(e => e.RembCompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("شناسه مراجعه")
                .HasColumnName("RembCompositionUID");
            entity.Property(e => e.RembDateTime).HasColumnType("datetime");
            entity.Property(e => e.RembMessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("شناسه تراکنش")
                .HasColumnName("RembMessageUID");
            entity.Property(e => e.SaveBillCompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("شناسه مراجعه")
                .HasColumnName("SaveBillCompositionUID");
            entity.Property(e => e.SaveBillDateTime).HasColumnType("datetime");
            entity.Property(e => e.SaveBillMessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("شناسه تراکنش")
                .HasColumnName("SaveBillMessageUID");
            entity.Property(e => e.UpdateHidonlineDateTime)
                .HasColumnType("datetime")
                .HasColumnName("UpdateHIDOnlineDateTime");
            entity.Property(e => e.UpdateHidresult).HasColumnName("UpdateHIDResult");
        });

        modelBuilder.Entity<AggregatedCounter>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK_HangFire_CounterAggregated");

            entity.ToTable("AggregatedCounter", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<AppointmentBookingConfig>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_AppointmentConfiguration");

            entity.ToTable("AppointmentBookingConfig", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<AppointmentDistributionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_DistributionType");

            entity.ToTable("AppointmentDistributionType", "mc");

            entity.Property(e => e.Id).HasComment("شناسه نحوه توزیع نوبت های آنلاین و حضوری\r\n1- آنلاین اول / آفلاین آخر\r\n2- آنلاین آخر / آفلاین اول\r\n3- آنلاین/آفلاین (یک در میان )\r\n");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AppointmentUnlimitConfig>(entity =>
        {
            entity.ToTable("AppointmentUnlimitConfig", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.UnlimitMaxNo).HasComment("تعداد حداکثر نوبت ها در صورت انتخاب نوبت آفلاین نامحدود");
        });

        modelBuilder.Entity<Attender>(entity =>
        {
            entity.ToTable("Attender", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.ContractTypeName)
                .IsRequired()
                .HasMaxLength(12);
            entity.Property(e => e.FatherName).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(30);
            entity.Property(e => e.FullName).HasMaxLength(81);
            entity.Property(e => e.IdNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.Msc)
                .HasMaxLength(10)
                .HasColumnName("MSC");
            entity.Property(e => e.MscExpDate).HasColumnName("MSC_ExpDate");
            entity.Property(e => e.MscTypeId).HasColumnName("MSC_TypeId");
            entity.Property(e => e.NationalCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PrescriptionTypeId)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AttenderAssistant>(entity =>
        {
            entity.HasKey(e => new { e.AttenderId, e.UserId }).HasName("PK_Assistant");

            entity.ToTable("AttenderAssistant", "mc");
        });

        modelBuilder.Entity<AttenderMarginBracket>(entity =>
        {
            entity.ToTable("AttenderMarginBracket", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasComment("نام حق الزحمهطبیب مربوط به یک دپارتمان");
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasComment("نام لاتین حق الزحمهطبیب مربوط به یک دپارتمان");
        });

        modelBuilder.Entity<AttenderMarginBracketLine>(entity =>
        {
            entity.ToTable("AttenderMarginBracketLine", "mc");

            entity.Property(e => e.AttenderCommissionValue).HasColumnType("numeric(15, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.EndAmount)
                .HasComment("مبلغ پایان پله پرداخت")
                .HasColumnType("numeric(12, 0)");
            entity.Property(e => e.HeaderId).HasComment("شناسه انواع حق الزحمهطبیب در یک دپارتمان");
            entity.Property(e => e.PriceTypeId).HasComment("نوع محاسبه قیمت: درصد یا نرخ");
            entity.Property(e => e.RowNumber).HasComment("شماره ردیف به ازای هر شناسه نوع حق الزحمهطبیب");
            entity.Property(e => e.StartAmount)
                .HasComment("مبلغ شروع پله پرداخت")
                .HasColumnType("numeric(12, 0)");
        });

        modelBuilder.Entity<AttenderRole>(entity =>
        {
            entity.ToTable("AttenderRole", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<AttenderScheduleBlock>(entity =>
        {
            entity.ToTable("AttenderScheduleBlock", "mc", tb => tb.HasComment("بلوک های زمانی که هر پزشک بر اساس شیفتش و تعداد بیمارانی که باید در آن شیفت ببیند در این جدول قرار میگیرد. هر ردیف در این جدول نمایانگر یک نوبت خالی است."));

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.EndTime).HasPrecision(0);
            entity.Property(e => e.ReserveDateTime).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasPrecision(0);
            entity.Property(e => e.TrackingCode)
                .HasMaxLength(12)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<AttenderServicePrice>(entity =>
        {
            entity.ToTable("AttenderServicePrice", "mc");

            entity.Property(e => e.AttenderId).HasComment("شناسه طبیب");
            entity.Property(e => e.AttenderMarginBracketId).HasComment("شناسه انواع حق الزحمهطبیب در یک دپارتمان");
            entity.Property(e => e.CreateDateTime)
                .HasComment("آخرین تاریخ تغییر ردیف")
                .HasColumnType("datetime");
            entity.Property(e => e.CreateUserId).HasComment("شناسه آخرین کاربری که ردیف را تغییر داده است");
        });

        modelBuilder.Entity<AttenderTimeSheet>(entity =>
        {
            entity.ToTable("AttenderTimeSheet", "mc", tb => tb.HasComment("حضور یک پزشک در یک روز و یک شیفت خاص در این جدول قرار می گیرد."));

            entity.Property(e => e.AppointmentDistributionTypeId).HasComment("شناسه نحوه توزیع نوبت های آنلاین و حضوری");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DepartmentTimeShiftId).HasComment("شناسه شیفت");
            entity.Property(e => e.EndTime).HasPrecision(0);
            entity.Property(e => e.IsOfflineBookingUnlimit).HasComment("1:غیرفعال\r\n2:نامحدود\r\n3:محدود");
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
            entity.Property(e => e.NumberOfflineAppointment).HasComment("تعداد نوبت حضوری");
            entity.Property(e => e.NumberOnlineAppointment).HasComment("تعداد نوبت آنلاین");
            entity.Property(e => e.StartTime).HasPrecision(0);
            entity.Property(e => e.WorkDayDate).HasComment("تاریخ روز کاری");
        });

        modelBuilder.Entity<AttenderToken>(entity =>
        {
            entity.ToTable("AttenderToken", "mc");

            entity.Property(e => e.WebServiceOrgGuid)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("WebService_Org_Guid");
        });

        modelBuilder.Entity<BalanceInvoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_BalancePurchase");

            entity.ToTable("BalanceInvoice", "pu");

            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.BalanceDiscountAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.BalanceGrossAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.BalanceQuantity).HasColumnType("numeric(8, 3)");
            entity.Property(e => e.BalanceVatAmount).HasColumnType("numeric(21, 3)");
        });

        modelBuilder.Entity<BalanceTreasury>(entity =>
        {
            entity.ToTable("BalanceTreasury", "fm");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Bank>(entity =>
        {
            entity.ToTable("Bank", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BankAccount>(entity =>
        {
            entity.ToTable("BankAccount", "fm");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AccountNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.BranchName).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ShebaNo)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BankAccountCategory>(entity =>
        {
            entity.ToTable("BankAccountCategory", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Bin>(entity =>
        {
            entity.ToTable("Bin", "wh");

            entity.Property(e => e.BinRankId).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<BinCategory>(entity =>
        {
            entity.ToTable("BinCategory", "wh");

            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.NameEng)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BookingType>(entity =>
        {
            entity.ToTable("BookingType", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.ToTable("Branch", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BranchLine>(entity =>
        {
            entity.ToTable("BranchLine", "gn");

            entity.Property(e => e.BranchLineTypeId).HasComment("");
            entity.Property(e => e.Value).HasMaxLength(50);
        });

        modelBuilder.Entity<BranchLineType>(entity =>
        {
            entity.ToTable("BranchLineType", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Bundle>(entity =>
        {
            entity.ToTable("Bundle", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BundleLine>(entity =>
        {
            entity.ToTable("BundleLine", "mc");

            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.QtyFinal).HasColumnType("decimal(8, 3)");
            entity.Property(e => e.Ratio).HasColumnType("decimal(8, 3)");
        });

        modelBuilder.Entity<CalculationBasedType>(entity =>
        {
            entity.ToTable("CalculationBasedType", "hr");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<CashFlowCategory>(entity =>
        {
            entity.ToTable("CashFlowCategory", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Cashier>(entity =>
        {
            entity.ToTable("Cashier", "fm");

            entity.Property(e => e.IpAddress).HasMaxLength(27);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CashierPo>(entity =>
        {
            entity.ToTable("CashierPos", "fm");
        });

        modelBuilder.Entity<CentralProperty>(entity =>
        {
            entity.ToTable("CentralProperties", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IssuerSigningKey).HasMaxLength(200);
            entity.Property(e => e.ValidAudience).HasMaxLength(50);
            entity.Property(e => e.ValidIssuer).HasMaxLength(50);
        });

        modelBuilder.Entity<CheckUpdate>(entity =>
        {
            entity.ToTable("CheckUpdate", "HangFire");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<CoWorkerCompany>(entity =>
        {
            entity.ToTable("CoWorkerCompany", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CommissionBase>(entity =>
        {
            entity.ToTable("CommissionBase", "sm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Note)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CommissionMethod>(entity =>
        {
            entity.ToTable("CommissionMethod", "sm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.ArmedInsuranceIdentity)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ArmedInsuranceName).HasMaxLength(50);
            entity.Property(e => e.DefaultCurrencyId).HasComment("ارز پیش فرض");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EncryptionKey)
                .HasMaxLength(50)
                .HasComment("کلیدی که با PublicKey رمز می شود و به نود ارسال می شود تا نود یک توکن به erp اختصاص دهد");
            entity.Property(e => e.IdNumber)
                .HasMaxLength(15)
                .HasComment("شماره ثبت / شماره شناسنامه");
            entity.Property(e => e.IncomeTaxPer).HasComment("مالیات عملکرد");
            entity.Property(e => e.ManagerFirstName).HasMaxLength(50);
            entity.Property(e => e.ManagerLastName).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NationCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasComment("شناسه ملی/کدملی");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .HasComment("رمز عبور erp برای ارسال اطلاعات به نود");
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PublicKey)
                .HasMaxLength(1000)
                .HasComment("کلید عمومی برای  رمز کردن EncryptionKey مربوط به ارسال اطلاعات از erp به نود");
            entity.Property(e => e.SiamId).HasMaxLength(50);
            entity.Property(e => e.TaminInsuranceIdentity)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaxCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasComment("کد اقتصادی");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .HasComment("نام کاربری erp برای ارسال اطلاعات به نود");
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.WebServiceOrgGuid)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("WebService_Org_Guid");
            entity.Property(e => e.WebServiceOrgTerminologyId).HasColumnName("WebService_Org_TerminologyId");
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CompanyAcceptableParaClinicType>(entity =>
        {
            entity.ToTable("CompanyAcceptableParaClinicType", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.AcceptableParaClinicTypeId).HasMaxLength(50);
        });

        modelBuilder.Entity<CompanyType>(entity =>
        {
            entity.ToTable("CompanyType", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.EngName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CompanyId });

            entity.ToTable("Contact", "cr");

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.AgentFullName).HasMaxLength(70);
            entity.Property(e => e.BrandName).HasMaxLength(50);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.IdNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.JobTitle).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaxCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VatareaId).HasColumnName("VATAreaId");
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.Vatinclude).HasColumnName("VATInclude");
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostCategory>(entity =>
        {
            entity.ToTable("CostCategory", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostCenter>(entity =>
        {
            entity.ToTable("CostCenter", "fm");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostCenterLine>(entity =>
        {
            entity.ToTable("CostCenterLine", "fm");
        });

        modelBuilder.Entity<CostDriver>(entity =>
        {
            entity.ToTable("CostDriver", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostDriverType>(entity =>
        {
            entity.ToTable("CostDriverType", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostObject>(entity =>
        {
            entity.ToTable("CostObject", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostOfGoodsTemplate>(entity =>
        {
            entity.ToTable("CostOfGoodsTemplate", "fm");

            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<CostOfGoodsTemplateLine>(entity =>
        {
            entity.ToTable("CostOfGoodsTemplateLine", "fm");
        });

        modelBuilder.Entity<CostRelation>(entity =>
        {
            entity.ToTable("CostRelation", "fm");
        });

        modelBuilder.Entity<CostType>(entity =>
        {
            entity.ToTable("CostType", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CostingMethod>(entity =>
        {
            entity.ToTable("CostingMethod", "wh");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Counter>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Id }).HasName("PK_HangFire_Counter");

            entity.ToTable("Counter", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.ToTable("Currency", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.NameEng)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CurrencyExchange>(entity =>
        {
            entity.ToTable("CurrencyExchange", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.PurchaseRate).HasColumnType("numeric(8, 0)");
            entity.Property(e => e.SalesRate).HasColumnType("numeric(8, 0)");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CompanyId });

            entity.ToTable("Customer", "sm");

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.AgentFullName).HasMaxLength(70);
            entity.Property(e => e.BrandName).HasMaxLength(50);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.IdNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.InsuranceNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.JobTitle).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaxCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VatareaId).HasColumnName("VATAreaId");
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.Vatinclude).HasColumnName("VATInclude");
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CustomerContractType>(entity =>
        {
            entity.ToTable("CustomerContractType", "sm");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.NameEng)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CustomerDiscountGroup>(entity =>
        {
            entity.ToTable("CustomerDiscountGroup", "sm");

            entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("numeric(18, 3)");
        });

        modelBuilder.Entity<CustomerSalesPrice>(entity =>
        {
            entity.ToTable("CustomerSalesPrice", "sm");

            entity.Property(e => e.ComissionPrice).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.MaxPrice).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.MinPrice).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.PriceIncludingVat).HasColumnName("PriceIncludingVAT");
        });

        modelBuilder.Entity<CustomerSalesPriceDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.CustomerGroupId });

            entity.ToTable("CustomerSalesPriceDetail", "sm");
        });

        modelBuilder.Entity<DayInWeek>(entity =>
        {
            entity.HasKey(e => e.JulianDate);

            entity.ToTable("DayInWeek", "gn");

            entity.Property(e => e.DayInWeek1).HasColumnName("DayInWeek");
            entity.Property(e => e.PersianDate)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DayOfMonth>(entity =>
        {
            entity.HasKey(e => new { e.MonthId, e.DayId });

            entity.ToTable("DayOfMonth", "gn");

            entity.Property(e => e.MonthId)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.DayId)
                .HasMaxLength(2)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DeathCause>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("DeathCause", "mc");

            entity.Property(e => e.DurationDeath).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<DeathCertificate>(entity =>
        {
            entity.ToTable("DeathCertificate", "mc");

            entity.Property(e => e.Comment)
                .HasMaxLength(300)
                .HasColumnName("comment");
            entity.Property(e => e.CompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CompositionUID");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DeathDateTime).HasColumnType("datetime");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(201)
                .HasComputedColumnSql("((isnull([FirstName],'')+N' ')+isnull([LastName],''))", false);
            entity.Property(e => e.HouseholdHeadNationalCode).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(150);
            entity.Property(e => e.MessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MessageUID");
            entity.Property(e => e.NationalId)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PersonUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PersonUID");
            entity.Property(e => e.RelatedHid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("RelatedHID");
            entity.Property(e => e.SentDateTime).HasColumnType("datetime");
            entity.Property(e => e.SerialNumber).HasMaxLength(50);
        });

        modelBuilder.Entity<DeathInfantDelivery>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("DeathInfantDelivery", "mc");

            entity.Property(e => e.InfantWeight).HasColumnType("numeric(6, 2)");
            entity.Property(e => e.MotherFirstName).HasMaxLength(50);
            entity.Property(e => e.MotherLastName).HasMaxLength(50);
            entity.Property(e => e.MotherMobileNumber).HasMaxLength(11);
            entity.Property(e => e.MotherNationalCode).HasMaxLength(13);
        });

        modelBuilder.Entity<DeathMedicalHistoryLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("DeathMedicalHistoryLine", "mc");

            entity.Property(e => e.ConditionId).HasComment("thrICD");
            entity.Property(e => e.DateOfOnset).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.OnsetDurationToPresent).HasColumnType("numeric(6, 2)");
        });

        modelBuilder.Entity<DepartmentBranch>(entity =>
        {
            entity.HasKey(e => new { e.DepartmentId, e.BranchId });

            entity.ToTable("DepartmentBranch", "hr");
        });

        modelBuilder.Entity<DepartmentTimeShift>(entity =>
        {
            entity.ToTable("DepartmentTimeShift", "hr", tb => tb.HasComment("شیفت های موجود در سیستم به ازای هر دپارتمان مثلا شیفت صبح فارق از تاریخ"));

            entity.Property(e => e.Id).HasComment("شناسه شیفت");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DepartmentId).HasComment("شناسه دپارتمان");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.FiscalYearId).HasComment("شناسه سال مالی");
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
            entity.Property(e => e.ShiftName)
                .HasMaxLength(50)
                .HasComment("عنوان شیفت");
        });

        modelBuilder.Entity<DepartmentTimeShiftLine>(entity =>
        {
            entity.ToTable("DepartmentTimeShiftLine", "hr", tb => tb.HasComment("لاین های شیفت های موجود در سیستم مثلا برای شنبه از چه ساعتی تا چه ساعتی کاری است"));

            entity.Property(e => e.Id).HasComment("شناسه لاین شیفت کاری");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DayInWeek).HasComment("روز هفته");
            entity.Property(e => e.EndTime)
                .HasPrecision(0)
                .HasComment("ساعت پایان شیفت");
            entity.Property(e => e.HeaderId).HasComment("شناسه شیفت");
            entity.Property(e => e.StartTime)
                .HasPrecision(0)
                .HasComment("ساعت شروع شیفت");
        });

        modelBuilder.Entity<DepreciationBook>(entity =>
        {
            entity.ToTable("DepreciationBook", "fa");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DepreciationBookEntryHeader>(entity =>
        {
            entity.ToTable("DepreciationBookEntryHeader", "fa");
        });

        modelBuilder.Entity<DepreciationBookEntryLine>(entity =>
        {
            entity.ToTable("DepreciationBookEntryLine", "fa");

            entity.Property(e => e.AccumulatedDepreciationAmount).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.AccumulatedDepreciationRevAmount).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.AcquisitionAmount).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.AcquisitionDate).HasColumnType("datetime");
            entity.Property(e => e.BeginAccumulatedDepreciationAmount).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.DepreciationAmount).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.DepreciationEndDate).HasColumnType("datetime");
            entity.Property(e => e.DepreciationPeriod).HasComment("دوره استهلاک");
            entity.Property(e => e.DepreciationRevAmount).HasColumnType("numeric(10, 0)");
            entity.Property(e => e.DepreciationStartDate).HasColumnType("datetime");
            entity.Property(e => e.RevaluationAmount).HasColumnType("numeric(10, 0)");
        });

        modelBuilder.Entity<DepreciationMethod>(entity =>
        {
            entity.ToTable("DepreciationMethod", "fa");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DepreciationPeriodType>(entity =>
        {
            entity.ToTable("DepreciationPeriodType", "fa");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DestinationType>(entity =>
        {
            entity.ToTable("DestinationType", "wf");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DocumentAccountHeader>(entity =>
        {
            entity.ToTable("DocumentAccountHeader", "fm");
        });

        modelBuilder.Entity<DocumentAccountLine>(entity =>
        {
            entity.ToTable("DocumentAccountLine", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
        });

        modelBuilder.Entity<DocumentType>(entity =>
        {
            entity.ToTable("DocumentType", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EducationLevel>(entity =>
        {
            entity.ToTable("EducationLevel", "hr");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<EliminateHidreason>(entity =>
        {
            entity.ToTable("EliminateHIDReason", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Employee_1");

            entity.ToTable("Employee", "hr");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FatherFirstName).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.InsurNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EmployeeContract>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ServiceProvider_Service");

            entity.ToTable("EmployeeContract", "hr");

            entity.Property(e => e.Scid).HasColumnName("SCId");
            entity.Property(e => e.StaxId).HasColumnName("STaxId");
        });

        modelBuilder.Entity<EmployeeContractType>(entity =>
        {
            entity.ToTable("EmployeeContractType", "hr");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<EmployeeShiftTimeSheet>(entity =>
        {
            entity.ToTable("EmployeeShiftTimeSheet", "hr", tb => tb.HasComment("ساعت های موظفی هر کارمند بر اساس شیفت های انتخاب شده برای او و ماه کاری مربوطه در این جدول نمایش داده می شود. اینکه به صورت ریز یک کارمند در چه روز از چه ساعتی تا چه ساعتی باید سر کار حاضر باشد به این صورت مشخص می شود"));

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DayId)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasComment("روز شمسی");
            entity.Property(e => e.EmployeeTimeSheetId).HasComment("شناسه شیفت در ماه کارمند");
            entity.Property(e => e.EndDateTime).HasColumnType("datetime");
            entity.Property(e => e.MonthId)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasComment("ماه شمسی");
            entity.Property(e => e.StartDateTime).HasColumnType("datetime");
            entity.Property(e => e.YearId).HasComment("سال شمسی");
        });

        modelBuilder.Entity<EmployeeTimeSheet>(entity =>
        {
            entity.ToTable("EmployeeTimeSheet", "hr", tb => tb.HasComment("ارتباط یک کارمند با ماه های کاری و شیفت های کاری در این جدول تعریف می شود. به عبارت دیگر یک کارمند در چه ماهی چه شیفتی به صورت کلی دارد."));

            entity.Property(e => e.Id).HasComment("شناسه شیفت در ماه کارمند");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DepartmentTimeShiftId).HasComment("شناسه شیفت");
            entity.Property(e => e.EmployeeId).HasComment("شناسه کارمند");
            entity.Property(e => e.StandardTimeSheetPerMonthId).HasComment("شناسه ساعت کاری استاندارد ماهانه");
        });

        modelBuilder.Entity<ErrorLog>(entity =>
        {
            entity.ToTable("ErrorLog", "gn");

            entity.Property(e => e.ComputerName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ErrDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ErrMessage).IsRequired();
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(23)
                .IsUnicode(false)
                .HasColumnName("IPAddress");
            entity.Property(e => e.Path).HasMaxLength(100);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => new { e.AttenderId, e.IdentityId, e.FavoriteCategoryId, e.AdmissionTypeId }).HasName("PK_Favorite_1");

            entity.ToTable("Favorite", "mc");
        });

        modelBuilder.Entity<FavoriteCategory>(entity =>
        {
            entity.ToTable("FavoriteCategory", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FavoriteDescription>(entity =>
        {
            entity.ToTable("FavoriteDescription", "gn");

            entity.Property(e => e.Description).HasMaxLength(120);
        });

        modelBuilder.Entity<FavoriteTamin>(entity =>
        {
            entity.ToTable("FavoriteTamin", "mc");

            entity.Property(e => e.CodeTypeId).HasComment("1:GCode,2:WsCode");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.TaminIllnessId).IsSparse();
            entity.Property(e => e.TaminOrganId).IsSparse();
            entity.Property(e => e.TaminParentOrganId).IsSparse();
            entity.Property(e => e.TaminPlanId).IsSparse();
        });

        modelBuilder.Entity<FieldTable>(entity =>
        {
            entity.ToTable("FieldTable", "wf");

            entity.Property(e => e.AliasName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FinancialStep>(entity =>
        {
            entity.ToTable("FinancialStep", "fm");

            entity.Property(e => e.StepDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<FiscalYear>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_FisicalYear");

            entity.ToTable("FiscalYear", "gn");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FiscalYearLine>(entity =>
        {
            entity.ToTable("FiscalYearLine", "gn");
        });

        modelBuilder.Entity<FixedAsset>(entity =>
        {
            entity.ToTable("FixedAsset", "fa");

            entity.Property(e => e.DepreciationPeriod).HasComment("دوره استهلاک");
            entity.Property(e => e.TechnicalCode)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FixedAssetCategory>(entity =>
        {
            entity.ToTable("FixedAssetCategory", "fa");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FixedAssetClass>(entity =>
        {
            entity.ToTable("FixedAssetClass", "fa");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FixedAssetLocation>(entity =>
        {
            entity.ToTable("FixedAssetLocation", "fa");

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FixedAssetMaintenance>(entity =>
        {
            entity.ToTable("FixedAssetMaintenance", "fa");

            entity.Property(e => e.NextServiceDate).HasColumnType("datetime");
            entity.Property(e => e.WarrantyDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<FixedAssetSubClass>(entity =>
        {
            entity.ToTable("FixedAssetSubClass", "fa");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FixedAssetValuationType>(entity =>
        {
            entity.ToTable("FixedAssetValuationType", "fa");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FundType>(entity =>
        {
            entity.ToTable("FundType", "fm");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FundTypeAdm>(entity =>
        {
            entity.ToTable("FundTypeAdm", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<Gender>(entity =>
        {
            entity.ToTable("Gender", "gn");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<Hash>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Field }).HasName("PK_HangFire_Hash");

            entity.ToTable("Hash", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Field).HasMaxLength(100);
        });

        modelBuilder.Entity<HealthId>(entity =>
        {
            entity.ToTable("HealthID", "mc");

            entity.Property(e => e.Hid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("HID");
        });

        modelBuilder.Entity<HealthIdorder>(entity =>
        {
            entity.ToTable("HealthIDOrder", "mc");
        });

        modelBuilder.Entity<HealthIdstate>(entity =>
        {
            entity.ToTable("HealthIDState", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<History>(entity =>
        {
            entity.ToTable("History", "gn");

            entity.Property(e => e.ActionName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Browser).HasMaxLength(100);
            entity.Property(e => e.ControllerName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.OperatingSystem).HasMaxLength(100);
        });

        modelBuilder.Entity<HoliDay>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("HoliDays", "gn");
        });

        modelBuilder.Entity<Hqstype>(entity =>
        {
            entity.ToTable("HQSType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<IncomeBalanceType>(entity =>
        {
            entity.ToTable("IncomeBalanceType", "fm");

            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.NameEng)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<IndustryGroup>(entity =>
        {
            entity.ToTable("IndustryGroup", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Insurer>(entity =>
        {
            entity.ToTable("Insurer", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<InsurerLine>(entity =>
        {
            entity.ToTable("InsurerLine", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<InsurerPatient>(entity =>
        {
            entity.ToTable("InsurerPatient", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<InsurerPrice>(entity =>
        {
            entity.ToTable("InsurerPrice", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.InsurerPrice1)
                .HasComment("سقف قیمت مورد قبول بیمه برای یک آیتم قابل قیمت گذاری")
                .HasColumnType("numeric(12, 0)")
                .HasColumnName("InsurerPrice");
            entity.Property(e => e.InsurerPriceCalculationMethodId).HasComment("شناسه نحوه محاسبه قیمت آیتم قابل قیمت گذاری");
            entity.Property(e => e.InsurerSharePer).HasColumnType("numeric(12, 0)");
            entity.Property(e => e.MedicalItemPriceId).HasComment("شناسه قیمت گذاری آیتم قابل قیمت گذاری");
        });

        modelBuilder.Entity<InsurerPriceCalculationMethod>(entity =>
        {
            entity.ToTable("InsurerPriceCalculationMethod", "mc");

            entity.Property(e => e.ItemTypeId).HasComment("نوع آیتم قابل قیمت گذاری");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasComment("نام روش محاسبه قیمت آیتم قابل قیمت گذاری");
            entity.Property(e => e.NameEn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("نام لاتین روش محاسبه قیمت آیتم قابل قیمت گذاری");
        });

        modelBuilder.Entity<InsurerType>(entity =>
        {
            entity.ToTable("InsurerType", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.NameEng)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Item", "wh");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng).HasMaxLength(100);
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.Vatid).HasColumnName("VATId");
        });

        modelBuilder.Entity<ItemAttribute>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ItemAttributeType");

            entity.ToTable("ItemAttribute", "wh");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
        });

        modelBuilder.Entity<ItemAttributeLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ItemAttribute");

            entity.ToTable("ItemAttributeLine", "wh");

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
        });

        modelBuilder.Entity<ItemBarcode>(entity =>
        {
            entity.ToTable("ItemBarcode", "wh");

            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Barcode)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<ItemCategory>(entity =>
        {
            entity.ToTable("ItemCategory", "wh");

            entity.Property(e => e.ItemAttributeIds)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ItemCategoryAttribute>(entity =>
        {
            entity.ToTable("ItemCategoryAttribute", "wh");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ItemAttributeLineIds).HasMaxLength(100);
        });

        modelBuilder.Entity<ItemSubUnit>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.UnitId, e.Ratio });

            entity.ToTable("ItemSubUnit", "wh");

            entity.Property(e => e.Ratio).HasColumnType("decimal(8, 3)");
        });

        modelBuilder.Entity<ItemTax>(entity =>
        {
            entity.HasKey(e => e.Id1).HasName("PK__ItemTax__C49607F53FE320A3");

            entity.ToTable("ItemTax", "gn");

            entity.Property(e => e.Date).HasMaxLength(10);
            entity.Property(e => e.DescriptionOfId)
                .HasMaxLength(600)
                .HasColumnName("DescriptionOfID");
            entity.Property(e => e.ExpirationDate).HasMaxLength(10);
            entity.Property(e => e.Id)
                .IsRequired()
                .HasMaxLength(4000)
                .HasColumnName("ID");
            entity.Property(e => e.RunDate).HasMaxLength(10);
            entity.Property(e => e.SpecialOrGeneral).HasMaxLength(5);
            entity.Property(e => e.TaxableOrFree).HasMaxLength(5);
            entity.Property(e => e.Type).HasMaxLength(30);
            entity.Property(e => e.Vat).HasMaxLength(2);
            entity.Property(e => e.VatCustomPurposes).HasMaxLength(2);
        });

        modelBuilder.Entity<ItemTransaction>(entity =>
        {
            entity.ToTable("ItemTransaction", "wh");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(120);
            entity.Property(e => e.SumAmount).HasColumnType("numeric(23, 3)");
            entity.Property(e => e.SumQuantity).HasColumnType("numeric(15, 3)");
        });

        modelBuilder.Entity<ItemTransactionLine>(entity =>
        {
            entity.ToTable("ItemTransactionLine", "wh");

            entity.Property(e => e.BalanceQuantity).HasColumnType("numeric(8, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.FinalAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.Price).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.Quantity).HasColumnType("numeric(8, 3)");
        });

        modelBuilder.Entity<ItemTransactionLineDetail>(entity =>
        {
            entity.HasKey(e => e.ItemTransactionLineId);

            entity.ToTable("ItemTransactionLineDetail", "wh");

            entity.Property(e => e.ItemTransactionLineId).ValueGeneratedNever();
            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Ratio).HasColumnType("decimal(8, 3)");
            entity.Property(e => e.TotalQuantity).HasColumnType("decimal(8, 3)");
        });

        modelBuilder.Entity<ItemType>(entity =>
        {
            entity.ToTable("ItemType", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
        });

        modelBuilder.Entity<ItemUnit>(entity =>
        {
            entity.ToTable("ItemUnit", "wh");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ItemUnitDetail>(entity =>
        {
            entity.ToTable("ItemUnitDetail", "wh");

            entity.Property(e => e.Ratio).HasColumnType("decimal(8, 3)");
        });

        modelBuilder.Entity<ItemUnitTax>(entity =>
        {
            entity.ToTable("ItemUnitTax", "gn");

            entity.Property(e => e.Code)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ItemWarehouse>(entity =>
        {
            entity.HasKey(e => new { e.ItemId, e.WarehouseId, e.ItemTypeId, e.ZoneId, e.BinId });

            entity.ToTable("Item_Warehouse", "wh");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_HangFire_Job");

            entity.ToTable("Job", "HangFire");

            entity.Property(e => e.Arguments).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.InvocationData).IsRequired();
            entity.Property(e => e.StateName).HasMaxLength(20);
        });

        modelBuilder.Entity<JobParameter>(entity =>
        {
            entity.HasKey(e => new { e.JobId, e.Name }).HasName("PK_HangFire_JobParameter");

            entity.ToTable("JobParameter", "HangFire");

            entity.Property(e => e.Name).HasMaxLength(40);
        });

        modelBuilder.Entity<JobQueue>(entity =>
        {
            entity.HasKey(e => new { e.Queue, e.Id }).HasName("PK_HangFire_JobQueue");

            entity.ToTable("JobQueue", "HangFire");

            entity.Property(e => e.Queue).HasMaxLength(50);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.FetchedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Journal>(entity =>
        {
            entity.ToTable("Journal", "fm");

            entity.Property(e => e.AmountCredit).HasColumnType("decimal(23, 3)");
            entity.Property(e => e.AmountDebit).HasColumnType("decimal(23, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<JournalLine>(entity =>
        {
            entity.ToTable("JournalLine", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.Amount).HasColumnType("decimal(23, 3)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<JournalLineDetail>(entity =>
        {
            entity.ToTable("JournalLineDetail", "fm");
        });

        modelBuilder.Entity<JournalPostedGroup>(entity =>
        {
            entity.ToTable("JournalPostedGroup", "fm");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.LangId);

            entity.ToTable("Language", "gn");

            entity.Property(e => e.LangId).ValueGeneratedNever();
            entity.Property(e => e.LangName).HasMaxLength(50);
        });

        modelBuilder.Entity<List>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Id }).HasName("PK_HangFire_List");

            entity.ToTable("List", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<LocCity>(entity =>
        {
            entity.ToTable("LocCity", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.PhonePreCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Phone_PreCode");
        });

        modelBuilder.Entity<LocCountry>(entity =>
        {
            entity.ToTable("LocCountry", "gn");

            entity.Property(e => e.AbbreviationCode)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LocState>(entity =>
        {
            entity.ToTable("LocState", "gn");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MadicalLaboratoryResultLineInterpretation>(entity =>
        {
            entity.ToTable("MadicalLaboratoryResultLineInterpretation", "mc", tb => tb.HasComment("وضعیت نسبت به محدوده طبیعی آزمایش را نشان می دهد"));

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasComment("توضیح مفهومی که در فیلد Intrerpretation ثبت شده است");
            entity.Property(e => e.InterpretationId).HasComment("کدینگ Snomedct وقتی ستون IsResultStatus یک است");
        });

        modelBuilder.Entity<MadicalLaboratoryResultLineInterpretationTemplate>(entity =>
        {
            entity.ToTable("MadicalLaboratoryResultLineInterpretationTemplate", "mc");

            entity.Property(e => e.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<MaritalStatus>(entity =>
        {
            entity.ToTable("MaritalStatus", "hr");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<MedicalItemPrice>(entity =>
        {
            entity.ToTable("MedicalItemPrice", "mc");

            entity.Property(e => e.BeginPrice).HasColumnType("decimal(12, 0)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.EndPrice).HasColumnType("decimal(12, 0)");
            entity.Property(e => e.ItemId).HasComment("شناسه آیتم قابل قیمت گذاری");
            entity.Property(e => e.MedicalSubjectId).HasComment("شناسه نوع تعرفه");
            entity.Property(e => e.PricingModelId).HasComment("شناسه نوع قیمت گذاری");
        });

        modelBuilder.Entity<MedicalLaboratory>(entity =>
        {
            entity.ToTable("MedicalLaboratory", "mc", tb => tb.HasComment("اطلاعات پاسخ یک نسخه آزمایشگاه و ارسال آن به سپاس در این جدول ثبت می شود"));

            entity.Property(e => e.Category).HasComment("کدینگ thritaEHR");
            entity.Property(e => e.CompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CompositionUID");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.LifeCycleStateId).HasComment("از جدول thrLifeCycle");
            entity.Property(e => e.MessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MessageUID");
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.PersonUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PersonUID");
            entity.Property(e => e.ReferralId)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.ReferringDoctorId).HasComment("از جدول Attender");
            entity.Property(e => e.RelatedHid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("RelatedHID");
            entity.Property(e => e.ResultDateTime)
                .HasComment("تاریخی که جواب آزمایش آماده می شود")
                .HasColumnType("datetime");
            entity.Property(e => e.SentDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<MedicalLaboratoryBodySite>(entity =>
        {
            entity.ToTable("MedicalLaboratoryBodySite", "mc");

            entity.Property(e => e.BodySiteId).HasComment("کدینگ Snomedct وقتی فیلد IsBodySite یک باشد");
            entity.Property(e => e.LateralityId).HasComment("کدینگ Snomedct وقتی فیلد IsLaterality یک باشد");
        });

        modelBuilder.Entity<MedicalLaboratoryDiagnosis>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MedicalL__3214EC07B94B1E73");

            entity.ToTable("MedicalLaboratoryDiagnosis", "mc", tb => tb.HasComment("تشخیصی که برای نسخه آزمایش نوشته شده متصور است در این جدول ثبت می شود. به نظر فایده خاصی ندارد و در ایران در آزمایشگاه کسی تشخیص نمی دهد."));

            entity.Property(e => e.Comment).HasMaxLength(300);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiagnosisStatusId).HasComment("از جدول thrDiagnosisStatus");
            entity.Property(e => e.ServerityId).HasComment("از جدول thrOrdinalTerm");
        });

        modelBuilder.Entity<MedicalLaboratoryMicrobiologicalCulture>(entity =>
        {
            entity.ToTable("MedicalLaboratoryMicrobiologicalCulture", "mc", tb => tb.HasComment("در صورتی که آزمایش کشت میکروبی باشد، اطلاعات در این جدول ذخیره می شود. علت این است که کشت میکروبی دارای جزئیات بیشتری از یک آزمایش معمولی دارد."));
        });

        modelBuilder.Entity<MedicalLaboratoryPathology>(entity =>
        {
            entity.ToTable("MedicalLaboratoryPathology", "mc", tb => tb.HasComment("در صورتی که آزمایش پاتولوژی باشد اطلاعات مربوط به آن در این جدول ثبت می شود. علت این است که آزمایش های پاتولوژی ویژگی های بیشتری نسبت به سایر آزمایش ها دارند"));

            entity.Property(e => e.ClinicalInformation).HasMaxLength(100);
            entity.Property(e => e.MacroscopicExamination).HasMaxLength(200);
            entity.Property(e => e.MicroscopicExamination).HasMaxLength(100);
        });

        modelBuilder.Entity<MedicalLaboratoryPathologyLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryIdPathologyLine");

            entity.ToTable("MedicalLaboratoryPathologyLine", "mc", tb => tb.HasComment("اطلاعات تشخیصی آزمایش پاتولوژی در این جدول ثبت می شود"));

            entity.Property(e => e.DiagnosisDescription).HasMaxLength(150);
            entity.Property(e => e.MorphologyDifferentiationId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.MorphologyId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.PathologyDiagnosisId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.TopographyId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.TopographyLateralityId).HasComment("از جدول thrSnomedct با مقدار 1 ستون IsLaterality");
        });

        modelBuilder.Entity<MedicalLaboratoryPathologyLineTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryIdPathologyLineTemplate");

            entity.ToTable("MedicalLaboratoryPathologyLineTemplate", "mc");

            entity.Property(e => e.DiagnosisDescription).HasMaxLength(150);
            entity.Property(e => e.MorphologyDifferentiationId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.MorphologyId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.PathologyDiagnosisId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.TopographyId).HasComment("از جدول thrICDO3");
            entity.Property(e => e.TopographyLateralityId).HasComment("از جدول thrSnomedct با مقدار 1 ستون IsLaterality");
        });

        modelBuilder.Entity<MedicalLaboratoryPathologyTemplate>(entity =>
        {
            entity.ToTable("MedicalLaboratoryPathologyTemplate", "mc", tb => tb.HasComment("در صورتی که آزمایش پاتولوژی باشد اطلاعات مربوط به آن در این جدول ثبت می شود. علت این است که آزمایش های پاتولوژی ویژگی های بیشتری نسبت به سایر آزمایش ها دارند"));

            entity.Property(e => e.ClinicalInformation).HasMaxLength(100);
            entity.Property(e => e.MacroscopicExamination).HasMaxLength(200);
            entity.Property(e => e.MicroscopicExamination).HasMaxLength(100);
        });

        modelBuilder.Entity<MedicalLaboratoryReferenceRange>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryReferenceRangeDetail");

            entity.ToTable("MedicalLaboratoryReferenceRange", "mc", tb => tb.HasComment("محدوده طبیعی آزمایش برای یک پاسخ آزمایش در این جدول ثبت می شود"));

            entity.Property(e => e.AgeRangeId).HasComment("از جدول thrSnomedct به مقدار 1 برای ستون IsAgeRange");
            entity.Property(e => e.Condition)
                .HasMaxLength(100)
                .HasComment("شرط خاص برای محدوده طبیعی مثلا دیابت");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.GenderId).HasComment("از جدول trhGender");
            entity.Property(e => e.GestationAgeRangeId).HasComment("از جدول thrSnomedct به مقدار 1 برای ستون IsGestationAgeRange");
            entity.Property(e => e.HighRangeDescriptive)
                .HasMaxLength(10)
                .HasComment("حد بالایی و حداکثر طبیعی");
            entity.Property(e => e.HormonalPhaseId).HasComment("از جدول thrSnomedct به مقدار 1 برای ستون IsHormonalPhase");
            entity.Property(e => e.LowRangeDescriptive)
                .HasMaxLength(10)
                .HasComment("حد پایینی و حداقل طبیعی");
            entity.Property(e => e.ReferenceStatusId).HasComment("از جدول thrSnomedct به مقدار 1 برای ستون IsReferenceStatus");
            entity.Property(e => e.SpeciesId).HasComment("از جدول thrSnomedct به مقدار 1 برای ستون IsSpecies");
        });

        modelBuilder.Entity<MedicalLaboratoryReferenceRangeTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryReferenceRangeDetailTemplate");

            entity.ToTable("MedicalLaboratoryReferenceRangeTemplate", "mc");

            entity.Property(e => e.Condition).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.HighRangeDescriptive).HasMaxLength(10);
            entity.Property(e => e.LowRangeDescriptive).HasMaxLength(10);
        });

        modelBuilder.Entity<MedicalLaboratoryRequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryLabRequest_1");

            entity.ToTable("MedicalLaboratoryRequest", "mc", tb => tb.HasComment("اگر نمونه گیری بیرون از مرکز آزمایشگاه انجام شده بود مقادیر نمونه اینجا پر می شود"));

            entity.Property(e => e.Id).HasComment("این جدول در صورتی که نیاز به ثبت اطلاعات نمونه آزمایش ارسالی مثل آزمایش پاتولوژی باشد، پر می شود");
            entity.Property(e => e.AdequacyForTestingId).HasComment("از جدول thrSpecimenAdequacy");
            entity.Property(e => e.CollectionDateTime)
                .HasComment("تاریخ اخذ نمونه می باشد. در صورتی که نمونه در خود آزمایشگاه اخذ شده باشد")
                .HasColumnType("datetime");
            entity.Property(e => e.CollectionProcedureId).HasComment("از جدول thrSnomedct به مقدار 1 ستون IsCollectionProcedure");
            entity.Property(e => e.MedicalLaboratoryId).HasComment("id جدول MedicalLaboratory");
            entity.Property(e => e.SpecimenCode)
                .HasMaxLength(10)
                .HasComment("تنها در صورتی که نمونه همراه با درخواست آزمایش ارسال شده باشد، اطلاعات نمونه در این جدول ذخیره می شود. در واقع نمونه همراه با نسخه آزمایش ارسال می شود");
            entity.Property(e => e.SpecimenDateTime).HasColumnType("datetime");
            entity.Property(e => e.SpecimenIdentifier)
                .HasMaxLength(50)
                .HasComment("کد منحصر به فرد نمونه آزمایش به صورت محلی توسط آزمایشگاه داده می شود");
            entity.Property(e => e.SpecimenTypeId).HasComment("از جدول thrSnomedct به مقدار 1 ستون IsSpecimenType");
        });

        modelBuilder.Entity<MedicalLaboratoryResult>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_GeneralLaboratoryResult");

            entity.ToTable("MedicalLaboratoryResult", "mc", tb => tb.HasComment("لیست پاسخ های آزمایش در این جدول ثبت می شود. به ازای هر پنل آزمایش در نسخه آزمایش یک رکورد ثبت می شود."));

            entity.Property(e => e.CoWorkerCompanyId).HasComment("شرکت همکار ارسال کننده نتیجه آزمایش");
            entity.Property(e => e.LabMethodId).HasComment("از جدول trhSnomedct به مقدار 1 ستون IsLabMethod - علت قرارگیری موارد مربوط به پروتکل انجام آزمایش در این جدول این است که ممکن است یک یا چند پنل از یک نمونه گرفته شده استفاده کنند ولی روش انجام آزمایششان متفاوت باشد لذا در جدول نمونه قرار نگرفت");
            entity.Property(e => e.LaboratoryPanelId).HasComment("شناسه خدمت از جدول Service که معادل لوینک دارد و پنل است");
            entity.Property(e => e.MethodDescription)
                .HasMaxLength(50)
                .HasComment("توضیحات روش انجام آزمایش");
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.ProcessDateTime)
                .HasComment("تاریخ شروع انجام آزمایش بر روی نمونه در آزمایشگاه")
                .HasColumnType("datetime");
            entity.Property(e => e.RecieptDateTime)
                .HasComment("تاریخ دریافت نمونه از قسمت نمونه گیری به قسمت آزمایشگاه می باشد")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<MedicalLaboratoryResultLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryResultRowDetail");

            entity.ToTable("MedicalLaboratoryResultLine", "mc", tb => tb.HasComment("اطلاعات نتایج ریز آزمایش های موجود در هر پنل در این جدول ثبت می شود."));

            entity.Property(e => e.Comment).HasMaxLength(200);
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.ResultDenominator)
                .HasComment("اگر نتیجه آزمایش نسبت باشد، مخرج کسر در این ستون ذخیره می شود.")
                .IsSparse()
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.ResultId)
                .HasComment("نتیجه آزمایش در صورتی که کدینگ باشد در این ستون ذخیره می شود")
                .IsSparse();
            entity.Property(e => e.ResultLowerValue).IsSparse();
            entity.Property(e => e.ResultMagnitudeStatus).HasMaxLength(50);
            entity.Property(e => e.ResultNumerator)
                .HasComment("اگر نتیجه آزمایش نسبت باشد، صورت کسر در این ستون ذخیره می شود.")
                .IsSparse()
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.ResultOrdinalSymbolId)
                .HasComment("کدینگ thrOrdinalTerm")
                .IsSparse();
            entity.Property(e => e.ResultProportionType)
                .HasComment("0:نسبت\r\n1:واحد\r\n2:درصد\r\n3:کسر\r\n4:عدد صحیح-کسر")
                .IsSparse();
            entity.Property(e => e.ResultTable)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("اگر نتیجه آزمایش کدینگ باشد جدولی که ستون TestResultId به آن اشاره می کند در این ستون ذخیره می شود")
                .IsSparse();
            entity.Property(e => e.ResultTypeId)
                .HasComment("کدینگ thrDataTypes")
                .IsSparse();
            entity.Property(e => e.ResultUnitId).HasComment("واحد ");
            entity.Property(e => e.ResultUpperValue).IsSparse();
            entity.Property(e => e.ResultValue)
                .HasComment("در این ستون مقدار جواب آزمایش در صورتی که عددی یا تعدادی و یا شمارشی باشد ذخیره می شود\r\nOrdinal\r\nQuantity\r\nCount")
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.StatusId).HasComment("وضعیت جواب آزمایش را نشان می دهد. کدینگ thritaEHR");
            entity.Property(e => e.TestNameId).HasComment("شناسه خدمت که لوینک باشد و پنل نباشد");
            entity.Property(e => e.TestSequence).HasComment("ترتیب انجام آزمایش ها در صورتی که مهم باشد");
        });

        modelBuilder.Entity<MedicalLaboratoryResultLineTemplate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_MedicalLaboratoryResultRowDetailTemplate");

            entity.ToTable("MedicalLaboratoryResultLineTemplate", "mc");

            entity.Property(e => e.Comment).HasMaxLength(200);
            entity.Property(e => e.Note).HasMaxLength(500);
        });

        modelBuilder.Entity<MedicalLaboratoryResultTemplate>(entity =>
        {
            entity.ToTable("MedicalLaboratoryResultTemplate", "mc");

            entity.Property(e => e.MethodDescription).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(500);
        });

        modelBuilder.Entity<MedicalLaboratorySpeciman>(entity =>
        {
            entity.ToTable("MedicalLaboratorySpecimen", "mc");

            entity.Property(e => e.AdequacyForTestingId).HasComment("از جدول thrSpecimenAdequacy");
            entity.Property(e => e.CoWorkerCompanyId).HasComment("جدول LabRequest میتواند حذف شود چون در صورتی که نمونه از مرکز دیگری گرفته شده باشد، شرکت همکار گیرنده نمونه آزمایش");
            entity.Property(e => e.CollectionDateTime)
                .HasComment("تاریخ اخذ نمونه می باشد. در صورتی که نمونه در خود آزمایشگاه اخذ شده باشد")
                .HasColumnType("datetime");
            entity.Property(e => e.CollectionProcedureId).HasComment("از جدول thrSnomedct به مقدار 1 ستون IsCollectionProcedure");
            entity.Property(e => e.CreateDateTime)
                .HasComment("")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifyDateTime).HasColumnType("datetime");
            entity.Property(e => e.RecieptDateTime)
                .HasComment("تاریخ دریافت نمونه می باشد در صورتی که نمونه در جای دیگری گرفته شده باشد و تحویل آزمایشگاه شده باشد")
                .HasColumnType("datetime");
            entity.Property(e => e.SpecimenFrequency).HasComment("تعداد دفعات تکرار نمونه گیری");
            entity.Property(e => e.SpecimenIdentifier)
                .HasMaxLength(50)
                .HasComment("کد منحصر به فرد نمونه آزمایش به صورت محلی توسط آزمایشگاه داده می شود");
            entity.Property(e => e.SpecimenTypeId).HasComment("از جدول thrSnomedct به مقدار 1 ستون IsSpecimenType - در سند SpeciemnTissueType است");
        });

        modelBuilder.Entity<MedicalLaboratorySpecimenTemplate>(entity =>
        {
            entity.ToTable("MedicalLaboratorySpecimenTemplate", "mc");

            entity.Property(e => e.SpecimenIdentifier).HasMaxLength(50);
        });

        modelBuilder.Entity<MedicalLaboratoryTemplate>(entity =>
        {
            entity.ToTable("MedicalLaboratoryTemplate", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<MedicalSubject>(entity =>
        {
            entity.ToTable("MedicalSubject", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.IsIpd)
                .HasComment("وضعیت گردشگری بودن تعرفه")
                .HasColumnName("IsIPD");
            entity.Property(e => e.IsOnline).HasComment("وضعیت آنلاین بودن تعرفه");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasComment("نام نوع تعرفه");
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("نام لاتین نوع تعرفه");
        });

        modelBuilder.Entity<Month>(entity =>
        {
            entity.ToTable("Month", "gn");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Msctype>(entity =>
        {
            entity.ToTable("MSCType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TypeId)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<NationalCode>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("NationalCode", "mc");

            entity.Property(e => e.NationalCode1)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NationalCode");
        });

        modelBuilder.Entity<Navigation>(entity =>
        {
            entity.ToTable("Navigation", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.ControllerName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IconName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.IconNameOld)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.IsViwoperation).HasColumnName("IsVIWOperation");
            entity.Property(e => e.LinkAddress)
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<NavigationOperation>(entity =>
        {
            entity.HasKey(e => new { e.NavigationId, e.OperationTypeId });

            entity.ToTable("NavigationOperation", "gn");
        });

        modelBuilder.Entity<NoSeries>(entity =>
        {
            entity.ToTable("NoSeries", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TableName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<NoSeriesAssignNextStage>(entity =>
        {
            entity.ToTable("NoSeriesAssignNextStage", "gn");
        });

        modelBuilder.Entity<NoSeriesLine>(entity =>
        {
            entity.ToTable("NoSeriesLine", "gn");
        });

        modelBuilder.Entity<Notify>(entity =>
        {
            entity.ToTable("Notify", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ObjectDocumentPostingGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PersonInvoicePostingGroup");

            entity.ToTable("ObjectDocumentPostingGroup", "wf");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<ObjectType>(entity =>
        {
            entity.ToTable("ObjectType", "gn");

            entity.Property(e => e.TableName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<OpenAccountType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OpenAccount");

            entity.ToTable("OpenAccountType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<OperationType>(entity =>
        {
            entity.ToTable("OperationType", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<OrganizationalDepartment>(entity =>
        {
            entity.ToTable("OrganizationalDepartment", "hr");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PageNotify>(entity =>
        {
            entity.HasKey(e => new { e.NavigationId, e.SignalRgroupId });

            entity.ToTable("PageNotify", "gn");

            entity.Property(e => e.SignalRgroupId).HasColumnName("SignalRGroupId");
        });

        modelBuilder.Entity<ParGrpCode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_mc.parGrpCode");

            entity.ToTable("ParGrpCode", "mc");

            entity.Property(e => e.Id)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(1000);
        });

        modelBuilder.Entity<PartnerType>(entity =>
        {
            entity.ToTable("PartnerType", "gn");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.ToTable("Patient", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.BankAccountNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.BankCardNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BankShebaNo)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FatherFirstName).HasMaxLength(50);
            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.IdCardNumber)
                .HasMaxLength(13)
                .IsUnicode(false);
            entity.Property(e => e.JobTitle).HasMaxLength(50);
            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(13)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.SearchKey).HasMaxLength(228);
        });

        modelBuilder.Entity<PatientInfo>(entity =>
        {
            entity.ToTable("PatientInfo", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.BirthPlaceCityId).HasColumnName("BirthPlace_CityId");
            entity.Property(e => e.HomeAddress)
                .HasMaxLength(100)
                .HasColumnName("Home_Address");
            entity.Property(e => e.HomeCityId).HasColumnName("Home_CityId");
            entity.Property(e => e.HomePhoneNo)
                .HasMaxLength(11)
                .IsUnicode(false)
                .HasColumnName("Home_PhoneNo");
            entity.Property(e => e.PassportNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PatientReferralType>(entity =>
        {
            entity.ToTable("PatientReferralType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PayrollSocialSecurityBracket>(entity =>
        {
            entity.ToTable("PayrollSocialSecurityBracket", "hr");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.EmployeeScpercentage).HasColumnName("EmployeeSCPercentage");
            entity.Property(e => e.EmployerScpercentage).HasColumnName("EmployerSCPercentage");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
            entity.Property(e => e.UnEmploymentScpercentage).HasColumnName("UnEmploymentSCPercentage");
            entity.Property(e => e.WorkshopCode)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.WorkshopName).HasMaxLength(50);
        });

        modelBuilder.Entity<PayrollTaxBracket>(entity =>
        {
            entity.ToTable("PayrollTaxBracket", "hr");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PayrollTaxBracketLine>(entity =>
        {
            entity.ToTable("PayrollTaxBracketLine", "hr");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<PersonAccount>(entity =>
        {
            entity.ToTable("PersonAccount", "gn");

            entity.Property(e => e.AccountNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CardNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ShebaNo)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PersonGroup>(entity =>
        {
            entity.ToTable("PersonGroup", "cr");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PersonGroupType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PersonType");

            entity.ToTable("PersonGroupType", "cr");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PersonInvoice>(entity =>
        {
            entity.ToTable("PersonInvoice", "sm");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.InvoiceDate).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.Status).HasComment("1: Open\r\n2: Close\r\n3: Cancel");
        });

        modelBuilder.Entity<PersonInvoiceLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("PersonInvoiceLine", "sm");

            entity.Property(e => e.ConfirmDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiscountAmount).HasColumnType("numeric(11, 3)");
            entity.Property(e => e.DiscountPer).HasColumnType("numeric(11, 3)");
            entity.Property(e => e.ExchangeRate).HasColumnType("numeric(8, 0)");
            entity.Property(e => e.Price).HasColumnType("numeric(8, 0)");
        });

        modelBuilder.Entity<PersonTitle>(entity =>
        {
            entity.ToTable("PersonTitle", "gn");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Po>(entity =>
        {
            entity.ToTable("Pos", "fm");

            entity.Property(e => e.CashierIpAddress)
                .HasMaxLength(23)
                .IsUnicode(false)
                .HasColumnName("Cashier_IpAddress");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.TerminalNo)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PosPayment>(entity =>
        {
            entity.ToTable("PosPayments", "fm");

            entity.Property(e => e.AccountNo).HasMaxLength(30);
            entity.Property(e => e.Amount).HasMaxLength(20);
            entity.Property(e => e.CardNo).HasMaxLength(20);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.PaymentId).HasMaxLength(30);
            entity.Property(e => e.RefNo).HasMaxLength(30);
            entity.Property(e => e.TerminalNo).HasMaxLength(20);
        });

        modelBuilder.Entity<PosProvider>(entity =>
        {
            entity.ToTable("PosProvider", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<PostingGroupAccount>(entity =>
        {
            entity.ToTable("PostingGroupAccount", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglId).HasColumnName("AccountSGlId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<PostingGroupHeader>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PostingGroup");

            entity.ToTable("PostingGroupHeader", "fm");
        });

        modelBuilder.Entity<PostingGroupHeaderDetail>(entity =>
        {
            entity.ToTable("PostingGroupHeaderDetail", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<PostingGroupJob>(entity =>
        {
            entity.ToTable("PostingGroupJob", "fm");
        });

        modelBuilder.Entity<PostingGroupLine>(entity =>
        {
            entity.ToTable("PostingGroupLine", "fm");
        });

        modelBuilder.Entity<PostingGroupLineDetail>(entity =>
        {
            entity.ToTable("PostingGroupLineDetail", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ModifiedDateTime).HasColumnType("datetime");
            entity.Property(e => e.StageIdentityTypeName)
                .IsRequired()
                .HasMaxLength(13)
                .HasComputedColumnSql("(case when isnull([StageIdentityTypeId],(0))=(1) then N'نوع وجه برگه' when isnull([StageIdentityTypeId],(0))=(2) then N'نوع گردش برگه' else N'' end)", false);
        });

        modelBuilder.Entity<PostingGroupMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PostinggroupMethod");

            entity.ToTable("PostingGroupMethod", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng).HasMaxLength(50);
        });

        modelBuilder.Entity<PostingGroupType>(entity =>
        {
            entity.ToTable("PostingGroupType", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PostingGroupTypeLine>(entity =>
        {
            entity.ToTable("PostingGroupTypeLine", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.ToTable("Prescription", "mc");

            entity.Property(e => e.CollectionDateTime).HasColumnType("datetime");
            entity.Property(e => e.CompositionUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CompositionUID");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ExpiryDate).HasColumnType("datetime");
            entity.Property(e => e.Hid)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("HID");
            entity.Property(e => e.Hidonline).HasColumnName("HIDOnline");
            entity.Property(e => e.MessageUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("MessageUID");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.PatientUid)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PatientUID");
            entity.Property(e => e.ReasonEncounter).HasMaxLength(100);
            entity.Property(e => e.SendPrescriptionDateTime).HasColumnType("datetime");
            entity.Property(e => e.SpecimenIdentifier).HasMaxLength(20);
            entity.Property(e => e.UpdateHiddateTime)
                .HasColumnType("datetime")
                .HasColumnName("UpdateHIDDateTime");
            entity.Property(e => e.UpdateHidresult).HasColumnName("UpdateHIDResult");
        });

        modelBuilder.Entity<PrescriptionDrugLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("PrescriptionDrugLine", "mc");

            entity.Property(e => e.HeaderId).HasColumnName("HeaderID");
            entity.Property(e => e.Description).HasMaxLength(70);
            entity.Property(e => e.Dosage)
                .HasComment("thrSNOMEDCT")
                .HasColumnType("numeric(6, 2)");
            entity.Property(e => e.DosageUnitId).HasComment("thrUCUM");
            entity.Property(e => e.FrequencyId).HasComment("thrSNOMEDCT");
            entity.Property(e => e.MethodId).HasComment("thrSNOMEDCT");
            entity.Property(e => e.PatientInstruction).HasMaxLength(70);
            entity.Property(e => e.ProductId).HasComment("thrERX");
            entity.Property(e => e.RouteId).HasComment("thrSNOMEDCT");
        });

        modelBuilder.Entity<PrescriptionDrugLineDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber, e.DetailRowNumber });

            entity.ToTable("PrescriptionDrugLineDetail", "mc");

            entity.Property(e => e.HeaderId).HasColumnName("HeaderID");
        });

        modelBuilder.Entity<PrescriptionImageLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("PrescriptionImageLine", "mc");

            entity.Property(e => e.HeaderId).HasColumnName("HeaderID");
            entity.Property(e => e.Note).HasMaxLength(50);
            entity.Property(e => e.PatientInstruction).HasMaxLength(50);
        });

        modelBuilder.Entity<PrescriptionImageLineDetail>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber, e.DetailRowNumber });

            entity.ToTable("PrescriptionImageLineDetail", "mc");

            entity.Property(e => e.HeaderId).HasColumnName("HeaderID");
        });

        modelBuilder.Entity<PrescriptionLabLine>(entity =>
        {
            entity.HasKey(e => new { e.HeaderId, e.RowNumber });

            entity.ToTable("PrescriptionLabLine", "mc");

            entity.Property(e => e.HeaderId).HasColumnName("HeaderID");
            entity.Property(e => e.Note).HasMaxLength(50);
            entity.Property(e => e.PatientInstruction).HasMaxLength(50);
        });

        modelBuilder.Entity<PrescriptionTamin>(entity =>
        {
            entity.ToTable("PrescriptionTamin", "mc");

            entity.Property(e => e.Comment).HasMaxLength(100);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Otpcode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("OTPCode");
            entity.Property(e => e.RequestEprescriptionId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("RequestEPrescriptionId");
            entity.Property(e => e.SendDateTime).HasColumnType("datetime");
            entity.Property(e => e.TrackingCode).HasMaxLength(15);
        });

        modelBuilder.Entity<PrescriptionTaminEdit>(entity =>
        {
            entity.ToTable("PrescriptionTaminEdit", "mc");

            entity.Property(e => e.JsonStr).IsRequired();
        });

        modelBuilder.Entity<PrescriptionTaminLine>(entity =>
        {
            entity.ToTable("PrescriptionTaminLine", "mc");

            entity.Property(e => e.Dose).HasMaxLength(200);
            entity.Property(e => e.DrugAmountCode).HasMaxLength(20);
            entity.Property(e => e.DrugInstructionCode).HasMaxLength(20);
            entity.Property(e => e.DrugUsageCode).HasMaxLength(20);
            entity.Property(e => e.NoteDetailsEprscId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ParaclinicTareffGroupId)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.PlanCode).HasMaxLength(12);
            entity.Property(e => e.SendDateTime).HasColumnType("datetime");
            entity.Property(e => e.ServiceCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaminPrescriptionTypeId)
                .HasMaxLength(4)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PrescriptionTaminLineEdit>(entity =>
        {
            entity.ToTable("PrescriptionTaminLineEdit", "mc");
        });

        modelBuilder.Entity<PrescriptionType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("PrescriptionType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<PriceType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ComissionPriceType");

            entity.ToTable("PriceType", "gn");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<PricingModel>(entity =>
        {
            entity.ToTable("PricingModel", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PurchaseOrder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PersonOrder");

            entity.ToTable("PurchaseOrder", "pu");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.OrderNo).HasComment("شماره سفارش");
            entity.Property(e => e.StageId).HasComment("1:Sales\r\n2:Purchase");
            entity.Property(e => e.SumAvgDiscountPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumAvgFinalPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumAvgGrossPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumAvgNetPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumAvgVatprice)
                .HasColumnType("decimal(21, 3)")
                .HasColumnName("SumAvgVATPrice");
            entity.Property(e => e.SumDiscountAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumGrossAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumNetAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumNetAmountPlusVat)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("SumNetAmountPlusVAT");
            entity.Property(e => e.SumQuantity).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.SumTotalAvgDiscountAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumTotalAvgFinalAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumTotalAvgGrossAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumTotalAvgNetAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumTotalAvgVatamount)
                .HasColumnType("decimal(21, 3)")
                .HasColumnName("SumTotalAvgVATAmount");
            entity.Property(e => e.SumVatamount)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("SumVATAmount");
        });

        modelBuilder.Entity<PurchaseOrderInvoice>(entity =>
        {
            entity.ToTable("PurchaseOrderInvoice", "pu");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.OrderNo).HasMaxLength(11);
            entity.Property(e => e.SumDiscountAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumGrossAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumNetAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumNetAmountPlusVat).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.SumQuantity).HasColumnType("decimal(12, 3)");
            entity.Property(e => e.SumVatAmount).HasColumnType("decimal(21, 3)");
        });

        modelBuilder.Entity<PurchaseOrderLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PurchaseOrdersLine");

            entity.ToTable("PurchaseOrderLine", "pu");

            entity.Property(e => e.AllowInvoiceDiscount).HasComment("مجوز");
            entity.Property(e => e.AvgDiscountPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.AvgFinalPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.AvgGrossPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.AvgMargin).HasColumnType("numeric(5, 2)");
            entity.Property(e => e.AvgNetPrice).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.AvgVatprice)
                .HasColumnType("decimal(21, 3)")
                .HasColumnName("AvgVATPrice");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiscountAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.DiscountType).HasComment("مقدار 1 معادل درصد - مقدار 2 معادل نرخ");
            entity.Property(e => e.DiscountValue).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.ExchangeRate)
                .HasComment("این نرخ برای ارز پیشفرض داخل جدول کمپانی برابر 1 می باشد")
                .HasColumnType("numeric(21, 3)");
            entity.Property(e => e.FinalAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.GrossAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.NetAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.Price)
                .HasComment("نرخ خارجی - مبلغ برابر است با تعداد*نرخ*نرخ تسعیر")
                .HasColumnType("numeric(21, 3)");
            entity.Property(e => e.PriceIncludingVat)
                .HasComment("قیمت مصرف کننده")
                .HasColumnName("PriceIncludingVAT");
            entity.Property(e => e.Quantity).HasColumnType("numeric(18, 3)");
            entity.Property(e => e.TotalAvgDiscountAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.TotalAvgFinalAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.TotalAvgGrossAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.TotalAvgNetAmount).HasColumnType("decimal(21, 3)");
            entity.Property(e => e.TotalAvgVatamount)
                .HasColumnType("decimal(21, 3)")
                .HasColumnName("TotalAvgVATAmount");
            entity.Property(e => e.Vatamount)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("VATAmount");
            entity.Property(e => e.Vatper)
                .HasComment("درصد مالیات بر ارزش افزوده را ذخیره میکند که ملاک محاسبه مبلغ با احتساب ارزش افزوده می باشد")
                .HasColumnName("VATPer");
        });

        modelBuilder.Entity<PurchaseOrderLineDetail>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderLineId).HasName("PK_PersonOrderLineDetail");

            entity.ToTable("PurchaseOrderLineDetail", "pu");

            entity.Property(e => e.PurchaseOrderLineId).ValueGeneratedNever();
            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Ratio).HasColumnType("numeric(8, 3)");
            entity.Property(e => e.TotalQuantity).HasColumnType("numeric(18, 3)");
        });

        modelBuilder.Entity<ReferringDoctor>(entity =>
        {
            entity.ToTable("ReferringDoctor", "mc");

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.Msc)
                .HasMaxLength(10)
                .HasColumnName("MSC");
            entity.Property(e => e.MscTypeId).HasColumnName("MSC_TypeId");
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(11)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RelationShipType>(entity =>
        {
            entity.ToTable("RelationShipType", "sm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ReturnReason>(entity =>
        {
            entity.ToTable("ReturnReason", "sm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<RoleAuthenticate>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.NavigationId, e.OperationTypeId });

            entity.ToTable("RoleAuthenticate", "gn");
        });

        modelBuilder.Entity<RoleBranchPermission>(entity =>
        {
            entity.ToTable("RoleBranchPermission", "gn");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<RoleFiscalYearPermission>(entity =>
        {
            entity.ToTable("RoleFiscalYearPermission", "gn");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<RoleStageStepAuthenticate>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.StageStepId });

            entity.ToTable("RoleStageStepAuthenticate", "gn");
        });

        modelBuilder.Entity<RoleWorkflowPermission>(entity =>
        {
            entity.ToTable("RoleWorkflowPermission", "gn");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<RollCallDevice>(entity =>
        {
            entity.ToTable("RollCallDevice", "hr");

            entity.Property(e => e.DevicePassword).HasMaxLength(100);
            entity.Property(e => e.IpAddress)
                .HasMaxLength(23)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NecessaryMobileNo)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<SaleOrder>(entity =>
        {
            entity.ToTable("SaleOrder", "sm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.SumDiscountAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumGrossAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumNetAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.SumNetAmountPlusVat)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("SumNetAmountPlusVAT");
            entity.Property(e => e.SumQuantity).HasColumnType("numeric(8, 3)");
            entity.Property(e => e.SumVatamount)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("SumVATAmount");
        });

        modelBuilder.Entity<SaleOrderActionLog>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("SaleOrderActionLog", "sm");

            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<SaleOrderLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SaleorderLine");

            entity.ToTable("SaleOrderLine", "sm");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DiscountAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.DiscountValue).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.ExchangeRate).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.FinalAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.GrossAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.NetAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.Price).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.PriceIncludingVat).HasColumnName("PriceIncludingVAT");
            entity.Property(e => e.Quantity).HasColumnType("numeric(8, 3)");
            entity.Property(e => e.Vatamount)
                .HasColumnType("numeric(21, 3)")
                .HasColumnName("VATAmount");
            entity.Property(e => e.Vatper).HasColumnName("VATPer");
        });

        modelBuilder.Entity<SaleOrderLineDetail>(entity =>
        {
            entity.HasKey(e => e.SaleOrderLineId);

            entity.ToTable("SaleOrderLineDetail", "sm");

            entity.Property(e => e.SaleOrderLineId).ValueGeneratedNever();
            entity.Property(e => e.AttributeIds)
                .HasMaxLength(120)
                .IsUnicode(false);
            entity.Property(e => e.Ratio).HasColumnType("decimal(8, 3)");
            entity.Property(e => e.TotalQuantity).HasColumnType("decimal(8, 3)");
        });

        modelBuilder.Entity<Schema>(entity =>
        {
            entity.HasKey(e => e.Version).HasName("PK_HangFire_Schema");

            entity.ToTable("Schema", "HangFire");

            entity.Property(e => e.Version).ValueGeneratedNever();
        });

        modelBuilder.Entity<Segment>(entity =>
        {
            entity.ToTable("Segment", "sm");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Note).HasMaxLength(2000);
        });

        modelBuilder.Entity<SegmentLine>(entity =>
        {
            entity.ToTable("SegmentLine", "sm");
        });

        modelBuilder.Entity<SendHistory>(entity =>
        {
            entity.ToTable("SendHistory", "gn");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CentralId)
                .HasMaxLength(36)
                .IsUnicode(false);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.ObjectId)
                .HasMaxLength(36)
                .IsUnicode(false);
            entity.Property(e => e.OperationTypeId).HasComment("1:INSERT,2:UPDATE,3:DELETE");
            entity.Property(e => e.SendDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Server>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_HangFire_Server");

            entity.ToTable("Server", "HangFire");

            entity.Property(e => e.Id).HasMaxLength(200);
            entity.Property(e => e.LastHeartbeat).HasColumnType("datetime");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("Service", "mc");

            entity.Property(e => e.Name).HasMaxLength(500);
            entity.Property(e => e.OnlineName).HasMaxLength(50);
            entity.Property(e => e.PrintDescription).HasMaxLength(200);
            entity.Property(e => e.ShortName)
                .HasMaxLength(50)
                .HasColumnName("Short_Name");
            entity.Property(e => e.TerminologyId).HasComment("THRRVU");
        });

        modelBuilder.Entity<ServiceCenter>(entity =>
        {
            entity.ToTable("ServiceCenter", "mc");

            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        modelBuilder.Entity<ServiceType>(entity =>
        {
            entity.ToTable("ServiceType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NickName).HasMaxLength(15);
            entity.Property(e => e.TerminologyId)
                .HasMaxLength(4)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Value }).HasName("PK_HangFire_Set");

            entity.ToTable("Set", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Value).HasMaxLength(256);
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Setup>(entity =>
        {
            entity.ToTable("Setup", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CentralWebsite).HasMaxLength(50);
            entity.Property(e => e.CisWcfSystemId)
                .HasMaxLength(36)
                .IsUnicode(false)
                .HasColumnName("CIS_WCF_SystemId");
            entity.Property(e => e.CisWcfUrl)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CIS_WCF_Url");
            entity.Property(e => e.SiteBaseUrl)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SmsServiceLogin)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SmsServiceNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.SmsServicePanel)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.SmsServicePassword)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaminClientId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaminClientSecret)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SetupClientWebService>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SetupClientTamin");

            entity.ToTable("SetupClientWebService", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AcceptableParaClinicTypeId)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.ServiceBaseUrl).HasMaxLength(100);
            entity.Property(e => e.ServiceFullUrl)
                .HasMaxLength(159)
                .HasComputedColumnSql("(((([ServiceProtocol]+'://')+[ServiceBaseUrl])+':')+[ServicePortNumber])", false);
            entity.Property(e => e.ServicePortNumber).HasMaxLength(50);
            entity.Property(e => e.ServiceProtocol).HasMaxLength(5);
            entity.Property(e => e.SoftwareClientId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SoftwareClientSecret)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UserName).HasMaxLength(50);
        });

        modelBuilder.Entity<SetupHealthCare>(entity =>
        {
            entity.HasKey(e => e.CompanyId);

            entity.ToTable("SetupHealthCare", "mc");

            entity.Property(e => e.CompanyId).ValueGeneratedNever();
            entity.Property(e => e.ArmedInsuranceIdentity)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ArmedInsuranceName).HasMaxLength(50);
            entity.Property(e => e.CisWcfSystemId)
                .HasMaxLength(36)
                .IsUnicode(false)
                .HasColumnName("CIS_WCF_SystemId");
            entity.Property(e => e.CisWcfUrl)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CIS_WCF_Url");
            entity.Property(e => e.SiamId).HasMaxLength(50);
            entity.Property(e => e.TaminClientId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaminClientSecret)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TaminInsuranceIdentity)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaminInsuranceName).HasMaxLength(50);
            entity.Property(e => e.WebServiceOrgGuid)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("WebService_Org_Guid");
            entity.Property(e => e.WebServiceOrgTerminologyId).HasColumnName("WebService_Org_TerminologyId");
        });

        modelBuilder.Entity<ShareHolder>(entity =>
        {
            entity.ToTable("ShareHolder", "fm");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.AgentFullName).HasMaxLength(100);
            entity.Property(e => e.BrandName).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.IdNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.JobTitle).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaxCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VatareaId).HasColumnName("VATAreaId");
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.Vatinclude).HasColumnName("VATInclude");
            entity.Property(e => e.WebSite).HasMaxLength(50);
        });

        modelBuilder.Entity<ShipmentMethod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ShipmentMethod_1");

            entity.ToTable("ShipmentMethod", "sm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ShipmentCode)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SignalRgroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SignalGroup");

            entity.ToTable("SignalRGroup", "gn");

            entity.Property(e => e.KeyId)
                .HasMaxLength(33)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<SignalRgroupLine>(entity =>
        {
            entity.HasKey(e => new { e.MasterId, e.RoleId }).HasName("PK_SignalGroupLine");

            entity.ToTable("SignalRGroupLine", "gn");
        });

        modelBuilder.Entity<Speciality>(entity =>
        {
            entity.ToTable("Speciality", "mc");

            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Stage>(entity =>
        {
            entity.ToTable("Stage", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.InOutDirection).HasComment("1=HeaderInOut / 2=LineInOut");
            entity.Property(e => e.Name).HasMaxLength(70);
            entity.Property(e => e.NameEng)
                .HasMaxLength(70)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StageAction>(entity =>
        {
            entity.ToTable("StageAction", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.PreviousStageActionId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Sms).HasColumnName("SMS");
        });

        modelBuilder.Entity<StageActionLog>(entity =>
        {
            entity.ToTable("StageActionLog", "wf");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<StageActionOriginDestination>(entity =>
        {
            entity.ToTable("StageActionOriginDestination", "wf");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<StageActionRelation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PreviousStage");

            entity.ToTable("StageActionRelation", "wf");
        });

        modelBuilder.Entity<StageClass>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OrderClass");

            entity.ToTable("StageClass", "wf");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StageFieldTable>(entity =>
        {
            entity.ToTable("StageFieldTable", "wf");

            entity.Property(e => e.FieldTableName)
                .HasMaxLength(30)
                .IsFixedLength();
            entity.Property(e => e.TableName)
                .HasMaxLength(30)
                .IsFixedLength();
        });

        modelBuilder.Entity<StageFormPlate>(entity =>
        {
            entity.ToTable("StageFormPlate", "wf");

            entity.Property(e => e.ControllerName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FormName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Path).HasMaxLength(150);
        });

        modelBuilder.Entity<StageFundItemType>(entity =>
        {
            entity.ToTable("StageFundItemType", "wf");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.FundItemTypeName)
                .IsRequired()
                .HasMaxLength(13)
                .HasComputedColumnSql("(case when isnull([FundItemType],(0))=(1) then N'نوع وجه برگه' when isnull([FundItemType],(0))=(2) then N'نوع گردش برگه' else N'' end)", false);
        });

        modelBuilder.Entity<StageStepConfig>(entity =>
        {
            entity.ToTable("StageStepConfig", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<StageStepConfigDetail>(entity =>
        {
            entity.ToTable("StageStepConfigDetail", "wf");

            entity.Property(e => e.FieldTableValue).HasMaxLength(50);
        });

        modelBuilder.Entity<StageStepConfigLine>(entity =>
        {
            entity.ToTable("StageStepConfigLine", "wf");

            entity.Property(e => e.FieldTableValue).HasMaxLength(50);
        });

        modelBuilder.Entity<StandardTimeSheet>(entity =>
        {
            entity.ToTable("StandardTimeSheet", "hr", tb => tb.HasComment("تقویم استاندارد برای یک دپارتمان و یک سال مالی در این جدول قرار می گیرد"));

            entity.Property(e => e.Id).HasComment("شناسه تقویم استاندارد");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(70);
            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.NameEng)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StandardTimeSheetHoliday>(entity =>
        {
            entity.ToTable("StandardTimeSheetHoliday", "hr", tb => tb.HasComment("روزهای تعطیل مربوط به یک تقویم استاندارد در این جدول تعریف می شود"));

            entity.Property(e => e.Id).HasComment("شناسه تعطیلات تقویم استاندارد");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DayId).HasComment("روز شمسی");
            entity.Property(e => e.HeaderId).HasComment("شناسه تقویم استاندارد");
            entity.Property(e => e.MonthId).HasComment("ماه شمسی");
        });

        modelBuilder.Entity<StandardTimeSheetPerMonth>(entity =>
        {
            entity.ToTable("StandardTimeSheetPerMonth", "hr", tb => tb.HasComment("ماه های کاری و ساعت موظفی کارکرد برای یک تقویم استاندارد در این جدول تعریف می شود"));

            entity.Property(e => e.Id).HasComment("شناسه ساعت کاری استاندارد ماهانه");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.MonthId).HasComment("ماه شمسی");
            entity.Property(e => e.StandardMonthWorkingHours).HasComment("تعداد ساعت کاری موظفی قانون کار");
            entity.Property(e => e.StandardTimeSheetId).HasComment("شناسه تقویم استاندارد");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => new { e.JobId, e.Id }).HasName("PK_HangFire_State");

            entity.ToTable("State", "HangFire");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.Reason).HasMaxLength(100);
        });

        modelBuilder.Entity<TableName>(entity =>
        {
            entity.ToTable("TableName", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.TableName1)
                .HasMaxLength(80)
                .IsUnicode(false)
                .HasColumnName("TableName");
        });

        modelBuilder.Entity<TaminDrugAmount>(entity =>
        {
            entity.ToTable("taminDrugAmount", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Concept).HasMaxLength(50);
            entity.Property(e => e.LatinName).HasMaxLength(50);
            entity.Property(e => e.Summary).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminDrugInstruction>(entity =>
        {
            entity.ToTable("taminDrugInstruction", "mc");

            entity.Property(e => e.Code).HasMaxLength(15);
            entity.Property(e => e.Concept).HasMaxLength(50);
            entity.Property(e => e.LatinName).HasMaxLength(50);
            entity.Property(e => e.Summary).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminDrugUsage>(entity =>
        {
            entity.ToTable("taminDrugUsage", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Concept).HasMaxLength(100);
            entity.Property(e => e.LatinName).HasMaxLength(50);
            entity.Property(e => e.Summary).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminEprescription>(entity =>
        {
            entity.ToTable("TaminEPrescription", "mc");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.EprescriptionId).HasColumnName("EPrescriptionId");
        });

        modelBuilder.Entity<TaminIllness>(entity =>
        {
            entity.ToTable("taminIllness", "mc");

            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<TaminOrgan>(entity =>
        {
            entity.ToTable("taminOrgan", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminParaClinicType>(entity =>
        {
            entity.ToTable("TaminParaClinicType", "mc");

            entity.Property(e => e.Id)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminParaclinicGroup>(entity =>
        {
            entity.ToTable("taminParaclinicGroup", "mc");

            entity.Property(e => e.Id)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminPlan>(entity =>
        {
            entity.ToTable("taminPlan", "mc");

            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminPrescriptionCategory>(entity =>
        {
            entity.ToTable("TaminPrescriptionCategory", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<TaminPrescriptionType>(entity =>
        {
            entity.ToTable("TaminPrescriptionType", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.TaminPrescriptionCategoryId)
                .HasMaxLength(5)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TaminService>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tamin");

            entity.ToTable("taminService", "mc");

            entity.Property(e => e.AcceptableGender).HasMaxLength(50);
            entity.Property(e => e.FreePrice).HasColumnName("FREE_PRICE");
            entity.Property(e => e.GovernmentPrice).HasColumnName("GOVERNMENT_PRICE");
            entity.Property(e => e.GrpCode)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("GRP_CODE");
            entity.Property(e => e.Ismaster).HasColumnName("ISMASTER");
            entity.Property(e => e.MaxAge).HasColumnName("MAX_AGE");
            entity.Property(e => e.MinAge).HasColumnName("MIN_AGE");
            entity.Property(e => e.PartypeCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("PARTYPE_CODE");
            entity.Property(e => e.ServiceName)
                .HasMaxLength(700)
                .HasColumnName("SERVICE_NAME");
            entity.Property(e => e.Spiral).HasColumnName("SPIRAL");
            entity.Property(e => e.TarefCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("TAREF_CODE");
            entity.Property(e => e.Techprice).HasColumnName("TECHPRICE");
        });

        modelBuilder.Entity<TaminServiceGroup>(entity =>
        {
            entity.ToTable("taminServiceGroup", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(70);
        });

        modelBuilder.Entity<TaminServicePrescription>(entity =>
        {
            entity.ToTable("TaminServicePrescription", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AgreementFlag).HasMaxLength(50);
            entity.Property(e => e.BgType).HasMaxLength(50);
            entity.Property(e => e.BimSw).HasMaxLength(5);
            entity.Property(e => e.Code).HasMaxLength(20);
            entity.Property(e => e.CodeComplete).HasMaxLength(50);
            entity.Property(e => e.CountIsRestricted).HasMaxLength(50);
            entity.Property(e => e.DentalServiceType).HasMaxLength(50);
            entity.Property(e => e.DoseCode).HasMaxLength(50);
            entity.Property(e => e.Gcode)
                .HasMaxLength(20)
                .HasColumnName("GCode");
            entity.Property(e => e.HosPrescType).HasMaxLength(50);
            entity.Property(e => e.IsDeleted).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(600);
            entity.Property(e => e.ParaclinicTareffCode).HasMaxLength(20);
            entity.Property(e => e.Price).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.PriceDate)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.StatusDate).HasMaxLength(10);
            entity.Property(e => e.TaminPrescriptionCategoryId).HasMaxLength(50);
            entity.Property(e => e.TaminPrescriptionTypeId).HasMaxLength(3);
            entity.Property(e => e.TaminPrescriptionTypeName).HasMaxLength(30);
            entity.Property(e => e.Terminology).HasMaxLength(50);
            entity.Property(e => e.Visible).HasMaxLength(50);
            entity.Property(e => e.WsCode).HasMaxLength(20);
        });

        modelBuilder.Entity<TaminServicePrescriptionOld>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("TaminServicePrescriptionOld", "mc");

            entity.Property(e => e.AgreementFlag).HasMaxLength(50);
            entity.Property(e => e.BgType).HasMaxLength(50);
            entity.Property(e => e.BimSw).HasMaxLength(5);
            entity.Property(e => e.Code).HasMaxLength(20);
            entity.Property(e => e.CodeComplete).HasMaxLength(50);
            entity.Property(e => e.CountIsRestricted).HasMaxLength(50);
            entity.Property(e => e.DentalServiceType).HasMaxLength(50);
            entity.Property(e => e.DoseCode).HasMaxLength(50);
            entity.Property(e => e.Gcode)
                .HasMaxLength(20)
                .HasColumnName("GCode");
            entity.Property(e => e.HosPrescType).HasMaxLength(50);
            entity.Property(e => e.IsDeleted).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(600);
            entity.Property(e => e.ParaclinicTareffCode).HasMaxLength(20);
            entity.Property(e => e.Price).HasColumnType("decimal(15, 3)");
            entity.Property(e => e.PriceDate)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.StatusDate).HasMaxLength(10);
            entity.Property(e => e.TaminPrescriptionCategoryId).HasMaxLength(50);
            entity.Property(e => e.TaminPrescriptionTypeId).HasMaxLength(3);
            entity.Property(e => e.TaminPrescriptionTypeName).HasMaxLength(30);
            entity.Property(e => e.Terminology).HasMaxLength(50);
            entity.Property(e => e.Visible).HasMaxLength(50);
            entity.Property(e => e.WsCode).HasMaxLength(20);
        });

        modelBuilder.Entity<TaminServiceType>(entity =>
        {
            entity.ToTable("taminServiceType", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<TaminToken>(entity =>
        {
            entity.ToTable("TaminToken", "mc");

            entity.Property(e => e.ParaClinicTypeId)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.TokenDateTime).HasColumnType("datetime");
            entity.Property(e => e.TokenId).HasMaxLength(1000);
        });

        modelBuilder.Entity<TaskHistory>(entity =>
        {
            entity.ToTable("TaskHistory", "tsk");

            entity.Property(e => e.CreateDateTime).HasPrecision(3);
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.GeneratedKey)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaskService)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TaskScheduleHistory>(entity =>
        {
            entity.ToTable("TaskScheduleHistory", "mc");

            entity.Property(e => e.TaskDateTime).HasColumnType("datetime");
            entity.Property(e => e.TaskDescription).HasMaxLength(100);
            entity.Property(e => e.TaskTitle).HasMaxLength(50);
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.ToTable("Team", "sm");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NameEng)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TeamSalesPerson>(entity =>
        {
            entity.HasKey(e => new { e.TeamId, e.EmployeeId });

            entity.ToTable("TeamSalesPerson", "sm");
        });

        modelBuilder.Entity<TeethNumber>(entity =>
        {
            entity.HasKey(e => new { e.FdiId, e.TeethNumberSystemId });

            entity.ToTable("TeethNumber", "mc");

            entity.Property(e => e.TeethNumber1)
                .IsRequired()
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("TeethNumber");
        });

        modelBuilder.Entity<TeethNumberSystem>(entity =>
        {
            entity.ToTable("TeethNumberSystem", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TempTaminService>(entity =>
        {
            entity.ToTable("tempTaminService", "mc");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SrvBimSw)
                .HasMaxLength(5)
                .HasColumnName("srvBimSw");
            entity.Property(e => e.SrvCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("srvCode");
            entity.Property(e => e.SrvName)
                .HasMaxLength(2000)
                .HasColumnName("srvName");
            entity.Property(e => e.SrvType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("srvType");
            entity.Property(e => e.WsSrvCode)
                .HasMaxLength(50)
                .HasColumnName("wsSrvCode");
        });

        modelBuilder.Entity<Terminology>(entity =>
        {
            entity.ToTable("Terminology", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEn)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TableName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TerminologyMap>(entity =>
        {
            entity.HasKey(e => new { e.SourceTerminologyId, e.SourceId, e.DestinationTerminologyId, e.DestinationId }).HasName("PK_TerminologyMap_1");

            entity.ToTable("TerminologyMap", "gn");

            entity.Property(e => e.DestinationCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DestinationName).HasMaxLength(1000);
            entity.Property(e => e.RelationType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SourceCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SourceName).HasMaxLength(1000);
        });

        modelBuilder.Entity<ThrAdmissionType>(entity =>
        {
            entity.ToTable("thrAdmissionType", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(1);
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<ThrAdum>(entity =>
        {
            entity.ToTable("thrADA", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrArrivalMode>(entity =>
        {
            entity.ToTable("thrArrivalMode", "mc");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrAtc>(entity =>
        {
            entity.ToTable("thrATC", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(50);
            entity.Property(e => e.Value).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrCdt>(entity =>
        {
            entity.ToTable("thrCDT", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(6);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Name).HasMaxLength(500);
        });

        modelBuilder.Entity<ThrCountryDivision>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("thrCountryDivision", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(300);
        });

        modelBuilder.Entity<ThrDatatype>(entity =>
        {
            entity.ToTable("thrDatatypes", "mc");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrDeathCauseStatus>(entity =>
        {
            entity.ToTable("thrDeathCauseStatus", "mc");

            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<ThrDeathLocation>(entity =>
        {
            entity.ToTable("thrDeathLocation", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<ThrDiagnosisStatus>(entity =>
        {
            entity.ToTable("thrDiagnosisStatus", "mc");

            entity.Property(e => e.Description).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<ThrDurationDeath>(entity =>
        {
            entity.ToTable("thrDurationDeath", "mc");

            entity.Property(e => e.Description).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<ThrErx>(entity =>
        {
            entity.ToTable("thrERX", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrFdi>(entity =>
        {
            entity.ToTable("thrFDI", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(2);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.NameEng)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.TeethGroupId).HasComment("1:شیری,\r\n2:دائم");
        });

        modelBuilder.Entity<ThrFdoir>(entity =>
        {
            entity.ToTable("thrFDOIR", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<ThrFollowupPlanType>(entity =>
        {
            entity.ToTable("thrFollowupPlanType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrHq>(entity =>
        {
            entity.ToTable("thrHQS", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.HqstypeId).HasColumnName("HQSTypeId");
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ThrIcd>(entity =>
        {
            entity.ToTable("thrICD", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Descript).HasMaxLength(50);
            entity.Property(e => e.Value).HasMaxLength(300);
        });

        modelBuilder.Entity<ThrIcdfa>(entity =>
        {
            entity.ToTable("thrICDFa", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Descript).HasMaxLength(50);
            entity.Property(e => e.Value).HasMaxLength(300);
        });

        modelBuilder.Entity<ThrIcdo3>(entity =>
        {
            entity.ToTable("thrICDO3", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(120);
        });

        modelBuilder.Entity<ThrIcpc2p>(entity =>
        {
            entity.ToTable("thrICPC2P", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrInjurySeverityType>(entity =>
        {
            entity.ToTable("thrInjurySeverityType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrInsuranceBox>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_thrInsuranceBox2");

            entity.ToTable("thrInsuranceBox", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Value).HasMaxLength(100);
        });

        modelBuilder.Entity<ThrInsurer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_thrInsure");

            entity.ToTable("thrInsurer", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Value)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<ThrIrc>(entity =>
        {
            entity.ToTable("thrIRC", "mc");

            entity.Property(e => e.Code).HasMaxLength(20);
            entity.Property(e => e.Value).HasMaxLength(250);
        });

        modelBuilder.Entity<ThrJob>(entity =>
        {
            entity.ToTable("thrJob", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrLifeCycle>(entity =>
        {
            entity.ToTable("thrLifeCycle", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(10);
        });

        modelBuilder.Entity<ThrLnc>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_thrLnc");

            entity.ToTable("thrLNC", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ThrLncmap>(entity =>
        {
            entity.ToTable("thrLNCMap", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.DetailCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DetailTerminology)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DetailValue)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Id1).HasColumnName("Id_");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.OrderOrResult)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PanelCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PrescriptionStatus).HasMaxLength(200);
            entity.Property(e => e.RvuCategory).HasMaxLength(200);
            entity.Property(e => e.RvuCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RvuGroup).HasMaxLength(20);
            entity.Property(e => e.RvuValue).HasMaxLength(500);
            entity.Property(e => e.RvyType).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrMediumType>(entity =>
        {
            entity.ToTable("thrMediumType", "mc");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrNcpdp>(entity =>
        {
            entity.ToTable("thrNCPDP", "mc");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrOrdinalTerm>(entity =>
        {
            entity.ToTable("thrOrdinalTerm", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<ThrOrganization>(entity =>
        {
            entity.ToTable("thrOrganization", "mc");

            entity.Property(e => e.Code)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Value).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrPoint>(entity =>
        {
            entity.ToTable("thrPoint", "mc");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<ThrProporation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_thrProporationR");

            entity.ToTable("thrProporation", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(500);
        });

        modelBuilder.Entity<ThrReferredReason>(entity =>
        {
            entity.ToTable("thrReferredReason", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrReferredType>(entity =>
        {
            entity.ToTable("thrReferredType", "mc");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrRelatedPerson>(entity =>
        {
            entity.ToTable("thrRelatedPerson", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrRvu>(entity =>
        {
            entity.ToTable("thrRVU", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Attribute)
                .HasMaxLength(3)
                .IsUnicode(false);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Device).HasMaxLength(30);
            entity.Property(e => e.Group).HasMaxLength(150);
            entity.Property(e => e.Name).HasMaxLength(1000);
            entity.Property(e => e.ProfessionalCode).HasColumnType("numeric(6, 3)");
            entity.Property(e => e.TechnicalCode).HasColumnType("numeric(6, 3)");
        });

        modelBuilder.Entity<ThrServiceCountUnit>(entity =>
        {
            entity.ToTable("thrServiceCountUnit", "mc");

            entity.Property(e => e.Description).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(10);
        });

        modelBuilder.Entity<ThrServiceType>(entity =>
        {
            entity.ToTable("thrServiceType", "mc");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Code)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<ThrSnomedct>(entity =>
        {
            entity.ToTable("thrSNOMEDCT", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CodingType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(120);
        });

        modelBuilder.Entity<ThrSourceofDeathNotification>(entity =>
        {
            entity.ToTable("thrSourceofDeathNotification", "mc");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<ThrSpecialty>(entity =>
        {
            entity.ToTable("thrSpecialty", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<ThrSpecimenAdequacy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_thrSpecimenAdequacy_1");

            entity.ToTable("thrSpecimenAdequacy", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(500);
        });

        modelBuilder.Entity<ThrThritaEhr>(entity =>
        {
            entity.ToTable("thrThritaEHR", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<ThrUcum>(entity =>
        {
            entity.ToTable("thrUCUM", "mc");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.IsClinicalOnsetDurationToPresent).HasColumnName("Is_Clinical_OnsetDurationToPresent");
            entity.Property(e => e.IsPmhOnsetDurationToPresent).HasColumnName("Is_PMH_OnsetDurationToPresent");
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ThrUsage>(entity =>
        {
            entity.ToTable("thrUsage", "mc");

            entity.Property(e => e.Id).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<TransactionToken>(entity =>
        {
            entity.ToTable("TransactionToken", "gn");

            entity.Property(e => e.ExpirationDateTime).HasColumnType("datetime");
            entity.Property(e => e.Token)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.TransactionTypeId).HasComment("1:Send,2:Receive");
        });

        modelBuilder.Entity<Treasury>(entity =>
        {
            entity.ToTable("Treasury", "fm");

            entity.Property(e => e.AccountGlid).HasColumnName("AccountGLId");
            entity.Property(e => e.AccountSglid).HasColumnName("AccountSGLId");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<TreasuryBond>(entity =>
        {
            entity.ToTable("TreasuryBond", "fm");

            entity.Property(e => e.BondSerialNo).HasMaxLength(20);
        });

        modelBuilder.Entity<TreasuryBondDesign>(entity =>
        {
            entity.ToTable("TreasuryBondDesign", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ColorText)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DescriptionFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Description_Font");
            entity.Property(e => e.DescriptionFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Description_FontSize");
            entity.Property(e => e.DescriptionHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Description_Height");
            entity.Property(e => e.DescriptionIsActive).HasColumnName("Description_IsActive");
            entity.Property(e => e.DescriptionRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Description_Right");
            entity.Property(e => e.DescriptionTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Description_Top");
            entity.Property(e => e.DescriptionWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Description_Width");
            entity.Property(e => e.Height)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.IdnoFont)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_Font");
            entity.Property(e => e.IdnoFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_FontSize");
            entity.Property(e => e.IdnoHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_Height");
            entity.Property(e => e.IdnoIsActive).HasColumnName("IDNo_IsActive");
            entity.Property(e => e.IdnoRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_Right");
            entity.Property(e => e.IdnoTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_Top");
            entity.Property(e => e.IdnoWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IDNo_Width");
            entity.Property(e => e.LetterAmountFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_Font");
            entity.Property(e => e.LetterAmountFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_FontSize");
            entity.Property(e => e.LetterAmountHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_Height");
            entity.Property(e => e.LetterAmountIsActive).HasColumnName("LetterAmount_IsActive");
            entity.Property(e => e.LetterAmountRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_Right");
            entity.Property(e => e.LetterAmountTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_Top");
            entity.Property(e => e.LetterAmountWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterAmount_Width");
            entity.Property(e => e.LetterDateFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("LetterDate_Font");
            entity.Property(e => e.LetterDateFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterDate_FontSize");
            entity.Property(e => e.LetterDateHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterDate_Height");
            entity.Property(e => e.LetterDateIsActive).HasColumnName("LetterDate_IsActive");
            entity.Property(e => e.LetterDateRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterDate_Right");
            entity.Property(e => e.LetterDateTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterDate_Top");
            entity.Property(e => e.LetterDateWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("LetterDate_Width");
            entity.Property(e => e.NumericAmountFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_Font");
            entity.Property(e => e.NumericAmountFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_FontSize");
            entity.Property(e => e.NumericAmountHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_Height");
            entity.Property(e => e.NumericAmountIsActive).HasColumnName("NumericAmount_IsActive");
            entity.Property(e => e.NumericAmountIsSeprate).HasColumnName("NumericAmount_IsSeprate");
            entity.Property(e => e.NumericAmountRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_Right");
            entity.Property(e => e.NumericAmountTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_Top");
            entity.Property(e => e.NumericAmountWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericAmount_Width");
            entity.Property(e => e.NumericDateFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("NumericDate_Font");
            entity.Property(e => e.NumericDateFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericDate_FontSize");
            entity.Property(e => e.NumericDateHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericDate_Height");
            entity.Property(e => e.NumericDateIsActive).HasColumnName("NumericDate_IsActive");
            entity.Property(e => e.NumericDateIsSeprate).HasColumnName("NumericDate_IsSeprate");
            entity.Property(e => e.NumericDateRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericDate_Right");
            entity.Property(e => e.NumericDateTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericDate_Top");
            entity.Property(e => e.NumericDateWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("NumericDate_Width");
            entity.Property(e => e.RecipientFont)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Recipient_Font");
            entity.Property(e => e.RecipientFontSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Recipient_FontSize");
            entity.Property(e => e.RecipientHeight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Recipient_Height");
            entity.Property(e => e.RecipientIsActive).HasColumnName("Recipient_IsActive");
            entity.Property(e => e.RecipientRight)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Recipient_Right");
            entity.Property(e => e.RecipientTop)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Recipient_Top");
            entity.Property(e => e.RecipientWidth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Recipient_Width");
            entity.Property(e => e.Width)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TreasuryLine>(entity =>
        {
            entity.ToTable("TreasuryLine", "fm");

            entity.Property(e => e.BankAccountId).IsSparse();
            entity.Property(e => e.BankId).IsSparse();
            entity.Property(e => e.BankReport).IsSparse();
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.DocumentNo).IsSparse();
            entity.Property(e => e.FinalAmount).HasColumnType("numeric(21, 3)");
            entity.Property(e => e.TransitNo).IsSparse();
            entity.Property(e => e.TreasuryLineDetailId).IsSparse();
        });

        modelBuilder.Entity<TreasuryLineDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_TreasuryCheckDetail");

            entity.ToTable("TreasuryLineDetail", "fm");

            entity.Property(e => e.CheckBankAccountIssuer).HasMaxLength(40);
            entity.Property(e => e.CheckBranchName).HasMaxLength(50);
            entity.Property(e => e.CheckDueDate).HasColumnType("datetime");
            entity.Property(e => e.CheckIssuer).HasMaxLength(100);
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
            entity.Property(e => e.SayadNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TreasurySubject>(entity =>
        {
            entity.ToTable("TreasurySubject", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TreasurySubjectLine>(entity =>
        {
            entity.ToTable("TreasurySubjectLine", "fm");
        });

        modelBuilder.Entity<UnitCostCalculation>(entity =>
        {
            entity.ToTable("UnitCostCalculation", "wh");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<UnitCostCalculationLine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_UnitCostCalculationDetail");

            entity.ToTable("UnitCostCalculationLine", "wh");
        });

        modelBuilder.Entity<UnitCostCalculationLineDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_UnitCostCalculationLine");

            entity.ToTable("UnitCostCalculationLineDetail", "wh");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<UrlWhiteList>(entity =>
        {
            entity.ToTable("UrlWhiteList", "gn");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.BaseUrl)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FullAddress)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Protocol)
                .HasMaxLength(5)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User", "gn");

            entity.Property(e => e.ActivationCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.PasswordSalt)
                .IsRequired()
                .HasMaxLength(10);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        modelBuilder.Entity<UserLanguage>(entity =>
        {
            entity.ToTable("UserLanguages", "gn");

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.FlagName)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<UserWarehouse>(entity =>
        {
            entity.HasKey(e => new { e.WarehouseId, e.ZoneId, e.BinId, e.UserId });

            entity.ToTable("User_Warehouse", "wh");
        });

        modelBuilder.Entity<Vat>(entity =>
        {
            entity.ToTable("VAT", "fm");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Vatper).HasColumnName("VATPer");
            entity.Property(e => e.VattypeId).HasColumnName("VATTypeId");
        });

        modelBuilder.Entity<Vatarea>(entity =>
        {
            entity.ToTable("VATArea", "fm");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Vattype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_TaxType");

            entity.ToTable("VATType", "gn");

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CompanyId });

            entity.ToTable("Vendor", "pu");

            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.AgentFullName).HasMaxLength(70);
            entity.Property(e => e.BrandName).HasMaxLength(50);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(101);
            entity.Property(e => e.IdNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.InsuranceNo)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.JobTitle).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MobileNo)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.NationalCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TaxCode)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.VatareaId).HasColumnName("VATAreaId");
            entity.Property(e => e.Vatenable).HasColumnName("VATEnable");
            entity.Property(e => e.Vatinclude).HasColumnName("VATInclude");
            entity.Property(e => e.WebSite)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VendorGroup>(entity =>
        {
            entity.ToTable("VendorGroup", "pu");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VendorItem>(entity =>
        {
            entity.HasKey(e => new { e.IdentityId, e.PersonGroupTypeId, e.ItemId, e.ItemTypeId });

            entity.ToTable("VendorItems", "pu");

            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<VendorItemPrice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_mc.VendorItemPrice");

            entity.ToTable("VendorItemPrice", "mc");

            entity.Property(e => e.CommissionValue).HasColumnType("decimal(12, 0)");
            entity.Property(e => e.CreateDateTime).HasColumnType("datetime");
        });

        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.ToTable("Warehouse", "wh");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Workflow>(entity =>
        {
            entity.ToTable("Workflow", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorkflowBranch>(entity =>
        {
            entity.ToTable("WorkflowBranch", "wf");
        });

        modelBuilder.Entity<WorkflowCategory>(entity =>
        {
            entity.ToTable("WorkflowCategory", "wf");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorkflowCategoryLine>(entity =>
        {
            entity.ToTable("WorkflowCategoryLine", "wf");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.HeaderTableName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("جداول تعریف شده در این ستون باید ستون های StageId ، ActionId، WorkflowId و ParentWorkflowCategoryId را داشته باشد");
            entity.Property(e => e.LineDetailGroupBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LineDetailTableName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LineGroupBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.LineTableName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LineToLineDetailJoin)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorkflowStage>(entity =>
        {
            entity.ToTable("WorkflowStage", "wf");

            entity.Property(e => e.HeaderTableName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LineTableName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorkingHourType>(entity =>
        {
            entity.ToTable("WorkingHourType", "hr");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WorkingHourTypeLine>(entity =>
        {
            entity.ToTable("WorkingHourTypeLine", "hr");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CostAccountingTypeId).HasComment("مقدار یک \"استاندارد\" و مقدار دو \"واقعی\" است.");
        });

        modelBuilder.Entity<WorkingHourTypeLineDetail>(entity =>
        {
            entity.ToTable("WorkingHourTypeLineDetail", "hr");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<WorkingOperator>(entity =>
        {
            entity.ToTable("WorkingOperator", "hr");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.NameEng)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Zone>(entity =>
        {
            entity.ToTable("Zone", "wh");

            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.NameEng)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasComment("North, South, East, West, International");
            entity.Property(e => e.ZoneRankId).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
