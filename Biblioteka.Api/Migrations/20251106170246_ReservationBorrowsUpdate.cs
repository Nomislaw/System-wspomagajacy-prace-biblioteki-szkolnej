using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Biblioteka.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReservationBorrowsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReservationStatus",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ReservationId",
                table: "Borrows",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Borrows_ReservationId",
                table: "Borrows",
                column: "ReservationId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Borrows_Reservations_ReservationId",
                table: "Borrows",
                column: "ReservationId",
                principalTable: "Reservations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Borrows_Reservations_ReservationId",
                table: "Borrows");

            migrationBuilder.DropIndex(
                name: "IX_Borrows_ReservationId",
                table: "Borrows");

            migrationBuilder.DropColumn(
                name: "ReservationStatus",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ReservationId",
                table: "Borrows");
        }
    }
}
