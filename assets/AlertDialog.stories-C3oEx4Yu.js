import{r as d,R as a}from"./index-BXjX_wEA.js";import{within as B,userEvent as u,screen as i,expect as r}from"./index-DgAF9SIF.js";const g=({isOpen:e,title:t,message:n,onClose:o})=>{const m=d.useRef(null);return d.useEffect(()=>{var s;e&&((s=m.current)==null||s.focus())},[e]),d.useEffect(()=>{if(!e)return;const s=p=>{p.key==="Escape"&&(p.stopPropagation(),o())};return document.addEventListener("keydown",s),()=>document.removeEventListener("keydown",s)},[e,o]),e?a.createElement("div",{className:"dialog-overlay",role:"alertdialog","aria-modal":"true","aria-labelledby":"dialogTitle","aria-describedby":"dialogDesc",tabIndex:-1,ref:m},a.createElement("div",{className:"dialog-content"},a.createElement("h2",{id:"dialogTitle"},t),a.createElement("p",{id:"dialogDesc"},n),a.createElement("button",{onClick:o},"Close"))):null};g.__docgenInfo={description:"",methods:[],displayName:"AlertDialog",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:""},title:{required:!0,tsType:{name:"string"},description:""},message:{required:!0,tsType:{name:"string"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const T={title:"Components/AlertDialog",component:g,tags:["autodocs"]},h=e=>{const[t,n]=d.useState(e.isOpen??!1);return a.createElement(a.Fragment,null,a.createElement("button",{onClick:()=>n(!0)},"Open alert dialog"),a.createElement(g,{...e,isOpen:t,onClose:()=>n(!1)}))},l={render:h,args:{title:"Confirm action",message:"Are you sure you want to continue? This action cannot be undone."},play:async({canvasElement:e,step:t})=>{const n=B(e);await t("Trigger button opens the alert dialog",async()=>{await u.click(n.getByRole("button",{name:"Open alert dialog"}));const o=await i.findByRole("alertdialog");await r(o).toHaveAttribute("aria-modal","true"),await r(o).toHaveAttribute("aria-labelledby","dialogTitle")}),await t("Close button dismisses the dialog",async()=>{await u.click(i.getByRole("button",{name:"Close"})),await r(i.queryByRole("alertdialog")).not.toBeInTheDocument()})}},c={render:h,args:{isOpen:!0,title:"Session expired",message:"Your session has expired. Please sign in again."},play:async({step:e})=>{await e("Dialog is present with correct ARIA",async()=>{const t=i.getByRole("alertdialog");await r(t).toHaveAttribute("aria-modal","true"),await r(t).toHaveAttribute("aria-describedby","dialogDesc")}),await e("Close button dismisses the dialog",async()=>{await u.click(i.getByRole("button",{name:"Close"})),await r(i.queryByRole("alertdialog")).not.toBeInTheDocument()})}};var y,b,w;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: Template,
  args: {
    title: 'Confirm action',
    message: 'Are you sure you want to continue? This action cannot be undone.'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Trigger button opens the alert dialog', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Open alert dialog'
      }));
      const dialog = await screen.findByRole('alertdialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'dialogTitle');
    });
    await step('Close button dismisses the dialog', async () => {
      await userEvent.click(screen.getByRole('button', {
        name: 'Close'
      }));
      await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  }
}`,...(w=(b=l.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var f,v,E;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: Template,
  args: {
    isOpen: true,
    title: 'Session expired',
    message: 'Your session has expired. Please sign in again.'
  },
  play: async ({
    step
  }) => {
    await step('Dialog is present with correct ARIA', async () => {
      const dialog = screen.getByRole('alertdialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-describedby', 'dialogDesc');
    });
    await step('Close button dismisses the dialog', async () => {
      await userEvent.click(screen.getByRole('button', {
        name: 'Close'
      }));
      await expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  }
}`,...(E=(v=c.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};const A=["Default","OpenByDefault"];export{l as Default,c as OpenByDefault,A as __namedExportsOrder,T as default};
