import{r as P,R as r}from"./index-BXjX_wEA.js";import{within as S,expect as c}from"./index-DgAF9SIF.js";const v=({message:i,type:o,labels:a})=>{const e={...{dismiss:"Dismiss"},...a},[T,E]=P.useState(!0),A=()=>{E(!1)};return T?r.createElement("div",{role:"alert","aria-live":"assertive",className:`alert alert-${o}`},r.createElement("span",{className:"alert-message"},i),r.createElement("button",{type:"button",className:"alert-close",onClick:A,"aria-label":e.dismiss},r.createElement("span",{"aria-hidden":"true"},"×"))):null};v.__docgenInfo={description:"",methods:[],displayName:"Alert",props:{message:{required:!0,tsType:{name:"string"},description:""},type:{required:!0,tsType:{name:"union",raw:'"info" | "warning" | "error"',elements:[{name:"literal",value:'"info"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'}]},description:""},labels:{required:!1,tsType:{name:"AlertLabels"},description:""}}};const _={title:"Components/Alert",component:v,tags:["autodocs"],argTypes:{type:{control:"radio",options:["info","warning","error"]}}},m=i=>async({canvasElement:o,step:a})=>{const l=S(o);await a("Has role=alert with correct variant class",async()=>{const e=l.getByRole("alert");await c(e).toHaveClass(i),await c(e).toHaveAttribute("aria-live","assertive")}),await a("Dismiss button is present with accessible name",async()=>{const e=l.getByRole("button",{name:"Dismiss"});await c(e).toBeInTheDocument()})},s={args:{type:"info",message:"This is an informational message."},play:m("alert-info")},t={args:{type:"warning",message:"This is a warning — proceed with caution."},play:m("alert-warning")},n={args:{type:"error",message:"Something went wrong. Please try again."},play:m("alert-error")};var p,g,u;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    type: 'info',
    message: 'This is an informational message.'
  },
  play: alertPlay('alert-info')
}`,...(u=(g=s.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var d,y,w;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    type: 'warning',
    message: 'This is a warning — proceed with caution.'
  },
  play: alertPlay('alert-warning')
}`,...(w=(y=t.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var f,h,b;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    type: 'error',
    message: 'Something went wrong. Please try again.'
  },
  play: alertPlay('alert-error')
}`,...(b=(h=n.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};const C=["Info","Warning","Error"];export{n as Error,s as Info,t as Warning,C as __namedExportsOrder,_ as default};
