using System;

namespace LibraryApplicationManagement.DTOs;

public class RegisterDto
{
    public string Email{get; set;} = string.Empty;
    public string Password{get; set;} = string.Empty;
    public string FullName{get; set;} = string.Empty;
    public string UniversityCard{get; set;} = string.Empty;
    public int UniversityId{get; set;}
}
