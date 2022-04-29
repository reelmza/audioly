/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import axios from "axios";

//Imasges
import audiolyLogo from "../src/images/audioly-logo.svg";
import spotifyLogo from "../src/images/spotify-logo-long.svg";
import geniusLogo from "../src/images/genius-logo.svg";

const App = () => {
  // Displays
  const [lyricsPageVisible, setLyricsPageVisible] = useState(false);

  // Lyrics state
  const [lyrics, setLyrics] =
    useState(`No lyrics yet, you shouldn't be seeing this page, please refresh app.
`);
  const [lyricsData, setLyricsData] = useState({});

  // Home Page
  const HomePage = () => {
    // Theme States & Functions
    const [darkTheme, setDarkTheme] = useState(true);

    const toggleTheme = () => {
      document.getElementById("root").classList.toggle("dark");
      setDarkTheme(!darkTheme);
      return console.log("Theme toggler clicked");
    };

    // Search States
    // Track if search is repeated
    const [oldSearchtext, setOldSearchtext] = useState("");

    // Togle Search Form
    const [searchFormVisible, setSearchFormVisible] = useState(false);

    // Reporting Screens
    const [isReporting, setIsReporting] = useState([
      "translate(0, 100%)",
      "Song lyrics is unavailble. Try another search.",
    ]);

    const [isLoading, setIsLoading] = useState(false);

    // Array of search results
    const [searchResult, setSearchResult] = useState([
      {
        songArtist: "Eminem",
        songName: "Kamikaze",
        songHot: false,
        songID: 3930564,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",
        songKey: 23464,
        songThumbHero:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.1000x1000x1.png",
        songViews: 312345,
      },
      {
        songArtist: "Eminem",
        songName: "Fall",
        songID: 3930586,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",

        songViews: 10000,
        songKey: 49384,
      },
      {
        songArtist: "Eminem (Ft. Jessie Reyez)",
        songName: "Good Guy",
        songID: 3930557,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",
        songKey: 43384,
        songViews: 2000,
      },
      {
        songArtist: "Eminem",
        songName: "Normal",
        songID: 3930567,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",
        songKey: 43381,
        songViews: 100,
      },
      {
        songArtist: "Eminem",
        songName: "Venom",
        songID: 3930594,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",
        songKey: 43389,
        songViews: 52000,
      },
      {
        songArtist: "Eminem",
        songName: "The Ringer",
        songID: 3930546,
        songThumb:
          "https://images.genius.com/4a9ce06a1f463b0c24c98c1870d4566f.300x300x1.png",
        songKey: 13389,
        songViews: 13000,
      },
    ]);

    // Fetch search results
    const searchMusic = (e) => {
      e.preventDefault();

      const searchTerm = e.target[0].value.trim();
      const resultArray = [];

      // Check is search is repeated
      if (searchTerm === oldSearchtext) {
        console.log("Search already made");
        return setIsReporting([
          "translate(0, 0)",
          "Search is repeated, Please enter newer search.",
        ]);
      }

      // Make sure dialogs are closed
      setIsReporting([
        "translate(0, 100%)",
        "Search is repeated, Please enter newer search.",
      ]);

      setIsLoading(true);

      // Close search form after search
      setSearchFormVisible(!searchFormVisible);

      // Make search
      const options = {
        method: "GET",
        url: "https://genius-song-lyrics1.p.rapidapi.com/search",
        params: { q: searchTerm, per_page: "5", page: "1" },
        headers: {
          "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
          "X-RapidAPI-Key":
            "9cc6e574c9msh9ad07da4150c8a2p1b8cadjsnd11d1d3b47aa",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          const data = response.data.response.hits;

          data.map((item) =>
            resultArray.push({
              songArtist: item.result.artist_names,
              songName: item.result.title,
              songHot: item.result.stats.hot,
              songKey:
                item.result.lyrics_owner_id + Math.floor(Math.random() * 10),
              songID: item.result.id,
              songThumb: item.result.song_art_image_thumbnail_url,
              songThumbHero: item.result.song_art_image_url,
            })
          );

          setSearchResult(resultArray);
          setIsLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
          setIsReporting([
            "translate(0, 0)",
            "Unable to fetch lyrics, please re-check connections.",
          ]);
        });

      // Set old search term
      setOldSearchtext(searchTerm);
      console.log(searchTerm);
    };

    // Fetch Lyrics
    const fetchLyrics = (data) => {
      console.log(data.id);
      //API Call to fecth lyrics from ID
      const options = {
        method: "GET",
        url: `https://genius-song-lyrics1.p.rapidapi.com/songs/${data.id}/lyrics`,
        headers: {
          "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
          "X-RapidAPI-Key":
            "9cc6e574c9msh9ad07da4150c8a2p1b8cadjsnd11d1d3b47aa",
        },
      };
      setIsLoading(true);
      axios
        .request(options)
        .then(function (response) {
          if (response.data.meta.status !== 200) {
            setIsLoading(false);
            setIsReporting([
              "translate(0, 0)",
              "Unfortunately, this lyrics have been removed, please try another song.",
            ]);
            return console.log("Lyrics not found");
          }

          // What data to send to lyrics page
          setLyricsData({
            id: data.id,
            title: data.title,
            artist: data.artist,
            thumbnail: data.thumbnail,
          });
          let lyrics = response.data.response.lyrics.lyrics.body.html;

          setLyrics(lyrics);
          setLyricsPageVisible(!lyricsPageVisible);
          return setIsLoading(false);
        })
        .catch(function (error) {
          setIsLoading(false);
          setIsReporting([
            "translate(0, 0)",
            "Unable to fetch Lyrics, re-check your connections.",
          ]);
          console.error(error);
        });
    };

    return (
      <div className="home-page" id="home-page">
        <div className="navigation">
          {/* Theme icons */}
          {!searchFormVisible && (
            <div
              className="navigation__icon"
              onClick={() => {
                toggleTheme();
              }}
            >
              {
                <svg
                  style={{
                    transform: darkTheme
                      ? "translateY(0vmin)"
                      : "translateY(10vmin)",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-sun"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              }
              {
                <svg
                  style={{
                    transform: darkTheme
                      ? "translateY(10vmin)"
                      : "translateY(0)",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-moon"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              }
            </div>
          )}

          {/* Search Form Caller
           */}
          {!searchFormVisible && (
            <div
              style={{ background: searchFormVisible ? "red" : "" }}
              className="navigation__icon"
              onClick={() => setSearchFormVisible(!searchFormVisible)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          )}

          {/* Search from Escaper */}
          {searchFormVisible && (
            <div
              className="search-escape navigation__icon"
              onClick={() => {
                setSearchFormVisible(!searchFormVisible);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-chevron-left"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </div>
          )}

          {/* Search Form */}
          {searchFormVisible && (
            <form className="search-form" onSubmit={(e) => searchMusic(e)}>
              <input type="search" />
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          )}
        </div>

        <div className="hero">
          <div className="hero-image">
            <img src={searchResult[0].songThumbHero} alt="unset" />
            <div className="hero-image-overlay"></div>
          </div>
          <div className="hero-text">
            <h1>{searchResult[0].songArtist}</h1>
            <h6>
              {searchResult[0].songName} {searchResult[0].songHot ? "" : ""}
            </h6>
          </div>
          <button
            className="hero-play-button"
            onClick={() =>
              fetchLyrics({
                id: searchResult[0].songID,
                artist: searchResult[0].songArtist,
                title: searchResult[0].songName,
                thumbnail: searchResult[0].songThumb,
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-play"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>

        <div className="featured">
          {/* <h5 className="featured-title">
            {searchResult[0].songArtist === "21 Savage"
              ? "Featured songs"
              : "Related Results"}
          </h5> */}
          <div className="featured-tracks">
            {searchResult.slice(1, 6).map((item) => {
              return (
                <div
                  className="featured-track"
                  key={item.songKey}
                  onClick={() =>
                    fetchLyrics({
                      id: item.songID,
                      artist: item.songArtist,
                      title: item.songName,
                      thumbnail: item.songThumb,
                    })
                  }
                >
                  <div className="featured-track__image">
                    <img src={item.songThumb} alt={item.songName} />
                  </div>
                  <div className="featured-track__text">
                    <h6>{item.songName}</h6>
                    <p>{item.songArtist}</p>
                  </div>
                  <div className="featured-track__options">
                    <div className="featured-track__share">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-share-2"
                      >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    </div>
                    <div className="featured-track__views">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-eye"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span>
                        {item.songViews < 999
                          ? `${item.songViews / 1000}k`
                          : `${Math.round(item.songViews / 1000)}k`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer>
          <p>powered by:</p>
          <div className="footer-images">
            <img src={geniusLogo} alt="Genius Logo png" />
            <img src={spotifyLogo} alt="Genius Logo png" />
          </div>
        </footer>

        {isLoading && (
          <div className="loading-screen">
            <img src={audiolyLogo} alt="Audioly lOGO" />
            <p>
              Fetching <br /> Music
            </p>
          </div>
        )}
        <div
          className="report-screen"
          style={{ transform: `${isReporting[0]}` }}
        >
          <div className="report-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="68"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-alert-octagon"
            >
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{isReporting[1]}</p>
          </div>
          <button
            className="report-button"
            onClick={() => setIsReporting(["translate(0, 100%)", ""])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-arrow-left"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>BACK</span>
          </button>
        </div>
      </div>
    );
  };

  // Lyrics Page
  const Lyrics = () => {
    return (
      <div
        className="lyrics"
        dangerouslySetInnerHTML={{ __html: lyrics }}
      ></div>
    );
  };

  //Audio component
  const AudioPlayer = () => {
    const [audioURL, setAudioURL] = useState("");
    const [audioGotten, setAudioGotten] = useState(false);
    const [audioMounted, setAudioMounted] = useState([false, "paused"]);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioMute, setAudioMute] = useState(false);

    // Reporting Screens
    const [isReporting, setIsReporting] = useState([
      "translate(0, 100%)",
      "Song lyrics is unavailble. Try another search.",
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Audio progressbar Functions
    const setAudioDuration = () => {
      try {
        // Check if song is finished
        if (Math.round(currentTime) >= 100) {
          return clearInterval(countInterval);
        }

        const newTime =
          (document.getElementById("audio-file").currentTime /
            document.getElementById("audio-file").duration) *
          100;

        setCurrentTime(Math.round(newTime));
      } catch (error) {
        console.log("Audio not mounted");
      }
    };
    const countInterval = setInterval(setAudioDuration, 1000);

    const searchSongAudio = () => {
      setIsLoading(true);
      const searchTerm = `${lyricsData.artist} ${lyricsData.title}`;
      console.log(`Fetching ${searchTerm} from Spotify`);

      // Search and get the song ID
      const options = {
        method: "GET",
        url: "https://spotify23.p.rapidapi.com/search/",
        params: {
          q: searchTerm,
          type: "tracks",
          offset: "0",
          limit: "3",
          numberOfTopResults: "1",
        },
        headers: {
          "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          "X-RapidAPI-Key":
            "9cc6e574c9msh9ad07da4150c8a2p1b8cadjsnd11d1d3b47aa",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          const data = {
            id: response.data.tracks.items[0].data.id,
            playable: response.data.tracks.items[0].data.playability.playable,
            duration:
              response.data.tracks.items[0].data.duration.totalMilliseconds,
          };

          fetchSongAudio(data);
          setIsLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
          setIsReporting([
            "translate(0, 0)",
            "This song audio is locked or has been removed.",
          ]);
        });
    };

    const fetchSongAudio = (data) => {
      const options = {
        method: "GET",
        url: "https://spotify23.p.rapidapi.com/tracks/",
        params: { ids: data.id },
        headers: {
          "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          "X-RapidAPI-Key":
            "9cc6e574c9msh9ad07da4150c8a2p1b8cadjsnd11d1d3b47aa",
        },
      };
      setIsLoading(true);
      axios
        .request(options)
        .then(function (response) {
          console.log(response);
          const apiAudioUrl = response.data.tracks[0].preview_url;
          console.log(`API audio url -> ${apiAudioUrl} from api`);
          setAudioURL(apiAudioUrl);
          setAudioGotten(!audioGotten);

          setIsLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setIsLoading(false);
          setIsReporting([
            "translate(0, 0)",
            "This song audio is locked or has been removed.",
          ]);
        });
    };

    const playPauseAudio = () => {
      console.log(`URL from player ${audioURL}`);

      if (audioMounted[0]) {
        if (audioMounted[1] === "playing") {
          document.getElementById("audio-file").pause();
          return setAudioMounted([true, "paused"]);
        } else {
          document.getElementById("audio-file").play();
          return setAudioMounted([true, "playing"]);
        }
      }

      document.getElementById("audio-file").play();
      return setAudioMounted([true, "playing"]);
    };

    const fwdAudio = () => {
      return (document.getElementById("audio-file").currentTime =
        currentTime + 0.2);
    };

    const muteAudio = () => {
      if (audioMute) {
        setAudioMute(!audioMute);
        return (document.getElementById("audio-file").muted = false);
      }
      setAudioMute(!audioMute);
      return (document.getElementById("audio-file").muted = true);
    };

    return (
      <div className="audio-player">
        {audioGotten && (
          <div className="audio-wrapper">
            <div className="audio-info">
              <div className="audio-info__image">
                <img src={lyricsData.thumbnail} alt={lyricsData.title} />
              </div>

              <div className="audio-info__texts">
                <h6>{lyricsData.title}</h6>
                <p>{lyricsData.artist} </p>
              </div>
            </div>
            <div className="audio-progress">
              <div
                className="audio-progress__inner"
                style={{ width: `${currentTime}%` }}
              ></div>
            </div>

            <div className="audio-controls">
              <div className="audio-controls__mute" onClick={() => muteAudio()}>
                {!audioMute && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-volume-2"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
                {audioMute && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-volume-x"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                )}
              </div>
              <div
                className="audio-controls__play"
                onClick={() => playPauseAudio()}
              >
                {audioMounted[1] === "paused" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-play"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
                {audioMounted[1] === "playing" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-pause"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                )}
              </div>
              <div className="audio-controls__fwd" onClick={() => fwdAudio()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-fast-forward"
                >
                  <polygon points="13 19 22 12 13 5 13 19"></polygon>
                  <polygon points="2 19 11 12 2 5 2 19"></polygon>
                </svg>
              </div>
            </div>

            <audio id="audio-file" controls>
              <source src={audioURL} />
            </audio>
          </div>
        )}

        {!audioGotten && (
          <button className="audio-overlay" onClick={() => searchSongAudio()}>
            Play Sample Audio
          </button>
        )}

        <div
          className="report-screen report-screen--lyrics"
          style={{ transform: `${isReporting[0]}` }}
        >
          <div className="report-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="68"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-alert-octagon"
            >
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{isReporting[1]}</p>
          </div>
          <button
            className="report-button"
            onClick={() => setIsReporting(["translate(0, 100%)", ""])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-arrow-left"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>BACK</span>
          </button>
        </div>

        {isLoading && (
          <div className="loading-screen loading-screen--lyrics">
            <img src={audiolyLogo} alt="Audioly lOGO" />
            <p>
              Fetching <br /> Audio Track
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {lyricsPageVisible && <Lyrics />}
      {lyricsPageVisible && <AudioPlayer />}
      {!lyricsPageVisible && <HomePage />}
    </>
  );
};

export default App;
