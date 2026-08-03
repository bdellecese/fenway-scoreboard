async function loadRedSoxGame() {

    console.log("Looking for Red Sox game...");


    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);


    const apiDate = yesterday.toISOString().split("T")[0];


    try {

        const response = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${apiDate}`
        );


        const data = await response.json();


        if (!data.dates.length) {

            console.log("No games found.");
            return;

        }


        const games = data.dates[0].games;


        const redSoxGame = games.find(game =>
            game.teams.home.team.id === 111 ||
            game.teams.away.team.id === 111
        );


        if (!redSoxGame) {

            console.log("No Red Sox game yesterday.");
            return;

        }


        console.log("Red Sox game found:");
        console.log(redSoxGame);


        console.log("Game PK:");
        console.log(redSoxGame.gamePk);


    } catch (err) {

        console.error(
            "Unable to load Red Sox game:",
            err
        );

    }

}


loadRedSoxGame();
