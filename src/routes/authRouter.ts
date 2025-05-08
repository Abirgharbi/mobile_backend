import { Router } from 'express';
import { login, verifyMagicLink, register, OauthRegister ,OauthLogin} from '../controllers/customerAuthController';

const authRoute = Router();

authRoute.post('/login', login);
authRoute.post('/register', register);
authRoute.post('/oauth/register', OauthRegister);
authRoute.post('/oauth/login', OauthLogin);
authRoute.get('/verifyMagicLink', verifyMagicLink);

export default authRoute;
