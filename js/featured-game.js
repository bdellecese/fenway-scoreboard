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



        // Load detailed feed
        const feedResponse = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${featuredGame.gamePk}/feed/live`
        );


        const feed = await feedResponse.json();


        const linescore = feed.liveData.linescore;


        const awayTeam = feed.gameData.teams.away;
        const homeTeam = feed.gameData.teams.home;



        const awayCode =
            TEAM_ABBR[awayTeam.id] || awayTeam.abbreviation;


        const homeCode =
            TEAM_ABBR[homeTeam.id] || homeTeam.abbreviation;



        function renderInnings(side) {

            return linescore.innings.map(inning => {

                return `
                    <span>
                        ${inning[side]?.runs ?? "-"}
                    </span>
                `;

            }).join("");

        }



        function renderTotals(side) {

            return `
                <span>${linescore.teams[side].runs}</span>
                <span>${linescore.teams[side].hits}</span>
                <span>${linescore.teams[side].errors}</span>
            `;

        }



        function getPitcherRecord(playerId) {

            const teams =
                feed.liveData.boxscore.teams;


            for (const side of ["away", "home"]) {

                const players = teams[side].players;


                const player =
                    players[`ID${playerId}`];


                if (player?.stats?.pitching) {

                    const pitching =
                        player.stats.pitching;


                    return `${pitching.wins}-${pitching.losses}`;

                }

            }


            return "";

        }



        let pitchingLine = "";


        const decisions =
            feed.liveData.decisions;


        if (decisions) {

            const lines = [];


            if (decisions.winner) {

                const record =
                    getPitcherRecord(decisions.winner.id);

                lines.push(
                    `WP ${decisions.winner.fullName}${record ? ` (${record})` : ""}`
                );

            }


            if (decisions.loser) {

                const record =
                    getPitcherRecord(decisions.loser.id);

                lines.push(
                    `LP ${decisions.loser.fullName}${record ? ` (${record})` : ""}`
                );

            }


            if (decisions.save) {

                const record =
                    getPitcherRecord(decisions.save.id);

                lines.push(
                    `SV ${decisions.save.fullName}${record ? ` (${record})` : ""}`
                );

            }


            pitchingLine = lines.join("&nbsp;&nbsp;&nbsp;");

        }



        container.innerHTML = `


            <div class="box-score">


                <div class="inning-header">

                    <span></span>

                    ${linescore.innings.map(inning =>
                        `<span>${inning.num}</span>`
                    ).join("")}

                    <span>R</span>
                    <span>H</span>
                    <span>E</span>

                </div>



                <div class="inning-row">

                    <span class="team">
                        ${awayCode}
                    </span>

                    ${renderInnings("away")}

                    ${renderTotals("away")}

                </div>



                <div class="inning-row">

                    <span class="team">
                        ${homeCode}
                    </span>

                    ${renderInnings("home")}

                    ${renderTotals("home")}

                </div>


            </div>


            <div class="decisions">

                ${pitchingLine}

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



loadFeaturedGame(
    SCOREBOARD_CONFIG.featuredGames.left,
    "featured-left"
);


loadFeaturedGame(
    SCOREBOARD_CONFIG.featuredGames.right,
    "featured-right"
);
