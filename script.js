"use strict";

import {
  updateSoundMuteIcon,
  updatePlayPauseIcon,
  hideVideoControl,
  showVideoControl,
} from "./modules/player.js";
import {
  overlay_timeout,
  overlayText,
  overlayImage,
  overlayPosition,
} from "./modules/overlay.js";
import {
  muteSwitch,
  hideVolumeSlider,
  showVolumeSlider,
  is_sliding_volume,
  initVolume,
  setVolume,
} from "./modules/volume.js";
import { speedEvents } from "./modules/speed.js";

import { RemNoteAPI } from "./RemNoteAPI-fix.js";
export { player, cursor_video_timeout };

var player;
var cursor_video_timeout;

$("#html").hide();

(async () => {
  var chapter;
  var previous_chapter;
  var video_url;

  var video_ready = false;
  var play_fade = false;
  var cursor_hover_video = false;

  var scroll_timeout;
  var click_timeout;
  var pointer_timeout;

  var cancel_auto_scroll = false;
  var paused = false;

  const player_margin = 30;

  const linkInput = document.getElementById("linkInput");
  const linkCont = document.getElementById("linkCont");
  const viewCont = document.getElementById("viewCont");
  const ok = document.getElementById("ok");
  const takeNote = document.getElementById("takeNote");
  const noteInput = document.getElementById("noteInput");
  const commands = document.getElementById("commands");
  const delayInput = document.getElementById("delayInput");
  const refresh = document.getElementById("refresh");
  const play_pointer = document.getElementById("play_pointer");
  const line_div = document.getElementById("line");

  const clientHeight = document.getElementById("html").clientHeight;

  player = document.getElementById("video_player");
  var player_thumb = document.getElementById("video_player_thumb");

  var delay = 0;
  var no_delay = false;

  var current_chapter = 0;
  var level = 1;
  var last_level = 1;
  var tree_position = [];
  var last_tree_position = [];

  var line_position1 = 0;
  var line_position2 = 0;
  var line_position3 = 0;
  var line_position4 = 0;
  var line_max_position1 = 0;
  var line_max_position2 = 0;
  var line_max_position3 = 0;
  var line_max_position4 = 0;
  var last_line_position1 = 0;
  var last_line_position2 = 0;
  var last_line_position3 = 0;
  var last_line_position4 = 0;
  var last_line_max_position1 = 0;
  var last_line_max_position2 = 0;
  var last_line_max_position3 = 0;
  var last_line_max_position4 = 0;

  var w_parameter = 0;
  var dark_mode = 0;

  var shortcuts_displayed = false;
  var mainModal;
  var html_player_width;

  var text_input = "";
  var writing_rem = false;

  var just_noted = false;
  var just_clicked = false;
  var just_scrolled = false;

  var scroll_visible = false;

  var modal_list = [];

  var last_referenceNode;
  var navigation_disabled = false;

  var thumbmail_delay = 0;
  var last_time_player_thumb = 0;

  var mouse_timeout;
  var mouse_moving = false;

  var is_sliding_duration = false;

  // color

  const color_0 = [
    "#FFCFD5",
    "#FFF0D4",
    "#A6FBDE",
    "#FFD9C7",
    "#ECDCFF",
    "#D4F0FF",
  ];

  const color_1 = [
    "#FFD7DD",
    "#FFF3D7",
    "#AEFFE6",
    "#FFDECC",
    "#F1E1FF",
    "#D9F5FF",
  ];

  const color_2 = [
    "#FFDEE4",
    "#FFF3D7",
    "#B5FFED",
    "#FFE3D1",
    "#F6E6FF",
    "#DEFAFF",
  ];

  const color_3 = [
    "#FFE6EC",
    "#FFF8DC",
    "#BDFFF5",
    "#FFE8D6",
    "#FBEBFF",
    "#E3FFFF",
  ];

  const color_4 = [
    "#FFEEF4",
    "#FFF8DC",
    "#C5FFFD",
    "#FFEDDB",
    "#FFF0FF",
    "#E8FFFF",
  ];

  const color_5 = [
    "#FFF5FB",
    "#FFFDE1",
    "#CCFFFF",
    "#FFF3E1",
    "#FFF6FF",
    "#EEFFFF",
  ];

  const color_0_hover = [
    "#FF99A5",
    "#FFFF66",
    "#6DF8CA",
    "#FFB999",
    "#C799FF",
    "#99DBFF",
  ];

  const color_1_hover = [
    "#FFA6B2",
    "#FFFF78",
    "#7AFFD7",
    "#FFC6A6",
    "#D4A6FF",
    "#A6E8FF",
  ];

  const color_2_hover = [
    "#FFB3BF",
    "#FFFF8A",
    "#87FFE4",
    "#FFD3B3",
    "#E1B3FF",
    "#B3F5FF",
  ];

  const color_3_hover = [
    "#FFBFCB",
    "#FFFF9C",
    "#93FFF0",
    "#FFDFBF",
    "#EDBFFF",
    "#BFFFFF",
  ];

  const color_4_hover = [
    "#FFCCD8",
    "#FFFFAD",
    "#A0FFFD",
    "#FFECCC",
    "#FACCFF",
    "#CCFFFF",
  ];

  const color_5_hover = [
    "#FFD9E5",
    "#FFFFBF",
    "#ADFFFF",
    "#FFF9D9",
    "#FFD9FF",
    "#D9FFFF",
  ];

  // read the rem's children
  const documentId = await RemNoteAPI.v0.get_context();
  const pluginId = documentId.remId;
  var plugin_rem = await RemNoteAPI.v0.get(pluginId);

  // cache

  var rem_tree;
  await create_rem_tree();

  // parameters

  const plugin_markdown = plugin_rem.nameAsMarkdown;
  const enable_parameter = plugin_markdown.match(/-np/gi) == null;

  var settings = await RemNoteAPI.v0.get_by_name("RemNote HTML Player");

  var parameters = new Map();

  if (enable_parameter) {
    if (settings.found) {
      parameters.set(
        "dark_mode",
        (await RemNoteAPI.v0.get(settings.children[0])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "width",
        (await RemNoteAPI.v0.get(settings.children[1])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "playback_speed",
        (await RemNoteAPI.v0.get(settings.children[2])).nameAsMarkdown.split(
          ": "
        )[1]
      );
      parameters.set(
        "delay",
        (await RemNoteAPI.v0.get(settings.children[3])).nameAsMarkdown.split(
          ": "
        )[1]
      );
    } else {
      settings = await RemNoteAPI.v0.create("RemNote HTML Player");

      await RemNoteAPI.v0.create("dark_mode: 0", settings.remId);
      await RemNoteAPI.v0.create("width: 65", settings.remId);
      await RemNoteAPI.v0.create("playback_speed: 1", settings.remId);
      await RemNoteAPI.v0.create("delay: 0", settings.remId);

      parameters.set("dark_mode", 0);
      parameters.set("width", "65");
      parameters.set("playback_speed", 1);
      parameters.set("delay", 0);
    }

    // dark mode

    dark_mode = parameters.get("dark_mode");
    if (dark_mode == 1) {
      let gray1 = "#c0bdbd";
      let gray2 = "#272525";

      document.getElementById("html").style.background = "#f5f5f5";
      $("#linkInput").css("background", "black");
      $(
        "#linkInput, #ok, #takeNote, #keyboard_label, #refresh, #shortcuts"
      ).css("color", gray1);

      let filter_out =
        "invert(90%) sepia(8%) saturate(1062%) hue-rotate(200deg) brightness(82%) contrast(84%)";
      let filter_over =
        "invert(46%) sepia(8%) saturate(1062%) hue-rotate(210deg) brightness(82%) contrast(84%)";

      $("img").css("filter", filter_out);

      $("#refresh, #takenote, #shortcuts").on("mouseover", function () {
        $(this).css("color", gray2);
        $("#refresh > img").css("filter", filter_over);
      });
      $("#refresh, #takenote, #shortcuts").on("mouseout", function () {
        $(this).css("color", gray1);
        $("#refresh > img").css("filter", filter_out);
      });

      $("#right").css("filter", "hue-rotate(180deg) invert(1)");
      $("#left").css("filter", "hue-rotate(180deg) invert(1)");
      $(".video_button").css("filter", "none");
    }

    // width %

    var width_parameter = parameters.get("width");

    if (width_parameter != undefined) {
      document.getElementById("commands").style.width = width_parameter + "%";

      document.getElementById("noteInput").style.width = width_parameter + "%";

      document.getElementById("right").style.width =
        100 - width_parameter + "%";

      document.getElementById("right").style.left = width_parameter + "%";

      if (width_parameter <= 40) {
        w_parameter = 35;
        $("#commands")
          .removeClass("row row-cols-4 mt-3")
          .addClass("row row-cols-2 mt-3");
      }
    }

    // delay

    var delay_parameter_value = parameters.get("delay");
    if (delay_parameter_value != undefined) {
      delay = delay_parameter_value[0];
      if (delay > 0) delayInput.value = delay_parameter_value;
    }
  }

  // show the needed panel

  let first_rem;
  if (rem_tree.length != 0) {
    first_rem = rem_tree[0];

    linkInput.value = first_rem.name[0].text;

    linkCont.style.display = "none";
    viewCont.style.display = "block";

    $("#bar_background").css("opacity", 1);

    $("#linkCont").removeClass(
      "d-flex flex-column min-vh-100 justify-content-center align-items-center"
    );
  }

  // show ok button

  if (linkInput.value) {
    ok.style.display = "block";
    ok.style.opacity = "1";
  }

  // get video rem title

  const rem_title = await RemNoteAPI.v0.get(documentId.documentId);
  const index_title = rem_title.nameAsMarkdown.indexOf("](https://");

  if (index_title != -1 && rem_tree.length == 0) {
    linkInput.value = rem_title.nameAsMarkdown.slice(index_title + 2, -2);
    if (linkInput.value) {
      ok.style.display = "block";
      ok.style.opacity = "1";
    }
    setTimeout(function () {
      ok.click();
    }, 100);
  }

  // recognize the video link

  var url;
  if (rem_tree.length != 0) {
    url = first_rem.name[0].text;
    video_url = url;
  } else if (linkInput.value != "") {
    url = linkInput.value;
    video_url = url;
  }

  // prepare the video

  if (video_url != undefined) {
    prepare_video();
  }

  // show

  $("#html").fadeIn("slow");

  // EVENTS

  // resize
  $(window).resize(function () {
    player.width =
      window.innerWidth * (parseInt(parameters.get("width")) / 100) - 20;
    $("#video_container").width(player.width);

    player.height = clientHeight - 100 - w_parameter;
    create_chapter();

    $("#video_play").css("top", player.height / 2 - 50 + "px");
    $("#video_play").css("left", player.width / 2 - 37.5 + "px");

    $("#bar_background").css("width", player.width - 25 + "px");

    $("#bar_slid").css("width", player.width - 25 - 7.5 + "px");
    $("#video_control").css("top", player.height - 50 - 15 + "px");

    overlayPosition(player.width / 2 - 35, player.height / 2 - 35);

    $("#volume_mode").addClass("d-none");
  });

  // keyboard state

  $("#video_player").on("focus", function () {
    $("#keyboard").css("background-color", "#f4f4fa");
  });
  $("#video_player").on("blur", function () {
    $("#keyboard").css("background-color", "#A6FBDE");
  });
  $(window).on("blur", function () {
    $("#keyboard").css("background-color", "#f4f4fa");
  });
  $(window).on("focus", function () {
    $("#keyboard").css("background-color", "#A6FBDE");
  });

  // link input

  linkInput.oninput = function () {
    if (linkInput.value) {
      ok.style.display = "block";
      ok.style.opacity = "1";
    } else {
      ok.style.opacity = "0";
      ok.style.display = "none";
    }
  };

  linkInput.onkeydown = function (e) {
    if (e.which == 13) {
      ok.click();
    }
  };

  // confirm link

  ok.onclick = async function () {
    url = linkInput.value;
    let new_video_url;
    if (url.includes("dropbox.com")) {
      video_url = url.replace("?dl=0", "?raw=1");
    } else if (url.includes("google.com")) {
      video_url = url;
    } else if (url.includes("onedrive.live.com")) {
      url = url.substring(13, 119).replace("embed", "download");
    } else if (url.includes("box.com")) {
      video_url = url;
    } else if (
      url.match(
        /\.mp4|\.mp3|\.webm|\.ogg|\.wav|\.mov|\.flac|\.weba|\.oga|\.m4a/i
      )
    ) {
      video_url = url;
    }

    if (rem_tree.length == 0) new_video_url = url;

    if (rem_tree.length == 0 && new_video_url != undefined) {
      await RemNoteAPI.v0.create(" " + new_video_url, pluginId, {
        positionAmongstSiblings: 0,
      });
      location.reload();
    } else {
      var url_error = new bootstrap.Toast($("#urlError"));
      url_error.show();
    }
  };

  // take note

  takeNote.onclick = function () {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip("hide");
    });

    player.pause();

    noteInput.style.display = "block";
    commands.style.display = "none";

    noteInput.focus();
  };

  // note input

  $("#noteInput").focusout(function () {
    setTimeout(function () {
      just_noted = false;
    }, 500);
  });

  // delay input

  delayInput.onclick = function () {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip();
    });
    delayInput.value = "";
    delay = 0;
  };

  $(delayInput).on("onkeydown", function (event) {
    // escape
    if (event.keyCode == 27) {
      document.activeElement.blur();
    }
  });

  $(delayInput).on("focusout", function () {
    if (isNaN(delayInput.value)) {
      delayInput.value = "";
      delay = 0;
    }
  });

  $(delayInput).on("mouseenter", function () {
    if (no_delay) {
      $(this).css("background", "#1044ec");
    } else {
      $(this).css("background", "#eeeef7");
    }
    $(this).css("font-weight", "bold");
  });

  $(delayInput).on("mouseleave", function () {
    if (no_delay) {
      $(this).css("background", "#586cf4");
    } else {
      $(this).css("background", "#f4f4fa");
    }

    $(this).css("font-weight", "normal");
  });

  // refresh
  refresh.onclick = function () {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip();
    });

    $(this).css("font-weight", "bold");
    setTimeout(function () {
      $("#refresh").css("font-weight", "normal");
    }, 750);

    timeline(1);

    updateTimelineScrollbar();

    setTimeout(function () {
      change_line(current_chapter);
    }, 500);
  };

  // shortcuts
  $("#shortcuts").on("click", function () {
    $('[data-toggle="tooltip"]').on("click", function () {
      $(this).tooltip();
    });

    $(this).css("font-weight", "bold");
    setTimeout(function () {
      $("#shortcuts").css("font-weight", "normal");
    }, 750);

    show_shortcuts();
  });

  // tooltips

  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // modal

  $("#close_modal, .btn-close")
    .not("#close-link-error")
    .on("click", function () {
      show_shortcuts();
    });

  player.onvolumechange = function () {
    if (!player.muted) setVolume(player.volume * 100);
  };

  // player control

  $("#video_container").on("mouseleave", function () {
    if (!is_sliding_duration && !is_sliding_volume) {
      if (!player.paused && cursor_hover_video) {
        cursor_hover_video = false;
        hideVideoControl();
        hideVolumeSlider();
      }
    }
  });

  $("#video_container, #video_control").mousemove(function () {
    cursor_hover_video = true;
    if (!player.paused) {
      showVideoControl();

      clearTimeout(cursor_video_timeout);
      cursor_video_timeout = setTimeout(function () {
        if (!player.paused && !is_sliding_duration) {
          hideVideoControl();
          hideVolumeSlider();
        }
      }, 5000);
    }
  });

  $("#video_container").mousemove(function (event) {
    const mouse_x =
      (event.pageX - $("#video_container").offset().left - 14) /
      (player.width - 25);
    const mouse_y =
      (event.pageY - $(this).offset().top) / $("#video_container").height();

    showVideoControl();
  });

  $("#video_container").mousemove(function () {
    const mouse_x =
      (event.pageX - $("#video_container").offset().left - 14) /
      (player.width - 25);

    clearTimeout(mouse_timeout);
    mouse_timeout = setTimeout(function () {
      const time = Math.floor(mouse_x * player.duration);
      if (player_thumb.currentTime == time) {
        player_thumb.currentTime = time;
        last_time_player_thumb = player_thumb.currentTime;
      }
    }, 500);
  });

  $("#video_container, #video_play").click(function (event) {
    if (
      event.pageY - $("#video_container").offset().top <
      player.height - 50 - 15
    ) {
      let file, version, css;

      if (player.paused) {
        player.play();

        if (play_fade) overlayImage("play");
      } else {
        player.pause();

        overlayImage("pause");

        showVideoControl();
      }

      if (!play_fade) {
        $("#video_play").fadeOut("slow");
        $("#video_player_thumb").css("opacity", 0);
        play_fade = true;
      }

      updatePlayPauseIcon();

      clearTimeout(cursor_video_timeout);
      cursor_video_timeout = setTimeout(function () {
        if (!player.paused && !is_sliding_duration) {
          hideVideoControl();
          cursor_hover_video = false;
          hideVolumeSlider();
        }
      }, 5000);
    }
  });

  $("#play_icon").click(function (event) {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
    if (!play_fade) {
      $("#video_play").fadeOut("slow");
      $("#video_player_thumb").css("opacity", 0);
      play_fade = true;
    }

    updatePlayPauseIcon();
  });

  $("#play_icon").on("mouseover", function (event) {
    if (player.paused) {
      $(this).attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/play-svgrepo-com-white.svg?v=1645994623666"
      );
    } else {
      $(this).attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/pause-svgrepo-com-white.svg?v=1645994627608"
      );
    }
  });

  $("#play_icon").on("mouseout", function (event) {
    if (player.paused) {
      $(this).attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/play-svgrepo-com-gray.svg?v=1646077475496"
      );
    } else {
      $(this).attr(
        "src",
        "https://cdn.glitch.global/15b76133-8879-4c77-80a5-6a76b9ed3d57/pause-svgrepo-com-gray.svg?v=1646077482839"
      );
    }
  });

  $("#bar_sound_mute").click(function (event) {
    muteSwitch();
    player.muted ? overlayImage("mute") : overlayImage("sound");
  });

  $("#sound_icon").on("mouseover", function (event) {
    updateSoundMuteIcon(true);
  });

  $("#sound_icon").on("mouseout", function (event) {
    updateSoundMuteIcon();
  });

  $("#sound_icon, #volume, #volume_mode").on("mouseenter", function () {
    showVolumeSlider();
  });

  $("#video_container").on("click", function (event) {
    if (
      event.target.id != "slow_icon" &&
      event.target.id != "fast_icon" &&
      event.target.id != "sound_icon" &&
      event.target.id != "volume_mode" &&
      event.target.id != "volume"
    ) {
      hideVolumeSlider();
    }
  });

  $("#bar_container")
    .children()
    .on("mouseenter", function (event) {
      $("#bar_space").css("height", "10px");
      $("#bar_duration").css("height", "10px");
      $("#bar_background").css("height", "10px");

      $("#bar_slid").css("visibility", "visible");
      $("#tooltip_time").css("visibility", "visible");
      showVideoControl();
    });

  $("#bar_container").on("mousemove", function (event) {
    const mouse_x =
      (event.pageX - $("#video_container").offset().left - 14) /
      (player.width - 25);

    updateTooltipTime(mouse_x);
    updateThumbnail(mouse_x);
  });

  $("#bar_container").on("mouseout", function (event) {
    if (!is_sliding_duration) {
      $("#bar_space").css("height", "15px");
      $("#bar_duration").css("height", "5px");
      $("#bar_background").css("height", "5px");
      $("#bar_slid").css("visibility", "hidden");

      $("#tooltip_time").css("visibility", "hidden");
      document.getElementById("video_player_thumb").style.visibility = "hidden";
    }

    clearTimeout(pointer_timeout);
    pointer_timeout = setTimeout(function () {
      document.getElementById("video_container").style.cursor = "auto";
    }, 200);
  });

  $("#bar_container").on("click", function (event) {
    const mouse_x =
      (event.pageX - $("#video_container").offset().left - 14) /
      (player.width - 25);

    player.currentTime = Math.floor(mouse_x * player.duration);
    $("#bar_slid").slider(
      "value",
      (player.currentTime / player.duration) * 100
    );

    setTimeout(function () {
      if (current_chapter != 0) {
        $("html, body").animate(
          {
            scrollTop: $("#" + current_chapter).offset().top,
          },
          100
        );
      }
    }, 200);
  });

  speedEvents();

  // keyboard shortcuts

  document.onkeydown = async function (event) {
    let shortcut = "";
    let shortcuts = {};

    shortcuts.keys = {
      "shift+PageUp": "previous chapter",
      MediaTrackPrevious: "previous chapter",
      "shift+PageDown": "next chapter",
      MediaTrackNext: "next chapter",
      "shift+Home": "first chapter",
      "shift+End": "last chapter",
      "ctrl+ArrowUp": "increase volume",
      "ctrl+ArrowDown": "decrease volume",
      Backspace: "repeat",
      Space: "play/pause",
      MediaPlayPause: "media play/pause",
      Enter: "take a note",
      NumpadEnter: "take a note",
      Escape: "cancel",
      ArrowLeft: "rewind",
      ArrowRight: "forward",
      KeyJ: "long rewind",
      KeyL: "long forward",
      Digit: "jump",
      Numpad: "jump",
      KeyK: "play/pause",
      m: "mute",
      "shift+Comma": "slower",
      "shift+Period": "faster",
      KeyR: "refresh",
      KeyD: "delay switch",
      F1: "help",
      Tab: "indent",
      "shift+Tab": "unindent",
      "shift+ArrowUp": "previous line",
      "shift+ArrowDown": "next line",
      "shift+ArrowLeft": "first line",
      "shift+ArrowRight": "last line",
      "alt+ArrowLeft": "previous rem",
      "alt+ArrowRight": "next rem",
      ArrowUp: "scroll top",
      ArrowDown: "scroll bottom",
      PageUp: "long scroll top",
      PageDown: "long scroll bottom",
      Home: "scroll begin",
      End: "scroll end",
    };

    if (event.ctrlKey) shortcut += "ctrl+";
    if (event.altKey) shortcut += "alt+";
    if (event.shiftKey) shortcut += "shift+";

    if (event.repeat && event.code == "Enter") {
      return;
    }

    if (
      event.key == "MediaTrackPrevious" ||
      event.key == "MediaTrackNext" ||
      event.key == "MediaPlayPause"
    ) {
      shortcut += event.key;
    } else if (event.code.substr(0, 5) == "Digit") {
      shortcut += event.code.substr(0, 5);
      // without NumpadEnter
    } else if (event.code.substr(0, 6) == "Numpad" && event.code.length == 7) {
      shortcut += event.code.substr(0, 6);
      // Internationalize the key
    } else if (event.key == "m") {
      shortcut += event.key;
    } else if (event.code) {
      shortcut += event.code;
    }

    // take note mode
    if (noteInput.value == "" && !$("#video_player").is(":focus")) {
      switch (shortcuts.keys[shortcut]) {
        case "increase volume":
          player.volume <= 0.95 ? (player.volume += 0.05) : (player.volume = 1);

          overlayText(Math.round(player.volume * 100) + "%");
          break;
        case "decrease volume":
          player.volume >= 0.05 ? (player.volume -= 0.05) : (player.volume = 0);

          overlayText(Math.round(player.volume * 100) + "%");
          break;
        case "mute":
          muteSwitch();
          player.muted ? overlayImage("mute") : overlayImage("sound");
          break;
        case "previous chapter":
          current_chapter--;
          if (current_chapter > 0) {
            document.getElementById(String(current_chapter)).click();
          } else {
            current_chapter = 1;
          }

          level = 1;
          reset_line_position();

          change_line(current_chapter);
          break;
        case "next chapter":
          current_chapter++;

          if (current_chapter < rem_tree.length) {
            document.getElementById(String(current_chapter)).click();
          } else {
            current_chapter = rem_tree.length - 1;
          }

          level = 1;
          reset_line_position();

          change_line(current_chapter);
          break;
        case "first chapter":
          current_chapter = 1;
          document.getElementById(String(current_chapter)).click();

          level = 1;
          reset_line_position();

          change_line(current_chapter);
          break;
        case "last chapter":
          current_chapter = rem_tree.length - 1;
          document.getElementById(String(current_chapter)).click();

          level = 1;
          reset_line_position();

          change_line(current_chapter);
          break;
        case "repeat":
          if ($("#noteInput").is(":focus") == false) {
            if (document.activeElement != noteInput) {
              if (current_chapter > 0 && current_chapter < rem_tree.length) {
                document.getElementById(String(current_chapter)).click();
              }
            }
          }
          break;
        case "play/pause":
          if (!$("#noteInput").is(":focus")) {
            event.preventDefault();
            if (player.paused) {
              player.play();
              if (!play_fade) {
                $("#video_play").fadeOut("slow");
                play_fade = true;
              }
              hideVideoControl();
            } else {
              cursor_hover_video = false;
              player.pause();
              showVideoControl();
            }
            updatePlayPauseIcon();
          }
          break;
        case "media play/pause":
          break;
        case "rewind":
          player.currentTime -= 5;
          break;
        case "forward":
          player.currentTime += 5;
          break;
        case "long rewind":
          if ($("#noteInput").is(":focus") == false) {
            player.currentTime -= 10;
          }
          break;
        case "long forward":
          if ($("#noteInput").is(":focus") == false) {
            player.currentTime += 10;
          }
          break;
        case "jump":
          if (
            $("#noteInput").is(":focus") == false &&
            $("#delayInput").is(":focus") == false
          ) {
            if (event.code.substr(0, 5) == "Digit") {
              player.currentTime = player.duration * 0.1 * event.code.substr(6);
            } else if (
              event.code.substr(0, 6) == "Numpad" &&
              event.code.length == 7
            ) {
              player.currentTime = player.duration * 0.1 * event.code.substr(6);
            }
          }
          break;
        case "slower":
          if ($("#noteInput").is(":focus") == false) {
            if (player.playbackRate >= 0.5) {
              player.playbackRate -= 0.25;
            } else {
              player.playbackRate = 0.25;
            }
            overlayText(player.playbackRate + "x");
          }
          break;
        case "faster":
          if ($("#noteInput").is(":focus") == false) {
            if (player.playbackRate <= 15.75) {
              player.playbackRate += 0.25;
            } else {
              player.playbackRate = 16;
            }

            overlayText(player.playbackRate + "x");
          }
          break;
        case "refresh":
          if ($("#noteInput").is(":focus") == false) {
            timeline(1);
          }

          setTimeout(function () {
            change_line(current_chapter);
          }, 500);
          break;
        case "delay switch":
          if ($("#noteInput").is(":focus") == false) {
            no_delay = !no_delay;
            if (no_delay) {
              $("#delayInput").css("background", "#586cf4");
              $("#delayInput").css("color", "white");
              $("#delayInput").addClass("delay_placeholder");
            } else {
              $("#delayInput").css("background", "#f4f4fa");
              $("#delayInput").css("color", "#63637B");
              $("#delayInput").removeClass("delay_placeholder");
            }
          }
          break;
        case "help":
          event.preventDefault();
          show_shortcuts();
          break;
        case "indent":
          event.preventDefault();
          create_tree_position();

          if (
            current_chapter > 0 &&
            level < get_tree_depth(0, -1, rem_tree[current_chapter]) &&
            level < 5
          )
            level++;

          change_line(current_chapter);
          break;
        case "unindent":
          event.preventDefault();
          create_tree_position();
          if (level > 1) level--;

          if (level < 2) line_position1 = 0;
          if (level < 3) line_position2 = 0;
          if (level < 4) line_position3 = 0;
          if (level < 5) line_position4 = 0;

          change_line(current_chapter);
          //}
          break;
        case "previous line":
          if (level == 1) {
            current_chapter--;
            if (current_chapter > 0) {
              document.getElementById(String(current_chapter)).click();
            } else {
              current_chapter = 1;
            }
          }
          if (level == 2 && line_position1 > 0) line_position1--;
          if (level == 3 && line_position2 > 0) line_position2--;
          if (level == 4 && line_position3 > 0) line_position3--;
          if (level == 5 && line_position4 > 0) line_position4--;

          change_line(current_chapter);
          break;
        case "next line":
          if (level == 1) {
            current_chapter++;

            if (current_chapter < rem_tree.length) {
              document.getElementById(String(current_chapter)).click();
            } else {
              current_chapter = rem_tree.length - 1;
            }
          }
          if (level == 2 && line_position1 < line_max_position1)
            line_position1++;
          if (level == 3 && line_position2 < line_max_position2)
            line_position2++;
          if (level == 4 && line_position3 < line_max_position3)
            line_position3++;
          if (level == 5 && line_position4 < line_max_position4)
            line_position4++;

          change_line(current_chapter);
          break;
        case "first line":
          if (level == 2) line_position1 = 0;
          if (level == 3) line_position2 = 0;
          if (level == 4) line_position3 = 0;
          if (level == 5) line_position4 = 0;

          change_line(current_chapter);
          break;
        case "last line":
          if (level == 2) line_position1 = line_max_position1;
          if (level == 3) line_position2 = line_max_position2;
          if (level == 4) line_position3 = line_max_position3;
          if (level == 5) line_position4 = line_max_position4;

          change_line(current_chapter);
          break;
        case "scroll top":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop($(window).scrollTop() - 16 * 2);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        case "scroll bottom":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop($(window).scrollTop() + 16 * 2);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        case "long scroll top":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop($(window).scrollTop() - 16 * 10);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        case "long scroll bottom":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop($(window).scrollTop() + 16 * 10);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        case "scroll begin":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop(0);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        case "scroll end":
          event.preventDefault();
          if (!just_scrolled) {
            just_scrolled = true;
            $(window).scrollTop(9999999);
            setTimeout(function () {
              just_scrolled = false;
            }, 100);
          }
          break;
        default:
      }
    }

    switch (shortcuts.keys[shortcut]) {
      case "take a note":
        if (!just_noted || text_input == "") {
          player.pause();
          showVideoControl();

          noteInput.style.display = "flex";
          commands.style.display = "none";
          noteInput.focus();
        }
        break;
      case "cancel":
        player.play();
        updatePlayPauseIcon();
        recoverFromNoteInput();
        break;
      default:
    }
  };

  // note input

  noteInput.onkeydown = async function (event) {
    var position;

    let shortcut = "";
    let shortcuts = {};

    shortcuts.keys = {
      Enter: "take a note",
      NumpadEnter: "take a note",
      "alt+Enter": "take a child note without a timestamp",
      "alt+NumpadEnter": "take a child note without a timestamp",
      "ctrl+Enter": "take a child note with a timestamp",
      "ctrl+NumpadEnter": "take a child note with a timestamp",
    };

    if (event.ctrlKey) shortcut += "ctrl+";

    if (event.altKey) shortcut += "alt+";

    if (event.shiftKey) shortcut += "shift+";

    if (event.repeat && event.code == "Enter") {
      return;
    }

    if (event.code) {
      shortcut += event.code;
    }

    // different ways to take a note
    switch (shortcuts.keys[shortcut]) {
      case "take a note": {
        while (writing_rem) {
          if (writing_rem) await sleep(100);
        }

        writing_rem = true;

        last_line_position1 = line_position1;
        last_line_position2 = line_position2;
        last_line_position3 = line_position3;
        last_line_position4 = line_position4;
        last_line_max_position1 = line_max_position1;
        last_line_max_position2 = line_max_position2;
        last_line_max_position3 = line_max_position3;
        last_line_max_position4 = line_max_position4;

        var delay = Number(document.getElementById("delayInput").value);
        if (no_delay) delay = 0;

        rewind();

        player.currentTime = Math.floor(player.currentTime);
        let time = player.currentTime;

        var text =
          durationToFormatedTime(time) +
          " " +
          updateLatexInline(noteInput.value);

        text_input = noteInput.value;

        player.play();

        recoverFromNoteInput();

        just_noted = true;

        var inserted = false;
        let rem_tree_len = rem_tree.length;
        for (position = 1; position < rem_tree_len; position++) {
          const clock = rem_tree[position].name[0].split(" ")[0];

          if (clock === undefined) continue;

          if (formatedTimeToDuration(clock) > time) {
            const last_rem = await RemNoteAPI.v0.create(text, pluginId, {
              positionAmongstSiblings: position,
            });

            let added_rem = await RemNoteAPI.v0.get(last_rem.remId);
            added_rem.children = new Array();
            rem_tree.splice(position, 0, added_rem);

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          const last_rem = await RemNoteAPI.v0.create(text, pluginId, {
            positionAmongstSiblings: position,
          });

          let added_rem = await RemNoteAPI.v0.get(last_rem.remId);
          added_rem.children = new Array();
          rem_tree.push(added_rem);
        }

        update_timeline(position, time, text_input);

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function () {
          $("html, body").animate(
            {
              scrollTop: $("#" + position).offset().top,
            },
            0
          );
        }, 500);

        text_input = "";
        writing_rem = false;

        updateTimelineScrollbar();

        level = 1;
        reset_line_position();
        change_line(current_chapter + 1);

        break;
      }
      case "take a child note without a timestamp": {
        while (writing_rem) {
          if (writing_rem) await sleep(100);
        }

        writing_rem = true;

        update_lines_position();

        last_level = level;

        if (rem_tree.length <= 1 || current_chapter == 0) break;

        var delay = Number(document.getElementById("delayInput").value);
        if (no_delay) delay = 0;

        let chapter_note = current_chapter;

        if (rem_tree.length > 1) rewind();
        player.currentTime = Math.floor(player.currentTime);
        let time = player.currentTime;

        var text = updateLatexInline(noteInput.value);

        let text_input = noteInput.value;

        player.play();

        recoverFromNoteInput();

        just_noted = true;

        tree_position = [];

        let line_index = [];
        line_index.length = 4;

        let child_child_array = [];
        let current_rem;

        switch (level) {
          case 1:
            current_rem = rem_tree[chapter_note];
            child_child_array = current_rem.children;
            break;
          case 2:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            child_child_array = current_rem[line_index[0]].children;
            break;
          case 3:
            current_rem = rem_tree[chapter_note].children;

            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;

            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            child_child_array = current_rem[line_index[1]].children;
            break;
          case 4:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;
            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children;
            last_line_max_position3 = current_rem.length - 1;
            line_index[2] =
              last_line_position3 < last_line_max_position3
                ? last_line_position3
                : current_rem.length - 1;
            tree_position.push(line_index[2]);

            child_child_array = current_rem[line_index[2]].children;
            break;
          case 5:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < current_rem.length - 1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;
            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children;
            last_line_max_position3 = current_rem.length - 1;
            line_index[2] =
              last_line_position3 < last_line_max_position3
                ? last_line_position3
                : current_rem.length - 1;
            tree_position.push(line_index[2]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children;
            last_line_max_position4 = current_rem.length - 1;
            line_index[3] =
              last_line_position4 < last_line_max_position4
                ? last_line_position4
                : current_rem.length - 1;
            tree_position.push(line_index[3]);

            child_child_array = current_rem[line_index[3]].children;
            break;
          default:
        }

        let parentId;
        switch (level) {
          case 1:
            parentId = current_rem._id;
            break;
          case 2:
            parentId = current_rem[line_index[0]]._id;
            break;
          case 3:
            parentId = current_rem[line_index[1]]._id;
            break;
          case 4:
            parentId = current_rem[line_index[2]]._id;
            break;
          case 5:
            parentId = current_rem[line_index[3]]._id;
            break;
        }

        const last_rem = await RemNoteAPI.v0.create(text, parentId);

        let rem_added = await RemNoteAPI.v0.get(last_rem.remId);
        rem_added.children = new Array();

        switch (level) {
          case 1:
            if (rem_tree[chapter_note].children == undefined)
              rem_tree[chapter_note].children = new Array();
            rem_tree[chapter_note].children.push(rem_added);
            break;
          case 2:
            if (
              rem_tree[chapter_note].children[line_index[0]].children ==
              undefined
            )
              rem_tree[chapter_note].children[line_index[0]].children =
                new Array();
            rem_tree[chapter_note].children[line_index[0]].children.push(
              rem_added
            );
            break;
          case 3:
            if (
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children == undefined
            )
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children = new Array();
            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children.push(rem_added);
            break;
          case 4:
            if (
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children == undefined
            )
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children = new Array();
            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children[line_index[2]].children.push(rem_added);
            break;
          case 5:
            if (
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children[line_index[3]].children ==
              undefined
            )
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children[line_index[3]].children =
                new Array();

            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children[line_index[2]].children[line_index[3]].children.push(
              rem_added
            );
            break;
        }

        update_note_child(null, tree_position, null, text_input);

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function () {
          $("html, body").animate(
            {
              scrollTop: $("#" + chapter_note).offset().top,
            },
            100
          );
        }, 500);

        text_input = "";
        writing_rem = false;

        updateTimelineScrollbar();

        break;
      }
      case "take a child note with a timestamp": {
        while (writing_rem) {
          if (writing_rem) await sleep(100);
        }

        if (rem_tree.length <= 1 || current_chapter == 0) break;

        writing_rem = true;

        update_lines_position();

        last_level = level;

        var delay = Number(document.getElementById("delayInput").value);
        if (no_delay) delay = 0;

        let chapter_note = current_chapter;

        if (rem_tree.length > 1) rewind();

        player.currentTime = Math.floor(player.currentTime);
        let time = player.currentTime;

        var text =
          durationToFormatedTime(time) +
          " " +
          updateLatexInline(noteInput.value);

        text_input = noteInput.value;

        player.play();

        recoverFromNoteInput();

        tree_position = [];

        let line_index = [];
        line_index.length = 4;

        let child_child_array = [];
        let current_rem;

        switch (last_level) {
          case 1:
            current_rem = rem_tree[chapter_note];
            child_child_array = current_rem.children;
            break;
          case 2:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            if (current_rem[line_index[0]].children == undefined) {
              current_rem[line_index[0]].children = new Array();
            }

            child_child_array = current_rem[line_index[0]].children;
            break;
          case 3:
            current_rem = rem_tree[chapter_note].children;

            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;

            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            if (current_rem[line_index[1]].children == undefined) {
              current_rem[line_index[1]].children = new Array();
            }

            child_child_array = current_rem[line_index[1]].children;
            break;
          case 4:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < last_line_max_position1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;
            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children;
            last_line_max_position3 = current_rem.length - 1;
            line_index[2] =
              last_line_position3 < last_line_max_position3
                ? last_line_position3
                : current_rem.length - 1;
            tree_position.push(line_index[2]);

            if (current_rem[line_index[2]].children == undefined) {
              current_rem[line_index[2]].children = new Array();
            }

            child_child_array = current_rem[line_index[2]].children;
            break;
          case 5:
            current_rem = rem_tree[chapter_note].children;
            last_line_max_position1 = current_rem.length - 1;
            line_index[0] =
              last_line_position1 < current_rem.length - 1
                ? last_line_position1
                : current_rem.length - 1;
            tree_position.push(line_index[0]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children;
            last_line_max_position2 = current_rem.length - 1;
            line_index[1] =
              last_line_position2 < last_line_max_position2
                ? last_line_position2
                : current_rem.length - 1;
            tree_position.push(line_index[1]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children;
            last_line_max_position3 = current_rem.length - 1;
            line_index[2] =
              last_line_position3 < last_line_max_position3
                ? last_line_position3
                : current_rem.length - 1;
            tree_position.push(line_index[2]);

            current_rem =
              rem_tree[chapter_note].children[line_index[0]].children[
                line_index[1]
              ].children[line_index[2]].children;
            last_line_max_position4 = current_rem.length - 1;
            line_index[3] =
              last_line_position4 < last_line_max_position4
                ? last_line_position4
                : current_rem.length - 1;
            tree_position.push(line_index[3]);

            if (current_rem[line_index[3]].children == undefined) {
              current_rem[line_index[3]].children = new Array();
            }

            child_child_array = current_rem[line_index[3]].children;
            break;
          default:
        }

        let parentId;
        switch (last_level) {
          case 1:
            parentId = current_rem._id;
            break;
          case 2:
            parentId = current_rem[line_index[0]]._id;
            break;
          case 3:
            parentId = current_rem[line_index[1]]._id;
            break;
          case 4:
            parentId = current_rem[line_index[2]]._id;
            break;
          case 5:
            parentId = current_rem[line_index[3]]._id;
            break;
        }

        var inserted = false;
        let count_no_timestamp = 0;
        let child_child_array_len = child_child_array.length;
        for (position = 0; position < child_child_array_len; position++) {
          const timestamp_regex = new RegExp(/^\d{1,4}:\d{2}/g);
          if (!timestamp_regex.test(child_child_array[position].name[0]))
            count_no_timestamp++;
        }

        let last_rem;

        for (
          position = 0;
          position < child_child_array_len - count_no_timestamp;
          position++
        ) {
          const clock = child_child_array[position].name[0].split(" ")[0];

          if (clock === undefined) continue;

          if (formatedTimeToDuration(clock) > time) {
            last_rem = await RemNoteAPI.v0.create(text, parentId, {
              positionAmongstSiblings: position,
            });

            inserted = true;
            break;
          }
        }

        if (!inserted) {
          last_rem = await RemNoteAPI.v0.create(text, parentId, {
            positionAmongstSiblings: position,
          });
        }

        let rem_added = await RemNoteAPI.v0.get(last_rem.remId);
        rem_added.children = new Array();
        switch (last_level) {
          case 1:
            rem_tree[chapter_note].children.splice(position, 0, rem_added);
            break;
          case 2:
            rem_tree[chapter_note].children[line_index[0]].children.splice(
              position,
              0,
              rem_added
            );
            break;
          case 3:
            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children.splice(position, 0, rem_added);
            break;
          case 4:
            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children[line_index[2]].children.splice(position, 0, rem_added);
            break;
          case 5:
            rem_tree[chapter_note].children[line_index[0]].children[
              line_index[1]
            ].children[line_index[2]].children[line_index[3]].children.splice(
              position,
              0,
              rem_added
            );
            break;
        }

        tree_position.push(position);

        update_note_child(chapter_note, tree_position, time, text_input);

        clearTimeout(scroll_timeout);
        scroll_timeout = setTimeout(function () {
          $("html, body").animate(
            {
              scrollTop: $("#" + chapter_note).offset().top,
            },
            100
          );
        }, 500);

        text_input = "";
        writing_rem = false;

        updateTimelineScrollbar();

        break;
      }
      default: {
      }
    }
  };

  // FUNCTIONS

  function get_tree_depth(counter, depth, data) {
    if (counter == 0);
    else if (counter == 1) data = data.children[line_position1];
    else if (counter == 2) data = data.children[line_position2];
    else if (counter == 3) data = data.children[line_position3];
    else if (counter == 4) data = data.children[line_position4];
    else data = data.children[data.children.length - 1];

    if (data == undefined) depth = counter + 1;
    else if (counter < 5) counter++;
    return depth == -1 ? get_tree_depth(counter, depth, data) : depth;
  }

  function updateTimelineScrollbar() {
    if (
      !scroll_visible &&
      document.documentElement.scrollHeight !==
        document.documentElement.clientHeight
    ) {
      create_chapter();
      scroll_visible = true;
    } else if (
      document.documentElement.scrollHeight ==
      document.documentElement.clientHeight
    ) {
      scroll_visible = false;
    }
  }

  function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  function recoverFromNoteInput() {
    noteInput.value = "";
    noteInput.blur();
    noteInput.style.display = "none";
    commands.style.display = "flex";
  }

  function prepare_video() {
    // make the video
    player.width = window.innerWidth * (parameters.get("width") / 100) - 20;
    player.height = clientHeight - 100 - w_parameter;

    overlayPosition(player.width / 2 - 35, player.height / 2 - 35);

    $("#video_control").css("top", player.height - 50 - 15 + "px");

    player_thumb.width = 160;
    player_thumb.height = 100;

    var video_source = document.getElementsByClassName("video_source");

    for (var i = 0; i < video_source.length; i++) {
      if (url.includes("dropbox.com")) {
        video_url = url.replace("?dl=0", "?raw=1");
      } else if (url.includes("box.com")) {
        let shared_name = url.substring(40);
        let file_id = url.substring(25, 37);
        video_url =
          "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=" +
          shared_name +
          "&file_id=f_" +
          file_id;
      } else if (url.includes("google.com")) {
        video_url =
          "https://docs.google.com/uc?export=download&id=" +
          url.substring(32, 65);
      }

      video_source[i].src = video_url;
    }

    player.load();
    player_thumb.load();

    $("#video_container").width(player.width);

    $("#bar_background").css("width", player.width - 25 + "px");
    $("#bar_slid").css("width", player.width - 25 - 7.5 + "px");

    document.getElementById("tooltip_time").style.top =
      player.height - 50 - 35 + "px";

    document.getElementById("video_player_thumb").style.top =
      player.height - 50 - 140 + "px";

    document.getElementById("bar_duration").style.top =
      player.height - 50 + "px";

    $("#video_play").css("top", player.height / 2 - 50 + "px");
    $("#video_play").css("left", player.width / 2 - 37.5 + "px");

    if (url.match(/\.mp3|\.flac|\.wav/i)) {
      $("#video_player").css(
        "background",
        '#000000 no-repeat center/50% url("https://cdn.glitch.global/18600a1d-7980-41f9-b995-164f834d4937/headphones-color-svgrepo-com.svg?v=1643053570830);"'
      );
    }

    player.volume = 0.51;

    player.onloadeddata = function () {
      if (enable_parameter) {
        const speed_parameter_value = parameters.get("playback_speed");

        setTimeout(function () {
          if (speed_parameter_value != null) {
            player.playbackRate = Number(speed_parameter_value);
          }
        }, 1000);
      }

      timeline();

      $(window).focus();
      $("#video_player").blur();
    };

    player.onpause = function () {
      paused = true;
      cancel_auto_scroll = true;
    };

    player.onplay = function () {
      paused = false;
    };

    player.onended = function () {
      updatePlayPauseIcon();
    };

    player.onclick = function () {
      if (player.paused) {
        player.play();
        hideVideoControl();
      } else {
        player.pause();

        showVideoControl();
      }
      updatePlayPauseIcon();
    };

    player.oncanplay = function () {
      if (!video_ready) {
        if (player.duration < 3600) {
          $("#bar_time").addClass("col-2");
          $("#small_bar_time").addClass("col-2");
          $("#bar_chapter").addClass("col-6");
        } else {
          $("#bar_time").addClass("col-3");
          $("#small_bar_time").addClass("col-3");
          $("#bar_chapter").addClass("col-5");
        }

        showVideoControl();

        $("#video_play").css("visibility", "visible");
        $("#bar_time, #small_bar_time, #bar_chapter").css("opacity", 1);

        video_ready = true;
      }
    };

    // updates
    setInterval(() => {
      if (!shortcuts_displayed) html_player_width = player.width;

      play_pointer.style.left =
        (player.currentTime / player.duration) * (html_player_width - 35) +
        25 +
        "px";
    }, 100);

    // player
    setInterval(() => {
      $("#bar_duration").css(
        "width",
        (player.currentTime / player.duration) * 100 + "%"
      );
      $("#bar_slid").slider(
        "value",
        (player.currentTime / player.duration) * 100
      );
    }, 17);

    setInterval(() => {
      $("#bar_time").text(
        durationToFormatedTime(player.currentTime) +
          " / " +
          durationToFormatedTime(player.duration)
      );
    }, 200);

    setInterval(() => {
      $("#small_bar_time").text(durationToFormatedTime(player.currentTime));
    }, 1000);

    // chapter
    setInterval(() => {
      const player_current_time = parseInt(player.currentTime);
      let chapter_found = false;
      for (let i = 1; i < rem_tree.length; i++) {
        if (document.getElementById(String(i)) !== null) {
          if (document.getElementById(String(i)).value == "0") break;
          if (
            player_current_time <
            formatedTimeToDuration(
              String(document.getElementById(String(i)).value)
            )
          ) {
            current_chapter = i - 1;
            chapter_found = true;
            break;
          }
        }
      }

      if (!chapter_found) {
        current_chapter = rem_tree.length - 1;
      }
    }, 17);

    // auto scroll while playing
    setInterval(() => {
      let player_current_time = Math.floor(player.currentTime);

      const rem_tree_len = rem_tree.length;
      for (let i = 1; i < rem_tree_len; i++) {
        if (document.getElementById(String(i)) !== null) {
          if (document.getElementById(String(i)).value == "0") break;
          if (
            player_current_time ==
            formatedTimeToDuration(document.getElementById(String(i)).value)
          ) {
            if (!just_clicked && !cancel_auto_scroll) {
              $("html, body").animate(
                {
                  scrollTop: $("#" + i).offset().top,
                },
                100
              );
              cancel_auto_scroll = true;
              break;
            }
          }
        }
      }
    }, 200);

    // update blue line
    setInterval(() => {
      if (previous_chapter != current_chapter && current_chapter > 0) {
        if (rem_tree[current_chapter].name[0].split(" ").length >= 1) {
          let text_array = rem_tree[current_chapter].name[0].split(" ");
          text_array.shift();
          $("#bar_chapter").text(text_array.join(" "));
        }
      } else if (current_chapter == 0) {
        $("#bar_chapter").text("");
      }

      if (previous_chapter != current_chapter && !just_clicked) {
        level = 1;
        reset_line_position();
        change_line(current_chapter);

        cancel_auto_scroll = false;
      }

      if (previous_chapter != current_chapter)
        previous_chapter = current_chapter;

      if (current_chapter == 0) {
        if (last_referenceNode != undefined) {
          if (dark_mode == 0 && last_referenceNode.style.color != "#202020") {
            last_referenceNode.style.color = "#202020";
          } else if (
            dark_mode == 1 &&
            last_referenceNode.style.color != "#c0bdbd"
          ) {
            last_referenceNode.style.color = "#c0bdbd";
          }
        }
      }
    }, 200);

    // set speed
    if (enable_parameter) {
      const speed_parameter_value = parameters.get("playback_speed");

      if (speed_parameter_value != null) {
        player.playbackRate = Number(speed_parameter_value);
      }
    }

    $("#bar_slid").slider({
      orientation: "horizontal",
      min: 0,
      max: 100,
      value: 0,
      range: "min",
      start: function (event, ui) {
        is_sliding_duration = true;
      },
      slide: function (event, ui) {
        player.currentTime = (ui.value / 100) * player.duration;

        const mouse_x =
          (event.pageX - $("#video_container").offset().left - 14) /
          (player.width - 25);

        updateTooltipTime(mouse_x);
        updateThumbnail(mouse_x);
      },
      stop: function (event, ui) {
        is_sliding_duration = false;
        if (current_chapter != 0) {
          $("html, body").animate(
            {
              scrollTop: $("#" + current_chapter).offset().top,
            },
            100
          );
        }

        setTimeout(function () {
          $("#tooltip_time").css("visibility", "hidden");
          $("#video_player_thumb").css("visibility", "hidden");
        }, 200);
      },
    });

    initVolume();

    // make the timeline
    timeline();

    // focus
    $(window).focus();
    $("#video_player").blur();

    // change panel
    viewCont.style.display = "block";
    linkCont.style.display = "none";

    // scrollbar
    updateTimelineScrollbar();

    // erase the loading placeholder
    setTimeout(function () {
      $("#placeholder").html("");
    }, 500);
  }

  // durations

  // seconds to 0:00 (or 0:00:00)
  function durationToFormatedTime(duration) {
    if (duration < 0) duration = 0;

    var hour = ~~(duration / 3600);
    var min = ~~((duration % 3600) / 60);
    var sec = ~~duration % 60;

    var ret = "";

    if (hour > 0) {
      ret += "" + hour + ":" + (min < 10 ? "0" : "");
    }

    ret += "" + min + ":" + (sec < 10 ? "0" : "");
    ret += "" + sec;

    return ret;
  }

  // 0:00 (or 0:00:00) to seconds
  function formatedTimeToDuration(time) {
    if (time == undefined || time == 0) return 0;

    var line_time = time.split(":");
    var duration;
    var min, sec, hour;

    if (line_time.length == 2) {
      min = Number(line_time[0]);
      sec = Number(line_time[1]);
      duration = min * 60 + sec;
    } else if (line_time.length == 3) {
      hour = Number(line_time[0]);
      min = Number(line_time[1]);
      sec = Number(line_time[2]);
      duration = hour * 3600 + min * 60 + sec;
    }
    return duration;
  }

  function rewind() {
    delay = Number(document.getElementById("delayInput").value);
    if (no_delay) delay = 0;

    if (player.currentTime > delay) player.currentTime -= delay;
  }

  async function update_modal() {
    const modal_options = {
      backdrop: false,
      keyboard: true,
    };

    for (let i = 0; i < modal_list.length; i++) {
      modal_list[i].hide();
    }

    modal_list = [];
    const modals = document.getElementsByClassName("modal");
    for (let i = 0; i < modals.length; i++) {
      if (modals[i].id == "mainModalToggle") {
        modal_list.push(
          new bootstrap.Modal(
            document.getElementById("mainModalToggle"),
            modal_options
          )
        );
        mainModal = modal_list[modal_list.length - 1];
      } else {
        modal_list.push(
          new bootstrap.Modal(
            document.getElementById(modals[i].id),
            modal_options
          )
        );
      }

      document.getElementById(modals[i].id).style.position = "relative";
    }
  }

  async function show_shortcuts() {
    await update_modal();

    if ($("#note").css("display") == "none") {
      $("#note").css("display", "block");
      shortcuts_displayed = false;
      $(".modal").hide();
    } else {
      $("#note").css("display", "none");
      shortcuts_displayed = true;
      mainModal.show();
    }

    $(".modal-open").css("overflow-y", "auto");
  }

  // function to load when the video is ready
  async function timeline(refresh) {
    // playback speed
    if (refresh != 1) {
      if (enable_parameter) {
        const speed_parameter_value = parameters.get("playback_speed");

        if (speed_parameter_value != null) {
          player.playbackRate = speed_parameter_value;
        }
      }
    }

    // html player

    const player_duration = player.currentTime;
    const player_width = player.width;

    // rem

    if (refresh == 1) {
      await create_rem_tree();
    }

    //notes

    const div = document.getElementById("note");
    div.innerHTML = "";

    if (rem_tree.length < 2) {
      create_chapter();
      return;
    }

    const ul0 = document.createElement("ul");
    div.appendChild(ul0);
    const child_list = document.createElement("div");

    for (let i = 1; i <= rem_tree.length; i++) {
      if (i > 1) var previous_rem = rem;

      // level 0

      const li0 = document.createElement("li");
      let id0 = "_0-" + i;
      li0.id = id0;

      line_mouse_events(li0);

      if (i < rem_tree.length) ul0.appendChild(li0);

      // input

      const input0 = document.createElement("input");

      input0.type = "button";

      input0.id = i;
      input0.class = "btn me-2";
      input0.style.background = color_0[(i - 1) % color_0.length];

      // list children
      if (i < rem_tree.length) {
        var rem = rem_tree[i];

        if (rem.name.length >= 1) {
          input0.value = rem.name[0].split(" ")[0];
        }
      }

      $(input0).on("click", function () {
        just_clicked = true;
        $("html, body").animate(
          {
            scrollTop: $(this).offset().top,
          },
          100
        );

        var clock = $(this).val();
        player.currentTime = formatedTimeToDuration(clock);
      });

      $(input0).on("mouseenter", function () {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(input0).on("mouseleave", function () {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });

      if (hasTimestamp(rem)) li0.appendChild(input0);

      const newContent0 = createNewContent(rem);

      li0.appendChild(newContent0);

      // list children
      if (i < rem_tree.length) {
        const child0_rem = rem_tree[i];

        // level 1
        const ul1 = document.createElement("ul");
        if (child0_rem.children != undefined) {
          for (let n1 = 0; n1 < child0_rem.children.length; n1++) {
            const li1 = document.createElement("li");
            let id1 = id0 + "_1-" + n1;
            li1.id = id1;

            line_mouse_events(li1);

            const child1_rem = child0_rem.children[n1];

            let input1;
            if (hasTimestamp(child1_rem)) {
              input1 = document.createElement("input");
              input1.type = "button";

              $(input1).addClass("me-2");
              input1.style.background = color_1[(i - 1) % color_1.length];

              if (child1_rem.name.length >= 1) {
                input1.value = child1_rem.name[0].split(" ")[0];
              }

              $(input1).on("click", function () {
                just_clicked = true;
                $("html, body").animate(
                  {
                    scrollTop: $(this).offset().top,
                  },
                  100
                );

                const clock = $(this).val();
                player.currentTime = formatedTimeToDuration(clock);
              });

              $(input1).on("mouseenter", function () {
                $(this).css(
                  "background",
                  color_1_hover[(i - 1) % color_1_hover.length]
                );
              });

              $(input1).on("mouseleave", function () {
                $(this).css("background", color_1[(i - 1) % color_1.length]);
              });
            }

            if (hasTimestamp(child1_rem)) li1.appendChild(input1);

            const newContent1 = createNewContent(child1_rem);

            li1.appendChild(newContent1);
            ul1.appendChild(li1);

            // level 2
            const ul2 = document.createElement("ul");
            if (child1_rem.children != undefined) {
              for (let n2 = 0; n2 < child1_rem.children.length; n2++) {
                const li2 = document.createElement("li");
                let id2 = id1 + "_2-" + n2;
                li2.id = id2;

                line_mouse_events(li2);

                const child2_rem = child1_rem.children[n2];

                let input2;
                if (hasTimestamp(child2_rem)) {
                  input2 = document.createElement("input");
                  input2.type = "button";

                  $(input2).addClass("me-2");
                  input2.style.background = color_2[(i - 1) % color_2.length];

                  if (child2_rem.name.length >= 1) {
                    input2.value = child2_rem.name[0].split(" ")[0];
                  }

                  $(input2).on("click", function () {
                    just_clicked = true;
                    $("html, body").animate(
                      {
                        scrollTop: $(this).offset().top,
                      },
                      100
                    );

                    const clock = $(this).val();
                    player.currentTime = formatedTimeToDuration(clock);
                  });

                  $(input2).on("mouseenter", function () {
                    $(this).css(
                      "background",
                      color_2_hover[(i - 1) % color_2_hover.length]
                    );
                  });

                  $(input2).on("mouseleave", function () {
                    $(this).css(
                      "background",
                      color_2[(i - 1) % color_2.length]
                    );
                  });
                }

                if (hasTimestamp(child2_rem)) li2.appendChild(input2);

                const newContent2 = createNewContent(child2_rem);

                li2.appendChild(newContent2);
                ul2.appendChild(li2);

                // level 3
                const ul3 = document.createElement("ul");
                if (child2_rem.children != undefined) {
                  for (let n3 = 0; n3 < child2_rem.children.length; n3++) {
                    const li3 = document.createElement("li");
                    let id3 = id2 + "_3-" + n3;
                    li3.id = id3;

                    line_mouse_events(li3);

                    const child3_rem = child2_rem.children[n3];

                    let input3;
                    if (hasTimestamp(child3_rem)) {
                      input3 = document.createElement("input");
                      input3.type = "button";

                      $(input3).addClass("me-2");
                      input3.style.background =
                        color_3[(i - 1) % color_3.length];

                      if (child3_rem.name.length >= 1) {
                        input3.value = child3_rem.name[0].split(" ")[0];
                      }

                      $(input3).on("click", function () {
                        just_clicked = true;
                        $("html, body").animate(
                          {
                            scrollTop: $(this).offset().top,
                          },
                          100
                        );

                        const clock = $(this).val();
                        player.currentTime = formatedTimeToDuration(clock);
                      });

                      $(input3).on("mouseenter", function () {
                        $(this).css(
                          "background",
                          color_3_hover[(i - 1) % color_3_hover.length]
                        );
                      });

                      $(input3).on("mouseleave", function () {
                        $(this).css(
                          "background",
                          color_3[(i - 1) % color_3.length]
                        );
                      });
                    }

                    if (hasTimestamp(child3_rem)) li3.appendChild(input3);

                    const newContent3 = createNewContent(child3_rem);

                    li3.appendChild(newContent3);
                    ul3.appendChild(li3);

                    // level 4
                    const ul4 = document.createElement("ul");
                    if (child3_rem.children != undefined) {
                      for (let n4 = 0; n4 < child3_rem.children.length; n4++) {
                        const li4 = document.createElement("li");
                        let id4 = id3 + "_4-" + n4;
                        li4.id = id4;

                        line_mouse_events(li4);

                        const child4_rem = child3_rem.children[n4];

                        let input4;
                        if (hasTimestamp(child4_rem)) {
                          input4 = document.createElement("input");
                          input4.type = "button";

                          $(input4).addClass("me-2");
                          input4.style.background =
                            color_3[(i - 1) % color_3.length];

                          if (child4_rem.name.length >= 1) {
                            input4.value = child4_rem.name[0].split(" ")[0];
                          }

                          $(input4).on("click", function () {
                            just_clicked = true;
                            $("html, body").animate(
                              {
                                scrollTop: $(this).offset().top,
                              },
                              100
                            );

                            var clock = $(this).val();
                            player.currentTime = formatedTimeToDuration(clock);
                          });

                          $(input4).on("mouseenter", function () {
                            $(this).css(
                              "background",
                              color_4_hover[(i - 1) % color_4_hover.length]
                            );
                          });

                          $(input4).on("mouseleave", function () {
                            $(this).css(
                              "background",
                              color_4[(i - 1) % color_4.length]
                            );
                          });
                        }

                        if (hasTimestamp(child4_rem)) li4.appendChild(input4);

                        const newContent4 = createNewContent(child4_rem);

                        li4.appendChild(newContent4);
                        ul4.appendChild(li4);

                        // level 5
                        const ul5 = document.createElement("ul");
                        if (child4_rem.children != undefined) {
                          for (
                            let n5 = 0;
                            n5 < child4_rem.children.length;
                            n5++
                          ) {
                            const li5 = document.createElement("li");
                            let id5 = id4 + "_5-" + n5;
                            li5.id = id5;

                            line_mouse_events(li5);

                            $(li5).css("cursor", "auto");

                            const child5_rem = child4_rem.children[n5];

                            let input5;
                            if (hasTimestamp(child5_rem)) {
                              input5 = document.createElement("input");
                              input5.type = "button";

                              $(input5).addClass("me-2");
                              input5.style.background =
                                color_5[(i - 1) % color_5.length];

                              if (child5_rem.name.length >= 1) {
                                input5.value = child5_rem.name[0].split(" ")[0];
                              }

                              $(input5).on("click", function () {
                                just_clicked = true;
                                $("html, body").animate(
                                  {
                                    scrollTop: $(this).offset().top,
                                  },
                                  100
                                );

                                const clock = $(this).val();
                                player.currentTime =
                                  formatedTimeToDuration(clock);
                              });

                              $(input5).on("mouseenter", function () {
                                $(this).css(
                                  "background",
                                  color_5_hover[(i - 1) % color_5_hover.length]
                                );
                              });

                              $(input5).on("mouseleave", function () {
                                $(this).css(
                                  "background",
                                  color_5[(i - 1) % color_5.length]
                                );
                              });
                            }

                            if (hasTimestamp(child5_rem))
                              li5.appendChild(input5);

                            const newContent5 = createNewContent(child5_rem);

                            li5.appendChild(newContent5);
                            ul5.appendChild(li5);
                          }
                        }
                        li4.appendChild(ul5);
                      }
                    }
                    li3.appendChild(ul4);
                  }
                }
                li2.appendChild(ul3);
              }
            }
            li1.appendChild(ul2);
          }
          li0.appendChild(ul1);
        }
      }
    }

    div.appendChild(child_list);

    create_chapter();

    // last tasks before the end

    // inputs
    for (let i = 1; i < rem_tree.length; i++) {
      $("input#" + i).attr("class", "me-2 ");
    }

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
      change_line(current_chapter);
    }

    // LaTeX
    renderLatex();
  }

  async function update_timeline(position, time, text) {
    delay = Number(document.getElementById("delayInput").value);
    if (no_delay) delay = 0;

    const div = document.getElementById("note");

    // ul level 0

    let read_ul = div.getElementsByTagName("ul");
    let ul0 = read_ul.item(0);

    if (ul0 == null) {
      ul0 = document.createElement("ul");
      ul0.id = "tree";
      div.appendChild(ul0);
    } else {
      ul0.id = "tree";
    }

    // update the current note

    const li0 = document.createElement("li");
    li0.id = "#" + "_0-" + position;

    line_mouse_events(li0);

    const input0 = document.createElement("input");
    input0.type = "button";
    input0.id = position;

    input0.value = durationToFormatedTime(time);

    $(input0).on("click", function () {
      just_clicked = true;
      $("html, body").animate(
        {
          scrollTop: $("#" + input0.id).offset().top,
        },
        100
      );
      var clock = $("input#" + position).val();
      player.currentTime = formatedTimeToDuration(clock);
    });

    $(input0).addClass("me-2");
    input0.style.background = color_0[(position - 1) % color_0.length];

    $(input0).on("mouseenter", function () {
      $(this).css(
        "background",
        color_0_hover[(position - 1) % color_0_hover.length]
      );
    });

    $(input0).on("mouseleave", function () {
      $(this).css("background", color_0[(position - 1) % color_0.length]);
    });

    var newContent0 = document.createTextNode("" + text);

    li0.appendChild(input0);
    li0.appendChild(newContent0);

    let ul1 = document.createElement("ul");
    li0.appendChild(ul1);

    if (position === 1) {
      $(ul0).prepend(li0);
    } else {
      $("#tree > li:nth-child( " + (position - 1) + " )").after(li0);
    }

    // updates the next notes

    // level 0

    for (let i = 1; i <= rem_tree.length; i++) {
      let line0 = "#tree > li:nth-child(" + i + ")";
      let id0 = "_0-" + i;
      let input0 = line0 + " > input";

      $(line0).attr("id", id0);

      $(input0).attr("id", i);

      $(input0).css("background", color_0[(i - 1) % color_0.length]);

      $(input0).on("mouseenter", function () {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(input0).on("mouseleave", function () {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });

      $(input0).on("click", function () {
        just_clicked = true;
        $("html, body").animate(
          {
            scrollTop: $("#" + i).offset().top,
          },
          100
        );

        var clock = $(this).val();
        player.currentTime = formatedTimeToDuration(clock);
      });

      // level 1

      let len_j = $(line0 + " > ul li").length;
      for (let j = 1; j <= len_j; j++) {
        let line1 = line0 + "> ul > li:nth-child(" + j + ")";
        let id1 = id0 + "_1-" + (j - 1);
        let input1 = line1 + " > input";

        $(line1).attr("id", id1);

        line_mouse_events(line1);

        $(input1).css("background", color_1[(i - 1) % color_1.length]);

        $(input1).on("mouseenter", function () {
          $(this).css(
            "background",
            color_1_hover[(i - 1) % color_1_hover.length]
          );
        });

        $(input1).on("mouseleave", function () {
          $(this).css("background", color_1[(i - 1) % color_1.length]);
        });

        $(input1).on("click", function () {
          var clock = $(this).val();
          player.currentTime = formatedTimeToDuration(clock);
        });

        // level 2

        let len_k = $(line1 + " > ul li").length;
        for (let k = 1; k <= len_k; k++) {
          let line2 = line1 + " > ul > li:nth-child(" + k + ")";
          let id2 = id1 + "_2-" + (k - 1);
          let input2 = line2 + " > input";

          $(line2).attr("id", id2);

          line_mouse_events(line2);

          $(input2).css("background", color_2[(i - 1) % color_2.length]);
          $(input2).on("mouseenter", function () {
            $(this).css(
              "background",
              color_2_hover[(i - 1) % color_2_hover.length]
            );
          });
          $(input2).on("mouseleave", function () {
            $(this).css("background", color_2[(i - 1) % color_2.length]);
          });

          // level 3

          let len_l = $(line2 + " > ul li").length;
          for (let l = 1; l <= len_l; l++) {
            let line3 = line2 + " > ul > li:nth-child(" + l + ")";
            let id3 = id2 + "_3-" + (l - 1);
            let input3 = line3 + " > input";

            $(line3).attr("id", id3);

            line_mouse_events(line3);

            $(input3).css("background", color_3[(i - 1) % color_3.length]);

            $(input3).on("mouseenter", function () {
              $(this).css(
                "background",
                color_3_hover[(i - 1) % color_3_hover.length]
              );
            });

            $(input3).on("mouseleave", function () {
              $(this).css("background", color_3[(i - 1) % color_3.length]);
            });

            // level 4

            let len_m = $(line3 + " > ul li").length;
            for (let m = 1; m <= len_m; m++) {
              let line4 = line3 + "> ul > li:nth-child(" + m + ")";
              let id4 = id3 + "_4-" + (m - 1);
              let input4 = line4 + " > input";

              $(line4).attr("id", id4);
              line_mouse_events(line4);

              $(input4).css("background", color_4[(i - 1) % color_4.length]);
              $(input4).on("mouseenter", function () {
                $(this).css(
                  "background",
                  color_4_hover[(i - 1) % color_4_hover.length]
                );
              });
              $(input4).on("mouseleave", function () {
                $(this).css("background", color_4[(i - 1) % color_4.length]);
              });

              // level 5

              let len_n = $(line4 + " > ul li").length;
              for (let n = 1; n <= len_n; n++) {
                let line5 = line4 + " > ul > li:nth-child(" + n + ")";
                let id5 = id4 + "_5-" + (n - 1);
                let input5 = line5 + " > input";

                $(line5).attr("id", id5);
                $(line5).css("cursor", "auto");

                line_mouse_events(line5);

                $(input5).css("background", color_5[(i - 1) % color_5.length]);

                $(input5).on("mouseenter", function () {
                  $(this).css(
                    "background",
                    color_5_hover[(i - 1) % color_5_hover.length]
                  );
                });

                $(input5).on("mouseleave", function () {
                  $(this).css("background", color_5[(i - 1) % color_5.length]);
                });
              }
            }
          }
        }
      }
    }

    update_chapter(position);

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
      change_line(current_chapter);
    }

    // LaTeX
    renderLatex();
  }

  function update_note_child(chapterId, tree_position, time, text) {
    delay = Number(document.getElementById("delayInput").value);
    if (no_delay) delay = 0;

    if (chapterId == undefined) chapterId = current_chapter;

    const li1 = document.createElement("li");
    switch (last_level) {
      case 1:
        li1.id = "_0-" + chapterId + "_1-" + tree_position[0];
        break;
      case 2:
        li1.id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1];
        break;
      case 3:
        li1.id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          tree_position[2];
        break;
      case 4:
        li1.id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          tree_position[2] +
          "_4-" +
          tree_position[3];
        break;
      case 5:
        li1.id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          tree_position[2] +
          "_4-" +
          tree_position[3] +
          "_5-" +
          tree_position[4];
        break;
    }

    if (last_level == 5) $(li1).css("cursor", "auto");

    line_mouse_events(li1);

    // ctrl + enter only
    if (time != undefined) {
      let color, color_hover;
      switch (last_level) {
        case 1:
          color = color_1[(chapterId - 1) % color_1.length];
          color_hover = color_1_hover[(chapterId - 1) % color_1_hover.length];
          break;
        case 2:
          color = color_2[(chapterId - 1) % color_2.length];
          color_hover = color_2_hover[(chapterId - 1) % color_2_hover.length];
          break;
        case 3:
          color = color_3[(chapterId - 1) % color_3.length];
          color_hover = color_3_hover[(chapterId - 1) % color_3_hover.length];
          break;
        case 4:
          color = color_4[(chapterId - 1) % color_4.length];
          color_hover = color_4_hover[(chapterId - 1) % color_4_hover.length];
          break;
        case 5:
          color = color_5[(chapterId - 1) % color_5.length];
          color_hover = color_5_hover[(chapterId - 1) % color_5_hover.length];
          break;
      }

      const input1 = document.createElement("input");
      input1.type = "button";
      input1.value = durationToFormatedTime(time);

      $(input1).on("click", function () {
        just_clicked = true;
        $("html, body").animate(
          {
            scrollTop: $(this).offset().top,
          },
          100
        );

        var clock = input1.value;
        player.currentTime = formatedTimeToDuration(clock);
      });

      input1.style.background = color;

      $(input1).on("mouseenter", function () {
        $(this).css("background", color_hover);
      });

      $(input1).on("mouseleave", function () {
        $(this).css("background", color);
      });
      $(input1).addClass("me-2");
      li1.appendChild(input1);
    }

    var newContent1 = document.createTextNode("" + text);

    li1.appendChild(newContent1);

    // ctrl + enter or ctrl + shift + enter
    let referenceNode;
    if (time != undefined) {
      referenceNode = select_node(chapterId, false);

      // first and unique
      if (
        tree_position[tree_position.length - 1] == 0 &&
        referenceNode.children.length == 0
      ) {
        referenceNode.appendChild(li1);

        update_node_id(referenceNode, chapterId, false);

        // first
      } else if (
        tree_position[tree_position.length - 1] == 0 &&
        referenceNode.children.length > 0
      ) {
        referenceNode.prepend(li1);

        update_node_id(referenceNode, chapterId, false);

        // after
      } else {
        referenceNode = select_node(chapterId, true);

        if (referenceNode != null) {
          referenceNode.parentNode.insertBefore(li1, referenceNode.nextSibling);
          update_node_id(referenceNode.parentNode, chapterId, true);
        } else {
          referenceNode = select_node(chapterId, false);
          referenceNode.appendChild(li1);
          update_node_id(referenceNode, chapterId, false);
        }
      }

      // alt + enter
    } else {
      referenceNode = select_node(chapterId, false);
      referenceNode.appendChild(li1);
      update_node_id(referenceNode, chapterId, false);
    }

    update_id();

    // dark mode
    if (dark_mode == 1) {
      $("li").css("color", "#c0bdbd");
      change_line(current_chapter);
    }

    // LaTeX
    renderLatex();
  }

  function select_node(chapterId, after) {
    const node_level = after ? last_level + 1 : last_level;

    let referenceNode;
    if (node_level == 1) {
      referenceNode = document.querySelector("#" + "_0-" + chapterId + " > ul");
    } else if (node_level == 2) {
      if (!after) {
        referenceNode = document.querySelector(
          "#" + "_0-" + chapterId + "_1-" + tree_position[0]
        );

        let ul = document.createElement("ul");
        referenceNode.appendChild(ul);

        referenceNode = document.querySelector(
          "#" + "_0-" + chapterId + "_1-" + tree_position[0] + " > ul"
        );
      } else {
        referenceNode = document.querySelector(
          "#" + "_0-" + chapterId + "_1-" + (tree_position[0] - 1)
        );
      }
    } else if (node_level == 3) {
      if (!after) {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1]
        );
        let ul = document.createElement("ul");
        referenceNode.appendChild(ul);
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            " > ul"
        );
      } else {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            (tree_position[1] - 1)
        );
      }
    } else if (node_level == 4) {
      if (!after) {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2]
        );
        let ul = document.createElement("ul");
        referenceNode.appendChild(ul);
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            " > ul"
        );
      } else {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            (tree_position[2] - 1)
        );
      }
    } else if (node_level == 5) {
      if (!after) {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            tree_position[3]
        );
        let ul = document.createElement("ul");
        referenceNode.appendChild(ul);
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            tree_position[3] +
            " > ul"
        );
      } else {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            (tree_position[3] - 1)
        );
      }
    } else if (node_level == 6) {
      if (!after) {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            tree_position[3] +
            "_5-" +
            tree_position[4]
        );
        let ul = document.createElement("ul");
        referenceNode.appendChild(ul);
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            tree_position[3] +
            "_5-" +
            tree_position[4] +
            " > ul"
        );
      } else {
        referenceNode = document.querySelector(
          "#" +
            "_0-" +
            chapterId +
            "_1-" +
            tree_position[0] +
            "_2-" +
            tree_position[1] +
            "_3-" +
            tree_position[2] +
            "_4-" +
            tree_position[3] +
            "_5-" +
            (tree_position[4] - 1)
        );
      }
    }

    return referenceNode;
  }

  function update_id() {
    for (let i = 1; i <= rem_tree.length; i++) {
      let line0 = "#note > ul > li:nth-child(" + i + ")";
      let id0 = "_0-" + i;
      $(line0).attr("id", id0);

      // level 1

      let len_j = $(line0 + " > ul li").length;
      for (let j = 1; j <= len_j; j++) {
        let line1 = line0 + "> ul > li:nth-child(" + j + ")";
        let id1 = id0 + "_1-" + (j - 1);
        $(line1).attr("id", id1);

        // level 2

        let len_k = $(line1 + " > ul li").length;
        for (let k = 1; k <= len_k; k++) {
          let line2 = line1 + " > ul > li:nth-child(" + k + ")";
          let id2 = id1 + "_2-" + (k - 1);
          $(line2).attr("id", id2);

          // level 3

          let len_l = $(line2 + " > ul li").length;
          for (let l = 1; l <= len_l; l++) {
            let line3 = line2 + " > ul > li:nth-child(" + l + ")";
            let id3 = id2 + "_3-" + (l - 1);
            $(line3).attr("id", id3);

            // level 4

            let len_m = $(line3 + " > ul li").length;
            for (let m = 1; m <= len_m; m++) {
              let line4 = line3 + "> ul > li:nth-child(" + m + ")";
              let id4 = id3 + "_4-" + (m - 1);
              $(line4).attr("id", id4);

              // level 5

              let len_n = $(line4 + " > ul li").length;
              for (let n = 1; n <= len_n; n++) {
                let line5 = line4 + " > ul > li:nth-child(" + n + ")";
                let id5 = id4 + "_5-" + (n - 1);
                $(line5).attr("id", id5);
              }
            }
          }
        }
      }
    }
  }

  function update_node_id(referenceNode, chapterId) {
    const node_level = last_level;
    let children = referenceNode.children;

    for (let i = 0; i < children.length; i++) {
      if (last_level == 1) {
        children[i].id = "_0-" + chapterId + "_1-" + i;
      } else if (last_level == 2) {
        children[i].id =
          "_0-" + chapterId + "_1-" + tree_position[0] + "_2-" + i;
      } else if (last_level == 3) {
        children[i].id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          i;
      } else if (last_level == 4) {
        children[i].id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          tree_position[2] +
          "_4-" +
          i;
      } else if (last_level == 5) {
        children[i].id =
          "_0-" +
          chapterId +
          "_1-" +
          tree_position[0] +
          "_2-" +
          tree_position[1] +
          "_3-" +
          tree_position[2] +
          "_4-" +
          tree_position[3] +
          "_5-" +
          i;
      }
    }
  }

  async function create_chapter() {
    const player_duration = player.duration;
    const player_width = player.width;

    $('[data-toggle="tooltip"]').tooltip("hide");

    $("#line").html("");

    line_div.innerHTML = "";

    chapter = [];

    if (rem_tree.length < 2) return;

    for (let i = 1; i <= rem_tree.length; i++) {
      if (i > 1) var previous_rem = rem;

      if (i < rem_tree.length) var rem = rem_tree[i];

      if (rem.name[0].split(" ").length >= 1) {
        chapter.push(document.createElement("div"));

        const clock = rem.name[0].split(" ")[0];

        chapter[chapter.length - 1].id = "c" + (i - 1);

        chapter[chapter.length - 1].delay = formatedTimeToDuration(clock);

        $(chapter[chapter.length - 1]).attr("class", "mt-2 chapter");

        if (i == 2)
          $(chapter[chapter.length - 1]).attr(
            "class",
            "rounded-start mt-2 chapter"
          );

        if (i > 1) {
          chapter[chapter.length - 1].start = chapter[chapter.length - 2].delay;

          chapter[chapter.length - 1].rem = previous_rem.name[0]
            .split(" ")
            .slice(1)
            .join(" ");

          chapter[chapter.length - 1].style.left =
            (chapter[chapter.length - 2].delay / player_duration) *
              (player_width - 35) +
            25 +
            "px";

          chapter[chapter.length - 1].style.width =
            (chapter[chapter.length - 1].delay / player_duration) *
              (player_width - 35) -
            (chapter[chapter.length - 2].delay / player_duration) *
              (player_width - 35) +
            2 +
            "px";

          chapter[chapter.length - 1].num = i;

          // last chapter
          if (i == rem_tree.length) {
            $(chapter[chapter.length - 1]).attr(
              "class",
              "rounded-end mt-2 chapter"
            );

            chapter[chapter.length - 1].style.width =
              player_width -
              player_margin -
              (chapter[chapter.length - 2].delay / player_duration) *
                (player_width - 35) +
              0 +
              "px";
          }

          // one chapter only
          if (rem_tree.length == 2)
            $(chapter[chapter.length - 1]).attr(
              "class",
              "rounded-start rounded-end mt-2 chapter"
            );

          // tooltip
          $(chapter[chapter.length - 1]).attr("data-toggle", "tooltip");

          const previous_rem_array = previous_rem.name[0].split(" ");
          if (previous_rem_array.length >= 1) {
            $(chapter[chapter.length - 1]).attr(
              "title",
              previous_rem_array[0] +
                "\n" +
                previous_rem_array.slice(1).join(" ")
            );
          } else {
            $(chapter[chapter.length - 1]).attr(
              "title",
              previous_rem.name[0].split(" ")[0]
            );
          }

          chapter[chapter.length - 1].style.background =
            color_0[(i - 2) % color_0.length];

          $(chapter[chapter.length - 1]).click(function () {
            current_chapter = i - 1;
            $("html, body").animate(
              {
                scrollTop: $("#" + (i - 1)).offset().top,
              },
              100
            );

            player.currentTime = this.start;

            change_line(current_chapter);
          });

          $(chapter[chapter.length - 1]).on("mouseenter", function () {
            $(this).css(
              "background",
              color_0_hover[(i - 2) % color_0_hover.length]
            );
          });

          $(chapter[chapter.length - 1]).on("mouseleave", function () {
            $(this).css("background", color_0[(i - 2) % color_0.length]);
          });

          if (i > 0) line_div.appendChild(chapter[chapter.length - 1]);
        }
      }
    }

    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  async function update_chapter(position) {
    const player_duration = player.duration;
    const player_width = player.width;

    // unique
    if (rem_tree.length == 2) {
      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = rem_tree[position];

      const clock = rem.name[0].split(" ")[0];

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        25 +
        "px";

      temp_chapter.start = temp_chapter.delay;

      temp_chapter.style.width =
        player_width -
        player_margin -
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        10 +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[0].split(" ").slice(1).join(" ");

      $(temp_chapter).click(function () {
        $('[data-toggle="tooltip"]').on("click", function () {
          $(this).tooltip("hide");
        });
        current_chapter = position;

        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top,
          },
          100
        );

        player.currentTime = this.delay;

        change_line(current_chapter);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      var referenceNode = document.querySelector("#" + "line");

      referenceNode.appendChild(temp_chapter);
      // first
    } else if (position == 1) {
      var referenceNode = document.querySelector("#" + "c" + position);
      var next_chapter = document.querySelector("#" + "c" + position);

      var temp_chapter = document.createElement("div");

      var rem = rem_tree[position];

      const clock = rem.name[0].split(" ")[0];

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        25 +
        "px";

      temp_chapter.start = temp_chapter.delay;

      temp_chapter.style.width =
        (next_chapter.delay / player_duration) * (player_width - 35) -
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[0].split(" ").slice(1).join(" ");

      $(temp_chapter).click(function () {
        $('[data-toggle="tooltip"]').on("click", function () {
          $(this).tooltip("hide");
        });

        current_chapter = position;

        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top,
          },
          100
        );

        player.currentTime = this.delay;

        change_line(current_chapter);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.insertBefore(temp_chapter, referenceNode);

      //insert in middle
    } else if (position < rem_tree.length - 1) {
      var referenceNode = document.querySelector("#" + "c" + (position - 1));

      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = rem_tree[position];

      const clock = rem.name[0].split(" ")[0];

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        25 +
        "px";

      var previousNode = document.querySelector("#" + "c" + (position - 1));
      previousNode.style.width =
        temp_chapter.style.left.slice(0, -2) -
        previousNode.style.left.slice(0, -2) +
        "px";

      temp_chapter.start = temp_chapter.delay;

      var next_chapter = document.querySelector("#" + "c" + position);

      temp_chapter.style.width =
        (next_chapter.delay / player_duration) * (player_width - 35) -
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[0].split(" ").slice(1).join(" ");

      $(temp_chapter).click(function () {
        $('[data-toggle="tooltip"]').on("click", function () {
          $(this).tooltip("hide");
        });

        current_chapter = position;
        just_clicked = true;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top,
          },
          100
        );

        player.currentTime = this.delay;

        change_line(current_chapter);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.insertBefore(
        temp_chapter,
        referenceNode.nextSibling
      );
      //insert last
    } else {
      var referenceNode = document.querySelector("#" + "c" + (position - 1));

      var temp_chapter = document.createElement("div");
      temp_chapter.id = "c" + position;

      var rem = rem_tree[position];

      const clock = rem.name[0].split(" ")[0];

      temp_chapter.delay = formatedTimeToDuration(clock);

      temp_chapter.style.left =
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        25 +
        "px";

      var previousNode = document.querySelector("#" + "c" + (position - 1));
      previousNode.style.width =
        temp_chapter.style.left.slice(0, -2) -
        previousNode.style.left.slice(0, -2) +
        "px";

      temp_chapter.start = temp_chapter.delay;

      var next_chapter = document.querySelector("#" + "c" + position);

      temp_chapter.style.width =
        player_width -
        player_margin -
        (temp_chapter.delay / player_duration) * (player_width - 35) +
        0 +
        "px";

      temp_chapter.style.background = color_0[(position - 2) % color_0.length];

      temp_chapter.rem = rem.name[0].split(" ").slice(1).join(" ");

      $(temp_chapter).click(function () {
        $('[data-toggle="tooltip"]').on("click", function () {
          $(this).tooltip("hide");
        });

        current_chapter = position;

        just_clicked = true;
        $("html, body").animate(
          {
            scrollTop: $("#" + position).offset().top,
          },
          100
        );

        player.currentTime = this.delay;

        change_line(current_chapter);
      });

      $(temp_chapter).attr("data-toggle", "tooltip");
      $(temp_chapter).attr(
        "title",
        durationToFormatedTime(temp_chapter.delay) + "\n" + temp_chapter.rem
      );

      referenceNode.parentNode.appendChild(temp_chapter);
    }

    // update chapter id before
    var referenceNode = document.querySelector("#" + "line");
    let children = referenceNode.children;
    for (let i = 0; i < children.length; i++) {
      children[i].id = "c" + (i + 1);
    }

    // update style
    for (let i = 1; i < rem_tree.length; i++) {
      var referenceNode = document.querySelector("#" + "c" + i);

      $(referenceNode).removeClass();

      if (rem_tree.length == 2) {
        $(referenceNode).addClass("rounded-start rounded-end mt-2 chapter");
      } else if (i == rem_tree.length - 1) {
        $(referenceNode).addClass("rounded-end mt-2 chapter");
      } else if (i == 1) {
        $(referenceNode).addClass("rounded-start mt-2 chapter");
      } else {
        $(referenceNode).addClass("mt-2 chapter");
      }

      referenceNode.style.background = color_0[(i - 1) % color_0.length];

      $(referenceNode).on("mouseenter", function () {
        $(this).css(
          "background",
          color_0_hover[(i - 1) % color_0_hover.length]
        );
      });

      $(referenceNode).on("mouseleave", function () {
        $(this).css("background", color_0[(i - 1) % color_0.length]);
      });
    }

    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  async function create_rem_tree() {
    plugin_rem = await RemNoteAPI.v0.get(pluginId);

    rem_tree = [];

    if (plugin_rem.children == undefined) return;

    for (let i = 0; i < plugin_rem.children.length; i++) {
      let rem = await RemNoteAPI.v0.get(plugin_rem.children[i]);

      if (rem.children == undefined) {
        rem.children = new Array();
      }

      for (let j = 0; j < rem.children.length; j++) {
        rem.children[j] = await RemNoteAPI.v0.get(rem.children[j]);

        if (rem.children[j].children == undefined) {
          rem.children[j].children = new Array();
        }

        for (let k = 0; k < rem.children[j].children.length; k++) {
          rem.children[j].children[k] = await RemNoteAPI.v0.get(
            rem.children[j].children[k]
          );

          if (rem.children[j].children[k].children == undefined) {
            rem.children[j].children[k].children = new Array();
          }

          for (
            let l = 0;
            l < rem.children[j].children[k].children.length;
            l++
          ) {
            rem.children[j].children[k].children[l] = await RemNoteAPI.v0.get(
              rem.children[j].children[k].children[l]
            );

            if (rem.children[j].children[k].children[l].children == undefined) {
              rem.children[j].children[k].children[l].children = new Array();
            }

            for (
              let m = 0;
              m < rem.children[j].children[k].children[l].children.length;
              m++
            ) {
              rem.children[j].children[k].children[l].children[m] =
                await RemNoteAPI.v0.get(
                  rem.children[j].children[k].children[l].children[m]
                );

              if (
                rem.children[j].children[k].children[l].children[m].children ==
                undefined
              ) {
                rem.children[j].children[k].children[l].children[m].children =
                  new Array();
              }

              for (
                let n = 0;
                n <
                rem.children[j].children[k].children[l].children[m].children
                  .length;
                n++
              ) {
                rem.children[j].children[k].children[l].children[m].children[
                  n
                ] = await RemNoteAPI.v0.get(
                  rem.children[j].children[k].children[l].children[m].children[
                    n
                  ]
                );

                if (
                  rem.children[j].children[k].children[l].children[m].children[
                    n
                  ].children == undefined
                ) {
                  rem.children[j].children[k].children[l].children[m].children[
                    n
                  ].children = new Array();
                }
              }
            }
          }
        }
      }
      rem_tree.push(rem);
    }
    return await true;
  }

  function change_line(chapter) {
    create_tree_position();

    let referenceNode;
    let query = "";
    if (level >= 1) query += "#_0-" + chapter;
    if (writing_rem) {
      if (level >= 2) query += "_1-" + tree_position[0];
      if (level >= 3) query += "_2-" + tree_position[1];
      if (level >= 4) query += "_3-" + tree_position[2];
      if (level >= 5) query += "_4-" + tree_position[3];
    } else {
      if (level >= 2) query += "_1-" + last_tree_position[0];
      if (level >= 3) query += "_2-" + last_tree_position[1];
      if (level >= 4) query += "_3-" + last_tree_position[2];
      if (level >= 5) query += "_4-" + last_tree_position[3];
    }

    referenceNode = document.querySelector(query);

    if (referenceNode != undefined) {
      if (last_referenceNode != undefined) {
        if (
          dark_mode == 0 &&
          $(last_referenceNode).css("color") != "rgb(32, 32, 32)"
        ) {
          $(last_referenceNode).css("color", "#202020");
        } else if (
          dark_mode == 1 &&
          $(last_referenceNode).css("color") != "rgb(192, 189, 189)"
        ) {
          $(last_referenceNode).css("color", "#c0bdbd");
        }
      }

      $(referenceNode).css("color", "#102eec");
      last_referenceNode = referenceNode;
    }
  }

  function create_tree_position() {
    if (level < 2 || level > 5) return;

    if (previous_chapter != current_chapter || current_chapter == 0) return;

    let chapter_note = current_chapter;
    let time = player.currentTime - delay;

    last_tree_position = [];
    let line_index = [];
    line_index.length = 4;

    let current_rem;

    switch (level) {
      case 2:
        current_rem = rem_tree[chapter_note].children;
        line_max_position1 = current_rem.length - 1;
        line_index[0] =
          line_position1 < line_max_position1
            ? line_position1
            : current_rem.length - 1;
        last_tree_position.push(line_index[0]);
        break;
      case 3:
        current_rem = rem_tree[chapter_note].children;

        line_max_position1 = current_rem.length - 1;
        line_index[0] =
          line_position1 < line_max_position1
            ? line_position1
            : current_rem.length - 1;
        last_tree_position.push(line_index[0]);

        current_rem = rem_tree[chapter_note].children[line_index[0]].children;

        line_max_position2 = current_rem.length - 1;
        line_index[1] =
          line_position2 < line_max_position2
            ? line_position2
            : current_rem.length - 1;
        last_tree_position.push(line_index[1]);
        break;
      case 4:
        current_rem = rem_tree[chapter_note].children;
        line_max_position1 = current_rem.length - 1;
        line_index[0] =
          line_position1 < line_max_position1
            ? line_position1
            : current_rem.length - 1;
        last_tree_position.push(line_index[0]);

        current_rem = rem_tree[chapter_note].children[line_index[0]].children;
        line_max_position2 = current_rem.length - 1;
        line_index[1] =
          line_position2 < line_max_position2
            ? line_position2
            : current_rem.length - 1;
        last_tree_position.push(line_index[1]);

        current_rem =
          rem_tree[chapter_note].children[line_index[0]].children[line_index[1]]
            .children;
        line_max_position3 = current_rem.length - 1;
        line_index[2] =
          line_position3 < line_max_position3
            ? line_position3
            : current_rem.length - 1;
        last_tree_position.push(line_index[2]);
        break;
      case 5:
        current_rem = rem_tree[chapter_note].children;
        line_max_position1 = current_rem.length - 1;
        line_index[0] =
          line_position1 < current_rem.length - 1
            ? line_position1
            : current_rem.length - 1;
        last_tree_position.push(line_index[0]);

        current_rem = rem_tree[chapter_note].children[line_index[0]].children;
        line_max_position2 = current_rem.length - 1;
        line_index[1] =
          line_position2 < line_max_position2
            ? line_position2
            : current_rem.length - 1;
        last_tree_position.push(line_index[1]);

        current_rem =
          rem_tree[chapter_note].children[line_index[0]].children[line_index[1]]
            .children;
        line_max_position3 = current_rem.length - 1;
        line_index[2] =
          line_position3 < line_max_position3
            ? line_position3
            : current_rem.length - 1;
        last_tree_position.push(line_index[2]);

        current_rem =
          rem_tree[chapter_note].children[line_index[0]].children[line_index[1]]
            .children[line_index[2]].children;
        line_max_position4 = current_rem.length - 1;
        line_index[3] =
          line_position4 < line_max_position4
            ? line_position4
            : current_rem.length - 1;
        last_tree_position.push(line_index[3]);
        break;
      default:
    }

    if (!writing_rem) tree_position = last_tree_position;
  }

  function update_lines_position() {
    last_line_position1 = line_position1;
    last_line_position2 = line_position2;
    last_line_position3 = line_position3;
    last_line_position4 = line_position4;
    last_line_max_position1 = line_max_position1;
    last_line_max_position2 = line_max_position2;
    last_line_max_position3 = line_max_position3;
    last_line_max_position4 = line_max_position4;
  }

  function reset_line_position() {
    line_position1 = 0;
    line_position2 = 0;
    line_position3 = 0;
    line_position4 = 0;
  }

  async function video_jump(chapter) {
    const clock = $("#" + chapter).val();
    player.currentTime = formatedTimeToDuration(clock);
  }

  async function click_line(line) {
    const id_position = line.id;

    const chapter = parseInt(
      id_position.match(/_0-[0-9]+/g)[0].replace("_0-", "")
    );
    if (chapter != current_chapter) {
      current_chapter = chapter;
      previous_chapter = current_chapter;

      if (!just_clicked) {
        await video_jump(chapter);
      }
    }

    just_clicked = true;

    level = 1;
    const match_level1 = id_position.match(/_1-[0-9]+/g);
    if (match_level1) {
      line_position1 = parseInt(match_level1[0].replace("_1-", ""));
      level = 2;
    }
    const match_level2 = id_position.match(/_2-[0-9]+/g);
    if (match_level2) {
      line_position2 = parseInt(match_level2[0].replace("_2-", ""));
      level = 3;
    }
    const match_level3 = id_position.match(/_3-[0-9]+/g);
    if (match_level3) {
      line_position3 = parseInt(match_level3[0].replace("_3-", ""));
      level = 4;
    }
    const match_level4 = id_position.match(/_4-[0-9]+/g);
    if (match_level4) {
      line_position4 = parseInt(match_level4[0].replace("_4-", ""));
      level = 5;
    }

    change_line(chapter);

    clearTimeout(click_timeout);
    click_timeout = setTimeout(function () {
      just_clicked = false;
    }, 500);
  }

  function line_mouse_events(line) {
    $(line).on("mouseover", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (
        !$(this)
          .attr("id")
          .match(/_5-[0-9]+/g)
      ) {
        if (dark_mode == 0) {
          if ($(this).css("color") == "rgb(32, 32, 32)")
            $(this).css("color", "#00BCD4");
        } else {
          if ($(this).css("color") == "rgb(192, 189, 189)")
            $(this).css("color", "#00BCD4");
        }
      }
    });

    $(line).on("mouseout", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const is_good_color = $(this).css("color") == "rgb(0, 188, 212)";
      if (dark_mode == 0) {
        if (is_good_color) $(this).css("color", "#202020");
      } else {
        if (is_good_color) $(this).css("color", "#c0bdbd");
      }
    });

    $(line).on("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      click_line($(this)[0]);
    });
  }

  function updateTooltipTime(x) {
    document.getElementById("tooltip_time").style.left =
      event.pageX - $("#tooltip_time").width() / 2 - 10 + "px";
    document.getElementById("tooltip_time").innerHTML = durationToFormatedTime(
      x * player.duration
    );

    clearTimeout(pointer_timeout);
    document.getElementById("video_container").style.cursor = "pointer";

    if (event.pageX <= 40) {
      document.getElementById("tooltip_time").style.left = 5 + "px";
    } else if (event.pageX > $("#video_container").width() - 10) {
      document.getElementById("tooltip_time").style.left =
        $("#video_container").width() - $("#tooltip_time").width() - 4 + "px";
    } else {
      document.getElementById("tooltip_time").style.left =
        event.pageX - $("#tooltip_time").width() / 2 - 10 + "px";
    }
  }

  function updateThumbnail(x) {
    if ($("#video_player_thumb").css("visibility") == "hidden")
      $("#video_player_thumb").css("visibility", "visible");

    if (event.pageX <= 125) {
      document.getElementById("video_player_thumb").style.left = 20 + "px";
    } else if (event.pageX > $("#video_container").width() - 90) {
      document.getElementById("video_player_thumb").style.left =
        $("#video_container").width() - 160 - 20 + "px";
    } else {
      document.getElementById("video_player_thumb").style.left =
        event.pageX - $("#video_player_thumb").width() / 2 - 10 + "px";
    }

    if (
      Math.floor(x * player.duration) != last_time_player_thumb &&
      !isNaN(Math.floor(x * player.duration))
    ) {
      player_thumb.currentTime = Math.floor(x * player.duration);
      last_time_player_thumb = player_thumb.currentTime;
    }
  }

  // LaTeX

  function renderLatex() {
    renderMathInElement(document.body, {
      delimiters: [{ left: "$$", right: "$$", display: false }],
      throwOnError: false,
    });
  }

  function chainRemName(rem) {
    let text = "";
    if (hasTimestamp(rem)) text += removeTimestamp(rem);

    for (let i = hasTimestamp(rem) ? 1 : 0; i < rem.name.length; i++) {
      if (rem.name[i].text != undefined) {
        text += "$$" + rem.name[i].text + "$$";
      } else {
        text += rem.name[i];
      }
    }
    return text;
  }

  function updateLatexInline(note) {
    if (note.match(/\$\$.*\$\$/g) != null) note = note.replaceAll("$$", "$");
    return note;
  }

  // note

  function createNewContent(rem) {
    return document.createTextNode(chainRemName(rem));
  }

  function hasTimestamp(rem) {
    return (
      typeof rem.name[0] == "string" &&
      rem.name[0].match(/^(\d+:\d+:\d+)|(\d+:\d+)/) != null
    );
  }

  function removeTimestamp(rem) {
    return rem.name[0].split(" ").slice(1).join(" ");
  }
})();
