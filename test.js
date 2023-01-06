const { JWT } = require("google-auth-library");
const { localService } = require("./src/services");

function getJWTResultWithAccessAndRefreshToken(
  jsonObjectFromGoogleKeyEtcFile,
  callbackWithErrAndResult
) {
  var scopes = ["https://www.googleapis.com/auth/keep"];

  var jwt = new JWT(
    jsonObjectFromGoogleKeyEtcFile.client_email,
    null,
    jsonObjectFromGoogleKeyEtcFile.private_key,
    scopes
  );

  jwt.authorize(function (err, result) {
    callbackWithErrAndResult(err, result.access_token, result.refresh_token);
  });
}

async function main() {
  const creds = await localService.JSONRead("./google-creds.json");

  getJWTResultWithAccessAndRefreshToken(creds, (err, token, refresh) => {
    console.log(err, token, refresh);
  });
}

main();

const foo = {
  keep_version: None,
  labels: [],
  nodes: [
    {
      _dirty: True,
      id: "1850857fa6c.84c4aa486b2c9d70",
      kind: "notes#node",
      type: "NOTE",
      parentId: "root",
      sortValue: 1023620647,
      text: "",
      timestamps: {
        _dirty: True,
        kind: "notes#timestamps",
        created: "2022-12-12T21:57:41.612243Z",
        deleted: "1970-01-01T00:00:00.000000Z",
        trashed: "1970-01-01T00:00:00.000000Z",
        updated: "2022-12-12T21:57:41.612397Z",
        userEdited: "2022-12-12T21:57:41.612397Z",
      },
      nodeSettings: {
        _dirty: False,
        newListItemPlacement: "BOTTOM",
        graveyardState: "COLLAPSED",
        checkedListItemsPolicy: "GRAVEYARD",
      },
      annotationsGroup: { _dirty: False, kind: "notes#annotationsGroup" },
      color: "DEFAULT",
      isArchived: False,
      isPinned: False,
      title: "Todo",
      labelIds: [False],
      collaborators: [],
      shareRequests: [False],
    },
    {
      _dirty: True,
      id: "1850857fa6c.5ffcef2d8a9f7721",
      kind: "notes#node",
      type: "LIST_ITEM",
      parentId: "1850857fa6c.84c4aa486b2c9d70",
      sortValue: 5842943651,
      text: "Eat breakfast",
      timestamps: {
        _dirty: True,
        kind: "notes#timestamps",
        created: "2022-12-12T21:57:41.612354Z",
        deleted: "1970-01-01T00:00:00.000000Z",
        trashed: "1970-01-01T00:00:00.000000Z",
        updated: "2022-12-12T21:57:41.612395Z",
        userEdited: "2022-12-12T21:57:41.612395Z",
      },
      nodeSettings: {
        _dirty: False,
        newListItemPlacement: "BOTTOM",
        graveyardState: "COLLAPSED",
        checkedListItemsPolicy: "GRAVEYARD",
      },
      annotationsGroup: { _dirty: False, kind: "notes#annotationsGroup" },
      parentServerId: None,
      superListItemId: None,
      checked: False,
    },
  ],
};

// const jwt = require("jsonwebtoken");

