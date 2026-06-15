import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: 'Formula 1 Events',
      description: 'Exclusive VIP packages to the world\'s most prestigious racing events with hospitality and private suites.',
      icon: '🏁',
      image: 'https://images.unsplash.com/photo-1488372759477-a7f4f50f88a5?w=600&h=400&fit=crop'
    },
    {
      title: 'Hypercar Collection',
      description: 'Access to limited edition hypercars including Ferrari LaFerrari, Bugatti Bolide, and Koenigsegg Jesko.',
      icon: '🏎️',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
    },
    {
      title: 'Luxury Experiences',
      description: 'Curated moments including private yacht cruises, helicopter tours, and exclusive galas.',
      icon: '💎',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop'
    },
    {
      title: 'Premium Consulting',
      description: 'Expert advisory services for luxury acquisitions, event planning, and exclusive network access.',
      icon: '👔',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="text-gold">Our Services</h2>
          <p>Crafted for those with distinguished taste</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card" style={{
              animationDelay: `${index * 0.1}s`
            }}>
              <div className="service-image">
                <img 
                  src={service.image} 
                  alt={service.title}
                  loading="lazy"
                />
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contact" className="service-link">Learn More →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
