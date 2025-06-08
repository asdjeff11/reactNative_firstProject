import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { API_URL } from "../../constants/api";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
    const { logout, token } = useAuthStore();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchBooks = async ( pageNum = 1, refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else if (pageNum == 1) setLoading(true);
            const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`,{
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            }); 

            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Failed to fetch books");
            const existingBookIds = new Set(books.map(book => book._id));
            const newBooks = data.books.filter( book => !existingBookIds.has(book._id));
            setBooks((prevBooks) => [...prevBooks, ...newBooks]);
            setHasMore(pageNum < data.totalPage);
            setPage(pageNum);
        } catch(error) {
            Alert.alert("Error",error.message);
        } finally {
            if (refresh) { await sleep(1000) ; setRefreshing(false); }
            else setLoading(false);
        }
    }

    const hanldeLoadMore = async () => {
        if( hasMore && !loading && !refreshing) {
            await sleep(1000); // 測試用
            await fetchBooks(page + 1);
        }
    };

    const cellView = ({item}) => {
        return (
            <View style={styles.bookCard}>
                <View style={styles.bookHeader}>
                    <View style={styles.userInfo}>
                        <Image source={{uri: item.user.profileImage }} style={styles.avatar} />
                        <Text style={styles.username}>{item.user.username}</Text>
                    </View>
                </View>

                <View style={styles.bookImageContainer}>
                    <Image source={item.imageUrl} style={styles.bookImage} contentFit="cover" />
                </View>

                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <View style={styles.ratingContainer}>
                        {starsView(item.rating)}
                    </View>
                    <Text style={styles.caption}>{item.caption}</Text>
                    <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
                </View>
            </View>
        )
    };

    const starsView = (rating) => {
        const stars = [];
        for ( let i = 1; i <= 5 ; i++ ) {
            stars.push(
                <Ionicons
                key={i}
                name={i <= rating ? "star" : "star-outline"}
                size={16}
                color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                style={{ marginRight: 2}} // 間隔
                />
            );
        }
        return stars;
    }

    useEffect(() => {
        fetchBooks();
    },[]);

    if(loading) return ( <Loader /> )

    return (
        <View style={styles.container}>
            <FlatList
            data = {books}
            renderItem={cellView}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={hanldeLoadMore}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={() => fetchBooks(1, true)}  
                    tintColor={COLORS.primary}
                />
            }
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Book Worm</Text>
                    <Text style={styles.headerSubtitle}>Discover grete reads from the community</Text>
                </View>
            }
            ListFooterComponent={
                hasMore && books.length > 0 ? (
                    <ActivityIndicator style={styles.footerLoader} size={"small"} color={COLORS.primary} />
                ) : null
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No recommendations yet</Text>    
                    <Text style={styles.emptySubtext}>Be the first to share a book!</Text>   
                </View>
            }
            />

        </View>
    )
}