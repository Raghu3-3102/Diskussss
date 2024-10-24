import redis from 'redis';

// Create a Redis client and connect to it
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Specify the Redis URL
  });
  

// Connect to Redis
client.connect().catch(err => console.error('Redis connection error:', err));

// Function to store OTP
export const storeOtp = async (email, otp) => {
  const expiryTimeInSeconds = 300; // OTP valid for 5 minutes (300 seconds)

  try {
    await client.setEx(email, expiryTimeInSeconds, otp);
    console.log(`OTP stored successfully for ${email}: ${otp}`);
  } catch (err) {
    console.error('Error storing OTP in Redis:', err);
  }
};

// Function to retrieve OTP
const getOtp = async (email) => {
  try {
    const otp = await client.get(email);
    if (otp) {
      console.log(`Retrieved OTP for ${email}: ${otp}`);
      return otp; // Return the OTP
    } else {
      console.log(`No OTP found for ${email}`);
      return null; // Return null if OTP is not found
    }
  } catch (err) {
    console.error('Error retrieving OTP from Redis:', err);
    return null; // Return null on error
  }
};

// Example usage
(async () => {
  const email = 'user@example.com';
  const otp = '123456'; // Example OTP

  // Store the OTP
  await storeOtp(email, otp);

  // Retrieve the OTP
  await getOtp(email);

  // Close the connection when done (optional for development)
  // await client.quit();
})();
