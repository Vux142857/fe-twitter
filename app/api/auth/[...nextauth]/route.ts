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
                // console.log('Decoded refresh token:', decodedRT)
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
  jwt: {
    maxAge: 24 * 60 * 60, //  days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        if (trigger === 'update') {
          return {
            ...token,
            ...session.user
          }
        }
        if (user && !token?.refreshToken) {
          return {
            id: user.id,
            username: user.username,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            email: user.email,
            avatar: user.avatar,
            verify: user.verify,
            expRT: user.expRT,
            expAT: user.expAT
          }
        }
        if (token) {
          if (token.expAT as number > Date.now() / 1000) {
            // console.log('Access token is still valid:', token);
            return token;
          } else {
            // console.log('User token has expired, refreshing access token...');
            const newToken = await refreshAccessToken(token.refreshToken as string, token)
            // console.log('New token:', newToken);
            return newToken;
          }
        }
      } catch (error) {
        console.error('Error during JWT processing:', error);
        return token;
      }
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.email = token.email as string
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
        session.user.verify = token.verify as number
        // session.expires = toISODateString(token.exp as number) as string
        session.error = token.error as string
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

async function refreshAccessToken(refreshToken: string, token: JWT) {
  try {
    // console.log('Refreshing access token:', refreshToken)
    const response = await userServices.refreshToken(refreshToken)
    // console.log('response:', response)
    const refreshedTokens = await response.result
    // console.log('refreshedTokens:', refreshedTokens)
    if (!refreshedTokens) {
      throw 'Error refreshing access token'
    }
    const [decodedRT, decodeAT] = await Promise.all([
      verifyToken(
        {
          token: refreshedTokens.refreshToken,
          secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
        }),
      verifyToken(
        {
          token: refreshedTokens.accessToken,
          secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
        })
    ])
    if (!decodedRT) {
      throw 'Error decoding refresh token'
    }
    const newToken = {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      expRT: decodedRT.exp,
      expAT: decodeAT.exp
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
const setUserSession = (res: any, result: any, decodedRT, decodeAT) => {
  return {
    id: decodedRT.user_id,
    username: res.username,
    email: res.email,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    verify: res.verify,
    avatar: res.avatar,
    expRT: decodedRT.exp,
    expAT: decodeAT.exp
  };
}