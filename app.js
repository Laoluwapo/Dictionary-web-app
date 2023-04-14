// Selectors
const searchInput = document.querySelector(".search input");
const emptyErrorInput = document.querySelector(".error-empty");
const sound = document.querySelector(".sound");
const result = document.querySelector(".result-section");
const playBtn = document.querySelector(".play-icon");
const nounSection = document.querySelector(".noun-sect");
const verbSection = document.querySelector(".verb-sect");
const nounList = document.querySelector(".noun-list");
const verbList = document.querySelector(".verb-list");
const noDefinitions = document.querySelector(".no-def-found");
const selectFont = document.querySelector(".font-select");

// Functions
// Function that fetches the data from the API
const getUserData = async (e) => {
  try {
    if (searchInput.value !== "") {
      if (e.which === 13) {
        const word = searchInput.value;
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(url);
        if (response.status !== 200) {
          throw new Error("could not fetch user data");
        }
        const data = await response.json();
        // Show the result section
        result.style.display = "block";
        noDefinitions.style.display = "none";
        // Clear search input
        searchInput.value = "";
        return data;
      }
    } else {
      emptyErrorInput.style.display = "block";
    }
  } catch (error) {
    result.style.display = "none";
    noDefinitions.style.display = "block";
    searchInput.value = "";
    console.error(error.message);
  }
};

// Function that searches for the meaning
async function searchMeaning(e) {
  try {
    const data = await getUserData(e);
    setSoundValues(data);
    setMeaningValues(data);
    setOtherValues(data);
  } catch (error) {
    console.error(error.message);
  }
}

// A function that sets the searched term content and sound
function setSoundValues(data) {
  const searchedWord = document.querySelector(".search-term h1");
  const phoneticsText = document.querySelector(".search-term p");
  if (data && data.length > 0) {
    searchedWord.textContent = data[0].word;
    const phonetics = data[0].phonetics;
    // Check if phonetics exists in the data, if there's at least one object and if phonetics audio exists there.
    if (phonetics && phonetics.length > 0) {
      phoneticsText.textContent = phonetics[0].text;
      if (phonetics[0].audio) {
        sound.setAttribute("src", phonetics[0].audio);
        playBtn.disabled = false;
        playBtn.classList.remove("disabled");
        playBtn.addEventListener("click", () => {
          sound.play();
        });
      } else {
        sound.setAttribute("src", "");
        playBtn.disabled = true;
        playBtn.classList.add("disabled");
      }
    }
  }
}

// A function that sets the content of the meanings section
function setMeaningValues(data) {
  if (data && data.length > 0) {
    // Check if there are meanings present and set them to an li
    if (data[0].meanings && data[0].meanings.length > 0) {
      // Clear existing list items
      nounList.innerHTML = "";
      verbList.innerHTML = "";
      // Check if there are noun and verb meanings present and set them to a list
      let hasNounMeanings = false;
      let hasVerbMeanings = false;
      data[0].meanings.forEach((meaning) => {
        // check if there are noun definitions
        if (meaning.partOfSpeech === "noun" && meaning.definitions.length > 0) {
          hasNounMeanings = true;
          // Create new list item for each definition
          for (let i = 0; i < meaning.definitions.length && i < 3; i++) {
            const definition = meaning.definitions[i];
            const li = document.createElement("li");
            li.textContent = definition.definition;
            nounList.appendChild(li);
          }
        }
        // Check if there are verb  definitions
        if (meaning.partOfSpeech === "verb" && meaning.definitions.length > 0) {
          hasVerbMeanings = true;
          for (let i = 0; i < meaning.definitions.length && i < 3; i++) {
            const definition = meaning.definitions[i];
            const li = document.createElement("li");
            li.textContent = definition.definition;
            verbList.appendChild(li);
          }
        }
      });
      // Show/hide noun and verb sections based on if they have meanings
      if (hasNounMeanings) {
        nounSection.style.display = "block";
      } else {
        nounSection.style.display = "none";
      }
      if (hasVerbMeanings) {
        verbSection.style.display = "block";
      } else {
        verbSection.style.display = "none";
      }
    }
  }
}

// Function that sets the synonyms, example and source
function setOtherValues(data) {
  const synExample = document.querySelector(".syn-example");
  const example = document.querySelector(".example");
  const sourceLink = document.querySelector(".links a");
  if (data && data.length > 0) {
    const meanings = data[0].meanings;
    if (meanings && meanings.length > 0 && meanings[0].synonyms) {
      if (meanings[0].synonyms[0]) {
        synExample.style.display = "block";
        synExample.textContent = meanings[0].synonyms[0];
      } else {
        synExample.parentElement.style.display = "none";
      }
      if (meanings[0].definitions[0].example) {
        example.style.display = "block";
        example.textContent = `"` + meanings[0].definitions[0].example + `"`;
      } else {
        example.style.display = "none";
      }
    }
    if (data[0].sourceUrls && data[0].sourceUrls.length > 0) {
      sourceLink.textContent = data[0].sourceUrls[0];
      sourceLink.href = data[0].sourceUrls[0];
    }
  }
}

// Function that changes the font family to the selected one
function changeFontFamily(e) {
  const selectedOption = e.target.value;
  if (selectedOption === "Serif") {
    document.body.style.fontFamily = "'Lora', serif";
  } else if (selectedOption === "Sans Serif") {
    document.body.style.fontFamily = "'Inter', sans-serif";
  } else {
    document.body.style.fontFamily = "'Inconsolata', monospace";
  }
}

// Event Listeners
window.addEventListener("keypress", (e) => {
  searchMeaning(e);
});
searchInput.addEventListener("input", () => {
  // Hide input error message
  emptyErrorInput.style.display = "none";
});
selectFont.addEventListener("change", (e) => {
  changeFontFamily(e);
});
