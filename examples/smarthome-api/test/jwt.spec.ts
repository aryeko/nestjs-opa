import { signJwt, verifyJwt } from '../src/auth/jwt';

describe('jwt util', () => {
  it('signs and verifies token', async () => {
    const token = await signJwt({ sub: 'alice' });
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const payload = await verifyJwt(req);
    expect(payload.sub).toBe('alice');
    expect(req.user.sub).toBe('alice');
  });
});
