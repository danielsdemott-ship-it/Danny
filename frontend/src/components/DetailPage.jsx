import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { API_BASE, formatMoney } from '@/lib/api';
import './DetailPage.css';

export default function DetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/inventory/${itemId}`);
      if (!response.ok) throw new Error('Item not found');
      
      const data = await response.json();
      setItem(data);
      
      // Fetch related items from same category
      const relatedRes = await fetch(`${API_BASE}/inventory?category=${encodeURIComponent(data.category)}`);
      if (relatedRes.ok) {
        const relatedData = await relatedRes.json();
        setRelatedItems(relatedData.filter(i => i.id !== itemId).slice(0, 3));
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-error">
        <h1>Item Not Found</h1>
        <Link to="/" className="detail-back-link">Return Home</Link>
      </div>
    );
  }

  const categoryColors = {
    "Private Sourcing": "#d4af37",
    "Strategic Introductions": "#a0826d",
    "Acquisition Consulting": "#c7a375",
    "Exclusive Opportunities": "#e8c547",
    "Listings": "#d4af37",
    "Ventures": "#d4af37",
  };

  return (
    <div className="detail-container">
      <header className="detail-header">
        <Link to="/" className="detail-logo">PhantomWorx</Link>
        <Link to="/" className="detail-back-link">← Back</Link>
      </header>

      <main className="detail-main">
        <div className="detail-hero">
          {item.image_url && (
            <img src={item.image_url} alt={item.title} className="detail-image" />
          )}
          <div className="detail-hero-overlay">
            <span
              className="detail-category-badge"
              style={{ borderColor: categoryColors[item.category] || '#d4af37' }}
            >
              {item.category}
            </span>
          </div>
        </div>

        <article className="detail-article">
          <div className="detail-header-section">
            <h1 className="detail-title">{item.title}</h1>
            
            <div className="detail-meta">
              {item.status_code && (
                <span className="detail-meta-item">Status: {item.status_code}</span>
              )}
              <span className={`detail-availability detail-${item.availability}`}>
                {item.availability.charAt(0).toUpperCase() + item.availability.slice(1)}
              </span>
            </div>
          </div>

          <div className="detail-body">
            {item.description && (
              <section className="detail-section">
                <h2>Overview</h2>
                <p className="detail-description">{item.description}</p>
              </section>
            )}

            {item.price && (
              <section className="detail-section">
                <h2>Valuation</h2>
                <div className="detail-price">
                  <p className="detail-price-label">Valued at</p>
                  <p className="detail-price-value">{formatMoney(item.price)}</p>
                </div>
              </section>
            )}

            <section className="detail-section detail-cta">
              <h2>Next Steps</h2>
              <p>Interested in this opportunity? Submit a private inquiry to discuss further.</p>
              <Link to="/#inquire" className="detail-cta-button">
                Inquire Privately
              </Link>
            </section>

            <section className="detail-section detail-metadata">
              <h2>Details</h2>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-label">Category</span>
                  <span className="metadata-value">{item.category}</span>
                </div>
                {item.status_code && (
                  <div className="metadata-item">
                    <span className="metadata-label">Status</span>
                    <span className="metadata-value">{item.status_code}</span>
                  </div>
                )}
                <div className="metadata-item">
                  <span className="metadata-label">Availability</span>
                  <span className="metadata-value">
                    {item.availability.charAt(0).toUpperCase() + item.availability.slice(1)}
                  </span>
                </div>
                {item.created_at && (
                  <div className="metadata-item">
                    <span className="metadata-label">Listed</span>
                    <span className="metadata-value">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </article>

        {relatedItems.length > 0 && (
          <section className="detail-related">
            <h2>Related Opportunities</h2>
            <div className="related-grid">
              {relatedItems.map((related) => (
                <Link
                  key={related.id}
                  to={`/detail/${related.id}`}
                  className="related-card"
                >
                  <h3>{related.title}</h3>
                  {related.price && (
                    <p className="related-price">{formatMoney(related.price)}</p>
                  )}
                  <span className={`related-availability related-${related.availability}`}>
                    {related.availability.charAt(0).toUpperCase() + related.availability.slice(1)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="detail-footer">
        <p>PhantomWorx LLC</p>
        <p className="detail-footer-motto">Discreet. Deliberate. Decisive.</p>
      </footer>
    </div>
  );
}
