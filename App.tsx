import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
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
  Dimensions,
  Animated,
} from "react-native";

// React Navigation imports (for screen navigation)
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

// Dropdown selector for category choices
import { Picker } from "@react-native-picker/picker";

const { width: screenWidth } = Dimensions.get('window');

// ------------------ Type Definitions ------------------
// Define the structure of a single menu item object
export type MenuItem = {
  id: string;
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
  HomeScreen: undefined;
  CourseSelectionScreen: undefined;
  DishDetailsScreen: { item: MenuItem } | undefined;
  FilteredResultsScreen:
  | {
    items: MenuItem[];
    filterCourse?: string;
    maxPrice?: number;
  }
  | undefined;
  ManageScreen: undefined;
};

// ------------------ Initial Data ------------------
const predefinedItems: MenuItem[] = [
  {
    id: "1",
    itemName: "Grilled Calamari",
    description: "Grilled calamari with lemon and cilantro",
    category: "Starter",
    price: 55,
    intensity: "Mild",
    image: "https://www.thetastychilli.com/wp-content/uploads/2022/01/grilled-calamari-rings-lemon.jpg",
    ingredients: ["Raw calamari rings", "Lemon juice", "Olive oil", "Dried oregano", "Garlic", "Red pepper flakes", "Cilantro", "Black pepper", "Seasalt flakes"],
  },
  {
    id: "2",
    itemName: "Chicken wings",
    description: "Soy glazed crispy chicken wings, topped with sesame seeds & coriander",
    category: "Starter",
    price: 70,
    intensity: "Medium",
    image: "https://www.allrecipes.com/thmb/3sjLmvPzxHf3ID4-XqjsHeXcxrg=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-230873-amazing-and-easy-chicken-wings-ddmfs-4x3-8612d3a676444dc8b5e7933cf53be575.jpg",
    ingredients: ["Chicken wings", "Soy sauce", "Sugar", "Sesame seeds", "Cilantro"],
  },
  {
    id: "3",
    itemName: "Wagyu beef potstickers",
    description: "Seared & steamed. Served with kimchi & Indonesian soya dipping sauce",
    category: "Starter",
    price: 85,
    intensity: "Medium",
    image: "https://tarasmulticulturaltable.com/wp-content/uploads/2019/02/Wagyu-Beef-Dumplings-10-of-10.jpg",
    ingredients: ["Wagyu beef", "Soy sauce", "Black pepper", "Gyoza wrappers", "Rosemary"],
  },
  {
    id: "4",
    itemName: "Prawn pasta",
    description: "Fresh tagliatelle, with whole fried prawns, Parmesan, parsley, chilli & garlic butter",
    category: "Main",
    price: 175,
    intensity: "Medium",
    image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/prawn-harissa-spaghetti-d29786f.jpg?quality=90&webp=true&resize=440,400",
    ingredients: ["Tagliatelle", "Prawns", "Parmesan Cheese", "Parsley", "Chilli Pepper", "Garlic butter"],
  },
  {
    id: "5",
    itemName: "Earth & Ocean",
    description: "Grilled beef rib eye steak & prawns with lemon & herb butter, served with your choice of side",
    category: "Main",
    price: 195,
    intensity: "Mild",
    image: "https://cookingwithcurls.com/wp-content/uploads/2013/05/Grilled-Steak-and-Shrimp.-cookingwithcurls.com_.jpg",
    ingredients: ["Beef Rib Eye Steak", "Prawns", "Butter", "Lemon", "Herbs"],
  },
  {
    id: "6",
    itemName: "Crispy chicken burger",
    description: "Toasted artisan brioche bun, crunchy chicken breast, butter lettuce, avo, tomato, burger sauce, served with your choice of side",
    category: "Main",
    price: 167,
    intensity: "Mild",
    image: "https://i.pinimg.com/736x/4e/82/e1/4e82e1301bb30942fa4e7c78754aa45f.jpg",
    ingredients: ["Brioche Bun", "Chicken Breast", "Butter Lettuce", "Avocado", "Tomato", "Burger Sauce"],
  },
  {
    id: "7",
    itemName: "Mocha Affogato",
    description: "Vanilla bean ice cream served on chocolate ganache with a double shot of espresso & hazelnut praline",
    category: "Dessert",
    price: 50,
    image: "https://foodandtravel.com/assets/img/content/recipes/Mocha-affogato.jpg",
    ingredients: ["Vanilla Bean Ice Cream", "Chocolate Ganache", "Espresso", "Hazelnut Praline"],
  },
  {
    id: "8",
    itemName: "Chocolate Brownie with Honeycomb Crunch",
    description: "Dark chocolate brownie with caramel honeycomb crunch & Jack Daniels butterscotch sauce, served with vanilla bean ice cream",
    category: "Dessert",
    price: 70,
    image: "https://mymorningmocha.com/wp-content/uploads/2022/07/Honeycomb-brownie-recipe.jpg",
    ingredients: ["Dark Chocolate Brownie", "Caramel Honeycomb Crunch", "Jack Daniels Butterscotch Sauce", "Vanilla Bean Ice Cream"],
  },
  {
    id: "9",
    itemName: "Ginger & Miso Caramel Cheesecake",
    description: "A creamy salted miso caramel cheesecake with a hint of orange on ginger biscuit crust",
    category: "Dessert",
    price: 105,
    image: "https://www.marionskitchen.com/wp-content/uploads/2021/08/MIso-Caramel-Cheesecake1957.jpeg",
    ingredients: ["Vanilla Bean Ice Cream", "Chocolate Ganache", "Espresso", "Hazelnut Praline"],
  },
  {
    id: "10",
    itemName: "Churros",
    description: "Dusted in sugar, cinnamon served with a dark chocolate ganache dip",
    category: "Dessert",
    price: 70,
    image: "https://stellanspice.com/wp-content/uploads/2021/12/IMG_0808-1-1154x1536.jpg",
    ingredients: ["Sugar", "Cinnamon", "Dark Chocolate Ganache"],
  },
  {
    id: "11",
    itemName: "Garlic Potato Mash",
    description: "Creamy potato mash infused with roasted garlic",
    category: "Sides",
    price: 45,
    intensity: "Mild",
    image: "https://www.allrecipes.com/thmb/QH_JKQhpxGnX247VU58OVkOW0g8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/18290-garlic-mashed-potatoes-ddmfs-beauty2-4x3-0327-2-47384a10cded40ae90e574bc7fdb9433.jpg",
    ingredients: ["Potatoes", "Garlic", "Cream", "Butter"],
  },
  {
    id: "12",
    itemName: "Kimchi Mac & cheese",
    description: "Classic Mac & cheese with a twist of kimchi & a crunchy gratin topping",
    category: "Sides",
    price: 65,
    intensity: "Hot",
    image: "https://takestwoeggs.com/wp-content/uploads/2021/11/Kimchi-Mac-and-Cheese-Takestwoeggs-FINAL-sq.jpg",
    ingredients: ["Potatoes", "Garlic", "Cream", "Butter"],
  },
  {
    id: "13",
    itemName: "Smashed Cucumber Salad",
    description: "Crushed cucumber soaked in spicy Korean dressing with toasted sesame seeds",
    category: "Sides",
    price: 50,
    intensity: "Medium",
    image: "https://healthynibblesandbits.com/wp-content/uploads/2021/07/Smashed-Cucumber-Salad-6.jpg",
    ingredients: ["Cucumber", "Korean Chili Flakes (Gochugaru)", "Soy Sauce", "Vinegar", "Sesame Seeds", "Garlic", "Sugar", "Sesame Oil"],
  },
  {
    id: "14",
    itemName: "Crispy Patatas Bravas",
    description: "Spiced potatoes with aioli & bravas sauce",
    category: "Sides",
    price: 70,
    intensity: "Medium",
    image: "https://img-cdn.oliveoiltimes.com/cb:2sys.247e0/w:1620/h:1080/q:67/ig:avif/id:203914907dbe14c81bbba48b29665010/https://www.oliveoiltimes.com/brava.jpg",
    ingredients: ["Potatoes", "Paprika", "Garlic", "Olive Oil", "Mayonnaise", "Tomato", "Chili"],
  },
];

