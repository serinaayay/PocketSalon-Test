# PocketSalon - Hair Analysis Mobile App

A React Native mobile app for analyzing hair type and damage using on-device AI models.

## Features

- **Hair Type Detection**: Identifies 4 hair types (Straight, Wavy, Curly, Kinky)
- **Hair Damage Analysis**: Detects 4 damage levels (Healthy, Light, Moderate, Severe)
- **AI Chatbot**: Specialized assistant for hair care questions
- **Hair Health Journal**: Track your hair health over time
- **Educational Content**: Guides, remedies, and tips

## Tech Stack

- **Frontend**: React Native (Expo)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **AI/ML**: ONNX Runtime for on-device inference
- **Models**: MobileNetV3 (optimized for mobile)
- **Database**: SQLite for local storage
- **Navigation**: Expo Router

## Project Structure

```
PocketSalon-Test/
├── app/                          # App screens & navigation
│   ├── (stack)/                  # Stack navigation
│   ├── chatbot.tsx               # AI chatbot screen
│   ├── hair-detection.tsx        # Camera/upload for analysis
│   ├── ResultsScreen.tsx         # Analysis results
│   ├── journal.tsx               # Hair health journal
│   └── ...                       # Other screens
├── assets/
│   ├── models/                   # AI models (ONNX format)
│   │   ├── hair_type/            # Hair type model
│   │   └── hair_damage/          # Hair damage model
│   ├── images/                   # App images & icons
│   └── fonts/                    # Custom fonts
├── backend-files/                # Model source files
│   ├── mobnetv3_hairtype_1.keras # Source: Hair type model
│   ├── mobnetv3_hairdmg_2_POST.keras # Source: Damage model
│   ├── export_all_models_to_onnx.py # Export script
│   └── requirements.txt          # Python dependencies
├── components/                   # Reusable components
├── lib/                          # Utility functions
│   ├── onnx-helpers-native.ts    # ONNX model helpers
│   ├── db.ts                     # Database utilities
│   └── utils.ts                  # General utilities
└── ...
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Python 3.12+ (for model conversion)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PocketSalon-Test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## AI Models

### Hair Type Model
- **Source**: `mobnetv3_hairtype_1.keras`
- **ONNX**: `assets/models/hair_type/hair_type_model.onnx`
- **Input**: 224×224 RGB images
- **Output**: 4 classes (Straight, Wavy, Curly, Kinky)
- **Size**: 3.6 MB

### Hair Damage Model
- **Source**: `mobnetv3_hairdmg_2_POST.keras`
- **ONNX**: `assets/models/hair_damage/hair_damage_model_2.onnx`
- **Input**: 224×224 RGB images
- **Output**: 4 classes (Healthy, Light Damage, Moderate Damage, Severe Damage)
- **Size**: 3.6 MB

### Re-exporting Models

If you need to update the ONNX models from Keras source files:

```bash
cd backend-files
..\venv\Scripts\activate  # Windows
source ../venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python export_all_models_to_onnx.py
```

## Chatbot

The PocketSalon Assistant is a rule-based chatbot that:
- ✅ Answers questions about hair types and damage
- ✅ Provides care tips for specific hair types
- ❌ Rejects off-topic questions (products, styles, medical advice)

See `CHATBOT_DOCUMENTATION.md` for details.

## Development Build

For features requiring native code (like ONNX Runtime):

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

See `DEVELOPMENT_BUILD_GUIDE.md` for detailed instructions.

## Key Files

### App Screens
- `app/hair-detection.tsx` - Camera/upload for hair analysis
- `app/ResultsScreen.tsx` - Display analysis results
- `app/chatbot.tsx` - AI chatbot interface
- `app/journal.tsx` - Hair health tracking

### AI/ML Integration
- `lib/onnx-helpers-native.ts` - ONNX model loading & inference
- `assets/models/` - ONNX model files

### Database
- `lib/db.ts` - SQLite database setup & queries

## Documentation

- **CHATBOT_DOCUMENTATION.md** - Chatbot implementation details
- **MODEL_CHANGES_COMPLETE.md** - Model update summary
- **DEVELOPMENT_BUILD_GUIDE.md** - Native build instructions
- **backend-files/MODEL_UPDATE_SUMMARY.md** - Technical model details

## Common Issues

### Build Errors

**Port already in use:**
```bash
npx expo start --clear
```

**Metro bundler issues:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Model Loading Errors

**Dimension mismatch:**
- Ensure models are ONNX format (not Keras)
- Check `[DEBUG] Tensor shape` log shows `[1, 3, 224, 224]`

**Model not found:**
- Run `npx expo start --clear` to rebundle assets
- Check `assets/models/` directory has `.onnx` files

## Team Collaboration

### Before Pushing
1. Test on emulator/device
2. Clear `node_modules` and `android/build` from git
3. Update this README if adding features

### Branch Strategy
- `main` - Stable releases
- `dev` - Development branch
- Feature branches - Named descriptively

### Testing Checklist
- [ ] Hair detection works (camera & upload)
- [ ] Results screen displays correctly
- [ ] Chatbot responds appropriately
- [ ] Journal saves entries
- [ ] No console errors

## License

[Add your license here]

## Contributors

[Add team member names here]

## Support

For questions or issues, contact the development team.

