document.documentElement.className = 'no-fouc';

const MA_SEARCH_URL = 'https://gateway.marvel.com/v1/public/comics';
const PUB_KEY = '96eb11bd21c89376fbefd1db3d1b6489';
const PRI_KEY = '0caa27947b8af50e01a86a966c450f56';
const page = {
  searchTerm: null,
}

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: MA_SEARCH_URL,
    data: {
      dateRange: `${searchTerm}`,
      ts: 1,
      apikey: PUB_KEY,
      hash: PRI_KEY,
      limit: 100,
    },
    type: 'GET',
    format: 'json',
    success: callback
  };

  $.ajax(settings);
}

const EBAY_SEARCH_URL = "https://svcs.ebay.com/services/search/FindingService/v1";
const EBAY_PUB_KEY = 'CharlesV-ComicBoo-PRD-a8bab2703-2c921265';

// const CORS = "https://cors-anywhere.herokuapp.com/"

const CORS = "https://x-men-origins.herokuapp.com/cors/"


function getEbayDataFromApi(title, callback) {
  const ebaySettings = {
    url: CORS + EBAY_SEARCH_URL,
    data: {
      'OPERATION-NAME': 'findItemsAdvanced',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': EBAY_PUB_KEY,
      'GLOBAL-ID': 'EBAY-US',
      'RESPONSE-DATA-FORMAT': `JSON`,
      keywords: title,
      categoryId: 63,
      'paginationInput.entriesPerPage': 2,
      'outputSelector': 'PictureURLSuperSize',

    },
    type: 'GET',
    success: callback,
    error: function (){
      alert("sorry!");
    }
  };

  $.ajax(ebaySettings);
}

var ebayTitle = {};
var comicNames = {};

function renderResult(listed) {
  var randNum = Math.floor(Math.random() * 1000);
  ebayTitle.sea = listed.title;
  ebayTitle.sea = ebayTitle.sea.replace(/[{(.:/,\s)}]/g, '').slice(0, -11) + randNum;
  ebayTitle.div = "div" + ebayTitle.sea;
  ebayTitle.hee = "h2" + ebayTitle.sea;
  comicNames[ebayTitle.sea] = listed.title;
  return `
    <div class="col-4">
      <div class="listing-image"><a href="${listed.urls[0].url}" target="_blank"><img src="${listed.thumbnail.path}/portrait_uncanny.jpg"></a></div>
      <div class="listing-title"><h2 class="listing title" id=${ebayTitle.hee}>
        <a href="${listed.urls[0].url}" target="_blank">${listed.title}</a></h2>
      </div>
      <div class="eb-button">
    <button id="${ebayTitle.sea}" class="js-ebay-search" href=#${ebayTitle.div} data-lity>Find Items on Ebay</button></div>
      <div id=${ebayTitle.div} class="js-ebay-results lity-hide">
      <div class="eb-error hidden"><p>SORRY NO RESULTS</p></div>
      </div>
    </div>
`;
}

function renderEbayResult(ebdata) {
  return `
  <div class="eb-light">
    <a href="${ebdata.viewItemURL[0]}" class="eb-results" target="_blank">
    <img class="eb-pic" src="${ebdata.pictureURLSuperSize[0]}">
    <p class="eb-title">${ebdata.title}</p></a>
  </div>
  `;
}
//
// function showSearchTerm(query) {
//   return `
//   <div class="js-search-display" aria-live="assertive">
//   <p class="channel-source">You searched for "${page.searchTerm}"</p>
//   </div>
//   `;
// }


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const autoCompleteStart = $('.date1').val();
    console.log(autoCompleteStart)
    const autoCompleteEnd = $('.date2').val();
    console.log(autoCompleteEnd)
    const query = autoCompleteStart + "," + autoCompleteEnd;
    page.searchTerm = query;
    console.log(page.searchTerm);
    // $('.js-search-display').html(showSearchTerm);
    $('.js-search-results').empty();
    getDataFromApi(query, marvelParser);
  });
}

function displayMarvelSearchData(data) {
  const characterDisplay = data.data.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(characterDisplay);
}


function displayMarvelTitle(data, renderResult) {
  $('.eb-button').find('button').on('click', event => {
    let marvTitle = comicNames[event.currentTarget.id];
    trouble = event.currentTarget.id
    getEbayDataFromApi(marvTitle, displayEbaySearchData);
  });
}

function marvelParser(data) {
  displayMarvelSearchData(data);
  displayMarvelTitle(data);
}

function displayEbaySearchData(data, target) {
  console.log("I EXIST");
  data = JSON.parse(data);
  data = data.findItemsAdvancedResponse[0].searchResult[0];
  let listingDisplay = data.item.map((item, index) => renderEbayResult(item));
  // data.item ? $('.eb-error').addClass('hidden') : $('.eb-error').removeClass('hidden');
  // if (listingDisplay.length < 1){
  //   alert ("shit")
  // } else {$('#' + 'div' + trouble).html(listingDisplay.join());};
  $('#' + 'div' + trouble).html(listingDisplay.join());

}

$(document).ready(function(){
    $(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
    $('#submit').click(function(){
        $("#txt").load("demo_ajax_load.asp");
    });
});



$(watchSubmit);
