// Carica le funzioni globali
import * as tw from "./Global/Thingworx/thingworx_api_module.js"
import * as fb from "./Global/Firebase/firebase_auth_module.js"

// recupera il nome dell'entity (selezionata, se utente storci)
// il nome dell'entity permette di recuperare le macchine presenti
// per un determinato cliente e visualizzarle nella sidebar.
let entityName = localStorage.getItem('global_entityName')
let customer = localStorage.getItem('global_selected_customer')
customer = customer.replace(/_/g, ' ')
$('#id-customer-name').text(customer)
if(localStorage.getItem('global_customer').includes("Storci")){
  $('#id-nav-customers-list').removeClass('d-none')
}


// recupera il nome dell'utente loggato.
// il nome viene visualizzato nella sidebar.
// se l'utente è loggato, viene nascosto il tasto di login
fb.onAuthStateChanged()
  .then(user => {
    $('#id-username').text(user.email)
    $('#id-user-login').addClass('d-none')
  })
  .catch(error => {})
// controlla quando viene premuto il tasto di logout
// alla pressione del tasto, l'utente viene reindirizzato alla pagina di login
$('#id-user-logout').click(() => { fb.signOut() })

createSidebar()

window.addEventListener("storage", event => {
  if(event.key == "global_entityName"){
    createSidebar()
  }
})

refreshStatus()
// imposta il servizio refreshStatus in loop
setInterval(refreshStatus, 10000)
// il servizio recupera gli stati delle macchine installate.
// gli stati sono visualizzati nella sidebar a fianco di ogni nome.
function refreshStatus(){
  let entityName = localStorage.getItem('global_entityName')
  // Recupera i dati generali delle celle installate dal cliente
  tw.service_90_sidebar(entityName)
  .then(res => {
    // Controlla se sono presenti delle celle
    if(JSON.stringify(res.dryers) !== '[]'){
      for(let i=1; i<=res.dryers.length; i++){
        let span_status = '#id-nav-dryer-' + i + ' a > span:last-child'
        $(span_status).text(res.dryers[i-1].status)
      }
    }

    if(JSON.stringify(res.lines) !== '[]'){
      for(let i=1; i<=res.lines.length; i++){
        let span_status = '#id-nav-dashboard-line-' + i + ' a > span:last-child'
        $(span_status).text(res.lines[i-1].status)
      }
    }
  })
  .catch(err => console.error(err))
}
