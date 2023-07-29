import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { Image, Animated, View, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("screen");
const imageW = width * 0.7;
const imageH = imageW * 1.54;

const data = [
  "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622040.jpg?w=740&t=st=1690534185~exp=1690534785~hmac=f7d3fcbff633760c67b3a9416feb4d421a9bf90f2c24880fb5dbc6010116144b",
  "https://img.freepik.com/premium-photo/3d-cartoon-bird-portrait-wearing-clothes-glasses-hat-jacket-standing-front_741910-1407.jpg?w=740",
  "https://cdn.pixabay.com/photo/2019/04/06/06/44/astronaut-4106766_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_1280.png",
  "https://cdn.pixabay.com/photo/2019/10/19/11/35/wolf-4561204_1280.png",
  "https://cdn.pixabay.com/photo/2011/12/14/12/17/galaxy-11098_1280.jpg",
  "https://cdn.pixabay.com/photo/2012/11/28/10/16/stars-67616_1280.jpg",
];

const CarouselItem = ({ image, scrollX, index }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.Image
      source={{ uri: image }}
      style={{ ...StyleSheet.absoluteFillObject, opacity }}
      blurRadius={50}
    />
  );
};

const Carousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar hidden />
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        {data.map((image, index) => (
          <CarouselItem
            key={`image-${index}`}
            image={image}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </View>
      <Animated.FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
              }}
            >
              <Image
                source={{ uri: item }}
                style={{
                  width: imageW,
                  height: imageH,
                  resizeMode: "cover",
                  borderRadius: 16,
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Carousel;
