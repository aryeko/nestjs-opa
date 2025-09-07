import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secret = new TextEncoder().encode('dev-secret');

export type JwtPayload = JWTPayload & { sub: string };

export async function signJwt(payload: JwtPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(secret);
}

export async function verifyJwt(req: {
  headers: Record<string, string | string[] | undefined>;
  user?: JwtPayload;
}): Promise<JwtPayload> {
  const auth = req.headers['authorization'] ?? '';
  const [, token] = (Array.isArray(auth) ? auth[0] : auth).split(' ');
  if (!token) throw new Error('missing token');
  const { payload } = await jwtVerify(token, secret);
  req.user = payload as JwtPayload;
  return payload as JwtPayload;
}
