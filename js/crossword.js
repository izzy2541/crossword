//Across array: answer, clue, x coordinate of cell of first letter of answer, y coordinate of the same.
// empty arrays represent a clue number that isnt used for this direction
//i.e. there is no clue/answer for 1,2,3 across.

const down = [
  [
    "variability",
    "Learner _________________ is the recognition that students learn in different ways, and these differences are normal and expected.",
    3,
    1,
    "Hint for one down",
  ],
  [
    "expression",
    "Multiple means of action and _________________ is offering learners different ways to demonstrate what they know.",
    6,
    1,
    "Hint for two down",
  ],
  [
    "engagement",
    "Multiple means of _________________ is using diverse methods to motivate and engage learners based on interests, effort, and self-regulation.",
    8,
    1,
    "Hint for three down",
  ],
  [
    "flexible",
    "_________________ learning environments are spaces and approaches that adapt to learners’ needs, preferences, and choices.",
    11,
    1,
    "Hint for four down",
  ],
  [],
  [
    "wcag",
    "Initials for the globally recognised guidelines for website content accessibility. _________________",
    1,
    8,
    "Hint for six down",
  ],
];

const across = [
  [],
  [],
  [],
  [],
  [
    "universal",
    "_________________ design for learning is a framework that guides the design of inclusive learning environments to accommodate all learners' diverse needs.",
    1,
    4,
    "Hint for five across",
  ],
  [],
  [
    "diverse",
    "The wide range of differences among learners in terms of abilities, backgrounds, learning styles, languages, cultures, interests, and needs. _________________",
    5,
    8,
    "Hint for seven across",
  ],
  [
    "alternative",
    "A different format or method of presenting information that serves the same purpose as the original, such as providing a text description for an image or captions for audio. _________________",
    1,
    10,
    "Hint for eight across",
  ],
];

//Object utilised by createCellsAndClues and checkAnswer function
let answerArray = [
  { name: "across", data: across },
  { name: "down", data: down },
];

let isPopupOpen = false;

// Create the parent div for the crossword
const crosswordDiv = document.getElementById("crossword");
// Create the parent div for clues
const cluesDiv = document.getElementById("clues");

const hintsDiv = document.getElementById("hints");

// Create the Across and Down parent divs - written as unordered lists.
const acrossUl = document.createElement("div");
const downUl = document.createElement("div");

acrossUl.className = "across_clues";
downUl.className = "down_clues";

// Add headings for both sections
const acrossHeading = document.createElement("div");
acrossHeading.className = "heading";
acrossHeading.textContent = "Across";

const downHeading = document.createElement("div");
downHeading.className = "heading";
downHeading.textContent = "Down";

// Append headings to their respective lists
downUl.appendChild(downHeading);
acrossUl.appendChild(acrossHeading);

// Number of cells in width and height
let crossWordWidth = 11;
let rowsArray = []; // Store rows for later reference

// Create grid with blank element (black div)
for (let i = 0; i < crossWordWidth; i++) {
  const row = document.createElement("div"); // Create a new row
  row.className = "row";
  let cellsArray = [];

  for (let j = 0; j < crossWordWidth; j++) {
    // Create a new blank element for up the number of times specified by crossWordWidth variable
    const cell = document.createElement("div");
    cell.className = "blank";
    row.appendChild(cell); // Append cell to the row
    cellsArray.push(cell); // Store reference to the cell
  }

  rowsArray.push(cellsArray); // Store reference to the row's cells
  crosswordDiv.appendChild(row); // Append row to the crossword
}


