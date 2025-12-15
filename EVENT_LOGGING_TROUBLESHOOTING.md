# Event Logging System - Troubleshooting Guide

## ✅ Quick Verification Checklist

Run through these checks to verify the event logging system is working:

### 1. **Server Running**
- [ ] Is `npm run dev` executing without errors?
- [ ] Can you access http://localhost:3000?
- [ ] No red errors in terminal?

### 2. **UI Elements Visible**
- [ ] Click any station card on the dashboard
- [ ] Do you see the **▼ Show Events & Logging** button?
- [ ] Can you click it to expand?

### 3. **Components Display**
After clicking to expand, you should see:
- [ ] **📊 Quick Log Event** section with 4 buttons
- [ ] **▼ Detailed Event Log** button
- [ ] **📋 Event Log** section below (initially empty or with events)

### 4. **Console Logs**
- [ ] Press F12 to open Developer Tools
- [ ] Click **Console** tab
- [ ] Should see message like: `✅ Event logged: manual_observation - Manila`

### 5. **Firebase Data**
- [ ] Go to Firebase Console
- [ ] Select your project
- [ ] Click **Realtime Database**
- [ ] Look for `/events/` path
- [ ] Should contain structure like:
  ```
  /events/
  └── manila_weather_station/
      └── event_001/
          ├── description: "..."
          ├── eventType: "..."
          └── timestamp: ...
  ```

---

## 🐛 Common Issues & Fixes

### Issue 1: Button Doesn't Appear

**Problem:** Can't see "▼ Show Events & Logging" button

**Causes:**
1. Component not imported in WeatherCard
2. Component file doesn't exist
3. React state not working

**Fix:**
```bash
# Verify files exist:
ls src/components/EventLogger.tsx
ls src/components/EventDisplay.tsx

# Check imports in WeatherCard:
grep "EventLogger" src/components/WeatherCard.tsx
grep "EventDisplay" src/components/WeatherCard.tsx

# Should output:
# import EventLogger from './EventLogger';
# import EventDisplay from './EventDisplay';

# Rebuild:
npm run build
```

**If still not working:**
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache: DevTools → Storage → Clear All
- Restart dev server: Stop `npm run dev` and run again

---

### Issue 2: Button Appears But Doesn't Expand

**Problem:** Click button but nothing happens

**Causes:**
1. JavaScript error preventing state update
2. EventLogger component has errors
3. CSS issue hiding expanded content

**Fix:**
```bash
# Check console for errors:
# Press F12 → Console tab
# Look for red error messages

# Example error to look for:
# "TypeError: Cannot read properties of undefined..."

# If you see errors, check:
# 1. All props are being passed correctly
# 2. Firebase config is loaded
# 3. No import errors
```

**Check console:**
```javascript
// In browser console, type:
typeof EventLogger  // Should say: function

// Or check:
document.querySelector('button').innerText
// Should contain: "Show Events" or "Hide Events"
```

---

### Issue 3: Click Button But No Event Logged

**Problem:** Click quick button, no success message, event doesn't appear

**Causes:**
1. Firebase not initialized properly
2. Firebase credentials invalid
3. Firebase database rules don't allow writes
4. Network error

**Fix:**

**Step 1: Check Firebase Initialization**
```bash
# In browser console (F12):
localStorage.getItem('FIREBASE_INITIALIZED')
// If undefined, Firebase didn't initialize

# Or check:
window.firebase  // Should exist and have methods
```

**Step 2: Check Network Request**
```bash
# In DevTools (F12):
# Click Network tab
# Click quick log button
# Look for "firebase" requests
# Should see successful requests (status 200)

# If requests fail (status 400/500):
# Check Firebase credentials in .env.local
```

**Step 3: Check Firebase Rules**
```bash
# Go to Firebase Console
# Realtime Database → Rules
# Should have:
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
# Or rules allowing: /events/ path writes
```

