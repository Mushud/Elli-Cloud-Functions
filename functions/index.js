//jshint esversion: 6
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.sendOrderConfirmedNotification = functions.database.ref('/Todo Orders/{AssistantUID}/{OrderID}/deliveryFare')
.onUpdate((snapShot, context) => {
        const orderDeliveryFare = snapShot.after.val();
        const orderID = context.params.OrderID;
        const assistantUID = context.params.AssistantUID;

        const payload = {
            notification: {
                title : 'Order Confirmed. ' + 'Ghc ' + orderDeliveryFare,
                body: 'Order ' + orderID.slice(0,7) + 'just got confirmed.',
                sound: 'default'
            },
            data: {
                type: 'order_confirmed',
                orderID: orderID
            }
        };
        const options = {
            priority: 'high'
        };

    const token =  admin.database().ref('/Tokens/' + assistantUID + '/token').once('value');
  
    return token.then(result => {
        console.log('Order Confirmed');
        return admin.messaging().sendToDevice(result.val(), payload, options).catch(error => {
            console.log("couldn't send message");
        });

    }).catch(error => {
        console.log(error);
    });
});

exports.sendOrderAcceptedNotification = functions.database.ref('/My Orders/{UserID}/{pushID}/elliAssistantUID')
.onUpdate((snapShot, context) => {
        const userID = context.params.UserID;
        const orderID = context.params.pushID;

        const ElliAssistantUID = snapShot.after.val();

        const elliAssitantName = admin.database().ref('/Users/'+ElliAssistantUID+'/username').once('value');
        return elliAssitantName.then(result1 => {
            const elliName = result1.val();
            const token =  admin.database().ref('/Tokens/' + userID + '/token').once('value');
  
            return token.then(result => {
                 

                 const payload = {
                    notification: {
                        title: elliName + ' just accepted your Order ',
                        body: 'Your order ' + orderID.slice(0,7) + ' has been accepted.',
                        sound: 'default'
                    },
                    data:{
                        type: 'accept',
                        title: elliName+ ' just accepted your Order ',
                        body: 'Your order ' + orderID.slice(0,7) + ' has been accepted.',
                        sound: 'default',
                        click_action: '.MainActivity'
                    }
                };
    
                const options = {
                    priority: 'high'
                };
                console.log('Order Accepted');
                 return admin.messaging().sendToDevice(result.val(), payload, options).catch(error => {
                     console.log("couldn't send message");
                });

            }).catch(error => {
            console.log(error);
        });

     });
        

});

/*
exports.sendUpdateNotification = functions.database.ref('/Users/{UserID}').onUpdate((snapShot, context) => {

    const userID = context.params.UserID;

    const payload = {
        notification: {
            title: 'User Profile Updated',
            body: 'You have successfully Updated Your Profile',
            sound: 'default'
        },
        data:{
            type: 'profile_update'
        }
    };

    const options ={
        priority: 'high'
    };

    const token =  admin.database().ref('/Tokens/' + userID + '/token').once('value');
  
    return token.then(result => {
        console.log(result.val());
        return admin.messaging().sendToDevice(result.val(), payload, options).catch(error => {
            console.log("couldn't send message");
        });

    }).catch(error => {
        console.log(error);
    });

}); */


