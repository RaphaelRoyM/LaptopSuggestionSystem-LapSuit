# BUILD_PROCESS.md

**Project:** LapSuit – Laptop Recommendation System
**Author:** Raphael Roy
**Project Start Date:** 24 February 2026
**Current Status:** Deployed (Render) – 09 March 2026

---

# 1. Introduction

This document describes the **development journey of the LapSuit Laptop Recommendation System**, including research, architectural decisions, experimentation, debugging, and improvements made throughout the project.

The document records **day-by-day progress**, demonstrating how the project evolved from an initial idea into a working web application.

The project was developed with **AI-assisted research, coding guidance, debugging support, and architectural suggestions**. AI tools were used to accelerate development while the final design decisions, experimentation, and integration were performed manually.

---

# 2. Project Goal

The goal of the project was to build a **Laptop Recommendation System** that helps users find suitable laptops based on their needs.

Users can select preferences such as:

* Budget
* Processor type
* RAM
* Storage
* Display size
* Portability
* Usage requirements

The system evaluates available laptops and recommends the **best matching devices using a scoring algorithm**.

---

# 3. Development Timeline

---

# February 24, 2026 – Project Research and Problem Definition

This was the **initial research phase**.

## Initial Idea

The goal was to build a system where users could:

* Compare laptops
* Filter laptops by specifications
* Receive personalized recommendations

The main challenge at this stage was identifying **a dataset that could support such a system**.

## Dataset Research

Research was conducted to find publicly available laptop datasets.

### Google Search Queries Used

* laptop dataset kaggle
* laptop specifications dataset csv
* laptop comparison dataset kaggle
* dataset for laptop recommendation system
* laptop features dataset with price

Through this research, a **Kaggle dataset containing laptop specifications** was identified.

## Dataset Evaluation

The dataset included:

* Brand
* Product name
* Processor
* RAM
* Hard drive
* Display
* Display resolution
* Display refresh rate
* Operating system
* Weight
* Warranty
* Price

### Limitation Found

The dataset did **not include ratings for features** such as:

* performance rating
* battery rating
* keyboard rating
* display rating
* there where many empty fields
* incorrect values

## Decision

Instead of building a **rating-based comparison system**, the approach changed to a **rule-based recommendation algorithm**.

The recommendation engine would calculate scores based on how closely laptops match user preferences.

---

# February 25, 2026 – System Planning and Architecture

After confirming the dataset, system architecture planning began.

## System Structure

The system was divided into three layers:

### Frontend

Responsible for:

* displaying laptops
* collecting user preferences
* showing recommendations

### Backend

Responsible for:

* processing laptop data
* filtering laptops
* calculating recommendation scores

### Dataset Layer

Laptop information stored as a **CSV dataset**.

## Technology Decisions

Chosen technologies:

* Node.js
* Express.js
* HTML
* CSS
* JavaScript
* CSV dataset

The goal was to keep the system **lightweight and easy to deploy**.

---

# February 26, 2026 – Backend Development Begins

Backend implementation started.

## Tasks Completed

* Created Node.js project
* Installed Express
* Implemented basic server
* Added CSV reading logic
* Converted CSV rows to JSON objects

## Problems Encountered

Dataset values were not consistently formatted.

Example:

RAM:

```
16GB DDR4
8GB DDR4
```

Storage:

```
512GB SSD
1TB HDD
```

These formats prevented direct numerical comparison.

## Solution

Parsing functions were created to extract numeric values.

Examples:

* RAM size extraction
* Storage conversion to GB
* Display size extraction

This enabled **numeric filtering and scoring**.

---

# February 27, 2026 – API Development

After successfully loading the dataset, backend APIs were created.

## APIs Implemented

* `/api/laptops`
* `/api/brands`
* `/api/specOptions`
* `/api/displayOptions`
* `/api/laptops/search`

These endpoints allowed the frontend to retrieve and filter laptop data.

## Additional Research

During this stage, additional research was done on:

* Express API design
* Efficient filtering methods
* Handling CSV datasets in Node.js

---

# February 28, 2026 – Filtering System

The next step was implementing **dynamic filtering**.

Users needed the ability to filter laptops by:

* brand
* price
* RAM
* storage
* processor
* display size
* operating system
* warranty
* weight

## Implementation

Filtering logic was implemented in backend functions that:

1. Receive user preferences
2. Parse dataset fields
3. Apply filters
4. Return filtered results

## Challenge

Laptop specifications sometimes had **different text formats**, requiring additional normalization logic.

---

# March 1, 2026 – Recommendation Algorithm

Once filtering worked, work began on the **recommendation scoring system**.

## Initial Approach

At first, the system simply displayed filtered laptops.

However, this did not clearly show **which laptop was the best choice**.

## Improved Approach

