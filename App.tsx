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
  Modal,
} from "react-native";

//  React Navigation imports (for screen navigation)
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

//  Dropdown selector for category choices
import { Picker } from "@react-native-picker/picker";


// ------------------ Type Definitions ------------------
// Define the structure of a single menu item object
export type MenuItem = {
  itemName: string;
  description: string;
  category: string;
  price: number;
  intensity?: string;
  image?: string;
  ingredients?: string[];
};

// Define all navigation routes (and what parameters each route accepts)
export type RootStackParamList = {
  WelcomeScreen: undefined;
  HomeScreen:
  | {
    items: MenuItem[];
    setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  }
  | undefined;
  CourseSelectionScreen:
  | {
    items: MenuItem[];
    setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  }
  | undefined;
  DishDetailsScreen: { item: MenuItem } | undefined;
  FilteredResultsScreen:
  | {
    items: MenuItem[];
    filterCourse?: string;
    maxPrice?: number;
  }
  | undefined;
  ManageScreen:
  | {
    items: MenuItem[];
    setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  }
  | undefined;
};

// ------------------ Initial Data ------------------
// Predefined sample items shown when the app starts
const predefinedItems: MenuItem[] = [
  {
    itemName: "Grilled Calamari",
    description:
      "Grilled calamari with lemon and cilantro",
    category: "Starter",
    price: 55,
    intensity: "Mild",
    image:
      "https://www.thetastychilli.com/wp-content/uploads/2022/01/grilled-calamari-rings-lemon.jpg",
    ingredients: ["Raw calamari rings", "Lemon juice", "Olive oil", "Dried oregano", "Garlic", "Red pepper flakes", "Cilantro", "Black pepper", "Seasalt flakes"],
  },

   {
    itemName: "Chicken wings",
    description:
      "Soy glazed crispy chicken wings, topped with sesame seeds & coriander",
    category: "Starter",
    price: 70,
    intensity: "Medium",
    image:
      "https://www.allrecipes.com/thmb/3sjLmvPzxHf3ID4-XqjsHeXcxrg=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-230873-amazing-and-easy-chicken-wings-ddmfs-4x3-8612d3a676444dc8b5e7933cf53be575.jpg",
    ingredients: ["Chicken wings", "Soy sauce", "Sugar", "Sesame seeds", "Cilantro"],
  },

   {
    itemName: "Wagyu beef potstickers",
    description:
      "Seared & steamed. Served with kimchi & Indonesian soya dipping sauce",
    category: "Starter",
    price: 85,
    intensity: "Medium",
    image:
      "https://tarasmulticulturaltable.com/wp-content/uploads/2019/02/Wagyu-Beef-Dumplings-10-of-10.jpg",
    ingredients: ["Wagyu beef", "Soy sauce", "Black pepper", "Gyoza wrappers", "Rosemary"],
  },

  {
    itemName: "Prawn pasta",
    description:
      "Fresh tagliatelle, with whole fried prawns, Parmesan, parsley, chilli & garlic butter",
    category: "Main",
    price: 175,
    intensity: "Medium",
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/prawn-harissa-spaghetti-d29786f.jpg?quality=90&webp=true&resize=440,400",
    ingredients: ["Tagliatelle","Prawns", "Parmesan Cheese","Parsley","Chilli Pepper","Garlic butter"],
  },

  {
    itemName: "Earth & Ocean",
    description:
      "Grilled beef rib eye steak & prawns with lemon & herb butter, served with your choice of side",
    category: "Main",
    price: 195,
    intensity: "Mild",
    image:
      "https://cookingwithcurls.com/wp-content/uploads/2013/05/Grilled-Steak-and-Shrimp.-cookingwithcurls.com_.jpg",
    ingredients: ["Beef Rib Eye Steak", "Prawns", "Butter", "Lemon", "Herbs"],
  },

  {
    itemName: "Crispy chicken burger",
    description:
      "Toasted artisan brioche bun, crunchy chicken breast, butter lettuce, avo, tomato, burger sauce, served with your choice of side",
    category: "Main",
    price: 167,
    intensity: "Mild",
    image:
      "https://i.pinimg.com/736x/4e/82/e1/4e82e1301bb30942fa4e7c78754aa45f.jpg",
    ingredients:["Brioche Bun", "Chicken Breast", "Butter Lettuce", "Avocado", "Tomato", "Burger Sauce"],
  },

{
    itemName: "Mocha Affogato",
    description:
      "Vanilla bean ice cream served on chocolate ganache with a double shot of espresso & hazelnut praline",
    category: "Dessert",
    price: 50,
    image:
      "https://foodandtravel.com/assets/img/content/recipes/Mocha-affogato.jpg",
    ingredients:["Vanilla Bean Ice Cream", "Chocolate Ganache", "Espresso", "Hazelnut Praline"],
  },

  {
    itemName: "Chocolate Brownie with Honeycomb Crunch",
    description:
      "Dark chocolate brownie with caramel honeycomb crunch & Jack Daniels butterscotch sauce, served with vanilla bean ice cream",
    category: "Dessert",
    price: 70,
    image:
      "https://mymorningmocha.com/wp-content/uploads/2022/07/Honeycomb-brownie-recipe.jpg",
    ingredients:["Dark Chocolate Brownie", "Caramel Honeycomb Crunch", "Jack Daniels Butterscotch Sauce", "Vanilla Bean Ice Cream"],
  },

  {
    itemName: "Ginger & Miso Caramel Cheesecake",
    description:
      "A creamy salted miso caramel cheesecake with a hint of orange on ginger biscuit crust",
    category: "Dessert",
    price: 105,
    image:
      "https://www.marionskitchen.com/wp-content/uploads/2021/08/MIso-Caramel-Cheesecake1957.jpeg",
    ingredients:["Vanilla Bean Ice Cream", "Chocolate Ganache", "Espresso", "Hazelnut Praline"],
  },

  {
    itemName: "Churros",
    description:
      "Dusted in sugar, cinnamon served with a dark chocolate ganache dip",
    category: "Dessert",
    price: 70,
    image:
      "https://stellanspice.com/wp-content/uploads/2021/12/IMG_0808-1-1154x1536.jpg",
    ingredients:["Sugar", "Cinnamon", "Dark Chocolate Ganache"],
  },

  {
    itemName: "Garlic Potato Mash",
    description:
      "Creamy potato mash infused with roasted garlic",
    category: "Sides",
    price: 45,
    intensity: "Mild",
    image:
      "https://www.allrecipes.com/thmb/QH_JKQhpxGnX247VU58OVkOW0g8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/18290-garlic-mashed-potatoes-ddmfs-beauty2-4x3-0327-2-47384a10cded40ae90e574bc7fdb9433.jpg",
    ingredients:["Potatoes", "Garlic", "Cream", "Butter"],
  },

  {
    itemName: "Kimchi Mac & cheese",
    description:
      "Classic Mac & cheese with a twist of kimchi & a crunchy gratin topping",
    category: "Sides",
    price: 65,
    intensity: "Hot",
    image:
      "https://takestwoeggs.com/wp-content/uploads/2021/11/Kimchi-Mac-and-Cheese-Takestwoeggs-FINAL-sq.jpg",
    ingredients:["Potatoes", "Garlic", "Cream", "Butter"],
  },

  {
    itemName: "Smashed Cucumber Salad",
    description:
      "Crushed cucumber soaked in spicy Korean dressing with toasted sesame seeds",
    category: "Sides",
    price: 50,
    intensity: "Medium",
    image:
      "https://healthynibblesandbits.com/wp-content/uploads/2021/07/Smashed-Cucumber-Salad-6.jpg",
    ingredients:["Cucumber", "Korean Chili Flakes (Gochugaru)", "Soy Sauce", "Vinegar", "Sesame Seeds", "Garlic", "Sugar", "Sesame Oil"],
  },

  {
    itemName: "Crispy Patatas Bravas",
    description:
      "Spiced potatoes with aioli & bravas sauce",
    category: "Sides",
    price: 70,
    intensity: "Medium",
    image:
      "https://img-cdn.oliveoiltimes.com/cb:2sys.247e0/w:1620/h:1080/q:67/ig:avif/id:203914907dbe14c81bbba48b29665010/https://www.oliveoiltimes.com/brava.jpg",
    ingredients:["Potatoes", "Paprika", "Garlic", "Olive Oil", "Mayonnaise", "Tomato", "Chili"],
  },
];


