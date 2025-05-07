"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "../screens/home/HomeScreen"
import CategoriesScreen from "../screens/categories/CategoriesScreen"
import CartScreen from "../screens/cart/CartScreen"
import ProfileScreen from "../screens/profile/ProfileScreen"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  const { isAuthenticated } = useAuth()
  const { cartItems } = useCart()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Categories") {
            iconName = focused ? "grid" : "grid-outline"
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: "Catégories" }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Panier",
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  )
}
