using System;

namespace LibraryApplicationManagement.Models;

public class Books
{
    public int Id{get; set;}
    public string Title{get; set;} = string.Empty;
    public string Author{get; set;} = string.Empty;
    public string Genre{get; set;} = string.Empty;
    public int Raiting{get; set;}
    public string CoverUrl{get; set;} = string.Empty;
    public string CoverColor{get; set;} = string.Empty;
    public string Description{get; set;} = string.Empty;
    public int TotalCopies{get; set;}
    public int AvailableCopies{get; set;}
    public string VideoUrl{get; set;} = string.Empty;
    public string Summary{get;set;} = string.Empty;
    public DateTime CreatedAT{get;set;} = DateTime.UtcNow;

}
