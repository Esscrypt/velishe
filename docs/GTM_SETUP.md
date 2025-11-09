# Google Tag Manager & Google Analytics Setup Guide

This guide explains how to set up Google Analytics events in Google Tag Manager for the modeling portfolio website.

## Events Being Tracked

### 1. Page Views (`page_view`)
- **When**: Every page navigation
- **Data**:
  - `page_path`: URL path (e.g., `/privacy`, `/become-a-model`)
  - `page_title`: Page title
  - `page_location`: Full URL

### 2. Model Page Views (`model_page_view`)
- **When**: When a user visits an individual model's page
- **Data**:
  - `model_slug`: Model's URL slug
  - `model_name`: Model's full name
  - `page_path`: Full path (e.g., `/models/jane-doe`)
  - `page_title`: Page title with model name

### 3. Form Start (`form_start`)
- **When**: User begins filling out the "Become a Model" form
- **Data**:
  - `form_name`: "become_a_model"

### 4. Form Submit (`form_submit`)
- **When**: User successfully submits the "Become a Model" form
- **Data**:
  - `form_name`: "become_a_model"
  - `form_data`: Object containing:
    - `gender`: "woman" or "man"
    - `has_images`: boolean (whether images were uploaded)

### 5. Privacy Policy Click (`privacy_policy_click`)
- **When**: User clicks the privacy policy link in the form
- **Data**:
  - `source`: "become_a_model_form"

## Setting Up Google Analytics in GTM

### Step 1: Create a Google Analytics 4 Configuration Tag

1. Go to your GTM container
2. Click **Tags** → **New**
3. Tag Configuration: Choose **Google Analytics: GA4 Configuration**
4. Measurement ID: Enter your GA4 Measurement ID (format: `G-XXXXXXXXXX`)
5. Configuration Tag: Leave blank (or create a separate config tag)
6. Triggering: Choose **All Pages** trigger

### Step 2: Create Event Tags for Custom Events

#### A. Model Page View Event

1. **Tags** → **New**
2. Tag Type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select your GA4 Configuration tag
4. Event Name: `model_page_view`
5. Event Parameters:
   - `model_slug`: `{{model_slug}}` (create a Data Layer Variable)
   - `model_name`: `{{model_name}}` (create a Data Layer Variable)
   - `page_path`: `{{page_path}}` (create a Data Layer Variable)
6. Triggering: Create a new trigger:
   - Trigger Type: **Custom Event**
   - Event name: `model_page_view`

#### B. Form Start Event

1. **Tags** → **New**
2. Tag Type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select your GA4 Configuration tag
4. Event Name: `form_start`
5. Event Parameters:
   - `form_name`: `{{form_name}}` (Data Layer Variable)
6. Triggering: Create trigger:
   - Trigger Type: **Custom Event**
   - Event name: `form_start`

#### C. Form Submit Event

1. **Tags** → **New**
2. Tag Type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select your GA4 Configuration tag
4. Event Name: `form_submit`
5. Event Parameters:
   - `form_name`: `{{form_name}}` (Data Layer Variable)
   - `gender`: `{{form_data.gender}}` (Data Layer Variable - nested)
   - `has_images`: `{{form_data.has_images}}` (Data Layer Variable - nested)
6. Triggering: Create trigger:
   - Trigger Type: **Custom Event**
   - Event name: `form_submit`

#### D. Privacy Policy Click Event

1. **Tags** → **New**
2. Tag Type: **Google Analytics: GA4 Event**
3. Configuration Tag: Select your GA4 Configuration tag
4. Event Name: `privacy_policy_click`
5. Event Parameters:
   - `source`: `{{source}}` (Data Layer Variable)
6. Triggering: Create trigger:
   - Trigger Type: **Custom Event**
   - Event name: `privacy_policy_click`

### Step 3: Create Data Layer Variables

For each custom parameter, create a Data Layer Variable:

1. Go to **Variables** → **New**
2. Variable Type: **Data Layer Variable**
3. Data Layer Variable Name: Use the exact name from the dataLayer push
   - Examples:
     - `model_slug`
     - `model_name`
     - `form_name`
     - `source`
     - `form_data.gender` (for nested values)
     - `form_data.has_images` (for nested values)

### Step 4: Enhanced Ecommerce (Optional)

If you want to track model page views as "view_item" events (for ecommerce tracking):

1. Create a new GA4 Event tag
2. Event Name: `view_item`
3. Event Parameters:
   - `item_id`: `{{model_slug}}`
   - `item_name`: `{{model_name}}`
   - `item_category`: "Model"
4. Trigger: Same as `model_page_view` trigger

## Testing Your Setup

### Using GTM Preview Mode

1. Click **Preview** in GTM
2. Enter your website URL
3. Navigate through your site and trigger events
4. Check the **Tags** panel to see which tags fire
5. Verify the data being sent to GA4

### Using Google Analytics DebugView

1. In GA4, go to **Admin** → **DebugView**
2. Enable debug mode (add `?debug_mode=true` to URL or use GA Debugger extension)
3. Trigger events on your site
4. See real-time events in DebugView

## Viewing Data in Google Analytics

### Real-Time Reports

1. Go to **Reports** → **Realtime**
2. See events as they happen
3. Check **Event count by Event name**

### Custom Reports

1. Go to **Explore** → **Free Form**
2. Add dimensions:
   - Event name
   - Model name (custom dimension)
   - Form name (custom dimension)
3. Add metrics:
   - Event count
   - Total users

### Creating Custom Dimensions (Recommended)

For better reporting, create custom dimensions in GA4:

1. Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
2. Create dimensions:
   - **Model Name**: Event parameter `model_name`
   - **Model Slug**: Event parameter `model_slug`
   - **Form Name**: Event parameter `form_name`
   - **Source**: Event parameter `source`

## Example GTM Container Structure

```
Tags:
├── GA4 Configuration (All Pages)
├── GA4 Event: model_page_view
├── GA4 Event: form_start
├── GA4 Event: form_submit
└── GA4 Event: privacy_policy_click

Triggers:
├── All Pages
├── Custom Event: model_page_view
├── Custom Event: form_start
├── Custom Event: form_submit
└── Custom Event: privacy_policy_click

Variables:
├── Data Layer: model_slug
├── Data Layer: model_name
├── Data Layer: form_name
├── Data Layer: source
├── Data Layer: form_data.gender
└── Data Layer: form_data.has_images
```

## Troubleshooting

### Events Not Firing

1. Check GTM Preview mode to see if events are pushed to dataLayer
2. Verify triggers are set up correctly
3. Check tag firing conditions
4. Check browser console for errors

### Data Not Appearing in GA4

1. Wait 24-48 hours for standard reports (real-time should work immediately)
2. Check DebugView to verify events are being received
3. Verify your GA4 Measurement ID is correct
4. Check that GA4 Configuration tag is firing

### Nested Data Layer Variables

For nested values like `form_data.gender`, use dot notation in the Data Layer Variable name:
- Variable Name: `form_data.gender`
- This will access `dataLayer.form_data.gender`

## Next Steps

1. Set up conversion events in GA4 for important actions (form submissions)
2. Create custom reports for model page views
3. Set up audiences based on behavior
4. Configure goals and conversions
5. Set up data retention and user data collection settings

