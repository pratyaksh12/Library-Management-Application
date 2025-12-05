using System;
using System.ComponentModel.DataAnnotations;

namespace LibraryApplicationManagement.DTOs;

public class CreateBookDto
{
    [Required]
    [MaxLength(255)]
    public string Title{get; set;} = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Author{get; set;} = string.Empty;

    [Required]
    public string Genre{get; set;} = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    public string CoverUrl{get; set;} = string.Empty;

    [Required]
    [MaxLength(7)]
    public string CoverColor{get; set;} = string.Empty;

    [Required]
    public string Description {get;set;} = string.Empty;

    [Range(1, 1000)]
    public int TotalCopies{get; set;} = 1;

    [Required]
    public string VideoUrl {get; set;} = string.Empty;   

    [Required]
    public string DescriptionP{get; set;} = string.Empty; 
}
