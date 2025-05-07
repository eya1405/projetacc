"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { API_URL, ENDPOINTS } from "../../config/api"
import ProductCard from "../../components/ProductCard"
import CategoryFilter from "../../components/CategoryFilter"

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
}

export default function CategoriesScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(route.params?.selectedCategory || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("newest") // 'newest', 'price_asc', 'price_desc', 'popularity'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}${ENDPOINTS.PRODUCTS.CATEGORIES}`)
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Impossible de charger les catégories")
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let url = `${API_URL}${ENDPOINTS.PRODUCTS.ALL}?sort=${sortBy}`

        if (selectedCategory) {
          url = `${API_URL}${ENDPOINTS.PRODUCTS.BY_CATEGORY(selectedCategory)}?sort=${sortBy}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Impossible de charger les produits")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, sortBy])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
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

  const renderHeader = () => (
    <View style={styles.header}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      <View style={styles.sortFilterContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // Show sort options
            // For simplicity, we'll just cycle through sort options
            const sortOptions = ["newest", "price_asc", "price_desc", "popularity"]
            const currentIndex = sortOptions.indexOf(sortBy)
            const nextIndex = (currentIndex + 1) % sortOptions.length
            handleSortChange(sortOptions[nextIndex])
          }}
        >
          <Ionicons name="swap-vertical-outline" size={18} color="#333" />
          <Text style={styles.sortFilterText}>
            {sortBy === "newest"
              ? "Plus récents"
              : sortBy === "price_asc"
                ? "Prix croissant"
                : sortBy === "price_desc"
                  ? "Prix décroissant"
                  : "Popularité"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="options-outline" size={18} color="#333" />
          <Text style={styles.sortFilterText}>Filtrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (isLoading && !products.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setSelectedCategory(selectedCategory)}>
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
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={() => setSelectedCategory(selectedCategory)}
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
  header: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sortFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  sortFilterText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    maxWidth: "50%",
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
