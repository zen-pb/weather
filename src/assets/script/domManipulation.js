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
    locationTime: getLocationDateTime(data),
    icon: getIcon(data),
    fTemp: getTemp(data)[0],
    cTemp: getTemp(data)[1],
    condition: getCondition(data),
    description: getDescription(data),
    properties: getProperties(data),
    daily: getDaily(data),
  };

  const container = document.createElement("div");
  container.className = "weather-div";

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
  fScale.className = "active";

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

  const carouselDiv = generateCarousel(cleanData);

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

function getLocationDateTime(data, type = "full") {
  let timestamp;
  let formattedDateTime;

  if (type === "full") {
    timestamp = data.currentConditions.datetimeEpoch;
    formattedDateTime = format(new Date(timestamp * 1000), "EEE dd MMM h:mm a");
    formattedDateTime = formattedDateTime
      .replace("PM", "pm")
      .replace("AM", "am");
  } else if (type === "day") {
    timestamp = data.datetimeEpoch;
    formattedDateTime = format(new Date(timestamp * 1000), "EEE");
  }

  return formattedDateTime;
}

function getIcon(data) {
  return weatherIcons[`${data.currentConditions.icon}`];
}

function getTemp(data, type = "current") {
  let fahrenheit;

  if (type === "current") {
    fahrenheit = data.currentConditions.temp;
  } else if (type === "max") {
    fahrenheit = data.tempmax;
  } else if (type === "min") {
    fahrenheit = data.tempmin;
  }

  let celsius = (fahrenheit - 32) / 1.8;

  fahrenheit = Math.ceil(fahrenheit);
  celsius = Math.ceil(celsius);

  return [fahrenheit, celsius];
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
  const humidity = Math.ceil(data.currentConditions.humidity);
  const precipitation = Math.ceil(data.currentConditions.precipprob);
  const windM = data.currentConditions.windspeed;
  const windKM = windM * 1.60934;

  return [
    [Math.ceil(feelsLikeF), Math.ceil(feelsLikeC)],
    humidity,
    precipitation,
    [Math.ceil(windM), Math.ceil(windKM)],
  ];
}

function getDaily(data) {
  return data.days;
}

function generateCarousel(cleanData) {
  const slider = document.createElement("div");
  slider.className = "carousel-div";

  const slides = document.createElement("div");
  slides.className = "slides-div";

  const weatherPropertiesDiv = document.createElement("div");
  weatherPropertiesDiv.className = "weather-properties-div";

  const propertyNames = ["Feels Like", "Humidity", "Precipitation", "Wind"];

  cleanData.properties.forEach((property, index) => {
    const squareDiv = document.createElement("div");
    squareDiv.className = "square-div";

    const title = document.createElement("h3");
    title.className = "square-title";
    title.textContent = propertyNames[index];

    const content = document.createElement("p");
    content.className = "square-content";

    if (index === 0) {
      property.forEach((item, index) => {
        const span = document.createElement("span");
        span.textContent = item;
        const i = document.createElement("i");
        i.textContent = index === 0 ? "°F" : "°C";
        i.id = index === 0 ? "fScale" : "cScale";
        span.appendChild(i);
        content.appendChild(span);
      });
    } else if (index === 3) {
      property.forEach((item, index) => {
        const span = document.createElement("span");
        span.textContent = item;
        const i = document.createElement("i");
        i.textContent = index === 0 ? "mph" : "km/h";
        i.id = index === 0 ? "fScale" : "cScale";
        span.appendChild(i);
        content.appendChild(span);
      });
    } else {
      content.textContent = property;
      const i = document.createElement("i");
      i.textContent = "%";
      content.appendChild(i);
    }

    squareDiv.append(title, content);
    weatherPropertiesDiv.appendChild(squareDiv);
  });

  const dailyDiv = document.createElement("div");
  dailyDiv.className = "daily-div";

  cleanData.daily.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-div";

    const dayOfWeek = document.createElement("h3");
    dayOfWeek.className = "day-name";
    dayOfWeek.textContent = getLocationDateTime(day, "day");

    const icon = document.createElement("img");
    icon.className = "day-icon";
    icon.src = weatherIcons[`${day.icon}`];

    const tempDiv = document.createElement("div");
    tempDiv.className = "day-temp-div";

    const maxTemp = document.createElement("p");
    maxTemp.className = "max-temp";

    const tempMax = getTemp(day, "max");
    tempMax.forEach((temp, index) => {
      const span = document.createElement("span");
      span.textContent = `${temp}`;
      span.id = index === 0 ? "fScale" : "cScale";
      const i = document.createElement("i");
      i.textContent = "°";
      span.appendChild(i);
      maxTemp.appendChild(span);
    });

    const minTemp = document.createElement("p");
    minTemp.className = "min-temp";

    const tempMin = getTemp(day, "min");
    tempMin.forEach((temp, index) => {
      const span = document.createElement("span");
      span.textContent = `${temp}`;
      span.id = index === 0 ? "fScale" : "cScale";
      const i = document.createElement("i");
      i.textContent = "°";
      span.appendChild(i);
      minTemp.appendChild(span);
    });

    tempDiv.append(maxTemp, minTemp);
    dayDiv.append(dayOfWeek, icon, tempDiv);
    dailyDiv.append(dayDiv);
  });

  slides.append(weatherPropertiesDiv, dailyDiv);

  const indicatorDiv = document.createElement("div");
  indicatorDiv.className = "indicator-div";

  Array.from({ length: slides.childElementCount })
    .map(() => {
      const dot = document.createElement("div");
      dot.className = "dot-div";
      return dot;
    })
    .forEach((dot) => indicatorDiv.appendChild(dot));

  slider.append(slides, indicatorDiv);

  return slider;
}
