/* THE STORAGE FILE: all work and blog entries live here. Replace this file with the one downloaded from the admin panel to publish changes. */
window.SITE_CONTENT = {
  "works": [
    {
      "slug": "bank-performance-dashboard",
      "title": "Bank Loan Portfolio Analysis Using Python and Tableau",
      "summary": "Analysed 887K loan records to evaluate portfolio health, repayment performance, and credit risk using Python, Pandas, and Tableau. Key metrics include funded amount, DTI ratio, and charge-off rates.",
      "tags": [
        "Python",
        "Pandas",
        "NumPy",
        "Jupyter Notebook",
        "Tableau Public",
        "Data Cleaning",
        "EDA",
        "KPI Reporting"
      ],
      "date": "2025-06-01",
      "body": "## Project Overview\n\nThis Bank Loan Portfolio Analysis project explores loan repayment performance, credit risk, and portfolio health using Python, Pandas, and Tableau across approximately 887,000 loan records.\n\n## What I Did\n\n- Cleaned and prepared the raw dataset using Python and Pandas — handling missing values, duplicate records, and outlier review.\n- Calculated key performance indicators: total loan applications, funded amount, total repayments received, average interest rate, and debt-to-income (DTI) ratio.\n- Segmented loans into Good Loans and Charged-Off Loans to quantify portfolio quality and recovery patterns.\n- Compared loan performance across credit sub-grades, home ownership status, income groups, borrower verification status, and US states.\n- Analysed recovery amounts on charged-off loans to assess the effectiveness of collections.\n- Built an interactive Tableau dashboard to present findings in a format accessible to non-technical stakeholders.\n\n## Key Findings\n\n- Good loans (fully paid + current) represent 86.2% of the portfolio by count.\n- Charged-off loans account for 13.8% of applications but a disproportionate share of funded amount at risk.\n- Average interest rate across all loans: 12.05%; charged-off loans average 13.88%.\n- Borrowers in the 60-month term category show a significantly higher default rate than 36-month borrowers.\n- Grade B and C loans dominate the portfolio — balancing volume with moderate credit risk.\n\n## Business Objective\n\nTo understand the health of a loan portfolio, identify areas of potential credit risk, and communicate key financial indicators through interactive data visualisations that support faster, more confident lending decisions.\n\n## Interactive Tableau Dashboard\n\nExplore the full Bank Loan Portfolio Dashboard on Tableau Public:\nhttps://public.tableau.com/app/profile/sushmita.sharma4479/viz/bankloanportfolio1/summary?publish=yes",
      "dashboardUrl": "https://public.tableau.com/app/profile/sushmita.sharma4479/viz/bankloanportfolio1/summary?publish=yes",
      "videoPath": "media/videos/bank--.mp4"
    },
    {
      "slug": "root-cause-recurring-issues",
      "title": "Sephora Customer Satisfaction Analysis",
      "summary": "Analysed Sephora product and review data to uncover what drives ratings, recommendations, and customer engagement across brands, categories, and skin-type segments.",
      "tags": [
        "Python",
        "Pandas",
        "NumPy",
        "Jupyter Notebook",
        "Tableau",
        "Data Cleaning",
        "EDA",
        "Customer Satisfaction"
      ],
      "date": "2025-03-01",
      "body": "## Project Overview\n\nThis project analyses customer satisfaction at Sephora using product information and customer review data to understand what influences product ratings, recommendation rates, and overall customer engagement.\n\n## Key Analysis Areas\n\n- Customer Satisfaction Score (CSS) calculation and product rating distribution\n- Brand-wise and category-wise satisfaction benchmarking\n- Review volume, helpfulness ratings, and recommendation rates\n- Product price versus customer rating correlation\n- Customer segmentation by skin type, skin tone, hair colour, and eye colour\n- Identification of top-performing brands and best-reviewed products\n\n## Tools and Technologies\n\nPython, Pandas, NumPy, Jupyter Notebook, Tableau, Data Cleaning, Exploratory Data Analysis (EDA), and Data Visualisation.\n\n## Key Findings\n\n- Products priced between ₹1,500–₹3,000 consistently receive the highest average ratings — suggesting a sweet spot in the value-quality perception.\n- Moisturisers and serums have the highest recommendation rates across all categories.\n- Customers with dry skin leave significantly more reviews and rate products lower on average than oily or combination skin customers.\n- Three brands account for over 40% of all five-star reviews, despite representing less than 12% of the total product catalogue.\n\n## Business Objective\n\nTo identify the factors associated with customer satisfaction and product performance, and provide data-driven recommendations to improve the customer experience and strengthen brand loyalty at Sephora.",
      "dashboardUrl": "https://public.tableau.com/app/profile/sushmita.sharma4479/viz/Book2_17854911495320/Story1?publish=yes",
      "videoPath": "media/videos/Screen_Recording_2026-10-28_124405.mp4",
      "attachments": [
        "media/images/Screenshot_2026-10-28_142234.png"
      ]
    },
    {
      "slug": "customer-churn-dashboard",
      "title": "Customer Churn Analysis — Telecom Power BI Dashboard",
      "summary": "Built an interactive Power BI dashboard exploring churn patterns across 7,000+ telecom subscribers — pinpointing high-risk segments by contract type, tenure, and payment method.",
      "tags": [
        "Power BI",
        "DAX",
        "Data Modelling",
        "Customer Segmentation",
        "Churn Analysis"
      ],
      "date": "2024-11-01",
      "body": "## The Goal\n\nShow non-technical stakeholders exactly where churn happens — by contract type, tenure band, and payment method — without requiring an analyst to run a fresh query every time a question comes up.\n\n## The Dataset\n\n- 7,043 telecom customer records with 21 attributes\n- Overall attrition rate: 26.5%\n- Key variables: contract type, payment method, monthly charges, tenure, and internet service type\n\n## The Build\n\n- Cleaned the raw dataset and resolved inconsistencies in the TotalCharges column caused by new customers with zero tenure.\n- Created calculated segments based on tenure bands (0–12 months, 1–2 years, 2+ years) and monthly charge tiers.\n- Built a star-schema data model in Power BI with clean dimension and fact tables.\n- Designed KPI cards for total customers, churned customers, churn rate, and average monthly revenue at risk.\n- Added slicers for contract type, internet service, and payment method for instant self-service filtering.\n- Created a page-navigation bar to separate the summary overview from the segment deep-dive page.\n\n## Key Findings\n\n- Month-to-month contract customers churn at 42% — more than three times the rate of two-year contract holders (11%).\n- Fibre optic internet users show significantly higher churn (41%) compared to DSL users (19%).\n- Customers in their first 12 months account for over 55% of all churned records.\n- Electronic check payers churn at nearly twice the rate of credit card or bank transfer payers.\n\n## Business Impact\n\nThe dashboard enables the retention team to identify at-risk segments in under 30 seconds and prioritise outreach to month-to-month fibre customers in their first year — the highest-value intervention group.",
      "videoPath": "media/videos/churn--.mp4"
    },
    {
      "slug": "amazon-sales-project",
      "title": "Amazon E-Commerce Sales Analysis Using SQL",
      "summary": "End-to-end PostgreSQL analysis of 100,000+ order records — uncovering revenue trends, customer loyalty patterns, payment preferences, and top-performing product categories.",
      "tags": [
        "SQL",
        "PostgreSQL",
        "CTEs",
        "Window Functions",
        "Data Analysis",
        "Business Intelligence",
        "Revenue Analysis"
      ],
      "date": "2026-10-18",
      "body": "## Project Overview\n\nAn end-to-end SQL data analysis project focused on e-commerce sales, revenue trends, customer segmentation, payment analysis, and product performance using a dataset of over 100,000 order records from an Amazon-style marketplace.\n\n## Key Areas of Analysis\n\n- Sales and revenue trends by month, quarter, and product category\n- Customer purchase frequency and loyalty segmentation (one-time vs. repeat buyers)\n- Payment method preferences and their correlation with average order value\n- Product category pricing distribution and top-performing SKUs\n- Seasonal sales patterns and peak demand windows\n- Data quality assessment — missing category values and duplicate order handling\n\n## SQL Techniques Used\n\n- **CTEs** for multi-step transformations and readable query chains\n- **Window functions** (RANK, ROW_NUMBER, LAG) for period-over-period comparisons\n- **Aggregate functions** with GROUP BY for category and segment rollups\n- **CASE statements** for customer tier and purchase-frequency bucketing\n- **JOINs** across orders, products, customers, and payments tables\n\n## Key Findings\n\n- Electronics and Clothing together account for 61% of total revenue.\n- 38% of customers place only one order — a significant repeat-purchase opportunity.\n- UPI and credit card cover 72% of all transactions.\n- Revenue peaks in October–November, driven by festive season demand.\n- Repeat customers spend 23% more per order than first-time buyers on average.\n\n## Business Value\n\nThis project demonstrates how structured SQL analysis can transform raw transaction data into clear, actionable business intelligence — from identifying high-value customers to pinpointing best-performing categories and optimal promotional timing.",
      "videoPath": "media/videos/amzz.mp4"
    },
    {
      "slug": "hr-attrition-analysis",
      "title": "HR Employee Attrition Analysis Using Python and Power BI",
      "summary": "Analysed employee attrition patterns across 1,470 records using Python EDA and Power BI dashboards — identifying overtime, income, and tenure as the top three predictors of voluntary exits.",
      "tags": [
        "Python",
        "Pandas",
        "Seaborn",
        "Matplotlib",
        "Power BI",
        "DAX",
        "HR Analytics",
        "EDA"
      ],
      "date": "2026-09-10",
      "body": "## Project Overview\n\nThis HR analytics project investigates why employees leave, using IBM's HR Employee Attrition dataset of 1,470 employees. The goal was to move beyond a headline attrition rate and uncover which roles, departments, satisfaction levels, and career patterns drive voluntary exits.\n\n## Dataset\n\n- 1,470 employee records with 35 attributes\n- Overall attrition rate: 16.1%\n- Key variables: job role, department, years at company, monthly income, job satisfaction, overtime, marital status, and distance from home\n\n## Python EDA\n\n- Profiled the dataset using Pandas — no missing values, but several columns needed type casting and label encoding.\n- Used Seaborn and Matplotlib to visualise distributions, correlation heatmaps, and attrition breakdowns by every categorical variable.\n- Ran a point-biserial correlation analysis to surface the strongest numerical predictors of attrition.\n- Found that OverTime, JobSatisfaction, MonthlyIncome, and YearsAtCompany are the four strongest individual predictors.\n\n## Power BI Dashboard\n\n- Built a two-page report: an **Overview** page with attrition KPIs and department breakdowns, and a **Deep Dive** page with role and satisfaction-level filters.\n- Created DAX measures for attrition rate, average tenure of leavers vs. stayers, and income gap between churned and retained employees.\n- Added conditional formatting to highlight high-risk role-department combinations in table visuals.\n\n## Key Findings\n\n- Employees who work overtime are 3× more likely to leave than those who do not.\n- Sales Representatives have the highest attrition rate at 39.8%.\n- Employees earning below the 25th percentile income threshold leave at nearly double the company-average rate.\n- Employees with fewer than 2 years at the company account for 40% of all exits.\n- Low job-satisfaction employees leave at 22.8% — almost double the rate of highly satisfied staff.\n\n## Business Recommendations\n\n- Introduce overtime monitoring and compensatory policies for high-risk roles.\n- Review the compensation structure for entry-level and Sales Representative bands.\n- Implement a structured onboarding and 90-day check-in programme to retain new joiners during the highest-risk window."
    }
  ],
  "posts": [
    {
      "slug": "why-sla-percentage-hides-the-story",
      "title": "Bumble User Behavior & Engagement Analysis",
      "summary": "I analysed 59,944 Bumble profiles using Python and Pandas, then built an interactive Tableau dashboard to explore age, location, education, jobs and relationship status",
      "tags": [
        "KPI",
        "Reporting",
        "Data Analysis"
      ],
      "date": "2026-10-22",
      "body": "Project Overview\n\nThis project looks at user profile data from Bumble to understand who is on the platform. I cleaned and prepared the data in Python and Pandas, explored it with charts, and then built an interactive dashboard in Tableau so anyone can explore the results.\n\nKey Numbers\nMetric\tValue\nTotal profiles\t59,944\nAverage age\t32.34\nSingle profiles\t92.9%\nSan Francisco profiles\t31,063\nMy Process\nData Exploration: I checked the columns, data types and missing values.\nData Cleaning: I looked for missing values, unreported income values and possible outliers.\nData Preparation: I converted the last_online field to datetime format and created age groups and income groups.\nExploratory Data Analysis: I explored profile patterns using Python and visualisations.\nWhat I Explored\nProfile demographics: age and gender distribution\nGeographic distribution: where profiles are located, including San Francisco\nEducation and occupation: education levels and job categories\nRelationship and lifestyle: relationship status and body-type categories\nWhat the Data Shows\nMost profiles are in San Francisco (31,063), which is more than half of the dataset.\nNearly all profiles (92.9%) are single.\nMost users have a college or university degree (23,959 profiles), and a masters degree is the next most common (8,961).\nMany profiles have no job listed (8,197), and “other” is the next largest group (7,589).\nInteractive Dashboard\n\nThe Tableau dashboard has six views: Age & Gender, Education, Job Distribution, Top Locations, Relationship Status and User Demographics.\n[View the Dashboard →] (add your Tableau Public link here)\n\nTools Used\n\nPython · Pandas · Tableau\n\nLet’s Discuss\n\nWhich profile dimension would you explore first, and why: age, location, education or relationship status? I’d love to hear your view.",
      "attachments": [
        "media/docs/bumble--.pdf"
      ]
    },
    {
      "slug": "replacing-spreadsheet-steps-with-pandas",
      "title": "Replacing Manual Spreadsheet Steps with Pandas",
      "summary": "Every month the same cleaning steps ate hours. Here is how I automated them with Python and cut monthly prep time by about 40%.",
      "tags": [
        "Python",
        "Pandas",
        "Automation",
        "Data Cleaning"
      ],
      "date": "2026-01-12",
      "body": "Every month the same cleaning steps ate hours: filters, lookups, copy and paste across four tabs, and a manual check to make sure nothing had shifted.\n\n## What the Monthly Process Looked Like\n\nThe raw data came from a ticketing system export. Before any analysis could happen, I had to:\n\n- Standardise category and priority field values (free-text source, so the same category had six different spellings).\n- Calculate turnaround time, accounting for business hours only.\n- Flag SLA breaches based on thresholds that varied by priority level.\n- Join the clean data against a team-assignment lookup table.\n- Output a summary table and a breach detail list.\n\nAll of that took around three hours every single month.\n\n## What I Automated\n\n- **Category and priority normalisation** using a regex-based mapping dictionary.\n- **Business-hours turnaround calculation** using Pandas date arithmetic and a custom working-hours function.\n- **SLA breach flagging** using a vectorised comparison against a threshold lookup.\n- **Team assignment join** using pd.merge — replacing the VLOOKUP chain entirely.\n- **Output generation** — summary CSV and breach detail file written automatically with a timestamp.\n\n## What Changed\n\nThe first run took about two days to build and test. By month two, the entire pipeline ran in under four minutes.\n\nTotal monthly time dropped by roughly 40% — not because the script is magic, but because it removed all the repetitive mechanical steps and left only the judgement work: interpreting results, spotting anomalies, writing commentary.\n\n## The Rule I Took Away\n\nIf you do the same sequence of steps more than twice, write down the logic. If you do it monthly, automate it. The upfront cost is real — the compounding return is much bigger."
    },
    {
      "slug": "how-i-choose-the-right-chart",
      "title": "How I Choose the Right Chart for Every Dataset",
      "summary": "Bar, line, scatter, or heatmap? A practical decision framework for picking the chart type that communicates the point clearly — not just the one that looks impressive.",
      "tags": [
        "Data Visualisation",
        "Storytelling",
        "Tableau",
        "Power BI"
      ],
      "date": "2026-08-15",
      "body": "📊 Which chart should you use? Most beginners get this wrong.\n\nWhen I started in data, I picked charts because they looked nice. Over time I learned one simple rule:\n\n👉 The question decides the chart, not the other way round.\n\nSo I made a 2-page cheat sheet that I wish I had on day one. Swipe through the PDF to see:\n\n✅ My 4-step method to choose a chart\n✅ Which chart to use for comparing, trends, share of total, relationships and spread\n✅ A picture guide to the 6 charts I use most\n✅ Common mistakes to avoid (3D charts, too many pie slices, bars that don’t start at zero)\n✅ A quick cheat sheet and a 5-second test before you share any chart\n\nIt is written in simple English, so it works if you are new to data analytics.\n\n💬 Which chart do you use the most? Tell me in the comments.\n\n♻️ Repost if this can help someone who is learning data.\n💾 Save it for later.\n\n#DataAnalytics #DataVisualization #DataAnalyst #PowerBI #BusinessIntelligence #LearningInPublic #CareerInData",
      "attachments": [
        "media/docs/How_I_Choose_the_Right_Chart.pdf"
      ]
    }
  ]
};