// ------------------ Utility Functions ------------------
const MenuUtils = {
  // Function to search items by name or description
  searchItems: (items: MenuItem[], searchTerm: string): MenuItem[] => {
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.itemName.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.ingredients?.some(ingredient => ingredient.toLowerCase().includes(term))
    );
  },

  // Function to validate menu item
  validateMenuItem: (item: Partial<MenuItem>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!item.itemName || item.itemName.trim().length === 0) {
      errors.push("Item name is required");
    }
    
    if (!item.description || item.description.trim().length === 0) {
      errors.push("Description is required");
    }
    
    if (!item.category || item.category.trim().length === 0) {
      errors.push("Category is required");
    }
    
    if (!item.price || item.price <= 0) {
      errors.push("Price must be greater than 0");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Function to generate unique ID
  generateId: (): string => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Function to sort items by various criteria
  sortItems: (items: MenuItem[], criteria: 'name' | 'price' | 'category'): MenuItem[] => {
    const sorted = [...items];
    
    switch (criteria) {
      case 'name':
        sorted.sort((a, b) => a.itemName.localeCompare(b.itemName));
        break;
      case 'price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }
    
    return sorted;
  },
};

// ------------------ Global State Management ------------------
const AppContext = React.createContext<{
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updatedItem: Partial<MenuItem>) => void;
  searchItems: (searchTerm: string) => MenuItem[];
}>({
  items: [],
  addItem: () => { },
  removeItem: () => { },
  updateItem: () => { },
  searchItems: () => [],
});

