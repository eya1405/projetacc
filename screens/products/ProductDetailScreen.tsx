"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"
import { API_URL, ENDPOINTS } from "../../config/api"
import { useCart } from "../../contexts/CartContext"
import QuantitySelector from "../../components/QuantitySelector"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  features: string[]
}

export default function ProductDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { addToCart } = useCart()
  const { productId } = route.params as { productId: string }

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.DETAIL(productId)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product details")
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product details:", err)
        setError("Impossible de charger les détails du produit")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        quantity,
      )

      Alert.alert("Produit ajouté", `${product.name} a été ajouté à votre panier`, [
        { text: "Continuer les achats", style: "cancel" },
        { text: "Voir le panier", onPress: () => navigation.navigate("Cart") },
      ])
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    )
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error || "Produit non trouvé"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price.toFixed(2)} DT</Text>

        <View style={styles.stockContainer}>
          <Ionicons
            name={product.stock > 0 ? "checkmark-circle" : "close-circle"}
            size={18}
            color={product.stock > 0 ? "#4CAF50" : "#F44336"}
          />
          <Text style={[styles.stockText, { color: product.stock > 0 ? "#4CAF50" : "#F44336" }]}>
            {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.features && product.features.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.featuresList}>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.divider} />

        <View style={styles.actionContainer}>
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            maxQuantity={product.stock}
          />

          <TouchableOpacity
            style={[styles.addToCartButton, { opacity: product.stock > 0 ? 1 : 0.5 }]}
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.addToCartButtonText}>Ajouter au panier</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  contentContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 10,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stockText: {
    marginLeft: 5,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666",
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
})
