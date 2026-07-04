#!/bin/sh
set -e

cd /workspace

# Install JS deps and sync the checked-in Android project before building.
pnpm install --frozen-lockfile

npx expo prebuild --platform android --clean --no-install

# Patch the generated build.gradle with release signing config (Expo CNG regenerates this).
node docker/patch-gradle-signing.cjs

# Pin Gradle to 8.x (IBM_SEMERU removed from 9.x, breaks plugins)
sed -i 's|gradle-9\.[0-9]*\.[0-9]*-bin\.zip|gradle-8.14.4-bin.zip|' /workspace/android/gradle/wrapper/gradle-wrapper.properties

# Generate local.properties for the SDK inside the container
echo "sdk.dir=$ANDROID_HOME" > /workspace/android/local.properties

# Inject release signing config if a keystore is present (CI builds).
if [ -f /workspace/cos-release.keystore ] && [ -n "${KEYSTORE_PASSWORD:-}" ] && [ -n "${KEY_ALIAS:-}" ]; then
    cp /workspace/cos-release.keystore /workspace/android/app/cos-release.keystore
    cat > /workspace/android/keystore.properties <<EOF
storeFile=app/cos-release.keystore
storePassword=${KEYSTORE_PASSWORD}
keyAlias=${KEY_ALIAS}
keyPassword=${KEYSTORE_PASSWORD}
EOF
    echo "🔐  Release signing configured"
else
    echo "⚠️  No keystore found — release builds will use debug signing"
fi

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
