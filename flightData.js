import { createClient } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

const SUPABASE_URL = "https://szybwngkjvxwgrclfinc.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWJ3bmdranZ4d2dyY2xmaW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3MDI2MzIsImV4cCI6MjAyNjI3ODYzMn0.n9ZGpftf6XJc9EK-hWUXILtzrD7R0vMqjtgWZKMkqW4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function getFlightData(days) {
  // const departureDate = "2024-04-03"
  // const returnDate = "2024-04-03"

  //10 Days, 15 Days, 20 Days
  const amountOfDays = 10;

  const departureDate = new Date();
  const travelDay = departureDate.setDate(departureDate.getDate() + 14);
  const returnDate = departureDate;
  const returnDay = returnDate.setDate(returnDate.getDate() + amountOfDays);

  // const {dateFlyTo:flyDate, dateReturn:flyBackDate} = await priceCalendar()
  const flyDate = new Date(travelDay).toISOString().split("T")[0];
  const flyBackDate = new Date(returnDay).toISOString().split("T")[0];
  const belgium = "eyJzIjoiQlJVUyIsImUiOiIyNzUzOTU2NSIsImgiOiIyNzUzOTU2NSJ9";
  const germany = "eyJzIjoiTVVDIiwiZSI6Ijk1NjczNDkxIiwiaCI6IjI3NTQ1MDM0In0=";
  const france = "eyJzIjoiSFRMIiwiZSI6IjEyOTA1MzA4NSIsImgiOiI0Njg2MTIwNCJ9";
  const netherlands =
    "eyJzIjoiQU1TIiwiZSI6Ijk1NTY1MDQ0IiwiaCI6IjI3NTM2NTYxIn0=";
  const armenia = "eyJzIjoiRVZOIiwiZSI6Ijk1NjczNTE4IiwiaCI6IjI3NTQwOTY4In0=";

  const url = `https://skyscanner80.p.rapidapi.com/api/v1/flights/search-roundtrip?fromId=${belgium}&toId=${armenia}&departDate=${flyDate}&returnDate=${flyBackDate}&adults=1&currency=EUR&currency=EUR&market=BE&locale=nl-NL`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "d13c083917msh183590d428ab4e6p12339djsn0fe2fb7762a4",
      "X-RapidAPI-Host": "skyscanner80.p.rapidapi.com",
    },
  };

  function convertUrl(country) {
    return `https://skyscanner80.p.rapidapi.com/api/v1/flights/search-roundtrip?fromId=${country}&toId=${armenia}&departDate=${flyDate}&returnDate=${flyBackDate}&adults=1&currency=EUR&currency=EUR&market=BE&locale=nl-NL`;
  }

  function sortingFlights(country) {
    const lowestDuration = country?.data?.itineraries.filter(
      (item) =>
        item.legs[0].durationInMinutes < 530 &&
        item.legs[1].durationInMinutes < 530
    );

    // const lowestDuration = country?.data?.itineraries.sort((a,b)=> {
    //   if(a.legs[0].duration > b.legs[0].duration && a.legs[1].duration > b.legs[1].duration ) return 1
    //   else if(a.legs[0].duration < b.legs[0].duration && a.legs[1].duration < b.legs[1].duration) return -1
    //   else return 0
    // })
    const flights = lowestDuration?.sort((a, b) => {
      if (a.price.raw > b.price.raw) return 1;
      else if (a.price.raw < b.price.raw) return -1;
      else return 0;
    });

    return flights?.slice(0, 1);
  }

  try {
    const promise = fetch(convertUrl(belgium), options);
    const promise2 = fetch(convertUrl(netherlands), options);
    const promise3 = fetch(convertUrl(france), options);
    const promise4 = fetch(convertUrl(germany), options);
    const response = await Promise.allSettled([
      promise,
      promise2,
      promise3,
      promise4,
    ]);
    const data = {
      bel: await response[0].value.json(),
      ned: await response[1].value.json(),
      fra: await response[2].value.json(),
      ger: await response[3].value.json(),
    };

    const germanyFlights = sortingFlights(data.ger);
    const netherlandsFlights = sortingFlights(data.ned);
    const belgiumFlights = sortingFlights(data.bel);

    const franceFlights = sortingFlights(data.fra);
    // if(germanyFlights, netherlandsFlights, belgiumFlights)
    return [
      ...netherlandsFlights,
      ...belgiumFlights,
      ...franceFlights,
      ...germanyFlights,
    ];
    // const data = await response.json();
    // return data
  } catch (error) {
    console.log(error);
  }
}
//Brussels id:"eyJzIjoiQlJVUyIsImUiOiIyNzUzOTU2NSIsImgiOiIyNzUzOTU2NSJ9"
//Yerevan id:"eyJzIjoiRVZOIiwiZSI6Ijk1NjczNTE4IiwiaCI6IjI3NTQwOTY4In0="
//Munich id: "eyJzIjoiTVVDIiwiZSI6Ijk1NjczNDkxIiwiaCI6IjI3NTQ1MDM0In0="
//Amsterdam id: "eyJzIjoiQU1TIiwiZSI6Ijk1NTY1MDQ0IiwiaCI6IjI3NTM2NTYxIn0="
//country:"Belgium"
//market:"BE"
//locale:"nl-NL"

export async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("images-flight")
    .update("/flights12", decode(file), { contentType: "image/jpg" });
  if (error) {
    console.log(error);
  } else {
    console.log("Uploaded file to DB");
  }
}

export async function deleteAll(supabase) {
  try {
    const { data, error } = await supabase
      .from("flights")
      .delete()
      .eq("destinationName", "EVN");
    if (error) throw new Error("Unable to delete");
  } catch (error) {
    console.log(error);
  }
}

// getFlightData()
