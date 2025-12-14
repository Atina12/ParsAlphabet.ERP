using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public string NationalCode { get; set; }

    public string Email { get; set; }

    public string MobileNo { get; set; }

    public string Username { get; set; }

    public byte? RoleId { get; set; }

    public string PasswordSalt { get; set; }

    public string PasswordHash { get; set; }

    public byte[] Picture { get; set; }

    public bool IsActive { get; set; }

    public short? LanguageId { get; set; }

    public short? LocCityId { get; set; }

    public string ActivationCode { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsOnline { get; set; }
}
