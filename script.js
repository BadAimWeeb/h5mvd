/*
    H5MVD v1.1

    Copyright © 2021 BadAimWeeb
*/

let $ = document.querySelector.bind(document);

let query = new URLSearchParams(location.search);

let videoTag = document.querySelector("video");
videoTag.crossOrigin = "anomynous";
videoTag.controls = false;
videoTag.addEventListener("play", () => {
    $(".play-pause span").innerHTML = "pause";
});

videoTag.addEventListener("pause", () => {
    $(".play-pause span").innerHTML = "play_arrow";
});

videoTag.addEventListener("durationchange", () => {
    $(".totaltime").innerText = formatTime(videoTag.duration, videoTag.duration);
});

videoTag.addEventListener("timeupdate", () => {
    $(".curtime").innerText = formatTime(videoTag.currentTime, videoTag.duration);
    $(".timebar-spent").style.width = ((noNaN(videoTag.currentTime) / noNaN(videoTag.duration)) * 100) + "%";
});

videoTag.addEventListener("seeking", () => {
    $(".loading").style.visibility = "visible";
});

videoTag.addEventListener("seeked", () => {
    $(".loading").style.visibility = "hidden";
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    return false;
});

function outsideClick(event, notelem) {
    notelem = [notelem];

    var clickedOut = true,
        i, len = notelem.length;
    for (i = 0; i < len; i++) {
        if (event.target == notelem[i] || notelem[i].contains(event.target)) {
            clickedOut = false;
        }
    }
    if (clickedOut) return true;
    else return false;
}

function noNaN(number) {
    return isNaN(number) ? 0 : number;
}

function formatTime(duration, maxDuration) {
    duration = noNaN(duration);
    maxDuration = noNaN(maxDuration);

    let returnString = "";

    if (maxDuration >= 3600 * 24) {
        returnString += Math.floor(duration / (3600 * 24)).toString() + ":";
    }

    if (maxDuration >= 3600) {
        returnString += (Math.floor(duration / 3600) % 24).toString().padStart(2, "0") + ":";
    }

    returnString += (Math.floor(duration / 60) % 60).toString().padStart(2, "0") + ":";
    returnString += (Math.floor(duration) % 60).toString().padStart(2, "0");

    return returnString;
}

// Volume controls
{
    function updateOnlyDiffValue(dom, value) {
        if (dom.innerHTML != value) dom.innerHTML = value;
    }

    let slider = $("#volume");
    let oldValue = 100;
    setInterval(() => {
        let gradValue = Math.round((slider.value / +slider.getAttribute('max')) * 100);
        var grad = 'linear-gradient(90deg, #9F6EEE ' + gradValue + '%, #555555 ' + (gradValue + 1) + '%)';
        slider.style.background = grad;

        videoTag.volume = slider.value / 100;
        if (slider.value !== oldValue) {
            videoTag.muted = false;
            oldValue = slider.value;
        }

        if (videoTag.muted) {
            updateOnlyDiffValue($(".volume .icon .material-icons"), "volume_off");
        } else {
            if (slider.value >= 50) {
                updateOnlyDiffValue($(".volume .icon .material-icons"), "volume_up");
            } else if (slider.value != 0) {
                updateOnlyDiffValue($(".volume .icon .material-icons"), "volume_down");
            } else {
                updateOnlyDiffValue($(".volume .icon .material-icons"), "volume_mute");
            }
        }
    });

    $(".volume").addEventListener("click", () => {
        videoTag.muted = !videoTag.muted;
    });

    document.documentElement.addEventListener("keydown", e => {
        switch (e.keyCode) {
            case 38:
                // Up
                slider.value = +slider.value + 5;
                break;
            case 40:
                // Down
                slider.value -= 5;
                break;
            case 77:
                // M
                videoTag.muted = !videoTag.muted;
                break;
        }
    });
}

