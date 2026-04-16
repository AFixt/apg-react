import{r as y,R as i}from"./index-BXjX_wEA.js";import{within as N,expect as u,userEvent as f}from"./index-DgAF9SIF.js";const E=({label:l,labelId:c,options:t,value:n,onChange:s,name:k})=>{var w;const[R,x]=y.useState(n??((w=t[0])==null?void 0:w.value)),D=n!==void 0?n:R,m=y.useRef([]),b=c||`${k}-label`,v=e=>{n===void 0&&x(e),s==null||s(e)},d=e=>{const a=m.current[e];a&&(a.focus(),v(t[e].value))},H=(e,a)=>{const o=t.length-1;let r=!0;switch(e.key){case"ArrowDown":case"ArrowRight":d(a===o?0:a+1);break;case"ArrowUp":case"ArrowLeft":d(a===0?o:a-1);break;case"Home":d(0);break;case"End":d(o);break;case" ":v(t[a].value);break;default:r=!1}r&&e.preventDefault()};return i.createElement("div",{className:"radiogroup",role:"radiogroup","aria-labelledby":b},l&&i.createElement("div",{id:b,className:"radiogroup-label"},l),i.createElement("div",{className:"radiogroup-items"},t.map((e,a)=>{const o=D===e.value;return i.createElement("div",{key:e.value,ref:r=>m.current[a]=r,role:"radio",className:`radio${o?" is-checked":""}`,"aria-checked":o,tabIndex:o?0:-1,onClick:()=>{var r;(r=m.current[a])==null||r.focus(),v(e.value)},onKeyDown:r=>H(r,a)},i.createElement("span",{className:"radio-indicator","aria-hidden":"true"}),i.createElement("span",{className:"radio-label"},e.label))})))};E.__docgenInfo={description:"",methods:[],displayName:"RadioGroup",props:{name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},labelId:{required:!1,tsType:{name:"string"},description:""},options:{required:!0,tsType:{name:"Array",elements:[{name:"RadioOption"}],raw:"RadioOption[]"},description:""},value:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(next: string) => void",signature:{arguments:[{type:{name:"string"},name:"next"}],return:{name:"void"}}},description:""}}};const T={title:"Components/RadioGroup",component:E,tags:["autodocs"]},q=[{value:"email",label:"Email"},{value:"sms",label:"SMS"},{value:"push",label:"Push notification"}],p={args:{label:"Preferred contact method",name:"contact",options:q},play:async({canvasElement:l,step:c})=>{const t=N(l),n=t.getAllByRole("radio");await c("First radio is focusable (roving tabindex)",async()=>{await u(n[0]).toHaveAttribute("tabindex","0"),await u(n[1]).toHaveAttribute("tabindex","-1")}),await c("ArrowDown moves selection to the next radio",async()=>{n[0].focus(),await f.keyboard("{ArrowDown}"),await u(t.getAllByRole("radio")[1]).toHaveAttribute("aria-checked","true")}),await c("End moves selection to the last radio",async()=>{await f.keyboard("{End}");const s=t.getAllByRole("radio");await u(s[s.length-1]).toHaveAttribute("aria-checked","true")})}};var g,A,h;p.parameters={...p.parameters,docs:{...(g=p.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: 'Preferred contact method',
    name: 'contact',
    options
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const radios = canvas.getAllByRole('radio');
    await step('First radio is focusable (roving tabindex)', async () => {
      await expect(radios[0]).toHaveAttribute('tabindex', '0');
      await expect(radios[1]).toHaveAttribute('tabindex', '-1');
    });
    await step('ArrowDown moves selection to the next radio', async () => {
      radios[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'true');
    });
    await step('End moves selection to the last radio', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('radio');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-checked', 'true');
    });
  }
}`,...(h=(A=p.parameters)==null?void 0:A.docs)==null?void 0:h.source}}};const _=["Default"];export{p as Default,_ as __namedExportsOrder,T as default};
