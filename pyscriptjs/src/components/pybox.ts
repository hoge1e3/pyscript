import { addClasses } from '../utils';

export class PyBox extends HTMLElement {
    shadow: ShadowRoot;
    wrapper: HTMLElement;
    theme: string;
    widths: Array<string>;
  
    constructor() {
        super();
  
        // attach shadow so we can preserve the element original innerHtml content
        this.shadow = this.attachShadow({ mode: 'open'});
  
        this.wrapper = document.createElement('slot');
        this.shadow.appendChild(this.wrapper);
      }


    connectedCallback() {
      let mainDiv = document.createElement('div');
      addClasses(mainDiv, ["flex"])
      
      // Hack: for some reason when moving children, the editor box duplicates children
      // meaning that we end up with 2 editors, if there's a <py-repl> inside the <py-box>
      // so, if we have more than 2 children with the cm-editor class, we remove one of them
      while (this.childNodes.length > 0) {
        console.log(this.firstChild);
        if ( this.firstChild.nodeName == "PY-REPL" ){
          // in this case we need to remove the child and craete a new one from scratch
          let replDiv = document.createElement('div');
          // we need to put the new repl inside a div so that if the repl has auto-generate true
          // it can replicate itself inside that constrained div
          replDiv.appendChild(this.firstChild.cloneNode());
          mainDiv.appendChild(replDiv);
          this.firstChild.remove();
        }
        else{
          if ( this.firstChild.nodeName != "#text" ){
            mainDiv.appendChild(this.firstChild);  
          }else{
            this.firstChild.remove()
          }
        }
      }

      // now we need to set widths
      this.widths = []
      if (this.hasAttribute('widths')) {
        for (let w of this.getAttribute('widths').split(";")) {
          this.widths.push(`w-${w}`);
        }
      }else{
        for (let el of mainDiv.childNodes) {
          this.widths.push(`w-1/${mainDiv.childNodes.length}`);
        }
      }

      for (let i in this.widths) {
        // @ts-ignore
        addClasses(mainDiv.childNodes[parseInt(i)], [this.widths[i], 'mx-4']);
      }

      this.appendChild(mainDiv);  
      console.log('py-box connected');
    }
  }

  