// Show/hide control + Settings button
{
    let isSettingsShown = false;
    let isAnimating = false;
    window.showSettings = async function showSettings() {
        if (!isAnimating) {
            isAnimating = true;
            isSettingsShown = !isSettingsShown;
            if (!isSettingsShown) {
                $(".settingsPanel").style.visibility = "hidden";
                $(".settingsPanel").animate([{
                    opacity: 1
                },
                {
                    opacity: 0
                }
                ], 300);
                await new Promise(x => setTimeout(x, 300));
                isAnimating = false;
            } else {
                $(".settingsPanel").style.visibility = "visible";
                $(".settingsPanel").animate([{
                    opacity: 0
                },
                {
                    opacity: 1
                }
                ], 300);
                await new Promise(x => setTimeout(x, 300));
                isAnimating = false;
            }
        }
    }

    window.addEventListener('click', async (e) => {
        if (outsideClick(e, $(".settings"))) {
            if (isSettingsShown) {
                if (isAnimating) {
                    await new Promise(x => setTimeout(x, 300));
                }
                $(".settingsPanel").style.visibility = "hidden";
                $(".settingsPanel").animate([{
                    opacity: 1
                },
                {
                    opacity: 0
                }
                ], 300);
                await new Promise(x => setTimeout(x, 300));
                isAnimating = false;
                isSettingsShown = false;
            }
        }
    });

    let hideTimeout = setTimeout(hideFunc, 2500);
    let isVisible = true;

    function hideFunc() {
        if (!isSettingsShown) {
            isVisible = false;
            $(".controls").style.visibility = "hidden";
            $(".controls").animate([{
                opacity: 1
            },
            {
                opacity: 0
            }
            ], 250);
        } else {
            hideTimeout = setTimeout(hideFunc, 2500);
        }
    }
    document.addEventListener("mousemove", e => {
        try {
            clearTimeout(hideTimeout);
        } catch { }

        $(".controls").style.visibility = "visible";
        if (!isVisible) {
            $(".controls").animate([{
                opacity: 0
            },
            {
                opacity: 1
            }
            ], 250);
            isVisible = true;
        }

        hideTimeout = setTimeout(hideFunc, 2500);
    });
}

// Fullscreen button
{
    let isFullscreen = false;
    window.fullscreen = async function fullscreen() {
        if (isFullscreen) {
            isFullscreen = false;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            } else if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        } else {
            isFullscreen = true;
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullScreen) { /* Safari */
                document.documentElement.webkitRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            }
        }
    }

    $(".fullscreen").addEventListener("keypress", e => {
        if (e.keyCode === 32) window.fullscreen();
    });

    function fsc() {
        if (
            document.fullScreenElement ||
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement
        ) {
            $(".fullscreen span").innerHTML = "fullscreen_exit";
        } else {
            $(".fullscreen span").innerHTML = "fullscreen";
        }
    }
    document.addEventListener("fullscreenchange", fsc);
    document.addEventListener('mozfullscreenchange', fsc);
    document.addEventListener('MSFullscreenChange', fsc);
    document.addEventListener('webkitfullscreenchange', fsc);
}

// Picture-in-picture button
{
    window.pip = async function pip() {
        if (
            document.pictureInPictureEnabled &&
            !videoTag.disablePictureInPicture
        ) {
            if (!document.pictureInPictureElement) {
                try {
                    await videoTag.requestPictureInPicture();
                } catch {
                    alert("Video chưa sẵn sàng, chưa thể bật PiP.");
                }
            }
        } else {
            alert("Trình duyệt này không hỗ trợ tính năng Picture-in-picture.");
        }
    }

    $(".pip").addEventListener("keypress", e => {
        if (e.keyCode === 32) window.pip();
    })
}

// Play/pause button + keyboard spacebar to control play/pause
{
    window.playOrPause = async function playOrPause() {
        if (videoTag.paused) {
            try {
                await videoTag.play();
            } catch { }
        } else {
            videoTag.pause();
        }
    }

    videoTag.addEventListener("click", e => {
        if (!window.matchMedia('(hover: none)').matches)
            window.playOrPause()
    });
    document.documentElement.addEventListener("keydown", e => {
        if (e.keyCode === 32 && document.activeElement.tabIndex === -1) window.playOrPause();
    });
}