function createCellsAndClues() {
  for (let k = 0; k < answerArray.length; k++) {
    let currentArray = answerArray[k].data; // Get the actual array
    let currentName = answerArray[k].name; // Get "across" or "down"
    let dataClueNumber;

    for (let i = 0; i < currentArray.length; i++) {
      let entry = currentArray[i];
      if (entry.length > 0) {
        let word = entry[0];
        let startX = entry[2] - 1;
        let startY = entry[3] - 1;

        for (let j = 0; j < word.length; j++) {
          let targetCell =
            currentName === "across"
              ? rowsArray[startY][startX + j]
              : rowsArray[startY + j][startX];

          if (!targetCell) break;

          let input;
          if (targetCell.tagName === "INPUT") {
            input = targetCell;
          } else {
            input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            targetCell.replaceWith(input);
          }

          if (j === 0) {
            dataClueNumber = i + 1;
            input.setAttribute("data-clue", dataClueNumber);
          }

          if (currentName === "across") {
            rowsArray[startY][startX + j] = input;
          } else {
            rowsArray[startY + j][startX] = input;
          }
          input.classList.add(`${currentName}_${dataClueNumber}_${j + 1}`);
        }

        // === Create wrapper div ===
        const wrapperDiv = document.createElement("div");
        wrapperDiv.className = "list_and_clue";

        // === Create clue list item ===
        const clueAndIcon = document.createElement("div");
        // const clueSpan = document.createElement("span");
        clueAndIcon.classList.add("clue_text")
        clueAndIcon.setAttribute("data-clue", `${i + 1}`);
        clueAndIcon.setAttribute("data-dir", currentName);
        clueAndIcon.setAttribute("tabindex", 0);
        clueAndIcon.setAttribute("data-length", word.length);
        clueAndIcon.classList.add(`${currentName}_${i + 1}`);
        clueAndIcon.classList.add("clue");
        const clueP = document.createElement("p");


        const clueText = `${i + 1}. ${entry[1]} (${word.length})`;
        clueAndIcon.setAttribute("data-original-clue", entry[1]);
        // clueDiv.innerHTML = `${clueText} <span class="correctness_icon"></span>`;
        clueP.textContent = clueText;


        const correctnessIcon = document.createElement("span");
        correctnessIcon.classList.add("correctness_icon");

        // === Create hint placeholder + button ===
        const hintPlaceholder = document.createElement("div");
        hintPlaceholder.className = "hint_button_placeholder";

        const hintBtn = document.createElement("button");
        // hintBtn.className = "hint-button disabled";
        hintBtn.className = "hint-button disabled";
        //  hintBtn.setAttribute("tabindex", "0");
        hintBtn.setAttribute("tabindex", "-1");
        hintBtn.setAttribute("aria-hidden", "true");
        // hintBtn.disabled = true;
        // hintBtn.style.display = "none";

        hintBtn.setAttribute("data-clue", `${i + 1}`);
        hintBtn.setAttribute("data-dir", currentName);
        hintBtn.classList.add(`${currentName}_${i + 1}`);
        hintBtn.textContent = "HINT";


        hintPlaceholder.appendChild(hintBtn);

        clueAndIcon.appendChild(clueP);
        clueAndIcon.appendChild(correctnessIcon);
        clueAndIcon.appendChild(hintBtn);


        // Append li and button to wrapper
        wrapperDiv.appendChild(clueAndIcon);

        // Append wrapper to correct list
        currentName === "across"
          ? acrossUl.appendChild(wrapperDiv)
          : downUl.appendChild(wrapperDiv);
      }
    }
  }
  cluesDiv.appendChild(downUl);
  cluesDiv.appendChild(acrossUl);

  // initNavigables();
}
createCellsAndClues();

const closeButton = document.querySelector(".close_popup");
const cluesDivs = document.querySelectorAll("#clues li");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("hint-button")) {
    openHintWindow(e)
  }
});

document.addEventListener("keydown", function (e) {
  // Only trigger on Enter key when focused on a hint button
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("hint-button")) {
    e.preventDefault(); // prevent default scrolling for Space
    openHintWindow(e);
  }
});

document.addEventListener('keydown', function (e) {
  closePopup(e)
});

document.addEventListener('click', function (e) {
  // Handle close button
  if (e.target.closest(".close_popup")) {
    const popup = document.querySelector(".popup");
    popup.classList.add("hide");
    isPopupOpen = false;
  }
});


