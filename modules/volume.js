import { player } from "/script.js";
import { updateSoundMuteIcon } from "./player.js";
import { overlayText } from "./overlay.js";
export {
  muteSwitch,
  hideVolumeSlider,
  showVolumeSlider,
  is_sliding_volume,
  initVolume,
  setVolume,
};

var is_sliding_volume = false;

function muteSwitch() {
  player.muted = !player.muted;

  if (player.muted) {
    $("#volume").slider("value", 0);
    $("#volume").slider("value", 0);
  } else {
    $("#volume").slider("value", player.volume * 100);
  }

  updateSoundMuteIcon();
}

function hideVolumeSlider() {
  $("#volume_mode").addClass("d-none");
  if (player.duration < 3600) {
    $("#bar_chapter").removeClass("col-5").addClass("col-6");
  } else {
    $("#bar_chapter").removeClass("col-4").addClass("col-5");
  }
}

function showVolumeSlider() {
  $("#volume_mode").removeClass("d-none");
  if (player.duration < 3600) {
    $("#bar_chapter").removeClass("col-6").addClass("col-5");
  } else {
    $("#bar_chapter").removeClass("col-5").addClass("col-4");
  }
}

function initVolume() {
  $("#volume").slider({
    orientation: "horizontal",
    min: 0,
    max: 100,
    value: 51,
    range: "min",
    start: function (event, ui) {
      is_sliding_volume = true;
    },
    slide: function (event, ui) {
      player.volume = ui.value / 100;
      player.muted = ui.value != 0 ? false : true;
      updateSoundMuteIcon();

      overlayText(Math.round(player.volume * 100) + "%");
    },
    stop: function (event, ui) {
      is_sliding_volume = false;
    },
  });
}

function setVolume(volume) {
  $("#volume").slider("value", volume);
}
