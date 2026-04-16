import{R as o}from"./index-BXjX_wEA.js";import{within as p,expect as s}from"./index-DgAF9SIF.js";const h=({value:a,min:t=0,max:r=100,label:e,labelId:m,valueText:H})=>{const n=a==null,E=n?0:Math.max(0,Math.min(100,(a-t)/(r-t)*100));return o.createElement("div",{className:"progressbar-container"},e&&o.createElement("div",{id:m||"progressbar-label",className:"progressbar-label"},e),o.createElement("div",{role:"progressbar","aria-valuemin":t,"aria-valuemax":r,"aria-valuenow":n?void 0:a,"aria-valuetext":H,"aria-labelledby":e?m||"progressbar-label":void 0,className:`progressbar${n?" is-indeterminate":""}`},o.createElement("div",{className:"progressbar-fill",style:n?void 0:{width:`${E}%`}})))};h.__docgenInfo={description:"",methods:[],displayName:"Progressbar",props:{value:{required:!1,tsType:{name:"number"},description:""},min:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"100",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},labelId:{required:!1,tsType:{name:"string"},description:""},valueText:{required:!1,tsType:{name:"string"},description:""}}};const R={title:"Components/Progressbar",component:h,tags:["autodocs"]},i={args:{value:65,label:"Upload progress"},play:async({canvasElement:a,step:t})=>{const r=p(a);await t("Has role=progressbar with aria-valuenow",async()=>{const e=r.getByRole("progressbar");await s(e).toHaveAttribute("aria-valuenow","65"),await s(e).toHaveAttribute("aria-valuemin","0"),await s(e).toHaveAttribute("aria-valuemax","100")})}},l={args:{label:"Loading"},play:async({canvasElement:a,step:t})=>{const r=p(a);await t("Indeterminate progressbar omits aria-valuenow",async()=>{const e=r.getByRole("progressbar");await s(e).not.toHaveAttribute("aria-valuenow")})}},c={args:{value:3,min:0,max:10,label:"Steps completed",valueText:"3 of 10 steps"},play:async({canvasElement:a,step:t})=>{const r=p(a);await t("aria-valuetext overrides numeric announcement",async()=>{const e=r.getByRole("progressbar");await s(e).toHaveAttribute("aria-valuetext","3 of 10 steps")})}};var u,v,d;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    value: 65,
    label: 'Upload progress'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Has role=progressbar with aria-valuenow', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).toHaveAttribute('aria-valuenow', '65');
      await expect(pb).toHaveAttribute('aria-valuemin', '0');
      await expect(pb).toHaveAttribute('aria-valuemax', '100');
    });
  }
}`,...(d=(v=i.parameters)==null?void 0:v.docs)==null?void 0:d.source}}};var b,g,y;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: 'Loading'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Indeterminate progressbar omits aria-valuenow', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).not.toHaveAttribute('aria-valuenow');
    });
  }
}`,...(y=(g=l.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var w,x,f;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    value: 3,
    min: 0,
    max: 10,
    label: 'Steps completed',
    valueText: '3 of 10 steps'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('aria-valuetext overrides numeric announcement', async () => {
      const pb = canvas.getByRole('progressbar');
      await expect(pb).toHaveAttribute('aria-valuetext', '3 of 10 steps');
    });
  }
}`,...(f=(x=c.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};const q=["Determinate","Indeterminate","WithValueText"];export{i as Determinate,l as Indeterminate,c as WithValueText,q as __namedExportsOrder,R as default};
