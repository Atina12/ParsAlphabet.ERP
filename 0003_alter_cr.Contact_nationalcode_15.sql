DECLARE @ScriptName NVARCHAR(255) = N'0002_alter_spc_attender_insupd_nationalcode_15.sql';

IF OBJECT_ID(N'dbo.SchemaMigrations', N'U') IS NULL
    THROW 50000, 'SchemaMigrations table not found. Run 0001 first.', 1;

IF EXISTS (SELECT 1 FROM dbo.SchemaMigrations WHERE ScriptName = @ScriptName)
    RETURN;

BEGIN TRY
    -- برای Deploy کردن SP بهتره TRAN نذاری (اختیاریه)
    -- چون ALTER PROCEDURE خودش اتمیکه و GO هم نداریم

    
alter TABLE [cr].[Contact](
	[Id] [int] NOT NULL,
	[CompanyId] [int] NOT NULL,
	[IndustryId] [tinyint] NULL,
	[PersonGroupId] [smallint] NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[FullName] [nvarchar](101) NOT NULL,
	[AgentFullName] [nvarchar](70) NULL,
	[PartnerTypeId] [tinyint] NULL,
	[GenderId] [tinyint] NULL,
	[NationalCode] [varchar](15) NULL,
	[LocCountryId] [smallint] NULL,
	[LocStateId] [smallint] NULL,
	[LocCityId] [smallint] NULL,
	[PostalCode] [varchar](10) NULL,
	[Address] [nvarchar](100) NULL,
	[PhoneNo] [varchar](20) NULL,
	[MobileNo] [varchar](11) NULL,
	[Email] [varchar](50) NULL,
	[WebSite] [varchar](50) NULL,
	[IdNumber] [varchar](11) NULL,
	[IdDate] [date] NULL,
	[VATInclude] [bit] NULL,
	[VATAreaId] [tinyint] NULL,
	[VATEnable] [bit] NULL,
	[TaxCode] [varchar](11) NULL,
	[IsActive] [bit] NULL,
	[JobTitle] [nvarchar](50) NULL,
	[BrandName] [nvarchar](50) NULL,
	[PersonTitleId] [tinyint] NULL,
 CONSTRAINT [PK_Contact] PRIMARY KEY CLUSTERED 
(
	[Id] ASC,
	[CompanyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

    INSERT INTO dbo.SchemaMigrations(ScriptName, AppliedBy)
    VALUES (@ScriptName, SUSER_SNAME());
END TRY
BEGIN CATCH
    THROW;
END CATCH;
