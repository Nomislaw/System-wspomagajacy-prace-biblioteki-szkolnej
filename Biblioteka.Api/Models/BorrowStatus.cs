namespace Biblioteka.Api.Models;

public enum BorrowStatus
{
    Active = 0,
    Returned = 1,
    ReturnedLate = 2,
    Canceled = 3,
    Overdue = 4
}