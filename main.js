const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOGARE_KEY = 'Predator1010'

const player = $('.player')
const cd = $(".cd");
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},

    songs: [
        {
            name: "Waiting For You",
            singer: "MONO, Onionn",
            path: "https://play.imusicvn.com/stream/Mgbb1byycZvy",
            image: "https://dvt.vn/uploads/images/2022/09/14/mono-1-1663136362.jpg"
        },
        {
            name: "Có Chơi Có Chịu",
            singer: "Karik, OnlyC",
            path: "https://play.imusicvn.com/stream/2oumKK6kwPCl",
            image:
                "https://vtv1.mediacdn.vn/thumb_w/640/2022/9/21/poster-karik-only-c-16637279213761078057270.jpeg"
        },
        {
            name: "Chuyện Đôi Ta",
            singer: "Emcee L (Da LAB), Muộii",
            path:
                "https://play.imusicvn.com/stream/Efis9AdkuaIA",
            image: "https://i.scdn.co/image/ab67616d0000b273a400211178f6d590d875f2da"
        },
        {
            name: "Anh Thèm Được Ngủ",
            singer: "Khói",
            path: "https://tainhacmienphi.biz/get/song/api/318922",
            image:
                "https://i.scdn.co/image/ab67616d0000b2730312aeebaa5e6d80a1657459"
        },
        {
            name: "Vì Anh Đâu Có Biết",
            singer: "Madihu, Vũ",
            path: "https://play.imusicvn.com/stream/8qjZjYGWp4U8",
            image:
                "https://menback.com/wp-content/uploads/2022/08/loi-bai-hat-vi-anh-dau-co-biet-lyric.jpg"
        },
        {
            name: "Đông Kiếm Em",
            singer: "Vũ",
            path:
                "https://tainhacmienphi.biz/get/song/api/4829",
            image:
                "https://i1.sndcdn.com/artworks-000145857756-irf4fe-t500x500.jpg"
        },
        {
            name: "3 1 0 7",
            singer: "W/n, Duongg, Nâu",
            path: "https://play.imusicvn.com/stream/HkDuAPT28WB5",
            image:
                "https://i.ytimg.com/vi/V5GS5ANG96M/maxresdefault.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config));

    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
        });
        playList.innerHTML = htmls.join("");
    },
    handleEvents: function () {
        const _this = this;
        //* Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        //*Xử lý phóng to thu nhỏ video
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        //*Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //* Khi bài hát được mở
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        //* Khi bài hát dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };
        //* Khi tiếng độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }

        }
        //* Xử lí khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime

        }
        //* Khi next bài hát 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            audio.play();
            _this.scrollToActiveSong()

        }//* Khi prev bài hát 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            audio.play();
            _this.scrollToActiveSong()
        }
        //* Bài hát ramdom
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }
        //* Xử lí bài hát khi hết nhạc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click()
            }
        }
        //* Xử lý khi lặp lại một bài hát
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //* Lắng nghe hành vi khi click vào PlayList
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            //* Xử lí khi click vào nhạc
            if (songNode || e.target.closest('.option')) {
                //* Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //* Xử lí khi click vào option bài hát
                if (e.target.closest('.option')) {

                }
            }
        }

    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        //* Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //*Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        //*Lắng nghe và sử lí các sự kiện (Dom Events)   
        this.handleEvents();
        //*Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()
        //*Render playlist
        this.render();
        //* Hiện thị trạng thái ban đầu của Btn repreat & ramdom
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);

    }

}
app.start()