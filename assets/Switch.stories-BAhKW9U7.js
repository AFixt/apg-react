import{r as k,R as s}from"./index-BXjX_wEA.js";import{within as g,expect as c,userEvent as r}from"./index-DgAF9SIF.js";const f=({label:t,ariaLabelledby:a,ariaDescribedby:o,initialChecked:e=!1})=>{const[l,E]=k.useState(e),h=`switch-label-${k.useId()}`,d=()=>{E(!l)},C=w=>{(w.key===" "||w.key==="Enter")&&(w.preventDefault(),d())};return s.createElement("div",{className:"switch-container"},t&&s.createElement("span",{id:h,className:"switch-label-text",onClick:d},t),s.createElement("span",{role:"switch","aria-checked":l,tabIndex:0,onKeyDown:C,onClick:d,"aria-labelledby":a||(t?h:void 0),"aria-describedby":o,className:"switch-control"},s.createElement("span",{className:`switch ${l?"switch-on":"switch-off"}`})))};f.__docgenInfo={description:"",methods:[],displayName:"Switch",props:{label:{required:!1,tsType:{name:"string"},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:""},ariaDescribedby:{required:!1,tsType:{name:"string"},description:""},initialChecked:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const H={title:"Components/Switch",component:f,tags:["autodocs"]},n={args:{label:"Enable dark mode",initialChecked:!1},play:async({canvasElement:t,step:a})=>{const e=g(t).getByRole("switch");await a("Starts unchecked",async()=>{await c(e).toHaveAttribute("aria-checked","false")}),await a("Click toggles to checked",async()=>{await r.click(e),await c(e).toHaveAttribute("aria-checked","true")}),await a("Space toggles back to unchecked",async()=>{e.focus(),await r.keyboard(" "),await c(e).toHaveAttribute("aria-checked","false")})}},i={args:{label:"Enable notifications",initialChecked:!0},play:async({canvasElement:t,step:a})=>{const e=g(t).getByRole("switch");await a("Starts checked",async()=>{await c(e).toHaveAttribute("aria-checked","true")}),await a("Click toggles to unchecked",async()=>{await r.click(e),await c(e).toHaveAttribute("aria-checked","false")}),await a("Click again restores checked state (matches story name)",async()=>{await r.click(e),await c(e).toHaveAttribute("aria-checked","true")})}};var u,p,y;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: 'Enable dark mode',
    initialChecked: false
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch');
    await step('Starts unchecked', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });
    await step('Click toggles to checked', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
    await step('Space toggles back to unchecked', async () => {
      sw.focus();
      await userEvent.keyboard(' ');
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });
  }
}`,...(y=(p=n.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var m,b,v;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: 'Enable notifications',
    initialChecked: true
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole('switch');
    await step('Starts checked', async () => {
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
    await step('Click toggles to unchecked', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'false');
    });
    await step('Click again restores checked state (matches story name)', async () => {
      await userEvent.click(sw);
      await expect(sw).toHaveAttribute('aria-checked', 'true');
    });
  }
}`,...(v=(b=i.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const I=["Off","On"];export{n as Off,i as On,I as __namedExportsOrder,H as default};
