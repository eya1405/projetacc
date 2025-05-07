"use client"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import QuantitySelector from "../../components/QuantitySelector"

export default function CartScreen() {
  const navigation = useNavigation()
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const { isAuthenticated } = useAuth()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert("Connexion requise", "Vous devez vous connecter pour finaliser votre commande", [
        { text: "Annuler", style: "cancel" },
        { text: "Se connecter", onPress: () => navigation.navigate("Login") },
      ])
      return
    }

    navigation.navigate("Checkout")
  }

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert("Supprimer l'article", `Êtes-vous sûr de vouloir supprimer "${itemName}" de votre panier ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", onPress: () => removeFromCart(itemId), style: "destructive" },
    ])
  }

  const handleClearCart = () => {
    if (cartItems.length === 0) return

    Alert.alert("Vider le panier", "Êtes-vous sûr de vouloir vider votre panier ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Vider", onPress: clearCart, style: "destructive" },
    ])
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Votre panier est vide</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.shopButtonText}>Commencer vos achats</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Votre Panier ({cartItems.length})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Vider</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price.toFixed(2)} DT</Text>

              <View style={styles.itemActions}>
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  small
                />

                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id, item.name)}>
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{getCartTotal().toFixed(2)} DT</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Passer la commande</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  clearText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  cartList: {
    paddingBottom: 100, // Space for footer
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    backgroundColor: "#f1f3f5",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 10,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  removeButton: {
    padding: 5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
