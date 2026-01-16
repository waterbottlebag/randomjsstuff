var soundOnOff, errorSound, correctSound, dropSound, audioBufferLoader, audioBufferList, audioCtx, soundOn = "on",
    useNativeAudio = !1,
    dontUseAudio = !1,
    errorSoundUrl = "/audio/wrong.mp3",
    correctSoundUrl = "/audio/correct.mp3",
    dropSoundUrl = "/audio/drop.mp3",
    audioFilesLoaded = 0;

function BufferLoader(context, urlList, callback) {
    this.context = context,
        this.urlList = urlList,
        this.onload = callback,
        this.bufferList = new Array,
        this.loadCount = 0
}

function initAudio() {
    "undefined" != typeof AudioContext ? audioCtx = new AudioContext : "undefined" != typeof webkitAudioContext ? audioCtx = new webkitAudioContext : "undefined" != typeof Audio ? useNativeAudio = !0 : dontUseAudio = !0,
        dontUseAudio || (useNativeAudio ? 0 != (errorSound = loadAudio(errorSoundUrl)) && (correctSound = loadAudio(correctSoundUrl),
            dropSound = loadAudio(dropSoundUrl)) : (navigator.userAgent.match(/Opera|OPR\//) && (errorSoundUrl = "/audio/wrong.ogg",
                correctSoundUrl = "/audio/correct.ogg",
                dropSoundUrl = "/audio/drop.ogg"),
            (audioBufferLoader = new BufferLoader(audioCtx, [errorSoundUrl, correctSoundUrl, dropSoundUrl], finishedLoadingAudioWebAPI)).load()))
}

function finishedLoadingAudioWebAPI(bufferList) {
    audioBufferList = bufferList
}

function loadAudio(uri) {
    try {
        var audio = new Audio;
        return audio.addEventListener("canplaythrough", isAudioLoaded, !1),
            audio.src = uri,
            audio
    } catch (e) {
        return !(dontUseAudio = !0)
    }
}

function isAudioLoaded() {
    2 == ++audioFilesLoaded && (lastTime = Date.now())
}

function playCorrectSound() {
    moreThanOneItemCorrect = !0,
        "on" != soundOn || dontUseAudio || (useNativeAudio ? correctSound.play() : ((correctSound = audioCtx.createBufferSource()).buffer = audioBufferList[1],
            correctSound.connect(audioCtx.destination),
            correctSound.start(0)))
}

function playFaultySound() {
    "on" != soundOn || dontUseAudio || (useNativeAudio ? errorSound.play() : ((errorSound = audioCtx.createBufferSource()).buffer = audioBufferList[0],
        errorSound.connect(audioCtx.destination),
        errorSound.start(0)))
}

function playDropSound() {
    "on" != soundOn || dontUseAudio || (useNativeAudio ? dropSound.play() : ((dropSound = audioCtx.createBufferSource()).buffer = audioBufferList[2],
        dropSound.connect(audioCtx.destination),
        dropSound.start(0)))
}

function GameDot(id, posX, posY, dotText) {
    this.id = id,
        this.x = posX,
        this.y = posY,
        this.question = dotText,
        this.isAnswered = 0
}

function Shape(id, data, question) {
    this.id = id,
        this.data = data,
        this.question = question,
        this.isAnswered = 0
}

function SlideMCQuestion(id, origin, ordinal, backgroundOrdinal, question, answerCorrect, answer2, answer3, answer4, answer5, answer6) {
    this.id = id,
        this.origin = origin,
        this.ordinal = ordinal,
        this.backgroundOrdinal = backgroundOrdinal,
        this.question = question,
        this.answerCorrect = answerCorrect,
        this.answer2 = answer2,
        this.answer3 = answer3,
        this.answer4 = answer4,
        this.answer5 = answer5,
        this.answer6 = answer6,
        this.answers = [],
        this.userAnsweredWithId = -1,
        this.setupAnswer(this.answerCorrect),
        this.setupAnswer(this.answer2),
        this.setupAnswer(this.answer3),
        this.setupAnswer(this.answer4),
        this.setupAnswer(this.answer5),
        this.setupAnswer(this.answer6),
        shuffle(this.answers)
}

function CountDownTimer(duration, granularity) {
    this.duration = duration,
        this.granularity = granularity || 100,
        this.tickFtns = [],
        this.running = !1,
        this.countDown = !0,
        this.totalRunningTime = 0
}

function format(minutes, seconds, tenths) {
    var display;
    if (!timer.expired() || !gameRunning)
        return minutes = minutes < 10 && 0 < minutes ? "0" + minutes : minutes,
            seconds = seconds < 10 ? "0" + seconds : seconds,
            display = document.getElementById("timer"),
            gameOver || (display.textContent = minutes + ":" + seconds + "." + tenths),
            minutes + ":" + seconds + "." + tenths;
    setGameOver()
}

