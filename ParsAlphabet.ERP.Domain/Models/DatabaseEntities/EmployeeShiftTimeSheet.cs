using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// ساعت های موظفی هر کارمند بر اساس شیفت های انتخاب شده برای او و ماه کاری مربوطه در این جدول نمایش داده می شود. اینکه به صورت ریز یک کارمند در چه روز از چه ساعتی تا چه ساعتی باید سر کار حاضر باشد به این صورت مشخص می شود
/// </summary>
public partial class EmployeeShiftTimeSheet
{
    public int Id { get; set; }

    /// <summary>
    /// شناسه شیفت در ماه کارمند
    /// </summary>
    public int EmployeeTimeSheetId { get; set; }

    /// <summary>
    /// سال شمسی
    /// </summary>
    public short? YearId { get; set; }

    /// <summary>
    /// ماه شمسی
    /// </summary>
    public string MonthId { get; set; }

    /// <summary>
    /// روز شمسی
    /// </summary>
    public string DayId { get; set; }

    public DateTime? StartDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
