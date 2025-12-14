IF OBJECT_ID(N'dbo.SchemaMigrations', N'U') IS NOT NULL
    RETURN;

CREATE TABLE dbo.SchemaMigrations(
                                     Id INT IDENTITY(1,1) PRIMARY KEY,
                                     ScriptName NVARCHAR(255) NOT NULL UNIQUE,
                                     AppliedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
                                     AppliedBy NVARCHAR(128) NULL
);
