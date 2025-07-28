// MongoDB initialization script for pizza store environment
// This script runs automatically when MongoDB container starts for the first time

const bcryptHashes = {
  admin: '$2a$10$tfZPDNbG3fnnrWZYqEGDleQ8bGwCFLnOQDMYe.Xin3aDMDWLes/wS', // test1234
  user: '$2a$10$lqnCcfy17QPRhMgzaEl9nu/QFs.xFJ1tYEdM0UI/1wqKSmaSKSsMe'   // test1234
};

// Switch to the pizza store database
db = db.getSiblingDB("testdb");

// Pizza name generators
const vegPizzaNames = [
  'Margherita Classic', 'Veggie Delight', 'Cheese Burst', 'Garden Fresh',
  'Mediterranean Veggie', 'Spinach & Feta', 'Four Cheese', 'Pesto Paradise',
  'Roasted Vegetable', 'Caprese', 'Truffle Mushroom', 'Artichoke Delight',
  'Greek Goddess', 'Veggie Supreme', 'Farm Fresh', 'Paneer Tikka',
  'Mexican Veggie', 'Thai Veggie', 'Corn & Capsicum', 'Olive Special',
  'Zucchini Zoom', 'Avocado Dream', 'Ultimate Veggie', 'Yellow Pepper Special',
  'Zero Meat Hero'
];

const nonVegPizzaNames = [
  'Pepperoni Classic', 'BBQ Chicken', 'Meat Lovers', 'Hawaiian',
  'Bacon Ranch', 'Buffalo Chicken', 'Supreme', 'Chicken Tikka',
  'Sausage Sensation', 'Ham & Pineapple', 'Spicy Italian', 'Chicken Fajita',
  'Seafood Special', 'Prawn Delight', 'Tuna Melt', 'Beef Bonanza',
  'Pulled Pork', 'Chorizo Fire', 'Duck Deluxe', 'Lamb Kofta',
  'Smoky BBQ Beef', 'Triple Meat', 'Ultimate Non-Veg', 'Xtra Meat Xplosion',
  'Zesty Chicken'
];

const descriptions = [
  'A classic Italian favorite with fresh ingredients',
  'Loaded with premium toppings and extra cheese',
  'Our signature recipe passed down through generations',
  'Hand-tossed dough with authentic flavors',
  'Made with locally sourced ingredients',
  'A perfect blend of spices and fresh herbs',
  'Crispy crust with generous toppings',
  'Chef\'s special recipe with secret sauce',
  'Traditional wood-fired oven baked',
  'A delightful combination of flavors'
];

