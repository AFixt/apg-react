import{r as g,R as i}from"./index-BXjX_wEA.js";import{fn as L,within as b,userEvent as o,expect as s}from"./index-DgAF9SIF.js";const f=({action:a,label:t,shortcutKey:e,ariaDescribedby:n,ariaHaspopup:y,isDisabled:_,isToggleButton:l,toggleState:N})=>{const[m,P]=g.useState(N),O=g.useRef(null),v=r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),w()),e&&r.key===e&&(r.preventDefault(),w())},I=()=>{P(!m),a()},w=()=>{l?I():a()};return g.useEffect(()=>{if(e)return window.addEventListener("keydown",v),()=>{window.removeEventListener("keydown",v)}},[e]),i.createElement("button",{ref:O,className:`button${l?" button-toggle":""}${l&&m?" is-pressed":""}`,"aria-pressed":l?m:void 0,"aria-haspopup":y||void 0,"aria-describedby":n||void 0,disabled:_||void 0,onClick:w,onKeyDown:v},t)};f.__docgenInfo={description:"",methods:[],displayName:"Button",props:{action:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},label:{required:!0,tsType:{name:"string"},description:""},shortcutKey:{required:!1,tsType:{name:"string"},description:""},ariaDescribedby:{required:!1,tsType:{name:"string"},description:""},ariaHaspopup:{required:!1,tsType:{name:"union",raw:'"menu" | "listbox" | "tree" | "grid" | "dialog" | "true"',elements:[{name:"literal",value:'"menu"'},{name:"literal",value:'"listbox"'},{name:"literal",value:'"tree"'},{name:"literal",value:'"grid"'},{name:"literal",value:'"dialog"'},{name:"literal",value:'"true"'}]},description:""},isDisabled:{required:!1,tsType:{name:"boolean"},description:""},isToggleButton:{required:!1,tsType:{name:"boolean"},description:""},toggleState:{required:!1,tsType:{name:"boolean"},description:""}}};const j={title:"Components/Button",component:f,tags:["autodocs"],args:{action:L()}},q=a=>{const[t,e]=g.useState(a.toggleState??!1);return i.createElement("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem",alignItems:"flex-start"}},i.createElement(f,{...a,action:()=>e(n=>!n),toggleState:t,label:t?"Notifications: On":"Notifications: Off"}),i.createElement("span",{style:{fontSize:"0.875rem",color:"#6c757d"}},"Current state: ",i.createElement("strong",null,t?"pressed (on)":"released (off)")))},c={args:{label:"Click me"},play:async({canvasElement:a,args:t,step:e})=>{const y=b(a).getByRole("button",{name:"Click me"});await e("Click invokes the action",async()=>{await o.click(y),await s(t.action).toHaveBeenCalled()})}},u={args:{label:"Disabled",isDisabled:!0},play:async({canvasElement:a,step:t})=>{const n=b(a).getByRole("button");await t("Button is disabled",async()=>{await s(n).toBeDisabled(),await s(n).toHaveAttribute("aria-disabled","true")}),await t("Clicking a disabled button does nothing",async()=>{await o.click(n),await s(n).toBeDisabled()})}},d={render:q,args:{isToggleButton:!0,toggleState:!1},play:async({canvasElement:a,step:t})=>{const e=b(a);await t("Starts unpressed",async()=>{const n=e.getByRole("button");await s(n).toHaveAttribute("aria-pressed","false")}),await t("Click toggles to pressed",async()=>{await o.click(e.getByRole("button")),await s(e.getByRole("button")).toHaveAttribute("aria-pressed","true")}),await t("Click again toggles to unpressed",async()=>{await o.click(e.getByRole("button")),await s(e.getByRole("button")).toHaveAttribute("aria-pressed","false")})}},p={render:q,args:{isToggleButton:!0,toggleState:!0},play:async({canvasElement:a,step:t})=>{const e=b(a);await t("Starts pressed",async()=>{await s(e.getByRole("button")).toHaveAttribute("aria-pressed","true")}),await t("Click toggles to unpressed",async()=>{await o.click(e.getByRole("button")),await s(e.getByRole("button")).toHaveAttribute("aria-pressed","false")}),await t("Click again restores pressed state (matches story name)",async()=>{await o.click(e.getByRole("button")),await s(e.getByRole("button")).toHaveAttribute("aria-pressed","true")})}};var B,k,R;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: 'Click me'
  },
  play: async ({
    canvasElement,
    args,
    step
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Click me'
    });
    await step('Click invokes the action', async () => {
      await userEvent.click(button);
      await expect(args.action).toHaveBeenCalled();
    });
  }
}`,...(R=(k=c.parameters)==null?void 0:k.docs)==null?void 0:R.source}}};var E,C,x;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: 'Disabled',
    isDisabled: true
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await step('Button is disabled', async () => {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute('aria-disabled', 'true');
    });
    await step('Clicking a disabled button does nothing', async () => {
      await userEvent.click(button);
      await expect(button).toBeDisabled();
    });
  }
}`,...(x=(C=u.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var T,D,S;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: ToggleTemplate,
  args: {
    isToggleButton: true,
    toggleState: false
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Starts unpressed', async () => {
      const btn = canvas.getByRole('button');
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });
    await step('Click toggles to pressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
    await step('Click again toggles to unpressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
  }
}`,...(S=(D=d.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var H,A,h;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: ToggleTemplate,
  args: {
    isToggleButton: true,
    toggleState: true
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Starts pressed', async () => {
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
    await step('Click toggles to unpressed', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });
    await step('Click again restores pressed state (matches story name)', async () => {
      await userEvent.click(canvas.getByRole('button'));
      await expect(canvas.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  }
}`,...(h=(A=p.parameters)==null?void 0:A.docs)==null?void 0:h.source}}};const F=["Default","Disabled","Toggle","TogglePressed"];export{c as Default,u as Disabled,d as Toggle,p as TogglePressed,F as __namedExportsOrder,j as default};
