import { verifyToken } from "@/libs/jwt"
import userServices, { LoginReqBody, RegisterReqBody } from "@/services/user.services"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
const handler = NextAuth({
  providers: [
    CredentialsProvider(
      {
        id: 'Sign In',
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          try {
            const { email, password } = credentials as LoginReqBody;
            const { result, message } = await userServices.login({ email, password });

            if (result && result.accessToken && result.refreshToken) {
              const decoded_access_token = await verifyToken(
                {
                  token: result.accessToken,
                  secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                });
              if (decoded_access_token) {
                const user = {
                  id: decoded_access_token.user_id,
                  accessToken: result.accessToken,
                  exp: decoded_access_token.exp
                };
                return user;
              } else {
                console.error('Error decoding access token');
                return null;
              }
            } else {
              console.error('Invalid login response:', message);
              return null;
            }
          } catch (error) {
            console.error('Error during login:', error);
            return null;
          }
        }
      },
    ),
    CredentialsProvider(
      {
        id: 'Sign Up',
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          confirm_password: { label: "Confirm Password", type: "password" },
          name: { label: "Name", type: "text" },
          username: { label: "Username", type: "text" },
          data_of_birth: { label: "Date of Birth", type: "text" }
        },
        async authorize(credentials) {
          try {
            const {
              email,
              password,
              confirm_password,
              name,
              date_of_birth,
              username } = credentials as unknown as RegisterReqBody;
            const { result, message } = await userServices.register({
              email,
              password,
              confirm_password,
              name,
              date_of_birth,
              username
            });

            if (result && result.accessToken && result.refreshToken) {
              const decoded_access_token = await verifyToken(
                {
                  token: result.accessToken,
                  secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                });
              if (decoded_access_token) {
                const user = {
                  id: decoded_access_token.user_id,
                  accessToken: result.accessToken,
                  exp: decoded_access_token.exp
                };
                return user;
              } else {
                console.error('Error decoding access token');
                return null;
              }
            } else {
              console.error('Invalid login response:', message);
              return null;
            }
          } catch (error) {
            console.error('Error during login:', error);
            return null;
          }
        }
      },
    )
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.accessToken = user.accessToken;
          token.session_exp = user.exp;
        }
      } catch (error) {
        console.error('Error during JWT processing:', error);
        return token;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
        session.expires = toISODateString(token.session_exp as number) as string
      }
      return session
    }
  }
})

function toISODateString(numericDate: number) {
  if (!numericDate || isNaN(numericDate)) {
    console.error('Invalid numericDate:', numericDate);
    return null;
  }
  const date = new Date(numericDate * 1000); // Convert seconds to milliseconds
  return date.toISOString();
}
export { handler as GET, handler as POST }