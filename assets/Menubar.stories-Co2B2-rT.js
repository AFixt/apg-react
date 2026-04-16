import{r as u,R as w}from"./index-BXjX_wEA.js";import{within as k,expect as d,userEvent as A}from"./index-DgAF9SIF.js";const H=({label:g,menus:r})=>{const[c,i]=u.useState(0),[s,m]=u.useState(null),[f,b]=u.useState(0),y=u.useRef([]),E=u.useRef({});u.useEffect(()=>{var t,e;s===null?(t=y.current[c])==null||t.focus():(e=E.current[`${s}:${f}`])==null||e.focus()},[s,c,f]);const p=(t,e)=>{i(t),m(t),b(e)},v=(t=!0)=>{var e;m(null),t&&((e=y.current[c])==null||e.focus())},R=(t,e)=>{var a,n;(n=(a=r[t].items[e]).onSelect)==null||n.call(a),v(!0)},M=t=>{const e=r.length,a=(c+t+e)%e,n=s!==null;i(a),n?p(a,0):m(null)},F=(t,e)=>{let a=!0;switch(t.key){case"ArrowLeft":M(-1);break;case"ArrowRight":M(1);break;case"ArrowDown":case"Enter":case" ":p(e,0);break;case"ArrowUp":p(e,r[e].items.length-1);break;case"Home":i(0);break;case"End":i(r.length-1);break;default:a=!1}a&&t.preventDefault()},z=(t,e,a)=>{const n=r[e].items.length-1;let o=!0;switch(t.key){case"ArrowDown":b(a===n?0:a+1);break;case"ArrowUp":b(a===0?n:a-1);break;case"Home":b(0);break;case"End":b(n);break;case"Enter":case" ":R(e,a);break;case"Escape":v(!0);break;case"ArrowLeft":{const l=(e-1+r.length)%r.length;p(l,0);break}case"ArrowRight":{const l=(e+1)%r.length;p(l,0);break}case"Tab":m(null),o=!1;break;default:o=!1}o&&t.preventDefault()};return u.useEffect(()=>{if(s===null)return;const t=e=>{const a=y.current.some(o=>o==null?void 0:o.contains(e.target)),n=Object.values(E.current).some(o=>o==null?void 0:o.contains(e.target));!a&&!n&&v(!1)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[s]),w.createElement("div",{role:"menubar","aria-label":g,"aria-orientation":"horizontal",className:"menubar"},r.map((t,e)=>{const a=s===e;return w.createElement("div",{key:t.id,className:"menubar-group"},w.createElement("button",{ref:n=>y.current[e]=n,type:"button",role:"menuitem","aria-haspopup":"menu","aria-expanded":a,tabIndex:e===c?0:-1,className:`menubar-item${a?" is-open":""}`,onClick:()=>a?v(!1):p(e,0),onKeyDown:n=>F(n,e),onFocus:()=>i(e)},t.label),a&&w.createElement("ul",{role:"menu","aria-label":t.label,className:"menubar-menu"},t.items.map((n,o)=>w.createElement("li",{key:n.id,role:"none"},w.createElement("button",{ref:l=>E.current[`${e}:${o}`]=l,type:"button",role:"menuitem",tabIndex:o===f?0:-1,className:"menubar-menuitem",onClick:()=>R(e,o),onKeyDown:l=>z(l,e,o),onFocus:()=>b(o)},n.label)))))}))};H.__docgenInfo={description:"",methods:[],displayName:"Menubar",props:{label:{required:!0,tsType:{name:"string"},description:""},menus:{required:!0,tsType:{name:"Array",elements:[{name:"MenubarMenu"}],raw:"MenubarMenu[]"},description:""}}};const T={title:"Components/Menubar",component:H,tags:["autodocs"]},N=[{id:"file",label:"File",items:[{id:"new",label:"New",onSelect:()=>{}},{id:"open",label:"Open…",onSelect:()=>{}},{id:"save",label:"Save",onSelect:()=>{}}]},{id:"edit",label:"Edit",items:[{id:"undo",label:"Undo",onSelect:()=>{}},{id:"redo",label:"Redo",onSelect:()=>{}},{id:"cut",label:"Cut",onSelect:()=>{}},{id:"copy",label:"Copy",onSelect:()=>{}},{id:"paste",label:"Paste",onSelect:()=>{}}]},{id:"view",label:"View",items:[{id:"zoom-in",label:"Zoom in",onSelect:()=>{}},{id:"zoom-out",label:"Zoom out",onSelect:()=>{}}]}],h={args:{label:"Main menu",menus:N},play:async({canvasElement:g,step:r})=>{const c=k(g),i=c.getByRole("menubar"),s=k(i).getAllByRole("menuitem");await r("Menubar has role=menubar and aria-orientation=horizontal",async()=>{await d(i).toHaveAttribute("aria-orientation","horizontal")}),await r("ArrowRight cycles among menubar items",async()=>{s[0].focus(),await A.keyboard("{ArrowRight}"),await d(s[1]).toHaveFocus()}),await r("ArrowDown opens submenu and focuses first item",async()=>{await A.keyboard("{ArrowDown}"),await d(s[1]).toHaveAttribute("aria-expanded","true");const m=c.getByRole("menu"),f=k(m).getAllByRole("menuitem")[0];await d(f).toHaveFocus()}),await r("Escape closes submenu and restores focus to menubar item",async()=>{await A.keyboard("{Escape}"),await d(c.queryByRole("menu")).not.toBeInTheDocument(),await d(s[1]).toHaveFocus()})}};var S,D,B;h.parameters={...h.parameters,docs:{...(S=h.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: 'Main menu',
    menus
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('menubar');
    const items = within(bar).getAllByRole('menuitem');
    await step('Menubar has role=menubar and aria-orientation=horizontal', async () => {
      await expect(bar).toHaveAttribute('aria-orientation', 'horizontal');
    });
    await step('ArrowRight cycles among menubar items', async () => {
      items[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(items[1]).toHaveFocus();
    });
    await step('ArrowDown opens submenu and focuses first item', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(items[1]).toHaveAttribute('aria-expanded', 'true');
      const menu = canvas.getByRole('menu');
      const firstItem = within(menu).getAllByRole('menuitem')[0];
      await expect(firstItem).toHaveFocus();
    });
    await step('Escape closes submenu and restores focus to menubar item', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
      await expect(items[1]).toHaveFocus();
    });
  }
}`,...(B=(D=h.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};const _=["Default"];export{h as Default,_ as __namedExportsOrder,T as default};
