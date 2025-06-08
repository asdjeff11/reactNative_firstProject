import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import COLORS from "../../constants/colors";
import { sleep } from ".";
import Loader from "../../components/Loader";
export default function Profile() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [deletedBookId, setDeletedBookId] = useState(null);
    const { token } = useAuthStore();

    const router = useRouter();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/books/user`,{
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            }); 

            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Failed to fetch user books");
            setBooks(data);
        } catch(error) {
            console.error(error);
            Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const handlerDeleteBook = async (bookId) => {
        try {
            setDeletedBookId(bookId);
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                method:"DELETE",
                headers: { Authorization: `Bearer ${token}`}
            });

            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Failed to delete book");

            setBooks(books.filter((book) => book._id !== bookId));
            Alert.alert("Success", "Recommendation deleted successfully");
        } catch(error) {
            console.error(error);
            Alert.alert("Error", "Failed to delete book");
        } finally {
            setDeletedBookId(false);
        }
    };

    const confirmDeleteBook = (bookId) => {
        Alert.alert("Delete Recommendation", "Are you sure you want to delete the recommendation?",[
            {text: "Cancel", style:"cancel"},
            {text: "Delete", style:"destructive", onPress:() => handlerDeleteBook(bookId)}
        ]);
    };

    const handlerRefresh = async () => {
        setRefreshing(true);
        await sleep(500);
        await fetchData();
        setRefreshing(false);
    }

    const profileCell = ({item}) => (
        <View style={styles.bookItem}>
            <Image source={item.imageUrl} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>{starsView(item.rating)}</View>
                <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
                <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress= { () => confirmDeleteBook(item._id)}>
                {deletedBookId === item._id ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary}/>
                )}
            </TouchableOpacity>
        </View>
    );

    if(loading && !refreshing) return <Loader />;

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />
            <View style={styles.booksHeader}>
                <Text style={styles.bookTitle}>Your Recommendations</Text>
                <Text style={styles.booksCount}>{books.length} books</Text>
            </View>

            <FlatList 
            data={books}
            renderItem={profileCell}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl 
                refreshing={refreshing}
                onRefresh={handlerRefresh}
                color={COLORS.primary}
                tintColor={COLORS.primary}
                />
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No recommendations yet</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                        <Text style={styles.addButtonText}>Add your first book</Text>
                    </TouchableOpacity>
                </View>
            }
            
            />
            
        </View>
    )
}