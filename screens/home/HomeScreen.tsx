"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { API_URL, ENDPOINTS } from "../../config/api"
import SearchBar from "../../components/SearchBar"
import ProductCard from "../../components/ProductCard"
import CategoryCard from "../../components/CategoryCard"
import Banner from "../../components/Banner"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface Category {
  id: string
  name: string
  image: string
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      try {
        // Fetch featured products
        const featuredResponse = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.ALL}?featured=true`)

        // Fetch popular products
        const popularResponse = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.ALL}?sort=popularity`)

        // Fetch categories
        const categoriesResponse = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.CATEGORIES}`)

        if (!featuredResponse.ok || !popularResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const featuredData = await featuredResponse.json()
        const popularData = await popularResponse.json()
        const categoriesData = await categoriesResponse.json()

        setFeaturedProducts(featuredData.slice(0, 5))
        setPopularProducts(popularData.slice(0, 5))
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching home data:", err)
        setError("Impossible de charger les données. Veuillez réessayer.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const handleSearch = (query: string) => {
    navigation.navigate("SearchResults", { query })
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          }
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <SearchBar onSearch={handleSearch} />
      </View>

      <Banner
        title="Nouveaux accessoires"
        subtitle="Découvrez notre collection"
        buttonText="Voir plus"
        onPress={() => navigation.navigate("Categories")}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => navigation.navigate("Categories", { selectedCategory: category.id })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits populaires</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SearchResults", { sort: "popularity" })}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits en vedette</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SearchResults", { featured: true })}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.featuredGrid}>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate("ProductDetail", { productId: product.id })}
              style={styles.featuredProductCard}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 15,
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
  section: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  categoriesContainer: {
    paddingLeft: 15,
  },
  productsContainer: {
    paddingLeft: 15,
  },
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  featuredProductCard: {
    width: "48%",
    marginBottom: 15,
  },
})
