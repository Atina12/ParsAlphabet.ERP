USE [ERP]
GO
/****** Object:  StoredProcedure [mc].[Spc_Admission_Search]    Script Date: 12/15/2025 4:56:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Create date: <>
-- Description: <>
-- Modify date: <2023-05-25 11:14:00.000>
-- Modify user: <v.j>
-- =============================================

--exec [mc].[Spc_Admission_Search] NULL,NULL,NULL,1141400,NULL,NULL,NULL,NULL,1
ALTER PROCEDURE [mc].[Spc_Admission_Search]
(
	@StageId VARCHAR(100),
	@ActionId VARCHAR(100),
	@WorkflowId VARCHAR(100),
	@Id INT=NULL,
	@CreateDate DATE=NULL, 
	@PatientFullName NVARCHAR(101)=NULL,
	@PatientNationalCode VARCHAR(15)=NULL,
	@AttenderId INT=NULL,
	@CompanyId TINYINT=1
)
 
AS

DECLARE @QUERY NVARCHAR(MAX) = N''

SET @QUERY += N'

--execute as owner
SELECT DISTINCT
	a.Id AdmissionId
	,(SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=10) ReasonForEncounterId
	,thricp2cp.Code ReasonForEncounterCode
	,thricp2cp.Name ReasonForEncounterName
	,FORMAT(a.CreateDateTime,''yyyy/MM/dd'',''fa'') AS AdmissionDate
	,CONVERT(VARCHAR(8),a.CreateDateTime,8)  AS AdmissionTime
	,(SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=5) AdmissionHID
	,(SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=2) ReferredHID
	,(SELECT ElementValue FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=3) PatientReferralTypeId
	,PatientId
	,p.FirstName AS PatientFirstName
	,p.LastName AS PatientLastName
	,p.FullName AS PatientFullName
	,p.NationalCode AS PatientNationalCode
	,p.IdCardNumber AS PatientIdCardNumber
	,p.MobileNo AS PatientMobileNo
	,p.Address AS PatientAddress
	,P.GenderId AS PatientGenderId
	,FORMAT(p.BirthDate,''yyyy/MM/dd'',''fa'') AS PatientBirthDate
	,lc.AbbreviationCode AS PatientNationalityId
	,p.PostalCode AS PatientPostalCode
	,p.MaritalStatusId AS PatientMaritalStatusId
	,p.EducationLevelId AS PatientEducationLevelId
	,edu.Name AS PatientEducationLevelName
	,p.FatherFirstName AS PatientFatherFirstName
	,p.JobTitle AS PatientJobTitle
	,p.PhoneNo AS PatientHomeTel
	,a.AttenderId
	,att.MSC AS AttenderMSCId
	,att.MSC_TypeId AS AttenderMSCTypeId
	,ar.Name AS AttenderRoleName
	,ar.Code AS AttenderRoleCode
	,tms.DestinationCode AS AttenderSpecialtyId
	,tms.DestinationName AS AttenderSpecialtyName
	,CAST((SELECT CASE WHEN TRY_CAST(ElementValue AS BIT) IS NOT NULL THEN CAST(ElementValue AS BIT) ELSE NULL END FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=6) AS BIT) HIDOnline
	,att.FirstName AS AttenderFirstName
	,att.LastName AS AttenderLastName
	,att.FullName AS AttenderFullName
	,att.GenderId AttenderGenderId
	,rd.MSC AS ReferringMSCId
	,rd.MSC_TypeId AS ReferringMSCTypeId
	,rd.FirstName AS ReferringFirstName
	,rd.LastName AS ReferringLastName
	,rd.FullName AS ReferringFullName
	,a.BasicInsurerNo
	,FORMAT(a.BasicInsurerExpirationDate,''yyyy/MM/dd'',''fa'') BasicInsurerExpirationDatePersian
	,a.BasicInsurerBookletPageNo
	,a.BasicInsurerId AS BasicInsurerId
	,tmi.DestinationCode AS BasicInsurerCode
	,inr1.[Name] As BasicInsurerName
	,a.BasicInsurerLineId
	,tmil.DestinationCode AS InsurerLineCode
	,il1.[Name] as BasicInsurerLineName
	,a.CompInsurerId
	,tmi2.DestinationCode AS CompInsurerCode
	,inr2.[Name] As CompInsurerName
	,a.CompInsurerLineId
	,tmil2.DestinationCode AS CompInsurerLineCode
	,il2.[Name] As CompInsurerLineName
	,a.ThirdPartyInsurerId
	,th.[Name] as ThirdPartyInsurerName
	,a.DiscountInsurerId
	,d.[Name] as DiscounrInsurerName
	,inr1.Name AS BasicInsurerName
	,awsr.EliminateHIDDateTime
	,awsr.EliminateHIDResult
	,awsr.PersonUID
	,awsr.SaveBillDateTime
	,awsr.SaveBillCompositionUID
	,awsr.SaveBillMessageUID
	,awsr.SaveBillResult
	,awsr.RembDateTime
	,awsr.RembCompositionUID
	,awsr.RembMessageUID
	,awsr.RembResult   
	,a.ReferringDoctorId
	,rd1.FullName ReferringDoctorName
	,(SELECT CASE WHEN TRY_CAST(ElementValue AS DATE) IS NOT NULL THEN CAST(ElementValue AS DATE) ELSE NULL END FROM mc.AdmissionServiceExtraProperty WHERE AdmissionServiceId=a.Id AND ElementId=21) PrescriptionDate
	,a.WorkflowId
	,w.Name WorkflowName
	,a.StageId
	,s.Name StageName
	,a.ActionId
	,ac.Name ActionName
	,a.BranchId
FROM mc.AdmissionService a WITH(NOLOCK)
	left JOIN mc.AdmissionServiceLine asl WITH(NOLOCK) ON a.Id=asl.HeaderId
	INNER JOIN mc.Patient p WITH(NOLOCK) ON a.PatientId = p.Id
	LEFT JOIN mc.ReferringDoctor rd1 ON a.ReferringDoctorId=rd1.Id
	LEFT JOIN mc.AdmissionWebServiceResult awsr ON a.Id=awsr.HeaderId
	LEFT JOIN mc.Insurer d ON a.DiscountInsurerId = d.Id AND d.InsurerTypeId=5
	LEFT JOIN mc.Insurer th ON a.ThirdPartyInsurerId = th.Id AND th.InsurerTypeId=4
	LEFT JOIN mc.Insurer inr1 ON a.BasicInsurerId = inr1.Id AND inr1.InsurerTypeId=1
	LEFT JOIN gn.TerminologyMap tmi ON inr1.Id=tmi.SourceId AND tmi.SourceTerminologyId=3 AND tmi.DestinationTerminologyId=4
	LEFT JOIN mc.InsurerLine il1 on a.BasicInsurerLineId = il1.Id
	LEFT JOIN gn.TerminologyMap tmil ON il1.Id=tmil.SourceId AND tmil.SourceTerminologyId=5 AND tmil.DestinationTerminologyId=6
	LEFT JOIN mc.Insurer inr2 ON a.CompInsurerId = inr2.Id AND inr2.InsurerTypeId=2
	LEFT JOIN gn.TerminologyMap tmi2 ON inr2.Id=tmi2.SourceId AND tmi2.SourceTerminologyId=3 AND tmi2.DestinationTerminologyId=4
	LEFT JOIN mc.InsurerLine il2 ON a.CompInsurerLineId = il2.Id
	LEFT JOIN gn.TerminologyMap tmil2 ON il2.Id=tmil2.SourceId AND tmil2.SourceTerminologyId=5 AND tmil2.DestinationTerminologyId=6
	LEFT JOIN mc.Attender att ON a.AttenderId=att.Id
	LEFT JOIN mc.AttenderRole ar ON att.RoleId=ar.Id
	LEFT JOIN mc.Speciality sp ON att.SpecialityId=sp.Id
	LEFT JOIN gn.TerminologyMap tms ON sp.Id=tms.SourceId AND tms.SourceTerminologyId=9 AND tms.DestinationTerminologyId=10
	LEFT JOIN mc.ReferringDoctor rd ON a.ReferringDoctorId=rd.Id
	LEFT JOIN gn.LocCountry lc ON p.CountryId=lc.Id
	LEFT JOIN mc.AdmissionServiceExtraProperty asep ON asep.AdmissionServiceId=a.Id AND ElementId=10
	LEFT JOIN mc.thrICPC2P thricp2cp ON asep.ElementValue=thricp2cp.Id
	LEFT JOIN hr.EducationLevel edu ON p.EducationLevelId=edu.Id
	LEFT JOIN wf.Workflow w ON w.Id=a.WorkflowId
	LEFT JOIN wf.Stage s ON s.Id=a.StageId
	LEFT JOIN wf.Action ac ON ac.Id=a.ActionId
WHERE 1=1
'
IF @Id IS NOT NULL
	SET @QUERY += N'	AND a.Id=@Id
	'

IF @StageId IS NOT NULL
	SET @QUERY += N'	 AND a.StageId IN(SELECT Value FROM STRING_SPLIT(@StageId,'',''))
	'

IF @ActionId IS NOT NULL
	SET @QUERY += N'	 AND a.ActionId IN(SELECT Value FROM STRING_SPLIT(@ActionId,'',''))
	'

IF @WorkflowId IS NOT NULL
	SET @QUERY += N'	 AND a.WorkflowId IN(SELECT Value FROM STRING_SPLIT(@WorkflowId,'',''))
	'

IF @AttenderId IS NOT NULL
	SET @QUERY += N'	AND a.AttenderId=@AttenderId
	'

IF @PatientFullName IS NOT NULL
	SET @QUERY += N'	AND p.FullName LIKE N''%''+@PatientFullName+N''%''
	'

IF @PatientNationalCode IS NOT NULL
	SET @QUERY += N'	AND p.NationalCode LIKE N''%''+@PatientNationalCode+N''%''
	'

IF @CreateDate IS NOT NULL
	SET @QUERY += N'	AND a.CreateDateTime = @CreateDate
	'

SET @QUERY += N'ORDER BY a.Id DESC
'

PRINT cast(@QUERY AS NTEXT)
EXEC sys.sp_executesql @QUERY,N'@StageId VARCHAR(100),@ActionId VARCHAR(100),@WorkflowId VARCHAR(100),@Id INT,@CreateDate DATE, @PatientFullName NVARCHAR(101),@PatientNationalCode VARCHAR(12),@AttenderId INT,@CompanyId TINYINT',
								@StageId,@ActionId,@WorkflowId,@Id,@CreateDate,@PatientFullName,@PatientNationalCode,@AttenderId,@CompanyId
