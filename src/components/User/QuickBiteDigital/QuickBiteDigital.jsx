import React from 'react'
import './QuickBiteDigital.css'

const QuickBiteDigital = () => {
  return (
    <div className="quickbite-digital">
      <div className="hero-section">
        <div className="sparkles">
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="premium-title">
            QuickBite <span className="digital-gradient">Digital</span>
          </h1>
          <p className="premium-subtitle">
            Experience the Future of Food Delivery
          </p>
          <div className="premium-badge">
            ✨ PREMIUM EXPERIENCE
          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card premium">
          <div className="feature-icon">🚀</div>
          <h3>Lightning Fast Delivery</h3>
          <p>Get your food delivered in under 15 minutes with our premium network</p>
        </div>

        <div className="feature-card premium">
          <div className="feature-icon">👨‍🍳</div>
          <h3>Exclusive Chefs</h3>
          <p>Access to Michelin-starred restaurants and celebrity chef specials</p>
        </div>

        <div className="feature-card premium">
          <div className="feature-icon">🎯</div>
          <h3>AI-Powered Recommendations</h3>
          <p>Personalized meal suggestions based on your taste preferences</p>
        </div>

        <div className="feature-card premium">
          <div className="feature-icon">💎</div>
          <h3>VIP Support</h3>
          <p>24/7 dedicated customer service with priority handling</p>
        </div>

        <div className="feature-card premium">
          <div className="feature-icon">🌟</div>
          <h3>Exclusive Deals</h3>
          <p>Access to premium discounts and early access to new restaurants</p>
        </div>

        <div className="feature-card premium">
          <div className="feature-icon">📱</div>
          <h3>Smart Integration</h3>
          <p>Seamless integration with smart home devices and voice assistants</p>
        </div>
      </div>

      <div className="premium-cta">
        <h2>Ready for the Premium Experience?</h2>
        <p>Join thousands of food lovers who've upgraded to QuickBite Digital</p>
        <button className="cta-button">
          Upgrade to Premium
          <span className="button-sparkle">✨</span>
        </button>
      </div>
    </div>
  )
}

export default QuickBiteDigital