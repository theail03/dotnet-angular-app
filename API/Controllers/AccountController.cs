using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly string _googleClientId;
        public AccountController(IConfiguration config, UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _googleClientId = config["ApplicationSettings:GoogleClientId"];
        }

        [HttpPost("loginWithGoogle")]
        public async Task<ActionResult<UserDto>> LoginWithGoogle(LoginWithGoogleDto loginWithGoogleDto)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { _googleClientId }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(loginWithGoogleDto.Credential, settings);
            }
            catch (Exception)
            {
                return BadRequest("Invalid Google token.");
            }

            // Check if the user exists
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
            var isNewUser = user == null;

            if (isNewUser)
            {
                // User does not exist, create a new one
                user = new AppUser
                {
                    GoogleId = payload.Subject,
                };
            }

            // Set properties from payload whether it's a new user or an existing one
            user.UserName = payload.Email;
            user.Email = payload.Email;
            user.Name = payload.Name;

            if (isNewUser)
            {
                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest(createResult.Errors);
                }

                // Assign role to new users
                var roleResult = await _userManager.AddToRoleAsync(user, "Member");
                if (!roleResult.Succeeded)
                {
                    return BadRequest(roleResult.Errors);
                }
            }
            else
            {
                // Existing user, update information
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return BadRequest(updateResult.Errors);
                }
            }

            // Generate token
            var token = await _tokenService.CreateToken(user);

            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = token;

            return userDto;
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}