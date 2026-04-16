import{r as h,R as n}from"./index-BXjX_wEA.js";import{within as y,expect as o,userEvent as l}from"./index-DgAF9SIF.js";const m=({title:c,children:t})=>{const[a,e]=h.useState(!1),r=()=>{e(!a)},w=i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),r())};return n.createElement("div",{className:"disclosure-widget"},n.createElement("button",{className:"disclosure-control",onClick:r,onKeyDown:w,"aria-expanded":a,"aria-controls":"disclosure-content"},c,n.createElement("span",{className:"indicator"},a?"▲":"▼")),n.createElement("div",{className:`disclosure-content ${a?"":"hidden"}`,id:"disclosure-content"},t))};m.__docgenInfo={description:"",methods:[],displayName:"Disclosure",props:{title:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const x={title:"Components/Disclosure",component:m,tags:["autodocs"]},s={args:{title:"Show more details",children:"Here is additional content that was hidden until the user chose to disclose it."},play:async({canvasElement:c,step:t})=>{const e=y(c).getByRole("button");await t("Starts collapsed",async()=>{await o(e).toHaveAttribute("aria-expanded","false")}),await t("Click expands the content",async()=>{await l.click(e),await o(e).toHaveAttribute("aria-expanded","true")}),await t("Click again collapses the content",async()=>{await l.click(e),await o(e).toHaveAttribute("aria-expanded","false")})}};var d,u,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(p=(u=s.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const f=["Default"];export{s as Default,f as __namedExportsOrder,x as default};