// Progress bar: seekable + keyboard buttons (control time)
{
    let state_isPlayingSeeking = false;

    let isMouseDownTimebar = false;
    let lastOffset = 0;
    $(".timebar").addEventListener("mousedown", e => {
        isMouseDownTimebar = true;
        lastOffset = e.clientX - 16;
        let maxOffset = parseInt(getComputedStyle($(".timebar")).width);
        if (lastOffset < 0) lastOffset = 0;
        if (lastOffset > maxOffset) lastOffset = maxOffset

        updateTimer(false, Math.round((lastOffset / maxOffset) * 400) / 400);

        if (!videoTag.paused) {
            videoTag.pause();
            state_isPlayingSeeking = true;
        } else {
            state_isPlayingSeeking = false;
        }
    });

    $("body").addEventListener("mousemove", e => {
        if (isMouseDownTimebar) {
            lastOffset = e.clientX - 16;
            let maxOffset = parseInt(getComputedStyle($(".timebar")).width);
            if (lastOffset < 0) lastOffset = 0;
            if (lastOffset > maxOffset) lastOffset = maxOffset

            updateTimer(false, Math.round((lastOffset / maxOffset) * 400) / 400);
        }
    });

    $("body").addEventListener("mouseup", e => {
        if (isMouseDownTimebar) {
            isMouseDownTimebar = false;
            let maxOffset = parseInt(getComputedStyle($(".timebar")).width);

            updateTimer(true, Math.round((lastOffset / maxOffset) * 400) / 400);
        }
    });

    document.documentElement.addEventListener("keydown", e => {
        let updateTime;
        switch (e.keyCode) {
            case 37:
                // Left
                updateTime = videoTag.currentTime - 5;
                if (updateTime < 0) updateTime = 0;
                if (updateTime > noNaN(videoTag.duration)) updateTime = noNaN(videoTag.duration);
                updateTimerSecond(true, updateTime);
                break;
            case 39:
                // Right
                updateTime = videoTag.currentTime + 5;
                if (updateTime < 0) updateTime = 0;
                if (updateTime > noNaN(videoTag.duration)) updateTime = noNaN(videoTag.duration);
                updateTimerSecond(true, updateTime);
                break;
        }
    })

    function updateTimer(notPending, percentage) {
        $(".timebar-spent").style.width = (percentage * 100) + "%";
        $(".curtime").innerText = formatTime(videoTag.duration * percentage, videoTag.duration);
        $(".totaltime").innerText = formatTime(videoTag.duration, videoTag.duration);

        if (notPending) {
            seek(percentage);
        }
    }

    function updateTimerSecond(notPending, seconds) {
        $(".timebar-spent").style.width = ((seconds / noNaN(videoTag.duration)) * 100) + "%";
        $(".curtime").innerText = formatTime(seconds, videoTag.duration);
        $(".totaltime").innerText = formatTime(videoTag.duration, videoTag.duration);

        if (notPending) {
            seekSecond(seconds);
        }
    }

    async function seek(percentage) {
        videoTag.currentTime = percentage * noNaN(videoTag.duration);
        setTimeout(async () => {
            try {
                if (state_isPlayingSeeking) {
                    await videoTag.play();
                }
                state_isPlayingSeeking = false;
            } catch { }
        }, 250);
    }

    async function seekSecond(seconds) {
        videoTag.currentTime = seconds;
        setTimeout(async () => {
            try {
                if (state_isPlayingSeeking) {
                    await videoTag.play();
                }
                state_isPlayingSeeking = false;
            } catch { }
        }, 250);
    }
}

// Speed
{
    $("#speed").addEventListener("change", e => {
        videoTag.playbackRate = parseFloat(e.target.value);
    });
}

