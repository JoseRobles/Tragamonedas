using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Tragamonedas.Models;
using Tragamonedas.Domain;
using Microsoft.AspNetCore.Http;

namespace Tragamonedas.Controllers
{
    public class PlayController : Controller
    {
        private readonly ILogger<PlayController> _logger;

        public PlayController(ILogger<PlayController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            HttpContext.Session.SetInt32("Credits", 10);
            return View();
        }

        [HttpGet]
        public ActionResult<PlayResponse> Throw()
        {
            var response = new PlayResponse();
            response.first_slot = "1";
            response.second_slot = "4";
            response.three_slot = "3";
            response.is_random = false;
            return Json(response);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
