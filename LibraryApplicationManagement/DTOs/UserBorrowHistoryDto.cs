using System;
using LibraryApplicationManagement.Enums;

namespace LibraryApplicationManagement.DTOs;

public class UserBorrowHistoryDto
{
    public Guid RecordId{get;set;}
    public string BookTitle{get;set;} = string.Empty;
    public string Author{get;set;} = string.Empty;
    public DateTime BorrowDate{get;set;}
    public DateTime DueDate{get; set;}
    public DateTime? ReturnDate{get; set;}
    public BorrowStatus Status{get; set;}
}
