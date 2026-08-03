async function loadFeaturedGame(teamId, containerId) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Missing container: ${containerId}`);
        return;
    }


    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const apiDate = yesterday.toISOString().split("T")[0];


    try {

        // Find the team's game
        const scheduleResponse = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${apiDate}`
        );


        const scheduleData = await scheduleResponse.json();


        if (!scheduleData.dates.length) {

            container.innerHTML = "NO GAME";
            return;

        }


        const games = scheduleData.dates[0].games;


        const featuredGame = games.find(game =>
            game.teams.home.team.id === teamId ||
            game.teams.away.team.id === teamId
        );


        if (!featuredGame) {

            container.innerHTML = "NO GAME";
            return;

        }


        console.log(
            "Featured game loaded:",
            teamId,
            featuredGame.gamePk
        );


        // Get detailed game feed
        const feedResponse = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${featuredGame.gamePk}/feed/live`
        );


        const feed = await feedResponse.json();


        const awayTeam = feed.gameData.teams.away;
        const homeTeam = feed.gameData.teams.home;

        const linescore = feed.liveData.linescore;



        const awayCode =
            TEAM_ABBR[awayTeam.id] || awayTeam.name;

        const homeCode =
            TEAM_ABBR[homeTeam.id] || homeTeam.name;



        container.innerHTML = `

            <div class="featured-placeholder">

                <div>
                    ${awayCode}
                    ${linescore.teams.away.runs}
                </div>

                <div>
                    ${homeCode}
                    ${linescore.teams.home.runs}
                </div>

            </div>

        `;


    } catch (err) {

        console.error(
            "Unable to load featured game:",
            err
        );

        container.innerHTML = "ERROR";

    }

}


// Load configured featured games

loadFeaturedGame(
    SCOREBOARD_CONFIG.featuredGames.left,
    "featured-left"
);


loadFeaturedGame(
    SCOREBOARD_CONFIG.featuredGames.right,
    "featured-right"
);
