import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from "../../assets/styles/movie.styles";
import Loader from '../../components/Loader';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from "expo-image";
import { icons } from "../../constants/icons";
import { fetchMovieDetail } from '../../constants/TWDB_api';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function MovieDetailPage() {
    const params = useLocalSearchParams(); // 獲取所有路由參數
    const {movieId, movieData: movieDataString} = params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let isActive = true;
        const loadMovieDetail = async(Id) => {
            if(!isActive) return; 
            setLoading(true);
            try {
                const data = await fetchMovieDetail(Id); 
                setMovie(data);
            } catch ( error ) {
                Alert.alert(`Have something error on fetching ${error}`)
            } finally {
                setLoading(false)
            }
        }
        
        try {
            const parsedMovie = null // JSON.parse(movieDataString);
            if ( !parsedMovie && movieId ) {
                loadMovieDetail(movieId);
            } else if ( parsedMovie ) {
                setMovie(parsedMovie);
            } else {
                Alert.alert("Movie Data is null!")
            }
        } catch (error) {
            console.error("Failed to parse movieDataString:", error);
        }

        return () => {
            isActive = false;
        };
    }, [movieDataString, movieId]);

    const MovieInfo = ({ title, content, containerStyle }) => (
        <View style={containerStyle}>  
            <Text style={{color:COLORS.textSecondary, marginTop:15, fontSize:12}}>{title}</Text>
            <Text style={{color:COLORS.textSecondary, marginTop: 10, fontSize:12}}>{content}</Text>
        </View>
    )

    let content; 
    if ( loading || !movie ) { content = <Loader />; }
    else {
        content = (
            <ScrollView>
            <Image
                style={{ width:"100%", aspectRatio: 16 / 9, borderRadius:20, marginBottom: 20}} // aspectRatio: 根據寬度/高度 依比例推算高度/寬度
                source={movie.backdrop_path ? { uri: `https://image.tmdb.org/t/p/w200${movie.backdrop_path}` } : icons.notFound}
                contentFit="contain"
                transition={1000}
            />
        
            <Text style={{color:COLORS.primary}}>{movie.original_title}</Text>
            <View style={{flexDirection:"row", paddingTop: 5}}>
                <Text style={{color:COLORS.textSecondary, fontSize: 10}}>{movie.release_date.split("-")[0]} {movie.runtime}m</Text>
            </View>
            <View style={{borderRadius: 5, marginTop:5, backgroundColor:'#CCCCCC4D', alignSelf: 'flex-start'}}>
                <View style={{padding: 5, flexDirection:"row"}}>
                    <Ionicons
                    name="star"
                    size={14}
                    color="#f4b400"
                    />
                    <Text style={{color:COLORS.textSecondary, fontSize:12}}> {Math.round(movie.vote_average)}/10 ({movie.vote_count} votes)</Text>    
                </View>
            </View>
            <MovieInfo title={"Overview"} content={movie.overview} />

            <MovieInfo title={"Genres"} content={movie.genres.map((g)=>g.name).join(' - ')}/>

            <View style={{flexDirection:"row", flex: 1}}>
                <MovieInfo title={"Budget"} content={`$${movie.budget / 1_000_000} million`} containerStyle={{marginRight:60}}/>
                <MovieInfo title={"Revenue"} content={`$${Math.round(movie.revenue / 1_000_000)} million`}/>
            </View>
            
            <MovieInfo title={"Production Companies"} content={movie.production_companies.map((c) => c.name).join(' - ')} />
            </ScrollView>
        )
    }


    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true, 
                    title: "Movie Detail",
                    headerStyle: {
                        backgroundColor: COLORS.background
                    },
                    headerTintColor: COLORS.primary,
                    headerLeft: () => {
                        return (
                        <TouchableOpacity onPress={ ()=>{ router.back() }}>
                            <Ionicons 
                                name={"caret-back-outline"}
                                size={28}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                        )
                    }
                }}
            />
                
            {content}
        </View>
    )
}