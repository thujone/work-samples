using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NGRM.Infrastructure.Migrations
{
    public partial class VulnImportId : Migration
    {

        private const string ADD_IMPORTS_SQL = @"
            DO
            $$
            DECLARE
                row ""Phase""%rowtype;
            BEGIN 
                FOR row in
                    SELECT *
                    FROM public.""Phase""
                    ORDER BY ""Phase"".""Id"" LOOP
                        INSERT INTO public.""Import""(
                            ""EngagementId"", ""ImportedBy"", ""ImportedDate"", ""PhaseId"")
                        VALUES (row.""EngagementId"", '2.1 Migration', null, row.""Id"");
                    END LOOP;
            END;
            $$
            LANGUAGE plpgsql;
        ";

        private const string DELETE_IMPORTS_SQL = @"
            DELETE FROM public.""Import""
	        WHERE ""Import"".""ImportedBy"" = '2.1 Migration';
        ";

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ImportId",
                table: "Vulnerability",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vulnerability_ImportId",
                table: "Vulnerability",
                column: "ImportId");

            migrationBuilder.Sql(ADD_IMPORTS_SQL);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(DELETE_IMPORTS_SQL);
            
            migrationBuilder.DropIndex(
                name: "IX_Vulnerability_ImportId",
                table: "Vulnerability");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Vulnerability");
        }
    }
}


