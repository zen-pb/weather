import { format } from "date-fns";
import weatherAPI from "./weatherAPI";
import { weatherIcons } from "./imageHandler";

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

        console.log(locationData);

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

function loadData(data) {
  const cleanData = {
    locationMain: getLocationMain(data),
    locationSub: getLocationSub(data),
    locationTime: getLocationTime(data),
    icon: getIcon(data),
    fTemp: getTemp(data).fahrenheit,
    cTemp: getTemp(data).celsius,
    condition: getCondition(data),
    description: getDescription(data),
    properties: getProperties(data),
  };

  const container = document.createElement("div");
  container.className = "weather";

  const locationTimeDiv = document.createElement("div");
  locationTimeDiv.className = "location-time-div";

  const locationDiv = document.createElement("div");
  locationDiv.className = "location-div";

  const locationMain = document.createElement("h1");
  locationMain.className = "main";
  locationMain.textContent = cleanData.locationMain;

  const locationSub = document.createElement("p");
  locationSub.className = "sub";
  locationSub.textContent = cleanData.locationSub;

  const locationTime = document.createElement("p");
  locationTime.className = "time";
  locationTime.textContent = cleanData.locationTime;

  locationDiv.append(locationMain, locationSub);
  locationTimeDiv.append(locationDiv, locationTime);

  const icon = document.createElement("img");
  icon.className = "icon";
  icon.src = cleanData.icon;

  const tempScaleDiv = document.createElement("div");
  tempScaleDiv.className = "temp-scale-div";

  const tempDiv = document.createElement("div");
  tempDiv.className = "temp-div";

  const fTemp = document.createElement("h2");
  fTemp.className = "f-temp";
  fTemp.textContent = cleanData.fTemp;

  const cTemp = document.createElement("h2");
  cTemp.className = "c-temp";
  cTemp.textContent = cleanData.cTemp;

  const scaleDiv = document.createElement("div");
  scaleDiv.className = "scale-div";

  const fScale = document.createElement("button");
  fScale.id = "fScale";
  fScale.textContent = "°F";

  const cScale = document.createElement("button");
  cScale.id = "cScale";
  cScale.textContent = "°C";

  tempDiv.append(cTemp, fTemp);
  scaleDiv.append(cScale, "|", fScale);
  tempScaleDiv.append(tempDiv, scaleDiv);

  const conditionDescriptionDiv = document.createElement("div");
  conditionDescriptionDiv.className = "condition-desc-div";

  const condition = document.createElement("h3");
  condition.className = "condition";
  condition.textContent = cleanData.condition;

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = cleanData.description;

  conditionDescriptionDiv.append(condition, description);

  const carouselDiv = document.createElement("div");
  carouselDiv.className = "carouselDiv";

  const weatherPropertiesDiv = document.createElement("div");
  weatherPropertiesDiv.className = "weather-properties-div";

  const propertyNames = ["Feels Like", "Humidity", "Precipitation", "Wind"];

  cleanData.properties.forEach((property, index) => {
    const squareDiv = document.createElement("div");
    squareDiv.className = "sqaure-div";

    const title = document.createElement("h3");
    title.className = "square-title";
    title.textContent = propertyNames[index];

    const content = document.createElement("p");
    content.className = "square-content";

    if (index === 0) {
      property.forEach((item, index) => {
        const span = document.createElement("span");
        span.textContent = index === 0 ? `${item}°F` : `${item}°C`;
        content.appendChild(span);
      });
    } else if (index === 3) {
      property.forEach((item, index) => {
        const span = document.createElement("span");
        span.textContent = index === 0 ? `${item}°mph` : `${item}°km/h`;
        content.appendChild(span);
      });
    } else {
      content.textContent = property + "%";
    }

    squareDiv.append(title, content);
    weatherPropertiesDiv.appendChild(squareDiv);
  });

  carouselDiv.append(weatherPropertiesDiv);

  container.append(
    locationTimeDiv,
    icon,
    tempScaleDiv,
    conditionDescriptionDiv,
    carouselDiv
  );

  return container;
}

function getLocationMain(data) {
  let locationMain = data.resolvedAddress;
  const targetIndex = locationMain.indexOf(",");

  if (targetIndex !== -1) {
    locationMain = locationMain.substring(0, targetIndex);
  }

  return locationMain;
}

function getLocationSub(data) {
  return data.resolvedAddress
    .replace(" ", "")
    .split(",")
    .splice(1, 2)
    .join(",");
}

function getLocationTime(data) {
  const timestamp = data.currentConditions.datetimeEpoch;
  const date = new Date(timestamp * 1000);

  let formattedDate = format(date, "EEE dd MMM h:mm a");
  formattedDate = formattedDate.replace("PM", "pm").replace("AM", "am");

  return formattedDate;
}

function getIcon(data) {
  return weatherIcons[`${data.currentConditions.icon}`];
}

function getTemp(data) {
  const fahrenheit = data.currentConditions.temp;
  const celsius = (fahrenheit - 32) / 1.8;

  return { fahrenheit, celsius };
}

function getCondition(data) {
  return data.currentConditions.conditions;
}

function getDescription(data) {
  return data.description;
}

function getProperties(data) {
  const feelsLikeF = data.currentConditions.feelslike;
  const feelsLikeC = (feelsLikeF - 32) / 1.8;
  const humidity = data.currentConditions.humidity;
  const precipitation = data.currentConditions.precipprob;
  const windM = data.currentConditions.windspeed;
  const windKM = windM * 1.60934;

  return [[feelsLikeF, feelsLikeC], humidity, precipitation, [windM, windKM]];
}
