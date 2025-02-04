import weatherAPI from "./weatherAPI";

export default function domManipulation() {
  const searchInput = document.getElementById("searchInput");
  const searchBTN = document.getElementById("searchBTN");
  let isLoading;

  const handleSubmit = async (event) => {
    isLoading = true;

    if (event.type === "click" || event.code === "Enter") {
      if (isEmpty()) {
        searchInput.focus();
      } else {
        const location = searchInput.value.trim();
        const locationData = await weatherAPI(location);
        isLoading = false;
        searchInput.value = "";
        console.log(locationData);
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
