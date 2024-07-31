import { useEffect, useState } from "react";
import { StarRating } from './StarRating'

const tempMovieData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
	},
	{
		imdbID: "tt0133093",
		Title: "The Matrix",
		Year: "1999",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
	},
	{
		imdbID: "tt6751668",
		Title: "Parasite",
		Year: "2019",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
	},
];

const tempWatchedData = [
	{
		imdbID: "tt1375666",
		Title: "Inception",
		Year: "2010",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: "tt0088763",
		Title: "Back to the Future",
		Year: "1985",
		Poster:
			"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];


/**
 * Calculates the average of an array of numbers.
 * @param {number[]} arr - Array of numbers.
 * @returns {number} - The average of the numbers.
 */
const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '54fc20b1'

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState(null)

	// const tempQuery = "interstellar"

	// useEffect(() => { console.log("After Initial Render"); }, [])
	// useEffect(() => { console.log("After Every Render"); })
	// useEffect(() => { console.log("D"); }, [query])
	// console.log("During Render ");

	const handleSelectMovie = (id) => setSelectedId((currSelectedId) => (id === currSelectedId ? null : id));
	console.log('App, handleSelectMovie()', selectedId);
	const handleCloseMovie = () => setSelectedId(null);
	const handleAddWatched = (movie) => { setWatched((watched) => [...watched, movie]) }
	const handleDeleteWatched = (id) => { setWatched((watched) => watched.filter((movieElObj) => movieElObj.imdbID !== id)) }


	useEffect(() => {
		// A controller object that allows you to abort one or more DOM requests as and when desired.
		const controller = new AbortController()

		setIsLoading(true)
		setError('')
		const fetchMovies = async () => {
			try {
				const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal })
				// console.log('res', res);

				if (!res.ok) throw new Error("Something went wrong with fetching movies")

				const data = await res.json()

				if (data.Response === "False") throw new Error("Movie not found!")
				// console.log('data', data);
				setMovies(data.Search)
				setError('')
				console.log('App, data', data);

			} catch (error) {
				if (error.name !== "AbortError") { setError(error.message); }
				// console.log(`error name: ${error.name}, error message: ${error.message}`);
			}
			finally { setIsLoading(false) }
		}

		if (query.length < 3) { setMovies([]); setError(""); setIsLoading(false); return; };
		handleCloseMovie()
		fetchMovies();

		return () => controller.abort()

	}, [query])

	return (
		<>
			<NavBar movies={movies} > <Search query={query} setQuery={setQuery} /> <NumResults movies={movies} /> </NavBar>
			<Main>
				<Box >
					{(isLoading) && (<Loader />)}
					{(!isLoading) && !error && (<MovieList movies={movies} handleSelectMovie={handleSelectMovie} />)}
					{(error) && (<ErrorMessage message={error} />)}
				</Box>
				<Box >
					{
						(selectedId) ?
							(<MovieDetails selectedId={selectedId} handleCloseMovie={handleCloseMovie}
								isLoading={isLoading} setIsLoading={setIsLoading} handleAddWatched={handleAddWatched} watched={watched}
							/>) :
							(<>	<WatchedSummary watched={watched} />	<WatchedMovieList watched={watched} handleDeleteWatched={handleDeleteWatched} />	</>)
					}
				</Box>
			</Main>
		</>
	);
}

/**
 * Loader component to indicate loading state.
 * @returns {JSX.Element}
 */
export function Loader() { return (<p className="loader">Loading...</p>) }


/**
 * Error message component to display errors.
 * @param {Object} props
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element}
 */
export function ErrorMessage({ message }) { return (<p className="error"> <span>⛔️</span> {message} </p>) }

/**
 * Logo component for the application.
 * @returns {JSX.Element}
 */
export function Logo() { return (<div className="logo">    <span role="img">🍿</span>    <h1>usePopcorn</h1>  </div>) }
/**
 * Search component to handle movie search input.
 * @param {Object} props
 * @param {string} props.query - The current search query.
 * @param {Function} props.setQuery - Function to update the search query.
 * @returns {JSX.Element}
 */
export function Search({ query, setQuery }) {
	return (<input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />)
}

/**
 * Component to display the number of search results.
 * @param {Object} props
 * @param {Array} props.movies - Array of movies.
 * @returns {JSX.Element}
 */
export function NumResults({ movies }) {
	// console.group('NumResults', movies);
	// console.log('movies', movies);
	return (<p className="num-results"> Found <strong>{`${movies.length}`}</strong> results  </p>)
}

/**
 * Navbar component to wrap other components.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element}
 */
export function NavBar({ children }) { return (<nav className="nav-bar"> <Logo /> {children} </nav>) }


/**
 * Movie component to display individual movie information.
 * @param {Object} props
 * @param {Object} props.movie - Movie object.
 * @param {Function} props.handleSelectMovie - Function to handle movie selection.
 * @returns {JSX.Element}
 */
export function Movie({ movie, handleSelectMovie }) {
	return (
		<li onClick={(() => handleSelectMovie(movie.imdbID))}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div> <p> <span>🗓</span> <span>{movie.Year}</span> </p> </div>
		</li>
	)
}