const useApp = () => React.useContext(AppContext);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(predefinedItems);

  const addItem = (item: MenuItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => setItems(prev => prev.filter(item => item.id !== id))
      },
    ]);
  };

  // Function to update existing item
  const updateItem = (id: string, updatedItem: Partial<MenuItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
  };

  // Search function using MenuUtils
  const searchItems = (searchTerm: string) => {
    return MenuUtils.searchItems(items, searchTerm);
  };

  return (
    <AppContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateItem,
      searchItems,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ------------------ Average Price Carousel Component ------------------
function AveragePriceCarousel({ averagePrices }: { averagePrices: { [key: string]: number } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const averagePriceData = Object.entries(averagePrices).map(([category, average]) => ({
    category,
    average: Math.round(average),
  }));

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const renderItem = ({ item, index }: { item: { category: string; average: number }; index: number }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.carouselCategory}>{item.category}</Text>
      <Text style={styles.carouselPrice}>R{item.average}</Text>
      <Text style={styles.carouselLabel}>Average Price</Text>
    </View>
  );

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {averagePriceData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index ? styles.paginationDotActive : styles.paginationDotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>Average Prices by Course</Text>
      
      <FlatList
        ref={flatListRef}
        data={averagePriceData}
        renderItem={renderItem}
        keyExtractor={(item) => item.category}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      />
      
      {renderPagination()}
    </View>
  );
}

// ------------------ Search Component ------------------
function SearchBar({ onSearch }: { onSearch: (results: MenuItem[]) => void }) {
  const { searchItems } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const results = searchItems(text);
    onSearch(results);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name/description/ingredients"
        value={searchTerm}
        onChangeText={handleSearch}
      />
    </View>
  );
}

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
        <Text style={styles.welcomeTitle}>Welcome to Christoffel's Culinary Experience</Text>
        <Text style={styles.welcomeText}>Where every flavor tells a story</Text>
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

