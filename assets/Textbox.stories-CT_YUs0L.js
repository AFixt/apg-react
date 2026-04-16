import{r as $,R as r}from"./index-BXjX_wEA.js";import{within as g,expect as v,userEvent as G}from"./index-DgAF9SIF.js";const T=({label:e,value:a,onChange:n,multiline:t,rows:F,placeholder:V,required:x,readOnly:E,invalid:s,errorMessage:l,helperText:y,id:U,name:j,type:P})=>{const k=$.useId(),o=U||`textbox-${k}`,b=`${o}-error`,w=`${o}-helper`,z=[s&&l?b:null,y?w:null].filter(Boolean).join(" ")||void 0,f={id:o,name:j,value:a,onChange:h=>n==null?void 0:n(h.target.value,h),placeholder:V,required:x||void 0,readOnly:E||void 0,"aria-invalid":s||void 0,"aria-required":x||void 0,"aria-readonly":E||void 0,"aria-describedby":z,"aria-errormessage":s&&l?b:void 0,className:`textbox-input${s?" is-invalid":""}`};return r.createElement("div",{className:"textbox-container"},e&&r.createElement("label",{htmlFor:o,className:"textbox-label"},e,x&&r.createElement("span",{"aria-hidden":"true",className:"textbox-required"},"*")),t?r.createElement("textarea",{rows:F||4,"aria-multiline":"true",...f}):r.createElement("input",{type:P||"text",...f}),y&&!s&&r.createElement("div",{id:w,className:"textbox-helper"},y),s&&l&&r.createElement("div",{id:b,role:"alert",className:"textbox-error"},l))};T.__docgenInfo={description:"",methods:[],displayName:"Textbox",props:{label:{required:!1,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(next: string, event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void",signature:{arguments:[{type:{name:"string"},name:"next"},{type:{name:"ReactChangeEvent",raw:"React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>",elements:[{name:"union",raw:"HTMLInputElement | HTMLTextAreaElement",elements:[{name:"HTMLInputElement"},{name:"HTMLTextAreaElement"}]}]},name:"event"}],return:{name:"void"}}},description:""},multiline:{required:!1,tsType:{name:"boolean"},description:""},rows:{required:!1,tsType:{name:"number"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},required:{required:!1,tsType:{name:"boolean"},description:""},readOnly:{required:!1,tsType:{name:"boolean"},description:""},invalid:{required:!1,tsType:{name:"boolean"},description:""},errorMessage:{required:!1,tsType:{name:"string"},description:""},helperText:{required:!1,tsType:{name:"string"},description:""},id:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},type:{required:!1,tsType:{name:"string"},description:""}}};const W={title:"Components/Textbox",component:T,tags:["autodocs"]},i=e=>{const[a,n]=$.useState(e.value??"");return r.createElement(T,{...e,value:a,onChange:n})},c={render:i,args:{label:"Full name",placeholder:"Jane Doe"},play:async({canvasElement:e,step:a})=>{const t=g(e).getByRole("textbox");await a("Typing updates the value",async()=>{await G.type(t,"Jane"),await v(t).toHaveValue("Jane")})}},u={render:i,args:{label:"Bio",multiline:!0,rows:4,helperText:"Tell us about yourself."},play:async({canvasElement:e,step:a})=>{const t=g(e).getByRole("textbox");await a("Multi-line textbox has aria-multiline=true",async()=>{await v(t).toHaveAttribute("aria-multiline","true")})}},d={render:i,args:{label:"Email",value:"not-an-email",invalid:!0,errorMessage:"Enter a valid email address."},play:async({canvasElement:e,step:a})=>{const t=g(e).getByRole("textbox");await a("Invalid textbox has aria-invalid=true and error referenced",async()=>{await v(t).toHaveAttribute("aria-invalid","true"),await v(t).toHaveAttribute("aria-errormessage")})}},p={render:i,args:{label:"Account ID",value:"ACCT-12345",readOnly:!0}},m={render:i,args:{label:"Username",required:!0,placeholder:"Required"}};var q,R,H;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Full name',
    placeholder: 'Jane Doe'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await step('Typing updates the value', async () => {
      await userEvent.type(input, 'Jane');
      await expect(input).toHaveValue('Jane');
    });
  }
}`,...(H=(R=c.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var I,A,L;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Bio',
    multiline: true,
    rows: 4,
    helperText: 'Tell us about yourself.'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const area = canvas.getByRole('textbox');
    await step('Multi-line textbox has aria-multiline=true', async () => {
      await expect(area).toHaveAttribute('aria-multiline', 'true');
    });
  }
}`,...(L=(A=u.parameters)==null?void 0:A.docs)==null?void 0:L.source}}};var M,B,S;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Email',
    value: 'not-an-email',
    invalid: true,
    errorMessage: 'Enter a valid email address.'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await step('Invalid textbox has aria-invalid=true and error referenced', async () => {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAttribute('aria-errormessage');
    });
  }
}`,...(S=(B=d.parameters)==null?void 0:B.docs)==null?void 0:S.source}}};var C,N,J;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Account ID',
    value: 'ACCT-12345',
    readOnly: true
  }
}`,...(J=(N=p.parameters)==null?void 0:N.docs)==null?void 0:J.source}}};var O,_,D;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Username',
    required: true,
    placeholder: 'Required'
  }
}`,...(D=(_=m.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};const X=["SingleLine","MultiLine","Invalid","ReadOnly","Required"];export{d as Invalid,u as MultiLine,p as ReadOnly,m as Required,c as SingleLine,X as __namedExportsOrder,W as default};
