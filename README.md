<!-- Laptop Recommendation System -->

A full-stack web application that helps users discover laptops based on their preferences and usage needs.
The system allows both manual filtering (like e-commerce websites) and guided recommendations for non-technical users.

This project was built as part of my preparation for entering the software industry, focusing on problem understanding, data processing, and building a usable recommendation interface rather than only implementing algorithms

<!-- Project Motivation -->

Initially, the idea for this project was to build a Telegram chatbot that could understand natural language queries such as:

"I want a laptop for gaming and video editing under ₹65,000."

The plan was to integrate ChatGPT so the system could extract useful information from such queries (purpose, budget, performance requirements) and map them to laptop specifications in the dataset.

However, due to API usage limits, integrating GPT was not possible within the project constraints.

Because of this limitation, I redesigned the system to use a structured input interface (dropdowns, filters, and guided questions) while keeping the core idea of a recommendation system intact.

<!-- Problem Understanding -->

Buying a laptop is difficult for many users because:

- Laptop specifications can be confusing
- Many users do not know which specifications matter
- Online marketplaces show too many options without guidance

This project tries to solve that by offering two different ways to find laptops:

- Search by name – for users who know what they want
- Set Preferences – advanced filtering similar to e-commerce websites
- Get Recommended – guided questions for users who do not understand technical specifications

<!-- Dataset and Data Challenges -->

The dataset was collected from Kaggle.

However, the raw dataset had several problems:

- Many missing values
- Irrelevant information
- Inconsistent formatting
- Some fake or unrealistic entries
- Specifications stored as unstructured text

Examples:
- RAM: "16GB DDR4"
- Display: "15.6 inch Full HD"
- Price: "₹65,990"

These fields required parsing and cleaning before they could be used in filtering or recommendation logic.

For example:

- Extracting numeric RAM values from text
- Converting storage values (TB → GB)
- Parsing display size from strings
- Removing currency symbols from prices

Data cleaning was one of the most challenging parts of the project. the data cleaning takes too much time because it contain more than 1000 laptop details. i just converted the features  used in the project to to useful format.

Assumptions Made

Several assumptions were necessary due to dataset limitations such as

1. Laptop performance is approximated using:
  - Processor family
  - RAM size
  - Price range
2. Display size is extracted from text using pattern matching.
3. Storage values like 1TB are converted into 1024GB.
4. Laptop weight is assumed to be portable if
  - Weight ≤ 1.8 kg
5. The recommendation score is calculated based on:
  - Processor suitability
  - RAM capacity
  - Budget fit
  - Portability preference
  - Display preference

<!-- System Architecture -->

The project follows a simple client-server architecture.
Browser (Frontend)
      |
      |  HTTP Requests
      |
Node.js + Express (Backend API)
      |
      |
CSV Dataset (Kaggle)

<!-- Technology Stack -->

1. Frontend
  - HTML
  - CSS
  - JavaScript
2. Backend
  - Node.js
  - Express.js
3. Data Processing
  - csv-parser
  - File system streaming
4. Dataset
  - Kaggle laptop dataset (CSV)

<!-- Project Structure -->
LaptopRecommendationBot
│
├── server.js
│
├── data
│   └── laptops_Dataset.csv
│
├── public
│   ├── index.html
│   ├── css
│   │   └── style.css
│   └── js
│       └── script.js
│
├── Design Diagrams
│
├── BUILD_PROCESS.md
│
├──RESEARCH_LOG.md
│
└── README.md


<!-- Key Features -->
1. Search by Laptop Name

  Users can search laptops directly by typing the product name.

  Example:
    - Search: "HP Pavilion"
  Backend performs a simple fuzzy match.
  Endpoint:
    - GET /api/laptops/search

2. <!-- Advanced Filter System -->

Inspired by Flipkart's filtering interface.
Users can filter laptops based on the following
  - Brand
  - Price
  - Processor brand
  - Processor series
  - RAM
  - Storage
  - Display size
  - Display resolution
  - Refresh rate
  - Operating system
  - Warranty
  - Weight
  - Keyboard type
The filtering logic runs on the backend.
Endpoint:-
  - POST /api/laptops

The server dynamically applies filters based on the request body.

3. <!-- Guided Recommendation System -->

Many users do not understand specifications.
The Get Recommended feature asks simple questions:
What will you use the laptop for?
  - Budget
  - Preferred RAM
  - Portability
  - Display size

Example purposes:
  - Student
  - Programming
  - Coding + Gaming
  - High-end Gaming / Editing
  - Office Work

Each purpose maps to minimum requirements.
Example:
  - Programming:
  - Processor → i5 / Ryzen 5
  - Minimum RAM → 8GB