// Main Home Screen
function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "HomeScreen">) {
  const { items, removeItem } = useApp();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(items);
  const [sortCriteria, setSortCriteria] = useState<'name' | 'price' | 'category'>('name');

  // Calculate average prices by category
  const calculateAveragePrices = () => {
    const categories = Array.from(new Set(items.map(item => item.category)));
    const averages: { [key: string]: number } = {};
    
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category);
      const total = categoryItems.reduce((sum, item) => sum + item.price, 0);
      averages[category] = total / categoryItems.length;
    });
    
    return averages;
  };

  const averagePrices = calculateAveragePrices();

  // Update filtered items when items or filters change
  React.useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, maxPrice, sortCriteria]);

  const applyFilters = () => {
    let filtered = [...items];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      filtered = filtered.filter(item => item.price <= maxPriceValue);
    }

    // Apply sorting (only ascending now)
    filtered = MenuUtils.sortItems(filtered, sortCriteria);
    
    setFilteredItems(filtered);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setMaxPrice("");
    setSortCriteria('name');
    setFilterModalVisible(false);
  };

  const handleSearch = (results: MenuItem[]) => {
    setFilteredItems(results);
  };

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];

  return (
    <SafeAreaView style={styles.container}>
      {/* Average Price Carousel */}
      <View style={styles.carouselWrapper}>
        <AveragePriceCarousel averagePrices={averagePrices} />
      </View>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

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
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Enhanced Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Menu</Text>

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

            <Text style={styles.filterLabel}>Max Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter max price (e.g., 100)"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />

            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sortCriteria}
                onValueChange={(itemValue) => setSortCriteria(itemValue)}
                style={styles.pickerStyle}
              >
                <Picker.Item label="Name" value="name" />
                <Picker.Item label="Price" value="price" />
                <Picker.Item label="Category" value="category" />
              </Picker>
            </View>

            <View style={styles.filterButtonsContainer}>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset All</Text>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.smallButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/*View Courses button at the bottom of Home Screen */}
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() => navigation.navigate("CourseSelectionScreen")}
        >
          <Text style={styles.rowButtonText}>View Courses</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Course Selection Screen
function CourseSelectionScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "CourseSelectionScreen">) {
  const { items } = useApp();

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

      {/* Edit Menu button on Course Selection Screen */}
      <TouchableOpacity
        style={[styles.rowButton, { marginTop: 20 }]}
        onPress={() => navigation.navigate("ManageScreen")}
      >
        <Text style={styles.rowButtonText}>Edit Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Dish Details Screen
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

// Filtered Results Screen
function FilteredResultsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, "FilteredResultsScreen">) {
  const { items } = useApp();
  const filterCourse = route.params?.filterCourse;
  const maxPrice = route.params?.maxPrice;

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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
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

// Manage Menu Screen
function ManageMenuScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "ManageScreen">) {
  const { addItem } = useApp();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = () => {
    // Use the validation function
    const validation = MenuUtils.validateMenuItem({
      itemName,
      description,
      category,
      price: parseFloat(price)
    });

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join('\n'));
      return;
    }

    const priceValue = parseFloat(price);
    if (priceValue > 0) {
      const intensity = priceValue < 45 ? "Mild" : priceValue < 65 ? "Balanced" : "Strong";

      const newItem: MenuItem = {
        id: MenuUtils.generateId(), // Use the new ID generator
        itemName,
        description,
        category,
        price: priceValue,
        intensity,
        image: image || "https://via.placeholder.com/300x200?text=No+Image",
        ingredients: ingredients.split(",").map((i) => i.trim()),
      };

      addItem(newItem);
      Alert.alert("Success", "Menu item added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setItemName("");
            setDescription("");
            setPrice("");
            setImage("");
            setIngredients("");
            setCategory("");
            navigation.navigate("HomeScreen");
          }
        }
      ]);
    } else {
      Alert.alert("Invalid Price", "Price must be greater than 0");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formHeader}>Add New Menu Item</Text>

          <TextInput style={styles.input} placeholder="Item Name *" value={itemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Description *" value={description} onChangeText={setDescription} />

          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value: string) => setCategory(value)}
                mode="dropdown"
                dropdownIconColor="#4b2e2b"
                style={styles.pickerStyle}
                itemStyle={{ height: 50 }}
              >
                <Picker.Item label="Select Category *" value="" enabled={false} />
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main Course" value="Main" />
                <Picker.Item label="Dessert" value="Dessert" />
                <Picker.Item label="Sides" value="Sides" />
                <Picker.Item label="Beverage" value="Beverage" />
              </Picker>
            </View>
          </View>

          <TextInput style={styles.input} placeholder="Price * (e.g. 50)" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <TextInput style={styles.input} placeholder="Ingredients (comma separated)" value={ingredients} onChangeText={setIngredients} />
          <TextInput style={styles.input} placeholder="Image URL" value={image} onChangeText={setImage} />

          {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ------------------ App Entry & Navigation Setup ------------------
export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen">
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
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
            options={{
              title: "Add New Item",
              headerStyle: { backgroundColor: "#832e2eed" },
              headerTintColor: "#ffffffff"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

// ------------------ Updated Styles ------------------
const styles = StyleSheet.create({
  welcomeContainer: { flex: 1, backgroundColor: "#985447ff" },
  heroImage: { width: "100%", height: "100%", position: "absolute" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  welcomeTitle: { 
  color: "#ffffffff", 
  fontSize: 34, 
  fontWeight: "700", 
  textAlign: "center", 
  marginBottom: 10 
},
welcomeText: { 
  color: "#ffffffff", 
  fontSize: 16, 
  textAlign: "center", 
  marginBottom: 30 
},
startButton: { 
  backgroundColor: "transparent", 
  paddingVertical: 14, 
  paddingHorizontal: 40, 
  borderRadius: 35,
  borderWidth: 3,
  borderColor: '#ffffff',
},
startText: { 
  color: "#fffefdff", 
  fontWeight: "bold", 
  fontSize: 18 
},
container: { 
  flex: 1, 
  backgroundColor: "#f6ddddff", 
  padding: 15 
},
mainTitle: { 
  fontSize: 28, 
  fontWeight: "800", 
  color: "#312424ed", 
  textAlign: "center" 
},
subtitle: { 
  textAlign: "center", 
  color: "#140a0aed", 
  marginBottom: 15, 
  fontSize: 15 
},

  // Carousel Wrapper for better positioning
  carouselWrapper: {
    marginTop: 20, 
    marginBottom: 15,
  },
  
  // Carousel Styles
  carouselContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 120,
  },
  carouselTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b2e2b",
    textAlign: "center",
    marginBottom: 8,
  },
  carouselItem: {
    width: screenWidth - 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  carouselCategory: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#832e2eed",
    marginBottom: 6,
  },
  carouselPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4b2e2b",
    marginBottom: 2,
  },
  carouselLabel: {
    fontSize: 12,
    color: "#6c757d",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#832e2eed",
  },
  paginationDotInactive: {
    backgroundColor: "#d7ccc8",
  },
  
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#8d6e63",
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
  },
  
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  counterContainer: {
    backgroundColor: "#f0e6e6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d7ccc8",
  },
  counterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b2e2b",
  },
  filterButton: {
    backgroundColor: "#9c5353ed",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b2e2b",
    textAlign: "center",
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#b96f65ff",
    marginBottom: 8,
    marginTop: 10,
  },
  filterButtonsContainer: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#832e2eed",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#b15b5bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: "#b98282ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#ffffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
  cardDesc: { color: "#4b2e2b", fontSize: 14, marginVertical: 5 },
  cardMeta: { color: "#4b2e2b", fontSize: 13 },
  removeButton: {
    backgroundColor: "#be7777ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  removeText: { color: "#fff", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#9c5353ed",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 4,
  },
  addText: { color: "#fff8e1", fontSize: 18, fontWeight: "bold" },
  formContainer: { backgroundColor: "#f6ddddff", padding: 55 },
  formHeader: { fontSize: 28, color: "#482a2aff", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
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
  pickerWrapper: { marginVertical: 10 },
  label: { fontSize: 15, fontWeight: "600", color: "#4b2e2b", marginBottom: 6, marginLeft: 4 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#8d6e63",
    borderRadius: 10,
    backgroundColor: "#f4eeeeff",
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
  saveButton: { backgroundColor: "#b15b5bff", padding: 15, borderRadius: 10, marginTop: 15, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: { backgroundColor: "#b98282ff", alignItems: "center", padding: 15, borderRadius: 10, marginTop: 15 },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  courseButton: {
    backgroundColor: "#ffffffff",
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aa5e5eff",
  },
  courseButtonText: { fontWeight: "700", fontSize: 16, color: "#432222ff" },
  rowButton: { backgroundColor: "#832e2eed", borderRadius: 30, paddingVertical: 14, alignItems: "center", elevation: 3 },
  rowButtonText: { color: "#e9ddddff", fontSize: 16, fontWeight: "700" },
  backButton: { backgroundColor: "#b15b5bff", borderRadius: 30, paddingVertical: 14, alignItems: "center", elevation: 3 },
  backButtonText: { color: "#ffffffff", fontSize: 16, fontWeight: "700" },
  smallButton: { backgroundColor: "#bf8a8aff", padding: 8, borderRadius: 8 },
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

