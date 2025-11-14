# Action Items - Security Implementation

## ⚠️ CRITICAL: Required Before Production Use

### 1. Set JWT_SECRET Environment Variable

**Why:** The JWT system requires a secret key to sign and verify tokens. Without it, authentication will fail.

**Local Development:**
1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line:
   ```bash
   JWT_SECRET=your-strong-random-secret-key-here
   ```
3. Generate a secure secret using one of these methods:
   ```bash
   # Using OpenSSL (recommended)
   openssl rand -base64 32
   
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
4. Restart your development server after adding the variable

**Production (Render.com):**
1. Go to your Render dashboard
2. Select your web service
3. Navigate to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key:** `JWT_SECRET`
   - **Value:** (paste your generated secret - at least 32 characters)
6. Save and redeploy your service

**Important Notes:**
- Use a **different** secret for production than development
- Never commit the secret to Git (it's already in `.gitignore`)
- The secret must be at least 32 characters for security
- If you change the secret, all existing sessions will be invalidated

---

## ✅ Recommended: Testing Checklist

### Test Authentication Flow
- [ ] Login with valid credentials
- [ ] Verify you can access admin pages after login
- [ ] Test logout functionality
- [ ] Verify you're redirected to login after logout
- [ ] Try accessing admin pages without logging in (should redirect)

### Test CSRF Protection
- [ ] Make a POST request (e.g., create a product) - should work
- [ ] Try making a request without CSRF token (should fail with 403)
- [ ] Verify error message is clear: "Invalid CSRF token"

### Test Token Expiration
- [ ] Wait 24 hours (or temporarily change `JWT_EXPIRES_IN` to a shorter time)
- [ ] Verify token refresh works automatically
- [ ] Test that expired tokens are rejected

---

## 📋 Optional: Environment Variable Customization

If you want to customize token expiration times, add these to your `.env.local`:

```bash
JWT_EXPIRES_IN=24h          # Access token expiration (default: 24h)
JWT_REFRESH_EXPIRES_IN=7d   # Refresh token expiration (default: 7d)
```

**Examples:**
- `JWT_EXPIRES_IN=1h` - Tokens expire after 1 hour
- `JWT_EXPIRES_IN=30m` - Tokens expire after 30 minutes
- `JWT_REFRESH_EXPIRES_IN=30d` - Refresh tokens last 30 days

---

## 🔍 Verification Steps

### Check if JWT_SECRET is Set (Local)
```bash
# In your terminal, check if the variable is loaded
node -e "console.log(process.env.JWT_SECRET ? 'Set' : 'Not set')"
```

### Check if Authentication Works
1. Try logging in
2. Check browser DevTools → Application → Cookies
3. You should see `access_token` and `refresh_token` cookies
4. Verify they're marked as "HttpOnly" and "Secure" (in production)

### Check if CSRF Protection Works
1. Open browser DevTools → Network tab
2. Make a POST request (e.g., save settings)
3. Check the request headers
4. You should see `X-CSRF-Token` header with a token value

---

## 🚨 Troubleshooting

### "Invalid or expired token" errors
- **Cause:** JWT_SECRET not set or changed
- **Fix:** Set JWT_SECRET environment variable and restart server

### "No authentication token provided" errors
- **Cause:** Cookies not being sent
- **Fix:** Check that `credentials: 'include'` is in fetch requests (already implemented)

### "Invalid CSRF token" errors
- **Cause:** CSRF token expired or not sent
- **Fix:** Refresh the page to get a new CSRF token

### Login works but can't access admin pages
- **Cause:** JWT_SECRET mismatch between login and verification
- **Fix:** Ensure JWT_SECRET is the same in all environments

---

## 📝 Summary

**Minimum Required Action:**
1. ✅ Set `JWT_SECRET` environment variable (local and production)
2. ✅ Restart development server
3. ✅ Test login/logout flow

**Everything else is optional** - the system will work with just the JWT_SECRET set.

---

## 📚 Documentation

- See `SECURITY_ENV_VARS.md` for detailed environment variable documentation
- See `SECURITY_AUDIT_REPORT.md` for complete security audit
- See `SECURITY_IMPLEMENTATION_NOTES.md` for implementation details

