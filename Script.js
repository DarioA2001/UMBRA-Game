const storyText = document.getElementById("story-text");
const cursor = document.getElementById("cursor");
const choices = document.getElementById("choices");
const sceneImage = document.getElementById("scene-image");
const sceneName = document.getElementById("scene-name");
const middleArea = document.getElementById("middle");

let currentScene = "bedroom";
let hasKey = false;
let typing = false;
let timer;
let text = "";
let index = 0;

const scenes = {
    bedroom: {
        name: "THE BEDROOM",
        image: "assets/bedroom.jpg",
        text: `You wake up on a cold floor.

Your mouth tastes of dirt. Your clothes are damp, and your head aches as though something has been trying to get inside it.

The room is familiar, but you cannot remember living here.

There is a photograph on the desk. A wardrobe stands in the corner. Beneath the bed, something is breathing.

You hear a faint scratching from the other side of the door.

Then another sound.

A wet, slow blink.

You look toward the window.

A tall figure stands outside.

Its head is an enormous human eye.

It is looking directly at you.`,
        choices: [
            { text: "Look around the room", next: "room" },
            { text: "Approach the door", next: "door" },
            { text: "Look beneath the bed", next: "underbed" },
            { text: "Stay completely still", next: "still" }
        ]
    },

    room: {
        name: "THE ROOM",
        image: "assets/bedroom.jpg",
        text: `The room feels smaller than it did before.

The walls are covered in faint scratches. Some are deep enough to expose something dark beneath the paint.

You notice that the scratches form words.

DO NOT LET IT SEE YOU.

A second line has been carved underneath.

IT ALREADY HAS.

From the corner of your eye, you notice a tall silhouette standing behind you.

When you turn around, there is nothing there.

The photograph on the desk has changed.`,
        choices: [
            { text: "Examine the mirror", next: "mirror" },
            { text: "Look at the photograph", next: "photo" },
            { text: "Open the wardrobe", next: "wardrobe" },
            { text: "Return to the door", next: "door" }
        ]
    },

    underbed: {
        name: "BENEATH THE BED",
        image: "assets/bedroom.jpg",
        text: `You lower yourself to the floor.

The space beneath the bed is impossibly dark. It seems much deeper than the room should allow.

Something is curled up at the far end.

You hear it whispering.

"Please... don't leave me here."

A thin, rusted key lies beside it.

Something begins crawling toward you.

Its joints bend in the wrong direction.`,
        choices: [
            { text: "Grab the key and crawl away", next: "room", givesKey: true },
            { text: "Reach further into the darkness", next: "death" },
            { text: "Look at what is crawling", next: "death" },
            { text: "Remain beneath the bed", next: "death" }
        ]
    },

    photo: {
        name: "THE PHOTOGRAPH",
        image: "assets/photograph.jpg",
        text: `The photograph shows a group of people standing in front of a building.

You recognize the building.

You recognize the people.

But you do not recognize their faces.

Every face has been scratched away.

Except one.

A tall figure stands behind the group. Its head is a giant eye.

On the back of the photograph, someone has written:

"HE DOES NOT FOLLOW YOU. HE WAITS FOR YOU TO REMEMBER."

The photograph feels warm in your hands.

Something behind you whispers your name.`,
        choices: [
            { text: "Put the photograph away", next: "room" },
            { text: "Turn the photograph over again", next: "mirror" },
            { text: "Tear the photograph apart", next: "death" },
            { text: "Ask who the figure is", next: "voice" }
        ]
    },

    mirror: {
        name: "THE MIRROR",
        image: "assets/mirror.jpg",
        text: `Your reflection stands perfectly still.

You raise your hand.

It does not.

Its face looks exhausted. Its eyes are swollen, and its mouth hangs slightly open.

Behind your reflection stands a tall man.

His body is thin and pale.

His head is a single enormous eyeball.

The iris slowly turns toward you.

Your reflection begins to smile.

You are not smiling.

The reflection raises one finger and points behind you.`,
        choices: [
            { text: "Touch the mirror", next: "death" },
            { text: "Step away slowly", next: "room" },
            { text: "Look behind you", next: "death" },
            { text: "Close your eyes", next: "still" }
        ]
    },

    wardrobe: {
        name: "THE WARDROBE",
        image: "assets/wardrobe.jpg",
        text: `The wardrobe door opens with a long creak.

Inside, there are no clothes.

Only a narrow passage descending into darkness.

You hear several people breathing inside.

One of them begins laughing.

A pale hand slowly emerges from the darkness. Its fingers are too long, and its nails scrape against the wooden frame.

Far inside the passage, a familiar voice speaks.

"Come back. We have been waiting for you."

Something enormous shifts behind the hand.`,
        choices: [
            { text: "Close the wardrobe", next: "room" },
            { text: "Enter the passage", next: "death" },
            { text: "Grab the hand", next: "death" },
            { text: "Listen to the voices", next: "voice" }
        ]
    },

    door: {
        name: "THE DOOR",
        image: "assets/door.jpg",
        text: `The door is covered in deep scratches.

There is something written across the wood.

YOU HAVE BEEN HERE BEFORE.

A slow knock comes from the other side.

Once.

Twice.

Then three times.

A voice speaks.

"Open the door."

You recognize the voice.

It sounds exactly like yours.

Behind you, something makes a wet clicking noise.`,
        choices: [
            { text: "Open the door", next: "hallway" },
            { text: "Ask who is there", next: "voice" },
            { text: "Use the rusty key", next: "hallway", needsKey: true },
            { text: "Walk away", next: "room" }
        ]
    },

    voice: {
        name: "THE VOICE",
        image: "assets/door.jpg",
        text: `"You are taking too long."

The voice comes from everywhere.

"You always take too long."

A faint shadow moves beneath the door.

Then a second shadow.

Then a third.

Something presses its enormous eye against the gap beneath the door.

You hear a slow blink.

"Do you remember what happened?"

The door handle begins turning.`,
        choices: [
            { text: "Open the door", next: "hallway" },
            { text: "Refuse to answer", next: "still" },
            { text: "Look beneath the door", next: "death" },
            { text: "Run away", next: "room" }
        ]
    },

    still: {
        name: "SILENCE",
        image: "assets/bedroom.jpg",
        text: `You stop moving.

The room becomes completely silent.

Even your breathing seems to disappear.

Something stands in the corner.

You cannot see its body.

Only its head.

A gigantic eye, staring without blinking.

It is closer than before.

A voice whispers directly into your ear.

"Good. Now we can see each other."

You feel something cold touch the back of your neck.`,
        choices: [
            { text: "Turn around", next: "mirror" },
            { text: "Run toward the door", next: "door" },
            { text: "Keep your eyes closed", next: "death" },
            { text: "Ask what it wants", next: "voice" }
        ]
    },

    hallway: {
        name: "THE HALLWAY",
        image: "assets/hallway.jpg",
        text: `The hallway stretches much further than the building should allow.

The walls are covered in photographs. Every photograph shows the same person.

You.

At the far end stands a tall man.

His body is motionless.

His head is a massive eyeball, its iris slowly following your movements.

You blink.

He is closer.

You blink again.

He is closer still.

A small door stands to your left. A staircase leads upward to your right.

Behind you, the bedroom door has disappeared.`,
        choices: [
            { text: "Walk toward the tall figure", next: "death" },
            { text: "Open the small door", next: "basement" },
            { text: "Climb the staircase", next: "stairs" },
            { text: "Return to the bedroom", next: "bedroom" }
        ]
    },

    basement: {
        name: "THE BASEMENT",
        image: "assets/basement.jpg",
        text: `The stairs lead into a basement filled with shallow black water.

Something floats beneath the surface.

The walls are covered in hundreds of eyes. Some are closed. Others follow you.

At the centre of the room sits a creature with its back turned.

Its body is almost human, but its head is missing.

A voice comes from inside its chest.

"You brought him here."

The water begins moving.

A reflection appears beside yours.

The Watcher is standing behind you.

Its enormous eye is wide open.`,
        choices: [
            { text: "Approach the creature", next: "figure" },
            { text: "Look into the water", next: "death" },
            { text: "Touch one of the eyes", next: "death" },
            { text: "Return upstairs", next: "hallway" }
        ]
    },

    figure: {
        name: "THE FIGURE",
        image: "assets/figure.jpg",
        text: `The creature slowly turns around.

There is a human face embedded in its chest.

Its lips begin moving.

"You have been running for so long."

It looks past you.

"You think that thing wants to kill you?"

A long silence follows.

"It wants you to remember."

The creature extends a hand.

Behind it, the Watcher stands completely still.

Its iris contracts.

The creature whispers:

"Come with me. I can make it stop looking."`,
        choices: [
            { text: "Accept its hand", next: "badEnding" },
            { text: "Refuse its offer", next: "stairs" },
            { text: "Ask what you must remember", next: "badEnding" },
            { text: "Attack the creature", next: "death" }
        ]
    },

    stairs: {
        name: "THE STAIRS",
        image: "assets/staircase.jpg",
        text: `The staircase seems to go on forever.

Each step feels softer than the last.

You hear footsteps below you.

Slow.

Heavy.

Patient.

You look down.

The Watcher is standing at the bottom.

Its enormous eye follows you as it begins climbing.

You look up.

A door waits at the top.

Something scratches at the other side.

A voice whispers:

"Do not let him come through."`,
        choices: [
            { text: "Open the door", next: "goodEnding" },
            { text: "Look down at the Watcher", next: "death" },
            { text: "Hide beneath the stairs", next: "death" },
            { text: "Go back downstairs", next: "hallway" }
        ]
    },

    goodEnding: {
        name: "OUTSIDE",
        image: "assets/outside.jpg",
        text: `You step through the door.

Cold air fills your lungs.

The sky is a pale, lifeless grey. There are no buildings, no trees, no signs of life.

Only an endless field of white grass.

You take a few steps forward.

Behind you, the door slowly closes.

For the first time, you cannot hear the Watcher.

You begin walking.

Then you notice something strange.

Your shadow is not moving with you.

It is standing perfectly still.

Its head is an enormous eye.

It watches you leave.

You escaped the room.

But you never left him behind.`,
        choices: [
            { text: "Play again", next: "bedroom", restart: true }
        ]
    },

    badEnding: {
        name: "THE EMPTY MEMORY",
        image: "assets/figure.jpg",
        text: `You take the creature's hand.

The room disappears.

You are standing in a field.

There are people around you, but none of them have faces.

A familiar voice speaks.

"You can rest now."

You look down.

Your hands are covered in dirt.

Something begins to move beneath your skin.

You try to remember your name.

Nothing.

You try to remember your home.

Nothing.

Then you hear a slow, wet blink.

The Watcher is standing in front of you.

It lowers its enormous eye until it is level with your face.

For the first time, it speaks.

"Now you understand."

You have forgotten everything.

And it has finally found what it was looking for.`,
        choices: [
            { text: "Play again", next: "bedroom", restart: true }
        ]
    },

    death: {
        name: "DARKNESS",
        image: "assets/death.jpg",
        text: `You made the wrong choice.

Something moves before you can react.

A shape emerges from the darkness.

You hear a terrible noise.

Then nothing.

For a brief moment, you see an enormous eye staring down at you.

The Watcher is watching.

It always was.

You were never supposed to leave.`,
        choices: [
            { text: "Try again", next: "bedroom", restart: true }
        ]
    }
};

