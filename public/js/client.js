window.addEventListener("load", function () {
  // TODO Add JavaScript code so that when the user clicks one of the Pokemon buttons,
  // detailed data about that Pokemon will be loaded from your own API, and displayed
  // in the appropriate place on the HTML page (overwriting any data which was already
  // there).
  const pokemonButtons = document.querySelectorAll(".pokemon-button");

  // this function allows me to pre-select my favorite pokemon button to show the css. 
  function selectButtonByDexNumber(dexNumber) {
    const button = document.querySelector(`[data-dex-number="${dexNumber}"]`);
    if (button) {
      button.classList.add("selected");
    }
  }
  selectButtonByDexNumber(54);

  pokemonButtons.forEach(button => {
    button.addEventListener("click", function () {
      const dexNumber = button.dataset.dexNumber;

      pokemonButtons.forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");

      fetch(`/api/pokemon/${dexNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          displayPokemonDetails(data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });
  });

  function displayPokemonDetails(data) {
    const detailsElement = document.querySelector('.details');
    detailsElement.innerHTML = `
      <h1>Details</h1>
      <img src="${data.imageUrl}" class="big-image" />
      <h2 class="dex-number-name">#${data.dexNumber}&nbsp;${data.name}</h2>
      <p><strong>Types:&nbsp;</strong><span class="types">${data.types}</span></p>
      <p><strong>About <span class="pokemon-name-about">${data.name}:</span></strong>&nbsp;<span class="pokemon-about">${data.dexEntry}</span></p>
    `;
  }

  //task 6 from here 
  this.document.getElementById("dex-number-input").addEventListener("input", function(){
    this.value=this.value.slice(0,4);
  })

  document.getElementById("add-button").addEventListener("click", async function () {
    const dexNumberInput = document.getElementById("dex-number-input");
    const dexNumber = parseInt(dexNumberInput.value, 10);

    if (isNaN(dexNumber) || dexNumber < 1 || dexNumber > 1010) {
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "Invalid dex number. Please enter a number between 1 and 1010.";
      errorMessage.style.display = "block";
    } else {
      const existingButton = document.querySelector(`[data-dex-number="${dexNumber}"]`);
      if (existingButton) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = `Pokemon with dex number ${dexNumber} is already in the list.`;
        errorMessage.style.display = "block";
      } else {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "";
        errorMessage.style.display = "none";

        try {
          const response = await addPokemon(dexNumber);
          // Use the data from the response to update your UI

          dexNumberInput.value = "";
        } catch (error) {
          console.error("Error fetching and processing Pokemon data:", error);
        }
      }
    }
  });

    async function addPokemon(dexNumber) {
      try {
        const response = await fetch(`/api/pokemon/${dexNumber}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to add Pokemon');
        }

        const data = await response.json();

        const newButton = document.createElement("button");
        newButton.className = "pokemon-button";
        newButton.setAttribute("data-dex-number", dexNumber);

        const imgElement = document.createElement("img");
        imgElement.src = smallImageUrl;

        const pokemonName = data.name; // This will contain the capitalized name
        const spanElement = document.createElement("span");
        spanElement.textContent = pokemonName;

        newButton.appendChild(imgElement);
        newButton.appendChild(spanElement);

        document.querySelector(".sprite-container").appendChild(newButton);
      } catch (error) {
        console.error("Error adding Pokemon:", error);
      }
    }
});