A **scoring algorithm** was introduced.

Example scoring weights:

* Processor match
* RAM capacity
* Price within budget
* Display preferences
* Portability

Each laptop receives a **score**, and results are sorted from highest to lowest.

---

# March 2, 2026 – Frontend Development

Frontend development began.

## UI Components Implemented

* Laptop card layout
* Specification display
* Price highlighting
* Recommendation score display

The goal was to provide **clear and readable laptop information**.

---

# March 3, 2026 – UI Improvements

Several usability improvements were made.

### Improvements

* Added **Top Recommendation badge**
* Improved laptop card design
* Adjusted layout spacing
* Improved readability of specifications

These changes made the interface easier to understand.

---

# March 4, 2026 – Search Feature

A search feature was implemented.

Users can now:

* search laptops by name
* quickly locate specific models

## Issue Found

Laptop cards appeared differently when using search results compared to recommendation results.

### Cause

Different rendering functions were used.

### Fix

Both results were updated to use **the same card rendering logic**.

---

# March 5, 2026 – Debugging and Bug Fixes

During testing, several issues were discovered.

## Issue 1 – Undefined Score

Some laptops displayed:

```
Score: undefined
```

### Cause

Score variable not initialized.

### Fix

A default score value was added.

---

## Issue 2 – CSV File Path Error

The server occasionally failed to load the dataset.

### Cause

Incorrect file path.

### Fix

Updated dataset loading path.

---

# March 6, 2026 – UI Refinement and Styling

Additional UI improvements were made.

### Improvements

* Moved CSS into a separate `style.css` file
* Improved laptop card alignment
* Adjusted responsiveness
* Added laptop images using external sources

Research was also done on **better UI layouts for product comparison systems**.

---

# March 7, 2026 – Architecture Documentation

System architecture documentation was created.

A **system architecture diagram** was produced using:

* LaTeX
* Overleaf
* TikZ

The diagram illustrates:

* User
* Frontend interface
* Backend API
* Recommendation engine
* Dataset layer

This documentation improves **technical clarity of the system design**.

---

# March 8, 2026 – Deployment Preparation

The system was prepared for deployment.

## Tasks Performed

* Organized project files
* Prepared GitHub repository
* Ensured dataset loading worked correctly
* Tested APIs locally

## Deployment Options Researched

Deployment platforms considered:

* Vercel
* Render
* Railway

Render was selected due to **better backend support for Node.js applications**.

---

# March 9, 2026 – Deployment (Render)

The project was deployed to the **Render cloud platform**.

## Deployment Steps

1. Connected GitHub repository to Render
2. Configured Node.js service
3. Set build and start commands
4. Uploaded dataset
5. Tested deployed application

The system was successfully deployed and made accessible online.

This stage marked the **completion of the initial version of the project**.

---

# 4. Alternative Approaches Considered

## GPT-Based Chatbot Recommendation

Initial idea:

Users would type requests such as:

```
I need a laptop for gaming under 70000
```

### Reason Rejected

* API cost
* dependency on external services
* complexity

Instead, a **structured preference form** was implemented.

---

## Collaborative Filtering

Another possible approach was **collaborative filtering**, where recommendations are based on other users' choices.

### Reason Rejected

This requires:

* user interaction data
* large datasets
* behavioral history

The dataset only contained laptop specifications.

---

# 5. Refactoring Decisions

Several refactoring improvements were made:

### Unified UI Rendering

Search results and recommendation results were updated to use the **same card layout**.

### Data Parsing Functions

Created dedicated functions for:

* RAM extraction
* storage conversion
* display size extraction

This improved **code readability and maintainability**.

---

# 6. Mistakes and Corrections

| Issue                   | Cause                        | Solution                    |
| ----------------------- | ---------------------------- | --------------------------- |
| Score showing undefined | Score not initialized        | Added default value         |
| Different card layouts  | Separate rendering functions | Unified UI rendering        |
| CSV file not found      | Incorrect dataset path       | Fixed file path             |
| Filtering errors        | Text formatted specs         | Implemented numeric parsing |

These corrections improved **system stability and reliability**.

---

# 7. Evolution of the System

The project evolved through multiple stages:

1. Dataset research
2. Backend API development
3. Filtering system
4. Recommendation algorithm
5. Frontend UI
6. Search functionality
7. Bug fixing
8. Documentation
9. Deployment

Each stage progressively improved the system.

---

# 8. Final Outcome

The final system provides:

* Laptop filtering by specifications
* Preference-based recommendations
* Ranked laptop suggestions
* Clean UI for comparison
* Deployed web application

The development process involved **continuous learning, experimentation, debugging, and iteration**, supported by AI-assisted development tools.

The result is a **functional laptop recommendation system capable of helping users select suitable devices based on their needs**.

---
