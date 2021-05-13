using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
  public class Add
  {
    public class Command : IRequest<Result<Photo>>
    {
      public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Photo>>
    {
      private readonly IPhotoAccessor _photoAccessor;
      private readonly IUserAccessor _userAccessor;
      private readonly DataContext _context;
      public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
      {
        _context = context;
        _userAccessor = userAccessor;
        _photoAccessor = photoAccessor;
      }

      public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = await _context.Users.Include(p=>p.Photos)
          .FirstOrDefaultAsync(x=>x.UserName = _userAccessor.GetUsername());
      }
    }
  }
}