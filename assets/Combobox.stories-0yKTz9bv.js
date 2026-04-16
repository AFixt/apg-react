import{r as u,R as p}from"./index-BXjX_wEA.js";import{within as T,expect as m,userEvent as H}from"./index-DgAF9SIF.js";const D=({options:o,value:a,onChange:r,label:n,autocomplete:d="list",placeholder:z})=>{const[w,C]=u.useState(a??""),[s,b]=u.useState(!1),[c,i]=u.useState(-1),x=u.useRef(null),R=u.useRef(null),v=u.useId(),I=`combobox-list-${v}`,L=e=>`combobox-opt-${v}-${e}`;u.useEffect(()=>{a!==void 0&&C(a)},[a]);const f=u.useMemo(()=>{if(d==="none"||!w)return o;const e=w.toLowerCase();return o.filter(t=>t.label.toLowerCase().includes(e))},[o,w,d]),N=e=>{C(e),r==null||r(e)},q=e=>{const t=f[e];t&&(N(t.label),b(!1),i(-1))},y=(e=0)=>{b(!0),i(Math.min(e,f.length-1))},P=e=>{if(d!=="both"||!e)return;const t=o.find(l=>l.label.toLowerCase().startsWith(e.toLowerCase()));t&&t.label.toLowerCase()!==e.toLowerCase()&&requestAnimationFrame(()=>{const l=x.current;if(!l)return;const g=e.length;l.value=t.label,l.setSelectionRange(g,t.label.length)})},U=e=>{const t=e.target.value;C(t),r==null||r(t),b(!0),i(0),P(t)},W=e=>{const t=f.length-1;switch(e.key){case"ArrowDown":if(e.preventDefault(),e.altKey&&!s||!s)return y(0);i(c>=t?0:c+1);break;case"ArrowUp":if(e.preventDefault(),!s)return y(t);i(c<=0?t:c-1);break;case"Home":s&&(e.preventDefault(),i(0));break;case"End":s&&(e.preventDefault(),i(t));break;case"Enter":s&&c>=0&&(e.preventDefault(),q(c));break;case"Escape":e.preventDefault(),s?(b(!1),i(-1)):N("");break;case"Tab":b(!1);break}};u.useEffect(()=>{if(!s)return;const e=t=>{var l,g;!((l=x.current)!=null&&l.contains(t.target))&&!((g=R.current)!=null&&g.contains(t.target))&&(b(!1),i(-1))};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[s]);const j=c>=0?L(c):void 0;return p.createElement("div",{className:"combobox-container"},n&&p.createElement("label",{htmlFor:`combobox-input-${v}`,className:"combobox-label"},n),p.createElement("div",{className:"combobox-wrap"},p.createElement("input",{ref:x,id:`combobox-input-${v}`,type:"text",role:"combobox",className:"combobox-input",value:w,placeholder:z,onChange:U,onKeyDown:W,onFocus:()=>{d==="none"&&y(0)},"aria-autocomplete":d,"aria-expanded":s,"aria-controls":I,"aria-activedescendant":j,autoComplete:"off"}),p.createElement("button",{type:"button",className:"combobox-toggle",tabIndex:-1,"aria-label":s?"Close suggestions":"Open suggestions",onClick:()=>{var e;s?(b(!1),i(-1)):(y(0),(e=x.current)==null||e.focus())}},p.createElement("span",{"aria-hidden":"true"},"▾")),s&&f.length>0&&p.createElement("ul",{ref:R,id:I,role:"listbox","aria-labelledby":n?`combobox-input-${v}`:void 0,className:"combobox-list"},f.map((e,t)=>p.createElement("li",{key:e.value,id:L(t),role:"option","aria-selected":t===c,className:`combobox-option${t===c?" is-active":""}`,onMouseDown:l=>{l.preventDefault(),q(t)},onMouseEnter:()=>i(t)},e.label)))))};D.__docgenInfo={description:"",methods:[],displayName:"Combobox",props:{options:{required:!0,tsType:{name:"Array",elements:[{name:"ComboboxOption"}],raw:"ComboboxOption[]"},description:""},value:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(next: string) => void",signature:{arguments:[{type:{name:"string"},name:"next"}],return:{name:"void"}}},description:""},label:{required:!1,tsType:{name:"string"},description:""},autocomplete:{required:!1,tsType:{name:"union",raw:'"none" | "list" | "both"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"list"'},{name:"literal",value:'"both"'}]},description:"",defaultValue:{value:'"list"',computed:!1}},placeholder:{required:!1,tsType:{name:"string"},description:""}}};const X={title:"Components/Combobox",component:D,tags:["autodocs"]},G=[{value:"af",label:"Afghanistan"},{value:"al",label:"Albania"},{value:"dz",label:"Algeria"},{value:"ad",label:"Andorra"},{value:"ao",label:"Angola"},{value:"ar",label:"Argentina"},{value:"au",label:"Australia"},{value:"at",label:"Austria"}],k=o=>{const[a,r]=u.useState(o.value??"");return p.createElement(D,{...o,options:G,value:a,onChange:r})},A={render:k,args:{label:"Country (filters as you type)",autocomplete:"list",placeholder:"Type to search…"},play:async({canvasElement:o,step:a})=>{const n=T(o).getByRole("combobox");await a("Input has role=combobox with aria-autocomplete=list",async()=>{await m(n).toHaveAttribute("aria-autocomplete","list"),await m(n).toHaveAttribute("aria-expanded","false")}),await a("Typing opens popup and filters options",async()=>{await H.type(n,"a"),await m(n).toHaveAttribute("aria-expanded","true")}),await a("ArrowDown sets aria-activedescendant",async()=>{await H.keyboard("{ArrowDown}"),await m(n).toHaveAttribute("aria-activedescendant")}),await a("Escape closes the popup",async()=>{await H.keyboard("{Escape}"),await m(n).toHaveAttribute("aria-expanded","false")})}},h={render:k,args:{label:"Country (choose from list)",autocomplete:"none"},play:async({canvasElement:o,step:a})=>{const n=T(o).getByRole("combobox");await a("aria-autocomplete=none",async()=>{await m(n).toHaveAttribute("aria-autocomplete","none")}),await a("Focusing opens full popup",async()=>{n.focus(),await m(n).toHaveAttribute("aria-expanded","true")})}},E={render:k,args:{label:"Country (inline completion)",autocomplete:"both"},play:async({canvasElement:o,step:a})=>{const n=T(o).getByRole("combobox");await a("aria-autocomplete=both",async()=>{await m(n).toHaveAttribute("aria-autocomplete","both")})}};var B,S,$;A.parameters={...A.parameters,docs:{...(B=A.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Country (filters as you type)',
    autocomplete: 'list',
    placeholder: 'Type to search…'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await step('Input has role=combobox with aria-autocomplete=list', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'list');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });
    await step('Typing opens popup and filters options', async () => {
      await userEvent.type(input, 'a');
      await expect(input).toHaveAttribute('aria-expanded', 'true');
    });
    await step('ArrowDown sets aria-activedescendant', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveAttribute('aria-activedescendant');
    });
    await step('Escape closes the popup', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  }
}`,...($=(S=A.parameters)==null?void 0:S.docs)==null?void 0:$.source}}};var F,O,_;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Country (choose from list)',
    autocomplete: 'none'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await step('aria-autocomplete=none', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'none');
    });
    await step('Focusing opens full popup', async () => {
      input.focus();
      await expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  }
}`,...(_=(O=h.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var M,K,V;E.parameters={...E.parameters,docs:{...(M=E.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Country (inline completion)',
    autocomplete: 'both'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');
    await step('aria-autocomplete=both', async () => {
      await expect(input).toHaveAttribute('aria-autocomplete', 'both');
    });
  }
}`,...(V=(K=E.parameters)==null?void 0:K.docs)==null?void 0:V.source}}};const Y=["AutocompleteList","AutocompleteNone","AutocompleteBoth"];export{E as AutocompleteBoth,A as AutocompleteList,h as AutocompleteNone,Y as __namedExportsOrder,X as default};
