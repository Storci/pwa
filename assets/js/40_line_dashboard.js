import * as tw from "./Global/Thingworx/thingworx_api_module.js"
import * as am from "./Global/amchart/amchart_functions.js"
import * as fb from "./Global/Firebase/firebase_auth_module.js"
import * as lang from "./Global/Common/Translation.js"

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
// Recupera l'entity name della thing
let entityName = urlParams.get('entityName')
// Recupera il nome del cliente
let selectedCustomer = localStorage.getItem("global_selected_customer")

// Recupera il nome dell'utente da firebase, controlla che sia loggato.
// Nel caso non fosse loggato richiama la pagina di login
fb.onAuthStateChanged_2()
// Recupera la lingua utilizzata dall'utente e sostituisce tutti i testi
lang.getLanguage()

// Definisce le variabili come date
let timeStart = new Date()
let timeEnd   = new Date()
// Imposta l'ora a mezzanotte del giorno attuale
timeStart.setHours(7,0,0,0)
// Imposta i timestamp un'ora prima e un'ora dopo
timeStart = Number(timeStart.getTime()) - 3600000
timeEnd   = Number(timeEnd.getTime()) + 3600000

// Istanzia i grafici dell'attuale e dello storico
// I grafici devono essere istanziati una volta solamente
// La funzione am.createXYChart ha i seguenti parametri di ingresso
// - ID del div che contiene il grafico
// - ID del div che contiene la legenda
// - ID per la colorazione delle series
// - Numero di assi Y associate al GRAFICO
// - Array con le unità di misura
let arrayUM = ['Produzione (kg/h)', 'Pressione Estrusore (Bar)']
let chartActualProduction = am.createXYChart("IDtrendProduction", 'IDLegendProduction', 0, 2, arrayUM)
// Crea le series da visualizzare nel grafico
am.createLineSeries(chartActualProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, true, false, true, 0.77)
am.createLineSeries(chartActualProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, false, false, 0.77)
am.createLineSeries(chartActualProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 1, false, false, false, 0.77)
// Ricalcola la dimensione del div della legenda - viene eseguito ogni secondo
setInterval(am.refreshLegendSize, 1000, chartActualProduction, 'IDLegendActualProduzione')
// Definisce la query da inviare a influxdb
let query  = 'SELECT '
query += 'mean("Impasto_PV_Impasto_Totale") as "PV_Impasto", '
query += 'mean("Impasto_SP_Impasto_Totale") as "SP_Impasto", '
query += 'mean("Pressa_Motori_Estrusore_PV_Pressione") as "PV_Pressione" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > ' + timeStart + 'ms and time < ' + timeEnd + 'ms GROUP BY time(10s) fill(previous)'
// Inserisce i dati nel grafico
am.setChartData(chartActualProduction, query)
// Funzioni cicliche
setInterval(am.setChartData, 600000, chartActualProduction, query);	// ogni 10 min


// ***** GRAFICO QUANTITA PRODUZIONE GIORNALIERA *****
timeStart = new Date()
// Imposta l'ora a mezzanotte del giorno attuale
timeStart.setHours(0,0,0,0)
// Imposta l'ora a mezzanotte del giorno attuale
timeStart.setDate(-30)
// Imposta i timestamp un'ora prima e un'ora dopo
timeStart = Number(timeStart.getTime())
// Instazia il grafico della linea
let chart = am.createXYChart("IDtrendProductQuantity", 'IDLegendProductQuantity', 0);
// Crea le series da visualizzare nel grafico
am.createColumnSeries(chart, "Quantità Impasto", "time", "productQuantity", "kg")
// Definisce la query da inviare a influxdb
query  = 'SELECT '
query += 'SUM("Impasto") as "productQuantity" '
query += 'FROM ( SELECT mean("Impasto_PV_Impasto_Totale") / 60 as "Impasto" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > ' + timeStart + 'ms and time < ' + timeEnd + 'ms GROUP BY time(1m) fill(0)) '
query += 'GROUP BY time(24h)'
// Inserisce i dati nel grafico
am.setChartData(chart, query, '')
// Funzioni cicliche
setInterval(am.setChartData, 600000, chart, query);	// ogni 10 min
// Ricalcola la dimensione del div della legenda - viene eseguito ogni secondo
setInterval(am.refreshLegendSize, 1000, chart, 'IDLegendProductQuantity')


setCardsValue(entityName)
// Funzioni cicliche
setInterval(setCardsValue, 10000, entityName);	// ogni 10 sec

// ***** LISTA ALLARMI ATTIVI *****
getAlertsActive('#IDListAlertsActive', entityName)

// Pulsanti per l'esportazione del grafico in png
$('#IDButtonExportTrendActualProduction').click(el => { am.getExport(chartActualProduction) })


