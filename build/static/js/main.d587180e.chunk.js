(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{107:function(e,t,n){},109:function(e,t,n){},111:function(e,t,n){},113:function(e,t,n){},115:function(e,t,n){},117:function(e,t,n){},121:function(e,t,n){},124:function(e,t,n){},126:function(e,t,n){},158:function(e,t){},179:function(e,t,n){},181:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(20),c=n.n(r),o=n(8),i=n(19),s=n(5),u=n(6),m=n(9),p=n(7),d=n(10),f=n(61),E=n(27),g=n.n(E),b=(n(93),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).toggleConfigLock=function(e){e.target.checked?n.props.api.unlockConfig():n.props.api.saveConfig()},n.state={},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement(f.slide,{customBurgerIcon:!1,pageWrapId:"page-wrap",outerContainerId:"outer-container",isOpen:this.props.isMenuOpen},l.a.createElement("span",{className:"menu-item"},"Unlock settings ",l.a.createElement(g.a,{onChange:this.toggleConfigLock})),l.a.createElement("a",{className:"menu-item",href:"/",onClick:function(){window.confirm("Are you sure you want to reboot?")&&e.props.api.reboot()}},"Reboot unit"),l.a.createElement("span",{className:"menu-item"},"Upload data"),l.a.createElement("a",{className:"menu-item",href:"/",onClick:function(){window.confirm("Are you sure you want to shutdown?")&&e.props.api.shutdown()}},"Shutdown unit"),l.a.createElement("span",{className:"menu-item"}),l.a.createElement("span",{className:"menu-item"},"QS code: ",this.props.QS))}}]),t}(a.Component));var v=Object(o.b)(function(e){return{isMenuOpen:e.misc.isMenuOpen,QS:e.static.QS}})(b),h=n(3),O=n(65),C=n(15),y=n.n(C),N=n(21),L=n(2),I=n.n(L),k=n(11),T=n.n(k),j=(n(107),function(e){return l.a.createElement("div",{className:"comElement"},l.a.createElement("div",{className:"comElement--title"},l.a.createElement("div",{className:"center"},l.a.createElement(T.a,null,l.a.createElement("div",null,e.name)),l.a.createElement(T.a,{compressor:2},l.a.createElement("div",null,e.average&&"Average ".concat(e.entries))))),l.a.createElement("div",{className:"comElement--content"},l.a.createElement(T.a,null,l.a.createElement("div",{className:"center"},e.entry))))}),x=(n(109),function(e){function t(){return Object(s.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"buttonList"},l.a.createElement("div",{className:"buttonList--title"},l.a.createElement("div",{className:"center"},"Outputs")),this.props.outputs.filter(function(t,n){return e.props.portsEnabled[n]||""!==t.name}).map(function(t,n){var a="buttonList--list--indicator--output";return t.isForced&&(a+="Forced"),t.state?a+="On":t.result&&!t.isForced?a+="Execute":a+="Off",l.a.createElement("div",{key:n,className:"buttonList--list--item",onClick:function(){return e.props.clickFunction(n)}},l.a.createElement("div",{className:"center-vertical"}," ",t.name),l.a.createElement("div",{className:"buttonList--list--indicator "+a}))}))}}]),t}(a.Component));var w=Object(o.b)(function(e){return{configLocked:e.config.locked,portsEnabled:e.config.output.ports.map(function(e){return""!==e.formula})}})(x),M=(n(111),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).state={},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"buttonList inputList"},l.a.createElement("div",{className:"buttonList--title"},l.a.createElement("div",{className:"center"},"Inputs")),this.props.inputs.filter(function(t,n){return e.props.portsEnabled[n]||""!==t.name}).map(function(t,n){var a="buttonList--list--indicator--input";return t.isForced&&(a+="Forced"),a+=t.state?"On":"Off",l.a.createElement("div",{key:n,className:"buttonList--list--item",onClick:function(){return e.props.clickFunction(n)}},l.a.createElement("div",{className:"center-vertical"}," ",t.name),l.a.createElement("div",{className:"buttonList--list--indicator "+a}))}))}}]),t}(a.Component));var A=Object(o.b)(function(e){return{configLocked:e.config.locked,portsEnabled:e.config.input.ports.map(function(e){return""!==e.formula})}})(M),_=(n(113),function(e){var t,n=e.index;switch(e.type){case"manualText":t=l.a.createElement("input",{type:"text",className:"tableCell--content--input tableCell--content--input--text",onChange:function(t){return e.manualFunction(n,t.target.value)},value:e.value});break;case"manualNumeric":t=l.a.createElement(l.a.Fragment,null,l.a.createElement("button",{onClick:function(){e.manualFunction(n,Number(e.value)-1)}},"-"),l.a.createElement("input",{type:"number",className:"tableCell--content--input tableCell--content--input--numeric",onChange:function(t){return e.manualFunction(n,t.target.value)},value:e.value}),l.a.createElement("button",{onClick:function(){e.manualFunction(n,Number(e.value)+1)}},"+"));break;case"menuText":t=l.a.createElement("select",{className:"tableCell--content--input tableCell--content--input--text",onChange:function(t){return e.manualFunction(n,t.target.value)},value:e.value},e.menuOptions.map(function(e){return l.a.createElement("option",{value:e.value},e.description)}));break;case"menuNumeric":t=l.a.createElement(l.a.Fragment,null,l.a.createElement("button",{onClick:function(){var t=e.menuOptions.findIndex(function(t){return t.value===e.value})-1;t<0&&(t=0),e.manualFunction(n,e.menuOptions[t].value)}},"-"),l.a.createElement("select",{className:"tableCell--content--input tableCell--content--input--numeric",onChange:function(t){return e.manualFunction(n,t.target.value)},value:e.value},e.menuOptions.map(function(e){return l.a.createElement("option",{value:e.value},e.description)})),l.a.createElement("button",{onClick:function(){var t=e.menuOptions.findIndex(function(t){return t.value===e.value})+1;0!==t&&t!==e.menuOptions.length||(t=e.menuOptions.length-1),e.manualFunction(n,e.menuOptions[t].value)}},"+"));break;default:t=e.value}return l.a.createElement("div",{className:"tableCell"},l.a.createElement("div",{className:"tableCell--title",onClick:e.openModal},l.a.createElement(T.a,null,l.a.createElement("div",{className:"center"},e.name))),l.a.createElement("div",{className:"tableCell--content"},l.a.createElement(T.a,{compressor:.4},l.a.createElement("div",{className:"center"},t))))});n(115);y.a.setAppElement("#root");var F=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).openConfigModal=function(e){n.setState({configModalIsOpen:!0,configCellIndex:e})},n.closeConfigModal=function(){n.setState({configModalIsOpen:!1})},n.formChanged=function(e){var t,n=e.target.name;t="checkbox"===e.target.type?e.target.checked:isNaN(Number(e.target.value))?e.target.value:Number(e.target.value),console.log({property:n,value:t})},n.state={configModalIsOpen:!1,configCellIndex:-1},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.props.cells.filter(function(e,t){return t<10});return l.a.createElement(l.a.Fragment,null,l.a.createElement(y.a,{isOpen:this.state.configModalIsOpen,onRequestClose:this.closeConfigModal,overlayClassName:"modalOverlay",className:"modalContent",contentLabel:"Table Configuration Modal"},l.a.createElement("form",{onChange:this.formChanged},l.a.createElement("h2",null,"Configuration for whole table"),"Trigger:",l.a.createElement("select",{name:"table.trigger"},l.a.createElement("option",{value:0},"Com 0"),l.a.createElement("option",{value:1},"Com 1")),l.a.createElement("br",null),"Use imported file:",l.a.createElement("input",{type:"checkbox",name:"table.useFile"}),l.a.createElement("br",null),"Wait for other com:",l.a.createElement("input",{type:"checkbox",name:"table.waitForOther"}),l.a.createElement("br",null),"Column to search in:",l.a.createElement("input",{type:"number",min:"0",step:"1",name:"table.searchColumn"}),l.a.createElement("br",null),l.a.createElement("h2",null,"Configuration for cell ",this.state.configCellIndex),"Type of content:",l.a.createElement("select",{name:"table.cells[".concat(this.state.configCellIndex,"].type")},l.a.createElement("option",{value:""},"Normal"),l.a.createElement("option",{value:"date"},"Date"),l.a.createElement("option",{value:"manual"},"Manual"),l.a.createElement("option",{value:"menu"},"Selectable")),l.a.createElement("br",null),"Name of cell:",l.a.createElement("input",{type:"text",name:"table.cells[".concat(this.state.configCellIndex,"].name")}),l.a.createElement("br",null),"Formula for cell value:",l.a.createElement("input",{type:"text",name:"table.cells[".concat(this.state.configCellIndex,"].formula")}),l.a.createElement("br",null),"Formula for cell Color:",l.a.createElement("input",{type:"text",name:"table.cells[".concat(this.state.configCellIndex,"].colorFormula")}),l.a.createElement("select",{name:"table.cells[".concat(this.state.configCellIndex,"].type")},l.a.createElement("option",{value:""},"Green"),l.a.createElement("option",{value:"date"},"Yellow"),l.a.createElement("option",{value:"manual"},"Orange"),l.a.createElement("option",{value:"menu"},"Red")),l.a.createElement("br",null),"Treat value as a number:",l.a.createElement("input",{type:"checkbox",name:"table.cells[".concat(this.state.configCellIndex,"].numeric")}),l.a.createElement("br",null),"Number of digits:",l.a.createElement("input",{type:"number",min:"0",step:"1",name:"table.cells[".concat(this.state.configCellIndex,"].digits")}),l.a.createElement("br",null),"Reset value after execute:",l.a.createElement("input",{type:"checkbox",name:"table.cells[".concat(this.state.configCellIndex,"].numeric")}),l.a.createElement("br",null))),l.a.createElement("div",{className:"table--grid table--grid--".concat(t.length)},t.map(function(t,n){return l.a.createElement(_,{key:n,name:t.name,value:t.value,index:n,type:t.manual?"menuNumeric":"text",menuOptions:[{value:1,description:"smeeeeeeeeeeeall"},{value:3,description:"big"}],manualFunction:e.props.api.tableManual,openModal:e.props.configLocked?e.props.openLog:function(){return e.openConfigModal(n)}})})))}}]),t}(a.Component);var S=Object(o.b)(function(e){return{configLocked:e.config.locked}})(F),R=(n(117),n(119),[{Header:"Com0",accessor:function(e){return e.entries[0]},id:1,style:{textAlign:"center"},width:70},{Header:"-1",accessor:function(e){return e.entries[1]},id:2,style:{textAlign:"center"},width:70},{Header:"-2",accessor:function(e){return e.entries[2]},id:3,style:{textAlign:"center"},width:70},{Header:"-3",accessor:function(e){return e.entries[3]},id:4,style:{textAlign:"center"},width:70},{Header:"-4",accessor:function(e){return e.entries[4]},id:5,style:{textAlign:"center"},width:70},{Header:"Com1",accessor:"key",style:{textAlign:"center"},width:200},{Header:function(){return l.a.createElement("input",{type:"text"})},accessor:"calibration",style:{textAlign:"center"},width:70},{Header:function(e){return l.a.createElement("button",null,"Delete")},Cell:function(e){return l.a.createElement("button",null,"Delete")},id:1,style:{textAlign:"center"},width:70}]),G=["","green","yellow","orange","red"],U=["black","white","black","black","white"],H=[{Header:"Com0",accessor:"calibration",style:{textAlign:"center"},width:70},{Header:"Com1",accessor:"key",style:{textAlign:"center"},width:200},{Header:function(){return l.a.createElement("input",{type:"text"})},accessor:"calibration",style:{textAlign:"center"},width:70},{Header:"Tol",accessor:"tolerance",Cell:function(e){return console.log(e),l.a.createElement("div",{style:{backgroundColor:G[e.original.increments],color:U[e.original.increments]}},e.value)},style:{textAlign:"center"},width:50},{Header:"Num",accessor:"numUpdates",style:{textAlign:"center"},width:50},{Header:function(e){return l.a.createElement("button",null,"Delete")},Cell:function(e){return l.a.createElement("button",null,"Delete")},id:1,style:{textAlign:"center"},width:70}];y.a.setAppElement("#root");var P=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).openModal=function(){n.setState({modalIsOpen:!0})},n.closeModal=function(){n.setState({modalIsOpen:!1})},n.state={modalIsOpen:!1},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=[],t=[];for(var n in this.props.generalEntries)t.push({key:n,entries:this.props.generalEntries[n]});for(var a in this.props.individualEntries)console.log(this.props.individualEntries[a]),e.push(Object(h.a)({key:a},this.props.individualEntries[a]));return l.a.createElement(l.a.Fragment,null,l.a.createElement(y.a,{isOpen:this.state.modalIsOpen,onRequestClose:this.closeModal,overlayClassName:"modalOverlay",className:"modalContent",contentLabel:"SelfLearning Modal"},l.a.createElement("div",null,"SL: Ind COM0"),l.a.createElement("div",{className:"selfLearning--modal"},l.a.createElement("div",null,l.a.createElement("div",{className:"selfLearning--modal--title"}," SL-list "),l.a.createElement(N.a,{style:{textAlign:"center"},data:t,columns:R})),l.a.createElement("div",null,l.a.createElement("div",{className:"selfLearning--modal--title"}," UN-list "),l.a.createElement(N.a,{data:e,columns:H})))),l.a.createElement("div",{className:"selfLearning",onClick:this.openModal},l.a.createElement("div",{className:"selfLearning--title "+["selfLearning--title--inProgress","selfLearning--title--success","selfLearning--title--warning"][this.props.success]},l.a.createElement("div",{className:"center"},l.a.createElement(T.a,null,l.a.createElement("div",null,"Self Learning")))),l.a.createElement("div",{className:"selfLearning--content"},this.props.individual?l.a.createElement("div",{className:"center"},l.a.createElement(T.a,null,l.a.createElement("div",null,this.props.calibration," \xb1"," ",(100*this.props.tolerance).toFixed(1)," %"))):l.a.createElement("div",{className:"center"},l.a.createElement(T.a,null,l.a.createElement("div",null,this.props.calibration," \xb1"," ",(100*this.props.matchedTolerance).toFixed(1)," %"))))))}}]),t}(a.Component);var q=Object(o.b)(function(e){return Object(h.a)({},e.internal.selfLearning)})(P),V=(n(121),function(e){return l.a.createElement("div",{className:"logo",onClick:e.onClick},l.a.createElement("img",{className:"center",src:e.image,alt:e.alt}))}),D=n(62),B=n.n(D),K=n(37),Y=n.n(K),Q=(n(124),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).state={},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"infobar"},l.a.createElement(T.a,null,l.a.createElement("div",{className:"infobar--item"},l.a.createElement("div",{className:"center"},this.props.name))),l.a.createElement(T.a,null,l.a.createElement("div",{className:"infobar--item"},l.a.createElement("div",{className:"center"},this.props.ip))),l.a.createElement(T.a,null,l.a.createElement("div",{className:"infobar--item"},l.a.createElement("div",{className:"center"},Y()(this.props.time).format("HH:mm:ss")))),l.a.createElement(T.a,null,l.a.createElement("div",{className:"infobar--item"},l.a.createElement("div",{className:"center"},Y()(this.props.time).format("DD-MM-YYYY")))))}}]),t}(a.Component));var W=Object(o.b)(function(e){return{name:e.static.name,ip:e.misc.ip,time:e.misc.time}})(Q);n(126),n(128);y.a.setAppElement("#root");var J=function(e,t){var n=Math.max.apply(Math,Object(O.a)(e.map(function(e){return("".concat(e[t])||"").length})));return Math.max(50,Math.min(400,11*n))},z=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(m.a)(this,Object(p.a)(t).call(this,e))).openLogModal=function(){n.setState({logModalIsOpen:!0}),n.reloadLogEntries({target:{checked:n.state.logModalUnique}})},n.reloadLogEntries=function(e){var t=e.target.checked;(t?n.props.api.getUniqueLog:n.props.api.getLog)().then(function(e){n.setState({logTableColumns:e.data.legend.map(function(t,n){return{Header:function(){return l.a.createElement("b",null,t)},accessor:n+"",width:J(e.data.entries,n+""),style:{textAlign:"center"}}}),logEntries:e.data.entries,logModalUnique:t})})},n.closeLogModal=function(){n.setState({logModalIsOpen:!1})},e.api.getLogo().then(function(e){e&&n.setState({logo:e})}),n.state={logModalIsOpen:!1,logModalUnique:!1,logEntries:[],logTableColumns:[],logo:B.a},n}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){if(!this.props.loaded)return l.a.createElement("div",null,"Loading");var e=this.props.cells.reduce(function(e,t){return e||t.name},!1),t=this.props.outputs.reduce(function(e,t){return e||t.name},!1),n=this.props.outputs.reduce(function(e,t){return e||t.name},!1),a=t||n;return l.a.createElement("div",{id:"page-wrap"},".",l.a.createElement("div",{className:I()("main",{"main--noports":!a},{"main--notable":!e})},l.a.createElement(y.a,{isOpen:this.state.logModalIsOpen,onRequestClose:this.closeLogModal,overlayClassName:"modalOverlay",className:"modalContent",contentLabel:"Log Modal"},this.props.uniqueLogEnabled&&l.a.createElement("span",null,l.a.createElement(g.a,{checked:this.state.logModalUnique,onChange:this.reloadLogEntries}),"Only show unique entries"),l.a.createElement("div",{className:"main--logModal"},l.a.createElement("div",null,l.a.createElement("div",{className:"main--logModal--title"},this.state.logModalUnique?"Unique Log":"Normal Log"),l.a.createElement(N.a,{style:{fontSize:13},data:this.state.logEntries,columns:this.state.logTableColumns})))),l.a.createElement(W,null),l.a.createElement("div",{className:"logos"},l.a.createElement(V,{image:this.state.logo,alt:"LOGO",onClick:this.props.api.toggleMenu}),this.props.selfLearningEnabled&&l.a.createElement(q,null)),l.a.createElement("div",{className:"coms"},this.props.coms.map(function(e,t){return l.a.createElement(j,{key:t,name:e.name,entry:e.entry,time:e.time,average:e.average,entries:e.entries})})),a&&l.a.createElement("div",{className:"ports"},n&&l.a.createElement(w,{outputs:this.props.outputs,clickFunction:this.props.api.forceOutput}),t&&l.a.createElement(A,{inputs:this.props.inputs,clickFunction:this.props.api.forceInput})),e&&l.a.createElement("div",{className:"table"},l.a.createElement(S,{api:this.props.api,cells:this.props.cells,openLog:this.openLogModal}))))}}]),t}(a.Component);var $=Object(o.b)(function(e){return e.config.loaded&&e.static.loaded?{loaded:!0,coms:e.internal.coms.map(function(t,n){return Object(h.a)({},t,e.config.serial.coms[n])}),inputs:e.internal.inputs.map(function(t,n){return Object(h.a)({},t,{name:e.config.input.ports[n].name})}),outputs:e.internal.outputs.map(function(t,n){return Object(h.a)({},t,{name:e.config.output.ports[n].name})}),cells:e.internal.cells.map(function(t,n){return Object(h.a)({},t,{name:e.config.table.cells[n].name})}),selfLearningEnabled:e.internal.selfLearning.enabled,configLocked:e.config.locked,uniqueLogEnabled:"off"!==e.config.logger.unique}:{loaded:!1}})(z),X=function(e){function t(){return Object(s.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{id:"outer-container"},l.a.createElement(v,{api:this.props.api}),l.a.createElement($,{api:this.props.api}))}}]),t}(a.Component),Z=n(4),ee=Z.RECEIVE_CONFIG,te=Z.CONFIG_UNLOCK,ne=Z.CONFIG_LOCK,ae=Z.CONFIG_CHANGE,le={loaded:!1,locked:!0,hasChanged:!1},re=n(4).RECEIVE_STATIC,ce={loaded:!1},oe=n(4),ie=oe.INPUT_PORT_STATE,se=oe.OUTPUT_PORT_STATE,ue=oe.SERIAL_COM_STATE,me=oe.TABLE_CELL_STATE,pe=oe.SELFLEARNING_STATE,de={coms:[],outputs:[],inputs:[],cells:[],selfLearning:{enabled:!1}},fe=n(4),Ee=fe.RECEIVE_IP,ge=fe.RECEIVE_TIME,be=fe.TOGGLE_MENU,ve={ip:"",time:(new Date).getTime(),isMenuOpen:!1},he=Object(i.b)({config:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:le,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case ee:return Object(h.a)({},e,{loaded:!0},t.payload);case te:return Object(h.a)({},e,{locked:!1});case ne:return Object(h.a)({},e,{locked:!0});case ae:return e.locked?e:Object(h.a)({},e,{hasChanged:!0},e);default:return e}},static:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ce,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case re:return Object(h.a)({loaded:!0},t.payload);default:return e}},internal:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:de,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case ie:var n=t.payload,a=n.index,l=n.state,r=n.isForced,c=Array.from(e.inputs);return c[a]={state:l,isForced:r},Object(h.a)({},e,{inputs:c});case se:var o=t.payload,i=o.index,s=o.state,u=o.result,m=o.isForced,p=Array.from(e.outputs);return p[i]={state:s,result:u,isForced:m},Object(h.a)({},e,{outputs:p});case ue:var d=t.payload,f=d.index,E=d.entry,g=d.entryTime,b=Array.from(e.coms);return b[f]={entry:E,entryTime:g},Object(h.a)({},e,{coms:b});case me:var v=t.payload,O=v.index,C=v.value,y=v.manual,N=Array.from(e.cells);return N[O]={value:C,manual:y},Object(h.a)({},e,{cells:N});case pe:return console.log(t.payload),Object(h.a)({},e,{selfLearning:Object(h.a)({enabled:!0},t.payload)});default:return e}},misc:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ve,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case Ee:return Object(h.a)({},e,{ip:t.payload});case ge:return Object(h.a)({},e,{time:t.payload});case be:return Object(h.a)({},e,{isMenuOpen:!e.isMenuOpen});default:return e}}}),Oe=n(38),Ce=n.n(Oe),ye=n(63),Ne=n(64),Le=n.n(Ne),Ie=n(16),ke=n.n(Ie),Te=n(4),je="http://"+window.location.hostname+":80";console.log(je);var xe=function(e){var t=Le()(je),n={input:Te.INPUT_PORT_STATE,output:Te.OUTPUT_PORT_STATE,table:Te.TABLE_CELL_STATE,entry:Te.SERIAL_COM_STATE,selfLearning:Te.SELFLEARNING_STATE,ip:Te.RECEIVE_IP,time:Te.RECEIVE_TIME},a=function(a){t.on(a,function(t){e.dispatch({type:n[a],payload:t})})};for(var l in n)a(l);function r(){return(r=Object(ye.a)(Ce.a.mark(function e(){var t;return Ce.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=!1,e.prev=1,e.next=4,ke.a.get(je+"/logo");case 4:t=je+"/logo";case 5:return e.prev=5,e.abrupt("return",t);case 8:case"end":return e.stop()}},e,this,[[1,,5,8]])}))).apply(this,arguments)}return ke.a.get(je+"/config").then(function(t){console.log("Got config"),e.dispatch({type:Te.RECEIVE_CONFIG,payload:t.data})}).catch(function(e){return console.log(je+"/config",e)}),ke.a.get(je+"/static").then(function(t){console.log("Got static"),e.dispatch({type:Te.RECEIVE_STATIC,payload:t.data})}),{forceInput:function(e){console.log("forceinput",e),t.emit("forceInput",e)},forceOutput:function(e){console.log("forceoutput",e),t.emit("forceOutput",e)},tableManual:function(e,n){t.emit("manual",{index:e,value:n})},getLog:function(){return ke.a.get(je+"/comlog")},getUniqueLog:function(){return ke.a.get(je+"/comlogu")},reboot:function(){ke.a.get(je+"/restart")},shutdown:function(){ke.a.get(je+"/shutdown")},getLogo:function(){return r.apply(this,arguments)},toggleMenu:function(){e.dispatch({type:Te.TOGGLE_MENU})},unlockConfig:function(){e.dispatch({type:Te.CONFIG_UNLOCK})},saveConfig:function(){e.getState().config.hasChanged?window.confirm("Are you sure you want to save these changes?")&&e.dispatch({type:Te.CONFIG_LOCK}):e.dispatch({type:Te.CONFIG_LOCK})},changeConfig:function(t){e.dispatch({type:Te.CONFIG_CHANGE,payload:t})}}};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(179);var we=Object(i.c)(he);c.a.render(l.a.createElement(o.a,{store:we},l.a.createElement(X,{api:xe(we)})),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},4:function(e,t){e.exports=function(e){var t={};return e.forEach(function(e){t[e]=e}),t}(["RECEIVE_TIME","RECEIVE_IP","TOGGLE_MENU","RECEIVE_CONFIG","RECEIVE_STATIC","INPUT_PORT_STATE","OUTPUT_PORT_STATE","SERIAL_COM_STATE","TABLE_CELL_STATE","SELFLEARNING_STATE","CONFIG_UNLOCK","CONFIG_LOCK","CONFIG_CHANGE"])},62:function(e,t,n){e.exports=n.p+"static/media/Logo-MBDC.645b4549.jpg"},66:function(e,t,n){e.exports=n(181)},93:function(e,t,n){}},[[66,2,1]]]);
//# sourceMappingURL=main.d587180e.chunk.js.map