function Question(id, text) {
    this.id = id,
        this.text = text.replace(/"/g, '"'),
        this.answer = ""
}
BufferLoader.prototype.loadBuffer = function(url, index) {
        var request = new XMLHttpRequest,
            loader = (request.open("GET", url, !0),
                request.responseType = "arraybuffer",
                this);
        request.onload = function() {
                loader.context.decodeAudioData(request.response, function(buffer) {
                    buffer ? (loader.bufferList[index] = buffer,
                        ++loader.loadCount == loader.urlList.length && loader.onload(loader.bufferList)) : alert("error decoding file data: " + url)
                }, function(error) {})
            },
            request.onerror = function() {
                alert("BufferLoader: XHR error")
            },
            request.send()
    },
    BufferLoader.prototype.load = function() {
        for (var i = 0; i < this.urlList.length; ++i)
            this.loadBuffer(this.urlList[i], i)
    },
    GameDot.prototype.getHTML = function() {
        var node = document.createElement("DIV"),
            html = (node.setAttribute("id", this.id),
                node.setAttribute("class", "dot"),
                node.setAttribute("data-x", this.x),
                node.setAttribute("data-y", this.y),
                node.setAttribute("data-text", this.question.replace(/"/g, '"')),
                node.setAttribute("data-ans", this.isAnswered),
                '<div class="svg-container">'),
            html = '<div class="svg-container"><div id="h-' + this.id + '" role="presentation">';
        return html = (html += '<svg version="1.1" viewBox="0 0 14 14" preserveAspectRatio="xMinYMin meet" class="dotty">') + '<circle id="dot-' + this.id + '-bod" class="dotBod" cx="7" cy="7" r="6" stroke-width="2" />',
            node.innerHTML = html += "</svg></div></div>",
            node
    },
    Shape.prototype.getHTML = function() {
        var data = this.data.split(","),
            html = "";
        html = (html = html + '<path id="' + this.id + '" data-text="' + this.question.replace(/"/g, '"') + '" data-x="' + data[0] + '" data-y="' + data[1] + '" data-ans="0" class="shapeBody" d="M') + data[0] + " " + data[1];
        for (var counter = 0, i = 2; i < data.length; i++)
            0 == counter && (html += " L"),
            html = html + " " + data[i],
            2 == (counter += 1) && (counter = 0);
        return html += 'z" />'
    },
    SlideMCQuestion.prototype.setupAnswer = function(answer) {
        "[N/A]" != answer && "N/A" != answer && this.answers.push(answer)
    },
    SlideMCQuestion.prototype.isCorrect = function(id) {
        return this.answers[id] == this.answerCorrect
    },
    CountDownTimer.prototype.start = function() {
        var start, that, diff, obj;
        this.running || (this.running = !0,
            sLendTxrtst = Date.now(),
            start = Date.now(),
            that = this,
            function timer() {
                return diff = that.countDown ? that.duration - ((Date.now() - start) / 100 | 0) : (Date.now() - start) / 100 | 0,
                    0 < (that.totalRunningTime = diff) && 0 == that.running ? (diff = 0,
                        that.running = !1) : (0 <= diff ? setTimeout(timer, that.granularity) : (diff = 0,
                            that.running = !1),
                        obj = CountDownTimer.parse(diff),
                        void that.tickFtns.forEach(function(ftn) {
                            ftn.call(this, obj.minutes, obj.seconds, obj.tenths)
                        }, that))
            }())
    },
    CountDownTimer.prototype.up = function() {
        this.countDown = !1
    },
    CountDownTimer.prototype.stop = function() {
        this.running = !1
    },
    CountDownTimer.prototype.onTick = function(ftn) {
        return "function" == typeof ftn && this.tickFtns.push(ftn),
            this
    },
    CountDownTimer.prototype.expired = function() {
        return !this.running
    },
    CountDownTimer.parse = function(tenths) {
        return {
            minutes: tenths / 600 << 0 | 0,
            seconds: 0 | Math.floor(tenths / 10 % 60),
            tenths: tenths % 10 | 0
        }
    };
var mT = getMetaToken(),
    gnon = 0,
    tokenId = 0,
    gameId = 0,
    tournamentId = 0,
    listId = 0,
    gameRunning = !1,
    gameOver = !1,
    score = 0,
    runningTime = 0,
    sLendTxrtst = 0,
    sLendTxrtss = 0,
    que = [],
    allQuestions = [],
    correctAnswers = 0,
    faultyAnswers = 0,
    answerTrials = 0,
    answerCountWhenDone = 0,
    shapeAlpha = 90,
    groupApply = 0,
    gameType = "QUIZ",
    hidePercentage = 0,
    surface = 0,
    tb = 0,
    dwtts = !1,
    fixedTime = 0,
    showItemHint = !0,
    fixedItemCount = 0,
    groupItems = !0,
    allowedAnswerTrials = 0,
    gameWidth = 0,
    gameHeight = 0,
    allowNavigation = 0,
    timer = new CountDownTimer(fixedTime),
    tokenSent = 0,
    moreThanOneItemCorrect = !1,
    hsUrl = l10nBaseUri + "/api/1.0/insert-score-and-time",
    tUrl = l10nBaseUri + "/api/1.0/insert-token";

function setupMeta(meta) {
    0 < (fixedTime = 10 * meta[1]) ? timer = new CountDownTimer(fixedTime) : timer.up();
    var timeObj = CountDownTimer.parse(fixedTime);
    format(timeObj.minutes, timeObj.seconds, timeObj.tenths),
        0 == meta[2] && (showItemHint = !1),
        fixedItemCount = meta[3],
        0 == meta[4] && (groupItems = !1),
        allowedAnswerTrials = meta[5],
        gameWidth = meta[6],
        gameHeight = meta[7],
        gameId = meta[8],
        tournamentId = meta[9],
        listId = meta[10],
        soundOn = meta[11],
        shapeAlpha = meta[12],
        groupApply = meta[13],
        languageId = meta[14]
}

function setupCss(data) {
    var style = document.createElement("style");
    style.type = "text/css",
        style.innerHTML = data.cssData,
        document.getElementsByTagName("head")[0].appendChild(style)
}

function initGame(type) {
    switch (gameType = type) {
        case "QUIZ":
            initQuizGame();
            break;
        case "VQUIZ":
            initVQuizGame();
            break;
        case "MC":
            initMCGame();
            break;
        case "TYPING":
            initTypingGame();
            break;
        case "MATCH":
            initMatchGame();
            break;
        case "TEXT":
            initTextGame();
            break;
        case "ORDER":
            initOrderGame();
            break;
        case "SLIDEMC":
            initSlideMCGame()
    }
    resizeGame()
}

function startGame(event) {
    switch (window.onresize = null,
        initAudio(),
        document.getElementById("skipGame").style.visibility = "hidden",
        gameType) {
        case "QUIZ":
        case "VQUIZ":
            startQuizGame(event);
            break;
        case "TEXT":
            startTextGame(event);
            break;
        case "MC":
            startMCGame(event);
            break;
        case "TYPING":
            startTypingGame(event);
            break;
        case "MATCH":
            startMatchGame(event);
            break;
        case "SLIDEMC":
            startSlideMCGame(event);
            break;
        case "ORDER":
            startOrderGame(event)
    }
}

function placeStart() {
    var s;
    0 < groupApply && 0 < tournamentId ? showGroupApply() : ((s = document.getElementById("startGame")).addEventListener("click", startGame),
        s.style.visibility = "visible",
        document.getElementById("skipGame").style.visibility = "visible")
}

function showGroupApply() {
    var s = document.getElementById("group-application");
    null !== s && (s.style.display = "block")
}

function cmpa() {
    return !0
}

function checkSngs() {
    sngsaa && sngs()
}

function sngs() {
    return !1
}

function toggleNMElements(s) {
    var qbox, cln, fWidth = getElementWidth("quizsurface");
    s || ((s = document.getElementById("the-dashboard")).setAttribute("class", "dashboard running"),
        document.getElementById("qcounter").setAttribute("class", "question-counter running"),
        document.getElementById("gameguesswrong").setAttribute("class", "guess-wrong running"),
        document.getElementById("gameguesscorrect").setAttribute("class", "guess-correct running"),
        document.getElementById("gameguessleft").setAttribute("class", "guess-left running"),
        document.getElementById("stimer").setAttribute("class", "scoretimer running"),
        document.getElementById("score").setAttribute("class", "dash-score running"),
        document.getElementById("timer").setAttribute("class", "dash-timer running"),
        document.getElementById("gamequit").setAttribute("class", "quit-game running"),
        (qbox = document.getElementById("question-box")).setAttribute("class", "question-box running"),
        fWidth < 700 && ("QUIZ" == gameType || "VQUIZ" == gameType ? (s.appendChild(qbox),
            qbox.style.width = "100%") : "MATCH" != gameType && "MC" != gameType && "SLIDEMC" != gameType && "TYPING" != gameType && "ORDER" != gameType || (qbox.style.display = "none")),
        "TEXT" == gameType && (qbox.id = "old-question-box",
            (cln = qbox.cloneNode(!0)).id = "question-box",
            s.insertAdjacentElement("afterend", cln),
            cln.style.width = "100%",
            cln.style.margin = "0",
            fWidth < 700 ? qbox.style.display = "none" : qbox.style.opacity = 0,
            tb = cln,
            s = (s = '<div class="textquiz__question">') + (1 == allowNavigation ? '<div class="left-question"><a href="#" id="go-back">&laquo;</a></div><div id="text-question-content" class="text-question"></div><div class="right-question"><a href="#" id="go-forward">&raquo;</a></div>' : '<div id="text-question-content" class="text-question"></div>') + "</div>",
            qbox.setAttribute("class", "question-box running text-game"),
            tb.innerHTML = s))
}

function toggleNMElements_old(s) {
    var fWidth = getElementWidth("quizsurface"),
        disp = "block";
    if (!s) {
        s = document.getElementById("the-dashboard");
        s.setAttribute("class", "dashboard running"),
            document.getElementById("qcounter").setAttribute("class", "question-counter running"),
            document.getElementById("gameguesswrong").setAttribute("class", "guess-wrong running"),
            document.getElementById("gameguesscorrect").setAttribute("class", "guess-correct running"),
            document.getElementById("gameguessleft").setAttribute("class", "guess-left running");
        document.getElementById("stimer").setAttribute("class", "scoretimer running");
        var scoreScore = document.getElementById("score");
        scoreScore.setAttribute("class", "dash-score running"),
            document.getElementById("timer").setAttribute("class", "dash-timer running");
        document.getElementById("gamequit").setAttribute("class", "quit-game running");
        var cln, pgn, qbox = document.getElementById("question-box");
        if (qbox.setAttribute("class", "question-box running"),
            "TEXT" == gameType && (qbox.id = "old-question-box",
                (cln = qbox.cloneNode(!0)).id = "question-box",
                s.insertAdjacentElement("afterend", cln),
                cln.style.width = "100%",
                qbox.style.background = "#fff",
                qbox.style.color = "#fff",
                pgn = (pgn = '<div class="textquiz__question">') + (1 == allowNavigation ? '<div class="left-question"><a href="#" id="go-back">&laquo;</a></div><div id="text-question-content" class="text-question"></div><div class="right-question"><a href="#" id="go-forward">&raquo;</a></div>' : '<div id="text-question-content" class="text-question"></div>') + "</div>",
                (tb = cln).setAttribute("class", "question-box running text-game"),
                tb.innerHTML = pgn),
            700 <= fWidth)
            return;
        "TEXT" != gameType && "MATCH" != gameType && "TYPING" != gameType && "MC" != gameType ? (s.appendChild(qbox),
                qbox.style.width = "100%") : (qbox.style.display = "none",
                tb.style.margin = "0"),
            "TYPING" == gameType && (cln = document.getElementById("tdim"),
                s.insertAdjacentHTML("beforeend", '<row id="trow"><div id="tgrid"></div></div>'),
                (pgn = document.getElementById("tgrid")).appendChild(cln),
                pgn.style.padding = 0,
                pgn.style.fontSize = "1rem",
                document.getElementById("typingbody").style.fontSize = "0.8rem"),
            toggleDashboardRunning(!0),
            1 == hidePercentage && (scoreScore.style.visibility = "visible",
                scoreScore.style.color = "#849CCA"),
            disp = "none"
    }
    for (els = document.getElementsByClassName("nm"),
        i = 0; i < els.length; i++)
        els[i].style.display = disp
}

function toggleDashboardRunning(fixed) {
    getElementWidth("quizsurface")
}

function updateDashboardHeight() {
    getElementWidth("quizsurface")
}

function setGameOver() {
    if (gameOver)
        return !1;
    gameOver = !(gameRunning = !1),
        finishGame()
}

function shallWeFinish() {
    if (0 == allowedAnswerTrials)
        return correctAnswers == answerCountWhenDone ? (finishGame(),
            !0) : (maybeSendToken(),
            !1);
    if (-1 == allowedAnswerTrials) {
        if (faultyAnswers + correctAnswers == answerCountWhenDone)
            return finishGame(),
                !0;
        maybeSendToken()
    } else if (0 < allowedAnswerTrials) {
        if (allowedAnswerTrials <= faultyAnswers)
            return finishGame(),
                !0;
        if (correctAnswers == answerCountWhenDone)
            return finishGame(),
                !0;
        if (("MC" == gameType || "SLIDEMC" == gameType || "ORDER" == gameType) && faultyAnswers + correctAnswers == answerCountWhenDone)
            return finishGame(),
                !0;
        maybeSendToken()
    }
    return 0 != fixedTime && timer.totalRunningTime >= 10 * fixedTime && (finishGame(),
        !0)
}

function maybeSendToken() {
    var rt;
    answerCountWhenDone < 5 || moreThanOneItemCorrect && 0 == tokenSent && (rt = timer.totalRunningTime,
        100 < (rt = 0 != fixedTime ? fixedTime - rt : rt)) && sendToken()
}

function sendToken() {
    tokenSent = 1;
    var request = new XMLHttpRequest,
        data = (request.open("POST", tUrl, !0),
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
            "id=" + gameId + "&p=80&rt=" + timer.totalRunningTime + "&nonce=" + gnon + "&csrf=" + mT);
    request.send(data),
        request.onload = function() {
            var data;
            200 <= request.status && request.status < 400 && "" != request.responseText && (data = JSON.parse(request.responseText),
                tokenId = data.token_id)
        }
}

function scrollHSIntoView() {
    return "undefined" != typeof itapcoafg && !itapcoafg && "undefined" != typeof adngin && (adngin.queue.push(function() {
            adngin.cmd.startAuction(["adhesive"])
        }),
        !0)
}

function gcw() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth)
}

function isElementInViewport(el) {
    el = document.getElementById(el).getBoundingClientRect();
    return 0 <= el.bottom && 0 <= el.right && el.top <= (window.innerHeight || document.documentElement.clientHeight) && el.left <= (window.innerWidth || document.documentElement.clientWidth)
}

function caveIn(event) {
    event.preventDefault(),
        gameRunning = !(gameOver = !0),
        timer.stop(),
        scrollHSIntoView();
    document.getElementById("hsdialog").setAttribute("class", "nhsdialog bounceIn to-be-closed running"),
        document.getElementById("nhsHeading").textContent = document.getElementById("nhsHeading").getAttribute("data-dnf"),
        document.getElementById("game_placement").textContent = document.getElementById("game_placement").getAttribute("data-dnf");
    for (var event = document.getElementById("hs-shoutout"), pointboxes = (event.textContent = event.getAttribute("data-dnf"),
            document.getElementById("score_row").setAttribute("class", "nhs__body__figures score_bg_fail"),
            document.getElementById("gamednf").setAttribute("style", "display: inherit"),
            document.getElementById("dnfalert").setAttribute("style", "display: inherit"),
            document.getElementById("pcard_dailypoints_e").className = "blink",
            document.getElementsByClassName("pcard")), i = pointboxes.length - 1; 0 <= i; i--)
        5 != i && (pointboxes[i].style.background = "var(--pcard-bg)",
            pointboxes[i].style.color = "var(--regular-text)");
    checkGameLive();
    document.getElementById("gamequit").style.display = "none";
    event = document.getElementById("gamerestart");
    return event.setAttribute("class", "restart-game running"),
        toggleDashboardRunning(!(event.style.display = "inherit")),
        postGameHooks(),
        !1
}

function checkGameLive() {
    return 1 == document.getElementById("hsdialog").getAttribute("data-gl") || (document.getElementById("gamenolive").setAttribute("class", "ctn__nonlive showme"),
        document.getElementById("pointsrow").setAttribute("class", "hide"),
        !1)
}

function finishGame() {
    gameRunning = !(gameOver = !0),
        scrollHSIntoView(),
        resetHint(),
        timer.stop(),
        sLendTxrtss = Date.now(),
        runningTime = Math.round((sLendTxrtss - sLendTxrtst) / 100);
    var timeObj = CountDownTimer.parse(runningTime),
        zM = timeObj.minutes < 10 && 0 < timeObj.minutes ? "0" + timeObj.minutes : timeObj.minutes,
        zS = timeObj.seconds < 10 ? "0" + timeObj.seconds : timeObj.seconds;
    document.getElementById("timer").textContent = zM + ":" + zS + "." + timeObj.tenths,
        document.getElementById("hsdialog").setAttribute("class", "nhsdialog bounceIn to-be-closed running"),
        _fillScoreRow(),
        insertScoreAndTime(gameId, tournamentId, listId, runningTime, Math.round(100 * getScore()), tokenId);
    document.getElementById("gamequit").style.display = "none";
    zM = document.getElementById("gamerestart");
    zM.setAttribute("class", "restart-game running"),
        zM.style.display = "inherit",
        document.getElementById("gameguesscorrect").style.visibility = "visible",
        document.getElementById("gameguesswrong").style.visibility = "visible",
        document.getElementById("score").style.visibility = "visible",
        postGameHooks()
}

function streakCheck() {
    var streakEl = document.getElementById("streak-counter");
    return null != streakEl && (showStreakAnimation((parseInt(streakEl.dataset.streak, 10) || 0) + 1),
        !0)
}

function _fillPointsRow() {
    var hsd = document.getElementById("hsdialog"),
        hpif = (hsd.getAttribute("data-uid"),
            hsd.getAttribute("data-hpif")),
        gp = hsd.getAttribute("data-gp"),
        dp = hsd.getAttribute("data-dp"),
        dpn = hsd.getAttribute("data-dpn"),
        tp = hsd.getAttribute("data-tp"),
        tpn = hsd.getAttribute("data-tpn"),
        dlr = hsd.getAttribute("data-dlr"),
        hsd = hsd.getAttribute("data-dlrn");
    100 * getScore() == 100 && 0 == hpif ? (new CountUp("pcard_gamepoints", gp, 0).start(),
        new CountUp("onPage_pcard_gamepoints", gp, 0).start(),
        dpn < 1e4 && (new CountUp("pcard_dailypoints", dp, dpn).start(),
            new CountUp("sb__points", dp, dpn).start()),
        tpn < 1e4 && new CountUp("pcard_totalpoints", tp, tpn).start(),
        new CountUp("pcard_leaderboard_rank", dlr, hsd).start(displayPointEnticements),
        new CountUp("sb__rank", dlr, hsd).start(displayPointEnticements)) : displayPointEnticements()
}

function displayPointEnticements() {
    var dpen, pte, plre, pde, hsd = document.getElementById("hsdialog"),
        hpif = (hsd.getAttribute("data-uid"),
            hsd.getAttribute("data-hpif")),
        hsd = (hsd.getAttribute("data-gp"),
            hsd.getAttribute("data-dp"),
            hsd.getAttribute("data-dpn"),
            hsd.getAttribute("data-tp"),
            hsd.getAttribute("data-tpn"),
            hsd.getAttribute("data-dlr"),
            hsd.getAttribute("data-dlrn"),
            hsd.getAttribute("data-gpefs")),
        gamepointse = document.getElementById("pcard_gamepoints_e");
    100 * getScore() == 100 && 0 == hpif ? (gamepointse.innerHTML = hsd,
        document.getElementById("hsGamePoints").className = "pcard gamepointsgotten",
        hpif = document.getElementById("tpen"),
        hsd = document.getElementById("dlren"),
        dpen = document.getElementById("dpen"),
        pte = document.getElementById("pcard_totalpoints_e"),
        plre = document.getElementById("pcard_leaderboard_rank_e"),
        (pde = document.getElementById("pcard_dailypoints_e")).className = "blink",
        pte.innerHTML = hpif.innerHTML,
        plre.innerHTML = hsd.innerHTML,
        pde.innerHTML = dpen.innerHTML) : gamepointse.className = "blink"
}

function _fillScoreRow() {
    var numAnim = new CountUp("nhsLatestScore", 0, 100 * getScore()),
        numAnim = (numAnim.error || numAnim.start(addScoreRowFlare),
            document.getElementById("nhsLatestTime")),
        timeObj = CountDownTimer.parse(runningTime);
    return numAnim.textContent = format(timeObj.minutes, timeObj.seconds, timeObj.tenths),
        document.getElementById("nhsLatestPlacement").textContent = "--",
        100 == 100 * getScore() && (W = document.getElementById("score_row").offsetWidth,
            H = 2.1 * document.getElementById("score_row").offsetHeight),
        !0
}

function addScoreRowFlare() {
    _fillPointsRow();
    var rand, sc = 100 * getScore();
    sc < 50 ? (document.getElementById("score_row").setAttribute("class", "nhs__body__figures score_bg_fail"),
        document.getElementById("gamednf").setAttribute("style", "display: inherit")) : 100 == sc ? (rand = Math.floor(7 * Math.random()),
        document.getElementById("hs-shoutout").textContent = document.getElementById("gameperfect").getAttribute("data-sentence" + rand),
        document.getElementById("hs-shoutout").setAttribute("class", "shoutout success"),
        document.getElementById("gameperfect").setAttribute("style", "display: inherit"),
        document.getElementById("gameperfect").setAttribute("class", "blink"),
        canvas.width = W,
        canvas.height = H,
        Draw(),
        startCanvasFade()) : (document.getElementById("gamenotbad").setAttribute("style", "display: inherit; margin-left: -50px;"),
        rand = Math.floor(7 * Math.random()),
        document.getElementById("good-work").textContent = document.getElementById("tavla").getAttribute("data-sentence" + rand))
}

function updateScore() {
    score = getScore(),
        document.getElementById("score").textContent = Math.round(100 * score) + "%"
}

function getScore() {
    return "MC" != gameType && "SLIDEMC" != gameType && "ORDER" != gameType && -1 < allowedAnswerTrials ? correctAnswers / (+answerCountWhenDone + +faultyAnswers) : correctAnswers / +answerCountWhenDone
}

function updateCorrectCounter() {
    var gc = document.getElementById("guesses-correct");
    gc.setAttribute("class", "countUpdateDefault"),
        gc.offsetWidth = gc.offsetWidth,
        gc.setAttribute("class", "correctCountUpdate"),
        gc.textContent = correctAnswers
}

function updateFaultyCounter() {
    var gw = document.getElementById("guesses-wrong");
    gw.setAttribute("class", "countUpdateDefault"),
        gw.offsetWidth = gw.offsetWidth,
        gw.setAttribute("class", "faultyCountUpdate"),
        gw.textContent = faultyAnswers
}

function updateRemainingGuessesCount() {
    var g = document.getElementById("guesses-left"),
        t = 0,
        t = 0 == allowedAnswerTrials ? +answerCountWhenDone - correctAnswers : -1 == allowedAnswerTrials ? +answerCountWhenDone - faultyAnswers - correctAnswers : +allowedAnswerTrials - faultyAnswers;
    g.textContent = t = t < 0 ? 0 : t
}

function insertScoreAndTime(id, tid, lid, rt, p, token) {
    if (!checkGameLive())
        return !1;
    isNumber(p) || (p = 0);
    var request = new XMLHttpRequest,
        id = (request.open("POST", hsUrl, !0),
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
            "id=" + id + "&tid=" + tid + "&lid=" + lid + "&rt=" + rt + "&p=" + p + "&token=" + token + "&nonce=" + gnon + "&csrf=" + mT);
    request.send(id),
        request.onload = function() {
            var data, tgamecount, tavgscore, trank;
            200 <= request.status && request.status < 400 && (data = JSON.parse(request.responseText),
                document.getElementById("nhsLatestPlacement").textContent = data.user_position_this_time,
                1 == data.ath && document.getElementById("athalert").setAttribute("class", "ath-alert-showme"),
                0 < tournamentId && (tgamecount = document.getElementById("tgamecount"),
                    tavgscore = document.getElementById("tavgscore"),
                    trank = document.getElementById("trank"),
                    tgamecount.textContent = data.tp,
                    tavgscore.textContent = data.ts,
                    trank.textContent = data.tr),
                100 == data.to && (swTC(data.tos, "tg1"),
                    cON(data.tos, data.to)),
                200 == data.to && (swTC(data.tos, "tg2"),
                    cON(data.tos, data.to)),
                300 == data.to && (swTC(data.tos, "tg3"),
                    cDTF(data.tos)),
                1 == data.new_streak) && streakCheck()
        }
}

function swTC(v, x) {
    var xd = document.getElementById(x),
        dscr = xd.getElementsByClassName("dscr"),
        s = +xd.getAttribute("data-score");
    return 100 == v ? (xd.classList.add("tg__finished"),
            dscr[0].classList.add("played-full"),
            dscr[0].classList.remove("played-some"),
            s < v && sTCC(x, "var(--green)", !0)) : s < v && (xd.classList.add("tg__started"),
            sTCC(x, "var(--yellow)", !1)),
        s < v && (dscr[0].innerText = v + "%"),
        !0
}

function cON(v, x) {
    var a = document.getElementById("rl2"),
        b = document.getElementById("rl3"),
        x = 100 == x ? a : b;
    100 == v && null !== x && (a = x.getElementsByClassName("row__locked_lock"),
        b = x.getElementsByClassName("row__locked_text"),
        a[0].classList.add("unlocked"),
        b[0].innerText = b[0].getAttribute("data-txt"),
        b[0].classList.add("unlocked"),
        b[0].classList.add("blinkme"),
        b[0].addEventListener("click", gttrple))
}

function cDTF(v) {
    var xd;
    100 == v && ((xd = document.getElementById("tg3")).getElementsByClassName("dscr"),
        +xd.getAttribute("data-score") < v) && (xd = document.getElementsByClassName("triple__icon_hs"),
        v = document.getElementsByClassName("triple__icon_fan"),
        xd[0].style.display = "flex",
        xd[0].classList.add("turn"),
        v[0].style.display = "block",
        v[0].classList.add("blink"),
        xd = document.getElementById("ftstr"),
        v = document.getElementById("ftstrfev"),
        null != xd && (xd.innerText = +xd.innerText + 1),
        null != v) && (v.innerText = +v.innerText + 1)
}

function gttrple(e) {
    window.location = l10nBaseUri + "/triple"
}

function sTCC(x, c, b) {
    var cn = "t100",
        a = ("tg2" == x ? cn = "t200" : "tg3" == x && (cn = "t300"),
            document.getElementsByClassName(cn));
    if (0 < a.length)
        for (i = 0; i < a.length; i++)
            a[i].style.fill = c,
            b && a[i].classList.add("animt");
    var astn, x = document.getElementById("ftpc");
    null != x && (astn = +x.innerText,
        "t100" == cn && astn < 1 ? x.innerText = "1" : "t200" == cn && astn < 2 ? x.innerText = "2" : "t300" == cn && astn < 3 && (x.innerText = "3"))
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(+n)
}

function formatSkillPoints(points) {
    return points < 1e4 ? points : points < 1e5 ? pointsRound(points / 1e3, 1) + "k" : points < 1e6 ? round(points / 1e3) + "k" : points < 1e8 ? round(points / 1e6, 1) + "M" : points
}

function pointsRound(value, precision) {
    precision = Math.pow(10, precision || 0);
    return Math.round(value * precision) / precision
}

function shuffle(array) {
    for (var temporaryValue, randomIndex, currentIndex = array.length; 0 !== currentIndex;)
        randomIndex = Math.floor(Math.random() * currentIndex),
        temporaryValue = array[--currentIndex],
        array[currentIndex] = array[randomIndex],
        array[randomIndex] = temporaryValue;
    return array
}

function hookupVolumeOnOff() {
    null !== document.getElementById("volumeonoff") && document.getElementById("volumeonoff").addEventListener("click", function(e) {
        toggleVolume(e)
    }, !1)
}

function toggleVolume(event) {
    event.preventDefault();
    var event = document.getElementById("volumeonoff").getAttribute("data-id"),
        request = new XMLHttpRequest,
        event = l10nBaseUri + "/api/1.0/sound?sound_on_off=" + event;
    return request.open("GET", event, !0),
        request.send(),
        !(request.onload = function() {
            200 <= request.status && request.status < 400 && (document.getElementById("volumeonoff").innerHTML = request.responseText,
                soundOn = "on" == soundOn ? "off" : "on")
        })
}

function getElementWidth(id) {
    return document.getElementById(id).offsetWidth
}

function setElementHeight(id, width) {
    width *= 550 / 700;
    return document.getElementById(id).style.height = width + "px",
        width
}

function getFixedArrayCountWithGroups(a, count) {
    var t = [];
    t.push(a[0]);
    for (var x = 1; x < a.length; x++)
        if (contains(t, a[x].text) || t.push(a[x]),
            t.length == count)
            return t;
    return t
}

function getUniqueArrayCount(a) {
    var t = [];
    t.push(a[0]);
    for (var x = 1; x < a.length; x++)
        contains(t, a[x].text) || t.push(a[x]);
    return t.length
}

function contains(a, text) {
    for (var i = 0; i < a.length; i++)
        if (a[i].text === text)
            return !0;
    return !1
}

function resizeGame() {
    switch (gameType) {
        case "QUIZ":
            resizeQuizGame();
            break;
        case "VQUIZ":
            resizeVQuizGame();
            break;
        case "MC":
        case "TYPING":
        case "TEXT":
        case "ORDER":
        case "MATCH":
            resizeCommonGame();
            break;
        case "SLIDEMC":
            resizeSlideMCGame()
    }
}

function resizeCommonGame() {
    var fWidth = getElementWidth("quizsurface");
    setElementHeight("quizsurface", fWidth = 700 <= fWidth ? 700 : fWidth)
}
var W = 0,
    H = 0,
    canvas = document.getElementById("cgratscanvas"),
    context = canvas.getContext("2d"),
    maxConfettis = 30,
    particles = [],
    drawCounter = 0,
    possibleColors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

function confettiParticle() {
    this.x = Math.random() * W,
        this.y = Math.random() * H - H,
        this.r = randomFromTo(11, 33),
        this.d = Math.random() * maxConfettis + 11,
        this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)],
        this.tilt = Math.floor(33 * Math.random()) - 11,
        this.tiltAngleIncremental = .07 * Math.random() + .05,
        this.tiltAngle = 0,
        this.draw = function() {
            return context.beginPath(),
                context.lineWidth = this.r / 2,
                context.strokeStyle = this.color,
                context.moveTo(this.x + this.tilt + this.r / 3, this.y),
                context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5),
                context.stroke()
        }
}

