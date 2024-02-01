import { React, useEffect, useState } from "react";
import StarRating from "./StarRating";

const KEY = "fc2452a1";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedId(id);
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
            <MovieDetails selectedId={selectedId} />
          ) : (
            <>
              <WatchedSummary />
            </>
          )}
        </Box>
      </Main>
    </div>
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

function MovieDetails({ selectedId }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
            </div>
          </header>
          <section>
            <div className="rating">
              {<StarRating maxRating={10} size={24} />}
              <p>
                You rated with movie 8 <span>⭐️</span>
              </p>
            </div>
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

function WatchedSummary() {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div className="summary-info">
        <p>
          <span>#️⃣</span>
          <span>5 movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>0.0</span>
        </p>
        <p>
          <span>🌟</span>
          <span>5.6</span>
        </p>
        <p>
          <span>⏳</span>
          <span>420 min</span>
        </p>
      </div>
    </div>
  );
}
