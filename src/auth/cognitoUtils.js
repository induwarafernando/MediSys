import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_XXXXXXX',  // Replace with your pool ID
  ClientId: 'XXXXXXXXXXXXXXXXXXXX', // Replace with your client ID
};

const userPool = new CognitoUserPool(poolData);

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        user.getUserAttributes((err, attributes) => {
          if (err) return reject(err);

          const roleAttr = attributes.find(attr => attr.getName() === 'custom:role'); // e.g. custom:role = clinic_user
          const role = roleAttr ? roleAttr.getValue() : 'unknown';

          resolve({ session, role });
        });
      },
      onFailure: reject,
    });
  });
}
