import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native"

interface BannerProps {
  title: string
  subtitle?: string
  buttonText?: string
  onPress?: () => void
  image?: string
}

export default function Banner({ title, subtitle, buttonText, onPress, image }: BannerProps) {
  return (
    <ImageBackground
      source={{ uri: image || "https://via.placeholder.com/800x300" }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {buttonText && onPress && (
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  backgroundImage: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    height: "100%",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    maxWidth: "70%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})
