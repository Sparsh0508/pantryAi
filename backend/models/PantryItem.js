import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'l', 'ml', 'pcs', 'packets', 'bottles', 'cans']
    },
    category: {
        type: String,
        required: true,
        enum: ['grains', 'dairy', 'vegetables', 'fruits', 'meat', 'spices', 'snacks', 'beverages', 'other']
    },
    expiryDate: {
        type: Date
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    icon: {
        type: String,
        default: '📦'
    },
    addedBy: {
        type: String,
        default: 'You'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Check if item is low stock
pantryItemSchema.virtual('isLowStock').get(function () {
    return this.quantity <= this.lowStockThreshold;
});

// Check if item is expired
pantryItemSchema.virtual('isExpired').get(function () {
    return this.expiryDate && new Date(this.expiryDate) < new Date();
});

pantryItemSchema.set('toJSON', { virtuals: true });
pantryItemSchema.set('toObject', { virtuals: true });

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);

export default PantryItem;
