import { auth } from 'firebase-admin';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin if not already initialized
initAdmin();

export async function POST(req: Request) {
  try {
    // Parse the raw request body
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { idToken } = body;

    console.log("Received ID Token: ", idToken);

    if (!idToken) {
      return new Response(
        JSON.stringify({ error: 'ID Token is missing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the ID token
    const decodedToken = await auth().verifyIdToken(idToken);

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    };

    // Construct the Set-Cookie header
    const cookieHeader = `session=${sessionCookie}; ${Object.entries(options)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;

    // Return the response with the cookie
    return new Response(
      JSON.stringify({ status: 'success' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Session creation error:', error);

    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: error.message }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


export async function GET(req: Request) {
  try {
    // Access the session cookie -  You'll need to configure Next.js to handle sessions
    // This example assumes the session cookie is named 'session'
    const sessionCookie = req.headers.get('cookie')?.split('; ').find((c) => c.startsWith('session='));
    const sessionToken = sessionCookie?.split('=')[1];


    if (!sessionToken) {
      return new Response(JSON.stringify({ user: null }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify session cookie
    try {
        const decodedSession = await auth().verifySessionCookie(sessionToken, true);
        return new Response(JSON.stringify({ user: { uid: decodedSession.uid } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ user: null }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error('Session verification error:', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
