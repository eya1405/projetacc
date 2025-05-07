import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"

interface Category {
  id: string
  name: string
  image: string
}

interface CategoryCardProps {
  category: Category
  onPress: () => void
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f1f3f5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
})