// ------------------  Screens ------------------
//  Welcome screen (first screen user sees)
function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      {/* Background image */}
      <Image
        source={{
          uri: "https://i.pinimg.com/1200x/33/94/01/339401958ca2f8ecb0ffe136afb70dd8.jpg",
        }}
        style={styles.heroImage}
      />
      {/* Overlay with text and button */}
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>Welcome 
to 
 Christoffel's 
Culinary
 Experience</Text>

        <Text style={styles.welcomeText}>
          Where every flavor tells a story
        </Text>
        {/* Button navigates to the HomeScreen */}
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

// 🏡 Main Home Screen — shows menu list
function HomeScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "HomeScreen">) {
  // If items were passed from navigation, use them; otherwise use predefined
  const passedItems = route.params?.items;
  const passedSetItems = route.params?.setItems;

  const [items, setItems] = useState<MenuItem[]>(passedItems ?? predefinedItems);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(passedItems ?? predefinedItems);

  // Sync changes back to parent state if available
  const updateItems = (next: MenuItem[]) => {
    setItems(next);
    setFilteredItems(next);
    if (passedSetItems) passedSetItems(next);
  };

  // Remove an item with confirmation alert
  const removeItem = (index: number) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => updateItems(items.filter((_, i) => i !== index)) },
    ]);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...items];
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by price
    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      filtered = filtered.filter(item => item.price <= maxPriceValue);
    }
    
    setFilteredItems(filtered);
    setFilterModalVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice("");
    setFilteredItems(items);
    setFilterModalVisible(false);
  };

  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}></Text>
      <Text style={styles.subtitle}> ❈ Hearty Meals   ❈ Warm Atmosphere                  ❈ Cherished Moments</Text>

      {/* Item Counter and Filter Button Row */}
      <View style={styles.headerRow}>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Total Items: {items.length} | Showing: {filteredItems.length}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Menu</Text>
            
            {/* Category Filter */}
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.pickerStyle}
              >
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>

            {/* Price Filter */}
            <Text style={styles.filterLabel}>Max Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter max price (e.g., 100)"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />

            {/* Filter Buttons */}
            <View style={styles.filterButtonsContainer}>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* List of menu items */}
      <FlatList
        data={filteredItems}
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

              {/* Action buttons for each menu item */}
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

      {/* Navigation buttons to other screens */}
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() =>
            navigation.navigate("CourseSelectionScreen", { items, setItems })
          }
        >
          <Text style={styles.rowButtonText}>View Courses</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


