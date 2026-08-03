async function loadRedSoxGame() {

    console.log("Looking for Red Sox game...");


    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);


    const apiDate = yesterday.toISOString().split("T")[0];


    try {

        const scheduleResponse = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${apiDate}`
        );


        const scheduleData = await scheduleResponse.json();


        const games = scheduleData.dates[0].games;


        const redSoxGame = games.find(game =>
            game.teams.home.team.id === 111 ||
            game.teams.away.team.id === 111
        );


        if (!redSoxGame) {

            console.log("No Red Sox game.");
            return;

        }


        console.log("Red Sox game found:", redSoxGame.gamePk);



        const feedResponse = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${redSoxGame.gamePk}/feed/live`
        );


        const feed = await feedResponse.json();


        console.log("LIVE FEED:");
        console.log(feed);


        console.log("LINESCORE:");
        console.log(feed.liveData.linescore);


        console.log("DECISIONS:");
        console.log(feed.liveData.decisions);



    } catch (err) {

        console.error(
            "Unable to load Red Sox game:",
            err
        );

    }

}


loadRedSoxGame();
