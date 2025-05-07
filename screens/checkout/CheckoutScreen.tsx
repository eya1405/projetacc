"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { API_URL, ENDPOINTS, getAuthHeader } from "../../config/api"

export default function CheckoutScreen() {
  const navigation = useNavigation()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cash") // 'cash', 'card'
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!address.fullName) newErrors.fullName = "Le nom est requis"
    if (!address.street) newErrors.street = "L'adresse est requise"
    if (!address.city) newErrors.city = "La ville est requise"
    if (!address.postalCode) newErrors.postalCode = "Le code postal est requis"
    if (!address.phone) newErrors.phone = "Le numéro de téléphone est requis"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const headers = await getAuthHeader()

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        paymentMethod,
        total: getCartTotal(),
      }

      const response = await fetch(`${API_URL}${ENDPOINTS.ORDERS.CREATE}`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to place order")
      }

      const data = await response.json()

      // Clear cart after successful order
      clearCart()

      // Navigate to order confirmation
      navigation.navigate("OrderConfirmation", {
        orderId: data.id,
        orderTotal: getCartTotal(),
      })
    } catch (error) {
      console.error("Error placing order:", error)
      Alert.alert("Erreur", "Une erreur est survenue lors de la commande. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse de livraison</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Votre nom complet"
            value={address.fullName}
            onChangeText={(text) => setAddress({ ...address, fullName: text })}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={[styles.input, errors.street && styles.inputError]}
            placeholder="Rue et numéro"
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
          />
          {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="Ville"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={[styles.input, errors.postalCode && styles.inputError]}
              placeholder="Code postal"
              keyboardType="numeric"
              value={address.postalCode}
              onChangeText={(text) => setAddress({ ...address, postalCode: text })}
            />
            {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={address.phone}
            onChangeText={(text) => setAddress({ ...address, phone: text })}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Méthode de paiement</Text>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "cash" && styles.selectedPaymentOption]}
          onPress={() => setPaymentMethod("cash")}
        >
          <View style={styles.radioButton}>
            {paymentMethod === "cash" && <View style={styles.radioButtonSelected} />}
          </View>
          <Ionicons name="cash-outline" size={24} color="#666" style={styles.paymentIcon} />
          <View>
            <Text style={styles.paymentTitle}>Paiement à la livraison</Text>
            <Text style={styles.paymentDescription}>Payez en espèces à la réception</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, paymentMethod === "card" && styles.selectedPaymentOption]}
          onPress={() => setPaymentMethod("card")}
        >
          <View style={styles.radioButton}>
            {paymentMethod === "card" && <View style={styles.radioButtonSelected} />}
          </View>
          <Ionicons name="card-outline" size={24} color="#666" style={styles.paymentIcon} />
          <View>
            <Text style={styles.paymentTitle}>Carte bancaire</Text>
            <Text style={styles.paymentDescription}>Paiement sécurisé en ligne</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{getCartTotal().toFixed(2)} DT</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de livraison</Text>
            <Text style={styles.summaryValue}>7.00 DT</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{(getCartTotal() + 7).toFixed(2)} DT</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.placeOrderButtonText}>Confirmer la commande</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  selectedPaymentOption: {
    borderColor: "#FF6B6B",
    backgroundColor: "rgba(255, 107, 107, 0.05)",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
  },
  paymentIcon: {
    marginRight: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  paymentDescription: {
    fontSize: 14,
    color: "#666",
  },
  orderSummary: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  placeOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 5,
    margin: 15,
  },
  placeOrderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
})
