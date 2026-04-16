import{r as y,R as x}from"./index-BXjX_wEA.js";import{within as q,expect as R,userEvent as D}from"./index-DgAF9SIF.js";const C=(m,n,i=1,b=null,a=[])=>(m.forEach((c,F)=>{var g,p;const T={id:c.id,label:c.label,level:i,parentId:b,hasChildren:!!((g=c.children)!=null&&g.length),posinset:F+1,setsize:m.length,node:c};a.push(T),(p=c.children)!=null&&p.length&&n.has(c.id)&&C(c.children,n,i+1,c.id,a)}),a),L=({label:m,nodes:n,onSelect:i,defaultExpanded:b})=>{const[a,c]=y.useState(()=>new Set(b??[])),[F,T]=y.useState(null),[g,p]=y.useState(()=>{var t;return(t=n[0])==null?void 0:t.id}),I=y.useRef({}),d=y.useMemo(()=>C(n,a),[n,a]),P=d.findIndex(t=>t.id===g);d[P];const f=t=>{var e;const s=d[t];s&&(p(s.id),(e=I.current[s.id])==null||e.focus())},v=(t,s)=>{c(e=>{const r=new Set(e);return s===!0?r.add(t):s===!1||r.has(t)?r.delete(t):r.add(t),r})},j=t=>{T(t),i==null||i(t)},S=t=>{const s=t.currentTarget.dataset.itemid,e=d.find(u=>u.id===s);if(!e)return;const r=d.indexOf(e),{id:o,hasChildren:l,parentId:A,level:E}=e,w=a.has(o);let h=!0;switch(t.key){case"ArrowDown":f(r+1);break;case"ArrowUp":f(r-1);break;case"ArrowRight":l&&!w?v(o,!0):l&&w&&f(r+1);break;case"ArrowLeft":if(l&&w)v(o,!1);else if(E>1&&A!==null){const u=d.findIndex(V=>V.id===A);u>=0&&f(u)}break;case"Home":f(0);break;case"End":f(d.length-1);break;case"Enter":case" ":l&&v(o),j(o);break;default:h=!1}h&&t.preventDefault()},B=(t,s=1)=>x.createElement("ul",{role:s===1?"tree":"group","aria-label":s===1?m:void 0,className:s===1?"tree":"tree-group"},t.map((e,r)=>{var w;const o=!!((w=e.children)!=null&&w.length),l=a.has(e.id),A=g===e.id,E=F===e.id;return x.createElement("li",{key:e.id,ref:h=>I.current[e.id]=h,role:"treeitem","data-itemid":e.id,"aria-level":s,"aria-posinset":r+1,"aria-setsize":t.length,"aria-expanded":o?l:void 0,"aria-selected":E,tabIndex:A?0:-1,className:`treeitem${E?" is-selected":""}`,onKeyDown:S,onFocus:()=>p(e.id)},x.createElement("span",{className:"treeitem-label",onClick:h=>{var u;h.stopPropagation(),p(e.id),(u=I.current[e.id])==null||u.focus(),j(e.id),o&&v(e.id)}},o&&x.createElement("span",{className:"treeitem-chevron","aria-hidden":"true"},l?"▾":"▸"),!o&&x.createElement("span",{className:"treeitem-bullet","aria-hidden":"true"}),e.label),o&&l&&B(e.children,s+1))}));return B(n)};L.__docgenInfo={description:"",methods:[],displayName:"TreeView",props:{label:{required:!0,tsType:{name:"string"},description:""},nodes:{required:!0,tsType:{name:"Array",elements:[{name:"TreeNode"}],raw:"TreeNode[]"},description:""},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},defaultExpanded:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""}}};const K={title:"Components/TreeView",component:L,tags:["autodocs"]},O=[{id:"src",label:"src",children:[{id:"components",label:"components",children:[{id:"button",label:"Button.jsx"},{id:"modal",label:"ModalDialog.jsx"}]},{id:"index",label:"index.js"}]},{id:"tests",label:"__tests__",children:[{id:"button-test",label:"button.test.js"},{id:"modal-test",label:"modalDialog.test.js"}]},{id:"readme",label:"README.md"}],k={args:{label:"Project files",nodes:O,defaultExpanded:["src"]},play:async({canvasElement:m,step:n})=>{const i=q(m),b=i.getByRole("tree");await R(b).toHaveAttribute("aria-label","Project files"),await n("First treeitem is focusable",async()=>{const a=i.getAllByRole("treeitem");a[0].focus(),await R(a[0]).toHaveFocus()}),await n("ArrowRight on expanded parent moves focus to first child",async()=>{await D.keyboard("{ArrowRight}");const a=i.getAllByRole("treeitem");await R(a[1]).toHaveFocus()}),await n("ArrowLeft on child focuses parent",async()=>{await D.keyboard("{ArrowLeft}");const a=i.getAllByRole("treeitem");await R(a[0]).toHaveFocus()})}};var H,N,_;k.parameters={...k.parameters,docs:{...(H=k.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: 'Project files',
    nodes,
    defaultExpanded: ['src']
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole('tree');
    await expect(tree).toHaveAttribute('aria-label', 'Project files');
    await step('First treeitem is focusable', async () => {
      const items = canvas.getAllByRole('treeitem');
      items[0].focus();
      await expect(items[0]).toHaveFocus();
    });
    await step('ArrowRight on expanded parent moves focus to first child', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const items = canvas.getAllByRole('treeitem');
      await expect(items[1]).toHaveFocus();
    });
    await step('ArrowLeft on child focuses parent', async () => {
      await userEvent.keyboard('{ArrowLeft}');
      const items = canvas.getAllByRole('treeitem');
      await expect(items[0]).toHaveFocus();
    });
  }
}`,...(_=(N=k.parameters)==null?void 0:N.docs)==null?void 0:_.source}}};const U=["Default"];export{k as Default,U as __namedExportsOrder,K as default};
