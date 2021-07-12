function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

/*
    H5MVD v1.1
 
    Copyright © 2021 BadAimWeeb
*/
var $ = document.querySelector.bind(document);
var query = new URLSearchParams(location.search);
var videoTag = document.querySelector("video");
videoTag.crossOrigin = "anomynous";
videoTag.controls = false;
videoTag.addEventListener("play", function () {
    $(".play-pause span").innerHTML = "pause";
});
videoTag.addEventListener("pause", function () {
    $(".play-pause span").innerHTML = "play_arrow";
});
videoTag.addEventListener("durationchange", function () {
    $(".totaltime").innerText = formatTime(videoTag.duration, videoTag.duration);
});
videoTag.addEventListener("timeupdate", function () {
    $(".curtime").innerText = formatTime(videoTag.currentTime, videoTag.duration);
    $(".timebar-spent").style.width =
        (noNaN(videoTag.currentTime) / noNaN(videoTag.duration)) * 100 + "%";

    if (videoTag.currentTime === videoTag.duration && videoTag.duration !== 0) {
        window.postMessage({
            event: "video_end"
        });
    }
});
videoTag.addEventListener("seeking", function () {
    $(".loading").style.visibility = "visible";
});
videoTag.addEventListener("seeked", function () {
    $(".loading").style.visibility = "hidden";
});
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    return false;
});

function outsideClick(event, notelem) {
    notelem = [notelem];
    var clickedOut = true,
        i,
        len = notelem.length;

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
    var returnString = "";

    if (maxDuration >= 3600 * 24) {
        returnString += Math.floor(duration / (3600 * 24)).toString() + ":";
    }

    if (maxDuration >= 3600) {
        returnString +=
            (Math.floor(duration / 3600) % 24).toString().padStart(2, "0") + ":";
    }

    returnString +=
        (Math.floor(duration / 60) % 60).toString().padStart(2, "0") + ":";
    returnString += (Math.floor(duration) % 60).toString().padStart(2, "0");
    return returnString;
} // Volume controls

{
    function updateOnlyDiffValue(dom, value) {
        if (dom.innerHTML != value) dom.innerHTML = value;
    }

    var slider = $("#volume");
    var oldValue = 100;
    setInterval(function () {
        var gradValue = Math.round(
            (slider.value / +slider.getAttribute("max")) * 100
        );
        var grad =
            "linear-gradient(90deg, #9F6EEE " +
            gradValue +
            "%, #555555 " +
            (gradValue + 1) +
            "%)";
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
    $(".volume").addEventListener("click", function () {
        videoTag.muted = !videoTag.muted;
    });
    document.documentElement.addEventListener("keydown", function (e) {
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
} // Show/hide control + Settings button

{
    var isSettingsShown = false;
    var isAnimating = false;

    window.showSettings = /*#__PURE__*/ (function () {
        var _showSettings = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch ((_context.prev = _context.next)) {
                        case 0:
                            if (isAnimating) {
                                _context.next = 16;
                                break;
                            }

                            isAnimating = true;
                            isSettingsShown = !isSettingsShown;

                            if (isSettingsShown) {
                                _context.next = 11;
                                break;
                            }

                            $(".settingsPanel").style.visibility = "hidden";
                            $(".settingsPanel").animate(
                                [
                                    {
                                        opacity: 1
                                    },
                                    {
                                        opacity: 0
                                    }
                                ],
                                300
                            );
                            _context.next = 8;
                            return new Promise(function (x) {
                                return setTimeout(x, 300);
                            });

                        case 8:
                            isAnimating = false;
                            _context.next = 16;
                            break;

                        case 11:
                            $(".settingsPanel").style.visibility = "visible";
                            $(".settingsPanel").animate(
                                [
                                    {
                                        opacity: 0
                                    },
                                    {
                                        opacity: 1
                                    }
                                ],
                                300
                            );
                            _context.next = 15;
                            return new Promise(function (x) {
                                return setTimeout(x, 300);
                            });

                        case 15:
                            isAnimating = false;

                        case 16:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee);
        })
        );

        function showSettings() {
            return _showSettings.apply(this, arguments);
        }

        return showSettings;
    })();

    window.addEventListener(
        "click",
      /*#__PURE__*/(function () {
            var _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(e) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch ((_context2.prev = _context2.next)) {
                            case 0:
                                if (!outsideClick(e, $(".settings"))) {
                                    _context2.next = 11;
                                    break;
                                }

                                if (!isSettingsShown) {
                                    _context2.next = 11;
                                    break;
                                }

                                if (!isAnimating) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 5;
                                return new Promise(function (x) {
                                    return setTimeout(x, 300);
                                });

                            case 5:
                                $(".settingsPanel").style.visibility = "hidden";
                                $(".settingsPanel").animate(
                                    [
                                        {
                                            opacity: 1
                                        },
                                        {
                                            opacity: 0
                                        }
                                    ],
                                    300
                                );
                                _context2.next = 9;
                                return new Promise(function (x) {
                                    return setTimeout(x, 300);
                                });

                            case 9:
                                isAnimating = false;
                                isSettingsShown = false;

                            case 11:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2);
            })
            );

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })()
    );
    var hideTimeout = setTimeout(hideFunc, 2500);
    var isVisible = true;

    function hideFunc() {
        if (!isSettingsShown) {
            isVisible = false;
            $(".controls").style.visibility = "hidden";
            $(".controls").animate(
                [
                    {
                        opacity: 1
                    },
                    {
                        opacity: 0
                    }
                ],
                250
            );
        } else {
            hideTimeout = setTimeout(hideFunc, 2500);
        }
    }

    document.addEventListener("mousemove", function (e) {
        try {
            clearTimeout(hideTimeout);
        } catch (_) { }

        $(".controls").style.visibility = "visible";

        if (!isVisible) {
            $(".controls").animate(
                [
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1
                    }
                ],
                250
            );
            isVisible = true;
        }

        hideTimeout = setTimeout(hideFunc, 2500);
    });
} // Fullscreen button

