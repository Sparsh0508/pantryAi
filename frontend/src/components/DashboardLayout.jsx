import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Sparkles,
    LayoutDashboard,
    ShoppingCart,
    Package,
    Calendar,
    Users,
    TrendingUp,
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import '../pages/Dashboard.css';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <ShoppingCart size={20} />, label: 'Grocery List', path: '/grocery-list' },
        { icon: <Package size={20} />, label: 'Pantry', path: '/pantry' },
        { icon: <Calendar size={20} />, label: 'Meal Planner', path: '/meal-planner' },
        { icon: <Users size={20} />, label: 'Family Sharing', path: '/family' },
        { icon: <TrendingUp size={20} />, label: 'Insights', path: '/insights' },
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="logo">
                        <Sparkles className="logo-icon" />
                        {sidebarOpen && <span className="logo-text gradient-text">PantryIQ</span>}
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item">
                        <Settings size={20} />
                        {sidebarOpen && <span>Settings</span>}
                    </button>
                    <Link to="/" className="nav-item">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div className="search-bar">
                            <Search size={20} className="search-icon" />
                            <input type="text" placeholder="Search groceries, meals, recipes..." />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="icon-btn ai-assistant-btn">
                            <Sparkles size={20} />
                            <span className="ai-badge-dot"></span>
                        </button>
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        <button className="icon-btn user-btn">
                            <User size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
