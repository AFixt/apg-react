import{r as l,R as n}from"./index-BXjX_wEA.js";import{within as b,expect as o,userEvent as u}from"./index-DgAF9SIF.js";const h=({title:i,children:t})=>{const[a,e]=l.useState(!1),r=`disclosure-content-${l.useId()}`,d=()=>{e(!a)},y=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),d())};return n.createElement("div",{className:"disclosure-widget"},n.createElement("button",{className:"disclosure-control",onClick:d,onKeyDown:y,"aria-expanded":a,"aria-controls":r},i,n.createElement("span",{className:"indicator","aria-hidden":"true"},a?"▲":"▼")),n.createElement("div",{className:`disclosure-content ${a?"":"hidden"}`,id:r},t))};h.__docgenInfo={description:"",methods:[],displayName:"Disclosure",props:{title:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const E={title:"Components/Disclosure",component:h,tags:["autodocs"]},s={args:{title:"Show more details",children:"Here is additional content that was hidden until the user chose to disclose it."},play:async({canvasElement:i,step:t})=>{const e=b(i).getByRole("button");await t("Starts collapsed",async()=>{await o(e).toHaveAttribute("aria-expanded","false")}),await t("Click expands the content",async()=>{await u.click(e),await o(e).toHaveAttribute("aria-expanded","true")}),await t("Click again collapses the content",async()=>{await u.click(e),await o(e).toHaveAttribute("aria-expanded","false")})}};var p,m,w;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    title: 'Show more details',
    children: 'Here is additional content that was hidden until the user chose to disclose it.'
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await step('Starts collapsed', async () => {
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    });
    await step('Click expands the content', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'true');
    });
    await step('Click again collapses the content', async () => {
      await userEvent.click(button);
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  }
}`,...(w=(m=s.parameters)==null?void 0:m.docs)==null?void 0:w.source}}};const g=["Default"];export{s as Default,g as __namedExportsOrder,E as default};
