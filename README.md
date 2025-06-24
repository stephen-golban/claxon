# 📱 App Name: Claxon

## 🔷 One-Line Description

Message car owners instantly via license plates — no contact info needed.

## 🧭 Full App Description

Claxon is a mobile app built for Moldova (with the potential to expand to other countries in the future) that lets anyone send predefined, friendly, or urgent messages to car owners using just their license plate.

Users sign in using phone authentication via Clerk. After signing in, they can:

Search a plate and send predefined messages like “Please move your car,” or “Nice car!”

Register their own car to receive notifications if someone messages their plate.

Receive push notifications powered by Expo when their car is messaged.

Manage personal and vehicle details, or adjust preferences anytime.

## 🔐 Unauthenticated User Flow

1. Onboarding Slides (3 slides)

   - Slide 1: What the app does
   - Slide 2: Use cases (e.g., blocked driveway, compliments)
   - Slide 3: No contact info, just license plates

2. Welcome Screen

   - Choose to sign in or create an account screen
   - If user chooses to sign in, they are redirected to the sign in screen (only with phone number input)
   - If user chooses to create an account, they are redirected to the sign up screen (with the following fields: phone, avatar, first and last name, email, gender, date of birth)

3. OTP verification screen

   - wrapped with a context provider so that this screen has access to clerk's auth state
   - on OTP verification success, user is redirected to the post-auth welcome screen

4. Post-auth Welcome Screen
   - Option 1: 🔍 Explore the app (no car needed)
   - Option 2: 🚘 Register your car (optional but recommended)

## ✅ Authenticated App Flow

After login, user lands in a tab-based navigation interface.

1. Search

   - User searches a license plate
   - If found → choose a predefined message (multi-language)
   - Sends notification to car owner if their plate is registered

2. Inbox

   - Shows alerts/messages received by the user (if their car is registered)
   - If no car registered → show CTA to register car to start receiving alerts

3. My Cars

   - If no cars registered → show CTA to register car to start receiving alerts
   - If cars registered → show list of cars with the following details:
     - Plate
     - Brand
     - Model
     - Color
     - VIN
     - Year
     - Actions: edit/delete vehicle

4. Account
   - Personal details: avatar, first and last name, email, gender, date of birth with the ability to edit
   - Adjust preferences like language, theme, push settings
   - Sign out

## 🔔 Push Notification Overview

On login, the user’s device push token is saved in the profiles table

When a message is sent to a plate, the alert is saved in the alerts table

The recipient receives an Expo push notification

🧠 Behavior Summary
Car registration is optional, but required to receive alerts

Messages are all template-based, ensuring safe and uniform communication

App is designed for speed, privacy, and simplicity