{
    var isFullscreen = false;

    window.fullscreen = /*#__PURE__*/ (function () {
        var _fullscreen = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch ((_context3.prev = _context3.next)) {
                        case 0:
                            if (isFullscreen) {
                                isFullscreen = false;

                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                } else if (document.webkitExitFullscreen) {
                                    /* Safari */
                                    document.webkitExitFullscreen();
                                } else if (document.msExitFullscreen) {
                                    /* IE11 */
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
                                } else if (document.documentElement.webkitRequestFullScreen) {
                                    /* Safari */
                                    document.documentElement.webkitRequestFullScreen();
                                } else if (document.documentElement.msRequestFullscreen) {
                                    /* IE11 */
                                    document.documentElement.msRequestFullscreen();
                                } else if (document.documentElement.mozRequestFullScreen) {
                                    document.documentElement.mozRequestFullScreen();
                                } else if (document.documentElement.requestFullScreen) {
                                    document.documentElement.requestFullScreen();
                                }
                            }

                        case 1:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3);
        })
        );

        function fullscreen() {
            return _fullscreen.apply(this, arguments);
        }

        return fullscreen;
    })();

    $(".fullscreen").addEventListener("keypress", function (e) {
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
    document.addEventListener("mozfullscreenchange", fsc);
    document.addEventListener("MSFullscreenChange", fsc);
    document.addEventListener("webkitfullscreenchange", fsc);
} // Picture-in-picture button

{
    window.pip = /*#__PURE__*/ (function () {
        var _pip = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee4() {
            return regeneratorRuntime.wrap(
                function _callee4$(_context4) {
                    while (1) {
                        switch ((_context4.prev = _context4.next)) {
                            case 0:
                                if (
                                    !(
                                        document.pictureInPictureEnabled &&
                                        !videoTag.disablePictureInPicture
                                    )
                                ) {
                                    _context4.next = 12;
                                    break;
                                }

                                if (document.pictureInPictureElement) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.prev = 2;
                                _context4.next = 5;
                                return videoTag.requestPictureInPicture();

                            case 5:
                                _context4.next = 10;
                                break;

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4["catch"](2);
                                alert("Video chưa sẵn sàng, chưa thể bật PiP.");

                            case 10:
                                _context4.next = 13;
                                break;

                            case 12:
                                alert(
                                    "Trình duyệt này không hỗ trợ tính năng Picture-in-picture."
                                );

                            case 13:
                            case "end":
                                return _context4.stop();
                        }
                    }
                },
                _callee4,
                null,
                [[2, 7]]
            );
        })
        );

        function pip() {
            return _pip.apply(this, arguments);
        }

        return pip;
    })();

    $(".pip").addEventListener("keypress", function (e) {
        if (e.keyCode === 32) window.pip();
    });
} // Play/pause button + keyboard spacebar to control play/pause