function openHintWindow(e) {
  isPopupOpen = true;
  // e.preventDefault();

  //get clue number and direction
  const clueNum = parseInt(e.target.getAttribute("data-clue")) - 1;
  const clueDir = e.target.getAttribute("data-dir");

  const array = clueDir === "across" ? across : down;
  //get the hint from correct array for the question
  const hintEntry = array[clueNum];

  //ensures we dont get any of the emtpy arrays 
  if (hintEntry && hintEntry.length > 0) {
    //set hint to correct array/index
    const hintText = hintEntry[4];

    // Show popup and insert text
    const popup = document.querySelector(".popup");
    const hintTextElement = document.getElementById("popup_hint_text");

    hintTextElement.textContent = hintText;
    popup.classList.remove("hide");

    document.querySelector('.close_popup').setAttribute("tabindex", 0)
    document.querySelector('#popup_hint_text').setAttribute("tabindex", 0)

  }
}

function closePopup(e) {
  if (!isPopupOpen) return;

  const focusable = [document.querySelector('.close_popup'), document.querySelector('#popup_hint_text')];
  const index = focusable.indexOf(document.activeElement);

  if (e.key === 'Tab') {
    e.preventDefault();
    let nextIndex = e.shiftKey ? index - 1 : index + 1;
    if (nextIndex < 0) nextIndex = focusable.length - 1;
    if (nextIndex >= focusable.length) nextIndex = 0;
    focusable[nextIndex].focus();
  }
}

document.addEventListener("keydown", function (e) {
  // Check if key is Enter or Space
  if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("close_popup")) {
    const popup = document.querySelector(".popup");
    popup.classList.add("hide");
    isPopupOpen = false;
  }
});

// Create the Check Answer button
const checkAnswerButton = document.createElement("button");
checkAnswerButton.id = "checkAnswer";
checkAnswerButton.textContent = "Check Answers";
checkAnswerButton.onclick = function () {
  checkAnswer();
};

checkAnswerButton.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    checkAnswer();
    e.preventDefault();
  }
});

checkAnswerButton.setAttribute("tabindex", 0);

// Append the button to the parent div
cluesDiv.appendChild(checkAnswerButton);

// Create the #dialog_feedback div
const dialogFeedback = document.createElement("div");
dialogFeedback.id = "dialog_feedback";

// Create a <p> element to hold the feedback message
let dialogMessage = document.createElement("p");
dialogMessage.textContent =
  "Well done! You have answered every question correctly.";

// Append the message to the dialog div
dialogFeedback.appendChild(dialogMessage);

// Optionally append dialogFeedback to the body or any other parent container
crosswordDiv.appendChild(dialogFeedback);

//Function to wrap span around cells that need data clues numbers, as pseudo before: element not possible on <input>
document.querySelectorAll("input[data-clue]").forEach((input) => {
  let clueNumber = document.createElement("span");
  clueNumber.textContent = input.getAttribute("data-clue");
  clueNumber.className = "clue-number";

  // Wrap input in a relatively positioned container
  let wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";

  // Move input inside the wrapper
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(clueNumber);
  wrapper.appendChild(input);
});


//get the number of across clues/answers by getting the length of across array minus empty subarrays.
let truthyAcross = across.filter((arr) => arr.length > 0).length;
//get the number down clues/answers by getting the length of down array minus empty subarrays.
let truthyDown = down.filter((arr) => arr.length > 0).length;
//initialise correctAnswers as an empty array
let correctAnswers = [];
//This is what the length of the correctAnswers array should be once the user has answered every answer correctly.
let correctAnswersExpectedLength = truthyAcross + truthyDown;
let userInput;