function Draw() {
    var results = [];
    drawCounter < 300 && (drawCounter++,
            requestAnimationFrame(Draw)),
        context.clearRect(0, 0, W, window.innerHeight);
    for (var i = 0; i < maxConfettis; i++)
        results.push(particles[i].draw());
    for (var particle = {}, i = 0; i < maxConfettis; i++)
        (particle = particles[i]).tiltAngle += particle.tiltAngleIncremental,
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2,
        particle.tilt = 15 * Math.sin(particle.tiltAngle - i / 3),
        particle.y <= H && 0,
        (particle.x > W + 30 || particle.x < -30 || particle.y > H) && (particle.x = Math.random() * W,
            particle.y = -30,
            particle.tilt = Math.floor(10 * Math.random()) - 20);
    return results
}
for (var i = 0; i < maxConfettis; i++)
    particles.push(new confettiParticle);

function startCanvasFade() {
    setTimeout(function() {
        document.getElementById("cgratscanvas").setAttribute("class", "fadeMeOut"),
            removeCanvas()
    }, 2e3)
}

function removeCanvas() {
    setTimeout(function() {
        document.getElementById("cgratscanvas").setAttribute("style", "display: none;")
    }, 1e3)
}

function postGameHooks() {
    "TYPING" === gameType && postFinishTypingGame()
}

function invertColor(hex) {
    if (6 !== (hex = 3 === (hex = 0 === hex.indexOf("#") ? hex.slice(1) : hex).length ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] : hex).length)
        throw new Error("Invalid HEX color.");
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        hex = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(hex)
}

function padZero(str, len) {
    return len = len || 2,
        (new Array(len).join("0") + str).slice(-len)
}

function rgb2hex(rgb) {
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2)
    }
    return "#" + hex((rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/))[1]) + hex(rgb[2]) + hex(rgb[3])
}

function jsguid() {
    function s4() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
}
document.addEventListener("DOMContentLoaded", function(event) {
    setupMeta(document.getElementById("start").getAttribute("data-meta").split("|")),
        initGame(document.getElementById("start").getAttribute("data-type")),
        hookupVolumeOnOff(),
        window.onresize = resizeGame
});
var intervalId1, intervalId2, intervalId3, intervalId4, intervalId5, colCount = 5,
    col1 = [],
    col2 = [],
    col3 = [],
    col4 = [],
    col5 = [],
    isDummy = [],
    cellsClicked = 0,
    currentCol1 = "",
    currentCol2 = "",
    currentCol3 = "",
    currentCol4 = "",
    currentCol5 = "",
    hasHeading = !1,
    currentRow1 = -1,
    currentRow2 = -1,
    currentRow3 = -1,
    currentRow4 = -1,
    currentRow5 = -1,
    rWrong = 250,
    gWrong = 83,
    bWrong = 83,
    rUnselected = 238,
    gUnselected = 238,
    bUnselected = 238,
    rTransition = 0,
    gTransition = 0,
    bTransition = 0,
    displayInline = !1,
    wdt = "twocol",
    fts = "twocolitem",
    concatenatedArray = [];

function initMatchGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-matchquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                for (var data = JSON.parse(request.responseText), answerArea = (gnon = data.nonce,
                        colCount = data.game.column_count,
                        12 < data.items.length && (displayInline = !0),
                        '<div id="answerArea" class="answer-area" data-ans="1"><div class="match__quiz">'), i = 0; i < colCount; i++)
                    answerArea = answerArea + '<div id="game-column-' + (i + 1) + '" class="match-game-column"></div>';
                surface.insertAdjacentHTML("afterbegin", answerArea += "</div></div>");
                var itemLength = data.items.length;
                for (i = 0; i < itemLength; i++)
                    0 < data.items[i].ordinal ? (col1.push(data.items[i].col1),
                        col2.push(data.items[i].col2),
                        col3.push(data.items[i].col3),
                        col4.push(data.items[i].col4),
                        col5.push(data.items[i].col5),
                        isDummy.push(data.items[i].dummy),
                        0 == data.items[i].dummy && (answerCountWhenDone += 1)) : 0 == data.items[i].ordinal && (hasHeading = !0);
                0 < fixedItemCount && fixedItemCount < answerCountWhenDone && setFixedMatchItemCount(answerCountWhenDone = fixedItemCount),
                    0 < allowedAnswerTrials && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                    fillColumn(col1.slice(), 1, data.game.mc_random_questions),
                    fillColumn(col2.slice(), 2, data.game.mc_random_questions),
                    2 < colCount && fillColumn(col3.slice(), 3, data.game.mc_random_questions),
                    3 < colCount && (fillColumn(col4.slice(), 4),
                        data.game.mc_random_questions),
                    4 < colCount && fillColumn(col5.slice(), 5, data.game.mc_random_questions),
                    setMatchColumnWidths(),
                    hasHeading && setMatchColHead(data.items[0]);
                for (var i = col1.length - 1; 0 <= i; i--) {
                    var dans = col1[i].trim() + col2[i].trim();
                    2 < colCount && (dans += col3[i].trim()),
                        3 < colCount && (dans += col4[i].trim()),
                        4 < colCount && (dans += col5[i].trim()),
                        concatenatedArray.push(dans)
                }
                updateRemainingGuessesCount(),
                    1 == (hidePercentage = data.game.mc_hide_percentage) && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
                        document.getElementById("gameguesswrong").style.visibility = "hidden",
                        document.getElementById("score").style.visibility = "hidden"),
                    placeStart()
            }
        }
}

function startMatchGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    return event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none",
        document.getElementById("quizsurface").style.background = "none",
        document.getElementById("answerArea").style.display = "block",
        surface.style.height = "auto",
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        !(document.getElementById("question-box").style.visibility = "hidden")
}

function setFixedMatchItemCount(count) {
    for (; col1.length > answerCountWhenDone;) {
        var desiredIndex = Math.floor(Math.random() * answerCountWhenDone);
        col1.splice(desiredIndex, 1),
            col2.splice(desiredIndex, 1),
            col3.splice(desiredIndex, 1),
            col4.splice(desiredIndex, 1),
            col5.splice(desiredIndex, 1)
    }
}

function fillColumn(col, colNo, randomOrNot) {
    0 < randomOrNot ? shuffle(col) : col.sort();
    for (var i = 0; 0 < col.length;) {
        var currText = col.pop();
        document.getElementById("game-column-" + colNo).insertAdjacentHTML("afterbegin", '<div class="match-col-item" data-item="' + encodeURIComponent(currText) + '" id="col-item-' + colNo + "-" + i + '"></div>'),
            document.getElementById("col-item-" + colNo + "-" + i).innerText = currText,
            document.getElementById("col-item-" + colNo + "-" + i).addEventListener("click", cellClicked, !1),
            displayInline && (document.getElementById("col-item-" + colNo + "-" + i).style.display = "inline-block"),
            i += 1
    }
}

function setMatchColHead(headRow) {
    document.getElementById("game-column-1").insertAdjacentHTML("afterbegin", '<div class="col-head">' + headRow.col1 + "</div>"),
        document.getElementById("game-column-2").insertAdjacentHTML("afterbegin", '<div class="col-head">' + headRow.col2 + "</div>"),
        2 < colCount && document.getElementById("game-column-3").insertAdjacentHTML("afterbegin", '<div class="col-head">' + headRow.col3 + "</div>"),
        3 < colCount && document.getElementById("game-column-4").insertAdjacentHTML("afterbegin", '<div class="col-head">' + headRow.col4 + "</div>"),
        4 < colCount && document.getElementById("game-column-5").insertAdjacentHTML("afterbegin", '<div class="col-head">' + headRow.col5 + "</div>")
}

function setMatchColumnWidths() {
    3 == colCount && (wdt = "threecol",
            fts = "threecolitem"),
        4 == colCount && (wdt = "fourcol",
            fts = "fourcolitem"),
        5 == colCount && (wdt = "fivecol",
            fts = "fivecolitem");
    var els = document.getElementsByClassName("match-game-column");
    for (i = 0; i < els.length; i++)
        els[i].setAttribute("class", "match-game-column " + wdt);
    var cls = document.getElementsByClassName("match-col-item");
    for (i = 0; i < cls.length; i++)
        cls[i].setAttribute("class", "match-col-item " + fts)
}

function cellClicked(event) {
    var currentCol, text;
    return event.preventDefault(),
        !(!gameRunning || gameOver || (currentCol = (event = this.id.split("-"))[2],
            event = event[3],
            text = decodeURIComponent(this.getAttribute("data-item")),
            unselectSelectedInCol(currentCol),
            this.setAttribute("class", "match-col-item " + fts),
            this.setAttribute("class", "match-col-item " + fts + " match-col-item-selected"),
            setCurrentCol(currentCol, text),
            setCurrentRow(currentCol, event),
            !isCurrentSelectionComplete())) && ((true ? (correctAnswers += 1,
                updateCorrectCounter(),
                playCorrectSound) : (faultyAnswers += 1,
                updateFaultyCounter(),
                playFaultySound))(),
            updateScore(),
            updateRemainingGuessesCount(),
            void(gameRunning && !gameOver && shallWeFinish()))
}

function unselectSelectedInCol(col) {
    for (var i = 0; i < col1.length; i++)
        1 != document.getElementById("col-item-" + col + "-" + i).getAttribute("data-ans") && document.getElementById("col-item-" + col + "-" + i).setAttribute("class", "match-col-item " + fts)
}

function setCurrentCol(col, row) {
    1 == col ? currentCol1 = row : 2 == col ? currentCol2 = row : 3 == col ? currentCol3 = row : 4 == col ? currentCol4 = row : 5 == col && (currentCol5 = row)
}

function setCurrentRow(col, row) {
    1 == col ? currentRow1 = row : 2 == col ? currentRow2 = row : 3 == col ? currentRow3 = row : 4 == col ? currentRow4 = row : 5 == col && (currentRow5 = row)
}

function isCurrentSelectionComplete() {
    return "" != currentCol1 && "" != currentCol2 && !("" == currentCol3 && 2 < colCount || "" == currentCol4 && 3 < colCount || "" == currentCol5 && 4 < colCount)
}

function isCurrentSelectionCorrect() {
    return 2 == colCount ? checkTwoCols() : 3 == colCount ? checkThreeCols() : 4 == colCount ? checkFourCols() : 5 == colCount ? checkFiveCols() : void 0
}

function checkTwoCols() {
    for (var i = 0; i < col1.length; i++)
        if (col1[i].trim() == currentCol1.trim() && col2[i].trim() == currentCol2.trim() && 0 == isDummy[i]) {
            var hitMe = concatenatedArray.indexOf(currentCol1.trim() + currentCol2.trim());
            if (-1 !== hitMe)
                return concatenatedArray.splice(hitMe, 1),
                    clearColSelection(2, !0),
                    !0
        }
    return clearColSelection(2, !1),
        !1
}

function checkThreeCols() {
    for (var i = 0; i < col1.length; i++)
        if (col1[i].trim() == currentCol1.trim() && col2[i].trim() == currentCol2.trim() && col3[i].trim() == currentCol3.trim() && 0 == isDummy[i]) {
            var hitMe = concatenatedArray.indexOf(currentCol1.trim() + currentCol2.trim() + currentCol3.trim());
            if (-1 !== hitMe)
                return concatenatedArray.splice(hitMe, 1),
                    clearColSelection(3, !0),
                    !0
        }
    return clearColSelection(3, !1),
        !1
}

function checkFourCols() {
    for (var i = 0; i < col1.length; i++)
        if (col1[i].trim() == currentCol1.trim() && col2[i].trim() == currentCol2.trim() && col3[i].trim() == currentCol3.trim() && col4[i].trim() == currentCol4.trim() && 0 == isDummy[i]) {
            var hitMe = concatenatedArray.indexOf(currentCol1.trim() + currentCol2.trim() + currentCol3.trim() + currentCol4.trim());
            if (-1 !== hitMe)
                return concatenatedArray.splice(hitMe, 1),
                    clearColSelection(4, !0),
                    !0
        }
    return clearColSelection(4, !1),
        !1
}

function checkFiveCols() {
    for (var i = 0; i < col1.length; i++)
        if (col1[i].trim() == currentCol1.trim() && col2[i].trim() == currentCol2.trim() && col3[i].trim() == currentCol3.trim() && col4[i].trim() == currentCol4.trim() && col5[i].trim() == currentCol5.trim() && 0 == isDummy[i]) {
            var hitMe = concatenatedArray.indexOf(currentCol1.trim() + currentCol2.trim() + currentCol3.trim() + currentCol4.trim() + currentCol5.trim());
            if (-1 !== hitMe)
                return concatenatedArray.splice(hitMe, 1),
                    clearColSelection(5, !0),
                    !0
        }
    return clearColSelection(5, !1),
        !1
}

function clearColSelection(count, correctOrNot) {
    setCellBackground(1, currentRow1, currentCol1, correctOrNot),
        setCellBackground(2, currentRow2, currentCol2, correctOrNot),
        2 < count && setCellBackground(3, currentRow3, currentCol3, correctOrNot),
        3 < count && setCellBackground(4, currentRow4, currentCol4, correctOrNot),
        4 < count && setCellBackground(5, currentRow5, currentCol5, correctOrNot),
        currentCol5 = currentCol4 = currentCol3 = currentCol2 = currentCol1 = "",
        currentRow5 = currentRow4 = currentRow3 = currentRow3 = currentRow1 = -1
}

function setCellBackground(colNo, rowNo, objText, correctOrNot) {
    correctOrNot ? (document.getElementById("col-item-" + colNo + "-" + rowNo).setAttribute("class", "match-col-item " + fts + " match-correct"),
        document.getElementById("col-item-" + colNo + "-" + rowNo).removeEventListener("click", cellClicked),
        document.getElementById("col-item-" + colNo + "-" + rowNo).setAttribute("data-ans", 1)) : document.getElementById("col-item-" + colNo + "-" + rowNo).setAttribute("class", "match-col-item " + fts + " match-error")
}

function clickTextAnswerBox(event) {
    var myClickedId;
    return event.preventDefault(),
        gameRunning && !gameOver && "1" != this.getAttribute("data-ans") && (answerTrials += 1,
            event = tb.getAttribute("data-id"),
            myClickedId = this.getAttribute("data-id"),
            resetAllTextAnswerBoxes(),
            getTextAnswerForId(myClickedId) == getTextAnswerForId(event) ? (playCorrectSound(),
                this.setAttribute("data-ans", "1"),
                this.setAttribute("class", "text-answer-box correct"),
                setObjColor(this.id, answerTrials),
                resetHint(),
                answerTrials = 0,
                correctAnswers += 1,
                updateCorrectCounter(),
                updateScore(),
                removeQuestionFromTextList(event),
                showTextQuestion(0)) : (playFaultySound(),
                faultyAnswers += 1,
                updateScore(),
                updateFaultyCounter(),
                this.setAttribute("class", "text-answer-box error"),
                2 < answerTrials && displayHint(event, event)),
            updateRemainingGuessesCount(),
            gameRunning) && !gameOver && shallWeFinish(),
        !1
}

function MCQuestion(id, question, answerCorrect, answer2, answer3, answer4, answer5, answer6, answer7) {
    this.id = id,
        this.question = question,
        this.answerCorrect = answerCorrect,
        this.answer2 = answer2,
        this.answer3 = answer3,
        this.answer4 = answer4,
        this.answer5 = answer5,
        this.answer6 = answer6,
        this.answer7 = answer7,
        this.answers = [],
        this.userAnsweredWithId = -1,
        this.setupAnswer(this.answerCorrect),
        this.setupAnswer(this.answer2),
        this.setupAnswer(this.answer3),
        this.setupAnswer(this.answer4),
        this.setupAnswer(this.answer5),
        this.setupAnswer(this.answer6),
        this.setupAnswer(this.answer7),
        shuffle(this.answers)
}
MCQuestion.prototype.setupAnswer = function(answer) {
        "[N/A]" != answer && "N/A" != answer && this.answers.push(answer)
    },
    MCQuestion.prototype.isCorrect = function(id) {
        return this.answers[id] == this.answerCorrect
    };
var currentTextQuestionOrdinal = 0,
    showScore = !0;

function initMCGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-mcquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    itemLength = (gnon = data.nonce,
                        surface.insertAdjacentHTML("afterbegin", '<div id="answerArea" class="answer-area" data-ans="1"><div class="row"></div>'),
                        data.items.length);
                for (i = 0; i < itemLength; i++) {
                    var q = new MCQuestion(i, data.items[i].question, data.items[i].answer_correct, data.items[i].answer2, data.items[i].answer3, data.items[i].answer4, data.items[i].answer5, data.items[i].answer6, "N/A");
                    que.push(q)
                }
                0 < data.game.mc_random_questions && shuffle(que),
                    1 == data.game.allow_navigation && (allowNavigation = 1);
                var rawNumberOfQuestions = (allQuestions = que).length,
                    ans = (answerCountWhenDone = rawNumberOfQuestions,
                        0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount),
                        0 < (allowedAnswerTrials = 0 == allowedAnswerTrials ? -1 : allowedAnswerTrials) && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                        hidePercentage = data.game.mc_hide_percentage,
                        updateRemainingGuessesCount(),
                        document.getElementById("answerArea").innerHTML = setupHTMLQuestion(new MCQuestion(0, "--", "-", "--", "--", "--", "--", "--", "N/A")),
                        document.getElementsByClassName("mcanswer"));
                for (i = 0; i < ans.length; i++)
                    ans[i].addEventListener("click", mcDotClicked, !1);
                document.getElementById("go-back").addEventListener("click", mcGoBackClick, !1),
                    document.getElementById("go-forward").addEventListener("click", mcGoForwardClick, !1),
                    document.getElementById("mcpaging").setAttribute("class", "mcpaging hidden"),
                    placeStart()
            }
        }
}

function startMCGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    return event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none",
        document.getElementById("quizsurface").style.background = "none",
        document.getElementById("answerArea").style.display = "block",
        surface.style.height = "auto",
        1 == hidePercentage && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
            document.getElementById("gameguesswrong").style.visibility = "hidden",
            document.getElementById("score").style.visibility = "hidden",
            700 <= getElementWidth("quizsurface") ? document.getElementById("score").style.visibility = "hidden" : (document.getElementById("score").style.color = "#849CCA",
                document.getElementById("score").style.background = "#849CCA"),
            showScore = !1),
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        showMCQuestion(0, !(document.getElementById("question-box").style.visibility = "hidden")),
        !1
}

function setupHTMLQuestion(q) {
    for (var html = (html = (html = '<div class="multiple-choice-question noselect">') + '<div class="mcquestion">' + '<div id="mcpaging" class="mcpaging"><span id="go-back" class="rounded-icon social-icon action-paging"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg></span><span id="go-forward" class="rounded-icon social-icon action-paging"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg></span></div>') + '<div id="mcquestcount" class="mccounter">Question ' + (currentTextQuestionOrdinal + 1) + " of " + answerCountWhenDone + '</div><span id="mcquest">' + q.question + "</span></div><ol>", j = 1; j < 7; j++)
        q.answers.length >= j && (html = (html = html + '<li id="mc-answer-' + j + '" class="mcanswer">') + q.answers[j - 1] + "</li>");
    return html += "</ol></div>"
}

function showMCQuestion(questionNo, showAnswersGiven) {
    if (0 < que.length && questionNo < que.length) {
        var currentQuestion = que[questionNo],
            ans = (currentTextQuestionOrdinal = questionNo,
                document.getElementById("mcquestcount").innerHTML = txtCapitalQuestion + " " + (currentTextQuestionOrdinal + 1) + " / " + answerCountWhenDone,
                document.getElementById("mcquest").innerHTML = currentQuestion.question,
                document.getElementsByClassName("mcanswer")),
            ansClass = "";
        for (i = 0; i < ans.length; i++)
            currentQuestion.answers.length > i ? (ans[i].innerHTML = currentQuestion.answers[i],
                ans[i].setAttribute("data-id", i),
                ansClass = "",
                currentQuestion.isCorrect(i) && showAnswersGiven && (ansClass = " aone"),
                !currentQuestion.isCorrect(i) && showAnswersGiven && currentQuestion.userAnsweredWithId == i && (ansClass = " afour"),
                ans[i].setAttribute("class", "mcanswer" + ansClass)) : ans[i].setAttribute("class", "mcanswer hidden")
    }
}

function mcDotClicked(event) {
    return event.preventDefault(),
        gameRunning && !gameOver && ((que[currentTextQuestionOrdinal].isCorrect(this.getAttribute("data-id")) ? (correctAnswers += 1,
                updateCorrectCounter(),
                playCorrectSound) : ((showScore ? playFaultySound : playCorrectSound)(),
                faultyAnswers += 1,
                updateFaultyCounter))(),
            que[currentTextQuestionOrdinal].userAnsweredWithId = this.getAttribute("data-id"),
            updateScore(),
            updateRemainingGuessesCount(),
            gameRunning && !gameOver) && (shallWeFinish() ? (document.getElementById("mcpaging").setAttribute("class", "mcpaging"),
            showMCQuestion(currentTextQuestionOrdinal, !0),
            document.getElementById("score").style.color = "#FFF",
            document.getElementById("score").style.background = "#849CCA") : showMCQuestion(currentTextQuestionOrdinal + 1, !1)),
        !1
}

function mcGoBackClick(event) {
    return event.preventDefault(),
        que.length < 2 || showMCQuestion(0 == currentTextQuestionOrdinal ? que.length - 1 : currentTextQuestionOrdinal - 1, !0),
        !1
}

function mcGoForwardClick(event) {
    if (event.preventDefault(),
        que.length < 2)
        return !1;
    currentTextQuestionOrdinal == que.length - 1 ? showMCQuestion(0, !0) : showMCQuestion(currentTextQuestionOrdinal + 1, !0)
}

function OrderRow(ordinal, question, col1, col2, col3, col4, col5) {
    this.ordinal = ordinal,
        this.question = question,
        this.col1 = col1,
        this.ord1 = jsguid(),
        this.ans1 = "-",
        this.col2 = col2,
        this.ord2 = jsguid(),
        this.ans2 = "-",
        this.col3 = col3,
        this.ord3 = jsguid(),
        this.ans3 = "-",
        this.col4 = col4,
        this.ord4 = jsguid(),
        this.ans4 = "-",
        this.answers = [],
        this.answers.push(this.ord1),
        this.answers.push(this.ord2),
        this.answers.push(this.ord3),
        this.answers.push(this.ord4),
        shuffle(this.answers),
        this.answerCount = 4,
        this.correctCount = 0
}
var isMouseDown = !(OrderRow.prototype.textFromOrd = function(ord) {
        return ord == this.ord1 ? this.col1 : ord == this.ord2 ? this.col2 : ord == this.ord3 ? this.col3 : this.col4
    }),
    currentItem = null,
    currentInnerItem = null,
    currentFontSize = "12px",
    animInterval = null,
    oOPT = 5,
    oOPS = 1,
    currentOrderQuestionOrdinal = 0,
    oAAHeight = "460px",
    qSW = 0,
    bW = 150,
    bH = 100,
    opShown = !1,
    orderCss = (orderCss = (orderCss = (orderCss = "@keyframes pulse-correct {0% {transform: scale(0.95);box-shadow: 0 0 0 0 rgb(76, 175, 80, 0.7);}70% {transform: scale(1);box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);}100% {transform: scale(1);box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);}}") + "@keyframes pulse-wrong {0% {transform: scale(0.95);box-shadow: 0 0 0 0 rgb(244, 67, 54, 0.7);}70% {transform: scale(1);box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);}100% {transform: scale(1);box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);}}") + "@media (min-width: 620px){.game__container{min-height: 500px;}}") + ".abx{}";

function setupOrderCss(data) {
    var style = document.createElement("style");
    style.type = "text/css",
        style.innerHTML = data,
        document.getElementsByTagName("head")[0].appendChild(style)
}

function initOrderGame() {
    setupOrderCss(orderCss),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-orderquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    rawNumberOfQuestions = (gnon = data.nonce,
                        null != data.items && data.items.forEach(function(q) {
                            que.push(new OrderRow(q.ordinal, q.question, q.col1, q.col2, q.col3, q.col4, q.col5))
                        }),
                        0 < data.game.mc_random_questions && shuffle(que),
                        1 == data.game.allow_navigation && (allowNavigation = 1),
                        (allQuestions = que).length),
                    rawNumberOfQuestions = (answerCountWhenDone = rawNumberOfQuestions,
                        0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount,
                            shuffle(que)),
                        0 < (allowedAnswerTrials = 0 == allowedAnswerTrials ? -1 : allowedAnswerTrials) && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                        hidePercentage = data.game.mc_hide_percentage,
                        (qSW = getElementWidth("quizsurface")) < 700 && (bW = Math.round(.24 * qSW),
                            bH = Math.round(.24 * qSW * .66666)),
                        '<div id="outerArea" style="width: ' + qSW + "px; height: " + oAAHeight + ';z-index: 19; display: none; position: relative; overflow: hidden;"><div id="answerArea" style="position: absolute; top:0; left: 0; width: ' + qSW * answerCountWhenDone + "px; height: " + oAAHeight + '; display: flex;"></div></div>'),
                    data = (surface.insertAdjacentHTML("afterbegin", rawNumberOfQuestions),
                        '<div id="currentItem" style="display: none; z-index: 20;"><div style="display: flex; cursor: pointer; text-align: center; justify-content: center;align-items: center;width:' + bW + "px; overflow: hidden; height: " + bH + 'px; border-radius: 14px; background: #9ccc65; border: 4px solid #6b9b37"><div style="font-size: 26px; inline-size: ' + Math.round(.9 * bW) + 'px; overflow-wrap: break-word;hyphens: manual; line-height:1.3" id="currentInnerItem">Yay</div></div></div>'),
                    rawNumberOfQuestions = (surface.insertAdjacentHTML("afterbegin", data),
                        '<div id="orderCQ" style="display: none"><div style="font-size: 20px; color: var(--light-text)" id="orderCQOrdinal">' + txtCapitalQuestion + " 1 / " + answerCountWhenDone + '</div><div id="orderpaging" style="margin-left: auto; display: none;"><span id="order-back" class="rounded-icon social-icon action-paging" style="margin-right: 5px; cursor: pointer;"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg></span><span id="order-forward" class="rounded-icon social-icon action-paging" style="cursor: pointer;"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg></span></div></div></div>');
                surface.insertAdjacentHTML("afterbegin", rawNumberOfQuestions);
                for (var i = 0; i < answerCountWhenDone; i++)
                    setupOrderQuestion(i);
                answerCountWhenDone *= 4,
                    updateRemainingGuessesCount(),
                    placeStart()
            }
        }
}

function mouseDownBox(e) {
    var ec, ecType, bRect, bSurface;
    return e.preventDefault(),
        gameOver || (ecType = (ec = e.currentTarget).getAttribute("data-type"),
            bRect = ec.getBoundingClientRect(),
            bSurface = surface.getBoundingClientRect(),
            (currentInnerItem = document.getElementById("currentInnerItem")).innerText = ec.innerText,
            currentInnerItem.style.fontSize = currentFontSize,
            ("answer" == ecType ? setStyleAnswerBoxDefault : setStyleOrderBoxAnswered)(currentItem = document.getElementById("currentItem")),
            currentItem.style.transition = "",
            currentItem.style.top = bRect.top - bSurface.top + "px",
            currentItem.style.left = bRect.left - bSurface.left + "px",
            currentItem.style.display = "block",
            currentItem.style.position = "absolute",
            currentItem.setAttribute("data-x", e.clientX - bRect.left),
            currentItem.setAttribute("data-y", e.clientY - bRect.top),
            currentItem.setAttribute("data-origin-id", ec.id),
            currentItem.setAttribute("data-origin-y", bRect.top - bSurface.top + "px"),
            currentItem.setAttribute("data-origin-x", bRect.left - bSurface.left + "px"),
            currentItem.setAttribute("data-ans", ec.getAttribute("data-ans")),
            ("answer" == ecType ? setStyleAnswerBoxInProgress : setStyleOrderBoxDefault)(ec),
            ec.removeEventListener("mousedown", mouseDownBox),
            isMouseDown = !0),
        !1
}

function mouseMoveOrder(e) {
    if (0 == isMouseDown)
        return !1;
    var sRect = surface.getBoundingClientRect();
    mouseX = e.clientX - sRect.left - currentItem.getAttribute("data-x"),
        mouseY = e.clientY - sRect.top - currentItem.getAttribute("data-y"),
        currentItem.style.top = mouseY + "px",
        currentItem.style.left = mouseX + "px";
    dc(currentItem, document.getElementById("obo1" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo1" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo2" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo2" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo3" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo3" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo4" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo4" + currentOrderQuestionOrdinal), currentItem) || resetOrderBoxes()
}

function mouseUpOrder(e) {
    var ecType, sRect, top, d;
    return e.preventDefault(),
        isMouseDown && (isMouseDown = !1,
            ecType = (e = document.getElementById(currentItem.getAttribute("data-origin-id"))).getAttribute("data-type"),
            "none" == (d = getSelectedOrderBox()) && "order" == ecType && (d = document.getElementById(currentItem.getAttribute("data-origin-id"))),
            animInterval = "none" != d ? (d = d.getBoundingClientRect(),
                sRect = surface.getBoundingClientRect(),
                top = d.top - sRect.top + oOPT,
                d = d.left - sRect.left + oOPS,
                currentItem.style.transition = "all 0.2s ease-out",
                currentItem.style.top = top + "px",
                currentItem.style.left = d + "px",
                "answer" == ecType ? e.setAttribute("data-answered", "yes") : (e.setAttribute("data-id", "0"),
                    e.setAttribute("data-answered", "no")),
                setTimeout(setCurrentAnswer, 210)) : (currentItem.style.transition = "all 0.2s ease-out",
                currentItem.style.top = currentItem.getAttribute("data-origin-y"),
                currentItem.style.left = currentItem.getAttribute("data-origin-x"),
                setTimeout(resetCurrentItem, 210))),
        !1
}

function setCurrentAnswer() {
    if (gameOver)
        return !1;
    var d = getSelectedOrderBox(),
        d = ("none" == d ? d = document.getElementById(currentItem.getAttribute("data-origin-id")) : playDropSound(),
            setStyleOrderBoxAnswered(d),
            d.addEventListener("mousedown", mouseDownBox),
            d.addEventListener("touchstart", touchStart),
            d.setAttribute("data-answered", "yes"),
            d.setAttribute("data-ans", currentItem.getAttribute("data-ans")),
            document.getElementById(currentItem.getAttribute("data-origin-id")));
    "answer" == d.getAttribute("data-type") && setStyleAnswerBoxAnswered(d),
        currentItem.style.display = "none",
        swmtnq()
}

function resetCurrentItem() {
    var d = document.getElementById(currentItem.getAttribute("data-origin-id"));
    "yes" != d.getAttribute("data-answered") && (setStyleAnswerBoxDefault(d),
            d.addEventListener("mousedown", mouseDownBox),
            d.addEventListener("touchstart", touchStart)),
        currentItem.style.display = "none"
}

function getSelectedOrderBox() {
    var ri = "none";
    return document.querySelectorAll(".obx" + currentOrderQuestionOrdinal).forEach(function(item) {
            "yes" != item.getAttribute("data-answered") && "0" != item.getAttribute("data-id") && (ri = item)
        }),
        ri
}

function dc(a, b) {
    var a = a.getBoundingClientRect(),
        b = b.getBoundingClientRect(),
        isInHoriztonalBounds = a.x < b.x + b.width && a.x + a.width > b.x,
        a = a.y < b.y + b.height && a.y + a.height > b.y;
    return isInHoriztonalBounds && a
}

function lightElegibleOrderBox(el, ci) {
    return resetOrderBoxes(),
        "yes" != el.getAttribute("data-answered") && (el.childNodes[0].style.borderColor = "#ffeb3b",
            el.childNodes[0].style.borderWidth = "4px",
            el.childNodes[0].style.borderStyle = "solid",
            el.childNodes[0].style.backgroundColor = "var(--background-hl)",
            el.setAttribute("data-id", currentItem.getAttribute("data-origin-id")),
            !0)
}

function resetOrderBoxes() {
    document.querySelectorAll(".obx" + currentOrderQuestionOrdinal).forEach(function(item) {
        "yes" != item.getAttribute("data-answered") && (setStyleOrderBoxDefault(item),
            item.setAttribute("data-id", "0"))
    })
}

function startOrderGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        moreThanOneItemCorrect = !0,
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none";
    document.getElementById("quizsurface").style.background = "none",
        document.getElementById("outerArea").style.display = "block",
        surface.style.height = "auto",
        document.getElementById("orderCQ").style.display = "flex",
        1 == hidePercentage && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
            document.getElementById("gameguesswrong").style.visibility = "hidden",
            document.getElementById("score").style.visibility = "hidden",
            700 <= getElementWidth("quizsurface") ? document.getElementById("score").style.visibility = "hidden" : (document.getElementById("score").style.color = "var(--dashboard-score)",
                document.getElementById("score").style.background = "var(--dashboard-score)"),
            showScore = !1),
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        document.getElementById("question-box").style.visibility = "hidden",
        surface.addEventListener("mousemove", mouseMoveOrder),
        surface.addEventListener("mouseup", mouseUpOrder);
    for (var currentQuestion = que[currentOrderQuestionOrdinal], i = 0; i < currentQuestion.answers.length; i++)
        document.getElementById("ab" + (i + 1) + currentOrderQuestionOrdinal).addEventListener("mousedown", mouseDownBox),
        document.getElementById("ab" + (i + 1) + currentOrderQuestionOrdinal).addEventListener("touchstart", touchStart);
    return !(document.getElementById("outerArea").display = "block")
}

function setupOrderQuestion(questionNo) {
    for (var currentQuestion = que[questionNo], qt = (setupAnswerArea(currentInnerItemQuestionOrdinal = questionNo),
            document.getElementById("qt" + questionNo)), longestAnswer = (qt.innerText = currentQuestion.question,
            120 < currentQuestion.question.length ? qt.style.fontSize = "20px" : 80 < currentQuestion.question.length ? qt.style.fontSize = "26px" : 32 < currentQuestion.question.length && (qt.style.fontSize = "32px"),
            0), i = 0; i < currentQuestion.answers.length; i++) {
        var abt = document.getElementById("abt" + (i + 1) + questionNo);
        document.getElementById("ab" + (i + 1) + questionNo).setAttribute("data-ans", currentQuestion.answers[i]),
            abt.innerText = currentQuestion.textFromOrd(currentQuestion.answers[i]),
            currentQuestion.answers[i].length > longestAnswer && (longestAnswer = currentQuestion.answers[i].length)
    }
    var fsz = "20px";
    140 < longestAnswer || 120 < longestAnswer || 100 < longestAnswer || 80 < longestAnswer ? fsz = "12px" : 60 < longestAnswer ? fsz = "14px" : 40 < longestAnswer ? fsz = "16px" : 30 < longestAnswer && (fsz = "18px"),
        currentFontSize = fsz = qSW < 700 ? "14px" : fsz;
    for (i = 0; i < currentQuestion.answers.length; i++)
        (abt = document.getElementById("abt" + (i + 1) + questionNo)).style.fontSize = fsz
}

function swmtnq() {
    if (gameOver)
        return !1;
    var weDone = !0;
    document.querySelectorAll(".obx" + currentOrderQuestionOrdinal).forEach(function(item) {
        "yes" != item.getAttribute("data-answered") && (weDone = !1)
    });
    weDone && (document.querySelectorAll(".obx" + currentOrderQuestionOrdinal).forEach(function(item) {
            item.removeEventListener("mousedown", mouseDownBox),
                item.removeEventListener("touchstart", touchStart);
            var gAns = item.getAttribute("data-ans"),
                item = item.childNodes[0].childNodes[0].getAttribute("data-item");
            que[currentOrderQuestionOrdinal]["ans" + item] = gAns
        }),
        showNextOrderQuestion())
}

