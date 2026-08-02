// Fenway Scoreboard - Version 1
// Displays yesterday's MLB final scores

async function loadScores() {
    const americanLeague = document.getElementById("american-league");
    const nationalLeague = document.getElementById("national-league");

    // Clear any existing content
    americanLeague.innerHTML = "";
    nationalLeague.innerHTML = "";

    // Yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split("T")[0];

    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.dates || data.dates.length === 0) {
            americanLeague.innerHTML =
                "<div class='game'>No games found.</div>";
            return;
        }

        const games = data.dates[0].games;

        games.forEach(game => {

            if (game.status.abstractGameState !== "Final") {
                return;
            }

            const away = game.teams.away;
            const home = game.teams.home;

            const gameHtml = `
                <div class="game">
                    ${away.team.abbreviation} ${away.score}
                    &nbsp;&nbsp;&nbsp;
                    ${home.team.abbreviation} ${home.score}
                    &nbsp;&nbsp;FINAL
                </div>
            `;

            // For now, place everything in the left column.
            // We'll split AL/NL in Version 2.
            americanLeague.innerHTML += gameHtml;
        });

    } catch (err) {
        console.error(err);

        americanLeague.innerHTML = `
            <div class="game">
                Unable to load MLB scores.
            </div>
        `;
    }
}

loadScores();                game.teams.home.team.league.id === 103
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
