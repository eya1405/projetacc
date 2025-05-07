import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  maxQuantity?: number
  small?: boolean
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  maxQuantity = 99,
  small = false,
}: QuantitySelectorProps) {
  return (
    <View style={[styles.container, small && styles.smallContainer]}>
      <TouchableOpacity
        style={[styles.button, small && styles.smallButton]}
        onPress={onDecrease}
        disabled={quantity <= 1}
      >
        <Ionicons name="remove" size={small ? 16 : 20} color={quantity <= 1 ? "#ccc" : "#333"} />
      </TouchableOpacity>

      <Text style={[styles.quantity, small && styles.smallQuantity]}>{quantity}</Text>

      <TouchableOpacity
        style={[styles.button, small && styles.smallButton]}
        onPress={onIncrease}
        disabled={quantity >= maxQuantity}
      >
        <Ionicons name="add" size={small ? 16 : 20} color={quantity >= maxQuantity ? "#ccc" : "#333"} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  smallContainer: {
    borderRadius: 3,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  smallButton: {
    width: 30,
    height: 30,
  },
  quantity: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  smallQuantity: {
    width: 30,
    fontSize: 14,
  },
})
