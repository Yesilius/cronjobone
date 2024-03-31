import Instagram from "instagram-web-api";
import emojiFlags from "emoji-flags";

const username = "cheapflightsarmenia"
const password = "Amazon03!!" 
const photo = "./images/screenshot-1.jpg"



export default async function postOnInsta(data){
    const dataText = data.map(flight => `💵 ${flight.price} euro, travel from ${flight.originCity} to ${flight.destinationCity} ${emojiFlags.countryCode('AM').emoji}`)
    const text = ` Check out our deals!
    ${dataText[0]},
    ${dataText[1]},
    ${dataText[2]},

    Contact us for more info!
    `
    console.log(text)
    const client = new Instagram({username ,password })

        await client.login().catch(e => console.log(e.message))
        await client.uploadPhoto({ photo: photo, caption: `${text}`, post: 'feed' }).catch(e => console.log(e.message))
        console.log("Succesfully uploaded to Insta")

}


