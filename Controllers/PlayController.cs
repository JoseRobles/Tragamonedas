using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Tragamonedas.Models;
using Tragamonedas.Domain;
using Microsoft.AspNetCore.Http;
using Tragamonedas.Infrastructure;
using System.Threading.Tasks;

namespace Tragamonedas.Controllers
{
    public class PlayController : Controller
    {
        private readonly ILogger<PlayController> _logger;
        private readonly IPlayService _playService;

        public PlayController(ILogger<PlayController> logger, IPlayService playService)
        {
            _logger = logger;
            _playService = playService;
        }

        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("Credits") == null)
            {
                HttpContext.Session.SetString("Credits", "60");
            }
            return View();
        }

        [HttpGet("play/getcredits")]
        public ActionResult<string> GetCredits()
        {
            var credits = HttpContext.Session.GetString("Credits");
            if (credits == null)
            {
                credits = "0";
            }

            return Json(credits);
        }

        [HttpGet("play/throw")]
        public ActionResult<PlayResultResponse> Throw()
        {
            var response = new PlayResultResponse();
            var credits = HttpContext.Session.GetString("Credits");
            if (credits != null)
            {
                var amount = 0;
                int.TryParse(credits, out amount);
                response = _playService.GetPlayResponse(amount);
            }
           
            return Json(response);
        }

        [HttpPost("play/setresult")]
        public async Task<ActionResult<PlayResultResponse>> SetPlayResult(PlayResultRequest result)
        {
            var response = new PlayResultResponse();
            var prize = _playService.GetPrize(result.index);
            var storedCredits = HttpContext.Session.GetString("Credits");
            int credits = 0;
            int total = 0;
            int.TryParse(storedCredits, out credits);

            if (result.winner)
            {
                total = credits + prize;
            }
            else
            {
                total = credits - 1;
            }
            
            HttpContext.Session.SetString("Credits", total.ToString());
            response.credits = total;
            return await Task.FromResult(response);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
