// MongoDB initialization script for interview environment
// This script runs automatically when MongoDB container starts for the first time

// Switch to the interview database
db = db.getSiblingDB('testdb');

// Create Users collection with sample data
db.users.insertMany([
    {
        _id: ObjectId(),
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        role: "senior_developer",
        skills: ["JavaScript", "Python", "MongoDB", "React", "Node.js"],
        salary: 95000,
        department: "Engineering",
        joinDate: new Date("2022-03-15"),
        isActive: true,
        address: {
            street: "123 Tech St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102"
        }
    },
    {
        _id: ObjectId(),
        name: "Jane Smith",
        email: "jane@example.com",
        age: 28,
        role: "product_designer",
        skills: ["Figma", "Sketch", "UI/UX", "Prototyping", "User Research"],
        salary: 85000,
        department: "Design",
        joinDate: new Date("2023-01-10"),
        isActive: true,
        address: {
            street: "456 Design Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210"
        }
    },
    {
        _id: ObjectId(),
        name: "Bob Wilson",
        email: "bob@example.com",
        age: 35,
        role: "engineering_manager",
        skills: ["Leadership", "Agile", "Strategy", "Team Management"],
        salary: 120000,
        department: "Engineering",
        joinDate: new Date("2021-08-20"),
        isActive: false,
        address: {
            street: "789 Management Blvd",
            city: "Seattle",
            state: "WA",
            zipCode: "98101"
        }
    },
    {
        _id: ObjectId(),
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 26,
        role: "junior_developer",
        skills: ["JavaScript", "HTML", "CSS", "React"],
        salary: 65000,
        department: "Engineering",
        joinDate: new Date("2023-06-01"),
        isActive: true,
        address: {
            street: "321 Code Lane",
            city: "Austin",
            state: "TX",
            zipCode: "73301"
        }
    }
]);

// Create Products collection for e-commerce scenarios
db.products.insertMany([
    {
        _id: ObjectId(),
        name: "MacBook Pro 16-inch",
        price: 2499.99,
        category: "electronics",
        brand: "Apple",
        inStock: true,
        quantity: 25,
        tags: ["laptop", "computer", "apple", "professional"],
        specifications: {
            screen: "16-inch Liquid Retina XDR",
            processor: "M2 Pro",
            memory: "16GB",
            storage: "512GB SSD",
            graphics: "19-core GPU",
            ports: ["Thunderbolt 4", "HDMI", "MagSafe 3"]
        },
        rating: 4.8,
        reviews: 127,
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2024-01-10")
    },
    {
        _id: ObjectId(),
        name: "Wireless Magic Mouse",
        price: 79.99,
        category: "accessories",
        brand: "Apple",
        inStock: true,
        quantity: 150,
        tags: ["mouse", "wireless", "computer", "bluetooth"],
        specifications: {
            connectivity: "Bluetooth",
            battery: "Built-in rechargeable",
            compatibility: ["Mac", "iPad"],
            color: "White"
        },
        rating: 4.3,
        reviews: 89,
        createdAt: new Date("2023-02-01"),
        updatedAt: new Date("2024-01-05")
    },
    {
        _id: ObjectId(),
        name: "Premium Coffee Maker",
        price: 299.99,
        category: "kitchen",
        brand: "Breville",
        inStock: false,
        quantity: 0,
        tags: ["coffee", "kitchen", "appliance", "premium"],
        specifications: {
            capacity: "12 cups",
            features: ["programmable", "auto-shutoff", "thermal carafe"],
            warranty: "2 years",
            dimensions: "14.2 x 8.5 x 16.25 inches"
        },
        rating: 4.6,
        reviews: 203,
        createdAt: new Date("2023-03-10"),
        updatedAt: new Date("2023-12-20")
    },
    {
        _id: ObjectId(),
        name: "Smartphone Pro Max",
        price: 1099.99,
        category: "electronics",
        brand: "TechCorp",
        inStock: true,
        quantity: 45,
        tags: ["phone", "smartphone", "mobile", "5G"],
        specifications: {
            screen: "6.7-inch OLED",
            processor: "A16 Bionic",
            memory: "256GB",
            camera: "48MP Triple camera",
            battery: "4000mAh",
            connectivity: ["5G", "WiFi 6", "Bluetooth 5.3"]
        },
        rating: 4.7,
        reviews: 156,
        createdAt: new Date("2023-04-05"),
        updatedAt: new Date("2024-01-08")
    }
]);

