using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Biblioteka.Api.Data;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.EntityFrameworkCore;

public class StatusUpdater : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public StatusUpdater(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                var now = DateTime.UtcNow;
                
                var overdueReservations = await context.Reservations
                    .Include(r => r.Book)
                    .Where(r => r.ReservationStatus == ReservationStatus.Active && r.ExpirationDate < now)
                    .ToListAsync(stoppingToken);

                foreach (var r in overdueReservations)
                {
                    r.ReservationStatus = ReservationStatus.Expired;
                }
                
                var overdueBorrows = await context.Borrows
                    .Where(b => b.BorrowStatus == BorrowStatus.Active && b.TerminDate < now && b.ReturnDate == null)
                    .Include(b=> b.User)
                    .Include(b=>b.BookCopy)
                        .ThenInclude(b=>b.Book)
                    .ToListAsync(stoppingToken);

                foreach (var b in overdueBorrows)
                {
                    b.BorrowStatus = BorrowStatus.Overdue;
                    var body = $@"
                        <h3>Witaj {b.User.FirstName} {b.User.LastName}!</h3>
                        <p>Przypominamy, że termin zwrotu książki <strong>{b.BookCopy.Book.Title}</strong> już minął.</p>
                        <p>Prosimy o jak najszybszy zwrot.</p>";
                        await emailService.SendEmailAsync(b.User.Email, "Przypomnienie o zwrocie książki", body);
                }

                await context.SaveChangesAsync(stoppingToken);
            }
            
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}