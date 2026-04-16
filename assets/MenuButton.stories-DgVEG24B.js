import{r,R as m}from"./index-BXjX_wEA.js";import{within as h,expect as u,userEvent as k}from"./index-DgAF9SIF.js";const H=({label:b,items:o,idPrefix:i})=>{const s=r.useId(),l=i||`menu-${s}`,[a,f]=r.useState(!1),[y,p]=r.useState(0),v=r.useRef(null),x=r.useRef([]),R=`${l}-btn`,A=`${l}-list`,E=e=>{f(!0),p(e)},d=(e=!0)=>{var t;f(!1),e&&((t=v.current)==null||t.focus())};r.useEffect(()=>{var e;a&&((e=x.current[y])==null||e.focus())},[a,y]);const M=e=>{switch(e.key){case"Enter":case" ":case"ArrowDown":e.preventDefault(),E(0);break;case"ArrowUp":e.preventDefault(),E(o.length-1);break}},g=e=>{var t,n;(n=(t=o[e]).onSelect)==null||n.call(t),d(!0)},N=(e,t)=>{const n=o.length-1;let c=!0;switch(e.key){case"ArrowDown":p(t===n?0:t+1);break;case"ArrowUp":p(t===0?n:t-1);break;case"Home":p(0);break;case"End":p(n);break;case"Enter":g(t);break;case"Escape":d(!0);break;case"Tab":f(!1),c=!1;break;default:c=!1}c&&e.preventDefault()};return r.useEffect(()=>{if(!a)return;const e=t=>{var n;!((n=v.current)!=null&&n.contains(t.target))&&!x.current.some(c=>c==null?void 0:c.contains(t.target))&&d(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[a]),m.createElement("div",{className:"menu-button-container"},m.createElement("button",{ref:v,id:R,type:"button",className:"menu-button","aria-haspopup":"menu","aria-expanded":a,"aria-controls":A,onClick:()=>a?d(!1):E(0),onKeyDown:M},b,m.createElement("span",{"aria-hidden":"true",className:"menu-button-caret"},"▾")),a&&m.createElement("ul",{id:A,role:"menu",className:"menu","aria-labelledby":R},o.map((e,t)=>m.createElement("li",{key:e.id,role:"none"},m.createElement("button",{ref:n=>x.current[t]=n,role:"menuitem",type:"button",className:"menuitem",tabIndex:t===y?0:-1,onClick:()=>g(t),onKeyDown:n=>N(n,t)},e.label)))))};H.__docgenInfo={description:"",methods:[],displayName:"MenuButton",props:{label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"MenuItem"}],raw:"MenuItem[]"},description:""},idPrefix:{required:!1,tsType:{name:"string"},description:""}}};const T={title:"Components/MenuButton",component:H,tags:["autodocs"]},S=[{id:"new",label:"New document",onSelect:()=>{}},{id:"open",label:"Open…",onSelect:()=>{}},{id:"save",label:"Save",onSelect:()=>{}},{id:"export",label:"Export as PDF",onSelect:()=>{}}],w={args:{label:"Actions",items:S},play:async({canvasElement:b,step:o})=>{const i=h(b),s=i.getByRole("button",{name:/actions/i});await o("Closed state: aria-expanded=false, aria-haspopup=menu",async()=>{await u(s).toHaveAttribute("aria-expanded","false"),await u(s).toHaveAttribute("aria-haspopup","menu")}),await o("Click opens the menu and focuses first item",async()=>{await k.click(s),await u(s).toHaveAttribute("aria-expanded","true");const l=i.getByRole("menu"),a=h(l).getAllByRole("menuitem")[0];await u(a).toHaveFocus()}),await o("ArrowDown cycles to next menuitem",async()=>{await k.keyboard("{ArrowDown}");const l=i.getByRole("menu"),a=h(l).getAllByRole("menuitem")[1];await u(a).toHaveFocus()}),await o("Escape closes the menu and returns focus to button",async()=>{await k.keyboard("{Escape}"),await u(i.queryByRole("menu")).not.toBeInTheDocument(),await u(s).toHaveFocus()})}};var B,D,I;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(I=(D=w.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};const q=["Default"];export{w as Default,q as __namedExportsOrder,T as default};
