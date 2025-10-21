import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";


// ------------------ Types ------------------
export type CafeItem = {
  itemName: string;
  description: string;
  category: string;
  price: number;
  intensity?: string;
  image?: string;
  ingredients?: string[];
};

export type RootStackParamList = {
  WelcomeScreen: undefined;
  HomeScreen:
  | {
    items: CafeItem[];
    setItems: React.Dispatch<React.SetStateAction<CafeItem[]>>;
  }
  | undefined;
  CourseSelectionScreen:
  | {
    items: CafeItem[];
    setItems: React.Dispatch<React.SetStateAction<CafeItem[]>>;
  }
  | undefined;
  DishDetailsScreen: { item: CafeItem } | undefined;
  FilteredResultsScreen:
  | {
    items: CafeItem[];
    filterCourse?: string;
    maxPrice?: number;
  }
  | undefined;
  ManageScreen:
  | {
    items: CafeItem[];
    setItems: React.Dispatch<React.SetStateAction<CafeItem[]>>;
  }
  | undefined;
};

// ------------------ Seed data ------------------
const predefinedItems: CafeItem[] = [
  {
    itemName: "Hot Chocolate",
    description:
      "A rich and creamy blend of premium cocoa and steamed milk, topped with whipped cream and chocolate flakes.",
    category: "Beverage",
    price: 55,
    intensity: "Smooth & Comforting",
    image:
      "https://images.pexels.com/photos/34286081/pexels-photo-34286081.jpeg",
    ingredients: ["Cocoa powder", "Steamed milk", "Whipped cream", "Sugar"],
  },
  {
    itemName: "Decadent White Chocolate Ganache Cake",
    description:
      "Moist sponge, layered with silky ganache and finished with a glossy glaze — perfect for chocoholics.",
    category: "Dessert",
    price: 220,
    intensity: "Decadent & Intense",
    image:
      "https://images.pexels.com/photos/34268540/pexels-photo-34268540.jpeg",
    ingredients: ["Flour", "Cocoa", "Eggs", "Butter", "Sugar", "Cream"],
  },
  {
    itemName: "Classic Caesar Salad",
    description: "Crisp romaine, creamy dressing, parmesan, and crunchy croutons.",
    category: "Starter",
    price: 75,
    intensity: "Fresh & Light",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    ingredients: ["Romaine", "Parmesan", "Croutons", "Caesar dressing"],
  },
  {
    itemName: "Grilled Salmon with Herbs",
    description:
      "Perfectly grilled salmon fillet served with roasted veggies and herb butter.",
    category: "Main",
    price: 185,
    intensity: "Savory & Satisfying",
    image:
      "https://images.pexels.com/photos/329627/pexels-photo-329627.jpeg",
    ingredients: ["Salmon", "Herbs", "Lemon", "Olive oil"],
  },
];

