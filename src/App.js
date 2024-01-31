import { React, useEffect } from "react";
import StarRating from "./StarRating";
import img from "./img.jpg";

export default function App() {
  return (
    <div className="app">
      <NavBar>
        <Search />
        <NumResults />
      </NavBar>
      <Main>
        <Box>
          <MovieList />
        </Box>
        <Box>
          <MovieDetails />
        </Box>
      </Main>
    </div>
  );
}

function NavBar({ children }) {
  return (
    <div className="navbar">
      <Logo />
      {children}
    </div>
  );
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

function Search() {
  return (
    <div className="search">
      <input type="text" placeholder="Search Movies" />
    </div>
  );
}

function NumResults() {
  return (
    <div className="numresults">
      <p>Found 3 results</p>
    </div>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  return <div className="box">{children}</div>;
}

function MovieList() {
  return (
    <ul className="movielist">
      <Movie />
      <Movie />
      <Movie />
    </ul>
  );
}

function Movie() {
  return (
    <li className="movie">
      <img alt="" />
      <h3>Inception</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>2010</span>
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
          <>
            <StarRating />
          </>

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
