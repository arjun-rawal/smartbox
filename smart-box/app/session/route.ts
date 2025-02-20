import { auth } from 'firebase-admin';
import { initAdmin } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
initAdmin();

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { idToken } = body;

    if (!idToken) {
      return new Response(
        JSON.stringify({ error: 'ID Token is missing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const decodedToken = await auth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });

    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    };

    const cookieHeader = `session=${sessionCookie}; ${Object.entries(options)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`;

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
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: Request) {
  try {
    const sessionCookie = req.headers
      .get('cookie')
      ?.split('; ')
      .find((c) => c.startsWith('session='));
    const sessionToken = sessionCookie?.split('=')[1];

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'No session cookie found' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const decodedSession = await auth().verifySessionCookie(sessionToken, true);
      const uid = decodedSession.uid;

      // ✅ Fetch "onBoard" from Firestore
      const userDoc = await db.collection('users').doc(uid).get();

      // Treat `onBoard` as false if missing
      const onBoard = userDoc.exists ? userDoc.data()?.onBoard ?? false : false;

      return new Response(
        JSON.stringify({ decodedSession: { ...decodedSession, onBoard } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Session verification failed:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
