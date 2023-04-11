// Selectors
const searchInput = document.querySelector(".search input");
const emptyErrorInput = document.querySelector(".error-empty");
const sound = document.querySelector(".sound");
const result = document.querySelector(".result-section");
const playBtn = document.querySelector(".play-icon");

// Functions
// Function that fetches the data from the API
const getUserData = async (e) => {
  try {
    if (searchInput.value !== "") {
      if (e.which === 13) {
        const word = searchInput.value;
        console.log(word);
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(url);
        if (response.status !== 200) {
          throw new Error("could not fetch user data");
        }
        const data = await response.json();
        console.log(data);
        // Show the result section
        result.style.display = "block";
        // Clear search input
        searchInput.value = "";
        return data;
      }
    } else {
      emptyErrorInput.style.display = "block";
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Function that searches for the meaning
async function searchMeaning(e) {
  try {
    const data = await getUserData(e);
    setValues(data);
  } catch (error) {
    console.error(error.message);
  }
}

function setValues(data) {
  const searchedWord = document.querySelector(".search-term h1");
  const phoneticsText = document.querySelector(".search-term p");
  if (data && data.length > 0) {
    searchedWord.textContent = data[0].word;
    const phonetics = data[0].phonetics;
    if (phonetics && phonetics.length > 0 && phonetics[0].audio) {
      phoneticsText.textContent = phonetics[0].text;
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

// Event Listeners
window.addEventListener("keypress", (e) => {
  searchMeaning(e);
});
searchInput.addEventListener("input", () => {
  // Hide input error message
  emptyErrorInput.style.display = "none";
});