/**
 * MovieList component to display a list of movies.
 * @param {Object} props
 * @param {Array} props.movies - Array of movies.
 * @param {Function} props.handleSelectMovie - Function to handle movie selection.
 * @returns {JSX.Element}
 */
export function MovieList({ movies, handleSelectMovie }) {
	return (<ul className="list list-movies"> {movies?.map((movie, index) => (<Movie key={movie.imdbID} movie={movie} handleSelectMovie={handleSelectMovie} />))} </ul>)
}

/**
 * Box component to wrap other components with a toggle button.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element}
 */
export function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen(!isOpen)}> {isOpen ? "–" : "+"} </button>
			{(isOpen) && children}
		</div>
	);
}


/**
 * MovieDetails component to display detailed information about a selected movie.
 * @param {Object} props
 * @param {string} props.selectedId - The ID of the selected movie.
 * @param {Function} props.handleCloseMovie - Function to handle closing the movie details view.
 * @param {Function} props.setIsLoading - Function to set the loading state.
 * @param {boolean} props.isLoading - The current loading state.
 * @param {Function} props.handleAddWatched - Function to add the movie to the watched list.
 * @returns {JSX.Element}
 */
export function MovieDetails({ selectedId, handleCloseMovie, setIsLoading, isLoading, handleAddWatched, watched }) {
	const [movie, setMovie] = useState({})
	const [userRating, setUserRating] = useState('')

	const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot,
		Released: released, Actors: actors, Director: director, Genre: genre } = movie;

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating

	const handleAdd = () => {
		const newWatchedMovie = { imdbID: selectedId, title, year, poster, imdbRating: Number(imdbRating), runtime: Number(runtime.split(" ")[0]), userRating }
		handleAddWatched(newWatchedMovie)
		handleCloseMovie()
	}

	useEffect(() => {
		async function getMovieDetails() {
			setIsLoading(true);
			const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
			const data = await res.json();
			setMovie(data);
			setIsLoading(false);
		}
		getMovieDetails();
	}, [selectedId, setIsLoading]);


	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`

		return () => { document.title = "usePopcorn" }
	}, [title])

	console.log('MovieDetails watched', watched);


	useEffect(() => {

		const callback = (e) => {
			if (e.code === "Escape") {
				handleCloseMovie(); console.log("CLOSING");
			}
		}
		document.addEventListener("keydown", callback)

		return () => { document.removeEventListener("keydown", callback) }

	}, [handleCloseMovie])

	return (
		<div className="details">
			{isLoading ? <Loader /> :
				<>
					<header>
						<button className="btn-back" onClick={handleCloseMovie}>&larr;</button>
						<img src={poster} alt={`Poster of ${movie}`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>{released} &bull; {runtime}</p>
							<p>{genre}</p>
							<p><span>⭐️</span>{imdbRating} IMDb rating</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{(!isWatched) ?
								(<>
									<StarRating maxRating={10} size={24} setMovieRating={setUserRating} />
									{(userRating > 0) && (<button className="btn-add" onClick={handleAdd}>+ Add to list</button>)}
								</>) :
								(<p>You have rated this Movie {watchedUserRating} <span>⭐️</span></p>)
							}
						</div>
						<p><em>{plot}</em></p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			}
		</div>
	)
}

/**
 * WatchedSummary component to display a summary of watched movies.
 * @param {Object} props
 * @param {Array} props.watched - Array of watched movies.
 * @returns {JSX.Element}
 */
export function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	return (<div className="summary">
		<h2>Movies you watched</h2>
		<div>
			<p>  <span>#️⃣</span> <span>{watched.length} movies</span> </p>
			<p>  <span>⭐️</span> <span>{avgImdbRating.toFixed(1)}</span> </p>
			<p>  <span>🌟</span> <span>{avgUserRating.toFixed(1)}</span> </p>
			<p>  <span>⏳</span> <span>{avgRuntime} min</span> </p>
		</div>
	</div>)
}

/**
 * WatchedMovie component to display individual watched movie information.
 * @param {Object} props
 * @param {Object} props.movie - Watched movie object.
 * @returns {JSX.Element}
 */
export function WatchedMovie({ movie, handleDeleteWatched }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p> <span>⭐️</span> <span>{movie.imdbRating}</span> </p>
				<p> <span>🌟</span> <span>{movie.userRating}</span> </p>
				<p> <span>⏳</span> <span>{movie.runtime} min</span> </p>
				<button className="btn-delete" onClick={() => handleDeleteWatched(movie.imdbID)}>X</button>
			</div>
		</li>
	)
}

/**
 * WatchedMovieList component to display a list of watched movies.
 * @param {Object} props
 * @param {Array} props.watched - Array of watched movies.
 * @returns {JSX.Element}
 */
export function WatchedMovieList({ watched, handleDeleteWatched }) {
	return (
		<ul className="list">	{watched.map(movie =>
			(<WatchedMovie key={movie.imdbID} movie={movie} handleDeleteWatched={handleDeleteWatched} />))}
		</ul>
	);
}


/**
 * Main component to wrap main content.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element}
 */
export function Main({ children }) { return (<main className="main"> {children} </main>) }
