import * as tw from "../Global/Thingworx/thingworx_api_module.js"
import * as am from "../Global/amchart/amchart_functions.js"
import * as fb from "../Global/Firebase/firebase_auth_module.js"
import * as common from "../Global/Common/commonFunctions.js"

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

// Recupera l'entity name della thing
let entityName = urlParams.get('entityname')

let arrayUM = ['Produzione (kg/h)', 'Pressione Estrusore (Bar)']
let chartActualProduction = am.createXYChart("IDTrendActualProduction", 'IDLegendActualProduzione', 0, 2, arrayUM)
let chartHistoryProduction = am.createXYChart("IDTrendHistoryProduction", 'IDLegendHistoryProduction', 0, 2, arrayUM)

// Crea le series da visualizzare sul grafico
am.createLineSeries(chartActualProduction, "PV - Impasto", "time", "PV_Impasto", "kg/h", 0, false, true)
am.createLineSeries(chartActualProduction, "SP - Impasto", "time", "SP_Impasto", "kg/h", 0, false, true)
am.createLineSeries(chartActualProduction, "PV - Pressione", "time", "PV_Pressione", "Bar", 0, false, false, true)
am.createLineSeries(chartActualProduction, 'PV - Temperatura Cilindro', 'time', 'PV_Temp_Cilindro', '°C', 0, false, false)
am.createLineSeries(chartActualProduction, 'SP - Temperatura Cilindro', 'time', 'SP_Temp_Cilindro', '°C', 0, false, false)
am.createLineSeries(chartActualProduction, 'PV - Temperatura Testata', 'time', 'PV_Temp_Testata', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, 'PV - Temperatura Testata', 'time', 'SP_Temp_Testata', '°C', 0, false, true)
am.createLineSeries(chartActualProduction, "PV - kcal/h", "time", "PV_Consumi", "kcal/h", 1, false, true)


// Definisce la query da inviare a influxdb
// I parametri da sostituire sono indicati da {1}, {2}, ecc...
// Invece l'entityName è sempre comune per tutte le query
let query  = 'SELECT '
query += 'mean("Impasto_PV_Impasto_Totale") as "PV_Impasto", '
query += 'mean("Impasto_SP_Impasto_Totale") as "SP_Impasto", '
query += 'mean("Pressa_Motori_Estrusore_PV_Pressione") as "PV_Pressione", '
query += 'mean("Pressa_Termostatazione_Cilindro_PV_Temperatura") as "PV_Temp_Cilindro", '
query += 'mean("Pressa_Termostatazione_Cilindro_SP_Temperatura") as "SP_Temp_Cilindro", '
query += 'mean("Pressa_Termostatazione_Testata_PV_Temperatura") as "PV_Temp_Testata", '
query += 'mean("Pressa_Termostatazione_Testata_SP_Temperatura") as "SP_Temp_Testata", '
query += 'mean("Pressa_Motori_Estrusore_PV_Calorie") as "PV_Consumi" '
query += 'FROM "' + entityName + '" '
query += 'WHERE time > {1}ms and time < {2}ms GROUP BY time(1m) fill(previous)'

// ******************** GRAFICO PRODUZIONE ATTUALE ********************
common.actualLineProduction(chartActualProduction, query, entityName)