# Lotus Handmade – Order System Setup Guide

This sets up the full order workflow in about 10 minutes. You only do it once.

## What you get

| Step | What happens | Who does it |
|---|---|---|
| 1 | Customer picks **English / සිංහල / தமிழ்** and fills the order form (product, quantity, colour, name, email, phone, delivery address) | Customer |
| 2 | Customer gets a **"We received your order"** email in their language. You get a **New order** alert | Automatic |
| 3 | You fill **Unit Price** + **Delivery Charge** in the *Orders* sheet and set **Status = Approved** | You |
| 4 | Customer gets an **"Order accepted"** email with the **PDF invoice** attached, bank details, order details and an **Upload payment slip** button | Automatic |
| 5 | Customer uploads the bank slip (no Google login needed). Status changes to **Slip Received**, the slip is saved in Drive, you get an alert, and the customer gets a "slip received" email | Customer + automatic |
| 6 | You check the bank and set **Status = Payment Confirmed**. Customer is notified | You |
| 7 | You ship and set **Status = Completed**. Customer gets the **"Order complete"** email | You |
| – | **Status = Cancelled** sends a polite cancellation email | You |

Every email has the Lotus Handmade logo, your website link and your WhatsApp number.

---

## Step 1 – Create the script

1. Sign in to Google with the account that should send the emails (e.g. your Lotus Handmade Gmail).
2. Go to **https://script.google.com** → **New project**.
3. Rename the project to **Lotus Handmade Orders** (click "Untitled project" at the top).
4. Delete the sample code in `Code.gs`. Open `LotusHandmade_Orders.gs`, copy **all** of it and paste it in.
5. Click **💾 Save**.

## Step 2 – Run setup (once)

1. In the function dropdown at the top, choose **`setup`** → click **▶ Run**.
2. Google asks for permission: **Review permissions** → choose your account → **Advanced** → **Go to Lotus Handmade Orders (unsafe)** → **Allow**.
   *(It says "unsafe" only because you wrote the script yourself. It needs Forms, Sheets, Drive and email access.)*
3. Open **Execution log**. You will see:
   - the **Orders sheet** link
   - the **Order form** link
   - **Website settings** (a line starting with `{"url":...`)

It also creates a Drive folder **"Lotus Handmade – Orders"** containing the sheet, the form, and the *Invoices* and *Payment Slips* folders.

## Step 3 – Deploy the bank-slip upload page

1. Click **Deploy** → **New deployment**.
2. Click ⚙️ next to "Select type" → **Web app**.
3. Description: `Slip upload` · **Execute as: Me** · **Who has access: Anyone**.
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. Open the Orders sheet → **Settings** tab → paste the URL into **Upload Page URL**.

## Step 4 – Enter your bank details

In the **Settings** tab, fill in:

- **Bank Name**, **Account Name**, **Account Number**, **Branch**
- **Notification Email**: where new-order and slip alerts go (already set to your account)
- **Payment Due (days)**: default 3
- **Invoice Note**: printed on every invoice

## Step 5 – Connect the website

Send your web developer (Claude) the **Website Prefill Settings** value from the Settings tab. It looks like:

```
{"url":"https://docs.google.com/forms/d/e/.../viewform","fields":{"productName":"entry.123","productId":"entry.456","quantity":"entry.789","colour":"entry.012"}}
```

After that, the **Request Order** button on every product opens the form with the product, ID, quantity and colour already filled in.

## Step 6 – Test it

1. Submit a test order through the form using **your own email**.
2. Check the confirmation email and the new row in **Orders**.
3. Enter Unit Price `1000` and Delivery `350`, then set Status → **Approved**. Check the invoice email.
4. Click **Upload payment slip** in the email and upload any image.
5. Set **Payment Confirmed**, then **Completed**.
6. Delete the test row when you are done.

---

## Daily use

- Open the **Orders** sheet. New requests show **Status = New** (pink).
- Fill the **gold columns**: Unit Price, Delivery Charge (use `0` for free delivery). The Total calculates itself.
- Change **Status** from the dropdown. Each change sends the right email automatically. A small message at the bottom right confirms it was sent.
- **Last Email** shows what was sent and when.
- Menu **🌸 Lotus Handmade → Resend last email** re-sends the email for the selected row (for example, if a customer says they didn't get it).
- **Internal Notes** is for your own notes. Customers never see it.

## Good to know

- Gmail allows about **100 emails per day** on a free account (1,500 on Google Workspace). That's plenty for a small shop.
- Approving without a price is blocked: the status goes back and you're asked to fill the price first.
- Payment slips are private in your Drive. Only you can open them.
- The upload link in each email is unique to that order, so customers can't see each other's orders.
- If you ever change the code, use **Deploy → Manage deployments → Edit → New version** so the upload page updates.
- Please ask a native speaker to read the **Sinhala and Tamil** wording once. You can edit the text in the `T` and `FORM_TEXT` sections of the script, or directly in the Google Form.
