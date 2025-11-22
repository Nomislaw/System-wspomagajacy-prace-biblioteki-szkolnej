using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Biblioteka.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedBookCopyBorrowsConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Borrows_BookCopies_BookCopyId",
                table: "Borrows");

            migrationBuilder.AddForeignKey(
                name: "FK_Borrows_BookCopies_BookCopyId",
                table: "Borrows",
                column: "BookCopyId",
                principalTable: "BookCopies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Borrows_BookCopies_BookCopyId",
                table: "Borrows");

            migrationBuilder.AddForeignKey(
                name: "FK_Borrows_BookCopies_BookCopyId",
                table: "Borrows",
                column: "BookCopyId",
                principalTable: "BookCopies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
