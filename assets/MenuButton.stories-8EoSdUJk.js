import{r as l,R as m}from"./index-BXjX_wEA.js";import{within as E,expect as u,userEvent as x}from"./index-DgAF9SIF.js";const B=({label:p,items:o,idPrefix:i})=>{const[n,s]=l.useState(!1),[c,d]=l.useState(0),b=l.useRef(null),y=l.useRef([]),h=`${i||"menu"}-list`,v=e=>{s(!0),d(e)},w=(e=!0)=>{var t;s(!1),e&&((t=b.current)==null||t.focus())};l.useEffect(()=>{var e;n&&((e=y.current[c])==null||e.focus())},[n,c]);const D=e=>{switch(e.key){case"Enter":case" ":case"ArrowDown":e.preventDefault(),v(0);break;case"ArrowUp":e.preventDefault(),v(o.length-1);break}},k=e=>{var t,a;(a=(t=o[e]).onSelect)==null||a.call(t),w(!0)},I=(e,t)=>{const a=o.length-1;let r=!0;switch(e.key){case"ArrowDown":d(t===a?0:t+1);break;case"ArrowUp":d(t===0?a:t-1);break;case"Home":d(0);break;case"End":d(a);break;case"Enter":k(t);break;case"Escape":w(!0);break;case"Tab":s(!1),r=!1;break;default:r=!1}r&&e.preventDefault()};return l.useEffect(()=>{if(!n)return;const e=t=>{var a;!((a=b.current)!=null&&a.contains(t.target))&&!y.current.some(r=>r==null?void 0:r.contains(t.target))&&w(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[n]),m.createElement("div",{className:"menu-button-container"},m.createElement("button",{ref:b,type:"button",className:"menu-button","aria-haspopup":"menu","aria-expanded":n,"aria-controls":h,onClick:()=>n?w(!1):v(0),onKeyDown:D},p,m.createElement("span",{"aria-hidden":"true",className:"menu-button-caret"},"▾")),n&&m.createElement("ul",{id:h,role:"menu",className:"menu","aria-label":typeof p=="string"?p:void 0},o.map((e,t)=>m.createElement("li",{key:e.id,role:"none"},m.createElement("button",{ref:a=>y.current[t]=a,role:"menuitem",type:"button",className:"menuitem",tabIndex:t===c?0:-1,onClick:()=>k(t),onKeyDown:a=>I(a,t)},e.label)))))};B.__docgenInfo={description:"",methods:[],displayName:"MenuButton",props:{label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"MenuItem"}],raw:"MenuItem[]"},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""}}};const S={title:"Components/MenuButton",component:B,tags:["autodocs"]},H=[{id:"new",label:"New document",onSelect:()=>{}},{id:"open",label:"Open…",onSelect:()=>{}},{id:"save",label:"Save",onSelect:()=>{}},{id:"export",label:"Export as PDF",onSelect:()=>{}}],f={args:{label:"Actions",items:H},play:async({canvasElement:p,step:o})=>{const i=E(p),n=i.getByRole("button",{name:/actions/i});await o("Closed state: aria-expanded=false, aria-haspopup=menu",async()=>{await u(n).toHaveAttribute("aria-expanded","false"),await u(n).toHaveAttribute("aria-haspopup","menu")}),await o("Click opens the menu and focuses first item",async()=>{await x.click(n),await u(n).toHaveAttribute("aria-expanded","true");const s=i.getByRole("menu"),c=E(s).getAllByRole("menuitem")[0];await u(c).toHaveFocus()}),await o("ArrowDown cycles to next menuitem",async()=>{await x.keyboard("{ArrowDown}");const s=i.getByRole("menu"),c=E(s).getAllByRole("menuitem")[1];await u(c).toHaveFocus()}),await o("Escape closes the menu and returns focus to button",async()=>{await x.keyboard("{Escape}"),await u(i.queryByRole("menu")).not.toBeInTheDocument(),await u(n).toHaveFocus()})}};var R,g,A;f.parameters={...f.parameters,docs:{...(R=f.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: 'Actions',
    items
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: /actions/i
    });
    await step('Closed state: aria-expanded=false, aria-haspopup=menu', async () => {
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });
    await step('Click opens the menu and focuses first item', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      const menu = canvas.getByRole('menu');
      const firstItem = within(menu).getAllByRole('menuitem')[0];
      await expect(firstItem).toHaveFocus();
    });
    await step('ArrowDown cycles to next menuitem', async () => {
      await userEvent.keyboard('{ArrowDown}');
      const menu = canvas.getByRole('menu');
      const secondItem = within(menu).getAllByRole('menuitem')[1];
      await expect(secondItem).toHaveFocus();
    });
    await step('Escape closes the menu and returns focus to button', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
      await expect(button).toHaveFocus();
    });
  }
}`,...(A=(g=f.parameters)==null?void 0:g.docs)==null?void 0:A.source}}};const C=["Default"];export{f as Default,C as __namedExportsOrder,S as default};
