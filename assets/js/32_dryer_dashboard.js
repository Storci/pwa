// Carica le funzioni globali
import * as tw from "./Global/Thingworx/thingworx_api_module.js"
import * as am from "./Global/amchart/amchart_functions.js"
import * as fb from "./Global/Firebase/firebase_auth_module.js"
import * as lang from "./Global/Common/Translation.js"
import * as common from "./Global/Common/commonFunctions.js"

// definisce l'url di base della pagina attuale (in questo caso della pagina index.html).
// il risultato è http(s)://xxx.xxx.xxx.xxx:xxxx
// baseURL verrà utilizzato come base per il cambio pagina.
/*
let baseURL = window.location.protocol + "//" + window.location.host
let pageURL = window.location.href
*/
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const startQuery = window.location.search
const startUrlParams = new URLSearchParams(startQuery)
const endQuery = window.location.search
const endUrlParams = new URLSearchParams(endQuery)


// Recupera il nome dell'utente da firebase, controlla che sia loggato.
// Nel caso non fosse loggato richiama la pagina di login
//fb.onAuthStateChanged_2(baseURL, pageURL)
// Recupera dei dati dalle local storage
let selectedCustomer = localStorage.getItem("global_selected_customer")
let selectedLine 		 = localStorage.getItem("global_selected_cell")
//let entityName			 = localStorage.getItem('global_selected_cell_entityName')
// Recupera l'entity name della thing
let entityName = urlParams.get('entityName')
console.log(entityName)
// Imposta il nome del cliente nella breadcrumb
// Vengono sostituiti tutti gli underscore presenti nel nome
//$("#IDBreadcrumbCustomer").text(selectedCustomer.replace(/_/g, ' '));
// Recupera la lingua utilizzata dall'utente e sostituisce tutti i testi
// ATTENZIONE - Questa istruzione traduce solamente i testi statici e non
// i testi caricati dalle funzioni.

let timeStart = startUrlParams.get('timeStart')
console.log(timeStart)
let timeEnd = urlParams.get ('timeEnd')


lang.getLanguage()

// Istanzia i grafici dell'attuale e dello storico
// I grafici devono essere istanziati una volta solamente
// La funzione am.createXYChart ha i seguenti parametri di ingresso
// - ID del div che contiene il grafico
// - ID del div che contiene la legenda
// - ID per la colorazione delle series
// - Numero di assi Y associate al GRAFICO
// - Array con le unità di misura
let arrayUM = ['Essicazione', 'Calorie']
let chartActualProduction = am.createXYChart("IDTrendActualProduction", 'IDLegendActualProduzione', 0, 2, arrayUM)
let chartHistoryProduction = am.createXYChart("IDTrendHistoryProduction", 'IDLegendHistoryProduction', 0, 2, arrayUM)
// Crea le series da visualizzare sul grafico
am.createLineSeries(chartActualProduction, "PV - Temperature Ambient", "time", "PV_Temperatura_Ambiente", "°C", 0, false, true)
am.createLineSeries(chartActualProduction, "PV - Temperature", "time", "PV_Temperatura_Cella", "°C", 0, true, false, true)
am.createLineSeries(chartActualProduction, "SP - Temperature", "time", "SP_Temperatura_Cella", "°C", 0, false, false)
am.createLineSeries(chartActualProduction, 'PV - Humidity Ambient', 'time', 'PV_Umidita_Ambiente', '%H', 0, false, true)
am.createLineSeries(chartActualProduction, 'PV - Humidity', 'time', 'PV_Umidita_Cella', '%H', 0, true, false)
am.createLineSeries(chartActualProduction, 'SP - Humidity', 'time', 'SP_Umidita_Cella', '%H', 0, false, false)
am.createLineSeries(chartActualProduction, 'PV - kcal/h', 'time', 'PV_Consumo_Ciclo', 'kcal', 1, false, true)
// Crea le series da visualizzare sul grafico
am.createLineSeries(chartHistoryProduction, "PV - Temperature Ambient", "time", "PV_Temperatura_Ambiente", "°C", 0, false, true)
am.createLineSeries(chartHistoryProduction, "PV - Temperature", "time", "PV_Temperatura_Cella", "°C", 0, true, false, true)
am.createLineSeries(chartHistoryProduction, "SP - Temperature", "time", "SP_Temperatura_Cella", "°C", 0, false, false)
am.createLineSeries(chartHistoryProduction, 'PV - Humidity Ambient', 'time', 'PV_Umidita_Ambiente', '%H', 0, false, true)
am.createLineSeries(chartHistoryProduction, 'PV - Humidity', 'time', 'PV_Umidita_Cella', '%H', 0, true, false)
am.createLineSeries(chartHistoryProduction, 'SP - Humidity', 'time', 'SP_Umidita_Cella', '%H', 0, false, false)
am.createLineSeries(chartHistoryProduction, 'PV - kcal/h', 'time', 'PV_Consumo_Ciclo', 'kcal', 1, false, true)

