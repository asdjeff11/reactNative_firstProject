export const TWDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchMovie = async({query, page} : {query: string, page: number}) => {
    
    const endpoint = query ? `${TWDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}` : `${TWDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint,{
        method:'GET',
        headers: TWDB_CONFIG.headers,
    });
    console.log(endpoint);
    if (!response.ok) {
        throw new Error('Failed to fetch moive');
    }

    const data = await response.json();
    return data ;
}

export const fetchMovieDetail = async(movieId: string) => {
    const endpoint = `${TWDB_CONFIG.BASE_URL}/movie/${movieId}`
    const response = await fetch(endpoint,{
        method:'GET',
        headers: TWDB_CONFIG.headers,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch moive detail');
    }

    const data = await response.json();
    return data ;
}
// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjg1NmIxMGI2OTVmNjBhMzRhMGYyZDc5NzI3OTk0YSIsIm5iZiI6MTc0ODI3NDM4NS4wODQsInN1YiI6IjY4MzQ4Y2QxODBmOWM5MGMzZDAzNzc2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jaf7DD7vPMiQJLh7XvHQy5g2cl3Q1cziHBBrrrvZ3Yo'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));