function showNextOrderQuestion() {
    setCorrectAnswersGiven(),
        0 == hidePercentage ? (animFacitForQuestion(currentOrderQuestionOrdinal, !0),
            setTimeout(moveToNextQuestion, 1100)) : (animFacitForQuestion(currentOrderQuestionOrdinal, !1),
            setTimeout(moveToNextQuestion, 100))
}

function animFacitForQuestion(ordinal, swa) {
    var cq = que[ordinal],
        times = [1, 300, 600, 900],
        animTimes = [1, 300, 600, 900];
    swa || (times = [1, 1, 1, 1],
            animTimes = [2e3, 2e3, 2e3, 2e3]),
        cq.ans1 == cq.ord1 ? (setTimeout(setOrderCorrect, times[0]),
            setTimeout(animCorrect, animTimes[0], "1" + ordinal)) : (setTimeout(setOrderWrong, times[0]),
            setTimeout(animWrong, animTimes[0], "1" + ordinal)),
        cq.ans2 == cq.ord2 ? (setTimeout(setOrderCorrect, times[1]),
            setTimeout(animCorrect, animTimes[1], "2" + ordinal)) : (setTimeout(setOrderWrong, times[1]),
            setTimeout(animWrong, animTimes[1], "2" + ordinal)),
        cq.ans3 == cq.ord3 ? (setTimeout(setOrderCorrect, times[2]),
            setTimeout(animCorrect, animTimes[2], "3" + ordinal)) : (setTimeout(setOrderWrong, times[2]),
            setTimeout(animWrong, animTimes[2], "3" + ordinal)),
        cq.ans4 == cq.ord4 ? (setTimeout(setOrderCorrect, times[3]),
            setTimeout(animCorrect, animTimes[3], "4" + ordinal)) : (setTimeout(setOrderWrong, times[3]),
            setTimeout(animWrong, animTimes[3], "4" + ordinal))
}

function moveToNextQuestion() {
    if (shallWeFinish())
        showOrderPaging();
    else {
        currentOrderQuestionOrdinal++,
        setPageNo();
        for (var currentQuestion = allQuestions[currentOrderQuestionOrdinal], i = 0; i < currentQuestion.answers.length; i++)
            document.getElementById("ab" + (i + 1) + currentOrderQuestionOrdinal).addEventListener("mousedown", mouseDownBox),
            document.getElementById("ab" + (i + 1) + currentOrderQuestionOrdinal).addEventListener("touchstart", touchStart);
        document.getElementById("answerArea").style.transition = "all 300ms ease-in",
            setTimeout(moveLeft, 400)
    }
}

function moveLeft() {
    var oAA = document.getElementById("answerArea"),
        currentPos = parseInt(oAA.style.left, 10);
    oAA.style.left = currentPos - qSW + "px"
}

function moveRight() {
    var oAA = document.getElementById("answerArea"),
        currentPos = parseInt(oAA.style.left, 10);
    oAA.style.left = currentPos + qSW + "px"
}

function showOrderPaging() {
    opShown || (document.getElementById("orderpaging").style.display = "flex",
        document.getElementById("order-back").addEventListener("click", orderFinishedMoveBack),
        document.getElementById("order-forward").addEventListener("click", orderFinishedMoveForward),
        opShown = !0)
}

function orderFinishedMoveBack(e) {
    return e.preventDefault(),
        0 < currentOrderQuestionOrdinal && (currentOrderQuestionOrdinal--,
            setPageNo(),
            moveRight()),
        !1
}

function orderFinishedMoveForward(e) {
    return e.preventDefault(),
        currentOrderQuestionOrdinal < answerCountWhenDone / 4 - 1 && (currentOrderQuestionOrdinal++,
            setPageNo(),
            moveLeft()),
        !1
}

function setPageNo() {
    document.getElementById("orderCQOrdinal").innerText = txtCapitalQuestion + " " + (currentOrderQuestionOrdinal + 1) + " / " + answerCountWhenDone / 4
}

function setOrderCorrect() {
    correctAnswers += 1,
        updateCorrectCounter(),
        updateRemainingGuessesCount(),
        updateScore()
}

function setOrderWrong() {
    faultyAnswers += 1,
        updateFaultyCounter(),
        updateRemainingGuessesCount(),
        updateScore()
}

function animCorrect(identifier) {
    identifier = document.getElementById("obo" + identifier).childNodes[0];
    identifier.style.animationPlayState = "paused",
        identifier.style.animationDelay = "50ms",
        identifier.style.animationDuration = "2s",
        identifier.style.animationName = "pulse-correct",
        identifier.style.animationPlayState = "running",
        identifier.style.transition = "all 0.2s ease-out",
        setStyleBoxCorrect(identifier)
}

function animWrong(identifier) {
    identifier = document.getElementById("obo" + identifier).childNodes[0];
    identifier.style.animationPlayState = "paused",
        identifier.style.animationDelay = "50ms",
        identifier.style.animationDuration = "2s",
        identifier.style.animationName = "pulse-wrong",
        identifier.style.animationPlayState = "running",
        identifier.style.transition = "all 0.2s ease-out",
        setStyleBoxWrong(identifier)
}

function setCorrectAnswersGiven() {
    var cq = que[currentOrderQuestionOrdinal];
    cq.ans1 == cq.ord1 && cq.correctCount++,
        cq.ans2 == cq.ord2 && cq.correctCount++,
        cq.ans3 == cq.ord3 && cq.correctCount++,
        cq.ans4 == cq.ord4 && cq.correctCount++
}

function setupAnswerArea(questionNo) {
    iHTML = (iHTML = (iHTML = (iHTML = (iHTML = (iHTML = (iHTML = '<div id="answerArea' + questionNo + '" style="display:flex; flex-direction: column;justify-content: space-around;align-items: center;">') + '<div id="Question' + questionNo + '" style="display:flex; justify-content: center;align-items: center; min-height: 140px; max-height: 140px; overflow: hidden; user-select: none;"><div id="qt' + questionNo + '" style="font-size: 2.55em; text-align: center"></div></div>') + '<div id="orderBoxes' + questionNo + '" style="width: ' + qSW + 'px;display: flex;flex-direction: row;flex-wrap: nowrap;align-items: stretch;justify-content: space-between;">') + '<div class="obx' + questionNo + '" data-type="order" style="padding: ' + oOPT + "px " + oOPS + 'px;" id="obo1' + questionNo + '"><div id="obi1' + questionNo + '" style="' + getOrderBoxStyleData() + '"><div id="obia1' + questionNo + '" style="' + getOrderBoxInnerStyleData() + '" data-item="1">1</div></div></div>') + '<div class="obx' + questionNo + '" data-type="order" style="padding: ' + oOPT + "px " + oOPS + 'px;" id="obo2' + questionNo + '"><div id="obi2' + questionNo + '" style="' + getOrderBoxStyleData() + '"><div id="obia2' + questionNo + '" style="' + getOrderBoxInnerStyleData() + '" data-item="2">2</div></div></div>') + '<div class="obx' + questionNo + '" data-type="order" style="padding: ' + oOPT + "px " + oOPS + 'px;" id="obo3' + questionNo + '"><div id="obi3' + questionNo + '" style="' + getOrderBoxStyleData() + '"><div id="obia3' + questionNo + '" style="' + getOrderBoxInnerStyleData() + '" data-item="3">3</div></div></div>') + '<div class="obx' + questionNo + '" data-type="order" style="padding: ' + oOPT + "px " + oOPS + 'px;" id="obo4' + questionNo + '"><div id="obi4' + questionNo + '" style="' + getOrderBoxStyleData() + '"><div id="obia4' + questionNo + '" style="' + getOrderBoxInnerStyleData() + '" data-item="4">4</div></div></div>',
        iHTML = (iHTML = (iHTML = (iHTML = (iHTML = (iHTML += "</div>") + '<div id="answerBoxes' + questionNo + '" style="width: ' + qSW + 'px;display: flex;flex-direction: row;flex-wrap: nowrap;align-items: stretch;justify-content: space-between;">') + '<div id="ab1' + questionNo + '" data-type="answer"><div style="' + getAnswerBoxStyleData() + '"><div style="' + getAnswerBoxInnerStyleData() + '" id="abt1' + questionNo + '"></div></div></div>') + '<div id="ab2' + questionNo + '" data-type="answer"><div style="' + getAnswerBoxStyleData() + '"><div style="' + getAnswerBoxInnerStyleData() + '" id="abt2' + questionNo + '"></div></div></div>') + '<div id="ab3' + questionNo + '" data-type="answer"><div style="' + getAnswerBoxStyleData() + '"><div style="' + getAnswerBoxInnerStyleData() + '" id="abt3' + questionNo + '"></div></div></div>') + '<div id="ab4' + questionNo + '" data-type="answer"><div style="' + getAnswerBoxStyleData() + '"><div style="' + getAnswerBoxInnerStyleData() + '" id="abt4' + questionNo + '"></div></div></div>',
        iHTML += "</div></div>";
    var iHTML, questionNo = document.getElementById("answerArea");
    return questionNo.insertAdjacentHTML("beforeend", iHTML),
        questionNo
}

function getAnswerBoxStyleData() {
    return "color: var(--match-correct); display: flex; cursor: pointer; text-align: center; justify-content: center;align-items: center;width:" + bW + "px; overflow: hidden; height:" + bH + "px; border-radius: 14px; background: #9ccc65; border: 4px solid #6b9b37"
}

function getAnswerBoxInnerStyleData() {
    return "font-size: 16px; inline-size: " + Math.round(.9 * bW) + "px; overflow-wrap: break-word;hyphens: manual; line-height:1.3; user-select: none;"
}

function getOrderBoxStyleData() {
    return "display: flex; width:" + bW + "px; overflow: hidden; height:" + bH + "px; border-radius: 14px; border: 4px dashed #64b5f6;text-align: center;justify-content: center;align-items: center"
}

function getOrderBoxInnerStyleData() {
    return "font-size: 2.55em; inline-size: " + Math.round(.9 * bW) + "px; overflow-wrap: break-word;hyphens: manual; line-height:1.3; font-weight:700; user-select: none;"
}

function setStyleAnswerBoxInProgress(el) {
    el.childNodes[0].style.cursor = "default",
        el.childNodes[0].style.borderColor = "#c5e1a5",
        el.childNodes[0].style.background = "#f1f8e9",
        el.childNodes[0].style.color = "#838383"
}

function setStyleAnswerBoxDefault(el) {
    el.childNodes[0].style.cursor = "pointer",
        el.childNodes[0].style.borderColor = "#6b9b37",
        el.childNodes[0].style.background = "#9ccc65",
        el.childNodes[0].style.color = "#272727"
}

function setStyleAnswerBoxAnswered(el) {
    el.childNodes[0].style.borderColor = "#bbbbbb",
        el.childNodes[0].style.background = "#dddddd",
        el.childNodes[0].style.color = "#bbbbbb"
}

function setStyleOrderBoxDefault(el) {
    el.style.cursor = "default",
        el.childNodes[0].style.background = "#ffffff",
        el.childNodes[0].style.borderColor = "#64b5f6",
        el.childNodes[0].style.borderStyle = "dashed",
        el.childNodes[0].childNodes[0].style.fontSize = "2.55em",
        el.childNodes[0].childNodes[0].style.fontWeight = "700",
        el.childNodes[0].childNodes[0].innerText = el.childNodes[0].childNodes[0].getAttribute("data-item")
}

function setStyleOrderBoxAnswered(el) {
    el.style.cursor = "pointer",
        el.childNodes[0].style.background = "#90caf9",
        el.childNodes[0].style.borderColor = "#1e88e5",
        el.childNodes[0].style.color = "#222",
        el.childNodes[0].style.borderStyle = "solid",
        el.childNodes[0].childNodes[0].style.fontSize = currentFontSize,
        el.childNodes[0].childNodes[0].style.fontWeight = "400",
        el.childNodes[0].childNodes[0].innerText = currentInnerItem.innerText
}

function setStyleBoxCorrect(el) {
    el.style.borderColor = "#81c784",
        el.style.background = "#4caf50",
        el.style.color = "#fff"
}

function setStyleBoxWrong(el) {
    el.style.borderColor = "#ffcdd2",
        el.style.background = "#f44336",
        el.style.color = "#fff"
}

function touchStart(e) {
    return e.preventDefault(),
        prepareTouchDrag(e),
        !1
}

function touchMove(e) {
    return e.preventDefault(),
        doTouchMove(e),
        !1
}

function touchEnd(e) {
    return e.preventDefault(),
        doTouchRelease(e),
        !1
}

function prepareTouchDrag(e) {
    var ec = e.currentTarget,
        ecType = ec.getAttribute("data-type"),
        bRect = ec.getBoundingClientRect(),
        bSurface = surface.getBoundingClientRect();
    (currentInnerItem = document.getElementById("currentInnerItem")).innerText = ec.innerText,
        currentInnerItem.style.fontSize = currentFontSize,
        ("answer" == ecType ? setStyleAnswerBoxDefault : setStyleOrderBoxAnswered)(currentItem = document.getElementById("currentItem")),
        currentItem.style.transition = "",
        currentItem.style.top = bRect.top - bSurface.top + "px",
        currentItem.style.left = bRect.left - bSurface.left + "px",
        currentItem.style.display = "block",
        currentItem.style.position = "absolute",
        currentItem.setAttribute("data-x", e.touches[0].clientX - bRect.left),
        currentItem.setAttribute("data-y", e.touches[0].clientY - bRect.top),
        currentItem.setAttribute("data-origin-id", ec.id),
        currentItem.setAttribute("data-origin-y", bRect.top - bSurface.top + "px"),
        currentItem.setAttribute("data-origin-x", bRect.left - bSurface.left + "px"),
        currentItem.setAttribute("data-ans", ec.getAttribute("data-ans")),
        ("answer" == ecType ? setStyleAnswerBoxInProgress : setStyleOrderBoxDefault)(ec),
        ec.removeEventListener("mousedown", mouseDownBox),
        ec.removeEventListener("touchstart", touchStart),
        ec.addEventListener("touchmove", touchMove),
        ec.addEventListener("touchend", touchEnd),
        isMouseDown = !0
}

function doTouchMove(e) {
    if (0 == isMouseDown)
        return !1;
    var sRect = surface.getBoundingClientRect();
    mouseX = e.touches[0].clientX - sRect.left - currentItem.getAttribute("data-x"),
        mouseY = e.touches[0].clientY - sRect.top - currentItem.getAttribute("data-y"),
        currentItem.style.top = mouseY + "px",
        currentItem.style.left = mouseX + "px";
    dc(currentItem, document.getElementById("obo1" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo1" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo2" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo2" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo3" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo3" + currentOrderQuestionOrdinal), currentItem) || dc(currentItem, document.getElementById("obo4" + currentOrderQuestionOrdinal)) && lightElegibleOrderBox(document.getElementById("obo4" + currentOrderQuestionOrdinal), currentItem) || resetOrderBoxes()
}

function doTouchRelease(e) {
    var origin, ecType, top, d, sRect;
    return isMouseDown && (isMouseDown = !1,
            ecType = (origin = document.getElementById(currentItem.getAttribute("data-origin-id"))).getAttribute("data-type"),
            "none" == (d = getSelectedOrderBox()) && "order" == ecType && (d = document.getElementById(currentItem.getAttribute("data-origin-id"))),
            animInterval = "none" != d ? (d = d.getBoundingClientRect(),
                sRect = surface.getBoundingClientRect(),
                top = d.top - sRect.top + oOPT,
                d = d.left - sRect.left + oOPS,
                currentItem.style.transition = "all 0.2s ease-out",
                currentItem.style.top = top + "px",
                currentItem.style.left = d + "px",
                "answer" == ecType ? origin.setAttribute("data-answered", "yes") : (origin.setAttribute("data-id", "0"),
                    origin.setAttribute("data-answered", "no")),
                setTimeout(setCurrentAnswer, 210)) : (currentItem.style.transition = "all 0.2s ease-out",
                currentItem.style.top = currentItem.getAttribute("data-origin-y"),
                currentItem.style.left = currentItem.getAttribute("data-origin-x"),
                setTimeout(resetCurrentItem, 210)),
            (sRect = e.currentTarget).removeEventListener("touchmove", touchMove),
            sRect.removeEventListener("touchend", touchEnd)),
        !1
}
var bWidth = 700,
    bHeight = 550,
    dots = [];

function startQuizGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    return event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        showNextQuestion(),
        !1
}

function initQuizGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-quiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    itemLength = (gnon = data.nonce,
                        data.items.length);
                for (i = 0; i < itemLength; i++) {
                    var dot = new GameDot(i + 1, data.items[i].x_pos, data.items[i].y_pos, data.items[i].dot_text);
                    surface.appendChild(dot.getHTML()),
                        que.push(new Question(i + 1, data.items[i].dot_text))
                }
                placeDots(),
                    shuffle(que);
                var rawNumberOfQuestions = (allQuestions = que).length;
                answerCountWhenDone = groupItems ? getUniqueArrayCount(que) : rawNumberOfQuestions,
                    0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount,
                        groupItems) && (que = getFixedArrayCountWithGroups(que, fixedItemCount)).length < fixedItemCount && (answerCountWhenDone = que.length),
                    0 < allowedAnswerTrials && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                    updateRemainingGuessesCount(),
                    1 == (hidePercentage = data.game.mc_hide_percentage) && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
                        document.getElementById("gameguesswrong").style.visibility = "hidden",
                        document.getElementById("score").style.visibility = "hidden"),
                    placeStart()
            }
        }
}

