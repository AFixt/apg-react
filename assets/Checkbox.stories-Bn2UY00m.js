import{r as l,R as g}from"./index-BXjX_wEA.js";import{within as k,expect as t,userEvent as n}from"./index-DgAF9SIF.js";import{C}from"./Checkbox-tNfICqWO.js";const f={title:"Components/Checkbox",component:C,tags:["autodocs"]},h=c=>{const a=c.checked===void 0?!1:c.checked,[s,e]=l.useState(a);return l.useEffect(()=>{e(c.checked===void 0?!1:c.checked)},[c.checked]),g.createElement(C,{...c,checked:s,onChange:e})},o={render:h,args:{label:"Subscribe to newsletter",checked:!1},play:async({canvasElement:c,step:a})=>{const e=k(c).getByRole("checkbox");await a("Starts unchecked",async()=>{await t(e).not.toBeChecked()}),await a("Click toggles to checked",async()=>{await n.click(e),await t(e).toBeChecked()}),await a("Click again restores unchecked state (matches story name)",async()=>{await n.click(e),await t(e).not.toBeChecked()})}},r={render:h,args:{label:"I accept the terms",checked:!0},play:async({canvasElement:c,step:a})=>{const e=k(c).getByRole("checkbox");await a("Starts checked",async()=>{await t(e).toBeChecked()}),await a("Click toggles to unchecked",async()=>{await n.click(e),await t(e).not.toBeChecked()}),await a("Click again restores checked state (matches story name)",async()=>{await n.click(e),await t(e).toBeChecked()})}},i={render:h,args:{label:"Select all",checked:null,isTriState:!0},play:async({canvasElement:c,step:a})=>{const e=k(c).getByRole("checkbox");await a("Starts in mixed state",async()=>{await t(e).toHaveAttribute("aria-checked","mixed"),await t(e.indeterminate).toBe(!0)}),await a("Click advances tri-state",async()=>{await n.click(e),await t(e).toHaveAttribute("aria-checked","true")})}};var d,w,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Subscribe to newsletter',
    checked: false
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await step('Starts unchecked', async () => {
      await expect(checkbox).not.toBeChecked();
    });
    await step('Click toggles to checked', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });
    await step('Click again restores unchecked state (matches story name)', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });
  }
}`,...(p=(w=o.parameters)==null?void 0:w.docs)==null?void 0:p.source}}};var m,x,b;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'I accept the terms',
    checked: true
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await step('Starts checked', async () => {
      await expect(checkbox).toBeChecked();
    });
    await step('Click toggles to unchecked', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });
    await step('Click again restores checked state (matches story name)', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });
  }
}`,...(b=(x=r.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var u,y,v;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: Template,
  args: {
    label: 'Select all',
    checked: null,
    isTriState: true
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await step('Starts in mixed state', async () => {
      await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      await expect(checkbox.indeterminate).toBe(true);
    });
    await step('Click advances tri-state', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  }
}`,...(v=(y=i.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const R=["Unchecked","Checked","TriState"];export{r as Checked,i as TriState,o as Unchecked,R as __namedExportsOrder,f as default};
