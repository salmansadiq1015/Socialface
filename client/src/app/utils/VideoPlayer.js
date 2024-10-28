import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

function VideoPlayer({ url }) {
  // Ensure the videoSrc is a valid URL before rendering
  const videoSrc = url || "";

  return (
    <div>
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: videoSrc,
              provider: "youtube",
            },
          ],
          tracks: [
            {
              kind: "subtitles",
              src: "https://www.example.com/subtitles.vtt",
              srcLang: "en",
              label: "English",
              default: true,
            },
          ],
        }}
        options={{
          controls: [
            "play-large", // The large play button in the center
            "play", // Play/pause playback
            "rewind", // Rewind by the configured amount
            "fast-forward", // Fast forward by the configured amount
            "progress", // The progress bar and scrubber for playback
            "current-time", // The current time of playback
            "duration", // The duration of the video
            "mute", // Mute and unmute button
            "volume", // Volume control
            "captions", // Toggle captions
            "fullscreen", // Fullscreen button
          ],
          autoplay: false, // Automatically play the video
          muted: false, // Start muted
          loop: false, // Loop the video
          seekTime: 10, // The amount to seek when using the rewind/fast-forward buttons
        }}
      />
    </div>
  );
}

export default VideoPlayer;
