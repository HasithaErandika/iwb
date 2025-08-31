import NextAuth from "next-auth"
import Asgardeo from "next-auth/providers/asgardeo"
async function storeUserInBackend(profile,accessToken) {
  try {
    const userData = {
      userId: profile.sub,
      username: profile.username || profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
      email: profile.email || profile.username,
      country: profile.address?.country || '',
      mobileNumber: profile.phone_number || '',
      birthdate: profile.birthdate || ''
    };

    console.log('user data:', JSON.stringify(userData, null, 2));

    const response = await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },      
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      if (response.status === 409) {
        console.log('user already exists');
        return;
      }
      throw new Error(`failed to store user: ${response.status}`);
    }

    console.log('user stored successfully');
  } catch (error) {
    console.error('error storing user:', error);
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Asgardeo({
      issuer: process.env.AUTH_ASGARDEO_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email address phone" 
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'asgardeo' && profile) {
        await storeUserInBackend(profile,account.access_token);
      }
      return true; 
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/workspace`
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, profile, account }) {
      if (profile) {
        token.username = profile.username
        token.given_name = profile.given_name
        token.family_name = profile.family_name
        token.email = profile.email
      }

      if (account) {
        token.id_token = account.id_token
        token.access_token = account.access_token 
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.username
        session.user.given_name = token.given_name
        session.user.family_name = token.family_name
        session.user.id_token = token.id_token
        session.access_token = token.access_token
      }

      return session
    }
  }
})
