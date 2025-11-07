import { auth, ConfigParams } from 'express-openid-connect';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';


// Auth0 Middleware Configuration
const config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.FRONTEND_URL,
  },
  afterCallback: async (req, res, session, decodedState) => {
    try {
      
      const auth0User = jwt.decode(session.id_token);

      if (!auth0User || typeof auth0User === 'string' || !auth0User.sub) {
        throw new Error('There was an error decoding the id_token');
      }

      const auth0Id = auth0User.sub;
      const email = auth0User.email;
      const given_name = auth0User.given_name;
      const family_name = auth0User.family_name;
      const nickname = auth0User.nickname;
      const picture = auth0User.picture;
      const updated_at = auth0User.updated_at;
      const email_verified = auth0User.email_verified;

      let dbUser = await prisma.user.findUnique({ where: { id: auth0Id } });

      if (!dbUser) {
        // Create a new user if it wasn't found
        dbUser = await prisma.user.create({
          data: {
            id: auth0Id,
            email,
            given_name,
            family_name,
            nickname,
            picture,
            updated_at: updated_at ? new Date(updated_at) : null,
            email_verified,
          },
        });
      }

      // Attach the database user to the session
      session.user = dbUser;

      return session;
    } catch (error) {
      console.error('Error in afterCallback:', error);
      throw new Error('Error processing authentication callback.');
    }
  },
};

export default auth(config);