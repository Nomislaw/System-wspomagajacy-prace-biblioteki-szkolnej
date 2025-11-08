namespace Biblioteka.Api.Data;
using Microsoft.EntityFrameworkCore;
using Biblioteka.Api.Models;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Borrow> Borrows { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        modelBuilder.Entity<Author>()
            .HasIndex(a => new { a.FirstName, a.LastName })
            .IsUnique();
        
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();
        
        modelBuilder.Entity<Publisher>()
            .HasIndex(p => p.Name)
            .IsUnique();
        
        modelBuilder.Entity<Book>()
            .HasIndex(b => b.ISBN)
            .IsUnique();
        
        modelBuilder.Entity<Book>()
            .HasIndex(b => new { b.Title, b.AuthorId, b.PublisherId })
            .IsUnique();
        
        modelBuilder.Entity<Book>()
            .HasOne(b => b.Category)
            .WithMany(c => c.Books)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); 
        
        modelBuilder.Entity<Book>()
            .HasOne(b => b.Author)
            .WithMany(a => a.Books)
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Book>()
            .HasOne(b => b.Publisher)
            .WithMany(p => p.Books)
            .HasForeignKey(b => b.PublisherId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Borrow)
            .WithOne(b => b.Reservation)
            .HasForeignKey<Borrow>(b => b.ReservationId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}