// Ricalcola la dimensione del div della legenda - viene eseguito ogni secondo
setInterval(am.refreshLegendSize, 1000, chartActualProduction, 'IDLegendActualProduzione')
setInterval(am.refreshLegendSize, 1000, chartHistoryProduction, 'IDLegendHistoryProduction')

// Definisce la query da inviare a influxdb
// I parametri da sostituire sono indicati da {1}, {2}, ecc...
// Invece l'entityName è sempre comune per tutte le query
let query  = 'SELECT '
query += 'mean("Dati_Aggiuntivi_Temperatura_Ambiente") as "PV_Temperatura_Ambiente", '
query += 'mean("Dati_Ciclo_Temperatura_PV") as "PV_Temperatura_Cella", '
query += 'mean("Dati_Ciclo_Temperatura_SP") as "SP_Temperatura_Cella", '
query += 'mean("Dati_Aggiuntivi_Umidita_Ambiente") as "PV_Umidita_Ambiente", '
query += 'mean("Dati_Ciclo_Umidita_PV") as "PV_Umidita_Cella", '
query += 'mean("Dati_Ciclo_Umidita_SP") as "SP_Umidita_Cella", '
query += 'mean("Dati_Aggiuntivi_Kcal_Ciclo") as "PV_Consumo_Ciclo" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > {1}ms and time < {2}ms GROUP BY time(10s) fill(previous)'

// ******************** GRAFICO PRODUZIONE ATTUALE ********************
common.actualDryerProduction(chartActualProduction, query, entityName)

// ******************** STORICO PRODUZIONI ********************
common.historyDryerProduction(chartHistoryProduction, query, entityName)

// Imposta il valore dei campi di INFO CELLA
setCellinfo(entityName)
setInterval(setCellinfo, 30000, entityName)
setHistoryInfo(chartHistoryProduction)
setInterval(setHistoryInfo, 1000, chartHistoryProduction)

// Pulsanti per l'esportazione del grafico in png
$('#IDButtonExportTrendActualProduction').click(el => { am.getExport(chartActualProduction) })
$('#IDButtonExportTrendHistoryProduction').click(el => { am.getExport(chartHistoryProduction) })

// pulsante per aprire il grafico in un'altro tab
document.getElementById('fullscreen').addEventListener('click', () =>{
	let url = '61_actualCellGraph.html?entityName=' + entityName
	window.open(url, '_blank')
})
// pulsante per aprire il grafico storico delle celle in un'altro tab
document.getElementById('fullscreenHistory').addEventListener('click',()=>{
	//let url = '60_cellGrapHistory.html?timestart=timeStart&timeend=timeEnd&entityname=' + entityName
	let url ='60_cellGrapHistory.html?'+'entityName='+ entityName +'timeStart=' + timeStart + 'timeEnd=' + timeEnd
	window.open(url, '_blank')
})

