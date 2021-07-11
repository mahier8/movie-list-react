import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  // 2. we create a new hook to store the transformed data
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // 7. convert all to an asynchronous function, which is what we did here
  // 6. the final play is to connect the function to the button bellow
  const fetchMoviesHandler = useCallback(async function() {
    setIsLoading(true);
    setError(null);
    try {
      // 1. this is us fetching the data from the api
      const response = await fetch("https://swapi.dev/api/films");
      
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      // 4. Because there is a difference between how the data is
      // presented in the MoviesList.js component, we have to either
      // change the way its set up there to match the data we will receive
      // or change the the way we receive the data here. we chose option 2.

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      // 3/5. here we set the transformed data to the new state
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isloading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isloading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isloading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isloading && error && <p>{error}</p>}
        {isloading && <p>Loading...</p>} */}{content}
      </section>
    </React.Fragment>
  );
}

export default App;
