export default async function weatherAPI(location) {
  const API_KEY = "MCAAZARF95RSVNWZQEZMYSZ3G";

  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=us&key=${API_KEY}&contentType=json`
  );

  const data = await response.json();

  return data;
}
