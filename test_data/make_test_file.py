import pandas as pd
import numpy as np
import os

os.makedirs("test_data", exist_ok=True)

# Create a realistic messy dataset with empty rows, missing values, trailing spaces, messy headers
data = {
    " Customer Name  ": ["Alice Johnson  ", "Bob Smith", np.nan, "  Charlie Brown ", "Diana Prince  "],
    "Order_Date": ["2026-01-15", np.nan, np.nan, "2026-02-01", "2026-02-14"],
    "  AMOUNT ($) ": [150.50, 200.00, np.nan, np.nan, 320.75],
    " Status ": [" Delivered ", "Pending  ", np.nan, " Delivered", "Shipped "],
    "  EMPTY_COL  ": [np.nan, np.nan, np.nan, np.nan, np.nan]
}

df = pd.DataFrame(data)

# Add completely empty row
empty_row = pd.DataFrame([[np.nan]*5], columns=df.columns)
df = pd.concat([df, empty_row], ignore_index=True)

df.to_excel("test_data/sample_messy.xlsx", index=False)
print("Created test_data/sample_messy.xlsx with shape:", df.shape)
