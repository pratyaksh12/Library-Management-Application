using System;

namespace LibraryApplicationManagement.DTOs;

public class BorrowBookDto
{
    public Guid BookId { get; set; }
    public Guid UserId { get; set; }
}
