import * as tw from "./Global/Thingworx/thingworx_api_module.js"
import * as fb from "./Global/Firebase/firebase_auth_module.js"
import * as lang from "./Global/Common/Translation.js"

fb.onAuthStateChanged_2()
lang.getLanguage()

$('#passwordUpdate').click(function(){
    var newPassword = $('#newPassword').val();
    var user = firebase.auth().currentUser;
    //var password = $('#oldPassword').val();
    console.log(user)
    
    const createCredential = user => {
        const password = $('#oldPassword').val();
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        return credential;
    }

    const credential = createCredential(user)
    /*const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );*/
    console.log(credential)
    changePassword(user, credential, newPassword);
});


function changePassword(user, credential, newPassword){
	user.reauthenticateWithCredential(credential).then(() => {
            // User re-authenticated.
            console.log(newPassword)
            user.updatePassword(newPassword).then(() => {
                console.log("ok")
            
                    $("#successAlert").fadeIn(3000);
                
            
            });
	}).catch((error) => {
		    $("#errorAlert").fadeIn(3000);
	  });
}

// dichiarazione dei variabile per i campi di input
let firstname = document.getElementById('display_name')
let lastname = document.getElementById('display_lastname')
let email = document.getElementById('display_email')
let company = document.getElementById('display_company')
let telephone = document.getElementById('display_telephone')
let country  = document.getElementById('display_country')

// funzione per recuperare i dati dell'utente da firestore quando si logga
 function getData(){
    firebase.auth().onAuthStateChanged(function (user) {
    
        // Lay connection with the database.
        //var firestore = firebase.firestore();
        var db = firebase.firestore()

        var docRef = db.collection('users').doc(user.email);
    
        // Get the user data from the database.
        docRef.get()
        .then(function (doc) {
            // Catch error if exists. 
                //console.log(doc.data(user.email.Countries))

           firstname.value = doc.get('firstName')
           console.log(firstname)
           lastname.value = doc.get('lastName')
           email.value = doc.get('mail')
           company.value = doc.get('companyName')
           telephone.value = doc.get('phoneNumber')
           country.value = doc.get('Countries')
           console.log(company)
           
        });
    });
 }

 getData()

function updateUserInfo(){

        const userDocRef =  firebase.firestore().collection('users').doc(firebase.auth().currentUser.email)


        userDocRef.update({
            firstName:editProfile["display_name"].value,
            lastName:editProfile["display_lastname"].value,
            mail:editProfile["display_email"].value,
            companyName:editProfile["display_company"].value,
            phoneNumber:editProfile["display_telephone"].value,
            Countries:editProfile["display_country"].value
        })
        
            $("#updateSuccessAlert").fadeIn(3000);
        
}
//
let btnUpdate = document.getElementById('profile_Update')
btnUpdate.addEventListener('click', updateUserInfo)