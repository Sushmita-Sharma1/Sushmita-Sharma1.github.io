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
      "body": "# Bank Loan Portfolio Analysis | Python & Tableau\n\n### Project Overview\n\nWorked on an end-to-end Bank Loan Portfolio Analysis project using approximately 887,000 loan records to understand loan performance, repayment trends, and credit risk. The analysis focused on identifying good and risky loans, evaluating borrower profiles, and understanding the overall financial health of the loan portfolio.\n\n### What I Did\n\n- Used Python and Pandas to clean and prepare the raw dataset by handling missing values, duplicate records, and reviewing outliers.\n- Calculated important business KPIs, including total loan applications, funded amount, amount received, average interest rate, and debt-to-income (DTI) ratio.\n- Categorized loans into Good Loans and Charged-Off Loans to evaluate overall portfolio performance.\n- Analyzed loan performance across credit grades, borrower income groups, home ownership, verification status, and geographical locations.\n- Examined recovery amounts from charged-off loans to understand loan recovery performance.\n- Created an interactive Tableau dashboard to present key metrics, trends, and insights in an easy-to-understand format.\n\n### Key Findings\n\n- Good Loans (Fully Paid and Current) accounted for 86.2% of total loan applications.\n- Charged-Off Loans represented 13.8% of applications, highlighting areas of potential credit risk.\n- The overall average interest rate was 12.05%, while charged-off loans had a higher average rate of 13.88%.\n- Loans with a 60-month repayment term showed a higher default rate compared to 36-month loans.\n- Grade B and Grade C loans contributed the largest share of the portfolio, representing a significant portion of lending activity.\n\n### Business Objective\n\nThe main objective was to understand the overall health of the loan portfolio, identify borrowers and loan segments with higher credit risk, and provide meaningful insights that could help financial institutions improve lending strategies and make better-informed credit decisions.\n\n### Tools & Technologies\n\nPython | Pandas | NumPy | Tableau | Data Cleaning | Exploratory Data Analysis (EDA) | KPI Analysis | Data Visualization\n\n### Interactive Tableau Dashboard\n\nExplore the complete interactive dashboard:\n\nhttps://public.tableau.com/app/profile/sushmita.sharma4479/viz/bankloanportfolio1/summary?publish=yes",
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
      "body": "# Sephora Customer Satisfaction & Product Review Analysis | Python & Tableau\n\n### Project Overview\n\nWorked on a customer satisfaction analysis project using Sephora product and customer review data to understand what customers think about different beauty products and brands. The analysis focused on product ratings, customer recommendations, review patterns, and buying preferences to identify what drives customer satisfaction and product performance.\n\n### Key Analysis Areas\n\n- Analyzed customer satisfaction scores and product rating patterns across different categories.\n- Compared customer ratings and satisfaction levels across brands and product categories.\n- Studied review volume, review helpfulness, and product recommendation rates.\n- Explored the relationship between product prices and customer ratings.\n- Segmented customers based on skin type, skin tone, hair colour, and eye colour to understand differences in product preferences.\n- Identified top-performing brands and products based on customer reviews and ratings.\n\n### What I Did\n\n- Used Python, Pandas, and NumPy to clean, prepare, and analyze product and customer review datasets.\n- Combined product information with customer review data for a more detailed analysis.\n- Performed Exploratory Data Analysis (EDA) to identify customer behaviour and product performance patterns.\n- Analyzed rating distributions, recommendation rates, and review helpfulness across different product categories.\n- Created visualizations using Python and Tableau to present the findings and make the analysis easier to understand.\n\n### Key Findings\n\n- Products in the ₹1,500–₹3,000 price range received the highest average ratings, indicating a positive customer response within this price segment.\n- Moisturisers and serums recorded the highest recommendation rates across product categories.\n- Customers with dry skin contributed more reviews and gave lower average ratings compared to customers with oily or combination skin.\n- Three brands contributed over 40% of all five-star reviews despite representing less than 12% of the total product catalogue.\n\n### Business Objective\n\nThe main objective was to understand customer preferences, identify the factors associated with product satisfaction, and evaluate brand and category performance. The insights can help businesses improve product offerings, understand customer expectations, and develop better strategies to improve customer experience and brand loyalty.\n\n### Tools & Technologies\n\nPython | Pandas | NumPy | Jupyter Notebook | Tableau | Data Cleaning | Exploratory Data Analysis (EDA) | Data Visualization | Customer Segmentation",
      "dashboardUrl": "https://public.tableau.com/app/profile/sushmita.sharma4479/viz/Book2_17854911495320/Story1?publish=yes",
      "videoPath": "media/videos/Screen_Recording_2026-10-28_124405.mp4",
      "attachments": [
        "media/images/Screenshot_2026-10-28_142234.png"
      ]
    },
    {
      "slug": "customer-churn-dashboard",
      "title": "Customer Churn Analysis, Telecom Power BI Dashboard",
      "summary": "Built an interactive Power BI dashboard exploring churn patterns across 7,000+ telecom subscribers  pinpointing high-risk segments by contract type, tenure, and payment method.",
      "tags": [
        "Power BI",
        "DAX",
        "Data Modelling",
        "Customer Segmentation",
        "Churn Analysis"
      ],
      "date": "2024-11-01",
      "body": "# Telecom Customer Churn Analysis | Power BI\n\n### Project Overview\n\nDeveloped an interactive Power BI dashboard to analyze customer churn and understand why customers are leaving a telecom service provider. The analysis focused on identifying high-churn customer segments based on contract type, tenure, payment methods, and internet services. The goal was to help the business identify customers at risk and make better customer retention decisions.\n\n### Dataset\n\n- Worked with 7,043 telecom customer records and 21 attributes.\n- Analyzed an overall customer churn rate of 26.5%.\n- Focused on contract type, payment method, monthly charges, customer tenure, and internet service type.\n\n### What I Did\n\n- Cleaned and prepared the raw dataset, including handling blank and inconsistent values in the TotalCharges column for new customers.\n- Created customer segments based on tenure (0–12 months, 1–2 years, and 2+ years) and monthly charge ranges.\n- Designed a star-schema data model using fact and dimension tables in Power BI.\n- Created DAX measures for total customers, churned customers, churn rate, and monthly revenue at risk.\n- Built interactive KPI cards and charts to track customer churn patterns.\n- Added slicers for contract type, internet service, and payment method to make the dashboard easy to explore.\n- Designed separate Overview and Customer Segmentation pages with page navigation for a better user experience.\n\n### Key Findings\n\n- Customers with month-to-month contracts had a churn rate of 42%, compared to just 11% for customers with two-year contracts.\n- Fibre optic customers showed a higher churn rate (41%) than DSL customers (19%).\n- Customers within their first 12 months accounted for more than 55% of total churned customers.\n- Customers using electronic check payments had nearly twice the churn rate of those using credit cards or bank transfers.\n\n### Business Recommendations\n\n- Focus on improving retention among month-to-month contract customers by offering attractive long-term plans.\n- Review service quality and customer experience for fibre optic users.\n- Introduce special retention offers and regular follow-ups for customers during their first year.\n- Encourage customers to explore automatic payment options to improve payment convenience.\n- Prioritize retention campaigns for customers who belong to multiple high-risk segments.\n\n### Business Impact\n\nThe dashboard helps the retention team quickly identify high-churn customer groups without depending on repeated manual analysis. It makes it easier to prioritize customers who may need attention, especially month-to-month fibre optic users with shorter tenures, and take proactive steps to reduce customer churn.\n\n### Tools & Technologies\n\nPower BI | Power Query | DAX | Data Cleaning | Data Modelling | Star Schema | KPI Analysis | Data Visualization",
      "videoPath": "media/videos/churn--.mp4"
    },
    {
      "slug": "amazon-sales-project",
      "title": "Amazon E-Commerce Sales Analysis Using SQL",
      "summary": "Analyzed over 100,000 order records using PostgreSQL to understand sales performance, customer buying behavior, and business trends. Explored revenue patterns, repeat customer behavior, payment prefer",
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
      "body": "## Project Overview\n\nAnalyzed over 100,000 order records using PostgreSQL to understand sales performance, customer buying behavior, and business trends. Explored revenue patterns, repeat customer behavior, payment preferences, and top-selling product categories to identify key business insights and opportunities for growth.\n\n## Key Areas of Analysis\n\n- Sales and revenue trends by month, quarter, and product category\n- Customer purchase frequency and loyalty segmentation (one time vs. repeat buyers)\n- Payment method preferences and their correlation with average order value\n- Product category pricing distribution and top performing SKUs\n- Seasonal sales patterns and peak demand windows\n- Data quality assessment like missing category values and duplicate order handling\n\n## SQL Techniques Used\n\n- **CTEs** for multi-step transformations and readable query chains\n- **Window functions** (RANK, ROW_NUMBER, LAG) for period-over-period comparisons\n- **Aggregate functions** with GROUP BY for category and segment rollups\n- **CASE statements** for customer tier and purchase-frequency bucketing\n- **JOINs** across orders, products, customers, and payments tables\n\n## Key Findings\n\n- Electronics and Clothing together account for 61% of total revenue.\n- 38% of customers place only one order a significant repeat-purchase opportunity.\n- UPI and credit card cover 72% of all transactions.\n- Revenue peaks in October and November, driven by festive season demand.\n- Repeat customers spend 23% more per order than first-time buyers on average.\n\n## Business Value\n\nThis project demonstrates how structured SQL analysis can transform raw transaction data into clear, actionable business intelligence from identifying high-value customers to pinpointing best performing categories and optimal promotional timing.",
      "videoPath": "media/videos/amzz.mp4"
    },
    {
      "slug": "hr-attrition-analysis",
      "title": "HR Employee Attrition Analysis Using Python and Power BI",
      "summary": "Analysed employee attrition patterns across 1,470 records using Python EDA and Power BI dashboards, identifying overtime, income, and tenure as the top three predictors of voluntary exits.",
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
      "body": "### Project Overview\n\nAnalyzed HR Employee Attrition dataset to understand why employees leave an organization and identify the key factors influencing employee retention. Explored employee satisfaction, salary, overtime, job roles, departments, and tenure to uncover attrition patterns and provide actionable recommendations for improving employee retention.\n\n### Dataset\n\n- Worked with 1,470 employee records and 35 attributes.\n- Analyzed an overall employee attrition rate of 16.1%.\n- Focused on job roles, departments, monthly income, job satisfaction, overtime, and years at the company.\n\n### Python – Exploratory Data Analysis (EDA)\n\n- Used Pandas to clean, explore, and prepare employee data for analysis.\n- Checked missing values, handled data types, and prepared categorical variables for analysis.\n- Used Matplotlib and Seaborn to create visualizations and explore employee attrition patterns.\n- Performed correlation analysis to identify factors associated with employee attrition.\n- Identified overtime, job satisfaction, monthly income, and years at the company as important factors linked to employee exits.\n\n### Power BI Dashboard\n\n- Developed an interactive, two-page HR analytics dashboard to track employee attrition and retention trends.\n- Created an overview page covering key HR metrics, attrition rates, and department-level analysis.\n- Built a detailed analysis page with job role, department, and employee satisfaction filters.\n- Created DAX measures to compare attrition rates, employee tenure, and average income between employees who left and those who stayed.\n- Used conditional formatting to highlight departments and job roles with higher attrition.\n\n### Key Findings\n\n- Employees working overtime showed approximately 3 times higher attrition compared to those who did not.\n- Sales Representatives recorded the highest attrition rate at 39.8%.\n- Employees in the lower income group had nearly twice the average company attrition rate.\n- Employees with less than 2 years of experience at the company accounted for 40% of total exits.\n- Employees with low job satisfaction had a 22.8% attrition rate, compared to employees with high satisfaction.\n\n### Business Recommendations\n\n- Monitor overtime patterns and introduce better workload management policies.\n- Review salary structures for entry-level employees and Sales Representatives.\n- Strengthen onboarding programmes and introduce regular 30-, 60-, and 90-day employee check-ins.\n- Focus on employee satisfaction and retention strategies in high-attrition departments.\n\n### Tools & Technologies\n\nPython | Pandas | NumPy | Matplotlib | Seaborn | Power BI | DAX | Exploratory Data Analysis (EDA)"
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
      "body": "Every month the same cleaning steps ate hours: filters, lookups, copy and paste across four tabs, and a manual check to make sure nothing had shifted.\n\n## What the Monthly Process Looked Like\n\nThe raw data came from a ticketing system export. Before any analysis could happen, I had to:\n\n- Standardise category and priority field values (free-text source, so the same category had six different spellings).\n- Calculate turnaround time, accounting for business hours only.\n- Flag SLA breaches based on thresholds that varied by priority level.\n- Join the clean data against a team-assignment lookup table.\n- Output a summary table and a breach detail list.\n\nAll of that took around three hours every single month.\n\n## What I Automated\n\n- **Category and priority normalization** using a regex-based mapping dictionary.\n- **Business-hours turnaround calculation** using Pandas date arithmetic and a custom working-hours function.\n- **SLA breach flagging** using a vectorized comparison against a threshold lookup.\n- **Team assignment join** using pd.merge replacing the VLOOKUP chain entirely.\n- **Output generation** summary CSV and breach detail file written automatically with a timestamp.\n\n## What Changed\n\nThe first run took about two days to build and test. By month two, the entire pipeline ran in under four minutes.\n\nTotal monthly time dropped by roughly 40% not because the script is magic, but because it removed all the repetitive mechanical steps and left only the judgement work: interpreting results, spotting anomalies, writing commentary.\n\n## The Rule I Took Away\n\nIf you do the same sequence of steps more than twice, write down the logic. If you do it monthly, automate it. The upfront cost is real the compounding return is much bigger."
    },
    {
      "slug": "how-i-choose-the-right-chart",
      "title": "How I Choose the Right Chart for Every Dataset",
      "summary": "Bar, line, scatter, or heatmap? A practical decision framework for picking the chart type that communicates the point clearly not just the one that looks impressive.",
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