// Create Orders collection for transaction scenarios
db.orders.insertMany([
    {
        _id: ObjectId(),
        orderNumber: "ORD-2024-001",
        userId: ObjectId(),
        customerEmail: "john@example.com",
        items: [
            {
                productId: ObjectId(),
                productName: "MacBook Pro 16-inch",
                quantity: 1,
                unitPrice: 2499.99,
                totalPrice: 2499.99
            }
        ],
        subtotal: 2499.99,
        tax: 224.99,
        shipping: 0.00,
        totalAmount: 2724.98,
        status: "completed",
        paymentMethod: "credit_card",
        orderDate: new Date("2024-01-15"),
        shippedDate: new Date("2024-01-17"),
        deliveredDate: new Date("2024-01-20"),
        shippingAddress: {
            name: "John Doe",
            street: "123 Tech St",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            country: "USA"
        },
        trackingNumber: "1Z999AA1234567890"
    },
    {
        _id: ObjectId(),
        orderNumber: "ORD-2024-002",
        userId: ObjectId(),
        customerEmail: "jane@example.com",
        items: [
            {
                productId: ObjectId(),
                productName: "Wireless Magic Mouse",
                quantity: 2,
                unitPrice: 79.99,
                totalPrice: 159.98
            },
            {
                productId: ObjectId(),
                productName: "Smartphone Pro Max",
                quantity: 1,
                unitPrice: 1099.99,
                totalPrice: 1099.99
            }
        ],
        subtotal: 1259.97,
        tax: 113.40,
        shipping: 15.00,
        totalAmount: 1388.37,
        status: "processing",
        paymentMethod: "paypal",
        orderDate: new Date("2024-01-18"),
        shippingAddress: {
            name: "Jane Smith",
            street: "456 Design Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA"
        }
    },
    {
        _id: ObjectId(),
        orderNumber: "ORD-2024-003",
        userId: ObjectId(),
        customerEmail: "alice@example.com",
        items: [
            {
                productId: ObjectId(),
                productName: "Premium Coffee Maker",
                quantity: 1,
                unitPrice: 299.99,
                totalPrice: 299.99
            }
        ],
        subtotal: 299.99,
        tax: 27.00,
        shipping: 12.99,
        totalAmount: 339.98,
        status: "cancelled",
        paymentMethod: "credit_card",
        orderDate: new Date("2024-01-12"),
        cancelledDate: new Date("2024-01-13"),
        cancelReason: "Out of stock",
        shippingAddress: {
            name: "Alice Johnson",
            street: "321 Code Lane",
            city: "Austin",
            state: "TX",
            zipCode: "73301",
            country: "USA"
        }
    }
]);

// Create Categories collection for product organization
db.categories.insertMany([
    {
        _id: ObjectId(),
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic devices and gadgets",
        parentId: null,
        isActive: true,
        createdAt: new Date("2023-01-01")
    },
    {
        _id: ObjectId(),
        name: "Computers",
        slug: "computers",
        description: "Laptops, desktops, and computer accessories",
        parentId: ObjectId(), // Would reference Electronics category
        isActive: true,
        createdAt: new Date("2023-01-01")
    },
    {
        _id: ObjectId(),
        name: "Kitchen",
        slug: "kitchen",
        description: "Kitchen appliances and accessories",
        parentId: null,
        isActive: true,
        createdAt: new Date("2023-01-01")
    },
    {
        _id: ObjectId(),
        name: "Accessories",
        slug: "accessories",
        description: "Various accessories and add-ons",
        parentId: null,
        isActive: true,
        createdAt: new Date("2023-01-01")
    }
]);

// Create comprehensive indexes for performance
// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ department: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ joinDate: -1 });
db.users.createIndex({ salary: 1 });

// Products collection indexes
db.products.createIndex({ category: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ inStock: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ name: "text", tags: "text" }); // Text search
db.products.createIndex({ rating: -1 });
db.products.createIndex({ createdAt: -1 });

// Orders collection indexes
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ customerEmail: 1 });
db.orders.createIndex({ orderDate: -1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ totalAmount: 1 });

// Categories collection indexes
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ parentId: 1 });
db.categories.createIndex({ isActive: 1 });

// Create compound indexes for common query patterns
db.products.createIndex({ category: 1, inStock: 1, price: 1 });
db.orders.createIndex({ status: 1, orderDate: -1 });
db.users.createIndex({ department: 1, isActive: 1 });

print("✅ Interview database initialized successfully!");
print("📊 Collections created: users, products, orders, categories");
print("📈 Sample data inserted:");
print("   - Users: " + db.users.countDocuments());
print("   - Products: " + db.products.countDocuments());
print("   - Orders: " + db.orders.countDocuments());
print("   - Categories: " + db.categories.countDocuments());
print("🔍 Indexes created for optimized queries");
print("🚀 Ready for interview coding challenges!");