/**
 *  @file Contiene la classe statica DataManager.
 *  @author Sovilla Matteo - KaleidosCode
 */
define ([
    'jquery',
    'underscore',
    'js/models/projectModel',
    'js/models/project'
], function ($, _, projectModel, project) {
    /** @namespace */
    var DataManager = {};
    /**
     *  @function DataManager.save
     *  @param {string} fileName - Nome del file generato da scaricare.
     *  @summary Salva i dati del progetto, li converte in formato JSON e avvia la procedura di download in locale del browser.
     */
    DataManager.save = function(fileName){
        projectModel.saveCurrentDiagram();
        var myProject = {};
        myProject.packages = project.packages;
        myProject.classes = project.classes;
        myProject.operations = project.operations;
        var file = JSON.stringify(myProject);
        //console.log(file);
        var myBlob = new Blob([file], {type: "application/octet-stream"});
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById("lnkDownload").href = event.target.result;
            document.getElementById("lnkDownload").download = fileName;
            document.getElementById("lnkDownload").click();
        };
        reader.readAsDataURL(myBlob);
    };
    /**
     *  @function DataManager.saveAs
     *  @summary Estrae la stringa inserita dall'utente nella schermata per il salvataggio con nome e invoca la il metodo per il salvataggio del progetto corrente in un file con il nome desiderato.
     */
    DataManager.saveAs = function() {
        var fName = document.getElementById("fileNameInput").value + ".swed";
        DataManager.save(fName);
    };
    /**
     *  @function DataManager.openProject
     *  @summary Legge un file JSON e ne salva il contenuto in project e nel projectModel come progetto attualmente aperto.
     */
    DataManager.openProject = function() {
        //console.log('DataManager.openProject');
        var myFile = document.getElementById("selectedFile").files[0];
        var myFileRead = {};
        var reader = new FileReader();
        reader.onload = function(event) {
            myFileRead = event.target.result;
            //console.log(myFileRead);
            var myProject = JSON.parse(myFileRead);
            //console.log(myProject);
            //console.log(myProject.packages);
            project.packages = myProject.packages;
            project.classes = myProject.classes;
            project.operations = myProject.operations;
            projectModel.currentDiagramType = 'packageDiagram';
            projectModel.currentDiagram = null;
            projectModel.graph.resetCells(project.packages.packagesArray.concat(project.packages.dependenciesArray));
            projectModel.graphSwitched();
            console.log('Project successfully loaded');
        };
        reader.readAsText(myFile);
    };
    /**
     *  @function DataManager.newProject
     *  @summary Dopo aver chiesto conferma all'utente, crea un nuovo progetto sovrascrivendo quello correntemente aperto.
     */
    DataManager.newProject = function() {
        if (confirm("Il nuovo progetto sovrascriverà quello attualmente aperto. Sei sicuro?") === true) {
            project.packages.packagesArray = [];
            project.packages.dependenciesArray = [];
            project.classes.classesArray= [];
            project.classes.relationshipsArray= [];
            project.operations= [];
            projectModel.graph.resetCells([]);
            projectModel.currentDiagramType = 'packageDiagram';
            projectModel.currentDiagram = null;
            projectModel.graphSwitched();
            console.log('New project created');
        } else {
            console.log('New project creation aborted');
        }
    };
    return DataManager;
});