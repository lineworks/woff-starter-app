// WOFF ID
const woffId = process.env.WOFF_ID;

/**
* Alert the user if WOFF is opened in an external browser and unavailable buttons are tapped
*/
const sendAlertIfNotInClient = () => {
    alert('This button is unavailable as WOFF is currently opened in an external browser.');
}

/**
* Display data generated by invoking WOFF methods
*/
const displayWoffData = () => {
    document.getElementById('browserLanguage').textContent = woff.getLanguage();
    document.getElementById('sdkVersion').textContent = woff.getVersion();
    document.getElementById('lineWorksVersion').textContent = woff.getWorksVersion();
    document.getElementById('isInClient').textContent = woff.isInClient();
    document.getElementById('isLoggedIn').textContent = woff.isLoggedIn();
    document.getElementById('deviceOS').textContent = woff.getOS();

    var context = woff.getContext();
    document.getElementById('viewType').textContent = context.viewType;
    document.getElementById('endpointUrl').textContent = context.endpointUrl;
    document.getElementById('permanentLinkPattern').textContent = context.permanentLinkPattern;
    document.getElementById('clientId').textContent = context.clientId;

    if (woff.isInClient()) {
        document.getElementById('isInClientMessage').textContent = 'Opening the app in the in-app browser of LINE WORKS.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'Opening the app in an external browser.';
    }
}

/**
* Register event handlers for the buttons displayed in the app
*/
const registerButtonHandlers = () => {
    // openWindow call
    document.getElementById('openWindowButton').addEventListener('click', () => {
        console.log("open window");
        woff.openWindow({
            url: 'https://line.worksmobile.com/',
            external: true
        });
    });

    // closeWindow call
    document.getElementById('closeWindowButton').addEventListener('click', () => {
        if (!woff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            console.log("close window");
            woff.closeWindow();
        }
    });

    // sendMessage call
    document.getElementById('sendMessageButton').addEventListener('click', () => {
        if (!woff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            let msg = document.getElementById('sendMessageText').value
            woff.sendMessage({
                'content': msg
            }).then(() => {
                console.log("message sent: " + msg)
                window.alert('Message sent');
            }).catch((error) => {
                console.error(error)
                window.alert('Error sending message: ' + error);
            });
        }
    });

    // sendFlexMessage call
    document.getElementById('sendFlexMessageButton').addEventListener('click', () => {
        if (!woff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            let msg = {
                "type": "flex",
                "altText": "this is a flexible template",
                "contents": {
                  "type": "bubble",
                  "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "hello"
                      },
                      {
                        "type": "text",
                        "text": "world"
                      }
                    ]
                  }
                }
            }

            woff.sendFlexMessage({
                flex: msg
            }).then(() => {
                console.log("flex message sent: " + msg)
                window.alert('Message sent');
            }).catch((error) => {
                console.error(error)
                window.alert('Error sending message: ' + error);
            });
        }
    });

    // get access token
    document.getElementById('getAccessToken').addEventListener('click', () => {
        if (!woff.isLoggedIn() && !woff.isInClient()) {
            alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
        } else {
            console.log("Get access token");
            const accessToken = woff.getAccessToken();
            document.getElementById('accessTokenField').textContent = accessToken;
        }
    });

    // get profile call
    document.getElementById('getProfileButton').addEventListener('click', () => {
        console.log("Get profile");
        woff.getProfile().then((profile) => {
            document.getElementById('domainIdField').textContent = profile.domainId;
            document.getElementById('userIdProfileField').textContent = profile.userId;
            document.getElementById('displayNameField').textContent = profile.displayName;
        }).catch((error) => {
            console.error(error)
            window.alert('Error getting profile: ' + error);
        });
    });

    // login call, only when external browser is used
    document.getElementById('woffLoginButton').addEventListener('click', () => {
        if (!woff.isLoggedIn()) {
            console.log("Login");
            // set `redirectUri` to redirect the user to a URL other than the front page of your WOFF app.
            woff.login();
        }
    });

    // logout call only when external browse
    document.getElementById('woffLogoutButton').addEventListener('click', () => {
        if (woff.isLoggedIn()) {
            woff.logout();
            window.location.reload();
        }
    });

    // scan QR
    document.getElementById('scanQrButton').addEventListener('click', () => {
        console.log("Scan QR");
        woff.scanQR().then((result) => {
            document.getElementById('scanQrResult').textContent = result.value;
        }).catch((error) => {
            console.error(error)
            window.alert('Error scanning QR: ' + error);
        });
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
const initializeApp = () => {
    displayWoffData();
    registerButtonHandlers();

    // check if the user is logged in/out, and disable inappropriate button
    if (woff.isLoggedIn()) {
        document.getElementById('woffLoginButton').disabled = true;
    } else {
        document.getElementById('woffLogoutButton').disabled = true;
    }
}

/**
* Initialize WOFF
* @param {string} myWoffId The WOFF ID of the selected element
*/
const initializeWoff = (myWoffId) => {
    woff
        .init({
            woffId: myWoffId
        })
        .then(() => {
            // start to use WOFF's api
            initializeApp();
        })
        .catch((err) => {
            console.error(err)
            document.getElementById("woffInitErrorMessage").hidden = false;
        });
}

// On load
window.addEventListener('load', () => {
    console.log('WOFF_ID: ' + woffId);
    initializeWoff(woffId);
});
