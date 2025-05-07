"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"
import { API_URL, ENDPOINTS } from "../../config/api"
import ProductCard from "../../components/ProductCard"
import SearchBar from "../../components/SearchBar"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function SearchResultsScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { query, featured, sort } = route.params as {
    query?: string
    featured?: boolean
    sort?: string
  }

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(query || "")

  useEffect(() => {
    fetchProducts()
  }, [query, featured, sort])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      let url = `${API_URL}${ENDPOINTS.PRODUCTS.SEARCH}?`

      if (query) {
        url += `q=${encodeURIComponent(query)}`
      }

      if (featured) {
        url += `${query ? "&" : ""}featured=true`
      }

      if (sort) {
        url += `${query || featured ? "&" : ""}sort=${sort}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Impossible de charger les produits")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery)
    navigation.setParams({ query: newQuery })
  }

  const handleFilterPress = () => {
    navigation.navigate("Filter", {
      onApplyFilters: (filters: any) => {
        // Handle filters here
        console.log("Applied filters:", filters)
        // You would typically fetch products with these filters
      },
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} placeholder="Rechercher des produits..." />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {isLoading
            ? "Recherche..."
            : products.length === 0
              ? "Aucun résultat"
              : `${products.length} résultat${products.length > 1 ? "s" : ""}`}
        </Text>

        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="options-outline" size={18} color="#333" />
          <Text style={styles.filterButtonText}>Filtrer</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
              style={styles.productCard}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Aucun produit trouvé pour "{searchQuery}"</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
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
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    maxWidth: "50%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})