**Step 4: Check Error Message**
```bash
# In browser console, click quick button
# Look for message starting with "❌"
# Example: "❌ Failed to log event: FirebaseError: ..."

# Copy the error and search Firebase docs
```

---

### Issue 4: Error: "Firebase is not defined"

**Problem:** Console error: `Firebase is not defined` or `getFirebaseConfig is not defined`

**Causes:**
1. `.env.local` file missing or incomplete
2. Firebase config file missing
3. Module not exported correctly

**Fix:**
```bash
# Check .env.local exists:
ls .env.local
# Should output: .env.local

# If missing, create it:
touch .env.local

# Add Firebase credentials to .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Check firebaseConfig.ts exists:
ls src/lib/firebaseConfig.ts

# Restart dev server after updating .env.local:
# Stop: Ctrl+C
npm run dev
```

---

### Issue 5: Error: "Cannot read properties of undefined (reading 'toLowerCase')"

**Problem:** Error about `toLowerCase()` on undefined

**Causes:**
1. `stationName` not being passed to EventLogger
2. WeatherCard not passing data correctly
3. React props issue

**Fix:**
```bash
# Check WeatherCard passes stationName:
grep -A 2 "EventLogger" src/components/WeatherCard.tsx
# Should show: <EventLogger stationName={data.stationName}

# If missing, add it:
# Change: <EventLogger />
# To: <EventLogger stationName={data.stationName} />
```

---

### Issue 6: Events Don't Appear in Firebase

**Problem:** Event logs but doesn't show in Firebase Console

**Causes:**
1. Data written to wrong path
2. Firebase database not reloading
3. Permissions issue

**Fix:**
```bash
# In Firebase Console:
# 1. Go to Realtime Database
# 2. Look for both:
#    - /events/ path
#    - /events/[station_name]/ path
# 3. Refresh (F5) to reload data

# If still not visible:
# 1. Check browser console for success message
# 2. If message says "✅ Event logged", data was sent
# 3. May be permission issue - check rules

# Temporary fix - allow all writes:
# In Firebase Console → Realtime Database → Rules:
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

### Issue 7: Events Don't Display on Dashboard

**Problem:** Event logged in Firebase but not showing in EventDisplay

**Causes:**
1. Real-time listener not activated
2. EventDisplay component has errors
3. Data format mismatch

**Fix:**
```bash
# In browser console, check for messages like:
# "📋 Retrieved X events for [station]"

# If not seeing this message:
# 1. Check network requests (F12 → Network)
# 2. Look for Firebase realtime listener
# 3. Check for errors in console

# Force refresh the page:
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

### Issue 8: Build Fails with TypeScript Errors

**Problem:** `npm run build` fails with type errors

**Causes:**
1. Type mismatch in component
2. Missing type definitions
3. Import errors

**Fix:**
```bash
# Run build to see error:
npm run build

# Read error message carefully
# Example: "Argument of type 'X' is not assignable to parameter of type 'Y'"

# Common fixes:
# 1. Check eventLogger.ts exports types properly
# 2. Verify EventLogger component receives correct props
# 3. Check EventDisplay expandedId state type

# If error in EventDisplay:
# The issue was: expandedId could be undefined
# The fix: Use: event.id || null (to ensure null not undefined)
```

---

## 🔧 Manual Testing Steps

### Test 1: Quick Button Click
```
1. Open http://localhost:3000
2. Click any station card
3. Click "▼ Show Events & Logging"
4. Click "📝 Observation" button
5. Wait 2 seconds
6. Should see: "✅ Manual Observation Event logged..."
7. Check Firefox/Chrome Console: "✅ Event logged: manual_observation"
```

### Test 2: Detailed Form
```
1. Click "▼ Detailed Event Log"
2. Select event type (e.g., "⚙️ Calibration")
3. Enter description: "Test calibration"
4. Enter temperature: 25.5
5. Enter humidity: 65
6. Enter notes: "Test event"
7. Click "✅ Log Event"
8. Form should reset after 2 seconds
9. Event should appear in "📋 Event Log" section
```

