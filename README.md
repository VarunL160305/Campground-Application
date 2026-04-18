🏕️ YelpCamp – Full Stack Campground Web Application

YelpCamp is a full-stack web application that allows users to explore, create, review, and manage campgrounds with authentication, image uploads, and interactive maps.

🚀 Live Demo

👉 https://yelpcamp-beryl.vercel.app

📌 Project Overview

This project simulates a real-world campground listing platform where users can:
  Create and manage campgrounds
  Upload images
  Add reviews
  View locations on an interactive map
  Authenticate securely

🧠 How the Application Works

🏗️ Architecture
  MVC Pattern (Model - View - Controller)
  RESTful Routing
  Server-side rendering using EJS

🔁 Application Flow

  1. User Authentication
    Users register/login using Passport.js
    Sessions are stored using MongoDB (MongoStore)
    Only logged-in users can create/edit/delete
  
  2. Campground Creation
    User submits campground form
    Location is converted to coordinates using MapTiler Geocoding API
    Images are uploaded to Cloudinary
    Data is stored in MongoDB
  
  3. Map Rendering
    Campgrounds are converted into GeoJSON
    MapTiler displays markers on the map
    Clustering is used for better performance
  
  4. Reviews System
    Users can add/delete reviews
    Reviews are linked to users and campgrounds
    Stored using MongoDB relationships
  
  5. Security
    Helmet for HTTP headers
    Content Security Policy (CSP)
    MongoDB sanitization
    Secure sessions

🛠️ Tech Stack

Frontend
  EJS
  Bootstrap 5
  JavaScript

Backend
  Node.js
  Express.js

Database
  MongoDB (Mongoose)
  Authentication
  Passport.js

External Services
  MapTiler (Maps + Geocoding)
  Cloudinary (Image Storage)
