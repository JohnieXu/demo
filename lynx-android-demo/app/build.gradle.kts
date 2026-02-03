plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "io.github.joniexu.lynxandroiddemo"
    compileSdk {
        version = release(36)
    }

    defaultConfig {
        applicationId = "io.github.joniexu.lynxandroiddemo"
        minSdk = 28
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        debug {
            isDebuggable = true
            applicationIdSuffix = ".debug"
        }
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)

    // lynx dependencies
    implementation("org.lynxsdk.lynx:lynx:3.4.1")
    implementation("org.lynxsdk.lynx:lynx-jssdk:3.4.1")
    implementation("org.lynxsdk.lynx:lynx-trace:3.4.1")
    implementation("org.lynxsdk.lynx:primjs:2.14.1")

    // integrating image-service
    implementation("org.lynxsdk.lynx:lynx-service-image:3.4.1")

    // image-service dependencies, if not added, images cannot be loaded; if the host APP needs to use other image libraries, you can customize the image-service and remove this dependency
    implementation("com.facebook.fresco:fresco:2.3.0")
    implementation("com.facebook.fresco:animated-gif:2.3.0")
    implementation("com.facebook.fresco:animated-webp:2.3.0")
    implementation("com.facebook.fresco:webpsupport:2.3.0")
    implementation("com.facebook.fresco:animated-base:2.3.0")

    // integrating log-service
    implementation("org.lynxsdk.lynx:lynx-service-log:3.4.1")

    // integrating http-service
    implementation("org.lynxsdk.lynx:lynx-service-http:3.4.1")

    implementation("com.squareup.okhttp3:okhttp:4.9.0")

    // integrating XElement
    implementation("org.lynxsdk.lynx:xelement:3.4.1")
    implementation("org.lynxsdk.lynx:xelement:3.4.1")

    implementation("com.squareup.retrofit2:retrofit:2.7.0")


}