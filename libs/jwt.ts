import jwt, { SignOptions } from 'jsonwebtoken'
interface TokenPayload {
  token: string
  user_id: string
  exp: number
  iat: number
}

export const verifyToken = ({ token, secretKey }: { token: string, secretKey: string }) => {
  return new Promise<TokenPayload>((resolve, rejects) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        throw rejects(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}