import { StatusBar } from "expo-status-bar";
import { createRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const API_KEY = "wC2YxlTbQnV4VNw5byG65T2mwpQYDXoN4J3WOJfqQomyUUbCtp6cMGDx";
const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";

const IMAGE_SIZE = 80;
const SPACING = 10;

const fetchImagesFromPexels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const { photos } = await data.json();

  return photos;
};

export default function Page() {
  const [images, setImages] = useState<any[]>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index);
    console.log(index);
    // scroll flatlist
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    if (index * (IMAGE_SIZE + SPACING) - 40 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };
  const topRef = useRef<FlatList>();
  const thumbRef = useRef<FlatList>();

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImagesFromPexels();

      setImages(images);
    };

    fetchImages();
  }, []);

  if (!images) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(ev) => {
          // if (ev.nativeEvent.contentOffset.x / width < activeIndex) {
          scrollToActiveIndex(
            Math.round(ev.nativeEvent.contentOffset.x / width)
          );
          // } else {
          //   scrollToActiveIndex(
          //     Math.ceil(ev.nativeEvent.contentOffset.x / width)
          //   );
          // }
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{ ...StyleSheet.absoluteFillObject }}
              />
            </View>
          );
        }}
      />

      <FlatList
        ref={thumbRef}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: IMAGE_SIZE }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff" : "transparent",
                  marginRight: SPACING,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />

      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