// Main component to fetch video
(async () => {
    let baseURL = query.get("playback");
    let json = await (await fetch(baseURL)).json();

    for (let codec in json) {
        for (let quality in json[codec].quality) {
            let isSupported = MediaSource.isTypeSupported(json[codec].quality[quality].codec.video);
            json[codec].quality[quality].supported = isSupported;

            let efficientInfo = await navigator.mediaCapabilities.decodingInfo({
                type: "media-source",
                video: {
                    contentType: json[codec].quality[quality].codec.video,
                    width: json[codec].quality[quality].width,
                    height: json[codec].quality[quality].height,
                    bitrate: json[codec].quality[quality].bitrate,
                    framerate: json[codec].quality[quality].framerate
                }
            });

            json[codec].quality[quality].efficientInfo = efficientInfo;
        }
    }

    window.jsonData = json;

    /** @type {HTMLSelectElement} */
    let codecSelect = $("#codec");
    /** @type {HTMLSelectElement} */
    let qualitySelect = $("#quality");

    /** @type {HTMLOptionElement} */
    let codecAutoSelect = $("#codecAuto");
    /** @type {HTMLOptionElement} */
    let qualityAutoSelect = $("#qualityAuto");

    for (let codec in json) {
        let optionCodec = document.createElement("option");
        optionCodec.value = codec;
        optionCodec.innerText = json[codec].display;

        if (!(Object.values(json[codec].quality).findIndex(v => v.supported && v.efficientInfo.supported) + 1)) {
            optionCodec.disabled = true;
            optionCodec.innerText += " (không hỗ trợ)";
        }

        codecSelect.appendChild(optionCodec);
    }

    let autoSelect = {
        codec: true,
        quality: true
    }
    let currentQuality = {
        codec: "",
        quality: ""
    }
    let forceInstantQualitySwitch = false;

    function autoSelectCodec() {
        autoSelect.codec = true;
        autoSelect.quality = true;

        qualitySelect.value = "auto";
    }

    function forceSelectCodec(codec) {
        autoSelect.codec = false;
        autoSelect.quality = true;

        currentQuality.codec = codec;

        for (let i = 0; i < 10; i++)
            qualitySelect.childNodes.forEach(childNode => {
                if (childNode !== qualityAutoSelect) {
                    qualitySelect.removeChild(childNode);
                }
            });

        for (let quality in json[currentQuality.codec].quality) {
            let qualityNode = document.createElement("option");
            qualityNode.innerText = json[currentQuality.codec].quality[quality].display;
            qualityNode.value = quality;
            if (
                !json[currentQuality.codec].quality[quality].supported ||
                !json[currentQuality.codec].quality[quality].efficientInfo.supported
            ) {
                qualityNode.innerText += " (không hỗ trợ)";
                qualityNode.disabled = true;
            }

            qualitySelect.appendChild(qualityNode);
        }

        forceInstantQualitySwitch = true;
    }

    function autoSelectQuality() {
        autoSelect.quality = true;
    }

    function forceSelectQuality(codec, quality) {
        autoSelect.codec = false;
        autoSelect.quality = false;

        currentQuality.codec = codec;
        currentQuality.quality = quality;

        codecSelect.value = currentQuality.codec;
        forceInstantQualitySwitch = true;
    }

    let bufferHealthLow = 0;
    let bufferHealthHigh = 0;
    (async () => {
        for (; ;) {
            let qualityList = [];
            if (autoSelect.codec) {
                for (let codec in json) {
                    for (let quality in json[codec].quality) {
                        if (
                            json[codec].quality[quality].supported &&
                            json[codec].quality[quality].efficientInfo.supported
                        ) {
                            qualityList.push({
                                powerEfficient: json[codec].quality[quality].efficientInfo.powerEfficient,
                                smooth: json[codec].quality[quality].efficientInfo.smooth,
                                codec,
                                quality,
                                bitrate: json[codec].quality[quality].bitrate,
                                address: json[codec].quality[quality].address
                            });
                        }
                    }
                }
            } else if (autoSelect.quality) {
                let codec = currentQuality.codec;
                for (let quality in json[codec].quality) {
                    if (
                        json[codec].quality[quality].supported &&
                        json[codec].quality[quality].efficientInfo.supported
                    ) {
                        qualityList.push({
                            powerEfficient: json[codec].quality[quality].efficientInfo.powerEfficient,
                            smooth: json[codec].quality[quality].efficientInfo.smooth,
                            codec,
                            quality,
                            bitrate: json[codec].quality[quality].bitrate,
                            address: json[codec].quality[quality].address
                        });
                    }
                }
            } else {
                qualityList.push({
                    codec: currentQuality.codec,
                    quality: currentQuality.quality,
                    powerEfficient: json[currentQuality.codec].quality[currentQuality.quality].efficientInfo.powerEfficient,
                    smooth: json[currentQuality.codec].quality[currentQuality.quality].efficientInfo.powerEfficient,
                    bitrate: json[currentQuality.codec].quality[currentQuality.quality].bitrate,
                    address: json[currentQuality.codec].quality[currentQuality.quality].address
                });
            }

            qualityList = qualityList.sort((a, b) => {
                if (a.powerEfficient && !b.powerEfficient) {
                    return -1;
                } else if (b.powerEfficient && !a.powerEfficient) {
                    return 1;
                } else {
                    return a.bitrate - b.bitrate;
                }
            });


            let currentQualityIndex = qualityList.findIndex(q => q.codec === currentQuality.codec && q.quality === currentQuality.quality);
            let nextQualityIndex = currentQualityIndex;
            let bufferHealth = 0;

            /**
             * Get current buffer health
             * 
             * @param {number} currentTime Current time
             * @param {TimeRanges} bufferTimeRanges Buffer time ranges
             * 
             * @returns {number}
             */
            function getBufferHealth(currentTime, bufferTimeRanges) {
                let bufferList = timeRangesToArray(bufferTimeRanges);

                let currentBufferIndex = bufferList.findIndex(r => r[1] >= currentTime);
                if (currentBufferIndex === -1) return 0;

                let bufferHealth = 0;

                for (let i = currentBufferIndex; i < bufferList.length; i++) {
                    if (bufferList[i][0] < currentTime) bufferList[i][0] = currentTime;

                    bufferHealth += bufferList[i][1] - bufferList[i][0];
                }

                return bufferHealth;
            }

            function timeRangesToArray(timeRanges) {
                let list = [];
                for (let i = 0; i < timeRanges.length; i++) {
                    list.push([timeRanges.start(i), timeRanges.end(i)]);
                }

                return list;
            }

            if (currentQualityIndex === -1) {
                nextQualityIndex = 0;
            } else {
                // Calculate buffer health
                bufferHealth = getBufferHealth(videoTag.currentTime, videoTag.buffered);

                // Update buffer health bar on progress bar
                $(".timebar-buffer").style.width = (((videoTag.currentTime + bufferHealth) / noNaN(videoTag.duration)) * 100) + "%";

                // Selecting quality based on buffer health
                if (bufferHealth > 25) {
                    bufferHealthHigh += Math.floor(bufferHealth / 15);
                    bufferHealthLow = 0;
                    if (bufferHealthHigh > 10) {
                        nextQualityIndex = currentQualityIndex + 1;
                        if (nextQualityIndex === qualityList.length)
                            nextQualityIndex = currentQualityIndex;

                        if (qualityList[currentQualityIndex].powerEfficient && !qualityList[nextQualityIndex].powerEfficient) {
                            nextQualityIndex = currentQualityIndex;
                        }

                        bufferHealthHigh = 0;
                    }
                } else if (bufferHealth < 10) {
                    bufferHealthLow++;
                    bufferHealthHigh = 0;
                    if (bufferHealthLow > 10) {
                        nextQualityIndex = currentQualityIndex - 1;
                        if (nextQualityIndex === -1) nextQualityIndex = 0;

                        bufferHealthLow = 0;
                    }
                }
            }

            if (currentQualityIndex !== nextQualityIndex || forceInstantQualitySwitch) {
                let cacheVideo;
                let newSrc = new URL(qualityList[nextQualityIndex].address, baseURL);
                if (!forceInstantQualitySwitch) {
                    cacheVideo = document.createElement("video");
                    cacheVideo.muted = true;
                    cacheVideo.src = newSrc.toString();
                    cacheVideo.preload = "auto";

                    let cacheTime = 0;
                    let failedCacheTime = 0;
                    for (let z = 0; ; z++) {
                        if (z % 50 === 0) {
                            cacheVideo.currentTime = Math.floor(videoTag.currentTime);
                            cacheVideo.play().catch(() => { });
                        }

                        let cacheBufferHealth = getBufferHealth(videoTag.currentTime, cacheVideo.buffered);

                        if (cacheBufferHealth > 20) break;
                        if (cacheBufferHealth < 5) {
                            failedCacheTime++;
                        } else {
                            failedCacheTime = 0;
                            cacheTime++;
                        }
                        if (failedCacheTime > 50) {
                            if (currentQualityIndex < nextQualityIndex)
                                nextQualityIndex = currentQualityIndex;

                            if (nextQualityIndex < 0) nextQualityIndex = 0;
                            break;
                        }
                        if (cacheTime > 100) break;
                        await new Promise(x => setTimeout(x, 100));
                    }
                }

                if (currentQualityIndex !== nextQualityIndex || forceInstantQualitySwitch) {
                    try {
                        var thecanvas = document.createElement("canvas");
                        let w = thecanvas.width = parseFloat(getComputedStyle(videoTag).width);
                        let h = thecanvas.height = parseFloat(getComputedStyle(videoTag).height);

                        var context = thecanvas.getContext('2d');
                        context.drawImage(videoTag, 0, 0, w, h);
                        var dataURL = thecanvas.toDataURL();

                        thecanvas.remove();
                        videoTag.poster = dataURL;
                    } catch { }

                    let ct = videoTag.currentTime;
                    let paused = videoTag.paused;
                    videoTag.src = newSrc.toString();
                    videoTag.currentTime = ct;
                    if (!paused) videoTag.play();

                    videoTag.poster = "";
                }

                if (cacheVideo) {
                    cacheVideo.pause();
                    cacheVideo.src = "";
                    cacheVideo.remove();
                    cacheVideo = null;
                }
            }

            forceInstantQualitySwitch = false;
            currentQuality.codec = qualityList[nextQualityIndex].codec;
            currentQuality.quality = qualityList[nextQualityIndex].quality;

            if (currentQualityIndex !== nextQualityIndex) {
                updateAutoCodecAndQuality(nextQualityIndex !== currentQualityIndex);
            }

            await new Promise(x => setTimeout(x, 500));
        }
    })();

    function updateAutoCodecAndQuality(needUpdate) {
        if (autoSelect.codec) {
            codecAutoSelect.innerText = `Tự động (${json[currentQuality.codec].display})`;
            qualityAutoSelect.innerText = `Tự động (${json[currentQuality.codec].quality[currentQuality.quality].display})`;

            if (needUpdate) {
                for (let i = 0; i < 10; i++)
                    qualitySelect.childNodes.forEach(childNode => {
                        if (childNode !== qualityAutoSelect) {
                            qualitySelect.removeChild(childNode);
                        }
                    });

                for (let quality in json[currentQuality.codec].quality) {
                    let qualityNode = document.createElement("option");
                    qualityNode.innerText = json[currentQuality.codec].quality[quality].display;
                    qualityNode.value = quality;

                    qualitySelect.appendChild(qualityNode);
                }
            }
        } else if (autoSelect.quality) {
            codecAutoSelect.innerText = `Tự động`;
            qualityAutoSelect.innerText = `Tự động (${json[currentQuality.codec].quality[currentQuality.quality].display})`;
        } else {
            codecAutoSelect.innerText = `Tự động`;
            qualityAutoSelect.innerText = `Tự động`;
        }
    }

    codecSelect.addEventListener("change", e => {
        if (e.target.value === "auto") {
            autoSelectCodec();
        } else {
            forceSelectCodec(e.target.value);
        }
        updateAutoCodecAndQuality(true);
    });

    qualitySelect.addEventListener("change", e => {
        if (e.target.value === "auto") {
            autoSelectQuality();
        } else {
            forceSelectQuality(currentQuality.codec, e.target.value);
        }
        updateAutoCodecAndQuality(false);
    });
})();