function typeText(message) {
    clearInterval(timer);

    text = message;
    index = 0;
    typing = true;

    storyText.textContent = "";
    cursor.style.display = "inline";

    choices.style.display = "none";

    timer = setInterval(function() {
        storyText.textContent += text[index];
        index++;

        if (index >= text.length) {
            clearInterval(timer);
            typing = false;
            cursor.style.display = "none";
            showChoices();
        }
    }, 25);
}

function writeText() {
    clearInterval(timer);
    storyText.textContent = text;
    typing = false;
    cursor.style.display = "none";
    showChoices();
}

function showChoices() {
    choices.innerHTML = "";

    const scene = scenes[currentScene];

    scene.choices.forEach(function(choice) {
        if (choice.needsKey && !hasKey) {
            return;
        }

        const button = document.createElement("button");
        button.className = "bottom-box";
        button.textContent = choice.text;

        button.addEventListener("click", function() {
            if (choice.givesKey) {
                hasKey = true;
            }

            if (choice.restart) {
                hasKey = false;
            }

            loadScene(choice.next);
        });

        choices.appendChild(button);
    });

    choices.style.display = "grid";
}

function loadScene(sceneName) {
    currentScene = sceneName;

    const scene = scenes[currentScene];

    sceneImage.src = scene.image;
    sceneNameElement.textContent = scene.name;

    typeText(scene.text);
}

const sceneNameElement = document.getElementById("scene-name");

middleArea.addEventListener("click", function() {
    if (typing) {
        writeText();
    }
});

loadScene("bedroom");
