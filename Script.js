
const sceneImage = document.getElementById("scene-image");
const sceneName = document.getElementById("scene-name");
const middle = document.getElementById("middle");
const storyText = document.getElementById("story-text");
const cursor = document.getElementById("cursor");
const choicesArea = document.getElementById("choices");

const typeSpeed = 24;

let typing = false;
let typingTimer;
let currentLines = [];
let currentLine = 0;
let currentCallback = null;

const backgroundMusic = new Audio("sounds/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;

const babbleSounds = {
    MARA: new Audio("sounds/mara.mp3"),
    ELISE: new Audio("sounds/elise.mp3"),
    NARRATOR: new Audio("sounds/narrator.mp3")
};

Object.values(babbleSounds).forEach(function(sound) {
    sound.loop = true;
    sound.volume = 0.15;
});

function startBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(function() {});
    }
}

document.addEventListener("click", startBackgroundMusic, { once: true });

function stopBabble() {
    Object.values(babbleSounds).forEach(function(sound) {
        sound.pause();
        sound.currentTime = 0;
    });
}

function startBabble(speaker) {
    stopBabble();

    let sound = babbleSounds[speaker] || babbleSounds.NARRATOR;

    sound.play().catch(function() {});
}

function setScene(image, name) {
    sceneImage.src = image;
    sceneName.textContent = name;
    sceneImage.style.objectFit = "contain";
}

function clearChoices() {
    choicesArea.innerHTML = "";
}

function addChoice(text, callback) {
    const button = document.createElement("button");

    button.className = "bottom-box";
    button.textContent = text;
    button.addEventListener("click", callback);

    choicesArea.appendChild(button);
}

function line(speaker, text) {
    return { speaker: speaker, text: text };
}

function choice(text, callback) {
    return { text: text, callback: callback };
}

function showChoices(choices) {
    stopBabble();
    clearChoices();

    choices.forEach(function(item) {
        addChoice(item.text, item.callback);
    });
}

function typeText(text) {
    clearTimeout(typingTimer);

    typing = true;
    storyText.textContent = "";
    cursor.style.display = "inline";

    let index = 0;

    function typeNext() {
        if (index < text.length) {
            storyText.textContent += text.charAt(index);
            index++;

            middle.style.height = "auto";

            typingTimer = setTimeout(typeNext, typeSpeed);
        } else {
            typing = false;
            stopBabble();
            cursor.style.display = "none";
            showContinue();
        }
    }

    typeNext();
}

function showLine(item) {
    clearChoices();

    storyText.textContent = "";

    let text = item.speaker + "\n\n" + item.text;

    startBabble(item.speaker);
    typeText(text);
}

function showContinue() {
    clearChoices();
    addChoice("Continue", nextLine);
}

function playLines(lines, callback) {
    clearTimeout(typingTimer);
    stopBabble();

    currentLines = lines;
    currentLine = 0;
    currentCallback = callback;

    showLine(currentLines[currentLine]);
}

function nextLine() {
    if (typing) {
        return;
    }

    currentLine++;

    if (currentLine < currentLines.length) {
        showLine(currentLines[currentLine]);
    } else {
        clearChoices();

        if (currentCallback) {
            let callback = currentCallback;
            currentCallback = null;
            callback();
        }
    }
}

function startGame() {
    startBackgroundMusic();

    setScene("images/exterior.png", "OUTSIDE THE APARTMENT");

    playLines([
        line("NARRATOR", "02:41 AM.\n\nThe streets are almost completely empty."),
        line("NARRATOR", "Mara stands outside an old apartment building. She has not been here in twelve years."),
        line("MARA", "I thought it would look different."),
        line("NARRATOR", "She looks up at the windows. One of them is slightly open."),
        line("MARA", "Why did I come back?")
    ], function() {
        showChoices([
            choice("I should've come here sooner.", enterApartment),
            choice("I don't owe this place anything.", enterApartment),
            choice("I just want to get this over with.", enterApartment)
        ]);
    });
}

function enterApartment() {
    setScene("images/entrance.png", "THE ENTRANCE");

    playLines([
        line("NARRATOR", "02:43 AM.\n\nThe apartment door opens with a quiet creak."),
        line("NARRATOR", "The smell is familiar. Dust, old furniture and something Mara cannot quite identify."),
        line("NARRATOR", "A small pair of children's shoes rests beside the entrance."),
        line("MARA", "They're still here...")
    ], function() {
        showChoices([
            choice("Pick up the smaller shoes.", function() {
                playLines([
                    line("NARRATOR", "Mara carefully picks up the shoes."),
                    line("MARA", "Elise used to wear these."),
                    line("MARA", "She hated putting them on.")
                ], enterLivingRoom);
            }),

            choice("Ignore the shoes.", function() {
                playLines([
                    line("NARRATOR", "Mara looks away and walks further inside."),
                    line("MARA", "They're just old shoes.")
                ], enterLivingRoom);
            }),

            choice("Look for the light switch.", function() {
                playLines([
                    line("NARRATOR", "Mara reaches for the light switch."),
                    line("NARRATOR", "The light flickers several times before turning on."),
                    line("MARA", "Of course...")
                ], enterLivingRoom);
            })
        ]);
    });
}

