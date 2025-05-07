import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import MainTabs from "./navigation/MainTabs"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import ProductDetailScreen from "./screens/products/ProductDetailScreen"
import CheckoutScreen from "./screens/checkout/CheckoutScreen"
import OrderConfirmationScreen from "./screens/checkout/OrderConfirmationScreen"
import OrderDetailScreen from "./screens/orders/OrderDetailScreen"
import SearchResultsScreen from "./screens/search/SearchResultsScreen"
import FilterScreen from "./screens/products/FilterScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: "Connexion" }} />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: true, title: "Inscription" }}
              />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ headerShown: true, title: "Détails du produit" }}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ headerShown: true, title: "Paiement" }}
              />
              <Stack.Screen
                name="OrderConfirmation"
                component={OrderConfirmationScreen}
                options={{ headerShown: true, title: "Confirmation de commande" }}
              />
              <Stack.Screen
                name="OrderDetail"
                component={OrderDetailScreen}
                options={{ headerShown: true, title: "Détails de la commande" }}
              />
              <Stack.Screen
                name="SearchResults"
                component={SearchResultsScreen}
                options={{ headerShown: true, title: "Résultats de recherche" }}
              />
              <Stack.Screen name="Filter" component={FilterScreen} options={{ headerShown: true, title: "Filtres" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
