using AutoMapper;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Dtos.GN.Branch;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;

namespace ParseAlphabet.ERP.Web.Utility.ServiceCollection;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Add as many of these lines as you need to map your objects
        CreateMap<DataStageStepConfigColumnsViewModel, DataStageStepConfigColumnsViewModel>();
        CreateMap<NewTreasuryLineGetReccord, NewTreasuryLineModel>();
        CreateMap<NewRequestTreasuryCash, NewRequestTreasuryLines>();
        CreateMap<NewRequestTreasuryCheck, NewRequestTreasuryLines>();
        CreateMap<NewRequestTreasuryDraft, NewRequestTreasuryLines>();
        CreateMap<PurchaseOrderLineGetRecord, PurchaseOrderLineModel>();
        CreateMap<PurchaseInvoiceLineGetRecord, PurchaseInvoiceLineModel>();
        CreateMap<WarehouseTransactionLineGetReccord, WarehouseTransactionLineModel>();
        CreateMap<ItemTransactionLineGetRecord, WarehouseTransactionLineModel>();
        CreateMap<BranchSendHistoryModel, CentralBranch>();
        CreateMap<BranchLineType, BranchLine>();
        CreateMap<AttenderSendHistoryGetRecord, CentralAttender>();
        CreateMap<ServiceSendHistoryGetRecord, CentralService>();
        CreateMap<AttenderServiceSendHistoryGetRecord, CentralAttenderService>();
        CreateMap<ServiceItemPriceSendHistoryGetList, CentralMedicalItemPrice>();
        CreateMap<AttenderScheduleBlockSendHistoryGetList, AttenderScheduleModel>()
            .ForMember(dest => dest.DepartmentTimeShiftId, opt => opt.MapFrom(src => src.DepartmentTimeShiftId));
        CreateMap<MedicalItemPriceGetCentral, CentralMedicalItemPrice>();
        CreateMap<InsurerPriceGetCentral, CentralInsurerPriceModel>();
        CreateMap<InsurerPriceSendHistoryGetList, CentralInsurerPriceModel>();
    }
}