function enterLivingRoom() {
    setScene("images/living-room.png", "THE LIVING ROOM");

    playLines([
        line("NARRATOR", "02:48 AM.\n\nThe living room looks almost exactly as Mara remembers it."),
        line("NARRATOR", "A family photograph sits on a dusty table. Two young girls smile at the camera."),
        line("MARA", "Me and Elise..."),
        line("NARRATOR", "Beside the photograph is a small box filled with old letters and toys."),
        line("MARA", "I thought everything was thrown away."),
        line("NARRATOR", "A sudden noise comes from somewhere deeper inside the apartment.")
    ], function() {
        showChoices([
            choice("Check the kitchen.", function() {
                setScene("images/kitchen.png", "THE KITCHEN");

                playLines([
                    line("NARRATOR", "Mara slowly enters the kitchen."),
                    line("NARRATOR", "The cupboard doors are open."),
                    line("NARRATOR", "One of them suddenly slams shut."),
                    line("MARA", "What the hell?")
                ], telephoneScene);
            }),

            choice("Call out again.", function() {
                playLines([
                    line("MARA", "Hello? Is somebody there?"),
                    line("NARRATOR", "No answer."),
                    line("NARRATOR", "Only the sound of the apartment settling around her.")
                ], telephoneScene);
            }),

            choice("Stay in the living room.", telephoneScene)
        ]);
    });
}

function telephoneScene() {
    setScene("images/telephone.png", "THE TELEPHONE");

    playLines([
        line("NARRATOR", "03:17 AM.\n\nThe telephone begins to ring."),
        line("NARRATOR", "Mara stares at it. The caller ID is empty."),
        line("MARA", "Nobody even uses these anymore."),
        line("NARRATOR", "The telephone continues ringing.")
    ], function() {
        showChoices([
            choice("Pick up the phone.", function() {
                playLines([
                    line("MARA", "Hello?"),
                    line("UNKNOWN VOICE", "Did you bring her home?"),
                    line("MARA", "Who is this?"),
                    line("UNKNOWN VOICE", "You know who."),
                    line("NARRATOR", "The call suddenly ends.")
                ], afterTelephone);
            }),

            choice("Let it ring.", function() {
                playLines([
                    line("NARRATOR", "Mara refuses to answer."),
                    line("NARRATOR", "Eventually, the ringing stops."),
                    line("MARA", "I don't want to hear it.")
                ], afterTelephone);
            }),

            choice("Unplug the telephone.", function() {
                playLines([
                    line("NARRATOR", "Mara pulls the telephone cable from the wall."),
                    line("NARRATOR", "The ringing stops."),
                    line("NARRATOR", "For a moment, the apartment becomes completely silent.")
                ], afterTelephone);
            })
        ]);
    });
}

function afterTelephone() {
    playLines([
        line("NARRATOR", "Mara stands still, trying to understand what just happened."),
        line("MARA", "Did you bring her home?"),
        line("NARRATOR", "She looks toward the hallway."),
        line("NARRATOR", "A small figure stands at the other end.")
    ], hallwayScene);
}

function hallwayScene() {
    setScene("images/hallway.png", "THE HALLWAY");

    playLines([
        line("NARRATOR", "03:21 AM.\n\nA little girl stands in the hallway."),
        line("NARRATOR", "She wears an oversized yellow shirt. Her feet are bare."),
        line("MARA", "No..."),
        line("ELISE", "Hi, Mara."),
        line("MARA", "Elise?"),
        line("ELISE", "You came back.")
    ], function() {
        showChoices([
            choice("Take a step toward her.", finalScene),
            choice("Tell her to go away.", finalScene),
            choice("Stay where you are.", finalScene)
        ]);
    });
}

function finalScene() {
    setScene("images/dark-hallway.png", "THE HALLWAY");

    playLines([
        line("NARRATOR", "Mara turns around and tries to leave."),
        line("NARRATOR", "But beyond the entrance is the same hallway."),
        line("NARRATOR", "She turns again. Elise is still standing there."),
        line("ELISE", "Are you leaving again?"),
        line("MARA", "I..."),
        line("NARRATOR", "The apartment door is no longer there.")
    ], function() {
        playLines([
            line("NARRATOR", "CHAPTER 1 COMPLETE"),
            line("NARRATOR", "03:21 AM.\n\nThere is no way out.")
        ], chapterTwo);
    });
}

