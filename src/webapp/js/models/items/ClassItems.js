/*define ([
    'jquery',
    'underscore',
    'backbone',
    'joint'
], function ($, _, Backbone, joint) {


Swedesigner={};
Swedesigner.model={};
Swedesigner.model.classDiagram={};
*/

Swedesigner.model.classDiagram.items={};

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Base
 *  @classdesc Elemento base generico per diagramma delle classi UML.
 *  @extends {joint.shapes.basic.Generic}
 */
Swedesigner.model.classDiagram.items.Base=joint.shapes.basic.Generic.extend({
    /**
     *  @var {string} Base#markup Markup HTML per la rappresentazione grafica.
     */
    toolMarkup: [
        '<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove</title>',
        '</g>',
        '</g>'
    ].join(''),
    /**
     *  @var {Object} Base#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'uml.Base'
    }, joint.shapes.basic.Generic.prototype.defaults),
    /**
     *  @function Base#initialize
     *  @summary Metodo di inizializzazione: imposta evento al verificarsi del cambio dei valori e chiama il metodo per la renderizzazione dell'item.
     */
    initialize: function() {
        this.on('change:values', function() {
            this.updateRectangles();
            this.trigger('uml-update');
        }, this);
        this.updateRectangles();
        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },
    /**
     *  @function Base#getValues
     *  @summary Ritorna i valori dell'item (nome, attributi, metodi, ...).
     *  @return {Object} I valori dell'item.
     */
    getValues: function() {
        return this.get('values');
    },
    /**
     *  @function Base#updateRectangles
     *  @summary Render dell'item.
     *  @abstract
     */
    updateRectangles: function() {},
    /**
     *  @function Base#setToValue
     *  @summary Imposta "values.<path>" a "<value>".
     *  @param {Object} value - valore da assegnare.
     *  @param {string} path - percorso al membro.
     */
    setToValue: function(value, path) {
        obj=this.getValues();
        path=path.split('.');
        for (i=0; i<path.length-1; i++) {
            obj=obj[path[i]];
        }
        obj[path[i]]=value;
        this.updateRectangles();
        this.trigger("uml-update");
    },
    /**
     *  @function Base#executeMethod
     *  @summary Esegue il metodo avente il nome passato in input.
     *  @param {function} met - metodo da essere eseguito.
     */
    executeMethod: function(met) {
        return this[met] && this[met].apply(this, [].slice.call(arguments, 1));
    }
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class BaseView
 *  @classdesc View per oggetto "Base".
 *  @extends {joint.dia.ElementView}
 */
Swedesigner.model.classDiagram.items.BaseView=joint.dia.ElementView.extend({
    /**
     *  @function BaseView#initialize
     *  @summary Metodo di inizializzazione: chiama il metodo "initialize" della classe base e imposta un evento alla reazione del model chiamando sequenzialmente i metodi "update" e "resize".
     */
    initialize: function () {
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'uml-update', function() {
            this.update();
            this.resize();
        });
    },
    // FORSE DA ELIMINARE events
    /*
     *  @var {Object} BaseView#events Gli eventi della view collegati ai rispettivi callback.
     */
    /*events: {
        'mousedown .togglemethods': 'toggleMethods',
        'mousedown .toggleattributes': 'toggleAttributes'
    },*/
    /**
     *  @function BaseView#render
     *  @summary Renderizzazione dell'item.
     *  @return {Object} L'oggetto BaseView.
     */
    render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.renderTools();
        this.update();
        return this;
    },
    /**
     *  @function BaseView#renderTools
     *  @summary Assistenza al metodo "render" per la renderizzazione dell'item.
     *  @return {Object} L'oggetto BaseView.
     */
    renderTools: function() {
        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
        //console.log("markup:", toolMarkup);
        if (toolMarkup) {
            var nodes = joint.V(toolMarkup);
            //console.log("el:", joint.V(this.el));
            joint.V(this.el).append(nodes);
        }
        return this;
    },
    // INIZIO ---- FORSE DA ELIMINARE 
    /*pointerclick: function (evt, x, y) {
        this._dx = x;
        this._dy = y;
        this._action = '';
        var className = evt.target.parentNode.getAttribute('class');
        switch (className) {
            case 'element-tool-remove':
            this.model.remove();
            return;
            break;
            default:
        }
        joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
    },*/
    /*
     * Toggles the display of the class attributes.
     * @name ClassDiagramElementView#toggleattributes
     * @function
     */
    /*toggleAttributes: function () {
    },*/ // tolta perché buggata
    /*
     * Toggles the display of the class methods.
     * @name ClassDiagramElementView#togglemethods
     * @function
     */
    /*toggleMethods: function () {
    }*/ // tolta perché buggata
    // FINE ---- FORSE DA ELIMINARE
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Base
 *  @classdesc Elemento base generico per diagramma delle classi UML.
 *  @extends {joint.shapes.basic.Generic}
 */
Swedesigner.model.classDiagram.items.Class=Swedesigner.model.classDiagram.items.Base.extend({
    /**
     *  @function Class#initialize
     *  @summary Metodo di inizializzazione: chiama il metodo "initialize" della classe base.
     */
    initialize: function() {
        Swedesigner.model.classDiagram.items.Base.prototype.initialize.apply(this, arguments);
    },
    /**
     *  @var {string} Class#markup Markup HTML per la rappresentazione grafica.
     */
    markup: [
        '<g class="rotatable">',
        '<g>',
        '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect toggleattributes"/><rect class="uml-class-divider-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
        '</g>',
        '<text class="uml-class-name-text"/><text class="uml-class-attrs-text toggleattributes"/><text class="uml-class-methods-text togglemethods"/>',
        '</g>'
    ].join(''),
    /**
     *  @var {Object} Class#defaults Attributi di default per l'oggetto Class (tipo, posizione, dimensione, attributi CSS, stato e contenuto dell'oggetto).
     */
    defaults: _.defaultsDeep({
        type: 'class.Class',
        position: {x: 200, y: 200},
        size: {width: 100, height: 100},
        attrs: {
            rect: {'width': 200},
            '.uml-class-name-rect': {
                'stroke': '#b38f21',
                'stroke-width': 1,
                'fill': '#ffdf7e'
            },
            '.uml-class-attrs-rect': {
                'stroke': '#b38f21',
                'stroke-width': 1,
                'fill': '#ffdf7e',
                'expanded': 'true'
            },
            '.uml-class-methods-rect': {
                'stroke': '#b38f21',
                'stroke-width': 1,
                'fill': '#ffdf7e',
                'expanded': 'true'
            },
            '.uml-class-divider-rect': {
                'stroke': 'black',
                'stroke-width': 1,
                'fill': 'black'
            },
            '.uml-class-name-text': {
                'ref': '.uml-class-name-rect',
                'ref-y': .44,
                'ref-x': .5,
                'text-anchor': 'middle',
                'y-alignment': 'middle',
                'fill': '#222222',
                'font-size': 14,
                'font-family': 'Roboto'
            },
            '.uml-class-attrs-text': {
                'ref': '.uml-class-attrs-rect',
                'ref-y': 2,
                'ref-x': 5,
                'fill': '#222222',
                'font-size': 12,
                'font-family': 'monospace'
            },
            '.uml-class-methods-text': {
                'ref': '.uml-class-methods-rect',
                'ref-y': 2,
                'ref-x': 5,
                'fill': '#222222',
                'font-size': 12,
                'font-family': 'monospace'
            }
        },
        attributesExpanded: true,
        methodsExpanded: true,
        values: {
        	package: "",
        	dependencies: [],
            name: "NomeClasse",
            abstract: "false",
            static: "false",
            final: "false",
            frozen: "false",
            readOnly: "false",
            enum: "false",
            generic: "false",
            attributes: [],
            methods: []
        }
    }, Swedesigner.model.classDiagram.items.Base.prototype.defaults),
    /**
     *  @function Class#updateRectangles
     *  @summary Render della classe.
     */
    updateRectangles: function() {
        var attrs=this.get('attrs');
        var offsetY=0;
        rects = [
            {
                type: 'name',
                text: this.getValues().name
            },
            {
                type: 'attrs',
                text: this.get('attributesExpanded') ? this.getValues().attributes : "Attributi (premi per espandere)"
            },
            {
                type: 'methods',
                text: this.get('methodsExpanded') ? this.getValues().methods : "Metodi (premi per espandere)"
            }
        ];
        var rectWidth=this.getWidth();
        var rectHeight=1*15+1;
        attrs['.uml-class-name-text'].text=rects[0].text;
        attrs['.uml-class-name-rect'].height=rectHeight;
        attrs['.uml-class-name-rect'].width=rectWidth;
        attrs['.uml-class-name-rect'].transform='translate(0,'+offsetY+')';
        if (this.getValues().abstract=="true") {
            attrs['.uml-class-name-text']['font-style']="italic";
        } else {
            attrs['.uml-class-name-text']['font-style']="normal";
        }
        offsetY+=rectHeight;
        //rectHeight = _.isArray(rects[1].text) ? rects[1].text.length*15+1 : 1*15+1;
        if (_.isArray(rects[1].text)) {
            if (rects[1].text.length>0) {
                rectHeight=rects[1].text.length*15+1;
            } else {
                rectHeight=1*15+1;
            }
        } else {
            rectHeight=1*15+1;
        }
        attrs['.uml-class-attrs-text'].text=_.isArray(rects[1].text) ? rects[1].text.map(function(e) {
            let vis="";
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            return vis+" "+e.name+":"+e.type;
        }).join('\n') : rects[1].text;
        attrs['.uml-class-attrs-rect'].height=rectHeight;
        attrs['.uml-class-attrs-rect'].width=rectWidth;
        attrs['.uml-class-attrs-rect'].transform='translate(0,'+offsetY+')';
        offsetY+=rectHeight;
        //rectHeight = _.isArray(rects[2].text) ? rects[2].text.length*15+1 : 1*15+1;
        if (_.isArray(rects[2].text)) {
            if (rects[2].text.length>0) {
                rectHeight=rects[2].text.length*15+1;
            } else {
                rectHeight=1*15+1;
            }
        } else {
            rectHeight=1*15+1;
        }
        attrs['.uml-class-methods-text'].text=_.isArray(rects[2].text) ? rects[2].text.map(function(e) {
            let vis="";
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            let params=e.parameters.map(function(f) {
                return f.name+":"+f.type;
            }).join(",");
            return vis+" "+e.name+"("+params+")"+":"+e.returnType;
        }).join('\n') : rects[2].text;
        attrs['.uml-class-methods-rect'].height=rectHeight;
        attrs['.uml-class-methods-rect'].width=rectWidth;
        attrs['.uml-class-methods-rect'].transform='translate(0,'+offsetY+')';
        Swedesigner.model.classDiagram.items.Base.prototype.updateRectangles.apply(this, arguments);
    },
    /**
     *  @function Class#addMethod
     *  @summary Aggiunge un nuovo metodo alla classe.
     */
    addMethod: function() {
        this.getValues().methods.push({
            name: "",
            visibility: "private",
            id: joint.util.uuid(),
            returnType: "",
            //static: "false",  /** @todo */
            //abstract: "false",
            parameters: []
        });
    },
    /**
     *  @function Class#addAttribute
     *  @summary Aggiunge un nuovo attributo alla classe.
     */
    addAttribute: function() {
            this.getValues().attributes.push({
                name: "",
                type: "",
                defaultValue: "",
                visibility: "private"//,    /** @todo */
                //static: "false"
            });
        },
    /**
     *  @function Class#addParameter
     *  @param {Number} ind - indice del metodo.
     *  @summary Aggiunge un parametro al metodo passato in input.
     */
    addParameter: function(ind) {
        this.getValues().methods[ind].parameters.push({
            name: "",
            type: "",
            direction: "in",
            defaultValue: ""
        });
    },
    /**
     *  @function Class#deleteParameter
     *  @param {Number} ind - indice del metodo.
     *  @summary Rimuove un parametro dal metodo passato in input.
     */
    deleteParameter: function(met) {
        this.getValues().methods[met[0]].parameters.splice(met[1], 1);
        this.updateRectangles();
        this.trigger("uml-update");
    },
    /**
     *  @function Class#deleteAttribute
     *  @param {Number} ind - indice dell'attributo.
     *  @summary Rimuove un attributo dalla classe.
     */
    deleteAttribute: function(ind) {
        this.getValues().attributes.splice(ind, 1);
        this.updateRectangles();
        this.trigger("uml-update");
    },
    /**
     *  @function Class#deleteMethod
     *  @param {Number} ind - indice del metodo.
     *  @summary Rimuove un metodo dalla classe.
     */
    deleteMethod: function(ind) {
        this.getValues().methods.splice(ind, 1);
        this.updateRectangles();
        this.trigger("uml-update");
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Class#getAttrsDesc
     *  @returns {Object[]} Attributi della classe.
     *  @summary Ritorna la lista di attributi della classe.
     */
    getAttrsDesc: function() {
        let attrDesc=this.getValues().attributes.map(function(e) {
            let vis="";
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            return {'text': vis+e.name+":"+e.type, 'icon': 'assets/attributeicon.png'};
        });
        return attrDesc;
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Class#getMetDesc
     *  @returns {Object[]} Metodi della classe.
     *  @summary Ritorna la lista di metodi della classe.
     */
    getMetDesc: function() {
        let metDesc=this.getValues().methods.map(function(e) {
            let vis="";
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            let params = e.parameters.map(function(f) {
                return f.name+":"+f.type;
            }).join(",");
            return {
                'text': vis+" "+e.name+"("+params+")"+":"+e.returnType,
                'icon': 'assets/methodicon.png'
            };
        });
        return metDesc;
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Class#getItemDesc
     *  @returns {Object} Classe.
     *  @summary Ritorna le informazioni della classe.
     */
    getItemDesc: function() {
        return {
            'text': this.getValues().name,
            'icon': 'assets/classicon.png',
            'children': this.getAttrsDesc().concat(this.getMetDesc())
        }
    },
    /**
     *  @function Class#getWidth
     *  @returns {Number} Larghezza dell'oggetto grafico.
     *  @summary Ritorna la larghezza dell'oggetto grafico.
     */
    getWidth: function() {
        let longest=rects[0].text.length;
        let tmp=this.getAttrsDesc();
        for (i=0; i<tmp.length; i++) {
            if (tmp[i].text.length>longest) {
                longest=tmp[i].text.length;
            }
        }
        //console.log(longest);
        tmp=this.getMetDesc();
        for (i=0; i<tmp.length; i++) {
            if (tmp[i].text.length>longest) {
                longest=tmp[i].text.length;
            }
        }
        return longest*5+180;
    }
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Interface
 *  @classdesc Interfaccia UML.
 *  @extends {Swedesigner.model.classDiagram.items.Class}
 */
Swedesigner.model.classDiagram.items.Interface=Swedesigner.model.classDiagram.items.Base.extend({
    /**
     *  @var {string} Interface#markup Markup HTML per la rappresentazione grafica.
     */
    markup: [
        '<g class="rotatable">',
        '<g class="">',
        '<rect class="uml-class-name-rect"/><rect class="uml-class-methods-rect togglemethods"/>',
        '</g>',
        '<text class="uml-class-name-text"/><text class="uml-class-methods-text togglemethods"/>',
        '</g>'
    ].join(''),
    /**
     *  @var {Object} Interface#defaults Attributi di default per l'oggetto (tipo, posizione, dimensione, attributi CSS, stato e contenuto dell'oggetto).
     */
    defaults: _.defaultsDeep({
        type: 'class.Interface',
        position: {x: 200, y: 200},
        size: {width: 100, height: 100},
        attrs: {
            rect: {'width': 200},
            '.uml-class-name-rect': {
                'stroke': '#b38f21',
                'stroke-width': 1,
                'fill': '#ffdf7e'
            },
            '.uml-class-methods-rect': {
                'stroke': '#b38f21',
                'stroke-width': 1,
                'fill': '#ffdf7e',
                'expanded': 'true'
            },
            '.uml-class-name-text': {
                'ref': '.uml-class-name-rect',
                'ref-y': .5,
                'ref-x': .5,
                'text-anchor': 'middle',
                'y-alignment': 'middle',
                'fill': '#222222',
                'font-size': 14,
                'font-family': 'Roboto'
            },
            '.uml-class-methods-text': {
                'ref': '.uml-class-methods-rect',
                'ref-y': 5,
                'ref-x': 5,
                'fill': '#222222',
                'font-size': 12,
                'font-family': 'monospace'
            }
        },
        methodsExpanded: true,
        values: {
            name: "NomeInterfaccia",
            methods: []
        }
    }, Swedesigner.model.classDiagram.items.Base.prototype.defaults),
    /**
     *  @function Interface#initialize
     *  @summary Metodo di inizializzazione.
     */
    initialise: function() {
        Swedesigner.model.classDiagram.items.Base.prototype.initialise.apply(this, arguments);
    },
    /**
     *  @function Interface#updateRectangles
     *  @summary Aggiorna la rappresentazione grafica dell'oggetto.
     */
    updateRectangles: function() {
        var attrs=this.get('attrs');
        var offsetY=0;
        rects = [
            {type: 'name', text: this.getValues().name},
            {
                type: 'methods',
                text: this.get('methodsExpanded') ? this.getValues().methods : "Metodi (premi per espandere)"
            }
        ];
        var rectWidth=this.getWidth();
        var rectHeight=2*15+1;
        attrs['.uml-class-name-text'].text=["<<interfaccia>>", rects[0].text].join('\n');
        attrs['.uml-class-name-rect'].height=rectHeight;
        attrs['.uml-class-name-rect'].width=rectWidth;
        attrs['.uml-class-name-rect'].transform='translate(0,'+offsetY+')';
        offsetY+=rectHeight;
        //rectHeight=_.isArray(rects[1].text) ? rects[1].text.length*15+1 : 1*15+1;
        if (_.isArray(rects[1].text)) {
            if (rects[1].text.length>0) {
                rectHeight=rects[1].text.length*15+1;
            } else {
                rectHeight=1*15+1;
            }
        } else {
            rectHeight=1*15+1;
        }
        attrs['.uml-class-methods-text'].text=_.isArray(rects[1].text) ? rects[1].text.map(function(e) {
            var vis='';
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            var params=e.parameters.map(function(f) {
                return f.name+":"+f.type;
            }).join(',');
            return vis+" "+e.name+"("+params+")"+":"+e.returnType;
        }).join('\n'):rects[1].text;
        attrs['.uml-class-methods-rect'].height=rectHeight;
        attrs['.uml-class-methods-rect'].width=rectWidth;
        attrs['.uml-class-methods-rect'].transform='translate(0,'+offsetY+')';
        Swedesigner.model.classDiagram.items.Base.prototype.updateRectangles.apply(this, arguments);
    },
    /**
     *  @function Interface#addMethod
     *  @summary Aggiunge un metodo all'oggetto.
     */
    addMethod: function() {
        this.getValues().methods.push({
            name: "",
            visibility: "private",
            id: joint.util.uuid(),
            static: "false",
            abstract: "false",
            returnType: "",
            parameters: []
        });
    },
    /**
     *  @function Interface#addParameter
     *  @param {Number} ind - indice del metodo.
     *  @summary Aggiunge un parametro al metodo dell'oggetto indicato.
     */
    addParameter: function(ind) {
        this.getValues().methods[ind].parameters.push({
            name: "",
            type: "",
            defaultValue: ""
        });
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Interface#deleteParameter
     *  @param {Number} met - indice del metodo.
     *  @summary Rimuove il primo parametro dal metodo dell'oggetto indicato.
     */
    deleteParameter: function(met) {
        this.getValues().methods[met[0]].parameters.splice(met[1], 1);
    },
    /**
     *  @function Interface#deleteMethod
     *  @param {Number} met - indice del metodo.
     *  @summary Rimuove il metodo indicato dall'oggetto.
     */
    deleteMethod: function(ind) {
        this.getValues().methods.splice(ind, 1);
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Interface#getMetDesc
     *  @returns {Object[]} Metodi della classe.
     *  @summary Ritorna la lista dei metodi dell'interfaccia.
     */
    getMetDesc: function() {
        let methodDesc=this.getValues().methods.map(function(e) {
            let vis="";
            switch (e.visibility) {
                case "public":
                    vis="+";
                    break;
                case "private":
                    vis="-";
                    break;
                case "protected":
                    vis="#";
                    break;
            }
            let params=e.parameters.map(function(f) {
                return f.name+":"+f.type;
            }).join(',');
            return {
                'text': vis+" "+e.name+"("+params+")"+":"+e.returnType,
                'icon': 'assets/methodicon.png'
            };
        });
        return methodDesc;
    },
    // FORSE DA CAMBIARE /** @todo */
    /**
     *  @function Interface#getItemDesc
     *  @returns {Object} Interfaccia.
     *  @summary Ritorna le informazioni dell'interfaccia.
     */
    getItemDesc: function() {
        return {
            'text': this.getValues().name,
            'icon': 'assets/interfaceicon.png',
            'children': this.getMethodDesc()
        }
    },
    /**
     *  @function Interface#getWidth
     *  @returns {Number} Larghezza dell'oggetto grafico.
     *  @summary Ritorna la larghezza dell'oggetto grafico.
     */
    getWidth: function() {
        let longest=rects[0].text.length;
        //console.log(longest);
        let tmp=this.getMetDesc();
        for (i=0; i<tmp.length; i++) {
            if (tmp[i].text.length>longest) {
                longest=tmp[i].text.length;
            }
        }
        return longest*5+180;
    }
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class ClassDiagramLink
 *  @classdesc Collegamento tra due componenti di un diagramma delle classi UML.
 *  @extends {joint.dia.Link}
 */
Swedesigner.model.classDiagram.items.ClassDiagramLink=joint.dia.Link.extend({
    /**
     *  @var {Object} ClassDiagramLink#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.ClassDiagramLink',
        source: {x: 30, y: 30},
        target: {x: 150, y: 120}
    }, joint.dia.Link.prototype.defaults),
    /**
     *  @function ClassDiagramLink#initialize
     *  @summary Metodo di inizializzazione.
     */
    initialize: function() {
        joint.dia.Link.prototype.initialize.apply(this, arguments);
    },
    /**
     *  @function ClassDiagramLink#getValues
     *  @summary Ritorna i valori del collegamento.
     *  @return {Object} I valori del collegamento.
     */
    getValues: function() {
        return this.get("values");
    },
    /**
     *  @function ClassDiagramLink#setToValue
     *  @summary Imposta "values.<path>" a "<value>".
     *  @param {Object} value - valore da assegnare.
     *  @param {string} path - percorso al membro.
     */
    setToValue: function(value, path) {
        obj=this.getValues();
        path=path.split('.');
        for (i=0; i<path.length-1; i++) {
            obj=obj[path[i]];
        }
        obj[path[i]]=value;
        this.updateRectangles();
        this.trigger("uml-update");
    }
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Generalization
 *  @classdesc Generalizzazione tra due componenti UML.
 *  @extends {Swedesigner.model.classDiagram.items.ClassDiagramLink}
 */
Swedesigner.model.classDiagram.items.Generalization=Swedesigner.model.classDiagram.items.ClassDiagramLink.extend({
    /**
     *  @var {Object} Generalization#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.Generalization',
        attrs: {'.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'}}
    }, Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.defaults)
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Implementation
 *  @classdesc Implementazione tra due componenti UML.
 *  @extends {Swedesigner.model.classDiagram.items.ClassDiagramLink}
 */
Swedesigner.model.classDiagram.items.Implementation=Swedesigner.model.classDiagram.items.ClassDiagramLink.extend({
    /**
     *  @var {Object} Implementation#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.Implementation',
        attrs: {
            '.marker-target': {d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white'},
            '.connection': {'stroke-dasharray': '3,3'}
        }
    }, Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.defaults)
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Aggregation
 *  @classdesc Aggregazione tra due componenti UML.
 *  @extends {Swedesigner.model.classDiagram.items.ClassDiagramLink}
 */
Swedesigner.model.classDiagram.items.Aggregation=Swedesigner.model.classDiagram.items.ClassDiagramLink.extend({
    /**
     *  @var {Object} Aggregation#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.Aggregation',
        attrs: {'.marker-target': {d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'white'}}
    }, Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.defaults)
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Composition
 *  @classdesc Composizione tra due componenti UML.
 *  @extends {Swedesigner.model.classDiagram.items.ClassDiagramLink}
 */
Swedesigner.model.classDiagram.items.Composition=Swedesigner.model.classDiagram.items.ClassDiagramLink.extend({
    /**
     *  @var {Object} Composition#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.Composition',
        attrs: {'.marker-target': {d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black'}}
    }, Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.defaults)
});

/**
 *  @module Swedesigner.model.classDiagram.items
 *  @class Association
 *  @classdesc Associazione tra due componenti UML.
 *  @extends {Swedesigner.model.classDiagram.items.ClassDiagramLink}
 */
Swedesigner.model.classDiagram.items.Association=Swedesigner.model.classDiagram.items.ClassDiagramLink.extend({
    /**
     *  @var {Object} Association#defaults Attributi di default per l'oggetto.
     */
    defaults: _.defaultsDeep({
        type: 'class.Association',
        attrs: {
            '.marker-target': {
                d: 'M 50 10 L 60 3 M 50 10 L 60 16',
                fill: 'white',
                'fill-opacity': '0.4',
                stroke: 'black'
            },
            /*'.marker-target':{d: 'M 35 0 L 20 10 L 35 20',fill:'white','fill-opacity':'0.4',stroke:'black'},*/
            '.connection': {'stroke-dasharray': '3,3'}
        },
        labels: [
            {
                position: 0.5,
                attrs: {
                    text: {
                        text: ''
                    }
                }
            }
        ],
        values: {
            card: "1",
            attribute: ""
        }
    }, Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.defaults),
    /**
     *  @function Association#updatelabel
     *  @summary Aggiornamento della label.
     */
    updatelabel: function() {
        this.label(0, {
            attrs: {
                text: {
                    text: this.getcard()+" "+this.getAttribute()
                }
            }
        });
    },
    /**
     *  @function Association#getcard
     *  @returns {Number} Cardinalità della label.
     *  @summary Ritorna la cardinalità della label.
     */
    getcard: function() {
        return this.get('values').card;
    },
    /**
     *  @function Association#getAttribute
     *  @returns {string} Attributo della label.
     *  @summary Ritorna l'attributo della label.
     */
    getAttribute: function() {
        return this.get('values').attribute;
    },
    /**
     *  @function Association#initialize
     *  @summary Metodo di inizializzazione.
     */
    initialize: function() {
        this.updatelabel();
        Swedesigner.model.classDiagram.items.ClassDiagramLink.prototype.initialize.apply(this, arguments);
    },
    /**
     *  @function Association#setToValue
     *  @summary Imposta "values.<path>" a "<value>".
     *  @param {Object} value - valore da assegnare.
     *  @param {string} path - percorso al membro.
     */
    setToValue: function(value, path) {
        obj=this.getValues();
        path=path.split('.');
        for (i=0; i<path.length-1; i++) {
            obj=obj[path[i]];
        }
        obj[path[i]]=value;
        this.updatelabel();
    }
});

/*
});
*/