# rnhp

take notes in RemNote on an online video with the Html Player

plugin for RemNote (https://www.remnote.io/) with only read and create permissions

![](https://media.giphy.com/media/lAzqm3PRAibcCNuV5B/giphy.gif)

## Project

### me

- I get a tool to learn with Youtube videos into RemNote
- I make something that can be useful for others
- I learn Javascript, jQuery, CSS, Bootstrap

### information

- this project is like rnyt, but it reads downloadable audio/video
- the project is **still in progress**
- it uses Glitch (https://glitch.com/)
- you can't use it like rnyt, read the "How to get your link" part
- the plugin has weaknesses, read the "Warning" part

## Description

- create timestamps like chapters, add child notes with or without timestamps (6 levels max)
- review your video notes later
- jump to the timestamps with your mouse or your keyboard
- control the player with shortcuts
- set the default settings so you don't have to do your settings again
- modify your rems in RemNote

## Difference between rnyt and rnhp

- you can't create a link with a timestamp, it writes text instead (example: 0:10 text)
- it uses a custom Html player (not finished yet)
- you have to be careful about the file format and filesize
- you can use it for audio too

## Quickstart

### How to add the plugin?

- **Plugin Name** : rnhp (by example)
- **Plugin URL** : https://remnote-html-player.glitch.me
- **CSS Height** : 600 (by example)
- **Permissions** : Read and Create
- **Location** : Inline

### How to use the plugin?

1. copy paste your video link in RemNote
2. go into the rem
3. insert the plugin
4. wait the play icon
5. click on the video to start
6. input a delay to rewind the video when you take a note

### How to get your link

#### Online file with an extension

- get a link like `https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4`

#### Cloud storage

- Dropbox is recommended. You may use Google Drive and Onedrive. Other cloud storage were not tested and are not supported.

- On their website, select your file, then:

  - **Dropbox**: share this file > copy link

  - **Google Drive**: get link > copy link, and set "anyone with the link" for the title (optional), you are limited to 100 MB per file

  - **OneDrive**: copy the embed (iframe), create a rem, use the plugin and paste the iframe code, you can't get a title for your file

- Don't set a time limit on your link.

#### Formats

- the recommended formats are:
  - **video**: mp4, webm, mov
  - **audio**: mp3, flac, wav

- avi can't be read

#### Filesize

- a big file could raise the loading time and interrupt the playing
- the playback rate could be more limited
- sometimes the storage is slower

### How to change the default settings?

1. you can skip and use these settings later
2. go to the top-level rems
3. go into RemNote HTML Player
   - dark_mode : 0 (or 1)
   - width: 65 (% value).
   - playback_speed: 1 (0.25, 0.5, ..., 2, ..., 16)
   - delay: 0 (seconds)

## Tips

- remember at least the shortcuts to input your notes and the left/right keys to move
- you can rewind/forward while you have an empty text input to target the best time (it doesn't cancel the delay)
- enable/disable the delay with "d" if you want to make many notes in a row

## Warning

### Project

- the plugin is still in development, you could find some bugs
- the Glitch project that you added is not used for development, but the project can sometimes be updated
- a plugin could be broken after an update from RemNote, but it could be fixed by me or someone else
- the plugin's design follows the "Read and Create" permissions, at best, it can create rems among siblings

### Usage

- don't delete the "RemNote HTML Player" rem, it can break the plugin
- plugin name
  - always use the same name, but you can change the link and the height
  - if you change the name, you will need to add another plugin in RemNote to be able to use all the plugins you've used
  - if you don't want the settings, use -np in the plugin name: example rnyt -np (warning: it is like a new name)
  - use a useless name like "rnhp" to avoid noise when you search in RemNote
- the plugin can't modify the rems so that it won't correct the misplaced rems
- be careful when you edit your rems into RemNote
  - the timestamps are mandatory on the top level
  - follow the chronological order
  - the child notes with a timestamp are inserted before child notes without a timestamp
- the child notes are linked to the current chapter; you can change it into RemNote
- show one plugin at a time to avoid duplicates
- in the settings, change only the numbers and don't write units
- refresh could fix some displaying bugs
- the plugin has been tested with dozens of notes only
