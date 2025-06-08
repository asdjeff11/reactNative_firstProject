import { ActivityIndicator, Alert, FlatList, Image, Text, TextInput, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import styles from "../../assets/styles/movie.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { icons } from "../../constants/icons";
import { fetchMovie } from "../../constants/TWDB_api";
import { useCallback, useEffect, useState, useMemo } from 'react';
import Loader from "../../components/Loader";
import { useRouter } from 'expo-router';


const ListHeader = ({ currentSearchText, setCurrentSearchText, handlerSearchBtn }) => (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={icons.logo} style={{ width: 60, height: 50 }} />
      </View>
      <View style={{
        flexDirection: "row", 
        padding: 10,
        alignItems: 'center' 
      }}>
        <View style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingHorizontal: 10, // 使用 paddingHorizontal
          height: 40,
          marginRight: 10 // 與按鈕間隔
        }}>
          <Ionicons name="search-outline" size={20} color={COLORS.primary} />
          <TextInput style={{
            marginLeft: 10,
            flex: 1,
            fontSize: 16,
            color: COLORS.white // 假設是暗色主題
          }}
            placeholder='Search movies...'
            placeholderTextColor={COLORS.gray}
            value={currentSearchText} // 綁定 TextInput 的值到 state
            onChangeText={(text) => setCurrentSearchText(text)} // 更新 state
            onSubmitEditing={handlerSearchBtn} // 按下鍵盤確認鍵時也觸發搜尋
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handlerSearchBtn}>
          <Text style={{ color: COLORS.white }}>Search</Text>
        </TouchableOpacity>
      </View>
    </>
  )

export default function Movie() {
  // REMOVE: let searchInputValue = ""; // 不再需要這個全域變數
  const [currentSearchText, setCurrentSearchText] = useState(""); // 新增 state 來追蹤 TextInput 的值
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  const loadMovie = useCallback(async () => {
    if (loading && !refreshing) {
      return;
    }

    try {
      if (!refreshing) {
        setLoading(true);
      }

      const data = await fetchMovie({ query: query, page: page })
      setTotalPage(data.total_pages);
      const newResults = data.results || [];
      if (page === 1) {
        setMovies(newResults);
      } else {
        setMovies(prevMovies => {
          const existingIds = new Set(prevMovies.map(movie => movie.id));
          const uniqueNewResults = newResults.filter(movie => !existingIds.has(movie.id));
          return prevMovies.concat(uniqueNewResults);
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, query]); // loading 和 refreshing 也應該是依賴項，雖然在這個特定邏輯中它們主要用作守衛條件

  const handlerRefresh = useCallback(async () => {
    setRefreshing(true);
    initData();
  })

  const handleContinueLoad = async () => {
    if (page >= totalPage || loading || query == "") {
      return
    }

    setPage(prevPage => prevPage + 1); // 使用函數式更新 state
  }

  const handlerSearchBtn = useCallback(async () => {
    setQuery(currentSearchText); // 使用 TextInput 的 state 值
    initData(); // initData 應該在 setQuery 之後，或者在 useEffect 中依賴 query 變化來執行
  })

  const initData = () => {
    setTotalPage(1);
    setMovies([]);
    setPage(1); // 重置頁碼
  }

  useEffect(() => {
    // 只有在 query 或 page 改變時才執行 loadMovie
    // 初始加載 (query 為空) 或搜尋詞改變後 (query 被設定)
    // 或者 page 改變 (加載更多)
    loadMovie();
  }, [loadMovie]); // loadMovie 已經包含了 query 和 page 作為依賴

  const clickCell = (item) => {
    if (item && item.id) { 
      router.push({pathname: `../movie/${item.id}`, params: {
        movieData: JSON.stringify(item)
      }})
    }
  }

  const cell = ({ item: movie }) => (
    <TouchableWithoutFeedback
    onPress={() => clickCell(movie)}
    >
      <View style={{
        width: '33%', // 讓 FlatList 的 numColumns 控制寬度
        paddingVertical: 5,
        paddingHorizontal: 5, // 增加一些間距

      }}>
        <Image
          source={movie.poster_path ? { uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` } : icons.logo}
          style={{
            width: '100%', // 自適應寬度
            height: 170,
            borderRadius: 10, // 調整圓角
          }}
          resizeMode="cover"
        />
        <Text style={{ color: COLORS.primary, marginTop: 5, fontSize: 12 }} numberOfLines={1}>{movie.title || movie.name}</Text>
        <View style={{
          flexDirection: "row",
          alignItems: 'center',
          marginTop: 2
        }}>
          <Ionicons
            name="star"
            size={10}
            color={"#f4b400"}
          />
          <Text style={{ color: COLORS.primary, marginLeft: 3, fontSize: 10 }}>{movie.vote_average?.toFixed(1)}</Text>
        </View>
        <Text style={{ color: COLORS.textDark, fontSize: 9, marginTop: 2 }}>{movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0,4)}</Text>
      </View>
    </TouchableWithoutFeedback>
  )

  const memoizedListHeader = useMemo(() => 
    <ListHeader 
      currentSearchText={currentSearchText}
      setCurrentSearchText={setCurrentSearchText}
      handlerSearchBtn={handlerSearchBtn}
    />, 
    [currentSearchText, handlerSearchBtn]
  );

  if (loading && !refreshing && movies.length === 0) return (<Loader />); // 只有在首次加載且沒有舊數據時顯示全螢幕 Loader
  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={memoizedListHeader} // 將 ListHeader 作為 prop 傳入
        data={movies}
        renderItem={cell}
        
        keyExtractor={(movie) => movie.id.toString()}
        numColumns={3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlerRefresh}
            colors={[COLORS.primary]} // for Android
            tintColor={COLORS.primary} // for iOS
          />
        }
        onEndReached={handleContinueLoad}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingHorizontal: 5}}
        ListFooterComponent={loading && page < totalPage && movies.length > 0 ? <ActivityIndicator size="large" style={{ marginVertical: 20 }} /> : null}
        ListEmptyComponent={!loading && movies.length === 0 ? <Text style={styles.emptyText}>No movies found.</Text> : null}
      />
    </View>
  )
}