// Funzione che recupera i dati da thingworx e li visualizza nelle card della pagina.
// Prerequisiti: le label che si vogliono popolare con i valori da thingworx devono avere
// la seguente classe '.thingworx-property-value'.
// Inoltre ogni label deve avere una key chiamata 'propertyname', il valore della key deve essere
// uguale al nome della property di thingworx che ritorna il servizio.
async function setCardsValue(entityName){
	// Dichiara la variabile
	let info
	// Richiama il servizio di thingworx.
	await tw.getLineInfo(entityName)
		.then(result => info = result)
		.catch(error => console.error(error))
	// Assegna alle varie label il valore corretto recuperato da thingworx
	$('[propertyname]').each(function(){
		$(this).text(info[$(this).attr('propertyname')])
	})
}

// Funzione che recupera tutti gli allarmi attivi della linea.
// Effettua una chiamata a tw per il recupero degli allarmi,
// poi inserisce gli allarmi all'interno di una lista.
async function getAlertsActive(idList, entityName){
	let list
	await tw.getLineAlertsActive(entityName)
		.then(result => list = result)
		.catch(error => console.error(error))

	list.rows.forEach((item, i) => {
		let date = new Date(item.TimeStart)
		let msg = item.Message
		let color = 'rgba(255,255,255,0)'

		if(item.Type == 'MSG') { color = '#fdd83566'	}
		else if(item.Type == 'WRN') { color = '#fb8c0066'	}
		else if(item.Type == 'ALM') { color = '#e5393566'	}

		let row  = '<li class="list-group-item d-flex flex-column" '
		    row += 'style="background: ' + color + '; border-width: 0px;border-color: rgba(33,37,41,0);'
				row += 'border-bottom-width: 0px;border-bottom-color: var(--bs-heading-medium-emphasis);border-radius: 4px;margin-top: 8px;margin-bottom: 8px;">'
				row += '<span style="color: var(--bs-heading-medium-emphasis); font-size:12px;">' + date + '</span>'
				row += '<span style="color: var(--bs-heading-medium-emphasis); font-size:14px;">' + msg + '</span></li>'

		$(idList).append(row)
	});
}

/*
// Funzione che recupera le macchine presenti nella linea
// Effettua una chiamata a tw per il recupero del nome delle macchine,
// poi inserisce le macchine all'interno di una lista.
async function getListMachine(idList, entityName){
	let list
	await tw.getCustomerLineMachine(entityName)
		.then(result => list = result)
		.catch(error => console.error(error))

	list.rows.forEach((item, i) => {
		// Genera l'id della card
		let id = "IDCardMachine" + item.ID;
		let msg = item.name

		let pageName
		let translate_id
		switch(item.name){
			case 'Impasto'					 : pageName = 'Dough'; 				   translate_id = 'dough'; break
			case "Stenditrice"			 : pageName = "Spreader"; 		   translate_id = 'spreader'; break
			case "Pasta Instant"		 : pageName = "Pasta-Instant";   translate_id = 'pasta-instant'; break
			case "Avanzamento Telai" : pageName = "Tray-Feeder";     translate_id = 'tray-feeder'; break
			case "Robot Deimpilatore": pageName = "Destacker Robot"; translate_id = 'destacker-robot'; break
			case "Omnidryer"				 : pageName = "Omnidryer";  	   translate_id = 'omnidryer'; break
			case "Pressa"						 : pageName = "Extruder";	  	   translate_id = 'extruder'; break
			case "Impilatore"			   : pageName = "tray-stacker";      translate_id = 'tray-stacker'; break
			case "Trabatto"				   : pageName = "Pre-Dryer"; 		   translate_id = 'pre-dryer'; break
		}

		let row  = '<li id=' + id + ' class="list-group-item hover_tr" '
		    row += 'style="background:rgba(255,255,255,0); border-width: 0px;border-color: rgba(33,37,41,0);'
				row += 'border-bottom-width: 1px;border-bottom-color: var(--bs-heading-medium-emphasis);border-radius: 0px;margin-top: 8px;margin-bottom: 8px;">'
				row += '<span style="color: var(--bs-heading-medium-emphasis); font-size:14px;" translate_id="' + translate_id + '">' + msg + '</span></li>'
		$(idList).append(row)

		// Aggiunge l'evento onclick sulla card.
		document.getElementById(id).onclick = function(){
			// Salva il nome della linea nella local storage
			localStorage.setItem('global_selected_line', "Linea." + (i + 1) );
			// Carica la pagina.
			console.log(baseURL + "/Customers/CustomerInfo/Lines/Machines/" + pageName + ".html")
			window.location.href = baseURL + "/Customers/CustomerInfo/Lines/Machines/" + pageName + ".html";
		}
	});
}
*/
