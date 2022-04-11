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
// Recupera l'url della pagina visualizzata
// Effettua uno split dell'url recuperato dividendo la stringa tramite lo /
// recupera il nome della pagina
let pageURL = window.location.href
    pageURL = pageURL.split('\/')
let pageName = pageURL[pageURL.length-1]

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

// Recupera i nomi delle macchine installate dal cliente.
// vengono recuperate sia le celle che le linee.
tw.service_90_sidebar(entityName)
  .then(res => {
  try{
    // Controlla se sono presenti delle celle
    if(JSON.stringify(res.dryers) !== '[]'){
      // pagine
      let href_dashboard         = '30_dryers_general_dashboard.html'
      let href_history           = '31_dryers_history.html'
      // id
      let idAccordion            = '#id-accordion-dryers'
      let idBtnAccordion         = '#id-btn-accordion-dryers'
      let idCollapsePanel        = '#id-collapse-panel-dryers'
      // link
      let nav_dashboard_link     = '#id-nav-dashboard-dryer a'
      let nav_history_link       = '#id-nav-history-dryer a'

      // Visualizza il menu delle celle
      $(idAccordion).removeClass('d-none')
      // controlla che la pagina in visualizzazione sia una pagina delle celle (30_*, 31_*, 32_*)
      // se la pagina corrisponde, allora viene aperto il menù delle celle.
      if(pageName.includes('dryer')){
        $(idBtnAccordion).attr('aria-expanded', 'true')
        $(idBtnAccordion).removeClass('collapsed')
        $(idCollapsePanel).addClass('show')
      }

      // Controlla nello specifico quale pagina è in visualizzazione
      // se la pagina della dashboard o dello storico
      if(pageName == href_dashboard){ $(nav_dashboard_link).addClass('active') }
      if(pageName == href_history)  { $(nav_history_link).addClass('active') }

      // Visualizza le celle presenti dal cliente.
      // Nella sidebar sono presenti 16 celle, nascoste tramite la classe d-none
      // Modifica l'href da richiamare quando si preme il pulsante del menu
      // ref deve passare alla pagina 30_Dryer_Dashboard.html l'entityName della cella
      // In questo modo la pagina riesce a recuperare i dati dalla cella corretta
      for(let i=1; i<=res.dryers.length; i++){
        // genera il percorso da aprire quando viene premuto il pulsante relativo ad una cella
        // il percorso punta alla pagina 32_dryer_dashboard.html, con l'aggiunta del parametro entityName
        let href         = '32_dryer_dashboard.html?entityName=' + res.dryers[i-1].entityName
        let id_nav_dryer = '#id-nav-dryer-' + i
        let nav_link     = id_nav_dryer + ' a'
        let span_status  = id_nav_dryer + ' div a :last-child'

        // effettua modifiche agli elementi sottostanti
        $(span_status).text(res.dryers[i-1].status)
        $(id_nav_dryer).removeClass('d-none')
        $(nav_link).attr('href', href)

        // imposta il link come attivo se la pagina in visualizzazione corrisponde ad una cella
        if(pageName == href){ $(nav_link).addClass('active') }
      }
    }
  }catch(e){ console.error(e) }

  try{
    // Controlla se sono presenti delle celle
    if(JSON.stringify(res.lines) !== '[]'){
      // Visualizza le celle presenti dal cliente.
      // Nella sidebar sono presenti 16 celle, nascoste tramite la classe d-nome
      // Modifica l'href da richiamare quando si preme il pulsante del menu
      // ref deve passare alla pagina 30_Dryer_Dashboard.html l'entityName della cella
      // In questo modo la pagina riesce a recuperare i dati dalla cella corretta
      for(let i=1; i<=res.lines.length; i++){
        // pages
        let href_dashboard        = '40_line_dashboard.html?entityName=' + res.lines[i-1].entityName
        let href_history          = '41_line_history.html?entityName=' + res.lines[i-1].entityName
        let href_dough            = '45_line_dough.html?entityName=' + res.lines[i-1].entityName
        // id
        let idAccordion           = '#id-accordion-line-' + i
        let idBtnAccordion        = '#id-btn-accordion-line-' + i
        let idCollapsePanel       = '#id-collapse-panel-line-' + i
        let id_nav_dashboard_line = '#id-nav-dashboard-line-' + i
        let id_nav_history_line   = '#id-nav-history-line-' + i
        let id_nav_dough_line     = '#id-nav-dough-line-' + i
        // link
        let nav_dashboard_link    = id_nav_dashboard_line + ' a'
        let nav_history_link      = id_nav_history_line + ' a'
        let nav_dough_link        = id_nav_dough_line + ' a'
        let span_status           = id_nav_dashboard_line + 'div a :last-child'
        // Visualizza il menu delle celle
        $(idAccordion).removeClass('d-none')
        // controlla che la pagina in visualizzazione sia una pagina delle celle (30_*, 31_*, 32_*)
        // se la pagina corrisponde, allora viene aperto il menù delle celle.
        if(pageName.includes('line')){
          $(idBtnAccordion).attr('aria-expanded', 'true')
          $(idBtnAccordion).removeClass('collapsed')
          $(idCollapsePanel).addClass('show')
        }
        // Controlla nello specifico quale pagina è in visualizzazione
        // se la pagina della dashboard o dello storico
        if(pageName == href_dashboard){ $(nav_dashboard_link).addClass('active') }
        if(pageName == href_history){ $(nav_history_link).addClass('active') }
        if(pageName == href_dough){ $(nav_dough_link).addClass('active') }
        // effettua modifiche agli elementi sottostanti
        $(nav_dashboard_link).attr('href', href_dashboard)
        $(nav_history_link).attr('href', href_history)
        $(span_status).text(res.lines[i-1].status)

        $(nav_dough_link).attr('href', href_dough)
      }
    }
  }catch(e){ console.error(e) }

  $('body').removeClass('d-none')
})
  .catch(err => console.error(err))

refreshStatus(entityName)
// imposta il servizio refreshStatus in loop
setInterval(refreshStatus, 10000, entityName)
// il servizio recupera gli stati delle macchine installate.
// gli stati sono visualizzati nella sidebar a fianco di ogni nome.
function refreshStatus(entityName){
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
