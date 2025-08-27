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
const acrossUl = document.createElement("ul");
const downUl = document.createElement("ul");

// Add headings for both sections
const acrossHeading = document.createElement("li");
acrossHeading.className = "heading";
acrossHeading.textContent = "Across";

const downHeading = document.createElement("li");
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
        let word = entry[0]; // The answer word
        let startX = entry[2] - 1; // Convert to zero-based index (column)
        let startY = entry[3] - 1; // Convert to zero-based index (row)

        for (let j = 0; j < word.length; j++) {
          //depending on the array, iterate through either columns of rows for the length of the word,
          //declaring each cell a target cell, to be made input cell in next step.
          let targetCell =
            currentName === "across"
              ? rowsArray[startY][startX + j]
              : rowsArray[startY + j][startX];

          //break at the end of each row
          if (!targetCell) break;

          // Check if the cell already has an input
          // this prevents overwriting when a cell needs both a down and across class
          let input;
          if (targetCell.tagName === "INPUT") {
            input = targetCell; // Use existing input
          } else {
            //Create input with required attributes to overwrite blank cells written in previous loop.
            input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            targetCell.replaceWith(input);
          }

          //If the index of a letter is 0,
          // give it a data clue number of the word it belongs tos index within the original down or across array
          if (j === 0) {
            dataClueNumber = i + 1;
            input.setAttribute("data-clue", dataClueNumber);
          }

          // Assign input to the correct grid position
          if (currentName === "across") {
            rowsArray[startY][startX + j] = input;
          } else {
            rowsArray[startY + j][startX] = input;
          }
          //give unique classname to across cell in order to be able to check correctness
          input.classList.add(`${currentName}_${dataClueNumber}_${j + 1}`);
        }

        // Create clue list item
        const li = document.createElement("li");
        li.setAttribute("data-clue", `${i + 1}`);
        li.setAttribute("data-dir", currentName);
        li.setAttribute("data-length", word.length);
        li.classList.add(`${currentName}_${i + 1}`);

        const clueText = `${i + 1}. ${entry[1]} (${word.length})`;
        li.setAttribute("data-original-clue", entry[1]); // <- ADD THIS
        li.innerHTML = `${clueText} <span class="correctness_icon"></span>`;

        //If coming from the across array data, add to across <ul>, if not, add to down <ul>
        currentName === "across"
          ? acrossUl.appendChild(li)
          : downUl.appendChild(li);
      }
    }
  }
  cluesDiv.appendChild(downUl);
  cluesDiv.appendChild(acrossUl);
}

// Call createCellsAndClues() initially
createCellsAndClues();

const closeButton = document.querySelector(".close_popup");
const cluesDivs = document.querySelectorAll("#clues li");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("hint-button")) {
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

  // Handle close button
  if (e.target.closest(".close_popup")) {
    const popup = document.querySelector(".popup");
    popup.classList.add("hide");
    isPopupOpen = false;
  }
});

document.addEventListener("keydown", function (e) {
  // Check if key is Enter or Space
  if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("close_popup")) {

    const popup = document.querySelector(".popup");
    popup.classList.add("hide");
    isPopupOpen = false;
  }
});

