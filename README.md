# EcoTrack - Carbon Footprint Tracking App

A full-stack mobile application for tracking and predicting carbon emissions using machine learning.

## 🚀 Features

- **Real-time Carbon Predictions**: ML-powered emission calculations using TensorFlow
- **Material Tracking**: Log different material categories (Plastic, Metal, Glass, Textile, Steel, Chemical)
- **Daily Emission Tracking**: Monitor your carbon footprint over time
- **Cross-platform**: Works on iOS and Android via React Native
- **Firebase Integration**: User authentication and cloud storage

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo**
- **TypeScript** for type safety
- **Firebase** (Authentication & Firestore)
- **Expo Router** for navigation
- **AsyncStorage** for local persistence
- **React Native Animated** for smooth animations

### Backend
- **Flask** REST API
- **TensorFlow/Keras** for ML predictions
- **NumPy** for numerical operations
- **Flask-CORS** for cross-origin requests

## 📱 Installation

### Prerequisites
- Node.js (v16+)
- Python 3.10+
- Expo CLI: `npm install -g expo-cli`
- Git

### Frontend Setup
```bash
cd EcoTrack
npm install
npx expo start
