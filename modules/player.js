import { player } from "/script.js";
export {
  updatePlayPauseIcon,
  updateSoundMuteIcon,
  hideVideoControl,
  showVideoControl,
};

function updatePlayPauseIcon() {
  if (player.paused) {
    $("#play_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/" +
        "play-svgrepo-com_white.svg?v=1643823239197"
    );
  } else {
    $("#play_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/" +
        "pause-svgrepo-com_white.svg?v=1643823242831"
    );
  }
}

function updateSoundMuteIcon() {
  if (player.muted || player.volume == 0) {
    $("#sound_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/" +
        "mute-svgrepo-com-white.svg?v=1643835497301"
    );
  } else if (player.volume >= 0.5) {
    $("#sound_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/" +
        "sound-2-svgrepo-com-white.svg?v=1643933080248"
    );
  } else if (player.volume > 0) {
    $("#sound_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/" +
        "sound-1-svgrepo-com-white.svg?v=1643835522758"
    );
  }
}

function hideVideoControl() {
  $("#video_container").removeClass("video_radiant");

  $("#video_control").css("visibility", "hidden");
  $("#bar_container").css("visibility", "hidden");
  $("#volume").css("visibility", "hidden");

  $("#tooltip_time").css("opacity", 0);
  $("#video_player_thumb").css("opacity", 0);

  $("#video_container").css("cursor", "auto");
}

function showVideoControl() {
  $("#video_container").addClass("video_radiant");

  $("#video_control").css("visibility", "visible");
  $("#bar_container").css("visibility", "visible");
  $("#volume").css("visibility", "visible");

  const mouse_y =
    (event.pageY - $("#video_container").offset().top) /
    $("#video_container").height();
  if (mouse_y >= 0.85 && mouse_y <= 0.92) {
    $("#tooltip_time").css("opacity", 1);
    $("#video_player_thumb").css("opacity", 1);
  }
}
