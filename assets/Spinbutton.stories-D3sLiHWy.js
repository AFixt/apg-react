import{r as y,R as o}from"./index-BXjX_wEA.js";import{within as D,userEvent as u,expect as c}from"./index-DgAF9SIF.js";const U={increaseValue:"Increase value",decreaseValue:"Decrease value"},H=({min:s,max:e,step:n=1,ariaLabel:t,ariaLabelledby:b,initialValue:h,labels:I})=>{const m={...U,...I},[r,V]=y.useState(h??s??0),[v,w]=y.useState(!1),i=a=>{a>=s&&a<=e?(V(a),w(!1)):w(!0)},R=a=>{switch(a.key){case"ArrowUp":a.preventDefault(),i(r+n);break;case"ArrowDown":a.preventDefault(),i(r-n);break;case"PageUp":a.preventDefault(),i(r+n*10);break;case"PageDown":a.preventDefault(),i(r-n*10);break;case"Home":a.preventDefault(),i(s);break;case"End":a.preventDefault(),i(e);break}},S=a=>{const d=parseInt(a.target.value,10);isNaN(d)?w(!0):i(d)};return o.createElement("div",{className:"spinbutton-container"},o.createElement("input",{type:"text",role:"spinbutton",className:v?"is-invalid":"","aria-valuenow":r,"aria-valuemin":s,"aria-valuemax":e,"aria-valuetext":String(r),"aria-label":b?void 0:t,"aria-labelledby":b,"aria-invalid":v,value:r,onChange:S,onKeyDown:R}),o.createElement("button",{type:"button",className:"spinbutton-arrow spinbutton-arrow-up","aria-label":m.increaseValue,tabIndex:-1,onClick:()=>i(r+n)},o.createElement("span",{"aria-hidden":"true"},"▲")),o.createElement("button",{type:"button",className:"spinbutton-arrow spinbutton-arrow-down","aria-label":m.decreaseValue,tabIndex:-1,onClick:()=>i(r-n)},o.createElement("span",{"aria-hidden":"true"},"▼")))};H.__docgenInfo={description:"",methods:[],displayName:"Spinbutton",props:{min:{required:!0,tsType:{name:"number"},description:""},max:{required:!0,tsType:{name:"number"},description:""},step:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},ariaLabel:{required:!1,tsType:{name:"string"},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:""},initialValue:{required:!1,tsType:{name:"number"},description:""},labels:{required:!1,tsType:{name:"SpinbuttonLabels"},description:""}}};const N={title:"Components/Spinbutton",component:H,tags:["autodocs"]},l={args:{min:0,max:10,step:1,initialValue:5,ariaLabel:"Quantity"},play:async({canvasElement:s,step:e})=>{const n=D(s),t=n.getByRole("spinbutton");t.focus(),await e("ArrowUp increments by step",async()=>{await u.keyboard("{ArrowUp}"),await c(t).toHaveAttribute("aria-valuenow","6")}),await e("ArrowDown decrements by step",async()=>{await u.keyboard("{ArrowDown}"),await c(t).toHaveAttribute("aria-valuenow","5")}),await e("Increment button bumps the value",async()=>{await u.click(n.getByRole("button",{name:"Increase value"})),await c(t).toHaveAttribute("aria-valuenow","6")})}},p={args:{min:0,max:1e3,step:10,initialValue:100,ariaLabel:"Amount"},play:async({canvasElement:s,step:e})=>{const t=D(s).getByRole("spinbutton");t.focus(),await e("ArrowUp increments by step (10)",async()=>{await u.keyboard("{ArrowUp}"),await c(t).toHaveAttribute("aria-valuenow","110")}),await e("Home jumps to min",async()=>{await u.keyboard("{Home}"),await c(t).toHaveAttribute("aria-valuenow","0")}),await e("End jumps to max",async()=>{await u.keyboard("{End}"),await c(t).toHaveAttribute("aria-valuenow","1000")})}};var f,A,g;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 10,
    step: 1,
    initialValue: 5,
    ariaLabel: 'Quantity'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    input.focus();
    await step('ArrowUp increments by step', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(input).toHaveAttribute('aria-valuenow', '6');
    });
    await step('ArrowDown decrements by step', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(input).toHaveAttribute('aria-valuenow', '5');
    });
    await step('Increment button bumps the value', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Increase value'
      }));
      await expect(input).toHaveAttribute('aria-valuenow', '6');
    });
  }
}`,...(g=(A=l.parameters)==null?void 0:A.docs)==null?void 0:g.source}}};var E,k,x;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 1000,
    step: 10,
    initialValue: 100,
    ariaLabel: 'Amount'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton');
    input.focus();
    await step('ArrowUp increments by step (10)', async () => {
      await userEvent.keyboard('{ArrowUp}');
      await expect(input).toHaveAttribute('aria-valuenow', '110');
    });
    await step('Home jumps to min', async () => {
      await userEvent.keyboard('{Home}');
      await expect(input).toHaveAttribute('aria-valuenow', '0');
    });
    await step('End jumps to max', async () => {
      await userEvent.keyboard('{End}');
      await expect(input).toHaveAttribute('aria-valuenow', '1000');
    });
  }
}`,...(x=(k=p.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};const T=["Default","LargeRange"];export{l as Default,p as LargeRange,T as __namedExportsOrder,N as default};