function placeDots() {
    dots = document.getElementsByClassName("dot");
    for (var fWidth = getElementWidth("quizsurface"), fHeight = setElementHeight("quizsurface", fWidth), xRatio = fWidth / bWidth, yRatio = fHeight / bHeight, i = 0; i < dots.length; i++) {
        xPos = dots[i].getAttribute("data-x"),
            yPos = dots[i].getAttribute("data-y"),
            text = dots[i].getAttribute("data-text"),
            xPos = xPos * xRatio - 2 * xRatio,
            yPos = yPos * yRatio - 2 * yRatio;
        var dWidth = 14 * xRatio;
        dots[i].style.width = dWidth + "px",
            dots[i].style.height = dWidth + "px",
            dots[i].style.left = xPos + "px",
            dots[i].style.top = yPos + "px",
            dots[i].style.zIndex = 100 + i,
            dots[i].style.visibility = "inherit",
            dots[i].addEventListener("click", clickGameObject)
    }
    shuffle(que)
}

function resizeQuizGame() {
    for (var fWidth = getElementWidth("quizsurface"), fHeight = setElementHeight("quizsurface", fWidth = 700 <= fWidth ? 700 : fWidth), xRatio = fWidth / bWidth, yRatio = fHeight / bHeight, i = 0; i < dots.length; i++) {
        var xPos = dots[i].getAttribute("data-x"),
            yPos = dots[i].getAttribute("data-y"),
            xPos = (dots[i].getAttribute("data-text"),
                xPos * xRatio - 2 * xRatio),
            yPos = yPos * yRatio - 2 * yRatio,
            dWidth = 14 * xRatio;
        dots[i].style.width = dWidth + "px",
            dots[i].style.height = dWidth + "px",
            dots[i].style.left = xPos + "px",
            dots[i].style.top = yPos + "px"
    }
}

function clickGameObject(event) {
    var soughtAfterId;
    return event.preventDefault(),
        gameRunning && !gameOver && "1" != this.getAttribute("data-ans") && (answerTrials += 1,
            event = tb.getAttribute("data-text"),
            soughtAfterId = tb.getAttribute("data-id"),
            this.getAttribute("data-text"),
            (this.getAttribute("data-text").trim() == event.trim() ? (playCorrectSound(),
                0 < groupItems && setGroupedItemsAnswered(event.trim(), answerTrials, soughtAfterId),
                this.setAttribute("data-ans", "1"),
                setObjColor(this.id, answerTrials),
                answerTrials = 0,
                correctAnswers += 1,
                hideTooltip(),
                updateCorrectCounter(),
                updateScore(),
                resetHint(),
                showNextQuestion) : (playFaultySound(),
                faultyAnswers += 1,
                displayTooltip(this),
                2 < answerTrials && displayHint(soughtAfterId, tb.textContent),
                updateScore(),
                updateFaultyCounter))(),
            updateRemainingGuessesCount(),
            gameRunning) && !gameOver && shallWeFinish(),
        !1
}

function showNextQuestion() {
    var currentQuestion;
    0 < que.length && (currentQuestion = que.pop(),
        tb.setAttribute("data-id", currentQuestion.id),
        tb.setAttribute("data-text", currentQuestion.text),
        tb.textContent = currentQuestion.text,
        updateDashboardHeight())
}

function displayTooltip(obj) {
    var fWidth = getElementWidth("quizsurface"),
        fHeight = setElementHeight("quizsurface", fWidth = 700 <= fWidth ? 700 : fWidth),
        fWidth = fWidth / bWidth,
        fHeight = fHeight / bHeight,
        fWidth = obj.getAttribute("data-x") * fWidth + 18 * fWidth,
        fHeight = obj.getAttribute("data-y") * fHeight + 20 * fHeight,
        obj = obj.getAttribute("data-text"),
        tooltip = (showItemHint || (obj = "Wrong! Try again"),
            getTooltipObject());
    tooltip.textContent = obj,
        tooltip.style.display = "inherit",
        tooltip.style.left = fWidth + "px",
        tooltip.style.top = fHeight + "px",
        setTimeout(hideTooltip, 3e3)
}

function hideTooltip() {
    getTooltipObject().style.display = "none"
}

function getTooltipObject() {
    return document.getElementById("tooltip")
}

function setObjColor(id, trials) {
    switch (gameType) {
        case "QUIZ":
            setDotColor(id, trials);
            break;
        case "VQUIZ":
            setShapeColor(id, trials);
            break;
        case "MC":
        case "TYPING":
        case "MATCH":
            break;
        case "TEXT":
            setTextAnswerBoxColor(id, trials)
    }
}

function setGroupedItemsAnswered(currentQuestion, trials, iid) {
    for (var i = que.length; i--;)
        que[i].text.trim() == currentQuestion.trim() && (document.getElementById(que[i].id).setAttribute("data-ans", "1"),
            setObjColor(que[i].id, trials),
            que.splice(i, 1));
    var i = que.length,
        j = allQuestions.length;
    if (i != j)
        for (; j--;)
            allQuestions[j].text.trim() == currentQuestion.trim() && (document.getElementById(allQuestions[j].id).setAttribute("data-ans", "1"),
                setObjColor(allQuestions[j].id, trials));
    document.getElementById(iid).setAttribute("data-ans", "1"),
        setObjColor(iid, trials)
}

function displayHint(id, currentQuestion) {
    var objClass = "dot";
    switch (gameType) {
        case "VQUIZ":
            objClass = "shapeBody";
            break;
        case "MC":
        case "TYPING":
        case "MATCH":
            break;
        case "TEXT":
            return displayTextHint(id)
    }
    for (var oc = document.getElementsByClassName(objClass), i = 0; i < oc.length; i++)
        oc[i].getAttribute("data-text").trim() == currentQuestion.trim() && 1 != oc[i].getAttribute("data-ans") && setObjColor(oc[i].id, -1)
}

function resetHint() {
    var objClass = "dot";
    switch (gameType) {
        case "VQUIZ":
            objClass = "shape";
            break;
        case "MC":
        case "TYPING":
        case "MATCH":
            break;
        case "TEXT":
            objClass = "text-answer-box"
    }
    for (var oc = document.getElementsByClassName(objClass), i = 0; i < oc.length; i++)
        "0" == oc[i].getAttribute("data-ans") && setObjColor(oc[i].id, 0)
}

function setDotColor(id, trials) {
    switch (trials) {
        case 0:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBod");
            break;
        case 1:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBodOne");
            break;
        case 2:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBodTwo");
            break;
        case 3:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBodThree");
            break;
        default:
        case 4:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBodFour");
            break;
        case -1:
            document.getElementById("dot-" + id + "-bod").setAttribute("class", "dotBodHint")
    }
}
var slides = [],
    compositeImage = new Image,
    customEndPage = 0,
    hasCustomEndPage = !1,
    cWidth = 700,
    cHeight = 400,
    currentTextQuestionOrdinal = 0,
    showScore = !0,
    isLive = !1,
    maxBgo = 0,
    maxBgoForHeight = 0;

function initSlideMCGame() {
    tb = document.getElementById("question-box");
    (surface = document.getElementById("quizsurface")).insertAdjacentHTML("afterend", '<div id="answerArea" class="answer-area" data-ans="1"><div class="row"></div>');
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-slide-mcquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            var data, ciSource, millis;
            200 <= request.status && request.status < 400 && (data = JSON.parse(request.responseText),
                gnon = data.nonce,
                compositeImage.onload = function() {
                    if (void 0 !== data.slides) {
                        var len = data.slides.length;
                        1 == data.game.custom_endpage && (len = data.slides.length - 1,
                            el = data.slides[data.slides.length - 1],
                            customEndPage = new SlideMCQuestion(el.slide_id, el.origin, el.ordinal, el.background_ordinal, el.question, el.answer_correct, el.answer2, el.answer3, el.answer4, el.answer5, el.answer6),
                            hasCustomEndPage = !0,
                            maxBgo = +el.background_ordinal);
                        for (var i = 0; i < len; i++) {
                            var el, tempSlide = new SlideMCQuestion((el = data.slides[i]).slide_id, el.origin, el.ordinal, el.background_ordinal, el.question, el.answer_correct, el.answer2, el.answer3, el.answer4, el.answer5, el.answer6); +
                            el.background_ordinal > maxBgo && (maxBgo = +el.background_ordinal),
                                slides.push(tempSlide)
                        }
                    }
                    isLive = 1 == data.game.live,
                        0 < data.game.mc_random_questions && shuffle(slides),
                        allowNavigation = 1 == data.game.allow_navigation,
                        answerCountWhenDone = slides.length,
                        0 < fixedItemCount && fixedItemCount < slides.length && (answerCountWhenDone = fixedItemCount),
                        0 < (allowedAnswerTrials = 0 == allowedAnswerTrials ? -1 : allowedAnswerTrials) && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                        hidePercentage = data.game.mc_hide_percentage,
                        updateRemainingGuessesCount(),
                        document.getElementById("answerArea").innerHTML = setupHTMLSlideMCQuestion(new SlideMCQuestion(0, 0, 0, 0, "--", "-", "--", "--", "--", "--", "--")),
                        surface.offsetWidth < 700 && setStyleForSmallerScreens();
                    for (var ans = document.getElementsByClassName("mcanswer"), i = 0; i < ans.length; i++)
                        ans[i].addEventListener("click", slideMCDotClicked, !1);
                    document.getElementById("go-back").addEventListener("click", slideMCGoBackClick, !1),
                        document.getElementById("go-forward").addEventListener("click", slideMCGoForwardClick, !1),
                        document.getElementById("mcpaging").setAttribute("class", "mcpaging hidden"),
                        styleAnswerArea(),
                        placeStart()
                },
                ciSource = "/images/game/composite/" + Math.floor(data.game.composite_image_id / 1e3) + "/" + data.game.composite_image_id + ".png",
                millis = Math.floor(Date.now() / 1e3) - 86400,
                Math.floor(data.game.timestamp) > millis && (ciSource = ciSource + "?v=" + Math.floor(data.game.timestamp)),
                compositeImage.src = ciSource)
        }
}

function isGameLive() {
    return 1 == document.getElementById("hsdialog").getAttribute("data-gl")
}

function startSlideMCGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none";
    document.getElementById("quizsurface").style.background = "none",
        document.getElementById("answerArea").style.display = "block",
        surface.style.height = "auto",
        1 == hidePercentage && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
            document.getElementById("gameguesswrong").style.visibility = "hidden",
            document.getElementById("score").style.visibility = "hidden",
            event = getElementWidth("quizsurface"),
            cWidth <= event ? document.getElementById("score").style.visibility = "hidden" : (document.getElementById("score").style.color = "#849CCA",
                document.getElementById("score").style.background = "#849CCA"),
            showScore = !1),
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        document.getElementById("question-box").style.visibility = "hidden",
        surface.setAttribute("class", "qgame-bg gslide"),
        surface.style.backgroundImage = "url('" + compositeImage.src + "')";
    var event = "auto",
        heightMarker = "auto";
    return 700 != surface.offsetWidth && (event = "auto"),
        400 != surface.offsetHeight && (heightMarker = 100 * getMaxSlideStepHeight(maxBgo) + "%"),
        surface.style.backgroundSize = event + " " + heightMarker,
        showMCSlideQuestion(0, !1),
        resizeSlideMCGame(),
        !1
}

function showMCSlideQuestion(questionNo, showAnswersGiven) {
    if (0 < slides.length && questionNo < slides.length) {
        moreThanOneItemCorrect = !0;
        var currentQuestion = slides[questionNo];
        if (currentTextQuestionOrdinal = questionNo,
            document.getElementById("mcquestcount").innerHTML = "Question " + (currentTextQuestionOrdinal + 1) + " of " + answerCountWhenDone,
            document.getElementById("mcquest").innerHTML = currentQuestion.question,
            hasCustomEndPage && gameOver && slides.length - 1 == questionNo)
            showHideQuestionArea("none");
        else {
            showHideQuestionArea("block");
            var ans = document.getElementsByClassName("mcanswer"),
                ansClass = "";
            for (i = 0; i < ans.length; i++)
                currentQuestion.answers.length > i ? (ans[i].innerHTML = currentQuestion.answers[i],
                    ans[i].setAttribute("data-id", i),
                    ansClass = "",
                    currentQuestion.isCorrect(i) && showAnswersGiven && (ansClass = " aone"),
                    !currentQuestion.isCorrect(i) && showAnswersGiven && currentQuestion.userAnsweredWithId == i && (ansClass = " afour"),
                    ans[i].setAttribute("class", "mcanswer" + ansClass)) : ans[i].setAttribute("class", "mcanswer hidden")
        }
        var questionNo = getSlidePercentageStep(maxBgo),
            questionNo = getWidthPlacementFromCount(currentQuestion.backgroundOrdinal) * questionNo,
            slideStepMaxHeight = getMaxSlideStepHeightInGameplay(maxBgo),
            currentSlideHeight = 0;
        0 < slideStepMaxHeight && (currentSlideHeight = 100 * getCurrentHeightStep(currentQuestion.backgroundOrdinal) / slideStepMaxHeight),
            surface.style.backgroundPosition = questionNo + "% " + currentSlideHeight + "%"
    }
}

function getSlidePercentageStep(bgoMax) {
    return 100 / (9 < bgoMax ? 9 : bgoMax)
}

function getWidthPlacementFromCount(counter) {
    return counter < 10 ? counter : counter % 10
}

function getCurrentHeightStep(counter) {
    return Math.floor(counter / 10)
}

function getMaxSlideStepHeight(bgoMax) {
    return bgoMax += 1,
        Math.ceil(bgoMax / 10)
}

function getMaxSlideStepHeightInGameplay(bgoMax) {
    return Math.floor(bgoMax / 10)
}

function showHideQuestionArea(show) {
    document.getElementById("mcquestcount").style.display = show,
        document.getElementById("mcquest").style.display = show;
    var ans = document.getElementsByClassName("mcanswer");
    for (i = 0; i < ans.length; i++)
        ans[i].setAttribute("class", "mcanswer hidden")
}

function setupHTMLSlideMCQuestion(q) {
    for (var html = (html = (html = '<div id="slidemcqh" class="multiple-choice-question noselect">') + '<div class="mcquestion">' + '<div id="mcpaging" class="mcpaging"><span id="go-back" class="rounded-icon social-icon action-paging"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg></span><span id="go-forward" class="rounded-icon social-icon action-paging"><svg width="32" height="32" viewBox="0 0 20 20" class="social-share dasher"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg></span></div>') + '<div id="mcquestcount" class="mccounter">Question ' + (currentTextQuestionOrdinal + 1) + " of " + answerCountWhenDone + '</div><span id="mcquest">' + q.question + "</span></div><ol>", j = 1; j < 7; j++)
        q.answers.length >= j && (html = (html = html + '<li id="mc-answer-' + j + '" class="mcanswer">') + q.answers[j - 1] + "</li>");
    return html += "</ol></div>"
}

function slideMCDotClicked(event) {
    return event.preventDefault(),
        gameRunning && !gameOver && ((slides[currentTextQuestionOrdinal].isCorrect(this.getAttribute("data-id")) ? (correctAnswers += 1,
                updateCorrectCounter(),
                playCorrectSound) : ((showScore ? playFaultySound : playCorrectSound)(),
                faultyAnswers += 1,
                updateFaultyCounter))(),
            slides[currentTextQuestionOrdinal].userAnsweredWithId = this.getAttribute("data-id"),
            updateScore(),
            updateRemainingGuessesCount(),
            gameRunning && !gameOver) && (shallWeFinish() ? (allowNavigation && document.getElementById("mcpaging").setAttribute("class", "mcpaging"),
            hasCustomEndPage ? (slides.push(customEndPage),
                showMCSlideQuestion(currentTextQuestionOrdinal + 1, !1)) : showMCSlideQuestion(currentTextQuestionOrdinal, !0),
            document.getElementById("score").style.color = "#FFF",
            document.getElementById("score").style.background = "#849CCA") : showMCSlideQuestion(currentTextQuestionOrdinal + 1, !1)),
        !1
}

function slideMCGoBackClick(event) {
    return event.preventDefault(),
        slides.length < 2 || showMCSlideQuestion(0 == currentTextQuestionOrdinal ? slides.length - 1 : currentTextQuestionOrdinal - 1, !0),
        !1
}

function slideMCGoForwardClick(event) {
    if (event.preventDefault(),
        slides.length < 2)
        return !1;
    currentTextQuestionOrdinal == slides.length - 1 ? showMCSlideQuestion(0, !0) : showMCSlideQuestion(currentTextQuestionOrdinal + 1, !0)
}

function resizeSlideMCGame() {
    var fWidth = document.getElementById("quizsurface").offsetWidth,
        fWidth = (700 <= fWidth && (fWidth = 700),
            document.getElementById("quizsurface").style.width = fWidth + "px",
            setElementSlideHeight("quizsurface", cWidth = fWidth));
    cHeight = fWidth,
        surface.style.minHeight = cHeight + "px",
        surface.style.maxHeight = cHeight + "px",
        surface.style.height = cHeight + "px"
}

function setElementSlideHeight(id, width) {
    var baseHeight = 550,
        width = width * ((baseHeight = gameRunning ? 400 : baseHeight) / 700);
    return document.getElementById(id).style.height = width + "px",
        width
}

function styleAnswerArea() {
    var el = document.getElementById("answerArea");
    el.style.maxWidth = cWidth + "px",
        el.style.textAlign = "center",
        el.style.margin = "0 auto",
        document.getElementById("slidemcqh").style.minHeight = 0
}

