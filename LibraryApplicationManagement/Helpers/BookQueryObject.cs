using System;

namespace LibraryApplicationManagement.Helpers;

public class BookQueryObject
{
    public string? Title{get; set;}
    public string? Genre{get; set;}
    public string? SortBy{get; set;}
    public bool IsDescending{get; set;} = false;
    public int PageNumber{get;set;} = 1;
    public int PageSize{get; set;} = 20;
}
