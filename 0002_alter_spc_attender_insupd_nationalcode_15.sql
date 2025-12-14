DECLARE @ScriptName NVARCHAR(255) = N'0002_alter_spc_attender_insupd_nationalcode_15.sql';

IF OBJECT_ID(N'dbo.SchemaMigrations', N'U') IS NULL
    THROW 50000, 'SchemaMigrations table not found. Run 0001 first.', 1;

IF EXISTS (SELECT 1 FROM dbo.SchemaMigrations WHERE ScriptName = @ScriptName)
    RETURN;

BEGIN TRY
    -- برای Deploy کردن SP بهتره TRAN نذاری (اختیاریه)
    -- چون ALTER PROCEDURE خودش اتمیکه و GO هم نداریم

    EXEC(N'

ALTER PROCEDURE [mc].[Spc_Attender_InsUpd] 
(
  @Opr AS VARCHAR(3),
  @Id AS INT,
  @CentralId INT=NULL,
  @FirstName AS NVARCHAR(30),
  @LastName AS NVARCHAR(50),
  @GenderId AS INT,
  @NationalCode AS VARCHAR(15),
  @MSC AS NVARCHAR(10),
  @MSCTypeId TINYINT=NULL,
  @MSC_ExpDate AS DATE,
  @DepartmentId INT,
  @AttenderTaxPer TINYINT,
  @SpecialityId INT,
  @RoleId TINYINT,
  @IsActive BIT,
  @FatherName NVARCHAR(50),
  @MobileNo VARCHAR(11),
  @PhoneNo VARCHAR(11),
  @IdNumber VARCHAR(10),
  @BirthDate DATE,
  @Address NVARCHAR(100),
  @LocCityId INT,
  @LocStateId	SMALLINT,
  @CompanyId TINYINT=1,
  @PrescriptionTypeId varchar(50),
  @AccetableParaclinicType BIT,
  @ContractType TINYINT,
  @AccountDetailAttender NVARCHAR(MAX),
  @CreateUserId INT,
  @CreateDateTime DATETIME
)
 
AS

DECLARE @ContractTypeName NVARCHAR(12)=''
DECLARE @FullName NVARCHAR(81)=''

SET @ContractTypeName=(
							case 
								when isnull(@ContractType,1)=1 then N'خدمات پزشکی'
								when isnull(@ContractType,0)=2 then N'مشارکت مدنی'
							else N'' 
					end)

SET @FullName=ISNULL(@FirstName,'')+' '+ISNULL(@LastName,'')

DECLARE	 @Status INT = 100
		,@StatusMessage NVARCHAR(100) = N'عملیات با موفقیت انجام پذیرفت'
		,@NoSeriesId SMALLINT = 0
		,@IsManual BIT = 0
		
BEGIN TRY
SELECT TOP 1 @NoSeriesId = Id,@IsManual=ns.IsManual
FROM gn.NoSeries ns
WHERE ns.TableName = 'mc.Attender'

BEGIN TRANSACTION
IF @Opr = 'Ins'
BEGIN
		SELECT @Id = gn.fn_NoSeries_GetNewNo('mc.Attender', @Id,1)
		IF @Id < 0
		BEGIN
		SET @Status = @Id
					IF @Status = -1
		SET @StatusMessage = N'برای ایجاد شناسه جدید محدوده ای تعریف نشده است'
					ELSE IF @Status = -2
		SET @StatusMessage = N'این شناسه قبلا ایجاد شده است'
					ELSE IF @Status = -3
		SET @StatusMessage = N'امکان ایجاد شناسه بصورت دستی وجود ندارد'
		SELECT @Status AS Status,
			   @StatusMessage AS StatusMessage, @Id Id
		COMMIT TRANSACTION
		RETURN
		END
		
		INSERT INTO mc.Attender (Id, CentralId, FirstName, LastName,FullName, GenderId, NationalCode, MSC, MSC_TypeId, MSC_ExpDate, 
								 DepartmentId, AttenderTaxPer, SpecialityId, RoleId, IsActive,companyId,FatherName,MobileNo,PhoneNo,IdNumber,BirthDate,
								 Address,LocCityId,LocStateId,PrescriptionTypeId,AcceptableParaclinic,ContractType,ContractTypeName)
			VALUES (@Id, @CentralId, @FirstName, @LastName,@FullName, @GenderId, @NationalCode, @MSC, @MSCTypeId, @MSC_ExpDate, 
					@DepartmentId, @AttenderTaxPer, @SpecialityId, @RoleId, @IsActive,1,@FatherName,@MobileNo,@PhoneNo,@IdNumber,@BirthDate,
					@Address,@LocCityId,@LocStateId,@PrescriptionTypeId,@AccetableParaclinicType,@ContractType,@ContractTypeName)

		INSERT INTO gn.SendHistory (ObjectId, ObjectTypeId, OperationTypeId, CreateUserId, CreateDateTime)
				VALUES(@Id, 2, 1, @CreateUserId, @CreateDateTime)
		
		IF @IsManual=0
		INSERT INTO fm.AccountDetail (Id, Name, NoSeriesId,CompanyId,DataJson)
			VALUES (@Id, @FirstName + ' ' + @LastName, @NoSeriesId,1,@AccountDetailAttender)

END
ELSE
BEGIN
		UPDATE mc.Attender
		SET FirstName = @FirstName,
			LastName = @LastName,
			FullName=@FullName,
			GenderId = @GenderId,
			NationalCode = @NationalCode,
			Msc = @MSC,
			MSC_TypeId = @MSCTypeId,
			MSC_ExpDate = @MSC_ExpDate,
			--DepartmentId = @DepartmentId,
			AttenderTaxPer = @AttenderTaxPer,
			SpecialityId = @SpecialityId,
			FatherName = @FatherName,
			MobileNo = @MobileNo,
			PhoneNo = @PhoneNo,
			IdNumber = @IdNumber,
			RoleId = @RoleId,
			BirthDate=@BirthDate,
			Address=@Address,
			LocCityId = @LocCityId,
			LocStateId=@LocStateId,
			IsActive = @IsActive,
			PrescriptionTypeId=@PrescriptionTypeId,
			AcceptableParaclinic=@AccetableParaclinicType,
			ContractType=@ContractType,
			ContractTypeName=@ContractTypeName,
			CentralId=@CentralId
		WHERE Id = @Id

		INSERT INTO gn.SendHistory (ObjectId, CentralId, ObjectTypeId, OperationTypeId, CreateUserId, CreateDateTime)
				VALUES(@Id, @CentralId, 2, 2, @CreateUserId, @CreateDateTime)
		
		UPDATE fm.AccountDetail  SET NAME = @FullName ,[IsActive]=@IsActive,DataJson=@AccountDetailAttender
			WHERE Id = @id AND NoSeriesId = @NoSeriesId

END

COMMIT TRANSACTION

EXECUTE [mc].[Spc_AdmissionDropdownRefresh] 1

SELECT @Status AS Status,@StatusMessage AS StatusMessage, @Id Id
END TRY
BEGIN CATCH
			ROLLBACK TRANSACTION

			SET @Status = -100
			SET @StatusMessage = N'عملیات ثبت با خطا مواجه شد ، شرح خطا در جدول لاگ ارسال شد'
			
			
			INSERT INTO gn.ErrorLog (ErrDateTime, ErrMessage, UserId, Path)
				VALUES (GETDATE(), ERROR_MESSAGE(), 0, OBJECT_NAME(@@PROCID))
			
			SELECT @Status AS Status,@StatusMessage AS StatusMessage, @Id Id
END CATCH

--EXEC [mc].[Spc_Attender_InsUpd] 'INS',0,N'مهرداد',N'مختار',1,'0749369000','123456','13980101',1,1

');

    INSERT INTO dbo.SchemaMigrations(ScriptName, AppliedBy)
    VALUES (@ScriptName, SUSER_SNAME());
END TRY
BEGIN CATCH
    THROW;
END CATCH;