function setStyleForSmallerScreens() {
    var ans = document.getElementsByClassName("mcanswer");
    for (i = 0; i < ans.length; i++)
        ans[i].style.fontSize = "18px",
        ans[i].style.marginBottom = "5px",
        ans[i].style.lineHeight = "1.6";
    document.getElementById("mcquest").style.fontSize = "20px"
}
class StreakAnimator {
    constructor(options = {}) {
        this.config = {
                streakElement: options.streakElement || document.getElementById("streak-counter"),
                animationDuration: options.animationDuration || 1500,
                pulseColor: options.pulseColor || "rgba(255, 255, 255, 0.6)",
                highlightColor: options.highlightColor || "rgba(255, 200, 60, 0.8)",
                maxPulseSize: options.maxPulseSize || 2.5,
                useNumberAnimation: !1 !== options.useNumberAnimation
            },
            this.setupAnimationContainer()
    }
    setupAnimationContainer() {
        var streakEl = this.config.streakElement;
        streakEl && ("static" === window.getComputedStyle(streakEl).position && (streakEl.style.position = "relative"),
            this.animationContainer = document.createElement("div"),
            this.animationContainer.className = "streak-animation-container",
            this.animationContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `,
            streakEl.appendChild(this.animationContainer))
    }
    updateStreak(oldValue, newValue) {
        var streakEl;
        oldValue !== newValue && (streakEl = this.config.streakElement) && (this.createPulseEffect(),
            this.config.useNumberAnimation ? this.animateNumberChange(oldValue, newValue) : streakEl.textContent = newValue)
    }
    createPulseEffect() {
        let pulseEl = document.createElement("div");
        pulseEl.className = "streak-pulse",
            pulseEl.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: ${this.config.pulseColor};
      opacity: 0.8;
    `,
            this.animationContainer.appendChild(pulseEl),
            setTimeout(() => {
                pulseEl.animate([{
                    transform: "translate(-50%, -50%) scale(0)",
                    opacity: .8,
                    background: this.config.highlightColor
                }, {
                    transform: `translate(-50%, -50%) scale(${this.config.maxPulseSize})`,
                    opacity: 0,
                    background: this.config.pulseColor
                }], {
                    duration: this.config.animationDuration,
                    easing: "cubic-bezier(0.11, 0, 0.5, 0)"
                }).onfinish = () => {
                    pulseEl.remove()
                }
            }, 50)
    }
    animateNumberChange(oldValue, newValue) {
        let streakEl = this.config.streakElement,
            duration = .6 * this.config.animationDuration,
            increment = oldValue < newValue ? 1 : -1,
            steps = Math.abs(newValue - oldValue);
        duration,
        steps;
        streakEl.classList.add("streak-highlight");
        let currentValue = oldValue,
            startTime = null,
            animateStep = timestamp => {
                var timestamp = timestamp - (startTime = startTime || timestamp),
                    timestamp = Math.min(timestamp / duration, 1),
                    easedProgress = this.easeOutBack(timestamp),
                    easedProgress = Math.floor(steps * easedProgress),
                    easedProgress = oldValue + easedProgress * increment;
                currentValue !== easedProgress && (currentValue = easedProgress,
                        streakEl.textContent = currentValue,
                        streakEl.style.transform = `scale(${1 + .2 * (1 - timestamp)})`),
                    timestamp < 1 ? requestAnimationFrame(animateStep) : (streakEl.textContent = newValue,
                        streakEl.style.transform = "",
                        setTimeout(() => {
                            streakEl.classList.remove("streak-highlight")
                        }, 300))
            };
        requestAnimationFrame(animateStep)
    }
    easeOutBack(x) {
        return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2)
    }
}

function showStreakAnimation(streakCount) {
    var styleEl;
    document.getElementById("streak-style") || ((styleEl = document.createElement("style")).id = "streak-style",
        styleEl.textContent = `
.streak-container {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.streak-animation {
  font-size: clamp(2.5rem, 1vw, 3rem);
  font-weight: bold;
  color: #FFD700; /* Gold color */
  text-shadow: 0 0 10px rgba(215, 215, 0, 0.4);
  opacity: 0;
  transform: scale(0.5);
  animation: streakAnimation 3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  text-align: center;
  position: relative;
}

.streak-animation::before, .streak-animation::after {
  content: "";
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  z-index: -1;
  border-radius: 50%;
  animation: pulseGlow 1.5s ease-in-out infinite alternate;
}

.streak-animation::after {
  animation-delay: 0.5s;
}

@keyframes streakAnimation {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(30px) rotate(-5deg);
  }
  20% {
    opacity: 1;
    transform: scale(1.3) translateY(-10px) rotate(5deg);
  }
  30% {
    transform: scale(1.1) translateY(0) rotate(-3deg);
  }
  40% {
    transform: scale(1.2) translateY(-5px) rotate(2deg);
  }
  70% {
    opacity: 1;
    transform: scale(1) translateY(0) rotate(0);
  }
  100% {
    opacity: 0;
    transform: scale(1.1) translateY(-80px);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.1;
  }
}`,
        document.head.appendChild(styleEl));
    let container = document.querySelector(".streak-container"),
        streakEl = (container || ((container = document.createElement("div")).className = "streak-container",
                document.getElementById("gc-pg").appendChild(container)),
            document.createElement("div"));
    streakEl.className = "streak-animation",
        streakEl.textContent = 1 === streakCount ? streakCount + " Day Streak!" : streakCount + " Days Streak!",
        container.innerHTML = "",
        container.appendChild(streakEl),
        setTimeout(() => {
            streakEl.remove();
            var styleEl, strel = document.getElementById("streak-counter"),
                oldValue = parseInt(strel.dataset.streak, 10) || 0,
                strel = new StreakAnimator({
                    streakElement: strel,
                    pulseColor: "rgba(255, 255, 255, 0.6)",
                    highlightColor: "rgba(255, 200, 60, 0.8)"
                });
            (styleEl = document.createElement("style")).textContent = `
        .streak-highlight {
          color: #ffcc3d !important;
          text-shadow: 0 0 10px rgba(255, 204, 61, 0.6);
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
      `,
                document.head.appendChild(styleEl),
                strel.updateStreak(oldValue, oldValue + 1)
        }, 3e3)
}
var textRows = [],
    currentTextQuestionOrdinal = 0,
    clib = [];

function initTextGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-textquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    ans = (gnon = data.nonce,
                        []),
                    orgQue = [],
                    itemLength = data.items.length;
                for (i = 0; i < itemLength; i++) {
                    var q = new Question(i, data.items[i].question);
                    que.push(q),
                        orgQue.push(q),
                        q.answer = data.items[i].answer,
                        ans.push(getTextAnswerBoxBuildingBlock(i, data.items[i].answer))
                }
                2 == data.game.mc_random_questions ? shuffle(que) : (3 != data.game.mc_random_questions && shuffle(que),
                        shuffle(ans)),
                    1 == data.game.allow_navigation && (allowNavigation = 1);
                var rawNumberOfQuestions = que.length;
                if (answerCountWhenDone = groupItems ? getUniqueArrayCount(que) : rawNumberOfQuestions,
                    0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount,
                        groupItems) && (que = getFixedArrayCountWithGroups(que, fixedItemCount)).length < fixedItemCount && (answerCountWhenDone = que.length),
                    0 < allowedAnswerTrials && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                    updateRemainingGuessesCount(),
                    1 == (hidePercentage = data.game.mc_hide_percentage) && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
                        document.getElementById("gameguesswrong").style.visibility = "hidden",
                        document.getElementById("score").style.visibility = "hidden"),
                    answerCountWhenDone != que.length && 0 == data.game.show_question) {
                    shuffle(que);
                    var newQue = que.slice(0, answerCountWhenDone),
                        finalQue = [],
                        itemLength = orgQue.length,
                        newItemLength = newQue.length;
                    for (i = 0; i < itemLength; i++)
                        for (j = 0; j < newItemLength; j++)
                            orgQue[i].id == newQue[j].id && finalQue.push(orgQue[i]);
                    ans = [],
                        itemLength = (que = finalQue).length;
                    for (i = 0; i < itemLength; i++)
                        ans.push(getTextAnswerBoxBuildingBlock(que[i].id, que[i].answer));
                    2 == data.game.mc_random_questions ? shuffle(que) : (3 != data.game.mc_random_questions && shuffle(que),
                        shuffle(ans))
                }
                var questionTextLength = 0,
                    answerTextLength = 0,
                    answerArea = '<div id="answerArea" class="answer-area" data-ans="1">';
                for (itemLength = (allQuestions = que).length,
                    i = 0; i < itemLength; i++)
                    answerTextLength < que[i].answer.length && (answerTextLength = que[i].answer.length),
                    questionTextLength < que[i].text.length && (questionTextLength = que[i].text.length),
                    answerArea += ans[i],
                    clib.push(que[i]);
                surface.insertAdjacentHTML("afterbegin", answerArea += "</div>"),
                    setTimeout(setupAllAnswers, 200);
                rawNumberOfQuestions = !1;
                que.length < 10 && answerTextLength < 15 ? (data.cssData = ".text-answer-box{font-size:1.4rem;}",
                        rawNumberOfQuestions = !0) : que.length < 10 && answerTextLength < 20 ? (data.cssData = ".text-answer-box{font-size:1.2rem;}",
                        rawNumberOfQuestions = !0) : (que.length < 15 && answerTextLength < 10 || que.length < 30 && answerTextLength < 6) && (data.cssData = ".text-answer-box{font-size:1.4rem;}",
                        rawNumberOfQuestions = !0),
                    questionTextLength < 12 && (data.cssData += " .text-question{font-size:1.4rem;} "),
                    questionTextLength < 20 && (data.cssData += " .text-question{font-size:1.2rem;} "),
                    rawNumberOfQuestions && setupCss(data),
                    placeStart()
            }
        }
}

function setupAllAnswers(e) {
    var allAnswers = document.getElementsByClassName("text-answer-box");
    for (i = 0; i < allAnswers.length; i++)
        allAnswers[i].addEventListener("click", clickTextAnswerBox, !1)
}

function startTextGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    return event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none",
        document.getElementById("quizsurface").style.background = "none",
        document.getElementById("answerArea").style.display = "block",
        surface.style.height = "auto",
        1 == allowNavigation && (document.getElementById("go-back").addEventListener("click", textGoBackClick, !1),
            document.getElementById("go-forward").addEventListener("click", textGoForwardClick, !1)),
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        showTextQuestion(0),
        !1
}

function clickTextAnswerBox(event) {
    var myClickedId;
    return event.preventDefault(),
        gameRunning && !gameOver && "1" != this.getAttribute("data-ans") && (answerTrials += 1,
            event = tb.getAttribute("data-id"),
            myClickedId = this.getAttribute("data-id"),
            resetAllTextAnswerBoxes(),
            getTextAnswerForId(myClickedId) == getTextAnswerForId(event) ? (playCorrectSound(),
                this.setAttribute("data-ans", "1"),
                this.setAttribute("class", "text-answer-box correct"),
                setObjColor(this.id, answerTrials),
                resetHint(),
                answerTrials = 0,
                correctAnswers += 1,
                updateCorrectCounter(),
                updateScore(),
                removeQuestionFromTextList(event),
                showTextQuestion(0)) : (playFaultySound(),
                faultyAnswers += 1,
                updateScore(),
                updateFaultyCounter(),
                this.setAttribute("class", "text-answer-box error"),
                2 < answerTrials && displayHint(event, event)),
            updateRemainingGuessesCount(),
            gameRunning) && !gameOver && shallWeFinish(),
        !1
}

function getTextAnswerForId(id) {
    for (var ql = clib.length, i = 0; i < ql; i++)
        if (clib[i].id == id)
            return clib[i].answer;
    return !1
}

function displayTextHint(id) {
    for (var oc = document.getElementsByClassName("text-answer-box"), i = 0; i < oc.length; i++)
        oc[i].getAttribute("data-id") == id && 1 != oc[i].getAttribute("data-ans") && setObjColor(oc[i].id, -1)
}

function removeQuestionFromTextList(correctId) {
    for (var i = que.length; i--;)
        que[i].id == correctId && que.splice(i, 1)
}

function resetAllTextAnswerBoxes() {
    var els = document.getElementsByClassName("text-answer-box"),
        count = els.length;
    for (i = 0; i < count; i++)
        1 != els[i].getAttribute("data-ans") && els[i].setAttribute("class", "text-answer-box")
}

function showTextQuestion(questionNo) {
    var currentQuestion;
    0 < que.length && questionNo < que.length && (currentQuestion = que[questionNo],
        currentTextQuestionOrdinal = questionNo,
        tb.setAttribute("data-id", currentQuestion.id),
        tb.setAttribute("data-text", currentQuestion.text),
        document.getElementById("text-question-content").textContent = currentQuestion.text,
        updateDashboardHeight())
}

function textGoBackClick(event) {
    return event.preventDefault(),
        que.length < 2 || showTextQuestion(0 == currentTextQuestionOrdinal ? que.length - 1 : currentTextQuestionOrdinal - 1),
        !1
}

function textGoForwardClick(event) {
    return event.preventDefault(),
        textGoForward(),
        !1
}

function textGoForward() {
    if (que.length < 1)
        return !1;
    currentTextQuestionOrdinal == que.length - 1 ? showTextQuestion(0) : showTextQuestion(currentTextQuestionOrdinal + 1)
}

function resizeTextGame() {
    var fWidth = getElementWidth("quizsurface");
    setElementHeight("quizsurface", fWidth = 700 <= fWidth ? 700 : fWidth)
}

function getTextAnswerBoxBuildingBlock(i, a) {
    return '<div id="' + i + '-bo" data-id="' + i + '" class="text-answer-box">' + a + "</div>"
}

function setTextAnswerBoxColor(id, trials) {
    var bo = document.getElementById(id);
    switch (trials) {
        case 0:
            bo.setAttribute("class", "text-answer-box");
            break;
        case 1:
            bo.setAttribute("class", "text-answer-box answerInOne");
            break;
        case 2:
            bo.setAttribute("class", "text-answer-box answerInTwo");
            break;
        case 3:
            bo.setAttribute("class", "text-answer-box answerInThree");
            break;
        default:
        case 4:
            bo.setAttribute("class", "text-answer-box answerInFour");
            break;
        case -1:
            bo.setAttribute("class", "text-answer-box answerHint")
    }
}
var demandFixedOrder = !1,
    animTime = 0,
    acceptAnyWord = 0,
    showQuestions = !0,
    showClue = !1,
    oneAtATime = !1,
    questionIsAnswered = !0,
    showAnswerGameOver = !1,
    typingFixedItemCount = 0,
    clueBefore = !1,
    typingColumnCount = 0,
    typingQuestionWidth = 0,
    typingAnswerWidth = 0,
    typingClueWidth = 0,
    typingInsidePad = 0,
    typingOutsidePad = 1,
    hasHeading = !1,
    clueArray = [];

function TypingRow(ordinal, question, clue, answer, answerAlt1, answerAlt2, answerAlt3, answerAlt4) {
    this.ordinal = ordinal,
        this.question = clearNA(question),
        this.clue = clearNA(clue),
        this.answer = answer,
        this.answerAlt1 = answerAlt1,
        this.answerAlt2 = answerAlt2,
        this.answerAlt3 = answerAlt3,
        this.answerAlt4 = answerAlt4,
        this.isAnswered = !1
}

function clearNA(pna) {
    return "[N/A]" == pna ? "" : pna
}

function initTypingGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-typingquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    itemLength = (gnon = data.nonce,
                        acceptAnyWord = data.game.accept_any_word,
                        0 < data.game.allow_navigation && (showAnswerGameOver = !0),
                        0 == data.game.show_question && (showQuestions = !1),
                        0 < data.game.show_clue && (showClue = !0),
                        1 == data.game.show_clue && (clueBefore = !0),
                        1 == data.game.show_one_at_a_time && (oneAtATime = !0),
                        data.items.length);
                for (i = 0; i < itemLength; i++)
                    0 < data.items[i].ordinal ? que.push(new TypingRow(data.items[i].ordinal, data.items[i].question, data.items[i].clue, data.items[i].answer, data.items[i].answer_alt1, data.items[i].answer_alt2, data.items[i].answer_alt3, data.items[i].answer_alt4)) : 0 == data.items[i].ordinal && (hasHeading = !0);
                setupCss(data);
                0 < data.game.mc_random_questions && shuffle(que);
                var rawNumberOfQuestions = (rawQuestions = allQuestions = que).length;
                answerCountWhenDone = rawNumberOfQuestions,
                    0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount),
                    0 < allowedAnswerTrials && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                    hidePercentage = data.game.mc_hide_percentage,
                    0 < data.game.fixed_item_count && (typingFixedItemCount = data.game.fixed_item_count,
                        data.game.fixed_item_count < answerCountWhenDone) && setTypingFixedItemCount(answerCountWhenDone = data.game.fixed_item_count),
                    updateRemainingGuessesCount(),
                    1 == data.game.fixed_order && (demandFixedOrder = !0),
                    setupCellWidths(),
                    setupTypingGame(),
                    hasHeading && setTypingColHead(data.items[0]),
                    document.getElementById("typing-field").addEventListener("keypress", typingKeyIsPressed, !1),
                    document.getElementById("typing-btn").addEventListener("click", typingBtnClicked, !1),
                    1 == data.game.mc_hide_percentage && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
                        document.getElementById("gameguesswrong").style.visibility = "hidden",
                        document.getElementById("score").style.visibility = "hidden"),
                    placeStart()
            }
        }
}

function postFinishTypingGame() {
    if (showAnswerGameOver)
        if (0 < fixedItemCount)
            for (var i = 0; i < que.length; i++) {
                var ordinal = que[i].ordinal,
                    posEl = document.getElementById("ord-" + ordinal);
                if (null !== posEl)
                    if ("" == (aans = document.getElementById("ord-" + que[i].ordinal)).textContent.trim())
                        for (var j = 0; j < que.length; j++)
                            if (!que[j].isAnswered) {
                                que[j].isAnswered = !0,
                                    aans.textContent = que[j].answer,
                                    aans.style.color = "#000",
                                    aans.style.backgroundColor = "#ef9a9a",
                                    showClue && ((tcll = document.getElementById("typing-clue-" + que[j].ordinal)).textContent = que[j].clue,
                                        tcll.style.color = "#000",
                                        tcll.style.backgroundColor = "#ef9a9a"),
                                    showQuestions && ((tsq = document.getElementById("typing-question-" + que[j].ordinal)).textContent = que[j].question,
                                        tsq.style.color = "#000",
                                        tsq.style.backgroundColor = "#ef9a9a");
                                break
                            }
            }
    else
        for (i = 0; i < que.length; i++) {
            var aans, tcll, tsq, ordinal = que[i].ordinal;
            null === (posEl = document.getElementById("ord-" + ordinal)) || que[i].isAnswered || ((aans = document.getElementById("ord-" + que[i].ordinal)).textContent = que[i].answer,
                aans.style.color = "#000",
                aans.style.backgroundColor = "#ef9a9a",
                showClue && ((tcll = document.getElementById("typing-clue-" + que[i].ordinal)).textContent = que[i].clue,
                    tcll.style.color = "#000",
                    tcll.style.backgroundColor = "#ef9a9a"),
                showQuestions && ((tsq = document.getElementById("typing-question-" + que[i].ordinal)).textContent = que[i].question,
                    tsq.style.color = "#000",
                    tsq.style.backgroundColor = "#ef9a9a"))
        }
}

