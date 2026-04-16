import{r,R as p}from"./index-BXjX_wEA.js";import{within as v,userEvent as d,expect as i}from"./index-DgAF9SIF.js";import{C as k}from"./Checkbox-tNfICqWO.js";const C=({items:s,label:o})=>{const t=`checkbox-group-label-${r.useId()}`,[e,n]=r.useState(new Array(s.length).fill(!1)),[h,w]=r.useState(!1);r.useEffect(()=>{const c=e.every(Boolean),a=e.some(Boolean);w(c?!0:a?null:!1)},[e]);const f=()=>{n(h===!0?e.map(()=>!1):e.map(()=>!0))},g=c=>{n(e.map((a,y)=>y===c?!a:a))};return p.createElement("div",{className:"checkbox-group",role:"group","aria-labelledby":t},p.createElement("h3",{id:t},o),p.createElement(k,{label:"All",checked:h,onChange:f,isTriState:!0}),s.map((c,a)=>p.createElement(k,{key:c.id,label:c.label,checked:e[a],onChange:()=>g(a)})))};C.__docgenInfo={description:"",methods:[],displayName:"CheckboxGroup",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"CheckboxGroupItem"}],raw:"CheckboxGroupItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""}}};const G={title:"Components/CheckboxGroup",component:C,tags:["autodocs"]},m={args:{label:"Notification preferences",items:[{id:"1",label:"Email notifications"},{id:"2",label:"SMS notifications"},{id:"3",label:"Push notifications"}]},play:async({canvasElement:s,step:o})=>{const l=v(s),t=l.getByRole("checkbox",{name:"All"}),e=l.getByRole("checkbox",{name:"Email notifications"}),n=l.getByRole("checkbox",{name:"SMS notifications"});await o("Checking one child puts parent in mixed state",async()=>{await d.click(e),await i(t).toHaveAttribute("aria-checked","mixed"),await i(t.indeterminate).toBe(!0)}),await o("Clicking parent in mixed state checks all children",async()=>{await d.click(t),await i(e).toBeChecked(),await i(n).toBeChecked()}),await o("Clicking parent when all checked unchecks every child",async()=>{await d.click(t),await i(e).not.toBeChecked(),await i(n).not.toBeChecked()})}};var u,b,x;m.parameters={...m.parameters,docs:{...(u=m.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(x=(b=m.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const R=["Default"];export{m as Default,R as __namedExportsOrder,G as default};
