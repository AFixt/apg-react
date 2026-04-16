import{r as m,R as r}from"./index-BXjX_wEA.js";import{within as g,userEvent as h,expect as i}from"./index-DgAF9SIF.js";import{C as d}from"./Checkbox-tNfICqWO.js";const x=({items:s,label:o})=>{const[e,a]=m.useState(new Array(s.length).fill(!1)),[n,l]=m.useState(!1);m.useEffect(()=>{const c=e.every(Boolean),t=e.some(Boolean);l(c?!0:t?null:!1)},[e]);const C=()=>{a(n===!0?e.map(()=>!1):e.map(()=>!0))},w=c=>{a(e.map((t,f)=>f===c?!t:t))};return r.createElement("div",{className:"checkbox-group",role:"group","aria-labelledby":"group-label"},r.createElement("h3",{id:"group-label"},o),r.createElement(d,{label:"All",checked:n,onChange:C,isTriState:!0}),s.map((c,t)=>r.createElement(d,{key:c.id,label:c.label,checked:e[t],onChange:()=>w(t)})))};x.__docgenInfo={description:"",methods:[],displayName:"CheckboxGroup",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"CheckboxGroupItem"}],raw:"CheckboxGroupItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""}}};const E={title:"Components/CheckboxGroup",component:x,tags:["autodocs"]},p={args:{label:"Notification preferences",items:[{id:"1",label:"Email notifications"},{id:"2",label:"SMS notifications"},{id:"3",label:"Push notifications"}]},play:async({canvasElement:s,step:o})=>{const e=g(s),a=e.getByRole("checkbox",{name:"All"}),n=e.getByRole("checkbox",{name:"Email notifications"}),l=e.getByRole("checkbox",{name:"SMS notifications"});await o("Checking one child puts parent in mixed state",async()=>{await h.click(n),await i(a).toHaveAttribute("aria-checked","mixed"),await i(a.indeterminate).toBe(!0)}),await o("Clicking parent in mixed state checks all children",async()=>{await h.click(a),await i(n).toBeChecked(),await i(l).toBeChecked()}),await o("Clicking parent when all checked unchecks every child",async()=>{await h.click(a),await i(n).not.toBeChecked(),await i(l).not.toBeChecked()})}};var k,u,b;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'Notification preferences',
    items: [{
      id: '1',
      label: 'Email notifications'
    }, {
      id: '2',
      label: 'SMS notifications'
    }, {
      id: '3',
      label: 'Push notifications'
    }]
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('checkbox', {
      name: 'All'
    });
    const email = canvas.getByRole('checkbox', {
      name: 'Email notifications'
    });
    const sms = canvas.getByRole('checkbox', {
      name: 'SMS notifications'
    });
    await step('Checking one child puts parent in mixed state', async () => {
      await userEvent.click(email);
      await expect(parent).toHaveAttribute('aria-checked', 'mixed');
      await expect(parent.indeterminate).toBe(true);
    });
    await step('Clicking parent in mixed state checks all children', async () => {
      await userEvent.click(parent);
      await expect(email).toBeChecked();
      await expect(sms).toBeChecked();
    });
    await step('Clicking parent when all checked unchecks every child', async () => {
      await userEvent.click(parent);
      await expect(email).not.toBeChecked();
      await expect(sms).not.toBeChecked();
    });
  }
}`,...(b=(u=p.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};const S=["Default"];export{p as Default,S as __namedExportsOrder,E as default};
