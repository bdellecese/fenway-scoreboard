async function loadScores(){
const el=document.getElementById("games");
el.innerHTML="Loading...";
const d=new Date(); d.setDate(d.getDate()-1);
const date=d.toISOString().split("T")[0];
try{
 const r=await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`);
 const data=await r.json();
 el.innerHTML="";
 const games=(data.dates&&data.dates[0])?data.dates[0].games:[];
 games.filter(g=>g.status.abstractGameState==="Final").forEach(g=>{
   const div=document.createElement("div");
   div.className="game";
   div.textContent=`${g.teams.away.team.abbreviation} ${g.teams.away.score}   ${g.teams.home.team.abbreviation} ${g.teams.home.score}   FINAL`;
   el.appendChild(div);
 });
 if(!games.length) el.textContent="No games found.";
}catch(e){
 console.error(e);
 el.textContent="Error loading scores.";
}
}
loadScores();