console.log(isPopupOpen);

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
        let clueLi = document.querySelector(`li[data-clue="${i + 1}"][data-dir="${currentName}"]`);
        const clueKey = `${currentName} ${i + 1}`;
        const indexInCorrect = correctAnswers.indexOf(clueKey);

        if (isIncomplete) {
          // Incomplete: reset clue text without icon or hint
          if (clueLi) {
            clueLi.innerHTML = `${i + 1}. ${currentClue} (${correctWord.length}) <span class="correctness_icon"></span>`;
          }
          // Remove from correct answers if previously added
          if (indexInCorrect !== -1) {
            correctAnswers.splice(indexInCorrect, 1);
          }

        } else if (isCorrect) {
          // Correct answer: show answer and tick
          if (clueLi) {
            clueLi.innerHTML = `${i + 1}. ${currentClue.replace("_________________", correctWord.toUpperCase())} (${correctWord.length}) <span class="correctness_icon correct_tick"></span>`;
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
            clueLi.innerHTML = `${i + 1}. ${currentClue} (${correctWord.length}) <span class="correctness_icon incorrect_cross"></span><button class="hint-button" tabindex="0" data-clue="${i + 1}" data-dir="${currentName}">HINT</button>`;
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
}

//FOLLOWING IS LOGIC FROM STARTING POINT/EXAMPLE (IZ)

// Create an array of input elements and blank cells from the crossword
let index = Array.from(
  document.querySelectorAll("#crossword input, #crossword .blank")
);

// Create an array of clue elements
let clues = Array.from(document.querySelectorAll("li[data-clue]"));
let check = document.querySelector("#checkAnswer");
let checkAndClues = [...clues, check];

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
    'li[data-clue="' + c + '"][data-dir="' + d + '"]'
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
document.addEventListener(
  "keydown",
  (e) => {
    // if (!isPopupOpen) {
    e.preventDefault();
    // }
    // // Handle non-character keys like Shift, Space, and Enter
    switch (e.key) {
      case "Shift":
      case "Space":
      case "Enter":
        return;
      case "Tab":

        if (isPopupOpen) {
          return;
        }
        if (document.activeElement) {
          document.activeElement.blur(); // remove focus from the current element
        }
        // Handle Tab for navigating between clues
        //NEW IZ get reference to the check answer button
        let checkButton = document.getElementById("checkAnswer");
        // Get the currently selected clue element based on state
        let cli = document.querySelector(
          'li[data-clue="' + state.clue + '"][data-dir="' + state.dir + '"]'
        );

        //NEW IZ If no clue, then target is check answer button
        let target = cli || checkButton;
        //NEW IZ Find the index of the currently focused item (clue or button)
        let c = checkAndClues.indexOf(target);

        if (e.shiftKey === true) {
          nc = c - 1;
        } else {
          nc = c + 1;
        }

        //NEW IZ Wrap around to the beginning if we've gone past the last item
        if (nc === checkAndClues.length) {
          nc = 0;
        }

        // If next index is the check button (last item), focus it
        if (nc === checkAndClues.length - 1) {
          checkAnswerButton.focus();
        } else {
          checkAnswerButton.blur();
        }

        editClue.bind(checkAndClues[nc])();
        let clueTarget = checkAndClues[nc];

        // Skip if target has locked-cell
        while (clueTarget.classList.contains("locked-cell")) {
          if (e.shiftKey) {
            nc--;
            if (nc < 0) nc = checkAndClues.length - 1;
          } else {
            nc++;
            if (nc >= checkAndClues.length) nc = 0;
          }
          clueTarget = checkAndClues[nc];
        }

        editClue.bind(clueTarget)();

        return;
        break;
      case "Backspace":
        if (!state.clue) return;
        state.answers[state.clue + "-" + state.dir] = state.answers[
          state.clue + "-" + state.dir
        ].substr(0, state.answers[state.clue + "-" + state.dir].length - 1);
        break;
      default:
        if (!state.clue) return;
        if (e.key.length > 1) return;
        if (state.answers[state.clue + "-" + state.dir].length < state.length) {
          state.answers[state.clue + "-" + state.dir] += e.key;
        }
        break;
    }
    // Move the cursor based on the direction and current input
    if (state.dir === "across") {
      index[state.index + state.cursor].classList.remove("cursor");
    } else {
      index[state.index + state.cursor * crossWordWidth].classList.remove(
        "cursor"
      );
    }
    state.cursor = state.answers[state.clue + "-" + state.dir].length;
    if (state.cursor < 0) {
      state.cursor = 0;
    } else if (state.cursor > state.length - 1) {
      state.cursor = state.length - 1;
    }
    if (state.dir === "across") {
      index[state.index + state.cursor].classList.add("cursor");
    } else {
      index[state.index + state.cursor * crossWordWidth].classList.add(
        "cursor"
      );
    }

    // Update the crossword cells with the current answer
    // for (let x = 0; x < state.length; x++) {
    //   let answerChar = state.answers[state.clue + "-" + state.dir][x] || ""; // Default to empty string
    //   if (state.dir === "across") {
    //     index[state.index + x].value = answerChar;
    //   } else {
    //     index[state.index + x * crossWordWidth].value = answerChar;
    //   }
    // }
    for (let x = 0; x < state.length; x++) {
      let answerChar = state.answers[state.clue + "-" + state.dir][x] || ""; // Default to empty string
      let cell;
      if (state.dir === "across") {
        cell = index[state.index + x];
      } else {
        cell = index[state.index + x * crossWordWidth];
      }
      // Only update if the cell is not locked
      if (!cell.classList.contains("locked-cell")) {
        cell.value = answerChar;
      }
    }

  },
  false
);

// Function to select a clue and edit it

function selectClue() {
  let c = parseInt(this.getAttribute("data-clue"));
  let li = Array.from(document.querySelectorAll('li[data-clue="' + c + '"]'));
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

document.addEventListener('keydown', function (e) {
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
});
