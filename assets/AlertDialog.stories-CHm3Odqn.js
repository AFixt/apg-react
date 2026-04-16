import{r as o,R as n}from"./index-BXjX_wEA.js";import{within as k,userEvent as p,screen as s,expect as i}from"./index-DgAF9SIF.js";const y=({isOpen:e,title:a,message:r,onClose:l})=>{const f=o.useId(),b=`alertdialog-title-${f}`,w=`alertdialog-desc-${f}`,g=o.useRef(null),m=o.useRef(null),v=o.useRef(null);o.useEffect(()=>{var t;e&&(v.current=document.activeElement,(t=m.current)==null||t.focus())},[e]);const E=()=>{const t=v.current;t&&typeof t.focus=="function"&&t.focus(),l()};return o.useEffect(()=>{if(!e)return;const t=c=>{c.key==="Escape"&&(c.stopPropagation(),E())};return document.addEventListener("keydown",t),()=>document.removeEventListener("keydown",t)},[e,l]),o.useEffect(()=>{if(!e)return;const t=c=>{var R;g.current&&!g.current.contains(c.target)&&(c.stopPropagation(),(R=m.current)==null||R.focus())};return document.addEventListener("focus",t,!0),()=>document.removeEventListener("focus",t,!0)},[e]),e?n.createElement("div",{className:"dialog-overlay",role:"alertdialog","aria-modal":"true","aria-labelledby":b,"aria-describedby":w,tabIndex:-1,ref:g},n.createElement("div",{className:"dialog-content"},n.createElement("h2",{id:b},a),n.createElement("p",{id:w},r),n.createElement("button",{ref:m,onClick:E},"Close"))):null};y.__docgenInfo={description:"",methods:[],displayName:"AlertDialog",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:""},title:{required:!0,tsType:{name:"string"},description:""},message:{required:!0,tsType:{name:"string"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const H={title:"Components/AlertDialog",component:y,tags:["autodocs"]},C=e=>{const[a,r]=o.useState(e.isOpen??!1);return n.createElement(n.Fragment,null,n.createElement("button",{onClick:()=>r(!0)},"Open alert dialog"),n.createElement(y,{...e,isOpen:a,onClose:()=>r(!1)}))},u={render:C,args:{title:"Confirm action",message:"Are you sure you want to continue? This action cannot be undone."},play:async({canvasElement:e,step:a})=>{const r=k(e);await a("Trigger button opens the alert dialog",async()=>{await p.click(r.getByRole("button",{name:"Open alert dialog"}));const l=await s.findByRole("alertdialog");await i(l).toHaveAttribute("aria-modal","true"),await i(l).toHaveAttribute("aria-labelledby","dialogTitle")}),await a("Close button dismisses the dialog",async()=>{await p.click(s.getByRole("button",{name:"Close"})),await i(s.queryByRole("alertdialog")).not.toBeInTheDocument()})}},d={render:C,args:{isOpen:!0,title:"Session expired",message:"Your session has expired. Please sign in again."},play:async({step:e})=>{await e("Dialog is present with correct ARIA",async()=>{const a=s.getByRole("alertdialog");await i(a).toHaveAttribute("aria-modal","true"),await i(a).toHaveAttribute("aria-describedby","dialogDesc")}),await e("Close button dismisses the dialog",async()=>{await p.click(s.getByRole("button",{name:"Close"})),await i(s.queryByRole("alertdialog")).not.toBeInTheDocument()})}};var h,B,A;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(A=(B=u.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var T,D,x;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(x=(D=d.parameters)==null?void 0:D.docs)==null?void 0:x.source}}};const O=["Default","OpenByDefault"];export{u as Default,d as OpenByDefault,O as __namedExportsOrder,H as default};
