// Selectors
const searchInput = document.querySelector(".search input");
const emptyErrorInput = document.querySelector(".error-empty");
const sound = document.querySelector(".sound");

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
  } catch (error) {
    console.error(error.message);
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
