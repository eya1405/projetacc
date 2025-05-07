import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"

interface Product {
  id: string
  name: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
  onPress: () => void
  style?: object
}

export default function ProductCard({ product, onPress, style }: ProductCardProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{product.price.toFixed(2)} DT</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 15,
    marginBottom: 15,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    backgroundColor: "#f1f3f5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
    height: 40,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
})
