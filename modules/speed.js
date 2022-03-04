import { player, cursor_video_timeout } from "/script.js";
import { overlayText } from "./overlay.js";
export { speedEvents };

function speedEvents() {
  $("#slow_icon").click(function () {
    // speed

    if (player.playbackRate >= 0.5) player.playbackRate -= 0.25;

    // cursor timeout

    clearTimeout(cursor_video_timeout);

    // overlay

    overlayText(player.playbackRate + "x");

    // size and position

    $(this).css("width", "35px");
    $(this).css("height", "35px");
    $("#slow_mode").css("top", "5px");

    setTimeout(function () {
      $("#slow_icon").css("width", "30px");
      $("#slow_icon").css("height", "30px");
      $("#slow_mode").css("top", "10px");
    }, 400);
  });

  $("#slow_icon").on("mouseover", function () {
    $(this).attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/slow-mode-svgrepo-com-white.svg?v=1645984231217"
    );
  });

  $("#slow_icon").on("mouseout", function () {
    $(this).attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/slow-mode-svgrepo-com-gray.svg?v=1646077462286"
    );
  });

  $("#fast_icon").click(function () {
    // speed

    if (player.playbackRate < 16) player.playbackRate += 0.25;

    // cursor timeout

    clearTimeout(cursor_video_timeout);

    // overlay

    overlayText(player.playbackRate + "x");

    // size and position

    $(this).css("width", "35px");
    $(this).css("height", "35px");
    $("#fast_mode").css("top", "5px");

    setTimeout(function () {
      $("#fast_icon").css("width", "30px");
      $("#fast_icon").css("height", "30px");
      $("#fast_mode").css("top", "10px");
    }, 400);
  });

  $("#fast_icon").on("mouseover", function () {
    $(this).attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/fast-mode-svgrepo-com-white.svg?v=1645984225517"
    );
  });

  $("#fast_icon").on("mouseout", function () {
    $(this).attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/fast-mode-svgrepo-com-gray.svg?v=1646077441372"
    );
  });
}
