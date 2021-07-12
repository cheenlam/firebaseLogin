window.onload = function(){cksign()}

var firebaseConfig = {
    apiKey: "AIzaSyAgZwvI140YQ0w-nLzg2NMHGD7LT8xA0ig",
    authDomain: "login-a4c56.firebaseapp.com",
    projectId: "login-a4c56",
    storageBucket: "login-a4c56.appspot.com",
    messagingSenderId: "446192149335",
    appId: "1:446192149335:web:c1bbb2ba15206bb5921412",
    measurementId: "G-2ZYH9PZFK0"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();

// 錯誤訊息
function errorMsg(code) {
    switch (code) {
        case "auth/email-already-in-use":
            alert('該Email已註冊'); break;

        case "auth/invalid-email":
            alert('無效的電子郵件'); break;

        case "auth/weak-password":
            alert('密碼長度必須大於六個字符'); break;

        case "auth/user-not-found":
            alert('帳號輸入錯誤'); break;

        case "auth/wrong-password":
            alert('密碼無效或用戶沒有密碼'); break;
    }
}

// 信箱註冊
function regd() {
    let email = $('#account').val()
    let password = $('#password').val()
    let myName = $('#name').val() || 'Member'
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
            alert('註冊成功');

            db.collection("member").doc(result.user.uid).set({
                name: myName,
                points: 0,
                phone:'',
            })

        })
        .catch(function (error) {
            errorMsg(error.code)
        });
}

// 信箱登入
function signIn() {
    let email = $('#account').val()
    let password = $('#password').val()
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(result => {
            alert('登入成功');

            console.log(result);
        })
        .catch(error => {
            // console.log(error);
            // console.log(error.message);
            // console.log("登入失敗");
            errorMsg(error.code)
        });
}

// google登入
function inGoogle() {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(providerGoogle);
}

firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        var credential = result.credential;
        var token = credential.accessToken;
        console.log(result)

        if (result.additionalUserInfo.isNewUser) {
            db.collection("member").doc(result.user.uid).set({
                name: result.additionalUserInfo.profile.name,
                points: 0,
                phone:'',
            })
        }
    }
    var user = result.user;
}).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    // console.log(error)
    alert('登入失敗');
});

// 查詢會員資料狀態
function cksign() {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            // console.log(user.uid)
            // console.log(user)
            // 使用者已登入，可以取得資料
            var uid = user.uid;
            var docRef = db.collection("member").doc(uid);

            // console.log(user);
            docRef.get().then(function (doc) {
                // console.log(doc.data());

                $('#showAcct').text(doc.data().name)
                $('#showPoint').text(doc.data().points)
  
                $('#reviseMember').val(doc.data().name)
                $('#revisePhone').val(doc.data().phone)
            })
        } else {
            // 使用者未登入
            console.log("使用者未登入");
        }
    });
}

// 會員登出
function signOut() {
    firebase.auth().signOut()
    alert('使用者登出')
    $('#showAcct').text('')
    $('#showPoint').text('')
}

// 忘記密碼 (僅限於email)
function forget() {
    let emailAddress = $('#account').val()
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(emailAddress).then(function () {
        window.alert('已發送信件至信箱，請按照信件說明重設密碼');
        // 送信後，強制頁面重整一次
        // window.location.reload(); 
    }).catch(error => {
        errorMsg(error.code)
    });
}

// 隨機random
$('#ranGame button').click(function () {
    var ran = parseInt(Math.random() * 10 + 1)
    $('#ranGame span').text(ran)

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            var email = user.email;
            var uid = user.uid;
            // var point;
            var docRef = db.collection("member").doc(uid);

            docRef.get().then(function (doc) {
                var point = doc.data().points
                docRef.update({ points: point + ran })
                $('#showPoint').text(point + ran)
            })
        }
    });
})



function revise() {
    $('#reviseBox').addClass("on")
}


$('#reviseBtn').click(function(){

    var reviseMember = $('#reviseMember').val()
    var revisePhone = $('#revisePhone').val()
    // console.log(reviseMember)
    
    firebase.auth().onAuthStateChanged(function (user){
        db.collection("member").doc(user.uid).update({
            name: reviseMember,
            phone:revisePhone,
        })
    }) 

    cksign()
    $('#reviseBox').removeClass('on')
})


$('#reviseClose').click(function(){
    $('#reviseBox').removeClass('on')
})


