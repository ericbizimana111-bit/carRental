import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import User from './models/User.js'
import Car from './models/Car.js'

dotenv.config()

if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed a production environment')
    process.exit(1)
}

const seed = async () => {
    await connectDB()
    const password = process.env.SEED_PASSWORD
    if (!password || password.length < 6) throw new Error('SEED_PASSWORD with at least 6 characters is required')
    const [admin, owner, user] = await Promise.all([
        User.findOneAndUpdate({ email: process.env.SEED_ADMIN_EMAIL || 'admin@local.test' }, { name: 'Platform Admin', password: await bcrypt.hash(password, 12), role: 'admin' }, { upsert: true, new: true, setDefaultsOnInsert: true }),
        User.findOneAndUpdate({ email: process.env.SEED_OWNER_EMAIL || 'owner@local.test' }, { name: 'Development Owner', password: await bcrypt.hash(password, 12), role: 'owner' }, { upsert: true, new: true, setDefaultsOnInsert: true }),
        User.findOneAndUpdate({ email: process.env.SEED_USER_EMAIL || 'user@local.test' }, { name: 'Development User', password: await bcrypt.hash(password, 12), role: 'user' }, { upsert: true, new: true, setDefaultsOnInsert: true })
    ])
    await Car.deleteMany({ owner: owner._id })
    const now = Date.now()
    const cars = await Car.create([
        { owner: owner._id, brand: 'Mercedes-Benz', model: 'C-Class', image: '/car_image1.png', year: 2024, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 250, location: 'New York', description: 'Elegant sedan with cutting-edge technology and a smooth ride.', featured: true, listingStatus: 'live', createdAt: new Date(now - 1000 * 60 * 30) },
        { owner: owner._id, brand: 'Audi', model: 'Q7', image: '/car_image2.png', year: 2023, category: 'SUV', seating_capacity: 7, fuel_type: 'Diesel', transmission: 'Automatic', pricePerDay: 350, location: 'Los Angeles', description: 'Spacious luxury SUV perfect for family trips and adventure.', featured: true, listingStatus: 'live', createdAt: new Date(now - 1000 * 60 * 60 * 3) },
        { owner: owner._id, brand: 'BMW', model: 'X5', image: '/car_image3.png', year: 2022, category: 'SUV', seating_capacity: 5, fuel_type: 'Hybrid', transmission: 'Automatic', pricePerDay: 300, location: 'Chicago', description: 'Premium SUV for comfortable city and highway travel.', featured: true, listingStatus: 'live', createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2) },
        { owner: owner._id, brand: 'Porsche', model: 'Cayenne', image: '/car_image4.png', year: 2024, category: 'SUV', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 450, location: 'Houston', description: 'High-performance SUV with sporty handling and luxury comfort.', featured: true, listingStatus: 'live', createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7) },
        { owner: owner._id, brand: 'Toyota', model: 'Corolla', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80', year: 2023, category: 'Sedan', seating_capacity: 5, fuel_type: 'Gasoline', transmission: 'Automatic', pricePerDay: 130, location: 'New York', description: 'Reliable and efficient everyday rental car.', listingStatus: 'live', createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14) }
    ])
    console.log(`Seeded ${admin.email}, ${owner.email}, and ${user.email}`)
    process.exit(0)
}

seed().catch(error => { console.error(error); process.exit(1) })