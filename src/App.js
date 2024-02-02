import { React, useEffect, useState } from "react";
import StarRating from "./StarRating";

const KEY = "fc2452a1";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watchedList, setWatchedList] = useState([]);

  function handleSelectedMovie(id) {
    setSelectedId(id);
  }

  function onCloseMovie() {
    setSelectedId(null);
  }

  function AddWatched(newMovie) {
    setWatchedList((watchedList) => [...watchedList, newMovie]);
  }

  function handleDelete(id) {
    const newWatchLiit = watchedList.filter((movie) => movie.imdbID !== id);
    setWatchedList(newWatchLiit);
  }

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();
      console.log(data);
      setMovies(data.Search);
      setIsLoading(false);
      console.log(data.Search);
    }

    fetchMovies();
  }, [query]);

  return (
    <div className="app">
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        {query.length === 0 ? "" : <NumResults movies={movies} />}
      </NavBar>
      <Main>
        <Box>
          {loading ? (
            <Loader />
          ) : query.length === 0 ? (
            <WelcomeComponent />
          ) : (
            <MovieList
              movies={movies}
              handleSelectedMovie={handleSelectedMovie}
            />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              AddWatched={AddWatched}
              watchedList={watchedList}
            />
          ) : (
            <>
              <WatchedSummary watchedList={watchedList} />
              <WatchedList
                watchList={watchedList}
                handleDelete={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

function WatchedSummary({ watchedList }) {
  const totalRuntime = watchedList.reduce(
    (total, movie) => total + movie.runtime,
    0
  );
  const averageRating =
    watchedList.reduce((total, movie) => total + movie.imdbRating, 0) /
    watchedList.length;

  return (
    <div className="summary">
      <h2>Your Watchlist</h2>
      <div className="summary-info">
        <p>
          <span>#️⃣</span>
          <span>{watchedList.length} movies</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{averageRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{totalRuntime}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watchList, handleDelete }) {
  return (
    <ul className="watched-list">
      {watchList.map((item) => (
        <WatchedMovie movie={item} handleDelete={handleDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDelete }) {
  return (
    <li className="watched-movie">
      <div className="movie-poster">
        <div className="watched-movie-info">
          <h5>{movie.title}</h5>
          <div className="paras">
            <p>{movie.imdbRating} ⭐</p>
            <p>⌛ {movie.runtime}</p>
            <button
              onClick={() => {
                handleDelete(movie.imdbID);
              }}
            >
              ❌
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function NavBar({ children }) {
  return <div className="navbar">{children}</div>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="movie">
        🎬
      </span>
      <h4>My Movie List</h4>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search Movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

function NumResults({ movies = [] }) {
  return (
    <div className="numresults">
      <p>Found {movies.length} results</p>
    </div>
  );
}

function WelcomeComponent() {
  return (
    <div className="welcome">
      <h2>Welcome!</h2>
      <p>
        Nothing to display . Search for your favorite movies in the search bar
        above.
      </p>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function MovieList({ movies, handleSelectedMovie }) {
  return (
    <ul className="movielist">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleSelectedMovie={handleSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedMovie }) {
  return (
    <li
      className="movie"
      onClick={() => {
        handleSelectedMovie(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt="" className="poster" />
      <h3>{movie.Title}</h3>
      <div className="movie-info">
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, AddWatched, watchedList }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isWatched = watchedList
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addToWatchlist() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };

    AddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setIsLoading(false);
      setMovie(data);
    }
    getMovieDetails();
  }, [selectedId]);

  return (
    <div className={`details ${selectedId ? "active" : ""}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => onCloseMovie()}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
              {!isWatched ? (
                <div className="watchlist-btn">
                  <div className="add-to-list">
                    <button
                      onClick={() => {
                        addToWatchlist(movie);
                      }}
                    >
                      Add to watchlist
                    </button>
                  </div>
                </div>
              ) : (
                <p>
                  <em>You added this movie to the watch list</em>
                </p>
              )}
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
