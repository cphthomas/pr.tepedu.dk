(function () {
    function fmt(s) {
        if (!Number.isFinite(s) || s < 0) return "0:00";
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ":" + (sec < 10 ? "0" : "") + sec;
    }

    function initPlayer(el) {
        var audio       = el.querySelector("audio");
        var playBtn     = el.querySelector(".podcast-play");
        var seekEl      = el.querySelector(".podcast-seek");
        var timeEl      = el.querySelector(".podcast-time");
        var speedLabel  = el.querySelector(".podcast-speed-label");
        var speedDown   = el.querySelector(".podcast-speed-down");
        var speedUp     = el.querySelector(".podcast-speed-up");

        if (!audio || !playBtn || !seekEl || !timeEl || !speedLabel) return;

        /* ── state ── */
        var dragging = false;

        /* ── helpers ── */
        function dur() {
            return Number.isFinite(audio.duration) && audio.duration > 0
                ? audio.duration : 0;
        }

        function refreshTime() {
            timeEl.textContent = fmt(audio.currentTime) + " / " + fmt(dur() || undefined);
        }

        function refreshSeek() {
            if (dragging) return;
            var d = dur();
            var pct = d > 0 ? (audio.currentTime / d) * 100 : 0;
            seekEl.value = pct;
            seekEl.style.setProperty("--seek-percent", pct.toFixed(3) + "%");
        }

        function setPlaying(on) {
            playBtn.classList.toggle("is-playing", on);
            playBtn.setAttribute("aria-label", on ? "Pause" : "Afspil");
        }

        function refreshSpeed() {
            speedLabel.textContent = audio.playbackRate.toFixed(2) + "x";
        }

        /* ── seek: commit the slider value to audio.currentTime ── */
        function commitSeek() {
            var d = dur();
            if (d <= 0) return;
            var target = (Number(seekEl.value) / 100) * d;
            audio.currentTime = target;
            refreshTime();
            refreshSeek();
        }

        /* ── play / pause ── */
        playBtn.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().then(function () { setPlaying(true); }).catch(function () {});
            } else {
                audio.pause();
                setPlaying(false);
            }
        });

        /* ── seek slider ── */
        seekEl.addEventListener("mousedown",  function () { dragging = true; });
        seekEl.addEventListener("touchstart", function () { dragging = true; }, { passive: true });

        seekEl.addEventListener("input", function () {
            dragging = true;
            var d = dur();
            if (d > 0) {
                var pct = Number(seekEl.value);
                seekEl.style.setProperty("--seek-percent", pct.toFixed(3) + "%");
                timeEl.textContent = fmt((pct / 100) * d) + " / " + fmt(d);
            }
        });

        seekEl.addEventListener("change", function () {
            dragging = false;
            commitSeek();
        });

        seekEl.addEventListener("mouseup",  function () { dragging = false; commitSeek(); });
        seekEl.addEventListener("touchend", function () { dragging = false; commitSeek(); });

        /* ── speed ── */
        function changeSpeed(delta) {
            var next = Math.round((audio.playbackRate + delta) * 100) / 100;
            audio.playbackRate = Math.min(2, Math.max(0.5, next));
            refreshSpeed();
        }
        if (speedDown) speedDown.addEventListener("click", function () { changeSpeed(-0.25); });
        if (speedUp)   speedUp.addEventListener("click",   function () { changeSpeed(+0.25); });

        /* ── audio events ── */
        audio.addEventListener("timeupdate",     function () { refreshTime(); refreshSeek(); });
        audio.addEventListener("durationchange", function () { refreshTime(); refreshSeek(); });
        audio.addEventListener("loadedmetadata", function () { refreshTime(); refreshSeek(); });
        audio.addEventListener("seeked",         function () { refreshTime(); refreshSeek(); });
        audio.addEventListener("ended",          function () { setPlaying(false); refreshSeek(); refreshTime(); });
        audio.addEventListener("ratechange",     refreshSpeed);

        /* ── init ── */
        seekEl.min   = "0";
        seekEl.max   = "100";
        seekEl.step  = "0.01";
        seekEl.value = "0";
        seekEl.style.setProperty("--seek-percent", "0%");
        setPlaying(false);
        refreshSpeed();
        refreshTime();
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".podcast-inline-player").forEach(initPlayer);
    });
})();
