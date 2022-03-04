export { overlay_timeout, overlayText, overlayImage, overlayPosition };

var overlay_timeout;

function showOverlay() {
  $("#overlay_container").show();
  clearTimeout(overlay_timeout);
  overlay_timeout = setTimeout(function () {
    $("#overlay_container").hide();
  }, 1000);
}

function showOverlayImage(file, version, css) {
  const website =
    "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/";

  $("#overlay_content").html(
    "<img src='" + website + file + "?v=" + version + "' style='" + css + "'/>"
  );

  showOverlay();
}

function overlayText(text) {
  $("#overlay_content").text(text);
  showOverlay();
}

function overlayImage(image, dimension) {
  let file, version, css;

  if (dimension != undefined) {
    css = "height: " + dimension + "px; width: " + dimension + "px;";
  } else {
    css = "height: 30px; width: 30px;";
  }

  switch (image) {
    case "sound":
      file = "sound-high-svgrepo-com-transparent-gray.svg";
      version = "1646077506590";
      break;
    case "mute":
      file = "sound-min-svgrepo-com-transparent-gray.svg";
      version = "1646077497090";
      break;
    case "play":
      file = "play-svgrepo-com-gray.svg";
      version = "1646077475496";
      break;
    case "pause":
      file = "pause-svgrepo-com-gray.svg";
      version = "1646077482839";
      break;
    default:
      return;
  }
  showOverlayImage(file, version, css);
}

function overlayPosition(x, y) {
  $("#overlay_container").css("left", x);
  $("#overlay_container").css("top", y);
}
