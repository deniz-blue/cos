#!/bin/sh
set -e

# Generate local.properties for the SDK inside the container
echo "sdk.dir=$ANDROID_HOME" > /workspace/android/local.properties

# Install JS deps
cd /workspace
pnpm install --frozen-lockfile

# Build release APK (arm64 only, skip lint & tests for speed)
cd android
./gradlew assembleRelease \
  -PreactNativeArchitectures=arm64-v8a \
  -x lint \
  -x test \
  --build-cache \
  --no-daemon

echo ""
echo "=== ✅ Build complete ==="
echo "APK: /workspace/android/app/build/outputs/apk/release/app-arm64-v8a-release.apk"
