# Security Environment Variables

## Required Environment Variables

### JWT_SECRET
**Required for:** JWT token signing and verification

**Description:** Secret key used to sign and verify JWT tokens. Must be a strong, random string.

**Example:**
```bash
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-characters
```

**Security Notes:**
- Must be at least 32 characters long
- Should be randomly generated
- Never commit to version control
- Use different secrets for development and production
- Generate using: `openssl rand -base64 32`

### JWT_EXPIRES_IN (Optional)
**Default:** `24h`

**Description:** Access token expiration time. Format: number followed by unit (s, m, h, d).

**Examples:**
```bash
JWT_EXPIRES_IN=24h    # 24 hours (default)
JWT_EXPIRES_IN=1h     # 1 hour
JWT_EXPIRES_IN=30m     # 30 minutes
```

### JWT_REFRESH_EXPIRES_IN (Optional)
**Default:** `7d`

**Description:** Refresh token expiration time. Format: number followed by unit (s, m, h, d).

**Examples:**
```bash
JWT_REFRESH_EXPIRES_IN=7d    # 7 days (default)
JWT_REFRESH_EXPIRES_IN=30d   # 30 days
```

## Setting Up Environment Variables

### Local Development
Create a `.env.local` file in the project root:

```bash
JWT_SECRET=your-development-secret-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### Production (Render.com)
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add the environment variables:
   - `JWT_SECRET` (generate a strong random key)
   - `JWT_EXPIRES_IN` (optional, defaults to 24h)
   - `JWT_REFRESH_EXPIRES_IN` (optional, defaults to 7d)

## Generating a Secure JWT Secret

### Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using Online Generator
Visit: https://generate-secret.vercel.app/32

## Security Best Practices

1. **Never commit secrets to Git**
   - Add `.env.local` to `.gitignore`
   - Use `.env.example` for documentation

2. **Use different secrets for each environment**
   - Development: `dev-secret-key`
   - Staging: `staging-secret-key`
   - Production: `production-secret-key`

3. **Rotate secrets periodically**
   - Change JWT_SECRET every 90 days
   - When rotating, all existing sessions will be invalidated

4. **Use strong secrets**
   - Minimum 32 characters
   - Mix of letters, numbers, and special characters
   - Randomly generated

## Troubleshooting

### "Invalid or expired token" errors
- Check that `JWT_SECRET` is set correctly
- Ensure the secret hasn't changed (this invalidates all tokens)
- Verify token expiration settings

### "No authentication token provided" errors
- Check that cookies are being sent (check browser DevTools)
- Verify `credentials: 'include'` is set in fetch requests
- Check that cookies are not being blocked

### CSRF token errors
- Ensure CSRF token is being sent in `X-CSRF-Token` header
- Verify CSRF token cookie is set
- Check that token hasn't expired (24 hours)