### Test 3: Real-Time Sync
```
1. Log an event from one browser
2. Open same dashboard in another browser
3. New event should appear automatically in second browser
4. If not, click "Show Events & Logging" button to refresh
```

### Test 4: Firebase Verification
```
1. Log an event from dashboard
2. Go to Firebase Console
3. Click Realtime Database
4. Click "events" folder
5. Click station name folder
6. See event entry with data
7. Timestamp should be recent
```

---

## 📋 Debug Checklist

Print this and check off each item:

```
Firebase Setup:
☐ .env.local file exists
☐ All 6 Firebase config variables filled
☐ Firebase project created
☐ Realtime Database enabled
☐ Database rules allow writes

Component Files:
☐ src/lib/eventLogger.ts exists (210+ lines)
☐ src/components/EventLogger.tsx exists (310+ lines)
☐ src/components/EventDisplay.tsx exists (115+ lines)
☐ src/components/WeatherCard.tsx updated (imports added, state added, JSX added)

Code Quality:
☐ npm run build completes (0 errors)
☐ npm run dev runs without errors
☐ No console errors when loading page (F12 → Console)
☐ All imports resolve correctly

UI Functionality:
☐ "▼ Show Events & Logging" button visible on station card
☐ Button click expands section
☐ 4 quick log buttons visible
☐ "▼ Detailed Event Log" button visible and works

Event Logging:
☐ Click quick button → success message appears
☐ Console shows "✅ Event logged" message
☐ Event appears in "📋 Event Log" section
☐ Firebase shows data in /events/ path
☐ Detailed form works (fill, submit, reset)

Real-Time:
☐ Multiple events stack in log
☐ Events show correct timestamps
☐ Event types have correct emoji/color
☐ Click event to expand → shows all details
☐ Events sync across browser tabs in real-time
```

---

## 🆘 Get Help

If nothing works:

1. **Check the obvious:**
   - Is dev server running? (`npm run dev`)
   - Is page actually loaded? (http://localhost:3000)
   - Is station card clickable? (Click to expand)

2. **Check browser console (F12):**
   - Any red errors? Copy them
   - Search error in browser/Firebase docs
   - Check Network tab for failed requests

3. **Check Firebase Console:**
   - Is database populated with initial data?
   - Can you see `/weatherStations/` path?
   - Can you manually write to `/test_events/` path?

4. **Try these:**
   ```bash
   # Force rebuild:
   rm -rf .next
   npm run build

   # Clear and reinstall:
   rm -rf node_modules package-lock.json
   npm install
   npm run dev

   # Check git status:
   git status
   git diff src/components/WeatherCard.tsx
   ```

5. **Review the event logging guide:**
   - Read EVENT_LOGGING_GUIDE.md for complete usage
   - Check common use cases section
   - Review Firebase storage structure

---

## 📞 Verification Commands

Copy and run these to verify setup:

```bash
# Check files exist
ls src/lib/eventLogger.ts src/components/EventLogger.tsx src/components/EventDisplay.tsx

# Check imports
grep -c "EventLogger" src/components/WeatherCard.tsx
grep -c "EventDisplay" src/components/WeatherCard.tsx

# Verify Firebase config
grep "NEXT_PUBLIC_FIREBASE" .env.local | wc -l
# Should output: 6

# Build and check
npm run build 2>&1 | grep -i error
# Should output nothing (no errors)

# Check server
curl http://localhost:3000 2>&1 | grep -i html
# Should output some HTML
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Button appears on station card
2. ✅ Can expand section without errors
3. ✅ Quick buttons show success message
4. ✅ Events appear in list immediately
5. ✅ Firebase console shows `/events/` data
6. ✅ Browser console shows `✅ Event logged` messages
7. ✅ New events sync across browser tabs instantly
8. ✅ Form data persists correctly
9. ✅ Timestamps are accurate and recent
10. ✅ No errors in any console

**When all 10 are true: Event logging system is fully operational! 🎉**
