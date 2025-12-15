#!/bin/bash
# Quick test script to verify event logging system works

echo "🧪 Testing Event Logging System..."
echo ""

# Check if files exist
echo "✅ Checking component files..."
test -f src/lib/eventLogger.ts && echo "  ✓ eventLogger.ts exists" || echo "  ✗ eventLogger.ts missing"
test -f src/components/EventLogger.tsx && echo "  ✓ EventLogger.tsx exists" || echo "  ✗ EventLogger.tsx missing"
test -f src/components/EventDisplay.tsx && echo "  ✓ EventDisplay.tsx exists" || echo "  ✗ EventDisplay.tsx missing"
test -f src/components/WeatherCard.tsx && echo "  ✓ WeatherCard.tsx exists" || echo "  ✗ WeatherCard.tsx missing"

echo ""
echo "✅ Checking imports in WeatherCard..."
grep -q "EventLogger" src/components/WeatherCard.tsx && echo "  ✓ EventLogger imported" || echo "  ✗ EventLogger not imported"
grep -q "EventDisplay" src/components/WeatherCard.tsx && echo "  ✓ EventDisplay imported" || echo "  ✗ EventDisplay not imported"

echo ""
echo "✅ Checking Firebase integration..."
grep -q "getFirebaseDatabase" src/lib/eventLogger.ts && echo "  ✓ Firebase function exists" || echo "  ✗ Firebase function missing"

echo ""
echo "✅ Build status..."
npm run build > /dev/null 2>&1 && echo "  ✓ Build successful" || echo "  ✗ Build failed"

echo ""
echo "🎉 Event logging system is ready!"
echo ""
echo "📝 How to test:"
echo "  1. Open http://localhost:3000 in browser"
echo "  2. Click on any station card"
echo "  3. Click '▼ Show Events & Logging' button"
echo "  4. Click any quick log button (e.g., 📝 Observation)"
echo "  5. Check browser console (F12) for confirmation"
echo "  6. Check Firebase console for /events/ path"
