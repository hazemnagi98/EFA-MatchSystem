const admin = require('firebase-admin');
const functions = require('firebase-functions');

exports.addUser = functions.https.onCall(async (data, context) => {
    const userDoc = admin.firestore().collection('users').doc(context.auth.uid);
    await admin.auth().setCustomUserClaims(context.auth.uid, {
        role: data.role
    })
    await userDoc.set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        role: data.role,
        status: data.role === 'fan' ? 'active' : 'pending',
        city: data.city,
        address: data.address,
        dateOfBirth: new admin.firestore.Timestamp(data.dateOfBirth.seconds, data.dateOfBirth.nanoseconds)
    })

    return 'Success';
})

exports.deleteUser = functions.https.onCall(async (data, context) => {
    const user = await admin.auth().getUserByEmail(data.email);
    if (user) {
        await admin.auth().deleteUser(user.uid);

        await admin.firestore().collection('users').doc(user.uid).delete();

        return 'Success';
    }
    else
        return 'Failed';
})