// Course Selection Screen — filters menu by course type
function CourseSelectionScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "CourseSelectionScreen">) {
  const items = route.params?.items ?? predefinedItems;
  const passedSetItems = route.params?.setItems;

  // Collect unique category names (Starter, Main, etc.)
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Course Selection</Text>
      <Text style={styles.subtitle}>Browse by course</Text>

      {/* Show one button per category */}
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={styles.courseButton}
          onPress={() => navigation.navigate("FilteredResultsScreen", { items, filterCourse: cat })}
        >
          <Text style={styles.courseButtonText}>{cat}</Text>
        </TouchableOpacity>
      ))}

      {/* Edit Menu Button */}
      <TouchableOpacity
        style={[styles.rowButton, { marginTop: 20 }]}
        onPress={() =>
          navigation.navigate("ManageScreen", { items, setItems: passedSetItems })
        }
      >
        <Text style={styles.rowButtonText}>Edit Menu</Text>
      </TouchableOpacity>

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { marginTop: 8 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//  Dish Details Screen — shows full info about one item
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

// Filtered Results Screen — shows only menu items that match filters
function FilteredResultsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "FilteredResultsScreen">) {
  const items = route.params?.items ?? predefinedItems;
  const filterCourse = route.params?.filterCourse;
  const maxPrice = route.params?.maxPrice;

  // Apply filtering logic based on category and/or price
  const filtered = items.filter((i) => {
    if (filterCourse && i.category !== filterCourse) return false;
    if (typeof maxPrice === "number" && i.price > maxPrice) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Dish details</Text>
      <Text style={styles.subtitle}>
        {filterCourse ? `Course: ${filterCourse}` : "All courses"} {maxPrice ? `· Max R${maxPrice}` : ""}
      </Text>

      {/* Show filtered menu items */}
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


//  Manage Menu Screen — allows chef to add a new menu item
function ManageMenuScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "ManageScreen">) {
  const parentItems = route.params?.items ?? predefinedItems;
  const parentSetItems = route.params?.setItems;

  // Local state for the form fields - CHANGED: Start with empty category
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(""); // CHANGED: Empty string instead of "Starter"
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Save button handler
  const handleSubmit = () => {
    if (itemName && description && category && price) {
      const priceValue = parseFloat(price);
      if (priceValue > 0) {
        // Assign an "intensity" label based on price range
        const intensity = priceValue < 45 ? "Mild" : priceValue < 65 ? "Balanced" : "Strong";

        // Create new menu item object
        const newItem: MenuItem = {
          itemName,
          description,
          category,
          price: priceValue,
          intensity,
          image,
          ingredients: ingredients.split(",").map((i) => i.trim()),
        };

        // Update parent list with new item
        const next = [...parentItems, newItem];
        if (parentSetItems) parentSetItems(next);
        Alert.alert("Saved", "Menu item added.");

        // Reset form fields - CHANGED: Reset category to empty
        setItemName("");
        setDescription("");
        setPrice("");
        setImage("");
        setIngredients("");
        setCategory(""); // CHANGED: Reset to empty instead of "Starter"
      } else {
        Alert.alert("Invalid Price", "Price must be greater than 0");
      }
    } else {
      Alert.alert("Missing Fields", "Please fill out all details before saving.");
    }
  };

  // Form UI layout
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formHeader}>Edit Menu</Text>

          {/* Input fields for item details */}
          <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

          {/* Category dropdown - UPDATED: Added placeholder item */}
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
                {/* ADDED: Placeholder item */}
                <Picker.Item label="Select Category" value="" enabled={false} />
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main Course" value="Main" />
                <Picker.Item label="Dessert" value="Dessert" />
                <Picker.Item label="Side" value="Side" />
                <Picker.Item label="Beverage" value="Beverage" />
              </Picker>
            </View>
          </View>

          {/* Other input fields */}
          <TextInput style={styles.input} placeholder="Price (e.g. 50)" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <TextInput style={styles.input} placeholder="Ingredients (comma separated)" value={ingredients} onChangeText={setIngredients} />
          <TextInput style={styles.input} placeholder="Image URL" value={image} onChangeText={setImage} />

          {/* Image preview */}
          {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}

          {/* Action buttons */}
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


// ------------------ App Entry & Navigation Setup ------------------
export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [items, setItems] = useState<MenuItem[]>(predefinedItems);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        {/* Screen registrations with options */}
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          initialParams={{ items, setItems }}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CourseSelectionScreen" 
          component={CourseSelectionScreen} 
          options={{ 
            title: "Courses", 
            headerStyle: { backgroundColor: "#832e2eed" }, 
            headerTintColor: "#ffffffff" 
          }} 
        />
        <Stack.Screen 
          name="DishDetailsScreen" 
          component={DishDetailsScreen} 
          options={{ 
            title: "Dish Details", 
            headerStyle: { backgroundColor: "#832e2eed" }, 
            headerTintColor: "#ffffffff" 
          }} 
        />
        <Stack.Screen 
          name="FilteredResultsScreen" 
          component={FilteredResultsScreen} 
          options={{ 
            title: "Filtered Results", 
            headerStyle: { backgroundColor: "#832e2eed" }, 
            headerTintColor: "#ffffffff" 
          }} 
        />
        <Stack.Screen
          name="ManageScreen"
          component={ManageMenuScreen}
          initialParams={{ items, setItems }}
          options={{ title: "Chef Edit", headerStyle: { backgroundColor: "#832e2eed" }, headerTintColor: "#ffffffff" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  // ==================== WELCOME SCREEN STYLES ====================
  // Welcome screen container
  welcomeContainer: { flex: 1, backgroundColor: "#985447ff" },
  // Background hero image on welcome screen
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  // Dark overlay on top of hero image
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  // Main welcome title text
  welcomeTitle: { color: "#ffffffff", fontSize: 34, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  // Subtitle text on welcome screen
  welcomeText: { color: "#ffffffff", fontSize: 16, textAlign: "center", marginBottom: 30 },
  // Start/explore menu button
  startButton: { backgroundColor: "#4d4132ff", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  // Start button text
  startText: { color: "#fffefdff", fontWeight: "bold", fontSize: 18 },

  // ==================== COMMON CONTAINER STYLES ====================
  // Main container for most screens
  container: { flex: 1, backgroundColor: "#f6ddddff", padding: 15 },
  // Main page title (large heading)
  mainTitle: { fontSize: 28, fontWeight: "800", color: "#312424ed", textAlign: "center" },
  // Subtitle text below main title
  subtitle: { textAlign: "center", color: "#140a0aed", marginBottom: 15, fontSize: 15 },

  // ==================== HEADER ROW & COUNTER STYLES ====================
  // Container for counter and filter button row
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  // Container for item counter display
  counterContainer: {
    backgroundColor: "#f0e6e6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d7ccc8",
  },
  // Text style for item counter
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b2e2b",
  },

  // ==================== FILTER MODAL STYLES ====================
  // Filter button style
  filterButton: {
    backgroundColor: "#9c5353ed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  // Filter button text
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Modal background overlay
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  // Modal content container
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  // Modal title text
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b2e2b",
    textAlign: "center",
    marginBottom: 20,
  },
  // Filter option labels (Category, Max Price)
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#b96f65ff",
    marginBottom: 8,
    marginTop: 10,
  },
  // Container for filter action buttons
  filterButtonsContainer: {
    marginTop: 20,
  },
  // Apply filters button
  applyButton: {
    backgroundColor: "#832e2eed",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  // Apply button text
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Reset filters button
  resetButton: {
    backgroundColor: "#b15b5bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  // Reset button text
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Cancel button in modal
  modalCancelButton: {
    backgroundColor: "#b98282ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  // Modal cancel button text
  modalCancelButtonText: {
    color: "#ffffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // ==================== MENU ITEM CARD STYLES ====================
  // Container for each menu item card
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
  // Menu item image
  cardImage: { width: "100%", height: 220 },
  // Content area of menu card (text area)
  cardContent: { padding: 15 },
  // Menu item name/title
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#4b2e2b" },
  // Menu item description text
  cardDesc: { color: "#4b2e2b", fontSize: 14, marginVertical: 5 },
  // Meta info (category, price, intensity)
  cardMeta: { color: "#4b2e2b", fontSize: 13 },
  // Remove item button (not currently used - replaced by smallButton)
  removeButton: {
    backgroundColor: "#be7777ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  // Remove button text
  removeText: { color: "#fff", fontWeight: "bold" },
  // Add item button (not currently used in current screens)
  addButton: {
    backgroundColor: "#9c5353ed",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 4,
  },
  // Add button text
  addText: { color: "#fff8e1", fontSize: 18, fontWeight: "bold" },

  // ==================== FORM STYLES (MANAGE MENU SCREEN) ====================
  // Container for form inputs - CHANGED TO PINK BACKGROUND
  formContainer: { backgroundColor: "#f6ddddff", padding:55},
  // Form header/title
  formHeader: { fontSize: 28, color: "#482a2aff", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  // Text input fields
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

 // ==================== PICKER/DROPDOWN STYLES ====================
  // Wrapper for picker component
  pickerWrapper: { marginVertical: 10 },
  // Label for picker/dropdown
  label: { fontSize: 15, fontWeight: "600", color: "#4b2e2b", marginBottom: 6, marginLeft: 4 },
  // Container for picker/dropdown
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#8d6e63",
    borderRadius: 10,
    backgroundColor: "#f4eeeeff",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  // Picker/dropdown style
  pickerStyle: {
    height: 50,
    width: "100%",
    color: "#4b2e2b",
    fontSize: 15,
    paddingHorizontal: 10,
    marginTop: Platform.OS === "ios" ? -6 : -2,
  },

  // ==================== IMAGE PREVIEW STYLES ====================
  // Preview image in manage menu form
  imagePreview: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  // Save item button in form
  saveButton: { backgroundColor: "#b15b5bff", padding: 15, borderRadius: 10, marginTop: 15, alignItems: "center" },
  // Save button text
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  // Cancel/back button in form
  cancelButton: { backgroundColor: "#b98282ff",alignItems:"center", padding: 15, borderRadius: 10, marginTop: 15 },
  // Cancel button text
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // ==================== COURSE SELECTION SCREEN STYLES ====================
  // Course category buttons (Starter, Main, etc.)
  courseButton: {
    backgroundColor: "#ffffffff",
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aa5e5eff",
  },
  // Course button text
  courseButtonText: { fontWeight: "700", fontSize: 16, color: "#432222ff" },

  // ==================== NAVIGATION BUTTON STYLES ====================
  // Primary navigation button (dark brown)
  rowButton: { backgroundColor: "#832e2eed", borderRadius: 30, paddingVertical: 14, alignItems: "center", elevation: 3 },
  // Primary navigation button text
  rowButtonText: { color: "#e9ddddff", fontSize: 16, fontWeight: "700" },

  // Secondary/back button (lighter brown)
  backButton: { backgroundColor: "#b15b5bff", borderRadius: 30, paddingVertical: 14, alignItems: "center", elevation: 3 },
  // Back button text
  backButtonText: { color: "#ffffffff", fontSize: 16, fontWeight: "700" },

  // ==================== SMALL ACTION BUTTON STYLES ====================
  // Small buttons used for Details/Remove actions on menu cards
  smallButton: { backgroundColor: "#bf8a8aff", padding: 8, borderRadius: 8 },
  // Small button text
  smallButtonText: { color: "#ffffffff", fontWeight: "700" },
});

//CODE ATTRIBUTION//

//Title:TypeScript tutorial in Visual Studio Code//
//Author:Visual studio code //
//Date:2025//
//Version:1//
//Available:https://code.visualstudio.com/docs/typescript/typescript-tutorial//
//Date accessed:20/10/2025//

//Title:IIE Module Manual 2025 //
//Author:The Independant Institute of Education //
//Date:2025//
//Version:1//
//Available:https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7BC4AAF478-96AC-4469-8005-F7CDC4A15EBB%7D&file=MAST5112MM.docx&action=default&mobileredirect=true//
//Date accessed:20/10/2025//

//Title:Build a React Native Picker: Tutorial With Examples //
//Author:Tricentis Waldo //
//Date:2025//
//Version://
//Available:https://www.waldo.com/blog/build-a-react-native-picker-tutorial-with-examples//
//Date accessed:22/10/2025//

//Title:Navigating Between Screens//
//Author: React Native//
//Date:2025//
//Version:1 //
//Available:https://reactnative.dev/docs/navigation//
//Date accessed:21/10/2025//

//Title:StyleSheet//
//Author:React Native //
//Date:2025//
//Version:1//
//Available:https://reactnative.dev/docs/stylesheet//
//Date accessed:21/10/2025//

