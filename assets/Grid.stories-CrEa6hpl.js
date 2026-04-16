import{r as x,R as c}from"./index-BXjX_wEA.js";import{within as T,expect as d,userEvent as E}from"./index-DgAF9SIF.js";const F=({label:m,showCaption:o=!1,columns:s,rows:r,idPrefix:g})=>{const p=r.length,u=s.length,[v,y]=x.useState({row:0,col:0}),h=x.useRef({}),f=g||"grid",R=`${f}-caption`,n=(t,e)=>{var l;const a=Math.max(0,Math.min(p,t)),i=Math.max(0,Math.min(u-1,e));y({row:a,col:i}),(l=h.current[`${a}:${i}`])==null||l.focus()},A=(t,e,a)=>{let i=!0;switch(t.key){case"ArrowRight":n(e,a+1);break;case"ArrowLeft":n(e,a-1);break;case"ArrowDown":n(e+1,a);break;case"ArrowUp":n(e-1,a);break;case"Home":t.ctrlKey||t.metaKey?n(0,0):n(e,0);break;case"End":t.ctrlKey||t.metaKey?n(p,u-1):n(e,u-1);break;case"PageDown":n(e+5,a);break;case"PageUp":n(e-5,a);break;default:i=!1}i&&t.preventDefault()},k=(t,e)=>t===v.row&&e===v.col?0:-1;return c.createElement("div",{className:"grid-wrapper"},o&&c.createElement("div",{id:R,className:"grid-caption"},m),c.createElement("div",{role:"grid","aria-label":o?void 0:m,"aria-labelledby":o?R:void 0,"aria-rowcount":p+1,"aria-colcount":u,className:"grid"},c.createElement("div",{role:"row","aria-rowindex":1,className:"grid-row grid-header-row"},s.map((t,e)=>c.createElement("div",{key:t.key,ref:a=>h.current[`0:${e}`]=a,id:`${f}-head-${e}`,role:"columnheader","aria-colindex":e+1,className:"grid-cell grid-columnheader",tabIndex:k(0,e),onKeyDown:a=>A(a,0,e),onFocus:()=>y({row:0,col:e})},t.label))),r.map((t,e)=>{const a=e+1;return c.createElement("div",{key:t.id??e,role:"row","aria-rowindex":a+1,className:"grid-row"},s.map((i,l)=>c.createElement("div",{key:i.key,ref:b=>h.current[`${a}:${l}`]=b,role:"gridcell","aria-colindex":l+1,className:"grid-cell",tabIndex:k(a,l),onKeyDown:b=>A(b,a,l),onFocus:()=>y({row:a,col:l})},t[i.key])))})))};F.__docgenInfo={description:"",methods:[],displayName:"Grid",props:{label:{required:!0,tsType:{name:"string"},description:"The accessible name for the grid. When `showCaption` is true this also\n renders as a visible caption above the grid and is referenced via\n `aria-labelledby` (preferred). Otherwise it's applied as `aria-label`."},showCaption:{required:!1,tsType:{name:"boolean"},description:"When true, `label` is rendered as a visible caption element above the\n grid and the grid references it via `aria-labelledby`. Default: false.",defaultValue:{value:"false",computed:!1}},columns:{required:!0,tsType:{name:"Array",elements:[{name:"GridColumn"}],raw:"GridColumn[]"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"Record",elements:[{name:"string"},{name:"union",raw:"React.ReactNode | string | number",elements:[{name:"ReactReactNode",raw:"React.ReactNode"},{name:"string"},{name:"number"}]}],raw:"Record<string, React.ReactNode | string | number>"}],raw:"Record<string, React.ReactNode | string | number>[]"},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""}}};const G={title:"Components/Grid",component:F,tags:["autodocs"]},N=[{key:"name",label:"Name"},{key:"role",label:"Role"},{key:"city",label:"City"}],D=[{id:1,name:"Ada Lovelace",role:"Mathematician",city:"London"},{id:2,name:"Alan Turing",role:"Cryptanalyst",city:"Manchester"},{id:3,name:"Grace Hopper",role:"Computer Scientist",city:"New York"},{id:4,name:"Margaret Hamilton",role:"Software Engineer",city:"Boston"}],w={args:{label:"Notable engineers",showCaption:!0,columns:N,rows:D},play:async({canvasElement:m,step:o})=>{const s=T(m);await o("Container has role=grid with row/col counts",async()=>{const r=s.getByRole("grid");await d(r).toHaveAttribute("aria-rowcount",String(D.length+1)),await d(r).toHaveAttribute("aria-colcount",String(N.length))}),await o("First header cell is focusable",async()=>{const r=s.getAllByRole("columnheader");r[0].focus(),await d(r[0]).toHaveFocus()}),await o("ArrowRight moves focus to next cell",async()=>{await E.keyboard("{ArrowRight}");const r=s.getAllByRole("columnheader");await d(r[1]).toHaveFocus()}),await o("ArrowDown moves into data rows",async()=>{await E.keyboard("{ArrowDown}");const r=s.getAllByRole("gridcell");await d(r.some(g=>g===document.activeElement)).toBe(!0)})}};var B,C,H;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: 'Notable engineers',
    showCaption: true,
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
}`,...(H=(C=w.parameters)==null?void 0:C.docs)==null?void 0:H.source}}};const K=["Default"];export{w as Default,K as __namedExportsOrder,G as default};
