import{r as A,R as o}from"./index-BXjX_wEA.js";import{within as f,expect as c,userEvent as u}from"./index-DgAF9SIF.js";const F=({tabs:r,defaultIndex:n,activation:t="automatic",orientation:s="horizontal",idPrefix:d})=>{const[E,y]=A.useState(n??0),[I,h]=A.useState(n??0),x=A.useRef([]),b=d||"tabs",v=a=>{var e;h(a),(e=x.current[a])==null||e.focus(),t==="automatic"&&y(a)},N=(a,e)=>{const l=r.length-1,i=s!=="vertical",S=i?"ArrowRight":"ArrowDown",_=i?"ArrowLeft":"ArrowUp";let R=!0;switch(a.key){case S:v(e===l?0:e+1);break;case _:v(e===0?l:e-1);break;case"Home":v(0);break;case"End":v(l);break;case"Enter":case" ":y(e);break;default:R=!1}R&&a.preventDefault()};return o.createElement("div",{className:`tabs tabs-${s||"horizontal"}`},o.createElement("div",{role:"tablist","aria-orientation":s||"horizontal",className:"tablist"},r.map((a,e)=>{const l=e===E;return o.createElement("button",{key:a.id,id:`${b}-tab-${a.id}`,ref:i=>x.current[e]=i,role:"tab",type:"button",className:`tab${l?" is-active":""}`,"aria-selected":l,"aria-controls":`${b}-panel-${a.id}`,tabIndex:e===I?0:-1,onClick:()=>{y(e),h(e)},onKeyDown:i=>N(i,e)},a.label)})),r.map((a,e)=>o.createElement("div",{key:a.id,id:`${b}-panel-${a.id}`,role:"tabpanel","aria-labelledby":`${b}-tab-${a.id}`,className:"tabpanel",hidden:e!==E,tabIndex:0},a.content)))};F.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabDef"}],raw:"TabDef[]"},description:""},defaultIndex:{required:!1,tsType:{name:"number"},description:""},activation:{required:!1,tsType:{name:"union",raw:'"automatic" | "manual"',elements:[{name:"literal",value:'"automatic"'},{name:"literal",value:'"manual"'}]},description:"",defaultValue:{value:'"automatic"',computed:!1}},orientation:{required:!1,tsType:{name:"union",raw:'"horizontal" | "vertical"',elements:[{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:"",defaultValue:{value:'"horizontal"',computed:!1}},idPrefix:{required:!1,tsType:{name:"string"},description:""}}};const j={title:"Components/Tabs",component:F,tags:["autodocs"]},g=[{id:"overview",label:"Overview",content:o.createElement("p",null,"Overview content goes here.")},{id:"pricing",label:"Pricing",content:o.createElement("p",null,"Pricing details and plans.")},{id:"faq",label:"FAQ",content:o.createElement("p",null,"Frequently asked questions.")}],m={args:{tabs:g,idPrefix:"h"},play:async({canvasElement:r,step:n})=>{const t=f(r),s=t.getAllByRole("tab");await n("First tab is selected",async()=>{await c(s[0]).toHaveAttribute("aria-selected","true")}),await n("ArrowRight moves activation to next tab (automatic)",async()=>{s[0].focus(),await u.keyboard("{ArrowRight}"),await c(t.getAllByRole("tab")[1]).toHaveAttribute("aria-selected","true")}),await n("End jumps to last tab",async()=>{await u.keyboard("{End}");const d=t.getAllByRole("tab");await c(d[d.length-1]).toHaveAttribute("aria-selected","true")})}},p={args:{tabs:g,orientation:"vertical",idPrefix:"v"},play:async({canvasElement:r,step:n})=>{const t=f(r),s=t.getAllByRole("tab");await n("ArrowDown moves to next tab in vertical orientation",async()=>{s[0].focus(),await u.keyboard("{ArrowDown}"),await c(t.getAllByRole("tab")[1]).toHaveAttribute("aria-selected","true")})}},w={args:{tabs:g,activation:"manual",idPrefix:"m"},play:async({canvasElement:r,step:n})=>{const t=f(r),s=t.getAllByRole("tab");await n("Focus moves but selection does not (manual mode)",async()=>{s[0].focus(),await u.keyboard("{ArrowRight}"),await c(t.getAllByRole("tab")[0]).toHaveAttribute("aria-selected","true")}),await n("Enter activates the focused tab",async()=>{await u.keyboard("{Enter}"),await c(t.getAllByRole("tab")[1]).toHaveAttribute("aria-selected","true")})}};var T,k,B;m.parameters={...m.parameters,docs:{...(T=m.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    tabs,
    idPrefix: 'h'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');
    await step('First tab is selected', async () => {
      await expect(allTabs[0]).toHaveAttribute('aria-selected', 'true');
    });
    await step('ArrowRight moves activation to next tab (automatic)', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });
    await step('End jumps to last tab', async () => {
      await userEvent.keyboard('{End}');
      const updated = canvas.getAllByRole('tab');
      await expect(updated[updated.length - 1]).toHaveAttribute('aria-selected', 'true');
    });
  }
}`,...(B=(k=m.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var H,D,$;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    tabs,
    orientation: 'vertical',
    idPrefix: 'v'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');
    await step('ArrowDown moves to next tab in vertical orientation', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });
  }
}`,...($=(D=p.parameters)==null?void 0:D.docs)==null?void 0:$.source}}};var z,P,q;w.parameters={...w.parameters,docs:{...(z=w.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    tabs,
    activation: 'manual',
    idPrefix: 'm'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const allTabs = canvas.getAllByRole('tab');
    await step('Focus moves but selection does not (manual mode)', async () => {
      allTabs[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    });
    await step('Enter activates the focused tab', async () => {
      await userEvent.keyboard('{Enter}');
      await expect(canvas.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });
  }
}`,...(q=(P=w.parameters)==null?void 0:P.docs)==null?void 0:q.source}}};const C=["Horizontal","Vertical","ManualActivation"];export{m as Horizontal,w as ManualActivation,p as Vertical,C as __namedExportsOrder,j as default};
