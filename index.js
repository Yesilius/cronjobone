// Initialize the JS client
import { createClient } from "@supabase/supabase-js";
import getFlightData, { deleteAll, uploadFile } from "./flightData.js";
import express from "express";
import Screenshot from "./takescreenshot.js";
import postOnInsta from "./instagramActions.js";

const SUPABASE_URL = "https://szybwngkjvxwgrclfinc.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWJ3bmdranZ4d2dyY2xmaW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3MDI2MzIsImV4cCI6MjAyNjI3ODYzMn0.n9ZGpftf6XJc9EK-hWUXILtzrD7R0vMqjtgWZKMkqW4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();

//Get Data from API, Flight details. Check Flightdata.js
async function getData() {
  // const filteredFlights = data.itineraries.sort((a,b)=> {
  //   if(a.legs[0].stopCount < b.legs[0].stopCount) return -1
  // else if(a.legs[0].stopCount > b.legs[0].stopCount) return 1
  // else return 0
  // })
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} h ${minutes} min`;
  }

  try {
    const data = await getFlightData();
    const flights = data;
    const allFlights = flights.map((flight) => ({
      originName: flight.legs[0].origin.id,
      destinationName: flight.legs[0].destination.id,
      originCity: flight.legs[0].origin.city,
      destinationCity: flight.legs[0].destination.city,
      airline: flight.legs[0].carriers.marketing[0].name,
      stopCount: flight.legs[0].stopCount,
      price: Math.round(flight.price.raw),
      duration: toHoursAndMinutes(flight.legs[0].durationInMinutes),
      departureTime: flight.legs[0].departure.split("T")[0],
      departureHour: flight.legs[0].departure.split("T")[1],
      returnFlight: flight.legs[1].departure.split("T")[0],
    }));
    //Upload data to DataBase
    allFlights.forEach(async (flight) => {
      await supabase.from("flights").insert(flight).select();
    });

    return allFlights;
  } catch (error) {
    console.log(error);
  }
}
async function cronJobOne() {
  const data1 = await getData();
  if (data1.length > 0) {
    setTimeout(() => {
      Screenshot();
      setTimeout(() => {
        postOnInsta(data1);
        setTimeout(() => {
          deleteAll(supabase);
        }, 10000);
      }, 5000);
    }, 8000);
  }
  // 1. Fetch Data 2. Wait 2 minutes for DB to update 3. visit front end webpage 4. screenshot
}

app.get("/", (req, res) => {
  cronJobOne();
  res.send("Cron Job one");
});

app.listen(3000, () => console.log("Server Ready on Port 3000"));
