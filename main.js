const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

// index for song
let index;
// loop
let loop = true;
// mixer
let isShuffleActive = false;
// song list
const songList = [
  {
    name: "100.Yıl Marşı",
    link: "Assets/Kıraç-100.yıl FB.mp3",
    artist: "Kıraç",
    image: "Assets/fb.png",
  },
  {
    name: "Martılar",
    link: "Assets/Edis - Martılar.mp3",
    artist: "Edis",
    image: "Assets/edis.jpg",
  },
  {
    name: "Elif Dedim",
    link: "Assets/Elif Dedim.mp3",
    artist: "Unknown",
    image: "Assets/kız_kulesi.jpg",
  },
  {
    name: "Dön Bak Dünyaya",
    link: "Assets/Pinhani - Dön Bak Dünyaya.mp3",
    artist: "Pinhani",
    image: "Assets/pinhani.jpg",
  },
  {
    name: "Senden Daha Güzel",
    link: "Assets/Duman - Senden Daha Güzel.mp3",
    artist: "Duman",
    image: "Assets/Duman_Grubu.jpg",
  },
];

// Set the time format
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// Song assignment
const setSong = (arrayIndex) => {
  if (loop == true && isShuffleActive == true) {
    arrayIndex = Math.floor(Math.random() * 100) % 5;
  }
  let { name, link, artist, image } = songList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  playListContainer.classList.add("hide");
};

// play next

const nextSong = () => {
  if (loop) {
    if (index == songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    let randIndex = Math.floor(Math.random() * songList.length);
    setSong(randIndex);
  }
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

const playAudio = () => {
  audio.play();
  playButton.classList.add("hide");
  pauseButton.classList.remove("hide");
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 0.5);

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;
  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  currentProgress.style.width = progressBar * 100 + "%";
  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// Previous song
const previousSong = () => {
  if (index > 0) {
    index--;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
  playAudio();
};

// Click
nextButton.addEventListener("click", nextSong);
pauseButton.addEventListener("click", pauseAudio);
playButton.addEventListener("click", playAudio);
prevButton.addEventListener("click", previousSong);

// repeat function
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

// Shuffle function
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false;
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    isShuffleActive = true;
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

const initializePlayList = () => {
  for (let i in songList) {
    playListSongs.innerHTML += `<li class="playlistSong"
      onclick="setSong(${i})">
      <div class="playlist-image-container"> 
        <img src="${songList[i].image}"/>
      </div>
      <div class="playlist-song-details">
        <span id="playlist-song-name">
          ${songList[i].name}
        </span>
        <span id="playlist-song-artist-album">
          ${songList[i].artist}
        </span>
      </div>
      </li>`;
  }
};

// catch song ending
audio.onended = () => {
  nextSong();
};

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

// When the screen is first turned on
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlayList();
};
