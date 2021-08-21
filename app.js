const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

//client id 9fa567bdad8148d9a9527fe1eb0e1956
//client id Secret 536fa015784d41ecb61c2941ed17d6cd

// require spotify-web-api-node package here:

const app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('index', {});
});

app.get('/artist-search', (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      // console.log('Data: ', data.body.artists.items[0]);
      res.render('artist-search-results', {
        artists: data.body.artists.items
      });
    })
    .catch((error) => console.log(error));
});
app.get('/albums/:artistID', (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then((data) => {
      console.log('Data: ', data.body.items);
      res.render('albums', {
        albums: data.body.items
      });
    })
    .catch((error) => console.log(error));
});
app.get('/tracks/:trackID', (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackID)
    .then((data) => {
      console.log('Data: ', data.body.items);
      res.render('tracks', {
        tracks: data.body.items
      });
    })
    .catch((error) => console.log(error));
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);

//enviroment variables set on our machine through node can be accessed through the object env on the globall available object process => process.env.

//BASH: export SECRET_MESSAGE=Message && node index.js
// the variable will be available through process.env.SECRET_MESSAGE while node is running.
