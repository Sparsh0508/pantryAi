import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/family
// @desc    Get family members and recent activity
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('familyMembers');
        const activities = await Activity.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            members: user.familyMembers,
            activities
        });
    } catch (error) {
        console.error('Get family info error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/family/verify/:token
// @desc    Verify family invitation
// @access  Public
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Find user who has a family member with this token
        const inviter = await User.findOne({ 'familyMembers.inviteToken': token });

        if (!inviter) {
            return res.status(400).json({ message: 'Invalid or expired invitation link' });
        }

        // Find the specific member index
        const memberIndex = inviter.familyMembers.findIndex(m => m.inviteToken === token);
        if (memberIndex === -1) {
            return res.status(400).json({ message: 'Invitation not found' });
        }

        // Update status
        inviter.familyMembers[memberIndex].status = 'active';
        inviter.familyMembers[memberIndex].inviteToken = undefined;
        await inviter.save();

        // Redirect to frontend (dashboard). Use FRONTEND_URL from env in production,
        // fallback to localhost during development.
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl.replace(/\/$/, '')}/login?verified=true`);

    } catch (error) {
        console.error('Verify invite error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/family/invite
// @desc    Add a family member (simulated invite)
// @access  Private
router.post('/invite', [auth, [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required')
]], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, name, role } = req.body;

        const user = await User.findById(req.userId);

        // Check if duplicate
        if (user.familyMembers.some(member => member.email === email)) {
            return res.status(400).json({ message: 'Member already in family' });
        }

        const inviteToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        user.familyMembers.push({
            name,
            email,
            role: role || 'member',
            status: 'pending',
            inviteToken
        });

        await user.save();

        // Send Email
        // Build invite link using FRONTEND_URL or fallback to current host when available
        const apiBase = process.env.API_URL || 'https://pantry-ai-alpha.vercel.app';
        const inviteLink = `${apiBase.replace(/\/$/, '')}/api/family/verify/${inviteToken}`;
        // Dynamic import to avoid circular dep if any, or just import top level. Clean import is better.
        // Assuming emailService is available.
        const { sendInviteEmail } = await import('../services/emailService.js');

        await sendInviteEmail(email, inviteLink, user.name);

        console.log(`[DEV LINK] Invite Link for ${email}: ${inviteLink}`);

        // Log activity
        await new Activity({
            userId: req.userId,
            action: `Invited ${name} to family`,
            actor: 'You',
            icon: '📩'
        }).save();

        res.json(user.familyMembers);
    } catch (error) {
        console.error('Add family member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
