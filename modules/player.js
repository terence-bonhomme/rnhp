import { player } from "/script.js";
export {
  updatePlayPauseIcon,
  updateSoundMuteIcon,
  hideVideoControl,
  showVideoControl,
};

function updatePlayPauseIcon(hover) {
  if (player.paused) {
    $("#play_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/play-svgrepo-com-gray.svg?v=1646077475496"
    );
  } else {
    $("#play_icon").attr(
      "src",
      "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/pause-svgrepo-com-white.svg?v=1645994627608"
    );
  }
}

function updateSoundMuteIcon(hover) {
  if (player.muted || player.volume == 0) {
    $("#sound_icon").css("left", "-6px");
    if (hover) {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-min-svgrepo-com-transparent.svg?v=1645997543947"
      );
    } else {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-min-svgrepo-com-transparent-gray.svg?v=1646077497090"
      );
    }
  } else if (player.volume >= 0.5) {
    $("#sound_icon").css("left", "0px");
    if (hover) {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-high-svgrepo-com-transparent.svg?v=1645997823946"
      );
    } else {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-high-svgrepo-com-transparent-gray.svg?v=1646077506590"
      );
    }
  } else if (player.volume > 0) {
    $("#sound_icon").css("left", "-2px");
    if (hover) {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-low-svgrepo-com-transparent.svg?v=1645998123140"
      );
    } else {
      $("#sound_icon").attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/sound-low-svgrepo-com-transparent-gray.svg?v=1646077517945"
      );
    }
  }
}

function hideVideoControl() {
  $("#video_container").removeClass("video_radiant");

  $("#video_control").css("visibility", "hidden");
  $("#bar_background").css("visibility", "hidden");
  $("#volume").css("visibility", "hidden");
  $("#bar_slid").css("visibility", "hidden");
  $("#small_bar_time").css("visibility", "hidden");
  $("#bar_time").css("visibility", "hidden");
  $("#bar_chapter").css("visibility", "hidden");

  $("#tooltip_time").css("opacity", 0);
  $("#video_player_thumb").css("opacity", 0);

  $("#video_container").css("cursor", "auto");
}

function showVideoControl() {
  if (player.oncanplay) {
    $("#video_container").addClass("video_radiant");

    $("#video_control").css("visibility", "visible");
    $("#bar_background").css("visibility", "visible");
    $("#volume").css("visibility", "visible");
    $("#small_bar_time").css("visibility", "visible");
    $("#bar_time").css("visibility", "visible");
    $("#bar_chapter").css("visibility", "visible");

    $("#tooltip_time").css("opacity", 1);
    $("#video_player_thumb").css("opacity", 1);
  }
}
