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

const AL_TEAMS = new Set([
    "LAA",
    "BAL",
    "BOS",
    "CWS",
    "CLE",
    "DET",
    "HOU",
    "KC",
    "MIN",
    "NYY",
    "ATH",
    "SEA",
    "TB",
    "TEX",
    "TOR"
]);

function getLeague(team) {

    const code = getTeamCode(team);

    return AL_TEAMS.has(code)
        ? "American League"
        : "National League";

}


function getTeamCode(team) {
    return TEAM_ABBR[team.id] || team.name;
}


function sortGames(a, b) {

    const aHome = getTeamCode(a.teams.home.team);
    const bHome = getTeamCode(b.teams.home.team);

    // Red Sox always first
    if (aHome === "BOS") return -1;
    if (bHome === "BOS") return 1;

    // Then alphabetical by home team
    return aHome.localeCompare(bHome);

}


function createGame(game) {

    const away = game.teams.away;
    const home = game.teams.home;

    const card = document.createElement("div");
    card.className = "game";


    const awayRow = document.createElement("div");
    awayRow.className = "team-row";


    const awayTeam = document.createElement("span");
    awayTeam.className = "team";
    awayTeam.textContent = getTeamCode(away.team);


    const awayScore = document.createElement("span");
    awayScore.className = "score";
    awayScore.textContent = away.score;


    awayRow.appendChild(awayTeam);
    awayRow.appendChild(awayScore);



    const homeRow = document.createElement("div");
    homeRow.className = "team-row";


    const homeTeam = document.createElement("span");
    homeTeam.className = "team";
    homeTeam.textContent = getTeamCode(home.team);


    const homeScore = document.createElement("span");
    homeScore.className = "score";
    homeScore.textContent = home.score;


    homeRow.appendChild(homeTeam);
    homeRow.appendChild(homeScore);



    card.appendChild(awayRow);
    card.appendChild(homeRow);


    return card;

}


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


        const games = data.dates[0].games
            .filter(game => game.status.abstractGameState === "Final");



        const americanLeague = games
            .filter(game =>
                getLeague(game.teams.home.team) === "American League"
                   )
            .sort(sortGames);
        
        const nationalLeague = games
            .filter(game =>
                getLeague(game.teams.home.team) === "National League"
                   )
            .sort(sortGames);


        const alColumn = document.createElement("section");
        alColumn.className = "league-column";


        const nlColumn = document.createElement("section");
        nlColumn.className = "league-column";



        const alHeader = document.createElement("div");
        alHeader.className = "league-header";
        alHeader.textContent = "AMERICAN LEAGUE";


        const nlHeader = document.createElement("div");
        nlHeader.className = "league-header";
        nlHeader.textContent = "NATIONAL LEAGUE";



        alColumn.appendChild(alHeader);
        nlColumn.appendChild(nlHeader);



        americanLeague.forEach(game => {
            alColumn.appendChild(createGame(game));
        });


        nationalLeague.forEach(game => {
            nlColumn.appendChild(createGame(game));
        });



        gamesContainer.appendChild(alColumn);
        gamesContainer.appendChild(nlColumn);



    } catch (err) {

        console.error(err);

        gamesContainer.innerHTML = "Unable to load scores.";

    }

}


loadScores();
