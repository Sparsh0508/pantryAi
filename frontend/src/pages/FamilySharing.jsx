import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { UserPlus, Mail, Check, X, Clock, Trash2 } from 'lucide-react';
import { familyService } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';
import './FamilySharing.css';

const FamilySharing = () => {
    const [family, setFamily] = useState({ members: [], activities: [] });
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'member' });

    useEffect(() => {
        fetchFamily();
    }, []);

    const fetchFamily = async () => {
        try {
            const response = await familyService.getFamily();
            // Assuming response.data has { members, activities } based on backend
            setFamily(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching family:", error);
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await familyService.invite(inviteData);
            toast.success('Member invited!');
            setShowInvite(false);
            setInviteData({ email: '', name: '', role: 'member' });
            fetchFamily();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to invite');
        }
    };

    return (
        <DashboardLayout>
            <div className="family-sharing-page">
                <div className="page-header">
                    <div>
                        <h1>👨‍👩‍👧 Family Sharing</h1>
                        <p>Collaborate with family members in real-time</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowInvite(!showInvite)}>
                        <UserPlus size={18} />
                        {showInvite ? 'Cancel' : 'Invite Member'}
                    </button>
                </div>

                {showInvite && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card"
                        style={{ padding: '20px', marginBottom: '20px' }}
                    >
                        <form onSubmit={handleInvite} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr auto auto' }}>
                            <input
                                placeholder="Name"
                                required
                                value={inviteData.name}
                                onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={inviteData.email}
                                onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            />
                            <select
                                value={inviteData.role}
                                onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                                style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'black', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="btn btn-accent">Send Invite</button>
                        </form>
                    </motion.div>
                )}

                {/* Family Members */}
                <div className="members-section">
                    <h3>Family Members</h3>
                    <div className="members-grid">
                        {family.members && family.members.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="member-card glass-card"
                            >
                                <div className="member-avatar">👤</div>
                                <div className="member-info">
                                    <div className="member-name">{member.name}</div>
                                    <div className="member-email">{member.email}</div>
                                    <div className="member-role">
                                        <span className="role-badge">{member.role}</span>
                                        <span className={`status-dot status-${member.status || 'active'}`}></span>
                                        {member.status === 'pending' && <span style={{ fontSize: '0.8rem', color: 'orange', marginLeft: '5px' }}> (Pending)</span>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="family-grid">
                    {/* Live Updates */}
                    <motion.div
                        className="updates-section glass-card"
                    >
                        <div className="card-header">
                            <h3>📡 Recent Activity</h3>
                        </div>
                        <div className="updates-list">
                            {family.activities && family.activities.map((update, index) => (
                                <div key={index} className="update-item">
                                    <div className="update-avatar">{update.icon || '📝'}</div>
                                    <div className="update-content">
                                        <div className="update-text">
                                            {update.action}
                                        </div>
                                        <div className="update-time">
                                            <Clock size={12} />
                                            {new Date(update.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!family.activities || family.activities.length === 0) && <p style={{ opacity: 0.7, padding: '10px' }}>No recent activity</p>}
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FamilySharing;
