namespace Biblioteka.Api.Data;
using Microsoft.EntityFrameworkCore;
using Biblioteka.Api.Models;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookCopy> BookCopies { get; set; }
    public DbSet<Borrow> Borrows { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<SchoolClass> SchoolClasses { get; set; }
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
        
        modelBuilder.Entity<SchoolClass>()
            .HasIndex(b => b.ClassName)
            .IsUnique();
        
        modelBuilder.Entity<BookCopy>()
            .HasIndex(b => b.BarCode)
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
        
        modelBuilder.Entity<User>()
            .HasOne(u => u.SchoolClass)
            .WithMany(c => c.Users)
            .HasForeignKey(u => u.SchoolClassId)
            .OnDelete(DeleteBehavior.SetNull); 
        
        modelBuilder.Entity<BookCopy>()
            .HasOne(bc => bc.Book)
            .WithMany(b => b.BookCopies)
            .HasForeignKey(bc => bc.BookId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Borrow>()
            .HasOne(b => b.BookCopy)
            .WithMany(bc => bc.Borrows)
            .HasForeignKey(b => b.BookCopyId)
            .OnDelete(DeleteBehavior.Restrict); 

    }
}