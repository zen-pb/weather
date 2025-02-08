export default async function weatherAPI(location) {
  const API_KEY = "MCAAZARF95RSVNWZQEZMYSZ3G";

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=us&elements=datetime%2CdatetimeEpoch%2CresolvedAddress%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cwindspeed%2Cconditions%2Cdescription%2Cicon&key=${API_KEY}&contentType=json`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
