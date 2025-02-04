import weatherAPI from "./weatherAPI";

export default function domManipulation() {
  const container = document.querySelector(".container");
  const content = document.getElementById("content");
  const searchInput = document.getElementById("searchInput");
  const searchBTN = document.getElementById("searchBTN");

  const handleSubmit = async (event) => {
    if (event.type === "click" || event.code === "Enter") {
      if (isEmpty()) {
        searchInput.focus();
      } else {
        const location = searchInput.value.trim();
        searchInput.value = "";
        searchInput.disabled = true;
        searchBTN.disabled = true;

        content.className = "";
        content.replaceChildren(Loader());
        container.classList.add("gap");

        const locationData = await weatherAPI(location);

        content.replaceChildren(loadData(locationData));
        content.classList.add("weather");
        searchInput.disabled = false;
        searchBTN.disabled = false;
      }
    }
  };

  const isEmpty = () => {
    const value = searchInput.value.trim();

    if (value !== "") {
      return false;
    }
    return true;
  };

  searchBTN.addEventListener("click", handleSubmit);

  document.addEventListener("keydown", handleSubmit);
}

function Loader() {
  const span = document.createElement("span");
  span.className = "loader";

  return span;
}

function loadData(data) {}
