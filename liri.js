require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var userRequest = process.argv[2];
var userInput = process.argv[3];

var spotify = new Spotify(keys.spotify);

switch (userRequest) {
  case "concert-this":
    concertThis(userInput);
    break;
  case "spotify-this-song":
    spotifyThis(userInput);
    break;
  case "movie-this":
    movieThis(userInput);
    break;
  default:
    console.log("please enter valid command");
    break;
}

function concertThis(artist) {
  const queryUrl = `https://rest.bandsintown.com/artists/${encodeURI(
    artist
  )}/events?app_id=codingbootcamp`;
  axios
    .get(queryUrl)
    .then(function(response) {
      const concerts = response.data.map(concert => ({
        venue: concert.venue.name,
        city: concert.venue.city,
        country: concert.venue.country,
        date: moment(concert.datetime).format("MM/DD/YYYY")
      }));

      console.table(concerts);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function spotifyThis(track) {
  spotify
    .search({ type: "track", query: track })
    .then(function(response) {
      const results = response.tracks.items;
      const detail = results.map(result => ({
        artist: result.artists.map(artist => artist.name).join(", "),
        songName: result.name,
        previewUrl: result.preview_url,
        albumName: result.album.name
      }));
      console.log(detail);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function movieThis(name) {
  var queryUrl = `http://www.omdbapi.com/?t=${encodeURI(
    name
  )}&y=&plot=short&apikey=trilogy`;

  axios.get(queryUrl).then(function(response) {
    const result = response.data;
    if (result.Response === "False") {
      console.log(result.Error);
    } else {
      const movie = {
        title: result.Title,
        release: result.Year,
        imdb: result.imdbRating,
        tomato: result.Ratings.reduce(
          (tomato, r) => (r.Source === "Rotten Tomatoes" && r.Value) || tomato,
          "N/A"
        ),
        origin: result.Country,
        language: result.Language,
        plot: result.Plot,
        actors: result.Actors
      };

      console.log(movie);
    }
  });
}
