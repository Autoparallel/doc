// Simple script to test Anthropic API key using node-fetch
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testAnthropicAPI() {
    try {
        console.log("Testing Anthropic API key with Claude 3 Sonnet...");

        // Get API key from environment
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
            console.error("❌ Invalid API key. Please update your .env.local file with a valid Anthropic API key.");
            return;
        }

        // Make a basic fetch request to the Anthropic API
        console.log("Sending test request to Claude API (using Claude 3 Sonnet)...");

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-7-sonnet-20250219",
                max_tokens: 50,  // Reduced to minimize token usage
                messages: [
                    {
                        role: "user",
                        content: "Hello! Please respond with one short sentence."
                    }
                ]
            })
        });

        const data = await response.json();

        if (response.ok && data.content && data.content.length > 0) {
            console.log("\n✅ SUCCESS! Your Anthropic API key is working correctly.\n");
            console.log("Sample response from Claude:");
            console.log("------------------------------------");
            console.log(data.content[0].text);
            console.log("------------------------------------");
            console.log("\nThe free tier should allow for enough tokens to test your application.");
        } else {
            console.error("❌ Response was not successful:", response.status);
            console.error("Error details:", data);

            if (data.error?.message?.includes('credit')) {
                console.log("\n💡 TROUBLESHOOTING STEPS:");
                console.log("1. Go to https://console.anthropic.com/settings/billing");
                console.log("2. Check if you need to set up billing (even for free tier)");
                console.log("3. Look for any 'Activate Free Tier' option");
                console.log("4. Check if your account has recently been created (it might take time to activate)");
                console.log("5. Try creating a new API key");
            }
        }
    } catch (error) {
        console.error("❌ API test failed with error:", error.message);
        console.error("\nFull error:", error);
    }
}

testAnthropicAPI(); 