{
    window.playOrPause = /*#__PURE__*/ (function () {
        var _playOrPause = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee5() {
            return regeneratorRuntime.wrap(
                function _callee5$(_context5) {
                    while (1) {
                        switch ((_context5.prev = _context5.next)) {
                            case 0:
                                if (!videoTag.paused) {
                                    _context5.next = 10;
                                    break;
                                }

                                _context5.prev = 1;
                                _context5.next = 4;
                                return videoTag.play();

                            case 4:
                                _context5.next = 8;
                                break;

                            case 6:
                                _context5.prev = 6;
                                _context5.t0 = _context5["catch"](1);

                            case 8:
                                _context5.next = 11;
                                break;

                            case 10:
                                videoTag.pause();

                            case 11:
                            case "end":
                                return _context5.stop();
                        }
                    }
                },
                _callee5,
                null,
                [[1, 6]]
            );
        })
        );

        function playOrPause() {
            return _playOrPause.apply(this, arguments);
        }

        return playOrPause;
    })();

    videoTag.addEventListener("click", function (e) {
        if (!window.matchMedia("(hover: none)").matches) window.playOrPause();
    });
    document.documentElement.addEventListener("keydown", function (e) {
        if (e.keyCode === 32 && document.activeElement.tabIndex === -1)
            window.playOrPause();
    });
} // Progress bar: seekable + keyboard buttons (control time)

{
    var state_isPlayingSeeking = false;
    var isMouseDownTimebar = false;
    var lastOffset = 0;
    $(".timebar").addEventListener("mousedown", function (e) {
        isMouseDownTimebar = true;
        lastOffset = e.clientX - 16;
        var maxOffset = parseInt(getComputedStyle($(".timebar")).width);
        if (lastOffset < 0) lastOffset = 0;
        if (lastOffset > maxOffset) lastOffset = maxOffset;
        updateTimer(false, Math.round((lastOffset / maxOffset) * 400) / 400);

        if (!videoTag.paused) {
            videoTag.pause();
            state_isPlayingSeeking = true;
        } else {
            state_isPlayingSeeking = false;
        }
    });
    $("body").addEventListener("mousemove", function (e) {
        if (isMouseDownTimebar) {
            lastOffset = e.clientX - 16;
            var maxOffset = parseInt(getComputedStyle($(".timebar")).width);
            if (lastOffset < 0) lastOffset = 0;
            if (lastOffset > maxOffset) lastOffset = maxOffset;
            updateTimer(false, Math.round((lastOffset / maxOffset) * 400) / 400);
        }
    });
    $("body").addEventListener("mouseup", function (e) {
        if (isMouseDownTimebar) {
            isMouseDownTimebar = false;
            var maxOffset = parseInt(getComputedStyle($(".timebar")).width);
            updateTimer(true, Math.round((lastOffset / maxOffset) * 400) / 400);
        }
    });
    document.documentElement.addEventListener("keydown", function (e) {
        var updateTime;

        switch (e.keyCode) {
            case 37:
                // Left
                updateTime = videoTag.currentTime - 5;
                if (updateTime < 0) updateTime = 0;
                if (updateTime > noNaN(videoTag.duration))
                    updateTime = noNaN(videoTag.duration);
                updateTimerSecond(true, updateTime);
                break;

            case 39:
                // Right
                updateTime = videoTag.currentTime + 5;
                if (updateTime < 0) updateTime = 0;
                if (updateTime > noNaN(videoTag.duration))
                    updateTime = noNaN(videoTag.duration);
                updateTimerSecond(true, updateTime);
                break;
        }
    });

    function updateTimer(notPending, percentage) {
        $(".timebar-spent").style.width = percentage * 100 + "%";
        $(".curtime").innerText = formatTime(
            videoTag.duration * percentage,
            videoTag.duration
        );
        $(".totaltime").innerText = formatTime(
            videoTag.duration,
            videoTag.duration
        );

        if (notPending) {
            seek(percentage);
        }
    }

    function updateTimerSecond(notPending, seconds) {
        $(".timebar-spent").style.width =
            (seconds / noNaN(videoTag.duration)) * 100 + "%";
        $(".curtime").innerText = formatTime(seconds, videoTag.duration);
        $(".totaltime").innerText = formatTime(
            videoTag.duration,
            videoTag.duration
        );

        if (notPending) {
            seekSecond(seconds);
        }
    }

    function seek(_x2) {
        return _seek.apply(this, arguments);
    }

    function _seek() {
        _seek = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee7(percentage) {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch ((_context7.prev = _context7.next)) {
                        case 0:
                            videoTag.currentTime = percentage * noNaN(videoTag.duration);
                            setTimeout(
                    /*#__PURE__*/ _asyncToGenerator(
                      /*#__PURE__*/ regeneratorRuntime.mark(function _callee6() {
                                return regeneratorRuntime.wrap(
                                    function _callee6$(_context6) {
                                        while (1) {
                                            switch ((_context6.prev = _context6.next)) {
                                                case 0:
                                                    _context6.prev = 0;

                                                    if (!state_isPlayingSeeking) {
                                                        _context6.next = 4;
                                                        break;
                                                    }

                                                    _context6.next = 4;
                                                    return videoTag.play();

                                                case 4:
                                                    state_isPlayingSeeking = false;
                                                    _context6.next = 9;
                                                    break;

                                                case 7:
                                                    _context6.prev = 7;
                                                    _context6.t0 = _context6["catch"](0);

                                                case 9:
                                                case "end":
                                                    return _context6.stop();
                                            }
                                        }
                                    },
                                    _callee6,
                                    null,
                                    [[0, 7]]
                                );
                            })
                            ),
                                250
                            );

                        case 2:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7);
        })
        );
        return _seek.apply(this, arguments);
    }

    function seekSecond(_x3) {
        return _seekSecond.apply(this, arguments);
    }

    function _seekSecond() {
        _seekSecond = _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee9(seconds) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch ((_context9.prev = _context9.next)) {
                        case 0:
                            videoTag.currentTime = seconds;
                            setTimeout(
                    /*#__PURE__*/ _asyncToGenerator(
                      /*#__PURE__*/ regeneratorRuntime.mark(function _callee8() {
                                return regeneratorRuntime.wrap(
                                    function _callee8$(_context8) {
                                        while (1) {
                                            switch ((_context8.prev = _context8.next)) {
                                                case 0:
                                                    _context8.prev = 0;

                                                    if (!state_isPlayingSeeking) {
                                                        _context8.next = 4;
                                                        break;
                                                    }

                                                    _context8.next = 4;
                                                    return videoTag.play();

                                                case 4:
                                                    state_isPlayingSeeking = false;
                                                    _context8.next = 9;
                                                    break;

                                                case 7:
                                                    _context8.prev = 7;
                                                    _context8.t0 = _context8["catch"](0);

                                                case 9:
                                                case "end":
                                                    return _context8.stop();
                                            }
                                        }
                                    },
                                    _callee8,
                                    null,
                                    [[0, 7]]
                                );
                            })
                            ),
                                250
                            );

                        case 2:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9);
        })
        );
        return _seekSecond.apply(this, arguments);
    }
} // Speed