// ------------------ Screens ------------------
function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      <Image
        source={{
          uri: "https://i.pinimg.com/1200x/33/94/01/339401958ca2f8ecb0ffe136afb70dd8.jpg",
        }}
        style={styles.heroImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>Welcome to Bari</Text>
        <Text style={styles.welcomeText}>
          Your cozy café experience — right on your screen.
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.startText}>Explore Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "HomeScreen">) {
  // Accept items from route params if provided, otherwise use local copy
  const passedItems = route.params?.items;
  const passedSetItems = route.params?.setItems;

  const [items, setItems] = useState<CafeItem[]>(passedItems ?? predefinedItems);

  // If a parent setItems was provided (App-level), keep them in sync when changed
  const updateItems = (next: CafeItem[]) => {
    setItems(next);
    if (passedSetItems) passedSetItems(next);
  };

  const removeItem = (index: number) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => updateItems(items.filter((_, i) => i !== index)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Barista Bliss</Text>
      <Text style={styles.subtitle}>Warm Coffee · Cozy Pastries · Sweet moments</Text>

      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image || "" }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.itemName}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardMeta}>
                {item.category} · R{item.price} · {item.intensity}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.smallButton]}
                  onPress={() => navigation.navigate("DishDetailsScreen", { item })}
                >
                  <Text style={styles.smallButtonText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallButton, { marginLeft: 8 }]}
                  onPress={() => removeItem(index)}
                >
                  <Text style={styles.smallButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() =>
            navigation.navigate("CourseSelectionScreen", { items, setItems })
          }
        >
          <Text style={styles.rowButtonText}>Next → Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rowButton, { marginTop: 8 }]}
          onPress={() =>
            navigation.navigate("ManageScreen", { items, setItems })
          }
        >
          <Text style={styles.rowButtonText}>Edit Menu (Chef)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function CourseSelectionScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "CourseSelectionScreen">) {
  const items = route.params?.items ?? predefinedItems;

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Course Selection</Text>
      <Text style={styles.subtitle}>Browse by course</Text>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={styles.courseButton}
          onPress={() => navigation.navigate("FilteredResultsScreen", { items, filterCourse: cat })}
        >
          <Text style={styles.courseButtonText}>{cat}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.rowButton, { marginTop: 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.rowButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function DishDetailsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "DishDetailsScreen">) {
  const item = route.params?.item;
  if (!item) return null;

  return (
    <SafeAreaView style={[styles.container, { padding: 20 }]}>
      <Image source={{ uri: item.image || "" }} style={{ width: "100%", height: 240, borderRadius: 14 }} />
      <Text style={[styles.cardTitle, { marginTop: 12 }]}>{item.itemName}</Text>
      <Text style={styles.cardMeta}>{item.category} · R{item.price}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      <Text style={{ marginTop: 12, fontWeight: "700", color: "#4b2e2b" }}>Ingredients</Text>
      <Text>{(item.ingredients || []).join(", ")}</Text>

      <TouchableOpacity style={[styles.rowButton, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
        <Text style={styles.rowButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function FilteredResultsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "FilteredResultsScreen">) {
  const items = route.params?.items ?? predefinedItems;
  const filterCourse = route.params?.filterCourse;
  const maxPrice = route.params?.maxPrice;

  const filtered = items.filter((i) => {
    if (filterCourse && i.category !== filterCourse) return false;
    if (typeof maxPrice === "number" && i.price > maxPrice) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Filtered Results</Text>
      <Text style={styles.subtitle}>
        {filterCourse ? `Course: ${filterCourse}` : "All courses"} {maxPrice ? `· Max R${maxPrice}` : ""}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DishDetailsScreen", { item })}
          >
            <Image source={{ uri: item.image || "" }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.itemName}</Text>
              <Text style={styles.cardMeta}>{item.category} · R{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={[styles.rowButton, { marginTop: 10 }]} onPress={() => navigation.goBack()}>
        <Text style={styles.rowButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ManageMenuScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ManageScreen">) {
  const parentItems = route.params?.items ?? predefinedItems;
  const parentSetItems = route.params?.setItems;

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Beverage");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = () => {
    if (itemName && description && category && price) {
      const priceValue = parseFloat(price);
      if (priceValue > 0) {
        const intensity = priceValue < 45 ? "Mild" : priceValue < 65 ? "Balanced" : "Strong";

        const newItem: CafeItem = {
          itemName,
          description,
          category,
          price: priceValue,
          intensity,
          image,
          ingredients: ingredients.split(",").map((i) => i.trim()),
        };

        const next = [...parentItems, newItem];
        if (parentSetItems) parentSetItems(next);
        Alert.alert("Saved", "Menu item added.");
        // reset
        setItemName("");
        setDescription("");
        setPrice("");
        setImage("");
        setIngredients("");
      } else {
        Alert.alert("Invalid Price", "Price must be greater than 0");
      }
    } else {
      Alert.alert("Missing Fields", "Please fill out all details before saving.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formHeader}>Chef — Edit Menu</Text>

          <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value: string) => setCategory(value)}
                mode="dropdown"
                dropdownIconColor="#4b2e2b"
                style={styles.pickerStyle}
                itemStyle={{ height: 50 }}
              >
                <Picker.Item label="Beverage" value="Beverage" />
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main" value="Main" />
                <Picker.Item label="Dessert" value="Dessert" />
                <Picker.Item label="Side" value="Side" />
              </Picker>
            </View>
          </View>




          <TextInput style={styles.input} placeholder="Price (e.g. 50)" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <TextInput style={styles.input} placeholder="Ingredients (comma separated)" value={ingredients} onChangeText={setIngredients} />
          <TextInput style={styles.input} placeholder="Image URL" value={image} onChangeText={setImage} />

          {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ------------------ App (navigator) ------------------
export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [items, setItems] = useState<CafeItem[]>(predefinedItems);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          initialParams={{ items, setItems }}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CourseSelectionScreen" component={CourseSelectionScreen} options={{ title: "Courses" }} />
        <Stack.Screen name="DishDetailsScreen" component={DishDetailsScreen} options={{ title: "Dish Details" }} />
        <Stack.Screen name="FilteredResultsScreen" component={FilteredResultsScreen} options={{ title: "Filtered" }} />
        <Stack.Screen
          name="ManageScreen"
          component={ManageMenuScreen}
          initialParams={{ items, setItems }}
          options={{ title: "Chef Edit", headerStyle: { backgroundColor: "#4b2e2b" }, headerTintColor: "#fff" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  welcomeContainer: { flex: 1, backgroundColor: "#3e2723" },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  welcomeTitle: { color: "#fff", fontSize: 34, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  welcomeText: { color: "#fbe9e7", fontSize: 16, textAlign: "center", marginBottom: 30 },
  startButton: { backgroundColor: "#d7ccc8", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  startText: { color: "#3e2723", fontWeight: "bold", fontSize: 18 },

  container: { flex: 1, backgroundColor: "#efebe9", padding: 15 },
  mainTitle: { fontSize: 28, fontWeight: "800", color: "#4b2e2b", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#795548", marginBottom: 15, fontSize: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginVertical: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: { width: "100%", height: 220 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#4b2e2b" },
  cardDesc: { color: "#5d4037", fontSize: 14, marginVertical: 5 },
  cardMeta: { color: "#8d6e63", fontSize: 13 },
  removeButton: {
    backgroundColor: "#562f0357",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  removeText: { color: "#fff", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#4b2e2b",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 4,
  },
  addText: { color: "#fff8e1", fontSize: 18, fontWeight: "bold" },

  formContainer: { backgroundColor: "#f5f5f5", padding: 20 },
  formHeader: { fontSize: 24, color: "#4b2e2b", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#8d6e63",
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "center",
    marginVertical: 8,
  },

  // PICKER FIXED STYLES
  pickerWrapper: { marginVertical: 10 },
  label: { fontSize: 15, fontWeight: "600", color: "#4b2e2b", marginBottom: 6, marginLeft: 4 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#8d6e63",
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    color: "#4b2e2b",
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: Platform.OS === "ios" ? -6 : -2,
  },

  imagePreview: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  saveButton: { backgroundColor: "#4b2e2b", padding: 15, borderRadius: 10, marginTop: 15, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: { alignItems: "center", marginTop: 10 },
  cancelButtonText: { color: "#5d4037", fontWeight: "bold" },

  courseButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#8d6e63",
  },
  courseButtonText: { fontWeight: "700", fontSize: 16, color: "#4b2e2b" },

  rowButton: { backgroundColor: "#4b2e2b", borderRadius: 30, paddingVertical: 14, alignItems: "center", elevation: 3 },
  rowButtonText: { color: "#fff8e1", fontSize: 16, fontWeight: "700" },

  smallButton: { backgroundColor: "#d7ccc8", padding: 8, borderRadius: 8 },
  smallButtonText: { color: "#3e2723", fontWeight: "700" },
});
