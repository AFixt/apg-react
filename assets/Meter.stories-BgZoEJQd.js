import{R as a}from"./index-BXjX_wEA.js";const x=({value:e,minValue:n=0,maxValue:o=100,label:l,labelId:T="meter-label",userFriendlyText:i})=>{const V=Math.max(0,Math.min(100,(e-n)/(o-n)*100)),h=i?i(e):`${e}`,m=T||"meter-label";return a.createElement("div",{className:"meter-container"},l&&a.createElement("div",{id:m,className:"meter-label"},l),a.createElement("div",{role:"meter","aria-valuenow":e,"aria-valuemin":n,"aria-valuemax":o,"aria-valuetext":h,"aria-labelledby":l?m:void 0,className:"meter"},a.createElement("div",{className:"meter-fill",style:{width:`${V}%`}})))};x.__docgenInfo={description:"",methods:[],displayName:"Meter",props:{value:{required:!0,tsType:{name:"number"},description:""},minValue:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},maxValue:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"100",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},labelId:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"meter-label"',computed:!1}},userFriendlyText:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number) => string",signature:{arguments:[{type:{name:"number"},name:"value"}],return:{name:"string"}}},description:""}}};const M={title:"Components/Meter",component:x,tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1}}}},r={args:{value:72,label:"Disk usage"}},t={args:{value:15,label:"Battery level"}},s={args:{value:7,minValue:0,maxValue:10,label:"Satisfaction score"}};var u,c,d;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    value: 72,
    label: 'Disk usage'
  }
}`,...(d=(c=r.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,g,v;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    value: 15,
    label: 'Battery level'
  }
}`,...(v=(g=t.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,b,y;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 7,
    minValue: 0,
    maxValue: 10,
    label: 'Satisfaction score'
  }
}`,...(y=(b=s.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};const w=["Default","Low","WithCustomRange"];export{r as Default,t as Low,s as WithCustomRange,w as __namedExportsOrder,M as default};