//checkAnswer function fired when check answer button is selected.
function checkAnswer() {
  for (let k = 0; k < answerArray.length; k++) {
    let currentArray = answerArray[k].data; // Get the actual array
    let currentName = answerArray[k].name; // Get the string "across" or "down"

    for (let i = 0; i < currentArray.length; i++) {
      let correctWord = currentArray[i][0]; // Extract the correct word (answer)
      let currentClue = currentArray[i][1];

      if (correctWord) {
        let isCorrect = true;
        let isIncomplete = false;

        // Iterate over each letter of the correct word without breaking early
        for (let j = 0; j < correctWord.length; j++) {
          let currentCell = document.querySelector(`.${currentName}_${i + 1}_${j + 1}`);

          // If no cell found or empty value, mark incomplete
          if (!currentCell || currentCell.value.trim() === "") {
            isIncomplete = true;
          } else {
            // Check if letter matches (case-insensitive)
            if (currentCell.value.trim().toLowerCase() !== correctWord[j]) {
              isCorrect = false;
            }
          }
        }

        // Get corresponding clue element
        let clueLi = document.querySelector(`div[data-clue="${i + 1}"][data-dir="${currentName}"] p`);
        const clueKey = `${currentName} ${i + 1}`;
        const indexInCorrect = correctAnswers.indexOf(clueKey);
       let thisIcon = clueLi.closest('.clue').querySelector('.correctness_icon');
            let thisHintBtn = clueLi.closest('.list_and_clue').querySelector('.hint-button');

        if (isIncomplete) {
          // Incomplete: reset clue text without icon or hint
          if (clueLi) {
            // clueLi.innerHTML = `${i + 1}. ${currentClue} (${correctWord.length}) <span class="correctness_icon"></span>`;
            //  clueLi.textContent =  `${i+ 1}. ${currentName[i]}`
            // let thisIcon = clueLi.closest('.clue').querySelector('.correctness_icon');
            // let thisHintBtn = clueLi.closest('.list_and_clue').querySelector('.hint-button');
            // if(thisHintBtn.classList.contains("disabled")){
            //              thisHintBtn.classList.remove("disabled");
 
            // }

            clueLi.textContent = `${i + 1}. ${currentClue} (${correctWord.length})`;
            // let thisIcon = clueLi.closest('.list_and_clue').querySelector('.correctness_icon');
            if (thisIcon.classList.contains('correct_tick') || thisIcon.classList.contains('incorrect_cross')) {
              thisIcon.classList.remove('correct_tick', 'incorrect_cross');
            }
          }
          // Remove from correct answers if previously added
          if (indexInCorrect !== -1) {
            correctAnswers.splice(indexInCorrect, 1);
          }

        } else if (isCorrect) {
          // Correct answer: show answer and tick
          if (clueLi) {
            clueLi.textContent = `${i + 1}. ${currentClue.replace("_________________", correctWord.toUpperCase())} (${correctWord.length})`;
            //  let thisIcon = clueLi.parentElement.nextElementSibling;
            // let thisIcon = clueLi.closest('.clue').querySelector('.correctness_icon');
            if (thisIcon.classList.contains('incorrect_cross')) {
              thisIcon.classList.remove('incorrect_cross');
            }
            thisIcon.classList.add('correct_tick');
                // let thisHintBtn = clueLi.closest('.list_and_clue').querySelector('.hint-button');
            if(!thisHintBtn.classList.contains("disabled")){
                         thisHintBtn.classList.add("disabled");
 
            }
          }

          for (let j = 0; j < correctWord.length; j++) {
            let currentCell = document.querySelector(`.${currentName}_${i + 1}_${j + 1}`);
            let currentClue = document.querySelector(`.${currentName}_${i + 1}`);
            if (currentCell) {
              currentCell.readOnly = true;
              if (currentClue) {
                currentClue.style.pointerEvents = "none";
                // currentClue.setAttribute("tabindex", "-1");
                currentClue.classList.add("locked-cell");
                currentClue.setAttribute("tabindex", -1);
                currentClue.classList.remove("current");
              }
              currentCell.classList.add("locked-cell");
              currentCell.classList.remove("editting");
              currentCell.classList.remove("cursor");
            }
          }
          // Add to correct answers array if not already present
          if (!correctAnswers.includes(clueKey)) {
            correctAnswers.push(clueKey);
          }

        } else {
          // Incorrect answer: show cross and hint button
          if (clueLi) {
            clueLi.innerHTML = `${i + 1}. ${currentClue} (${correctWord.length})`;
            // let thisIcon = clueLi.closest('.clue').querySelector('.correctness_icon');
            // let thisHintBtn = clueLi.closest('.list_and_clue').querySelector('.hint-button');
            thisIcon.classList.add('incorrect_cross');
            thisHintBtn.classList.remove("disabled");
          }
          // Remove from correct answers if previously added
          if (indexInCorrect !== -1) {
            correctAnswers.splice(indexInCorrect, 1);
          }
        }
      }

    }

    //setting score to pass to continue when activity correct logic
    // ########uncomment below when theres a quiz in the unit 
    // let score = 100; //IZ
    // let scoreToPass = 100; //IZ
    // // Check that the length of correctAnswers array is the same as the length of expectedCorrectAnswers.
    if (correctAnswers.length === correctAnswersExpectedLength) {
      // If so, fire "all correct" dialog box.
      document.getElementById("dialog_feedback").style.display = "block";
      //   parent.parent.quizScores(score, scoreToPass); //IZ
    }
  }
  // initNavigables();
}

