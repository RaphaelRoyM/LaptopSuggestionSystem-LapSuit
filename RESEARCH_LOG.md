# Research Log – LapSuit Laptop Recommendation System

This document records the research process followed while building the **LapSuit Laptop Recommendation System**.

It includes dataset research, design decisions, external references, AI assistance used during development, and how those suggestions were evaluated or modified.

The goal of this log is to **transparently document the development process and demonstrate responsible use of AI tools as a support tool, not as a replacement for development decisions.**

---

# 1. Project Research Goal

The initial goal of this project was to build a **Laptop Recommendation System** that helps users identify laptops that best match their needs.

The system should allow users to:

* Filter laptops based on specifications
* Compare different laptop models
* Receive recommendations based on preferences

To achieve this, a dataset containing **laptop specifications and ratings** was required.

---

# 2. Dataset Research

## Objective

Find a dataset that contains:

* Laptop specifications
* Price
* Hardware details
* Feature ratings (if possible)

Feature ratings were originally desired because they would allow a **more accurate comparison between laptops**.

---

## Google Search Queries Used

The following search queries were used during dataset exploration:

* laptop dataset kaggle
* laptop specifications dataset csv
* laptop comparison dataset kaggle
* dataset for laptop recommendation system
* laptop dataset with price and specs
* laptop features dataset csv

---

## Dataset Selected

A dataset from **Kaggle** was selected after reviewing multiple options.

Dataset contained fields such as:

* Brand
* Product Name
* Processor
* RAM
* Storage
* Display
* Display Resolution
* Display Refresh Rate
* Operating System
* Weight
* Warranty
* Price

This dataset provided realistic laptop specifications that could be used for filtering and recommendation.

---

## Dataset Limitations

While the dataset contained detailed specifications, it **did not include ratings for individual features** such as:

* Performance rating
* Battery rating
* Display quality rating
* Keyboard quality rating

Because of this limitation, the original plan of building a **rating-based recommendation system** was not possible.

---

## Final Decision

Instead of relying on feature ratings, a **rule-based scoring algorithm** was implemented.

Each laptop receives a score based on how well its specifications match the user’s preferences.

Examples of scoring criteria include:

* Processor performance
* RAM capacity
* Storage size
* Display size
* Price range
* Portability (weight)

Laptops are then sorted by score, and the **highest-scoring laptops are recommended to the user**.

---

# 3. Research on Recommendation System Approaches

To determine the most suitable recommendation approach, several concepts were researched.

## Search Queries

* how recommendation systems work
* content based recommendation system example
* rule based recommendation system
* laptop recommendation algorithm
* product recommendation system design

---

## Key Concepts Studied

Three common recommendation approaches were reviewed.

### Collaborative Filtering

Uses behavior of multiple users to generate recommendations.

Example:

* Netflix or Amazon recommendation systems.

Limitation for this project:

* Requires large user interaction data.

Therefore it was **not suitable for this project**.

---

### Content-Based Filtering

Recommends items based on **item features and user preferences**.

Example:

* Matching laptop specifications with user requirements.

This approach was **partially used**.

---

### Rule-Based Scoring

A rule-based system evaluates laptops based on predefined rules.

Example rules:

* If user selects Gaming, prioritize higher RAM and GPU
* If user selects Portability, prioritize lower weight
* If user selects Budget, filter laptops within price range

This approach was chosen because it **works well with small datasets and no user history**.

---

# 4. UI/UX Inspiration Research

During the design phase, several **e-commerce websites were observed** to understand how products are presented and filtered.

Key inspiration sources included:

* Flipkart laptop listing pages
* Amazon laptop product pages

These platforms provided ideas for:

* Product card layout
* Filter panels
* Displaying specifications clearly
* Highlighting recommended items

The **LapSuit UI design was simplified** to maintain clarity while keeping a familiar layout.

---

# 5. AI Assistance (ChatGPT)

AI was used during development as a **technical assistant** to help with:

* debugging
* architecture ideas
* documentation

All suggestions were **reviewed and adapted before being integrated into the project**.

---

## Example AI Prompts Used

### Prompt 1

**How can I create a rule based scoring system for recommending laptops?**

Purpose:

* Understand how recommendation scores could be calculated.

Outcome:

Suggested scoring based on:

* RAM
* Processor
* Price
* Display size

Decision:

Concept was **accepted and implemented with adjustments**.

---

### Prompt 2

**How can I highlight the top recommended laptop in the UI?**

Purpose:

* Improve the user interface by highlighting the best recommendation.

Outcome:

* AI suggested marking the first ranked laptop.

Modification:

Instead of plain text, a **visual badge was added using CSS** to highlight the top recommendation.

---

### Prompt 3

**How can I filter laptops by RAM, storage, processor and price using Node.js?**

Purpose:

* Implement filtering in the backend.

Outcome:

AI suggested using:

* Express API endpoints
* Array filtering logic

Modification:

Dataset values required **additional parsing before filtering**.

