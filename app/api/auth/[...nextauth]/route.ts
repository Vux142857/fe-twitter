import { verifyToken } from "@/libs/jwt"
import userServices, { LoginReqBody, RegisterReqBody } from "@/services/user.services"
import { JWT } from "next-auth/jwt"
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
              const [decodedRT, decodeAT] = await Promise.all([
                verifyToken(
                  {
                    token: result.refreshToken,
                    secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                  }),
                verifyToken(
                  {
                    token: result.accessToken,
                    secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                  })
              ])
              if (decodedRT) {
                const res = await userServices.getMe(result.accessToken);
                if (res && res.result && res.result.user) {
                  const user = setUserSession(res.result.user, result, decodedRT, decodeAT);
                  return user;
                }
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
              const [decodedRT, decodeAT] = await Promise.all([
                verifyToken(
                  {
                    token: result.refreshToken,
                    secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                  }),
                verifyToken(
                  {
                    token: result.accessToken,
                    secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                  })
              ])
              if (decodedRT) {
                const res = await userServices.getMe(result.accessToken);
                if (res && res.result && res.result.user) {
                  const user = setUserSession(res.result.user, result, decodedRT, decodeAT);
                  return user;
                }
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
          return {
            id: user.id,
            username: user.username,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            avatar: user.avatar,
            profile: user.profile,
            exp: user.exp,
            expAT: user.expAT
          }
        }
        if (token.expAT as number > Date.now() / 1000) {
          // console.log('Access token is still valid:', token);
          return token;
        } else {
          // console.log('User token has expired, refreshing access token...');
          return await refreshAccessToken(token.refreshToken as string, token);
        }
      } catch (error) {
        // console.error('Error during JWT processing:', error);
        return token;
      }
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
        session.expires = toISODateString(token.exp as number) as string
        session.error = token.error as string
      }
      return session
    }
  }
})

function toISODateString(numericDate: number) {
  if (!numericDate || isNaN(numericDate)) {
    // console.error('Invalid numericDate:', numericDate);
    return null;
  }
  const date = new Date(numericDate * 1000); // Convert seconds to milliseconds
  return date.toISOString();
}

async function refreshAccessToken(refreshToken: string, token: JWT) {
  try {
    // console.log('Refreshing access token:', refreshToken)
    const response = await userServices.refreshToken(refreshToken)
    const refreshedTokens = await response.result
    if (!refreshedTokens) {
      throw 'Error refreshing access token'
    }
    const decodedRT = await verifyToken(
      {
        token: refreshedTokens.refreshToken,
        secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      });
    const newToken = {
      ...token,
      accessToken: refreshedTokens.accessToken,
      session_exp: decodedRT.exp
    }
    return newToken
  } catch (error) {
    // console.log('Error refreshing access token:', error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
export { handler as GET, handler as POST }

// Utils
const setUserSession = (res: any, result: any, decodedRT: any, decodeAT) => {
  return {
    id: decodedRT.user_id,
    username: res.username,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    avatar: res.avatar,
    exp: decodedRT.exp,
    expAT: decodeAT.exp
  };
}