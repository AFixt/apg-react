import{R as o,r as x}from"./index-BXjX_wEA.js";import{within as I,expect as l,userEvent as u}from"./index-DgAF9SIF.js";const w=({items:r,toggleItem:a,openIndex:s})=>{const e=(n,t)=>{var y;const i=r.length;let d=t;switch(n.key){case"ArrowDown":d=(t+1)%i;break;case"ArrowUp":d=(t-1+i)%i;break;case"Home":d=0;break;case"End":d=i-1;break;default:return}(y=document.getElementById(`accordion-header-${d}`))==null||y.focus()};return o.createElement("div",{className:"accordion"},r.map((n,t)=>o.createElement("div",{key:t},o.createElement("h2",null,o.createElement("button",{id:`accordion-header-${t}`,className:"accordion-header",onClick:()=>a(t),onKeyDown:i=>e(i,t),"aria-expanded":s===t,"aria-controls":`panel-${t}`},o.createElement("span",{className:"accordion-title"},n.title),o.createElement("span",{className:"accordion-chevron","aria-hidden":"true"}))),o.createElement("div",{id:`panel-${t}`,className:`accordion-body ${s===t?"open":""}`,role:"region","aria-labelledby":`accordion-header-${t}`},n.content))))};w.__docgenInfo={description:"",methods:[],displayName:"Accordion",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"AccordionItem"}],raw:"AccordionItem[]"},description:""},openIndex:{required:!0,tsType:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}]},description:""},toggleItem:{required:!0,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""}}};const R={title:"Components/Accordion",component:w,tags:["autodocs"]},c=[{title:"What is APG-React?",content:"A library of accessible React components implementing WAI-ARIA Authoring Practices Guide patterns."},{title:"How do I use it?",content:"Install from npm, import the components you need, and include the styles."},{title:"Is it accessible?",content:"Yes — every component implements the full keyboard and ARIA contract from the APG."}],E=r=>{const[a,s]=x.useState(r.openIndex??null),e=n=>s(a===n?null:n);return o.createElement(w,{...r,openIndex:a,toggleItem:e})},m={render:E,args:{items:c},play:async({canvasElement:r,step:a})=>{const s=I(r),e=s.getByRole("button",{name:c[0].title});await a("Initially collapsed",async()=>{await l(e).toHaveAttribute("aria-expanded","false")}),await a("Click expands the first panel",async()=>{await u.click(e),await l(e).toHaveAttribute("aria-expanded","true")}),await a("ArrowDown moves focus to the next header",async()=>{e.focus(),await u.keyboard("{ArrowDown}");const n=s.getByRole("button",{name:c[1].title});await l(n).toHaveFocus()})}},p={render:E,args:{items:c,openIndex:0},play:async({canvasElement:r,step:a})=>{const s=I(r),e=s.getByRole("button",{name:c[0].title});await a("First panel renders expanded",async()=>{await l(e).toHaveAttribute("aria-expanded","true")}),await a("Click collapses the open panel",async()=>{await u.click(e),await l(e).toHaveAttribute("aria-expanded","false")}),await a("End jumps focus to last header",async()=>{e.focus(),await u.keyboard("{End}");const n=s.getByRole("button",{name:c[c.length-1].title});await l(n).toHaveFocus()})}};var f,v,b;m.parameters={...m.parameters,docs:{...(f=m.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: Template,
  args: {
    items: sampleItems
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const firstHeader = canvas.getByRole('button', {
      name: sampleItems[0].title
    });
    await step('Initially collapsed', async () => {
      await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
    });
    await step('Click expands the first panel', async () => {
      await userEvent.click(firstHeader);
      await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    });
    await step('ArrowDown moves focus to the next header', async () => {
      firstHeader.focus();
      await userEvent.keyboard('{ArrowDown}');
      const secondHeader = canvas.getByRole('button', {
        name: sampleItems[1].title
      });
      await expect(secondHeader).toHaveFocus();
    });
  }
}`,...(b=(v=m.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var h,A,g;p.parameters={...p.parameters,docs:{...(h=p.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: Template,
  args: {
    items: sampleItems,
    openIndex: 0
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', {
      name: sampleItems[0].title
    });
    await step('First panel renders expanded', async () => {
      await expect(first).toHaveAttribute('aria-expanded', 'true');
    });
    await step('Click collapses the open panel', async () => {
      await userEvent.click(first);
      await expect(first).toHaveAttribute('aria-expanded', 'false');
    });
    await step('End jumps focus to last header', async () => {
      first.focus();
      await userEvent.keyboard('{End}');
      const last = canvas.getByRole('button', {
        name: sampleItems[sampleItems.length - 1].title
      });
      await expect(last).toHaveFocus();
    });
  }
}`,...(g=(A=p.parameters)==null?void 0:A.docs)==null?void 0:g.source}}};const B=["Default","FirstOpen"];export{m as Default,p as FirstOpen,B as __namedExportsOrder,R as default};
