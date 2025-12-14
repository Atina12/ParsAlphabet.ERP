/*! alertifyjs - v1.13.1 - Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com) */
!function(a){"use strict";function b(a,b){a.className+=" "+b}function c(a,b){for(var c=a.className.split(" "),d=b.split(" "),e=0;e<d.length;e+=1){var f=c.indexOf(d[e]);f>-1&&c.splice(f,1)}a.className=c.join(" ")}function d(){return"rtl"===a.getComputedStyle(document.body).direction}function e(){return document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop}function f(){return document.documentElement&&document.documentElement.scrollLeft||document.body.scrollLeft}function g(a){for(;a.lastChild;)a.removeChild(a.lastChild)}function h(a){if(null===a)return a;var b;if(Array.isArray(a)){b=[];for(var c=0;c<a.length;c+=1)b.push(h(a[c]));return b}if(a instanceof Date)return new Date(a.getTime());if(a instanceof RegExp)return b=new RegExp(a.source),b.global=a.global,b.ignoreCase=a.ignoreCase,b.multiline=a.multiline,b.lastIndex=a.lastIndex,b;if("object"==typeof a){b={};for(var d in a)a.hasOwnProperty(d)&&(b[d]=h(a[d]));return b}return a}function i(a,b){if(a.elements){var c=a.elements.root;c.parentNode.removeChild(c),delete a.elements,a.settings=h(a.__settings),a.__init=b,delete a.__internal}}function j(a,b){return function(){if(arguments.length>0){for(var c=[],d=0;d<arguments.length;d+=1)c.push(arguments[d]);return c.push(a),b.apply(a,c)}return b.apply(a,[null,a])}}function k(a,b){return{index:a,button:b,cancel:!1}}function l(a,b){if("function"==typeof b.get(a))return b.get(a).call(b)}function m(){function a(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function b(a){var b=d[a].dialog;return b&&"function"==typeof b.__init&&b.__init(b),b}function c(b,c,e,f){var g={dialog:null,factory:c};return void 0!==f&&(g.factory=function(){return a(new d[f].factory,new c)}),e||(g.dialog=a(new g.factory,w)),d[b]=g}var d={};return{defaults:p,dialog:function(d,e,f,g){if("function"!=typeof e)return b(d);if(this.hasOwnProperty(d))throw new Error("alertify.dialog: name already exists");var h=c(d,e,f,g);this[d]=f?function(){if(0===arguments.length)return h.dialog;var b=a(new h.factory,w);return b&&"function"==typeof b.__init&&b.__init(b),b.main.apply(b,arguments),b.show.apply(b)}:function(){if(h.dialog&&"function"==typeof h.dialog.__init&&h.dialog.__init(h.dialog),0===arguments.length)return h.dialog;var a=h.dialog;return a.main.apply(h.dialog,arguments),a.show.apply(h.dialog)}},closeAll:function(a){for(var b=q.slice(0),c=0;c<b.length;c+=1){var d=b[c];void 0!==a&&a===d||d.close()}},setting:function(a,c,d){if("notifier"===a)return x.setting(c,d);var e=b(a);return e?e.setting(c,d):void 0},set:function(a,b,c){return this.setting(a,b,c)},get:function(a,b){return this.setting(a,b)},notify:function(a,b,c,d){return x.create(b,d).push(a,c)},message:function(a,b,c){return x.create(null,c).push(a,b)},success:function(a,b,c){return x.create("success",c).push(a,b)},error:function(a,b,c){return x.create("error",c).push(a,b)},warning:function(a,b,c){return x.create("warning",c).push(a,b)},dismissAll:function(){x.dismissAll()}}}var n=":not(:disabled):not(.ajs-reset)",o={ENTER:13,ESC:27,F1:112,F12:123,LEFT:37,RIGHT:39,TAB:9},p={autoReset:!0,basic:!1,closable:!0,closableByDimmer:!0,invokeOnCloseOff:!1,frameless:!1,defaultFocusOff:!1,maintainFocus:!0,maximizable:!0,modal:!0,movable:!0,moveBounded:!1,overflow:!0,padding:!0,pinnable:!0,pinned:!0,preventBodyShift:!1,resizable:!0,startMaximized:!1,transition:"pulse",transitionOff:!1,tabbable:["button","[href]","input","select","textarea",'[tabindex]:not([tabindex^="-"])'+n].join(n+","),notifier:{delay:5,position:"bottom-right",closeButton:!1,classes:{base:"alertify-notifier",prefix:"ajs-",message:"ajs-message",top:"ajs-top",right:"ajs-right",bottom:"ajs-bottom",left:"ajs-left",center:"ajs-center",visible:"ajs-visible",hidden:"ajs-hidden",close:"ajs-close"}},glossary:{title:"AlertifyJS",ok:"OK",cancel:"Cancel",acccpt:"Accept",deny:"Deny",confirm:"Confirm",decline:"Decline",close:"Close",maximize:"Maximize",restore:"Restore"},theme:{input:"ajs-input",ok:"ajs-ok",cancel:"ajs-cancel"},hooks:{preinit:function(){},postinit:function(){}}},q=[],r=!1;try{var s=Object.defineProperty({},"passive",{get:function(){r=!0}});a.addEventListener("test",s,s),a.removeEventListener("test",s,s)}catch(z){}var t=function(a,b,c,d,e){a.addEventListener(b,c,r?{capture:d,passive:e}:!0===d)},u=function(a,b,c,d,e){a.removeEventListener(b,c,r?{capture:d,passive:e}:!0===d)},v=function(){var a,b,c=!1,d={animation:"animationend",OAnimation:"oAnimationEnd oanimationend",msAnimation:"MSAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(a in d)if(void 0!==document.documentElement.style[a]){b=d[a],c=!0;break}return{type:b,supported:c}}(),w=function(){function m(a){if(!a.__internal){y.defaults.hooks.preinit(a),delete a.__init,a.__settings||(a.__settings=h(a.settings));var c;"function"==typeof a.setup?(c=a.setup(),c.options=c.options||{},c.focus=c.focus||{}):c={buttons:[],focus:{element:null,select:!1},options:{}},"object"!=typeof a.hooks&&(a.hooks={});var d=[];if(Array.isArray(c.buttons))for(var e=0;e<c.buttons.length;e+=1){var f=c.buttons[e],g={};for(var i in f)f.hasOwnProperty(i)&&(g[i]=f[i]);d.push(g)}var k=a.__internal={isOpen:!1,activeElement:document.body,timerIn:void 0,timerOut:void 0,buttons:d,focus:c.focus,options:{title:void 0,modal:void 0,basic:void 0,frameless:void 0,defaultFocusOff:void 0,pinned:void 0,movable:void 0,moveBounded:void 0,resizable:void 0,autoReset:void 0,closable:void 0,closableByDimmer:void 0,invokeOnCloseOff:void 0,maximizable:void 0,startMaximized:void 0,pinnable:void 0,transition:void 0,transitionOff:void 0,padding:void 0,overflow:void 0,onshow:void 0,onclosing:void 0,onclose:void 0,onfocus:void 0,onmove:void 0,onmoved:void 0,onresize:void 0,onresized:void 0,onmaximize:void 0,onmaximized:void 0,onrestore:void 0,onrestored:void 0},resetHandler:void 0,beginMoveHandler:void 0,beginResizeHandler:void 0,bringToFrontHandler:void 0,modalClickHandler:void 0,buttonsClickHandler:void 0,commandsClickHandler:void 0,transitionInHandler:void 0,transitionOutHandler:void 0,destroy:void 0},l={};l.root=document.createElement("div"),l.root.style.display="none",l.root.className=Ha.base+" "+Ha.hidden+" ",l.root.innerHTML=Ga.dimmer+Ga.modal,l.dimmer=l.root.firstChild,l.modal=l.root.lastChild,l.modal.innerHTML=Ga.dialog,l.dialog=l.modal.firstChild,l.dialog.innerHTML=Ga.reset+Ga.commands+Ga.header+Ga.body+Ga.footer+Ga.resizeHandle+Ga.reset,l.reset=[],l.reset.push(l.dialog.firstChild),l.reset.push(l.dialog.lastChild),l.commands={},l.commands.container=l.reset[0].nextSibling,l.commands.pin=l.commands.container.firstChild,l.commands.maximize=l.commands.pin.nextSibling,l.commands.close=l.commands.maximize.nextSibling,l.header=l.commands.container.nextSibling,l.body=l.header.nextSibling,l.body.innerHTML=Ga.content,l.content=l.body.firstChild,l.footer=l.body.nextSibling,l.footer.innerHTML=Ga.buttons.auxiliary+Ga.buttons.primary,l.resizeHandle=l.footer.nextSibling,l.buttons={},l.buttons.auxiliary=l.footer.firstChild,l.buttons.primary=l.buttons.auxiliary.nextSibling,l.buttons.primary.innerHTML=Ga.button,l.buttonTemplate=l.buttons.primary.firstChild,l.buttons.primary.removeChild(l.buttonTemplate);for(var m=0;m<a.__internal.buttons.length;m+=1){var n=a.__internal.buttons[m];Ca.indexOf(n.key)<0&&Ca.push(n.key),n.element=l.buttonTemplate.cloneNode(),n.element.innerHTML=n.text,"string"==typeof n.className&&""!==n.className&&b(n.element,n.className);for(var o in n.attrs)"className"!==o&&n.attrs.hasOwnProperty(o)&&n.element.setAttribute(o,n.attrs[o]);"auxiliary"===n.scope?l.buttons.auxiliary.appendChild(n.element):l.buttons.primary.appendChild(n.element)}a.elements=l,k.resetHandler=j(a,Z),k.beginMoveHandler=j(a,ea),k.beginResizeHandler=j(a,ka),k.bringToFrontHandler=j(a,D),k.modalClickHandler=j(a,T),k.buttonsClickHandler=j(a,V),k.commandsClickHandler=j(a,H),k.transitionInHandler=j(a,aa),k.transitionOutHandler=j(a,ba);for(var p in k.options)void 0!==c.options[p]?a.set(p,c.options[p]):y.defaults.hasOwnProperty(p)?a.set(p,y.defaults[p]):"title"===p&&a.set(p,y.defaults.glossary[p]);"function"==typeof a.build&&a.build(),y.defaults.hooks.postinit(a)}document.body.appendChild(a.elements.root)}function n(){Aa=f(),Ba=e()}function r(){a.scrollTo(Aa,Ba)}function s(){for(var a=0,d=0;d<q.length;d+=1){var e=q[d];(e.isModal()||e.isMaximized())&&(a+=1)}0===a&&document.body.className.indexOf(Ha.noOverflow)>=0?(c(document.body,Ha.noOverflow),w(!1)):a>0&&document.body.className.indexOf(Ha.noOverflow)<0&&(w(!0),b(document.body,Ha.noOverflow))}function w(d){y.defaults.preventBodyShift&&(d&&document.documentElement.scrollHeight>document.documentElement.clientHeight?(Ja=Ba,Ia=a.getComputedStyle(document.body).top,b(document.body,Ha.fixed),document.body.style.top=-Ba+"px"):d||(Ba=Ja,document.body.style.top=Ia,c(document.body,Ha.fixed),r()))}function x(a,d,e){"string"==typeof e&&c(a.elements.root,Ha.prefix+e),b(a.elements.root,Ha.prefix+d),Da=a.elements.root.offsetWidth}function z(a){a.get("transitionOff")?b(a.elements.root,Ha.noTransition):c(a.elements.root,Ha.noTransition)}function A(a){a.get("modal")?(c(a.elements.root,Ha.modeless),a.isOpen()&&(ta(a),P(a),s())):(b(a.elements.root,Ha.modeless),a.isOpen()&&(sa(a),P(a),s()))}function B(a){a.get("basic")?b(a.elements.root,Ha.basic):c(a.elements.root,Ha.basic)}function C(a){a.get("frameless")?b(a.elements.root,Ha.frameless):c(a.elements.root,Ha.frameless)}function D(a,b){for(var c=q.indexOf(b),d=c+1;d<q.length;d+=1)if(q[d].isModal())return;return document.body.lastChild!==b.elements.root&&(document.body.appendChild(b.elements.root),q.splice(q.indexOf(b),1),q.push(b),Y(b)),!1}function E(a,d,e,f){switch(d){case"title":a.setHeader(f);break;case"modal":A(a);break;case"basic":B(a);break;case"frameless":C(a);break;case"pinned":Q(a);break;case"closable":S(a);break;case"maximizable":R(a);break;case"pinnable":M(a);break;case"movable":ia(a);break;case"resizable":oa(a);break;case"padding":f?c(a.elements.root,Ha.noPadding):a.elements.root.className.indexOf(Ha.noPadding)<0&&b(a.elements.root,Ha.noPadding);break;case"overflow":f?c(a.elements.root,Ha.noOverflow):a.elements.root.className.indexOf(Ha.noOverflow)<0&&b(a.elements.root,Ha.noOverflow);break;case"transition":x(a,f,e);break;case"transitionOff":z(a)}"function"==typeof a.hooks.onupdate&&a.hooks.onupdate.call(a,d,e,f)}function F(a,b,c,d,e){var f={op:void 0,items:[]};if(void 0===e&&"string"==typeof d)f.op="get",b.hasOwnProperty(d)?(f.found=!0,f.value=b[d]):(f.found=!1,f.value=void 0);else{var g;if(f.op="set","object"==typeof d){var h=d;for(var i in h)b.hasOwnProperty(i)?(b[i]!==h[i]&&(g=b[i],b[i]=h[i],c.call(a,i,g,h[i])),f.items.push({key:i,value:h[i],found:!0})):f.items.push({key:i,value:h[i],found:!1})}else{if("string"!=typeof d)throw new Error("args must be a string or object");b.hasOwnProperty(d)?(b[d]!==e&&(g=b[d],b[d]=e,c.call(a,d,g,e)),f.items.push({key:d,value:e,found:!0})):f.items.push({key:d,value:e,found:!1})}}return f}function G(a){var b;U(a,function(c){return b=!0!==a.get("invokeOnCloseOff")&&!0===c.invokeOnClose}),!b&&a.isOpen()&&a.close()}function H(a,b){switch(a.srcElement||a.target){case b.elements.commands.pin:b.isPinned()?J(b):I(b);break;case b.elements.commands.maximize:b.isMaximized()?L(b):K(b);break;case b.elements.commands.close:G(b)}return!1}function I(a){a.set("pinned",!0)}function J(a){a.set("pinned",!1)}function K(a){l("onmaximize",a),b(a.elements.root,Ha.maximized),a.isOpen()&&s(),l("onmaximized",a)}function L(a){l("onrestore",a),c(a.elements.root,Ha.maximized),a.isOpen()&&s(),l("onrestored",a)}function M(a){a.get("pinnable")?b(a.elements.root,Ha.pinnable):c(a.elements.root,Ha.pinnable)}function N(a){var b=f();a.elements.modal.style.marginTop=e()+"px",a.elements.modal.style.marginLeft=b+"px",a.elements.modal.style.marginRight=-b+"px"}function O(a){var b=parseInt(a.elements.modal.style.marginTop,10),c=parseInt(a.elements.modal.style.marginLeft,10);if(a.elements.modal.style.marginTop="",a.elements.modal.style.marginLeft="",a.elements.modal.style.marginRight="",a.isOpen()){var d=0,g=0;""!==a.elements.dialog.style.top&&(d=parseInt(a.elements.dialog.style.top,10)),a.elements.dialog.style.top=d+(b-e())+"px",""!==a.elements.dialog.style.left&&(g=parseInt(a.elements.dialog.style.left,10)),a.elements.dialog.style.left=g+(c-f())+"px"}}function P(a){a.get("modal")||a.get("pinned")?O(a):N(a)}function Q(a){a.get("pinned")?(c(a.elements.root,Ha.unpinned),a.isOpen()&&O(a)):(b(a.elements.root,Ha.unpinned),a.isOpen()&&!a.isModal()&&N(a))}function R(a){a.get("maximizable")?b(a.elements.root,Ha.maximizable):c(a.elements.root,Ha.maximizable)}function S(a){a.get("closable")?(b(a.elements.root,Ha.closable),ya(a)):(c(a.elements.root,Ha.closable),za(a))}function T(a,b){if(a.timeStamp-La>200&&(La=a.timeStamp)&&!Ka){var c=a.srcElement||a.target;!0===b.get("closableByDimmer")&&c===b.elements.modal&&G(b)}Ka=!1}function U(a,b){if(Date.now()-Ma>200&&(Ma=Date.now()))for(var c=0;c<a.__internal.buttons.length;c+=1){var d=a.__internal.buttons[c];if(!d.element.disabled&&b(d)){var e=k(c,d);"function"==typeof a.callback&&a.callback.apply(a,[e]),!1===e.cancel&&a.close();break}}}function V(a,b){var c=a.srcElement||a.target;U(b,function(a){return a.element===c&&(Na=!0)})}function W(a){if(Na)return void(Na=!1);var b=q[q.length-1],c=a.keyCode;return 0===b.__internal.buttons.length&&c===o.ESC&&!0===b.get("closable")?(G(b),!1):Ca.indexOf(c)>-1?(U(b,function(a){return a.key===c}),!1):void 0}function X(a){var b=q[q.length-1],c=a.keyCode;if(c===o.LEFT||c===o.RIGHT){for(var d=b.__internal.buttons,e=0;e<d.length;e+=1)if(document.activeElement===d[e].element)switch(c){case o.LEFT:return void d[(e||d.length)-1].element.focus();case o.RIGHT:return void d[(e+1)%d.length].element.focus()}}else if(c<o.F12+1&&c>o.F1-1&&Ca.indexOf(c)>-1)return a.preventDefault(),a.stopPropagation(),U(b,function(a){return a.key===c}),!1}function Y(a,b){if(b)b.focus();else{var c=a.__internal.focus,d=c.element;switch(typeof c.element){case"number":a.__internal.buttons.length>c.element&&(d=!0===a.get("basic")?a.elements.reset[0]:a.__internal.buttons[c.element].element);break;case"string":d=a.elements.body.querySelector(c.element);break;case"function":d=c.element.call(a)}!0!==a.get("defaultFocusOff")&&(void 0!==d&&null!==d||0!==a.__internal.buttons.length)||(d=a.elements.reset[0]),d&&d.focus&&(d.focus(),c.select&&d.select&&d.select())}}function Z(a,b){if(!b)for(var c=q.length-1;c>-1;c-=1)if(q[c].isModal()){b=q[c];break}if(b&&b.isModal()){var d,e=b.elements.reset[0],f=b.elements.reset[1],g=a.relatedTarget,h=b.elements.root.contains(g),i=a.srcElement||a.target;if(i===e&&!h||i===f&&g===e)return;i===f||i===document.body?d=e:i===e&&g===f?d=$(b):i===e&&h&&(d=$(b,!0)),Y(b,d)}}function $(a,b){var c=[].slice.call(a.elements.dialog.querySelectorAll(p.tabbable));b&&c.reverse();for(var d=0;d<c.length;d+=1){var e=c[d];if(e.offsetParent||e.offsetWidth||e.offsetHeight||e.getClientRects().length)return e}}function _(a){var b=q[q.length-1];b&&a.shiftKey&&a.keyCode===o.TAB&&b.elements.reset[1].focus()}function aa(a,b){clearTimeout(b.__internal.timerIn),Y(b),Na=!1,l("onfocus",b),u(b.elements.dialog,v.type,b.__internal.transitionInHandler),c(b.elements.root,Ha.animationIn)}function ba(a,b){clearTimeout(b.__internal.timerOut),u(b.elements.dialog,v.type,b.__internal.transitionOutHandler),ha(b),na(b),b.isMaximized()&&!b.get("startMaximized")&&L(b),"function"==typeof b.__internal.destroy&&b.__internal.destroy.apply(b)}function ca(a,b){var c=a[Ra]-Pa,d=a[Sa]-Qa;Ua&&(d-=document.body.scrollTop),b.style.left=c+"px",b.style.top=d+"px"}function da(a,b){var c=a[Ra]-Pa,d=a[Sa]-Qa;Ua&&(d-=document.body.scrollTop),b.style.left=Math.min(Ta.maxLeft,Math.max(Ta.minLeft,c))+"px",b.style.top=Ua?Math.min(Ta.maxTop,Math.max(Ta.minTop,d))+"px":Math.max(Ta.minTop,d)+"px"}function ea(a,c){if(null===Wa&&!c.isMaximized()&&c.get("movable")){var d,e=0,f=0;if("touchstart"===a.type?(a.preventDefault(),d=a.targetTouches[0],Ra="clientX",Sa="clientY"):0===a.button&&(d=a),d){var g=c.elements.dialog;if(b(g,Ha.capture),g.style.left&&(e=parseInt(g.style.left,10)),g.style.top&&(f=parseInt(g.style.top,10)),Pa=d[Ra]-e,Qa=d[Sa]-f,c.isModal()?Qa+=c.elements.modal.scrollTop:c.isPinned()&&(Qa-=document.body.scrollTop),c.get("moveBounded")){var h=g,i=-e,j=-f;do{i+=h.offsetLeft,j+=h.offsetTop}while(h=h.offsetParent);Ta={maxLeft:i,minLeft:-i,maxTop:document.documentElement.clientHeight-g.clientHeight-j,minTop:-j},Va=da}else Ta=null,Va=ca;return l("onmove",c),Ua=!c.isModal()&&c.isPinned(),Oa=c,Va(d,g),b(document.body,Ha.noSelection),!1}}}function fa(a){if(Oa){var b;"touchmove"===a.type?(a.preventDefault(),b=a.targetTouches[0]):0===a.button&&(b=a),b&&Va(b,Oa.elements.dialog)}}function ga(){if(Oa){var a=Oa;Oa=Ta=null,c(document.body,Ha.noSelection),c(a.elements.dialog,Ha.capture),l("onmoved",a)}}function ha(a){Oa=null;var b=a.elements.dialog;b.style.left=b.style.top=""}function ia(a){a.get("movable")?(b(a.elements.root,Ha.movable),a.isOpen()&&ua(a)):(ha(a),c(a.elements.root,Ha.movable),a.isOpen()&&va(a))}function ja(a,b,c){var e=b,f=0,g=0;do{f+=e.offsetLeft,g+=e.offsetTop}while(e=e.offsetParent);var h,i;!0===c?(h=a.pageX,i=a.pageY):(h=a.clientX,i=a.clientY);var j=d();if(j&&(h=document.body.offsetWidth-h,isNaN(Xa)||(f=document.body.offsetWidth-f-b.offsetWidth)),b.style.height=i-g+$a+"px",b.style.width=h-f+$a+"px",!isNaN(Xa)){var k=.5*Math.abs(b.offsetWidth-Ya);j&&(k*=-1),b.offsetWidth>Ya?b.style.left=Xa+k+"px":b.offsetWidth>=Za&&(b.style.left=Xa-k+"px")}}function ka(a,c){if(!c.isMaximized()){var d;if("touchstart"===a.type?(a.preventDefault(),d=a.targetTouches[0]):0===a.button&&(d=a),d){l("onresize",c),Wa=c,$a=c.elements.resizeHandle.offsetHeight/2;var e=c.elements.dialog;return b(e,Ha.capture),Xa=parseInt(e.style.left,10),e.style.height=e.offsetHeight+"px",e.style.minHeight=c.elements.header.offsetHeight+c.elements.footer.offsetHeight+"px",e.style.width=(Ya=e.offsetWidth)+"px","none"!==e.style.maxWidth&&(e.style.minWidth=(Za=e.offsetWidth)+"px"),e.style.maxWidth="none",b(document.body,Ha.noSelection),!1}}}function la(a){if(Wa){var b;"touchmove"===a.type?(a.preventDefault(),b=a.targetTouches[0]):0===a.button&&(b=a),b&&ja(b,Wa.elements.dialog,!Wa.get("modal")&&!Wa.get("pinned"))}}function ma(){if(Wa){var a=Wa;Wa=null,c(document.body,Ha.noSelection),c(a.elements.dialog,Ha.capture),Ka=!0,l("onresized",a)}}function na(a){Wa=null;var b=a.elements.dialog;"none"===b.style.maxWidth&&(b.style.maxWidth=b.style.minWidth=b.style.width=b.style.height=b.style.minHeight=b.style.left="",Xa=Number.Nan,Ya=Za=$a=0)}function oa(a){a.get("resizable")?(b(a.elements.root,Ha.resizable),a.isOpen()&&wa(a)):(na(a),c(a.elements.root,Ha.resizable),a.isOpen()&&xa(a))}function pa(){for(var a=0;a<q.length;a+=1){var b=q[a];b.get("autoReset")&&(ha(b),na(b))}}function qa(b){1===q.length&&(t(a,"resize",pa),t(document.body,"keyup",W),t(document.body,"keydown",X),t(document.body,"focus",Z),t(document.documentElement,"mousemove",fa),t(document.documentElement,"touchmove",fa,!1,!1),t(document.documentElement,"mouseup",ga),t(document.documentElement,"touchend",ga),t(document.documentElement,"mousemove",la),t(document.documentElement,"touchmove",la,!1,!1),t(document.documentElement,"mouseup",ma),t(document.documentElement,"touchend",ma)),t(b.elements.commands.container,"click",b.__internal.commandsClickHandler),t(b.elements.footer,"click",b.__internal.buttonsClickHandler),t(b.elements.reset[0],"focusin",b.__internal.resetHandler),t(b.elements.reset[0],"keydown",_),t(b.elements.reset[1],"focusin",b.__internal.resetHandler),Na=!0,t(b.elements.dialog,v.type,b.__internal.transitionInHandler),b.get("modal")||sa(b),b.get("resizable")&&wa(b),b.get("movable")&&ua(b)}function ra(b){1===q.length&&(u(a,"resize",pa),u(document.body,"keyup",W),u(document.body,"keydown",X),u(document.body,"focus",Z),u(document.documentElement,"mousemove",fa),u(document.documentElement,"mouseup",ga),u(document.documentElement,"mousemove",la),u(document.documentElement,"mouseup",ma)),u(b.elements.commands.container,"click",b.__internal.commandsClickHandler),u(b.elements.footer,"click",b.__internal.buttonsClickHandler),u(b.elements.reset[0],"focusin",b.__internal.resetHandler),u(b.elements.reset[0],"keydown",_),u(b.elements.reset[1],"focusin",b.__internal.resetHandler),t(b.elements.dialog,v.type,b.__internal.transitionOutHandler),b.get("modal")||ta(b),b.get("movable")&&va(b),b.get("resizable")&&xa(b)}function sa(a){t(a.elements.dialog,"focus",a.__internal.bringToFrontHandler,!0)}function ta(a){u(a.elements.dialog,"focus",a.__internal.bringToFrontHandler,!0)}function ua(a){t(a.elements.header,"mousedown",a.__internal.beginMoveHandler),t(a.elements.header,"touchstart",a.__internal.beginMoveHandler,!1,!1)}function va(a){u(a.elements.header,"mousedown",a.__internal.beginMoveHandler),u(a.elements.header,"touchstart",a.__internal.beginMoveHandler,!1,!1)}function wa(a){t(a.elements.resizeHandle,"mousedown",a.__internal.beginResizeHandler),t(a.elements.resizeHandle,"touchstart",a.__internal.beginResizeHandler,!1,!1)}function xa(a){u(a.elements.resizeHandle,"mousedown",a.__internal.beginResizeHandler),u(a.elements.resizeHandle,"touchstart",a.__internal.beginResizeHandler,!1,!1)}function ya(a){t(a.elements.modal,"click",a.__internal.modalClickHandler)}function za(a){u(a.elements.modal,"click",a.__internal.modalClickHandler)}var Aa,Ba,Ca=[],Da=null,Ea=!1,Fa=a.navigator.userAgent.indexOf("Safari")>-1&&a.navigator.userAgent.indexOf("Chrome")<0,Ga={dimmer:'<div class="ajs-dimmer"></div>',modal:'<div class="ajs-modal" tabindex="0"></div>',dialog:'<div class="ajs-dialog" tabindex="0"></div>',reset:'<button class="ajs-reset"></button>',commands:'<div class="ajs-commands"><button class="ajs-pin"></button><button class="ajs-maximize"></button><button class="ajs-close"></button></div>',header:'<div class="ajs-header"></div>',body:'<div class="ajs-body"></div>',content:'<div class="ajs-content"></div>',footer:'<div class="ajs-footer"></div>',buttons:{primary:'<div class="ajs-primary ajs-buttons"></div>',auxiliary:'<div class="ajs-auxiliary ajs-buttons"></div>'},button:'<button class="ajs-button"></button>',resizeHandle:'<div class="ajs-handle"></div>'},Ha={animationIn:"ajs-in",animationOut:"ajs-out",base:"alertify",basic:"ajs-basic",capture:"ajs-capture",closable:"ajs-closable",fixed:"ajs-fixed",frameless:"ajs-frameless",hidden:"ajs-hidden",maximize:"ajs-maximize",maximized:"ajs-maximized",maximizable:"ajs-maximizable",modeless:"ajs-modeless",movable:"ajs-movable",noSelection:"ajs-no-selection",noOverflow:"ajs-no-overflow",noPadding:"ajs-no-padding",pin:"ajs-pin",pinnable:"ajs-pinnable",prefix:"ajs-",resizable:"ajs-resizable",restore:"ajs-restore",shake:"ajs-shake",unpinned:"ajs-unpinned",noTransition:"ajs-no-transition"},Ia="",Ja=0,Ka=!1,La=0,Ma=0,Na=!1,Oa=null,Pa=0,Qa=0,Ra="pageX",Sa="pageY",Ta=null,Ua=!1,Va=null,Wa=null,Xa=Number.Nan,Ya=0,Za=0,$a=0;return{__init:m,isOpen:function(){return this.__internal.isOpen},isModal:function(){return this.elements.root.className.indexOf(Ha.modeless)<0},isMaximized:function(){return this.elements.root.className.indexOf(Ha.maximized)>-1},isPinned:function(){return this.elements.root.className.indexOf(Ha.unpinned)<0},maximize:function(){return this.isMaximized()||K(this),this},restore:function(){return this.isMaximized()&&L(this),this},pin:function(){return this.isPinned()||I(this),this},unpin:function(){return this.isPinned()&&J(this),this},bringToFront:function(){return D(null,this),this},moveTo:function(a,b){if(!isNaN(a)&&!isNaN(b)){l("onmove",this);var c=this.elements.dialog,e=c,f=0,g=0;c.style.left&&(f-=parseInt(c.style.left,10)),c.style.top&&(g-=parseInt(c.style.top,10));do{f+=e.offsetLeft,g+=e.offsetTop}while(e=e.offsetParent);var h=a-f,i=b-g;d()&&(h*=-1),c.style.left=h+"px",c.style.top=i+"px",l("onmoved",this)}return this},resizeTo:function(a,b){var c=parseFloat(a),d=parseFloat(b),e=/(\d*\.\d+|\d+)%/;if(!isNaN(c)&&!isNaN(d)&&!0===this.get("resizable")){l("onresize",this),(""+a).match(e)&&(c=c/100*document.documentElement.clientWidth),(""+b).match(e)&&(d=d/100*document.documentElement.clientHeight);var f=this.elements.dialog;"none"!==f.style.maxWidth&&(f.style.minWidth=(Za=f.offsetWidth)+"px"),f.style.maxWidth="none",f.style.minHeight=this.elements.header.offsetHeight+this.elements.footer.offsetHeight+"px",f.style.width=c+"px",f.style.height=d+"px",l("onresized",this)}return this},setting:function(a,b){var c=this,d=F(this,this.__internal.options,function(a,b,d){E(c,a,b,d)},a,b);if("get"===d.op)return d.found?d.value:void 0!==this.settings?F(this,this.settings,this.settingUpdated||function(){},a,b).value:void 0;if("set"===d.op){if(d.items.length>0)for(var e=this.settingUpdated||function(){},f=0;f<d.items.length;f+=1){var g=d.items[f];g.found||void 0===this.settings||F(this,this.settings,e,g.key,g.value)}return this}},set:function(a,b){return this.setting(a,b),this},get:function(a){return this.setting(a)},setHeader:function(b){return"string"==typeof b?(g(this.elements.header),this.elements.header.innerHTML=b):b instanceof a.HTMLElement&&this.elements.header.firstChild!==b&&(g(this.elements.header),this.elements.header.appendChild(b)),this},setContent:function(b){return"string"==typeof b?(g(this.elements.content),this.elements.content.innerHTML=b):b instanceof a.HTMLElement&&this.elements.content.firstChild!==b&&(g(this.elements.content),this.elements.content.appendChild(b)),this},showModal:function(a){return this.show(!0,a)},show:function(a,d){if(m(this),this.__internal.isOpen){ha(this),na(this),b(this.elements.dialog,Ha.shake);var e=this;setTimeout(function(){c(e.elements.dialog,Ha.shake)},200)}else{if(this.__internal.isOpen=!0,q.push(this),y.defaults.maintainFocus&&(this.__internal.activeElement=document.activeElement),document.body.hasAttribute("tabindex")||document.body.setAttribute("tabindex",Ea="0"),"function"==typeof this.prepare&&this.prepare(),qa(this),void 0!==a&&this.set("modal",a),n(),s(),"string"==typeof d&&""!==d&&(this.__internal.className=d,b(this.elements.root,d)),this.get("startMaximized")?this.maximize():this.isMaximized()&&L(this),P(this),this.elements.root.removeAttribute("style"),c(this.elements.root,Ha.animationOut),b(this.elements.root,Ha.animationIn),clearTimeout(this.__internal.timerIn),this.__internal.timerIn=setTimeout(this.__internal.transitionInHandler,v.supported?1e3:100),Fa){var f=this.elements.root;f.style.display="none",setTimeout(function(){f.style.display="block"},0)}Da=this.elements.root.offsetWidth,c(this.elements.root,Ha.hidden),r(),"function"==typeof this.hooks.onshow&&this.hooks.onshow.call(this),l("onshow",this)}return this},close:function(){return this.__internal.isOpen&&!1!==l("onclosing",this)&&(ra(this),c(this.elements.root,Ha.animationIn),b(this.elements.root,Ha.animationOut),clearTimeout(this.__internal.timerOut),this.__internal.timerOut=setTimeout(this.__internal.transitionOutHandler,v.supported?1e3:100),b(this.elements.root,Ha.hidden),Da=this.elements.modal.offsetWidth,y.defaults.maintainFocus&&this.__internal.activeElement&&(this.__internal.activeElement.focus(),this.__internal.activeElement=null),void 0!==this.__internal.className&&""!==this.__internal.className&&c(this.elements.root,this.__internal.className),"function"==typeof this.hooks.onclose&&this.hooks.onclose.call(this),l("onclose",this),q.splice(q.indexOf(this),1),this.__internal.isOpen=!1,s()),q.length||"0"!==Ea||document.body.removeAttribute("tabindex"),this},closeOthers:function(){return y.closeAll(this),this},destroy:function(){return this.__internal&&(this.__internal.isOpen?(this.__internal.destroy=function(){i(this,m)},this.close()):this.__internal.destroy||i(this,m)),this}}}(),x=function(){function d(a){if(!a.__internal){a.__internal={position:y.defaults.notifier.position,delay:y.defaults.notifier.delay},l=document.createElement("DIV");("transitionOff"in p.notifier?p.notifier.transitionOff:p.transitionOff)&&(o=n.base+" ajs-no-transition"),h(a)}l.parentNode!==document.body&&document.body.appendChild(l)}function e(a){a.__internal.pushed=!0,m.push(a)}function f(a){m.splice(m.indexOf(a),1),a.__internal.pushed=!1}function h(a){switch(l.className=o,a.__internal.position){case"top-right":b(l,n.top+" "+n.right);break;case"top-left":b(l,n.top+" "+n.left);break;case"top-center":b(l,n.top+" "+n.center);break;case"bottom-left":b(l,n.bottom+" "+n.left);break;case"bottom-center":b(l,n.bottom+" "+n.center);break;default:case"bottom-right":b(l,n.bottom+" "+n.right)}}function i(d,h){function i(a,b){b.__internal.closeButton&&"true"!==a.target.getAttribute("data-close")||b.dismiss(!0)}function m(a,b){u(b.element,v.type,m),l.removeChild(b.element)}function o(a){return a.__internal||(a.__internal={pushed:!1,delay:void 0,timer:void 0,clickHandler:void 0,transitionEndHandler:void 0,transitionTimeout:void 0},a.__internal.clickHandler=j(a,i),a.__internal.transitionEndHandler=j(a,m)),a}function p(a){clearTimeout(a.__internal.timer),clearTimeout(a.__internal.transitionTimeout)}return o({element:d,push:function(a,c){if(!this.__internal.pushed){e(this),p(this);var d,f;switch(arguments.length){case 0:f=this.__internal.delay;break;case 1:"number"==typeof a?f=a:(d=a,f=this.__internal.delay);break;case 2:d=a,f=c}return this.__internal.closeButton=y.defaults.notifier.closeButton,void 0!==d&&this.setContent(d),x.__internal.position.indexOf("top")<0?l.appendChild(this.element):l.insertBefore(this.element,l.firstChild),k=this.element.offsetWidth,b(this.element,n.visible),t(this.element,"click",this.__internal.clickHandler),this.delay(f)}return this},ondismiss:function(){},callback:h,dismiss:function(a){return this.__internal.pushed&&(p(this),"function"==typeof this.ondismiss&&!1===this.ondismiss.call(this)||(u(this.element,"click",this.__internal.clickHandler),void 0!==this.element&&this.element.parentNode===l&&(this.__internal.transitionTimeout=setTimeout(this.__internal.transitionEndHandler,v.supported?1e3:100),c(this.element,n.visible),"function"==typeof this.callback&&this.callback.call(this,a)),f(this))),this},delay:function(a){if(p(this),this.__internal.delay=void 0===a||isNaN(+a)?x.__internal.delay:+a,this.__internal.delay>0){var b=this;this.__internal.timer=setTimeout(function(){b.dismiss()},1e3*this.__internal.delay)}return this},setContent:function(c){if("string"==typeof c?(g(this.element),this.element.innerHTML=c):c instanceof a.HTMLElement&&this.element.firstChild!==c&&(g(this.element),this.element.appendChild(c)),this.__internal.closeButton){var d=document.createElement("span");b(d,n.close),d.setAttribute("data-close",!0),this.element.appendChild(d)}return this},dismissOthers:function(){return x.dismissAll(this),this}})}var k,l,m=[],n=p.notifier.classes,o=n.base;return{setting:function(a,b){if(d(this),void 0===b)return this.__internal[a];switch(a){case"position":this.__internal.position=b,h(this);break;case"delay":this.__internal.delay=b}return this},set:function(a,b){return this.setting(a,b),this},get:function(a){return this.setting(a)},create:function(a,b){d(this);var c=document.createElement("div");return c.className=n.message+("string"==typeof a&&""!==a?" "+n.prefix+a:""),i(c,b)},dismissAll:function(a){for(var b=m.slice(0),c=0;c<b.length;c+=1){var d=b[c];void 0!==a&&a===d||d.dismiss()}}}}(),y=new m;y.dialog("alert",function(){return{main:function(a,b,c){var d,e,f;switch(arguments.length){case 1:e=a;break;case 2:"function"==typeof b?(e=a,f=b):(d=a,e=b);break;case 3:d=a,e=b,f=c}return this.set("title",d),this.set("message",e),this.set("onok",f),this},setup:function(){return{buttons:[{text:y.defaults.glossary.ok,key:o.ESC,invokeOnClose:!0,className:y.defaults.theme.ok}],focus:{element:0,select:!1},options:{maximizable:!1,resizable:!1}}},build:function(){},prepare:function(){},setMessage:function(a){this.setContent(a)},settings:{message:void 0,onok:void 0,label:void 0},settingUpdated:function(a,b,c){switch(a){case"message":this.setMessage(c);break;case"label":this.__internal.buttons[0].element&&(this.__internal.buttons[0].element.innerHTML=c)}},
callback:function(a){if("function"==typeof this.get("onok")){var b=this.get("onok").call(this,a);void 0!==b&&(a.cancel=!b)}}}}),y.dialog("confirm",function(){function a(a){null!==c.timer&&(clearInterval(c.timer),c.timer=null,a.__internal.buttons[c.index].element.innerHTML=c.text)}function b(b,d,e){a(b),c.duration=e,c.index=d,c.text=b.__internal.buttons[d].element.innerHTML,c.timer=setInterval(j(b,c.task),1e3),c.task(null,b)}var c={timer:null,index:null,text:null,duration:null,task:function(b,d){if(d.isOpen()){if(d.__internal.buttons[c.index].element.innerHTML=c.text+" (&#8207;"+c.duration+"&#8207;) ",c.duration-=1,-1===c.duration){a(d);var e=d.__internal.buttons[c.index],f=k(c.index,e);"function"==typeof d.callback&&d.callback.apply(d,[f]),!1!==f.close&&d.close()}}else a(d)}};return{main:function(a,b,c,d){var e,f,g,h;switch(arguments.length){case 1:f=a;break;case 2:f=a,g=b;break;case 3:f=a,g=b,h=c;break;case 4:e=a,f=b,g=c,h=d}return this.set("title",e),this.set("message",f),this.set("onok",g),this.set("oncancel",h),this},setup:function(){return{buttons:[{text:y.defaults.glossary.ok,key:o.ENTER,className:y.defaults.theme.ok},{text:y.defaults.glossary.cancel,key:o.ESC,invokeOnClose:!0,className:y.defaults.theme.cancel}],focus:{element:0,select:!1},options:{maximizable:!1,resizable:!1}}},build:function(){},prepare:function(){},setMessage:function(a){this.setContent(a)},settings:{message:null,labels:null,onok:null,oncancel:null,defaultFocus:null,reverseButtons:null},settingUpdated:function(a,b,c){switch(a){case"message":this.setMessage(c);break;case"labels":"ok"in c&&this.__internal.buttons[0].element&&(this.__internal.buttons[0].text=c.ok,this.__internal.buttons[0].element.innerHTML=c.ok),"cancel"in c&&this.__internal.buttons[1].element&&(this.__internal.buttons[1].text=c.cancel,this.__internal.buttons[1].element.innerHTML=c.cancel);break;case"reverseButtons":!0===c?this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element):this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element);break;case"defaultFocus":this.__internal.focus.element="ok"===c?0:1}},callback:function(b){a(this);var c;switch(b.index){case 0:"function"==typeof this.get("onok")&&void 0!==(c=this.get("onok").call(this,b))&&(b.cancel=!c);break;case 1:"function"==typeof this.get("oncancel")&&void 0!==(c=this.get("oncancel").call(this,b))&&(b.cancel=!c)}},autoOk:function(a){return b(this,0,a),this},autoCancel:function(a){return b(this,1,a),this}}}),y.dialog("prompt",function(){var b=document.createElement("INPUT"),c=document.createElement("P");return{main:function(a,b,c,d,e){var f,g,h,i,j;switch(arguments.length){case 1:g=a;break;case 2:g=a,h=b;break;case 3:g=a,h=b,i=c;break;case 4:g=a,h=b,i=c,j=d;break;case 5:f=a,g=b,h=c,i=d,j=e}return this.set("title",f),this.set("message",g),this.set("value",h),this.set("onok",i),this.set("oncancel",j),this},setup:function(){return{buttons:[{text:y.defaults.glossary.ok,key:o.ENTER,className:y.defaults.theme.ok},{text:y.defaults.glossary.cancel,key:o.ESC,invokeOnClose:!0,className:y.defaults.theme.cancel}],focus:{element:b,select:!0},options:{maximizable:!1,resizable:!1}}},build:function(){b.className=y.defaults.theme.input,b.setAttribute("type","text"),b.value=this.get("value"),this.elements.content.appendChild(c),this.elements.content.appendChild(b)},prepare:function(){},setMessage:function(b){"string"==typeof b?(g(c),c.innerHTML=b):b instanceof a.HTMLElement&&c.firstChild!==b&&(g(c),c.appendChild(b))},settings:{message:void 0,labels:void 0,onok:void 0,oncancel:void 0,value:"",type:"text",reverseButtons:void 0},settingUpdated:function(a,c,d){switch(a){case"message":this.setMessage(d);break;case"value":b.value=d;break;case"type":switch(d){case"text":case"color":case"date":case"datetime-local":case"email":case"month":case"number":case"password":case"search":case"tel":case"time":case"week":b.type=d;break;default:b.type="text"}break;case"labels":d.ok&&this.__internal.buttons[0].element&&(this.__internal.buttons[0].element.innerHTML=d.ok),d.cancel&&this.__internal.buttons[1].element&&(this.__internal.buttons[1].element.innerHTML=d.cancel);break;case"reverseButtons":!0===d?this.elements.buttons.primary.appendChild(this.__internal.buttons[0].element):this.elements.buttons.primary.appendChild(this.__internal.buttons[1].element)}},callback:function(a){var c;switch(a.index){case 0:this.settings.value=b.value,"function"==typeof this.get("onok")&&void 0!==(c=this.get("onok").call(this,a,this.settings.value))&&(a.cancel=!c);break;case 1:"function"==typeof this.get("oncancel")&&void 0!==(c=this.get("oncancel").call(this,a))&&(a.cancel=!c),a.cancel||(b.value=this.settings.value)}}}}),"object"==typeof module&&"object"==typeof module.exports?module.exports=y:"function"==typeof define&&define.amd?define([],function(){return y}):a.alertify||(a.alertify=y)}("undefined"!=typeof window?window:this);
/*!
 * Select2 4.0.13
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
; (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function (jQuery) {
    // This is needed so we can catch the AMD loader configuration and use it
    // The inner file should be wrapped (by `banner.start.js`) in a function that
    // returns the AMD loader references.
    var S2 = (function () {
        // Restore the Select2 AMD loader so it can be used
        // Needed mostly in the language files, where the loader is not inserted
        if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
            var S2 = jQuery.fn.select2.amd;
        }
        var S2; (function () {
            if (!S2 || !S2.requirejs) {
                if (!S2) { S2 = {}; } else { require = S2; }
                /**
                 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
                 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
                 */
                //Going sloppy to avoid 'use strict' string cost, but strict practices should
                //be followed.
                /*global setTimeout: false */

                var requirejs, require, define;
                (function (undef) {
                    var main, req, makeMap, handlers,
                        defined = {},
                        waiting = {},
                        config = {},
                        defining = {},
                        hasOwn = Object.prototype.hasOwnProperty,
                        aps = [].slice,
                        jsSuffixRegExp = /\.js$/;

                    function hasProp(obj, prop) {
                        return hasOwn.call(obj, prop);
                    }

                    /**
                     * Given a relative module name, like ./something, normalize it to
                     * a real name that can be mapped to a path.
                     * @param {String} name the relative name
                     * @param {String} baseName a real name that the name arg is relative
                     * to.
                     * @returns {String} normalized name
                     */
                    function normalize(name, baseName) {
                        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
                            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
                            baseParts = baseName && baseName.split("/"),
                            map = config.map,
                            starMap = (map && map['*']) || {};

                        //Adjust any relative paths.
                        if (name) {
                            name = name.split('/');
                            lastIndex = name.length - 1;

                            // If wanting node ID compatibility, strip .js from end
                            // of IDs. Have to do this here, and not in nameToUrl
                            // because node allows either .js or non .js to map
                            // to same file.
                            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                            }

                            // Starts with a '.' so need the baseName
                            if (name[0].charAt(0) === '.' && baseParts) {
                                //Convert baseName to array, and lop off the last part,
                                //so that . matches that 'directory' and not name of the baseName's
                                //module. For instance, baseName of 'one/two/three', maps to
                                //'one/two/three.js', but we want the directory, 'one/two' for
                                //this normalization.
                                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                                name = normalizedBaseParts.concat(name);
                            }

                            //start trimDots
                            for (i = 0; i < name.length; i++) {
                                part = name[i];
                                if (part === '.') {
                                    name.splice(i, 1);
                                    i -= 1;
                                } else if (part === '..') {
                                    // If at the start, or previous value is still ..,
                                    // keep them so that when converted to a path it may
                                    // still work when converted to a path, even though
                                    // as an ID it is less than ideal. In larger point
                                    // releases, may be better to just kick out an error.
                                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                                        continue;
                                    } else if (i > 0) {
                                        name.splice(i - 1, 2);
                                        i -= 2;
                                    }
                                }
                            }
                            //end trimDots

                            name = name.join('/');
                        }

                        //Apply map config if available.
                        if ((baseParts || starMap) && map) {
                            nameParts = name.split('/');

                            for (i = nameParts.length; i > 0; i -= 1) {
                                nameSegment = nameParts.slice(0, i).join("/");

                                if (baseParts) {
                                    //Find the longest baseName segment match in the config.
                                    //So, do joins on the biggest to smallest lengths of baseParts.
                                    for (j = baseParts.length; j > 0; j -= 1) {
                                        mapValue = map[baseParts.slice(0, j).join('/')];

                                        //baseName segment has  config, find if it has one for
                                        //this name.
                                        if (mapValue) {
                                            mapValue = mapValue[nameSegment];
                                            if (mapValue) {
                                                //Match, update name to the new value.
                                                foundMap = mapValue;
                                                foundI = i;
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (foundMap) {
                                    break;
                                }

                                //Check for a star map match, but just hold on to it,
                                //if there is a shorter segment match later in a matching
                                //config, then favor over this star map.
                                if (!foundStarMap && starMap && starMap[nameSegment]) {
                                    foundStarMap = starMap[nameSegment];
                                    starI = i;
                                }
                            }

                            if (!foundMap && foundStarMap) {
                                foundMap = foundStarMap;
                                foundI = starI;
                            }

                            if (foundMap) {
                                nameParts.splice(0, foundI, foundMap);
                                name = nameParts.join('/');
                            }
                        }

                        return name;
                    }

                    function makeRequire(relName, forceSync) {
                        return function () {
                            //A version of a require function that passes a moduleName
                            //value for items that may need to
                            //look up paths relative to the moduleName
                            var args = aps.call(arguments, 0);

                            //If first arg is not require('string'), and there is only
                            //one arg, it is the array form without a callback. Insert
                            //a null so that the following concat is correct.
                            if (typeof args[0] !== 'string' && args.length === 1) {
                                args.push(null);
                            }
                            return req.apply(undef, args.concat([relName, forceSync]));
                        };
                    }

                    function makeNormalize(relName) {
                        return function (name) {
                            return normalize(name, relName);
                        };
                    }

                    function makeLoad(depName) {
                        return function (value) {
                            defined[depName] = value;
                        };
                    }

                    function callDep(name) {
                        if (hasProp(waiting, name)) {
                            var args = waiting[name];
                            delete waiting[name];
                            defining[name] = true;
                            main.apply(undef, args);
                        }

                        if (!hasProp(defined, name) && !hasProp(defining, name)) {
                            throw new Error('No ' + name);
                        }
                        return defined[name];
                    }

                    //Turns a plugin!resource to [plugin, resource]
                    //with the plugin being undefined if the name
                    //did not have a plugin prefix.
                    function splitPrefix(name) {
                        var prefix,
                            index = name ? name.indexOf('!') : -1;
                        if (index > -1) {
                            prefix = name.substring(0, index);
                            name = name.substring(index + 1, name.length);
                        }
                        return [prefix, name];
                    }

                    //Creates a parts array for a relName where first part is plugin ID,
                    //second part is resource ID. Assumes relName has already been normalized.
                    function makeRelParts(relName) {
                        return relName ? splitPrefix(relName) : [];
                    }

                    /**
                     * Makes a name map, normalizing the name, and using a plugin
                     * for normalization if necessary. Grabs a ref to plugin
                     * too, as an optimization.
                     */
                    makeMap = function (name, relParts) {
                        var plugin,
                            parts = splitPrefix(name),
                            prefix = parts[0],
                            relResourceName = relParts[1];

                        name = parts[1];

                        if (prefix) {
                            prefix = normalize(prefix, relResourceName);
                            plugin = callDep(prefix);
                        }

                        //Normalize according
                        if (prefix) {
                            if (plugin && plugin.normalize) {
                                name = plugin.normalize(name, makeNormalize(relResourceName));
                            } else {
                                name = normalize(name, relResourceName);
                            }
                        } else {
                            name = normalize(name, relResourceName);
                            parts = splitPrefix(name);
                            prefix = parts[0];
                            name = parts[1];
                            if (prefix) {
                                plugin = callDep(prefix);
                            }
                        }

                        //Using ridiculous property names for space reasons
                        return {
                            f: prefix ? prefix + '!' + name : name, //fullName
                            n: name,
                            pr: prefix,
                            p: plugin
                        };
                    };

                    function makeConfig(name) {
                        return function () {
                            return (config && config.config && config.config[name]) || {};
                        };
                    }

                    handlers = {
                        require: function (name) {
                            return makeRequire(name);
                        },
                        exports: function (name) {
                            var e = defined[name];
                            if (typeof e !== 'undefined') {
                                return e;
                            } else {
                                return (defined[name] = {});
                            }
                        },
                        module: function (name) {
                            return {
                                id: name,
                                uri: '',
                                exports: defined[name],
                                config: makeConfig(name)
                            };
                        }
                    };

                    main = function (name, deps, callback, relName) {
                        var cjsModule, depName, ret, map, i, relParts,
                            args = [],
                            callbackType = typeof callback,
                            usingExports;

                        //Use name if no relName
                        relName = relName || name;
                        relParts = makeRelParts(relName);

                        //Call the callback to define the module, if necessary.
                        if (callbackType === 'undefined' || callbackType === 'function') {
                            //Pull out the defined dependencies and pass the ordered
                            //values to the callback.
                            //Default to [require, exports, module] if no deps
                            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
                            for (i = 0; i < deps.length; i += 1) {
                                map = makeMap(deps[i], relParts);
                                depName = map.f;

                                //Fast path CommonJS standard dependencies.
                                if (depName === "require") {
                                    args[i] = handlers.require(name);
                                } else if (depName === "exports") {
                                    //CommonJS module spec 1.1
                                    args[i] = handlers.exports(name);
                                    usingExports = true;
                                } else if (depName === "module") {
                                    //CommonJS module spec 1.1
                                    cjsModule = args[i] = handlers.module(name);
                                } else if (hasProp(defined, depName) ||
                                    hasProp(waiting, depName) ||
                                    hasProp(defining, depName)) {
                                    args[i] = callDep(depName);
                                } else if (map.p) {
                                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                                    args[i] = defined[depName];
                                } else {
                                    throw new Error(name + ' missing ' + depName);
                                }
                            }

                            ret = callback ? callback.apply(defined[name], args) : undefined;

                            if (name) {
                                //If setting exports via "module" is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                if (cjsModule && cjsModule.exports !== undef &&
                                    cjsModule.exports !== defined[name]) {
                                    defined[name] = cjsModule.exports;
                                } else if (ret !== undef || !usingExports) {
                                    //Use the return value from the function.
                                    defined[name] = ret;
                                }
                            }
                        } else if (name) {
                            //May just be an object definition for the module. Only
                            //worry about defining if have a module name.
                            defined[name] = callback;
                        }
                    };

                    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
                        if (typeof deps === "string") {
                            if (handlers[deps]) {
                                //callback in this case is really relName
                                return handlers[deps](callback);
                            }
                            //Just return the module wanted. In this scenario, the
                            //deps arg is the module name, and second arg (if passed)
                            //is just the relName.
                            //Normalize module name, if it contains . or ..
                            return callDep(makeMap(deps, makeRelParts(callback)).f);
                        } else if (!deps.splice) {
                            //deps is a config object, not an array.
                            config = deps;
                            if (config.deps) {
                                req(config.deps, config.callback);
                            }
                            if (!callback) {
                                return;
                            }

                            if (callback.splice) {
                                //callback is an array, which means it is a dependency list.
                                //Adjust args if there are dependencies
                                deps = callback;
                                callback = relName;
                                relName = null;
                            } else {
                                deps = undef;
                            }
                        }

                        //Support require(['a'])
                        callback = callback || function () { };

                        //If relName is a function, it is an errback handler,
                        //so remove it.
                        if (typeof relName === 'function') {
                            relName = forceSync;
                            forceSync = alt;
                        }

                        //Simulate async callback;
                        if (forceSync) {
                            main(undef, deps, callback, relName);
                        } else {
                            //Using a non-zero value because of concern for what old browsers
                            //do, and latest browsers "upgrade" to 4 if lower value is used:
                            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
                            //If want a value immediately, use require('id') instead -- something
                            //that works in almond on the global level, but not guaranteed and
                            //unlikely to work in other AMD implementations.
                            setTimeout(function () {
                                main(undef, deps, callback, relName);
                            }, 4);
                        }

                        return req;
                    };

                    /**
                     * Just drops the config on the floor, but returns req in case
                     * the config return value is used.
                     */
                    req.config = function (cfg) {
                        return req(cfg);
                    };

                    /**
                     * Expose module registry for debugging and tooling
                     */
                    requirejs._defined = defined;

                    define = function (name, deps, callback) {
                        if (typeof name !== 'string') {
                            throw new Error('See almond README: incorrect module build, no module name');
                        }

                        //This module may not have dependencies
                        if (!deps.splice) {
                            //deps is not an array, so probably means
                            //an object literal or factory function for
                            //the value. Adjust args.
                            callback = deps;
                            deps = [];
                        }

                        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
                            waiting[name] = [name, deps, callback];
                        }
                    };

                    define.amd = {
                        jQuery: true
                    };
                }());

                S2.requirejs = requirejs; S2.require = require; S2.define = define;
            }
        }());
        S2.define("almond", function () { });

        /* global jQuery:false, $:false */
        S2.define('jquery', [], function () {
            var _$ = jQuery || $;

            if (_$ == null && console && console.error) {
                console.error(
                    'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
                    'found. Make sure that you are including jQuery before Select2 on your ' +
                    'web page.'
                );
            }

            return _$;
        });

        S2.define('select2/utils', [
            'jquery'
        ], function ($) {
            var Utils = {};

            Utils.Extend = function (ChildClass, SuperClass) {
                var __hasProp = {}.hasOwnProperty;

                function BaseConstructor() {
                    this.constructor = ChildClass;
                }

                for (var key in SuperClass) {
                    if (__hasProp.call(SuperClass, key)) {
                        ChildClass[key] = SuperClass[key];
                    }
                }

                BaseConstructor.prototype = SuperClass.prototype;
                ChildClass.prototype = new BaseConstructor();
                ChildClass.__super__ = SuperClass.prototype;

                return ChildClass;
            };

            function getMethods(theClass) {
                var proto = theClass.prototype;

                var methods = [];

                for (var methodName in proto) {
                    var m = proto[methodName];

                    if (typeof m !== 'function') {
                        continue;
                    }

                    if (methodName === 'constructor') {
                        continue;
                    }

                    methods.push(methodName);
                }

                return methods;
            }

            Utils.Decorate = function (SuperClass, DecoratorClass) {
                var decoratedMethods = getMethods(DecoratorClass);
                var superMethods = getMethods(SuperClass);

                function DecoratedClass() {
                    var unshift = Array.prototype.unshift;

                    var argCount = DecoratorClass.prototype.constructor.length;

                    var calledConstructor = SuperClass.prototype.constructor;

                    if (argCount > 0) {
                        unshift.call(arguments, SuperClass.prototype.constructor);

                        calledConstructor = DecoratorClass.prototype.constructor;
                    }

                    calledConstructor.apply(this, arguments);
                }

                DecoratorClass.displayName = SuperClass.displayName;

                function ctr() {
                    this.constructor = DecoratedClass;
                }

                DecoratedClass.prototype = new ctr();

                for (var m = 0; m < superMethods.length; m++) {
                    var superMethod = superMethods[m];

                    DecoratedClass.prototype[superMethod] =
                        SuperClass.prototype[superMethod];
                }

                var calledMethod = function (methodName) {
                    // Stub out the original method if it's not decorating an actual method
                    var originalMethod = function () { };

                    if (methodName in DecoratedClass.prototype) {
                        originalMethod = DecoratedClass.prototype[methodName];
                    }

                    var decoratedMethod = DecoratorClass.prototype[methodName];

                    return function () {
                        var unshift = Array.prototype.unshift;

                        unshift.call(arguments, originalMethod);

                        return decoratedMethod.apply(this, arguments);
                    };
                };

                for (var d = 0; d < decoratedMethods.length; d++) {
                    var decoratedMethod = decoratedMethods[d];

                    DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
                }

                return DecoratedClass;
            };

            var Observable = function () {
                this.listeners = {};
            };

            Observable.prototype.on = function (event, callback) {
                this.listeners = this.listeners || {};

                if (event in this.listeners) {
                    this.listeners[event].push(callback);
                } else {
                    this.listeners[event] = [callback];
                }
            };

            Observable.prototype.trigger = function (event) {
                var slice = Array.prototype.slice;
                var params = slice.call(arguments, 1);

                this.listeners = this.listeners || {};

                // Params should always come in as an array
                if (params == null) {
                    params = [];
                }

                // If there are no arguments to the event, use a temporary object
                if (params.length === 0) {
                    params.push({});
                }

                // Set the `_type` of the first object to the event
                params[0]._type = event;

                if (event in this.listeners) {
                    this.invoke(this.listeners[event], slice.call(arguments, 1));
                }

                if ('*' in this.listeners) {
                    this.invoke(this.listeners['*'], arguments);
                }
            };

            Observable.prototype.invoke = function (listeners, params) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].apply(this, params);
                }
            };

            Utils.Observable = Observable;

            Utils.generateChars = function (length) {
                var chars = '';

                for (var i = 0; i < length; i++) {
                    var randomChar = Math.floor(Math.random() * 36);
                    chars += randomChar.toString(36);
                }

                return chars;
            };

            Utils.bind = function (func, context) {
                return function () {
                    func.apply(context, arguments);
                };
            };

            Utils._convertData = function (data) {
                for (var originalKey in data) {
                    var keys = originalKey.split('-');

                    var dataLevel = data;

                    if (keys.length === 1) {
                        continue;
                    }

                    for (var k = 0; k < keys.length; k++) {
                        var key = keys[k];

                        // Lowercase the first letter
                        // By default, dash-separated becomes camelCase
                        key = key.substring(0, 1).toLowerCase() + key.substring(1);

                        if (!(key in dataLevel)) {
                            dataLevel[key] = {};
                        }

                        if (k == keys.length - 1) {
                            dataLevel[key] = data[originalKey];
                        }

                        dataLevel = dataLevel[key];
                    }

                    delete data[originalKey];
                }

                return data;
            };

            Utils.hasScroll = function (index, el) {
                // Adapted from the function created by @ShadowScripter
                // and adapted by @BillBarry on the Stack Exchange Code Review website.
                // The original code can be found at
                // http://codereview.stackexchange.com/q/13338
                // and was designed to be used with the Sizzle selector engine.

                var $el = $(el);
                var overflowX = el.style.overflowX;
                var overflowY = el.style.overflowY;

                //Check both x and y declarations
                if (overflowX === overflowY &&
                    (overflowY === 'hidden' || overflowY === 'visible')) {
                    return false;
                }

                if (overflowX === 'scroll' || overflowY === 'scroll') {
                    return true;
                }

                return ($el.innerHeight() < el.scrollHeight ||
                    $el.innerWidth() < el.scrollWidth);
            };

            Utils.escapeMarkup = function (markup) {
                var replaceMap = {
                    '\\': '&#92;',
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    '\'': '&#39;',
                    '/': '&#47;'
                };

                // Do not try to escape the markup if it's not a string
                if (typeof markup !== 'string') {
                    return markup;
                }

                return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
                    return replaceMap[match];
                });
            };

            // Append an array of jQuery nodes to a given element.
            Utils.appendMany = function ($element, $nodes) {
                // jQuery 1.7.x does not support $.fn.append() with an array
                // Fall back to a jQuery object collection using $.fn.add()
                if ($.fn.jquery.substr(0, 3) === '1.7') {
                    var $jqNodes = $();

                    $.map($nodes, function (node) {
                        $jqNodes = $jqNodes.add(node);
                    });

                    $nodes = $jqNodes;
                }

                $element.append($nodes);
            };

            // Cache objects in Utils.__cache instead of $.data (see #4346)
            Utils.__cache = {};

            var id = 0;
            Utils.GetUniqueElementId = function (element) {
                // Get a unique element Id. If element has no id,
                // creates a new unique number, stores it in the id
                // attribute and returns the new id.
                // If an id already exists, it simply returns it.

                var select2Id = element.getAttribute('data-select2-id');
                if (select2Id == null) {
                    // If element has id, use it.
                    if (element.id) {
                        select2Id = element.id;
                        element.setAttribute('data-select2-id', select2Id);
                    } else {
                        element.setAttribute('data-select2-id', ++id);
                        select2Id = id.toString();
                    }
                }
                return select2Id;
            };

            Utils.StoreData = function (element, name, value) {
                // Stores an item in the cache for a specified element.
                // name is the cache key.
                var id = Utils.GetUniqueElementId(element);
                if (!Utils.__cache[id]) {
                    Utils.__cache[id] = {};
                }

                Utils.__cache[id][name] = value;
            };

            Utils.GetData = function (element, name) {
                // Retrieves a value from the cache by its key (name)
                // name is optional. If no name specified, return
                // all cache items for the specified element.
                // and for a specified element.
                var id = Utils.GetUniqueElementId(element);
                if (name) {
                    if (Utils.__cache[id]) {
                        if (Utils.__cache[id][name] != null) {
                            return Utils.__cache[id][name];
                        }
                        return $(element).data(name); // Fallback to HTML5 data attribs.
                    }
                    return $(element).data(name); // Fallback to HTML5 data attribs.
                } else {
                    return Utils.__cache[id];
                }
            };

            Utils.RemoveData = function (element) {
                // Removes all cached items for a specified element.
                var id = Utils.GetUniqueElementId(element);
                if (Utils.__cache[id] != null) {
                    delete Utils.__cache[id];
                }

                element.removeAttribute('data-select2-id');
            };

            return Utils;
        });

        S2.define('select2/results', [
            'jquery',
            './utils'
        ], function ($, Utils) {
            function Results($element, options, dataAdapter) {
                this.$element = $element;
                this.data = dataAdapter;
                this.options = options;

                Results.__super__.constructor.call(this);
            }

            Utils.Extend(Results, Utils.Observable);

            Results.prototype.render = function () {
                var $results = $(
                    '<ul class="select2-results__options" role="listbox"></ul>'
                );

                if (this.options.get('multiple')) {
                    $results.attr('aria-multiselectable', 'true');
                }

                this.$results = $results;

                return $results;
            };

            Results.prototype.clear = function () {
                this.$results.empty();
            };

            Results.prototype.displayMessage = function (params) {
                var escapeMarkup = this.options.get('escapeMarkup');

                this.clear();
                this.hideLoading();

                var $message = $(
                    '<li role="alert" aria-live="assertive"' +
                    ' class="select2-results__option"></li>'
                );

                var message = this.options.get('translations').get(params.message);

                $message.append(
                    escapeMarkup(
                        message(params.args)
                    )
                );

                $message[0].className += ' select2-results__message';

                this.$results.append($message);
            };

            Results.prototype.hideMessages = function () {
                this.$results.find('.select2-results__message').remove();
            };

            Results.prototype.append = function (data) {
                this.hideLoading();

                var $options = [];

                if (data.results == null || data.results.length === 0) {
                    if (this.$results.children().length === 0) {
                        this.trigger('results:message', {
                            message: 'noResults'
                        });
                    }

                    return;
                }

                data.results = this.sort(data.results);

                for (var d = 0; d < data.results.length; d++) {
                    var item = data.results[d];

                    var $option = this.option(item);

                    $options.push($option);
                }

                this.$results.append($options);
            };

            Results.prototype.position = function ($results, $dropdown) {
                var $resultsContainer = $dropdown.find('.select2-results');
                $resultsContainer.append($results);
            };

            Results.prototype.sort = function (data) {
                var sorter = this.options.get('sorter');

                return sorter(data);
            };

            Results.prototype.highlightFirstItem = function () {
                var $options = this.$results
                    .find('.select2-results__option[aria-selected]');

                var $selected = $options.filter('[aria-selected=true]');

                // Check if there are any selected options
                if ($selected.length > 0) {
                    // If there are selected options, highlight the first
                    $selected.first().trigger('mouseenter');
                } else {
                    // If there are no selected options, highlight the first option
                    // in the dropdown
                    $options.first().trigger('mouseenter');
                }

                this.ensureHighlightVisible();
            };

            Results.prototype.setClasses = function () {
                var self = this;

                this.data.current(function (selected) {
                    var selectedIds = $.map(selected, function (s) {
                        return s.id.toString();
                    });

                    var $options = self.$results
                        .find('.select2-results__option[aria-selected]');

                    $options.each(function () {
                        var $option = $(this);

                        var item = Utils.GetData(this, 'data');

                        // id needs to be converted to a string when comparing
                        var id = '' + item.id;

                        if ((item.element != null && item.element.selected) ||
                            (item.element == null && $.inArray(id, selectedIds) > -1)) {
                            $option.attr('aria-selected', 'true');
                        } else {
                            $option.attr('aria-selected', 'false');
                        }
                    });

                });
            };

            Results.prototype.showLoading = function (params) {
                this.hideLoading();

                var loadingMore = this.options.get('translations').get('searching');

                var loading = {
                    disabled: true,
                    loading: true,
                    text: loadingMore(params)
                };
                var $loading = this.option(loading);
                $loading.className += ' loading-results';

                this.$results.prepend($loading);
            };

            Results.prototype.hideLoading = function () {
                this.$results.find('.loading-results').remove();
            };

            Results.prototype.option = function (data) {
                var option = document.createElement('li');
                option.className = 'select2-results__option';

                var attrs = {
                    'role': 'option',
                    'aria-selected': 'false'
                };

                var matches = window.Element.prototype.matches ||
                    window.Element.prototype.msMatchesSelector ||
                    window.Element.prototype.webkitMatchesSelector;

                if ((data.element != null && matches.call(data.element, ':disabled')) ||
                    (data.element == null && data.disabled)) {
                    delete attrs['aria-selected'];
                    attrs['aria-disabled'] = 'true';
                }

                if (data.id == null) {
                    delete attrs['aria-selected'];
                }

                if (data._resultId != null) {
                    option.id = data._resultId;
                }

                if (data.title) {
                    option.title = data.title;
                }

                if (data.children) {
                    attrs.role = 'group';
                    attrs['aria-label'] = data.text;
                    delete attrs['aria-selected'];
                }

                for (var attr in attrs) {
                    var val = attrs[attr];

                    option.setAttribute(attr, val);
                }

                if (data.children) {
                    var $option = $(option);

                    var label = document.createElement('strong');
                    label.className = 'select2-results__group';

                    var $label = $(label);
                    this.template(data, label);

                    var $children = [];

                    for (var c = 0; c < data.children.length; c++) {
                        var child = data.children[c];

                        var $child = this.option(child);

                        $children.push($child);
                    }

                    var $childrenContainer = $('<ul></ul>', {
                        'class': 'select2-results__options select2-results__options--nested'
                    });

                    $childrenContainer.append($children);

                    $option.append(label);
                    $option.append($childrenContainer);
                } else {
                    this.template(data, option);
                }

                Utils.StoreData(option, 'data', data);

                return option;
            };

            Results.prototype.bind = function (container, $container) {
                var self = this;

                var id = container.id + '-results';

                this.$results.attr('id', id);

                container.on('results:all', function (params) {
                    self.clear();
                    self.append(params.data);

                    if (container.isOpen()) {
                        self.setClasses();
                        self.highlightFirstItem();
                    }
                });

                container.on('results:append', function (params) {
                    self.append(params.data);

                    if (container.isOpen()) {
                        self.setClasses();
                    }
                });

                container.on('query', function (params) {
                    self.hideMessages();
                    self.showLoading(params);
                });

                container.on('select', function () {
                    if (!container.isOpen()) {
                        return;
                    }

                    self.setClasses();

                    if (self.options.get('scrollAfterSelect')) {
                        self.highlightFirstItem();
                    }
                });

                container.on('unselect', function () {
                    if (!container.isOpen()) {
                        return;
                    }

                    self.setClasses();

                    if (self.options.get('scrollAfterSelect')) {
                        self.highlightFirstItem();
                    }
                });

                container.on('open', function () {
                    // When the dropdown is open, aria-expended="true"
                    self.$results.attr('aria-expanded', 'true');
                    self.$results.attr('aria-hidden', 'false');

                    self.setClasses();
                    self.ensureHighlightVisible();
                });

                container.on('close', function () {
                    // When the dropdown is closed, aria-expended="false"
                    self.$results.attr('aria-expanded', 'false');
                    self.$results.attr('aria-hidden', 'true');
                    self.$results.removeAttr('aria-activedescendant');
                });

                container.on('results:toggle', function () {
                    var $highlighted = self.getHighlightedResults();

                    if ($highlighted.length === 0) {
                        return;
                    }

                    $highlighted.trigger('mouseup');
                });

                container.on('results:select', function () {
                    var $highlighted = self.getHighlightedResults();

                    if ($highlighted.length === 0) {
                        return;
                    }

                    var data = Utils.GetData($highlighted[0], 'data');

                    if ($highlighted.attr('aria-selected') == 'true') {
                        self.trigger('close', {});
                    } else {
                        self.trigger('select', {
                            data: data
                        });
                    }
                });

                container.on('results:previous', function () {
                    var $highlighted = self.getHighlightedResults();

                    var $options = self.$results.find('[aria-selected]');

                    var currentIndex = $options.index($highlighted);

                    // If we are already at the top, don't move further
                    // If no options, currentIndex will be -1
                    if (currentIndex <= 0) {
                        return;
                    }

                    var nextIndex = currentIndex - 1;

                    // If none are highlighted, highlight the first
                    if ($highlighted.length === 0) {
                        nextIndex = 0;
                    }

                    var $next = $options.eq(nextIndex);

                    $next.trigger('mouseenter');

                    var currentOffset = self.$results.offset().top;
                    var nextTop = $next.offset().top;
                    var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

                    if (nextIndex === 0) {
                        self.$results.scrollTop(0);
                    } else if (nextTop - currentOffset < 0) {
                        self.$results.scrollTop(nextOffset);
                    }
                });

                container.on('results:next', function () {
                    var $highlighted = self.getHighlightedResults();

                    var $options = self.$results.find('[aria-selected]');

                    var currentIndex = $options.index($highlighted);

                    var nextIndex = currentIndex + 1;

                    // If we are at the last option, stay there
                    if (nextIndex >= $options.length) {
                        return;
                    }

                    var $next = $options.eq(nextIndex);

                    $next.trigger('mouseenter');

                    var currentOffset = self.$results.offset().top +
                        self.$results.outerHeight(false);
                    var nextBottom = $next.offset().top + $next.outerHeight(false);
                    var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

                    if (nextIndex === 0) {
                        self.$results.scrollTop(0);
                    } else if (nextBottom > currentOffset) {
                        self.$results.scrollTop(nextOffset);
                    }
                });

                container.on('results:focus', function (params) {
                    params.element.addClass('select2-results__option--highlighted');
                });

                container.on('results:message', function (params) {
                    self.displayMessage(params);
                });

                if ($.fn.mousewheel) {
                    this.$results.on('mousewheel', function (e) {
                        var top = self.$results.scrollTop();

                        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

                        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
                        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

                        if (isAtTop) {
                            self.$results.scrollTop(0);

                            e.preventDefault();
                            e.stopPropagation();
                        } else if (isAtBottom) {
                            self.$results.scrollTop(
                                self.$results.get(0).scrollHeight - self.$results.height()
                            );

                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }

                this.$results.on('mouseup', '.select2-results__option[aria-selected]',
                    function (evt) {
                        var $this = $(this);

                        var data = Utils.GetData(this, 'data');

                        if ($this.attr('aria-selected') === 'true') {
                            if (self.options.get('multiple')) {
                                self.trigger('unselect', {
                                    originalEvent: evt,
                                    data: data
                                });
                            } else {
                                self.trigger('close', {});
                            }

                            return;
                        }

                        self.trigger('select', {
                            originalEvent: evt,
                            data: data
                        });
                    });

                this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
                    function (evt) {
                        var data = Utils.GetData(this, 'data');

                        self.getHighlightedResults()
                            .removeClass('select2-results__option--highlighted');

                        self.trigger('results:focus', {
                            data: data,
                            element: $(this)
                        });
                    });
            };

            Results.prototype.getHighlightedResults = function () {
                var $highlighted = this.$results
                    .find('.select2-results__option--highlighted');

                return $highlighted;
            };

            Results.prototype.destroy = function () {
                this.$results.remove();
            };

            Results.prototype.ensureHighlightVisible = function () {
                var $highlighted = this.getHighlightedResults();

                if ($highlighted.length === 0) {
                    return;
                }

                var $options = this.$results.find('[aria-selected]');

                var currentIndex = $options.index($highlighted);

                var currentOffset = this.$results.offset().top;
                var nextTop = $highlighted.offset().top;
                var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

                var offsetDelta = nextTop - currentOffset;
                nextOffset -= $highlighted.outerHeight(false) * 2;

                if (currentIndex <= 2) {
                    this.$results.scrollTop(0);
                } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
                    this.$results.scrollTop(nextOffset);
                }
            };

            Results.prototype.template = function (result, container) {
                var template = this.options.get('templateResult');
                var escapeMarkup = this.options.get('escapeMarkup');

                var content = template(result, container);

                if (content == null) {
                    container.style.display = 'none';
                } else if (typeof content === 'string') {
                    container.innerHTML = escapeMarkup(content);
                } else {
                    $(container).append(content);
                }
            };

            return Results;
        });

        S2.define('select2/keys', [

        ], function () {
            var KEYS = {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                DELETE: 46
            };

            return KEYS;
        });

        S2.define('select2/selection/base', [
            'jquery',
            '../utils',
            '../keys'
        ], function ($, Utils, KEYS) {
            function BaseSelection($element, options) {
                this.$element = $element;
                this.options = options;

                BaseSelection.__super__.constructor.call(this);
            }

            Utils.Extend(BaseSelection, Utils.Observable);

            BaseSelection.prototype.render = function () {
                var $selection = $(
                    '<span class="select2-selection" role="combobox" ' +
                    ' aria-haspopup="true" aria-expanded="false">' +
                    '</span>'
                );

                this._tabindex = 0;

                if (Utils.GetData(this.$element[0], 'old-tabindex') != null) {
                    this._tabindex = Utils.GetData(this.$element[0], 'old-tabindex');
                } else if (this.$element.attr('tabindex') != null) {
                    this._tabindex = this.$element.attr('tabindex');
                }

                $selection.attr('title', this.$element.attr('title'));
                $selection.attr('tabindex', this._tabindex);
                $selection.attr('aria-disabled', 'false');

                this.$selection = $selection;

                return $selection;
            };

            BaseSelection.prototype.bind = function (container, $container) {
                var self = this;

                var resultsId = container.id + '-results';

                this.container = container;

                this.$selection.on('focus', function (evt) {
                    self.trigger('focus', evt);
                });

                this.$selection.on('blur', function (evt) {
                    self._handleBlur(evt);
                });

                this.$selection.on('keydown', function (evt) {
                    self.trigger('keypress', evt);

                    if (evt.which === KEYS.SPACE) {
                        evt.preventDefault();
                    }
                });

                container.on('results:focus', function (params) {
                    self.$selection.attr('aria-activedescendant', params.data._resultId);
                });

                container.on('selection:update', function (params) {
                    self.update(params.data);
                });

                container.on('open', function () {
                    // When the dropdown is open, aria-expanded="true"
                    self.$selection.attr('aria-expanded', 'true');
                    self.$selection.attr('aria-owns', resultsId);

                    self._attachCloseHandler(container);
                });

                container.on('close', function () {
                    // When the dropdown is closed, aria-expanded="false"
                    self.$selection.attr('aria-expanded', 'false');
                    self.$selection.removeAttr('aria-activedescendant');
                    self.$selection.removeAttr('aria-owns');

                    self.$selection.trigger('focus');

                    self._detachCloseHandler(container);
                });

                container.on('enable', function () {
                    self.$selection.attr('tabindex', self._tabindex);
                    self.$selection.attr('aria-disabled', 'false');
                });

                container.on('disable', function () {
                    //self.$selection.attr('tabindex', '-1');
                    self.$selection.attr('tabindex', self._tabindex);
                    self.$selection.attr('aria-disabled', 'true');
                });
            };

            BaseSelection.prototype._handleBlur = function (evt) {
                var self = this;

                // This needs to be delayed as the active element is the body when the tab
                // key is pressed, possibly along with others.
                window.setTimeout(function () {
                    // Don't trigger `blur` if the focus is still in the selection
                    if (
                        (document.activeElement == self.$selection[0]) ||
                        ($.contains(self.$selection[0], document.activeElement))
                    ) {
                        return;
                    }

                    self.trigger('blur', evt);
                }, 1);
            };

            BaseSelection.prototype._attachCloseHandler = function (container) {

                $(document.body).on('mousedown.select2.' + container.id, function (e) {
                    var $target = $(e.target);

                    var $select = $target.closest('.select2');

                    var $all = $('.select2.select2-container--open');

                    $all.each(function () {
                        if (this == $select[0]) {
                            return;
                        }

                        var $element = Utils.GetData(this, 'element');

                        $element.select2('close');
                    });
                });
            };

            BaseSelection.prototype._detachCloseHandler = function (container) {
                $(document.body).off('mousedown.select2.' + container.id);
            };

            BaseSelection.prototype.position = function ($selection, $container) {
                var $selectionContainer = $container.find('.selection');
                $selectionContainer.append($selection);
            };

            BaseSelection.prototype.destroy = function () {
                this._detachCloseHandler(this.container);
            };

            BaseSelection.prototype.update = function (data) {
                throw new Error('The `update` method must be defined in child classes.');
            };

            /**
             * Helper method to abstract the "enabled" (not "disabled") state of this
             * object.
             *
             * @return {true} if the instance is not disabled.
             * @return {false} if the instance is disabled.
             */
            BaseSelection.prototype.isEnabled = function () {
                return !this.isDisabled();
            };

            /**
             * Helper method to abstract the "disabled" state of this object.
             *
             * @return {true} if the disabled option is true.
             * @return {false} if the disabled option is false.
             */
            BaseSelection.prototype.isDisabled = function () {
                return this.options.get('disabled');
            };

            return BaseSelection;
        });

        S2.define('select2/selection/single', [
            'jquery',
            './base',
            '../utils',
            '../keys'
        ], function ($, BaseSelection, Utils, KEYS) {
            function SingleSelection() {
                SingleSelection.__super__.constructor.apply(this, arguments);
            }

            Utils.Extend(SingleSelection, BaseSelection);

            SingleSelection.prototype.render = function () {
                var $selection = SingleSelection.__super__.render.call(this);

                $selection.addClass('select2-selection--single');

                $selection.html(
                    '<span class="select2-selection__rendered"></span>' +
                    '<span class="select2-selection__arrow" role="presentation">' +
                    '<i class="fas fa-angle-down"></i>' +
                    '</span>'
                );

                return $selection;
            };

            SingleSelection.prototype.bind = function (container, $container) {
                var self = this;

                SingleSelection.__super__.bind.apply(this, arguments);

                var id = container.id + '-container';

                this.$selection.find('.select2-selection__rendered')
                    .attr('id', id)
                    .attr('role', 'textbox')
                    .attr('aria-readonly', 'true');
                this.$selection.attr('aria-labelledby', id);

                this.$selection.on('mousedown', function (evt) {
                    // Only respond to left clicks
                    if (evt.which !== 1) {
                        return;
                    }

                    self.trigger('toggle', {
                        originalEvent: evt
                    });
                });

                this.$selection.on('focus', function (evt) {
                    // User focuses on the container
                });

                this.$selection.on('blur', function (evt) {
                    // User exits the container
                });

                container.on('focus', function (evt) {
                    if (!container.isOpen()) {
                        self.$selection.trigger('focus');
                    }
                });
            };

            SingleSelection.prototype.clear = function () {
                var $rendered = this.$selection.find('.select2-selection__rendered');
                $rendered.empty();
                $rendered.removeAttr('title'); // clear tooltip on empty
            };

            SingleSelection.prototype.display = function (data, container) {
                var template = this.options.get('templateSelection');
                var escapeMarkup = this.options.get('escapeMarkup');

                return escapeMarkup(template(data, container));
            };

            SingleSelection.prototype.selectionContainer = function () {
                return $('<span></span>');
            };

            SingleSelection.prototype.update = function (data) {
                if (data.length === 0) {
                    this.clear();
                    return;
                }

                var selection = data[0];

                var $rendered = this.$selection.find('.select2-selection__rendered');
                var formatted = this.display(selection, $rendered);

                $rendered.empty().append(formatted);

                var title = selection.title || selection.text;

                if (title) {
                    $rendered.attr('title', title);
                } else {
                    $rendered.removeAttr('title');
                }
            };

            return SingleSelection;
        });

        S2.define('select2/selection/multiple', [
            'jquery',
            './base',
            '../utils'
        ], function ($, BaseSelection, Utils) {
            function MultipleSelection($element, options) {
                MultipleSelection.__super__.constructor.apply(this, arguments);
            }

            Utils.Extend(MultipleSelection, BaseSelection);

            MultipleSelection.prototype.render = function () {
                var $selection = MultipleSelection.__super__.render.call(this);

                $selection.addClass('select2-selection--multiple');

                $selection.html(
                    '<ul class="select2-selection__rendered"></ul>'
                );

                return $selection;
            };

            MultipleSelection.prototype.bind = function (container, $container) {
                var self = this;

                MultipleSelection.__super__.bind.apply(this, arguments);

                this.$selection.on('click', function (evt) {
                    self.trigger('toggle', {
                        originalEvent: evt
                    });
                });

                this.$selection.on(
                    'click',
                    '.select2-selection__choice__remove',
                    function (evt) {
                        // Ignore the event if it is disabled
                        if (self.isDisabled()) {
                            return;
                        }


                        
                        var $remove = $(this);
                        var $selection = $remove.parent();

                        var data = Utils.GetData($selection[0], 'data');

                        self.trigger('unselect', {
                            originalEvent: evt,
                            data: data
                        });
                    }
                );
            };

            MultipleSelection.prototype.clear = function () {
                var $rendered = this.$selection.find('.select2-selection__rendered');
                $rendered.empty();
                $rendered.removeAttr('title');
            };

            MultipleSelection.prototype.display = function (data, container) {
                var template = this.options.get('templateSelection');
                var escapeMarkup = this.options.get('escapeMarkup');

                return escapeMarkup(template(data, container));
            };

            MultipleSelection.prototype.selectionContainer = function () {
                var $container = $(
                    '<li class="select2-selection__choice">' +
                    '<span class="select2-selection__choice__remove" role="presentation">' +
                    '&times;' +
                    '</span>' +
                    '</li>'
                );

                return $container;
            };

            MultipleSelection.prototype.update = function (data) {
                this.clear();

                if (data.length === 0) {
                    return;
                }

                var $selections = [];

                for (var d = 0; d < data.length; d++) {
                    var selection = data[d];

                    var $selection = this.selectionContainer();
                    var formatted = this.display(selection, $selection);

                    $selection.append(formatted);

                    var title = selection.title || selection.text;

                    if (title) {
                        $selection.attr('title', title);
                    }

                    Utils.StoreData($selection[0], 'data', selection);

                    $selections.push($selection);
                }

                var $rendered = this.$selection.find('.select2-selection__rendered');

                Utils.appendMany($rendered, $selections);
            };

            return MultipleSelection;
        });

        S2.define('select2/selection/placeholder', [
            '../utils'
        ], function (Utils) {
            function Placeholder(decorated, $element, options) {
                this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

                decorated.call(this, $element, options);
            }

            Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
                if (typeof placeholder === 'string') {
                    placeholder = {
                        id: '',
                        text: placeholder
                    };
                }

                return placeholder;
            };

            Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
                var $placeholder = this.selectionContainer();

                $placeholder.html(this.display(placeholder));
                $placeholder.addClass('select2-selection__placeholder')
                    .removeClass('select2-selection__choice');

                return $placeholder;
            };

            Placeholder.prototype.update = function (decorated, data) {
                var singlePlaceholder = (
                    data.length == 1 && data[0].id != this.placeholder.id
                );
                var multipleSelections = data.length > 1;

                if (multipleSelections || singlePlaceholder) {
                    return decorated.call(this, data);
                }

                this.clear();

                var $placeholder = this.createPlaceholder(this.placeholder);

                this.$selection.find('.select2-selection__rendered').append($placeholder);
            };

            return Placeholder;
        });

        S2.define('select2/selection/allowClear', [
            'jquery',
            '../keys',
            '../utils'
        ], function ($, KEYS, Utils) {
            function AllowClear() { }

            AllowClear.prototype.bind = function (decorated, container, $container) {
                var self = this;

                decorated.call(this, container, $container);

                if (this.placeholder == null) {
                    if (this.options.get('debug') && window.console && console.error) {
                        console.error(
                            'Select2: The `allowClear` option should be used in combination ' +
                            'with the `placeholder` option.'
                        );
                    }
                }

                this.$selection.on('mousedown', '.select2-selection__clear',
                    function (evt) {
                        self._handleClear(evt);
                    });

                container.on('keypress', function (evt) {
                    self._handleKeyboardClear(evt, container);
                });
            };

            AllowClear.prototype._handleClear = function (_, evt) {
                // Ignore the event if it is disabled
                if (this.isDisabled()) {
                    return;
                }

                var $clear = this.$selection.find('.select2-selection__clear');

                // Ignore the event if nothing has been selected
                if ($clear.length === 0) {
                    return;
                }

                evt.stopPropagation();

                var data = Utils.GetData($clear[0], 'data');

                var previousVal = this.$element.val();
                this.$element.val(this.placeholder.id);

                var unselectData = {
                    data: data
                };
                this.trigger('clear', unselectData);
                if (unselectData.prevented) {
                    this.$element.val(previousVal);
                    return;
                }

                for (var d = 0; d < data.length; d++) {
                    unselectData = {
                        data: data[d]
                    };

                    // Trigger the `unselect` event, so people can prevent it from being
                    // cleared.
                    this.trigger('unselect', unselectData);

                    // If the event was prevented, don't clear it out.
                    if (unselectData.prevented) {
                        this.$element.val(previousVal);
                        return;
                    }
                }

                this.$element.trigger('input').trigger('change');

                this.trigger('toggle', {});
            };

            AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
                if (container.isOpen()) {
                    return;
                }

                if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
                    this._handleClear(evt);
                }
            };

            AllowClear.prototype.update = function (decorated, data) {
                decorated.call(this, data);

                if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
                    data.length === 0) {
                    return;
                }

                var removeAll = this.options.get('translations').get('removeAllItems');

                var $remove = $(
                    '<span class="select2-selection__clear" title="' + removeAll() + '">' +
                    '&times;' +
                    '</span>'
                );
                Utils.StoreData($remove[0], 'data', data);

                this.$selection.find('.select2-selection__rendered').prepend($remove);
            };

            return AllowClear;
        });

        S2.define('select2/selection/search', [
            'jquery',
            '../utils',
            '../keys'
        ], function ($, Utils, KEYS) {
            function Search(decorated, $element, options) {
                decorated.call(this, $element, options);
            }

            Search.prototype.render = function (decorated) {
                var $search = $(
                    '<li class="select2-search select2-search--inline">' +
                    '<input class="select2-search__field" type="search" tabindex="-1"' +
                    ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
                    ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
                    '</li>'
                );

                this.$searchContainer = $search;
                this.$search = $search.find('input');

                var $rendered = decorated.call(this);
                this._transferTabIndex();

                return $rendered;
            };

            Search.prototype.bind = function (decorated, container, $container) {
                var self = this;

                var resultsId = container.id + '-results';

                decorated.call(this, container, $container);

                container.on('open', function () {
                    self.$search.attr('aria-controls', resultsId);
                    self.$search.trigger('focus');
                });

                container.on('close', function () {
                    self.$search.val('');
                    self.$search.removeAttr('aria-controls');
                    self.$search.removeAttr('aria-activedescendant');
                    self.$search.trigger('focus');
                });

                container.on('enable', function () {
                    self.$search.prop('disabled', false);

                    self._transferTabIndex();
                });

                container.on('disable', function () {
                    self.$search.prop('disabled', true);
                });

                container.on('focus', function (evt) {
                    self.$search.trigger('focus');
                });

                container.on('results:focus', function (params) {
                    if (params.data._resultId) {
                        self.$search.attr('aria-activedescendant', params.data._resultId);
                    } else {
                        self.$search.removeAttr('aria-activedescendant');
                    }
                });

                this.$selection.on('focusin', '.select2-search--inline', function (evt) {
                    self.trigger('focus', evt);
                });

                this.$selection.on('focusout', '.select2-search--inline', function (evt) {
                    self._handleBlur(evt);
                });

                this.$selection.on('keydown', '.select2-search--inline', function (evt) {
                    evt.stopPropagation();

                    self.trigger('keypress', evt);

                    self._keyUpPrevented = evt.isDefaultPrevented();

                    var key = evt.which;

                    if (key === KEYS.BACKSPACE && self.$search.val() === '') {
                        var $previousChoice = self.$searchContainer
                            .prev('.select2-selection__choice');

                        if ($previousChoice.length > 0) {
                            var item = Utils.GetData($previousChoice[0], 'data');

                            self.searchRemoveChoice(item);

                            evt.preventDefault();
                        }
                    }
                });

                this.$selection.on('click', '.select2-search--inline', function (evt) {
                    if (self.$search.val()) {
                        evt.stopPropagation();
                    }
                });

                // Try to detect the IE version should the `documentMode` property that
                // is stored on the document. This is only implemented in IE and is
                // slightly cleaner than doing a user agent check.
                // This property is not available in Edge, but Edge also doesn't have
                // this bug.
                var msie = document.documentMode;
                var disableInputEvents = msie && msie <= 11;

                // Workaround for browsers which do not support the `input` event
                // This will prevent double-triggering of events for browsers which support
                // both the `keyup` and `input` events.
                this.$selection.on(
                    'input.searchcheck',
                    '.select2-search--inline',
                    function (evt) {
                        // IE will trigger the `input` event when a placeholder is used on a
                        // search box. To get around this issue, we are forced to ignore all
                        // `input` events in IE and keep using `keyup`.
                        if (disableInputEvents) {
                            self.$selection.off('input.search input.searchcheck');
                            return;
                        }

                        // Unbind the duplicated `keyup` event
                        self.$selection.off('keyup.search');
                    }
                );

                this.$selection.on(
                    'keyup.search input.search',
                    '.select2-search--inline',
                    function (evt) {
                        // IE will trigger the `input` event when a placeholder is used on a
                        // search box. To get around this issue, we are forced to ignore all
                        // `input` events in IE and keep using `keyup`.
                        if (disableInputEvents && evt.type === 'input') {
                            self.$selection.off('input.search input.searchcheck');
                            return;
                        }

                        var key = evt.which;

                        // We can freely ignore events from modifier keys
                        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
                            return;
                        }

                        // Tabbing will be handled during the `keydown` phase
                        if (key == KEYS.TAB) {
                            return;
                        }

                        self.handleSearch(evt);
                    }
                );
            };

            /**
             * This method will transfer the tabindex attribute from the rendered
             * selection to the search box. This allows for the search box to be used as
             * the primary focus instead of the selection container.
             *
             * @private
             */
            Search.prototype._transferTabIndex = function (decorated) {

                this.$search.attr('tabindex', this.$selection.attr('tabindex'));
                this.$selection.attr('tabindex', '-1');
            };

            Search.prototype.createPlaceholder = function (decorated, placeholder) {
                this.$search.attr('placeholder', placeholder.text);
            };

            Search.prototype.update = function (decorated, data) {
                var searchHadFocus = this.$search[0] == document.activeElement;

                this.$search.attr('placeholder', '');

                decorated.call(this, data);

                this.$selection.find('.select2-selection__rendered')
                    .append(this.$searchContainer);

                this.resizeSearch();
                if (searchHadFocus) {
                    this.$search.trigger('focus');
                }
            };

            Search.prototype.handleSearch = function () {
                this.resizeSearch();

                if (!this._keyUpPrevented) {
                    var input = this.$search.val();

                    this.trigger('query', {
                        term: input
                    });
                }

                this._keyUpPrevented = false;
            };

            Search.prototype.searchRemoveChoice = function (decorated, item) {
                this.trigger('unselect', {
                    data: item
                });

                this.$search.val(item.text);
                this.handleSearch();
            };

            Search.prototype.resizeSearch = function () {
                this.$search.css('width', '25px');

                var width = '';

                if (this.$search.attr('placeholder') !== '') {
                    width = this.$selection.find('.select2-selection__rendered').width();
                } else {
                    var minimumWidth = this.$search.val().length + 1;

                    width = (minimumWidth * 0.75) + 'em';
                }

                this.$search.css('width', width);
            };

            return Search;
        });

        S2.define('select2/selection/eventRelay', [
            'jquery'
        ], function ($) {
            function EventRelay() { }

            EventRelay.prototype.bind = function (decorated, container, $container) {
                var self = this;
                var relayEvents = [
                    'open', 'opening',
                    'close', 'closing',
                    'select', 'selecting',
                    'unselect', 'unselecting',
                    'clear', 'clearing'
                ];

                var preventableEvents = [
                    'opening', 'closing', 'selecting', 'unselecting', 'clearing'
                ];

                decorated.call(this, container, $container);

                container.on('*', function (name, params) {
                    // Ignore events that should not be relayed
                    if ($.inArray(name, relayEvents) === -1) {
                        return;
                    }

                    // The parameters should always be an object
                    params = params || {};

                    // Generate the jQuery event for the Select2 event
                    var evt = $.Event('select2:' + name, {
                        params: params
                    });

                    self.$element.trigger(evt);

                    // Only handle preventable events if it was one
                    if ($.inArray(name, preventableEvents) === -1) {
                        return;
                    }

                    params.prevented = evt.isDefaultPrevented();
                });
            };

            return EventRelay;
        });

        S2.define('select2/translation', [
            'jquery',
            'require'
        ], function ($, require) {
            function Translation(dict) {
                this.dict = dict || {};
            }

            Translation.prototype.all = function () {
                return this.dict;
            };

            Translation.prototype.get = function (key) {
                return this.dict[key];
            };

            Translation.prototype.extend = function (translation) {
                this.dict = $.extend({}, translation.all(), this.dict);
            };

            // Static functions

            Translation._cache = {};

            Translation.loadPath = function (path) {
                if (!(path in Translation._cache)) {
                    var translations = require(path);

                    Translation._cache[path] = translations;
                }

                return new Translation(Translation._cache[path]);
            };

            return Translation;
        });

        S2.define('select2/diacritics', [

        ], function () {
            var diacritics = {
                '\u24B6': 'A',
                '\uFF21': 'A',
                '\u00C0': 'A',
                '\u00C1': 'A',
                '\u00C2': 'A',
                '\u1EA6': 'A',
                '\u1EA4': 'A',
                '\u1EAA': 'A',
                '\u1EA8': 'A',
                '\u00C3': 'A',
                '\u0100': 'A',
                '\u0102': 'A',
                '\u1EB0': 'A',
                '\u1EAE': 'A',
                '\u1EB4': 'A',
                '\u1EB2': 'A',
                '\u0226': 'A',
                '\u01E0': 'A',
                '\u00C4': 'A',
                '\u01DE': 'A',
                '\u1EA2': 'A',
                '\u00C5': 'A',
                '\u01FA': 'A',
                '\u01CD': 'A',
                '\u0200': 'A',
                '\u0202': 'A',
                '\u1EA0': 'A',
                '\u1EAC': 'A',
                '\u1EB6': 'A',
                '\u1E00': 'A',
                '\u0104': 'A',
                '\u023A': 'A',
                '\u2C6F': 'A',
                '\uA732': 'AA',
                '\u00C6': 'AE',
                '\u01FC': 'AE',
                '\u01E2': 'AE',
                '\uA734': 'AO',
                '\uA736': 'AU',
                '\uA738': 'AV',
                '\uA73A': 'AV',
                '\uA73C': 'AY',
                '\u24B7': 'B',
                '\uFF22': 'B',
                '\u1E02': 'B',
                '\u1E04': 'B',
                '\u1E06': 'B',
                '\u0243': 'B',
                '\u0182': 'B',
                '\u0181': 'B',
                '\u24B8': 'C',
                '\uFF23': 'C',
                '\u0106': 'C',
                '\u0108': 'C',
                '\u010A': 'C',
                '\u010C': 'C',
                '\u00C7': 'C',
                '\u1E08': 'C',
                '\u0187': 'C',
                '\u023B': 'C',
                '\uA73E': 'C',
                '\u24B9': 'D',
                '\uFF24': 'D',
                '\u1E0A': 'D',
                '\u010E': 'D',
                '\u1E0C': 'D',
                '\u1E10': 'D',
                '\u1E12': 'D',
                '\u1E0E': 'D',
                '\u0110': 'D',
                '\u018B': 'D',
                '\u018A': 'D',
                '\u0189': 'D',
                '\uA779': 'D',
                '\u01F1': 'DZ',
                '\u01C4': 'DZ',
                '\u01F2': 'Dz',
                '\u01C5': 'Dz',
                '\u24BA': 'E',
                '\uFF25': 'E',
                '\u00C8': 'E',
                '\u00C9': 'E',
                '\u00CA': 'E',
                '\u1EC0': 'E',
                '\u1EBE': 'E',
                '\u1EC4': 'E',
                '\u1EC2': 'E',
                '\u1EBC': 'E',
                '\u0112': 'E',
                '\u1E14': 'E',
                '\u1E16': 'E',
                '\u0114': 'E',
                '\u0116': 'E',
                '\u00CB': 'E',
                '\u1EBA': 'E',
                '\u011A': 'E',
                '\u0204': 'E',
                '\u0206': 'E',
                '\u1EB8': 'E',
                '\u1EC6': 'E',
                '\u0228': 'E',
                '\u1E1C': 'E',
                '\u0118': 'E',
                '\u1E18': 'E',
                '\u1E1A': 'E',
                '\u0190': 'E',
                '\u018E': 'E',
                '\u24BB': 'F',
                '\uFF26': 'F',
                '\u1E1E': 'F',
                '\u0191': 'F',
                '\uA77B': 'F',
                '\u24BC': 'G',
                '\uFF27': 'G',
                '\u01F4': 'G',
                '\u011C': 'G',
                '\u1E20': 'G',
                '\u011E': 'G',
                '\u0120': 'G',
                '\u01E6': 'G',
                '\u0122': 'G',
                '\u01E4': 'G',
                '\u0193': 'G',
                '\uA7A0': 'G',
                '\uA77D': 'G',
                '\uA77E': 'G',
                '\u24BD': 'H',
                '\uFF28': 'H',
                '\u0124': 'H',
                '\u1E22': 'H',
                '\u1E26': 'H',
                '\u021E': 'H',
                '\u1E24': 'H',
                '\u1E28': 'H',
                '\u1E2A': 'H',
                '\u0126': 'H',
                '\u2C67': 'H',
                '\u2C75': 'H',
                '\uA78D': 'H',
                '\u24BE': 'I',
                '\uFF29': 'I',
                '\u00CC': 'I',
                '\u00CD': 'I',
                '\u00CE': 'I',
                '\u0128': 'I',
                '\u012A': 'I',
                '\u012C': 'I',
                '\u0130': 'I',
                '\u00CF': 'I',
                '\u1E2E': 'I',
                '\u1EC8': 'I',
                '\u01CF': 'I',
                '\u0208': 'I',
                '\u020A': 'I',
                '\u1ECA': 'I',
                '\u012E': 'I',
                '\u1E2C': 'I',
                '\u0197': 'I',
                '\u24BF': 'J',
                '\uFF2A': 'J',
                '\u0134': 'J',
                '\u0248': 'J',
                '\u24C0': 'K',
                '\uFF2B': 'K',
                '\u1E30': 'K',
                '\u01E8': 'K',
                '\u1E32': 'K',
                '\u0136': 'K',
                '\u1E34': 'K',
                '\u0198': 'K',
                '\u2C69': 'K',
                '\uA740': 'K',
                '\uA742': 'K',
                '\uA744': 'K',
                '\uA7A2': 'K',
                '\u24C1': 'L',
                '\uFF2C': 'L',
                '\u013F': 'L',
                '\u0139': 'L',
                '\u013D': 'L',
                '\u1E36': 'L',
                '\u1E38': 'L',
                '\u013B': 'L',
                '\u1E3C': 'L',
                '\u1E3A': 'L',
                '\u0141': 'L',
                '\u023D': 'L',
                '\u2C62': 'L',
                '\u2C60': 'L',
                '\uA748': 'L',
                '\uA746': 'L',
                '\uA780': 'L',
                '\u01C7': 'LJ',
                '\u01C8': 'Lj',
                '\u24C2': 'M',
                '\uFF2D': 'M',
                '\u1E3E': 'M',
                '\u1E40': 'M',
                '\u1E42': 'M',
                '\u2C6E': 'M',
                '\u019C': 'M',
                '\u24C3': 'N',
                '\uFF2E': 'N',
                '\u01F8': 'N',
                '\u0143': 'N',
                '\u00D1': 'N',
                '\u1E44': 'N',
                '\u0147': 'N',
                '\u1E46': 'N',
                '\u0145': 'N',
                '\u1E4A': 'N',
                '\u1E48': 'N',
                '\u0220': 'N',
                '\u019D': 'N',
                '\uA790': 'N',
                '\uA7A4': 'N',
                '\u01CA': 'NJ',
                '\u01CB': 'Nj',
                '\u24C4': 'O',
                '\uFF2F': 'O',
                '\u00D2': 'O',
                '\u00D3': 'O',
                '\u00D4': 'O',
                '\u1ED2': 'O',
                '\u1ED0': 'O',
                '\u1ED6': 'O',
                '\u1ED4': 'O',
                '\u00D5': 'O',
                '\u1E4C': 'O',
                '\u022C': 'O',
                '\u1E4E': 'O',
                '\u014C': 'O',
                '\u1E50': 'O',
                '\u1E52': 'O',
                '\u014E': 'O',
                '\u022E': 'O',
                '\u0230': 'O',
                '\u00D6': 'O',
                '\u022A': 'O',
                '\u1ECE': 'O',
                '\u0150': 'O',
                '\u01D1': 'O',
                '\u020C': 'O',
                '\u020E': 'O',
                '\u01A0': 'O',
                '\u1EDC': 'O',
                '\u1EDA': 'O',
                '\u1EE0': 'O',
                '\u1EDE': 'O',
                '\u1EE2': 'O',
                '\u1ECC': 'O',
                '\u1ED8': 'O',
                '\u01EA': 'O',
                '\u01EC': 'O',
                '\u00D8': 'O',
                '\u01FE': 'O',
                '\u0186': 'O',
                '\u019F': 'O',
                '\uA74A': 'O',
                '\uA74C': 'O',
                '\u0152': 'OE',
                '\u01A2': 'OI',
                '\uA74E': 'OO',
                '\u0222': 'OU',
                '\u24C5': 'P',
                '\uFF30': 'P',
                '\u1E54': 'P',
                '\u1E56': 'P',
                '\u01A4': 'P',
                '\u2C63': 'P',
                '\uA750': 'P',
                '\uA752': 'P',
                '\uA754': 'P',
                '\u24C6': 'Q',
                '\uFF31': 'Q',
                '\uA756': 'Q',
                '\uA758': 'Q',
                '\u024A': 'Q',
                '\u24C7': 'R',
                '\uFF32': 'R',
                '\u0154': 'R',
                '\u1E58': 'R',
                '\u0158': 'R',
                '\u0210': 'R',
                '\u0212': 'R',
                '\u1E5A': 'R',
                '\u1E5C': 'R',
                '\u0156': 'R',
                '\u1E5E': 'R',
                '\u024C': 'R',
                '\u2C64': 'R',
                '\uA75A': 'R',
                '\uA7A6': 'R',
                '\uA782': 'R',
                '\u24C8': 'S',
                '\uFF33': 'S',
                '\u1E9E': 'S',
                '\u015A': 'S',
                '\u1E64': 'S',
                '\u015C': 'S',
                '\u1E60': 'S',
                '\u0160': 'S',
                '\u1E66': 'S',
                '\u1E62': 'S',
                '\u1E68': 'S',
                '\u0218': 'S',
                '\u015E': 'S',
                '\u2C7E': 'S',
                '\uA7A8': 'S',
                '\uA784': 'S',
                '\u24C9': 'T',
                '\uFF34': 'T',
                '\u1E6A': 'T',
                '\u0164': 'T',
                '\u1E6C': 'T',
                '\u021A': 'T',
                '\u0162': 'T',
                '\u1E70': 'T',
                '\u1E6E': 'T',
                '\u0166': 'T',
                '\u01AC': 'T',
                '\u01AE': 'T',
                '\u023E': 'T',
                '\uA786': 'T',
                '\uA728': 'TZ',
                '\u24CA': 'U',
                '\uFF35': 'U',
                '\u00D9': 'U',
                '\u00DA': 'U',
                '\u00DB': 'U',
                '\u0168': 'U',
                '\u1E78': 'U',
                '\u016A': 'U',
                '\u1E7A': 'U',
                '\u016C': 'U',
                '\u00DC': 'U',
                '\u01DB': 'U',
                '\u01D7': 'U',
                '\u01D5': 'U',
                '\u01D9': 'U',
                '\u1EE6': 'U',
                '\u016E': 'U',
                '\u0170': 'U',
                '\u01D3': 'U',
                '\u0214': 'U',
                '\u0216': 'U',
                '\u01AF': 'U',
                '\u1EEA': 'U',
                '\u1EE8': 'U',
                '\u1EEE': 'U',
                '\u1EEC': 'U',
                '\u1EF0': 'U',
                '\u1EE4': 'U',
                '\u1E72': 'U',
                '\u0172': 'U',
                '\u1E76': 'U',
                '\u1E74': 'U',
                '\u0244': 'U',
                '\u24CB': 'V',
                '\uFF36': 'V',
                '\u1E7C': 'V',
                '\u1E7E': 'V',
                '\u01B2': 'V',
                '\uA75E': 'V',
                '\u0245': 'V',
                '\uA760': 'VY',
                '\u24CC': 'W',
                '\uFF37': 'W',
                '\u1E80': 'W',
                '\u1E82': 'W',
                '\u0174': 'W',
                '\u1E86': 'W',
                '\u1E84': 'W',
                '\u1E88': 'W',
                '\u2C72': 'W',
                '\u24CD': 'X',
                '\uFF38': 'X',
                '\u1E8A': 'X',
                '\u1E8C': 'X',
                '\u24CE': 'Y',
                '\uFF39': 'Y',
                '\u1EF2': 'Y',
                '\u00DD': 'Y',
                '\u0176': 'Y',
                '\u1EF8': 'Y',
                '\u0232': 'Y',
                '\u1E8E': 'Y',
                '\u0178': 'Y',
                '\u1EF6': 'Y',
                '\u1EF4': 'Y',
                '\u01B3': 'Y',
                '\u024E': 'Y',
                '\u1EFE': 'Y',
                '\u24CF': 'Z',
                '\uFF3A': 'Z',
                '\u0179': 'Z',
                '\u1E90': 'Z',
                '\u017B': 'Z',
                '\u017D': 'Z',
                '\u1E92': 'Z',
                '\u1E94': 'Z',
                '\u01B5': 'Z',
                '\u0224': 'Z',
                '\u2C7F': 'Z',
                '\u2C6B': 'Z',
                '\uA762': 'Z',
                '\u24D0': 'a',
                '\uFF41': 'a',
                '\u1E9A': 'a',
                '\u00E0': 'a',
                '\u00E1': 'a',
                '\u00E2': 'a',
                '\u1EA7': 'a',
                '\u1EA5': 'a',
                '\u1EAB': 'a',
                '\u1EA9': 'a',
                '\u00E3': 'a',
                '\u0101': 'a',
                '\u0103': 'a',
                '\u1EB1': 'a',
                '\u1EAF': 'a',
                '\u1EB5': 'a',
                '\u1EB3': 'a',
                '\u0227': 'a',
                '\u01E1': 'a',
                '\u00E4': 'a',
                '\u01DF': 'a',
                '\u1EA3': 'a',
                '\u00E5': 'a',
                '\u01FB': 'a',
                '\u01CE': 'a',
                '\u0201': 'a',
                '\u0203': 'a',
                '\u1EA1': 'a',
                '\u1EAD': 'a',
                '\u1EB7': 'a',
                '\u1E01': 'a',
                '\u0105': 'a',
                '\u2C65': 'a',
                '\u0250': 'a',
                '\uA733': 'aa',
                '\u00E6': 'ae',
                '\u01FD': 'ae',
                '\u01E3': 'ae',
                '\uA735': 'ao',
                '\uA737': 'au',
                '\uA739': 'av',
                '\uA73B': 'av',
                '\uA73D': 'ay',
                '\u24D1': 'b',
                '\uFF42': 'b',
                '\u1E03': 'b',
                '\u1E05': 'b',
                '\u1E07': 'b',
                '\u0180': 'b',
                '\u0183': 'b',
                '\u0253': 'b',
                '\u24D2': 'c',
                '\uFF43': 'c',
                '\u0107': 'c',
                '\u0109': 'c',
                '\u010B': 'c',
                '\u010D': 'c',
                '\u00E7': 'c',
                '\u1E09': 'c',
                '\u0188': 'c',
                '\u023C': 'c',
                '\uA73F': 'c',
                '\u2184': 'c',
                '\u24D3': 'd',
                '\uFF44': 'd',
                '\u1E0B': 'd',
                '\u010F': 'd',
                '\u1E0D': 'd',
                '\u1E11': 'd',
                '\u1E13': 'd',
                '\u1E0F': 'd',
                '\u0111': 'd',
                '\u018C': 'd',
                '\u0256': 'd',
                '\u0257': 'd',
                '\uA77A': 'd',
                '\u01F3': 'dz',
                '\u01C6': 'dz',
                '\u24D4': 'e',
                '\uFF45': 'e',
                '\u00E8': 'e',
                '\u00E9': 'e',
                '\u00EA': 'e',
                '\u1EC1': 'e',
                '\u1EBF': 'e',
                '\u1EC5': 'e',
                '\u1EC3': 'e',
                '\u1EBD': 'e',
                '\u0113': 'e',
                '\u1E15': 'e',
                '\u1E17': 'e',
                '\u0115': 'e',
                '\u0117': 'e',
                '\u00EB': 'e',
                '\u1EBB': 'e',
                '\u011B': 'e',
                '\u0205': 'e',
                '\u0207': 'e',
                '\u1EB9': 'e',
                '\u1EC7': 'e',
                '\u0229': 'e',
                '\u1E1D': 'e',
                '\u0119': 'e',
                '\u1E19': 'e',
                '\u1E1B': 'e',
                '\u0247': 'e',
                '\u025B': 'e',
                '\u01DD': 'e',
                '\u24D5': 'f',
                '\uFF46': 'f',
                '\u1E1F': 'f',
                '\u0192': 'f',
                '\uA77C': 'f',
                '\u24D6': 'g',
                '\uFF47': 'g',
                '\u01F5': 'g',
                '\u011D': 'g',
                '\u1E21': 'g',
                '\u011F': 'g',
                '\u0121': 'g',
                '\u01E7': 'g',
                '\u0123': 'g',
                '\u01E5': 'g',
                '\u0260': 'g',
                '\uA7A1': 'g',
                '\u1D79': 'g',
                '\uA77F': 'g',
                '\u24D7': 'h',
                '\uFF48': 'h',
                '\u0125': 'h',
                '\u1E23': 'h',
                '\u1E27': 'h',
                '\u021F': 'h',
                '\u1E25': 'h',
                '\u1E29': 'h',
                '\u1E2B': 'h',
                '\u1E96': 'h',
                '\u0127': 'h',
                '\u2C68': 'h',
                '\u2C76': 'h',
                '\u0265': 'h',
                '\u0195': 'hv',
                '\u24D8': 'i',
                '\uFF49': 'i',
                '\u00EC': 'i',
                '\u00ED': 'i',
                '\u00EE': 'i',
                '\u0129': 'i',
                '\u012B': 'i',
                '\u012D': 'i',
                '\u00EF': 'i',
                '\u1E2F': 'i',
                '\u1EC9': 'i',
                '\u01D0': 'i',
                '\u0209': 'i',
                '\u020B': 'i',
                '\u1ECB': 'i',
                '\u012F': 'i',
                '\u1E2D': 'i',
                '\u0268': 'i',
                '\u0131': 'i',
                '\u24D9': 'j',
                '\uFF4A': 'j',
                '\u0135': 'j',
                '\u01F0': 'j',
                '\u0249': 'j',
                '\u24DA': 'k',
                '\uFF4B': 'k',
                '\u1E31': 'k',
                '\u01E9': 'k',
                '\u1E33': 'k',
                '\u0137': 'k',
                '\u1E35': 'k',
                '\u0199': 'k',
                '\u2C6A': 'k',
                '\uA741': 'k',
                '\uA743': 'k',
                '\uA745': 'k',
                '\uA7A3': 'k',
                '\u24DB': 'l',
                '\uFF4C': 'l',
                '\u0140': 'l',
                '\u013A': 'l',
                '\u013E': 'l',
                '\u1E37': 'l',
                '\u1E39': 'l',
                '\u013C': 'l',
                '\u1E3D': 'l',
                '\u1E3B': 'l',
                '\u017F': 'l',
                '\u0142': 'l',
                '\u019A': 'l',
                '\u026B': 'l',
                '\u2C61': 'l',
                '\uA749': 'l',
                '\uA781': 'l',
                '\uA747': 'l',
                '\u01C9': 'lj',
                '\u24DC': 'm',
                '\uFF4D': 'm',
                '\u1E3F': 'm',
                '\u1E41': 'm',
                '\u1E43': 'm',
                '\u0271': 'm',
                '\u026F': 'm',
                '\u24DD': 'n',
                '\uFF4E': 'n',
                '\u01F9': 'n',
                '\u0144': 'n',
                '\u00F1': 'n',
                '\u1E45': 'n',
                '\u0148': 'n',
                '\u1E47': 'n',
                '\u0146': 'n',
                '\u1E4B': 'n',
                '\u1E49': 'n',
                '\u019E': 'n',
                '\u0272': 'n',
                '\u0149': 'n',
                '\uA791': 'n',
                '\uA7A5': 'n',
                '\u01CC': 'nj',
                '\u24DE': 'o',
                '\uFF4F': 'o',
                '\u00F2': 'o',
                '\u00F3': 'o',
                '\u00F4': 'o',
                '\u1ED3': 'o',
                '\u1ED1': 'o',
                '\u1ED7': 'o',
                '\u1ED5': 'o',
                '\u00F5': 'o',
                '\u1E4D': 'o',
                '\u022D': 'o',
                '\u1E4F': 'o',
                '\u014D': 'o',
                '\u1E51': 'o',
                '\u1E53': 'o',
                '\u014F': 'o',
                '\u022F': 'o',
                '\u0231': 'o',
                '\u00F6': 'o',
                '\u022B': 'o',
                '\u1ECF': 'o',
                '\u0151': 'o',
                '\u01D2': 'o',
                '\u020D': 'o',
                '\u020F': 'o',
                '\u01A1': 'o',
                '\u1EDD': 'o',
                '\u1EDB': 'o',
                '\u1EE1': 'o',
                '\u1EDF': 'o',
                '\u1EE3': 'o',
                '\u1ECD': 'o',
                '\u1ED9': 'o',
                '\u01EB': 'o',
                '\u01ED': 'o',
                '\u00F8': 'o',
                '\u01FF': 'o',
                '\u0254': 'o',
                '\uA74B': 'o',
                '\uA74D': 'o',
                '\u0275': 'o',
                '\u0153': 'oe',
                '\u01A3': 'oi',
                '\u0223': 'ou',
                '\uA74F': 'oo',
                '\u24DF': 'p',
                '\uFF50': 'p',
                '\u1E55': 'p',
                '\u1E57': 'p',
                '\u01A5': 'p',
                '\u1D7D': 'p',
                '\uA751': 'p',
                '\uA753': 'p',
                '\uA755': 'p',
                '\u24E0': 'q',
                '\uFF51': 'q',
                '\u024B': 'q',
                '\uA757': 'q',
                '\uA759': 'q',
                '\u24E1': 'r',
                '\uFF52': 'r',
                '\u0155': 'r',
                '\u1E59': 'r',
                '\u0159': 'r',
                '\u0211': 'r',
                '\u0213': 'r',
                '\u1E5B': 'r',
                '\u1E5D': 'r',
                '\u0157': 'r',
                '\u1E5F': 'r',
                '\u024D': 'r',
                '\u027D': 'r',
                '\uA75B': 'r',
                '\uA7A7': 'r',
                '\uA783': 'r',
                '\u24E2': 's',
                '\uFF53': 's',
                '\u00DF': 's',
                '\u015B': 's',
                '\u1E65': 's',
                '\u015D': 's',
                '\u1E61': 's',
                '\u0161': 's',
                '\u1E67': 's',
                '\u1E63': 's',
                '\u1E69': 's',
                '\u0219': 's',
                '\u015F': 's',
                '\u023F': 's',
                '\uA7A9': 's',
                '\uA785': 's',
                '\u1E9B': 's',
                '\u24E3': 't',
                '\uFF54': 't',
                '\u1E6B': 't',
                '\u1E97': 't',
                '\u0165': 't',
                '\u1E6D': 't',
                '\u021B': 't',
                '\u0163': 't',
                '\u1E71': 't',
                '\u1E6F': 't',
                '\u0167': 't',
                '\u01AD': 't',
                '\u0288': 't',
                '\u2C66': 't',
                '\uA787': 't',
                '\uA729': 'tz',
                '\u24E4': 'u',
                '\uFF55': 'u',
                '\u00F9': 'u',
                '\u00FA': 'u',
                '\u00FB': 'u',
                '\u0169': 'u',
                '\u1E79': 'u',
                '\u016B': 'u',
                '\u1E7B': 'u',
                '\u016D': 'u',
                '\u00FC': 'u',
                '\u01DC': 'u',
                '\u01D8': 'u',
                '\u01D6': 'u',
                '\u01DA': 'u',
                '\u1EE7': 'u',
                '\u016F': 'u',
                '\u0171': 'u',
                '\u01D4': 'u',
                '\u0215': 'u',
                '\u0217': 'u',
                '\u01B0': 'u',
                '\u1EEB': 'u',
                '\u1EE9': 'u',
                '\u1EEF': 'u',
                '\u1EED': 'u',
                '\u1EF1': 'u',
                '\u1EE5': 'u',
                '\u1E73': 'u',
                '\u0173': 'u',
                '\u1E77': 'u',
                '\u1E75': 'u',
                '\u0289': 'u',
                '\u24E5': 'v',
                '\uFF56': 'v',
                '\u1E7D': 'v',
                '\u1E7F': 'v',
                '\u028B': 'v',
                '\uA75F': 'v',
                '\u028C': 'v',
                '\uA761': 'vy',
                '\u24E6': 'w',
                '\uFF57': 'w',
                '\u1E81': 'w',
                '\u1E83': 'w',
                '\u0175': 'w',
                '\u1E87': 'w',
                '\u1E85': 'w',
                '\u1E98': 'w',
                '\u1E89': 'w',
                '\u2C73': 'w',
                '\u24E7': 'x',
                '\uFF58': 'x',
                '\u1E8B': 'x',
                '\u1E8D': 'x',
                '\u24E8': 'y',
                '\uFF59': 'y',
                '\u1EF3': 'y',
                '\u00FD': 'y',
                '\u0177': 'y',
                '\u1EF9': 'y',
                '\u0233': 'y',
                '\u1E8F': 'y',
                '\u00FF': 'y',
                '\u1EF7': 'y',
                '\u1E99': 'y',
                '\u1EF5': 'y',
                '\u01B4': 'y',
                '\u024F': 'y',
                '\u1EFF': 'y',
                '\u24E9': 'z',
                '\uFF5A': 'z',
                '\u017A': 'z',
                '\u1E91': 'z',
                '\u017C': 'z',
                '\u017E': 'z',
                '\u1E93': 'z',
                '\u1E95': 'z',
                '\u01B6': 'z',
                '\u0225': 'z',
                '\u0240': 'z',
                '\u2C6C': 'z',
                '\uA763': 'z',
                '\u0386': '\u0391',
                '\u0388': '\u0395',
                '\u0389': '\u0397',
                '\u038A': '\u0399',
                '\u03AA': '\u0399',
                '\u038C': '\u039F',
                '\u038E': '\u03A5',
                '\u03AB': '\u03A5',
                '\u038F': '\u03A9',
                '\u03AC': '\u03B1',
                '\u03AD': '\u03B5',
                '\u03AE': '\u03B7',
                '\u03AF': '\u03B9',
                '\u03CA': '\u03B9',
                '\u0390': '\u03B9',
                '\u03CC': '\u03BF',
                '\u03CD': '\u03C5',
                '\u03CB': '\u03C5',
                '\u03B0': '\u03C5',
                '\u03CE': '\u03C9',
                '\u03C2': '\u03C3',
                '\u2019': '\''
            };

            return diacritics;
        });

        S2.define('select2/data/base', [
            '../utils'
        ], function (Utils) {
            function BaseAdapter($element, options) {
                BaseAdapter.__super__.constructor.call(this);
            }

            Utils.Extend(BaseAdapter, Utils.Observable);

            BaseAdapter.prototype.current = function (callback) {
                throw new Error('The `current` method must be defined in child classes.');
            };

            BaseAdapter.prototype.query = function (params, callback) {
                throw new Error('The `query` method must be defined in child classes.');
            };

            BaseAdapter.prototype.bind = function (container, $container) {
                // Can be implemented in subclasses
            };

            BaseAdapter.prototype.destroy = function () {
                // Can be implemented in subclasses
            };

            BaseAdapter.prototype.generateResultId = function (container, data) {
                var id = container.id + '-result-';

                id += Utils.generateChars(4);

                if (data.id != null) {
                    id += '-' + data.id.toString();
                } else {
                    id += '-' + Utils.generateChars(4);
                }
                return id;
            };

            return BaseAdapter;
        });

        S2.define('select2/data/select', [
            './base',
            '../utils',
            'jquery'
        ], function (BaseAdapter, Utils, $) {
            function SelectAdapter($element, options) {
                this.$element = $element;
                this.options = options;

                SelectAdapter.__super__.constructor.call(this);
            }

            Utils.Extend(SelectAdapter, BaseAdapter);

            SelectAdapter.prototype.current = function (callback) {
                var data = [];
                var self = this;

                this.$element.find(':selected').each(function () {
                    var $option = $(this);

                    var option = self.item($option);

                    data.push(option);
                });

                callback(data);
            };

            SelectAdapter.prototype.select = function (data) {
                var self = this;

                data.selected = true;

                // If data.element is a DOM node, use it instead
                if ($(data.element).is('option')) {
                    data.element.selected = true;

                    this.$element.trigger('input').trigger('change');

                    return;
                }

                if (this.$element.prop('multiple')) {
                    this.current(function (currentData) {
                        var val = [];

                        data = [data];
                        data.push.apply(data, currentData);

                        for (var d = 0; d < data.length; d++) {
                            var id = data[d].id;

                            if ($.inArray(id, val) === -1) {
                                val.push(id);
                            }
                        }

                        self.$element.val(val);
                        self.$element.trigger('input').trigger('change');
                    });
                } else {
                    var val = data.id;

                    this.$element.val(val);
                    this.$element.trigger('input').trigger('change');
                }
            };

            SelectAdapter.prototype.unselect = function (data) {
                var self = this;

                if (!this.$element.prop('multiple')) {
                    return;
                }

                data.selected = false;

                if ($(data.element).is('option')) {
                    data.element.selected = false;

                    this.$element.trigger('input').trigger('change');

                    return;
                }

                this.current(function (currentData) {
                    var val = [];

                    for (var d = 0; d < currentData.length; d++) {
                        var id = currentData[d].id;

                        if (id !== data.id && $.inArray(id, val) === -1) {
                            val.push(id);
                        }
                    }

                    self.$element.val(val);

                    self.$element.trigger('input').trigger('change');
                });
            };

            SelectAdapter.prototype.bind = function (container, $container) {
                var self = this;

                this.container = container;

                container.on('select', function (params) {
                    self.select(params.data);
                });

                container.on('unselect', function (params) {
                    self.unselect(params.data);
                });
            };

            SelectAdapter.prototype.destroy = function () {
                // Remove anything added to child elements
                this.$element.find('*').each(function () {
                    // Remove any custom data set by Select2
                    Utils.RemoveData(this);
                });
            };

            SelectAdapter.prototype.query = function (params, callback) {
                var data = [];
                var self = this;

                var $options = this.$element.children();

                $options.each(function () {
                    var $option = $(this);

                    if (!$option.is('option') && !$option.is('optgroup')) {
                        return;
                    }

                    var option = self.item($option);

                    var matches = self.matches(params, option);

                    if (matches !== null) {
                        data.push(matches);
                    }
                });

                callback({
                    results: data
                });
            };

            SelectAdapter.prototype.addOptions = function ($options) {
                Utils.appendMany(this.$element, $options);
            };

            SelectAdapter.prototype.option = function (data) {
                var option;

                if (data.children) {
                    option = document.createElement('optgroup');
                    option.label = data.text;
                } else {
                    option = document.createElement('option');

                    if (option.textContent !== undefined) {
                        option.textContent = data.text;
                    } else {
                        option.innerText = data.text;
                    }
                }

                if (data.id !== undefined) {
                    option.value = data.id;
                }

                if (data.disabled) {
                    option.disabled = true;
                }

                if (data.selected) {
                    option.selected = true;
                }

                if (data.title) {
                    option.title = data.title;
                }

                var $option = $(option);

                var normalizedData = this._normalizeItem(data);
                normalizedData.element = option;

                // Override the option's data with the combined data
                Utils.StoreData(option, 'data', normalizedData);

                return $option;
            };

            SelectAdapter.prototype.item = function ($option) {
                var data = {};

                data = Utils.GetData($option[0], 'data');

                if (data != null) {
                    return data;
                }

                if ($option.is('option')) {
                    data = {
                        id: $option.val(),
                        text: $option.text(),
                        disabled: $option.prop('disabled'),
                        selected: $option.prop('selected'),
                        title: $option.prop('title')
                    };
                } else if ($option.is('optgroup')) {
                    data = {
                        text: $option.prop('label'),
                        children: [],
                        title: $option.prop('title')
                    };

                    var $children = $option.children('option');
                    var children = [];

                    for (var c = 0; c < $children.length; c++) {
                        var $child = $($children[c]);

                        var child = this.item($child);

                        children.push(child);
                    }

                    data.children = children;
                }

                data = this._normalizeItem(data);
                data.element = $option[0];

                Utils.StoreData($option[0], 'data', data);

                return data;
            };

            SelectAdapter.prototype._normalizeItem = function (item) {
                if (item !== Object(item)) {
                    item = {
                        id: item,
                        text: item
                    };
                }

                item = $.extend({}, {
                    text: ''
                }, item);

                var defaults = {
                    selected: false,
                    disabled: false
                };

                if (item.id != null) {
                    item.id = item.id.toString();
                }

                if (item.text != null) {
                    item.text = item.text.toString();
                }

                if (item._resultId == null && item.id && this.container != null) {
                    item._resultId = this.generateResultId(this.container, item);
                }

                return $.extend({}, defaults, item);
            };

            SelectAdapter.prototype.matches = function (params, data) {
                var matcher = this.options.get('matcher');

                return matcher(params, data);
            };

            return SelectAdapter;
        });

        S2.define('select2/data/array', [
            './select',
            '../utils',
            'jquery'
        ], function (SelectAdapter, Utils, $) {
            function ArrayAdapter($element, options) {
                this._dataToConvert = options.get('data') || [];

                ArrayAdapter.__super__.constructor.call(this, $element, options);
            }

            Utils.Extend(ArrayAdapter, SelectAdapter);

            ArrayAdapter.prototype.bind = function (container, $container) {
                ArrayAdapter.__super__.bind.call(this, container, $container);

                this.addOptions(this.convertToOptions(this._dataToConvert));
            };

            ArrayAdapter.prototype.select = function (data) {
                var $option = this.$element.find('option').filter(function (i, elm) {
                    return elm.value == data.id.toString();
                });

                if ($option.length === 0) {
                    $option = this.option(data);

                    this.addOptions($option);
                }

                ArrayAdapter.__super__.select.call(this, data);
            };

            ArrayAdapter.prototype.convertToOptions = function (data) {
                var self = this;

                var $existing = this.$element.find('option');
                var existingIds = $existing.map(function () {
                    return self.item($(this)).id;
                }).get();

                var $options = [];

                // Filter out all items except for the one passed in the argument
                function onlyItem(item) {
                    return function () {
                        return $(this).val() == item.id;
                    };
                }

                for (var d = 0; d < data.length; d++) {
                    var item = this._normalizeItem(data[d]);

                    // Skip items which were pre-loaded, only merge the data
                    if ($.inArray(item.id, existingIds) >= 0) {
                        var $existingOption = $existing.filter(onlyItem(item));

                        var existingData = this.item($existingOption);
                        var newData = $.extend(true, {}, item, existingData);

                        var $newOption = this.option(newData);

                        $existingOption.replaceWith($newOption);

                        continue;
                    }

                    var $option = this.option(item);

                    if (item.children) {
                        var $children = this.convertToOptions(item.children);

                        Utils.appendMany($option, $children);
                    }

                    $options.push($option);
                }

                return $options;
            };

            return ArrayAdapter;
        });

        S2.define('select2/data/ajax', [
            './array',
            '../utils',
            'jquery'
        ], function (ArrayAdapter, Utils, $) {
            function AjaxAdapter($element, options) {
                this.ajaxOptions = this._applyDefaults(options.get('ajax'));

                if (this.ajaxOptions.processResults != null) {
                    this.processResults = this.ajaxOptions.processResults;
                }

                AjaxAdapter.__super__.constructor.call(this, $element, options);
            }

            Utils.Extend(AjaxAdapter, ArrayAdapter);

            AjaxAdapter.prototype._applyDefaults = function (options) {
                var defaults = {
                    data: function (params) {
                        return $.extend({}, params, {
                            q: params.term
                        });
                    },
                    transport: function (params, success, failure) {
                        var $request = $.ajax(params);
                        $request.then(success);
                        $request.fail(failure);

                        return $request;
                    }
                };

                return $.extend({}, defaults, options, true);
            };

            AjaxAdapter.prototype.processResults = function (results) {
                return results;
            };

            AjaxAdapter.prototype.query = function (params, callback) {
                var matches = [];
                var self = this;

                if (this._request != null) {
                    // JSONP requests cannot always be aborted
                    if ($.isFunction(this._request.abort)) {
                        this._request.abort();
                    }

                    this._request = null;
                }

                var options = $.extend({
                    type: 'GET'
                }, this.ajaxOptions);

                if (typeof options.url === 'function') {
                    options.url = options.url.call(this.$element, params);
                }

                if (typeof options.data === 'function') {
                    options.data = options.data.call(this.$element, params);
                }

                function request() {
                    var $request = options.transport(options, function (data) {
                        var results = self.processResults(data, params);

                        if (self.options.get('debug') && window.console && console.error) {
                            // Check to make sure that the response included a `results` key.
                            if (!results || !results.results || !$.isArray(results.results)) {
                                console.error(
                                    'Select2: The AJAX results did not return an array in the ' +
                                    '`results` key of the response.'
                                );
                            }
                        }

                        callback(results);
                    }, function () {
                        // Attempt to detect if a request was aborted
                        // Only works if the transport exposes a status property
                        if ('status' in $request &&
                            ($request.status === 0 || $request.status === '0')) {
                            return;
                        }

                        self.trigger('results:message', {
                            message: 'errorLoading'
                        });
                    });

                    self._request = $request;
                }

                if (this.ajaxOptions.delay && params.term != null) {
                    if (this._queryTimeout) {
                        window.clearTimeout(this._queryTimeout);
                    }

                    this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
                } else {
                    request();
                }
            };

            return AjaxAdapter;
        });

        S2.define('select2/data/tags', [
            'jquery'
        ], function ($) {
            function Tags(decorated, $element, options) {
                var tags = options.get('tags');

                var createTag = options.get('createTag');

                if (createTag !== undefined) {
                    this.createTag = createTag;
                }

                var insertTag = options.get('insertTag');

                if (insertTag !== undefined) {
                    this.insertTag = insertTag;
                }

                decorated.call(this, $element, options);

                if ($.isArray(tags)) {
                    for (var t = 0; t < tags.length; t++) {
                        var tag = tags[t];
                        var item = this._normalizeItem(tag);

                        var $option = this.option(item);

                        this.$element.append($option);
                    }
                }
            }

            Tags.prototype.query = function (decorated, params, callback) {
                var self = this;

                this._removeOldTags();

                if (params.term == null || params.page != null) {
                    decorated.call(this, params, callback);
                    return;
                }

                function wrapper(obj, child) {
                    var data = obj.results;

                    for (var i = 0; i < data.length; i++) {
                        var option = data[i];

                        var checkChildren = (
                            option.children != null &&
                            !wrapper({
                                results: option.children
                            }, true)
                        );

                        var optionText = (option.text || '').toUpperCase();
                        var paramsTerm = (params.term || '').toUpperCase();

                        var checkText = optionText === paramsTerm;

                        if (checkText || checkChildren) {
                            if (child) {
                                return false;
                            }

                            obj.data = data;
                            callback(obj);

                            return;
                        }
                    }

                    if (child) {
                        return true;
                    }

                    var tag = self.createTag(params);

                    if (tag != null) {
                        var $option = self.option(tag);
                        $option.attr('data-select2-tag', true);

                        self.addOptions([$option]);

                        self.insertTag(data, tag);
                    }

                    obj.results = data;

                    callback(obj);
                }

                decorated.call(this, params, wrapper);
            };

            Tags.prototype.createTag = function (decorated, params) {
                var term = $.trim(params.term);

                if (term === '') {
                    return null;
                }

                return {
                    id: term,
                    text: term
                };
            };

            Tags.prototype.insertTag = function (_, data, tag) {
                data.unshift(tag);
            };

            Tags.prototype._removeOldTags = function (_) {
                var $options = this.$element.find('option[data-select2-tag]');

                $options.each(function () {
                    if (this.selected) {
                        return;
                    }

                    $(this).remove();
                });
            };

            return Tags;
        });

        S2.define('select2/data/tokenizer', [
            'jquery'
        ], function ($) {
            function Tokenizer(decorated, $element, options) {
                var tokenizer = options.get('tokenizer');

                if (tokenizer !== undefined) {
                    this.tokenizer = tokenizer;
                }

                decorated.call(this, $element, options);
            }

            Tokenizer.prototype.bind = function (decorated, container, $container) {
                decorated.call(this, container, $container);

                this.$search = container.dropdown.$search || container.selection.$search ||
                    $container.find('.select2-search__field');
            };

            Tokenizer.prototype.query = function (decorated, params, callback) {
                var self = this;

                function createAndSelect(data) {
                    // Normalize the data object so we can use it for checks
                    var item = self._normalizeItem(data);

                    // Check if the data object already exists as a tag
                    // Select it if it doesn't
                    var $existingOptions = self.$element.find('option').filter(function () {
                        return $(this).val() === item.id;
                    });

                    // If an existing option wasn't found for it, create the option
                    if (!$existingOptions.length) {
                        var $option = self.option(item);
                        $option.attr('data-select2-tag', true);

                        self._removeOldTags();
                        self.addOptions([$option]);
                    }

                    // Select the item, now that we know there is an option for it
                    select(item);
                }

                function select(data) {
                    self.trigger('select', {
                        data: data
                    });
                }

                params.term = params.term || '';

                var tokenData = this.tokenizer(params, this.options, createAndSelect);

                if (tokenData.term !== params.term) {
                    // Replace the search term if we have the search box
                    if (this.$search.length) {
                        this.$search.val(tokenData.term);
                        this.$search.trigger('focus');
                    }

                    params.term = tokenData.term;
                }

                decorated.call(this, params, callback);
            };

            Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
                var separators = options.get('tokenSeparators') || [];
                var term = params.term;
                var i = 0;

                var createTag = this.createTag || function (params) {
                    return {
                        id: params.term,
                        text: params.term
                    };
                };

                while (i < term.length) {
                    var termChar = term[i];

                    if ($.inArray(termChar, separators) === -1) {
                        i++;

                        continue;
                    }

                    var part = term.substr(0, i);
                    var partParams = $.extend({}, params, {
                        term: part
                    });

                    var data = createTag(partParams);

                    if (data == null) {
                        i++;
                        continue;
                    }

                    callback(data);

                    // Reset the term to not include the tokenized portion
                    term = term.substr(i + 1) || '';
                    i = 0;
                }

                return {
                    term: term
                };
            };

            return Tokenizer;
        });

        S2.define('select2/data/minimumInputLength', [

        ], function () {
            function MinimumInputLength(decorated, $e, options) {
                this.minimumInputLength = options.get('minimumInputLength');

                decorated.call(this, $e, options);
            }

            MinimumInputLength.prototype.query = function (decorated, params, callback) {
                params.term = params.term || '';

                if (params.term.length < this.minimumInputLength) {
                    this.trigger('results:message', {
                        message: 'inputTooShort',
                        args: {
                            minimum: this.minimumInputLength,
                            input: params.term,
                            params: params
                        }
                    });

                    return;
                }

                decorated.call(this, params, callback);
            };

            return MinimumInputLength;
        });

        S2.define('select2/data/maximumInputLength', [

        ], function () {
            function MaximumInputLength(decorated, $e, options) {
                this.maximumInputLength = options.get('maximumInputLength');

                decorated.call(this, $e, options);
            }

            MaximumInputLength.prototype.query = function (decorated, params, callback) {
                params.term = params.term || '';

                if (this.maximumInputLength > 0 &&
                    params.term.length > this.maximumInputLength) {
                    this.trigger('results:message', {
                        message: 'inputTooLong',
                        args: {
                            maximum: this.maximumInputLength,
                            input: params.term,
                            params: params
                        }
                    });

                    return;
                }

                decorated.call(this, params, callback);
            };

            return MaximumInputLength;
        });

        S2.define('select2/data/maximumSelectionLength', [

        ], function () {
            function MaximumSelectionLength(decorated, $e, options) {
                this.maximumSelectionLength = options.get('maximumSelectionLength');

                decorated.call(this, $e, options);
            }

            MaximumSelectionLength.prototype.bind =
                function (decorated, container, $container) {
                    var self = this;

                    decorated.call(this, container, $container);

                    container.on('select', function () {
                        self._checkIfMaximumSelected();
                    });
                };

            MaximumSelectionLength.prototype.query =
                function (decorated, params, callback) {
                    var self = this;

                    this._checkIfMaximumSelected(function () {
                        decorated.call(self, params, callback);
                    });
                };

            MaximumSelectionLength.prototype._checkIfMaximumSelected =
                function (_, successCallback) {
                    var self = this;

                    this.current(function (currentData) {
                        var count = currentData != null ? currentData.length : 0;
                        if (self.maximumSelectionLength > 0 &&
                            count >= self.maximumSelectionLength) {
                            self.trigger('results:message', {
                                message: 'maximumSelected',
                                args: {
                                    maximum: self.maximumSelectionLength
                                }
                            });
                            return;
                        }

                        if (successCallback) {
                            successCallback();
                        }
                    });
                };

            return MaximumSelectionLength;
        });

        S2.define('select2/dropdown', [
            'jquery',
            './utils'
        ], function ($, Utils) {
            function Dropdown($element, options) {
                this.$element = $element;
                this.options = options;

                Dropdown.__super__.constructor.call(this);
            }

            Utils.Extend(Dropdown, Utils.Observable);

            Dropdown.prototype.render = function () {
                var $dropdown = $(
                    '<span class="select2-dropdown">' +
                    '<span class="select2-results"></span>' +
                    '</span>'
                );

                $dropdown.attr('dir', this.options.get('dir'));

                this.$dropdown = $dropdown;

                return $dropdown;
            };

            Dropdown.prototype.bind = function () {
                // Should be implemented in subclasses
            };

            Dropdown.prototype.position = function ($dropdown, $container) {
                // Should be implemented in subclasses
            };

            Dropdown.prototype.destroy = function () {
                // Remove the dropdown from the DOM
                this.$dropdown.remove();
            };

            return Dropdown;
        });

        S2.define('select2/dropdown/search', [
            'jquery',
            '../utils'
        ], function ($, Utils) {
            function Search() { }

            Search.prototype.render = function (decorated) {
                var $rendered = decorated.call(this);

                var $search = $(
                    '<span class="select2-search select2-search--dropdown">' +
                    '<input class="select2-search__field" type="search" tabindex="-1"' +
                    ' autocomplete="off" autocorrect="off" autocapitalize="none"' +
                    ' spellcheck="false" role="searchbox" aria-autocomplete="list" />' +
                    '</span>'
                );

                this.$searchContainer = $search;
                this.$search = $search.find('input');

                $rendered.prepend($search);

                return $rendered;
            };

            Search.prototype.bind = function (decorated, container, $container) {
                var self = this;

                var resultsId = container.id + '-results';

                decorated.call(this, container, $container);

                this.$search.on('keydown', function (evt) {
                    self.trigger('keypress', evt);

                    self._keyUpPrevented = evt.isDefaultPrevented();
                });

                // Workaround for browsers which do not support the `input` event
                // This will prevent double-triggering of events for browsers which support
                // both the `keyup` and `input` events.
                this.$search.on('input', function (evt) {
                    // Unbind the duplicated `keyup` event
                    $(this).off('keyup');
                });

                this.$search.on('keyup input', function (evt) {
                    self.handleSearch(evt);
                });

                container.on('open', function () {
                    self.$search.attr('tabindex', 0);
                    self.$search.attr('aria-controls', resultsId);

                    self.$search.trigger('focus');

                    window.setTimeout(function () {
                        self.$search.trigger('focus');
                    }, 0);
                });

                container.on('close', function () {
                    self.$search.attr('tabindex', -1);
                    self.$search.removeAttr('aria-controls');
                    self.$search.removeAttr('aria-activedescendant');

                    self.$search.val('');
                    self.$search.trigger('blur');
                });

                container.on('focus', function () {
                    if (!container.isOpen()) {
                        self.$search.trigger('focus');
                    }
                });

                container.on('results:all', function (params) {
                    if (params.query.term == null || params.query.term === '') {
                        var showSearch = self.showSearch(params);

                        if (showSearch) {
                            self.$searchContainer.removeClass('select2-search--hide');
                        } else {
                            self.$searchContainer.addClass('select2-search--hide');
                        }
                    }
                });

                container.on('results:focus', function (params) {
                    if (params.data._resultId) {
                        self.$search.attr('aria-activedescendant', params.data._resultId);
                    } else {
                        self.$search.removeAttr('aria-activedescendant');
                    }
                });
            };

            Search.prototype.handleSearch = function (evt) {
                if (!this._keyUpPrevented) {
                    var input = this.$search.val();

                    this.trigger('query', {
                        term: input
                    });
                }

                this._keyUpPrevented = false;
            };

            Search.prototype.showSearch = function (_, params) {
                return true;
            };

            return Search;
        });

        S2.define('select2/dropdown/hidePlaceholder', [

        ], function () {
            function HidePlaceholder(decorated, $element, options, dataAdapter) {
                this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

                decorated.call(this, $element, options, dataAdapter);
            }

            HidePlaceholder.prototype.append = function (decorated, data) {
                data.results = this.removePlaceholder(data.results);

                decorated.call(this, data);
            };

            HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
                if (typeof placeholder === 'string') {
                    placeholder = {
                        id: '',
                        text: placeholder
                    };
                }

                return placeholder;
            };

            HidePlaceholder.prototype.removePlaceholder = function (_, data) {
                var modifiedData = data.slice(0);

                for (var d = data.length - 1; d >= 0; d--) {
                    var item = data[d];

                    if (this.placeholder.id === item.id) {
                        modifiedData.splice(d, 1);
                    }
                }

                return modifiedData;
            };

            return HidePlaceholder;
        });

        S2.define('select2/dropdown/infiniteScroll', [
            'jquery'
        ], function ($) {
            function InfiniteScroll(decorated, $element, options, dataAdapter) {
                this.lastParams = {};

                decorated.call(this, $element, options, dataAdapter);

                this.$loadingMore = this.createLoadingMore();
                this.loading = false;
            }

            InfiniteScroll.prototype.append = function (decorated, data) {
                this.$loadingMore.remove();
                this.loading = false;

                decorated.call(this, data);

                if (this.showLoadingMore(data)) {
                    this.$results.append(this.$loadingMore);
                    this.loadMoreIfNeeded();
                }
            };

            InfiniteScroll.prototype.bind = function (decorated, container, $container) {
                var self = this;

                decorated.call(this, container, $container);

                container.on('query', function (params) {
                    self.lastParams = params;
                    self.loading = true;
                });

                container.on('query:append', function (params) {
                    self.lastParams = params;
                    self.loading = true;
                });

                this.$results.on('scroll', this.loadMoreIfNeeded.bind(this));
            };

            InfiniteScroll.prototype.loadMoreIfNeeded = function () {
                var isLoadMoreVisible = $.contains(
                    document.documentElement,
                    this.$loadingMore[0]
                );

                if (this.loading || !isLoadMoreVisible) {
                    return;
                }

                var currentOffset = this.$results.offset().top +
                    this.$results.outerHeight(false);
                var loadingMoreOffset = this.$loadingMore.offset().top +
                    this.$loadingMore.outerHeight(false);

                if (currentOffset + 50 >= loadingMoreOffset) {
                    this.loadMore();
                }
            };

            InfiniteScroll.prototype.loadMore = function () {
                this.loading = true;

                var params = $.extend({}, { page: 1 }, this.lastParams);

                params.page++;

                this.trigger('query:append', params);
            };

            InfiniteScroll.prototype.showLoadingMore = function (_, data) {
                return data.pagination && data.pagination.more;
            };

            InfiniteScroll.prototype.createLoadingMore = function () {
                var $option = $(
                    '<li ' +
                    'class="select2-results__option select2-results__option--load-more"' +
                    'role="option" aria-disabled="true"></li>'
                );

                var message = this.options.get('translations').get('loadingMore');

                $option.html(message(this.lastParams));

                return $option;
            };

            return InfiniteScroll;
        });

        S2.define('select2/dropdown/attachBody', [
            'jquery',
            '../utils'
        ], function ($, Utils) {
            function AttachBody(decorated, $element, options) {
                this.$dropdownParent = $(options.get('dropdownParent') || document.body);

                decorated.call(this, $element, options);
            }

            AttachBody.prototype.bind = function (decorated, container, $container) {
                var self = this;

                decorated.call(this, container, $container);

                container.on('open', function () {
                    self._showDropdown();
                    self._attachPositioningHandler(container);

                    // Must bind after the results handlers to ensure correct sizing
                    self._bindContainerResultHandlers(container);
                });

                container.on('close', function () {
                    self._hideDropdown();
                    self._detachPositioningHandler(container);
                });

                this.$dropdownContainer.on('mousedown', function (evt) {
                    evt.stopPropagation();
                });
            };

            AttachBody.prototype.destroy = function (decorated) {
                decorated.call(this);

                this.$dropdownContainer.remove();
            };

            AttachBody.prototype.position = function (decorated, $dropdown, $container) {
                // Clone all of the container classes
                $dropdown.attr('class', $container.attr('class'));

                $dropdown.removeClass('select2');
                $dropdown.addClass('select2-container--open');

                $dropdown.css({
                    position: 'absolute',
                    top: -999999
                });

                this.$container = $container;
            };

            AttachBody.prototype.render = function (decorated) {
                var $container = $('<span></span>');

                var $dropdown = decorated.call(this);
                $container.append($dropdown);

                this.$dropdownContainer = $container;

                return $container;
            };

            AttachBody.prototype._hideDropdown = function (decorated) {
                this.$dropdownContainer.detach();
            };

            AttachBody.prototype._bindContainerResultHandlers =
                function (decorated, container) {

                    // These should only be bound once
                    if (this._containerResultsHandlersBound) {
                        return;
                    }

                    var self = this;

                    container.on('results:all', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });

                    container.on('results:append', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });

                    container.on('results:message', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });

                    container.on('select', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });

                    container.on('unselect', function () {
                        self._positionDropdown();
                        self._resizeDropdown();
                    });

                    this._containerResultsHandlersBound = true;
                };

            AttachBody.prototype._attachPositioningHandler =
                function (decorated, container) {
                    var self = this;

                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;

                    var $watchers = this.$container.parents().filter(Utils.hasScroll);
                    $watchers.each(function () {
                        Utils.StoreData(this, 'select2-scroll-position', {
                            x: $(this).scrollLeft(),
                            y: $(this).scrollTop()
                        });
                    });

                    $watchers.on(scrollEvent, function (ev) {
                        var position = Utils.GetData(this, 'select2-scroll-position');
                        $(this).scrollTop(position.y);
                    });

                    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
                        function (e) {
                            self._positionDropdown();
                            self._resizeDropdown();
                        });
                };

            AttachBody.prototype._detachPositioningHandler =
                function (decorated, container) {
                    var scrollEvent = 'scroll.select2.' + container.id;
                    var resizeEvent = 'resize.select2.' + container.id;
                    var orientationEvent = 'orientationchange.select2.' + container.id;

                    var $watchers = this.$container.parents().filter(Utils.hasScroll);
                    $watchers.off(scrollEvent);

                    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
                };

            AttachBody.prototype._positionDropdown = function () {
                var $window = $(window);

                var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
                var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

                var newDirection = null;

                var offset = this.$container.offset();

                offset.bottom = offset.top + this.$container.outerHeight(false);

                var container = {
                    height: this.$container.outerHeight(false)
                };

                container.top = offset.top;
                container.bottom = offset.top + container.height;

                var dropdown = {
                    height: this.$dropdown.outerHeight(false)
                };

                var viewport = {
                    top: $window.scrollTop(),
                    bottom: $window.scrollTop() + $window.height()
                };

                var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
                var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

                var css = {
                    left: offset.left,
                    top: container.bottom
                };

                // Determine what the parent element is to use for calculating the offset
                var $offsetParent = this.$dropdownParent;

                // For statically positioned elements, we need to get the element
                // that is determining the offset
                if ($offsetParent.css('position') === 'static') {
                    $offsetParent = $offsetParent.offsetParent();
                }

                var parentOffset = {
                    top: 0,
                    left: 0
                };

                if (
                    $.contains(document.body, $offsetParent[0]) ||
                    $offsetParent[0].isConnected
                ) {
                    parentOffset = $offsetParent.offset();
                }

                css.top -= parentOffset.top;
                css.left -= parentOffset.left;

                if (!isCurrentlyAbove && !isCurrentlyBelow) {
                    newDirection = 'below';
                }

                if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                    newDirection = 'above';
                } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
                    newDirection = 'below';
                }

                if (newDirection == 'above' ||
                    (isCurrentlyAbove && newDirection !== 'below')) {
                    css.top = container.top - parentOffset.top - dropdown.height;
                }

                if (newDirection != null) {
                    this.$dropdown
                        .removeClass('select2-dropdown--below select2-dropdown--above')
                        .addClass('select2-dropdown--' + newDirection);
                    this.$container
                        .removeClass('select2-container--below select2-container--above')
                        .addClass('select2-container--' + newDirection);
                }

                this.$dropdownContainer.css(css);
            };

            AttachBody.prototype._resizeDropdown = function () {
                var css = {
                    width: this.$container.outerWidth(false) + 'px'
                };

                if (this.options.get('dropdownAutoWidth')) {
                    css.minWidth = css.width;
                    css.position = 'relative';
                    css.width = '100%';
                }

                this.$dropdown.css(css);
            };

            AttachBody.prototype._showDropdown = function (decorated) {
                this.$dropdownContainer.appendTo(this.$dropdownParent);

                this._positionDropdown();
                this._resizeDropdown();
            };

            return AttachBody;
        });

        S2.define('select2/dropdown/minimumResultsForSearch', [

        ], function () {
            function countResults(data) {
                var count = 0;

                for (var d = 0; d < data.length; d++) {
                    var item = data[d];

                    if (item.children) {
                        count += countResults(item.children);
                    } else {
                        count++;
                    }
                }

                return count;
            }

            function MinimumResultsForSearch(decorated, $element, options, dataAdapter) {
                this.minimumResultsForSearch = options.get('minimumResultsForSearch');

                if (this.minimumResultsForSearch < 0) {
                    this.minimumResultsForSearch = Infinity;
                }

                decorated.call(this, $element, options, dataAdapter);
            }

            MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
                if (countResults(params.data.results) < this.minimumResultsForSearch) {
                    return false;
                }

                return decorated.call(this, params);
            };

            return MinimumResultsForSearch;
        });

        S2.define('select2/dropdown/selectOnClose', [
            '../utils'
        ], function (Utils) {
            function SelectOnClose() { }

            SelectOnClose.prototype.bind = function (decorated, container, $container) {
                var self = this;

                decorated.call(this, container, $container);

                container.on('close', function (params) {
                    self._handleSelectOnClose(params);
                });
            };

            SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
                if (params && params.originalSelect2Event != null) {
                    var event = params.originalSelect2Event;

                    // Don't select an item if the close event was triggered from a select or
                    // unselect event
                    if (event._type === 'select' || event._type === 'unselect') {
                        return;
                    }
                }

                var $highlightedResults = this.getHighlightedResults();

                // Only select highlighted results
                if ($highlightedResults.length < 1) {
                    return;
                }

                var data = Utils.GetData($highlightedResults[0], 'data');

                // Don't re-select already selected resulte
                if (
                    (data.element != null && data.element.selected) ||
                    (data.element == null && data.selected)
                ) {
                    return;
                }

                this.trigger('select', {
                    data: data
                });
            };

            return SelectOnClose;
        });

        S2.define('select2/dropdown/closeOnSelect', [

        ], function () {
            function CloseOnSelect() { }

            CloseOnSelect.prototype.bind = function (decorated, container, $container) {
                var self = this;

                decorated.call(this, container, $container);

                container.on('select', function (evt) {
                    self._selectTriggered(evt);
                });

                container.on('unselect', function (evt) {
                    self._selectTriggered(evt);
                });
            };

            CloseOnSelect.prototype._selectTriggered = function (_, evt) {
                var originalEvent = evt.originalEvent;

                // Don't close if the control key is being held
                if (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey)) {
                    return;
                }

                this.trigger('close', {
                    originalEvent: originalEvent,
                    originalSelect2Event: evt
                });
            };

            return CloseOnSelect;
        });

        S2.define('select2/i18n/en', [], function () {
            // English
            return {
                errorLoading: function () {
                    return 'امکان بارگذاری نتایج وجود ندارد.';
                },
                inputTooLong: function (args) {
                    var overChars = args.input.length - args.maximum;

                    var message = 'لطفا' + overChars + '  کاراکتر را حذف نمایید';

                    if (overChars != 1) {
                        message += 's';
                    }

                    return message;
                },
                inputTooShort: function (args) {
                    var remainingChars = args.minimum - args.input.length;

                    var message = 'لطفا تعداد ' + remainingChars + ' کارکتر یا بیشتر وارد نمایید';

                    return message;
                },
                loadingMore: function () {
                    return 'در حال بارگذاری نتایج بیشتر...';
                },
                maximumSelected: function (args) {
                    var message = 'You can only select ' + args.maximum + ' item';

                    if (args.maximum != 1) {
                        message += 's';
                    }

                    return message;
                },
                noResults: function () {
                    return 'موردی یافت نشد...';
                },
                searching: function () {
                    return 'در حال جستجو...';
                },
                removeAllItems: function () {
                    return 'همه موارد را حذف کنید';
                }
            };
        });

        S2.define('select2/defaults', [
            'jquery',
            'require',

            './results',

            './selection/single',
            './selection/multiple',
            './selection/placeholder',
            './selection/allowClear',
            './selection/search',
            './selection/eventRelay',

            './utils',
            './translation',
            './diacritics',

            './data/select',
            './data/array',
            './data/ajax',
            './data/tags',
            './data/tokenizer',
            './data/minimumInputLength',
            './data/maximumInputLength',
            './data/maximumSelectionLength',

            './dropdown',
            './dropdown/search',
            './dropdown/hidePlaceholder',
            './dropdown/infiniteScroll',
            './dropdown/attachBody',
            './dropdown/minimumResultsForSearch',
            './dropdown/selectOnClose',
            './dropdown/closeOnSelect',

            './i18n/en'
        ], function ($, require,

            ResultsList,

            SingleSelection, MultipleSelection, Placeholder, AllowClear,
            SelectionSearch, EventRelay,

            Utils, Translation, DIACRITICS,

            SelectData, ArrayData, AjaxData, Tags, Tokenizer,
            MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

            Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
            AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

            EnglishTranslation) {
                function Defaults() {
                    this.reset();
                }

                Defaults.prototype.apply = function (options) {
                    options = $.extend(true, {}, this.defaults, options);

                    if (options.dataAdapter == null) {
                        if (options.ajax != null) {
                            options.dataAdapter = AjaxData;
                        } else if (options.data != null) {
                            options.dataAdapter = ArrayData;
                        } else {
                            options.dataAdapter = SelectData;
                        }

                        if (options.minimumInputLength > 0) {
                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                MinimumInputLength
                            );
                        }

                        if (options.maximumInputLength > 0) {
                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                MaximumInputLength
                            );
                        }

                        if (options.maximumSelectionLength > 0) {
                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                MaximumSelectionLength
                            );
                        }

                        if (options.tags) {
                            options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
                        }

                        if (options.tokenSeparators != null || options.tokenizer != null) {
                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                Tokenizer
                            );
                        }

                        if (options.query != null) {
                            var Query = require(options.amdBase + 'compat/query');

                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                Query
                            );
                        }

                        if (options.initSelection != null) {
                            var InitSelection = require(options.amdBase + 'compat/initSelection');

                            options.dataAdapter = Utils.Decorate(
                                options.dataAdapter,
                                InitSelection
                            );
                        }
                    }

                    if (options.resultsAdapter == null) {
                        options.resultsAdapter = ResultsList;

                        if (options.ajax != null) {
                            options.resultsAdapter = Utils.Decorate(
                                options.resultsAdapter,
                                InfiniteScroll
                            );
                        }

                        if (options.placeholder != null) {
                            options.resultsAdapter = Utils.Decorate(
                                options.resultsAdapter,
                                HidePlaceholder
                            );
                        }

                        if (options.selectOnClose) {
                            options.resultsAdapter = Utils.Decorate(
                                options.resultsAdapter,
                                SelectOnClose
                            );
                        }
                    }

                    if (options.dropdownAdapter == null) {
                        if (options.multiple) {
                            options.dropdownAdapter = Dropdown;
                        } else {
                            var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

                            options.dropdownAdapter = SearchableDropdown;
                        }

                        if (options.minimumResultsForSearch !== 0) {
                            options.dropdownAdapter = Utils.Decorate(
                                options.dropdownAdapter,
                                MinimumResultsForSearch
                            );
                        }

                        if (options.closeOnSelect) {
                            options.dropdownAdapter = Utils.Decorate(
                                options.dropdownAdapter,
                                CloseOnSelect
                            );
                        }

                        if (
                            options.dropdownCssClass != null ||
                            options.dropdownCss != null ||
                            options.adaptDropdownCssClass != null
                        ) {
                            var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

                            options.dropdownAdapter = Utils.Decorate(
                                options.dropdownAdapter,
                                DropdownCSS
                            );
                        }

                        options.dropdownAdapter = Utils.Decorate(
                            options.dropdownAdapter,
                            AttachBody
                        );
                    }

                    if (options.selectionAdapter == null) {
                        if (options.multiple) {
                            options.selectionAdapter = MultipleSelection;
                        } else {
                            options.selectionAdapter = SingleSelection;
                        }

                        // Add the placeholder mixin if a placeholder was specified
                        if (options.placeholder != null) {
                            options.selectionAdapter = Utils.Decorate(
                                options.selectionAdapter,
                                Placeholder
                            );
                        }

                        if (options.allowClear) {
                            options.selectionAdapter = Utils.Decorate(
                                options.selectionAdapter,
                                AllowClear
                            );
                        }

                        if (options.multiple) {
                            options.selectionAdapter = Utils.Decorate(
                                options.selectionAdapter,
                                SelectionSearch
                            );
                        }

                        if (
                            options.containerCssClass != null ||
                            options.containerCss != null ||
                            options.adaptContainerCssClass != null
                        ) {
                            var ContainerCSS = require(options.amdBase + 'compat/containerCss');

                            options.selectionAdapter = Utils.Decorate(
                                options.selectionAdapter,
                                ContainerCSS
                            );
                        }

                        options.selectionAdapter = Utils.Decorate(
                            options.selectionAdapter,
                            EventRelay
                        );
                    }

                    // If the defaults were not previously applied from an element, it is
                    // possible for the language option to have not been resolved
                    options.language = this._resolveLanguage(options.language);

                    // Always fall back to English since it will always be complete
                    options.language.push('en');

                    var uniqueLanguages = [];

                    for (var l = 0; l < options.language.length; l++) {
                        var language = options.language[l];

                        if (uniqueLanguages.indexOf(language) === -1) {
                            uniqueLanguages.push(language);
                        }
                    }

                    options.language = uniqueLanguages;

                    options.translations = this._processTranslations(
                        options.language,
                        options.debug
                    );

                    return options;
                };

                Defaults.prototype.reset = function () {
                    function stripDiacritics(text) {
                        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
                        function match(a) {
                            return DIACRITICS[a] || a;
                        }

                        return text.replace(/[^\u0000-\u007E]/g, match);
                    }

                    function matcher(params, data) {
                        // Always return the object if there is nothing to compare
                        if ($.trim(params.term) === '') {
                            return data;
                        }

                        // Do a recursive check for options with children
                        if (data.children && data.children.length > 0) {
                            // Clone the data object if there are children
                            // This is required as we modify the object to remove any non-matches
                            var match = $.extend(true, {}, data);

                            // Check each child of the option
                            for (var c = data.children.length - 1; c >= 0; c--) {
                                var child = data.children[c];

                                var matches = matcher(params, child);

                                // If there wasn't a match, remove the object in the array
                                if (matches == null) {
                                    match.children.splice(c, 1);
                                }
                            }

                            // If any children matched, return the new object
                            if (match.children.length > 0) {
                                return match;
                            }

                            // If there were no matching children, check just the plain object
                            return matcher(params, match);
                        }

                        var original = stripDiacritics(data.text).toUpperCase();
                        var term = stripDiacritics(params.term).toUpperCase();

                        // Check if the text contains the term
                        if (original.indexOf(term) > -1) {
                            return data;
                        }

                        // If it doesn't contain the term, don't return anything
                        return null;
                    }

                    this.defaults = {
                        amdBase: './',
                        amdLanguageBase: './i18n/',
                        closeOnSelect: true,
                        debug: false,
                        dropdownAutoWidth: false,
                        escapeMarkup: Utils.escapeMarkup,
                        language: {},
                        matcher: matcher,
                        minimumInputLength: 0,
                        maximumInputLength: 0,
                        maximumSelectionLength: 0,
                        minimumResultsForSearch: 0,
                        selectOnClose: false,
                        scrollAfterSelect: false,
                        sorter: function (data) {
                            return data;
                        },
                        templateResult: function (result) {
                            return result.text;
                        },
                        templateSelection: function (selection) {
                            return selection.text;
                        },
                        theme: 'default',
                        width: 'resolve'
                    };
                };

                Defaults.prototype.applyFromElement = function (options, $element) {
                    var optionLanguage = options.language;
                    var defaultLanguage = this.defaults.language;
                    var elementLanguage = $element.prop('lang');
                    var parentLanguage = $element.closest('[lang]').prop('lang');

                    var languages = Array.prototype.concat.call(
                        this._resolveLanguage(elementLanguage),
                        this._resolveLanguage(optionLanguage),
                        this._resolveLanguage(defaultLanguage),
                        this._resolveLanguage(parentLanguage)
                    );

                    options.language = languages;

                    return options;
                };

                Defaults.prototype._resolveLanguage = function (language) {
                    if (!language) {
                        return [];
                    }

                    if ($.isEmptyObject(language)) {
                        return [];
                    }

                    if ($.isPlainObject(language)) {
                        return [language];
                    }

                    var languages;

                    if (!$.isArray(language)) {
                        languages = [language];
                    } else {
                        languages = language;
                    }

                    var resolvedLanguages = [];

                    for (var l = 0; l < languages.length; l++) {
                        resolvedLanguages.push(languages[l]);

                        if (typeof languages[l] === 'string' && languages[l].indexOf('-') > 0) {
                            // Extract the region information if it is included
                            var languageParts = languages[l].split('-');
                            var baseLanguage = languageParts[0];

                            resolvedLanguages.push(baseLanguage);
                        }
                    }

                    return resolvedLanguages;
                };

                Defaults.prototype._processTranslations = function (languages, debug) {
                    var translations = new Translation();

                    for (var l = 0; l < languages.length; l++) {
                        var languageData = new Translation();

                        var language = languages[l];

                        if (typeof language === 'string') {
                            try {
                                // Try to load it with the original name
                                languageData = Translation.loadPath(language);
                            } catch (e) {
                                try {
                                    // If we couldn't load it, check if it wasn't the full path
                                    language = this.defaults.amdLanguageBase + language;
                                    languageData = Translation.loadPath(language);
                                } catch (ex) {
                                    // The translation could not be loaded at all. Sometimes this is
                                    // because of a configuration problem, other times this can be
                                    // because of how Select2 helps load all possible translation files
                                    if (debug && window.console && console.warn) {
                                        console.warn(
                                            'Select2: The language file for "' + language + '" could ' +
                                            'not be automatically loaded. A fallback will be used instead.'
                                        );
                                    }
                                }
                            }
                        } else if ($.isPlainObject(language)) {
                            languageData = new Translation(language);
                        } else {
                            languageData = language;
                        }

                        translations.extend(languageData);
                    }

                    return translations;
                };

                Defaults.prototype.set = function (key, value) {
                    var camelKey = $.camelCase(key);

                    var data = {};
                    data[camelKey] = value;

                    var convertedData = Utils._convertData(data);

                    $.extend(true, this.defaults, convertedData);
                };

                var defaults = new Defaults();

                return defaults;
            });

        S2.define('select2/options', [
            'require',
            'jquery',
            './defaults',
            './utils'
        ], function (require, $, Defaults, Utils) {
            function Options(options, $element) {
                this.options = options;

                if ($element != null) {
                    this.fromElement($element);
                }

                if ($element != null) {
                    this.options = Defaults.applyFromElement(this.options, $element);
                }

                this.options = Defaults.apply(this.options);

                if ($element && $element.is('input')) {
                    var InputCompat = require(this.get('amdBase') + 'compat/inputData');

                    this.options.dataAdapter = Utils.Decorate(
                        this.options.dataAdapter,
                        InputCompat
                    );
                }
            }

            Options.prototype.fromElement = function ($e) {
                var excludedData = ['select2'];

                if (this.options.multiple == null) {
                    this.options.multiple = $e.prop('multiple');
                }

                if (this.options.disabled == null) {
                    this.options.disabled = $e.prop('disabled');
                }

                if (this.options.dir == null) {
                    if ($e.prop('dir')) {
                        this.options.dir = $e.prop('dir');
                    } else if ($e.closest('[dir]').prop('dir')) {
                        this.options.dir = $e.closest('[dir]').prop('dir');
                    } else {
                        this.options.dir = 'ltr';
                    }
                }

                $e.prop('disabled', this.options.disabled);
                $e.prop('multiple', this.options.multiple);

                if (Utils.GetData($e[0], 'select2Tags')) {
                    if (this.options.debug && window.console && console.warn) {
                        console.warn(
                            'Select2: The `data-select2-tags` attribute has been changed to ' +
                            'use the `data-data` and `data-tags="true"` attributes and will be ' +
                            'removed in future versions of Select2.'
                        );
                    }

                    Utils.StoreData($e[0], 'data', Utils.GetData($e[0], 'select2Tags'));
                    Utils.StoreData($e[0], 'tags', true);
                }

                if (Utils.GetData($e[0], 'ajaxUrl')) {
                    if (this.options.debug && window.console && console.warn) {
                        console.warn(
                            'Select2: The `data-ajax-url` attribute has been changed to ' +
                            '`data-ajax--url` and support for the old attribute will be removed' +
                            ' in future versions of Select2.'
                        );
                    }

                    $e.attr('ajax--url', Utils.GetData($e[0], 'ajaxUrl'));
                    Utils.StoreData($e[0], 'ajax-Url', Utils.GetData($e[0], 'ajaxUrl'));
                }

                var dataset = {};

                function upperCaseLetter(_, letter) {
                    return letter.toUpperCase();
                }

                // Pre-load all of the attributes which are prefixed with `data-`
                for (var attr = 0; attr < $e[0].attributes.length; attr++) {
                    var attributeName = $e[0].attributes[attr].name;
                    var prefix = 'data-';

                    if (attributeName.substr(0, prefix.length) == prefix) {
                        // Get the contents of the attribute after `data-`
                        var dataName = attributeName.substring(prefix.length);

                        // Get the data contents from the consistent source
                        // This is more than likely the jQuery data helper
                        var dataValue = Utils.GetData($e[0], dataName);

                        // camelCase the attribute name to match the spec
                        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);

                        // Store the data attribute contents into the dataset since
                        dataset[camelDataName] = dataValue;
                    }
                }

                // Prefer the element's `dataset` attribute if it exists
                // jQuery 1.x does not correctly handle data attributes with multiple dashes
                if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
                    dataset = $.extend(true, {}, $e[0].dataset, dataset);
                }

                // Prefer our internal data cache if it exists
                var data = $.extend(true, {}, Utils.GetData($e[0]), dataset);

                data = Utils._convertData(data);

                for (var key in data) {
                    if ($.inArray(key, excludedData) > -1) {
                        continue;
                    }

                    if ($.isPlainObject(this.options[key])) {
                        $.extend(this.options[key], data[key]);
                    } else {
                        this.options[key] = data[key];
                    }
                }

                return this;
            };

            Options.prototype.get = function (key) {
                return this.options[key];
            };

            Options.prototype.set = function (key, val) {
                this.options[key] = val;
            };

            return Options;
        });

        S2.define('select2/core', [
            'jquery',
            './options',
            './utils',
            './keys'
        ], function ($, Options, Utils, KEYS) {
            var Select2 = function ($element, options) {
                if (Utils.GetData($element[0], 'select2') != null) {
                    Utils.GetData($element[0], 'select2').destroy();
                }

                this.$element = $element;

                this.id = this._generateId($element);

                options = options || {};

                this.options = new Options(options, $element);

                Select2.__super__.constructor.call(this);

                // Set up the tabindex

                var tabindex = $element.attr('tabindex') || 0;
                Utils.StoreData($element[0], 'old-tabindex', tabindex);
                $element.attr('tabindex', '-1');

                // Set up containers and adapters

                var DataAdapter = this.options.get('dataAdapter');
                this.dataAdapter = new DataAdapter($element, this.options);

                var $container = this.render();

                this._placeContainer($container);

                var SelectionAdapter = this.options.get('selectionAdapter');
                this.selection = new SelectionAdapter($element, this.options);
                this.$selection = this.selection.render();

                this.selection.position(this.$selection, $container);

                var DropdownAdapter = this.options.get('dropdownAdapter');
                this.dropdown = new DropdownAdapter($element, this.options);
                this.$dropdown = this.dropdown.render();

                this.dropdown.position(this.$dropdown, $container);

                var ResultsAdapter = this.options.get('resultsAdapter');
                this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
                this.$results = this.results.render();

                this.results.position(this.$results, this.$dropdown);

                // Bind events

                var self = this;

                // Bind the container to all of the adapters
                this._bindAdapters();

                // Register any DOM event handlers
                this._registerDomEvents();

                // Register any internal event handlers
                this._registerDataEvents();
                this._registerSelectionEvents();
                this._registerDropdownEvents();
                this._registerResultsEvents();
                this._registerEvents();

                // Set the initial state
                this.dataAdapter.current(function (initialData) {
                    self.trigger('selection:update', {
                        data: initialData
                    });
                });

                // Hide the original select
                $element.addClass('select2-hidden-accessible');
                $element.attr('aria-hidden', 'true');

                // Synchronize any monitored attributes
                this._syncAttributes();

                Utils.StoreData($element[0], 'select2', this);

                // Ensure backwards compatibility with $element.data('select2').
                $element.data('select2', this);
            };

            Utils.Extend(Select2, Utils.Observable);

            Select2.prototype._generateId = function ($element) {
                var id = '';

                if ($element.attr('id') != null) {
                    id = $element.attr('id');
                } else if ($element.attr('name') != null) {
                    id = $element.attr('name') + '-' + Utils.generateChars(2);
                } else {
                    id = Utils.generateChars(4);
                }

                id = id.replace(/(:|\.|\[|\]|,)/g, '');
                id = 'select2-' + id;

                return id;
            };

            Select2.prototype._placeContainer = function ($container) {
                $container.insertAfter(this.$element);

                var width = this._resolveWidth(this.$element, this.options.get('width'));

                if (width != null) {
                    $container.css('width', width);
                }
            };

            Select2.prototype._resolveWidth = function ($element, method) {
                var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

                if (method == 'resolve') {
                    var styleWidth = this._resolveWidth($element, 'style');

                    if (styleWidth != null) {
                        return styleWidth;
                    }

                    return this._resolveWidth($element, 'element');
                }

                if (method == 'element') {
                    var elementWidth = $element.outerWidth(false);

                    if (elementWidth <= 0) {
                        return 'auto';
                    }

                    return elementWidth + 'px';
                }

                if (method == 'style') {
                    var style = $element.attr('style');

                    if (typeof (style) !== 'string') {
                        return null;
                    }

                    var attrs = style.split(';');

                    for (var i = 0, l = attrs.length; i < l; i = i + 1) {
                        var attr = attrs[i].replace(/\s/g, '');
                        var matches = attr.match(WIDTH);

                        if (matches !== null && matches.length >= 1) {
                            return matches[1];
                        }
                    }

                    return null;
                }

                if (method == 'computedstyle') {
                    var computedStyle = window.getComputedStyle($element[0]);

                    return computedStyle.width;
                }

                return method;
            };

            Select2.prototype._bindAdapters = function () {
                this.dataAdapter.bind(this, this.$container);
                this.selection.bind(this, this.$container);

                this.dropdown.bind(this, this.$container);
                this.results.bind(this, this.$container);
            };

            Select2.prototype._registerDomEvents = function () {
                var self = this;

                this.$element.on('change.select2', function () {
                    self.dataAdapter.current(function (data) {
                        self.trigger('selection:update', {
                            data: data
                        });
                    });
                });

                this.$element.on('focus.select2', function (evt) {
                    self.trigger('focus', evt);
                });

                this._syncA = Utils.bind(this._syncAttributes, this);
                this._syncS = Utils.bind(this._syncSubtree, this);

                if (this.$element[0].attachEvent) {
                    this.$element[0].attachEvent('onpropertychange', this._syncA);
                }

                var observer = window.MutationObserver ||
                    window.WebKitMutationObserver ||
                    window.MozMutationObserver
                    ;

                if (observer != null) {
                    this._observer = new observer(function (mutations) {
                        self._syncA();
                        self._syncS(null, mutations);
                    });
                    this._observer.observe(this.$element[0], {
                        attributes: true,
                        childList: true,
                        subtree: false
                    });
                } else if (this.$element[0].addEventListener) {
                    this.$element[0].addEventListener(
                        'DOMAttrModified',
                        self._syncA,
                        false
                    );
                    this.$element[0].addEventListener(
                        'DOMNodeInserted',
                        self._syncS,
                        false
                    );
                    this.$element[0].addEventListener(
                        'DOMNodeRemoved',
                        self._syncS,
                        false
                    );
                }
            };

            Select2.prototype._registerDataEvents = function () {
                var self = this;

                this.dataAdapter.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };

            Select2.prototype._registerSelectionEvents = function () {
                var self = this;
                var nonRelayEvents = ['toggle', 'focus'];

                this.selection.on('toggle', function () {
                    self.toggleDropdown();
                });

                this.selection.on('focus', function (params) {
                    self.focus(params);
                });

                this.selection.on('*', function (name, params) {
                    if ($.inArray(name, nonRelayEvents) !== -1) {
                        return;
                    }

                    self.trigger(name, params);
                });
            };

            Select2.prototype._registerDropdownEvents = function () {
                var self = this;

                this.dropdown.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };

            Select2.prototype._registerResultsEvents = function () {
                var self = this;

                this.results.on('*', function (name, params) {
                    self.trigger(name, params);
                });
            };

            Select2.prototype._registerEvents = function () {
                var self = this;

                this.on('open', function () {
                    self.$container.addClass('select2-container--open');
                });

                this.on('close', function () {
                    self.$container.removeClass('select2-container--open');
                });

                this.on('enable', function () {
                    self.$container.removeClass('select2-container--disabled');
                });

                this.on('disable', function () {
                    self.$container.addClass('select2-container--disabled');
                });

                this.on('blur', function () {
                    self.$container.removeClass('select2-container--focus');
                });

                this.on('query', function (params) {
                    if (!self.isOpen()) {
                        self.trigger('open', {});
                    }

                    this.dataAdapter.query(params, function (data) {
                        self.trigger('results:all', {
                            data: data,
                            query: params
                        });
                    });
                });

                this.on('query:append', function (params) {
                    this.dataAdapter.query(params, function (data) {
                        self.trigger('results:append', {
                            data: data,
                            query: params
                        });
                    });
                });

                this.on('keypress', function (evt) {
                    var key = evt.which;

                    if (self.isOpen()) {
                        if (key === KEYS.ESC || key === KEYS.TAB ||
                            (key === KEYS.UP && evt.altKey)) {
                            self.close(evt);

                            evt.preventDefault();
                        } else if (key === KEYS.ENTER) {
                            self.trigger('results:select', {});

                            evt.preventDefault();
                        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
                            self.trigger('results:toggle', {});

                            evt.preventDefault();
                        } else if (key === KEYS.UP) {
                            self.trigger('results:previous', {});

                            evt.preventDefault();
                        } else if (key === KEYS.DOWN) {
                            self.trigger('results:next', {});

                            evt.preventDefault();
                        }
                    } else {
                        if (key >= 48 && key <= 57 || (key >= 96 && key <= 105)) {
                            self.open();
                            evt.preventDefault();
                        }
                        else if (key === KEYS.SPACE || (key === KEYS.DOWN)) {
                            self.open();
                            evt.preventDefault();
                        }
                    }
                });
            };

            Select2.prototype._syncAttributes = function () {
                this.options.set('disabled', this.$element.prop('disabled'));

                if (this.isDisabled()) {
                    if (this.isOpen()) {
                        this.close();
                    }

                    this.trigger('disable', {});
                } else {
                    this.trigger('enable', {});
                }
            };

            Select2.prototype._isChangeMutation = function (evt, mutations) {
                var changed = false;
                var self = this;

                // Ignore any mutation events raised for elements that aren't options or
                // optgroups. This handles the case when the select element is destroyed
                if (
                    evt && evt.target && (
                        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
                    )
                ) {
                    return;
                }

                if (!mutations) {
                    // If mutation events aren't supported, then we can only assume that the
                    // change affected the selections
                    changed = true;
                } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
                    for (var n = 0; n < mutations.addedNodes.length; n++) {
                        var node = mutations.addedNodes[n];

                        if (node.selected) {
                            changed = true;
                        }
                    }
                } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
                    changed = true;
                } else if ($.isArray(mutations)) {
                    $.each(mutations, function (evt, mutation) {
                        if (self._isChangeMutation(evt, mutation)) {
                            // We've found a change mutation.
                            // Let's escape from the loop and continue
                            changed = true;
                            return false;
                        }
                    });
                }
                return changed;
            };

            Select2.prototype._syncSubtree = function (evt, mutations) {
                var changed = this._isChangeMutation(evt, mutations);
                var self = this;

                // Only re-pull the data if we think there is a change
                if (changed) {
                    this.dataAdapter.current(function (currentData) {
                        self.trigger('selection:update', {
                            data: currentData
                        });
                    });
                }
            };

            /**
             * Override the trigger method to automatically trigger pre-events when
             * there are events that can be prevented.
             */
            Select2.prototype.trigger = function (name, args) {
                var actualTrigger = Select2.__super__.trigger;
                var preTriggerMap = {
                    'open': 'opening',
                    'close': 'closing',
                    'select': 'selecting',
                    'unselect': 'unselecting',
                    'clear': 'clearing'
                };

                if (args === undefined) {
                    args = {};
                }

                if (name in preTriggerMap) {
                    var preTriggerName = preTriggerMap[name];
                    var preTriggerArgs = {
                        prevented: false,
                        name: name,
                        args: args
                    };

                    actualTrigger.call(this, preTriggerName, preTriggerArgs);

                    if (preTriggerArgs.prevented) {
                        args.prevented = true;

                        return;
                    }
                }

                actualTrigger.call(this, name, args);
            };

            Select2.prototype.toggleDropdown = function () {
                if (this.isDisabled()) {
                    return;
                }

                if (this.isOpen()) {
                    this.close();
                } else {
                    this.open();
                }
            };

            Select2.prototype.open = function () {
                if (this.isOpen()) {
                    return;
                }

                if (this.isDisabled()) {
                    return;
                }

                this.trigger('query', {});
            };

            Select2.prototype.close = function (evt) {
                if (!this.isOpen()) {
                    return;
                }

                this.trigger('close', { originalEvent: evt });
            };

            /**
             * Helper method to abstract the "enabled" (not "disabled") state of this
             * object.
             *
             * @return {true} if the instance is not disabled.
             * @return {false} if the instance is disabled.
             */
            Select2.prototype.isEnabled = function () {
                return !this.isDisabled();
            };

            /**
             * Helper method to abstract the "disabled" state of this object.
             *
             * @return {true} if the disabled option is true.
             * @return {false} if the disabled option is false.
             */
            Select2.prototype.isDisabled = function () {
                return this.options.get('disabled');
            };

            Select2.prototype.isOpen = function () {
                return this.$container.hasClass('select2-container--open');
            };

            Select2.prototype.hasFocus = function () {
                return this.$container.hasClass('select2-container--focus');
            };

            Select2.prototype.focus = function (data) {
                // No need to re-trigger focus events if we are already focused
                if (this.hasFocus()) {
                    return;
                }

                this.$container.addClass('select2-container--focus');
                this.trigger('focus', {});
            };

            Select2.prototype.enable = function (args) {
                if (this.options.get('debug') && window.console && console.warn) {
                    console.warn(
                        'Select2: The `select2("enable")` method has been deprecated and will' +
                        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
                        ' instead.'
                    );
                }

                if (args == null || args.length === 0) {
                    args = [true];
                }

                var disabled = !args[0];

                this.$element.prop('disabled', disabled);
            };

            Select2.prototype.data = function () {
                if (this.options.get('debug') &&
                    arguments.length > 0 && window.console && console.warn) {
                    console.warn(
                        'Select2: Data can no longer be set using `select2("data")`. You ' +
                        'should consider setting the value instead using `$element.val()`.'
                    );
                }

                var data = [];

                this.dataAdapter.current(function (currentData) {
                    data = currentData;
                });

                return data;
            };

            Select2.prototype.val = function (args) {
                if (this.options.get('debug') && window.console && console.warn) {
                    console.warn(
                        'Select2: The `select2("val")` method has been deprecated and will be' +
                        ' removed in later Select2 versions. Use $element.val() instead.'
                    );
                }

                if (args == null || args.length === 0) {
                    return this.$element.val();
                }

                var newVal = args[0];

                if ($.isArray(newVal)) {
                    newVal = $.map(newVal, function (obj) {
                        return obj.toString();
                    });
                }

                this.$element.val(newVal).trigger('input').trigger('change');
            };

            Select2.prototype.destroy = function () {
                this.$container.remove();

                if (this.$element[0].detachEvent) {
                    this.$element[0].detachEvent('onpropertychange', this._syncA);
                }

                if (this._observer != null) {
                    this._observer.disconnect();
                    this._observer = null;
                } else if (this.$element[0].removeEventListener) {
                    this.$element[0]
                        .removeEventListener('DOMAttrModified', this._syncA, false);
                    this.$element[0]
                        .removeEventListener('DOMNodeInserted', this._syncS, false);
                    this.$element[0]
                        .removeEventListener('DOMNodeRemoved', this._syncS, false);
                }

                this._syncA = null;
                this._syncS = null;

                this.$element.off('.select2');
                this.$element.attr('tabindex',
                    Utils.GetData(this.$element[0], 'old-tabindex'));

                this.$element.removeClass('select2-hidden-accessible');
                this.$element.attr('aria-hidden', 'false');
                Utils.RemoveData(this.$element[0]);
                this.$element.removeData('select2');

                this.dataAdapter.destroy();
                this.selection.destroy();
                this.dropdown.destroy();
                this.results.destroy();

                this.dataAdapter = null;
                this.selection = null;
                this.dropdown = null;
                this.results = null;
            };

            Select2.prototype.render = function () {
                var $container = $(
                    '<span class="select2 select2-container">' +
                    '<span class="selection"></span>' +
                    '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
                    '</span>'
                );

                $container.attr('dir', this.options.get('dir'));

                this.$container = $container;

                this.$container.addClass('select2-container--' + this.options.get('theme'));

                Utils.StoreData($container[0], 'element', this.$element);

                return $container;
            };

            return Select2;
        });

        S2.define('jquery-mousewheel', [
            'jquery'
        ], function ($) {
            // Used to shim jQuery.mousewheel for non-full builds.
            return $;
        });

        S2.define('jquery.select2', [
            'jquery',
            'jquery-mousewheel',

            './select2/core',
            './select2/defaults',
            './select2/utils'
        ], function ($, _, Select2, Defaults, Utils) {
            if ($.fn.select2 == null) {
                // All methods that should return the element
                var thisMethods = ['open', 'close', 'destroy'];

                $.fn.select2 = function (options) {
                    options = options || {};

                    if (typeof options === 'object') {
                        this.each(function () {
                            var instanceOptions = $.extend(true, {}, options);

                            var instance = new Select2($(this), instanceOptions);
                        });

                        return this;
                    } else if (typeof options === 'string') {
                        var ret;
                        var args = Array.prototype.slice.call(arguments, 1);

                        this.each(function () {
                            var instance = Utils.GetData(this, 'select2');

                            if (instance == null && window.console && console.error) {
                                console.error(
                                    'The select2(\'' + options + '\') method was called on an ' +
                                    'element that is not using Select2.'
                                );
                            }

                            ret = instance[options].apply(instance, args);
                        });

                        // Check if we should be returning `this`
                        if ($.inArray(options, thisMethods) > -1) {
                            return this;
                        }

                        return ret;
                    } else {
                        throw new Error('Invalid arguments for Select2: ' + options);
                    }
                };
            }

            if ($.fn.select2.defaults == null) {
                $.fn.select2.defaults = Defaults;
            }

            return Select2;
        });

        // Return the AMD loader configuration so it can be used outside of this file
        return {
            define: S2.define,
            require: S2.require
        };
    }());

    // Autoload the jQuery bindings
    // We know that all of the modules exist above this, so we're safe
    var select2 = S2.require('jquery.select2');

    // Hold the AMD module references on the jQuery function that was just loaded
    // This allows Select2 to use the internal loader outside of this file, such
    // as in the language files.
    jQuery.fn.select2.amd = S2;

    // Return the Select2 instance for anyone who is importing it.
    return select2;
}));
function _toConsumableArray(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i
    }
    return Array.from(t)
}
var _slice = Array.prototype.slice;
! function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], e) : t.parsley = e(t.jQuery)
}(this, function (t) {
    "use strict";

    function e(t, e) {
        return t.parsleyAdaptedCallback || (t.parsleyAdaptedCallback = function () {
            var i = Array.prototype.slice.call(arguments, 0);
            i.unshift(this), t.apply(e || E, i)
        }), t.parsleyAdaptedCallback
    }

    function i(t) {
        return 0 === t.lastIndexOf(V, 0) ? t.substr(V.length) : t
    }
    var r = 1,
        n = {},
        s = {
            attr: function (t, e, i) {
                var r, n, s, a = new RegExp("^" + e, "i");
                if (void 0 === i) i = {};
                else
                    for (r in i) i.hasOwnProperty(r) && delete i[r];
                if (void 0 === t || void 0 === t[0]) return i;
                for (r = (s = t[0].attributes).length; r--;)(n = s[r]) && n.specified && a.test(n.name) && (i[this.camelize(n.name.slice(e.length))] = this.deserializeValue(n.value));
                return i
            },
            checkAttr: function (t, e, i) {
                return t.is("[" + e + i + "]")
            },
            setAttr: function (t, e, i, r) {
                t[0].setAttribute(this.dasherize(e + i), String(r))
            },
            generateID: function () {
                return "" + r++
            },
            deserializeValue: function (e) {
                var i;
                try {
                    return e ? "true" == e || "false" != e && ("null" == e ? null : isNaN(i = Number(e)) ? /^[\[\{]/.test(e) ? t.parseJSON(e) : e : i) : e
                } catch (t) {
                    return e
                }
            },
            camelize: function (t) {
                return t.replace(/-+(.)?/g, function (t, e) {
                    return e ? e.toUpperCase() : ""
                })
            },
            dasherize: function (t) {
                return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
            },
            warn: function () {
                var t;
                window.console && "function" == typeof window.console.warn && (t = window.console).warn.apply(t, arguments)
            },
            warnOnce: function (t) {
                n[t] || (n[t] = !0, this.warn.apply(this, arguments))
            },
            _resetWarnings: function () {
                n = {}
            },
            trimString: function (t) {
                return t.replace(/^\s+|\s+$/g, "")
            },
            namespaceEvents: function (e, i) {
                return (e = this.trimString(e || "").split(/\s+/))[0] ? t.map(e, function (t) {
                    return t + "." + i
                }).join(" ") : ""
            },
            difference: function (e, i) {
                var r = [];
                return t.each(e, function (t, e) {
                    -1 == i.indexOf(e) && r.push(e)
                }), r
            },
            all: function (e) {
                return t.when.apply(t, _toConsumableArray(e).concat([42, 42]))
            },
            objectCreate: Object.create || function () {
                var t = function () { };
                return function (e) {
                    if (arguments.length > 1) throw Error("Second argument not supported");
                    if ("object" != typeof e) throw TypeError("Argument must be an object");
                    t.prototype = e;
                    var i = new t;
                    return t.prototype = null, i
                }
            }()
        },
        a = {
            namespace: "data-parsley-",
            inputs: "input, textarea, select",
            excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden]",
            priorityEnabled: !0,
            multiple: null,
            group: null,
            uiEnabled: !0,
            validationThreshold: 3,
            focus: "first",
            trigger: !1,
            triggerAfterFailure: "input",
            errorClass: "parsley-error",
            successClass: "parsley-success",
            classHandler: function (t) { },
            errorsContainer: function (t) { },
            errorsWrapper: '<ul class="parsley-errors-list"></ul>',
            errorTemplate: "<li></li>"
        },
        o = function () {
            this.__id__ = s.generateID()
        };
    o.prototype = {
        asyncSupport: !0,
        _pipeAccordingToValidationResult: function () {
            var e = this,
                i = function () {
                    var i = t.Deferred();
                    return !0 !== e.validationResult && i.reject(), i.resolve().promise()
                };
            return [i, i]
        },
        actualizeOptions: function () {
            return s.attr(this.$element, this.options.namespace, this.domOptions), this.parent && this.parent.actualizeOptions && this.parent.actualizeOptions(), this
        },
        _resetOptions: function (t) {
            for (var e in this.domOptions = s.objectCreate(this.parent.options), this.options = s.objectCreate(this.domOptions), t) t.hasOwnProperty(e) && (this.options[e] = t[e]);
            this.actualizeOptions()
        },
        _listeners: null,
        on: function (t, e) {
            return this._listeners = this._listeners || {}, (this._listeners[t] = this._listeners[t] || []).push(e), this
        },
        subscribe: function (e, i) {
            t.listenTo(this, e.toLowerCase(), i)
        },
        off: function (t, e) {
            var i = this._listeners && this._listeners[t];
            if (i)
                if (e)
                    for (var r = i.length; r--;) i[r] === e && i.splice(r, 1);
                else delete this._listeners[t];
            return this
        },
        unsubscribe: function (e, i) {
            t.unsubscribeTo(this, e.toLowerCase())
        },
        trigger: function (t, e, i) {
            e = e || this;
            var r, n = this._listeners && this._listeners[t];
            if (n)
                for (var s = n.length; s--;)
                    if (!1 === (r = n[s].call(e, e, i))) return r;
            return !this.parent || this.parent.trigger(t, e, i)
        },
        reset: function () {
            if ("ParsleyForm" !== this.__class__) return this._resetUI(), this._trigger("reset");
            for (var t = 0; t < this.fields.length; t++) this.fields[t].reset();
            this._trigger("reset")
        },
        destroy: function () {
            if (this._destroyUI(), "ParsleyForm" !== this.__class__) return this.$element.removeData("Parsley"), this.$element.removeData("ParsleyFieldMultiple"), void this._trigger("destroy");
            for (var t = 0; t < this.fields.length; t++) this.fields[t].destroy();
            this.$element.removeData("Parsley"), this._trigger("destroy")
        },
        asyncIsValid: function (t, e) {
            return s.warnOnce("asyncIsValid is deprecated; please use whenValid instead"), this.whenValid({
                group: t,
                force: e
            })
        },
        _findRelated: function () {
            return this.options.multiple ? this.parent.$element.find("[" + this.options.namespace + 'multiple="' + this.options.multiple + '"]') : this.$element
        }
    };
    var l = {
        string: function (t) {
            return t
        },
        integer: function (t) {
            if (isNaN(t)) throw 'Requirement is not an integer: "' + t + '"';
            return parseInt(t, 10)
        },
        number: function (t) {
            if (isNaN(t)) throw 'Requirement is not a number: "' + t + '"';
            return parseFloat(t)
        },
        reference: function (e) {
            var i = t(e);
            if (0 === i.length) throw 'No such reference: "' + e + '"';
            return i
        },
        boolean: function (t) {
            return "false" !== t
        },
        object: function (t) {
            return s.deserializeValue(t)
        },
        regexp: function (t) {
            var e = "";
            return /^\/.*\/(?:[gimy]*)$/.test(t) ? (e = t.replace(/.*\/([gimy]*)$/, "$1"), t = t.replace(new RegExp("^/(.*?)/" + e + "$"), "$1")) : t = "^" + t + "$", new RegExp(t, e)
        }
    },
        u = function (t, e) {
            var i = l[t || "string"];
            if (!i) throw 'Unknown requirement specification: "' + t + '"';
            return i(e)
        },
        d = function (e) {
            t.extend(!0, this, e)
        };
    d.prototype = {
        validate: function (e, i) {
            if (this.fn) return arguments.length > 3 && (i = [].slice.call(arguments, 1, -1)), this.fn.call(this, e, i);
            if (t.isArray(e)) {
                if (!this.validateMultiple) throw "Validator `" + this.name + "` does not handle multiple values";
                return this.validateMultiple.apply(this, arguments)
            }
            if (this.validateNumber) {
                return !isNaN(e.replace(/,/g, '')) && (
                    arguments[0] = parseFloat(arguments[0].replace(/,/g, '')),
                    this.validateNumber.apply(this, arguments)
                );
            }
            if (this.validateString) return this.validateString.apply(this, arguments);
            throw "Validator `" + this.name + "` only handles multiple values"
        },
        parseRequirements: function (e, i) {
            if ("string" != typeof e) return t.isArray(e) ? e : [e];
            var r = this.requirementType;
            if (t.isArray(r)) {
                for (var n = function (t, e) {
                    var i = t.match(/^\s*\[(.*)\]\s*$/);
                    if (!i) throw 'Requirement is not an array: "' + t + '"';
                    var r = i[1].split(",").map(s.trimString);
                    if (r.length !== e) throw "Requirement has " + r.length + " values when " + e + " are needed";
                    return r
                }(e, r.length), a = 0; a < n.length; a++) n[a] = u(r[a], n[a]);
                return n
            }
            return t.isPlainObject(r) ? function (t, e, i) {
                var r = null,
                    n = {};
                for (var s in t)
                    if (s) {
                        var a = i(s);
                        "string" == typeof a && (a = u(t[s], a)), n[s] = a
                    } else r = u(t[s], e);
                return [r, n]
            }(r, e, i) : [u(r, e)]
        },
        requirementType: "string",
        priority: 2
    };
    var h = function (t, e) {
        this.__class__ = "ParsleyValidatorRegistry", this.locale = "en", this.init(t || {}, e || {})
    },
        p = {
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
            number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,
            integer: /^-?\d+$/,
            digits: /^\d+$/,
            alphanum: /^\w+$/i,
            url: new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$", "i")
        };
    p.range = p.number;
    var c = function (t) {
        var e = ("" + t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        return e ? Math.max(0, (e[1] ? e[1].length : 0) - (e[2] ? +e[2] : 0)) : 0
    };
    h.prototype = {
        init: function (e, i) {
            for (var r in this.catalog = i, this.validators = t.extend({}, this.validators), e) this.addValidator(r, e[r].fn, e[r].priority);
            window.Parsley.trigger("parsley:validator:init")
        },
        setLocale: function (t) {
            if (void 0 === this.catalog[t]) throw new Error(t + " is not available in the catalog");
            return this.locale = t, this
        },
        addCatalog: function (t, e, i) {
            return "object" == typeof e && (this.catalog[t] = e), !0 === i ? this.setLocale(t) : this
        },
        addMessage: function (t, e, i) {
            return void 0 === this.catalog[t] && (this.catalog[t] = {}), this.catalog[t][e] = i, this
        },
        addMessages: function (t, e) {
            for (var i in e) this.addMessage(t, i, e[i]);
            return this
        },
        addValidator: function (t, e, i) {
            if (this.validators[t]) s.warn('Validator "' + t + '" is already defined.');
            else if (a.hasOwnProperty(t)) return void s.warn('"' + t + '" is a restricted keyword and is not a valid validator name.');
            return this._setValidator.apply(this, arguments)
        },
        updateValidator: function (t, e, i) {
            return this.validators[t] ? this._setValidator.apply(this, arguments) : (s.warn('Validator "' + t + '" is not already defined.'), this.addValidator.apply(this, arguments))
        },
        removeValidator: function (t) {
            return this.validators[t] || s.warn('Validator "' + t + '" is not defined.'), delete this.validators[t], this
        },
        _setValidator: function (t, e, i) {
            for (var r in "object" != typeof e && (e = {
                fn: e,
                priority: i
            }), e.validate || (e = new d(e)), this.validators[t] = e, e.messages || {}) this.addMessage(r, t, e.messages[r]);
            return this
        },
        getErrorMessage: function (t) {
            var e;
            "type" === t.name ? e = (this.catalog[this.locale][t.name] || {})[t.requirements] : e = this.formatMessage(this.catalog[this.locale][t.name], t.requirements);
            return e || this.catalog[this.locale].defaultMessage || this.catalog.en.defaultMessage
        },
        formatMessage: function (t, e) {
            if ("object" == typeof e) {
                for (var i in e) t = this.formatMessage(t, e[i]);
                return t
            }
            return "string" == typeof t ? t.replace(/%s/i, e) : ""
        },
        validators: {
            notblank: {
                validateString: function (t) {
                    return /\S/.test(t)
                },
                priority: 2
            },
            required: {
                validateMultiple: function (t) {
                    return t.length > 0
                },
                validateString: function (t) {
                    return /\S/.test(t)
                },
                priority: 512
            },
            type: {
                validateString: function (t, e) {
                    var i = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2],
                        r = i.step,
                        n = void 0 === r ? "1" : r,
                        s = i.base,
                        a = void 0 === s ? 0 : s,
                        o = p[e];
                    if (!o) throw new Error("validator type `" + e + "` is not supported");
                    if (!o.test(t)) return !1;
                    if ("number" === e && !/^any$/i.test(n || "")) {
                        var l = Number(t),
                            u = Math.max(c(n), c(a));
                        if (c(l) > u) return !1;
                        var d = function (t) {
                            return Math.round(t * Math.pow(10, u))
                        };
                        if ((d(l) - d(a)) % d(n) != 0) return !1
                    }
                    return !0
                },
                requirementType: {
                    "": "string",
                    step: "string",
                    base: "number"
                },
                priority: 256
            },
            pattern: {
                validateString: function (t, e) {
                    return e.test(t)
                },
                requirementType: "regexp",
                priority: 64
            },
            minlength: {
                validateString: function (t, e) {
                    return t.length >= e
                },
                requirementType: "integer",
                priority: 30
            },
            maxlength: {
                validateString: function (t, e) {
                    return t.length <= e
                },
                requirementType: "integer",
                priority: 30
            },
            length: {
                validateString: function (t, e, i) {
                    return t.length >= e && t.length <= i
                },
                requirementType: ["integer", "integer"],
                priority: 30
            },
            mincheck: {
                validateMultiple: function (t, e) {
                    return t.length >= e
                },
                requirementType: "integer",
                priority: 30
            },
            maxcheck: {
                validateMultiple: function (t, e) {
                    return t.length <= e
                },
                requirementType: "integer",
                priority: 30
            },
            check: {
                validateMultiple: function (t, e, i) {
                    return t.length >= e && t.length <= i
                },
                requirementType: ["integer", "integer"],
                priority: 30
            },
            min: {
                validateNumber: function (t, e) {
                    return t >= e
                },
                requirementType: "number",
                priority: 30
            },
            max: {
                validateNumber: function (t, e) {
                    return e >= t
                },
                requirementType: "number",
                priority: 30
            },
            range: {
                validateNumber: function (t, e, i) {
                    return t >= e && i >= t
                },
                requirementType: ["number", "number"],
                priority: 30
            },
            equalto: {
                validateString: function (e, i) {
                    var r = t(i);
                    return r.length ? e === r.val() : e === i
                },
                priority: 256
            }
        }
    };
    var f = {};
    f.Form = {
        _actualizeTriggers: function () {
            var t = this;
            this.$element.on("submit.Parsley", function (e) {
                t.onSubmitValidate(e)
            }), this.$element.on("click.Parsley", 'input[type="submit"], button[type="submit"]', function (e) {
                t.onSubmitButton(e)
            }), !1 !== this.options.uiEnabled && this.$element.attr("novalidate", "")
        },
        focus: function () {
            if (this._focusedField = null, !0 === this.validationResult || "none" === this.options.focus) return null;
            for (var t = 0; t < this.fields.length; t++) {
                var e = this.fields[t];
                if (!0 !== e.validationResult && e.validationResult.length > 0 && void 0 === e.options.noFocus && (this._focusedField = e.$element, "first" === this.options.focus)) break
            }

            //if (null === this._focusedField) {
            //    return null;
            //}
            //else {



            //    if ($(this._focusedField).hasClass("select2")) {
            //        return $(this._focusedField).select2("focus");
            //    }
            //    else {
            //        return this._focusedField.focus();
            //    }
            //}



            return null === this._focusedField ? null : this._focusedField.focus()
        },
        _destroyUI: function () {
            this.$element.off(".Parsley")
        }
    }, f.Field = {
        _reflowUI: function () {
            if (this._buildUI(), this._ui) {
                var t = function t(e, i, r) {
                    for (var n = [], s = [], a = 0; a < e.length; a++) {
                        for (var o = !1, l = 0; l < i.length; l++)
                            if (e[a].assert.name === i[l].assert.name) {
                                o = !0;
                                break
                            }
                        o ? s.push(e[a]) : n.push(e[a])
                    }
                    return {
                        kept: s,
                        added: n,
                        removed: r ? [] : t(i, e, !0).added
                    }
                }(this.validationResult, this._ui.lastValidationResult);
                this._ui.lastValidationResult = this.validationResult, this._manageStatusClass(), this._manageErrorsMessages(t), this._actualizeTriggers(), !t.kept.length && !t.added.length || this._failedOnce || (this._failedOnce = !0, this._actualizeTriggers())
            }
        },
        getErrorsMessages: function () {
            if (!0 === this.validationResult) return [];
            for (var t = [], e = 0; e < this.validationResult.length; e++) t.push(this.validationResult[e].errorMessage || this._getErrorMessage(this.validationResult[e].assert));
            return t
        },
        addError: function (t) {
            var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
                i = e.message,
                r = e.assert,
                n = e.updateClass,
                s = void 0 === n || n;
            this._buildUI(), this._addError(t, {
                message: i,
                assert: r
            }), s && this._errorClass()
        },
        updateError: function (t) {
            var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
                i = e.message,
                r = e.assert,
                n = e.updateClass,
                s = void 0 === n || n;
            this._buildUI(), this._updateError(t, {
                message: i,
                assert: r
            }), s && this._errorClass()
        },
        removeError: function (t) {
            var e = (arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1]).updateClass,
                i = void 0 === e || e;
            this._buildUI(), this._removeError(t), i && this._manageStatusClass()
        },
        _manageStatusClass: function () {
            this.hasConstraints() && this.needsValidation() && !0 === this.validationResult ? this._successClass() : this.validationResult.length > 0 ? this._errorClass() : this._resetClass()
        },
        _manageErrorsMessages: function (e) {
            if (void 0 === this.options.errorsMessagesDisabled) {
                if (void 0 !== this.options.errorMessage) return e.added.length || e.kept.length ? (this._insertErrorWrapper(), 0 === this._ui.$errorsWrapper.find(".parsley-custom-error-message").length && this._ui.$errorsWrapper.append(t(this.options.errorTemplate).addClass("parsley-custom-error-message")), this._ui.$errorsWrapper.addClass("filled").find(".parsley-custom-error-message").html(this.options.errorMessage)) : this._ui.$errorsWrapper.removeClass("filled").find(".parsley-custom-error-message").remove();
                for (var i = 0; i < e.removed.length; i++) this._removeError(e.removed[i].assert.name);
                for (i = 0; i < e.added.length; i++) this._addError(e.added[i].assert.name, {
                    message: e.added[i].errorMessage,
                    assert: e.added[i].assert
                });
                for (i = 0; i < e.kept.length; i++) this._updateError(e.kept[i].assert.name, {
                    message: e.kept[i].errorMessage,
                    assert: e.kept[i].assert
                })
            }
        },
        _addError: function (e, i) {
            var r = i.message,
                n = i.assert;
            this._insertErrorWrapper(), this._ui.$errorsWrapper.addClass("filled").append(t(this.options.errorTemplate).addClass("parsley-" + e).html(r || this._getErrorMessage(n)))
        },
        _updateError: function (t, e) {
            var i = e.message,
                r = e.assert;
            this._ui.$errorsWrapper.addClass("filled").find(".parsley-" + t).html(i || this._getErrorMessage(r))
        },
        _removeError: function (t) {
            this._ui.$errorsWrapper.removeClass("filled").find(".parsley-" + t).remove()
        },
        _getErrorMessage: function (t) {
            var e = t.name + "Message";
            return void 0 !== this.options[e] ? window.Parsley.formatMessage(this.options[e], t.requirements) : window.Parsley.getErrorMessage(t)
        },
        _buildUI: function () {
            if (!this._ui && !1 !== this.options.uiEnabled) {
                var e = {};
                this.$element.attr(this.options.namespace + "id", this.__id__), e.$errorClassHandler = this._manageClassHandler(), e.errorsWrapperId = "parsley-id-" + (this.options.multiple ? "multiple-" + this.options.multiple : this.__id__), e.$errorsWrapper = t(this.options.errorsWrapper).attr("id", e.errorsWrapperId), e.lastValidationResult = [], e.validationInformationVisible = !1, this._ui = e
            }
        },
        _manageClassHandler: function () {
            if ("string" == typeof this.options.classHandler && t(this.options.classHandler).length) return t(this.options.classHandler);
            var e = this.options.classHandler.call(this, this);
            return void 0 !== e && e.length ? e : !this.options.multiple || this.$element.is("select") ? this.$element : this.$element.parent()
        },
        _insertErrorWrapper: function () {
            var e;
            if (0 !== this._ui.$errorsWrapper.parent().length) return this._ui.$errorsWrapper.parent();
            if ("string" == typeof this.options.errorsContainer) {
                if (t(this.options.errorsContainer).length) return t(this.options.errorsContainer).append(this._ui.$errorsWrapper);
                s.warn("The errors container `" + this.options.errorsContainer + "` does not exist in DOM")
            } else "function" == typeof this.options.errorsContainer && (e = this.options.errorsContainer.call(this, this));
            if (void 0 !== e && e.length) return e.append(this._ui.$errorsWrapper);
            var i = this.$element;
            return this.options.multiple && (i = i.parent()), i.after(this._ui.$errorsWrapper)
        },
        _actualizeTriggers: function () {
            var t, e = this,
                i = this._findRelated();
            i.off(".Parsley"), this._failedOnce ? i.on(s.namespaceEvents(this.options.triggerAfterFailure, "Parsley"), function () {
                e.validate()
            }) : (t = s.namespaceEvents(this.options.trigger, "Parsley")) && i.on(t, function (t) {
                e._eventValidate(t)
            })
        },
        _eventValidate: function (t) {
            !(!/key|input/.test(t.type) || this._ui && this._ui.validationInformationVisible) && this.getValue().length <= this.options.validationThreshold || this.validate()
        },
        _resetUI: function () {
            this._failedOnce = !1, this._actualizeTriggers(), void 0 !== this._ui && (this._ui.$errorsWrapper.removeClass("filled").children().remove(), this._resetClass(), this._ui.lastValidationResult = [], this._ui.validationInformationVisible = !1)
        },
        _destroyUI: function () {
            this._resetUI(), void 0 !== this._ui && this._ui.$errorsWrapper.remove(), delete this._ui
        },
        _successClass: function () {
            this._ui.validationInformationVisible = !0, this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass)
        },
        _errorClass: function () {
            this._ui.validationInformationVisible = !0, this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass)
        },
        _resetClass: function () {
            this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass)
        }
    };
    var m = function (e, i, r) {
        this.__class__ = "ParsleyForm", this.$element = t(e), this.domOptions = i, this.options = r, this.parent = window.Parsley, this.fields = [], this.validationResult = null
    },
        v = {
            pending: null,
            resolved: !0,
            rejected: !1
        };
    m.prototype = {
        onSubmitValidate: function (t) {
            var e = this;
            if (!0 !== t.parsley) {
                var i = this._$submitSource || this.$element.find('input[type="submit"], button[type="submit"]').first();
                if (this._$submitSource = null, this.$element.find(".parsley-synthetic-submit-button").prop("disabled", !0), !i.is("[formnovalidate]")) {
                    var r = this.whenValidate({
                        event: t
                    });
                    "resolved" === r.state() && !1 !== this._trigger("submit") || (t.stopImmediatePropagation(), t.preventDefault(), "pending" === r.state() && r.done(function () {
                        e._submit(i)
                    }))
                }
            }
        },
        onSubmitButton: function (e) {
            this._$submitSource = t(e.currentTarget)
        },
        _submit: function (e) {
            if (!1 !== this._trigger("submit")) {
                if (e) {
                    var i = this.$element.find(".parsley-synthetic-submit-button").prop("disabled", !1);
                    0 === i.length && (i = t('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element)), i.attr({
                        name: e.attr("name"),
                        value: e.attr("value")
                    })
                }
                this.$element.trigger(t.extend(t.Event("submit"), {
                    parsley: !0
                }))
            }
        },
        validate: function (e) {
            if (arguments.length >= 1 && !t.isPlainObject(e)) {
                s.warnOnce("Calling validate on a parsley form without passing arguments as an object is deprecated.");
                var i = _slice.call(arguments);
                e = {
                    group: i[0],
                    force: i[1],
                    event: i[2]
                }
            }
            return v[this.whenValidate(e).state()]
        },
        whenValidate: function () {
            var e, i = this,
                r = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                n = r.group,
                a = r.force,
                o = r.event;
            this.submitEvent = o, o && (this.submitEvent = t.extend({}, o, {
                preventDefault: function () {
                    s.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`"), i.validationResult = !1
                }
            })), this.validationResult = !0, this._trigger("validate"), this._refreshFields();
            var l = this._withoutReactualizingFormOptions(function () {
                return t.map(i.fields, function (t) {
                    return t.whenValidate({
                        force: a,
                        group: n
                    })
                })
            });
            return (e = s.all(l).done(function () {
                i._trigger("success")
            }).fail(function () {

                i.validationResult = !1, i.focus(), i._trigger("error")
            }).always(function () {
                i._trigger("validated")
            })).pipe.apply(e, _toConsumableArray(this._pipeAccordingToValidationResult()))
        },
        isValid: function (e) {
            if (arguments.length >= 1 && !t.isPlainObject(e)) {
                s.warnOnce("Calling isValid on a parsley form without passing arguments as an object is deprecated.");
                var i = _slice.call(arguments);
                e = {
                    group: i[0],
                    force: i[1]
                }
            }
            return v[this.whenValid(e).state()]
        },
        whenValid: function () {
            var e = this,
                i = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                r = i.group,
                n = i.force;
            this._refreshFields();
            var a = this._withoutReactualizingFormOptions(function () {
                return t.map(e.fields, function (t) {
                    return t.whenValid({
                        group: r,
                        force: n
                    })
                })
            });
            return s.all(a)
        },
        _refreshFields: function () {
            return this.actualizeOptions()._bindFields()
        },
        _bindFields: function () {
            var e = this,
                i = this.fields;
            return this.fields = [], this.fieldsMappedById = {}, this._withoutReactualizingFormOptions(function () {
                e.$element.find(e.options.inputs).not(e.options.excluded).each(function (t, i) {
                    var r = new window.Parsley.Factory(i, {}, e);
                    "ParsleyField" !== r.__class__ && "ParsleyFieldMultiple" !== r.__class__ || !0 === r.options.excluded || void 0 === e.fieldsMappedById[r.__class__ + "-" + r.__id__] && (e.fieldsMappedById[r.__class__ + "-" + r.__id__] = r, e.fields.push(r))
                }), t.each(s.difference(i, e.fields), function (t, e) {
                    e._trigger("reset")
                })
            }), this
        },
        _withoutReactualizingFormOptions: function (t) {
            var e = this.actualizeOptions;
            this.actualizeOptions = function () {
                return this
            };
            var i = t();
            return this.actualizeOptions = e, i
        },
        _trigger: function (t) {
            return this.trigger("form:" + t)
        }
    };
    var g = function (e, i, r, n, s) {
        if (!/ParsleyField/.test(e.__class__)) throw new Error("ParsleyField or ParsleyFieldMultiple instance expected");
        var a = window.Parsley._validatorRegistry.validators[i],
            o = new d(a);
        t.extend(this, {
            validator: o,
            name: i,
            requirements: r,
            priority: n || e.options[i + "Priority"] || o.priority,
            isDomConstraint: !0 === s
        }), this._parseRequirements(e.options)
    };
    g.prototype = {
        validate: function (t, e) {
            var i;
            return (i = this.validator).validate.apply(i, [t].concat(_toConsumableArray(this.requirementList), [e]))
        },
        _parseRequirements: function (t) {
            var e = this;
            this.requirementList = this.validator.parseRequirements(this.requirements, function (i) {
                return t[e.name + function (t) {
                    return t[0].toUpperCase() + t.slice(1)
                }(i)]
            })
        }
    };
    var y = function (e, i, r, n) {
        this.__class__ = "ParsleyField", this.$element = t(e), void 0 !== n && (this.parent = n), this.options = r, this.domOptions = i, this.constraints = [], this.constraintsByName = {}, this.validationResult = !0, this._bindConstraints()
    },
        _ = {
            pending: null,
            resolved: !0,
            rejected: !1
        };
    y.prototype = {
        validate: function (e) {
            arguments.length >= 1 && !t.isPlainObject(e) && (s.warnOnce("Calling validate on a parsley field without passing arguments as an object is deprecated."), e = {
                options: e
            });
            var i = this.whenValidate(e);
            if (!i) return !0;
            switch (i.state()) {
                case "pending":
                    return null;
                case "resolved":
                    return !0;
                case "rejected":
                    return this.validationResult
            }
        },
        whenValidate: function () {
            var t, e = this,
                i = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                r = i.force,
                n = i.group;
            return this.refreshConstraints(), !n || this._isInGroup(n) ? (this.value = this.getValue(), this._trigger("validate"), (t = this.whenValid({
                force: r,
                value: this.value,
                _refreshed: !0
            }).always(function () {
                e._reflowUI()
            }).done(function () {
                e._trigger("success")
            }).fail(function () {
                e._trigger("error")
            }).always(function () {
                e._trigger("validated")
            })).pipe.apply(t, _toConsumableArray(this._pipeAccordingToValidationResult()))) : void 0
        },
        hasConstraints: function () {
            return 0 !== this.constraints.length
        },
        needsValidation: function (t) {
            return void 0 === t && (t = this.getValue()), !(!t.length && !this._isRequired() && void 0 === this.options.validateIfEmpty)
        },
        _isInGroup: function (e) {
            return t.isArray(this.options.group) ? -1 !== t.inArray(e, this.options.group) : this.options.group === e
        },
        isValid: function (e) {
            if (arguments.length >= 1 && !t.isPlainObject(e)) {
                s.warnOnce("Calling isValid on a parsley field without passing arguments as an object is deprecated.");
                var i = _slice.call(arguments);
                e = {
                    force: i[0],
                    value: i[1]
                }
            }
            var r = this.whenValid(e);
            return !r || _[r.state()]
        },
        whenValid: function () {
            var e = this,
                i = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                r = i.force,
                n = void 0 !== r && r,
                a = i.value,
                o = i.group;
            if (i._refreshed || this.refreshConstraints(), !o || this._isInGroup(o)) {
                if (this.validationResult = !0, !this.hasConstraints()) return t.when();
                if (null != a || (a = this.getValue()), !this.needsValidation(a) && !0 !== n) return t.when();
                var l = this._getGroupedConstraints(),
                    u = [];
                return t.each(l, function (i, r) {
                    var n = s.all(t.map(r, function (t) {
                        return e._validateConstraint(a, t)
                    }));
                    return u.push(n), "rejected" !== n.state() && void 0
                }), s.all(u)
            }
        },
        _validateConstraint: function (e, i) {
            var r = this,
                n = i.validate(e, this);
            return !1 === n && (n = t.Deferred().reject()), s.all([n]).fail(function (t) {
                r.validationResult instanceof Array || (r.validationResult = []), r.validationResult.push({
                    assert: i,
                    errorMessage: "string" == typeof t && t
                })
            })
        },
        getValue: function () {
            var t;
            return null == (t = "function" == typeof this.options.value ? this.options.value(this) : void 0 !== this.options.value ? this.options.value : this.$element.val()) ? "" : this._handleWhitespace(t)
        },
        refreshConstraints: function () {
            return this.actualizeOptions()._bindConstraints()
        },
        addConstraint: function (t, e, i, r) {
            if (window.Parsley._validatorRegistry.validators[t]) {
                var n = new g(this, t, e, i, r);
                "undefined" !== this.constraintsByName[n.name] && this.removeConstraint(n.name), this.constraints.push(n), this.constraintsByName[n.name] = n
            }
            return this
        },
        removeConstraint: function (t) {
            for (var e = 0; e < this.constraints.length; e++)
                if (t === this.constraints[e].name) {
                    this.constraints.splice(e, 1);
                    break
                }
            return delete this.constraintsByName[t], this
        },
        updateConstraint: function (t, e, i) {
            return this.removeConstraint(t).addConstraint(t, e, i)
        },
        _bindConstraints: function () {
            for (var t = [], e = {}, i = 0; i < this.constraints.length; i++) !1 === this.constraints[i].isDomConstraint && (t.push(this.constraints[i]), e[this.constraints[i].name] = this.constraints[i]);
            for (var r in this.constraints = t, this.constraintsByName = e, this.options) this.addConstraint(r, this.options[r], void 0, !0);
            return this._bindHtml5Constraints()
        },
        _bindHtml5Constraints: function () {
            (this.$element.hasClass("required") || this.$element.attr("required")) && this.addConstraint("required", !0, void 0, !0), "string" == typeof this.$element.attr("pattern") && this.addConstraint("pattern", this.$element.attr("pattern"), void 0, !0), void 0 !== this.$element.attr("min") && void 0 !== this.$element.attr("max") ? this.addConstraint("range", [this.$element.attr("min"), this.$element.attr("max")], void 0, !0) : void 0 !== this.$element.attr("min") ? this.addConstraint("min", this.$element.attr("min"), void 0, !0) : void 0 !== this.$element.attr("max") && this.addConstraint("max", this.$element.attr("max"), void 0, !0), void 0 !== this.$element.attr("minlength") && void 0 !== this.$element.attr("maxlength") ? this.addConstraint("length", [this.$element.attr("minlength"), this.$element.attr("maxlength")], void 0, !0) : void 0 !== this.$element.attr("minlength") ? this.addConstraint("minlength", this.$element.attr("minlength"), void 0, !0) : void 0 !== this.$element.attr("maxlength") && this.addConstraint("maxlength", this.$element.attr("maxlength"), void 0, !0);
            var t = this.$element.attr("type");
            return void 0 === t ? this : "number" === t ? this.addConstraint("type", ["number", {
                step: this.$element.attr("step"),
                base: this.$element.attr("min") || this.$element.attr("value")
            }], void 0, !0) : /^(email|url|range)$/i.test(t) ? this.addConstraint("type", t, void 0, !0) : this
        },
        _isRequired: function () {
            return void 0 !== this.constraintsByName.required && !1 !== this.constraintsByName.required.requirements
        },
        _trigger: function (t) {
            return this.trigger("field:" + t)
        },
        _handleWhitespace: function (t) {
            return !0 === this.options.trimValue && s.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'), "squish" === this.options.whitespace && (t = t.replace(/\s{2,}/g, " ")), "trim" !== this.options.whitespace && "squish" !== this.options.whitespace && !0 !== this.options.trimValue || (t = s.trimString(t)), t
        },
        _getGroupedConstraints: function () {
            if (!1 === this.options.priorityEnabled) return [this.constraints];
            for (var t = [], e = {}, i = 0; i < this.constraints.length; i++) {
                var r = this.constraints[i].priority;
                e[r] || t.push(e[r] = []), e[r].push(this.constraints[i])
            }
            return t.sort(function (t, e) {
                return e[0].priority - t[0].priority
            }), t
        }
    };
    var w = y,
        b = function () {
            this.__class__ = "ParsleyFieldMultiple"
        };
    b.prototype = {
        addElement: function (t) {
            return this.$elements.push(t), this
        },
        refreshConstraints: function () {
            var e;
            if (this.constraints = [], this.$element.is("select")) return this.actualizeOptions()._bindConstraints(), this;
            for (var i = 0; i < this.$elements.length; i++)
                if (t("html").has(this.$elements[i]).length) {
                    e = this.$elements[i].data("ParsleyFieldMultiple").refreshConstraints().constraints;
                    for (var r = 0; r < e.length; r++) this.addConstraint(e[r].name, e[r].requirements, e[r].priority, e[r].isDomConstraint)
                } else this.$elements.splice(i, 1);
            return this
        },
        getValue: function () {
            if ("function" == typeof this.options.value) return this.options.value(this);
            if (void 0 !== this.options.value) return this.options.value;
            if (this.$element.is("input[type=radio]")) return this._findRelated().filter(":checked").val() || "";
            if (this.$element.is("input[type=checkbox]")) {
                var e = [];
                return this._findRelated().filter(":checked").each(function () {
                    e.push(t(this).val())
                }), e
            }
            return this.$element.is("select") && null === this.$element.val() ? [] : this.$element.val()
        },
        _init: function () {
            return this.$elements = [this.$element], this
        }
    };
    var F = function (e, i, r) {
        this.$element = t(e);
        var n = this.$element.data("Parsley");
        if (n) return void 0 !== r && n.parent === window.Parsley && (n.parent = r, n._resetOptions(n.options)), "object" == typeof i && t.extend(n.options, i), n;
        if (!this.$element.length) throw new Error("You must bind Parsley on an existing element.");
        if (void 0 !== r && "ParsleyForm" !== r.__class__) throw new Error("Parent instance must be a ParsleyForm instance");
        return this.parent = r || window.Parsley, this.init(i)
    };
    F.prototype = {
        init: function (t) {
            return this.__class__ = "Parsley", this.__version__ = "2.4.3", this.__id__ = s.generateID(), this._resetOptions(t), this.$element.is("form") || s.checkAttr(this.$element, this.options.namespace, "validate") && !this.$element.is(this.options.inputs) ? this.bind("parsleyForm") : this.isMultiple() ? this.handleMultiple() : this.bind("parsleyField")
        },
        isMultiple: function () {
            return this.$element.is("input[type=radio], input[type=checkbox]") || this.$element.is("select") && void 0 !== this.$element.attr("multiple")
        },
        handleMultiple: function () {
            var e, i, r = this;
            if (this.options.multiple || (void 0 !== this.$element.attr("name") && this.$element.attr("name").length ? this.options.multiple = e = this.$element.attr("name") : void 0 !== this.$element.attr("id") && this.$element.attr("id").length && (this.options.multiple = this.$element.attr("id"))), this.$element.is("select") && void 0 !== this.$element.attr("multiple")) return this.options.multiple = this.options.multiple || this.__id__, this.bind("parsleyFieldMultiple");
            if (!this.options.multiple) return s.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.", this.$element), this;
            this.options.multiple = this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, ""), void 0 !== e && t('input[name="' + e + '"]').each(function (e, i) {
                t(i).is("input[type=radio], input[type=checkbox]") && t(i).attr(r.options.namespace + "multiple", r.options.multiple)
            });
            for (var n = this._findRelated(), a = 0; a < n.length; a++)
                if (void 0 !== (i = t(n.get(a)).data("Parsley"))) {
                    this.$element.data("ParsleyFieldMultiple") || i.addElement(this.$element);
                    break
                }
            return this.bind("parsleyField", !0), i || this.bind("parsleyFieldMultiple")
        },
        bind: function (e, i) {
            var r;
            switch (e) {
                case "parsleyForm":
                    r = t.extend(new m(this.$element, this.domOptions, this.options), new o, window.ParsleyExtend)._bindFields();
                    break;
                case "parsleyField":
                    r = t.extend(new w(this.$element, this.domOptions, this.options, this.parent), new o, window.ParsleyExtend);
                    break;
                case "parsleyFieldMultiple":
                    r = t.extend(new w(this.$element, this.domOptions, this.options, this.parent), new b, new o, window.ParsleyExtend)._init();
                    break;
                default:
                    throw new Error(e + "is not a supported Parsley type")
            }
            return this.options.multiple && s.setAttr(this.$element, this.options.namespace, "multiple", this.options.multiple), void 0 !== i ? (this.$element.data("ParsleyFieldMultiple", r), r) : (this.$element.data("Parsley", r), r._actualizeTriggers(), r._trigger("init"), r)
        }
    };
    var C = t.fn.jquery.split(".");
    if (parseInt(C[0]) <= 1 && parseInt(C[1]) < 8) throw "The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";
    C.forEach || s.warn("Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim");
    var $ = t.extend(new o, {
        $element: t(document),
        actualizeOptions: null,
        _resetOptions: null,
        Factory: F,
        version: "2.4.3"
    });
    t.extend(w.prototype, f.Field, o.prototype), t.extend(m.prototype, f.Form, o.prototype), t.extend(F.prototype, o.prototype), t.fn.parsley = t.fn.psly = function (e) {
        if (this.length > 1) {
            var i = [];
            return this.each(function () {
                i.push(t(this).parsley(e))
            }), i
        }
        return t(this).length ? new F(this, e) : void s.warn("You must bind Parsley on an existing element.")
    }, void 0 === window.ParsleyExtend && (window.ParsleyExtend = {}), $.options = t.extend(s.objectCreate(a), window.ParsleyConfig), window.ParsleyConfig = $.options, window.Parsley = window.psly = $, window.ParsleyUtils = s;
    var x = window.Parsley._validatorRegistry = new h(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
    window.ParsleyValidator = {}, t.each("setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator".split(" "), function (e, i) {
        window.Parsley[i] = t.proxy(x, i), window.ParsleyValidator[i] = function () {
            var t;
            return s.warnOnce("Accessing the method '" + i + "' through ParsleyValidator is deprecated. Simply call 'window.Parsley." + i + "(...)'"), (t = window.Parsley)[i].apply(t, arguments)
        }
    }), window.Parsley.UI = f, window.ParsleyUI = {
        removeError: function (t, e, i) {
            var r = !0 !== i;
            return s.warnOnce("Accessing ParsleyUI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method."), t.removeError(e, {
                updateClass: r
            })
        },
        getErrorsMessages: function (t) {
            return s.warnOnce("Accessing ParsleyUI is deprecated. Call 'getErrorsMessages' on the instance directly."), t.getErrorsMessages()
        }
    }, t.each("addError updateError".split(" "), function (t, e) {
        window.ParsleyUI[e] = function (t, i, r, n, a) {
            var o = !0 !== a;
            return s.warnOnce("Accessing ParsleyUI is deprecated. Call '" + e + "' on the instance directly. Please comment in issue 1073 as to your need to call this method."), t[e](i, {
                message: r,
                assert: n,
                updateClass: o
            })
        }
    }), !1 !== window.ParsleyConfig.autoBind && t(function () {
        t("[data-parsley-validate]").length && t("[data-parsley-validate]").parsley()
    });
    var E = t({}),
        P = function () {
            s.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")
        },
        V = "parsley:";
    return t.listen = function (t, r) {
        var n;
        if (P(), "object" == typeof arguments[1] && "function" == typeof arguments[2] && (n = arguments[1], r = arguments[2]), "function" != typeof r) throw new Error("Wrong parameters");
        window.Parsley.on(i(t), e(r, n))
    }, t.listenTo = function (t, r, n) {
        if (P(), !(t instanceof w || t instanceof m)) throw new Error("Must give Parsley instance");
        if ("string" != typeof r || "function" != typeof n) throw new Error("Wrong parameters");
        t.on(i(r), e(n))
    }, t.unsubscribe = function (t, e) {
        if (P(), "string" != typeof t || "function" != typeof e) throw new Error("Wrong arguments");
        window.Parsley.off(i(t), e.parsleyAdaptedCallback)
    }, t.unsubscribeTo = function (t, e) {
        if (P(), !(t instanceof w || t instanceof m)) throw new Error("Must give Parsley instance");
        t.off(i(e))
    }, t.unsubscribeAll = function (e) {
        P(), window.Parsley.off(i(e)), t("form,input,textarea,select").each(function () {
            var r = t(this).data("Parsley");
            r && r.off(i(e))
        })
    }, t.emit = function (t, e) {
        var r;
        P();
        var n = e instanceof w || e instanceof m,
            s = Array.prototype.slice.call(arguments, n ? 2 : 1);
        s.unshift(i(t)), n || (e = window.Parsley), (r = e).trigger.apply(r, _toConsumableArray(s))
    }, t.extend(!0, $, {
        asyncValidators: {
            default: {
                fn: function (t) {
                    return t.status >= 200 && t.status < 300
                },
                url: !1
            },
            reverse: {
                fn: function (t) {
                    return t.status < 200 || t.status >= 300
                },
                url: !1
            }
        },
        addAsyncValidator: function (t, e, i, r) {
            return $.asyncValidators[t] = {
                fn: e,
                url: i || !1,
                options: r || {}
            }, this
        }
    }), $.addValidator("remote", {
        requirementType: {
            "": "string",
            validator: "string",
            reverse: "boolean",
            options: "object"
        },
        validateString: function (e, i, r, n) {
            var s, a, o = {},
                l = r.validator || (!0 === r.reverse ? "reverse" : "default");
            if (void 0 === $.asyncValidators[l]) throw new Error("Calling an undefined async validator: `" + l + "`");
            (i = $.asyncValidators[l].url || i).indexOf("{value}") > -1 ? i = i.replace("{value}", encodeURIComponent(e)) : o[n.$element.attr("name") || n.$element.attr("id")] = e;
            var u = t.extend(!0, r.options || {}, $.asyncValidators[l].options);
            s = t.extend(!0, {}, {
                url: i,
                data: o,
                type: "GET"
            }, u), n.trigger("field:ajaxoptions", n, s), a = t.param(s), void 0 === $._remoteCache && ($._remoteCache = {});
            var d = $._remoteCache[a] = $._remoteCache[a] || t.ajax(s),
                h = function () {
                    var e = $.asyncValidators[l].fn.call(n, d, i, r);
                    return e || (e = t.Deferred().reject()), t.when(e)
                };
            return d.then(h, h)
        },
        priority: -1
    }), $.on("form:submit", function () {
        $._remoteCache = {}
    }), window.ParsleyExtend.addAsyncValidator = function () {
        return ParsleyUtils.warnOnce("Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`"), $.addAsyncValidator.apply($, arguments)
    }, $.addMessages("en", {
        defaultMessage: "قالب داداه ورودي بنظر اشتباه مي باشد.",
        type: {
            email: "ورودي بايد فرمت ايميل باشد.",
            url: "ورودي بايد فرمت يوآرال باشد.",
            number: "ورودي بايد عدد باشد.",
            integer: "ورودي بايد عدد باشد.",
            digits: "ورودي بايد عدد باشد.",
            alphanum: "ورودي بايد ترکيب حروف و عدد باشد."
        },
        notblank: "اين آيتم نميتواند خالي باشد.",
        required: "ورود اطلاعات الزامي .",
        pattern: "الگوي ورودي ناشناخته است.",
        min: "ورودي بايد بزرگتر يا مساوي %s باشد.",
        max: "ورودي بايد کوچکتر يا مساوي %s باشد.",
        range: "ورودي بايد بين %s و %s باشد.",
        minlength: "تعداد کارکتر ورودي بايد بزرگتر يا مساوي %s باشد.",
        maxlength: "تعداد کارکتر ورودي بايد بزرگتر يا مساوي %s باشد.",
        length: "تعداد کارکتر ورودي بايد بين %s و %s باشد.",
        mincheck: "شما نهايتا %s گزينه براي انتخاب داريد.",
        maxcheck: "انتخاب بيش از %s گزينه مجار نمي باشد.",
        check: "شما بايد بين %s تا %s گزينه را انتخاب کنيد.",
        equalto: "ورودي ها بايد يکسان باشند."
    }), $.setLocale("en"), (new function () {
        var e = this,
            i = window || global;
        t.extend(this, {
            isNativeEvent: function (t) {
                return t.originalEvent && !1 !== t.originalEvent.isTrusted
            },
            fakeInputEvent: function (i) {
                e.isNativeEvent(i) && t(i.target).trigger("input")
            },
            misbehaves: function (i) {
                e.isNativeEvent(i) && (e.behavesOk(i), t(document).on("change.inputevent", i.data.selector, e.fakeInputEvent), e.fakeInputEvent(i))
            },
            behavesOk: function (i) {
                e.isNativeEvent(i) && t(document).off("input.inputevent", i.data.selector, e.behavesOk).off("change.inputevent", i.data.selector, e.misbehaves)
            },
            install: function () {
                if (!i.inputEventPatched) {
                    i.inputEventPatched = "0.0.3";
                    for (var r = ["select", 'input[type="checkbox"]', 'input[type="radio"]', 'input[type="file"]'], n = 0; n < r.length; n++) {
                        var s = r[n];
                        t(document).on("input.inputevent", s, {
                            selector: s
                        }, e.behavesOk).on("change.inputevent", s, {
                            selector: s
                        }, e.misbehaves)
                    }
                }
            },
            uninstall: function () {
                delete i.inputEventPatched, t(document).off(".inputevent")
            }
        })
    }).install(), $
});
/*! kamadatepicker - version 1.5.1 */ ! function (t) {
    var e = {};

    function n(o) {
        if (e[o]) return e[o].exports;
        var a = e[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return t[o].call(a.exports, a, a.exports, n), a.l = !0, a.exports
    }
    n.m = t, n.c = e, n.d = function (t, e, o) {
        n.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: o
        })
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 0)
}([function (t, e, n) {
    t.exports = n(1)
}, function (t, e, n) {
    n(2), window.kamaDatepicker = function (t, e) {

        if ("string" != typeof t || 0 === t.length) return void console.error("kamadatepicker error: input ID is not string or is empty");
        var n, o, a, r, i, d, s, l, c, p = e || {},
            u = !1,
            f = !1,
            //g = ["۰", "۱", "٢", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۱", "۱٢", "۱۳", "۱۴", "۱۵", "۱۶", "۱۷", "۱۸", "۱۹", "٢٠", "٢۱", "٢٢", "٢۳", "٢۴", "٢۵", "٢۶", "٢۷", "٢۸", "٢۹", "۳۰", "۳۱", "۳٢"];
            g = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];
        p.placeholder = "0000/00/00",
            p.twodigit = true,
            p.closeAfterSelect = true,
            p.nextButtonIcon = "fa fa-arrow-circle-right",
            p.previousButtonIcon = "fa fa-arrow-circle-left",
            p.buttonsColor = "red",
            p.forceFarsiDigits = "true",
            p.markToday = true,
            p.markHolidays = true,
            p.highlightSelectedDay = true,
            p.sync = true,
            p.gotoToday = true,
            p.pastYearsCount = 89,
            p.futureYearsCount = 10,
            p.withTime = void 0 === p.withTime || p.withTime,
            p.position = void 0 === p.position ? "top" : p.position

        var v = $("#" + t);
        var z = v.parent();

        $(`<button id="open-datepicker-${t}" class="open-datepicker"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 33 33" style="enable-background:new 0 0 33 33;" xml:space="preserve"><g><g><path d="M28.5,0h-24C2.019,0,0,2.019,0,4.5v24C0,30.98,2.019,33,4.5,33h24c2.48,0,4.5-2.02,4.5-4.5v-24C33,2.019,30.98,0,28.5,0zM31.5,28.5c0,1.648-1.35,3-3,3h-24c-1.65,0-3-1.352-3-3v-24c0-1.649,1.35-3,3-3h24c1.65,0,3,1.351,3,3V28.5z" /><circle cx="9.25" cy="4.773" r="1.273" /><circle cx="16.5" cy="4.773" r="1.273" /><circle cx="23.75" cy="4.773" r="1.273" /><rect x="11.134" y="12.902" width="4.596" height="4.088" /><rect x="17.271" y="12.902" width="4.595" height="4.088" /><rect x="23.404" y="12.902" width="4.596" height="4.088" /><rect x="5" y="18.359" width="4.595" height="4.086" /><rect x="11.134" y="18.359" width="4.596" height="4.086" /><rect x="17.271" y="18.359" width="4.595" height="4.086" /><rect x="23.404" y="18.359" width="4.596" height="4.086" /><rect x="5" y="23.816" width="4.595" height="4.086" /><rect x="11.134" y="23.816" width="4.596" height="4.086" /><rect x="17.271" y="23.816" width="4.595" height="4.086" /><rect x="23.404" y="23.816" width="4.596" height="4.086" /></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></button>`).appendTo(z)
        var op = document.getElementById(`open-datepicker-${t}`);

        void 0 === v.attr("placeholder") && v.attr("placeholder", p.placeholder);
        v.wrap("<div id='bd-root-" + t + "' style='position: relative;'></div>"), v.after("<div id='bd-main-" + t + "' class='bd-main bd-hide' style='position: absolute; direction: rtl;'></div>");
        var b = $("#bd-main-" + t);
        b.append("<div class='bd-calendar'></div>");
        var y = b.find(".bd-calendar");
        y.append("<div class='bd-title'></div>");
        var h = y.find(".bd-title");
        y.append("<table class='bd-table' dir='rtl' cellspacing='0' cellpadding='0'></table>"), p.swapNextPrev ? h.append("<button id='bd-prev-" + t + "' class='bd-prev' type='button' title='ماه قبلی'><span>قبلی</span></button>") : h.append("<button id='bd-next-" + t + "' class='bd-next' type='button' title='ماه بعدی'><span>بعدی</span></button>");
        h.append("<div class='bd-dropdown'></div><div class='bd-dropdown'></div>"), h.find(".bd-dropdown:nth-child(2)").append("<select id='bd-month-" + t + "' class='bd-month'></select>"), h.find(".bd-dropdown:nth-child(3)").append("<select id='bd-year-" + t + "' class='bd-year'></select>"), p.swapNextPrev ? h.append("<button id='bd-next-" + t + "' class='bd-next' type='button' title='ماه بعدی'><span>بعدی</span></button>") : h.append("<button id='bd-prev-" + t + "' class='bd-prev' type='button' title='ماه قبلی'><span>قبلی</span></button>");
        var m = $("#bd-next-" + t);
        p.nextButtonIcon && (m.find("span").css("display", "none"), -1 !== p.nextButtonIcon.indexOf(".") ? m.css("background-image", "url(" + p.nextButtonIcon + ")") : m.addClass(p.nextButtonIcon));
        var I = $("#bd-month-" + t);
        $.each({
            1: "حمل",
            2: "ثور",
            3: "جوزا",
            4: "سرطان",
            5: "اسد",
            6: "سنبله",
            7: "میزان",
            8: "قوس",
            9: "عقرب",
            10: "جدی",
            11: "دلو",
            12: "حوت"
        }, function (t, e) {
            I.append($("<option></option>").attr("value", t).text(e))
        });
        var x = $("#bd-year-" + t),
            C = $("#bd-prev-" + t);
        p.nextButtonIcon && (C.find("span").css("display", "none"), -1 !== p.previousButtonIcon.indexOf(".") ? C.css("background-image", "url(" + p.previousButtonIcon + ")") : C.addClass(p.previousButtonIcon));
        p.buttonsColor && (m.css("color", p.buttonsColor), m.find("span").css("color", p.buttonsColor), C.css("color", p.buttonsColor), C.find("span").css("color", p.buttonsColor));
        y.find(".bd-table").append("<thead><tr></tr></thead>"), $.each({
            "شنبه": "ش",
            "یکشنبه": "ی",
            "دوشنبه": "د",
            "سه شنبه": "س",
            "چهارشنبه": "چ",
            "پنج شنبه": "پ",
            "جمعه": "ج"
        }, function (t, e) {
            y.find(".bd-table thead tr").append($("<th></th>").text(e))
        }), y.find(".bd-table").append("<tbody id='bd-table-days-" + t + "' class='bd-table-days'></tbody>");
        var w = $("#bd-table-days-" + t);
        if (p.gotoToday) {
            y.append("<div class='bd-goto-today'>برو به امروز</div>");
            var k = y.find(".bd-goto-today")
        }

        function D() {
            var e, n, o, a = document.querySelector("#bd-main-".concat(t)),
                r = document.querySelector("#".concat(t));
            if (r.offsetHeight, a.offsetHeight, "top" === p.position) a.style.top = "".concat(-1 * a.offsetHeight, "px");
            else if ("auto" === p.position) {
                var i;
                p.parentId && (i = document.querySelector("#".concat(p.parentId))), p.parentId && i || (i = document.querySelector("#bd-root-".concat(t)));
                var d = (e = r, n = u(i), o = u(e), Math.abs(n.y - o.y));
                i.offsetHeight - d - (r.offsetHeight + a.offsetHeight) > 0 ? a.style.top = "".concat(r.offsetHeight, "px") : d - (r.offsetHeight + a.offsetHeight) > 0 ? a.style.top = "".concat(-1 * a.offsetHeight, "px") : a.style.top = "".concat(r.offsetHeight, "px")
            } else a.style.top = "".concat(r.offsetHeight, "px");
            var s, l, c = (s = a.getBoundingClientRect(), (l = {}).top = s.top < 0, l.left = s.left < 0, l.bottom = s.bottom > (window.innerHeight || document.documentElement.clientHeight), l.right = s.right > (window.innerWidth || document.documentElement.clientWidth), l.any = l.top || l.left || l.bottom || l.right, l.all = l.top && l.left && l.bottom && l.right, l);

            function u(t) {
                var e = t.getBoundingClientRect(),
                    n = e.top,
                    o = e.left;
                return {
                    x: o,
                    y: n
                }
            }
            c.left && (a.style.left = 0)
        }

        op.onclick = function () {
            $(`#${t}`).focus();
            if (b.hasClass("bd-hide")) {
                b.removeClass("bd-hide");
            }
            else {
                0 == u ? (b.addClass("bd-hide"), f = !1) : (u = !1, v.focus(), event.preventDefault())
            }
            p.sync && !1 === f && (q(), f = !0), D()
            if (v.val() === '') {
                I.val(r); x.val(a);
            }
        }; op.onkeydown = function (vn) {
            if (vn.keyCode === 67 && !vn.ctrlKey)
                op.onclick();
        }; op.onblur = function () {
            0 == u ? (b.addClass("bd-hide"), f = !1) : (u = !1, v.focus(), event.preventDefault())
        };
        v.on("blur", function () {
            0 == u ? (b.addClass("bd-hide"), f = !1) : (u = !1, v.focus(), event.preventDefault())
        }).keydown(function (ev) {
            if (ev.which === 67 && !ev.ctrlKey) {
                op.onclick();
                return;
            }
            else if (ev.which === 27) {
                if (!b.hasClass("bd-hide"))
                    0 == u ? (b.addClass("bd-hide"), f = !1) : (u = !1, v.focus(), event.preventDefault())
            }
            else if (ev.keyCode === 70 && !ev.ctrlKey) {
                v.val(getFirstdayDateTime());
                v.focus();
            }
            else if (ev.keyCode === 76 && !ev.ctrlKey) {
                v.val(getLastdayDateTime());
                v.focus();
            }
            else if (ev.keyCode === 84 && !ev.ctrlKey) {
                v.val(getTodayDateTime());
                v.focus();
            }

        }), b.on("mousedown", function (t) {
            u = !0
        }), I.on("change", function () {

            o = parseInt(this.value), s = E(n, o), d = M(n, o), R(s, d), D()
        }), x.on("change", function () {
            n = parseInt(this.value),
                s = E(n, o), d = M(n, o), R(s, d), D()
        });
        var H = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            B = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

        function S(t, e, n) {
            return O(function (t, e, n) {
                var o = Y(t);
                return T(o.gy, 3, o.march) + 31 * (e - 1) - F(e, 7) * (e - 7) + n - 1
            }(t, e, n))
        }

        function Y(t) {
            var e, n, o, a, r, i, d, s = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
                l = s.length,
                c = t + 621,
                p = -14,
                u = s[0];
            if (u > t || t >= s[l - 1]) throw new Error("Invalid Jalaali year " + t);
            for (d = 1; l > d && (n = (e = s[d]) - u, !(e > t)); d += 1) p = p + 8 * F(n, 33) + F(N(n, 33), 4), u = e;
            return p = p + 8 * F(i = t - u, 33) + F(N(i, 33) + 3, 4), 4 === N(n, 33) && n - i == 4 && (p += 1), a = F(c, 4) - F(3 * (F(c, 100) + 1), 4) - 150, r = 20 + p - a, 6 > n - i && (i = i - n + 33 * F(n + 4, 33)), -1 === (o = N(N(i + 1, 33) - 1, 4)) && (o = 4), {
                leap: o,
                gy: c,
                march: r
            }
        }

        function T(t, e, n) {
            var o = F(1461 * (t + F(e - 8, 6) + 100100), 4) + F(153 * N(e + 9, 12) + 2, 5) + n - 34840408;
            return o = o - F(3 * F(t + 100100 + F(e - 8, 6), 100), 4) + 752
        }

        function O(t) {
            var e, n, o, a;
            return e = (e = 4 * t + 139361631) + 4 * F(3 * F(4 * t + 183187720, 146097), 4) - 3908, n = 5 * F(N(e, 1461), 4) + 308, o = F(N(n, 153), 5) + 1, a = N(F(n, 153), 12) + 1, {
                gy: F(e, 1461) - 100100 + F(8 - a, 6),
                gm: a,
                gd: o
            }
        }

        function F(t, e) {
            return ~~(t / e)
        }

        function N(t, e) {
            return t - ~~(t / e) * e
        }
        var q = function () {
            var t = A(v.val());
            "" !== t && (t = t.split("/"), I.val(parseInt(t[1])), I.trigger("change"), x.val(parseInt(t[0])), x.trigger("change"), p.highlightSelectedDay && (b.find(".bd-selected-day").removeClass("bd-selected-day"), b.find(".day-" + parseInt(t[2])).addClass("bd-selected-day")))
        },
            A = function (t) {
                return "" === t ? "" : ((t = t.split("/"))[1].length < 2 && t[1] < 10 && (t[1] = "0" + t[1]), t[2].length < 2 && t[2] < 10 && (t[2] = "0" + t[2]), t = t.join("/"))
            },
            E = function (t, e) {
                return e < 7 ? 31 : e < 12 ? 30 : function (t) {
                    var e;
                    return t > 1243 && t < 1473 ? 1 == (e = t % 33) || 5 == e || 9 == e || 13 == e || 17 == e || 22 == e || 26 == e || 30 == e : "unknown"
                }(t) ? 30 : 29
            };
        l = new Date, c = function (t, e, n) {
            t = parseInt(t), e = parseInt(e), n = parseInt(n);
            for (var o = t - 1600, a = e - 1, r = n - 1, i = 365 * o + parseInt((o + 3) / 4) - parseInt((o + 99) / 100) + parseInt((o + 399) / 400), d = 0; a > d; ++d) i += H[d];
            a > 1 && (o % 4 == 0 && o % 100 != 0 || o % 400 == 0) && ++i;
            var s = (i += r) - 79,
                l = parseInt(s / 12053);
            s %= 12053;
            var c = 979 + 33 * l + 4 * parseInt(s / 1461);
            (s %= 1461) >= 366 && (c += parseInt((s - 1) / 365), s = (s - 1) % 365);
            for (var d = 0; 11 > d && s >= B[d]; ++d) s -= B[d];
            return [c, d + 1, s + 1]
        }(l.getFullYear(), l.getMonth() + 1, l.getDate());
        for (var P = [], j = 0; j < 3; j++) P[j] = c[j];
        a = c[0], r = c[1], i = c[2], n = P[0], o = P[1], P[2], I.val(o),
            function (t) {
                x.find("option").remove();
                for (var e = 0; e < p.pastYearsCount + p.futureYearsCount; e++) {
                    var n = t - p.pastYearsCount + e + "";
                    if (p.forceFarsiDigits)
                        for (var o = 0; o < 10; o++) {
                            var a = new RegExp(o, "g");
                            n = n.replace(a, g[o])
                        }
                    x.append($("<option>", {
                        value: t - p.pastYearsCount + e,
                        text: n
                    }))
                }
            }(n), x.val(n), s = E(n, o);
        var M = function (t, e) {
            var n = S(t, e, 1);
            return function (t) {
                var e;
                e = t < 6 ? t + 1 : 0;
                return e
            }((n = new Date(n.gy + "/" + n.gm + "/" + n.gd)).getDay())
        };
        d = M(n, o);
        var R = function (e, d) {
            w.empty();
            for (var s = 1, l = 1; s <= e;) {
                w.append($("<tr>", {
                    class: "tr-" + l
                }));
                for (var c = 0; c < 7; c++) {
                    if (1 == s)
                        for (var u = 0; u < d;) $("#bd-table-days-" + t + " .tr-1").append($("<td>", {
                            class: "bd-empty-cell"
                        })), u++, c++;
                    if (c < 7 && s <= e) {
                        //var f = '<td><button class="day day-' + s + ' " type="button">' + (p.forceFarsiDigits ? g[s] : s) + "</button></td>";
                        var f = `<td><button class="day day-${s}" type="button">${(p.forceFarsiDigits ? g[s] : s)}</button></td>`

                        if (p.markToday && s == i && r == o && a == n) {
                            var y = f.indexOf("day day-");
                            f = f.slice(0, y) + "bd-today-" + t + " bd-today " + f.slice(y);
                        }
                        if (p.markHolidays && 6 == c) {
                            var y = f.indexOf("day day-");
                            f = f.slice(0, y) + " bd-holiday " + f.slice(y)
                        }
                        $("#bd-table-days-" + t + " .tr-" + l).append(f), s++
                    }
                }
                l++
            }
            if (p.highlightSelectedDay) {
                var h = v.val();
                (h = h.split("/"))[0] == n && h[1] == o && (b.find(".bd-selected-day").removeClass("bd-selected-day"), b.find(".day-" + parseInt(h[2])).addClass("bd-selected-day"))
            }
        };
        v.parent().on("click", "button.day", function () {

            var t = x.val() + "/" + I.val() + "/" + $(this).attr("class").split(" ")[$(this).attr("class").split(" ").indexOf("day") + 1].split("-")[1];
            p.twodigit && (t = A(t)),
                v.val(t),
                v.trigger("change"),
                p.closeAfterSelect && (u = !1, v.trigger("blur")),
                p.highlightSelectedDay && (b.find(".bd-selected-day").removeClass("bd-selected-day"),
                    $(this).addClass("bd-selected-day"));
            v.focus();
        }), m.on("click", function () {
            I.val() < 12 ? (I.val(parseInt(I.val()) + 1), I.trigger("change")) : x.val() != x[0].options[x[0].options.length - 1].value && (I.val(1), I.trigger("change"), x.val(parseInt(x.val()) + 1), x.trigger("change"))
        }), C.on("click", function () {
            I.val() > 1 ? (I.val(parseInt(I.val()) - 1), I.trigger("change")) : x.val() != x[0].options[0].value && (I.val(12), I.trigger("change"), x.val(parseInt(x.val()) - 1), x.trigger("change"))
        }), p.gotoToday && k.on("click", function () {
            I.val(r), I.trigger("change"), x.val(a), x.trigger("change");

            v.val(getTodayDateTime());
            v.focus();
        });
        R(s, d), "function" == typeof $().modal //&& $('[data-toggle="tooltip"]').tooltip();

        function getTodayDateTime() {
            I.val(r), I.trigger("change"), x.val(a), x.trigger("change");

            var day = transformNumbers.toNormal($(`.bd-today-${t}`).text());

            var tDateTime = p.withTime ? `${a}/${padZero(r)}/${padZero(day)}    ${getLastTime()}` : `${a}/${padZero(r)}/${padZero(day)}`;
            return tDateTime;
        }

        function getFirstdayDateTime() {

            var day = transformNumbers.toNormal($(`.bd-today-${t}`).text());
            var tDateTime = p.withTime ? `${a}/${padZero(r)}/${padZero(day)}    ${getLastTime()}` : `${a}/${padZero(r)}/${padZero(day)}`;
            return tDateTime.substring(0, 4) + "/01/01";
        }

        function getLastdayDateTime() {

            var day = transformNumbers.toNormal($(`.bd-today-${t}`).text());
            var tDateTime = p.withTime ? `${a}/${padZero(r)}/${padZero(day)}    ${getLastTime()}` : `${a}/${padZero(r)}/${padZero(day)}`;
            return tDateTime.substring(0, 4) + "/12/29";
        }

        function padZero(r) {
            var str = "" + r;
            var pad = "00";
            var ans = pad.substring(0, pad.length - str.length) + str;
            return ans;
        }

        function getLastTime() {
            let dt = new Date();
            var hour = padZero(dt.getHours());
            var minute = padZero(dt.getMinutes());
            return hour + ":" + minute
        }

    }
}, function (t, e) { }]);

