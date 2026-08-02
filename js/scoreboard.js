// Fenway Scoreboard
// Pulls yesterday's MLB final scores

async function loadScores() {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const date = yesterday.toISOString().split("T")[0];

    const url =
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=linescore`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error("Unable to load MLB scores:", error);
    }
}

loadScores();
