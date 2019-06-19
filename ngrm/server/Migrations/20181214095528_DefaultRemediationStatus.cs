using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NGRM.Infrastructure.Migrations
{
    public partial class DefaultRemediationStatus : Migration
    {


        private const string UPDATE_VULNERABILTY_REMEDIATION_STATUS_ID_SQL = @"
            UPDATE ""Vulnerability""
            SET ""RemediationStatusId"" = 1
            WHERE ""RemediationStatusId"" IS NULL
        ";

        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.Sql(UPDATE_VULNERABILTY_REMEDIATION_STATUS_ID_SQL);
            migrationBuilder.AlterColumn<int>(
                name: "RemediationStatusId",
                table: "Vulnerability",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldNullable: true
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RemediationStatusId",
                table: "Vulnerability",
                nullable: true,
                oldClrType: typeof(int)
            );
        }
    }
}