function chapterTwo() {
    setScene("images/hallway.png", "THE HALLWAY");

    playLines([
        line("NARRATOR", "CHAPTER 2 — THE FORGOTTEN"),
        line("ELISE", "Can we play?"),
        line("MARA", "Play what?")
    ], function() {
        showChoices([
            choice("Ask what she wants to play.", function() {
                playLines([
                    line("ELISE", "The blanket fort!"),
                    line("NARRATOR", "For a moment, Mara remembers building forts with Elise when they were children."),
                    line("ELISE", "You always let me choose where the entrance was.")
                ], chapterTwoEnd);
            }),

            choice("Tell her you're busy.", function() {
                playLines([
                    line("MARA", "I'm not here to play."),
                    line("ELISE", "You always have to leave."),
                    line("NARRATOR", "Elise looks down at her feet.")
                ], chapterTwoEnd);
            }),

            choice("Ask why she's here.", function() {
                playLines([
                    line("MARA", "Why are you here?"),
                    line("ELISE", "I live here."),
                    line("MARA", "No, you don't."),
                    line("ELISE", "I forgot.")
                ], chapterTwoEnd);
            })
        ]);
    });
}

function chapterTwoEnd() {
    playLines([
        line("NARRATOR", "Elise looks toward the bedroom."),
        line("ELISE", "Why did you close the door?"),
        line("MARA", "..."),
        line("MARA", "What door?"),
        line("ELISE", "You know."),
        line("NARRATOR", "The bedroom door slowly opens."),
        line("NARRATOR", "Something inside the room begins to whisper."),
        line("ELISE", "You said you would come back."),
        line("NARRATOR", "Mara takes a step toward the bedroom."),
        line("NARRATOR", "The memories she buried are waiting inside."),
        line("NARRATOR", "CHAPTER 2 COMPLETE")
    ], chapterThree);
}

function chapterThree() {
    setScene("images/dark-hallway.png", "THE BEDROOM");

    playLines([
        line("NARRATOR", "CHAPTER 3 — THE TRUTH"),
        line("NARRATOR", "Mara enters the bedroom."),
        line("NARRATOR", "The room is exactly as she remembers it. The old wallpaper. The small bed. The toys scattered across the floor."),
        line("MARA", "This isn't real."),
        line("ELISE", "You said that last time."),
        line("MARA", "Please stop."),
        line("ELISE", "Do you remember that night?"),
        line("NARRATOR", "Mara looks at the bedroom door."),
        line("NARRATOR", "A memory begins to return.")
    ], function() {
        showChoices([
            choice("I remember.", revealTruth),
            choice("I don't want to remember.", revealTruth),
            choice("Please leave me alone.", revealTruth)
        ]);
    });
}

function revealTruth() {
    playLines([
        line("NARRATOR", "The room becomes quiet."),
        line("ELISE", "We were playing hide and seek."),
        line("MARA", "Stop..."),
        line("ELISE", "You told me to hide in the wardrobe."),
        line("NARRATOR", "Mara remembers the sound of the door closing."),
        line("ELISE", "You said you would come back."),
        line("MARA", "I was just a child."),
        line("ELISE", "So was I."),
        line("NARRATOR", "Mara remembers the shouting. The footsteps. The moment she heard Elise calling for help."),
        line("NARRATOR", "She had been afraid of getting into trouble. So she ran."),
        line("MARA", "I didn't know what to do..."),
        line("ELISE", "You left me.")
    ], endingScene);
}

function endingScene() {
    setScene("images/dark-hallway.png", "THE BEDROOM");

    playLines([
        line("NARRATOR", "Mara falls to her knees."),
        line("MARA", "I'm sorry."),
        line("MARA", "I should have opened the door."),
        line("ELISE", "I waited for you."),
        line("NARRATOR", "Elise walks closer. She no longer looks angry."),
        line("ELISE", "I was scared."),
        line("MARA", "I know."),
        line("MARA", "I was scared too."),
        line("NARRATOR", "For the first time, Mara looks directly at Elise."),
        line("MARA", "I never stopped thinking about you."),
        line("ELISE", "Then why did it take you so long?"),
        line("MARA", "I don't know."),
        line("NARRATOR", "Elise reaches for Mara's hand."),
        line("ELISE", "Can we go home now?"),
        line("MARA", "Yes."),
        line("NARRATOR", "The bedroom slowly fades into darkness."),
        line("NARRATOR", "When Mara opens her eyes, she is alone."),
        line("NARRATOR", "The apartment is silent. The morning light falls across the empty bedroom."),
        line("NARRATOR", "Twelve years have passed. Elise is never coming back."),
        line("NARRATOR", "Mara finally leaves the apartment."),
        line("NARRATOR", "But forgiveness does not change what happened."),
        line("NARRATOR", "Some doors cannot be reopened.")
    ], showEnding);
}

function showEnding() {
    setScene("images/exterior.png", "THE END");

    playLines([
        line("NARRATOR", "THE END"),
        line("NARRATOR", "THE COMPLEX"),
        line("NARRATOR", "A story about the things we leave behind.")
    ], function() {
        clearChoices();
        addChoice("Restart", startGame);
    });
}

sceneImage.addEventListener("load", function() {
    sceneImage.style.objectFit = "contain";
});

startGame();
