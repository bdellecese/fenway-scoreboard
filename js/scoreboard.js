const TEAM_ABBR = {
    108:"LAA",109:"ARI",110:"BAL",111:"BOS",112:"CHC",113:"CIN",
    114:"CLE",115:"COL",116:"DET",117:"HOU",118:"KC",119:"LAD",
    120:"WSH",121:"NYM",133:"ATH",134:"PIT",135:"SD",136:"SEA",
    137:"SF",138:"STL",139:"TB",140:"TEX",141:"TOR",142:"MIN",
    143:"PHI",144:"ATL",145:"CWS",146:"MIA",147:"NYY",158:"MIL"
};

async function loadScores() {

    const container = document.getElementById("games");
    container.innerHTML = "Loading yesterday's games...";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split("T")[0];

    try {

        const response = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`
        );

        const data = await response.json();

        container.innerHTML = "";

        if (!data.dates.length) {
            container.innerHTML = "<div class='game'>No games found.</div>";
            return;
        }

        data.dates[0].games.forEach(game => {

            if (game.status.abstractGameState !== "Final") return;

            const away = game.teams.away;
            const home = game.teams.home;

            const awayCode = TEAM_ABBR[away.team.id] || away.team.name;
            const homeCode = TEAM_ABBR[home.team.id] || home.team.name;

            const div = document.createElement("div");
            div.className = "game";

            div.innerHTML =
                `${awayCode} ${away.score} &nbsp;&nbsp;&nbsp; ` +
                `${homeCode} ${home.score} &nbsp;&nbsp; FINAL`;

            if (awayCode === "BOS" || homeCode === "BOS") {
                div.style.fontWeight = "bold";
                div.style.color = "#FFD700";
            }

            container.appendChild(div);

        });

    } catch (err) {

        console.error(err);

        container.innerHTML = "<div class='game'>Error loading scores.</div>";
    }

}

loadScores();
