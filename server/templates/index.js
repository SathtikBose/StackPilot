const templates = {
  room: {
    name: 'Room',
    steps: [
      {
        title: 'Add Dependency (Gradle)',
        content: 'Add Room dependencies to your build.gradle file.',
        code: `dependencies {
    def room_version = "{{version}}"
    implementation "androidx.room:room-runtime:$room_version"
    kapt "androidx.room:room-compiler:$room_version"
    // optional - Kotlin Extensions and Coroutines support for Room
    implementation "androidx.room:room-ktx:$room_version"
}`
      },
      {
        title: 'Enable Plugins',
        content: 'Ensure you have the kotlin-kapt plugin enabled.',
        code: `plugins {
    id 'kotlin-kapt'
}`
      },
      {
        title: 'Create Files',
        content: 'Create your Entity, DAO, and Database classes.',
        filename: 'User.kt, UserDao.kt, AppDatabase.kt',
        code: `@Entity
data class User(@PrimaryKey val uid: Int, val name: String)`
      }
    ]
  },
  retrofit: {
    name: 'Retrofit',
    steps: [
      {
        title: 'Add Dependency (Gradle)',
        content: 'Add Retrofit and Gson converter dependencies.',
        code: `implementation "com.squareup.retrofit2:retrofit:{{version}}"
implementation "com.squareup.retrofit2:converter-gson:{{version}}"`
      },
      {
        title: 'Configuration Changes',
        content: 'Add Internet permission to your AndroidManifest.xml',
        filename: 'AndroidManifest.xml',
        code: `<uses-permission android:name="android.permission.INTERNET" />`
      },
      {
        title: 'Example Usage',
        content: 'Define your API interface and build the Retrofit instance.',
        code: `interface MyService { ... }
val retrofit = Retrofit.Builder().baseUrl("...").build()`
      }
    ]
  },
  hilt: {
    name: 'Hilt',
    steps: [
      {
        title: 'Add Dependency (Gradle)',
        content: 'Add Hilt dependencies and classpath.',
        code: `dependencies {
    implementation "com.google.dagger:hilt-android:{{version}}"
    kapt "com.google.dagger:hilt-compiler:{{version}}"
}`
      },
      {
        title: 'Enable Plugins',
        content: 'Add the Hilt plugin to your project.',
        code: `plugins {
    id 'com.google.dagger.hilt.android' version '{{version}}' apply false
}`
      },
      {
        title: 'Create Files',
        content: 'Create your Application class and annotate it.',
        filename: 'MyApplication.kt',
        code: `@HiltAndroidApp
class MyApplication : Application()`
      }
    ]
  },
  navigation: {
    name: 'Navigation',
    steps: [
      {
        title: 'Add Dependency (Gradle)',
        content: 'Add Navigation component dependencies.',
        code: `implementation "androidx.navigation:navigation-compose:{{version}}"`
      },
      {
        title: 'Configuration Changes',
        content: 'Setup your NavHost in your main activity or screen.',
        code: `val navController = rememberNavController()
NavHost(navController = navController, startDestination = "profile") { ... }`
      }
    ]
  },
  coil: {
    name: 'Coil',
    steps: [
      {
        title: 'Add Dependency (Gradle)',
        content: 'Add Coil dependency for image loading.',
        code: `implementation "io.coil-kt:coil-compose:{{version}}"`
      },
      {
        title: 'Example Usage',
        content: 'Use AsyncImage to load an image from a URL.',
        code: `AsyncImage(model = "https://example.com/image.jpg", contentDescription = null)`
      }
    ]
  }
};

module.exports = templates;
