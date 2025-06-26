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

1. Onboarding Slides (3 slides) [Slide1, Slide2, Slide3 (with a get started button)]

2. On the 3rd slide, the user can press the Get Started button

   - Once user presses the Get Started button, they are redirected to the get-staretd screen (only with phone number input)

3. OTP verification screen

   - on OTP verification success, user is redirected to the post-auth personal details screen

4. Post-auth Personal Details Screen (only shown if user has not filled in their personal details)

   - User can fill in their personal details (avatar, first and last name, email, gender, date of birth)

5. Post-auth Welcome Screen

   - User can choose to explore the app or register their car

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

When a message is sent to a plate, the claxon is saved in the claxons table.

The recipient receives an Expo push notification.

The recipient can view the claxon in the inbox.

The recipient can view the claxon in the my cars screen.

## 🧠 Behavior Summary

Car registration is optional, but required to receive claxons

Messages are all template-based or custom, ensuring safe and uniform communication

App is designed for speed, privacy, and simplicity.