// Create Users collection with admin and user accounts
db.users.insertMany([
  {
    _id: ObjectId(),
    email: "admin@example.com",
    password: bcryptHashes.admin,
    name: "Admin User",
    role: "admin",
    address: "123 Main St, Anytown, USA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    email: "user@example.com",
    password: bcryptHashes.user,
    name: "Test User",
    role: "user",
    address: "123 Main St, Anytown, USA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    email: "testuser1@example.com",
    password: bcryptHashes.user,
    name: "Test User 1",
    role: "user",
    address: "123 Main St, Anytown, USA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    email: "testuser2@example.com",
    password: bcryptHashes.user,
    name: "Test User 2",
    role: "user",
    address: "123 Main St, Anytown, USA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Create Pizzas collection with vegetarian pizzas
const vegPizzas = [];
for (let i = 0; i < vegPizzaNames.length; i++) {
  const basePrice = 8.99 + (i * 0.6);
  const price = Math.round(basePrice * 100) / 100;
  const daysAgo = Math.floor(Math.random() * 60);
  
  vegPizzas.push({
    _id: ObjectId(),
    name: vegPizzaNames[i],
    price: price,
    description: descriptions[i % descriptions.length],
    imageUrl: `https://images.unsplash.com/photo-${1565299624 + i}-pizza?w=400&h=300&fit=crop`,
    isVegetarian: true,
    createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    __v: 0,
  });
}

// Create non-vegetarian pizzas
const nonVegPizzas = [];
for (let i = 0; i < nonVegPizzaNames.length; i++) {
  const basePrice = 10.99 + (i * 0.7);
  const price = Math.round(basePrice * 100) / 100;
  const daysAgo = Math.floor(Math.random() * 60);
  
  nonVegPizzas.push({
    _id: ObjectId(),
    name: nonVegPizzaNames[i],
    price: price,
    description: descriptions[i % descriptions.length],
    imageUrl: `https://images.unsplash.com/photo-${1574126154 + i}-pizza?w=400&h=300&fit=crop`,
    isVegetarian: false,
    createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    __v: 0,
  });
}

// Add edge case pizzas
const edgeCasePizzas = [
  {
    _id: ObjectId(),
    name: 'Super Long Pizza Name That Tests UI Boundaries And Text Wrapping In Components',
    price: 15.99,
    description: 'A pizza with an extremely long name to test UI limits',
    imageUrl: 'https://images.unsplash.com/photo-1565299624-pizza?w=400&h=300&fit=crop',
    isVegetarian: true,
    createdAt: new Date(),
    __v: 0,
  },
  {
    _id: ObjectId(),
    name: 'Special @#$% Characters Pizza!',
    price: 0.01,
    description: 'Testing special characters and minimum price',
    imageUrl: 'https://images.unsplash.com/photo-1565299625-pizza?w=400&h=300&fit=crop',
    isVegetarian: false,
    createdAt: new Date(),
    __v: 0,
  },
  {
    _id: ObjectId(),
    name: 'Premium Luxury Pizza',
    price: 999.99,
    description: 'The most expensive pizza for testing price boundaries',
    imageUrl: 'https://images.unsplash.com/photo-1565299626-pizza?w=400&h=300&fit=crop',
    isVegetarian: true,
    createdAt: new Date(),
    __v: 0,
  }
];

// Insert all pizzas
db.pizzas.insertMany([...vegPizzas, ...nonVegPizzas, ...edgeCasePizzas]);

// Create Orders collection with sample orders
const users = db.users.find().toArray();
const pizzas = db.pizzas.find().toArray();
const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const statusCounts = { pending: 5, confirmed: 3, preparing: 2, out_for_delivery: 2, delivered: 5, cancelled: 1 };

const orders = [];
let orderIndex = 0;

// Generate orders for each status
for (const [status, count] of Object.entries(statusCounts)) {
  for (let i = 0; i < count; i++) {
    const user = users[orderIndex % users.length];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const pizza = pizzas[Math.floor(Math.random() * pizzas.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = pizza.price * quantity;
      totalAmount += itemTotal;
      
      items.push({
        id: pizza._id.toString(),
        name: pizza.name,
        price: pizza.price,
        quantity: quantity
      });
    }
    
    const daysAgo = status === 'pending' ? Math.random() * 0.01 : Math.random() * 30;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000);
    
    const order = {
      _id: ObjectId(),
      user: user._id,
      items: items,
      status: status,
      deliveryAddress: `${100 + orderIndex} Main Street, City, State ${10000 + orderIndex}`,
      totalAmount: Math.round(totalAmount * 100) / 100,
      createdAt: createdAt,
      updatedAt: updatedAt
    };
    
    // Add complaints to some delivered orders
    if (status === 'delivered' && i < 2) {
      order.complaint = {
        complaintType: ['Quality Issue', 'Delivery Problem', 'Wrong Order'][i % 3],
        description: 'This is a test complaint for e2e testing purposes with more than 20 characters',
        email: user.email,
        phone: '+919876543210',
        createdAt: new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    
    orders.push(order);
    orderIndex++;
  }
}

// Add some very recent orders for polling tests
for (let i = 0; i < 3; i++) {
  const user = users[i % users.length];
  const pizza = pizzas[i];
  
  orders.push({
    _id: ObjectId(),
    user: user._id,
    items: [{
      id: pizza._id.toString(),
      name: pizza.name,
      price: pizza.price,
      quantity: 1
    }],
    status: 'pending',
    deliveryAddress: `${200 + i} Test Avenue, Test City, TS 20000`,
    totalAmount: pizza.price,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Insert all orders
db.orders.insertMany(orders);

// Create indexes for performance optimization

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Pizzas collection indexes
db.pizzas.createIndex({ name: 1 });
db.pizzas.createIndex({ isVegetarian: 1 });
db.pizzas.createIndex({ price: 1 });
db.pizzas.createIndex({ name: "text", description: "text" }); // Text search

// Orders collection indexes
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ status: 1 });

// Compound indexes for common query patterns
db.pizzas.createIndex({ isVegetarian: 1, price: 1 });

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

print("🍕 Angular Pizza store database initialized successfully!");
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
print("   Test Users: testuser1@example.com, testuser2@example.com / test1234");
print("   DB User: pizzauser / pizzapass");
print("");
print("🍕 Pizza Summary:");
print(`   - Vegetarian: ${vegPizzaNames.length}`);
print(`   - Non-Vegetarian: ${nonVegPizzaNames.length}`);
print("   - Edge Cases: 3 (long names, special chars, high price)");
print("📦 Orders: 21 (various statuses including recent ones for polling)");