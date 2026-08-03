async function loadRedSoxGame() {

    const container = document.getElementById("featured-game");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const apiDate = yesterday.toISOString().split("T")[0];


    try {

        // Find Red Sox game
        const scheduleResponse = await fetch(
            `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${apiDate}`
        );

        const scheduleData = await scheduleResponse.json();


        if (!scheduleData.dates.length) {
            container.innerHTML = "NO RED SOX GAME";
            return;
        }


        const games = scheduleData.dates[0].games;


        const redSoxGame = games.find(game =>
            game.teams.home.team.id === 111 ||
            game.teams.away.team.id === 111
        );


        if (!redSoxGame) {
            container.innerHTML = "NO RED SOX GAME";
            return;
        }



        // Get live feed
        const feedResponse = await fetch(
            `https://statsapi.mlb.com/api/v1.1/game/${redSoxGame.gamePk}/feed/live`
        );


        const feed = await feedResponse.json();


        const linescore = feed.liveData.linescore;

        const awayTeam = feed.gameData.teams.away;
        const homeTeam = feed.gameData.teams.home;



        function teamCode(team) {
            return TEAM_ABBR[team.id] || team.name;
        }



        function renderInnings(teamSide) {

            return linescore.innings.map(inning => {

                return `
                    <span>
                        ${inning[teamSide]?.runs ?? "-"}
                    </span>
                `;

            }).join("");

        }



        let decisions = "";


        if (feed.liveData.decisions) {

            const d = feed.liveData.decisions;


            decisions = `

                <div class="decisions">

                    ${d.winner
                        ? `WP: ${d.winner.fullName}`
                        : ""}

                    ${d.loser
                        ? `&nbsp;&nbsp;&nbsp;LP: ${d.loser.fullName}`
                        : ""}

                    ${d.save
                        ? `&nbsp;&nbsp;&nbsp;SV: ${d.save.fullName}`
                        : ""}

                </div>

            `;

        }



        container.innerHTML = `


            <div class="featured-header">
                RED SOX GAME
            </div>


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

                    <span>${teamCode(awayTeam)}</span>

                    ${renderInnings("away")}

                    <span>${linescore.teams.away.runs}</span>
                    <span>${linescore.teams.away.hits}</span>
                    <span>${linescore.teams.away.errors}</span>

                </div>



                <div class="inning-row">

                    <span>${teamCode(homeTeam)}</span>

                    ${renderInnings("home")}

                    <span>${linescore.teams.home.runs}</span>
                    <span>${linescore.teams.home.hits}</span>
                    <span>${linescore.teams.home.errors}</span>

                </div>


            </div>


            ${decisions}


        `;


    } catch (err) {

        console.error(err);

        container.innerHTML = "Unable to load Red Sox game.";

    }

}



loadRedSoxGame();