// }
//FOLLOWING IS LOGIC FROM STARTING POINT/EXAMPLE (IZ)

// Create an array of input elements and blank cells from the crossword
let index = Array.from(
  document.querySelectorAll("#crossword input, #crossword .blank")
);

// Create an array of clue elements
let clues = Array.from(document.querySelectorAll("div[data-clue]"));
// let hintBtns = Array.from(document.querySelectorAll(".hint-button"));
// let check = document.querySelector("#checkAnswer");
// let checkAndClues = [...clues, check, ...hintBtns];
// console.log(checkAndClues)
// Select all in one query, in DOM order
let checkAndClues = Array.from(
  document.querySelectorAll("div[data-clue], #checkAnswer, .hint-button")
);

// State object to track the current state of the crossword
let state = {
  index: null, // Index of the current input
  clue: null, // Current clue number
  cursor: 0, // Current position of the cursor
  answers: {}, // Store answers for each clue
  count: 16, // Number of clues (example value)
};

// Function to toggle highlighting on the crossword cells based on the clue
// This is triggered by mouseover and mouseout events
function toggleClue() {
  let c = this.getAttribute("data-clue"); // Get the clue number
  let d = this.getAttribute("data-dir"); // Get the direction: "across" or "down"
  let l = this.getAttribute("data-length"); // Get the length of the word
  let s = index.indexOf(document.querySelector('input[data-clue="' + c + '"]'));

  // Highlight the correct cells based on direction (across/down)
  for (let x = 0; x < l; x++) {
    if (d === "across") {
      index[s + x].classList.toggle("highlight");
    } else {
      index[s + x * crossWordWidth].classList.toggle("highlight");
    }
  }
}

// Function to handle the editing of a clue
// It updates the state and adds visual classes to the crossword cells
function editClue() {
  // if(isPopupOpen){
  //   return;
  // }
  // Remove any previous cursor, editing, or current classes
  Array.from(document.querySelectorAll(".cursor,.editting,.current")).map(
    (el) => el.classList.remove("cursor", "editting", "current")
  );

  let c = parseInt(this.getAttribute("data-clue"));
  let l = parseInt(this.getAttribute("data-length"));
  let d = this.getAttribute("data-dir");
  let s = index.indexOf(document.querySelector('input[data-clue="' + c + '"]'));

  for (let x = 0; x < l; x++) {
    let cell;
    if (d === "across") {
      cell = index[s + x];
    } else {
      cell = index[s + x * crossWordWidth];
    }

    if (cell && !cell.classList.contains("locked-cell")) {
      cell.classList.add("editting");
    }

  }
  // Update the state with the current clue details
  state.index = s;
  state.clue = c;
  state.dir = d;
  state.length = l;
  if (state.answers[c + "-" + d] === undefined) {
    state.answers[c + "-" + d] = "";
    state.cursor = 0;
  } else {
    if (state.length === state.answers[c + "-" + d].length) {
      state.cursor = state.answers[c + "-" + d].length - 1;
    } else {
      state.cursor = state.answers[c + "-" + d].length;
    }
  }
  // Set the cursor on the correct cell
  if (state.dir === "across") {
    const target = index[s + state.cursor];


    // if (target) target.classList.add("cursor");

    if (target && !target.classList.contains("locked-cell"))
      target.classList.add("cursor");


  } else {
    const target = index[s + state.cursor * crossWordWidth];
    //NEW IZ, so error isnt thrown if target is check answer button
    if (target && !target.classList.contains("locked-cell"))
      target.classList.add("cursor");
    // if (target) target.classList.add("cursor");
  }
  // // Highlight the current clue in the clues list
  const clueElement = document.querySelector(
    'div[data-clue="' + c + '"][data-dir="' + d + '"]'
  );
  // if (clueElement) 

  //   clueElement.classList.add("current");
  if (clueElement && !clueElement.classList.contains("locked-cell")) {
    clueElement.classList.add("current");
  }

}

