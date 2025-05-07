import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native"

interface Category {
  id: string
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.categoryButton, !selectedCategory && styles.selectedCategoryButton]}
        onPress={() => onSelectCategory(selectedCategory || "")}
      >
        <Text style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}>Tous</Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategoryButton]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f3f5",
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#FF6B6B",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500",
  },
})
