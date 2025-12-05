using System;
using LibraryApplicationManagement.Enums;
using Microsoft.AspNetCore.Identity;

namespace LibraryApplicationManagement.Models;

public class User : IdentityUser<Guid>
{
    public string FullName{get; set;} = string.Empty;
    public int UniversityId{get; set;}
    public string UniversityCard{get; set;} = string.Empty;
    public UserStatus Status {get; set;} = UserStatus.Pending;
    public UserRole Role{get; set;} = UserRole.User;
    public DateTime LastActivityDate{get; set;} = DateTime.UtcNow;
    public DateTime CreatedAt{get; set;} = DateTime.UtcNow;
}