// ******************** FUNCTION ********************
// Funzione che imposta i dati della cella nei rispettivi campi
function setCellinfo(entityName){
	$('.lds-dual-ring.info-cell').show()
	// Recupera le informazioni della cella
  tw.getCellInfo(entityName).then(dryer => {
		// Imposta i valori dei vari tile con i dati recuperati da thingworx
		$("#cell_number").text("Dryer " + dryer.numero_cella);
		$("#number_trolleys").text(dryer.numero_carrelli);
		$("#cell_status").text(dryer.stato_cella);
		$("#recipe").text(dryer.nome_ricetta);
		//$("#recipe").text(dryer.numero_ricetta + " - " + dryer.nome_ricetta);
		$("#total_time_recipe").text(dryer.tempo_ricetta_programmato);
		$("#phase_time_recipe").text(dryer.tempo_ricetta_trascorso);
		//$("#IDNumeroCarrelli").text(dryer.numero_carrelli);
		setTimeout(function() {	$('.lds-dual-ring.info-cell').hide() }, 1000);
	})
}

// Funzione che recupera i dati di ricetta dell'essicazione selezionata
// Viene calcolata la temperatura media, min e max
// Viene calcolata l'umidità media, min e max
function setHistoryInfo(chart){
	try{
		// Dichiara le variabili
		let temp = [];
		let umid = [];
		// Effettua un ciclo per ogni punto del grafico
		chart.data.forEach(el => {
			// Aggiungi i dati della temperatura al grafico, ignora i valori uguali a NaN
			el.PV_Temperatura_Ambiente = parseFloat(el.PV_Temperatura_Ambiente)
			if(!Number.isNaN(el.PV_Temperatura_Ambiente)){ temp.push(el.PV_Temperatura_Ambiente) }
			// Aggiungi i dati dell'umidità al grafico, ignora i valori uguali a NaN
			el.PV_Umidita_Ambiente = parseFloat(el.PV_Umidita_Ambiente)
			if(!Number.isNaN(el.PV_Umidita_Ambiente)){ umid.push(el.PV_Umidita_Ambiente) }
		})
		// Dichiara la funzione della media matematica e la associa alla variabile arrAvg
		let arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
		// Effettua la media sul valore di temperatura ambientale, recupera anche il valore minimo ed il valore massimo
		$("#IDTemperaturaMedia").text(arrAvg(temp).toFixed(2) + " °C")
		$("#IDTemperaturaMediaMax").text("Max: " + Math.max(...temp) + " °C")
		$("#IDTemperaturaMediaMin").text("Min: " + Math.min(...temp) + " °C")
		// Effettua la media sul valore di umidità ambientale, recupera anche il valore minimo ed il valore massimo
		$("#IDUmiditaMedia").text(arrAvg(umid).toFixed(2) + " %H")
		$("#IDUmiditaMediaMax").text("Max: " + Math.max(...umid) + " %H")
		$("#IDUmiditaMediaMin").text("Min: " + Math.min(...umid) + " %H")
		// Recupera le kcal consumate per il ciclo di essiccazione selezionato dalla lista dello storico
		try{ $("#IDCalorieTotali").text(chart.data[chart.data.length-1].PV_Consumo_Ciclo + " kcal") }catch(e){}
		// Recupera i dati di ricetta
		tw.getCellHistoryRecipe(entityName, chart.data[0].time, chart.data[chart.data.length-1].time).then(recipe => {
			// Svuota la tabella della ricetta
			$('#IDHistoryTableRecipeBody').empty();
			// Per ogni dato recuperato viene generata una riga nella tabella
			recipe.rows.forEach(el => {
				// Definisce l'html della riga da aggiungere
				let row = '<tr class="hover_tr" style="border-style: none;background: var(--bs-table-bg);">'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.Fase  + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.tempo_fase    + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.delta_T + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.temperatura  + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.umidita  + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.hz_inverter  + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.tempo_ventilazione  + '</td>'
				row    += '    <td style="font-size: 12px;border-style: none;">' + el.tempo_pausa  + '</td>'
				row    += '</tr>'
				// Aggiunge la riga alla tabella
				$('#IDHistoryTableRecipeBody').append(row);
			})
		})
	}catch(e){}
}
