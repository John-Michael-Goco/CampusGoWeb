package com.moneymate.auth;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.textfield.TextInputLayout;
import com.moneymate.R;
import com.moneymate.dashboard.Dashboard;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;

public class Login extends AppCompatActivity {

    private static final String LOGIN_URL = "http://10.0.2.2:8000/api/login";

    private static final String PREFS_NAME = "auth_prefs";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_USERNAME = "username";
    private static final String KEY_EMAIL = "email";

    private TextInputLayout usernameInput, passwordInput;
    private Button signUpButton, forgotBtn, loginBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        usernameInput = findViewById(R.id.loginEmailInput);
        passwordInput = findViewById(R.id.loginPasswordInput);
        signUpButton = findViewById(R.id.signUpBtn);
        forgotBtn = findViewById(R.id.forgotBtn);
        loginBtn = findViewById(R.id.loginBtn);

        // Optional: change hint to "Username" if you rename the view
        if (usernameInput.getEditText() != null) {
            usernameInput.getEditText().setHint("Username");
        }

        signUpButton.setOnClickListener(v -> {
            Intent intent = new Intent(Login.this, Register.class);
            startActivity(intent);
        });

        forgotBtn.setOnClickListener(v -> {
            Intent intent = new Intent(Login.this, ForgotPasswordEmail.class);
            startActivity(intent);
        });

        loginBtn.setOnClickListener(v -> loginUser());
    }

    private void loginUser() {
        String username = usernameInput.getEditText() != null
                ? usernameInput.getEditText().getText().toString().trim()
                : "";
        String password = passwordInput.getEditText() != null
                ? passwordInput.getEditText().getText().toString().trim()
                : "";

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Username and password are required!", Toast.LENGTH_SHORT).show();
            return;
        }

        JSONObject body = new JSONObject();
        try {
            body.put("username", username);
            body.put("password", password);
        } catch (JSONException e) {
            Toast.makeText(this, "Error building request.", Toast.LENGTH_SHORT).show();
            return;
        }

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.POST,
                LOGIN_URL,
                body,
                this::onLoginSuccess,
                this::onLoginError
        ) {
            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public byte[] getBody() {
                String payload = body.toString();
                return payload.getBytes(StandardCharsets.UTF_8);
            }
        };

        RequestQueue queue = Volley.newRequestQueue(this);
        queue.add(request);
    }

    private void onLoginSuccess(JSONObject response) {
        try {
            String token = response.getString("token");
            JSONObject user = response.getJSONObject("user");

            int id = user.getInt("id");
            String name = user.optString("name", "");
            String username = user.optString("username", "");
            String email = user.optString("email", "");

            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
            prefs.edit()
                    .putString(KEY_TOKEN, token)
                    .putInt(KEY_USER_ID, id)
                    .putString(KEY_USER_NAME, name)
                    .putString(KEY_USERNAME, username)
                    .putString(KEY_EMAIL, email)
                    .apply();

            Toast.makeText(this, "Logged in successfully!", Toast.LENGTH_SHORT).show();
            navigateToDashboard();
        } catch (JSONException e) {
            Log.e("LoginError", "JSON parsing: " + e.getMessage());
            Toast.makeText(this, "Invalid response. Try again.", Toast.LENGTH_LONG).show();
        }
    }

    private void onLoginError(VolleyError error) {
        Log.e("VolleyError", "Request error: " + (error.networkResponse != null ? error.networkResponse.statusCode + " " + new String(error.networkResponse.data != null ? error.networkResponse.data : new byte[0], StandardCharsets.UTF_8) : error.getMessage()));

        String message = "Check your connection.";
        if (error.networkResponse != null && error.networkResponse.data != null) {
            try {
                JSONObject err = new JSONObject(new String(error.networkResponse.data, StandardCharsets.UTF_8));
                if (err.has("errors")) {
                    JSONObject errors = err.getJSONObject("errors");
                    if (errors.has("username")) {
                        message = errors.getJSONArray("username").optString(0, message);
                    }
                } else if (err.has("message")) {
                    message = err.getString("message");
                }
            } catch (JSONException ignored) {
            }
        }
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    private void navigateToDashboard() {
        Intent intent = new Intent(Login.this, Dashboard.class);
        startActivity(intent);
        finish();
    }
}