// Add event listeners to the clues for mouseover, mouseout, and click
clues.forEach((clue) => {
  ["mouseover", "mouseout"].map((e) => {
    clue.addEventListener(e, toggleClue);
  });
  clue.addEventListener("click", editClue);
});

// Handle keyboard input for navigation and answering crossword clues
let target;
let navigables = []

document.addEventListener("keydown", (e) => {
  e.preventDefault();

  switch (e.key) {
    case "Shift":
    case "Space":
    case "Enter":
      return;

    case "Tab": {
      if (isPopupOpen) return;
      navigables = Array.from(
        document.querySelectorAll("div[data-clue], .hint-button:not(.disabled), #checkAnswer")
      );
      console.log(navigables)

      console.log(navigables)
      let current = document.activeElement;

      let c = navigables.indexOf(current);
      let nc = e.shiftKey ? c - 1 : c + 1;

      if (nc < 0) nc = navigables.length - 1;
      if (nc >= navigables.length) nc = 0;

      target = navigables[nc];
      target.focus();


      // Trigger your editClue logic
      editClue.bind(navigables[nc])();

      let clueTarget = navigables[nc];

      // Skip if target has locked-cell
      while (clueTarget.classList.contains("locked-cell")) {
        if (e.shiftKey) {
          nc--;
          if (nc < 0) nc = navigables.length - 1;
        } else {
          nc++;
          if (nc >= navigables.length) nc = 0;
        }
        clueTarget = navigables[nc];
      }

      editClue.bind(clueTarget)();

      return;
    }

    case "Backspace": {
      if (!state.clue) return;
      let key = state.clue + "-" + state.dir;
      state.answers[key] = state.answers[key].slice(0, -1);
      break;
    }

    default: {
      if (!state.clue) return;
      if (e.key.length > 1) return;

      let key = state.clue + "-" + state.dir;
      if (state.answers[key].length < state.length) {
        state.answers[key] += e.key;
      }
      break;
    }
  }

  //Ensures if hint button is whats focused, and user starts typing, console error doesnt fire 
  if (e.target.classList.contains("hint-button")) {
    return;
  }

  // === Move cursor highlight ===
  if (state.dir === "across") {
    index[state.index + state.cursor].classList.remove("cursor");
  } else {
    index[state.index + state.cursor * crossWordWidth].classList.remove("cursor");
  }

  state.cursor = state.answers[state.clue + "-" + state.dir].length;
  state.cursor = Math.max(0, Math.min(state.cursor, state.length - 1));

  if (state.dir === "across") {
    index[state.index + state.cursor].classList.add("cursor");
  } else {
    index[state.index + state.cursor * crossWordWidth].classList.add("cursor");
  }

  // === Update visible letters ===
  for (let x = 0; x < state.length; x++) {
    let answerChar = state.answers[state.clue + "-" + state.dir][x] || "";
    let cell =
      state.dir === "across"
        ? index[state.index + x]
        : index[state.index + x * crossWordWidth];

    if (!cell.classList.contains("locked-cell")) {
      cell.value = answerChar;
    }
  }
}, false);

// Function to select a clue and edit it

function selectClue() {
  let c = parseInt(this.getAttribute("data-clue"));
  let li = Array.from(document.querySelectorAll('div[data-clue="' + c + '"]'));
  if (li.length === 1) {
    editClue.bind(li[0])();
  } else {
    if (state.dir === "across") {
      editClue.bind(li[1])();
    } else {
      editClue.bind(li[0])();
    }
  }

}

// Add click event listener to input elements to select the corresponding clue
Array.from(document.querySelectorAll("input[data-clue]")).map((el) => {
  el.addEventListener("click", selectClue);
});


