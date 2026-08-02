async function loadScores() {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split("T")[0];

    const url =
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        const games = data.dates[0]?.games || [];

        games.forEach(game => {

            if (game.status.abstractGameState !== "Final") {
                return;
            }

            const away = game.teams.away;
            const home = game.teams.home;

            const awayCode = away.team.abbreviation;
            const homeCode = home.team.abbreviation;

            const awayScore = away.score;
            const homeScore = home.score;

            const league =
                game.teams.home.team.league.id === 103
                ? "american-league"
                : "national-league";

            const winner =
                homeScore > awayScore
                ? `${homeCode} ${homeScore} - ${awayCode} ${awayScore}`
                : `${awayCode} ${awayScore} - ${homeCode} ${homeScore}`;

            document.getElementById(league).innerHTML += `
                <div class="game">
                    ${awayCode}
                    ${awayScore}
                    -
                    ${homeCode}
                    ${homeScore}
                    FINAL
                </div>
            `;

        });

    } catch(error) {

        console.error(
            "Unable to load MLB scores:",
            error
        );

    }
}


loadScores();
