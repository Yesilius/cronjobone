async function priceCalendar(){


    const urlBE = 'https://skyscanner80.p.rapidapi.com/api/v1/flights/price-calendar?fromId=eyJzIjoiQlJVUyIsImUiOiIyNzUzOTU2NSIsImgiOiIyNzUzOTU2NSJ9&toId=eyJzIjoiRVZOIiwiZSI6Ijk1NjczNTE4IiwiaCI6IjI3NTQwOTY4In0%3D&departDate=2024-06-01&returnDate=2024-06-30&currency=EUR';
    const urlAM = "https://skyscanner80.p.rapidapi.com/api/v1/flights/price-calendar?fromId=eyJzIjoiRVZOIiwiZSI6Ijk1NjczNTE4IiwiaCI6IjI3NTQwOTY4In0%3D&toId=eyJzIjoiQlJVUyIsImUiOiIyNzUzOTU2NSIsImgiOiIyNzUzOTU2NSJ9&departDate=2024-06-01&returnDate=2024-06-30&currency=EUR"
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd13c083917msh183590d428ab4e6p12339djsn0fe2fb7762a4',
            'X-RapidAPI-Host': 'skyscanner80.p.rapidapi.com'
                     }
                 };

try {
	const fromBE = await fetch(urlBE, options).then(res => res.json());
    const toArm = await fetch(urlAM, options).then(res => res.json());;
    const [flyTo, flyBack]  = await Promise.all([fromBE, toArm]).then(responseArray => responseArray).catch(error => console.log(error))

    const dateFlyTo = flyTo.data.flights.days[0].day
    const dateReturn = flyBack.data.flights.days[0].day
    return {dateFlyTo, dateReturn}
} catch (error) {
	console.error(error);
}
}

priceCalendar()