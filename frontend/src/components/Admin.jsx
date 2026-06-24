import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { API_BASE, formatMoney } from '@/lib/api';
import './Admin.css';

const ADMIN_CATEGORIES = [
  'Automotive Sourcing',
  'Real Estate - Luxury',
  'Fine Art & Collectibles',
  'Maritime Luxury',
  'Private Aviation',
  'Business & Investment',
  'Exclusive Connections',
  'Private Sourcing',
  'Strategic Introductions',
  'Acquisition Consulting',
  'Exclusive Opportunities',
  'Listings',
  'Ventures',
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [inventory, setInventory] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [currentTab, setCurrentTab] = useState('inventory');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    availability: 'available',
    image_url: '',
    status_code: '',
  });
  const { toast } = useToast();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchInventory();
      if (currentTab === 'inquiries') {
        fetchInquiries();
      }
    }
  }, [isAuthenticated, currentTab, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('admin_token', data.access_token);
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
      toast({ title: 'Login successful', description: 'Welcome to admin dashboard' });
    } catch (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleRegister = async () => {
    if (!loginForm.username || !loginForm.password) {
      toast({ title: 'Missing credentials', description: 'Enter a username and password first.', variant: 'destructive' });
      return;
    }

    try {
      const registerResponse = await fetch(`${API_BASE}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json().catch(() => ({}));
        throw new Error(error.detail || 'Unable to create admin');
      }

      const loginResponse = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (!loginResponse.ok) throw new Error('Admin created, but login failed');

      const data = await loginResponse.json();
      localStorage.setItem('admin_token', data.access_token);
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
      toast({ title: 'Admin created', description: 'First admin account is ready.' });
    } catch (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    setInventory([]);
    setInquiries([]);
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${API_BASE}/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add inventory item');
      
      toast({ title: 'Success', description: 'Item added to inventory' });
      setFormData({
        category: '',
        title: '',
        description: '',
        price: '',
        availability: 'available',
        image_url: '',
        status_code: '',
      });
      fetchInventory();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const payload = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        availability: formData.availability,
        image_url: formData.image_url || undefined,
        status_code: formData.status_code || undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const response = await fetch(`${API_BASE}/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update inventory item');
      
      toast({ title: 'Success', description: 'Item updated' });
      setEditingItem(null);
      setFormData({
        category: '',
        title: '',
        description: '',
        price: '',
        availability: 'available',
        image_url: '',
        status_code: '',
      });
      fetchInventory();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteInventory = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_BASE}/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete inventory item');
      
      toast({ title: 'Success', description: 'Item deleted' });
      fetchInventory();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      title: item.title,
      description: item.description || '',
      price: item.price || '',
      availability: item.availability,
      image_url: item.image_url || '',
      status_code: item.status_code || '',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-title">PhantomWorx Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit" className="admin-btn">Login</button>
          </form>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={handleRegister}>
            Create First Admin
          </button>
          <p className="admin-note">Registration is available only before the first admin exists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>PhantomWorx Admin</h1>
        <button onClick={handleLogout} className="admin-btn-logout">Logout</button>
      </header>

      <nav className="admin-nav">
        <button
          className={`admin-nav-btn ${currentTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setCurrentTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`admin-nav-btn ${currentTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setCurrentTab('inquiries')}
        >
          Inquiries
        </button>
      </nav>

      <main className="admin-main">
        {currentTab === 'inventory' && (
          <div className="admin-inventory">
            <section className="admin-form-section">
              <h2>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
              <form onSubmit={editingItem ? handleUpdateInventory : handleAddInventory}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required={!editingItem}
                    disabled={!!editingItem}
                  >
                    <option value="">Select Category</option>
                    {ADMIN_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Item title"
                    required={!editingItem}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Item description"
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Price (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Status Code (e.g., 01/06)</label>
                  <input
                    type="text"
                    value={formData.status_code}
                    onChange={(e) => setFormData({ ...formData, status_code: e.target.value })}
                    placeholder="Status code"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="admin-btn">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  {editingItem && (
                    <button
                      type="button"
                      className="admin-btn-cancel"
                      onClick={() => {
                        setEditingItem(null);
                        setFormData({
                          category: '',
                          title: '',
                          description: '',
                          price: '',
                          availability: 'available',
                          image_url: '',
                          status_code: '',
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-list-section">
              <h2>Inventory Items ({inventory.length})</h2>
              <div className="admin-list">
                {inventory.map((item) => (
                  <div key={item.id} className="admin-list-item">
                    <div className="item-info">
                      <h3>{item.title}</h3>
                      <p className="item-category">{item.category}</p>
                      {item.description && <p className="item-desc">{item.description}</p>}
                      {item.price && <p className="item-price">{formatMoney(item.price)}</p>}
                      <p className={`item-availability item-${item.availability}`}>
                        {item.availability.charAt(0).toUpperCase() + item.availability.slice(1)}
                      </p>
                    </div>
                    <div className="item-actions">
                      <button
                        className="admin-btn-edit"
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDeleteInventory(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {currentTab === 'inquiries' && (
          <section className="admin-inquiries">
            <h2>Inquiries ({inquiries.length})</h2>
            <div className="inquiries-list">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="inquiry-item">
                  <h3>{inquiry.name}</h3>
                  <p><strong>Email:</strong> {inquiry.email}</p>
                  {inquiry.origin && <p><strong>Origin:</strong> {inquiry.origin}</p>}
                  {inquiry.room && <p><strong>Room:</strong> {inquiry.room}</p>}
                  <p><strong>Intent:</strong> {inquiry.intent}</p>
                  <p className="inquiry-date">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
