import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PantryItem from '../models/PantryItem.js';
import GroceryItem from '../models/GroceryItem.js';
import MealPlan from '../models/MealPlan.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// @route   GET /api/insights/suggestions
// @desc    Get AI suggestions based on pantry and usage
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
    try {
        console.log('Generating AI insights...');
        // If no API key, return mock suggestions
        if (!process.env.GEMINI_API_KEY) {
            console.log('No GEMINI_API_KEY found');
            return res.json({
                message: "Configure GEMINI_API_KEY for real insights",
                suggestions: [
                    { message: "You're low on Rice. Add to grocery list?", action: "Add Rice" },
                    { message: "You have excess Milk expiring soon. Plan a pudding?", action: "Plan Meal" }
                ]
            });
        }

        // Gather context
        const pantryItems = await PantryItem.find({ userId: req.userId });
        const groceryList = await GroceryItem.find({ userId: req.userId });

        // Construct prompt
        const prompt = `
      Act as a smart home pantry assistant.
      Here is my pantry inventory: ${JSON.stringify(pantryItems.map(i => `${i.name} (${i.quantity} ${i.unit})`))}.
      Here is my current grocery list: ${JSON.stringify(groceryList.map(i => i.name))}.
      
      Generate 3 short, actionable suggestions to help me manage my kitchen better. 
      Focus on exploring items (food waste prevention), restocking essentials, or meal ideas based on available ingredients.
      Return ONLY a valid JSON array of objects with 'message' and 'action' keys. Do not include markdown formatting or extra text.
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Raw Response:', text);

        // Parse JSON from response (finding the array)
        const jsonMatch = text.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error("Failed to parse AI response: No JSON array found");
        }

        const suggestions = JSON.parse(jsonMatch[0]);

        res.json({ suggestions });
    } catch (error) {
        console.error('Get AI insights error:', error);
        // Fallback if AI fails, showing error to user for debugging
        res.json({
            suggestions: [
                {
                    message: `AI Error: ${error.message}. Try updating API key or Model name.`,
                    action: "Retry"
                }
            ]
        });
    }
});

export default router;
