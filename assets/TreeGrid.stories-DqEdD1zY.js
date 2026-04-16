import{r as y,R as v}from"./index-BXjX_wEA.js";import{within as j,expect as x,userEvent as C}from"./index-DgAF9SIF.js";const T=(m,o,l=1,i=null,n=[])=>(m.forEach((d,u)=>{var w,f;n.push({...d,level:l,parentId:i,posinset:u+1,setsize:m.length,hasChildren:!!((w=d.children)!=null&&w.length)}),(f=d.children)!=null&&f.length&&o.has(d.id)&&T(d.children,o,l+1,d.id,n)}),n),H=({label:m,columns:o,rows:l,defaultExpanded:i})=>{const[n,d]=y.useState(()=>new Set(i??[])),[u,w]=y.useState({row:0,col:0}),f=y.useRef(!1),E=y.useRef({});y.useEffect(()=>{var e;f.current&&(f.current=!1,(e=E.current[`${u.row}:${u.col}`])==null||e.focus())},[u]);const p=y.useMemo(()=>T(l,n),[l,n]),b=o.length,c=(e,r)=>{const s=Math.max(0,Math.min(p.length-1,e)),t=Math.max(0,Math.min(b-1,r));f.current=!0,w({row:s,col:t})},k=(e,r)=>{d(s=>{const t=new Set(s);return r===!0?t.add(e):r===!1||t.has(e)?t.delete(e):t.add(e),t})},K=e=>{const r=e.currentTarget.dataset,s=Number(r.row),t=Number(r.col),a=p[s];if(!a)return;const g=t===0;let h=!0;switch(e.key){case"ArrowDown":c(s+1,t);break;case"ArrowUp":c(s-1,t);break;case"ArrowRight":g&&a.hasChildren&&!n.has(a.id)?k(a.id,!0):g&&a.hasChildren&&n.has(a.id)?c(s+1,0):c(s,t+1);break;case"ArrowLeft":if(g&&a.hasChildren&&n.has(a.id))k(a.id,!1);else if(g&&a.parentId){const A=p.findIndex(N=>N.id===a.parentId);A>=0&&c(A,0)}else c(s,t-1);break;case"Home":e.ctrlKey||e.metaKey?c(0,0):c(s,0);break;case"End":e.ctrlKey||e.metaKey?c(p.length-1,b-1):c(s,b-1);break;default:h=!1}h&&e.preventDefault()};return v.createElement("div",{role:"treegrid","aria-label":m,"aria-rowcount":p.length+1,"aria-colcount":b,className:"treegrid"},v.createElement("div",{role:"row","aria-rowindex":1,className:"treegrid-row treegrid-header-row"},o.map((e,r)=>v.createElement("div",{key:e.key,role:"columnheader","aria-colindex":r+1,className:"treegrid-cell treegrid-columnheader"},e.label))),p.map((e,r)=>{const s=n.has(e.id);return v.createElement("div",{key:e.id,role:"row","aria-level":e.level,"aria-posinset":e.posinset,"aria-setsize":e.setsize,"aria-expanded":e.hasChildren?s:void 0,"aria-rowindex":r+2,className:"treegrid-row"},o.map((t,a)=>{const g=r===u.row&&a===u.col?0:-1,h=a===0;return v.createElement("div",{key:t.key,ref:A=>E.current[`${r}:${a}`]=A,role:"gridcell","aria-colindex":a+1,"data-row":r,"data-col":a,tabIndex:g,className:"treegrid-cell",style:h?{paddingLeft:`calc(${e.level-1} * 1.25rem + ${e.hasChildren?"0.25rem":"1.25rem"})`}:void 0,onKeyDown:K,onFocus:()=>w({row:r,col:a}),onClick:()=>{w({row:r,col:a}),h&&e.hasChildren&&k(e.id)}},h&&e.hasChildren&&v.createElement("span",{"aria-hidden":"true",className:"treegrid-chevron"},s?"▾":"▸"),e[t.key])}))}))};H.__docgenInfo={description:"",methods:[],displayName:"TreeGrid",props:{label:{required:!0,tsType:{name:"string"},description:""},columns:{required:!0,tsType:{name:"Array",elements:[{name:"TreeGridColumn"}],raw:"TreeGridColumn[]"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"TreeGridRow"}],raw:"TreeGridRow[]"},description:""},defaultExpanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};const L={title:"Components/TreeGrid",component:H,tags:["autodocs"]},G=[{key:"name",label:"Name"},{key:"size",label:"Size"},{key:"modified",label:"Modified"}],F=[{id:"src",name:"src",size:"—",modified:"2026-04-10",children:[{id:"index",name:"index.js",size:"1.2 KB",modified:"2026-04-11"},{id:"components",name:"components",size:"—",modified:"2026-04-12",children:[{id:"button",name:"Button.jsx",size:"3.4 KB",modified:"2026-04-13"},{id:"modal",name:"ModalDialog.jsx",size:"5.1 KB",modified:"2026-04-14"}]}]},{id:"pkg",name:"package.json",size:"2.0 KB",modified:"2026-04-09"}],R={args:{label:"Project files",columns:G,rows:F,defaultExpanded:["src"]},play:async({canvasElement:m,step:o})=>{const l=j(m);await o("Container has role=treegrid",async()=>{const i=l.getByRole("treegrid");await x(i).toHaveAttribute("aria-label","Project files")}),await o("Data rows expose aria-level / posinset / setsize",async()=>{const i=l.getAllByRole("row");await x(i[1]).toHaveAttribute("aria-level","1"),await x(i[1]).toHaveAttribute("aria-expanded","true")}),await o("ArrowDown moves focus to next row (same column)",async()=>{l.getAllByRole("gridcell")[0].focus(),await C.keyboard("{ArrowDown}");const n=l.getAllByRole("gridcell");await x(n[3]).toHaveFocus()}),await o("ArrowLeft on first cell of expanded row collapses it",async()=>{l.getAllByRole("gridcell")[0].focus(),await C.keyboard("{ArrowLeft}");const n=l.getAllByRole("row");await x(n[1]).toHaveAttribute("aria-expanded","false")})}};var B,z,D;R.parameters={...R.parameters,docs:{...(B=R.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: 'Project files',
    columns,
    rows,
    defaultExpanded: ['src']
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Container has role=treegrid', async () => {
      const grid = canvas.getByRole('treegrid');
      await expect(grid).toHaveAttribute('aria-label', 'Project files');
    });
    await step('Data rows expose aria-level / posinset / setsize', async () => {
      const allRows = canvas.getAllByRole('row');
      // allRows[0] is the header; allRows[1] is first data row (src)
      await expect(allRows[1]).toHaveAttribute('aria-level', '1');
      await expect(allRows[1]).toHaveAttribute('aria-expanded', 'true');
    });
    await step('ArrowDown moves focus to next row (same column)', async () => {
      const cells = canvas.getAllByRole('gridcell');
      cells[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      const updated = canvas.getAllByRole('gridcell');
      await expect(updated[3]).toHaveFocus();
    });
    await step('ArrowLeft on first cell of expanded row collapses it', async () => {
      const cells = canvas.getAllByRole('gridcell');
      cells[0].focus();
      await userEvent.keyboard('{ArrowLeft}');
      const allRows = canvas.getAllByRole('row');
      await expect(allRows[1]).toHaveAttribute('aria-expanded', 'false');
    });
  }
}`,...(D=(z=R.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};const S=["Default"];export{R as Default,S as __namedExportsOrder,L as default};
