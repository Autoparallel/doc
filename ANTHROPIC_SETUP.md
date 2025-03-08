# Setting Up Your Anthropic API Key

Follow these simple steps to obtain and configure your Anthropic API key for the Health Recipes app:

## Step 1: Create an Anthropic Account

1. Visit [Anthropic's Console](https://console.anthropic.com/) and sign up for an account
2. Complete the email verification process
3. Log in to your Anthropic account

## Step 2: Generate an API Key

1. Once logged in, navigate to the API Keys section
2. Click "Create API Key"
3. Give your key a name like "Health Recipes App"
4. Copy the API key (it will look like `sk-ant-api...`)

## Step 3: Add the API Key to Your Application

1. Open the `.env.local` file in the root directory of the application
2. Replace `your_anthropic_api_key_here` with your actual API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
   ```
3. Save the file

## Step 4: Restart Your Application

1. If your application is running, stop it (Ctrl+C in the terminal)
2. Restart it with `npm run dev`
3. The application should now work with your Anthropic API key

## Understanding Anthropic's Free Tier

Anthropic offers a free tier with the following daily limits:

- **Claude 3 Haiku**: 100K input tokens, 100K output tokens
- **Claude 3 Sonnet**: 20K input tokens, 20K output tokens
- **Claude 3 Opus**: 10K input tokens, 10K output tokens

The Health Recipes app uses Claude 3 Haiku by default, which should provide plenty of capacity for testing.

## Troubleshooting API Issues

If you encounter errors:

1. Verify your API key is correctly entered in the `.env.local` file
2. Make sure your API key is still valid (they don't expire unless deleted)
3. Check the console logs for specific error messages
4. Ensure you haven't exceeded your free tier limits

If you still have issues, try replacing `claude-3-haiku-20240307` with `claude-instant-1.2` in `src/lib/openai.ts` to use an older model. 