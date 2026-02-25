# Using the CampusGo REST API from Android Studio

Use these endpoints from your Android app with **Retrofit** and store the token for authenticated requests.

---

## 1. Base URL

- **Local (emulator):** `http://10.0.2.2:8000/api`  
  (Android emulator uses `10.0.2.2` to reach your PC’s `localhost`.)
- **Local (physical device):** `http://YOUR_PC_IP:8000/api` (e.g. `http://192.168.1.5:8000/api`)
- **Production:** `https://your-domain.com/api`

---

## 2. Add dependencies (Kotlin)

In your app `build.gradle.kts` (or `build.gradle`):

```kotlin
dependencies {
    // Retrofit + JSON
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
}
```

---

## 3. Data classes (request/response)

```kotlin
// Login request
data class LoginRequest(
    val username: String,
    val password: String
)

// Register request
data class RegisterRequest(
    val name: String,
    val email: String,
    val username: String,
    val password: String,
    @SerializedName("password_confirmation") val passwordConfirmation: String,
    val course: String,
    @SerializedName("grade_level") val gradeLevel: String
)

// User (nested in auth responses)
data class User(
    val id: Int,
    val name: String,
    val username: String,
    val email: String
)

// Auth response (login + register)
data class AuthResponse(
    val token: String,
    @SerializedName("token_type") val tokenType: String,
    val user: User
)

// User response (GET /api/user)
// Same as User above

// Logout response
data class LogoutResponse(
    val message: String
)

// Validation error (422)
data class ErrorResponse(
    val message: String?,
    val errors: Map<String, List<String>>?
)
```

---

## 4. API interface (Retrofit)

```kotlin
import retrofit2.Response
import retrofit2.http.*

interface CampusGoApi {

    @POST("login")
    suspend fun login(@Body body: LoginRequest): Response<AuthResponse>

    @POST("register")
    suspend fun register(@Body body: RegisterRequest): Response<AuthResponse>

    @GET("user")
    suspend fun getUser(): Response<User>

    @POST("logout")
    suspend fun logout(): Response<LogoutResponse>
}
```

---

## 5. Retrofit client with Bearer token

Store the token (e.g. in `SharedPreferences` or DataStore) and add it to every request after login/register.

```kotlin
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    private const val BASE_URL = "http://10.0.2.2:8000/api/"  // emulator → PC

    private var authToken: String? = null

    fun setToken(token: String?) {
        authToken = token
    }

    private val authInterceptor = Interceptor { chain ->
        val request = chain.request().newBuilder()
        authToken?.let { request.addHeader("Authorization", "Bearer $it") }
        chain.proceed(request.build())
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    val api: CampusGoApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(CampusGoApi::class.java)
    }
}
```

---

## 6. Store token in SharedPreferences

So the user stays logged in after closing the app:

```kotlin
// In Application or a singleton
object TokenManager {
    private const val PREFS = "auth_prefs"
    private const val KEY_TOKEN = "token"

    fun saveToken(context: Context, token: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_TOKEN, token)
            .apply()
        ApiClient.setToken(token)
    }

    fun getToken(context: Context): String? {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY_TOKEN, null)
            ?.also { ApiClient.setToken(it) }
    }

    fun clearToken(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().apply()
        ApiClient.setToken(null)
    }
}
```

---

## 7. Usage in ViewModel or Activity

```kotlin
// Login
lifecycleScope.launch {
    val response = ApiClient.api.login(LoginRequest("myusername", "mypassword"))
    if (response.isSuccessful) {
        val body = response.body()!!
        TokenManager.saveToken(context, body.token)
        // Navigate to home, show body.user
    } else {
        // response.code() 401/422, parse error from response.errorBody()
    }
}

// Register
lifecycleScope.launch {
    val body = RegisterRequest(
        name = "Full Name",
        email = "email@example.com",
        username = "username",
        password = "password123",
        passwordConfirmation = "password123",
        course = "BSIT",
        gradeLevel = "1"
    )
    val response = ApiClient.api.register(body)
    if (response.isSuccessful) {
        val auth = response.body()!!
        TokenManager.saveToken(context, auth.token)
        // Navigate to home
    }
}

// Get current user (after login)
lifecycleScope.launch {
    val response = ApiClient.api.getUser()
    if (response.isSuccessful) {
        val user = response.body()!!
        // use user.id, user.name, user.username, user.email
    }
}

// Logout
lifecycleScope.launch {
    ApiClient.api.logout()  // optional: revoke on server
    TokenManager.clearToken(context)
    // Navigate to login
}
```

---

## 8. Network security (HTTP on Android 9+)

If you use **HTTP** (e.g. `http://10.0.2.2:8000`), allow cleartext in `res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">192.168.1.0</domain>
    </domain-config>
</network-security-config>
```

In `AndroidManifest.xml` (inside `<application>`):

```xml
android:networkSecurityConfig="@xml/network_security_config"
```

---

## 9. Endpoints summary

| Method | Endpoint       | Auth   | Body (JSON) |
|--------|----------------|--------|-------------|
| POST   | `/api/register`| No     | name, email, username, password, password_confirmation, course, grade_level |
| POST   | `/api/login`   | No     | username, password |
| GET    | `/api/user`    | Bearer | — |
| POST   | `/api/logout`  | Bearer | — |

After **login** or **register**, send the returned `token` in the header:  
`Authorization: Bearer <token>` for `/api/user` and `/api/logout`.