---

### Prompt 4

**Can you help create a professional architecture diagram for my laptop recommendation system?**

Purpose:

* Generate documentation diagrams.

Outcome:

AI suggested using **LaTeX (Overleaf) with TikZ for architecture diagrams**.

This was later used to create the **system architecture diagram included in the documentation**.

---

# 6. Modifications Made to AI Suggestions

AI suggestions often required modifications because the dataset stored values **in text format**.

---

### RAM Parsing

Dataset format:

* 16GB DDR4
* 8GB DDR4

Modified logic extracts numeric values:

```
const match = ramField.match(/\d+/);
```

---

### Storage Parsing

Dataset format:

```
1TB HDD
512GB SSD
```

Converted values to **numeric GB values before filtering**.

---

### Display Size Extraction

Display values appear as:

* 15.6" Full HD
* 14" IPS

A custom function was written to **extract numeric display size**.

---

# 7. Ideas Considered but Not Implemented

## Chatbot-Based Recommendation

Original idea:

Allow users to type natural language queries such as:

> "I need a laptop for gaming under 70000"

The system would extract preferences using an AI model.

### Reason for Rejection

* API usage limitations
* Cost considerations
* Increased project complexity

### Alternative Used

A **structured preference selection interface** using form inputs and filters.

---

# 8. Deployment Research

Deployment options were also explored.

### Search Queries

* how to deploy node js project
* vercel deployment with github
* netlify deployment with github
* node backend deployment options

Vercel and Netlify were considered because they support **GitHub-based deployments and automatic builds**.

However, deployment configuration still requires ensuring that **static files such as the dataset CSV are accessible**.

I understood that **Vercel cannot deploy Express.js projects properly**.

I tried deploying via **Netlify**, but only the frontend was visible with no functionality.

Therefore, there was a need to switch to another platform.

Then after this I found another platform called **RENDER**, which supports **Express.js**.

So I created an account in Render.

---

# Step-by-Step Deployment of the Project on Render

## 8.1 Create an Account on Render

Steps:

* Go to https://render.com
* Click **Get Started**
* Choose **Continue with GitHub**
* Authorize Render to access your GitHub account

This automatically creates your Render account and connects it to your GitHub repositories.

---

## 8.2 Prepare the Project on GitHub

Steps:

* Create a repository in GitHub
* Upload the project files
* Push the code using Git

This makes the project available online for deployment.

---

## 8.3 Create a New Web Service on Render

Steps:

* Open the Render Dashboard
* Click **New**
* Select **Web Service**
* Choose **GitHub**

---

## 8.4 Select the Repository

Steps:

* Find your project repository
* Click **Connect**

Render now prepares to deploy the application.

---

## 8.5 Configure Web Service Settings

Basic Settings:

| Field          | Value        |
| -------------- | ------------ |
| Name           | project name |
| Language       | Node         |
| Branch         | main         |
| Region         | Default      |
| Root Directory | Leave empty  |

Build and Start Commands:

```
Build Command: npm install
Start Command: node server.js
```

Instance Type:

* Free

---

## 8.6 Advanced Settings

Most advanced options can be left as default.

Auto deploy means the application automatically redeploys when **code is pushed to GitHub**.

---

## 8.7 Environment Variables

Environment variables are used for API keys or secrets.

For this project:

* No environment variables were required

Render automatically provides the **PORT variable** used in server code:

```
const PORT = process.env.PORT || 3000;
```

---

## 8.8 Deploy the Web Service

Steps:

1. Click **Deploy Web Service**
2. Render starts deployment

Deployment stages include:

* Cloning the GitHub repository
* Installing dependencies
* Starting the Node.js server

---

## 8.9 Monitor Deployment Logs

Render shows build and runtime logs.

During deployment, an error occurred due to **incorrect variable initialization order**, which was later fixed.

After fixing the code and pushing the update to GitHub, Render automatically **redeployed the project**.

---

## 8.10 Access the Deployed Application

Render provides a public URL such as:

```
https://project-name.onrender.com
```

This allows anyone on the internet to access the application.

---

# 9. References

The following resources influenced the project:

1. Kaggle

   * Laptop dataset used for specifications and pricing.

2. Flipkart Laptop Section

   * Used for understanding filtering systems and product display design.

3. General Articles on Recommendation Systems

   * Studied to understand different recommendation approaches.

---

# 10. Responsible AI Usage

AI tools were used primarily for:

* Clarifying implementation approaches
* Debugging development issues
* Generating documentation ideas
* Improving UI and architecture design

All outputs from AI were:

* Reviewed carefully
* Modified when required
* Implemented only after understanding the logic

Final design and implementation decisions were **made manually**.

---

# 11. Summary

The development process involved:

* Researching datasets
* Evaluating recommendation system approaches
* Designing a rule-based scoring system
* Implementing filtering and ranking features
* Improving UI based on usability research

AI tools were used as **support tools during development**, while the **core system design and implementation decisions were made independently**.