Recommendation Algorithm

Each laptop is given a score based on how well it matches the user's needs.

**Scoring logic:**
*Criteria	Score*
  - Processor match	+40
  - RAM requirement	+30
  - User preferred RAM	+10
  - Budget fit	+20
  - Portability	+10
  - Display size	+10

Laptops are then sorted by:
  - Score (highest first)
  - RAM (higher first)
  - Price (lower first)
The top results are returned.

<!-- Example Recommendation -->

User input:
  - Purpose: Programming
  - Budget: 60000
  - RAM: 8GB
  - Portability: Yes
  - Display: 14"
The system ranks laptops based on these conditions.
The best match receives a Top Recommendation badge.

<!-- Important Backend Functions -->
**getDisplaySize()**
Extracts display size from text like:
  - "15.6 inch Full HD"
Returns:
  - 15.6
  
**/api/laptops**
Main filtering API.
Handles all filtering conditions:
  - Brand
  - Processor
  - RAM
  - Storage
  - Price
  - Display
  - OS
  - Weight
  - Warranty

**/api/specOptions**
Extracts unique specification values from the dataset.
Used to dynamically populate filter options.

Example:
  - RAM values
  - Memory values
  - Operating systems
  - Warranties

**/api/recommend**
Core recommendation endpoint.
Steps:
  1. Read user inputs
  2. Apply purpose rules
  3. Score each laptop
  4. Sort by score
  5. Return top matches

<!-- Important Frontend Functions -->
*createLaptopCard()*
Generates laptop cards dynamically.

Displays:
  - Laptop image
  - Name
  - Brand
  - Processor
  - RAM
  - Price
  - Recommendation badge

*applyFilter()*
Collects all selected filters and sends them to the backend.
POST /api/laptops
Results are rendered dynamically.

*searchLaptop()*
Performs real-time laptop search using:
/api/laptops/search

*submitPurpose()*
Handles recommendation questions.
Validates inputs and sends them to:
/api/recommend

*displayRecommended()*
Displays ranked laptops with match scores.
Also highlights the top recommendation.

<!-- Edge Cases Considered -->

Several edge cases were handled during development:
1. Empty filter results
  - "No laptops found"

2. Missing dataset values
  Handled with safe checks.

3. RAM format variations
  Example:
    - 8GB
    - 16 GB DDR4

4. Storage format differences
  Example:
    - 1TB
    - 512GB
  Converted to consistent numeric values.

5. Price formatting
Example:
  - ₹65,990
Converted to numeric value.

<!-- UI Design Decisions -->

The interface was designed based on studying Flipkart's laptop category page.
Important decisions:
  - Full-screen filter panel
  - Category-based filter navigation
  - Card-based laptop display
  - Guided recommendation modal
  - Scrollable filter sections
Goal: make the system feel similar to a real e-commerce interface.

**How to Run the Project**
1. Install dependencies
npm install
2. Start server
node server.js
3. Open browser
http://localhost:3000

<!-- Limitations -->
  - Dataset quality is limited.
  - Recommendation logic is rule-based.
  - Images are placeholders from Unsplash.
  - No user authentication.
  - No database (uses CSV).
  - lack of time to do this project because of the major project and temporary health issues , i could not test every test cases. sometimes the css looks like it need fix.

<!-- Future Improvements -->

If I had more time or a cleaner dataset, I would improve the project by adding:
1. Natural Language Queries
  Using GPT to interpret queries like:
    - "I need a lightweight laptop for coding under 70000"
2. Laptop Comparison Tool
  Users could select multiple laptops and compare:
    - CPU
    - RAM
    - Storage
    - Display
    - Price
    - portability
Side-by-side.

3. Better Recommendation Algorithm
  Use:
    - Machine learning models
    - User behavior data
    - Real laptop benchmark scores

4. Better Dataset
  Use verified laptop data with consistent formatting.

5. Real Product Images
  Integrate product images from APIs or scraped sources.

6. I i have more time this website would not be dropdown oriented website. I didn't got the dataset as i expected. i expect data set with completely filled values in a structured way. the current dataset had values like, 8gb, 8GB, 8 Gb. in every column is such a manner. for this i had to convert my most of the time to mannual data cleaning in google sheets.

**What I Learned**
This project helped me understand:
    - Data cleaning challenges.
    - Backend filtering logic.
    - Designing recommendation systems.
    - Building dynamic user interfaces.
    - Structuring a full-stack application.
    - create System diagrams.
    - my weaknesses.
    - how to work efficiently.
More importantly, it helped me practice thinking about real user problems rather than just writing code.