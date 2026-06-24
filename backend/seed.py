#!/usr/bin/env python3
"""
Seed script to initialize inventory database with sample data.
Run this once to populate the database with initial inventory items.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from datetime import datetime, timezone
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

# Sample inventory data - 12 items per category
# PhantomWorx: Discrete sourcing for ultra-wealthy buyers
INVENTORY_DATA = {
    "Automotive Sourcing": [
        {"title": "Pagani Huayra R", "description": "Ultra-rare Italian hypercar, one of 20 produced. 838 HP, bespoke carbon fiber engineering.", "price": 6500000, "status_code": "01/12"},
        {"title": "Ferrari LaFerrari Aperta", "description": "Roadster variant, 1 of 209 produced. Owned by collector, full service history.", "price": 4200000, "status_code": "02/12"},
        {"title": "Bugatti Chiron Super Sport", "description": "300+ mph capability, 1500 HP quad-turbo. Rare Pearl finish variant.", "price": 3800000, "status_code": "03/12"},
        {"title": "Lamborghini Veneno Coupe", "description": "1 of 3 coupes produced. Owned since 2013, flawless condition.", "price": 5100000, "status_code": "04/12"},
        {"title": "McLaren P1 LM", "description": "Track-focused variant, 1050 HP hybrid. Extremely limited production.", "price": 3400000, "status_code": "05/12"},
        {"title": "Porsche 911 GT1", "description": "1998 production, road-going race car. Investment-grade rarity.", "price": 2800000, "status_code": "06/12"},
        {"title": "Mercedes-Benz 300SL Gullwing", "description": "1955 original, fully restored. Museum-quality documentation.", "price": 1900000, "status_code": "07/12"},
        {"title": "Jaguar E-Type Lightweight", "description": "1963 race car, one of 12 aluminum chassis produced.", "price": 7200000, "status_code": "08/12"},
        {"title": "Aston Martin ONE-77", "description": "1 of 77 produced. Manual transmission, never raced.", "price": 2200000, "status_code": "09/12"},
        {"title": "Rolls-Royce Phantom VIII", "description": "Bespoke order with custom interior. 2024 production.", "price": 650000, "status_code": "10/12"},
        {"title": "Tesla Roadster Signature", "description": "First production model, museum piece condition.", "price": 380000, "status_code": "11/12"},
        {"title": "Koenigsegg Jesko Attack", "description": "330 mph capability, active aero package. Pre-order allocation.", "price": 3100000, "status_code": "12/12"},
    ],
    "Real Estate - Luxury": [
        {"title": "Private Island - Caribbean", "description": "100-acre exclusive island with landing strip. All-inclusive resort infrastructure.", "price": 85000000, "status_code": "01/12"},
        {"title": "Penthouse - Manhattan", "description": "5-floor penthouse on Central Park South. 20,000 sq ft, 7 bedrooms.", "price": 95000000, "status_code": "02/12"},
        {"title": "Palazzo - Venice", "description": "Grand Canal palace, 15th century. Newly restored, livable condition.", "price": 42000000, "status_code": "03/12"},
        {"title": "Chateau - French Riviera", "description": "35-acre estate with vineyards. 12 bedrooms, helicopter pad.", "price": 28000000, "status_code": "04/12"},
        {"title": "Mega-Yacht Estate - Miami", "description": "Waterfront compound with private marina and yacht storage.", "price": 65000000, "status_code": "05/12"},
        {"title": "Alpine Chalet - Swiss Alps", "description": "Luxury ski property with 360-degree mountain views.", "price": 18000000, "status_code": "06/12"},
        {"title": "Desert Compound - Arizona", "description": "20,000 sq ft ultra-modern estate with infinity pools and vineyards.", "price": 35000000, "status_code": "07/12"},
        {"title": "Malibu Beachfront - California", "description": "Direct beach access, 8 bedrooms, smart home automation.", "price": 32000000, "status_code": "08/12"},
        {"title": "London Townhouse - Mayfair", "description": "5-story Georgian mansion, newly renovated. Prime location.", "price": 22000000, "status_code": "09/12"},
        {"title": "Miami Beach Mansion", "description": "Oceanfront with infinity pool and private beach access.", "price": 28500000, "status_code": "10/12"},
        {"title": "Aspen Estate - Colorado", "description": "Ski-in/ski-out luxury home with guest quarters.", "price": 16000000, "status_code": "11/12"},
        {"title": "Ibiza Villa - Spain", "description": "Modern ultra-luxury with sunset views and helipad.", "price": 24000000, "status_code": "12/12"},
    ],
    "Fine Art & Collectibles": [
        {"title": "Rolex Daytona - Platinum", "description": "Ultra-rare ref. 116506 with meteorite dial. 2024 production, unworn.", "price": 850000, "status_code": "01/12"},
        {"title": "Audemars Piguet Royal Oak Perpetual", "description": "Limited edition white gold with perpetual calendar. Discontinued.", "price": 1200000, "status_code": "02/12"},
        {"title": "Original Banksy Street Art", "description": "Authenticated original on canvas. From 2008 collection.", "price": 2800000, "status_code": "03/12"},
        {"title": "Picasso Portrait - Period Piece", "description": "Authenticated oil on canvas from 1950s. Provenance documented.", "price": 8500000, "status_code": "04/12"},
        {"title": "Louis Vuitton Trunk Collection", "description": "5 rare trunks from 1920s-1940s. Museum-quality condition.", "price": 425000, "status_code": "05/12"},
        {"title": "Ancient Roman Sculpture", "description": "2nd century marble, authenticated by museum curator.", "price": 3200000, "status_code": "06/12"},
        {"title": "Diamond Gemstone - D Flawless", "description": "45-carat natural diamond, certified by GIA. Museum piece.", "price": 5500000, "status_code": "07/12"},
        {"title": "Hermes Trunk - Original 1920s", "description": "Signed Hermes steamer trunk with original hardware.", "price": 185000, "status_code": "08/12"},
        {"title": "Warhol Screen Print - Marilyn", "description": "Signed limited edition from 1962 series.", "price": 2100000, "status_code": "09/12"},
        {"title": "Rolex Submariner - Vintage", "description": "Ref. 5512 from 1965. Original dial, untouched.", "price": 420000, "status_code": "10/12"},
        {"title": "Egyptian Antiquity - Dynasty Era", "description": "Authenticated funerary artifact from 18th Dynasty.", "price": 1800000, "status_code": "11/12"},
        {"title": "Cartier Royal Tiara", "description": "High jewelry piece from 1950s collection.", "price": 2200000, "status_code": "12/12"},
    ],
    "Maritime Luxury": [
        {"title": "Mega-Yacht - 180ft Superyacht", "description": "Custom build, 12 cabins, helipad. Recently refitted, $3M annual budget.", "price": 145000000, "status_code": "01/12"},
        {"title": "Explorer Yacht - 150ft Arctic", "description": "Ice-class capable, expedition yacht with submarine garage.", "price": 95000000, "status_code": "02/12"},
        {"title": "Motor Yacht - 200ft Italian Build", "description": "Benetti custom, 8 suites, spa, cinema. Owner-operated.", "price": 175000000, "status_code": "03/12"},
        {"title": "Sailing Yacht - 120ft Racer", "description": "America's Cup tech, bareboat charter ready.", "price": 28000000, "status_code": "04/12"},
        {"title": "Catamaran - 90ft Luxury", "description": "Twin-hull, ultra-stable, 6 cabins. Tahiti-based.", "price": 22000000, "status_code": "05/12"},
        {"title": "Private Submarine", "description": "Research-grade personal submarine, 3,000m depth rated.", "price": 18000000, "status_code": "06/12"},
        {"title": "Gulet - Turkish Build 110ft", "description": "Classic luxury gulet, 8 cabins, Mediterranean charter history.", "price": 12000000, "status_code": "07/12"},
        {"title": "Expedition Vessel - 120ft", "description": "Built for Antarctic expeditions, ice-strengthened hull.", "price": 35000000, "status_code": "08/12"},
        {"title": "Luxury Cruiser - 85ft", "description": "Perfect for Bahamas cruising season. 5 cabins, fully crewed.", "price": 16000000, "status_code": "09/12"},
        {"title": "Classic Motor Yacht - 70ft", "description": "Vintage beauty with modern systems. Charter history.", "price": 8500000, "status_code": "10/12"},
        {"title": "Tender Fleet - Speed Boats", "description": "4-boat collection including Cigarette and center console.", "price": 2100000, "status_code": "11/12"},
        {"title": "Private Yacht Club Membership", "description": "Exclusive membership + slip reservation at Monaco.", "price": 950000, "status_code": "12/12"},
    ],
    "Private Aviation": [
        {"title": "Airbus ACJ NextGen", "description": "Business jet, customizable for 10-15 passengers. Direct order.", "price": 175000000, "status_code": "01/12"},
        {"title": "Boeing Business Jet BBJ", "description": "Ultra-long range, 30+ hour flight time. Recent completion.", "price": 185000000, "status_code": "02/12"},
        {"title": "Gulfstream G800", "description": "Twin-engine ultra-long-range jet. 2024 new delivery.", "price": 72000000, "status_code": "03/12"},
        {"title": "Bombardier Global 7500", "description": "Premium widebody business jet. Top condition.", "price": 65000000, "status_code": "04/12"},
        {"title": "Airbus H225 Helicopter", "description": "VIP-configured executive helicopter. Full service logs.", "price": 42000000, "status_code": "05/12"},
        {"title": "Cessna Citation X+", "description": "Fastest civilian jet. Transatlantic capable.", "price": 24000000, "status_code": "06/12"},
        {"title": "Sikorsky S-92 Helicopter", "description": "Luxury configured, 14-passenger VIP transport.", "price": 55000000, "status_code": "07/12"},
        {"title": "Bombardier Challenger 3500", "description": "Mid-size business jet, perfect for regional travel.", "price": 28000000, "status_code": "08/12"},
        {"title": "Dassault Falcon 8X", "description": "Three-engine jet, ultra-quiet cabin, intercontinental.", "price": 38000000, "status_code": "09/12"},
        {"title": "Leonardo AW189 Helicopter", "description": "Executive transport, 14 VIP seats. Impeccable history.", "price": 62000000, "status_code": "10/12"},
        {"title": "Hanger - Private Hangar at Le Bourget", "description": "Dedicated hangar for aircraft storage. 25-year lease.", "price": 1200000, "status_code": "11/12"},
        {"title": "Jet Card Program", "description": "250 hours NetJets fractional ownership. Platinum status.", "price": 8500000, "status_code": "12/12"},
    ],
    "Business & Investment": [
        {"title": "Founder Acquisition - Series A Ready", "description": "Pre-Series A SaaS company, $2M ARR, seeking growth capital.", "price": 500000, "status_code": "01/12"},
        {"title": "Fintech Portfolio Company", "description": "Regtech platform with enterprise clients, $500K MRR.", "price": 2500000, "status_code": "02/12"},
        {"title": "AI/ML Unicorn - Series D", "description": "AI company on path to $1B valuation, pre-IPO.", "price": 5000000, "status_code": "03/12"},
        {"title": "Luxury Hotel Group - REIT", "description": "Portfolio of 8 5-star hotels across Europe.", "price": 450000000, "status_code": "04/12"},
        {"title": "Private Equity Fund - $500M", "description": "Mid-market PE fund seeking LP capital commitments.", "price": 25000000, "status_code": "05/12"},
        {"title": "Hedge Fund - Multi-Strategy", "description": "$2B AUM fund with 12% historical returns.", "price": 15000000, "status_code": "06/12"},
        {"title": "Wine Investment Fund", "description": "Bordeaux & Burgundy holdings, $500M portfolio.", "price": 3800000, "status_code": "07/12"},
        {"title": "Infrastructure Fund - Clean Energy", "description": "Renewable energy projects, $1B+ AUM.", "price": 8500000, "status_code": "08/12"},
        {"title": "Life Science Innovation", "description": "Biotech with FDA approval pathway, venture stage.", "price": 1500000, "status_code": "09/12"},
        {"title": "Real Estate Development - London", "description": "$250M commercial development project.", "price": 45000000, "status_code": "10/12"},
        {"title": "Family Office Advisory", "description": "Complete setup & management for $500M+ net worth.", "price": 2000000, "status_code": "11/12"},
        {"title": "Digital Asset Management", "description": "Crypto hedge fund with $1B+ AUM, accredited only.", "price": 12000000, "status_code": "12/12"},
    ],
    "Exclusive Connections": [
        {"title": "Fortune 500 CEO Introduction", "description": "Direct introduction to C-suite executive for partnership.", "price": 250000, "status_code": "01/12"},
        {"title": "Family Office Network - $100B AUM", "description": "Access to 25 family offices with $100B+ combined AUM.", "price": 500000, "status_code": "02/12"},
        {"title": "Global Private Banker", "description": "Access to top-tier private banking relationships worldwide.", "price": 150000, "status_code": "03/12"},
        {"title": "Strategic Board Placement", "description": "Connect with Fortune 500 board director openings.", "price": 300000, "status_code": "04/12"},
        {"title": "Venture Limited Partners Circle", "description": "Intro to $50B+ aggregate VC LP network.", "price": 400000, "status_code": "05/12"},
        {"title": "International Tax Advisor", "description": "Elite multinational tax & legal expertise.", "price": 180000, "status_code": "06/12"},
        {"title": "Sovereign Wealth Fund Liaison", "description": "Direct access to SWF decision makers globally.", "price": 350000, "status_code": "07/12"},
        {"title": "Art Market Expert", "description": "Museum curator & auction house insider network.", "price": 120000, "status_code": "08/12"},
        {"title": "Real Estate Development Partners", "description": "Connect with top international developers.", "price": 200000, "status_code": "09/12"},
        {"title": "Luxury Brand Executives", "description": "Direct access to LVMH, Kering, Richemont leadership.", "price": 275000, "status_code": "10/12"},
        {"title": "Media & Influence Network", "description": "Top-tier journalists, influencers, cultural advisors.", "price": 95000, "status_code": "11/12"},
        {"title": "Geopolitical Intelligence Briefing", "description": "Private briefings from former heads of state & intelligence.", "price": 425000, "status_code": "12/12"},
    ],
}


async def seed_inventory():
    """Populate inventory collection with sample data."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Clear existing inventory
        await db.inventory.delete_many({})
        print("✓ Cleared existing inventory")
        
        inventory_items = []
        for category, items in INVENTORY_DATA.items():
            for i, item_data in enumerate(items, 1):
                item = {
                    "id": str(uuid.uuid4()),
                    "category": category,
                    "title": item_data["title"],
                    "description": item_data.get("description"),
                    "price": item_data.get("price"),
                    "availability": "available" if i <= 10 else ("reserved" if i == 11 else "sold"),
                    "image_url": None,
                    "status_code": item_data.get("status_code"),
                    "metadata": {},
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
                inventory_items.append(item)
        
        # Insert all items
        result = await db.inventory.insert_many(inventory_items)
        print(f"✓ Added {len(result.inserted_ids)} inventory items")
        
        # Print summary
        for category in INVENTORY_DATA.keys():
            count = await db.inventory.count_documents({"category": category})
            print(f"  • {category}: {count} items")
        
        print("\n✓ Database seed complete!")
        
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
        raise
    finally:
        client.close()


async def create_admin_user(username: str = "admin", password: str = "phantom"):
    """Create initial admin user for authentication."""
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Check if admin exists
        existing = await db.admins.find_one({"username": username})
        if existing:
            print(f"✓ Admin user '{username}' already exists")
            return
        
        # Create new admin
        hashed_password = pwd_context.hash(password)
        await db.admins.insert_one({
            "username": username,
            "password": hashed_password,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        
        print(f"✓ Admin user '{username}' created")
        print(f"  Default password: {password}")
        print(f"  ⚠ Please change this password after first login!")
        
    except Exception as e:
        print(f"✗ Error creating admin user: {e}")
        raise
    finally:
        client.close()


async def main():
    print("PhantomWorx Database Seeding\n")
    print("=" * 50)
    
    # Seed inventory
    await seed_inventory()
    
    # Create admin user
    print()
    await create_admin_user()
    
    print("\n" + "=" * 50)
    print("✓ Ready to launch! Access admin at /admin")


if __name__ == "__main__":
    asyncio.run(main())
