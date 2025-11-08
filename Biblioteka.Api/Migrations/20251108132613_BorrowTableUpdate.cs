using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Biblioteka.Api.Migrations
{
    /// <inheritdoc />
    public partial class BorrowTableUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_Title_AuthorId",
                table: "Books");

            migrationBuilder.AddColumn<DateTime>(
                name: "TerminDate",
                table: "Borrows",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_AuthorId_PublisherId",
                table: "Books",
                columns: new[] { "Title", "AuthorId", "PublisherId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_Title_AuthorId_PublisherId",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "TerminDate",
                table: "Borrows");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_AuthorId",
                table: "Books",
                columns: new[] { "Title", "AuthorId" },
                unique: true);
        }
    }
}
