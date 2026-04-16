import{r as E,R as s}from"./index-BXjX_wEA.js";import{within as b,expect as t,userEvent as r}from"./index-DgAF9SIF.js";const v=({label:c,ariaLabelledby:a,ariaDescribedby:o,initialChecked:e=!1})=>{const[l,f]=E.useState(e),w=()=>{f(!l)},g=d=>{(d.key===" "||d.key==="Enter")&&(d.preventDefault(),w())};return s.createElement("div",{className:"switch-container"},s.createElement("label",null,s.createElement("span",{className:"switch-label-text"},c),s.createElement("span",{role:"switch","aria-checked":l,tabIndex:0,onKeyDown:g,onClick:w,"aria-labelledby":a,"aria-describedby":o,className:"switch-control"},s.createElement("span",{className:`switch ${l?"switch-on":"switch-off"}`}))))};v.__docgenInfo={description:"",methods:[],displayName:"Switch",props:{label:{required:!1,tsType:{name:"string"},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:""},ariaDescribedby:{required:!1,tsType:{name:"string"},description:""},initialChecked:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const x={title:"Components/Switch",component:v,tags:["autodocs"]},n={args:{label:"Enable dark mode",initialChecked:!1},play:async({canvasElement:c,step:a})=>{const e=b(c).getByRole("switch");await a("Starts unchecked",async()=>{await t(e).toHaveAttribute("aria-checked","false")}),await a("Click toggles to checked",async()=>{await r.click(e),await t(e).toHaveAttribute("aria-checked","true")}),await a("Space toggles back to unchecked",async()=>{e.focus(),await r.keyboard(" "),await t(e).toHaveAttribute("aria-checked","false")})}},i={args:{label:"Enable notifications",initialChecked:!0},play:async({canvasElement:c,step:a})=>{const e=b(c).getByRole("switch");await a("Starts checked",async()=>{await t(e).toHaveAttribute("aria-checked","true")}),await a("Click toggles to unchecked",async()=>{await r.click(e),await t(e).toHaveAttribute("aria-checked","false")}),await a("Click again restores checked state (matches story name)",async()=>{await r.click(e),await t(e).toHaveAttribute("aria-checked","true")})}};var h,u,k;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(k=(u=n.parameters)==null?void 0:u.docs)==null?void 0:k.source}}};var p,m,y;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(y=(m=i.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};const A=["Off","On"];export{n as Off,i as On,A as __namedExportsOrder,x as default};
