"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../contexts/AuthContext"
import { API_URL, ENDPOINTS, getAuthHeader } from "../../config/api"

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: number
}

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()

  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentOrders()
    }
  }, [isAuthenticated])

  const fetchRecentOrders = async () => {
    setIsLoading(true)
    try {
      const headers = await getAuthHeader()
      const response = await fetch(`${API_URL}${ENDPOINTS.ORDERS.USER_ORDERS}?limit=3`, {
        headers,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setRecentOrders(data)
    } catch (err) {
      console.error("Error fetching recent orders:", err)
      setError("Impossible de charger vos commandes récentes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", onPress: logout },
    ])
  }

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    )
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.notAuthenticatedContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#ccc" />
        <Text style={styles.notAuthenticatedText}>Connectez-vous pour accéder à votre profil</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert("Info", "Fonctionnalité à venir")}>
          <Ionicons name="pencil-outline" size={18} color="#FF6B6B" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commandes récentes</Text>

        {isLoading ? (
          <ActivityIndicator size="small" color="#FF6B6B" style={styles.ordersLoading} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : recentOrders.length > 0 ? (
          <>
            {recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderItem}
                onPress={() => navigation.navigate("OrderDetail", { orderId: order.id })}
              >
                <View>
                  <Text style={styles.orderNumber}>Commande #{order.id.substring(0, 8)}</Text>
                  <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
                  <View style={styles.orderStatusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            order.status === "delivered"
                              ? "#4CAF50"
                              : order.status === "shipped"
                                ? "#2196F3"
                                : order.status === "processing"
                                  ? "#FF9800"
                                  : "#F44336",
                        },
                      ]}
                    />
                    <Text style={styles.orderStatus}>
                      {order.status === "delivered"
                        ? "Livré"
                        : order.status === "shipped"
                          ? "Expédié"
                          : order.status === "processing"
                            ? "En traitement"
                            : "En attente"}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTotal}>{order.total.toFixed(2)} DT</Text>
                  <Text style={styles.orderItems}>
                    {order.items} article{order.items > 1 ? "s" : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("OrderHistory")}>
              <Text style={styles.viewAllButtonText}>Voir toutes les commandes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noOrdersContainer}>
            <Ionicons name="bag-outline" size={40} color="#ccc" />
            <Text style={styles.noOrdersText}>Vous n'avez pas encore de commandes</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person-outline" size={22} color="#666" />
          <Text style={styles.settingText}>Informations personnelles</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="location-outline" size={22} color="#666" />
          <Text style={styles.settingText}>Adresses de livraison</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="card-outline" size={22} color="#666" />
          <Text style={styles.settingText}>Méthodes de paiement</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={22} color="#666" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
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
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notAuthenticatedText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    width: "80%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  editButtonText: {
    color: "#FF6B6B",
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  ordersLoading: {
    marginVertical: 20,
  },
  errorText: {
    color: "#F44336",
    textAlign: "center",
    marginVertical: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  orderStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderItems: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  viewAllButtonText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  noOrdersContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  noOrdersText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginVertical: 15,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  logoutButtonText: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
})
