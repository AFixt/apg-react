import{r as o,R as n}from"./index-BXjX_wEA.js";import{within as H,userEvent as y,screen as d,expect as i}from"./index-DgAF9SIF.js";const I={closeDialog:"Close dialog"},b=({isOpen:e,onClose:a,ariaLabel:l,ariaDescribedby:u,children:L,initialFocusRef:r,labels:q})=>{const x={...I,...q},c=o.useRef(null),g=o.useRef(null),[f,w]=o.useState(!1);o.useEffect(()=>{var t;if(e){g.current=document.activeElement,(t=(r==null?void 0:r.current)||c.current)==null||t.focus();const s=requestAnimationFrame(()=>w(!0));return()=>cancelAnimationFrame(s)}w(!1)},[e,r]);const A=t=>{t.key==="Escape"&&a()};o.useEffect(()=>{if(!e)return;const t=s=>{s.key==="Escape"&&(s.stopPropagation(),a())};return document.addEventListener("keydown",t),()=>document.removeEventListener("keydown",t)},[e,a]);const E=t=>{var s;c.current&&!c.current.contains(t.target)&&(t.stopPropagation(),(s=(r==null?void 0:r.current)||c.current)==null||s.focus())};return o.useEffect(()=>{if(e)return document.addEventListener("focus",E,!0),()=>document.removeEventListener("focus",E,!0)},[e]),o.useEffect(()=>()=>{!e&&g.current&&g.current.focus()},[e]),e?n.createElement("div",{className:`modal-dialog-backdrop${f?" open":""}`},n.createElement("div",{role:"dialog","aria-modal":"true","aria-labelledby":l,"aria-describedby":u,ref:c,className:`modal-dialog${f?" open":""}`,onKeyDown:A,tabIndex:-1},L,n.createElement("button",{type:"button",className:"modal-dialog-close",onClick:a,"aria-label":x.closeDialog},n.createElement("span",{"aria-hidden":"true"},"×")))):null};b.__docgenInfo={description:"",methods:[],displayName:"ModalDialog",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},ariaLabel:{required:!1,tsType:{name:"string"},description:""},ariaDescribedby:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},initialFocusRef:{required:!1,tsType:{name:"ReactRefObject",raw:"React.RefObject<HTMLElement>",elements:[{name:"HTMLElement"}]},description:""},labels:{required:!1,tsType:{name:"ModalDialogLabels"},description:""}}};const N={title:"Components/ModalDialog",component:b,tags:["autodocs"]},k=e=>{const[a,l]=o.useState(e.isOpen??!1);return n.createElement(n.Fragment,null,n.createElement("button",{onClick:()=>l(!0)},"Open modal"),n.createElement(b,{...e,isOpen:a,onClose:()=>l(!1)},n.createElement("h2",{id:"modal-title"},"Modal title"),n.createElement("p",{id:"modal-desc"},"This is a modal dialog. Press Escape or the Close button to dismiss it.")))},m={render:k,args:{ariaLabel:"modal-title",ariaDescribedby:"modal-desc"},play:async({canvasElement:e,step:a})=>{const l=H(e);await a("Trigger opens the modal",async()=>{await y.click(l.getByRole("button",{name:"Open modal"}));const u=await d.findByRole("dialog");await i(u).toHaveAttribute("aria-modal","true"),await i(u).toHaveFocus()}),await a("Escape closes the modal",async()=>{await y.keyboard("{Escape}"),await i(d.queryByRole("dialog")).not.toBeInTheDocument()})}},p={render:k,args:{isOpen:!0,ariaLabel:"modal-title",ariaDescribedby:"modal-desc"},play:async({step:e})=>{await e("Dialog is present and labelled",async()=>{const a=d.getByRole("dialog");await i(a).toHaveAttribute("aria-modal","true"),await i(a).toHaveAttribute("aria-labelledby","modal-title")}),await e("Close button dismisses it",async()=>{await y.click(d.getByRole("button",{name:"Close dialog"})),await i(d.queryByRole("dialog")).not.toBeInTheDocument()})}};var v,D,T;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: Template,
  args: {
    ariaLabel: 'modal-title',
    ariaDescribedby: 'modal-desc'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Trigger opens the modal', async () => {
      await userEvent.click(canvas.getByRole('button', {
        name: 'Open modal'
      }));
      const dialog = await screen.findByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveFocus();
    });
    await step('Escape closes the modal', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  }
}`,...(T=(D=m.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var h,B,R;p.parameters={...p.parameters,docs:{...(h=p.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: Template,
  args: {
    isOpen: true,
    ariaLabel: 'modal-title',
    ariaDescribedby: 'modal-desc'
  },
  play: async ({
    step
  }) => {
    await step('Dialog is present and labelled', async () => {
      const dialog = screen.getByRole('dialog');
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });
    await step('Close button dismisses it', async () => {
      await userEvent.click(screen.getByRole('button', {
        name: 'Close dialog'
      }));
      await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  }
}`,...(R=(B=p.parameters)==null?void 0:B.docs)==null?void 0:R.source}}};const O=["Default","OpenByDefault"];export{m as Default,p as OpenByDefault,O as __namedExportsOrder,N as default};