// const KEY =
//   "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOaQQ/ogV1rvb0\nSQ96zcnFWxw+fw7T9hqlYNGrY8BoYsmKWywWd3LJSwptfbVkyBjrPLAv3CBJ4vv9\na/h/0jDFBhw346WMJhhYeSZlMZYlnaZ9thQ/5EKoiGiKQSYcoo1Njh9Z/2bjuHie\nYu8cOH1ykwcUFMY5gNWEU9eRRrlGNiZC295NeaH9VM2uwsICCj3U1wDDMTeKtbWZ\nNDLHltiGTccmQPscMFgEAjSkwgQF7DyQKINJ9+czTfYedHWLpdXthoGlP8UMT/9a\naUjCad4/CHOBmQC/iSvxfaTxepabi9lFuDqEXPQm1rtwa75R2LfLXaQBFNKMuoCd\ncVAnP0HLAgMBAAECggEAOTbW3KSWitZi0bfmuI2OXkww+gnSHGLdY/YAaFeQH98y\nKk23XMrjYHSSgWMVAsiMT7hUxg9oS9LFMqvZB+VFa3eUHtHVM5HjsbJzOB2Ulvyq\nB7KOzl8BMyIMiDYi0FEmhdbdTd8DsB+UH6Mg0FvAOiATGDfh8lKJ3NI4sKY/+PvN\n3O7adWMPo3Dzish9LO21A54grqVtVN71IEdcIt+hfCIlRN9opssYvzu/Kr/0eEnZ\noE58Xvu9AuaiNOrTBsq+JBCbxeyuXuveNHks4OCcPlroxkbMNhxpvt82u+hGVHby\nbYuxPizJ7889M9mdL3WGzPXxSNM1Dk2KaBr4S0rKQQKBgQDzi9VnzIg88ybbDAv0\nz5IbxMb9xnrvUwcI3NBrhp/kyW7N8yHamvI8aUe8whyfMIKA3aom831N+H/I9NXc\npb752pXrGTLqjxuz9qFbXAzZbjdfoBdLDaTFNhpQ66/Qe6DZrzZZYeIFkJU0reTQ\nRWPdPvX9quLLSFksXClTqOrv+wKBgQDY9wzlxdUq41U5IPrzyjsAa4FWX86pemQZ\nOpfbg+DEDYpQyGfLGlgvW2tDn84EzjixfgMvTnHchnxejFXaksn1FygrlE1HdL7c\npeHk+NE8aP8zJiRbEaBPPHWnWTQ8r8D2cv4/IcZvzfXO+0BBtp/jR17aTFLr4O/R\n700cOb28cQKBgQC7RMWml+4WN72j50J2TvmBIrEESA8VYVliZjBYzd661GzALfjV\nGBm1fBquOPA7M9jVcBy68LVkM/VGN4UOseAETSDD8s9k7v+VRMpT7pbuxcIMZJQk\noOwWvIBFwsSg4b8QQ5rd5dcfAkrIhAISZ5jfcd9C25iiSRJQetlIO/XS6wKBgC44\n46yH6xQJ/nv/RLdvXAaI4LMQEi0VAAJH81Y20Em0QMVZDJO+dw8PwNhVUUTA0l8t\n42vOoH9Ev3Y9G4VHRHNMjahLHfOdMZQ8WtW3FIx0KfoxpAkqxiZbUQ1n+bL8FnXq\npbO5dFcZX8bKzDOzvnhjGhgTro7GCxGEk77xpjRhAoGBAJHH/8GoWXkA+m/zuecz\nAbZvVNLbZu0bg0wM2oIzs3DsomD6yTyhEjg24FhuCVKSEATmeJ1NrsaKjXp3hRF/\nWrRywWlCAvRf1VQDq/B+o0tVq1uW2oiXoP1uxLVSwsziVIG6oJxJc7oA7RSb0diL\nMUgc9Lm9ypl91LcjbzLoD0Yo";

// function main() {
//   const header = { alg: "RS256", typ: "JWT" };
//   const claimSet = {
//     iss: "passive-display-renderer@appspot.gserviceaccount.com",
//     scope: "https://www.googleapis.com/auth/keep.readonly",
//     aud: "https://oauth2.googleapis.com/token",
//     exp: Math.floor(Date.now() / 1000) + 60 * 60,
//     iat: Math.floor(Date.now() / 1000),
//   };

//   // const token = jwt.sign(claimSet, KEY, {
//   //   header: { alg: "RS256", typ: "JWT" },
//   // });

//   // console.log(token)

//   console.log(Buffer.from(`${header}.${claimSet}.${KEY}`).toString("base64"));
// }

// main();

// const { google } = require('googleapis')

// /**
//  * Generates signed JWT for GCP vault auth
//  * @param {string} serviceAccountEmail
//  * @param {string} projectId
//  * @param {Object} claims
//  */
// const getSignedJwt = async (serviceAccountEmail, projectId, claims) => {
//   const authClient = await authorize();
//   const request = {
//     name: `projects/${projectId}/serviceAccounts/${serviceAccountEmail}`,
//     resource: {
//       payload: JSON.stringify(claims),
//     },
//     auth: authClient,
//   };
//   try {
//     const response = (await iam.projects.serviceAccounts.signJwt(request)).data;
//     return response.signedJwt;
//   } catch (err) {
//     console.error(err);
//   }
// };

// const authorize = async () => {
//   const auth = new google.auth.GoogleAuth({
//     scopes: ["https://www.googleapis.com/auth/cloud-platform"],
//   });
//   return await auth.getClient();
// };

// /**
//  * Generates claims object for JWT
//  * @param {string} roleName
//  * @param {string} serviceAccountEmail
//  */

// const getJwtClaims = (roleName, serviceAccountEmail) => {
//   const timeExp = parseInt(Date.now() / 1000) + 600;
//   const claims = {
//     aud: `vault/${roleName}`,
//     exp: timeExp,
//     sub: serviceAccountEmail,
//   };
//   return claims;
// };
