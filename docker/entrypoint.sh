#!/bin/sh
set -e

cd /workspace

# Install JS deps and sync the checked-in Android project before building.
pnpm install --frozen-lockfile

npx expo prebuild --platform android --clean --no-install

# Generate local.properties for the SDK inside the container
echo "sdk.dir=$ANDROID_HOME" > /workspace/android/local.properties

# Build release AAB and APK artifacts.
cd android
./gradlew bundleRelease assembleRelease \
  -x lint \
  -x test \
  --build-cache \
  --no-daemon

echo ""
echo "=== ✅ Build complete ==="
echo "AAB: /workspace/android/app/build/outputs/bundle/release/app-release.aab"
echo "APKs: /workspace/android/app/build/outputs/apk/release/*.apk"
