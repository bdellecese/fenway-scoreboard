const TEAM_ABBR = {
    108: "LAA",
    109: "ARI",
    110: "BAL",
    111: "BOS",
    112: "CHC",
    113: "CIN",
    114: "CLE",
    115: "COL",
    116: "DET",
    117: "HOU",
    118: "KC",
    119: "LAD",
    120: "WSH",
    121: "NYM",
    133: "ATH",
    134: "PIT",
    135: "SD",
    136: "SEA",
    137: "SF",
    138: "STL",
    139: "TB",
    140: "TEX",
    141: "TOR",
    142: "MIN",
    143: "PHI",
    144: "ATL",
    145: "CWS",
    146: "MIA",
    147: "NYY",
    158: "MIL"
};

async function loadScores() {

    const gamesContainer = document.getElementById("games");
    const dateElement = document.getElementById("score-date");

    gamesContainer.innerHTML = "Loading...";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const apiDate = yesterday.toISOString().split("T")[0];

    dateElement.textContent = yesterday.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    }).toUpperCase();

    try {

        const response = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${apiDate}`
        );

        const data = await response.json();

        gamesContainer.innerHTML = "";

        if (!data.dates.length) {
            gamesContainer.innerHTML = "<p>No games found.</p>";
            return;
        }

        const games = data.dates[0].games;

        games
            .filter(game => game.status.abstractGameState === "Final")
            .forEach(game => {

                const away = game.teams.away;
                const home = game.teams.home;

                const awayCode = TEAM_ABBR[away.team.id] || away.team.name;
                const homeCode = TEAM_ABBR[home.team.id] || home.team.name;

                const card = document.createElement("div");
                card.className = "game";

                const awayRow = document.createElement("div");
                awayRow.className = "team-row";

                const awayTeam = document.createElement("span");
                awayTeam.className = "team";
                awayTeam.textContent = awayCode;

                if (awayCode === "BOS") {
                    awayTeam.classList.add("redsox");
                }

                const awayScore = document.createElement("span");
                awayScore.className = "score";
                awayScore.textContent = away.score;

                awayRow.appendChild(awayTeam);
                awayRow.appendChild(awayScore);

                const homeRow = document.createElement("div");
                homeRow.className = "team-row";

                const homeTeam = document.createElement("span");
                homeTeam.className = "team";
                homeTeam.textContent = homeCode;

                if (homeCode === "BOS") {
                    homeTeam.classList.add("redsox");
                }

                const homeScore = document.createElement("span");
                homeScore.className = "score";
                homeScore.textContent = home.score;

                homeRow.appendChild(homeTeam);
                homeRow.appendChild(homeScore);

                card.appendChild(awayRow);
                card.appendChild(homeRow);

                gamesContainer.appendChild(card);

            });

    } catch (err) {

        console.error(err);

        gamesContainer.innerHTML = "Unable to load scores.";
    }

}

loadScores();
