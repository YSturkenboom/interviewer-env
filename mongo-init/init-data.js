// MongoDB initialization script for pizza store environment
// This script runs automatically when MongoDB container starts for the first time

// Switch to the pizza store database
db = db.getSiblingDB("testdb");

// Create Users collection with admin and user accounts
// Password "test1234" hashed using bcrypt with salt rounds 10
db.users.insertMany([
  {
    _id: ObjectId(),
    email: "admin@example.com",
    password: "$2b$10$K8BEQNhKU4WkW5pDGj5K8eHXqFAR9dT3JxY9vCjWsN.tLqE2Fz3wO", // test1234
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    email: "user@example.com", 
    password: "$2b$10$K8BEQNhKU4WkW5pDGj5K8eHXqFAR9dT3JxY9vCjWsN.tLqE2Fz3wO", // test1234
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create Pizzas collection with 50 different pizzas
db.pizzas.insertMany([
  {
    _id: ObjectId(),
    name: "Margherita Classic",
    price: 118,
    ingredients: ["Cheese", "Tomato", "Crust"],
    veg: true,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Margherita 727",
    price: 118,
    ingredients: ["Cheese", "Tomato", "Crust"],
    veg: false,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Pepperoni Supreme",
    price: 145,
    ingredients: ["Cheese", "Tomato", "Crust", "Pepperoni"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Veggie Delight",
    price: 132,
    ingredients: ["Cheese", "Tomato", "Crust", "Bell Peppers", "Mushrooms", "Onions"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Hawaiian Paradise",
    price: 158,
    ingredients: ["Cheese", "Tomato", "Crust", "Ham", "Pineapple"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "BBQ Chicken",
    price: 175,
    ingredients: ["Cheese", "BBQ Sauce", "Crust", "Chicken", "Onions"],
    veg: false,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Meat Lovers",
    price: 195,
    ingredients: ["Cheese", "Tomato", "Crust", "Pepperoni", "Sausage", "Ham", "Bacon"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Mediterranean",
    price: 168,
    ingredients: ["Cheese", "Tomato", "Crust", "Olives", "Feta", "Spinach"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Buffalo Chicken",
    price: 182,
    ingredients: ["Cheese", "Buffalo Sauce", "Crust", "Chicken", "Celery"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Four Cheese",
    price: 155,
    ingredients: ["Mozzarella", "Cheddar", "Parmesan", "Gouda", "Crust"],
    veg: true,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Spicy Italian",
    price: 172,
    ingredients: ["Cheese", "Tomato", "Crust", "Salami", "Pepperoni", "Jalapeños"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Garden Fresh",
    price: 142,
    ingredients: ["Cheese", "Tomato", "Crust", "Tomatoes", "Basil", "Arugula"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Mushroom Truffle",
    price: 189,
    ingredients: ["Cheese", "White Sauce", "Crust", "Mushrooms", "Truffle Oil"],
    veg: true,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Seafood Special",
    price: 215,
    ingredients: ["Cheese", "Tomato", "Crust", "Shrimp", "Calamari", "Garlic"],
    veg: false,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Prosciutto Fig",
    price: 198,
    ingredients: ["Cheese", "White Sauce", "Crust", "Prosciutto", "Figs", "Arugula"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Veggie Supreme",
    price: 162,
    ingredients: ["Cheese", "Tomato", "Crust", "Bell Peppers", "Mushrooms", "Onions", "Olives"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Chicken Alfredo",
    price: 178,
    ingredients: ["Cheese", "Alfredo Sauce", "Crust", "Chicken", "Spinach"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Taco Pizza",
    price: 165,
    ingredients: ["Cheese", "Salsa", "Crust", "Ground Beef", "Lettuce", "Tomatoes"],
    veg: false,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Pesto Chicken",
    price: 185,
    ingredients: ["Cheese", "Pesto Sauce", "Crust", "Chicken", "Sun-dried Tomatoes"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "White Pizza",
    price: 148,
    ingredients: ["Ricotta", "Mozzarella", "Crust", "Garlic", "Herbs"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Sausage & Peppers",
    price: 159,
    ingredients: ["Cheese", "Tomato", "Crust", "Italian Sausage", "Bell Peppers"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Spinach Artichoke",
    price: 155,
    ingredients: ["Cheese", "White Sauce", "Crust", "Spinach", "Artichokes"],
    veg: true,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Bacon Ranch",
    price: 172,
    ingredients: ["Cheese", "Ranch Dressing", "Crust", "Bacon", "Chicken"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Greek Style",
    price: 168,
    ingredients: ["Cheese", "Tomato", "Crust", "Feta", "Olives", "Onions"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Philly Cheesesteak",
    price: 189,
    ingredients: ["Cheese", "White Sauce", "Crust", "Steak", "Peppers", "Onions"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Caprese",
    price: 152,
    ingredients: ["Mozzarella", "Tomato", "Crust", "Fresh Basil", "Balsamic"],
    veg: true,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Breakfast Pizza",
    price: 175,
    ingredients: ["Cheese", "White Sauce", "Crust", "Eggs", "Bacon", "Sausage"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Thai Chicken",
    price: 192,
    ingredients: ["Cheese", "Peanut Sauce", "Crust", "Chicken", "Bean Sprouts"],
    veg: false,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Pulled Pork",
    price: 182,
    ingredients: ["Cheese", "BBQ Sauce", "Crust", "Pulled Pork", "Coleslaw"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Goat Cheese & Honey",
    price: 165,
    ingredients: ["Goat Cheese", "Honey", "Crust", "Walnuts", "Arugula"],
    veg: true,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Chicken Parmesan",
    price: 178,
    ingredients: ["Cheese", "Tomato", "Crust", "Breaded Chicken", "Parmesan"],
    veg: false,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Eggplant Parmesan",
    price: 162,
    ingredients: ["Cheese", "Tomato", "Crust", "Eggplant", "Parmesan"],
    veg: true,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Salmon & Dill",
    price: 225,
    ingredients: ["Cream Cheese", "Dill", "Crust", "Smoked Salmon", "Capers"],
    veg: false,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Duck Confit",
    price: 235,
    ingredients: ["Cheese", "Orange Sauce", "Crust", "Duck Confit", "Cranberries"],
    veg: false,
    available: true,
    image: "pizza2.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Ratatouille",
    price: 148,
    ingredients: ["Cheese", "Tomato", "Crust", "Zucchini", "Eggplant", "Peppers"],
    veg: true,
    available: true,
    image: "pizza3.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Chorizo & Manchego",
    price: 195,
    ingredients: ["Manchego", "Tomato", "Crust", "Chorizo", "Roasted Peppers"],
    veg: false,
    available: true,
    image: "pizza4.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Vegan Deluxe",
    price: 155,
    ingredients: ["Vegan Cheese", "Tomato", "Crust", "Mushrooms", "Peppers", "Onions"],
    veg: true,
    available: true,
    image: "pizza1.jpeg",
    __v: 0
  },
  {
    _id: ObjectId(),
    name: "Lamb & Rosemary",
    price: 215,
    ingredients: ["Cheese", "Tomato", "Crust", "Lamb
]);

// Create empty Orders collection (structure defined but no data)
// This collection will be populated when orders are placed
db.createCollection("orders");

// Create indexes for performance optimization

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Pizzas collection indexes
db.pizzas.createIndex({ name: 1 });
db.pizzas.createIndex({ available: 1 });
db.pizzas.createIndex({ veg: 1 });
db.pizzas.createIndex({ price: 1 });
db.pizzas.createIndex({ name: "text", ingredients: "text" }); // Text search

// Orders collection indexes (for future use)
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ orderDate: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

// Compound indexes for common query patterns
db.pizzas.createIndex({ available: 1, veg: 1, price: 1 });

// Create user for the pizza store database with readWrite access
db.createUser({
  user: "pizzauser",
  pwd: "pizzapass",
  roles: [
    {
      role: "readWrite",
      db: "testdb",
    },
  ],
});

print("🍕 Pizza store database initialized successfully!");
print("📊 Collections created: users, pizzas, orders");
print("📈 Sample data inserted:");
print("   - Users: " + db.users.countDocuments());
print("   - Pizzas: " + db.pizzas.countDocuments());
print("   - Orders: " + db.orders.countDocuments());
print("🔍 Indexes created for optimized queries");
print("🚀 Ready for pizza store operations!");
print("");
print("👤 User credentials:");
print("   Admin: admin@example.com / test1234");
print("   User: user@example.com / test1234");
print("   DB User: pizzauser / pizzapass");