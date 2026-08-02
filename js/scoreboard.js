async function loadScores() {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split("T")[0];

    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;

    const response = await fetch(url);
    const data = await response.json();

//    console.log(data);
    console.log(data.dates[0].games[0].teams.away.team);
    console.log(data.dates[0].games[0].teams.home.team);

}

loadScores();
