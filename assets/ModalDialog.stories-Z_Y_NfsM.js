import{r as s,R as n}from"./index-BXjX_wEA.js";import{within as C,userEvent as g,screen as d,expect as i}from"./index-DgAF9SIF.js";const H={closeDialog:"Close dialog"},b=({isOpen:e,onClose:t,ariaLabelledby:l,ariaDescribedby:m,children:q,initialFocusRef:o,labels:x})=>{const I={...H,...x},c=s.useRef(null),f=s.useRef(null),[w,E]=s.useState(!1);s.useEffect(()=>{var a;if(e){f.current=document.activeElement,(a=(o==null?void 0:o.current)||c.current)==null||a.focus();const r=requestAnimationFrame(()=>E(!0));return()=>cancelAnimationFrame(r)}E(!1)},[e,o]);const y=()=>{const a=f.current;a&&typeof a.focus=="function"&&a.focus(),t()},A=a=>{a.key==="Escape"&&y()};s.useEffect(()=>{if(!e)return;const a=r=>{r.key==="Escape"&&(r.stopPropagation(),y())};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[e,t]);const v=a=>{var r;c.current&&!c.current.contains(a.target)&&(a.stopPropagation(),(r=(o==null?void 0:o.current)||c.current)==null||r.focus())};return s.useEffect(()=>{if(e)return document.addEventListener("focus",v,!0),()=>document.removeEventListener("focus",v,!0)},[e]),e?n.createElement("div",{className:`modal-dialog-backdrop${w?" open":""}`},n.createElement("div",{role:"dialog","aria-modal":"true","aria-labelledby":l,"aria-describedby":m,ref:c,className:`modal-dialog${w?" open":""}`,onKeyDown:A,tabIndex:-1},q,n.createElement("button",{type:"button",className:"modal-dialog-close",onClick:y,"aria-label":I.closeDialog},n.createElement("span",{"aria-hidden":"true"},"×")))):null};b.__docgenInfo={description:"",methods:[],displayName:"ModalDialog",props:{isOpen:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:"ID of the element that labels the dialog (e.g., a heading inside children)."},ariaDescribedby:{required:!1,tsType:{name:"string"},description:"ID of the element that describes the dialog."},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},initialFocusRef:{required:!1,tsType:{name:"ReactRefObject",raw:"React.RefObject<HTMLElement>",elements:[{name:"HTMLElement"}]},description:""},labels:{required:!1,tsType:{name:"ModalDialogLabels"},description:""}}};const N={title:"Components/ModalDialog",component:b,tags:["autodocs"]},L=e=>{const[t,l]=s.useState(e.isOpen??!1);return n.createElement(n.Fragment,null,n.createElement("button",{onClick:()=>l(!0)},"Open modal"),n.createElement(b,{...e,isOpen:t,onClose:()=>l(!1)},n.createElement("h2",{id:"modal-title"},"Modal title"),n.createElement("p",{id:"modal-desc"},"This is a modal dialog. Press Escape or the Close button to dismiss it.")))},u={render:L,args:{ariaLabelledby:"modal-title",ariaDescribedby:"modal-desc"},play:async({canvasElement:e,step:t})=>{const l=C(e);await t("Trigger opens the modal",async()=>{await g.click(l.getByRole("button",{name:"Open modal"}));const m=await d.findByRole("dialog");await i(m).toHaveAttribute("aria-modal","true"),await i(m).toHaveFocus()}),await t("Escape closes the modal",async()=>{await g.keyboard("{Escape}"),await i(d.queryByRole("dialog")).not.toBeInTheDocument()})}},p={render:L,args:{isOpen:!0,ariaLabelledby:"modal-title",ariaDescribedby:"modal-desc"},play:async({step:e})=>{await e("Dialog is present and labelled",async()=>{const t=d.getByRole("dialog");await i(t).toHaveAttribute("aria-modal","true"),await i(t).toHaveAttribute("aria-labelledby","modal-title")}),await e("Close button dismisses it",async()=>{await g.click(d.getByRole("button",{name:"Close dialog"})),await i(d.queryByRole("dialog")).not.toBeInTheDocument()})}};var D,h,T;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: Template,
  args: {
    ariaLabelledby: 'modal-title',
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
}`,...(T=(h=u.parameters)==null?void 0:h.docs)==null?void 0:T.source}}};var B,R,k;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: Template,
  args: {
    isOpen: true,
    ariaLabelledby: 'modal-title',
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
}`,...(k=(R=p.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};const _=["Default","OpenByDefault"];export{u as Default,p as OpenByDefault,_ as __namedExportsOrder,N as default};
