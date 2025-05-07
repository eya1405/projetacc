"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import Slider from "@react-native-community/slider"

interface FilterScreenProps {
  onApplyFilters: (filters: any) => void
}

export default function FilterScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { onApplyFilters } = route.params as FilterScreenProps

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStock, setInStock] = useState(false)
  const [onSale, setOnSale] = useState(false)
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch brands from your API
        // For this example, we'll use dummy data
        setBrands(["Apple", "Samsung", "Xiaomi", "Huawei", "Sony", "JBL", "Anker"])
      } catch (error) {
        console.error("Error fetching brands:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const resetFilters = () => {
    setPriceRange([0, 1000])
    setSelectedBrands([])
    setInStock(false)
    setOnSale(false)
  }

  const applyFilters = () => {
    const filters = {
      priceRange,
      brands: selectedBrands,
      inStock,
      onSale,
    }

    onApplyFilters(filters)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gamme de prix</Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceText}>{priceRange[0].toFixed(0)} DT</Text>
            <Text style={styles.priceText}>{priceRange[1].toFixed(0)} DT</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000}
            step={10}
            value={priceRange[1]}
            minimumTrackTintColor="#FF6B6B"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#FF6B6B"
            onValueChange={(value) => setPriceRange([priceRange[0], value])}
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000}
            step={10}
            value={priceRange[0]}
            minimumTrackTintColor="#ddd"
            maximumTrackTintColor="#FF6B6B"
            thumbTintColor="#FF6B6B"
            onValueChange={(value) => setPriceRange([value, priceRange[1]])}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marques</Text>
          <View style={styles.brandsContainer}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand}
                style={[styles.brandButton, selectedBrands.includes(brand) && styles.selectedBrandButton]}
                onPress={() => toggleBrand(brand)}
              >
                <Text style={[styles.brandText, selectedBrands.includes(brand) && styles.selectedBrandText]}>
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autres filtres</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>En stock uniquement</Text>
            <Switch
              value={inStock}
              onValueChange={setInStock}
              trackColor={{ false: "#ddd", true: "#FF6B6B" }}
              thumbColor={inStock ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>En promotion uniquement</Text>
            <Switch
              value={onSale}
              onValueChange={setOnSale}
              trackColor={{ false: "#ddd", true: "#FF6B6B" }}
              thumbColor={onSale ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80,
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 16,
    color: "#333",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  brandsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  brandButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedBrandButton: {
    backgroundColor: "#FF6B6B",
  },
  brandText: {
    fontSize: 14,
    color: "#666",
  },
  selectedBrandText: {
    color: "#fff",
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  applyButton: {
    flex: 2,
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
