const MA_SEARCH_URL = 'http://gateway.marvel.com/v1/public/comics';
const PUB_KEY = '96eb11bd21c89376fbefd1db3d1b6489';
const PRI_KEY = '0caa27947b8af50e01a86a966c450f56';
const page = {
  searchTerm: null,
}

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: MA_SEARCH_URL,
    data: {
      dateRange: '1991-11-01,1991-12-01',//`${searchTerm}`,
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

const hash = "cd9829a74ad284c9136f148ee66289df"
const CORS = "https://cors-anywhere.herokuapp.com/"

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
    },
    type: 'GET',
    success: callback
  };

  $.ajax(ebaySettings);
}

var ebayTitle = {};
var errTitles = [];
var comicNames = {}
function renderResult(listed) {
  var randNum = Math.floor(Math.random() * 1000);
  ebayTitle.sea = listed.title;
  console.log(ebayTitle);
  ebayTitle.sea = ebayTitle.sea.replace(/\s/g, '').slice(0, -10) + randNum;
  ebayTitle.div = "div" + ebayTitle.sea;
  ebayTitle.hee = "h2" + ebayTitle.sea;
  comicNames[ebayTitle.sea] = listed.title;
  errTitles.push(ebayTitle.sea);
  console.log(ebayTitle.sea);
  return `
    <div>
    <h2 id=${ebayTitle.hee}>
    <a class="js-result-name" href="${listed.urls[0].url}" target="_blank"><span>${listed.title}</span><br>
    <img src="${listed.thumbnail.path}/portrait_uncanny.jpg"></a></h2>
    </div>
    <button id="${ebayTitle.sea}" class="js-ebay-search">Find Items on Ebay</button>
    <div id=${ebayTitle.div} class="js-ebay-results"></div>
`;
}

function renderEbayResult(ebdata) {
  console.log(ebdata);
  return `
  <p>HOLDER:${ebdata}</p>
  `;
}

function showSearchTerm(query) {
  return `
  <div class="js-search-display" aria-live="assertive">
  <p class="channel-source">You searched for "${page.searchTerm}"</p>
  </div>
  `;
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const autoCompleteStart = $('.date1').val();
    console.log(autoCompleteStart)
    const autoCompleteEnd = $('.date2').val();
    console.log(autoCompleteEnd)
    const query = autoCompleteStart + "," + autoCompleteEnd;
    // const queryTarget = $(event.currentTarget).find('.js-query');
    // const query = queryTarget.val();
    // clear out the input
    page.searchTerm = query;
    console.log(page.searchTerm);
    // queryTarget.val("");
    $('.js-search-display').html(showSearchTerm);
    getDataFromApi(query, marvelParser);
  });
}

function displayMarvelSearchData(data) {
  const characterDisplay = data.data.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(characterDisplay);
}


function displayMarvelTitle(data, renderResult) {
  console.log(data);
  console.log(errTitles);
  $('button').on('click', event => {
    let marvTitle = comicNames[event.currentTarget.id];
    event.preventDefault();
    console.log("what up");
    console.log(event.currentTarget.id);
    trouble = event.currentTarget.id
    console.log(marvTitle);
    getEbayDataFromApi(marvTitle, displayEbaySearchData);
  })
}



function marvelParser(data) {
  displayMarvelSearchData(data)
  displayMarvelTitle(data)
}

function displayEbaySearchData(data, target) {
  console.log("I EXIST");
  console.log(trouble);
  data = JSON.parse(data);
  data = data.findItemsAdvancedResponse[0].searchResult[0];
  let listingDisplay = data.item[0].title.map((item, index) => renderEbayResult(item));
  console.log("hi" + listingDisplay);
  $('#' + 'div' + trouble).html(listingDisplay.join());
}



$(watchSubmit);
