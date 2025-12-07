using System;
using LibraryApplicationManagement.Models;

namespace LibraryApplicationManagement.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}
