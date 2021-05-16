using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Details
  {
    public class Query : IRequest<Result<ActivityDto>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<ActivityDto>>
    {
      public DataContext _context { get; set; }
      private readonly IMapper _mapper;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _mapper = mapper;
        _context = context;
      }
      public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
      {
        // return await _context.Activities.FindAsync(request.Id);
        var activity = await _context.Activities
          // .FindAsync(request.Id);
          .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
            new {currentUsername = _userAccessor.GetUsername()})
          .FirstOrDefaultAsync(x => x.Id == request.Id);
        // return Result<Activity>.Success(activity);
        return Result<ActivityDto>.Success(activity);

      }
    }
  }
}