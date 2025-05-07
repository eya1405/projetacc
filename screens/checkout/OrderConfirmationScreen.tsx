import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"

export default function OrderConfirmationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { orderId, orderTotal } = route.params as { orderId: string; orderTotal: number }

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    })
  }

  const handleViewOrder = () => {
    navigation.navigate("OrderDetail", { orderId })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>

      <Text style={styles.title}>Commande confirmée !</Text>
      <Text style={styles.message}>
        Merci pour votre commande. Nous avons bien reçu votre paiement et nous préparons votre colis.
      </Text>

      <View style={styles.orderInfoContainer}>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Numéro de commande:</Text>
          <Text style={styles.orderInfoValue}>#{orderId.substring(0, 8)}</Text>
        </View>

        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Date:</Text>
          <Text style={styles.orderInfoValue}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Total:</Text>
          <Text style={styles.orderInfoValue}>{(orderTotal + 7).toFixed(2)} DT</Text>
        </View>

        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Méthode de paiement:</Text>
          <Text style={styles.orderInfoValue}>Paiement à la livraison</Text>
        </View>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Prochaines étapes:</Text>

        <View style={styles.step}>
          <View style={styles.stepIconContainer}>
            <Ionicons name="cube-outline" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Préparation de votre commande</Text>
            <Text style={styles.stepDescription}>Nous préparons votre commande pour l'expédition</Text>
          </View>
        </View>

        <View style={styles.stepConnector} />

        <View style={styles.step}>
          <View style={styles.stepIconContainer}>
            <Ionicons name="car-outline" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Expédition</Text>
            <Text style={styles.stepDescription}>Votre commande sera expédiée dans les 24-48 heures</Text>
          </View>
        </View>

        <View style={styles.stepConnector} />

        <View style={styles.step}>
          <View style={styles.stepIconContainer}>
            <Ionicons name="home-outline" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Livraison</Text>
            <Text style={styles.stepDescription}>Votre commande sera livrée à l'adresse indiquée</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
          <Text style={styles.viewOrderButtonText}>Voir la commande</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueShoppingButton} onPress={handleContinueShopping}>
          <Text style={styles.continueShoppingButtonText}>Continuer les achats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  orderInfoContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 30,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderInfoLabel: {
    fontSize: 14,
    color: "#666",
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  stepsContainer: {
    width: "100%",
    marginBottom: 30,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  stepConnector: {
    width: 1,
    height: 30,
    backgroundColor: "#ddd",
    marginLeft: 20,
  },
  buttonsContainer: {
    width: "100%",
  },
  viewOrderButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  viewOrderButtonText: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 16,
  },
  continueShoppingButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  continueShoppingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
