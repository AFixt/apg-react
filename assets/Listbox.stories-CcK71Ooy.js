import{r as d,R as p}from"./index-BXjX_wEA.js";import{within as L,expect as u,userEvent as y}from"./index-DgAF9SIF.js";const f=({options:n,value:s,onChange:t,multiple:r,label:i,labelId:T})=>{const[w,E]=d.useState(()=>{if(r)return 0;const a=n.findIndex(e=>e.value===s);return a>=0?a:0}),N=d.useRef(null),A=d.useRef([]),k=T||"listbox-label",x=d.useMemo(()=>r?new Set(Array.isArray(s)?s:[]):new Set(s!=null?[s]:[]),[s,r]),S=a=>{const e=n[a].value;t==null||t(e)},R=a=>{const e=new Set(x),o=n[a].value;e.has(o)?e.delete(o):e.add(o),t==null||t(Array.from(e))},B=(a,e)=>{const[o,l]=a<=e?[a,e]:[e,a],c=new Set(x);for(let g=o;g<=l;g++)c.add(n[g].value);t==null||t(Array.from(c))},b=(a,{extend:e}={})=>{var c;const o=Math.max(0,Math.min(n.length-1,a)),l=w;E(o),(c=A.current[o])==null||c.focus(),r?e&&B(l,o):S(o)},_=(a,e)=>{let o=!0;switch(a.key){case"ArrowDown":b(e+1,{extend:r&&a.shiftKey});break;case"ArrowUp":b(e-1,{extend:r&&a.shiftKey});break;case"Home":b(0,{extend:r&&a.shiftKey});break;case"End":b(n.length-1,{extend:r&&a.shiftKey});break;case" ":r&&R(e);break;case"a":case"A":r&&(a.ctrlKey||a.metaKey)?t==null||t(n.map(l=>l.value)):o=!1;break;default:o=!1}o&&a.preventDefault()};return p.createElement("div",{className:"listbox-container"},i&&p.createElement("div",{id:k,className:"listbox-label"},i),p.createElement("ul",{ref:N,role:"listbox","aria-labelledby":i?k:void 0,"aria-multiselectable":r||void 0,className:"listbox",tabIndex:-1},n.map((a,e)=>{const o=x.has(a.value);return p.createElement("li",{key:a.value,ref:l=>A.current[e]=l,role:"option","aria-selected":o,className:`listbox-option${o?" is-selected":""}${e===w?" is-focused":""}`,tabIndex:e===w?0:-1,onClick:l=>{var c;E(e),(c=A.current[e])==null||c.focus(),r?l.shiftKey?B(w,e):R(e):S(e)},onKeyDown:l=>_(l,e)},a.label)})))};f.__docgenInfo={description:"",methods:[],displayName:"Listbox",props:{options:{required:!0,tsType:{name:"Array",elements:[{name:"ListboxOption"}],raw:"ListboxOption[]"},description:""},value:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(next: string | string[]) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},name:"next"}],return:{name:"void"}}},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:""},label:{required:!1,tsType:{name:"string"},description:""},labelId:{required:!1,tsType:{name:"string"},description:""}}};const V={title:"Components/Listbox",component:f,tags:["autodocs"]},q=[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"},{value:"cherry",label:"Cherry"},{value:"date",label:"Date"},{value:"elderberry",label:"Elderberry"}],F=n=>{const[s,t]=d.useState(n.value??"apple");return p.createElement(f,{...n,value:s,onChange:t})},P=n=>{const[s,t]=d.useState(n.value??[]);return p.createElement(f,{...n,multiple:!0,value:s,onChange:t})},m={render:F,args:{label:"Pick a fruit",options:q},play:async({canvasElement:n,step:s})=>{const t=L(n),r=t.getAllByRole("option");await s("First option starts selected",async()=>{await u(r[0]).toHaveAttribute("aria-selected","true")}),await s("ArrowDown moves focus and selection",async()=>{r[0].focus(),await y.keyboard("{ArrowDown}");const i=t.getAllByRole("option");await u(i[1]).toHaveAttribute("aria-selected","true")}),await s("End jumps to last option",async()=>{await y.keyboard("{End}");const i=t.getAllByRole("option");await u(i[i.length-1]).toHaveAttribute("aria-selected","true")})}},v={render:P,args:{label:"Pick fruits",options:q},play:async({canvasElement:n,step:s})=>{const t=L(n),r=t.getByRole("listbox");await s("Container is aria-multiselectable=true",async()=>{await u(r).toHaveAttribute("aria-multiselectable","true")}),await s("Space toggles selection without moving focus",async()=>{t.getAllByRole("option")[0].focus(),await y.keyboard(" "),await u(t.getAllByRole("option")[0]).toHaveAttribute("aria-selected","true")}),await s("ArrowDown + Space selects multiple items",async()=>{await y.keyboard("{ArrowDown}"),await y.keyboard(" ");const i=t.getAllByRole("option");await u(i[0]).toHaveAttribute("aria-selected","true"),await u(i[1]).toHaveAttribute("aria-selected","true")})}};var H,D,K;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: Single,
  args: {
    label: 'Pick a fruit',
    options: fruits
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole('option');
    await step('First option starts selected', async () => {
      await expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });
    await step('ArrowDown moves focus and selection', async () => {
      options[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      const updated = canvas.getAllByRole('option');
      await expect(updated[1]).toHaveAttribute('aria-selected', 'true');
    });
    await step('End jumps to last option', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('option');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-selected', 'true');
    });
  }
}`,...(K=(D=m.parameters)==null?void 0:D.docs)==null?void 0:K.source}}};var h,I,M;v.parameters={...v.parameters,docs:{...(h=v.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: Multi,
  args: {
    label: 'Pick fruits',
    options: fruits
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('listbox');
    await step('Container is aria-multiselectable=true', async () => {
      await expect(list).toHaveAttribute('aria-multiselectable', 'true');
    });
    await step('Space toggles selection without moving focus', async () => {
      const options = canvas.getAllByRole('option');
      options[0].focus();
      await userEvent.keyboard(' ');
      await expect(canvas.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    });
    await step('ArrowDown + Space selects multiple items', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard(' ');
      const options = canvas.getAllByRole('option');
      await expect(options[0]).toHaveAttribute('aria-selected', 'true');
      await expect(options[1]).toHaveAttribute('aria-selected', 'true');
    });
  }
}`,...(M=(I=v.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};const $=["SingleSelect","MultiSelect"];export{v as MultiSelect,m as SingleSelect,$ as __namedExportsOrder,V as default};
