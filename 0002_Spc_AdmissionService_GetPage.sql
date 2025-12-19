/****** Object:  StoredProcedure [mc].[Spc_AdmissionService_GetPage]    Script Date: 4/20/2024 10:31:33 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Create date: <2021-09-23 14:14:58.653>
-- Description: <لیست پذیرش>
-- Modify date: <2023-04-04 13:57:00.000>
-- Modify user: <v.j>
-- =============================================

--execute [mc].[Spc_AdmissionService_GetPage] 0,50,null,NULL,NULL,NULL,NULL,NULL,NULL,null,null,NULL,NULL,NULL,131,1
alter PROCEDURE [mc].[Spc_AdmissionService_GetPage] 
(
	@PageNo INT = 0,
	@PageRowsCount INT = 50,
	@Id INT,
	@AdmissionMasterId INT,
	@PatientId INT,
	@AttenderId INT,
	@FromCreateDate DATE,
	@ToCreateDate DATE,
	@FromReserveDate DATE,
	@ToReserveDate DATE,
	@StageId SMALLINT,
	@ActionId TINYINT,
	@WorkflowId INT,
	@CreateUserId INT = 0,
	@RoleId TINYINT=NULL,
	@CompanyId TINYINT = 1
)
 
AS

	DECLARE @QUERY NVARCHAR(MAX) = ''
	SET @QUERY = @QUERY + N'

DROP TABLE IF EXISTS #AdmissionService

SELECT 
	ads.Id,
	ads.CentralId,
	ads.AdmissionMasterId,
	ads.AttenderId,
	ads.PatientId,
	ads.BranchId,
	sac.MedicalRevenue,
	ads.StageId,
	ads.ActionId,
	ads.WorkflowId,
	ads.CreateDateTime,
	ads.ReserveShiftId,
	ads.AdmissionNo,
	ads.ReserveDate,
	ads.ReserveNo,
	ads.CreateUserId,
	ads.AdmissionAmount,
	ads.CompanyId
INTO #AdmissionService
FROM mc.AdmissionService ads WITH(NOLOCK)
	INNER JOIN wf.Stage s ON StageId=s.Id
'

IF @RoleId IS NOT NULL
	SET @QUERY += N'	INNER JOIN gn.RoleWorkflowPermission rwp ON rwp.BranchId=ads.BranchId AND rwp.WorkflowId=ads.WorkflowId AND rwp.StageId=ads.StageId AND rwp.ActionId=ads.ActionId AND rwp.RoleId=@RoleId 
	'

SET @QUERY += N'
	LEFT JOIN wf.StageAction sac ON sac.ActionId=ads.ActionId AND sac.StageId=ads.StageId AND sac.WorkflowId=ads.WorkflowId
WHERE s.WorkflowCategoryId=10
'

	IF (@CreateUserId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.CreateUserId  = @CreateUserId
		'
	END

	IF (@Id IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.Id = @Id
		'
	END

	IF (@AdmissionMasterId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.AdmissionMasterId = @AdmissionMasterId
		'
	END

	IF (@PatientId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.PatientId = @PatientId
		'
	END

	IF (@AttenderId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.AttenderId = @AttenderId
		'
	END

	IF (@FromCreateDate IS NOT NULL
		AND @ToCreateDate IS NOT NULL)
	BEGIN
		SET @QUERY += N'
						AND ads.CreateDateTime>= CONVERT(nvarchar(23), CAST(@FromCreateDate AS VARCHAR)+'' 00:00:00.000'') 
						AND ads.CreateDateTime<= CONVERT(nvarchar(23), CAST(@ToCreateDate AS VARCHAR)+'' 23:59:59.999'') 
						'
	END

	IF (@FromReserveDate IS NOT NULL
		AND @ToReserveDate IS NOT NULL)
	BEGIN
		SET @QUERY += N'
						AND ads.ReserveDate>= @FromReserveDate 
						AND ads.ReserveDate<= @ToReserveDate 
						'
	END

	IF (@StageId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.StageId=@StageId
		'
	END

	IF (@ActionId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.ActionId= @ActionId
		'
	END

	IF (@WorkflowId IS NOT NULL)
	BEGIN
		SET @QUERY += ' AND ads.WorkflowId= @WorkflowId
		'
	END

	SET @QUERY += ' ORDER BY Id DESC
	'

	IF (@PageNo IS NOT NULL
		AND @PageRowsCount IS NOT NULL)
		SET @QUERY += ' OFFSET @PageNo ROWS FETCH NEXT @PageRowsCount ROWS ONLY 
'

	SET @QUERY += N'
SELECT
	ads.Id,
	ads.CentralId,
	ads.AdmissionMasterId,
	sm.WorkflowCategoryId AdmissionMasterWorkflowCategoryId,
	ads.AttenderId,
	att.[FullName] AS AttenderName,
	ads.BranchId,
	b.Name BranchName,
	ads.MedicalRevenue,
	ads.StageId,
	s.Name StageName,
	ads.ActionId,
	a.Name ActionName,
	ads.WorkflowId,
	w.Name WorkflowName,
	ads.CreateDateTime,
	ads.PatientId,
	pat.FullName As PatientFullName,
	pat.NationalCode As PatientNationalCode,
	ads.ReserveShiftId,
	dts.ShiftName ReserveShiftName,
	ads.AdmissionNo,
	ads.ReserveDate,
	ads.ReserveNo,
	ads.CreateUserId,
	u.FullName CreateUserFullName,
	CASE WHEN ads.MedicalRevenue<>2 THEN ads.AdmissionAmount ELSE -ads.AdmissionAmount END AdmissionAmount,
	(SELECT SUM(CashAmount) FROM mc.AdmissionCash ac WITH(NOLOCK) WHERE ac.AdmissionMasterId=am.Id) CashAmount
FROM #AdmissionService ads
	 INNER JOIN mc.AdmissionMaster am ON ads.AdmissionMasterId=am.Id
	 INNER JOIN wf.Stage sm on am.StageId=sm.Id
	 LEFT JOIN hr.DepartmentTimeShift dts ON ads.ReserveShiftId=dts.Id
	 LEFT JOIN mc.Attender as att WITH(NOLOCK) ON ads.AttenderId=att.Id
	 LEFT JOIN wf.Stage s ON s.Id=ads.StageId
	 LEFT JOIN wf.Action a ON a.Id=ads.ActionId
	 LEFT JOIN wf.Workflow w ON w.Id=ads.WorkflowId
	 LEFT JOIN gn.Branch b WITH(NOLOCK) ON ads.BranchId=b.Id
	 LEFT JOIN gn.[User] u ON u.Id=ads.CreateUserId
	 LEFT JOIN mc.Patient as pat WITH(NOLOCK) ON pat.Id=ads.PatientId
'

		SET @QUERY += ' ORDER BY Id DESC
						'

	--PRINT (@QUERY)
	EXEC sys.sp_executesql @QUERY,N'@PageNo INT=0,
									@PageRowsCount INT=50, 
									@Id INT,
									@AdmissionMasterId INT,
									@PatientId INT,
									@AttenderId INT,
									@FromCreateDate DATE,
									@ToCreateDate DATE,
									@FromReserveDate DATE,
									@ToReserveDate DATE,
									@StageId SMALLINT,
									@ActionId TINYINT,
									@WorkflowId INT,
									@CompanyId TINYINT,
									@CreateUserId INT,
									@RoleId TINYINT',
									@PageNo,
									@PageRowsCount,
									@Id,
									@AdmissionMasterId,
									@PatientId,
									@AttenderId,
									@FromCreateDate,
									@ToCreateDate,
									@FromReserveDate,
									@ToReserveDate,
									@StageId,
									@ActionId,
									@WorkflowId,
									@CompanyId,
									@CreateUserId,
									@RoleId
GO