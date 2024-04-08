import Instagram from "instagram-web-api";
import emojiFlags from "emoji-flags";

const username = "cheapflightsarmenia";
const password = "Amazon03!!!";
const photo =
  "https://szybwngkjvxwgrclfinc.supabase.co/storage/v1/object/sign/images-flight/flights12?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMtZmxpZ2h0L2ZsaWdodHMxMiIsImlhdCI6MTcxMjUxOTk5OSwiZXhwIjoxNzQ0MDU1OTk5fQ.pcpDqn-ugSJ4Z89-pOmP40UPECuk59KYBpFwitZ-PnU&t=2024-04-07T19%3A59%3A59.349Z";

export default async function postOnInsta(data) {
  const dataText = data.map(
    (flight) =>
      `💵 ${flight.price} euro, travel from ${flight.originCity} to ${
        flight.destinationCity
      } ${emojiFlags.countryCode("AM").emoji}`
  );
  const text = ` Check out our deals!
    ${dataText[0]},
    ${dataText[1]},
    ${dataText[2]},

    Contact us for more info!
    `;

  const client = new Instagram({ username, password });

  await client.login().catch((e) => console.log(e.message));
  await client
    .uploadPhoto({ photo: photo, caption: `${text}`, post: "feed" })
    .catch((e) => console.log(e.message));
  console.log("Succesfully uploaded to Insta");
}