{
    $("#speed").addEventListener("change", function (e) {
        videoTag.playbackRate = parseFloat(e.target.value);
    });
} // Main component to fetch video

_asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee11() {
    var baseURL,
        json,
        codec,
        quality,
        isSupported,
        efficientInfo,
        codecSelect,
        qualitySelect,
        codecAutoSelect,
        qualityAutoSelect,
        _codec,
        optionCodec,
        autoSelect,
        currentQuality,
        forceInstantQualitySwitch,
        autoSelectCodec,
        forceSelectCodec,
        autoSelectQuality,
        forceSelectQuality,
        bufferHealthLow,
        bufferHealthHigh,
        updateAutoCodecAndQuality;

    return regeneratorRuntime.wrap(function _callee11$(_context12) {
        while (1) {
            switch ((_context12.prev = _context12.next)) {
                case 0:
                    updateAutoCodecAndQuality = function _updateAutoCodecAndQu(
                        needUpdate
                    ) {
                        if (autoSelect.codec) {
                            codecAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng (".concat(
                                json[currentQuality.codec].display,
                                ")"
                            );
                            qualityAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng (".concat(
                                json[currentQuality.codec].quality[currentQuality.quality]
                                    .display,
                                ")"
                            );

                            if (needUpdate) {
                                for (var i = 0; i < 10; i++) {
                                    qualitySelect.childNodes.forEach(function (childNode) {
                                        if (childNode !== qualityAutoSelect) {
                                            qualitySelect.removeChild(childNode);
                                        }
                                    });
                                }

                                for (var _quality4 in json[currentQuality.codec].quality) {
                                    var qualityNode = document.createElement("option");
                                    qualityNode.innerText =
                                        json[currentQuality.codec].quality[_quality4].display;
                                    qualityNode.value = _quality4;
                                    qualitySelect.appendChild(qualityNode);
                                }
                            }
                        } else if (autoSelect.quality) {
                            codecAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng";
                            qualityAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng (".concat(
                                json[currentQuality.codec].quality[currentQuality.quality]
                                    .display,
                                ")"
                            );
                        } else {
                            codecAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng";
                            qualityAutoSelect.innerText = "T\u1EF1 \u0111\u1ED9ng";
                        }
                    };

                    forceSelectQuality = function _forceSelectQuality(codec, quality) {
                        autoSelect.codec = false;
                        autoSelect.quality = false;
                        currentQuality.codec = codec;
                        currentQuality.quality = quality;
                        codecSelect.value = currentQuality.codec;
                        forceInstantQualitySwitch = true;
                    };

                    autoSelectQuality = function _autoSelectQuality() {
                        autoSelect.quality = true;
                    };

                    forceSelectCodec = function _forceSelectCodec(codec) {
                        autoSelect.codec = false;
                        autoSelect.quality = true;
                        currentQuality.codec = codec;

                        for (var i = 0; i < 10; i++) {
                            qualitySelect.childNodes.forEach(function (childNode) {
                                if (childNode !== qualityAutoSelect) {
                                    qualitySelect.removeChild(childNode);
                                }
                            });
                        }

                        for (var _quality in json[currentQuality.codec].quality) {
                            var qualityNode = document.createElement("option");
                            qualityNode.innerText =
                                json[currentQuality.codec].quality[_quality].display;
                            qualityNode.value = _quality;

                            if (
                                !json[currentQuality.codec].quality[_quality].supported ||
                                !json[currentQuality.codec].quality[_quality].efficientInfo
                                    .supported
                            ) {
                                qualityNode.innerText += " (không hỗ trợ)";
                                qualityNode.disabled = true;
                            }

                            qualitySelect.appendChild(qualityNode);
                        }

                        forceInstantQualitySwitch = true;
                    };

                    autoSelectCodec = function _autoSelectCodec() {
                        autoSelect.codec = true;
                        autoSelect.quality = true;
                        qualitySelect.value = "auto";
                    };

                    baseURL = query.get("playback");
                    _context12.next = 8;
                    return fetch(baseURL);

                case 8:
                    _context12.next = 10;
                    return _context12.sent.json();

                case 10:
                    json = _context12.sent;
                    _context12.t0 = regeneratorRuntime.keys(json);

                case 12:
                    if ((_context12.t1 = _context12.t0()).done) {
                        _context12.next = 27;
                        break;
                    }

                    codec = _context12.t1.value;
                    _context12.t2 = regeneratorRuntime.keys(json[codec].quality);

                case 15:
                    if ((_context12.t3 = _context12.t2()).done) {
                        _context12.next = 25;
                        break;
                    }

                    quality = _context12.t3.value;
                    isSupported = MediaSource.isTypeSupported(
                        json[codec].quality[quality].codec.video
                    );
                    json[codec].quality[quality].supported = isSupported;
                    _context12.next = 21;
                    return navigator.mediaCapabilities.decodingInfo({
                        type: "media-source",
                        video: {
                            contentType: json[codec].quality[quality].codec.video,
                            width: json[codec].quality[quality].width,
                            height: json[codec].quality[quality].height,
                            bitrate: json[codec].quality[quality].bitrate,
                            framerate: json[codec].quality[quality].framerate
                        }
                    });

                case 21:
                    efficientInfo = _context12.sent;
                    json[codec].quality[quality].efficientInfo = efficientInfo;
                    _context12.next = 15;
                    break;

                case 25:
                    _context12.next = 12;
                    break;

                case 27:
                    window.jsonData = json;
                    /** @type {HTMLSelectElement} */

                    codecSelect = $("#codec");
                    /** @type {HTMLSelectElement} */

                    qualitySelect = $("#quality");
                    /** @type {HTMLOptionElement} */

                    codecAutoSelect = $("#codecAuto");
                    /** @type {HTMLOptionElement} */

                    qualityAutoSelect = $("#qualityAuto");

                    for (_codec in json) {
                        optionCodec = document.createElement("option");
                        optionCodec.value = _codec;
                        optionCodec.innerText = json[_codec].display;

                        if (
                            !(
                                Object.values(json[_codec].quality).findIndex(function (v) {
                                    return v.supported && v.efficientInfo.supported;
                                }) + 1
                            )
                        ) {
                            optionCodec.disabled = true;
                            optionCodec.innerText += " (không hỗ trợ)";
                        }

                        codecSelect.appendChild(optionCodec);
                    }

                    autoSelect = {
                        codec: true,
                        quality: true
                    };
                    currentQuality = {
                        codec: "",
                        quality: ""
                    };
                    forceInstantQualitySwitch = false;
                    bufferHealthLow = 0;
                    bufferHealthHigh = 0;

                    _asyncToGenerator(
                /*#__PURE__*/ regeneratorRuntime.mark(function _callee10() {
                        var _loop, thecanvas, context, dataURL;

                        return regeneratorRuntime.wrap(function _callee10$(_context11) {
                            while (1) {
                                switch ((_context11.prev = _context11.next)) {
                                    case 0:
                                        _loop = /*#__PURE__*/ regeneratorRuntime.mark(
                                            function _loop() {
                                                var qualityList,
                                                    _codec2,
                                                    _quality2,
                                                    _codec3,
                                                    _quality3,
                                                    currentQualityIndex,
                                                    nextQualityIndex,
                                                    bufferHealth,
                                                    getBufferHealth,
                                                    timeRangesToArray,
                                                    cacheVideo,
                                                    newSrc,
                                                    cacheTime,
                                                    failedCacheTime,
                                                    z,
                                                    cacheBufferHealth,
                                                    w,
                                                    h,
                                                    ct,
                                                    paused;

                                                return regeneratorRuntime.wrap(function _loop$(
                                                    _context10
                                                ) {
                                                    while (1) {
                                                        switch ((_context10.prev = _context10.next)) {
                                                            case 0:
                                                                timeRangesToArray =
                                                                    function _timeRangesToArray(timeRanges) {
                                                                        var list = [];

                                                                        for (
                                                                            var i = 0;
                                                                            i < timeRanges.length;
                                                                            i++
                                                                        ) {
                                                                            list.push([
                                                                                timeRanges.start(i),
                                                                                timeRanges.end(i)
                                                                            ]);
                                                                        }

                                                                        return list;
                                                                    };

                                                                getBufferHealth = function _getBufferHealth(
                                                                    currentTime,
                                                                    bufferTimeRanges
                                                                ) {
                                                                    var bufferList =
                                                                        timeRangesToArray(bufferTimeRanges);
                                                                    var currentBufferIndex =
                                                                        bufferList.findIndex(function (r) {
                                                                            return r[1] >= currentTime;
                                                                        });
                                                                    if (currentBufferIndex === -1) return 0;
                                                                    var bufferHealth = 0;

                                                                    for (
                                                                        var i = currentBufferIndex;
                                                                        i < bufferList.length;
                                                                        i++
                                                                    ) {
                                                                        if (bufferList[i][0] < currentTime)
                                                                            bufferList[i][0] = currentTime;
                                                                        bufferHealth +=
                                                                            bufferList[i][1] - bufferList[i][0];
                                                                    }

                                                                    return bufferHealth;
                                                                };

                                                                qualityList = [];

                                                                if (autoSelect.codec) {
                                                                    for (_codec2 in json) {
                                                                        for (_quality2 in json[_codec2]
                                                                            .quality) {
                                                                            if (
                                                                                json[_codec2].quality[_quality2]
                                                                                    .supported &&
                                                                                json[_codec2].quality[_quality2]
                                                                                    .efficientInfo.supported
                                                                            ) {
                                                                                qualityList.push({
                                                                                    powerEfficient:
                                                                                        json[_codec2].quality[_quality2]
                                                                                            .efficientInfo.powerEfficient,
                                                                                    smooth:
                                                                                        json[_codec2].quality[_quality2]
                                                                                            .efficientInfo.smooth,
                                                                                    codec: _codec2,
                                                                                    quality: _quality2,
                                                                                    bitrate:
                                                                                        json[_codec2].quality[_quality2]
                                                                                            .bitrate,
                                                                                    address:
                                                                                        json[_codec2].quality[_quality2]
                                                                                            .address
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                } else if (autoSelect.quality) {
                                                                    _codec3 = currentQuality.codec;

                                                                    for (_quality3 in json[_codec3].quality) {
                                                                        if (
                                                                            json[_codec3].quality[_quality3]
                                                                                .supported &&
                                                                            json[_codec3].quality[_quality3]
                                                                                .efficientInfo.supported
                                                                        ) {
                                                                            qualityList.push({
                                                                                powerEfficient:
                                                                                    json[_codec3].quality[_quality3]
                                                                                        .efficientInfo.powerEfficient,
                                                                                smooth:
                                                                                    json[_codec3].quality[_quality3]
                                                                                        .efficientInfo.smooth,
                                                                                codec: _codec3,
                                                                                quality: _quality3,
                                                                                bitrate:
                                                                                    json[_codec3].quality[_quality3]
                                                                                        .bitrate,
                                                                                address:
                                                                                    json[_codec3].quality[_quality3]
                                                                                        .address
                                                                            });
                                                                        }
                                                                    }
                                                                } else {
                                                                    qualityList.push({
                                                                        codec: currentQuality.codec,
                                                                        quality: currentQuality.quality,
                                                                        powerEfficient:
                                                                            json[currentQuality.codec].quality[
                                                                                currentQuality.quality
                                                                            ].efficientInfo.powerEfficient,
                                                                        smooth:
                                                                            json[currentQuality.codec].quality[
                                                                                currentQuality.quality
                                                                            ].efficientInfo.powerEfficient,
                                                                        bitrate:
                                                                            json[currentQuality.codec].quality[
                                                                                currentQuality.quality
                                                                            ].bitrate,
                                                                        address:
                                                                            json[currentQuality.codec].quality[
                                                                                currentQuality.quality
                                                                            ].address
                                                                    });
                                                                }

                                                                qualityList = qualityList.sort(function (
                                                                    a,
                                                                    b
                                                                ) {
                                                                    if (
                                                                        a.powerEfficient &&
                                                                        !b.powerEfficient
                                                                    ) {
                                                                        return -1;
                                                                    } else if (
                                                                        b.powerEfficient &&
                                                                        !a.powerEfficient
                                                                    ) {
                                                                        return 1;
                                                                    } else {
                                                                        return a.bitrate - b.bitrate;
                                                                    }
                                                                });
                                                                currentQualityIndex = qualityList.findIndex(
                                                                    function (q) {
                                                                        return (
                                                                            q.codec === currentQuality.codec &&
                                                                            q.quality === currentQuality.quality
                                                                        );
                                                                    }
                                                                );
                                                                nextQualityIndex = currentQualityIndex;
                                                                bufferHealth = 0;
                                                                /**
                                                                 * Get current buffer health
                                                                 *
                                                                 * @param {number} currentTime Current time
                                                                 * @param {TimeRanges} bufferTimeRanges Buffer time ranges
                                                                 *
                                                                 * @returns {number}
                                                                 */

                                                                if (currentQualityIndex === -1) {
                                                                    nextQualityIndex = 0;
                                                                } else {
                                                                    // Calculate buffer health
                                                                    bufferHealth = getBufferHealth(
                                                                        videoTag.currentTime,
                                                                        videoTag.buffered
                                                                    ); // Update buffer health bar on progress bar

                                                                    $(".timebar-buffer").style.width =
                                                                        ((videoTag.currentTime + bufferHealth) /
                                                                            noNaN(videoTag.duration)) *
                                                                        100 +
                                                                        "%"; // Selecting quality based on buffer health

                                                                    if (bufferHealth > 25) {
                                                                        bufferHealthHigh += Math.floor(
                                                                            bufferHealth / 15
                                                                        );
                                                                        bufferHealthLow = 0;

                                                                        if (bufferHealthHigh > 10) {
                                                                            nextQualityIndex =
                                                                                currentQualityIndex + 1;
                                                                            if (
                                                                                nextQualityIndex ===
                                                                                qualityList.length
                                                                            )
                                                                                nextQualityIndex =
                                                                                    currentQualityIndex;

                                                                            if (
                                                                                qualityList[currentQualityIndex]
                                                                                    .powerEfficient &&
                                                                                !qualityList[nextQualityIndex]
                                                                                    .powerEfficient
                                                                            ) {
                                                                                nextQualityIndex =
                                                                                    currentQualityIndex;
                                                                            }

                                                                            bufferHealthHigh = 0;
                                                                        }
                                                                    } else if (bufferHealth < 10) {
                                                                        bufferHealthLow++;
                                                                        bufferHealthHigh = 0;

                                                                        if (bufferHealthLow > 10) {
                                                                            nextQualityIndex =
                                                                                currentQualityIndex - 1;
                                                                            if (nextQualityIndex === -1)
                                                                                nextQualityIndex = 0;
                                                                            bufferHealthLow = 0;
                                                                        }
                                                                    }
                                                                }

                                                                if (
                                                                    !(
                                                                        currentQualityIndex !==
                                                                        nextQualityIndex ||
                                                                        forceInstantQualitySwitch
                                                                    )
                                                                ) {
                                                                    _context10.next = 37;
                                                                    break;
                                                                }

                                                                newSrc = new URL(
                                                                    qualityList[nextQualityIndex].address,
                                                                    baseURL
                                                                );

                                                                if (forceInstantQualitySwitch) {
                                                                    _context10.next = 35;
                                                                    break;
                                                                }

                                                                cacheVideo =
                                                                    document.createElement("video");
                                                                cacheVideo.muted = true;
                                                                cacheVideo.src = newSrc.toString();
                                                                cacheVideo.preload = "auto";
                                                                cacheTime = 0;
                                                                failedCacheTime = 0;
                                                                z = 0;

                                                            case 19:
                                                                if (z % 50 === 0) {
                                                                    cacheVideo.currentTime = Math.floor(
                                                                        videoTag.currentTime
                                                                    );
                                                                    cacheVideo.play().catch(function () { });
                                                                }

                                                                cacheBufferHealth = getBufferHealth(
                                                                    videoTag.currentTime,
                                                                    cacheVideo.buffered
                                                                );

                                                                if (!(cacheBufferHealth > 20)) {
                                                                    _context10.next = 23;
                                                                    break;
                                                                }

                                                                return _context10.abrupt("break", 35);

                                                            case 23:
                                                                if (cacheBufferHealth < 5) {
                                                                    failedCacheTime++;
                                                                } else {
                                                                    failedCacheTime = 0;
                                                                    cacheTime++;
                                                                }

                                                                if (!(failedCacheTime > 50)) {
                                                                    _context10.next = 28;
                                                                    break;
                                                                }

                                                                if (currentQualityIndex < nextQualityIndex)
                                                                    nextQualityIndex = currentQualityIndex;
                                                                if (nextQualityIndex < 0)
                                                                    nextQualityIndex = 0;
                                                                return _context10.abrupt("break", 35);

                                                            case 28:
                                                                if (!(cacheTime > 100)) {
                                                                    _context10.next = 30;
                                                                    break;
                                                                }

                                                                return _context10.abrupt("break", 35);

                                                            case 30:
                                                                _context10.next = 32;
                                                                return new Promise(function (x) {
                                                                    return setTimeout(x, 100);
                                                                });

                                                            case 32:
                                                                z++;
                                                                _context10.next = 19;
                                                                break;

                                                            case 35:
                                                                if (
                                                                    currentQualityIndex !==
                                                                    nextQualityIndex ||
                                                                    forceInstantQualitySwitch
                                                                ) {
                                                                    try {
                                                                        thecanvas =
                                                                            document.createElement("canvas");
                                                                        w = thecanvas.width = parseFloat(
                                                                            getComputedStyle(videoTag).width
                                                                        );
                                                                        h = thecanvas.height = parseFloat(
                                                                            getComputedStyle(videoTag).height
                                                                        );
                                                                        context = thecanvas.getContext("2d");
                                                                        context.drawImage(videoTag, 0, 0, w, h);
                                                                        dataURL = thecanvas.toDataURL();
                                                                        thecanvas.remove();
                                                                        videoTag.poster = dataURL;
                                                                    } catch (_) { }

                                                                    ct = videoTag.currentTime;
                                                                    paused = videoTag.paused;
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

                                                            case 37:
                                                                forceInstantQualitySwitch = false;
                                                                currentQuality.codec =
                                                                    qualityList[nextQualityIndex].codec;
                                                                currentQuality.quality =
                                                                    qualityList[nextQualityIndex].quality;

                                                                if (
                                                                    currentQualityIndex !== nextQualityIndex
                                                                ) {
                                                                    updateAutoCodecAndQuality(
                                                                        nextQualityIndex !== currentQualityIndex
                                                                    );
                                                                }

                                                                _context10.next = 43;
                                                                return new Promise(function (x) {
                                                                    return setTimeout(x, 500);
                                                                });

                                                            case 43:
                                                            case "end":
                                                                return _context10.stop();
                                                        }
                                                    }
                                                },
                                                    _loop);
                                            }
                                        );

                                    case 1:
                                        return _context11.delegateYield(_loop(), "t0", 2);

                                    case 2:
                                        _context11.next = 1;
                                        break;

                                    case 4:
                                    case "end":
                                        return _context11.stop();
                                }
                            }
                        }, _callee10);
                    })
                    )();

                    codecSelect.addEventListener("change", function (e) {
                        if (e.target.value === "auto") {
                            autoSelectCodec();
                        } else {
                            forceSelectCodec(e.target.value);
                        }

                        updateAutoCodecAndQuality(true);
                    });
                    qualitySelect.addEventListener("change", function (e) {
                        if (e.target.value === "auto") {
                            autoSelectQuality();
                        } else {
                            forceSelectQuality(currentQuality.codec, e.target.value);
                        }

                        updateAutoCodecAndQuality(false);
                    });

                case 41:
                case "end":
                    return _context12.stop();
            }
        }
    }, _callee11);
})
)();
