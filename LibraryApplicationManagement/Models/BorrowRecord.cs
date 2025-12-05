using System;
using LibraryApplicationManagement.Enums;

namespace LibraryApplicationManagement.Models;

public class BorrowRecord
{
    public int Id{get;set;}
    public string UserId{get; set;} = string.Empty;
    public User? User{get; set;}
    public int BookId{get; set;}
    public Books? Book { get; set; }
    public DateTime BorrowDate{get; set;} = DateTime.UtcNow;
    public DateTime DueDate{get; set;}
    public DateTime? ReturnDate{get; set;} = DateTime.UtcNow;
    public BorrowStatus Status{get; set;} = BorrowStatus.Borrowed;
    public DateTime CreatedAt{get; set;} = DateTime.UtcNow;

}
