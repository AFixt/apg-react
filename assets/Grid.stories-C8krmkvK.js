import{r as A,R as l}from"./index-BXjX_wEA.js";import{within as F,expect as d,userEvent as k}from"./index-DgAF9SIF.js";const H=({caption:m,columns:n,rows:i,label:r,idPrefix:g})=>{const y=i.length,u=n.length,[v,p]=A.useState({row:0,col:0}),h=A.useRef({}),C=g||"grid",o=(t,e)=>{var c;const a=Math.max(0,Math.min(y,t)),s=Math.max(0,Math.min(u-1,e));p({row:a,col:s}),(c=h.current[`${a}:${s}`])==null||c.focus()},R=(t,e,a)=>{let s=!0;switch(t.key){case"ArrowRight":o(e,a+1);break;case"ArrowLeft":o(e,a-1);break;case"ArrowDown":o(e+1,a);break;case"ArrowUp":o(e-1,a);break;case"Home":t.ctrlKey||t.metaKey?o(0,0):o(e,0);break;case"End":t.ctrlKey||t.metaKey?o(y,u-1):o(e,u-1);break;case"PageDown":o(e+5,a);break;case"PageUp":o(e-5,a);break;default:s=!1}s&&t.preventDefault()},b=(t,e)=>t===v.row&&e===v.col?0:-1;return l.createElement("div",{className:"grid-wrapper"},m&&l.createElement("div",{className:"grid-caption"},m),l.createElement("div",{role:"grid","aria-label":r,"aria-rowcount":y+1,"aria-colcount":u,className:"grid"},l.createElement("div",{role:"row","aria-rowindex":1,className:"grid-row grid-header-row"},n.map((t,e)=>l.createElement("div",{key:t.key,ref:a=>h.current[`0:${e}`]=a,id:`${C}-head-${e}`,role:"columnheader","aria-colindex":e+1,className:"grid-cell grid-columnheader",tabIndex:b(0,e),onKeyDown:a=>R(a,0,e),onFocus:()=>p({row:0,col:e})},t.label))),i.map((t,e)=>{const a=e+1;return l.createElement("div",{key:t.id??e,role:"row","aria-rowindex":a+1,className:"grid-row"},n.map((s,c)=>l.createElement("div",{key:s.key,ref:f=>h.current[`${a}:${c}`]=f,role:"gridcell","aria-colindex":c+1,className:"grid-cell",tabIndex:b(a,c),onKeyDown:f=>R(f,a,c),onFocus:()=>p({row:a,col:c})},t[s.key])))})))};H.__docgenInfo={description:"",methods:[],displayName:"Grid",props:{caption:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn"}],raw:"GridColumn[]"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"Record",elements:[{name:"string"},{name:"union",raw:"React.ReactNode | string | number",elements:[{name:"ReactReactNode",raw:"React.ReactNode"},{name:"string"},{name:"number"}]}],raw:"Record<string, React.ReactNode | string | number>"}],raw:"Record<string, React.ReactNode | string | number>[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""}}};const G={title:"Components/Grid",component:H,tags:["autodocs"]},x=[{key:"name",label:"Name"},{key:"role",label:"Role"},{key:"city",label:"City"}],E=[{id:1,name:"Ada Lovelace",role:"Mathematician",city:"London"},{id:2,name:"Alan Turing",role:"Cryptanalyst",city:"Manchester"},{id:3,name:"Grace Hopper",role:"Computer Scientist",city:"New York"},{id:4,name:"Margaret Hamilton",role:"Software Engineer",city:"Boston"}],w={args:{label:"Notable engineers",caption:"A small sample of historical figures.",columns:x,rows:E},play:async({canvasElement:m,step:n})=>{const i=F(m);await n("Container has role=grid with row/col counts",async()=>{const r=i.getByRole("grid");await d(r).toHaveAttribute("aria-rowcount",String(E.length+1)),await d(r).toHaveAttribute("aria-colcount",String(x.length))}),await n("First header cell is focusable",async()=>{const r=i.getAllByRole("columnheader");r[0].focus(),await d(r[0]).toHaveFocus()}),await n("ArrowRight moves focus to next cell",async()=>{await k.keyboard("{ArrowRight}");const r=i.getAllByRole("columnheader");await d(r[1]).toHaveFocus()}),await n("ArrowDown moves into data rows",async()=>{await k.keyboard("{ArrowDown}");const r=i.getAllByRole("gridcell");await d(r.some(g=>g===document.activeElement)).toBe(!0)})}};var N,D,B;w.parameters={...w.parameters,docs:{...(N=w.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: 'Notable engineers',
    caption: 'A small sample of historical figures.',
    columns,
    rows
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Container has role=grid with row/col counts', async () => {
      const grid = canvas.getByRole('grid');
      await expect(grid).toHaveAttribute('aria-rowcount', String(rows.length + 1));
      await expect(grid).toHaveAttribute('aria-colcount', String(columns.length));
    });
    await step('First header cell is focusable', async () => {
      const headers = canvas.getAllByRole('columnheader');
      headers[0].focus();
      await expect(headers[0]).toHaveFocus();
    });
    await step('ArrowRight moves focus to next cell', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const headers = canvas.getAllByRole('columnheader');
      await expect(headers[1]).toHaveFocus();
    });
    await step('ArrowDown moves into data rows', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const cells = canvas.getAllByRole('gridcell');
      // focus is now in first data row, second column
      await expect(cells.some(c => c === document.activeElement)).toBe(true);
    });
  }
}`,...(B=(D=w.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};const K=["Default"];export{w as Default,K as __namedExportsOrder,G as default};
