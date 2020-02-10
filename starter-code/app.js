require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

// HBS SETUP
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// MIDDLEWARE
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
  console.log("__dirname ", __dirname);
  next();
});

// Our routes go here:
// ROUTES
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  const artist = req.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then(response => {
      // console.log(
      //   "The received data from the API: ",
      //   response.body.artists.items
      // );

      const data = {
        artists: response.body.artists.items,
        title: "IRONHACK LAB"
      };

      res.render("artist-search-results", data);
    })
    .catch(err =>
      console.log("The error while searching artists occurred: ", err)
    );
});

//       /albums/4QvI3PrYRXq9A2UbeQAKH6

app.get("/albums/:artistId", (req, res, next) => {
  //  req.params.artistId;

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(response => {
      // console.log(response.body.items);

      const data = {
        albums: response.body.items
      };

      res.render("albums", data);
    })
    .catch(err => {});
});

//
//
//       /tracks/4QvI3PrYRXq9A2UbeQAKH6

app.get("/tracks/:albumId", (req, res, next) => {
  // req.params.albumId

  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(response => {
      //  console.log('TRACKS', response.body.items);

      const data = {
        tracks: response.body.items
      };

      res.render("tracks", data);
    })
    .catch(err => console.log(err));
});

// START SERVER
app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
