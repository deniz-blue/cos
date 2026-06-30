# cos APK builder
# Reproducible Android build environment for Android AAB and APK releases.

FROM eclipse-temurin:21-jdk

# --------------- Node + pnpm ---------------
RUN apt-get update -qq && apt-get install -y -qq ca-certificates curl unzip && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update -qq && apt-get install -y -qq nodejs && \
    npm install -g pnpm@10 && \
    rm -rf /var/lib/apt/lists/*

# --------------- Android SDK ---------------
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# SDK versions — match what expo resolves (see: npx expo run:android output)
ARG BUILD_TOOLS=36.0.0
ARG PLATFORM=android-36
ARG NDK=27.1.12297006
ARG CMDLINE_TOOLS_URL=https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -fsSL "$CMDLINE_TOOLS_URL" -o /tmp/cmdline-tools.zip && \
    unzip -q /tmp/cmdline-tools.zip -d /tmp/ && \
    mv /tmp/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Accept all licenses & install required components
RUN yes | sdkmanager --licenses > /dev/null 2>&1 && \
    sdkmanager \
      "platform-tools" \
      "platforms;$PLATFORM" \
      "build-tools;$BUILD_TOOLS" \
      "ndk;$NDK" \
      "cmake;3.31.5" \
    && rm -rf $ANDROID_HOME/.temp

# --------------- Workspace ---------------
WORKDIR /workspace
ENV CI=true
ENV GRADLE_USER_HOME=/root/.gradle
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