function startTypingGame(event) {
    event.preventDefault(),
        toggleNMElements(!1),
        document.getElementById("startGame").removeEventListener("click", startGame),
        document.getElementById("cave").addEventListener("click", caveIn);
    event = document.getElementsByClassName("start-btn");
    return event[0].style.zIndex = "0",
        event[0].style.visibility = "hidden",
        event[0].style.display = "none",
        document.getElementById("quizsurface").style.background = "none",
        document.getElementById("answerArea").style.display = "block",
        surface.style.height = "auto",
        timer.onTick(format),
        timer.start(),
        gameRunning = !0,
        document.getElementById("question-box").style.visibility = "hidden",
        prepareTypingQuestion(),
        document.getElementById("typing-field").focus(),
        !1
}

function prepareTypingQuestion() {
    if (oneAtATime && questionIsAnswered && showQuestions) {
        for (var i = 0; i < answerCountWhenDone; i++)
            if (0 < que[i].ordinal) {
                if (!que[i].isAnswered) {
                    document.getElementById("typing-question-" + que[i].ordinal).textContent = que[i].question,
                        showClue && clueBefore && (document.getElementById("typing-clue-" + que[i].ordinal).textContent = que[i].clue),
                        questionIsAnswered = !1;
                    break
                }
                showClue && !clueBefore && (document.getElementById("typing-clue-" + que[i].ordinal).textContent = que[i].clue)
            }
    } else if (questionIsAnswered && showClue && showQuestions)
        for (i = 0; i < answerCountWhenDone; i++)
            0 < que[i].ordinal && que[i].isAnswered && (showClue && !clueBefore && (document.getElementById("typing-clue-" + que[i].ordinal).textContent = que[i].clue),
                questionIsAnswered = !1)
}

function typingKeyIsPressed(event) {
    if ("13" == (event.keyCode || event.which)) {
        if (!gameRunning)
            return !1;
        checkTypingAnswer(document.getElementById("typing-field").value)
    }
}

function typingBtnClicked(event) {
    return event.preventDefault(),
        gameRunning && checkTypingAnswer(document.getElementById("typing-field").value),
        !1
}

function setTypingFont(text, questionCount) {
    return ""
}

function checkTypingAnswer(given) {
    var found = !1,
        ordinal = 0,
        correctAnswer = "n",
        testCount = 0;
    if (0 < typingFixedItemCount && !showQuestions) {
        for (var i = 0; i < rawQuestions.length; i++)
            if (!rawQuestions[i].isAnswered) {
                if (1 < (testCount += 1) && demandFixedOrder || 1 < testCount && oneAtATime)
                    break;
                if (ordinal = rawQuestions[i].ordinal,
                    correctAnswer = rawQuestions[i].answer,
                    0 < ordinal) {
                    if (found = compareTypingAnswer(given, rawQuestions[i].answer, rawQuestions[i].isAnswered)) {
                        rawQuestions[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, rawQuestions[i].answerAlt1, rawQuestions[i].isAnswered)) {
                        rawQuestions[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, rawQuestions[i].answerAlt2, rawQuestions[i].isAnswered)) {
                        rawQuestions[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, rawQuestions[i].answerAlt3, rawQuestions[i].isAnswered)) {
                        rawQuestions[i].isAnswered = !0;
                        break
                    }
                    found = compareTypingAnswer(given, rawQuestions[i].answerAlt4, rawQuestions[i].isAnswered)
                }
            }
    } else
        for (i = 0; i < answerCountWhenDone; i++)
            if (!que[i].isAnswered) {
                if (1 < (testCount += 1) && demandFixedOrder || 1 < testCount && oneAtATime)
                    break;
                if (ordinal = que[i].ordinal,
                    correctAnswer = que[i].answer,
                    0 < ordinal) {
                    if (found = compareTypingAnswer(given, que[i].answer, que[i].isAnswered)) {
                        que[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, que[i].answerAlt1, que[i].isAnswered)) {
                        que[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, que[i].answerAlt2, que[i].isAnswered)) {
                        que[i].isAnswered = !0;
                        break
                    }
                    if (found = compareTypingAnswer(given, que[i].answerAlt3, que[i].isAnswered)) {
                        que[i].isAnswered = !0;
                        break
                    }
                    found = compareTypingAnswer(given, que[i].answerAlt4, que[i].isAnswered)
                }
            }
    found ? (document.getElementById("typing-field").setAttribute("class", "typ-input typ-correct"),
            document.getElementById("typing-btn").setAttribute("class", "btn typ-btn typ-btn-correct"),
            playCorrectSound(),
            correctAnswers += 1,
            updateCorrectCounter(),
            setCorrectCell(ordinal, correctAnswer, que[i].clue),
            questionIsAnswered = !0) : (document.getElementById("typing-field").setAttribute("class", "typ-input typ-faulty"),
            document.getElementById("typing-btn").setAttribute("class", "btn typ-btn typ-btn-faulty"),
            faultyAnswers += 1,
            updateFaultyCounter(),
            playFaultySound()),
        updateScore(),
        prepareTypingQuestion(),
        updateRemainingGuessesCount(),
        gameRunning && !gameOver && shallWeFinish(),
        setTimeout(function() {
            resetInput()
        }, 600),
        document.getElementById("typing-field").value = "",
        document.getElementById("typing-field").focus()
}

function resetInput() {
    document.getElementById("typing-field").setAttribute("class", "typ-input"),
        document.getElementById("typing-btn").setAttribute("class", "btn typ-btn")
}

function compareTypingAnswer(a, b, isAnswered) {
    if (!isAnswered && (a = a.trim(),
            "[N/A]" != (b = b.trim()))) {
        if (a.toLowerCase() == b.toLowerCase())
            return !0;
        if (1 == acceptAnyWord) {
            var arr = b.split(" ");
            if (1 < arr.length)
                for (var i = 0; i < arr.length; i++)
                    if (arr[i].toLowerCase() == a.toLowerCase())
                        return !0
        }
    }
    return !1
}

function setCorrectCell(ordinal, answer, clue) {
    var objs;
    0 < typingFixedItemCount && !showQuestions ? ((objs = document.getElementsByClassName("typing-answer"))[correctAnswers - 1].textContent = answer,
        objs[correctAnswers - 1].setAttribute("class", "typing-answer typing-correct-cell"),
        0 != (objs = document.getElementsByClassName("typing-clue")).length && (objs[correctAnswers - 1].textContent = rawQuestions[ordinal - 1].clue)) : (document.getElementById("ord-" + ordinal).textContent = answer,
        document.getElementById("ord-" + ordinal).setAttribute("class", "typing-answer typing-correct-cell"),
        showClue && (document.getElementById("typing-clue-" + ordinal).textContent = clue))
}

function setTypingFixedItemCount(count) {
    for (; que.length > answerCountWhenDone;) {
        var desiredIndex = Math.floor(Math.random() * answerCountWhenDone);
        que.splice(desiredIndex, 1)
    }
}

function setupCellWidths() {
    var splitter = document.getElementById("tdim").getAttribute("data-id").split("-");
    typingColumnCount = +splitter[0],
        typingQuestionWidth = +splitter[1],
        typingAnswerWidth = +splitter[2],
        typingClueWidth = +splitter[3],
        typingInsidePad = +splitter[4],
        typingOutsidePad = +splitter[5],
        0 == typingColumnCount && (typingColumnCount = answerCountWhenDone < 11 ? 1 : answerCountWhenDone < 21 ? 2 : 3),
        getElementWidth("quizsurface") < 700 && (typingColumnCount = answerCountWhenDone < 21 ? 1 : 2),
        showQuestions || showClue ? showQuestions && !showClue ? (typingInsidePad /= 2,
            typingOutsidePad /= 2) : (typingInsidePad /= 3,
            typingOutsidePad /= 3) : (typingInsidePad = 1,
            typingOutsidePad = 2),
        typingQuestionWidth = typingQuestionWidth / typingColumnCount - typingInsidePad,
        typingAnswerWidth = typingAnswerWidth / typingColumnCount - typingInsidePad,
        typingClueWidth = typingClueWidth / typingColumnCount - typingInsidePad
}

function setupTypingGame() {
    if (document.getElementById("typingbody").insertAdjacentHTML("afterbegin", '<table id="typing-table" class="typing-table"><tbody id="typing-table-body"></tbody></table>'),
        1 == typingColumnCount)
        for (var i = 0; i < answerCountWhenDone; i++)
            setupTypingCell(i, i, 0, answerCountWhenDone);
    else if (2 == typingColumnCount || showClue) {
        for (var questionNo = 0, colNo = 0, i = 0; i < answerCountWhenDone; i += 2)
            i < answerCountWhenDone && (setupTypingCell(questionNo, i, colNo, answerCountWhenDone),
                questionNo += 1);
        for (i = colNo = 1; i < answerCountWhenDone; i += 2)
            i < answerCountWhenDone && (setupTypingCell(questionNo, i - 1, colNo, answerCountWhenDone),
                questionNo += 1)
    } else if (3 == typingColumnCount && !showClue) {
        for (questionNo = 0,
            colNo = 0,
            i = 0; i < answerCountWhenDone; i += 3)
            i < answerCountWhenDone && (setupTypingCell(questionNo, i, colNo, answerCountWhenDone),
                questionNo += 1);
        for (i = colNo = 1; i < answerCountWhenDone; i += 3)
            i < answerCountWhenDone && (setupTypingCell(questionNo, i - 1, colNo, answerCountWhenDone),
                questionNo += 1);
        for (i = colNo = 2; i < answerCountWhenDone; i += 3)
            i < answerCountWhenDone && (setupTypingCell(questionNo, i - 2, colNo, answerCountWhenDone),
                questionNo += 1)
    }
    setupWidths(document.getElementsByClassName("typing-question"), typingQuestionWidth),
        setupWidths(document.getElementsByClassName("typing-answer"), typingAnswerWidth),
        setupWidths(document.getElementsByClassName("typing-clue"), typingClueWidth),
        setupWidths(document.getElementsByClassName("typing-inside-pad"), typingInsidePad),
        setupWidths(document.getElementsByClassName("typing-outside-pad"), typingOutsidePad)
}

function setupWidths(els, width) {
    if (null === els)
        return !1;
    for (i = 0; i < els.length; i++)
        els[i].style.width = width + "%";
    return !0
}

function setupTypingCell(questionNo, rowNo, columnNo, totalCount) {
    var questionText = que[questionNo].question,
        ordinal = que[questionNo].ordinal,
        questionNo = que[questionNo].clue,
        typingTableBody = (clueBefore || (questionNo = "&nbsp;"),
            oneAtATime && (questionNo = questionText = ""),
            document.getElementById("typing-table-body"));
    1 == typingColumnCount ? (document.getElementById("typing-table").style.width = "85%",
            typingTableBody.insertAdjacentHTML("beforeend", '<tr id="typing-row-' + rowNo + '"></tr>')) : (2 == typingColumnCount && columnNo % 2 == 0 && !showClue || columnNo % 3 == 0 && 3 == typingColumnCount && !showClue || columnNo % 2 == 0 && showClue) && typingTableBody.insertAdjacentHTML("beforeend", '<tr id="typing-row-' + rowNo + '"></tr>'),
        showQuestions && ("[N/A]" != questionText ? document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td id="typing-question-' + ordinal + '" class="typing-question tyqu1">' + questionText + "</td>") : document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td id="typing-question-' + ordinal + '" class="typing-question tyqu1">&nbsp;</td>'),
            document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td class="typing-inside-pad"></td>')),
        document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td class="typing-answer tyan1" id="ord-' + ordinal + '">&nbsp;</td>'),
        showClue && (document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td class="typing-inside-pad"></td>'),
            document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td id="typing-clue-' + ordinal + '" class="typing-clue tycl1">' + questionNo + "</td>")),
        1 < typingColumnCount && document.getElementById("typing-row-" + rowNo).insertAdjacentHTML("beforeend", '<td class="typing-outside-pad"></td>')
}

function setTypingColHead(item) {
    document.getElementById("typing-table").insertAdjacentHTML("afterbegin", '<thead id="typing-table-head"></thead>'),
        document.getElementById("typing-table-head").insertAdjacentHTML("afterbegin", '<tr id="typing-heading"></tr>');
    var tr = document.getElementById("typing-heading");
    showQuestions && ("[N/A]" != item.question ? tr.insertAdjacentHTML("beforeend", "<th>" + item.question + "</th>") : tr.insertAdjacentHTML("beforeend", "<th></th>"),
            tr.insertAdjacentHTML("beforeend", '<th class="typing-pad"></th>')),
        tr.insertAdjacentHTML("beforeend", "<th>" + item.answer + "</th>"),
        showClue && (tr.insertAdjacentHTML("beforeend", '<th class="typing-inside-pad"></th>'),
            tr.insertAdjacentHTML("beforeend", "<th>" + item.clue + "</th>")),
        1 < typingColumnCount && (tr.insertAdjacentHTML("beforeend", '<th class="typing-outside-pad"></th>'),
            showQuestions && ("[N/A]" != item.question ? tr.insertAdjacentHTML("beforeend", "<th>" + item.question + "</th>") : tr.insertAdjacentHTML("beforeend", "<th></th>"),
                tr.insertAdjacentHTML("beforeend", '<th class="typing-pad"></th>')),
            tr.insertAdjacentHTML("beforeend", "<th>" + item.answer + "</th>"),
            showClue) && (tr.insertAdjacentHTML("beforeend", '<th class="typing-pad"></th>'),
            tr.insertAdjacentHTML("beforeend", "<th>" + item.clue + "</th>")),
        2 < typingColumnCount && (tr.insertAdjacentHTML("beforeend", '<th class="typing-outside-pad"></th>'),
            showQuestions && ("[N/A]" != item.question ? tr.insertAdjacentHTML("beforeend", "<th>" + item.question + "</th>") : tr.insertAdjacentHTML("beforeend", "<th></th>"),
                tr.insertAdjacentHTML("beforeend", '<th class="typing-pad"></th>')),
            tr.insertAdjacentHTML("beforeend", "<th>" + item.answer + "</th>"),
            showClue) && (tr.insertAdjacentHTML("beforeend", '<th class="typing-pad"></th>'),
            tr.insertAdjacentHTML("beforeend", "<th>" + item.clue + "</th>"))
}
var shapes = [];

function initVQuizGame() {
    tb = document.getElementById("question-box"),
        surface = document.getElementById("quizsurface");
    var request = new XMLHttpRequest;
    request.open("GET", l10nBaseUri + "/api/1.0/get-vquiz?game_id=" + gameId + "&token=" + mT + "&language_id=" + languageId, !0),
        request.send(),
        request.onload = function() {
            if (200 <= request.status && request.status < 400) {
                var data = JSON.parse(request.responseText),
                    svg = (gnon = data.nonce,
                        '<svg id="shape" class="svg-shape" viewBox="0 0 700 550" xmlns="http://www.w3.org/2000/svg">'),
                    itemLength = data.items.length;
                for (i = 0; i < itemLength; i++)
                    svg += new Shape(i, data.items[i].data, data.items[i].question.replace(/\r?\n?/g, "")).getHTML(),
                    que.push(new Question(i, data.items[i].question.replace(/\r?\n?/g, "")));
                surface.insertAdjacentHTML("afterbegin", svg += "</svg>"),
                    placeShapes(),
                    shuffle(que);
                var rawNumberOfQuestions = (allQuestions = que).length;
                answerCountWhenDone = groupItems ? getUniqueArrayCount(que) : rawNumberOfQuestions,
                    0 < fixedItemCount && fixedItemCount < que.length && (answerCountWhenDone = fixedItemCount,
                        groupItems) && (que = getFixedArrayCountWithGroups(que, fixedItemCount)).length < fixedItemCount && (answerCountWhenDone = que.length),
                    0 < allowedAnswerTrials && answerCountWhenDone < allowedAnswerTrials && 0 < fixedItemCount && (allowedAnswerTrials = answerCountWhenDone),
                    updateRemainingGuessesCount(),
                    1 == (hidePercentage = data.game.mc_hide_percentage) && (document.getElementById("gameguesscorrect").style.visibility = "hidden",
                        document.getElementById("gameguesswrong").style.visibility = "hidden",
                        document.getElementById("score").style.visibility = "hidden"),
                    placeStart()
            }
        }
}

function placeShapes() {
    setElementHeight("quizsurface", getElementWidth("quizsurface"));
    shapes = document.getElementsByClassName("shapeBody");
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].getAttribute("data-text");
        shapes[i].style.zIndex = 100 + i,
            shapes[i].addEventListener("click", clickGameObject)
    }
}

function resizeVQuizGame() {
    var fWidth = getElementWidth("quizsurface");
    setElementHeight("quizsurface", fWidth = 700 <= fWidth ? 700 : fWidth)
}

function setShapeColor(id, trials) {
    var bo = document.getElementById(id);
    switch (trials) {
        case 0:
            bo.setAttribute("class", "shapeBody");
            break;
        case 1:
            bo.setAttribute("class", "shapeBodyOne");
            break;
        case 2:
            bo.setAttribute("class", "shapeBodyTwo");
            break;
        case 3:
            bo.setAttribute("class", "shapeBodyThree");
            break;
        default:
        case 4:
            bo.setAttribute("class", "shapeBodyFour");
            break;
        case -1:
            bo.setAttribute("class", "shapeBodyHint")
    } -
    1 != trials && 0 != trials && (bo.style.opacity = shapeAlpha < 100 ? "0." + shapeAlpha : "0.90")
}