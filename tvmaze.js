let shows = []
let episodes = []
async function searchShows(query) {
  const res = await axios.get(`https://api.tvmaze.com/singlesearch/shows?q=${query}`)
  const data = res.data;
  let name = data.name
  let id = data.id
  let summary = data.summary
  let image = data.image.original
  const show = {name, id, summary, image}
  shows.push(show)
  return shows
}



function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img src="${show.image}" height="300px" width="100%">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  let shows = await searchShows(query);

  populateShows(shows);
  $('#search-query').val('');
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
//pulls episodes from api based on showId from following func
async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  const data = res.data;
  for (i = 0; i < data.length; i++) {
    let id = data[i].id;
    let name = data[i].name;
    let season = data[i].season;
    let number = data[i].number;
    episodes.push({id, name, season, number});
    $('#episodes-list').append(`<li>${id} ${name} - season: ${season} number: ${number}</li>`);
  }
}


$('#episodeButton').click(function () {
	
});

//pulls showId from clicked show for episode list acquisition
$('#shows-list').on('click', function(e){
  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();
    const parent = e.target.parentNode.parentNode;
    const showId = parent.dataset.showId;
    getEpisodes(showId)
    
  }
})

//removes shows from display and clears shows array
$('#delete').on('click',function(e){
  e.preventDefault();
  const selectedShows = document.querySelectorAll('.show');
  for (items of selectedShows) {
    $('.show').remove();
  }
  shows = [];
})