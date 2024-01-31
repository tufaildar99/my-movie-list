import { React, useEffect, useState } from "react";
import StarRating from "./StarRating";

const KEY = "fc2452a1";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

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
            <MovieList movies={movies} />
          )}
        </Box>
        <Box>
          <WatchedSummary />
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

function MovieList({ movies }) {
  return (
    <ul className="movielist">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li className="movie">
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

function MovieDetails() {
  return (
    <div className="details">
      <header>
        <img />
        <div className="details-overview">
          <h2>Inception</h2>
          <p>2010 &bull; 128 min</p>
          <p>Romance</p>
          <p>
            <span>⭐️</span>
            8.8 IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          <StarRating />
          <p>
            You rated movie with 10 <span>⭐️</span>
          </p>
        </div>
        <p>
          <em>
            A seventeen-year-old aristocrat falls in love with a kind but poor
            artist aboard the luxurious, ill-fated R.M.S. Titanic.
          </em>
        </p>
        <p>Starring Bret Hart, Jeff Jarrett, Brian James, David Heath</p>
        <p>Directed by Shane Van Dyke</p>
      </section>
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
