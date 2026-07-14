/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShoppingSite {
  id: string;
  name: string;
  domain: string;
  category: "Department" | "Tech & Electronics" | "Fashion & Apparel" | "Beauty & Health" | "Home & Living" | "Sports & Outdoors" | "Marketplaces & Direct";
  region: "Global" | "North America" | "UK & Europe" | "Oceania" | "Asia";
  featuredPrompts: string[];
}

export const SHOPPING_SITES: ShoppingSite[] = [
  // Oceania / New Zealand / Australia Specific
  {
    id: "the-warehouse",
    name: "The Warehouse",
    domain: "thewarehouse.co.nz",
    category: "Department",
    region: "Oceania",
    featuredPrompts: [
      "Find a 1000W microwave under $120 NZD on The Warehouse, add to cart, and verify item is in stock.",
      "Search for outdoor solar string lights on The Warehouse and simulate checkout."
    ]
  },
  {
    id: "kmart-nz-au",
    name: "Kmart",
    domain: "kmart.co.nz",
    category: "Department",
    region: "Oceania",
    featuredPrompts: [
      "Locate a bamboo shoe rack under $30 on Kmart and compile transition steps for delivery.",
      "Find kids activewear shorts size 8 on Kmart and add to basket."
    ]
  },
  {
    id: "nile",
    name: "Nile Shop",
    domain: "nile.com.au",
    category: "Fashion & Apparel",
    region: "Oceania",
    featuredPrompts: [
      "Purchase a minimalist leather wallet with RFID blocking on Nile Shop.",
      "Check inventory for winter fleece blankets under $45 on Nile catalog."
    ]
  },
  {
    id: "jb-hifi",
    name: "JB Hi-Fi",
    domain: "jbhifi.co.nz",
    category: "Tech & Electronics",
    region: "Oceania",
    featuredPrompts: [
      "Lookup the Bose QuietComfort Ultra wireless headphones on JB Hi-Fi and hold lowest price.",
      "Find noise-canceling earbuds under $150 on JB Hi-Fi."
    ]
  },
  {
    id: "noel-leeming",
    name: "Noel Leeming",
    domain: "noelleeming.co.nz",
    category: "Tech & Electronics",
    region: "Oceania",
    featuredPrompts: [
      "Search for a 55-inch 4K Smart TV under $800 on Noel Leeming and map checkout coordinates.",
      "Locate instant vortex air fryers in stock on Noel Leeming."
    ]
  },
  {
    id: "mighty-ape",
    name: "Mighty Ape",
    domain: "mightyape.co.nz",
    category: "Marketplaces & Direct",
    region: "Oceania",
    featuredPrompts: [
      "Find PlayStation 5 DualSense wireless controllers on Mighty Ape, filtered by discount rate.",
      "Lookup preorders for upcoming fantasy RPG games under $110 on Mighty Ape."
    ]
  },
  {
    id: "farmers-nz",
    name: "Farmers NZ",
    domain: "farmers.co.nz",
    category: "Department",
    region: "Oceania",
    featuredPrompts: [
      "Search for Clinique moisture surge 100h gel-cream on Farmers NZ.",
      "Find a double-breasted woolen trench coat on Farmers and verify sizes available."
    ]
  },
  {
    id: "rebel-sport",
    name: "Rebel Sport",
    domain: "rebelsport.co.nz",
    category: "Sports & Outdoors",
    region: "Oceania",
    featuredPrompts: [
      "Search Nike Zoom Pegasus running shoes size US 10 on Rebel Sport.",
      "Verify pricing for Adidas soccer balls on Rebel Sport and lock checkout route."
    ]
  },
  {
    id: "cotton-on",
    name: "Cotton On",
    domain: "cottonon.com",
    category: "Fashion & Apparel",
    region: "Oceania",
    featuredPrompts: [
      "Find high-rise denim jeans under $40 on Cotton On.",
      "Check out neutral organic cotton t-shirts on Cotton On."
    ]
  },
  {
    id: "adore-beauty",
    name: "Adore Beauty",
    domain: "adorebeauty.co.nz",
    category: "Beauty & Health",
    region: "Oceania",
    featuredPrompts: [
      "Find the Laneige Lip Sleeping Mask (Berry) on Adore Beauty and route to checkout.",
      "Search for SPF 50 facial sunscreen under $30 on Adore Beauty."
    ]
  },

  // US giants & Global Marketplaces
  {
    id: "walmart",
    name: "Walmart",
    domain: "walmart.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Find a 10-piece nonstick Teflon pots and pans cookware set under $80 on Walmart.",
      "Search for organic dark roast whole bean coffee in stock at Walmart and add to cart."
    ]
  },
  {
    id: "amazon",
    name: "Amazon",
    domain: "amazon.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Compare prices for Kindle Paperwrite 16GB on Amazon, locating the certified refurbished model.",
      "Find custom mechanical keyboards with hot-swappable switches under $50 on Amazon."
    ]
  },
  {
    id: "ebay",
    name: "eBay",
    domain: "ebay.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Search eBay for a Space Grey MacBook Pro M3 under $1400 with excellent merchant ratings.",
      "Find vintage leather varsity jackets on eBay within private auction status."
    ]
  },
  {
    id: "target-us",
    name: "Target US",
    domain: "target.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Find mid-century modern bedside nightstands under $100 on Target.",
      "Order Threshold cotton percale sheets queen size on Target."
    ]
  },
  {
    id: "costco-us",
    name: "Costco",
    domain: "costco.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Locate the bulk organic maple syrup 32oz 2-pack on Costco warehouse.",
      "Check member pricing for Kirkland Signature athletic sneakers."
    ]
  },
  {
    id: "best-buy",
    name: "Best Buy",
    domain: "bestbuy.com",
    category: "Tech & Electronics",
    region: "North America",
    featuredPrompts: [
      "Scan Best Buy for open-box ASUS ROG Ally handheld consoles under $450.",
      "Search for external 2TB SSD drives on Best Buy and map add-to-cart clicks."
    ]
  },
  {
    id: "apple",
    name: "Apple Store",
    domain: "apple.com",
    category: "Tech & Electronics",
    region: "Global",
    featuredPrompts: [
      "Configure an Apple iPad Air 11-inch with M2 chip and Wi-Fi 128GB on Apple Store.",
      "Search for midnight leather cases for iPhone 15 Pro on Apple Store."
    ]
  },
  {
    id: "nike",
    name: "Nike",
    domain: "nike.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Find Nike Air Max 90 sneakers color white/black size 9.5 and initiate agent buy.",
      "Search Nike Dri-FIT training hoodies on Nike Store."
    ]
  },
  {
    id: "zara",
    name: "Zara",
    domain: "zara.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Verify linen crop blazers size S in shade beige on Zara catalog.",
      "Locate chelsea leather boots under $110 on Zara."
    ]
  },
  {
    id: "hm",
    name: "H&M",
    domain: "hm.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Search oversized organic wool blends sweaters on H&M under $40.",
      "Add pack of 5 organic cotton rib trunks to cart on H&M."
    ]
  },
  {
    id: "asos",
    name: "ASOS",
    domain: "asos.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Search for vintage baggy trousers under $50 on ASOS.",
      "Find unisex chunky sneakers in ASOS store."
    ]
  },
  {
    id: "macys",
    name: "Macy's",
    domain: "macys.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Search for Samsonite hard-side carry-on spinners with 35%+ off on Macy's.",
      "Find Levi's 511 slim-fit stretch denim on Macy's."
    ]
  },
  {
    id: "nordstrom",
    name: "Nordstrom",
    domain: "nordstrom.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Search for Aesop Resurrection Aromatique Hand Wash on Nordstrom.",
      "Verify stock for Tory Burch leather sandals size 7.5 on Nordstrom."
    ]
  },
  {
    id: "saks",
    name: "Saks Fifth Avenue",
    domain: "saksfifthavenue.com",
    category: "Department",
    region: "North America",
    featuredPrompts: [
      "Find Prada Saffiano leather cardholder in Saks catalog.",
      "Search Jo Malone Sage & Sea Salt cologne on Saks."
    ]
  },
  {
    id: "ikea",
    name: "IKEA",
    domain: "ikea.com",
    category: "Home & Living",
    region: "Global",
    featuredPrompts: [
      "Locate the Kallax 4x4 shelf unit in black-brown in stock at local IKEA store.",
      "Find Fado spherical glass desk lamps on IKEA and trigger checkout sequence."
    ]
  },
  {
    id: "wayfair",
    name: "Wayfair",
    domain: "wayfair.com",
    category: "Home & Living",
    region: "North America",
    featuredPrompts: [
      "Search for minimalist solid wood dining tables with seating for 6 on Wayfair.",
      "Find geometric area rugs size 8x10 under $200 on Wayfair."
    ]
  },
  {
    id: "home-depot",
    name: "The Home Depot",
    domain: "homedepot.com",
    category: "Home & Living",
    region: "North America",
    featuredPrompts: [
      "Verify price of Ryobi ONE+ 18V cordless drill kit at Home Depot.",
      "Find indoor fiddle-leaf fig trees in pots at Home Depot."
    ]
  },
  {
    id: "lowes",
    name: "Lowe's",
    domain: "lowes.com",
    category: "Home & Living",
    region: "North America",
    featuredPrompts: [
      "Find Dewalt 20V brushless impact drivers on Lowe's and evaluate checkout routes.",
      "Search smart thermostat systems with home automation integration on Lowe's."
    ]
  },
  {
    id: "sephora",
    name: "Sephora",
    domain: "sephora.com",
    category: "Beauty & Health",
    region: "Global",
    featuredPrompts: [
      "Find Dior Addict Lip Glow Oil size cherry on Sephora.",
      "Search for Glow Recipe Watermelon Niacinamide Dew Drops on Sephora."
    ]
  },
  {
    id: "ulta",
    name: "Ulta Beauty",
    domain: "ulta.com",
    category: "Beauty & Health",
    region: "North America",
    featuredPrompts: [
      "Find Estée Lauder Double Wear fluid foundation on Ulta.",
      "Search Olaplex No. 3 hair perfector deals on Ulta."
    ]
  },
  {
    id: "newegg",
    name: "Newegg",
    domain: "newegg.com",
    category: "Tech & Electronics",
    region: "North America",
    featuredPrompts: [
      "Find RTX 4070 Ti SUPER graphics cards in stock on Newegg under $850.",
      "Search for DDR5 RAM packages 32GB 6000MHz on Newegg."
    ]
  },
  {
    id: "bh-photo",
    name: "B&H Photo",
    domain: "bhphotovideo.com",
    category: "Tech & Electronics",
    region: "North America",
    featuredPrompts: [
      "Search for Sony Alpha 7 IV mirrorless cameras on B&H Photo.",
      "Find DJI Mini 4 Pro drone combos on B&H Photo."
    ]
  },
  {
    id: "aliexpress",
    name: "Aliexpress",
    domain: "aliexpress.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Find USB-C braided cables pack of 3 on Aliexpress with choice shipping.",
      "Search for retro hand-held gaming emulators on Aliexpress under $40."
    ]
  },
  {
    id: "temu",
    name: "Temu",
    domain: "temu.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Find magnetic cable organizer clips under $5 on Temu.",
      "Search for ergonomic travel neck pillows on Temu."
    ]
  },
  {
    id: "shein",
    name: "Shein",
    domain: "shein.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Find linen blend button-down summer shirts on Shein.",
      "Search mini crossbody bag with gold chain strap on Shein."
    ]
  },
  {
    id: "etsy",
    name: "Etsy",
    domain: "etsy.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Find personalized leather keychains under $20 on Etsy.",
      "Search minimalist custom ceramic coffee mugs on Etsy."
    ]
  },
  {
    id: "decathlon",
    name: "Decathlon",
    domain: "decathlon.com",
    category: "Sports & Outdoors",
    region: "Global",
    featuredPrompts: [
      "Find lightweight trekking tents for 2 people on Decathlon.",
      "Search for compact microfiber towels on Decathlon."
    ]
  },
  {
    id: "rei",
    name: "REI",
    domain: "rei.com",
    category: "Sports & Outdoors",
    region: "North America",
    featuredPrompts: [
      "Find Osprey Talon 22 hiking backpacks on REI and look for coupon codes.",
      "Search for lightweight sleeping pads on REI."
    ]
  },
  {
    id: "patagonia",
    name: "Patagonia",
    domain: "patagonia.com",
    category: "Sports & Outdoors",
    region: "Global",
    featuredPrompts: [
      "Search Patagonia Better Sweater quarter-zip fleece on Patagonia store.",
      "Find Black Hole pack 32L duffle bags on Patagonia."
    ]
  },
  {
    id: "lululemon",
    name: "Lululemon",
    domain: "lululemon.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Find Lululemon Align high-rise yoga pant 25-inch on Lululemon.",
      "Search Metal Vent Tech athletic t-shirts on Lululemon."
    ]
  },
  {
    id: "adidas",
    name: "Adidas",
    domain: "adidas.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Find Samba Classic leather sneakers size 11 on Adidas.",
      "Search for primegreen athletic hoodies on Adidas."
    ]
  },

  // UK & European Giants
  {
    id: "john-lewis",
    name: "John Lewis",
    domain: "johnlewis.com",
    category: "Department",
    region: "UK & Europe",
    featuredPrompts: [
      "Find Dyson Supersonic hair dryers on John Lewis and assert manufacturer warranties.",
      "Search Barbour waxed cotton outdoor jackets on John Lewis."
    ]
  },
  {
    id: "marks-and-spencer",
    name: "Marks & Spencer",
    domain: "marksandspencer.com",
    category: "Department",
    region: "UK & Europe",
    featuredPrompts: [
      "Find premium luxury Egyptian cotton sheets on Marks & Spencer.",
      "Search cashmere crewneck jumpers on Marks & Spencer."
    ]
  },
  {
    id: "argos",
    name: "Argos",
    domain: "argos.co.uk",
    category: "Department",
    region: "UK & Europe",
    featuredPrompts: [
      "Verify store pickup availability for Lego Star Wars Millenium Falcon kits on Argos.",
      "Search for electric heated blankets under £50 on Argos."
    ]
  },
  {
    id: "sainsburys",
    name: "Sainsbury's",
    domain: "sainsburys.co.uk",
    category: "Marketplaces & Direct",
    region: "UK & Europe",
    featuredPrompts: [
      "Assemble basket for cold cold-brew coffee, organic free-range eggs on Sainsbury's.",
      "Search for sourdough bakery bread loaves on Sainsbury's."
    ]
  },
  {
    id: "tesco",
    name: "Tesco",
    domain: "tesco.com",
    category: "Marketplaces & Direct",
    region: "UK & Europe",
    featuredPrompts: [
      "Search organic baby wipes twin pack on Tesco online.",
      "Find dark chocolate biscuits on Tesco grocery shop."
    ]
  },
  {
    id: "carrefour",
    name: "Carrefour",
    domain: "carrefour.fr",
    category: "Marketplaces & Direct",
    region: "UK & Europe",
    featuredPrompts: [
      "Find French whole-bean espresso roast on Carrefour online hypermarket.",
      "Verify stock for organic raw honey on Carrefour."
    ]
  },

  // Other Global Giants
  {
    id: "mercado-libre",
    name: "Mercado Libre",
    domain: "mercadolibre.com",
    category: "Marketplaces & Direct",
    region: "Global",
    featuredPrompts: [
      "Find smart plugs with Alexa support on Mercado Libre under $300 MXN.",
      "Search for orthopedic memory foam pillows on Mercado Libre."
    ]
  },
  {
    id: "rakuten",
    name: "Rakuten JP",
    domain: "rakuten.co.jp",
    category: "Marketplaces & Direct",
    region: "Asia",
    featuredPrompts: [
      "Search Japanese matcha powder whisk kits on Rakuten.",
      "Locate premium sencha green tea packages on Rakuten JP."
    ]
  },
  {
    id: "uniqlo",
    name: "Uniqlo",
    domain: "uniqlo.com",
    category: "Fashion & Apparel",
    region: "Global",
    featuredPrompts: [
      "Purchase Uniqlo Airism cotton t-shirt in grey weight size M.",
      "Search for ultra light packable down jackets on Uniqlo."
    ]
  },
  {
    id: "taobao",
    name: "Taobao",
    domain: "taobao.com",
    category: "Marketplaces & Direct",
    region: "Asia",
    featuredPrompts: [
      "Search modular desk deskpad wool materials under ¥80 on Taobao.",
      "Find customized acrylic figures display stand on Taobao."
    ]
  },
  {
    id: "flipkart",
    name: "Flipkart",
    domain: "flipkart.com",
    category: "Marketplaces & Direct",
    region: "Asia",
    featuredPrompts: [
      "Find wireless phone chargers compatible with iPhone on Flipkart.",
      "Search soundbars under ₹5000 with subwoofer on Flipkart."
    ]
  },
  {
    id: "myntra",
    name: "Myntra",
    domain: "myntra.com",
    category: "Fashion & Apparel",
    region: "Asia",
    featuredPrompts: [
      "Search for men's casual slim-fit denim jackets under ₹2000 on Myntra.",
      "Find floral georgette sarees with reviews above 4.2 stars on Myntra."
    ]
  },
  {
    id: "barnes-noble",
    name: "Barnes & Noble",
    domain: "barnesandnoble.com",
    category: "Marketplaces & Direct",
    region: "North America",
    featuredPrompts: [
      "Search for paperback edition of 'Project Hail Mary' by Andy Weir on Barnes & Noble.",
      "Find hardcover fantasy novels with special collector covers under $40."
    ]
  },
  {
    id: "waterstones",
    name: "Waterstones",
    domain: "waterstones.com",
    category: "Marketplaces & Direct",
    region: "UK & Europe",
    featuredPrompts: [
      "Find signed hardcovers of contemporary mystery thriller novels on Waterstones.",
      "Search award-winning sci-fi books in stock at local Waterstones store."
    ]
  },
  {
    id: "chewy",
    name: "Chewy",
    domain: "chewy.com",
    category: "Beauty & Health",
    region: "North America",
    featuredPrompts: [
      "Order grain-free salmon dry cat food 12lb bag on Chewy.",
      "Search for orthodontic orthopedic memory foam dog beds on Chewy."
    ]
  },
  {
    id: "petco",
    name: "Petco",
    domain: "petco.com",
    category: "Beauty & Health",
    region: "North America",
    featuredPrompts: [
      "Find standard wire dog crates with separators on Petco.",
      "Search for cat scratching posts trees under $50 on Petco."
    ]
  },
  {
    id: "zappos",
    name: "Zappos",
    domain: "zappos.com",
    category: "Fashion & Apparel",
    region: "North America",
    featuredPrompts: [
      "Search Birkenstock Arizona eva sandals in active size 8 on Zappos.",
      "Find waterproof hiking booties size 10 on Zappos."
    ]
  },
  {
    id: "glossier",
    name: "Glossier",
    domain: "glossier.com",
    category: "Beauty & Health",
    region: "Global",
    featuredPrompts: [
      "Purchase Boy Brow grooming pomade in brown on Glossier.",
      "Search Milky Jelly cleanser 150ml on Glossier store."
    ]
  },
  {
    id: "chemist-warehouse",
    name: "Chemist Warehouse",
    domain: "chemistwarehouse.co.nz",
    category: "Beauty & Health",
    region: "Oceania",
    featuredPrompts: [
      "Search for Cetaphil gentle skin cleanser 1L on Chemist Warehouse.",
      "Find cold and flu tablets under $15 on Chemist Warehouse NZ."
    ]
  },
  {
    id: "big-w",
    name: "Big W",
    domain: "bigw.com.au",
    category: "Department",
    region: "Oceania",
    featuredPrompts: [
      "Search for standard 4-drawer plastic storage towers on Big W.",
      "Find soft flannel fleece blankets under $25 on Big W."
    ]
  },
  {
    id: "kathmandu",
    name: "Kathmandu",
    domain: "kathmandu.co.nz",
    category: "Sports & Outdoors",
    region: "Oceania",
    featuredPrompts: [
      "Find standard packing cubes 3-piece travel sets on Kathmandu.",
      "Search for lightweight down puffer vests on Kathmandu hiker store."
    ]
  },
  {
    id: "target-au",
    name: "Target AU",
    domain: "target.com.au",
    category: "Department",
    region: "Oceania",
    featuredPrompts: [
      "Find toddler unisex rain boots on Target AU.",
      "Search linen blend throw cushions under $20 on Target Australia."
    ]
  }
];
