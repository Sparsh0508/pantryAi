import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mealType: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    recipeName: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        name: String,
        quantity: Number,
        unit: String,
        inPantry: {
            type: Boolean,
            default: false
        }
    }],
    instructions: {
        type: String
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    calories: {
        type: Number
    },
    prepTime: {
        type: Number // in minutes
    },
    icon: {
        type: String,
        default: '🍽️'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
