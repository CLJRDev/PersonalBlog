using System.Net;
using System.Net.Mail;
using PersonalBlogBE.Interfaces;

namespace PersonalBlogBE.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var fromAddress = new MailAddress(_configuration["Email:From"], "Personal Blog");
            var toAddress = new MailAddress(toEmail);

            var smtp = new SmtpClient
            {
                Host = _configuration["Email:Smtp"],
                Port = int.Parse(_configuration["Email:Port"]),
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    _configuration["Email:From"],
                    _configuration["Email:Password"]
                )
            };

            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            await smtp.SendMailAsync(message);
        }
    }
}
