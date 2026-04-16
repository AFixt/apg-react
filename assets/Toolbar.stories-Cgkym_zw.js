import{r as b,R as c}from"./index-BXjX_wEA.js";import{within as F,expect as p,userEvent as x}from"./index-DgAF9SIF.js";const E=({label:y,ariaLabelledby:s,orientation:l,children:r})=>{const i=b.Children.toArray(r).filter(Boolean),w=b.useRef([]),[A,f]=b.useState(()=>i.findIndex(e=>{var t;return!((t=e.props)!=null&&t.disabled)})>=0?i.findIndex(e=>{var t;return!((t=e.props)!=null&&t.disabled)}):0),R=e=>{var a;const t=w.current[e];return!!t&&!t.disabled&&!((a=t.getAttribute)!=null&&a.call(t,"aria-disabled"))},u=(e,t)=>{const a=i.length;for(let o=1;o<=a;o++){const n=(e+t*o+a)%a;if(R(n))return n}return e},d=e=>{var t;f(e),(t=w.current[e])==null||t.focus()},H=(e,t)=>{const a=l!=="vertical",o=a?"ArrowRight":"ArrowDown",n=a?"ArrowLeft":"ArrowUp";let v=!0;switch(e.key){case o:d(u(t,1));break;case n:d(u(t,-1));break;case"Home":d(u(-1,1));break;case"End":d(u(i.length,-1));break;default:v=!1}v&&e.preventDefault()};return c.createElement("div",{role:"toolbar","aria-label":s?void 0:y,"aria-labelledby":s,"aria-orientation":l||"horizontal",className:`toolbar toolbar-${l||"horizontal"}`},i.map((e,t)=>b.cloneElement(e,{key:e.key??t,ref:a=>w.current[t]=a,tabIndex:t===A?0:-1,onKeyDown:a=>{var o,n;(n=(o=e.props).onKeyDown)==null||n.call(o,a),a.defaultPrevented||H(a,t)},onFocus:a=>{var o,n;(n=(o=e.props).onFocus)==null||n.call(o,a),f(t)}})))};E.__docgenInfo={description:"",methods:[],displayName:"Toolbar",props:{label:{required:!1,tsType:{name:"string"},description:""},ariaLabelledby:{required:!1,tsType:{name:"string"},description:""},orientation:{required:!1,tsType:{name:"union",raw:'"horizontal" | "vertical"',elements:[{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const D={title:"Components/Toolbar",component:E,tags:["autodocs"]},m={args:{label:"Formatting",children:[c.createElement("button",{key:"b"},"Bold"),c.createElement("button",{key:"i"},"Italic"),c.createElement("button",{key:"u"},"Underline"),c.createElement("button",{key:"l"},"Link")]},play:async({canvasElement:y,step:s})=>{const r=F(y).getAllByRole("button");await s("Only first item is in the tab order",async()=>{await p(r[0]).toHaveAttribute("tabindex","0"),await p(r[1]).toHaveAttribute("tabindex","-1")}),await s("ArrowRight moves focus to next item",async()=>{r[0].focus(),await x.keyboard("{ArrowRight}"),await p(r[1]).toHaveFocus()}),await s("End jumps to last item",async()=>{await x.keyboard("{End}"),await p(r[r.length-1]).toHaveFocus()})}};var h,g,k;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: 'Formatting',
    children: [<button key="b">Bold</button>, <button key="i">Italic</button>, <button key="u">Underline</button>, <button key="l">Link</button>]
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    await step('Only first item is in the tab order', async () => {
      await expect(buttons[0]).toHaveAttribute('tabindex', '0');
      await expect(buttons[1]).toHaveAttribute('tabindex', '-1');
    });
    await step('ArrowRight moves focus to next item', async () => {
      buttons[0].focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(buttons[1]).toHaveFocus();
    });
    await step('End jumps to last item', async () => {
      await userEvent.keyboard('{End}');
      await expect(buttons[buttons.length - 1]).toHaveFocus();
    });
  }
}`,...(k=(g=m.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};const z=["Default"];export{m as Default,z as __namedExportsOrder,D as default};
