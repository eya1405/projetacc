"use client"

import { Alert } from "@/components/ui/alert"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRoute, useNavigation } from "@react-navigation/native"
import { API_URL, ENDPOINTS, getAuthHeader } from "../../config/api"

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  shippingAddress: {
    fullName: string
    street: string
    city: string
    postalCode: string
    phone: string
  }
  paymentMethod: string
}

export default function OrderDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { orderId } = route.params as { orderId: string }

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      try {
        const headers = await getAuthHeader()
        const response = await fetch(`${API_URL}${ENDPOINTS.ORDERS.DETAIL(orderId)}`, {
          headers,
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Impossible de charger les détails de la commande")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#4CAF50"
      case "shipped":
        return "#2196F3"
      case "processing":
        return "#FF9800"
      default:
        return "#F44336"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Livré"
      case "shipped":
        return "Expédié"
      case "processing":
        return "En traitement"
      default:
        return "En attente"
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

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error || "Commande non trouvée"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Commande #{order.id.substring(0, 8)}</Text>
        <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>

        <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Articles commandés</Text>

        {order.items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price.toFixed(2)} DT</Text>
              <Text style={styles.itemQuantity}>Quantité: {item.quantity}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse de livraison</Text>

        <View style={styles.addressContainer}>
          <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addressLine}>{order.shippingAddress.street}</Text>
          <Text style={styles.addressLine}>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </Text>
          <Text style={styles.addressLine}>{order.shippingAddress.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Méthode de paiement</Text>

        <View style={styles.paymentMethod}>
          <Ionicons
            name={order.paymentMethod === "card" ? "card-outline" : "cash-outline"}
            size={24}
            color="#666"
            style={styles.paymentIcon}
          />
          <Text style={styles.paymentText}>
            {order.paymentMethod === "card" ? "Carte bancaire" : "Paiement à la livraison"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Récapitulatif</Text>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{(order.total - 7).toFixed(2)} DT</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de livraison</Text>
            <Text style={styles.summaryValue}>7.00 DT</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total.toFixed(2)} DT</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => {
          // Handle support request
          Alert.alert("Besoin d'aide ?", "Notre service client est disponible pour vous aider", [
            { text: "Annuler", style: "cancel" },
            { text: "Contacter le support", onPress: () => console.log("Contact support") },
          ])
        }}
      >
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FF6B6B" />
        <Text style={styles.supportButtonText}>Besoin d'aide avec cette commande ?</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 70,
    height: 70,
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
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  addressContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
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
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginVertical: 15,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  supportButtonText: {
    color: "#FF6B6B",
    fontWeight: "500",
    marginLeft: 5,
  },
})
